![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
```

## Aggregate Functions
```sql
-- 1. Running total MWh per asset in July (date order)
SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
       SUM(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID
                               ORDER BY ep.ProductionDate
                               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunTotal_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 2. 7-reading moving average consumption per meter in July
SELECT mr.MeterID, mr.ReadDate, mr.Consumption_kWh,
       AVG(mr.Consumption_kWh) OVER (PARTITION BY mr.MeterID
                                     ORDER BY mr.ReadDate
                                     ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS MA7_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 3. Customer monthly revenue with running YTD (2025)
SELECT es.CustomerID,
       EOMONTH(es.SaleDate) AS MonthEnd,
       SUM(es.TotalCharge) AS MonthRevenue,
       SUM(SUM(es.TotalCharge)) OVER (PARTITION BY es.CustomerID
                                      ORDER BY EOMONTH(es.SaleDate)
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS YTD_Revenue
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID, EOMONTH(es.SaleDate)
ORDER BY es.CustomerID, MonthEnd;

-- 4. Percent of grid MWh contributed by each asset per day
SELECT ep.ProductionDate, ep.AssetID, ep.EnergyMWh,
       100.0 * ep.EnergyMWh
       / NULLIF(SUM(ep.EnergyMWh) OVER (PARTITION BY ep.ProductionDate), 0) AS Pct_of_Day
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. Average invoice amount per customer with difference from overall avg
SELECT i.CustomerID, i.InvoiceID, i.AmountDue,
       AVG(i.AmountDue) OVER (PARTITION BY i.CustomerID) AS AvgPerCustomer,
       AVG(i.AmountDue) OVER ()                         AS AvgGlobal,
       i.AmountDue - AVG(i.AmountDue) OVER ()          AS DiffFromGlobal
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 6. Cumulative count of invoices per customer by date
SELECT i.CustomerID, i.InvoiceDate, i.InvoiceID,
       COUNT(*) OVER (PARTITION BY i.CustomerID
                      ORDER BY i.InvoiceDate
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS CumInvCount
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 7. Min/Max daily production per asset across July shown on each row
SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
       MIN(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID) AS July_Min_MWh,
       MAX(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID) AS July_Max_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 8. Rolling 30-day sum MWh per asset ending at @RefDate (row-based)
SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
       SUM(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID
                               ORDER BY ep.ProductionDate
                               ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) AS Sum30Rows
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-40,@RefDate) AND @RefDate;

-- 9. Windowed count of payments per customer in July
SELECT i.CustomerID, p.PaymentID, p.PaymentDate,
       COUNT(p.PaymentID) OVER (PARTITION BY i.CustomerID) AS JulyPaymentsPerCustomer
FROM energy_company.Payment p
JOIN energy_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 10. Capacity rank share: asset capacity vs facility total
SELECT f.Name AS Facility, a.AssetID, a.Name AS Asset, a.CapacityMW,
       SUM(a.CapacityMW) OVER (PARTITION BY f.FacilityID) AS FacilityCapacityMW,
       100.0 * a.CapacityMW / NULLIF(SUM(a.CapacityMW) OVER (PARTITION BY f.FacilityID),0) AS PctOfFacility
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID;
```

## ROW_NUMBER()
```sql
-- 1. Latest invoice per customer (pick rn=1)
WITH R AS (
  SELECT i.*, ROW_NUMBER() OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate DESC, i.InvoiceID DESC) AS rn
  FROM energy_company.Invoice i
)
SELECT *
FROM R
WHERE rn = 1;

-- 2. Top 3 daily production rows per asset in July
SELECT *
FROM (
  SELECT ep.*,
         ROW_NUMBER() OVER (PARTITION BY ep.AssetID ORDER BY ep.EnergyMWh DESC, ep.ProductionDate DESC) AS rn
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
) X
WHERE rn <= 3
ORDER BY AssetID, rn;

-- 3. First meter reading in July per meter
SELECT *
FROM (
  SELECT mr.*,
         ROW_NUMBER() OVER (PARTITION BY mr.MeterID ORDER BY mr.ReadDate ASC) AS rn
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
) Y
WHERE rn = 1;

-- 4. Deduplicate customers by Email keeping most recently created
SELECT *
FROM (
  SELECT c.*,
         ROW_NUMBER() OVER (PARTITION BY c.Email ORDER BY c.CreatedAt DESC, c.CustomerID DESC) AS rn
  FROM energy_company.Customer c
) D
WHERE rn = 1;

-- 5. Latest maintenance event per asset
SELECT *
FROM (
  SELECT am.*,
         ROW_NUMBER() OVER (PARTITION BY am.AssetID ORDER BY am.MaintenanceDate DESC, am.MaintenanceID DESC) AS rn
  FROM energy_company.AssetMaintenance am
) L
WHERE rn = 1;

-- 6. Most recent sale per customer
SELECT *
FROM (
  SELECT es.*,
         ROW_NUMBER() OVER (PARTITION BY es.CustomerID ORDER BY es.SaleDate DESC, es.SaleID DESC) AS rn
  FROM energy_company.EnergySale es
) S
WHERE rn = 1;

-- 7. First asset per facility by name
SELECT *
FROM (
  SELECT a.*, ROW_NUMBER() OVER (PARTITION BY a.FacilityID ORDER BY a.Name) AS rn
  FROM energy_company.Asset a
) F
WHERE rn = 1;

-- 8. Top 5 customers by unpaid amount (with ROW_NUMBER over order)
SELECT *
FROM (
  SELECT i.CustomerID, SUM(i.AmountDue) AS UnpaidTotal,
         ROW_NUMBER() OVER (ORDER BY SUM(i.AmountDue) DESC) AS rn
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
  GROUP BY i.CustomerID
) T
WHERE rn <= 5;

-- 9. First effective rate plan per month
SELECT *
FROM (
  SELECT rp.RatePlanID, rp.Name, rp.EffectiveDate,
         ROW_NUMBER() OVER (PARTITION BY FORMAT(rp.EffectiveDate,'yyyy-MM') ORDER BY rp.EffectiveDate) AS rn
  FROM energy_company.RatePlan rp
) R
WHERE rn = 1;

-- 10. Earliest commissioned asset per asset type
SELECT *
FROM (
  SELECT a.AssetID, a.AssetTypeID, a.Name, a.CommissionDate,
         ROW_NUMBER() OVER (PARTITION BY a.AssetTypeID ORDER BY a.CommissionDate ASC, a.AssetID) AS rn
  FROM energy_company.Asset a
) E
WHERE rn = 1;
```

## RANK()
```sql
-- 1. Rank customers by total 2025 revenue (ties share same rank)
SELECT es.CustomerID,
       SUM(es.TotalCharge) AS Revenue2025,
       RANK() OVER (ORDER BY SUM(es.TotalCharge) DESC) AS RevRank
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID
ORDER BY RevRank;

-- 2. Rank assets by total July MWh
SELECT ep.AssetID, SUM(ep.EnergyMWh) AS July_MWh,
       RANK() OVER (ORDER BY SUM(ep.EnergyMWh) DESC) AS Rnk
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.AssetID
ORDER BY Rnk;

-- 3. Per-facility rank of asset capacities
SELECT f.Name AS Facility, a.AssetID, a.CapacityMW,
       RANK() OVER (PARTITION BY f.FacilityID ORDER BY a.CapacityMW DESC) AS CapRank
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID;

-- 4. Monthly day rank by grid production (which day was most productive)
SELECT ProductionDate, SUM(EnergyMWh) AS GridMWh,
       RANK() OVER (ORDER BY SUM(EnergyMWh) DESC) AS DayRank
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ProductionDate
ORDER BY DayRank;

-- 5. Rank cities by July average consumption
SELECT a.City, AVG(mr.Consumption_kWh) AS AvgJuly_kWh,
       RANK() OVER (ORDER BY AVG(mr.Consumption_kWh) DESC) AS CityRank
FROM energy_company.MeterReading mr
JOIN energy_company.Meter m    ON m.MeterID = mr.MeterID
JOIN energy_company.Customer c ON c.CustomerID = m.CustomerID
JOIN energy_company.Address a  ON a.AddressID = c.AddressID
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY a.City
ORDER BY CityRank;

-- 6. Rank plans by 2025 revenue
SELECT rp.Name, SUM(es.TotalCharge) AS Revenue2025,
       RANK() OVER (ORDER BY SUM(es.TotalCharge) DESC) AS PlanRank
FROM energy_company.RatePlan rp
JOIN energy_company.EnergySale es ON es.RatePlanID = rp.RatePlanID
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY rp.Name
ORDER BY PlanRank;

-- 7. Per-customer rank of invoices by AmountDue (largest first)
SELECT i.CustomerID, i.InvoiceID, i.AmountDue,
       RANK() OVER (PARTITION BY i.CustomerID ORDER BY i.AmountDue DESC) AS DueRank
FROM energy_company.Invoice i;

-- 8. Rank assets by most recent maintenance date (newest first)
SELECT a.AssetID, MAX(am.MaintenanceDate) AS LastMaint,
       RANK() OVER (ORDER BY MAX(am.MaintenanceDate) DESC) AS MaintRank
FROM energy_company.Asset a
LEFT JOIN energy_company.AssetMaintenance am ON am.AssetID = a.AssetID
GROUP BY a.AssetID
ORDER BY MaintRank;

-- 9. Rank departments by count of facilities
SELECT d.Name AS Department, COUNT(*) AS FacilityCount,
       RANK() OVER (ORDER BY COUNT(*) DESC) AS DeptRank
FROM energy_company.Facility f
JOIN energy_company.Department d ON d.DepartmentID = f.DepartmentID
GROUP BY d.Name
ORDER BY DeptRank;

-- 10. Rank customers by number of payments in July
SELECT i.CustomerID, COUNT(*) AS PayCntJuly,
       RANK() OVER (ORDER BY COUNT(*) DESC) AS Rnk
FROM energy_company.Payment p
JOIN energy_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY i.CustomerID
ORDER BY Rnk;
```

## DENSE_RANK()
```sql
-- 1. Dense rank assets by July total MWh
SELECT ep.AssetID, SUM(ep.EnergyMWh) AS July_MWh,
       DENSE_RANK() OVER (ORDER BY SUM(ep.EnergyMWh) DESC) AS DRnk
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.AssetID
ORDER BY DRnk;

-- 2. Dense rank customers by 2025 kWh sold
SELECT es.CustomerID, SUM(es.kWhSold) AS kWh2025,
       DENSE_RANK() OVER (ORDER BY SUM(es.kWhSold) DESC) AS DRnk
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY es.CustomerID
ORDER BY DRnk;

-- 3. Dense rank facilities by number of assets
SELECT f.FacilityID, f.Name, COUNT(*) AS AssetCount,
       DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) AS FacDRank
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID
GROUP BY f.FacilityID, f.Name
ORDER BY FacDRank;

-- 4. Dense rank rate plans by price
SELECT rp.RatePlanID, rp.Name, rp.PricePerkWh,
       DENSE_RANK() OVER (ORDER BY rp.PricePerkWh DESC) AS PriceDRank
FROM energy_company.RatePlan rp;

-- 5. Dense rank maintenance costs by asset (max cost)
SELECT am.AssetID, MAX(am.CostUSD) AS MaxCost,
       DENSE_RANK() OVER (ORDER BY MAX(am.CostUSD) DESC) AS CostDRank
FROM energy_company.AssetMaintenance am
GROUP BY am.AssetID
ORDER BY CostDRank;

-- 6. Dense rank customers by open unpaid total
SELECT i.CustomerID, SUM(i.AmountDue) AS Unpaid,
       DENSE_RANK() OVER (ORDER BY SUM(i.AmountDue) DESC) AS DRnk
FROM energy_company.Invoice i
WHERE i.Status = 'Open'
GROUP BY i.CustomerID
ORDER BY DRnk;

-- 7. Dense rank cities by average July consumption
SELECT a.City, AVG(mr.Consumption_kWh) AS AvgJuly,
       DENSE_RANK() OVER (ORDER BY AVG(mr.Consumption_kWh) DESC) AS CityDR
FROM energy_company.MeterReading mr
JOIN energy_company.Meter m    ON m.MeterID = mr.MeterID
JOIN energy_company.Customer c ON c.CustomerID = m.CustomerID
JOIN energy_company.Address a  ON a.AddressID = c.AddressID
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY a.City
ORDER BY CityDR;

-- 8. Dense rank assets by capacity within facility
SELECT f.Name AS Facility, a.AssetID, a.CapacityMW,
       DENSE_RANK() OVER (PARTITION BY f.FacilityID ORDER BY a.CapacityMW DESC) AS DR_Cap
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID;

-- 9. Dense rank days by grid MWh (descending)
SELECT ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh,
       DENSE_RANK() OVER (ORDER BY SUM(ep.EnergyMWh) DESC) AS DayDR
FROM energy_company.EnergyProduction ep
GROUP BY ep.ProductionDate
ORDER BY DayDR;

-- 10. Dense rank invoices by AmountDue per customer
SELECT i.CustomerID, i.InvoiceID, i.AmountDue,
       DENSE_RANK() OVER (PARTITION BY i.CustomerID ORDER BY i.AmountDue DESC) AS DueDR
FROM energy_company.Invoice i;
```

## NTILE(n)
```sql
-- 1. Quartiles of assets by July total MWh
SELECT q.AssetID, q.July_MWh,
       NTILE(4) OVER (ORDER BY q.July_MWh DESC) AS Quartile
FROM (
  SELECT ep.AssetID, SUM(ep.EnergyMWh) AS July_MWh
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY ep.AssetID
) q
ORDER BY Quartile;

-- 2. Deciles of customers by 2025 revenue
SELECT c.CustomerID, c.Revenue2025,
       NTILE(10) OVER (ORDER BY c.Revenue2025 DESC) AS Decile
FROM (
  SELECT es.CustomerID, SUM(es.TotalCharge) AS Revenue2025
  FROM energy_company.EnergySale es
  WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
  GROUP BY es.CustomerID
) c
ORDER BY Decile;

-- 3. Quintiles of facilities by asset count
SELECT f.FacilityID, f.AssetCount,
       NTILE(5) OVER (ORDER BY f.AssetCount DESC) AS Quintile
FROM (
  SELECT a.FacilityID, COUNT(*) AS AssetCount
  FROM energy_company.Asset a
  GROUP BY a.FacilityID
) f
ORDER BY Quintile;

-- 4. Tertiles of meters by July total consumption
SELECT s.MeterID, s.July_kWh,
       NTILE(3) OVER (ORDER BY s.July_kWh DESC) AS Tertile
FROM (
  SELECT mr.MeterID, SUM(mr.Consumption_kWh) AS July_kWh
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY mr.MeterID
) s
ORDER BY Tertile;

-- 5. Quartiles of assets by capacity within facility
SELECT f.Name AS Facility, a.AssetID, a.CapacityMW,
       NTILE(4) OVER (PARTITION BY f.FacilityID ORDER BY a.CapacityMW DESC) AS CapQuartile
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID;

-- 6. Deciles of customers by unpaid open amount
SELECT x.CustomerID, x.Unpaid,
       NTILE(10) OVER (ORDER BY x.Unpaid DESC) AS UnpaidDecile
FROM (
  SELECT i.CustomerID, SUM(i.AmountDue) AS Unpaid
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
  GROUP BY i.CustomerID
) x
ORDER BY UnpaidDecile;

-- 7. Quartiles of days by grid MWh in July
SELECT d.ProductionDate, d.GridMWh,
       NTILE(4) OVER (ORDER BY d.GridMWh DESC) AS Quartile
FROM (
  SELECT ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY ep.ProductionDate
) d
ORDER BY Quartile;

-- 8. Quintiles of rate plans by 2025 revenue
SELECT r.RatePlanID, r.Revenue2025,
       NTILE(5) OVER (ORDER BY r.Revenue2025 DESC) AS Quintile
FROM (
  SELECT es.RatePlanID, SUM(es.TotalCharge) AS Revenue2025
  FROM energy_company.EnergySale es
  WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
  GROUP BY es.RatePlanID
) r
ORDER BY Quintile;

-- 9. Quartiles of maintenance cost per asset (last year)
SELECT m.AssetID, m.Cost1Y,
       NTILE(4) OVER (ORDER BY m.Cost1Y DESC) AS CostQuartile
FROM (
  SELECT am.AssetID, SUM(am.CostUSD) AS Cost1Y
  FROM energy_company.AssetMaintenance am
  WHERE am.MaintenanceDate BETWEEN DATEADD(YEAR,-1,@RefDate) AND @RefDate
  GROUP BY am.AssetID
) m
ORDER BY CostQuartile;

-- 10. Quartiles of invoices by AmountDue per customer
SELECT i.CustomerID, i.InvoiceID, i.AmountDue,
       NTILE(4) OVER (PARTITION BY i.CustomerID ORDER BY i.AmountDue DESC) AS DueQuartile
FROM energy_company.Invoice i;
```

## LAG()
```sql
-- 1. Day-over-day change in consumption per meter (July)
SELECT mr.MeterID, mr.ReadDate, mr.Consumption_kWh,
       LAG(mr.Consumption_kWh, 1) OVER (PARTITION BY mr.MeterID ORDER BY mr.ReadDate) AS Prev_kWh,
       mr.Consumption_kWh - LAG(mr.Consumption_kWh, 1) OVER (PARTITION BY mr.MeterID ORDER BY mr.ReadDate) AS Delta_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 2. Production change vs previous day per asset
SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
       LAG(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID ORDER BY ep.ProductionDate) AS Prev_MWh,
       ep.EnergyMWh - LAG(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID ORDER BY ep.ProductionDate) AS Delta_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate;

-- 3. Invoice amount change from prior invoice per customer
SELECT i.CustomerID, i.InvoiceID, i.InvoiceDate, i.AmountDue,
       LAG(i.AmountDue) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate, i.InvoiceID) AS PrevAmount,
       i.AmountDue - LAG(i.AmountDue) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate, i.InvoiceID) AS DiffAmount
