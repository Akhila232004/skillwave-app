![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefDate date = '2025-07-31';
```

## Current Date and time (GETDATE)
1. Show server current date & time values
2. Orders placed today (server date)
3. Orders placed in the last 30 days (relative to now)
4. This-month orders (from first day of current month)
5. Orders shipped today
6. Inventory snapshot for today
7. Purchase orders placed this week (relative to now)
8. Orders placed yesterday
9. Days since last order per customer (relative to now)
10. Days since latest inventory snapshot per product

## Date Part Function (DATEPART)
1. Extract year, month, day from each order date
2. Order count by month in 2025
3. Revenue by quarter in 2025
4. Orders by week number (ISO week)
5. Day-of-month distribution of July orders
6. Hour-of-day distribution of customer CreatedAt
7. Orders by weekday number (1-7 depends on DATEFIRST)
8. Orders by month name (DATENAME)
9. Purchase orders by expected month
10. Inventory snapshots by day-of-week name

## Date Difference Function (DATEDIFF)
1. Days between order and ship date (shipping lead time)
2. PO lead time (order to expected)
3. Orders taking more than 5 days to ship
4. Days since each customer's first order (relative to @RefDate)
5. Range (days) covered by inventory snapshots
6. Days since product was created (relative to @RefDate)
7. Hours between CreatedAt and UpdatedAt on products
8. Weeks between earliest and latest order
9. Days between any two given dates (param demo)
10. Average shipping time in days

## Date Addition/Subtraction (DATEADD)
1. Expected ship date = OrderDate + 5 days (hypothetical)
2. Orders in the last 10 days ending @RefDate
3. Inventory next-day view from 2025-07-31
4. Purchase orders pushed out 7 days (preview)
5. First day of order month
6. Last day of order month
7. First day of next quarter
8. Orders due to ship within 3 days of order
9. PO expected within 10 days from @RefDate
10. Rolling 30-day sales ending @RefDate

## Date Formatting (FORMAT)
1. Orders with formatted date 'yyyy-MM-dd'
2. 'dd-MMM-yyyy' format
3. Month name + year
4. Weekday name
5. Inventory date with day ordinal (e.g., 31st)
6. CreatedAt as local-like string with time (no tz)
7. PO order date 'MM/dd/yyyy'
8. 'yyyy/MM' bucketing and counts
9. First 3 letters of month via FORMAT
10. Long date (D)

## Weekday Function (DATEPART weekday)
1. Orders placed on Mondays
2. Orders by weekday name with counts
3. Weekend vs Weekday order counts (assume Sat=7, Sun=1 with DATEFIRST 7)
4. Highest-order weekday in July 2025
5. Inventory snapshots by weekday (name + count)
6. PO orders on Fridays
7. Orders by weekday number (1-7)
8. Orders with ship date falling on weekend
9. Avg TotalAmount by weekday
10. Count of Monday orders per month (2025)

## Date to String (CONVERT with style)
1. ISO (yyyy-mm-dd) style 23
2. Compact ISO (yyyymmdd) style 112
3. US (mm/dd/yyyy) style 101
4. European (dd/mm/yyyy) style 103
5. German (dd.mm.yyyy) style 104
6. Italian (dd-mm-yy) style 5 (alias 5)
7. Month name + day (textual via CONVERT & DATENAME)
8. Filter using string compare style 112 (exact match)
9. Build composite key-like string
10. Inventory date to 'Mon dd, yyyy' via CONVERT + DATENAME

## DateTime to String (CONVERT with style)
1. Customer CreatedAt ISO 8601 (yyyy-mm-ddThh:mi:ss) style 126
2. Product UpdatedAt ODBC canonical style 120
3. SO CreatedAt (if stored) default style 109 (mon dd yyyy hh:mi:ss:mmmAM)
4. Supplier emails with CreatedAt style 113 (dd mon yyyy hh:mi:ss:mmm)
5. Warehouse CreatedAt short date+time style 100 (mon dd yyyy hh:miAM/PM)
6. PurchaseOrder CreatedAt style 121 (ODBC w/ milliseconds)
7. SalesOrder UpdatedAt style 20 (ODBC canonical yyyy-mm-dd hh:mi:ss)
8. Product CreatedAt to 'yyyy/MM/dd HH:mm'
9. Customer CreatedAt to date-only via CONVERT 23
10. Inventory CreatedAt as RFC-ish (use 126 then 'Z' to hint UTC)

## String to Date (CONVERT/CAST)
1. ISO '2025-07-15' (style 23)
2. Compact ISO '20250715' (style 112)
3. US '07/15/2025' (style 101)
4. British/French '15/07/2025' (style 103)
5. German '15.07.2025' (style 104)
6. Italian '15-07-2025' (style 105)
7. ISO week date via PARSE (culture en-GB) if allowed
8. Validate many strings to date list (mini table)
9. Filter purchase orders using string parameter (German style)
10. Inventory snapshots on a string date (ISO)

## String to DateTime (CONVERT/TRY_PARSE)
1. Parse ISO datetime '2025-07-15T13:45:00' (style 126)
2. Parse ODBC canonical '2025-07-15 13:45:00' (style 120)
3. Parse US '07/15/2025 01:45 PM' (style 101 + time; style 100 handles mon dd yyyy)
4. Compare CreatedAt to parsed boundary
5. Parse with culture (PARSE) '15 July 2025 21:30'
6. Safe parse many datetimes (mini table)
7. Filter SalesOrder CreatedAt within a parsed window
8. Parse ExpectedDate with time at midnight (style 23 to date then cast)
9. Convert string to datetimeoffset via PARSE
10. Apply parsed datetime to filter Inventory CreatedAt (>= parsed)

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show UTC now and India time now
2. Convert SalesOrder.CreatedAt (UTC) to India time
3. Orders created on 2025-07-31 in India time (date slice in IST)
4. Group orders by India-local hour
5. Convert Customer.CreatedAt to Pacific time
6. Orders created between two India-local timestamps
7. Show UTC offset minutes for India vs Pacific (based on now)
8. Inventory CreatedAt converted to India time and date-only
9. Orders where India-local date differs from UTC date (crossing midnight)
10. Normalize any datetime2 to UTC datetimeoffset

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
