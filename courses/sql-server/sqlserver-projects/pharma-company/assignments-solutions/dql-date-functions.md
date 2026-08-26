![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Sales orders placed today (server local date)
SELECT SalesOrderID, CustomerID, OrderDate, TotalAmount
FROM pharma_company.SalesOrder
WHERE CONVERT(date, OrderDate) = CONVERT(date, GETDATE());

-- 2. Shipments made in the last 24 hours
SELECT ShipmentID, CenterID, CustomerID, ShipmentDate, QuantityUnits
FROM pharma_company.Shipment
WHERE ShipmentDate >= DATEADD(day, -1, CONVERT(date, GETDATE()));

-- 3. Inventory snapshots taken on the last calendar day (yesterday)
SELECT InventoryID, CenterID, ProductID, SnapshotDate, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = DATEADD(day, -1, CONVERT(date, GETDATE()));

-- 4. Batches produced in the last 7 days
SELECT BatchID, ProductID, BatchDate, Status
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= DATEADD(day, -7, CONVERT(date, GETDATE()));

-- 5. QC tests executed in the current month
SELECT ResultID, TestID, TestDate, PassFail
FROM pharma_company.QCResult
WHERE TestDate >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
  AND TestDate <  DATEADD(month, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));

-- 6. Regulatory submissions filed year-to-date
SELECT SubmissionID, ProductID, Agency, Status, SubmissionDate
FROM pharma_company.RegulatorySubmission
WHERE SubmissionDate >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
  AND SubmissionDate <= CONVERT(date, GETDATE());

-- 7. Customers created in the last 30 days (uses CreatedAt datetime2)
SELECT CustomerID, Name, CreatedAt
FROM pharma_company.Customer
WHERE CreatedAt >= DATEADD(day, -30, GETDATE());

-- 8. Suppliers updated today (assuming UpdatedAt column exists as per DDL)
SELECT SupplierID, Name, UpdatedAt
FROM pharma_company.Supplier
WHERE CONVERT(date, UpdatedAt) = CONVERT(date, GETDATE());

-- 9. Orders due (placed) in the last business week (last 5 days)
SELECT SalesOrderID, OrderDate, TotalUnits, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate >= DATEADD(day, -5, CONVERT(date, GETDATE()));

-- 10. “Now” stamps for reference
SELECT GETDATE()       AS NowLocal,
       SYSDATETIME()   AS NowLocalPrecise,
       SYSUTCDATETIME() AS NowUTC,
       SYSDATETIMEOFFSET() AS NowWithOffset;
```

## Date Part Function (DATEPART)
```sql
-- 1. Get year/month/day from ShipmentDate
SELECT ShipmentID, ShipmentDate,
       DATEPART(year, ShipmentDate)  AS ShipYear,
       DATEPART(month, ShipmentDate) AS ShipMonth,
       DATEPART(day, ShipmentDate)   AS ShipDay
FROM pharma_company.Shipment;

-- 2. Extract quarter from OrderDate
SELECT SalesOrderID, OrderDate, DATEPART(quarter, OrderDate) AS OrderQuarter
FROM pharma_company.SalesOrder;

-- 3. ISO week number for QC TestDate
SELECT ResultID, TestDate, DATEPART(ISO_WEEK, TestDate) AS IsoWeek
FROM pharma_company.QCResult;

-- 4. Hour/minute/second from CreatedAt in Supplier
SELECT SupplierID, CreatedAt,
       DATEPART(hour, CreatedAt)   AS Hr,
       DATEPART(minute, CreatedAt) AS Min,
       DATEPART(second, CreatedAt) AS Sec
FROM pharma_company.Supplier;

-- 5. Day of week for Inventory snapshot (1=Sunday default settings)
SELECT InventoryID, SnapshotDate, DATEPART(weekday, SnapshotDate) AS WeekdayNum
FROM pharma_company.Inventory;

-- 6. Day of year for BatchDate
SELECT BatchID, BatchDate, DATEPART(dayofyear, BatchDate) AS DayOfYear
FROM pharma_company.ManufacturingBatch;

-- 7. Month name via DATENAME
SELECT SalesOrderID, DATENAME(month, OrderDate) AS MonthName
FROM pharma_company.SalesOrder;

-- 8. Quarter label (Q1..Q4) for SubmissionDate
SELECT SubmissionID, SubmissionDate,
       CONCAT('Q', DATEPART(quarter, SubmissionDate)) AS QuarterLabel
