![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Total wells overall
SELECT COUNT(*) AS TotalWells
FROM oil_n_gas_company.Well;

-- 2. Wells per field
SELECT w.FieldID, COUNT(*) AS WellsInField
FROM oil_n_gas_company.Well w
GROUP BY w.FieldID
ORDER BY WellsInField DESC;

-- 3. Wells by status
SELECT w.Status, COUNT(*) AS Cnt
FROM oil_n_gas_company.Well w
GROUP BY w.Status
ORDER BY Cnt DESC;

-- 4. Fields per region
SELECT f.RegionID, COUNT(*) AS FieldsInRegion
FROM oil_n_gas_company.Field f
GROUP BY f.RegionID
ORDER BY FieldsInRegion DESC;

-- 5. Distinct production days per well (observed days)
SELECT p.WellID, COUNT(DISTINCT p.ProductionDate) AS ProdDays
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY ProdDays DESC;

-- 6. Drilling operations started per month (yyyy-mm)
SELECT FORMAT(d.StartDate, 'yyyy-MM') AS StartMonth, COUNT(*) AS OpsStarted
FROM oil_n_gas_company.DrillingOperation d
GROUP BY FORMAT(d.StartDate, 'yyyy-MM')
ORDER BY StartMonth DESC;

-- 7. Shipments per product in the last 30 days
SELECT s.ProductID, COUNT(*) AS Shipments30d
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate > DATEADD(DAY, -30, CAST(GETDATE() AS date))
GROUP BY s.ProductID
ORDER BY Shipments30d DESC;

-- 8. Customers with at least one shipment (distinct)
SELECT COUNT(DISTINCT s.ToCustomer) AS CustomersShippedTo
FROM oil_n_gas_company.Shipment s;

-- 9. Invoices by status
SELECT i.Status, COUNT(*) AS Cnt
FROM oil_n_gas_company.Invoice i
GROUP BY i.Status;

-- 10. Payments per invoice (how many partials/splits)
SELECT p.InvoiceID, COUNT(*) AS PaymentCount
FROM oil_n_gas_company.Payment p
GROUP BY p.InvoiceID
ORDER BY PaymentCount DESC, p.InvoiceID;

-- 11. Inventory snapshots per (Facility, Product)
SELECT i.FacilityID, i.ProductID, COUNT(*) AS Snapshots
FROM oil_n_gas_company.Inventory i
GROUP BY i.FacilityID, i.ProductID
ORDER BY Snapshots DESC;

-- 12. Pipeline flow days per pipeline (observed days with data)
SELECT pf.PipelineID, COUNT(DISTINCT pf.FlowDate) AS FlowDays
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY pf.PipelineID
ORDER BY FlowDays DESC;
```

## Sum
```sql
-- 1. Total oil produced overall
SELECT SUM(p.Oil_bbl) AS TotalOil_bbl
FROM oil_n_gas_company.Production p;

-- 2. Total gas produced by field (via Well -> Field)
SELECT f.FieldID, SUM(p.Gas_mcf) AS Gas_mcf
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w   ON w.WellID  = p.WellID
JOIN oil_n_gas_company.Field f  ON f.FieldID = w.FieldID
GROUP BY f.FieldID
ORDER BY Gas_mcf DESC;

-- 3. Shipment revenue per product (Volume * Rate)
SELECT s.ProductID,
       SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS Revenue
FROM oil_n_gas_company.Shipment s
GROUP BY s.ProductID
ORDER BY Revenue DESC;

-- 4. Amount due per customer (invoice totals)
SELECT i.CustomerID, SUM(i.AmountDue) AS AmountDue
FROM oil_n_gas_company.Invoice i
GROUP BY i.CustomerID
ORDER BY AmountDue DESC;

-- 5. Payments received per customer (join Invoice -> Payment)
SELECT i.CustomerID, SUM(p.AmountPaid) AS AmountPaid
FROM oil_n_gas_company.Payment p
JOIN oil_n_gas_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
GROUP BY i.CustomerID
ORDER BY AmountPaid DESC;

-- 6. Outstanding per customer = SUM(AmountDue) - SUM(AmountPaid)
;WITH Inv AS (
  SELECT CustomerID, SUM(AmountDue) AS Due
  FROM oil_n_gas_company.Invoice GROUP BY CustomerID
),
Pmt AS (
  SELECT i.CustomerID, SUM(p.AmountPaid) AS Paid
  FROM oil_n_gas_company.Payment p
  JOIN oil_n_gas_company.Invoice i
    ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  GROUP BY i.CustomerID
)
SELECT inv.CustomerID,
       inv.Due,
       ISNULL(pmt.Paid, 0) AS Paid,
       inv.Due - ISNULL(pmt.Paid, 0) AS Outstanding
FROM Inv inv
LEFT JOIN Pmt pmt ON pmt.CustomerID = inv.CustomerID
ORDER BY Outstanding DESC;

-- 7. Total maintenance spend by asset type
SELECT am.AssetType, SUM(am.CostUSD) AS CostUSD
FROM oil_n_gas_company.AssetMaintenance am
GROUP BY am.AssetType
ORDER BY CostUSD DESC;

-- 8. Pipeline throughput (sum) by month
SELECT FORMAT(pf.FlowDate, 'yyyy-MM') AS FlowMonth,
       SUM(pf.Volume_bbl) AS Volume_bbl
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY FORMAT(pf.FlowDate, 'yyyy-MM')
ORDER BY FlowMonth DESC;

-- 9. Inventory value proxy: sum quantity by facility (bbl)
SELECT i.FacilityID, SUM(i.Quantity_bbl) AS Qty_bbl
FROM oil_n_gas_company.Inventory i
GROUP BY i.FacilityID
ORDER BY Qty_bbl DESC;

-- 10. Sum of oil production per well over the last 14 days
SELECT p.WellID, SUM(p.Oil_bbl) AS Oil14d
FROM oil_n_gas_company.Production p
WHERE p.ProductionDate > DATEADD(DAY, -14, CAST(GETDATE() AS date))
GROUP BY p.WellID
ORDER BY Oil14d DESC;

-- 11. Sum of Volume_bbl shipped per customer last month
SELECT s.ToCustomer AS CustomerID, SUM(s.Volume_bbl) AS Volume_bbl
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0)
  AND s.ShipDate <  DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)
