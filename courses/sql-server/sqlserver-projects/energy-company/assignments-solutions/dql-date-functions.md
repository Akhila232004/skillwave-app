![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions
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
```sql
-- 1. Show server local now, UTC now, and high-precision now
SELECT GETDATE()        AS NowLocal,
       GETUTCDATE()     AS NowUTC,
       SYSDATETIME()    AS NowHiPrecision;

-- 2. Invoices created today (local)
SELECT InvoiceID, InvoiceDate, AmountDue
FROM energy_company.Invoice
WHERE InvoiceDate = CAST(GETDATE() AS date);

-- 3. Payments in the last 24 hours (local)
SELECT PaymentID, PaymentDate, AmountPaid
FROM energy_company.Payment
WHERE PaymentDate >= CAST(DATEADD(HOUR,-24,GETDATE()) AS date);

-- 4. Energy production for "today" (UTC date)
SELECT AssetID, ProductionDate, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate = CAST(GETUTCDATE() AS date);

-- 5. Assets’ age in days as of now (local)
SELECT AssetID, Name, CommissionDate,
       DATEDIFF(DAY, CommissionDate, GETDATE()) AS DaysInService
FROM energy_company.Asset;

-- 6. Open invoices overdue as of now (local)
SELECT InvoiceID, CustomerID, DueDate, AmountDue
FROM energy_company.Invoice
WHERE Status = 'Open'
  AND DueDate < CAST(GETDATE() AS date);

-- 7. Meters installed within the last 7 days (local)
SELECT MeterID, CustomerID, InstallationDate
FROM energy_company.Meter
WHERE InstallationDate >= CAST(DATEADD(DAY,-7,GETDATE()) AS date);

-- 8. Now in India Standard Time (IST) using UTC → IST conversion
SELECT (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS Now_IST;

-- 9. Start and end of today (local) for range filters
SELECT CAST(GETDATE() AS date)                        AS StartOfToday,
       DATEADD(SECOND,-1,DATEADD(DAY,1,CAST(GETDATE() AS date))) AS EndOfToday;

-- 10. Customers created this month (local)
SELECT CustomerID, CreatedAt
FROM energy_company.Customer
WHERE CAST(CreatedAt AS date) >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1);
```

## Date Part Function (DATEPART)
```sql
-- 1. Invoice year, month, day
SELECT InvoiceID,
       DATEPART(YEAR, InvoiceDate)  AS InvYear,
       DATEPART(MONTH, InvoiceDate) AS InvMonth,
       DATEPART(DAY, InvoiceDate)   AS InvDay
FROM energy_company.Invoice;

-- 2. Quarter of sale
SELECT SaleID, SaleDate, DATEPART(QUARTER, SaleDate) AS SaleQuarter
FROM energy_company.EnergySale;

-- 3. Week number of payment date
SELECT PaymentID, PaymentDate, DATEPART(WEEK, PaymentDate) AS ISOWeekLike
FROM energy_company.Payment;

-- 4. Hour/minute from CreatedAt (Customer)
SELECT CustomerID, CreatedAt,
       DATEPART(HOUR, CreatedAt)   AS CreatedHour,
       DATEPART(MINUTE, CreatedAt) AS CreatedMinute
FROM energy_company.Customer;

-- 5. Day-of-year of maintenance
SELECT MaintenanceID, MaintenanceDate,
       DATEPART(DAYOFYEAR, MaintenanceDate) AS DOY
FROM energy_company.AssetMaintenance;

-- 6. Asset commission month name
SELECT AssetID, CommissionDate, DATENAME(MONTH, CommissionDate) AS MonthName
FROM energy_company.Asset;

-- 7. First day-of-week number for invoice date
SELECT TOP (20) InvoiceID, InvoiceDate,
       DATEPART(WEEKDAY, InvoiceDate) AS WkDayNum
FROM energy_company.Invoice
ORDER BY InvoiceDate;

-- 8. Rate plan effective quarter + year label
SELECT RatePlanID, Name,
       CONCAT('Q', DATEPART(QUARTER, EffectiveDate), ' ', DATEPART(YEAR, EffectiveDate)) AS Eff_QY
FROM energy_company.RatePlan;

-- 9. Production date components
SELECT TOP (20) ProductionDate,
       DATEPART(YEAR, ProductionDate)  AS Yr,
       DATEPART(MONTH, ProductionDate) AS Mo,
       DATEPART(DAY, ProductionDate)   AS Dy
FROM energy_company.EnergyProduction
ORDER BY ProductionDate DESC;

-- 10. Reading date week + weekday name
SELECT TOP (20) ReadDate,
       DATEPART(WEEK, ReadDate)  AS WkNum,
       DATENAME(WEEKDAY, ReadDate) AS WkName
FROM energy_company.MeterReading
ORDER BY ReadDate DESC;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days until invoice due (negative = overdue)
SELECT InvoiceID, InvoiceDate, DueDate,
       DATEDIFF(DAY, CAST(GETDATE() AS date), DueDate) AS DaysToDue
FROM energy_company.Invoice;

-- 2. Months between sale and invoice
SELECT i.InvoiceID, i.InvoiceDate, es.SaleDate,
       DATEDIFF(MONTH, es.SaleDate, i.InvoiceDate) AS Months_Sale_to_Invoice
FROM energy_company.Invoice i
JOIN energy_company.EnergySale es
  ON es.SaleID = i.SaleID AND es.SaleDate = i.SaleDate;

-- 3. Days between invoice and payment (settlement days)
SELECT i.InvoiceID, p.PaymentID, i.InvoiceDate, p.PaymentDate,
       DATEDIFF(DAY, i.InvoiceDate, p.PaymentDate) AS SettlementDays
FROM energy_company.Payment p
JOIN energy_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate;

-- 4. Asset age in years
SELECT AssetID, Name, CommissionDate,
       DATEDIFF(YEAR, CommissionDate, GETDATE()) AS YearsInService
FROM energy_company.Asset;

-- 5. Reading span in July: first vs last reading per meter
WITH R AS (
  SELECT MeterID,
         MIN(ReadDate) AS FirstRead,
         MAX(ReadDate) AS LastRead
  FROM energy_company.MeterReading
  WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY MeterID
)
SELECT MeterID, FirstRead, LastRead,
       DATEDIFF(DAY, FirstRead, LastRead) AS DaysSpan
FROM R;

-- 6. Days since last maintenance (per asset)
WITH L AS (
  SELECT AssetID, MAX(MaintenanceDate) AS LastMaint
  FROM energy_company.AssetMaintenance
  GROUP BY AssetID
)
SELECT a.AssetID, a.Name, L.LastMaint,
       DATEDIFF(DAY, L.LastMaint, GETDATE()) AS DaysSinceMaint
FROM energy_company.Asset a
JOIN L ON L.AssetID = a.AssetID;

-- 7. Days of production in the last 30 days
SELECT AssetID,
       DATEDIFF(DAY, DATEADD(DAY,-30, @RefDate), @RefDate) + 1 AS WindowDays,
       COUNT(DISTINCT ProductionDate)                         AS DaysProduced
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate
GROUP BY AssetID;

-- 8. Months customer has been onboard (CreatedAt → today)
SELECT CustomerID, CreatedAt,
       DATEDIFF(MONTH, CAST(CreatedAt AS date), CAST(GETDATE() AS date)) AS MonthsOnboard
FROM energy_company.Customer;

-- 9. Weeks since meter installation
SELECT MeterID, InstallationDate,
       DATEDIFF(WEEK, InstallationDate, CAST(GETDATE() AS date)) AS WeeksSinceInstall
FROM energy_company.Meter;

-- 10. Hours between CreatedAt and UpdatedAt (Asset)
SELECT AssetID, CreatedAt, UpdatedAt,
       DATEDIFF(HOUR, CreatedAt, UpdatedAt) AS HoursBetween
FROM energy_company.Asset;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Expected payment date = InvoiceDate + 30 days
SELECT InvoiceID, InvoiceDate, DATEADD(DAY, 30, InvoiceDate) AS ExpectedPayDate
FROM energy_company.Invoice;

-- 2. Rolling 90-day production window ending @RefDate
SELECT AssetID, ProductionDate, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN DATEADD(DAY,-90,@RefDate) AND @RefDate;

-- 3. Warranty end = CommissionDate + 5 years
SELECT AssetID, Name, CommissionDate,
       DATEADD(YEAR, 5, CommissionDate) AS WarrantyEnd
FROM energy_company.Asset;

-- 4. Next meter check = InstallationDate + 6 months
SELECT MeterID, InstallationDate,
       DATEADD(MONTH, 6, InstallationDate) AS NextCheck
FROM energy_company.Meter;

-- 5. Rate plan mid-point = EffectiveDate + 3 months
SELECT RatePlanID, Name, EffectiveDate,
       DATEADD(MONTH, 3, EffectiveDate) AS MidPoint
FROM energy_company.RatePlan;

-- 6. First day of invoice month
SELECT InvoiceID, InvoiceDate,
       EOMONTH(InvoiceDate, -1) + 1 AS FirstOfMonth
FROM energy_company.Invoice;

-- 7. Last day of sale month
SELECT SaleID, SaleDate, EOMONTH(SaleDate) AS EndOfMonth
FROM energy_company.EnergySale;

-- 8. Due in 15 days from sale date
SELECT SaleID, SaleDate, DATEADD(DAY, 15, SaleDate) AS DueFromSale
FROM energy_company.EnergySale;

-- 9. Last 7 days payments (relative to today)
SELECT PaymentID, PaymentDate, AmountPaid
FROM energy_company.Payment
WHERE PaymentDate BETWEEN CAST(DATEADD(DAY,-7,GETDATE()) AS date) AND CAST(GETDATE() AS date);

-- 10. Production next day preview (date arithmetic demo)
SELECT TOP (20) AssetID, ProductionDate, DATEADD(DAY, 1, ProductionDate) AS NextDay
FROM energy_company.EnergyProduction
ORDER BY ProductionDate DESC;
```

## Date Formatting (FORMAT)
```sql
-- 1. Invoice date as dd-MMM-yyyy
SELECT InvoiceID, FORMAT(InvoiceDate, 'dd-MMM-yyyy') AS InvDateFmt
FROM energy_company.Invoice;

-- 2. Sale date month label "MMM yyyy"
SELECT SaleID, FORMAT(SaleDate, 'MMM yyyy') AS SaleMonth
FROM energy_company.EnergySale;

-- 3. Payment datetime (date only shown as custom)
SELECT PaymentID, FORMAT(PaymentDate, 'yyyy/MM/dd') AS PayDateFmt
FROM energy_company.Payment;

-- 4. Asset commission with day name
SELECT AssetID, FORMAT(CommissionDate, 'dddd, dd-MMM-yyyy') AS CommissionPretty
FROM energy_company.Asset;

-- 5. Rate plan effective "yyyy-MM"
SELECT RatePlanID, FORMAT(EffectiveDate, 'yyyy-MM') AS EffYYYYMM
FROM energy_company.RatePlan;

-- 6. Customer CreatedAt with 24h time
SELECT CustomerID, FORMAT(CreatedAt, 'yyyy-MM-dd HH:mm:ss') AS CreatedAtFmt
FROM energy_company.Customer;

-- 7. Invoice quarter label
SELECT InvoiceID, FORMAT(InvoiceDate, '\Qq yyyy') AS QuarterLabel
FROM energy_company.Invoice;

-- 8. Maintenance date short month/day
SELECT MaintenanceID, FORMAT(MaintenanceDate, 'MMM d') AS MaintMd
FROM energy_company.AssetMaintenance;

-- 9. Production date "yyyyMMdd"
SELECT TOP (20) ProductionDate, FORMAT(ProductionDate, 'yyyyMMdd') AS ProdYYYYMMDD
FROM energy_company.EnergyProduction
ORDER BY ProductionDate DESC;

-- 10. Meter install long date
SELECT MeterID, FORMAT(InstallationDate, 'D') AS InstallLong
FROM energy_company.Meter;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Weekday number & name for invoice dates
SELECT TOP (20) InvoiceID, InvoiceDate,
       DATEPART(WEEKDAY, InvoiceDate) AS WkdayNum,
       DATENAME(WEEKDAY, InvoiceDate) AS WkdayName
FROM energy_company.Invoice
ORDER BY InvoiceDate DESC;

-- 2. Payments made on weekends
SELECT PaymentID, PaymentDate
FROM energy_company.Payment
WHERE DATENAME(WEEKDAY, PaymentDate) IN ('Saturday','Sunday');

-- 3. Production done on Mondays
SELECT TOP (50) AssetID, ProductionDate, EnergyMWh
FROM energy_company.EnergyProduction
WHERE DATENAME(WEEKDAY, ProductionDate) = 'Monday'
ORDER BY ProductionDate DESC;

-- 4. Maintenance occurring on Friday
SELECT MaintenanceID, MaintenanceDate, Description
FROM energy_company.AssetMaintenance
WHERE DATENAME(WEEKDAY, MaintenanceDate) = 'Friday';

-- 5. Count invoices by weekday name
SELECT DATENAME(WEEKDAY, InvoiceDate) AS Wkday, COUNT(*) AS Cnt
FROM energy_company.Invoice
GROUP BY DATENAME(WEEKDAY, InvoiceDate)
ORDER BY Cnt DESC;

-- 6. Sales by weekday number
SELECT DATEPART(WEEKDAY, SaleDate) AS WkdayNum, COUNT(*) AS Cnt
FROM energy_company.EnergySale
GROUP BY DATEPART(WEEKDAY, SaleDate)
ORDER BY WkdayNum;

-- 7. Readings captured on Sunday
SELECT TOP (20) MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE DATENAME(WEEKDAY, ReadDate) = 'Sunday'
ORDER BY ReadDate DESC;

-- 8. First business day (Mon–Fri) readings in July
SELECT mr.*
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND DATENAME(WEEKDAY, mr.ReadDate) NOT IN ('Saturday','Sunday');

-- 9. Assets commissioned on weekday #1 (per server DATEFIRST)
SELECT AssetID, CommissionDate
FROM energy_company.Asset
WHERE DATEPART(WEEKDAY, CommissionDate) = 1;

-- 10. Weekday histogram for payments
SELECT DATENAME(WEEKDAY, PaymentDate) AS Wkday, COUNT(*) Cnt
FROM energy_company.Payment
GROUP BY DATENAME(WEEKDAY, PaymentDate)
ORDER BY Cnt DESC;
```

## Date to String (CONVERT with style)
```sql
-- 1. ISO (yyyy-mm-dd) style 23
SELECT InvoiceID, CONVERT(varchar(10), InvoiceDate, 23) AS Inv_ISO
FROM energy_company.Invoice;

-- 2. Compact (yyyymmdd) style 112
SELECT SaleID, CONVERT(varchar(8), SaleDate, 112) AS Sale_YYYYMMDD
FROM energy_company.EnergySale;

-- 3. US (mm/dd/yyyy) style 101
SELECT PaymentID, CONVERT(varchar(10), PaymentDate, 101) AS Pay_US
FROM energy_company.Payment;

-- 4. British (dd/mm/yyyy) style 103
SELECT MaintenanceID, CONVERT(varchar(10), MaintenanceDate, 103) AS Maint_GB
FROM energy_company.AssetMaintenance;

-- 5. Mon dd yyyy (style 107)
SELECT RatePlanID, CONVERT(varchar(11), EffectiveDate, 107) AS Eff_107
FROM energy_company.RatePlan;

-- 6. dd Mon yyyy (style 106)
SELECT MeterID, CONVERT(varchar(11), InstallationDate, 106) AS Install_106
FROM energy_company.Meter;

-- 7. yyyy.mm.dd (style 102)
SELECT AssetID, CONVERT(varchar(10), CommissionDate, 102) AS Comm_102
FROM energy_company.Asset;

-- 8. Custom via CAST to varchar (default culture-dependent)
SELECT AddressID, CAST(@RefDate AS varchar(30)) AS RefDateAsText
FROM energy_company.Address
WHERE AddressID = 1;

-- 9. EOMONTH(SaleDate) to string 23
SELECT SaleID, CONVERT(varchar(10), EOMONTH(SaleDate), 23) AS Sale_EOM_ISO
FROM energy_company.EnergySale;

-- 10. First of month to string 23
SELECT InvoiceID, CONVERT(varchar(10), (EOMONTH(InvoiceDate,-1)+1), 23) AS Inv_FirstOfMonth
FROM energy_company.Invoice;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. CreatedAt ISO 8601 (style 126)
SELECT CustomerID, CONVERT(varchar(19), CreatedAt, 126) AS Created_ISO8601
FROM energy_company.Customer;

-- 2. CreatedAt ODBC canonical (style 120)
SELECT CustomerID, CONVERT(varchar(19), CreatedAt, 120) AS Created_120
FROM energy_company.Customer;

-- 3. UpdatedAt with milliseconds (style 121)
SELECT AssetID, CONVERT(varchar(23), UpdatedAt, 121) AS Updated_121
FROM energy_company.Asset;

-- 4. PaymentDateTime custom (yyyy-MM-dd HH:mm)
SELECT PaymentID, FORMAT(CAST(PaymentDate AS datetime2), 'yyyy-MM-dd HH:mm') AS Pay_YmdHM
FROM energy_company.Payment;

-- 5. CreatedAt short date/time (style 109)
SELECT CustomerID, CONVERT(varchar(20), CreatedAt, 109) AS Created_109
FROM energy_company.Customer;

-- 6. CreatedAt long month name using FORMAT
SELECT CustomerID, FORMAT(CreatedAt, 'dd MMMM yyyy HH:mm:ss') AS Created_Long
FROM energy_company.Customer;

-- 7. Asset UpdatedAt to RFC-ish
SELECT AssetID, FORMAT(UpdatedAt, 'yyyy-MM-ddTHH:mm:ss') AS Updated_RFCish
FROM energy_company.Asset;

-- 8. PaymentDate to 12-hour clock with AM/PM
SELECT PaymentID, FORMAT(CAST(PaymentDate AS datetime2), 'MM/dd/yyyy hh:mm tt') AS Pay_12h
FROM energy_company.Payment;

-- 9. CreatedAt to time only
SELECT CustomerID, FORMAT(CreatedAt, 'HH:mm:ss') AS Created_TimeOnly
FROM energy_company.Customer;

-- 10. UpdatedAt to date only
SELECT AssetID, FORMAT(UpdatedAt, 'yyyy-MM-dd') AS Updated_DateOnly
FROM energy_company.Asset;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. ISO date string to date
SELECT TRY_CONVERT(date, '2025-07-31', 23) AS ISO_to_date;

-- 2. Compact yyyymmdd to date
SELECT TRY_CONVERT(date, '20250731', 112) AS Ymd_to_date;

-- 3. US mm/dd/yyyy to date
SELECT TRY_CONVERT(date, '07/15/2025', 101) AS US_to_date;

-- 4. British dd/mm/yyyy to date
SELECT TRY_CONVERT(date, '15/07/2025', 103) AS GB_to_date;

-- 5. Mon dd yyyy (style 107)
SELECT TRY_CONVERT(date, 'Jul 31 2025', 107) AS Mon_dd_yyyy_to_date;

-- 6. dd Mon yyyy (style 106)
SELECT TRY_CONVERT(date, '31 Jul 2025', 106) AS dd_Mon_to_date;

-- 7. yyyy.mm.dd (style 102)
SELECT TRY_CONVERT(date, '2025.07.31', 102) AS yyyy_mm_dd_dots;

-- 8. Apply parsed constant to filter invoices
SELECT InvoiceID, InvoiceDate
FROM energy_company.Invoice
WHERE InvoiceDate = TRY_CONVERT(date, '2025-07-31', 23);

-- 9. Parse month-end string and compare to EOMONTH
SELECT TRY_CONVERT(date, '2025-07-31', 23) AS Parsed,
       EOMONTH('2025-07-10')               AS EOM;

-- 10. Safe parse invalid returns NULL
SELECT TRY_CONVERT(date, '31/31/2025', 103) AS InvalidToNull;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. ISO datetime
SELECT TRY_CONVERT(datetime2, '2025-07-31T13:45:00', 126) AS ISO_dt;

-- 2. ODBC canonical
SELECT TRY_CONVERT(datetime2, '2025-07-31 13:45:00', 120) AS Canonical_dt;

-- 3. With milliseconds (style 121)
SELECT TRY_CONVERT(datetime2, '2025-07-31 13:45:00.123', 121) AS WithMs_dt;

-- 4. US datetime (mm/dd/yyyy hh:mi:ss AM)
SELECT TRY_CONVERT(datetime2, '07/31/2025 01:45:00 PM', 101) AS US_dt;

-- 5. British datetime (dd/mm/yyyy hh:mi:ss)
SELECT TRY_CONVERT(datetime2, '31/07/2025 13:45:00', 103) AS GB_dt;

-- 6. Use parsed value to filter CreatedAt (date part)
SELECT CustomerID, CreatedAt
FROM energy_company.Customer
WHERE CAST(CreatedAt AS date) = CAST(TRY_CONVERT(datetime2, '2025-07-15 00:00:00', 120) AS date);

-- 7. Parse and add 2 hours
SELECT DATEADD(HOUR, 2, TRY_CONVERT(datetime2, '2025-07-31 22:00:00', 120)) AS Plus2h;

-- 8. Parse text to datetime, then format
SELECT FORMAT(TRY_CONVERT(datetime2, '2025-07-31 13:45:00', 120), 'dd-MMM-yyyy HH:mm') AS Pretty;

-- 9. Try parse bad value (returns NULL)
SELECT TRY_CONVERT(datetime2, '2025-13-31 12:00:00', 120) AS BadParse;

-- 10. Use parsed datetime to join on date to invoice
SELECT i.InvoiceID, i.InvoiceDate
FROM energy_company.Invoice i
JOIN (SELECT TRY_CONVERT(date, '2025-07-01', 23) AS D1,
             TRY_CONVERT(date, '2025-07-31', 23) AS D2) X
  ON i.InvoiceDate BETWEEN X.D1 AND X.D2;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show UTC now and IST converted
SELECT SYSUTCDATETIME()                                   AS NowUTC,
       (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS NowIST;

-- 2. Treat InvoiceDate as midnight UTC → convert to IST
SELECT TOP (20) InvoiceID, InvoiceDate,
       (CAST(InvoiceDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS Invoice_IST
FROM energy_company.Invoice
ORDER BY InvoiceDate DESC;

-- 3. Treat PaymentDate as midnight IST → convert to UTC
SELECT TOP (20) PaymentID, PaymentDate,
       (CAST(PaymentDate AS datetime2) AT TIME ZONE 'India Standard Time') AT TIME ZONE 'UTC' AS Payment_UTC
FROM energy_company.Payment
ORDER BY PaymentDate DESC;

-- 4. Customer CreatedAt (assumed UTC) → IST wall time
SELECT CustomerID, CreatedAt,
       (CAST(CreatedAt AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS CreatedAt_IST
FROM energy_company.Customer;

-- 5. Asset UpdatedAt (assumed UTC) → IST, string formatted
SELECT AssetID,
       FORMAT( ((CAST(UpdatedAt AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time'),
               'yyyy-MM-dd HH:mm:ss zzz') AS UpdatedAt_IST
FROM energy_company.Asset;

-- 6. Compare invoice due date (UTC midnight) vs IST date (can shift day)
SELECT InvoiceID, DueDate,
       CONVERT(date, ((CAST(DueDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')) AS DueDate_IST_Date
FROM energy_company.Invoice;

-- 7. Bucket payments by IST weekday name
SELECT DATENAME(WEEKDAY, CONVERT(date, ((CAST(PaymentDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time'))) AS WeekdayIST,
       COUNT(*) AS Cnt
FROM energy_company.Payment
GROUP BY DATENAME(WEEKDAY, CONVERT(date, ((CAST(PaymentDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')))
ORDER BY Cnt DESC;

-- 8. Shift a UTC timestamp to a different zone using SWITCHOFFSET (example: +05:30)
SELECT SWITCHOFFSET(SYSDATETIMEOFFSET(), '+05:30') AS Now_Offset_530;

-- 9. Production date as datetime at 18:00 UTC → IST view
SELECT TOP (20) ProductionDate,
       (DATETIME2FROMPARTS(YEAR(ProductionDate), MONTH(ProductionDate), DAY(ProductionDate), 18, 0, 0, 0, 7)
        AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS Prod18UTC_as_IST
FROM energy_company.EnergyProduction
ORDER BY ProductionDate DESC;

-- 10. IST midnight for InvoiceDate, then format
SELECT InvoiceID,
       FORMAT( ((DATETIME2FROMPARTS(YEAR(InvoiceDate),MONTH(InvoiceDate),DAY(InvoiceDate),0,0,0,0,7)
                AT TIME ZONE 'India Standard Time')),
               'yyyy-MM-dd HH:mm:ss zzz') AS IST_Midnight_String
FROM energy_company.Invoice;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
