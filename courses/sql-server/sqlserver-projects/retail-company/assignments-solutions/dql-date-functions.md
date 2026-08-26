![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefDate date = '2025-07-31';
```

## Current Date and time (GETDATE)
```sql
-- 1. Show server current date & time values
SELECT GETDATE()       AS ServerNow,
       SYSDATETIME()   AS ServerNowPrecise,
       SYSUTCDATETIME() AS UtcNow;

-- 2. Orders placed today (server date)
SELECT SalesOrderID, OrderDate, Status, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate = CAST(GETDATE() AS date);

-- 3. Orders placed in the last 30 days (relative to now)
SELECT SalesOrderID, OrderDate, TotalAmount
FROM retail_company.SalesOrder
WHERE DATEDIFF(DAY, OrderDate, GETDATE()) BETWEEN 0 AND 30;

-- 4. This-month orders (from first day of current month)
SELECT SalesOrderID, OrderDate, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
  AND OrderDate <  DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1));

-- 5. Orders shipped today
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate = CAST(GETDATE() AS date);

-- 6. Inventory snapshot for today
SELECT InventoryID, ProductID, WarehouseID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = CAST(GETDATE() AS date);

-- 7. Purchase orders placed this week (relative to now)
SELECT PurchaseOrderID, OrderDate, Status
FROM retail_company.PurchaseOrder
WHERE DATEDIFF(WEEK, OrderDate, GETDATE()) = 0;

-- 8. Orders placed yesterday
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE DATEDIFF(DAY, OrderDate, GETDATE()) = 1;

-- 9. Days since last order per customer (relative to now)
SELECT CustomerID, MAX(OrderDate) AS LastOrderDate,
       DATEDIFF(DAY, MAX(OrderDate), CAST(GETDATE() AS date)) AS DaysSinceLast
FROM retail_company.SalesOrder
GROUP BY CustomerID
ORDER BY DaysSinceLast DESC;

-- 10. Days since latest inventory snapshot per product
SELECT i.ProductID, MAX(i.StockDate) AS LastSnap,
       DATEDIFF(DAY, MAX(i.StockDate), CAST(GETDATE() AS date)) AS DaysSinceSnap
FROM retail_company.Inventory i
GROUP BY i.ProductID
ORDER BY DaysSinceSnap DESC;
```

## Date Part Function (DATEPART)
```sql
-- 1. Extract year, month, day from each order date
SELECT SalesOrderID,
       DATEPART(YEAR, OrderDate)  AS Yr,
       DATEPART(MONTH, OrderDate) AS Mo,
       DATEPART(DAY, OrderDate)   AS Dy
FROM retail_company.SalesOrder;

-- 2. Order count by month in 2025
SELECT DATEPART(MONTH, OrderDate) AS Mo, COUNT(*) AS Orders
FROM retail_company.SalesOrder
WHERE DATEPART(YEAR, OrderDate) = 2025
GROUP BY DATEPART(MONTH, OrderDate)
ORDER BY Mo;

-- 3. Revenue by quarter in 2025
SELECT DATEPART(QUARTER, OrderDate) AS Qtr, SUM(TotalAmount) AS Revenue
FROM retail_company.SalesOrder
WHERE DATEPART(YEAR, OrderDate) = 2025
GROUP BY DATEPART(QUARTER, OrderDate)
ORDER BY Qtr;

-- 4. Orders by week number (ISO week)
SELECT DATEPART(isowk, OrderDate) AS ISOWeek, COUNT(*) AS Orders
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY DATEPART(isowk, OrderDate)
ORDER BY ISOWeek;

-- 5. Day-of-month distribution of July orders
SELECT DATEPART(DAY, OrderDate) AS DayOfMonth, COUNT(*) AS Orders
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY DATEPART(DAY, OrderDate)
ORDER BY DayOfMonth;

-- 6. Hour-of-day distribution of customer CreatedAt
SELECT DATEPART(HOUR, CreatedAt) AS Hr, COUNT(*) AS NewCustomers
FROM retail_company.Customer
GROUP BY DATEPART(HOUR, CreatedAt)
ORDER BY Hr;

-- 7. Orders by weekday number (1-7 depends on DATEFIRST)
SELECT DATEPART(WEEKDAY, OrderDate) AS WeekdayNum, COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY DATEPART(WEEKDAY, OrderDate)
ORDER BY WeekdayNum;

-- 8. Orders by month name (DATENAME)
SELECT DATENAME(MONTH, OrderDate) AS MonthName, COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY DATENAME(MONTH, OrderDate)
ORDER BY MIN(DATEPART(MONTH, OrderDate));

