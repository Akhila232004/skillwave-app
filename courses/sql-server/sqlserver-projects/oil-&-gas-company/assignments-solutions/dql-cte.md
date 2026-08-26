![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. Last 30 days total oil per well
WITH Last30 AS (
  SELECT p.WellID, p.ProductionDate, p.Oil_bbl
  FROM oil_n_gas_company.Production p
  WHERE p.ProductionDate > DATEADD(DAY, -30, CAST(GETDATE() AS date))
)
SELECT WellID, SUM(Oil_bbl) AS Oil30d
FROM Last30
GROUP BY WellID
ORDER BY Oil30d DESC;

-- 2. Customer-month shipment revenue (Volume × Rate)
WITH ShipMon AS (
  SELECT s.ToCustomer AS CustomerID,
         EOMONTH(s.ShipDate) AS InvoiceMonth,
         CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2)) AS Revenue
  FROM oil_n_gas_company.Shipment s
)
SELECT CustomerID, InvoiceMonth, SUM(Revenue) AS MonthRevenue
FROM ShipMon
GROUP BY CustomerID, InvoiceMonth
ORDER BY InvoiceMonth DESC, MonthRevenue DESC;

-- 3. Latest pipeline flow record per pipeline
WITH LatestDate AS (
  SELECT PipelineID, MAX(FlowDate) AS LastDate
  FROM oil_n_gas_company.PipelineFlow
  GROUP BY PipelineID
)
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl
FROM oil_n_gas_company.PipelineFlow pf
JOIN LatestDate ld
  ON ld.PipelineID = pf.PipelineID AND ld.LastDate = pf.FlowDate
ORDER BY pf.PipelineID;

-- 4. Outstanding per customer (Invoices − Payments)
WITH Inv AS (
  SELECT CustomerID, SUM(AmountDue) AS Due
  FROM oil_n_gas_company.Invoice
  GROUP BY CustomerID
),
Pmt AS (
  SELECT i.CustomerID, SUM(p.AmountPaid) AS Paid
  FROM oil_n_gas_company.Payment p
  JOIN oil_n_gas_company.Invoice i
    ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  GROUP BY i.CustomerID
)
SELECT Inv.CustomerID, Inv.Due, ISNULL(Pmt.Paid,0) AS Paid,
       Inv.Due - ISNULL(Pmt.Paid,0) AS Outstanding
FROM Inv
LEFT JOIN Pmt ON Pmt.CustomerID = Inv.CustomerID
ORDER BY Outstanding DESC;

-- 5. Active contracts and committed volume by product
WITH ActiveContracts AS (
  SELECT ProductID, VolumeCommit_bbl
  FROM oil_n_gas_company.SalesContract
  WHERE EndDate IS NULL OR EndDate >= CAST(GETDATE() AS date)
)
SELECT ProductID, SUM(VolumeCommit_bbl) AS TotalCommit_bbl
FROM ActiveContracts
GROUP BY ProductID
ORDER BY TotalCommit_bbl DESC;

-- 6. Latest inventory snapshot per (Facility, Product)
WITH RankedInv AS (
  SELECT i.*,
         ROW_NUMBER() OVER (PARTITION BY i.FacilityID, i.ProductID
                            ORDER BY i.SnapshotDate DESC, i.InventoryID DESC) AS rn
  FROM oil_n_gas_company.Inventory i
)
SELECT FacilityID, ProductID, SnapshotDate, Quantity_bbl
FROM RankedInv
WHERE rn = 1
ORDER BY FacilityID, ProductID;

-- 7. High-performing wells (Avg Oil > 100 bbl)
WITH WellAvg AS (
  SELECT p.WellID, AVG(p.Oil_bbl) AS AvgOil
  FROM oil_n_gas_company.Production p
  GROUP BY p.WellID
)
SELECT WellID, AvgOil
FROM WellAvg
WHERE AvgOil > 100
ORDER BY AvgOil DESC;

-- 8. Currently active drilling operations
WITH ActiveOps AS (
  SELECT d.WellID, d.OperationID, d.StartDate, d.EndDate, d.Status
  FROM oil_n_gas_company.DrillingOperation d
  WHERE d.StartDate <= SYSDATETIME()
    AND (d.EndDate IS NULL OR d.EndDate >= SYSDATETIME())
)
SELECT *
FROM ActiveOps
ORDER BY WellID, StartDate DESC;

