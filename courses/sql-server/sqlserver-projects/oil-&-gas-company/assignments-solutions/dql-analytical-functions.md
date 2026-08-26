![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Running total oil per well by ProductionDate
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       SUM(p.Oil_bbl) OVER (PARTITION BY p.WellID
                            ORDER BY p.ProductionDate
                            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunOil_bbl
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 2. 7-day moving average oil per well (centered on current row)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       AVG(p.Oil_bbl) OVER (PARTITION BY p.WellID
                            ORDER BY p.ProductionDate
                            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS MA7_Oil
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 3. Daily oil share of the well’s month total
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       SUM(p.Oil_bbl) OVER (PARTITION BY p.WellID, EOMONTH(p.ProductionDate)) AS MonthOil,
       CAST(100.0 * p.Oil_bbl
            / NULLIF(SUM(p.Oil_bbl) OVER (PARTITION BY p.WellID, EOMONTH(p.ProductionDate)), 0) AS decimal(6,2)) AS PctOfMonth
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 4. Cumulative pipeline throughput by day (per pipeline)
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl,
       SUM(pf.Volume_bbl) OVER (PARTITION BY pf.PipelineID
                                ORDER BY pf.FlowDate
                                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS CumThroughput
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.PipelineID, pf.FlowDate;

-- 5. Invoice running balance by customer ordered by InvoiceDate
SELECT i.CustomerID, i.InvoiceDate, i.AmountDue,
       SUM(i.AmountDue) OVER (PARTITION BY i.CustomerID
                              ORDER BY i.InvoiceDate
                              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunDue
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;

-- 6. Count of production rows per well alongside each row
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       COUNT(*) OVER (PARTITION BY p.WellID) AS RowsPerWell
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 7. Max daily oil seen so far per well (running max)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       MAX(p.Oil_bbl) OVER (PARTITION BY p.WellID
                            ORDER BY p.ProductionDate
                            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunMaxOil
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 8. Average RatePerBbl per product (windowed, no GROUP BY)
SELECT s.ShipmentID, s.ProductID, s.RatePerBbl,
       AVG(s.RatePerBbl) OVER (PARTITION BY s.ProductID) AS AvgRatePerProduct
FROM oil_n_gas_company.Shipment s
ORDER BY s.ProductID, s.ShipmentID;

-- 9. Last 30 days oil per well as a window sum (relative to each row)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       SUM(p.Oil_bbl) OVER (PARTITION BY p.WellID
                            ORDER BY p.ProductionDate
                            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) AS Oil30d
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 10. Customer monthly invoice total annotated on each invoice of that month
SELECT i.CustomerID, i.InvoiceDate, i.AmountDue,
       SUM(i.AmountDue) OVER (PARTITION BY i.CustomerID, EOMONTH(i.InvoiceDate)) AS MonthAmtDue
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;
```

## ROW_NUMBER()
```sql
-- 1. Latest 3 production days per well
;WITH R AS (
  SELECT p.*, ROW_NUMBER() OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate DESC) AS rn
  FROM oil_n_gas_company.Production p
)
SELECT WellID, ProductionDate, Oil_bbl
FROM R WHERE rn <= 3
ORDER BY WellID, ProductionDate DESC;

-- 2. First shipment per customer (earliest ShipDate)
;WITH R AS (
  SELECT s.*, ROW_NUMBER() OVER (PARTITION BY s.ToCustomer ORDER BY s.ShipDate, s.ShipmentID) AS rn
  FROM oil_n_gas_company.Shipment s
)
SELECT ToCustomer, ShipmentID, ShipDate, ProductID, Volume_bbl
FROM R WHERE rn = 1
ORDER BY ToCustomer;

-- 3. Top 5 highest daily oil entries per well
;WITH R AS (
  SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
         ROW_NUMBER() OVER (PARTITION BY p.WellID ORDER BY p.Oil_bbl DESC, p.ProductionDate DESC) AS rn
  FROM oil_n_gas_company.Production p
)
SELECT * FROM R WHERE rn <= 5
ORDER BY WellID, rn;

-- 4. Pick latest payment per invoice
;WITH R AS (
  SELECT p.*, ROW_NUMBER() OVER (PARTITION BY p.InvoiceID ORDER BY p.PaymentDate DESC, p.PaymentID DESC) AS rn
  FROM oil_n_gas_company.Payment p
)
SELECT InvoiceID, PaymentID, PaymentDate, AmountPaid
FROM R WHERE rn = 1
ORDER BY InvoiceID;

-- 5. Latest drilling operation per well
;WITH R AS (
  SELECT d.*, ROW_NUMBER() OVER (PARTITION BY d.WellID ORDER BY d.StartDate DESC, d.OperationID DESC) AS rn
  FROM oil_n_gas_company.DrillingOperation d
)
SELECT WellID, OperationID, StartDate, EndDate, Status
FROM R WHERE rn = 1
ORDER BY WellID;

-- 6. First inventory snapshot per (Facility, Product)
;WITH R AS (
  SELECT i.*, ROW_NUMBER() OVER (PARTITION BY i.FacilityID, i.ProductID ORDER BY i.SnapshotDate, i.InventoryID) AS rn
  FROM oil_n_gas_company.Inventory i
)
SELECT FacilityID, ProductID, SnapshotDate, Quantity_bbl
FROM R WHERE rn = 1
ORDER BY FacilityID, ProductID;

-- 7. Top 3 invoice amounts per customer
;WITH R AS (
  SELECT i.*, ROW_NUMBER() OVER (PARTITION BY i.CustomerID ORDER BY i.AmountDue DESC, i.InvoiceDate DESC) AS rn
  FROM oil_n_gas_company.Invoice i
)
SELECT CustomerID, InvoiceID, InvoiceDate, AmountDue
FROM R WHERE rn <= 3
ORDER BY CustomerID, rn;

-- 8. First flow record per pipeline
;WITH R AS (
  SELECT pf.*, ROW_NUMBER() OVER (PARTITION BY pf.PipelineID ORDER BY pf.FlowDate, pf.FlowID) AS rn
  FROM oil_n_gas_company.PipelineFlow pf
)
SELECT PipelineID, FlowDate, Volume_bbl
FROM R WHERE rn = 1
ORDER BY PipelineID;

-- 9. Choose one open invoice per customer (arbitrary: latest)
;WITH R AS (
  SELECT i.*, ROW_NUMBER() OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate DESC, i.InvoiceID DESC) AS rn
  FROM oil_n_gas_company.Invoice i
  WHERE i.Status = 'Open'
)
SELECT CustomerID, InvoiceID, InvoiceDate, AmountDue
FROM R WHERE rn = 1
ORDER BY CustomerID;

-- 10. Most recent maintenance event per (AssetType, AssetID)
;WITH R AS (
  SELECT am.*, ROW_NUMBER() OVER (PARTITION BY am.AssetType, am.AssetID ORDER BY am.MaintDate DESC, am.MaintenanceID DESC) AS rn
  FROM oil_n_gas_company.AssetMaintenance am
)
SELECT AssetType, AssetID, MaintDate, Description, CostUSD
FROM R WHERE rn = 1
ORDER BY AssetType, AssetID;
```

## RANK()
```sql
-- 1. Rank wells by total monthly oil (latest month)
;WITH M AS (
  SELECT p.WellID,
         EOMONTH(p.ProductionDate) AS Mon,
         SUM(p.Oil_bbl) AS OilMon
  FROM oil_n_gas_company.Production p
  GROUP BY p.WellID, EOMONTH(p.ProductionDate)
),
L AS (
  SELECT MAX(Mon) AS LastMon FROM M
)
SELECT m.WellID, m.OilMon,
       RANK() OVER (ORDER BY m.OilMon DESC) AS OilRank
FROM M m CROSS JOIN L
WHERE m.Mon = L.LastMon
ORDER BY OilRank, m.WellID;

-- 2. Rank customers by invoice amount (overall)
SELECT i.CustomerID, SUM(i.AmountDue) AS TotalDue,
       RANK() OVER (ORDER BY SUM(i.AmountDue) DESC) AS DueRank
FROM oil_n_gas_company.Invoice i
GROUP BY i.CustomerID
ORDER BY DueRank;

-- 3. Rank products by shipment revenue (current quarter)
SELECT s.ProductID,
       SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS Revenue,
       RANK() OVER (ORDER BY SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) DESC) AS RevRank
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate >= DATEADD(QUARTER, DATEDIFF(QUARTER, 0, GETDATE()), 0)
GROUP BY s.ProductID
ORDER BY RevRank;

-- 4. Rank fields by average daily gas
SELECT f.FieldID, AVG(p.Gas_mcf) AS AvgGas,
       RANK() OVER (ORDER BY AVG(p.Gas_mcf) DESC) AS GasRank
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
GROUP BY f.FieldID
ORDER BY GasRank;

-- 5. Rank pipelines by last 30 days throughput
SELECT pf.PipelineID, SUM(pf.Volume_bbl) AS Vol30d,
       RANK() OVER (ORDER BY SUM(pf.Volume_bbl) DESC) AS ThruRank
FROM oil_n_gas_company.PipelineFlow pf
WHERE pf.FlowDate > DATEADD(DAY, -30, CAST(GETDATE() AS date))
GROUP BY pf.PipelineID
ORDER BY ThruRank;

-- 6. Rank customers by average days to pay
SELECT i.CustomerID,
       AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) AS AvgDaysToPay,
       RANK() OVER (ORDER BY AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) ASC) AS FastPayRank
FROM oil_n_gas_company.Payment p
JOIN oil_n_gas_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
GROUP BY i.CustomerID
ORDER BY FastPayRank;

-- 7. Rank wells by maximum single-day oil
SELECT p.WellID, MAX(p.Oil_bbl) AS PeakOil,
       RANK() OVER (ORDER BY MAX(p.Oil_bbl) DESC) AS PeakRank
FROM oil_n_gas_company.Production p
GROUP BY p.WellID
ORDER BY PeakRank;

-- 8. Rank months (overall) by total shipment revenue
SELECT EOMONTH(s.ShipDate) AS Mon,
       SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS Revenue,
       RANK() OVER (ORDER BY SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) DESC) AS RevRank
