![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Show current date/time (server local) and UTC
SELECT GETDATE() AS NowLocal, GETUTCDATE() AS NowUtc, SYSDATETIME() AS SysDT, SYSUTCDATETIME() AS SysDT_Utc;

-- 2. Today's shipments (by ShipDate)
SELECT COUNT(*) AS TodayShipments
FROM oil_n_gas_company.Shipment
WHERE ShipDate = CAST(GETDATE() AS date);

-- 3. Current month shipment value so far
SELECT SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS MonthToDateValue
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
  AND s.ShipDate <= CAST(GETDATE() AS date);

-- 4. Wells spudded in the last 90 days (relative to today)
SELECT w.WellID, w.Name, w.SpudDate
FROM oil_n_gas_company.Well w
WHERE w.SpudDate IS NOT NULL
  AND w.SpudDate >= DATEADD(DAY, -90, CAST(GETDATE() AS date))
ORDER BY w.SpudDate DESC;

-- 5. Fields discovered more than 25 years ago (as of today)
SELECT f.FieldID, f.Name, f.DiscoveryDate, DATEDIFF(YEAR, f.DiscoveryDate, GETDATE()) AS YearsOld
FROM oil_n_gas_company.Field f
WHERE f.DiscoveryDate IS NOT NULL
  AND DATEDIFF(YEAR, f.DiscoveryDate, GETDATE()) > 25
ORDER BY YearsOld DESC;

-- 6. Production records in the last 7 days (ending today)
SELECT p.WellID, p.ProductionDate, p.Oil_bbl, p.Gas_mcf
FROM oil_n_gas_company.Production p
WHERE p.ProductionDate > DATEADD(DAY, -7, CAST(GETDATE() AS date))
  AND p.ProductionDate <= CAST(GETDATE() AS date)
ORDER BY p.WellID, p.ProductionDate DESC;

-- 7. Open invoices older than 30 days (aging snapshot today)
SELECT i.InvoiceID, i.CustomerID, i.InvoiceDate, i.AmountDue, i.Status,
       DATEDIFF(DAY, i.InvoiceDate, CAST(GETDATE() AS date)) AS AgeDays
FROM oil_n_gas_company.Invoice i
WHERE i.Status = 'Open'
  AND DATEDIFF(DAY, i.InvoiceDate, CAST(GETDATE() AS date)) > 30
ORDER BY AgeDays DESC;

-- 8. Payments posted today
SELECT p.PaymentID, p.InvoiceID, p.InvoiceDate, p.PaymentDate, p.AmountPaid
FROM oil_n_gas_company.Payment p
WHERE p.PaymentDate = CAST(GETDATE() AS date);

-- 9. Contracts active today (StartDate <= today AND (EndDate IS NULL OR EndDate >= today))
SELECT sc.ContractID, sc.CustomerID, sc.ProductID, sc.StartDate, sc.EndDate
FROM oil_n_gas_company.SalesContract sc
WHERE sc.StartDate <= CAST(GETDATE() AS date)
  AND (sc.EndDate IS NULL OR sc.EndDate >= CAST(GETDATE() AS date));

-- 10. Last 24 hours drilling ops started (assuming StartDate timezone aligned to server)
SELECT d.OperationID, d.WellID, d.StartDate
FROM oil_n_gas_company.DrillingOperation d
WHERE d.StartDate >= DATEADD(HOUR, -24, GETDATE())
ORDER BY d.StartDate DESC;
```

## Date Part Function (DATEPART)
```sql
-- 1. Shipments per year, month
SELECT DATEPART(YEAR, s.ShipDate) AS ShipYear,
       DATEPART(MONTH, s.ShipDate) AS ShipMonth,
       COUNT(*) AS Shipments
FROM oil_n_gas_company.Shipment s
GROUP BY DATEPART(YEAR, s.ShipDate), DATEPART(MONTH, s.ShipDate)
ORDER BY ShipYear DESC, ShipMonth DESC;

-- 2. Average daily oil by production quarter
SELECT DATEPART(YEAR, p.ProductionDate) AS ProdYear,
       DATEPART(QUARTER, p.ProductionDate) AS ProdQtr,
       AVG(p.Oil_bbl) AS AvgOil_bbl
FROM oil_n_gas_company.Production p
GROUP BY DATEPART(YEAR, p.ProductionDate), DATEPART(QUARTER, p.ProductionDate)
ORDER BY ProdYear DESC, ProdQtr DESC;

-- 3. Drilling starts by hour of day
SELECT DATEPART(HOUR, d.StartDate) AS StartHour, COUNT(*) AS Starts
FROM oil_n_gas_company.DrillingOperation d
GROUP BY DATEPART(HOUR, d.StartDate)
ORDER BY StartHour;

-- 4. PipelineFlow volume by ISO week number
SELECT DATEPART(ISO_WEEK, pf.FlowDate) AS IsoWeek,
       DATEPART(YEAR, pf.FlowDate) AS FlowYear,
       SUM(pf.Volume_bbl) AS Vol_bbl
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY DATEPART(YEAR, pf.FlowDate), DATEPART(ISO_WEEK, pf.FlowDate)
ORDER BY FlowYear DESC, IsoWeek DESC;

-- 5. Inventory snapshots by weekday number (1..7)
SELECT DATEPART(WEEKDAY, i.SnapshotDate) AS WkDay, COUNT(*) AS Snaps
FROM oil_n_gas_company.Inventory i
GROUP BY DATEPART(WEEKDAY, i.SnapshotDate)
ORDER BY WkDay;

-- 6. Day-of-year of invoice dates (first 10)
SELECT TOP (10) i.InvoiceID, i.InvoiceDate, DATEPART(DAYOFYEAR, i.InvoiceDate) AS DayOfYear
FROM oil_n_gas_company.Invoice i
ORDER BY i.InvoiceDate DESC;

-- 7. Contracts started by month name
SELECT DATENAME(MONTH, sc.StartDate) AS StartMonth, COUNT(*) AS Cnt
FROM oil_n_gas_company.SalesContract sc
GROUP BY DATENAME(MONTH, sc.StartDate)
ORDER BY Cnt DESC;

-- 8. Production by day name (oil average)
SELECT DATENAME(WEEKDAY, p.ProductionDate) AS DayName,
       AVG(p.Oil_bbl) AS AvgOil
FROM oil_n_gas_company.Production p
GROUP BY DATENAME(WEEKDAY, p.ProductionDate)
ORDER BY AvgOil DESC;

-- 9. Payments by quarter and year
SELECT DATEPART(YEAR, p.PaymentDate) AS PayYear,
       DATEPART(QUARTER, p.PaymentDate) AS PayQtr,
       SUM(p.AmountPaid) AS Paid
FROM oil_n_gas_company.Payment p
GROUP BY DATEPART(YEAR, p.PaymentDate), DATEPART(QUARTER, p.PaymentDate)
ORDER BY PayYear DESC, PayQtr DESC;

-- 10. Drilling end months frequency
SELECT DATEPART(MONTH, d.EndDate) AS EndMonth, COUNT(*) AS Ops
FROM oil_n_gas_company.DrillingOperation d
WHERE d.EndDate IS NOT NULL
GROUP BY DATEPART(MONTH, d.EndDate)
ORDER BY EndMonth;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days since well spud
SELECT w.WellID, w.Name, w.SpudDate,
       DATEDIFF(DAY, w.SpudDate, CAST(GETDATE() AS date)) AS DaysSinceSpud
FROM oil_n_gas_company.Well w
WHERE w.SpudDate IS NOT NULL
ORDER BY DaysSinceSpud DESC;

-- 2. Drilling duration (days)
SELECT d.OperationID, d.WellID, d.StartDate, d.EndDate,
       DATEDIFF(DAY, d.StartDate, ISNULL(d.EndDate, SYSDATETIME())) AS DurationDays
FROM oil_n_gas_company.DrillingOperation d
ORDER BY DurationDays DESC;

-- 3. Months since contract start
SELECT sc.ContractID, sc.StartDate,
       DATEDIFF(MONTH, sc.StartDate, CAST(GETDATE() AS date)) AS MonthsSinceStart
FROM oil_n_gas_company.SalesContract sc
ORDER BY MonthsSinceStart DESC;

-- 4. Days between invoice date and payment (per payment)
SELECT p.PaymentID, p.InvoiceID, p.InvoiceDate, p.PaymentDate,
       DATEDIFF(DAY, p.InvoiceDate, p.PaymentDate) AS DaysToPay
FROM oil_n_gas_company.Payment p
ORDER BY DaysToPay DESC;

-- 5. Days since last production per well
;WITH LastProd AS (
  SELECT WellID, MAX(ProductionDate) AS LastProdDate
  FROM oil_n_gas_company.Production GROUP BY WellID
)
SELECT lp.WellID, lp.LastProdDate,
       DATEDIFF(DAY, lp.LastProdDate, CAST(GETDATE() AS date)) AS DaysSinceLastProd
FROM LastProd lp
ORDER BY DaysSinceLastProd DESC;

-- 6. Days since last pipeline flow per pipeline
;WITH LastFlow AS (
  SELECT PipelineID, MAX(FlowDate) AS LastFlowDate
  FROM oil_n_gas_company.PipelineFlow GROUP BY PipelineID
)
SELECT lf.PipelineID, lf.LastFlowDate,
       DATEDIFF(DAY, lf.LastFlowDate, CAST(GETDATE() AS date)) AS DaysSinceFlow
FROM LastFlow lf
ORDER BY DaysSinceFlow DESC;

-- 7. Inventory recency per (Facility,Product)
;WITH LastSnap AS (
  SELECT FacilityID, ProductID, MAX(SnapshotDate) AS LastSnapDate
  FROM oil_n_gas_company.Inventory GROUP BY FacilityID, ProductID
)
SELECT ls.FacilityID, ls.ProductID, ls.LastSnapDate,
       DATEDIFF(DAY, ls.LastSnapDate, CAST(GETDATE() AS date)) AS DaysSinceSnap
FROM LastSnap ls
ORDER BY DaysSinceSnap DESC;

-- 8. Average drilling duration in days
SELECT AVG(DATEDIFF(DAY, d.StartDate, ISNULL(d.EndDate, SYSDATETIME()))) AS AvgDrillDays
FROM oil_n_gas_company.DrillingOperation d;

-- 9. Shipments lead time vs today (days)
SELECT TOP (20) s.ShipmentID, s.ShipDate,
       DATEDIFF(DAY, s.ShipDate, CAST(GETDATE() AS date)) AS DaysAgo
FROM oil_n_gas_company.Shipment s
ORDER BY s.ShipDate DESC;

-- 10. Years between field discovery and today
SELECT f.FieldID, f.Name, f.DiscoveryDate,
       DATEDIFF(YEAR, f.DiscoveryDate, CAST(GETDATE() AS date)) AS YearsSinceDiscovery
FROM oil_n_gas_company.Field f
WHERE f.DiscoveryDate IS NOT NULL
ORDER BY YearsSinceDiscovery DESC;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Contracts expiring in next 60 days
SELECT sc.ContractID, sc.CustomerID, sc.ProductID, sc.EndDate
FROM oil_n_gas_company.SalesContract sc
WHERE sc.EndDate IS NOT NULL
  AND sc.EndDate BETWEEN CAST(GETDATE() AS date) AND DATEADD(DAY, 60, CAST(GETDATE() AS date))
ORDER BY sc.EndDate;

-- 2. Prior month shipments (entire previous calendar month)
SELECT s.*
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0)
  AND s.ShipDate <  DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0);

