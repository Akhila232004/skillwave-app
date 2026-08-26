![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
DECLARE @NowLocal      datetime    = GETDATE();
DECLARE @NowUTC        datetime    = GETUTCDATE();
```

## Current Date and time (GETDATE)
1. Show server local now, UTC now, and high-precision now
2. Invoices created today (local)
3. Payments in the last 24 hours (local)
4. Energy production for "today" (UTC date)
5. Assets’ age in days as of now (local)
6. Open invoices overdue as of now (local)
7. Meters installed within the last 7 days (local)
8. Now in India Standard Time (IST) using UTC → IST conversion
9. Start and end of today (local) for range filters
10. Customers created this month (local)

## Date Part Function (DATEPART)
1. Invoice year, month, day
2. Quarter of sale
3. Week number of payment date
4. Hour/minute from CreatedAt (Customer)
5. Day-of-year of maintenance
6. Asset commission month name
7. First day-of-week number for invoice date
8. Rate plan effective quarter + year label
9. Production date components
10. Reading date week + weekday name

## Date Difference Function (DATEDIFF)
1. Days until invoice due (negative = overdue)
2. Months between sale and invoice
3. Days between invoice and payment (settlement days)
4. Asset age in years
5. Reading span in July: first vs last reading per meter
6. Days since last maintenance (per asset)
7. Days of production in the last 30 days
8. Months customer has been onboard (CreatedAt → today)
9. Weeks since meter installation
10. Hours between CreatedAt and UpdatedAt (Asset)

## Date Addition/Subtraction (DATEADD)
1. Expected payment date = InvoiceDate + 30 days
2. Rolling 90-day production window ending @RefDate
3. Warranty end = CommissionDate + 5 years
4. Next meter check = InstallationDate + 6 months
5. Rate plan mid-point = EffectiveDate + 3 months
6. First day of invoice month
7. Last day of sale month
8. Due in 15 days from sale date
9. Last 7 days payments (relative to today)
10. Production next day preview (date arithmetic demo)

## Date Formatting (FORMAT)
1. Invoice date as dd-MMM-yyyy
2. Sale date month label "MMM yyyy"
3. Payment datetime (date only shown as custom)
4. Asset commission with day name
5. Rate plan effective "yyyy-MM"
6. Customer CreatedAt with 24h time
7. Invoice quarter label
8. Maintenance date short month/day
9. Production date "yyyyMMdd"
10. Meter install long date

## Weekday Function (DATEPART weekday)
1. Weekday number & name for invoice dates
2. Payments made on weekends
3. Production done on Mondays
4. Maintenance occurring on Friday
5. Count invoices by weekday name
6. Sales by weekday number
7. Readings captured on Sunday
8. First business day (Mon–Fri) readings in July
9. Assets commissioned on weekday #1 (per server DATEFIRST)
10. Weekday histogram for payments

## Date to String (CONVERT with style)
1. ISO (yyyy-mm-dd) style 23
2. Compact (yyyymmdd) style 112
3. US (mm/dd/yyyy) style 101
4. British (dd/mm/yyyy) style 103
5. Mon dd yyyy (style 107)
6. dd Mon yyyy (style 106)
7. yyyy.mm.dd (style 102)
8. Custom via CAST to varchar (default culture-dependent)
9. EOMONTH(SaleDate) to string 23
10. First of month to string 23

## DateTime to String (CONVERT with style)
1. CreatedAt ISO 8601 (style 126)
2. CreatedAt ODBC canonical (style 120)
3. UpdatedAt with milliseconds (style 121)
4. PaymentDateTime custom (yyyy-MM-dd HH:mm)
5. CreatedAt short date/time (style 109)
6. CreatedAt long month name using FORMAT
7. Asset UpdatedAt to RFC-ish
8. PaymentDate to 12-hour clock with AM/PM
9. CreatedAt to time only
10. UpdatedAt to date only

## String to Date (CONVERT/CAST)
1. ISO date string to date
2. Compact yyyymmdd to date
3. US mm/dd/yyyy to date
4. British dd/mm/yyyy to date
5. Mon dd yyyy (style 107)
6. dd Mon yyyy (style 106)
7. yyyy.mm.dd (style 102)
8. Apply parsed constant to filter invoices
9. Parse month-end string and compare to EOMONTH
10. Safe parse invalid returns NULL

## String to DateTime (CONVERT/TRY_PARSE)
1. ISO datetime
2. ODBC canonical
3. With milliseconds (style 121)
4. US datetime (mm/dd/yyyy hh:mi:ss AM)
5. British datetime (dd/mm/yyyy hh:mi:ss)
6. Use parsed value to filter CreatedAt (date part)
7. Parse and add 2 hours
8. Parse text to datetime, then format
9. Try parse bad value (returns NULL)
10. Use parsed datetime to join on date to invoice

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show UTC now and IST converted
2. Treat InvoiceDate as midnight UTC → convert to IST
3. Treat PaymentDate as midnight IST → convert to UTC
4. Customer CreatedAt (assumed UTC) → IST wall time
5. Asset UpdatedAt (assumed UTC) → IST, string formatted
6. Compare invoice due date (UTC midnight) vs IST date (can shift day)
7. Bucket payments by IST weekday name
8. Shift a UTC timestamp to a different zone using SWITCHOFFSET (example: +05:30)
9. Production date as datetime at 18:00 UTC → IST view
10. IST midnight for InvoiceDate, then format

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