-- 9. Purchase orders by expected month
SELECT DATEPART(YEAR, ExpectedDate) AS Yr, DATEPART(MONTH, ExpectedDate) AS Mo, COUNT(*) AS POs
FROM retail_company.PurchaseOrder
GROUP BY DATEPART(YEAR, ExpectedDate), DATEPART(MONTH, ExpectedDate)
ORDER BY Yr, Mo;

-- 10. Inventory snapshots by day-of-week name
SELECT DATENAME(WEEKDAY, StockDate) AS DayName, COUNT(*) AS Snapshots
FROM retail_company.Inventory
GROUP BY DATENAME(WEEKDAY, StockDate)
ORDER BY COUNT(*) DESC;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days between order and ship date (shipping lead time)
SELECT SalesOrderID, OrderDate, ShipDate,
       DATEDIFF(DAY, OrderDate, ShipDate) AS ShipDays
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL;

-- 2. PO lead time (order to expected)
SELECT PurchaseOrderID, OrderDate, ExpectedDate,
       DATEDIFF(DAY, OrderDate, ExpectedDate) AS LeadDays
FROM retail_company.PurchaseOrder;

-- 3. Orders taking more than 5 days to ship
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL
  AND DATEDIFF(DAY, OrderDate, ShipDate) > 5;

-- 4. Days since each customer's first order (relative to @RefDate)
SELECT CustomerID, MIN(OrderDate) AS FirstOrder,
       DATEDIFF(DAY, MIN(OrderDate), @RefDate) AS DaysSinceFirst
FROM retail_company.SalesOrder
GROUP BY CustomerID;

-- 5. Range (days) covered by inventory snapshots
SELECT MIN(StockDate) AS FirstSnap, MAX(StockDate) AS LastSnap,
       DATEDIFF(DAY, MIN(StockDate), MAX(StockDate)) AS SpanDays
FROM retail_company.Inventory;

-- 6. Days since product was created (relative to @RefDate)
SELECT ProductID, CreatedAt,
       DATEDIFF(DAY, CAST(CreatedAt AS date), @RefDate) AS DaysSinceCreate
FROM retail_company.Product;

-- 7. Hours between CreatedAt and UpdatedAt on products
SELECT ProductID, DATEDIFF(HOUR, CreatedAt, UpdatedAt) AS HoursChanged
FROM retail_company.Product;

-- 8. Weeks between earliest and latest order
SELECT DATEDIFF(WEEK, MIN(OrderDate), MAX(OrderDate)) AS WeeksSpan
FROM retail_company.SalesOrder;

-- 9. Days between any two given dates (param demo)
SELECT DATEDIFF(DAY, '2025-07-01', '2025-07-31') AS JulyDays;

-- 10. Average shipping time in days
SELECT AVG(DATEDIFF(DAY, OrderDate, ShipDate) * 1.0) AS AvgShipDays
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Expected ship date = OrderDate + 5 days (hypothetical)
SELECT SalesOrderID, OrderDate,
       DATEADD(DAY, 5, OrderDate) AS ExpectedShipPlus5
FROM retail_company.SalesOrder;

-- 2. Orders in the last 10 days ending @RefDate
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate > DATEADD(DAY, -10, @RefDate)
  AND OrderDate <= @RefDate;

-- 3. Inventory next-day view from 2025-07-31
SELECT InventoryID, ProductID, WarehouseID,
       DATEADD(DAY, 1, StockDate) AS NextDay
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31';

-- 4. Purchase orders pushed out 7 days (preview)
SELECT PurchaseOrderID, OrderDate, ExpectedDate,
       DATEADD(DAY, 7, ExpectedDate) AS NewExpected
FROM retail_company.PurchaseOrder;

-- 5. First day of order month
SELECT SalesOrderID, OrderDate,
       DATEADD(DAY, 1, EOMONTH(OrderDate, -1)) AS FirstOfMonth
FROM retail_company.SalesOrder;

-- 6. Last day of order month
SELECT SalesOrderID, OrderDate, EOMONTH(OrderDate) AS LastOfMonth
FROM retail_company.SalesOrder;

-- 7. First day of next quarter
SELECT SalesOrderID, OrderDate,
       DATEADD(QUARTER, 1, DATEFROMPARTS(YEAR(OrderDate),
                                         ( (DATEPART(QUARTER, OrderDate)-1) * 3 ) + 1, 1)) AS NextQStart