FROM oil_n_gas_company.Shipment s
GROUP BY EOMONTH(s.ShipDate)
ORDER BY RevRank;

-- 9. Rank products by average RatePerBbl
SELECT s.ProductID, AVG(s.RatePerBbl) AS AvgRate,
       RANK() OVER (ORDER BY AVG(s.RatePerBbl) DESC) AS RateRank
FROM oil_n_gas_company.Shipment s
GROUP BY s.ProductID
ORDER BY RateRank;

-- 10. Rank facilities by average inventory quantity
SELECT i.FacilityID, AVG(i.Quantity_bbl) AS AvgQty,
       RANK() OVER (ORDER BY AVG(i.Quantity_bbl) DESC) AS InvRank
FROM oil_n_gas_company.Inventory i
GROUP BY i.FacilityID
ORDER BY InvRank;
```

## DENSE_RANK()
```sql
-- 1. Dense rank wells by monthly oil within each month (handles ties)
SELECT EOMONTH(p.ProductionDate) AS Mon, p.WellID,
       SUM(p.Oil_bbl) AS OilMon,
       DENSE_RANK() OVER (PARTITION BY EOMONTH(p.ProductionDate)
                          ORDER BY SUM(p.Oil_bbl) DESC) AS DRankInMonth
FROM oil_n_gas_company.Production p
GROUP BY EOMONTH(p.ProductionDate), p.WellID
ORDER BY Mon DESC, DRankInMonth, WellID;