-- 3. Rolling last 14 days production for a sample well (parameterized)
DECLARE @WellId bigint = (SELECT TOP 1 WellID FROM oil_n_gas_company.Production ORDER BY WellID);
DECLARE @RefDate date = CAST(GETDATE() AS date);
SELECT p.WellID, p.ProductionDate, p.Oil_bbl, p.Gas_mcf
FROM oil_n_gas_company.Production p
WHERE p.WellID = @WellId
  AND p.ProductionDate BETWEEN DATEADD(DAY, -13, @RefDate) AND @RefDate
ORDER BY p.ProductionDate;

-- 4. Payments within 5 days of invoice date
SELECT p.*
FROM oil_n_gas_company.Payment p
WHERE p.PaymentDate BETWEEN p.InvoiceDate AND DATEADD(DAY, 5, p.InvoiceDate);

-- 5. Add 30 days to latest maintenance per asset to suggest next check
;WITH LastMaint AS (
  SELECT AssetType, AssetID, MAX(MaintDate) AS LastMaint
  FROM oil_n_gas_company.AssetMaintenance
  GROUP BY AssetType, AssetID
)
SELECT AssetType, AssetID, LastMaint,
       DATEADD(DAY, 30, LastMaint) AS NextCheck
FROM LastMaint
ORDER BY AssetType, AssetID;