FROM retail_company.SalesOrder;

-- 8. Orders due to ship within 3 days of order
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL
  AND ShipDate <= DATEADD(DAY, 3, OrderDate);

-- 9. PO expected within 10 days from @RefDate
SELECT PurchaseOrderID, ExpectedDate
FROM retail_company.PurchaseOrder
WHERE ExpectedDate BETWEEN @RefDate AND DATEADD(DAY, 10, @RefDate);

-- 10. Rolling 30-day sales ending @RefDate
SELECT SUM(TotalAmount) AS Rolling30Sales
FROM retail_company.SalesOrder
WHERE OrderDate > DATEADD(DAY, -30, @RefDate)
  AND OrderDate <= @RefDate;
```

## Date Formatting (FORMAT)
```sql
-- 1. Orders with formatted date 'yyyy-MM-dd'
SELECT SalesOrderID, FORMAT(OrderDate, 'yyyy-MM-dd') AS OrderDateISO
FROM retail_company.SalesOrder;

-- 2. 'dd-MMM-yyyy' format
SELECT SalesOrderID, FORMAT(OrderDate, 'dd-MMM-yyyy') AS OrderDatePretty
FROM retail_company.SalesOrder;

-- 3. Month name + year
SELECT SalesOrderID, FORMAT(OrderDate, 'MMMM yyyy') AS MonthYear
FROM retail_company.SalesOrder;

-- 4. Weekday name
SELECT SalesOrderID, FORMAT(OrderDate, 'dddd') AS WeekdayName
FROM retail_company.SalesOrder;

-- 5. Inventory date with day ordinal (e.g., 31st)
SELECT InventoryID, FORMAT(StockDate, 'dd') 
       + CASE WHEN RIGHT(FORMAT(StockDate,'dd'),1)='1' AND FORMAT(StockDate,'dd') NOT IN ('11') THEN 'st'
              WHEN RIGHT(FORMAT(StockDate,'dd'),1)='2' AND FORMAT(StockDate,'dd') NOT IN ('12') THEN 'nd'
              WHEN RIGHT(FORMAT(StockDate,'dd'),1)='3' AND FORMAT(StockDate,'dd') NOT IN ('13') THEN 'rd'
              ELSE 'th' END AS DayOrdinal
FROM retail_company.Inventory;

-- 6. CreatedAt as local-like string with time (no tz)
SELECT CustomerID, FORMAT(CreatedAt, 'yyyy-MM-dd HH:mm:ss') AS CreatedAtStr
FROM retail_company.Customer;

-- 7. PO order date 'MM/dd/yyyy'
SELECT PurchaseOrderID, FORMAT(OrderDate, 'MM/dd/yyyy') AS USDate
FROM retail_company.PurchaseOrder;

-- 8. 'yyyy/MM' bucketing and counts
SELECT FORMAT(OrderDate, 'yyyy/MM') AS Ym, COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY FORMAT(OrderDate, 'yyyy/MM')
ORDER BY Ym;

-- 9. First 3 letters of month via FORMAT
SELECT DISTINCT FORMAT(OrderDate, 'MMM') AS Mon
FROM retail_company.SalesOrder
ORDER BY MIN(OrderDate);

-- 10. Long date (D)
SELECT SalesOrderID, FORMAT(OrderDate, 'D') AS LongDate
FROM retail_company.SalesOrder;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Orders placed on Mondays
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE DATEPART(WEEKDAY, OrderDate) = 2; -- depends on DATEFIRST (assumes 1=Sunday)

-- 2. Orders by weekday name with counts
SELECT DATENAME(WEEKDAY, OrderDate) AS DayName, COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY DATENAME(WEEKDAY, OrderDate)
ORDER BY MIN(DATEPART(WEEKDAY, OrderDate));

-- 3. Weekend vs Weekday order counts (assume Sat=7, Sun=1 with DATEFIRST 7)
SET DATEFIRST 7; -- Saturday
SELECT CASE WHEN DATEPART(WEEKDAY, OrderDate) IN (1,7) THEN 'Weekend' ELSE 'Weekday' END AS DayType,
       COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY CASE WHEN DATEPART(WEEKDAY, OrderDate) IN (1,7) THEN 'Weekend' ELSE 'Weekday' END;

-- 4. Highest-order weekday in July 2025
SELECT TOP (1) DATENAME(WEEKDAY, OrderDate) AS DayName, COUNT(*) AS Orders
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY DATENAME(WEEKDAY, OrderDate)
ORDER BY Orders DESC;