-- 2. Dense rank customers by monthly invoice total
SELECT EOMONTH(i.InvoiceDate) AS Mon, i.CustomerID,
       SUM(i.AmountDue) AS MonDue,
       DENSE_RANK() OVER (PARTITION BY EOMONTH(i.InvoiceDate)
                          ORDER BY SUM(i.AmountDue) DESC) AS DRank
FROM oil_n_gas_company.Invoice i
GROUP BY EOMONTH(i.InvoiceDate), i.CustomerID
ORDER BY Mon DESC, DRank;

-- 3. Dense rank pipelines by monthly flow
SELECT EOMONTH(pf.FlowDate) AS Mon, pf.PipelineID,
       SUM(pf.Volume_bbl) AS MonVol,
       DENSE_RANK() OVER (PARTITION BY EOMONTH(pf.FlowDate)
                          ORDER BY SUM(pf.Volume_bbl) DESC) AS DRank
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY EOMONTH(pf.FlowDate), pf.PipelineID
ORDER BY Mon DESC, DRank;

-- 4. Dense rank products by shipment revenue per month
SELECT EOMONTH(s.ShipDate) AS Mon, s.ProductID,
       SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS MonRev,
       DENSE_RANK() OVER (PARTITION BY EOMONTH(s.ShipDate)
                          ORDER BY SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) DESC) AS DRank
FROM oil_n_gas_company.Shipment s
GROUP BY EOMONTH(s.ShipDate), s.ProductID
ORDER BY Mon DESC, DRank;

-- 5. Dense rank fields by maximum single-day gas per month
SELECT EOMONTH(p.ProductionDate) AS Mon, f.FieldID,
       MAX(p.Gas_mcf) AS PeakGas,
       DENSE_RANK() OVER (PARTITION BY EOMONTH(p.ProductionDate)
                          ORDER BY MAX(p.Gas_mcf) DESC) AS DRank
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
GROUP BY EOMONTH(p.ProductionDate), f.FieldID
ORDER BY Mon DESC, DRank;