FROM pharma_company.RegulatorySubmission;

-- 9. Minute component of RS CreatedAt
SELECT SubmissionID, CreatedAt, DATEPART(minute, CreatedAt) AS CreatedMinute
FROM pharma_company.RegulatorySubmission;

-- 10. Week number + year key for Inventory
SELECT InventoryID, SnapshotDate,
       CONCAT(DATEPART(year, SnapshotDate), '-W', RIGHT('00' + CAST(DATEPART(ISO_WEEK, SnapshotDate) AS varchar), 2)) AS YearIsoWeek
FROM pharma_company.Inventory;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days between OrderDate and GETDATE()
SELECT SalesOrderID, OrderDate, DATEDIFF(day, OrderDate, GETDATE()) AS DaysSinceOrder
FROM pharma_company.SalesOrder;

-- 2. Days between BatchDate and corresponding first QC TestDate (min by batch)
WITH FirstQC AS (
  SELECT r.BatchID, r.BatchDate, MIN(r.TestDate) AS FirstTestDate
  FROM pharma_company.QCResult r
  GROUP BY r.BatchID, r.BatchDate
)
SELECT b.BatchID, b.BatchDate, f.FirstTestDate,
       DATEDIFF(day, b.BatchDate, f.FirstTestDate) AS DaysToFirstQC
FROM pharma_company.ManufacturingBatch b
JOIN FirstQC f ON f.BatchID = b.BatchID AND f.BatchDate = b.BatchDate;

-- 3. Days between Inventory snapshots and month end
SELECT InventoryID, SnapshotDate,
       DATEDIFF(day, SnapshotDate, EOMONTH(SnapshotDate)) AS DaysToMonthEnd
FROM pharma_company.Inventory;

-- 4. Hours between Supplier CreatedAt and now
SELECT SupplierID, CreatedAt, DATEDIFF(hour, CreatedAt, SYSDATETIME()) AS HoursSinceCreated
FROM pharma_company.Supplier;

-- 5. Weeks between earliest and latest ShipmentDate per customer
WITH Bounds AS (
  SELECT CustomerID, MIN(ShipmentDate) AS FirstShip, MAX(ShipmentDate) AS LastShip
  FROM pharma_company.Shipment
  GROUP BY CustomerID
)
SELECT CustomerID, FirstShip, LastShip, DATEDIFF(week, FirstShip, LastShip) AS WeeksSpan
FROM Bounds;

-- 6. Months from first order to last order per customer
WITH O AS (
  SELECT CustomerID, MIN(OrderDate) AS FirstOrder, MAX(OrderDate) AS LastOrder
  FROM pharma_company.SalesOrder GROUP BY CustomerID
)
SELECT CustomerID, FirstOrder, LastOrder, DATEDIFF(month, FirstOrder, LastOrder) AS MonthsActive
FROM O;

-- 7. Age (days) of regulatory submission
SELECT SubmissionID, SubmissionDate, DATEDIFF(day, SubmissionDate, CAST(GETDATE() AS date)) AS AgeDays
FROM pharma_company.RegulatorySubmission;

-- 8. Days between consecutive inventory snapshots per center/product
WITH S AS (
  SELECT CenterID, ProductID, SnapshotDate,
         LAG(SnapshotDate) OVER (PARTITION BY CenterID, ProductID ORDER BY SnapshotDate) AS PrevDate
  FROM pharma_company.Inventory
)
SELECT CenterID, ProductID, SnapshotDate, PrevDate,
       DATEDIFF(day, PrevDate, SnapshotDate) AS GapDays
FROM S
WHERE PrevDate IS NOT NULL;

-- 9. Minutes between QC TestDate and midnight of same day
SELECT ResultID, TestDate,
       DATEDIFF(minute, CAST(TestDate AS datetime), DATEADD(day, 1, CAST(TestDate AS datetime))) AS MinutesThatDay
FROM pharma_company.QCResult;

-- 10. Days between ManufacturingBatch and corresponding Shipment to any customer (same ProductID, nearest same-day or later)
SELECT b.BatchID, b.ProductID, b.BatchDate, MIN(s.ShipmentDate) AS FirstShipDate,
       DATEDIFF(day, b.BatchDate, MIN(s.ShipmentDate)) AS DaysToShip