-- 6. Shipments in the next 7 calendar days from today (planning window)
SELECT s.*
FROM oil_n_gas_company.Shipment s
WHERE s.ShipDate BETWEEN CAST(GETDATE() AS date) AND DATEADD(DAY, 7, CAST(GETDATE() AS date))
ORDER BY s.ShipDate;

-- 7. Contracts starting in the next quarter
SELECT sc.*
FROM oil_n_gas_company.SalesContract sc
WHERE sc.StartDate >= DATEADD(QUARTER, DATEDIFF(QUARTER, 0, GETDATE()) + 1, 0)
  AND sc.StartDate <  DATEADD(QUARTER, DATEDIFF(QUARTER, 0, GETDATE()) + 2, 0);

-- 8. Production window: current week (Mon..Sun based on DATEFIRST defaults)
SELECT p.*
FROM oil_n_gas_company.Production p
WHERE p.ProductionDate >= DATEADD(DAY, - (DATEPART(WEEKDAY, GETDATE()) - 1), CAST(GETDATE() AS date))
  AND p.ProductionDate <  DATEADD(DAY, 7 - (DATEPART(WEEKDAY, GETDATE()) - 1), CAST(GETDATE() AS date));

-- 9. Add 90 days to invoice date as hypothetical due date and flag overdue
SELECT i.InvoiceID, i.CustomerID, i.InvoiceDate,
       DATEADD(DAY, 90, i.InvoiceDate) AS HypDueDate,
       CASE WHEN DATEADD(DAY, 90, i.InvoiceDate) < CAST(GETDATE() AS date) AND i.Status = 'Open' THEN 1 ELSE 0 END AS OverdueFlag