FROM energy_company.Invoice i;

-- 4. Days since last maintenance event per asset
SELECT am.AssetID, am.MaintenanceID, am.MaintenanceDate,
       DATEDIFF(DAY, LAG(am.MaintenanceDate) OVER (PARTITION BY am.AssetID ORDER BY am.MaintenanceDate), am.MaintenanceDate) AS DaysSincePrev
FROM energy_company.AssetMaintenance am;

-- 5. Rate plan change detection per customer (by sale month)
WITH S AS (
  SELECT es.CustomerID, EOMONTH(es.SaleDate) AS MonthEnd, es.RatePlanID
  FROM energy_company.EnergySale es
)
SELECT s.CustomerID, s.MonthEnd, s.RatePlanID,
       LAG(s.RatePlanID) OVER (PARTITION BY s.CustomerID ORDER BY s.MonthEnd) AS PrevPlanID,
       CASE WHEN LAG(s.RatePlanID) OVER (PARTITION BY s.CustomerID ORDER BY s.MonthEnd) <> s.RatePlanID THEN 1 ELSE 0 END AS PlanChanged
FROM S s;

-- 6. Payment gap (days) since previous payment per customer
SELECT i.CustomerID, p.PaymentID, p.PaymentDate,
       DATEDIFF(DAY, LAG(p.PaymentDate) OVER (PARTITION BY i.CustomerID ORDER BY p.PaymentDate), p.PaymentDate) AS DaysGap