-- 9. Daily Oil/Gas ratio per well for the last 7 days
WITH Last7 AS (
  SELECT p.WellID, p.ProductionDate,
         p.Oil_bbl,
         p.Gas_mcf,
         CASE WHEN p.Gas_mcf = 0 THEN NULL
              ELSE p.Oil_bbl / p.Gas_mcf END AS OilGasRatio
  FROM oil_n_gas_company.Production p
  WHERE p.ProductionDate > DATEADD(DAY, -7, CAST(GETDATE() AS date))
)
SELECT *
FROM Last7
ORDER BY WellID, ProductionDate;

-- 10. Shipment price bands by product
WITH PriceBand AS (
  SELECT s.ProductID, s.RatePerBbl,
         CASE
           WHEN s.RatePerBbl < 50 THEN 'Low'
           WHEN s.RatePerBbl < 70 THEN 'Mid'
           ELSE 'High'
         END AS Band
  FROM oil_n_gas_company.Shipment s
)
SELECT ProductID, Band, COUNT(*) AS Shipments
FROM PriceBand
GROUP BY ProductID, Band
ORDER BY ProductID, Band;

-- 11. Region-level total oil using Well→Field→Region
WITH OilByWell AS (
  SELECT w.WellID, SUM(p.Oil_bbl) AS OilTot
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  GROUP BY w.WellID
)
SELECT r.RegionID, SUM(ow.OilTot) AS RegionOil
FROM OilByWell ow
JOIN oil_n_gas_company.Well w   ON w.WellID  = ow.WellID
JOIN oil_n_gas_company.Field f  ON f.FieldID = w.FieldID
JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID
GROUP BY r.RegionID
ORDER BY RegionOil DESC;

-- 12. Invoice payment coverage (% paid) per invoice
WITH Paid AS (
  SELECT p.InvoiceID, p.InvoiceDate, SUM(p.AmountPaid) AS PaidAmt
  FROM oil_n_gas_company.Payment p
  GROUP BY p.InvoiceID, p.InvoiceDate
)
SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue,
       ISNULL(Paid.PaidAmt,0) AS PaidAmt,
       CAST(100.0 * ISNULL(Paid.PaidAmt,0) / NULLIF(i.AmountDue,0) AS decimal(6,2)) AS PaidPct
FROM oil_n_gas_company.Invoice i
LEFT JOIN Paid ON Paid.InvoiceID = i.InvoiceID AND Paid.InvoiceDate = i.InvoiceDate
ORDER BY PaidPct ASC, i.AmountDue DESC;
```

## Using Multiple CTEs
```sql
-- 1. Top customers by revenue in the latest shipment month
WITH LastMonth AS (
  SELECT MAX(EOMONTH(ShipDate)) AS Mon FROM oil_n_gas_company.Shipment
),
MonRevenue AS (
  SELECT s.ToCustomer AS CustomerID,
         SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS Revenue
  FROM oil_n_gas_company.Shipment s
  CROSS JOIN LastMonth
  WHERE EOMONTH(s.ShipDate) = LastMonth.Mon
  GROUP BY s.ToCustomer
)
SELECT TOP (10) CustomerID, Revenue
FROM MonRevenue
ORDER BY Revenue DESC;

-- 2. Well monthly oil and rank within field
WITH WellMon AS (
  SELECT w.FieldID, p.WellID, EOMONTH(p.ProductionDate) AS Mon, SUM(p.Oil_bbl) AS OilMon
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  GROUP BY w.FieldID, p.WellID, EOMONTH(p.ProductionDate)
),
LastMon AS (
  SELECT MAX(Mon) AS Mon FROM WellMon
)
SELECT wm.FieldID, wm.WellID, wm.OilMon,
       RANK() OVER (PARTITION BY wm.FieldID ORDER BY wm.OilMon DESC) AS RnkInField
FROM WellMon wm CROSS JOIN LastMon
WHERE wm.Mon = LastMon.Mon
ORDER BY wm.FieldID, RnkInField;

-- 3. Invoice totals, payments, and outstanding by customer
WITH IT AS (
  SELECT CustomerID, SUM(AmountDue) AS Due FROM oil_n_gas_company.Invoice GROUP BY CustomerID
),
PT AS (
  SELECT i.CustomerID, SUM(p.AmountPaid) AS Paid
  FROM oil_n_gas_company.Payment p
  JOIN oil_n_gas_company.Invoice i
    ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  GROUP BY i.CustomerID
),
OUTS AS (
  SELECT IT.CustomerID, IT.Due, ISNULL(PT.Paid,0) AS Paid, IT.Due - ISNULL(PT.Paid,0) AS Outstanding
  FROM IT LEFT JOIN PT ON PT.CustomerID = IT.CustomerID
)
SELECT * FROM OUTS ORDER BY Outstanding DESC;