GROUP BY s.ToCustomer
ORDER BY Volume_bbl DESC;

-- 12. Total committed volume in active contracts
SELECT SUM(sc.VolumeCommit_bbl) AS TotalCommit_bbl
FROM oil_n_gas_company.SalesContract sc
WHERE sc.EndDate IS NULL OR sc.EndDate >= CAST(GETDATE() AS date);
```

## Avg
```sql
-- 1. Average daily oil per well
SELECT p.WellID, AVG(p.Oil_bbl) AS AvgOil_bbl
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY AvgOil_bbl DESC;

-- 2. Average pipeline flow per pipeline
SELECT pf.PipelineID, AVG(pf.Volume_bbl) AS AvgFlow_bbl
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY pf.PipelineID
ORDER BY AvgFlow_bbl DESC;

-- 3. Average RatePerBbl per product (from shipments)
SELECT s.ProductID, AVG(s.RatePerBbl) AS AvgRatePerBbl
FROM oil_n_gas_company.Shipment s
GROUP BY s.ProductID
ORDER BY AvgRatePerBbl DESC;

-- 4. Average invoice amount per customer
SELECT i.CustomerID, AVG(i.AmountDue) AS AvgInvoice
FROM oil_n_gas_company.Invoice i
GROUP BY i.CustomerID
ORDER BY AvgInvoice DESC;

-- 5. Average days to pay per customer
SELECT i.CustomerID, AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) AS AvgDaysToPay
FROM oil_n_gas_company.Payment p
JOIN oil_n_gas_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
GROUP BY i.CustomerID
ORDER BY AvgDaysToPay;

-- 6. Average drilling duration (days)
SELECT AVG(DATEDIFF(DAY, d.StartDate, ISNULL(d.EndDate, SYSDATETIME()))) AS AvgDurationDays
FROM oil_n_gas_company.DrillingOperation d;

-- 7. Average daily gas by field
SELECT f.FieldID, AVG(p.Gas_mcf) AS AvgGas_mcf
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w  ON w.WellID  = p.WellID
JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
GROUP BY f.FieldID
ORDER BY AvgGas_mcf DESC;

-- 8. Average inventory quantity by (Facility, Product)
SELECT i.FacilityID, i.ProductID, AVG(i.Quantity_bbl) AS AvgQty
FROM oil_n_gas_company.Inventory i
GROUP BY i.FacilityID, i.ProductID
ORDER BY AvgQty DESC;

-- 9. Average monthly revenue per customer (based on invoices)
SELECT i.CustomerID, AVG(i.AmountDue) AS AvgMonthlyInvoice
FROM oil_n_gas_company.Invoice i
GROUP BY i.CustomerID
ORDER BY AvgMonthlyInvoice DESC;

-- 10. Average oil per weekday (which days perform best)
SELECT DATENAME(WEEKDAY, p.ProductionDate) AS DayName,
       AVG(p.Oil_bbl) AS AvgOil
FROM oil_n_gas_company.Production p
GROUP BY DATENAME(WEEKDAY, p.ProductionDate)
ORDER BY AvgOil DESC;

-- 11. Average RatePerBbl per customer
SELECT s.ToCustomer AS CustomerID, AVG(s.RatePerBbl) AS AvgRate
FROM oil_n_gas_company.Shipment s
GROUP BY s.ToCustomer
ORDER BY AvgRate DESC;

-- 12. Average maintenance cost per asset type
SELECT am.AssetType, AVG(am.CostUSD) AS AvgCost
FROM oil_n_gas_company.AssetMaintenance am
GROUP BY am.AssetType
ORDER BY AvgCost DESC;
```

## Max
```sql
-- 1. Latest production date per well
SELECT p.WellID, MAX(p.ProductionDate) AS LastProdDate
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY LastProdDate DESC;