-- 6. Dense rank customers by average days-to-pay each quarter
SELECT DATEFROMPARTS(YEAR(p.PaymentDate), ((DATEPART(QUARTER,p.PaymentDate)-1)*3)+1, 1) AS QtrStart,
       i.CustomerID,
       AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) AS AvgDays,
       DENSE_RANK() OVER (PARTITION BY DATEFROMPARTS(YEAR(p.PaymentDate), ((DATEPART(QUARTER,p.PaymentDate)-1)*3)+1, 1)
                          ORDER BY AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) ASC) AS DRankFast
FROM oil_n_gas_company.Payment p
JOIN oil_n_gas_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
GROUP BY DATEFROMPARTS(YEAR(p.PaymentDate), ((DATEPART(QUARTER,p.PaymentDate)-1)*3)+1, 1), i.CustomerID
ORDER BY QtrStart DESC, DRankFast;

-- 7. Dense rank wells by monthly oil within field
SELECT f.FieldID, EOMONTH(p.ProductionDate) AS Mon, p.WellID,
       SUM(p.Oil_bbl) AS OilMon,
       DENSE_RANK() OVER (PARTITION BY f.FieldID, EOMONTH(p.ProductionDate)
                          ORDER BY SUM(p.Oil_bbl) DESC) AS DRank
FROM oil_n_gas_company.Production p
JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
GROUP BY f.FieldID, EOMONTH(p.ProductionDate), p.WellID
ORDER BY f.FieldID, Mon DESC, DRank;

-- 8. Dense rank facilities by average inventory in latest month
;WITH LMon AS (SELECT MAX(EOMONTH(SnapshotDate)) AS M FROM oil_n_gas_company.Inventory)
SELECT i.FacilityID,
       AVG(i.Quantity_bbl) AS AvgQty,
       DENSE_RANK() OVER (ORDER BY AVG(i.Quantity_bbl) DESC) AS DRank
FROM oil_n_gas_company.Inventory i CROSS JOIN LMon
WHERE EOMONTH(i.SnapshotDate) = LMon.M
GROUP BY i.FacilityID
ORDER BY DRank;

-- 9. Dense rank products by average observed RatePerBbl in latest month
;WITH LMon AS (SELECT MAX(EOMONTH(ShipDate)) AS M FROM oil_n_gas_company.Shipment)
SELECT s.ProductID, AVG(s.RatePerBbl) AS AvgRate,
       DENSE_RANK() OVER (ORDER BY AVG(s.RatePerBbl) DESC) AS DRank
FROM oil_n_gas_company.Shipment s CROSS JOIN LMon
WHERE EOMONTH(s.ShipDate) = LMon.M
GROUP BY s.ProductID
ORDER BY DRank;

-- 10. Dense rank regions by sum of field max daily oil (proxy strength)
SELECT r.RegionID,
       SUM(X.MaxOil) AS SumOfFieldPeaks,
       DENSE_RANK() OVER (ORDER BY SUM(X.MaxOil) DESC) AS DRank
FROM (
  SELECT f.FieldID, MAX(p.Oil_bbl) AS MaxOil
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
  GROUP BY f.FieldID
) X
JOIN oil_n_gas_company.Field f ON f.FieldID = X.FieldID
JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID
GROUP BY r.RegionID
ORDER BY DRank;
```

## NTILE(n)
```sql
-- 1. Quartiles of wells by average daily oil
;WITH A AS (
  SELECT p.WellID, AVG(p.Oil_bbl) AS AvgOil
  FROM oil_n_gas_company.Production p
  GROUP BY p.WellID
)
SELECT WellID, AvgOil, NTILE(4) OVER (ORDER BY AvgOil DESC) AS OilQuartile
FROM A
ORDER BY OilQuartile, AvgOil DESC;

-- 2. Deciles of customers by total invoice amount
;WITH T AS (
  SELECT i.CustomerID, SUM(i.AmountDue) AS TotalDue
  FROM oil_n_gas_company.Invoice i
  GROUP BY i.CustomerID
)
SELECT CustomerID, TotalDue, NTILE(10) OVER (ORDER BY TotalDue DESC) AS DueDecile
FROM T
ORDER BY DueDecile, TotalDue DESC;

-- 3. Quintiles of pipelines by last 30-day flow
;WITH T AS (
  SELECT pf.PipelineID, SUM(pf.Volume_bbl) AS Vol30d
  FROM oil_n_gas_company.PipelineFlow pf
  WHERE pf.FlowDate > DATEADD(DAY, -30, CAST(GETDATE() AS date))
  GROUP BY pf.PipelineID
)
SELECT PipelineID, Vol30d, NTILE(5) OVER (ORDER BY Vol30d DESC) AS ThruQuint
FROM T
ORDER BY ThruQuint, Vol30d DESC;