FROM pharma_company.ManufacturingBatch b
JOIN pharma_company.Shipment s ON s.ShipmentDate >= b.BatchDate
GROUP BY b.BatchID, b.ProductID, b.BatchDate;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Expected QC window: BatchDate + 2 days
SELECT BatchID, BatchDate, DATEADD(day, 2, BatchDate) AS QCWindowStart
FROM pharma_company.ManufacturingBatch;

-- 2. Inventory forecast date: SnapshotDate + 7 days
SELECT InventoryID, SnapshotDate, DATEADD(day, 7, SnapshotDate) AS ForecastDate
FROM pharma_company.Inventory;

-- 3. Order follow-up date: OrderDate + 3 days
SELECT SalesOrderID, OrderDate, DATEADD(day, 3, OrderDate) AS FollowUpDate
FROM pharma_company.SalesOrder;

-- 4. Shipment SLA date: ShipmentDate + 5 days
SELECT ShipmentID, ShipmentDate, DATEADD(day, 5, ShipmentDate) AS SLADate
FROM pharma_company.Shipment;

-- 5. Submission review checkpoint: SubmissionDate + 14 days
SELECT SubmissionID, SubmissionDate, DATEADD(day, 14, SubmissionDate) AS ReviewCheckpoint
FROM pharma_company.RegulatorySubmission;

-- 6. Prior month same day for inventory
SELECT InventoryID, SnapshotDate, DATEADD(month, -1, SnapshotDate) AS PriorMonthSameDay
FROM pharma_company.Inventory;

-- 7. Next quarter start from OrderDate
SELECT SalesOrderID, OrderDate,
       DATEADD(quarter, 1, DATEFROMPARTS(YEAR(OrderDate), ( ( ( ( (MONTH(OrderDate)-1) / 3) + 1) * 3) + 1), 1) ) AS NextQuarterStart
FROM pharma_company.SalesOrder;

-- 8. Batch expiry hypothetical: BatchDate + 365 days
SELECT BatchID, BatchDate, DATEADD(day, 365, BatchDate) AS HypotheticalExpiry
FROM pharma_company.ManufacturingBatch;

-- 9. QC retest due: TestDate + 30 days
SELECT ResultID, TestDate, DATEADD(day, 30, TestDate) AS RetestDue
FROM pharma_company.QCResult;

-- 10. Rolling window: GETDATE() - 90 days
SELECT *
FROM pharma_company.SalesOrder
WHERE OrderDate >= DATEADD(day, -90, CONVERT(date, GETDATE()));
```

## Date Formatting (FORMAT)
```sql
-- 1. OrderDate as 'yyyy-MM-dd'
SELECT SalesOrderID, FORMAT(OrderDate, 'yyyy-MM-dd') AS OrderDateISO
FROM pharma_company.SalesOrder;

-- 2. ShipmentDate as 'dd-MMM-yyyy'
SELECT ShipmentID, FORMAT(ShipmentDate, 'dd-MMM-yyyy') AS ShipDateFmt
FROM pharma_company.Shipment;

-- 3. SubmissionDate as 'MMM yyyy'
SELECT SubmissionID, FORMAT(SubmissionDate, 'MMM yyyy') AS SubmissionMonth
FROM pharma_company.RegulatorySubmission;

-- 4. BatchDate with day name
SELECT BatchID, FORMAT(BatchDate, 'dddd, dd MMM yyyy') AS BatchDateLong
FROM pharma_company.ManufacturingBatch;

-- 5. Inventory SnapshotDate as week-and-year
SELECT InventoryID, FORMAT(SnapshotDate, 'yyyy-\WW') AS YearWeek
FROM pharma_company.Inventory;

-- 6. Supplier CreatedAt full timestamp
SELECT SupplierID, FORMAT(CreatedAt, 'yyyy-MM-dd HH:mm:ss') AS CreatedAtFmt
FROM pharma_company.Supplier;

-- 7. QC TestDate short date
SELECT ResultID, FORMAT(TestDate, 'd') AS TestShort
FROM pharma_company.QCResult;

-- 8. SalesOrder OrderDate month name only
SELECT SalesOrderID, FORMAT(OrderDate, 'MMMM') AS MonthName
FROM pharma_company.SalesOrder;

-- 9. ShipmentDate quarter label
SELECT ShipmentID, CONCAT('Q', FORMAT(ShipmentDate, 'q'), ' ', FORMAT(ShipmentDate, 'yyyy')) AS QuarterLabel
FROM pharma_company.Shipment;