FROM oil_n_gas_company.Invoice i;

-- 10. PipelineFlow last 30 days aggregated per pipeline
SELECT pf.PipelineID, SUM(pf.Volume_bbl) AS Vol30d
FROM oil_n_gas_company.PipelineFlow pf
WHERE pf.FlowDate > DATEADD(DAY, -30, CAST(GETDATE() AS date))
GROUP BY pf.PipelineID
ORDER BY Vol30d DESC;
```

## Date Formatting (FORMAT)
```sql
-- 1. ShipDate as 'yyyy-MM'
SELECT s.ShipmentID, FORMAT(s.ShipDate, 'yyyy-MM') AS ShipYYYYMM
FROM oil_n_gas_company.Shipment s;

-- 2. Invoice month label 'MMM yyyy'
SELECT i.InvoiceID, FORMAT(i.InvoiceDate, 'MMM yyyy') AS InvoiceMon
FROM oil_n_gas_company.Invoice i;

-- 3. ProductionDate 'dd-MMM'
SELECT p.WellID, p.ProductionDate, FORMAT(p.ProductionDate, 'dd-MMM') AS DayMon
FROM oil_n_gas_company.Production p;

-- 4. Drilling StartDate 'yyyy-MM-dd HH:mm'
SELECT TOP (20) d.OperationID, FORMAT(d.StartDate, 'yyyy-MM-dd HH:mm') AS StartStamp
FROM oil_n_gas_company.DrillingOperation d
ORDER BY d.StartDate DESC;

-- 5. PaymentDate full day name and date
SELECT p.PaymentID, FORMAT(p.PaymentDate, 'dddd, dd MMM yyyy') AS PayLong
FROM oil_n_gas_company.Payment p;

-- 6. Inventory SnapshotDate as ISO basic 'yyyyMMdd'
SELECT TOP (20) i.FacilityID, i.ProductID, FORMAT(i.SnapshotDate, 'yyyyMMdd') AS SnapshotISO
FROM oil_n_gas_company.Inventory i
ORDER BY i.SnapshotDate DESC;