-- 4. Quartiles of products by average RatePerBbl
;WITH T AS (
  SELECT s.ProductID, AVG(s.RatePerBbl) AS AvgRate
  FROM oil_n_gas_company.Shipment s
  GROUP BY s.ProductID
)
SELECT ProductID, AvgRate, NTILE(4) OVER (ORDER BY AvgRate DESC) AS RateQuartile
FROM T
ORDER BY RateQuartile, AvgRate DESC;

-- 5. Quartiles of fields by average gas
;WITH T AS (
  SELECT f.FieldID, AVG(p.Gas_mcf) AS AvgGas
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
  GROUP BY f.FieldID
)
SELECT FieldID, AvgGas, NTILE(4) OVER (ORDER BY AvgGas DESC) AS GasQuartile
FROM T
ORDER BY GasQuartile, AvgGas DESC;

-- 6. NTILE(3): facilities by average inventory
;WITH T AS (
  SELECT i.FacilityID, AVG(i.Quantity_bbl) AS AvgQty
  FROM oil_n_gas_company.Inventory i
  GROUP BY i.FacilityID
)
SELECT FacilityID, AvgQty, NTILE(3) OVER (ORDER BY AvgQty DESC) AS InvTercile
FROM T
ORDER BY InvTercile, AvgQty DESC;

-- 7. NTILE(6): wells by maximum daily oil
;WITH T AS (
  SELECT p.WellID, MAX(p.Oil_bbl) AS MaxOil
  FROM oil_n_gas_company.Production p
  GROUP BY p.WellID
)
SELECT WellID, MaxOil, NTILE(6) OVER (ORDER BY MaxOil DESC) AS PeakSextile
FROM T
ORDER BY PeakSextile, MaxOil DESC;

-- 8. NTILE(4): customers by average days-to-pay (ascending → lower is better)
;WITH T AS (
  SELECT i.CustomerID, AVG(DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate)) AS AvgDays
  FROM oil_n_gas_company.Payment p
  JOIN oil_n_gas_company.Invoice i
    ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  GROUP BY i.CustomerID
)
SELECT CustomerID, AvgDays, NTILE(4) OVER (ORDER BY AvgDays ASC) AS SpeedQuartile
FROM T
ORDER BY SpeedQuartile, AvgDays;

-- 9. NTILE(8): shipments by RatePerBbl (price bands)
SELECT s.ShipmentID, s.RatePerBbl,
       NTILE(8) OVER (ORDER BY s.RatePerBbl DESC) AS PriceOctile
FROM oil_n_gas_company.Shipment s
ORDER BY PriceOctile, s.RatePerBbl DESC;

-- 10. NTILE(4): regions by sum of field average oil
;WITH FAvg AS (
  SELECT f.FieldID, AVG(p.Oil_bbl) AS AvgOil
  FROM oil_n_gas_company.Production p
  JOIN oil_n_gas_company.Well w ON w.WellID = p.WellID
  JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
  GROUP BY f.FieldID
),
R AS (
  SELECT r.RegionID, SUM(FAvg.AvgOil) AS RegionOil
  FROM FAvg
  JOIN oil_n_gas_company.Field f ON f.FieldID = FAvg.FieldID
  JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID
  GROUP BY r.RegionID
)
SELECT RegionID, RegionOil, NTILE(4) OVER (ORDER BY RegionOil DESC) AS RegionQuartile
FROM R
ORDER BY RegionQuartile, RegionOil DESC;
```

## LAG()
```sql
-- 1. Day-over-day change in oil per well
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       p.Oil_bbl - LAG(p.Oil_bbl, 1) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate) AS DoD_Change
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 2. Day-over-day % change (safe divide)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       CAST(100.0 * (p.Oil_bbl - LAG(p.Oil_bbl) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate))
            / NULLIF(LAG(p.Oil_bbl) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate), 0) AS decimal(7,2)) AS DoD_Pct
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 3. Shipment RatePerBbl delta vs previous shipment for the same customer
SELECT s.ToCustomer AS CustomerID, s.ShipmentID, s.ShipDate, s.RatePerBbl,
       s.RatePerBbl - LAG(s.RatePerBbl) OVER (PARTITION BY s.ToCustomer ORDER BY s.ShipDate, s.ShipmentID) AS RateDelta
FROM oil_n_gas_company.Shipment s
ORDER BY CustomerID, s.ShipDate, s.ShipmentID;

-- 4. Invoice amount change vs prior invoice per customer
SELECT i.CustomerID, i.InvoiceID, i.InvoiceDate, i.AmountDue,
       i.AmountDue - LAG(i.AmountDue) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate, i.InvoiceID) AS AmtDelta
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;