-- 10. Regulatory SubmissionDate custom 'ddd dd-MMM-yy'
SELECT SubmissionID, FORMAT(SubmissionDate, 'ddd dd-MMM-yy') AS NiceDate
FROM pharma_company.RegulatorySubmission;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Orders placed on Monday (assuming DATEFIRST default; Monday=2 in US English)
SELECT SalesOrderID, OrderDate
FROM pharma_company.SalesOrder
WHERE DATEPART(weekday, OrderDate) = 2;

-- 2. Count shipments per weekday
SELECT DATEPART(weekday, ShipmentDate) AS WeekdayNum, COUNT(*) AS ShipCount
FROM pharma_company.Shipment
GROUP BY DATEPART(weekday, ShipmentDate)
ORDER BY WeekdayNum;

-- 3. Batches on weekends
SELECT BatchID, BatchDate
FROM pharma_company.ManufacturingBatch
WHERE DATEPART(weekday, BatchDate) IN (1,7); -- Sunday or Saturday by default

-- 4. Inventory snapshots taken on Fridays
SELECT InventoryID, SnapshotDate
FROM pharma_company.Inventory
WHERE DATENAME(weekday, SnapshotDate) = 'Friday';

-- 5. QC tests on Wednesdays in July 2025
SELECT ResultID, TestDate
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND DATENAME(weekday, TestDate) = 'Wednesday';

-- 6. Submissions filed on the first business day (Mon-Fri) of month
SELECT SubmissionID, SubmissionDate
FROM pharma_company.RegulatorySubmission
WHERE DAY(SubmissionDate) <= 7
  AND DATEPART(weekday, SubmissionDate) BETWEEN 2 AND 6;

-- 7. Orders on last weekday of month
SELECT SalesOrderID, OrderDate
FROM pharma_company.SalesOrder
WHERE EOMONTH(OrderDate) = OrderDate
   OR (DATEPART(weekday, EOMONTH(OrderDate)) = 1  AND OrderDate = DATEADD(day, -2, EOMONTH(OrderDate))) -- if month ends Sunday -> Friday
   OR (DATEPART(weekday, EOMONTH(OrderDate)) = 7  AND OrderDate = DATEADD(day, -1, EOMONTH(OrderDate))); -- if month ends Saturday -> Friday

-- 8. Shipments not on weekends
SELECT ShipmentID, ShipmentDate
FROM pharma_company.Shipment
WHERE DATEPART(weekday, ShipmentDate) NOT IN (1,7);

-- 9. Weekday name + count of batches
SELECT DATENAME(weekday, BatchDate) AS WeekdayName, COUNT(*) AS Cnt
FROM pharma_company.ManufacturingBatch
GROUP BY DATENAME(weekday, BatchDate);

-- 10. First Monday of each OrderDate month
SELECT DISTINCT
  DATEADD(day,
          ((9 - DATEPART(weekday, DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1))) % 7),
          DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1)) AS FirstMonday
FROM pharma_company.SalesOrder;
```

## Date to String (CONVERT with style)
```sql
-- 1. ISO 8601 date (yyyy-mm-dd)
SELECT SalesOrderID, CONVERT(varchar(10), OrderDate, 120) AS OrderDateISO
FROM pharma_company.SalesOrder;

-- 2. Compact yyyymmdd
SELECT SubmissionID, CONVERT(varchar(8), SubmissionDate, 112) AS SubDateYYYYMMDD
FROM pharma_company.RegulatorySubmission;

-- 3. dd Mon yyyy (style 106)
SELECT BatchID, CONVERT(varchar(11), BatchDate, 106) AS BatchDate106
FROM pharma_company.ManufacturingBatch;

-- 4. mon dd yyyy (style 107)
SELECT ShipmentID, CONVERT(varchar(11), ShipmentDate, 107) AS ShipDate107
FROM pharma_company.Shipment;

-- 5. mm/dd/yy (style 1)
SELECT InventoryID, CONVERT(varchar(8), SnapshotDate, 1) AS SnapDate01
FROM pharma_company.Inventory;

-- 6. dd/mm/yy (style 3)
SELECT ResultID, CONVERT(varchar(8), TestDate, 3) AS TestDate03
FROM pharma_company.QCResult;

-- 7. yy.mm.dd (style 2)
SELECT CustomerID, CONVERT(varchar(8), CAST(CreatedAt AS date), 2) AS CreatedDate02
FROM pharma_company.Customer;