-- 4. Pipeline 30-day throughput vs capacity utilization
WITH Flow30 AS (
  SELECT pf.PipelineID, SUM(pf.Volume_bbl) AS Vol30d
  FROM oil_n_gas_company.PipelineFlow pf
  WHERE pf.FlowDate > DATEADD(DAY, -30, CAST(GETDATE() AS date))
  GROUP BY pf.PipelineID
),
Cap AS (
  SELECT PipelineID, CapacityBbl FROM oil_n_gas_company.Pipeline
)
SELECT f.PipelineID, f.Vol30d, c.CapacityBbl,
       CAST( (f.Vol30d / NULLIF(30.0 * c.CapacityBbl,0)) * 100.0 AS decimal(6,2)) AS AvgUtilPct
FROM Flow30 f
JOIN Cap c ON c.PipelineID = f.PipelineID
ORDER BY AvgUtilPct DESC;

-- 5. Active contracts exploded with product names (summary)
WITH Active AS (
  SELECT * FROM oil_n_gas_company.SalesContract
  WHERE EndDate IS NULL OR EndDate >= CAST(GETDATE() AS date)
),
WithProd AS (
  SELECT a.CustomerID, a.ProductID, a.VolumeCommit_bbl, a.PricePerBbl, p.Name AS ProductName
  FROM Active a
  JOIN oil_n_gas_company.Product p ON p.ProductID = a.ProductID
)
SELECT ProductName, SUM(VolumeCommit_bbl) AS Commit_bbl, AVG(PricePerBbl) AS AvgPrice
FROM WithProd
GROUP BY ProductName
ORDER BY Commit_bbl DESC;

-- 6. Facility-product average vs facility total share
WITH FP AS (
  SELECT FacilityID, ProductID, AVG(Quantity_bbl) AS AvgQty
  FROM oil_n_gas_company.Inventory
  GROUP BY FacilityID, ProductID
),
FT AS (
  SELECT FacilityID, SUM(AvgQty) AS FacTotal FROM FP GROUP BY FacilityID
)
SELECT fp.FacilityID, fp.ProductID, fp.AvgQty,
       CAST(100.0 * fp.AvgQty / NULLIF(ft.FacTotal,0) AS decimal(6,2)) AS SharePct
FROM FP fp
JOIN FT ft ON ft.FacilityID = fp.FacilityID
ORDER BY fp.FacilityID, SharePct DESC;

-- 7. Shipment revenue this quarter and ranking by product
WITH QBounds AS (
  SELECT DATEADD(QUARTER, DATEDIFF(QUARTER, 0, GETDATE()), 0) AS QStart
),
QRev AS (
  SELECT s.ProductID,
         SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS Revenue
  FROM oil_n_gas_company.Shipment s
  CROSS JOIN QBounds
  WHERE s.ShipDate >= QBounds.QStart
  GROUP BY s.ProductID
)
SELECT ProductID, Revenue,
       RANK() OVER (ORDER BY Revenue DESC) AS RevRank
FROM QRev
ORDER BY RevRank;

-- 8. Well performance: average oil & gas with field/region
WITH WA AS (
  SELECT w.WellID, AVG(p.Oil_bbl) AS AvgOil, AVG(p.Gas_mcf) AS AvgGas
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  GROUP BY w.WellID
),
WF AS (
  SELECT w.WellID, f.FieldID, r.RegionID
  FROM oil_n_gas_company.Well w
  JOIN oil_n_gas_company.Field f  ON f.FieldID = w.FieldID
  JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID
)
SELECT wf.RegionID, wf.FieldID, wa.WellID, wa.AvgOil, wa.AvgGas
FROM WA wa JOIN WF wf ON wf.WellID = wa.WellID
ORDER BY wf.RegionID, wf.FieldID, wa.WellID;

-- 9. Customers split by payment speed (<=30 days vs >30)
WITH PmtSpeed AS (
  SELECT i.CustomerID,
         AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) AS AvgDays
  FROM oil_n_gas_company.Payment p
  JOIN oil_n_gas_company.Invoice i
    ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  GROUP BY i.CustomerID
),
Bucket AS (
  SELECT CustomerID,
         CASE WHEN AvgDays <= 30 THEN 'Fast' ELSE 'Slow' END AS SpeedBucket
  FROM PmtSpeed
)
SELECT SpeedBucket, COUNT(*) AS Customers
FROM Bucket
GROUP BY SpeedBucket;