-- 5. Inventory snapshots by weekday (name + count)
SELECT DATENAME(WEEKDAY, StockDate) AS DayName, COUNT(*) AS Snapshots
FROM retail_company.Inventory
GROUP BY DATENAME(WEEKDAY, StockDate)
ORDER BY Snapshots DESC;

-- 6. PO orders on Fridays
SELECT PurchaseOrderID, OrderDate
FROM retail_company.PurchaseOrder
WHERE DATENAME(WEEKDAY, OrderDate) = 'Friday';

-- 7. Orders by weekday number (1-7)
SELECT DATEPART(WEEKDAY, OrderDate) AS WkNum, COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY DATEPART(WEEKDAY, OrderDate)
ORDER BY WkNum;

-- 8. Orders with ship date falling on weekend
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL
  AND DATENAME(WEEKDAY, ShipDate) IN ('Saturday','Sunday');

-- 9. Avg TotalAmount by weekday
SELECT DATENAME(WEEKDAY, OrderDate) AS DayName, AVG(TotalAmount) AS AvgAmt
FROM retail_company.SalesOrder
GROUP BY DATENAME(WEEKDAY, OrderDate)
ORDER BY AvgAmt DESC;

-- 10. Count of Monday orders per month (2025)
SELECT DATEPART(MONTH, OrderDate) AS Mo, COUNT(*) AS MondayOrders
FROM retail_company.SalesOrder
WHERE DATEPART(YEAR, OrderDate) = 2025
  AND DATENAME(WEEKDAY, OrderDate) = 'Monday'
GROUP BY DATEPART(MONTH, OrderDate)
ORDER BY Mo;
```

## Date to String (CONVERT with style)
```sql
-- 1. ISO (yyyy-mm-dd) style 23
SELECT SalesOrderID, CONVERT(varchar(10), OrderDate, 23) AS OrderDate_23
FROM retail_company.SalesOrder;

-- 2. Compact ISO (yyyymmdd) style 112
SELECT SalesOrderID, CONVERT(varchar(8), OrderDate, 112) AS OrderDate_112
FROM retail_company.SalesOrder;

-- 3. US (mm/dd/yyyy) style 101
SELECT SalesOrderID, CONVERT(varchar(10), OrderDate, 101) AS OrderDate_101
FROM retail_company.SalesOrder;

-- 4. European (dd/mm/yyyy) style 103
SELECT SalesOrderID, CONVERT(varchar(10), OrderDate, 103) AS OrderDate_103
FROM retail_company.SalesOrder;

-- 5. German (dd.mm.yyyy) style 104
SELECT SalesOrderID, CONVERT(varchar(10), OrderDate, 104) AS OrderDate_104
FROM retail_company.SalesOrder;

-- 6. Italian (dd-mm-yy) style 5 (alias 5)
SELECT SalesOrderID, CONVERT(varchar(8), OrderDate, 5) AS OrderDate_5
FROM retail_company.SalesOrder;

-- 7. Month name + day (textual via CONVERT & DATENAME)
SELECT SalesOrderID, DATENAME(MONTH, OrderDate) + ' ' + CONVERT(varchar(2), DATEPART(DAY, OrderDate)) AS Pretty
FROM retail_company.SalesOrder;

-- 8. Filter using string compare style 112 (exact match)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE CONVERT(varchar(8), OrderDate, 112) = '20250715';

-- 9. Build composite key-like string
SELECT SalesOrderID,
       CONVERT(varchar(8), OrderDate, 112) + '-' + CAST(SalesOrderID AS varchar(20)) AS KeyText
FROM retail_company.SalesOrder;

-- 10. Inventory date to 'Mon dd, yyyy' via CONVERT + DATENAME
SELECT InventoryID, DATENAME(MONTH, StockDate) + ' ' + RIGHT('0'+CAST(DATEPART(DAY,StockDate) AS varchar(2)),2)
       + ', ' + CAST(DATEPART(YEAR, StockDate) AS varchar(4)) AS StockDateText
FROM retail_company.Inventory;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. Customer CreatedAt ISO 8601 (yyyy-mm-ddThh:mi:ss) style 126
SELECT CustomerID, CONVERT(varchar(19), CreatedAt, 126) AS CreatedAt_126
FROM retail_company.Customer;

-- 2. Product UpdatedAt ODBC canonical style 120
SELECT ProductID, CONVERT(varchar(19), UpdatedAt, 120) AS UpdatedAt_120
FROM retail_company.Product;