-- 8. dd-mm-yy (style 5)
SELECT SupplierID, CONVERT(varchar(8), CAST(CreatedAt AS date), 5) AS SupplierDate05
FROM pharma_company.Supplier;

-- 9. dd mon yy (style 6)
SELECT SubmissionID, CONVERT(varchar(9), SubmissionDate, 6) AS SubDate06
FROM pharma_company.RegulatorySubmission;

-- 10. mon dd yy (style 7)
SELECT SalesOrderID, CONVERT(varchar(9), OrderDate, 7) AS OrderDate07
FROM pharma_company.SalesOrder;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. yyyy-mm-dd hh:mi:ss (24h, style 120)
SELECT SupplierID, CONVERT(varchar(19), CreatedAt, 120) AS CreatedAt120
FROM pharma_company.Supplier;

-- 2. mm/dd/yy hh:mi AM (style 0)
SELECT SubmissionID, CONVERT(varchar(20), CAST(SubmissionDate AS datetime), 0) AS SubDatetime00
FROM pharma_company.RegulatorySubmission;

-- 3. mon dd yyyy hh:miAM (style 9)
SELECT SalesOrderID, CONVERT(varchar(24), CAST(OrderDate AS datetime), 9) AS OrderDatetime09
FROM pharma_company.SalesOrder;

-- 4. dd mon yyyy hh:mi:ss:mmm(24h) (style 113)
SELECT ShipmentID, CONVERT(varchar(24), CAST(ShipmentDate AS datetime), 113) AS ShipDT113
FROM pharma_company.Shipment;

-- 5. yyyymmdd hh:mi:ss (style 112 + manual time)
SELECT ResultID,
       CONVERT(varchar(8), TestDate, 112) + ' 00:00:00' AS TestDTLike112
FROM pharma_company.QCResult;

-- 6. ODBC canonical (style 121)
SELECT CustomerID, CONVERT(varchar(23), CreatedAt, 121) AS CreatedAt121
FROM pharma_company.Customer;

-- 7. RFC1123-ish (style 100)
SELECT SupplierID, CONVERT(varchar(24), CreatedAt, 100) AS CreatedAt100
FROM pharma_company.Supplier;

-- 8. Culture-neutral ISO (style 126)
SELECT SupplierID, CONVERT(varchar(33), CreatedAt, 126) AS CreatedAtISO126
FROM pharma_company.Supplier;

-- 9. Short date + time (style 109)
SELECT SalesOrderID, CONVERT(varchar(20), CAST(OrderDate AS datetime), 109) AS OrderDT109
FROM pharma_company.SalesOrder;

-- 10. British/French default (style 103 dd/mm/yyyy)
SELECT ShipmentID, CONVERT(varchar(10), ShipmentDate, 103) AS ShipDate103
FROM pharma_company.Shipment;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. ISO literal to DATE
SELECT CAST('2025-07-31' AS date) AS TheDate;

-- 2. dd/mm/yyyy to DATE using CONVERT with style 103
SELECT CONVERT(date, '31/07/2025', 103) AS TheDateUK;

-- 3. yyyymmdd to DATE using CONVERT with style 112
SELECT CONVERT(date, '20250731', 112) AS TheDateCompact;

-- 4. dd-MMM-yyyy via PARSE (requires CLR & language)
SELECT PARSE('31-Jul-2025' AS date USING 'en-US') AS TheDateParsed;

-- 5. mm/dd/yyyy via CONVERT style 101
SELECT CONVERT(date, '07/31/2025', 101) AS TheDateUS;

-- 6. dd Mon yy via CONVERT style 6
SELECT CONVERT(date, '31 Jul 25', 6) AS TheDateStyle6;

-- 7. yy.mm.dd via CONVERT style 2
SELECT CONVERT(date, '25.07.31', 2) AS TheDateStyle2;

-- 8. From yyyy-mm-ddT00:00:00 using CONVERT style 126 (ISO8601)
SELECT CONVERT(date, '2025-07-31T00:00:00', 126) AS TheDateISO;

-- 9. From textual month name via PARSE
SELECT PARSE('July 15, 2025' AS date USING 'en-US') AS TheDateTextUS;

-- 10. Validate safe conversion with TRY_CONVERT
SELECT TRY_CONVERT(date, '2025-13-31') AS InvalidReturnsNull;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. ISO datetime to datetime2
SELECT CAST('2025-07-31T13:45:30' AS datetime2(3)) AS TheDT;