-- 5. Flow change per pipeline
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl,
       pf.Volume_bbl - LAG(pf.Volume_bbl) OVER (PARTITION BY pf.PipelineID ORDER BY pf.FlowDate) AS DeltaVol
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.PipelineID, pf.FlowDate;

-- 6. Days between maintenance events per asset
SELECT am.AssetType, am.AssetID, am.MaintDate,
       DATEDIFF(DAY, LAG(am.MaintDate) OVER (PARTITION BY am.AssetType, am.AssetID ORDER BY am.MaintDate), am.MaintDate) AS DaysSincePrev
FROM oil_n_gas_company.AssetMaintenance am
ORDER BY am.AssetType, am.AssetID, am.MaintDate;

-- 7. Gas_mcf change 7 days back per well
SELECT p.WellID, p.ProductionDate, p.Gas_mcf,
       p.Gas_mcf - LAG(p.Gas_mcf, 7) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate) AS Gas_7d_Delta
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 8. Rate change per product across shipments (by ShipDate)
SELECT s.ProductID, s.ShipDate, s.RatePerBbl,
       s.RatePerBbl - LAG(s.RatePerBbl) OVER (PARTITION BY s.ProductID ORDER BY s.ShipDate, s.ShipmentID) AS RateDelta
FROM oil_n_gas_company.Shipment s
ORDER BY s.ProductID, s.ShipDate;

-- 9. Customer running total of payments and increment since last payment
;WITH P AS (
  SELECT i.CustomerID, p.PaymentDate, p.AmountPaid,
         SUM(p.AmountPaid) OVER (PARTITION BY i.CustomerID ORDER BY p.PaymentDate, p.PaymentID) AS RunPaid
  FROM oil_n_gas_company.Payment p
  JOIN oil_n_gas_company.Invoice i
    ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
)
SELECT CustomerID, PaymentDate, AmountPaid, RunPaid,
       RunPaid - LAG(RunPaid) OVER (PARTITION BY CustomerID ORDER BY PaymentDate) AS DeltaRun
FROM P
ORDER BY CustomerID, PaymentDate;

-- 10. Oil deviation from previous month’s average per well
;WITH M AS (
  SELECT WellID, EOMONTH(ProductionDate) AS Mon, AVG(Oil_bbl) AS AvgOilMon
  FROM oil_n_gas_company.Production
  GROUP BY WellID, EOMONTH(ProductionDate)
)
SELECT WellID, Mon, AvgOilMon,
       AvgOilMon - LAG(AvgOilMon) OVER (PARTITION BY WellID ORDER BY Mon) AS DeltaVsPrevMon
FROM M
ORDER BY WellID, Mon;
```

## LEAD()
```sql
-- 1. Next day oil per well and next-day change
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       LEAD(p.Oil_bbl) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate) AS NextOil,
       LEAD(p.Oil_bbl) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate) - p.Oil_bbl AS ChangeToNext
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 2. Next maintenance date per asset and gap in days
SELECT am.AssetType, am.AssetID, am.MaintDate,
       LEAD(am.MaintDate) OVER (PARTITION BY am.AssetType, am.AssetID ORDER BY am.MaintDate) AS NextMaint,
       DATEDIFF(DAY, am.MaintDate,
                LEAD(am.MaintDate) OVER (PARTITION BY am.AssetType, am.AssetID ORDER BY am.MaintDate)) AS DaysToNext
FROM oil_n_gas_company.AssetMaintenance am
ORDER BY am.AssetType, am.AssetID, am.MaintDate;

-- 3. Next shipment rate per product (to anticipate price)
SELECT s.ProductID, s.ShipDate, s.RatePerBbl,
       LEAD(s.RatePerBbl) OVER (PARTITION BY s.ProductID ORDER BY s.ShipDate, s.ShipmentID) AS NextRate
FROM oil_n_gas_company.Shipment s
ORDER BY s.ProductID, s.ShipDate;

-- 4. Next payment date per invoice
SELECT p.InvoiceID, p.PaymentDate,
       LEAD(p.PaymentDate) OVER (PARTITION BY p.InvoiceID ORDER BY p.PaymentDate) AS NextPayDate
FROM oil_n_gas_company.Payment p
ORDER BY p.InvoiceID, p.PaymentDate;

-- 5. Next pipeline flow value per pipeline
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl,
       LEAD(pf.Volume_bbl) OVER (PARTITION BY pf.PipelineID ORDER BY pf.FlowDate) AS NextVol
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.PipelineID, pf.FlowDate;