-- 7. Contract StartDate quarter label 'Qn yyyy'
SELECT sc.ContractID,
       'Q' + CONVERT(varchar(1), DATEPART(QUARTER, sc.StartDate)) + ' ' + CONVERT(varchar(4), DATEPART(YEAR, sc.StartDate)) AS QtrLabel
FROM oil_n_gas_company.SalesContract sc;

-- 8. FlowDate culture-specific month (German)
SELECT TOP (20) pf.PipelineID, pf.FlowDate, FORMAT(pf.FlowDate, 'MMMM', 'de-DE') AS Monat
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.FlowDate DESC;

-- 9. CreatedAt (UTC) standardized ISO 8601
SELECT TOP (10) c.CustomerID, FORMAT(c.CreatedAt, 'yyyy-MM-ddTHH:mm:ss') AS CreatedIso
FROM oil_n_gas_company.Customer c
ORDER BY c.CreatedAt DESC;

-- 10. Invoice date week number (using FORMAT)
SELECT i.InvoiceID, i.InvoiceDate, FORMAT(i.InvoiceDate, 'ww') AS WeekNum
FROM oil_n_gas_company.Invoice i;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Shipments count by weekday (1..7)
SELECT DATEPART(WEEKDAY, s.ShipDate) AS WkDay, COUNT(*) AS Shipments
FROM oil_n_gas_company.Shipment s
GROUP BY DATEPART(WEEKDAY, s.ShipDate)
ORDER BY WkDay;

-- 2. Average pipeline flow by weekday
SELECT DATEPART(WEEKDAY, pf.FlowDate) AS WkDay, AVG(pf.Volume_bbl) AS AvgVol
FROM oil_n_gas_company.PipelineFlow pf
GROUP BY DATEPART(WEEKDAY, pf.FlowDate)
ORDER BY WkDay;

-- 3. Production Oil by weekday name
SELECT DATENAME(WEEKDAY, p.ProductionDate) AS DayName, AVG(p.Oil_bbl) AS AvgOil
FROM oil_n_gas_company.Production p
GROUP BY DATENAME(WEEKDAY, p.ProductionDate)
ORDER BY AvgOil DESC;

-- 4. Payments by weekday name
SELECT DATENAME(WEEKDAY, p.PaymentDate) AS DayName, COUNT(*) AS Cnt
FROM oil_n_gas_company.Payment p
GROUP BY DATENAME(WEEKDAY, p.PaymentDate)
ORDER BY Cnt DESC;

-- 5. Drilling starts by weekday
SELECT DATEPART(WEEKDAY, d.StartDate) AS WkDay, COUNT(*) AS Starts
FROM oil_n_gas_company.DrillingOperation d
GROUP BY DATEPART(WEEKDAY, d.StartDate)
ORDER BY WkDay;

-- 6. Inventory snapshots by weekday (top 7 days)
SELECT DATEPART(WEEKDAY, i.SnapshotDate) AS WkDay, COUNT(*) AS Snaps
FROM oil_n_gas_company.Inventory i
GROUP BY DATEPART(WEEKDAY, i.SnapshotDate)
ORDER BY Snaps DESC;

-- 7. Invoices by weekday number
SELECT DATEPART(WEEKDAY, i.InvoiceDate) AS WkDay, COUNT(*) AS Invoices
FROM oil_n_gas_company.Invoice i
GROUP BY DATEPART(WEEKDAY, i.InvoiceDate)
ORDER BY WkDay;

-- 8. Contracts started by weekday
SELECT DATENAME(WEEKDAY, sc.StartDate) AS DayName, COUNT(*) AS Cnt
FROM oil_n_gas_company.SalesContract sc
GROUP BY DATENAME(WEEKDAY, sc.StartDate)
ORDER BY Cnt DESC;

-- 9. Maintenance events by weekday
SELECT DATENAME(WEEKDAY, am.MaintDate) AS DayName, COUNT(*) AS Events
FROM oil_n_gas_company.AssetMaintenance am
GROUP BY DATENAME(WEEKDAY, am.MaintDate)
ORDER BY Events DESC;