-- 3. SO CreatedAt (if stored) default style 109 (mon dd yyyy hh:mi:ss:mmmAM)
SELECT SalesOrderID, CONVERT(varchar(30), CreatedAt, 109) AS CreatedAt_109
FROM retail_company.SalesOrder;

-- 4. Supplier emails with CreatedAt style 113 (dd mon yyyy hh:mi:ss:mmm)
SELECT SupplierID, Email, CONVERT(varchar(24), CreatedAt, 113) AS CreatedAt_113
FROM retail_company.Supplier;

-- 5. Warehouse CreatedAt short date+time style 100 (mon dd yyyy hh:miAM/PM)
SELECT WarehouseID, CONVERT(varchar(24), CreatedAt, 100) AS CreatedAt_100
FROM retail_company.Warehouse;

-- 6. PurchaseOrder CreatedAt style 121 (ODBC w/ milliseconds)
SELECT PurchaseOrderID, CONVERT(varchar(23), CreatedAt, 121) AS CreatedAt_121
FROM retail_company.PurchaseOrder;

-- 7. SalesOrder UpdatedAt style 20 (ODBC canonical yyyy-mm-dd hh:mi:ss)
SELECT SalesOrderID, CONVERT(varchar(19), UpdatedAt, 20) AS UpdatedAt_20
FROM retail_company.SalesOrder;

-- 8. Product CreatedAt to 'yyyy/MM/dd HH:mm'
SELECT ProductID, CONVERT(varchar(16), CreatedAt, 120) AS CreatedAt_YMDHM
FROM retail_company.Product;

-- 9. Customer CreatedAt to date-only via CONVERT 23
SELECT CustomerID, CONVERT(varchar(10), CreatedAt, 23) AS CreatedDate
FROM retail_company.Customer;

-- 10. Inventory CreatedAt as RFC-ish (use 126 then 'Z' to hint UTC)
SELECT InventoryID, CONVERT(varchar(19), CreatedAt, 126) + 'Z' AS CreatedAtRFCish
FROM retail_company.Inventory;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. ISO '2025-07-15' (style 23)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate = TRY_CONVERT(date, '2025-07-15', 23);

-- 2. Compact ISO '20250715' (style 112)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate = TRY_CONVERT(date, '20250715', 112);

-- 3. US '07/15/2025' (style 101)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate = TRY_CONVERT(date, '07/15/2025', 101);

-- 4. British/French '15/07/2025' (style 103)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate = TRY_CONVERT(date, '15/07/2025', 103);

-- 5. German '15.07.2025' (style 104)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate = TRY_CONVERT(date, '15.07.2025', 104);

-- 6. Italian '15-07-2025' (style 105)
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate = TRY_CONVERT(date, '15-07-2025', 105);

-- 7. ISO week date via PARSE (culture en-GB) if allowed
SELECT TRY_CONVERT(date, PARSE('15 July 2025' AS datetime USING 'en-GB')) AS ParsedDate;

-- 8. Validate many strings to date list (mini table)
SELECT s.S, TRY_CONVERT(date, s.S, s.Style) AS Parsed
FROM (VALUES
  ('2025-07-31', 23),
  ('20250731', 112),
  ('07/31/2025', 101),
  ('31/07/2025', 103),
  ('31.07.2025', 104)
) AS s(S, Style);

-- 9. Filter purchase orders using string parameter (German style)
SELECT PurchaseOrderID, OrderDate
FROM retail_company.PurchaseOrder
WHERE OrderDate >= TRY_CONVERT(date, '01.07.2025', 104)
  AND OrderDate <= TRY_CONVERT(date, '31.07.2025', 104);

-- 10. Inventory snapshots on a string date (ISO)
SELECT InventoryID, StockDate
FROM retail_company.Inventory
WHERE StockDate = TRY_CONVERT(date, '2025-07-31', 23);
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Parse ISO datetime '2025-07-15T13:45:00' (style 126)
SELECT TRY_CONVERT(datetime2(0), '2025-07-15T13:45:00', 126) AS Dt1;

-- 2. Parse ODBC canonical '2025-07-15 13:45:00' (style 120)
SELECT TRY_CONVERT(datetime2(0), '2025-07-15 13:45:00', 120) AS Dt2;

-- 3. Parse US '07/15/2025 01:45 PM' (style 101 + time; style 100 handles mon dd yyyy)
SELECT TRY_CONVERT(datetime2(0), 'Jul 15 2025 1:45PM', 100) AS Dt3;