-- 2. Maximum daily oil per well
SELECT p.WellID, MAX(p.Oil_bbl) AS MaxDailyOil
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY MaxDailyOil DESC;

-- 3. Max shipment volume per product
SELECT s.ProductID, MAX(s.Volume_bbl) AS MaxShipVol
FROM oil_n_gas_company.Shipment s
GROUP BY s.ProductID
ORDER BY MaxShipVol DESC;

-- 4. Max invoice amount overall
SELECT MAX(i.AmountDue) AS MaxInvoiceAmount
FROM oil_n_gas_company.Invoice i;

-- 5. Max pipeline capacity
SELECT MAX(pl.CapacityBbl) AS MaxPipelineCapacity
FROM oil_n_gas_company.Pipeline pl;

-- 6. Max maintenance cost per asset type
SELECT am.AssetType, MAX(am.CostUSD) AS MaxCost
FROM oil_n_gas_company.AssetMaintenance am
GROUP BY am.AssetType
ORDER BY MaxCost DESC;

-- 7. Max RatePerBbl observed per customer
SELECT s.ToCustomer AS CustomerID, MAX(s.RatePerBbl) AS MaxRate
FROM oil_n_gas_company.Shipment s
GROUP BY s.ToCustomer
ORDER BY MaxRate DESC;

-- 8. Max payment amount (single payment)
SELECT MAX(p.AmountPaid) AS MaxPayment
FROM oil_n_gas_company.Payment p;

-- 9. Latest invoice date per customer
SELECT i.CustomerID, MAX(i.InvoiceDate) AS LatestInvoice
FROM oil_n_gas_company.Invoice i
GROUP BY i.CustomerID
ORDER BY LatestInvoice DESC;

-- 10. Max gas produced in a single day per field
SELECT f.FieldID, MAX(p.Gas_mcf) AS MaxDailyGas
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w  ON w.WellID = p.WellID
JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
GROUP BY f.FieldID
ORDER BY MaxDailyGas DESC;

-- 11. Max inventory snapshot quantity per (Facility, Product)
SELECT i.FacilityID, i.ProductID, MAX(i.Quantity_bbl) AS PeakQty
FROM oil_n_gas_company.Inventory i
GROUP BY i.FacilityID, i.ProductID
ORDER BY PeakQty DESC;

-- 12. Latest drilling end per well (last completion)
SELECT d.WellID, MAX(d.EndDate) AS LastEnd
FROM oil_n_gas_company.DrillingOperation d
WHERE d.EndDate IS NOT NULL
GROUP BY d.WellID
ORDER BY LastEnd DESC;
```

## Min
```sql
-- 1. Earliest spud date overall
SELECT MIN(w.SpudDate) AS EarliestSpud
FROM oil_n_gas_company.Well w
WHERE w.SpudDate IS NOT NULL;

-- 2. Earliest production date per well
SELECT p.WellID, MIN(p.ProductionDate) AS FirstProdDate
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY FirstProdDate;

-- 3. Minimum daily oil per well
SELECT p.WellID, MIN(p.Oil_bbl) AS MinDailyOil
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY MinDailyOil;

-- 4. Minimum pipeline flow per pipeline
SELECT pf.PipelineID, MIN(pf.Volume_bbl) AS MinDailyFlow
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY pf.PipelineID
ORDER BY MinDailyFlow;

-- 5. Minimum RatePerBbl per product
SELECT s.ProductID, MIN(s.RatePerBbl) AS MinRate
FROM oil_n_gas_company.Shipment s
GROUP BY s.ProductID
ORDER BY MinRate;

-- 6. Minimum invoice amount overall
SELECT MIN(i.AmountDue) AS MinInvoiceAmount
FROM oil_n_gas_company.Invoice i;

-- 7. Earliest invoice date per customer
SELECT i.CustomerID, MIN(i.InvoiceDate) AS FirstInvoice
FROM oil_n_gas_company.Invoice i
GROUP BY i.CustomerID
ORDER BY FirstInvoice;

-- 8. Minimum maintenance cost per asset type
SELECT am.AssetType, MIN(am.CostUSD) AS MinCost
FROM oil_n_gas_company.AssetMaintenance am
GROUP BY am.AssetType
ORDER BY MinCost;

-- 9. Minimum inventory snapshot quantity per (Facility, Product)
SELECT i.FacilityID, i.ProductID, MIN(i.Quantity_bbl) AS MinQty
FROM oil_n_gas_company.Inventory i
GROUP BY i.FacilityID, i.ProductID
ORDER BY MinQty;

-- 10. Minimum days to pay (fastest payments)
SELECT MIN(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) AS FastestDaysToPay
FROM oil_n_gas_company.Payment p;

-- 11. Earliest drilling start per well
SELECT d.WellID, MIN(d.StartDate) AS FirstStart
FROM oil_n_gas_company.DrillingOperation d
GROUP BY d.WellID
ORDER BY FirstStart;

-- 12. Minimum daily gas per field
SELECT f.FieldID, MIN(p.Gas_mcf) AS MinDailyGas
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w  ON w.WellID = p.WellID
JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
GROUP BY f.FieldID
ORDER BY MinDailyGas;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
