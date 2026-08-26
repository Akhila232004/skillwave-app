![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Select
```sql
-- 1. List all regions
SELECT RegionID, Name, Country
FROM oil_n_gas_company.Region;

-- 2. Wells with days since spud
SELECT WellID, Name, WellType, Status, SpudDate,
       DATEDIFF(DAY, SpudDate, @Today) AS DaysSinceSpud
FROM oil_n_gas_company.Well;

-- 3. Fields with their region names
SELECT f.FieldID, f.Name AS FieldName, f.Status,
       r.RegionID, r.Name AS RegionName, r.Country
FROM oil_n_gas_company.Field f
JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID;

-- 4. Production rows in the July window
SELECT ProductionDate, WellID, Oil_bbl, Gas_mcf, Water_bbl
FROM oil_n_gas_company.Production
WHERE ProductionDate BETWEEN @RefStart AND @RefEnd;

-- 5. Shipments with computed revenue (last 30 days)
SELECT ShipmentID, ShipDate, FromFacility, ToCustomer, ProductID,
       Volume_bbl, RatePerBbl,
       CAST(Volume_bbl * RatePerBbl AS decimal(18,2)) AS RevenueUSD
FROM oil_n_gas_company.Shipment
WHERE ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today;

-- 6. Pipelines with capacity in kbbl
SELECT PipelineID, Name, CapacityBbl,
       CAST(CapacityBbl/1000.0 AS decimal(18,2)) AS Capacity_kbbl
FROM oil_n_gas_company.Pipeline;

-- 7. Inventory with facility & product names
SELECT i.SnapshotDate, f.Name AS FacilityName, p.Name AS ProductName, i.Quantity_bbl
FROM oil_n_gas_company.Inventory i
JOIN oil_n_gas_company.Facility f ON f.FacilityID = i.FacilityID
JOIN oil_n_gas_company.Product  p ON p.ProductID  = i.ProductID;

-- 8. Invoices with current balance (AmountDue - total payments)
SELECT i.InvoiceID, i.InvoiceDate, i.CustomerID, i.AmountDue, i.Status,
       i.AmountDue - (
         SELECT COALESCE(SUM(p.AmountPaid),0)
         FROM oil_n_gas_company.Payment p
         WHERE p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
       ) AS BalanceUSD
FROM oil_n_gas_company.Invoice i;

-- 9. Sales contracts with duration (days)
SELECT ContractID, CustomerID, ProductID, StartDate, EndDate,
       DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) AS DurationDays
FROM oil_n_gas_company.SalesContract;

-- 10. Currently active drilling operations with elapsed days
SELECT OperationID, WellID, StartDate, EndDate, Status,
       DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) AS DaysElapsed
FROM oil_n_gas_company.DrillingOperation
WHERE EndDate IS NULL OR EndDate > @Today;

-- 11. Facility label (name + type + location)
SELECT FacilityID, Name + ' (' + FacilityType + ') - ' + COALESCE(Location, '') AS FacilityLabel
FROM oil_n_gas_company.Facility;

-- 12. Customers with city/country
SELECT c.CustomerID, c.Name, a.City, a.Country
FROM oil_n_gas_company.Customer c
LEFT JOIN oil_n_gas_company.Address a ON a.AddressID = c.AddressID;
```

## WHERE
```sql
-- 1. Regions in USA
SELECT RegionID, Name
FROM oil_n_gas_company.Region
WHERE Country = 'USA';

-- 2. Producing wells
SELECT WellID, Name, FieldID
FROM oil_n_gas_company.Well
WHERE Status = 'Producing';

-- 3. Wells spudded before 2020
SELECT WellID, Name, SpudDate
FROM oil_n_gas_company.Well
WHERE SpudDate < '2020-01-01';

-- 4. Fields discovered in the last 5 years
SELECT FieldID, Name, DiscoveryDate
FROM oil_n_gas_company.Field
WHERE DiscoveryDate >= DATEADD(YEAR, -5, @Today);

-- 5. July production rows with Oil_bbl > 100
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE ProductionDate BETWEEN @RefStart AND @RefEnd
  AND Oil_bbl > 100;

-- 6. Shipments for product 'Diesel'
SELECT s.ShipmentID, s.ShipDate, s.Volume_bbl
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product  p ON p.ProductID = s.ProductID
WHERE p.Name = 'Diesel';

-- 7. High-capacity pipelines (> 100,000 bbl/d)
SELECT PipelineID, Name, CapacityBbl
FROM oil_n_gas_company.Pipeline
WHERE CapacityBbl > 100000;

-- 8. Open invoices
SELECT InvoiceID, CustomerID, AmountDue
FROM oil_n_gas_company.Invoice
WHERE Status = 'Open';

-- 9. Payments in last 30 days
SELECT PaymentID, InvoiceID, PaymentDate, AmountPaid
FROM oil_n_gas_company.Payment
WHERE PaymentDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today;

-- 10. Contracts active today
SELECT ContractID, CustomerID, StartDate, EndDate
FROM oil_n_gas_company.SalesContract
WHERE StartDate <= @Today AND (EndDate IS NULL OR EndDate >= @Today);

-- 11. Facilities of type Refinery or Terminal
SELECT FacilityID, Name, FacilityType
FROM oil_n_gas_company.Facility
WHERE FacilityType IN ('Refinery', 'Terminal');

-- 12. Drilling ops that ended in July
SELECT OperationID, WellID, StartDate, EndDate
FROM oil_n_gas_company.DrillingOperation
WHERE EndDate BETWEEN @RefStart AND @RefEnd;
```

## GROUP BY
```sql
-- 1. Field counts per region
SELECT r.RegionID, r.Name AS RegionName, COUNT(f.FieldID) AS FieldCount
FROM oil_n_gas_company.Region r
LEFT JOIN oil_n_gas_company.Field f ON f.RegionID = r.RegionID
GROUP BY r.RegionID, r.Name
ORDER BY FieldCount DESC, r.RegionID;

-- 2. Well counts by type
SELECT WellType, COUNT(*) AS WellCount
FROM oil_n_gas_company.Well
GROUP BY WellType
ORDER BY WellCount DESC;

-- 3. Daily total production (all wells)
SELECT ProductionDate,
       SUM(Oil_bbl)  AS TotalOil_bbl,
       SUM(Gas_mcf)  AS TotalGas_mcf,
       SUM(Water_bbl) AS TotalWater_bbl
FROM oil_n_gas_company.Production
GROUP BY ProductionDate
ORDER BY ProductionDate DESC;

-- 4. July production per well
SELECT WellID,
       SUM(Oil_bbl) AS JulOil_bbl,
       SUM(Gas_mcf) AS JulGas_mcf
FROM oil_n_gas_company.Production
WHERE ProductionDate BETWEEN @RefStart AND @RefEnd
GROUP BY WellID
ORDER BY JulOil_bbl DESC, WellID;

-- 5. Shipment metrics by product (last 30 days)
SELECT p.Name AS Product, 
       SUM(s.Volume_bbl) AS Vol_bbl,
       AVG(s.RatePerBbl) AS AvgRate
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product  p ON p.ProductID = s.ProductID
WHERE s.ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY p.Name
ORDER BY Vol_bbl DESC;

-- 6. Inventory totals by facility & date (last 7 days)
SELECT i.FacilityID, i.SnapshotDate, SUM(i.Quantity_bbl) AS Qty_bbl
FROM oil_n_gas_company.Inventory i
WHERE i.SnapshotDate BETWEEN DATEADD(DAY, -7, @Today) AND @Today
GROUP BY i.FacilityID, i.SnapshotDate
ORDER BY i.SnapshotDate DESC, i.FacilityID;

-- 7. Revenue by customer-month from shipments
SELECT s.ToCustomer AS CustomerID,
       EOMONTH(s.ShipDate) AS InvMonth,
       SUM(CAST(s.Volume_bbl*s.RatePerBbl AS decimal(18,2))) AS RevenueUSD
FROM oil_n_gas_company.Shipment s
GROUP BY s.ToCustomer, EOMONTH(s.ShipDate)
ORDER BY RevenueUSD DESC;

-- 8. Payments per invoice
SELECT p.InvoiceID, p.InvoiceDate, SUM(p.AmountPaid) AS PaidUSD, COUNT(*) AS PaymentCount
FROM oil_n_gas_company.Payment p
GROUP BY p.InvoiceID, p.InvoiceDate
ORDER BY PaidUSD DESC;

-- 9. Pipeline flow totals (last 30 days)
SELECT pf.PipelineID, SUM(pf.Volume_bbl) AS Flow_bbl
FROM oil_n_gas_company.PipelineFlow pf
WHERE pf.FlowDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY pf.PipelineID
ORDER BY Flow_bbl DESC;

-- 10. Maintenance events count by asset type (last 180 days)
SELECT AssetType, COUNT(*) AS EventCount
FROM oil_n_gas_company.AssetMaintenance
WHERE MaintDate >= DATEADD(DAY, -180, @Today)
GROUP BY AssetType
ORDER BY EventCount DESC;

-- 11. Drilling operations count by status
SELECT Status, COUNT(*) AS OpCount
FROM oil_n_gas_company.DrillingOperation
GROUP BY Status
ORDER BY OpCount DESC;

-- 12. Patients? (N/A) ⇒ Customers by country via address
SELECT a.Country, COUNT(*) AS Customers
FROM oil_n_gas_company.Customer c
JOIN oil_n_gas_company.Address  a ON a.AddressID = c.AddressID
GROUP BY a.Country
ORDER BY Customers DESC;
```

## HAVING
```sql
-- 1. Regions with > 10 fields
SELECT r.RegionID, r.Name, COUNT(f.FieldID) AS FieldCount
FROM oil_n_gas_company.Region r
LEFT JOIN oil_n_gas_company.Field f ON f.RegionID = r.RegionID
GROUP BY r.RegionID, r.Name
HAVING COUNT(f.FieldID) > 10
ORDER BY FieldCount DESC;

-- 2. Fields with ≥ 50 wells
SELECT f.FieldID, f.Name, COUNT(w.WellID) AS WellCount
FROM oil_n_gas_company.Field f
LEFT JOIN oil_n_gas_company.Well w ON w.FieldID = f.FieldID
GROUP BY f.FieldID, f.Name
HAVING COUNT(w.WellID) >= 50
ORDER BY WellCount DESC;

-- 3. Wells with July oil > 3,000 bbl
SELECT p.WellID, SUM(p.Oil_bbl) AS JulOil_bbl
FROM oil_n_gas_company.Production p
WHERE p.ProductionDate BETWEEN @RefStart AND @RefEnd
GROUP BY p.WellID
HAVING SUM(p.Oil_bbl) > 3000
ORDER BY JulOil_bbl DESC;

-- 4. Products with revenue > $1,000,000 in last 90 days
SELECT pr.Name AS Product, SUM(CAST(s.Volume_bbl*s.RatePerBbl AS decimal(18,2))) AS RevenueUSD
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product pr ON pr.ProductID = s.ProductID
WHERE s.ShipDate BETWEEN DATEADD(DAY, -90, @Today) AND @Today
GROUP BY pr.Name
HAVING SUM(CAST(s.Volume_bbl*s.RatePerBbl AS decimal(18,2))) > 1000000
ORDER BY RevenueUSD DESC;

-- 5. Customers with unpaid balance > 0
;WITH PaidByInvoice AS (
  SELECT p.InvoiceID, p.InvoiceDate, SUM(p.AmountPaid) AS PaidUSD
  FROM oil_n_gas_company.Payment p
  GROUP BY p.InvoiceID, p.InvoiceDate
)
SELECT i.CustomerID,
       SUM(i.AmountDue) - SUM(COALESCE(pbi.PaidUSD,0)) AS UnpaidUSD
FROM oil_n_gas_company.Invoice i
LEFT JOIN PaidByInvoice pbi ON pbi.InvoiceID = i.InvoiceID AND pbi.InvoiceDate = i.InvoiceDate
GROUP BY i.CustomerID
HAVING SUM(i.AmountDue) - SUM(COALESCE(pbi.PaidUSD,0)) > 0
ORDER BY UnpaidUSD DESC;

-- 6. Pipelines with avg daily flow (last 30d) > 75% of capacity
SELECT pl.PipelineID, pl.Name,
       AVG(pf.Volume_bbl) AS AvgFlow_bbl,
       pl.CapacityBbl
FROM oil_n_gas_company.Pipeline pl
JOIN oil_n_gas_company.PipelineFlow pf ON pf.PipelineID = pl.PipelineID
WHERE pf.FlowDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY pl.PipelineID, pl.Name, pl.CapacityBbl
HAVING AVG(pf.Volume_bbl) > 0.75 * pl.CapacityBbl
ORDER BY AvgFlow_bbl DESC;

-- 7. Facilities with avg inventory > 50,000 bbl (last 30 days)
SELECT i.FacilityID, AVG(i.Quantity_bbl) AS AvgQty
FROM oil_n_gas_company.Inventory i
WHERE i.SnapshotDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY i.FacilityID
HAVING AVG(i.Quantity_bbl) > 50000
ORDER BY AvgQty DESC;

-- 8. Assets (type+id) with maintenance cost > $100k in last 180 days
SELECT AssetType, AssetID, SUM(CostUSD) AS CostUSD
FROM oil_n_gas_company.AssetMaintenance
WHERE MaintDate >= DATEADD(DAY, -180, @Today)
GROUP BY AssetType, AssetID
HAVING SUM(CostUSD) > 100000
ORDER BY CostUSD DESC;

-- 9. Customers with ≥ 5 shipments in last 30 days
SELECT s.ToCustomer AS CustomerID, COUNT(*) AS Shipments
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY s.ToCustomer
HAVING COUNT(*) >= 5
ORDER BY Shipments DESC;

-- 10. Fields with at least 1 producing well
SELECT f.FieldID, f.Name, SUM(CASE WHEN w.Status = 'Producing' THEN 1 ELSE 0 END) AS ProducingWells
FROM oil_n_gas_company.Field f
LEFT JOIN oil_n_gas_company.Well w ON w.FieldID = f.FieldID
GROUP BY f.FieldID, f.Name
HAVING SUM(CASE WHEN w.Status = 'Producing' THEN 1 ELSE 0 END) > 0
ORDER BY ProducingWells DESC;

-- 11. Wells with > 3 drilling operations
SELECT d.WellID, COUNT(*) AS Ops
FROM oil_n_gas_company.DrillingOperation d
GROUP BY d.WellID
HAVING COUNT(*) > 3
ORDER BY Ops DESC;

-- 12. Products shipped to ≥ 10 distinct customers (90 days)
SELECT s.ProductID, COUNT(DISTINCT s.ToCustomer) AS DistCustomers
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate BETWEEN DATEADD(DAY, -90, @Today) AND @Today
GROUP BY s.ProductID
HAVING COUNT(DISTINCT s.ToCustomer) >= 10
ORDER BY DistCustomers DESC;
```

## ORDER BY
```sql
-- 1. Wells ordered by SpudDate (newest first; NULLs last)
SELECT WellID, Name, SpudDate
FROM oil_n_gas_company.Well
ORDER BY CASE WHEN SpudDate IS NULL THEN 1 ELSE 0 END, SpudDate DESC, WellID;

-- 2. Fields ordered by DiscoveryDate then Name
SELECT FieldID, Name, DiscoveryDate
FROM oil_n_gas_company.Field
ORDER BY DiscoveryDate DESC, Name ASC;

-- 3. Regions ordered by Country then Name
SELECT RegionID, Name, Country
FROM oil_n_gas_company.Region
ORDER BY Country, Name;

-- 4. Shipments (last 30d) ordered by Revenue DESC
SELECT ShipmentID, ShipDate, Volume_bbl, RatePerBbl,
       CAST(Volume_bbl * RatePerBbl AS decimal(18,2)) AS RevenueUSD
FROM oil_n_gas_company.Shipment
WHERE ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
ORDER BY RevenueUSD DESC, ShipDate DESC;

-- 5. Pipelines by Capacity DESC
SELECT PipelineID, Name, CapacityBbl
FROM oil_n_gas_company.Pipeline
ORDER BY CapacityBbl DESC, PipelineID;

-- 6. Invoices ordered by Status then AmountDue DESC
SELECT InvoiceID, CustomerID, InvoiceDate, AmountDue, Status
FROM oil_n_gas_company.Invoice
ORDER BY Status, AmountDue DESC;

-- 7. Maintenance events ordered by date & cost
SELECT MaintenanceID, AssetType, AssetID, MaintDate, CostUSD
FROM oil_n_gas_company.AssetMaintenance
ORDER BY MaintDate DESC, CostUSD DESC, MaintenanceID DESC;

-- 8. Customers ordered by Name
SELECT CustomerID, Name
FROM oil_n_gas_company.Customer
ORDER BY Name;

-- 9. July 1st production ordered by Oil DESC
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE ProductionDate = @RefStart
ORDER BY Oil_bbl DESC, WellID;

-- 10. Payments ordered by PaymentDate DESC
SELECT PaymentID, InvoiceID, PaymentDate, AmountPaid
FROM oil_n_gas_company.Payment
ORDER BY PaymentDate DESC, PaymentID DESC;

-- 11. Facilities ordered by custom type priority (Refinery > Terminal > others)
SELECT FacilityID, Name, FacilityType
FROM oil_n_gas_company.Facility
ORDER BY CASE FacilityType
           WHEN 'Refinery' THEN 1
           WHEN 'Terminal' THEN 2
           ELSE 3
         END, Name;

-- 12. Pipeline flows (7 days) ordered by Pipeline then FlowDate DESC
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl
FROM oil_n_gas_company.PipelineFlow pf
WHERE pf.FlowDate BETWEEN DATEADD(DAY, -7, @Today) AND @Today
ORDER BY pf.PipelineID, pf.FlowDate DESC;
```

## TOP
```sql
-- 1. Top 10 wells by July oil production
SELECT TOP (10) p.WellID, SUM(p.Oil_bbl) AS JulOil_bbl
FROM oil_n_gas_company.Production p
WHERE p.ProductionDate BETWEEN @RefStart AND @RefEnd
GROUP BY p.WellID
ORDER BY JulOil_bbl DESC, p.WellID;

-- 2. Top 5 customers by shipment revenue (last 30 days)
SELECT TOP (5) s.ToCustomer AS CustomerID,
       SUM(CAST(s.Volume_bbl*s.RatePerBbl AS decimal(18,2))) AS RevenueUSD
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY s.ToCustomer
ORDER BY RevenueUSD DESC, CustomerID;

-- 3. Top 20 shipments by volume
SELECT TOP (20) ShipmentID, ShipDate, Volume_bbl
FROM oil_n_gas_company.Shipment
ORDER BY Volume_bbl DESC, ShipDate DESC;

-- 4. Top 15 invoices by AmountDue
SELECT TOP (15) InvoiceID, CustomerID, InvoiceDate, AmountDue
FROM oil_n_gas_company.Invoice
ORDER BY AmountDue DESC, InvoiceDate DESC;

-- 5. Top 10 pipelines by avg flow (last 30 days)
SELECT TOP (10) pl.PipelineID, pl.Name,
       AVG(pf.Volume_bbl) AS AvgFlow_bbl
FROM oil_n_gas_company.Pipeline pl
JOIN oil_n_gas_company.PipelineFlow pf ON pf.PipelineID = pl.PipelineID
WHERE pf.FlowDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
GROUP BY pl.PipelineID, pl.Name
ORDER BY AvgFlow_bbl DESC, pl.PipelineID;

-- 6. Top 3 fields by well count (WITH TIES)
SELECT TOP (3) WITH TIES f.FieldID, f.Name, COUNT(w.WellID) AS WellCount
FROM oil_n_gas_company.Field f
LEFT JOIN oil_n_gas_company.Well w ON w.FieldID = f.FieldID
GROUP BY f.FieldID, f.Name
ORDER BY WellCount DESC;

-- 7. Top 10 facilities by latest-day total inventory
;WITH Latest AS (
  SELECT FacilityID, MAX(SnapshotDate) AS SnapD
  FROM oil_n_gas_company.Inventory
  GROUP BY FacilityID
)
SELECT TOP (10) i.FacilityID, l.SnapD,
       SUM(i.Quantity_bbl) AS TotalQty_bbl
FROM Latest l
JOIN oil_n_gas_company.Inventory i
  ON i.FacilityID = l.FacilityID AND i.SnapshotDate = l.SnapD
GROUP BY i.FacilityID, l.SnapD
ORDER BY TotalQty_bbl DESC, i.FacilityID;

-- 8. Top 10 products by shipment revenue (90 days)
SELECT TOP (10) pr.Name AS Product,
       SUM(CAST(s.Volume_bbl*s.RatePerBbl AS decimal(18,2))) AS RevenueUSD
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product pr ON pr.ProductID = s.ProductID
WHERE s.ShipDate BETWEEN DATEADD(DAY, -90, @Today) AND @Today
GROUP BY pr.Name
ORDER BY RevenueUSD DESC, Product;

-- 9. Top 5 regions by July oil production
SELECT TOP (5) r.RegionID, r.Name AS RegionName,
       SUM(p.Oil_bbl) AS JulOil_bbl
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w   ON w.WellID  = p.WellID
JOIN oil_n_gas_company.Field f  ON f.FieldID = w.FieldID
JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID
WHERE p.ProductionDate BETWEEN @RefStart AND @RefEnd
GROUP BY r.RegionID, r.Name
ORDER BY JulOil_bbl DESC, r.RegionID;

-- 10. Top 25 most maintained assets (by event count)
SELECT TOP (25) AssetType, AssetID, COUNT(*) AS EventCount
FROM oil_n_gas_company.AssetMaintenance
GROUP BY AssetType, AssetID
ORDER BY EventCount DESC, AssetType, AssetID;

-- 11. Top 10 longest drilling operations (by duration days)
SELECT TOP (10) OperationID, WellID, StartDate, EndDate,
       DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) AS DurationDays
FROM oil_n_gas_company.DrillingOperation
ORDER BY DurationDays DESC, OperationID DESC;

-- 12. Top 1 percent shipments by revenue (last 90 days, WITH TIES)
SELECT TOP (1) PERCENT WITH TIES
       ShipmentID, ShipDate,
       CAST(Volume_bbl * RatePerBbl AS decimal(18,2)) AS RevenueUSD
FROM oil_n_gas_company.Shipment
WHERE ShipDate BETWEEN DATEADD(DAY, -90, @Today) AND @Today
ORDER BY RevenueUSD DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