-- 6. Next month invoice amount per customer
SELECT i.CustomerID, i.InvoiceDate, i.AmountDue,
       LEAD(i.AmountDue) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate) AS NextInvoiceAmt
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;

-- 7. Next drilling operation status per well
SELECT d.WellID, d.OperationID, d.StartDate, d.Status,
       LEAD(d.Status) OVER (PARTITION BY d.WellID ORDER BY d.StartDate, d.OperationID) AS NextStatus
FROM oil_n_gas_company.DrillingOperation d
ORDER BY d.WellID, d.StartDate;

-- 8. Next inventory quantity per (Facility, Product)
SELECT i.FacilityID, i.ProductID, i.SnapshotDate, i.Quantity_bbl,
       LEAD(i.Quantity_bbl) OVER (PARTITION BY i.FacilityID, i.ProductID ORDER BY i.SnapshotDate, i.InventoryID) AS NextQty
FROM oil_n_gas_company.Inventory i
ORDER BY i.FacilityID, i.ProductID, i.SnapshotDate;

-- 9. Next day gas change per well
SELECT p.WellID, p.ProductionDate, p.Gas_mcf,
       LEAD(p.Gas_mcf) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate) - p.Gas_mcf AS GasChangeToNext
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 10. Next invoice date and gap days per customer
SELECT i.CustomerID, i.InvoiceDate,
       LEAD(i.InvoiceDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate) AS NextInvDate,
       DATEDIFF(DAY, i.InvoiceDate,
                LEAD(i.InvoiceDate) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate)) AS DaysToNextInv
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;
```

## FIRST_VALUE()
```sql
-- 1. First production date & value per well (shown on every row)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       FIRST_VALUE(p.ProductionDate) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate
                                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstProdDate,
       FIRST_VALUE(p.Oil_bbl) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate
                                    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstOil
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 2. First shipment rate per customer
SELECT s.ToCustomer AS CustomerID, s.ShipDate, s.RatePerBbl,
       FIRST_VALUE(s.RatePerBbl) OVER (PARTITION BY s.ToCustomer ORDER BY s.ShipDate, s.ShipmentID
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstRate
FROM oil_n_gas_company.Shipment s
ORDER BY CustomerID, s.ShipDate;

-- 3. First maintenance date per asset
SELECT am.AssetType, am.AssetID, am.MaintDate,
       FIRST_VALUE(am.MaintDate) OVER (PARTITION BY am.AssetType, am.AssetID ORDER BY am.MaintDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstMaintDate
FROM oil_n_gas_company.AssetMaintenance am
ORDER BY am.AssetType, am.AssetID, am.MaintDate;

-- 4. First flow date/volume per pipeline
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl,
       FIRST_VALUE(pf.FlowDate)  OVER (PARTITION BY pf.PipelineID ORDER BY pf.FlowDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstFlowDate,
       FIRST_VALUE(pf.Volume_bbl)OVER (PARTITION BY pf.PipelineID ORDER BY pf.FlowDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstFlowVol
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.PipelineID, pf.FlowDate;

-- 5. First invoice amount per customer
SELECT i.CustomerID, i.InvoiceDate, i.AmountDue,
       FIRST_VALUE(i.AmountDue) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstInvAmt
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;

-- 6. First drilling status per well
SELECT d.WellID, d.StartDate, d.Status,
       FIRST_VALUE(d.Status) OVER (PARTITION BY d.WellID ORDER BY d.StartDate, d.OperationID
                                   ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstStatus
FROM oil_n_gas_company.DrillingOperation d
ORDER BY d.WellID, d.StartDate;

-- 7. First observed RatePerBbl per product
SELECT s.ProductID, s.ShipDate, s.RatePerBbl,
       FIRST_VALUE(s.RatePerBbl) OVER (PARTITION BY s.ProductID ORDER BY s.ShipDate, s.ShipmentID
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstRate
FROM oil_n_gas_company.Shipment s
ORDER BY s.ProductID, s.ShipDate;

-- 8. First snapshot quantity per (Facility, Product)
SELECT i.FacilityID, i.ProductID, i.SnapshotDate, i.Quantity_bbl,
       FIRST_VALUE(i.Quantity_bbl) OVER (PARTITION BY i.FacilityID, i.ProductID ORDER BY i.SnapshotDate, i.InventoryID
                                         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstQty
FROM oil_n_gas_company.Inventory i
ORDER BY i.FacilityID, i.ProductID, i.SnapshotDate;

-- 9. First payment amount per invoice
SELECT p.InvoiceID, p.PaymentDate, p.AmountPaid,
       FIRST_VALUE(p.AmountPaid) OVER (PARTITION BY p.InvoiceID ORDER BY p.PaymentDate, p.PaymentID
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstPayAmt
FROM oil_n_gas_company.Payment p
ORDER BY p.InvoiceID, p.PaymentDate;

-- 10. First Oil_bbl for each month per well (window across the month)
SELECT p.WellID, EOMONTH(p.ProductionDate) AS Mon, p.ProductionDate, p.Oil_bbl,
       FIRST_VALUE(p.Oil_bbl) OVER (PARTITION BY p.WellID, EOMONTH(p.ProductionDate)
                                    ORDER BY p.ProductionDate
                                    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstOilInMon
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, Mon, p.ProductionDate;
```

## LAST_VALUE()
```sql
-- 1. Last production date & oil per well (on each row)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl,
       LAST_VALUE(p.ProductionDate) OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate
                                          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastProdDate,
       LAST_VALUE(p.Oil_bbl)        OVER (PARTITION BY p.WellID ORDER BY p.ProductionDate
                                          ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastOil
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, p.ProductionDate;

-- 2. Latest shipment rate per customer (shown on all rows)
SELECT s.ToCustomer AS CustomerID, s.ShipDate, s.RatePerBbl,
       LAST_VALUE(s.RatePerBbl) OVER (PARTITION BY s.ToCustomer ORDER BY s.ShipDate, s.ShipmentID
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LatestRate
FROM oil_n_gas_company.Shipment s
ORDER BY CustomerID, s.ShipDate;

-- 3. Last maintenance date per asset
SELECT am.AssetType, am.AssetID, am.MaintDate,
       LAST_VALUE(am.MaintDate) OVER (PARTITION BY am.AssetType, am.AssetID ORDER BY am.MaintDate
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastMaintDate
FROM oil_n_gas_company.AssetMaintenance am
ORDER BY am.AssetType, am.AssetID, am.MaintDate;

-- 4. Latest flow volume per pipeline
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl,
       LAST_VALUE(pf.Volume_bbl) OVER (PARTITION BY pf.PipelineID ORDER BY pf.FlowDate
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LatestVol
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.PipelineID, pf.FlowDate;

-- 5. Last invoice amount per customer
SELECT i.CustomerID, i.InvoiceDate, i.AmountDue,
       LAST_VALUE(i.AmountDue) OVER (PARTITION BY i.CustomerID ORDER BY i.InvoiceDate
                                     ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastInvAmt
FROM oil_n_gas_company.Invoice i
ORDER BY i.CustomerID, i.InvoiceDate;

-- 6. Last drilling status per well
SELECT d.WellID, d.StartDate, d.Status,
       LAST_VALUE(d.Status) OVER (PARTITION BY d.WellID ORDER BY d.StartDate, d.OperationID
                                  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastStatus
FROM oil_n_gas_company.DrillingOperation d
ORDER BY d.WellID, d.StartDate;

-- 7. Latest observed RatePerBbl per product
SELECT s.ProductID, s.ShipDate, s.RatePerBbl,
       LAST_VALUE(s.RatePerBbl) OVER (PARTITION BY s.ProductID ORDER BY s.ShipDate, s.ShipmentID
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LatestRate
FROM oil_n_gas_company.Shipment s
ORDER BY s.ProductID, s.ShipDate;

-- 8. Last snapshot quantity per (Facility, Product)
SELECT i.FacilityID, i.ProductID, i.SnapshotDate, i.Quantity_bbl,
       LAST_VALUE(i.Quantity_bbl) OVER (PARTITION BY i.FacilityID, i.ProductID ORDER BY i.SnapshotDate, i.InventoryID
                                        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastQty
FROM oil_n_gas_company.Inventory i
ORDER BY i.FacilityID, i.ProductID, i.SnapshotDate;

-- 9. Last payment amount per invoice
SELECT p.InvoiceID, p.PaymentDate, p.AmountPaid,
       LAST_VALUE(p.AmountPaid) OVER (PARTITION BY p.InvoiceID ORDER BY p.PaymentDate, p.PaymentID
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastPayAmt
FROM oil_n_gas_company.Payment p
ORDER BY p.InvoiceID, p.PaymentDate;

-- 10. Last Oil_bbl in each month per well (month-end)
SELECT p.WellID, EOMONTH(p.ProductionDate) AS Mon, p.ProductionDate, p.Oil_bbl,
       LAST_VALUE(p.Oil_bbl) OVER (PARTITION BY p.WellID, EOMONTH(p.ProductionDate)
                                   ORDER BY p.ProductionDate
                                   ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastOilInMon
FROM oil_n_gas_company.Production p
ORDER BY p.WellID, Mon, p.ProductionDate;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
