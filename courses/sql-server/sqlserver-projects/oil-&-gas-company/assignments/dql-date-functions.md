![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Show current date/time (server local) and UTC
2. Today's shipments (by ShipDate)
3. Current month shipment value so far
4. Wells spudded in the last 90 days (relative to today)
5. Fields discovered more than 25 years ago (as of today)
6. Production records in the last 7 days (ending today)
7. Open invoices older than 30 days (aging snapshot today)
8. Payments posted today
9. Contracts active today (StartDate <= today AND (EndDate IS NULL OR EndDate >= today))
10. Last 24 hours drilling ops started (assuming StartDate timezone aligned to server)

## Date Part Function (DATEPART)
1. Shipments per year, month
2. Average daily oil by production quarter
3. Drilling starts by hour of day
4. PipelineFlow volume by ISO week number
5. Inventory snapshots by weekday number (1..7)
6. Day-of-year of invoice dates (first 10)
7. Contracts started by month name
8. Production by day name (oil average)
9. Payments by quarter and year
10. Drilling end months frequency

## Date Difference Function (DATEDIFF)
1. Days since well spud
2. Drilling duration (days)
3. Months since contract start
4. Days between invoice date and payment (per payment)
5. Days since last production per well
6. Days since last pipeline flow per pipeline
7. Inventory recency per (Facility,Product)
8. Average drilling duration in days
9. Shipments lead time vs today (days)
10. Years between field discovery and today

## Date Addition/Subtraction (DATEADD)
1. Contracts expiring in next 60 days
2. Prior month shipments (entire previous calendar month)
3. Rolling last 14 days production for a sample well (parameterized)
4. Payments within 5 days of invoice date
5. Add 30 days to latest maintenance per asset to suggest next check
6. Shipments in the next 7 calendar days from today (planning window)
7. Contracts starting in the next quarter
8. Production window: current week (Mon..Sun based on DATEFIRST defaults)
9. Add 90 days to invoice date as hypothetical due date and flag overdue
10. PipelineFlow last 30 days aggregated per pipeline

## Date Formatting (FORMAT)
1. ShipDate as 'yyyy-MM'
2. Invoice month label 'MMM yyyy'
3. ProductionDate 'dd-MMM'
4. Drilling StartDate 'yyyy-MM-dd HH:mm'
5. PaymentDate full day name and date
6. Inventory SnapshotDate as ISO basic 'yyyyMMdd'
7. Contract StartDate quarter label 'Qn yyyy'
8. FlowDate culture-specific month (German)
9. CreatedAt (UTC) standardized ISO 8601
10. Invoice date week number (using FORMAT)

## Weekday Function (DATEPART weekday)
1. Shipments count by weekday (1..7)
2. Average pipeline flow by weekday
3. Production Oil by weekday name
4. Payments by weekday name
5. Drilling starts by weekday
6. Inventory snapshots by weekday (top 7 days)
7. Invoices by weekday number
8. Contracts started by weekday
9. Maintenance events by weekday
10. Fields discovered by weekday (if DiscoveryDate set)

## Date to String (CONVERT with style)
1. InvoiceDate as 23 (yyyy-mm-dd)
2. ShipDate as 112 (yyyymmdd)
3. PaymentDate as 101 (mm/dd/yyyy)
4. FlowDate as 103 (dd/mm/yyyy)
5. SnapshotDate as 105 (dd-mm-yyyy)
6. StartDate as 106 (dd mon yyyy)
7. EndDate as 107 (Mon dd, yyyy)
8. Contract StartDate as 110 (mm-dd-yyyy)
9. InvoiceDate as 120 (yyyy-mm-dd hh:mi:ss) — time part 00:00:00 for date column
10. DiscoveryDate as 113 (dd mon yyyy hh:mm:ss:mmm)

## DateTime to String (CONVERT with style)
1. Customer CreatedAt as 120 (ISO-ish)
2. Pipeline CreatedAt as 121 (ODBC canonical w/ milliseconds)
3. Production CreatedAt as 126 (ISO 8601)
4. Payment CreatedAt as 113 (dd mon yyyy hh:mm:ss:mmm)
5. Invoice CreatedAt as 109 (mon dd yyyy hh:mi:ss:mmmAM)
6. AssetMaintenance CreatedAt as 100 (mon dd yyyy hh:miAM)
7. Shipment CreatedAt as 114 (hh:mi:ss:mmm)
8. Facility CreatedAt as 20 (ODBC canonical)
9. Contract CreatedAt as 9 (mon dd yyyy hh:miAM)
10. Inventory CreatedAt as 127 (ISO8601 with timezone Z if datetimeoffset; here datetime2)

## String to Date (CONVERT/CAST)
1. '2025-07-15' style 23 → date
2. '07/15/2025' style 101 → date
3. '15/07/2025' style 103 → date
4. '15-07-2025' style 105 → date
5. ISO basic '20250715' style 112 → date
6. Parse shipment month text to date (first day) using PARSE (en-US)
7. Values set → convert to date (multi-row)
8. Convert dd Mon yyyy strings using PARSE (en-GB)
9. Convert '2025/07/15' style 111 (yyyy/mm/dd)
10. Convert '2025.07.15' style 102 (yyyy.mm.dd)

## String to DateTime (CONVERT/TRY_PARSE)
1. '2025-07-15 14:30:00' style 120 → datetime
2. '07/15/2025 02:30 PM' style 22 → datetime
3. ISO 8601 '2025-07-15T14:30:00' style 126
4. ODBC canonical '2025-07-15 14:30:00.123' style 121
5. '15/07/2025 14:30:00' style 103 + time
6. Using PARSE with culture 'en-GB'
7. Using TRY_CONVERT to handle invalid gracefully
8. Bulk strings to datetime via VALUES
9. Convert with timezone '2025-07-15 14:30:00 +00:00' to datetimeoffset
10. Build datetime from date + time string

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Current UTC and India Standard Time (IST)
2. Customer CreatedAt UTC → IST
3. Invoice CreatedAt UTC → Pacific Standard Time (PST/PDT auto-handled)
4. Local-date (IST) for payments grouped by day
5. Drilling start timestamp shown in three zones
6. Convert ISO UTC string to IST datetimeoffset
7. Show shipment CreatedAt local hour (IST)
8. Contracts created during IST business hours (09:00–18:00)
9. Daily production counts by IST date
10. Normalize any datetime2 to UTC using AT TIME ZONE (assume stored as local IST given)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