-- 2. US format mm/dd/yyyy hh:mi:ss via CONVERT 101 + additional
SELECT CONVERT(datetime, '07/31/2025 13:45:30', 101) AS TheDT_US;

-- 3. ODBC canonical (style 121)
SELECT CONVERT(datetime, '2025-07-31 13:45:30.123', 121) AS TheDT_121;

-- 4. Europe dd/mm/yyyy hh:mi:ss via style 103
SELECT CONVERT(datetime, '31/07/2025 21:05:00', 103) AS TheDT_103;

-- 5. RFC-ish style 113
SELECT CONVERT(datetime, '31 Jul 2025 13:45:30:123', 113) AS TheDT_113;

-- 6. 24h ISO (style 126)
SELECT CONVERT(datetime, '2025-07-31T23:59:59', 126) AS TheDT_126;

-- 7. PARSE with culture (German)
SELECT PARSE('31.07.2025 13:45:30' AS datetime USING 'de-DE') AS TheDT_de;

-- 8. TRY_PARSE returns NULL for bad string
SELECT TRY_PARSE('31-31-2025 25:00:00' AS datetime USING 'en-US') AS BadDT;

-- 9. ShipmentDate + literal time to datetime
SELECT ShipmentID,
       CONVERT(datetime, CONVERT(varchar(10), ShipmentDate, 120) + ' 08:00:00', 120) AS ShipAt8AM
FROM pharma_company.Shipment;

-- 10. From yyyymmdd and hhmmss
SELECT CONVERT(datetime, '20250731' + ' 134530', 120) AS TheDTConcat; -- careful: better to format properly
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show current time in local TZ, UTC, and India (IST)
SELECT SYSDATETIMEOFFSET()                    AS LocalWithOffset,
       SYSDATETIMEOFFSET() AT TIME ZONE 'UTC' AS AsUTC_Converted,
       SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time' AS AsIST;

-- 2. Convert Supplier.CreatedAt (assumed stored UTC) to IST display
SELECT SupplierID,
       CreatedAt                          AS Stored,
       CAST(CreatedAt AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS CreatedAt_IST
FROM pharma_company.Supplier;

-- 3. Orders today in IST (compare IST date)
WITH O AS (
  SELECT SalesOrderID, OrderDate,
         (CAST(OrderDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time') AS OrderAtIST
  FROM pharma_company.SalesOrder
)
SELECT SalesOrderID, OrderDate, OrderAtIST
FROM O
WHERE CONVERT(date, OrderAtIST) = CONVERT(date, SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time');

-- 4. Shipments last 24 hours in IST
SELECT ShipmentID, ShipmentDate,
       CAST(ShipmentDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS ShipIST
FROM pharma_company.Shipment
WHERE (CAST(ShipmentDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time')
      >= DATEADD(hour, -24, SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time');

-- 5. Display SubmissionDate at midnight in IST
SELECT SubmissionID,
       (CAST(SubmissionDate AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time') AS SubAtIST
FROM pharma_company.RegulatorySubmission;

-- 6. Normalize any datetimeoffset to UTC using SWITCHOFFSET (example: now)
SELECT SWITCHOFFSET(SYSDATETIMEOFFSET(), '+00:00') AS NowUTC_OffsetAdjusted;

-- 7. QC TestDate (date) as IST midnight and end-of-day (IST)
SELECT ResultID,
       (CAST(TestDate AS datetime2) AT TIME ZONE 'India Standard Time')                         AS IST_Midnight,
       (DATEADD(day, 1, CAST(TestDate AS datetime2)) AT TIME ZONE 'India Standard Time')       AS IST_NextMidnight
FROM pharma_company.QCResult;

-- 8. Calculate hours between Supplier.CreatedAt and now in IST
SELECT SupplierID,
       DATEDIFF(hour,
                (CAST(CreatedAt AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time'),
                SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time') AS HoursElapsedIST
FROM pharma_company.Supplier;

-- 9. Inventory snapshots on specific IST date '2025-07-31'
SELECT InventoryID, CenterID, ProductID, SnapshotDate
FROM pharma_company.Inventory
WHERE CONVERT(date, (CAST(SnapshotDate AS datetime2) AT TIME ZONE 'India Standard Time'))
      = '2025-07-31';

-- 10. Store current IST timestamp as datetimeoffset (for logging)
SELECT (SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time') AS NowIST_Offset;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