FROM energy_company.Payment p
JOIN energy_company.Invoice i ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate;

-- 7. Consumption spike flag (> 200 kWh jump)
SELECT mr.MeterID, mr.ReadDate, mr.Consumption_kWh,
       CASE WHEN mr.Consumption_kWh - LAG(mr.Consumption_kWh) OVER (PARTITION BY mr.MeterID ORDER BY mr.ReadDate) > 200
            THEN 1 ELSE 0 END AS Spike
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 8. Rolling min vs previous value per asset
SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
       MIN(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID
                               ORDER BY ep.ProductionDate
                               ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS Min_Upto_Prev
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 9. Detect invoice date gaps > 31 days per customer
SELECT i.CustomerID, i.InvoiceDate,
       DATEDIFF(DAY, LAG(i.InvoiceDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate), i.InvoiceDate) AS GapDays
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 10. Delta of monthly kWh per customer (month-over-month)
WITH M AS (
  SELECT es.CustomerID, EOMONTH(es.SaleDate) AS MonthEnd, SUM(es.kWhSold) AS kWh
  FROM energy_company.EnergySale es
  WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
  GROUP BY es.CustomerID, EOMONTH(es.SaleDate)
)
SELECT M.*, M.kWh - LAG(M.kWh) OVER (PARTITION BY M.CustomerID ORDER BY M.MonthEnd) AS MoM_Change
FROM M;
```

## LEAD()
```sql
-- 1. Next invoice date per customer
SELECT i.CustomerID, i.InvoiceDate,
       LEAD(i.InvoiceDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate) AS NextInvoiceDate
FROM energy_company.Invoice i;

-- 2. Next payment date for each payment (per customer)
SELECT i.CustomerID, p.PaymentID, p.PaymentDate,
       LEAD(p.PaymentDate) OVER (PARTITION BY i.CustomerID ORDER BY p.PaymentDate) AS NextPaymentDate
FROM energy_company.Payment p
JOIN energy_company.Invoice i ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate;

-- 3. Next maintenance date per asset
SELECT am.AssetID, am.MaintenanceID, am.MaintenanceDate,
       LEAD(am.MaintenanceDate) OVER (PARTITION BY am.AssetID ORDER BY am.MaintenanceDate) AS NextMaint
FROM energy_company.AssetMaintenance am;

-- 4. Days to next reading per meter
SELECT mr.MeterID, mr.ReadDate,
       DATEDIFF(DAY, mr.ReadDate,
                LEAD(mr.ReadDate) OVER (PARTITION BY mr.MeterID ORDER BY mr.ReadDate)) AS DaysToNext
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. Next month’s kWh per customer (for % change calc)
WITH M AS (
  SELECT es.CustomerID, EOMONTH(es.SaleDate) AS MonthEnd, SUM(es.kWhSold) AS kWh
  FROM energy_company.EnergySale es
  GROUP BY es.CustomerID, EOMONTH(es.SaleDate)
)
SELECT M.*,
       LEAD(M.kWh) OVER (PARTITION BY M.CustomerID ORDER BY M.MonthEnd) AS Next_kWh
FROM M;

-- 6. Sales row with comparison to next sale amount (per customer)
SELECT es.CustomerID, es.SaleDate, es.TotalCharge,
       LEAD(es.TotalCharge) OVER (PARTITION BY es.CustomerID ORDER BY es.SaleDate, es.SaleID) AS NextTotalCharge
FROM energy_company.EnergySale es;

-- 7. Invoice → Next DueDate (should be next invoice’s due date)
SELECT i.CustomerID, i.InvoiceDate, i.DueDate,
       LEAD(i.DueDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate) AS NextDueDate
FROM energy_company.Invoice i;

-- 8. Asset production with next day MWh for delta
SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
       LEAD(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID ORDER BY ep.ProductionDate) AS Next_MWh
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 9. Meter reading with next consumption to compute forward diff
SELECT mr.MeterID, mr.ReadDate, mr.Consumption_kWh,
       LEAD(mr.Consumption_kWh) OVER (PARTITION BY mr.MeterID ORDER BY mr.ReadDate) AS Next_kWh
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 10. Maintenance cost compared to next maintenance cost
SELECT am.AssetID, am.MaintenanceDate, am.CostUSD,
       LEAD(am.CostUSD) OVER (PARTITION BY am.AssetID ORDER BY am.MaintenanceDate) AS NextCost
FROM energy_company.AssetMaintenance am;
```

## FIRST_VALUE()
```sql
-- 1. First invoice date per customer (display on each row)
SELECT i.CustomerID, i.InvoiceID, i.InvoiceDate,
       FIRST_VALUE(i.InvoiceDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate
                                        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstInvDate
FROM energy_company.Invoice i;

-- 2. First sale month per customer (EOMONTH)
WITH M AS (
  SELECT es.CustomerID, EOMONTH(es.SaleDate) AS MonthEnd, SUM(es.TotalCharge) AS Rev
  FROM energy_company.EnergySale es
  GROUP BY es.CustomerID, EOMONTH(es.SaleDate)
)
SELECT M.*,
       FIRST_VALUE(M.MonthEnd) OVER (PARTITION BY M.CustomerID ORDER BY M.MonthEnd
                                     ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstMonth
FROM M;

-- 3. First maintenance date per asset
SELECT am.AssetID, am.MaintenanceDate,
       FIRST_VALUE(am.MaintenanceDate) OVER (PARTITION BY am.AssetID ORDER BY am.MaintenanceDate
                                             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstMaint
FROM energy_company.AssetMaintenance am;

-- 4. First production date per asset in July
SELECT ep.AssetID, ep.ProductionDate,
       FIRST_VALUE(ep.ProductionDate) OVER (PARTITION BY ep.AssetID ORDER BY ep.ProductionDate
                                            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstJulyProd
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. First rate plan effective overall
SELECT rp.RatePlanID, rp.Name, rp.EffectiveDate,
       FIRST_VALUE(rp.RatePlanID) OVER (ORDER BY rp.EffectiveDate
                                        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstPlanID
FROM energy_company.RatePlan rp;

-- 6. First meter installation date per customer
SELECT m.CustomerID, m.MeterID, m.InstallationDate,
       FIRST_VALUE(m.InstallationDate) OVER (PARTITION BY m.CustomerID ORDER BY m.InstallationDate
                                             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstInstall
FROM energy_company.Meter m;

-- 7. First asset commission date per facility
SELECT a.FacilityID, a.AssetID, a.CommissionDate,
       FIRST_VALUE(a.CommissionDate) OVER (PARTITION BY a.FacilityID ORDER BY a.CommissionDate
                                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstCommission
FROM energy_company.Asset a;

-- 8. First payment date per customer in 2025
SELECT i.CustomerID, p.PaymentID, p.PaymentDate,
       FIRST_VALUE(p.PaymentDate) OVER (PARTITION BY i.CustomerID ORDER BY p.PaymentDate
                                        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstPay2025
FROM energy_company.Payment p
JOIN energy_company.Invoice i ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 9. First occurrence of maximum daily MWh per asset in July (tie-breaking by date)
WITH J AS (
  SELECT ep.AssetID, ep.ProductionDate, ep.EnergyMWh,
         MAX(ep.EnergyMWh) OVER (PARTITION BY ep.AssetID) AS MaxJuly
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
)
SELECT J.*,
       FIRST_VALUE(J.ProductionDate) OVER (PARTITION BY J.AssetID ORDER BY CASE WHEN J.EnergyMWh=J.MaxJuly THEN 0 ELSE 1 END, J.ProductionDate
                                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstDateOfMax
FROM J;

-- 10. First open invoice date per customer
SELECT i.CustomerID, i.InvoiceID, i.InvoiceDate, i.Status,
       FIRST_VALUE(i.InvoiceDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate
                                        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstInvDatePerCust
FROM energy_company.Invoice i
WHERE i.Status = 'Open';
```

## LAST_VALUE()
```sql
-- 1. Last invoice date per customer (broadcast to each row)
SELECT i.CustomerID, i.InvoiceID, i.InvoiceDate,
       LAST_VALUE(i.InvoiceDate) OVER (PARTITION BY i.CustomerID
                                       ORDER BY i.InvoiceDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastInvDate
FROM energy_company.Invoice i;

-- 2. Last payment date per customer
SELECT i.CustomerID, p.PaymentID, p.PaymentDate,
       LAST_VALUE(p.PaymentDate) OVER (PARTITION BY i.CustomerID
                                       ORDER BY p.PaymentDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastPayDate
FROM energy_company.Payment p
JOIN energy_company.Invoice i ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate;

-- 3. Last maintenance date per asset
SELECT am.AssetID, am.MaintenanceID, am.MaintenanceDate,
       LAST_VALUE(am.MaintenanceDate) OVER (PARTITION BY am.AssetID
                                            ORDER BY am.MaintenanceDate
                                            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastMaint
FROM energy_company.AssetMaintenance am;

-- 4. Last production date per asset in July
SELECT ep.AssetID, ep.ProductionDate,
       LAST_VALUE(ep.ProductionDate) OVER (PARTITION BY ep.AssetID
                                           ORDER BY ep.ProductionDate
                                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastJulyProd
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. Last month with sales per customer (EOMONTH)
WITH M AS (
  SELECT es.CustomerID, EOMONTH(es.SaleDate) AS MonthEnd, SUM(es.TotalCharge) AS Rev
  FROM energy_company.EnergySale es
  GROUP BY es.CustomerID, EOMONTH(es.SaleDate)
)
SELECT M.*,
       LAST_VALUE(M.MonthEnd) OVER (PARTITION BY M.CustomerID ORDER BY M.MonthEnd
                                    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastMonth
FROM M;

-- 6. Last effective rate plan overall
SELECT rp.RatePlanID, rp.Name, rp.EffectiveDate,
       LAST_VALUE(rp.RatePlanID) OVER (ORDER BY rp.EffectiveDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastPlanID
FROM energy_company.RatePlan rp;

-- 7. Last meter install date per customer
SELECT m.CustomerID, m.MeterID, m.InstallationDate,
       LAST_VALUE(m.InstallationDate) OVER (PARTITION BY m.CustomerID
                                            ORDER BY m.InstallationDate
                                            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastInstall
FROM energy_company.Meter m;

-- 8. Last (max) AmountDue per customer shown on each invoice row
SELECT i.CustomerID, i.InvoiceID, i.AmountDue,
       LAST_VALUE(i.AmountDue) OVER (PARTITION BY i.CustomerID
                                     ORDER BY i.AmountDue
                                     ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS MaxDuePerCust
FROM energy_company.Invoice i;

-- 9. Last (latest) commission date per facility
SELECT a.FacilityID, a.AssetID, a.CommissionDate,
       LAST_VALUE(a.CommissionDate) OVER (PARTITION BY a.FacilityID
                                          ORDER BY a.CommissionDate
                                          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastCommission
FROM energy_company.Asset a;

-- 10. Last grid production day in July (broadcast)
SELECT ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh,
       LAST_VALUE(ep.ProductionDate) OVER (ORDER BY ep.ProductionDate
                                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastDayInJuly
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY ep.ProductionDate
ORDER BY ep.ProductionDate;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