-- 10. Fields discovered by weekday (if DiscoveryDate set)
SELECT DATENAME(WEEKDAY, f.DiscoveryDate) AS DayName, COUNT(*) AS Fields
FROM oil_n_gas_company.Field f
WHERE f.DiscoveryDate IS NOT NULL
GROUP BY DATENAME(WEEKDAY, f.DiscoveryDate)
ORDER BY Fields DESC;
```

## Date to String (CONVERT with style)
```sql
-- 1. InvoiceDate as 23 (yyyy-mm-dd)
SELECT i.InvoiceID, CONVERT(varchar(10), i.InvoiceDate, 23) AS Inv_23
FROM oil_n_gas_company.Invoice i;

-- 2. ShipDate as 112 (yyyymmdd)
SELECT s.ShipmentID, CONVERT(varchar(8), s.ShipDate, 112) AS Ship_112
FROM oil_n_gas_company.Shipment s;

-- 3. PaymentDate as 101 (mm/dd/yyyy)
SELECT p.PaymentID, CONVERT(varchar(10), p.PaymentDate, 101) AS Pay_101
FROM oil_n_gas_company.Payment p;

-- 4. FlowDate as 103 (dd/mm/yyyy)
SELECT TOP (20) pf.FlowID, CONVERT(varchar(10), pf.FlowDate, 103) AS Flow_103
FROM oil_n_gas_company.PipelineFlow pf
ORDER BY pf.FlowDate DESC;

-- 5. SnapshotDate as 105 (dd-mm-yyyy)
SELECT TOP (20) i.FacilityID, i.ProductID, CONVERT(varchar(10), i.SnapshotDate, 105) AS Snap_105
FROM oil_n_gas_company.Inventory i
ORDER BY i.SnapshotDate DESC;

-- 6. StartDate as 106 (dd mon yyyy)
SELECT TOP (20) d.OperationID, CONVERT(varchar(11), d.StartDate, 106) AS Start_106
FROM oil_n_gas_company.DrillingOperation d
ORDER BY d.StartDate DESC;

-- 7. EndDate as 107 (Mon dd, yyyy)
SELECT TOP (20) d.OperationID, CONVERT(varchar(11), d.EndDate, 107) AS End_107
FROM oil_n_gas_company.DrillingOperation d
WHERE d.EndDate IS NOT NULL
ORDER BY d.EndDate DESC;

-- 8. Contract StartDate as 110 (mm-dd-yyyy)
SELECT TOP (20) sc.ContractID, CONVERT(varchar(10), sc.StartDate, 110) AS Start_110
FROM oil_n_gas_company.SalesContract sc
ORDER BY sc.StartDate DESC;

-- 9. InvoiceDate as 120 (yyyy-mm-dd hh:mi:ss) — time part 00:00:00 for date column
SELECT TOP (20) i.InvoiceID, CONVERT(varchar(19), CAST(i.InvoiceDate AS datetime), 120) AS Inv_120
FROM oil_n_gas_company.Invoice i
ORDER BY i.InvoiceDate DESC;

-- 10. DiscoveryDate as 113 (dd mon yyyy hh:mm:ss:mmm)
SELECT TOP (20) f.FieldID, CONVERT(varchar(26), CAST(f.DiscoveryDate AS datetime), 113) AS Disc_113
FROM oil_n_gas_company.Field f
WHERE f.DiscoveryDate IS NOT NULL
ORDER BY f.DiscoveryDate DESC;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. Customer CreatedAt as 120 (ISO-ish)
SELECT TOP (20) c.CustomerID, CONVERT(varchar(19), c.CreatedAt, 120) AS Created_120
FROM oil_n_gas_company.Customer c
ORDER BY c.CreatedAt DESC;

-- 2. Pipeline CreatedAt as 121 (ODBC canonical w/ milliseconds)
SELECT TOP (20) pl.PipelineID, CONVERT(varchar(23), pl.CreatedAt, 121) AS Pipe_121
FROM oil_n_gas_company.Pipeline pl
ORDER BY pl.CreatedAt DESC;

-- 3. Production CreatedAt as 126 (ISO 8601)
SELECT TOP (20) p.WellID, CONVERT(varchar(33), p.CreatedAt, 126) AS Prod_126
FROM oil_n_gas_company.Production p
ORDER BY p.CreatedAt DESC;

-- 4. Payment CreatedAt as 113 (dd mon yyyy hh:mm:ss:mmm)
SELECT TOP (20) pm.PaymentID, CONVERT(varchar(26), pm.CreatedAt, 113) AS Pay_113
FROM oil_n_gas_company.Payment pm
ORDER BY pm.CreatedAt DESC;