-- 4. Compare CreatedAt to parsed boundary
SELECT CustomerID, CreatedAt
FROM retail_company.Customer
WHERE CreatedAt >= TRY_CONVERT(datetime2(0), '2025-07-10 00:00:00', 120)
  AND CreatedAt <  TRY_CONVERT(datetime2(0), '2025-08-01 00:00:00', 120);

-- 5. Parse with culture (PARSE) '15 July 2025 21:30'
SELECT PARSE('15 July 2025 21:30' AS datetime2 USING 'en-GB') AS DtGB;

-- 6. Safe parse many datetimes (mini table)
SELECT s.S, TRY_CONVERT(datetime2, s.S, s.Style) AS Parsed
FROM (VALUES
  ('2025-07-31T23:59:59', 126),
  ('2025-07-31 23:59:59', 120),
  ('31/07/2025 23:59', 103)
) AS s(S, Style);

-- 7. Filter SalesOrder CreatedAt within a parsed window
SELECT SalesOrderID, CreatedAt
FROM retail_company.SalesOrder
WHERE CreatedAt BETWEEN
  TRY_CONVERT(datetime2, '2025-07-01 00:00:00', 120)
  AND TRY_CONVERT(datetime2, '2025-07-31 23:59:59', 120);

-- 8. Parse ExpectedDate with time at midnight (style 23 to date then cast)
SELECT PurchaseOrderID,
       CAST(TRY_CONVERT(date, '2025-07-20', 23) AS datetime2(0)) AS ExpectedMidnight
FROM retail_company.PurchaseOrder;

-- 9. Convert string to datetimeoffset via PARSE
SELECT PARSE('2025-07-31 18:30:00 +05:30' AS datetimeoffset USING 'en-IN') AS DtOffset;

-- 10. Apply parsed datetime to filter Inventory CreatedAt (>= parsed)
SELECT InventoryID, CreatedAt
FROM retail_company.Inventory
WHERE CreatedAt >= TRY_CONVERT(datetime2, '2025-07-31 00:00:00', 120);
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show UTC now and India time now
SELECT SYSUTCDATETIME()                                         AS UtcNow,
       SYSUTCDATETIME() AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS IndiaNow;

-- 2. Convert SalesOrder.CreatedAt (UTC) to India time
SELECT SalesOrderID,
       (CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS CreatedAt_IST
FROM retail_company.SalesOrder;

-- 3. Orders created on 2025-07-31 in India time (date slice in IST)
SELECT SalesOrderID, CreatedAt
FROM retail_company.SalesOrder
WHERE CAST( ((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date ) = '2025-07-31';

-- 4. Group orders by India-local hour
SELECT DATEPART(HOUR, ((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')) AS IST_Hour,
       COUNT(*) AS Orders
FROM retail_company.SalesOrder
GROUP BY DATEPART(HOUR, ((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time'))
ORDER BY IST_Hour;

-- 5. Convert Customer.CreatedAt to Pacific time
SELECT CustomerID,
       (CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'Pacific Standard Time' AS CreatedAt_PST
FROM retail_company.Customer;

-- 6. Orders created between two India-local timestamps
SELECT SalesOrderID, CreatedAt
FROM retail_company.SalesOrder
WHERE ((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')
      BETWEEN ('2025-07-15T00:00:00' AT TIME ZONE 'India Standard Time')
          AND ('2025-07-15T23:59:59.997' AT TIME ZONE 'India Standard Time');

-- 7. Show UTC offset minutes for India vs Pacific (based on now)
SELECT DATEPART(TZOFFSET, SYSUTCDATETIME() AT TIME ZONE 'India Standard Time')   AS IST_Offset_Min,
       DATEPART(TZOFFSET, SYSUTCDATETIME() AT TIME ZONE 'Pacific Standard Time') AS PST_Offset_Min;

-- 8. Inventory CreatedAt converted to India time and date-only
SELECT InventoryID,
       CAST(((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date) AS CreatedDate_IST
FROM retail_company.Inventory;

-- 9. Orders where India-local date differs from UTC date (crossing midnight)
SELECT SalesOrderID, CreatedAt,
       CAST(CreatedAt AS date) AS UtcDate,
       CAST(((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date) AS IndiaDate
FROM retail_company.SalesOrder
WHERE CAST(CreatedAt AS date) <> CAST(((CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS date);

-- 10. Normalize any datetime2 to UTC datetimeoffset
SELECT SalesOrderID,
       CreatedAt AT TIME ZONE 'UTC' AS CreatedAt_UTC_Offset
FROM retail_company.SalesOrder;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
