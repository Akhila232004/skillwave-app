![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Sales orders placed today (server local date)
2. Shipments made in the last 24 hours
3. Inventory snapshots taken on the last calendar day (yesterday)
4. Batches produced in the last 7 days
5. QC tests executed in the current month
6. Regulatory submissions filed year-to-date
7. Customers created in the last 30 days (uses CreatedAt datetime2)
8. Suppliers updated today (assuming UpdatedAt column exists as per DDL)
9. Orders due (placed) in the last business week (last 5 days)
10. “Now” stamps for reference

## Date Part Function (DATEPART)
1. Get year/month/day from ShipmentDate
2. Extract quarter from OrderDate
3. ISO week number for QC TestDate
4. Hour/minute/second from CreatedAt in Supplier
5. Day of week for Inventory snapshot (1=Sunday default settings)
6. Day of year for BatchDate
7. Month name via DATENAME
8. Quarter label (Q1..Q4) for SubmissionDate
9. Minute component of RS CreatedAt
10. Week number + year key for Inventory

## Date Difference Function (DATEDIFF)
1. Days between OrderDate and GETDATE()
2. Days between BatchDate and corresponding first QC TestDate (min by batch)
3. Days between Inventory snapshots and month end
4. Hours between Supplier CreatedAt and now
5. Weeks between earliest and latest ShipmentDate per customer
6. Months from first order to last order per customer
7. Age (days) of regulatory submission
8. Days between consecutive inventory snapshots per center/product
9. Minutes between QC TestDate and midnight of same day
10. Days between ManufacturingBatch and corresponding Shipment to any customer (same ProductID, nearest same-day or later)

## Date Addition/Subtraction (DATEADD)
1. Expected QC window: BatchDate + 2 days
2. Inventory forecast date: SnapshotDate + 7 days
3. Order follow-up date: OrderDate + 3 days
4. Shipment SLA date: ShipmentDate + 5 days
5. Submission review checkpoint: SubmissionDate + 14 days
6. Prior month same day for inventory
7. Next quarter start from OrderDate
8. Batch expiry hypothetical: BatchDate + 365 days
9. QC retest due: TestDate + 30 days
10. Rolling window: GETDATE() - 90 days

## Date Formatting (FORMAT)
1. OrderDate as 'yyyy-MM-dd'
2. ShipmentDate as 'dd-MMM-yyyy'
3. SubmissionDate as 'MMM yyyy'
4. BatchDate with day name
5. Inventory SnapshotDate as week-and-year
6. Supplier CreatedAt full timestamp
7. QC TestDate short date
8. SalesOrder OrderDate month name only
9. ShipmentDate quarter label
10. Regulatory SubmissionDate custom 'ddd dd-MMM-yy'

## Weekday Function (DATEPART weekday)
1. Orders placed on Monday (assuming DATEFIRST default; Monday=2 in US English)
2. Count shipments per weekday
3. Batches on weekends
4. Inventory snapshots taken on Fridays
5. QC tests on Wednesdays in July 2025
6. Submissions filed on the first business day (Mon-Fri) of month
7. Orders on last weekday of month
8. Shipments not on weekends
9. Weekday name + count of batches
10. First Monday of each OrderDate month

## Date to String (CONVERT with style)
1. ISO 8601 date (yyyy-mm-dd)
2. Compact yyyymmdd
3. dd Mon yyyy (style 106)
4. mon dd yyyy (style 107)
5. mm/dd/yy (style 1)
6. dd/mm/yy (style 3)
7. yy.mm.dd (style 2)
8. dd-mm-yy (style 5)
9. dd mon yy (style 6)
10. mon dd yy (style 7)

## DateTime to String (CONVERT with style)
1. yyyy-mm-dd hh:mi:ss (24h, style 120)
2. mm/dd/yy hh:mi AM (style 0)
3. mon dd yyyy hh:miAM (style 9)
4. dd mon yyyy hh:mi:ss:mmm(24h) (style 113)
5. yyyymmdd hh:mi:ss (style 112 + manual time)
6. ODBC canonical (style 121)
7. RFC1123-ish (style 100)
8. Culture-neutral ISO (style 126)
9. Short date + time (style 109)
10. British/French default (style 103 dd/mm/yyyy)

## String to Date (CONVERT/CAST)
1. ISO literal to DATE
2. dd/mm/yyyy to DATE using CONVERT with style 103
3. yyyymmdd to DATE using CONVERT with style 112
4. dd-MMM-yyyy via PARSE (requires CLR & language)
5. mm/dd/yyyy via CONVERT style 101
6. dd Mon yy via CONVERT style 6
7. yy.mm.dd via CONVERT style 2
8. From yyyy-mm-ddT00:00:00 using CONVERT style 126 (ISO8601)
9. From textual month name via PARSE
10. Validate safe conversion with TRY_CONVERT

## String to DateTime (CONVERT/TRY_PARSE)
1. ISO datetime to datetime2
2. US format mm/dd/yyyy hh:mi:ss via CONVERT 101 + additional
3. ODBC canonical (style 121)
4. Europe dd/mm/yyyy hh:mi:ss via style 103
5. RFC-ish style 113
6. 24h ISO (style 126)
7. PARSE with culture (German)
8. TRY_PARSE returns NULL for bad string
9. ShipmentDate + literal time to datetime
10. From yyyymmdd and hhmmss

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show current time in local TZ, UTC, and India (IST)
2. Convert Supplier.CreatedAt (assumed stored UTC) to IST display
3. Orders today in IST (compare IST date)
4. Shipments last 24 hours in IST
5. Display SubmissionDate at midnight in IST
6. Normalize any datetimeoffset to UTC using SWITCHOFFSET (example: now)
7. QC TestDate (date) as IST midnight and end-of-day (IST)
8. Calculate hours between Supplier.CreatedAt and now in IST
9. Inventory snapshots on specific IST date '2025-07-31'
10. Store current IST timestamp as datetimeoffset (for logging)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