-- 10. Open invoices with last payment (if any)
WITH OpenInv AS (
  SELECT * FROM oil_n_gas_company.Invoice WHERE Status = 'Open'
),
LastPay AS (
  SELECT p.InvoiceID,
         MAX(p.PaymentDate) AS LastPaymentDate
  FROM oil_n_gas_company.Payment p
  GROUP BY p.InvoiceID
)
SELECT i.InvoiceID, i.CustomerID, i.InvoiceDate, i.AmountDue, lp.LastPaymentDate
FROM OpenInv i
LEFT JOIN LastPay lp ON lp.InvoiceID = i.InvoiceID
ORDER BY i.CustomerID, i.InvoiceDate;

-- 11. Monthly invoice totals vs payments received
WITH InvMon AS (
  SELECT EOMONTH(InvoiceDate) AS Mon, SUM(AmountDue) AS InvAmt
  FROM oil_n_gas_company.Invoice
  GROUP BY EOMONTH(InvoiceDate)
),
PayMon AS (
  SELECT EOMONTH(PaymentDate) AS Mon, SUM(AmountPaid) AS PayAmt
  FROM oil_n_gas_company.Payment
  GROUP BY EOMONTH(PaymentDate)
)
SELECT COALESCE(i.Mon, p.Mon) AS Mon,
       ISNULL(i.InvAmt,0) AS Invoiced,
       ISNULL(p.PayAmt,0) AS Paid,
       ISNULL(i.InvAmt,0) - ISNULL(p.PayAmt,0) AS Gap
FROM InvMon i
FULL JOIN PayMon p ON p.Mon = i.Mon
ORDER BY Mon;

-- 12. Field production league table in the latest month
WITH FM AS (
  SELECT f.FieldID, EOMONTH(p.ProductionDate) AS Mon, SUM(p.Oil_bbl) AS OilMon
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
  GROUP BY f.FieldID, EOMONTH(p.ProductionDate)
),
LM AS (SELECT MAX(Mon) AS Mon FROM FM)
SELECT fm.FieldID, fm.OilMon,
       DENSE_RANK() OVER (ORDER BY fm.OilMon DESC) AS RankInLatestMon
FROM FM fm CROSS JOIN LM
WHERE fm.Mon = LM.Mon
ORDER BY RankInLatestMon;
```

## Recursive CTEs
```sql
-- 1. Generate the last 14 calendar days and join daily oil totals (all wells)
WITH Cal AS (
  SELECT CAST(DATEADD(DAY, -13, CAST(GETDATE() AS date)) AS date) AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < CAST(GETDATE() AS date)
),
Oil AS (
  SELECT p.ProductionDate AS D, SUM(p.Oil_bbl) AS OilTot
  FROM oil_n_gas_company.Production p
  WHERE p.ProductionDate >= DATEADD(DAY, -13, CAST(GETDATE() AS date))
  GROUP BY p.ProductionDate
)
SELECT c.D, ISNULL(o.OilTot, 0) AS OilTot
FROM Cal c
LEFT JOIN Oil o ON o.D = c.D
ORDER BY c.D
OPTION (MAXRECURSION 32767);

-- 2. Month sequence (min..max ShipDate) with shipment revenue by month
WITH Bounds AS (
  SELECT MIN(EOMONTH(ShipDate)) AS StartMon,
         MAX(EOMONTH(ShipDate)) AS EndMon
  FROM oil_n_gas_company.Shipment
),
MonSeq AS (
  SELECT StartMon AS Mon FROM Bounds
  UNION ALL
  SELECT DATEADD(MONTH, 1, Mon) FROM MonSeq, Bounds WHERE Mon < Bounds.EndMon
),
Rev AS (
  SELECT EOMONTH(ShipDate) AS Mon,
         SUM(CAST(Volume_bbl * RatePerBbl AS decimal(18,2))) AS Revenue
  FROM oil_n_gas_company.Shipment
  GROUP BY EOMONTH(ShipDate)
)
SELECT m.Mon, ISNULL(r.Revenue, 0) AS Revenue
FROM MonSeq m
LEFT JOIN Rev r ON r.Mon = m.Mon
ORDER BY m.Mon
OPTION (MAXRECURSION 32767);