-- 5. Invoice CreatedAt as 109 (mon dd yyyy hh:mi:ss:mmmAM)
SELECT TOP (20) i.InvoiceID, CONVERT(varchar(26), i.CreatedAt, 109) AS Inv_109
FROM oil_n_gas_company.Invoice i
ORDER BY i.CreatedAt DESC;

-- 6. AssetMaintenance CreatedAt as 100 (mon dd yyyy hh:miAM)
SELECT TOP (20) am.MaintenanceID, CONVERT(varchar(24), am.CreatedAt, 100) AS AM_100
FROM oil_n_gas_company.AssetMaintenance am
ORDER BY am.CreatedAt DESC;

-- 7. Shipment CreatedAt as 114 (hh:mi:ss:mmm)
SELECT TOP (20) s.ShipmentID, CONVERT(varchar(12), s.CreatedAt, 114) AS Ship_114
FROM oil_n_gas_company.Shipment s
ORDER BY s.CreatedAt DESC;

-- 8. Facility CreatedAt as 20 (ODBC canonical)
SELECT TOP (20) f.FacilityID, CONVERT(varchar(19), f.CreatedAt, 20) AS Fac_20
FROM oil_n_gas_company.Facility f
ORDER BY f.CreatedAt DESC;

-- 9. Contract CreatedAt as 9 (mon dd yyyy hh:miAM)
SELECT TOP (20) sc.ContractID, CONVERT(varchar(24), sc.CreatedAt, 9) AS Ctr_9
FROM oil_n_gas_company.SalesContract sc
ORDER BY sc.CreatedAt DESC;

-- 10. Inventory CreatedAt as 127 (ISO8601 with timezone Z if datetimeoffset; here datetime2)
SELECT TOP (20) i.InventoryID, CONVERT(varchar(33), i.CreatedAt, 126) AS Inv_126
FROM oil_n_gas_company.Inventory i
ORDER BY i.CreatedAt DESC;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. '2025-07-15' style 23 → date
SELECT CONVERT(date, '2025-07-15', 23) AS D1;

-- 2. '07/15/2025' style 101 → date
SELECT CONVERT(date, '07/15/2025', 101) AS D2;

-- 3. '15/07/2025' style 103 → date
SELECT CONVERT(date, '15/07/2025', 103) AS D3;

-- 4. '15-07-2025' style 105 → date
SELECT CONVERT(date, '15-07-2025', 105) AS D4;

-- 5. ISO basic '20250715' style 112 → date
SELECT CONVERT(date, '20250715', 112) AS D5;

-- 6. Parse shipment month text to date (first day) using PARSE (en-US)
SELECT PARSE('July 2025-01' AS date USING 'en-US') AS ParsedDate;

-- 7. Values set → convert to date (multi-row)
WITH S(txt) AS (
  SELECT '2025-01-31' UNION ALL SELECT '2025-02-28' UNION ALL SELECT '2025-12-25'
)
SELECT txt, CONVERT(date, txt, 23) AS AsDate FROM S;

-- 8. Convert dd Mon yyyy strings using PARSE (en-GB)
SELECT PARSE('15 Jul 2025' AS date USING 'en-GB') AS GB_Date;

-- 9. Convert '2025/07/15' style 111 (yyyy/mm/dd)
SELECT CONVERT(date, '2025/07/15', 111) AS D_111;

-- 10. Convert '2025.07.15' style 102 (yyyy.mm.dd)
SELECT CONVERT(date, '2025.07.15', 102) AS D_102;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. '2025-07-15 14:30:00' style 120 → datetime
SELECT CONVERT(datetime, '2025-07-15 14:30:00', 120) AS DT_120;

-- 2. '07/15/2025 02:30 PM' style 22 → datetime
SELECT CONVERT(datetime, '07/15/25 02:30PM', 0) AS DT_AMPM;

-- 3. ISO 8601 '2025-07-15T14:30:00' style 126
SELECT CONVERT(datetime2, '2025-07-15T14:30:00', 126) AS DT_126;

