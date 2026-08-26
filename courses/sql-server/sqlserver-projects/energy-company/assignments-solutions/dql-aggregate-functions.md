![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
```

## Count
```sql
-- 1. Total number of customers
SELECT COUNT(*) AS TotalCustomers
FROM energy_company.Customer;

-- 2. Number of facilities per department
SELECT d.Name AS Department, COUNT(*) AS FacilityCount
FROM energy_company.Facility f
JOIN energy_company.Department d ON d.DepartmentID = f.DepartmentID
GROUP BY d.Name
ORDER BY FacilityCount DESC;

-- 3. Distinct number of cities with at least one customer
SELECT COUNT(DISTINCT a.City) AS DistinctCustomerCities
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID;

-- 4. Assets per status
SELECT Status, COUNT(*) AS AssetCount
FROM energy_company.Asset
GROUP BY Status
ORDER BY AssetCount DESC;

-- 5. Production rows recorded in July 2025
SELECT COUNT(*) AS JulyProductionRows
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 6. Number of meters per customer (expect ~1)
SELECT m.CustomerID, COUNT(*) AS MeterCount
FROM energy_company.Meter m
GROUP BY m.CustomerID
ORDER BY MeterCount DESC, m.CustomerID;

-- 7. Invoices per status
SELECT Status, COUNT(*) AS InvoiceCount
FROM energy_company.Invoice
GROUP BY Status
ORDER BY InvoiceCount DESC;

-- 8. Payments per method in 2025
SELECT COALESCE(PaymentMethod,'Unknown') AS PaymentMethod, COUNT(*) AS Cnt
FROM energy_company.Payment
WHERE PaymentDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY COALESCE(PaymentMethod,'Unknown')
ORDER BY Cnt DESC;

-- 9. Maintenance events in the last 180 days
SELECT COUNT(*) AS MaintEvents_180d
FROM energy_company.AssetMaintenance
WHERE MaintenanceDate BETWEEN DATEADD(DAY,-180,@RefDate) AND @RefDate;

-- 10. Energy sales count per rate plan in 2025
SELECT es.RatePlanID, COUNT(*) AS SalesCount2025
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.RatePlanID
ORDER BY SalesCount2025 DESC;

-- 11. Days produced (distinct dates) per asset in last 30 days
SELECT ep.AssetID, COUNT(DISTINCT ep.ProductionDate) AS ProducedDays_30d
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate
GROUP BY ep.AssetID
ORDER BY ProducedDays_30d DESC;

-- 12. Number of customers with at least one open invoice
SELECT COUNT(DISTINCT i.CustomerID) AS CustomersWithOpenInvoices
FROM energy_company.Invoice i
WHERE i.Status = 'Open';
```

## Sum
```sql
-- 1. Total 2025 revenue (sum of TotalCharge)
SELECT SUM(es.TotalCharge) AS Revenue2025
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 2. kWh sold per customer in last 6 months
SELECT es.CustomerID, SUM(es.kWhSold) AS kWh_6mo
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN DATEADD(MONTH,-6,@RefDate) AND @RefDate
GROUP BY es.CustomerID
ORDER BY kWh_6mo DESC;

-- 3. Total unpaid (sum AmountDue) for open invoices
SELECT SUM(i.AmountDue) AS TotalUnpaid
FROM energy_company.Invoice i
WHERE i.Status = 'Open';

-- 4. Amount paid per method
SELECT COALESCE(p.PaymentMethod,'Unknown') AS PaymentMethod, SUM(p.AmountPaid) AS TotalPaid
FROM energy_company.Payment p
GROUP BY COALESCE(p.PaymentMethod,'Unknown')
ORDER BY TotalPaid DESC;

-- 5. Total MWh per asset in July 2025
SELECT ep.AssetID, SUM(ep.EnergyMWh) AS July_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.AssetID
ORDER BY July_MWh DESC;

-- 6. Total consumption per meter in July 2025
SELECT mr.MeterID, SUM(mr.Consumption_kWh) AS July_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY mr.MeterID
ORDER BY July_kWh DESC;

-- 7. Maintenance cost per asset in the last year
SELECT am.AssetID, SUM(am.CostUSD) AS CostLastYear
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN DATEADD(YEAR,-1,@RefDate) AND @RefDate
GROUP BY am.AssetID
ORDER BY CostLastYear DESC;

-- 8. Grid daily total production (sum across all assets)
SELECT ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh
FROM energy_company.EnergyProduction ep
GROUP BY ep.ProductionDate
ORDER BY ep.ProductionDate DESC;

-- 9. 2025 revenue per rate plan
SELECT es.RatePlanID, SUM(es.TotalCharge) AS Revenue2025
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.RatePlanID
ORDER BY Revenue2025 DESC;

-- 10. Unpaid amount per customer (open invoices)
SELECT i.CustomerID, SUM(i.AmountDue) AS UnpaidTotal
FROM energy_company.Invoice i
WHERE i.Status = 'Open'
GROUP BY i.CustomerID
ORDER BY UnpaidTotal DESC;

-- 11. Monthly 2025 kWh totals
SELECT YEAR(es.SaleDate) AS Yr, MONTH(es.SaleDate) AS Mo, SUM(es.kWhSold) AS kWh
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY YEAR(es.SaleDate), MONTH(es.SaleDate)
ORDER BY Yr, Mo;

-- 12. Facility-level production in July (join assets → facility)
SELECT f.FacilityID, f.Name AS Facility, SUM(ep.EnergyMWh) AS July_MWh
FROM energy_company.EnergyProduction ep
JOIN energy_company.Asset a ON a.AssetID = ep.AssetID
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY f.FacilityID, f.Name
ORDER BY July_MWh DESC;
```

## Avg
```sql
-- 1. Average daily consumption per meter (July 2025)
SELECT mr.MeterID, AVG(mr.Consumption_kWh) AS AvgDailyJuly_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY mr.MeterID
ORDER BY AvgDailyJuly_kWh DESC;

-- 2. Average daily production per asset (July 2025)
SELECT ep.AssetID, AVG(ep.EnergyMWh) AS AvgDailyJuly_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.AssetID
ORDER BY AvgDailyJuly_MWh DESC;

-- 3. Average sale amount per customer (2025)
SELECT es.CustomerID, AVG(es.TotalCharge) AS AvgSale2025
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID
ORDER BY AvgSale2025 DESC;

-- 4. Average PricePerkWh of plans effective on 2025-07-01
SELECT AVG(rp.PricePerkWh) AS AvgPrice_2025_07_01
FROM energy_company.RatePlan rp
WHERE rp.EffectiveDate <= '2025-07-01'
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-07-01');

-- 5. Average AmountDue per invoice status
SELECT i.Status, AVG(i.AmountDue) AS AvgDue
FROM energy_company.Invoice i
GROUP BY i.Status
ORDER BY AvgDue DESC;

-- 6. Average days-to-pay (invoice → payment) overall
SELECT AVG(DATEDIFF(DAY, i.InvoiceDate, p.PaymentDate)*1.0) AS AvgSettlementDays
FROM energy_company.Payment p
JOIN energy_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate;

-- 7. Average asset capacity by asset type
SELECT t.Name AS AssetType, AVG(a.CapacityMW) AS AvgCapacityMW
FROM energy_company.Asset a
JOIN energy_company.AssetType t ON t.AssetTypeID = a.AssetTypeID
GROUP BY t.Name
ORDER BY AvgCapacityMW DESC;

-- 8. Average monthly kWh sold per customer (2025)
SELECT es.CustomerID, AVG(es.kWhSold) AS AvgMonthly_kWh
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID
ORDER BY AvgMonthly_kWh DESC;

-- 9. Average maintenance cost per description type (last year)
SELECT am.Description, AVG(am.CostUSD) AS AvgCost1Y
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN DATEADD(YEAR,-1,@RefDate) AND @RefDate
GROUP BY am.Description
ORDER BY AvgCost1Y DESC;

-- 10. Average production across assets for each day in July
SELECT ep.ProductionDate, AVG(ep.EnergyMWh) AS AvgPerAsset_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.ProductionDate
ORDER BY ep.ProductionDate;

-- 11. 30-day average production per asset (ending @RefDate)
SELECT ep.AssetID, AVG(ep.EnergyMWh) AS Avg_30d_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate
GROUP BY ep.AssetID
ORDER BY Avg_30d_MWh DESC;

-- 12. Average city-level consumption in July (join readings → city)
SELECT a.City, AVG(mr.Consumption_kWh) AS AvgJuly_kWh
FROM energy_company.MeterReading mr
JOIN energy_company.Meter m    ON m.MeterID = mr.MeterID
JOIN energy_company.Customer c ON c.CustomerID = m.CustomerID
JOIN energy_company.Address a  ON a.AddressID = c.AddressID
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY a.City
ORDER BY AvgJuly_kWh DESC;
```

## Max
```sql
-- 1. Maximum invoice AmountDue
SELECT MAX(i.AmountDue) AS MaxAmountDue
FROM energy_company.Invoice i;

-- 2. Maximum daily production per asset (July 2025)
SELECT ep.AssetID, MAX(ep.EnergyMWh) AS MaxDailyJuly_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.AssetID
ORDER BY MaxDailyJuly_MWh DESC;

-- 3. Maximum consumption per meter (July 2025)
SELECT mr.MeterID, MAX(mr.Consumption_kWh) AS MaxJuly_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY mr.MeterID
ORDER BY MaxJuly_kWh DESC;

-- 4. Maximum kWhSold per customer for any month in 2025
SELECT es.CustomerID, MAX(es.kWhSold) AS MaxMonthly_kWh_2025
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID
ORDER BY MaxMonthly_kWh_2025 DESC;

-- 5. Most recent commissioning date per facility
SELECT f.FacilityID, f.Name AS Facility, MAX(a.CommissionDate) AS LatestCommission
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID
GROUP BY f.FacilityID, f.Name
ORDER BY LatestCommission DESC;

-- 6. Latest invoice date per customer
SELECT i.CustomerID, MAX(i.InvoiceDate) AS LatestInvoice
FROM energy_company.Invoice i
GROUP BY i.CustomerID
ORDER BY LatestInvoice DESC;

-- 7. Max payment amount per method
SELECT COALESCE(p.PaymentMethod,'Unknown') AS PaymentMethod, MAX(p.AmountPaid) AS MaxPaid
FROM energy_company.Payment p
GROUP BY COALESCE(p.PaymentMethod,'Unknown')
ORDER BY MaxPaid DESC;

-- 8. Maximum capacity per asset type
SELECT t.Name AS AssetType, MAX(a.CapacityMW) AS MaxCapacityMW
FROM energy_company.Asset a
JOIN energy_company.AssetType t ON t.AssetTypeID = a.AssetTypeID
GROUP BY t.Name
ORDER BY MaxCapacityMW DESC;

-- 9. Max maintenance cost per asset (last year)
SELECT am.AssetID, MAX(am.CostUSD) AS MaxCost1Y
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN DATEADD(YEAR,-1,@RefDate) AND @RefDate
GROUP BY am.AssetID
ORDER BY MaxCost1Y DESC;

-- 10. Most recent production date per asset
SELECT ep.AssetID, MAX(ep.ProductionDate) AS LatestProdDate
FROM energy_company.EnergyProduction ep
GROUP BY ep.AssetID
ORDER BY LatestProdDate DESC;

-- 11. Customer with max invoice count (via subquery)
WITH C AS (
  SELECT i.CustomerID, COUNT(*) AS Cnt
  FROM energy_company.Invoice i
  GROUP BY i.CustomerID
)
SELECT TOP (1) WITH TIES CustomerID, Cnt
FROM C
ORDER BY Cnt DESC;

-- 12. Day with maximum grid MWh
SELECT TOP (1) WITH TIES ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh
FROM energy_company.EnergyProduction ep
GROUP BY ep.ProductionDate
ORDER BY GridMWh DESC;
```

## Min
```sql
-- 1. Earliest asset commission date
SELECT MIN(a.CommissionDate) AS EarliestCommission
FROM energy_company.Asset a;

-- 2. Minimum daily production per asset (July 2025)
SELECT ep.AssetID, MIN(ep.EnergyMWh) AS MinDailyJuly_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.AssetID
ORDER BY MinDailyJuly_MWh;

-- 3. Minimum consumption per meter (July 2025)
SELECT mr.MeterID, MIN(mr.Consumption_kWh) AS MinJuly_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY mr.MeterID
ORDER BY MinJuly_kWh;

-- 4. Minimum monthly kWhSold per customer (2025)
SELECT es.CustomerID, MIN(es.kWhSold) AS MinMonthly_kWh_2025
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID
ORDER BY MinMonthly_kWh_2025;

-- 5. Earliest meter installation per customer
SELECT m.CustomerID, MIN(m.InstallationDate) AS FirstInstall
FROM energy_company.Meter m
GROUP BY m.CustomerID
ORDER BY FirstInstall;

-- 6. Minimum AmountDue among open invoices
SELECT MIN(i.AmountDue) AS MinOpenAmountDue
FROM energy_company.Invoice i
WHERE i.Status = 'Open';

-- 7. Minimum payment amount per method
SELECT COALESCE(p.PaymentMethod,'Unknown') AS PaymentMethod, MIN(p.AmountPaid) AS MinPaid
FROM energy_company.Payment p
GROUP BY COALESCE(p.PaymentMethod,'Unknown')
ORDER BY MinPaid;

-- 8. Oldest maintenance date per asset
SELECT am.AssetID, MIN(am.MaintenanceDate) AS FirstMaint
FROM energy_company.AssetMaintenance am
GROUP BY am.AssetID
ORDER BY FirstMaint;

-- 9. Minimum capacity per facility
SELECT f.FacilityID, f.Name AS Facility, MIN(a.CapacityMW) AS MinCapacityMW
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID
GROUP BY f.FacilityID, f.Name
ORDER BY MinCapacityMW;

-- 10. Earliest sale date per customer
SELECT es.CustomerID, MIN(es.SaleDate) AS FirstSale
FROM energy_company.EnergySale es
GROUP BY es.CustomerID
ORDER BY FirstSale;

-- 11. Earliest invoice in 2025
SELECT MIN(i.InvoiceDate) AS EarliestInvoice2025
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 12. Lowest PricePerkWh among plans effective on 2025-07-01
SELECT MIN(rp.PricePerkWh) AS MinPrice_2025_07_01
FROM energy_company.RatePlan rp
WHERE rp.EffectiveDate <= '2025-07-01'
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-07-01');
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