-- 3. Hierarchy expansion: Region → Field → Well
WITH H AS (
  -- Level 1: Fields (carry Region)
  SELECT r.RegionID, f.FieldID, CAST(NULL AS BIGINT) AS WellID, 1 AS Lvl,
         CONCAT('Region ', r.RegionID, ' / Field ', f.FieldID) AS PathTxt
  FROM oil_n_gas_company.Region r
  JOIN oil_n_gas_company.Field f ON f.RegionID = r.RegionID
  UNION ALL
  -- Level 2: Wells under each Field
  SELECT h.RegionID, h.FieldID, w.WellID, 2 AS Lvl,
         CONCAT(h.PathTxt, ' / Well ', w.WellID)
  FROM H h
  JOIN oil_n_gas_company.Well w ON w.FieldID = h.FieldID
  WHERE h.Lvl = 1
)
SELECT * FROM H
ORDER BY RegionID, FieldID, WellID
OPTION (MAXRECURSION 32767);

-- 4. Expand active contracts into one row per month
WITH Base AS (
  SELECT ContractID, CustomerID, ProductID,
         EOMONTH(StartDate) AS StartMon,
         EOMONTH(COALESCE(EndDate, GETDATE())) AS EndMon
  FROM oil_n_gas_company.SalesContract
),
MonCTE AS (
  SELECT ContractID, CustomerID, ProductID, StartMon AS Mon, EndMon
  FROM Base
  UNION ALL
  SELECT ContractID, CustomerID, ProductID,
         DATEADD(MONTH, 1, Mon), EndMon
  FROM MonCTE
  WHERE Mon < EndMon
)
SELECT ContractID, CustomerID, ProductID, Mon
FROM MonCTE
ORDER BY ContractID, Mon
OPTION (MAXRECURSION 32767);

-- 5. Forecast next 10 days using last 7-day average per (one sample) Well
WITH SampleWell AS (
  SELECT MIN(WellID) AS WellID FROM oil_n_gas_company.Well
),
Avg7 AS (
  SELECT sw.WellID,
         AVG(p.Oil_bbl) AS Avg7
  FROM SampleWell sw
  JOIN oil_n_gas_company.Production p ON p.WellID = sw.WellID
  WHERE p.ProductionDate > DATEADD(DAY, -7, CAST(GETDATE() AS date))
  GROUP BY sw.WellID
),
Forecast AS (
  SELECT CAST(DATEADD(DAY, 1, CAST(GETDATE() AS date)) AS date) AS D, 1 AS n
  FROM Avg7
  UNION ALL
  SELECT DATEADD(DAY, 1, D), n + 1 FROM Forecast WHERE n < 10
)
SELECT sw.WellID, f.D AS ForecastDate, CAST(a.Avg7 AS decimal(18,2)) AS Forecast_Oil_bbl
FROM Forecast f CROSS JOIN Avg7 a CROSS JOIN SampleWell sw
ORDER BY ForecastDate
OPTION (MAXRECURSION 32767);

-- 6. Running balance by invoice after each payment (per invoice)
WITH P AS (
  SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue,
         p.PaymentID, p.PaymentDate, p.AmountPaid,
         ROW_NUMBER() OVER (PARTITION BY i.InvoiceID ORDER BY p.PaymentDate, p.PaymentID) AS rn
  FROM oil_n_gas_company.Invoice i
  LEFT JOIN oil_n_gas_company.Payment p
    ON p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
),
RB AS (
  -- anchor = first row of each invoice
  SELECT InvoiceID, InvoiceDate, AmountDue, PaymentID, PaymentDate, AmountPaid, rn,
         AmountDue - ISNULL(AmountPaid,0) AS Remaining
  FROM P WHERE rn = 1
  UNION ALL
  -- recursive = subtract next payment
  SELECT p.InvoiceID, p.InvoiceDate, p.AmountDue, p.PaymentID, p.PaymentDate, p.AmountPaid, p.rn,
         rb.Remaining - ISNULL(p.AmountPaid,0) AS Remaining
  FROM RB rb
  JOIN P  p
    ON p.InvoiceID = rb.InvoiceID
   AND p.rn = rb.rn + 1
)
SELECT InvoiceID, InvoiceDate, PaymentID, PaymentDate, AmountPaid, Remaining
FROM RB
ORDER BY InvoiceID, PaymentDate
OPTION (MAXRECURSION 32767);