-- 4. ODBC canonical '2025-07-15 14:30:00.123' style 121
SELECT CONVERT(datetime, '2025-07-15 14:30:00.123', 121) AS DT_121;

-- 5. '15/07/2025 14:30:00' style 103 + time
SELECT CONVERT(datetime, '15/07/2025 14:30:00', 103) AS DT_103;

-- 6. Using PARSE with culture 'en-GB'
SELECT PARSE('15 July 2025 14:30' AS datetime2 USING 'en-GB') AS DT_Parse_GB;

-- 7. Using TRY_CONVERT to handle invalid gracefully
SELECT TRY_CONVERT(datetime, 'invalid-date', 120) AS Try1, TRY_CONVERT(datetime, '2025-07-15 12:00:00', 120) AS Try2;

-- 8. Bulk strings to datetime via VALUES
SELECT v.txt, CONVERT(datetime2, v.txt, 126) AS AsDT
FROM (VALUES ('2025-07-01T08:00:00'), ('2025-07-15T12:30:45'), ('2025-07-31T23:59:59')) v(txt);

-- 9. Convert with timezone '2025-07-15 14:30:00 +00:00' to datetimeoffset
SELECT CONVERT(datetimeoffset, '2025-07-15 14:30:00 +00:00', 127) AS DToffset_127;

-- 10. Build datetime from date + time string
SELECT DATEADD(SECOND, DATEDIFF(SECOND, 0, CONVERT(time, '14:25:36')), CONVERT(datetime, '2025-07-15', 120)) AS BuiltDateTime;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Current UTC and India Standard Time (IST)
SELECT SYSUTCDATETIME() AS NowUTC,
       (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS NowIST;

-- 2. Customer CreatedAt UTC → IST
SELECT TOP (20) c.CustomerID,
       c.CreatedAt AS CreatedUTC,
       (c.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS CreatedIST
FROM oil_n_gas_company.Customer c
ORDER BY c.CreatedAt DESC;

-- 3. Invoice CreatedAt UTC → Pacific Standard Time (PST/PDT auto-handled)
SELECT TOP (20) i.InvoiceID,
       (i.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'Pacific Standard Time' AS Created_Pacific
FROM oil_n_gas_company.Invoice i
ORDER BY i.CreatedAt DESC;

-- 4. Local-date (IST) for payments grouped by day
SELECT CAST(((p.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date) AS LocalPayDateIST,
       COUNT(*) AS Payments
FROM oil_n_gas_company.Payment p
GROUP BY CAST(((p.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date)
ORDER BY LocalPayDateIST DESC;

-- 5. Drilling start timestamp shown in three zones
SELECT TOP (10) d.OperationID,
       d.StartDate AS AsStored,
       (d.StartDate AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time'       AS Start_IST,
       (d.StartDate AT TIME ZONE 'UTC') AT TIME ZONE 'Central European Standard Time' AS Start_CET
FROM oil_n_gas_company.DrillingOperation d
ORDER BY d.StartDate DESC;

-- 6. Convert ISO UTC string to IST datetimeoffset
SELECT ((CONVERT(datetime2, '2025-07-15T12:00:00', 126) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS IsoToIST;

-- 7. Show shipment CreatedAt local hour (IST)
SELECT TOP (20) s.ShipmentID,
       DATEPART(HOUR, ((s.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')) AS HourIST
FROM oil_n_gas_company.Shipment s
ORDER BY s.CreatedAt DESC;

-- 8. Contracts created during IST business hours (09:00–18:00)
SELECT sc.ContractID, sc.CreatedAt
FROM oil_n_gas_company.SalesContract sc
WHERE DATEPART(HOUR, ((sc.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')) BETWEEN 9 AND 18;

-- 9. Daily production counts by IST date
SELECT CAST(((p.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date) AS IST_Date,
       COUNT(*) AS RowsCnt
FROM oil_n_gas_company.Production p
GROUP BY CAST(((p.CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date)
ORDER BY IST_Date DESC;

-- 10. Normalize any datetime2 to UTC using AT TIME ZONE (assume stored as local IST given)
-- Example demo using a literal:
SELECT ((CONVERT(datetime2, '2025-07-15 10:00:00', 120) AT TIME ZONE 'India Standard Time') AT TIME ZONE 'UTC') AS IST_Input_To_UTC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