-- 7. Daily calendar for last 10 days per (one sample) Pipeline with flows
WITH SamplePipe AS (
  SELECT MIN(PipelineID) AS PipelineID FROM oil_n_gas_company.Pipeline
),
Cal AS (
  SELECT CAST(DATEADD(DAY, -9, CAST(GETDATE() AS date)) AS date) AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < CAST(GETDATE() AS date)
),
Flow AS (
  SELECT pf.FlowDate AS D, pf.Volume_bbl
  FROM oil_n_gas_company.PipelineFlow pf
  JOIN SamplePipe sp ON sp.PipelineID = pf.PipelineID
  WHERE pf.FlowDate >= DATEADD(DAY, -9, CAST(GETDATE() AS date))
)
SELECT sp.PipelineID, c.D, ISNULL(f.Volume_bbl, 0) AS Volume_bbl
FROM Cal c
CROSS JOIN SamplePipe sp
LEFT JOIN Flow f ON f.D = c.D
ORDER BY c.D
OPTION (MAXRECURSION 32767);

-- 8. Enumerate days from earliest to latest ProductionDate (global)
WITH Bounds AS (
  SELECT MIN(ProductionDate) AS D0, MAX(ProductionDate) AS D1
  FROM oil_n_gas_company.Production
),
D AS (
  SELECT D0 AS D FROM Bounds
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM D, Bounds WHERE D < Bounds.D1
)
SELECT D FROM D ORDER BY D
OPTION (MAXRECURSION 32767);

-- 9. Field→Well list with ordinal numbering via recursion
WITH FW AS (
  SELECT f.FieldID, w.WellID,
         ROW_NUMBER() OVER (PARTITION BY f.FieldID ORDER BY w.WellID) AS rn
  FROM oil_n_gas_company.Field f
  JOIN oil_n_gas_company.Well  w ON w.FieldID = f.FieldID
),
R AS (
  SELECT FieldID, rn AS k FROM FW WHERE rn = 1
  UNION ALL
  SELECT r.FieldID, r.k + 1
  FROM R r
  WHERE EXISTS (SELECT 1 FROM FW x WHERE x.FieldID = r.FieldID AND x.rn = r.k + 1)
)
SELECT r.FieldID, fw.WellID, r.k AS OrdinalInField
FROM R r
JOIN FW fw ON fw.FieldID = r.FieldID AND fw.rn = r.k
ORDER BY r.FieldID, r.k
OPTION (MAXRECURSION 32767);

-- 10. Generate next 12 month-ends from today
WITH Mon AS (
  SELECT EOMONTH(GETDATE()) AS M, 1 AS n
  UNION ALL
  SELECT EOMONTH(DATEADD(MONTH, 1, M)), n + 1
  FROM Mon WHERE n < 12
)
SELECT M AS MonthEnd FROM Mon
ORDER BY M
OPTION (MAXRECURSION 32767);

-- 11. Fill missing inventory dates for (one sample) Facility-Product combo (last 7 days)
WITH SampleFP AS (
  SELECT TOP (1) FacilityID, ProductID
  FROM oil_n_gas_company.Inventory
  ORDER BY FacilityID, ProductID
),
Cal AS (
  SELECT CAST(DATEADD(DAY, -6, CAST(GETDATE() AS date)) AS date) AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < CAST(GETDATE() AS date)
),
Inv AS (
  SELECT i.SnapshotDate AS D, i.Quantity_bbl
  FROM oil_n_gas_company.Inventory i
  JOIN SampleFP sp ON sp.FacilityID = i.FacilityID AND sp.ProductID = i.ProductID
  WHERE i.SnapshotDate >= DATEADD(DAY, -6, CAST(GETDATE() AS date))
)
SELECT sp.FacilityID, sp.ProductID, c.D, ISNULL(v.Quantity_bbl, 0) AS Quantity_bbl
FROM Cal c
CROSS JOIN SampleFP sp
LEFT JOIN Inv v ON v.D = c.D
ORDER BY c.D
OPTION (MAXRECURSION 32767);

-- 12. Rolling day index to label the last 15 days
WITH D AS (
  SELECT CAST(DATEADD(DAY, -14, CAST(GETDATE() AS date)) AS date) AS D, 1 AS idx
  UNION ALL
  SELECT DATEADD(DAY, 1, D), idx + 1 FROM D WHERE idx < 15
)
SELECT D, idx AS DayIndex
FROM D
ORDER BY D
OPTION (MAXRECURSION 32767);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
