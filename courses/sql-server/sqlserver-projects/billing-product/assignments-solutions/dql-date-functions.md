![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Display current date and time
SELECT GETDATE() AS CurrentDateTime;

-- 2. Display only the current date
SELECT CAST(GETDATE() AS date) AS TodayDate;

-- 3. Display only the current time
SELECT CAST(GETDATE() AS time) AS CurrentTime;

-- 4. Insert a new bill with bill_date = GETDATE()
INSERT INTO billing_product.bill (bill_id, customer_id, bill_date, total_amount)
VALUES (13, 2, GETDATE(), 999.99);

-- 5. Update bill_date of bill_id = 5 to GETDATE()
UPDATE billing_product.bill
SET bill_date = GETDATE()
WHERE bill_id = 5;

-- 6. List bills with bill_date on or before now
SELECT * FROM billing_product.bill
WHERE bill_date <= GETDATE();

-- 7. List bills created today
SELECT * FROM billing_product.bill
WHERE CAST(bill_date AS date) = CAST(GETDATE() AS date);

-- 8. Show GETDATE() formatted as ISO
SELECT CONVERT(varchar(19), GETDATE(), 120) AS ISODateTime;

-- 9. Show current year using GETDATE()
SELECT DATEPART(year, GETDATE()) AS CurrentYear;

-- 10. Show weekday name of GETDATE()
SELECT DATENAME(weekday, GETDATE()) AS TodayName;
```

## Date Part Function (DATEPART)
```sql
-- 1. Extract year from each bill_date
SELECT bill_id, DATEPART(year, bill_date) AS BillYear
FROM billing_product.bill;

-- 2. Extract month from each bill_date
SELECT bill_id, DATEPART(month, bill_date) AS BillMonth
FROM billing_product.bill;

-- 3. Extract day from each bill_date
SELECT bill_id, DATEPART(day, bill_date) AS BillDay
FROM billing_product.bill;

-- 4. Extract hour from current time
SELECT DATEPART(hour, GETDATE()) AS CurrHour;

-- 5. Extract minute from current time
SELECT DATEPART(minute, GETDATE()) AS CurrMinute;

-- 6. Extract second from current time
SELECT DATEPART(second, GETDATE()) AS CurrSecond;

-- 7. Extract weekday index (1=Sunday)
SELECT bill_id, DATEPART(weekday, bill_date) AS WeekdayIndex
FROM billing_product.bill;

-- 8. Extract ISO week number
SELECT bill_id, DATEPART(iso_week, bill_date) AS ISOWeek
FROM billing_product.bill;

-- 9. Extract day of year
SELECT bill_id, DATEPART(dayofyear, bill_date) AS DayOfYear
FROM billing_product.bill;

-- 10. Extract quarter
SELECT bill_id, DATEPART(quarter, bill_date) AS BillQuarter
FROM billing_product.bill;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days since each bill_date
SELECT bill_id,
       DATEDIFF(day, bill_date, GETDATE()) AS DaysSinceBill
FROM billing_product.bill;

-- 2. Months since each bill_date
SELECT bill_id,
       DATEDIFF(month, bill_date, GETDATE()) AS MonthsSinceBill
FROM billing_product.bill;

-- 3. Years since each bill_date
SELECT bill_id,
       DATEDIFF(year, bill_date, GETDATE()) AS YearsSinceBill
FROM billing_product.bill;

-- 4. Hours between bill_date and now
SELECT bill_id,
       DATEDIFF(hour, bill_date, GETDATE()) AS HoursSinceBill
FROM billing_product.bill;

-- 5. Minutes between bill_date and now
SELECT bill_id,
       DATEDIFF(minute, bill_date, GETDATE()) AS MinutesSinceBill
FROM billing_product.bill;

-- 6. Seconds between bill_date and now
SELECT bill_id,
       DATEDIFF(second, bill_date, GETDATE()) AS SecondsSinceBill
FROM billing_product.bill;

-- 7. Days between bill 1 and bill 2
SELECT DATEDIFF(day,
       (SELECT bill_date FROM billing_product.bill WHERE bill_id = 1),
       (SELECT bill_date FROM billing_product.bill WHERE bill_id = 2)
) AS DaysBetweenBills;

-- 8. Weeks between earliest and latest bill
SELECT DATEDIFF(week,
       MIN(bill_date),
       MAX(bill_date)
) AS WeeksSpan
FROM billing_product.bill;

-- 9. Months between first and last bill of customer_id=3
SELECT DATEDIFF(month,
       MIN(bill_date),
       MAX(bill_date)
) AS Cust3MonthSpan
FROM billing_product.bill
WHERE customer_id = 3;

-- 10. Days difference from a fixed date
SELECT bill_id,
       DATEDIFF(day, '2023-01-01', bill_date) AS DaysFrom20230101
FROM billing_product.bill;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Add 7 days to each bill_date
SELECT bill_id,
       DATEADD(day, 7, bill_date) AS Plus7Days
FROM billing_product.bill;

-- 2. Subtract 7 days from each bill_date
SELECT bill_id,
       DATEADD(day, -7, bill_date) AS Minus7Days
FROM billing_product.bill;

-- 3. Add 1 month to each bill_date
SELECT bill_id,
       DATEADD(month, 1, bill_date) AS NextMonth
FROM billing_product.bill;

-- 4. Subtract 1 month from each bill_date
SELECT bill_id,
       DATEADD(month, -1, bill_date) AS PrevMonth
FROM billing_product.bill;

-- 5. Add 1 year to each bill_date
SELECT bill_id,
       DATEADD(year, 1, bill_date) AS NextYear
FROM billing_product.bill;

-- 6. Subtract 1 year from each bill_date
SELECT bill_id,
       DATEADD(year, -1, bill_date) AS PrevYear
FROM billing_product.bill;

-- 7. Add 3 hours to current time
SELECT DATEADD(hour, 3, GETDATE()) AS In3Hours;

-- 8. Add 30 minutes to current time
SELECT DATEADD(minute, 30, GETDATE()) AS In30Min;

-- 9. Add 45 seconds to current time
SELECT DATEADD(second, 45, GETDATE()) AS In45Sec;

-- 10. Calculate due date 30 days after bill_date
SELECT bill_id,
       DATEADD(day, 30, bill_date) AS DueDate
FROM billing_product.bill;
```

## Date Formatting (FORMAT)
```sql
-- 1. Format bill_date as 'yyyy-MM-dd'
SELECT bill_id,
       FORMAT(bill_date, 'yyyy-MM-dd') AS FmtDate
FROM billing_product.bill;

-- 2. Format bill_date as 'dd/MM/yyyy'
SELECT bill_id,
       FORMAT(bill_date, 'dd/MM/yyyy') AS FmtDateEU
FROM billing_product.bill;

-- 3. Format bill_date as 'MMMM dd, yyyy'
SELECT bill_id,
       FORMAT(bill_date, 'MMMM dd, yyyy') AS FmtLongDate
FROM billing_product.bill;

-- 4. Format bill_date time as 'HH:mm:ss'
SELECT bill_id,
       FORMAT(bill_date, 'HH:mm:ss') AS FmtTime
FROM billing_product.bill;

-- 5. Format now as 'yyyy-MM-dd HH:mm'
SELECT FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm') AS FmtNow;

-- 6. Format bill_date as week name
SELECT bill_id,
       FORMAT(bill_date, 'dddd') AS DayName
FROM billing_product.bill;

-- 7. Format bill_date as month name short
SELECT bill_id,
       FORMAT(bill_date, 'MMM') AS MonAbbrev
FROM billing_product.bill;

-- 8. Format bill_date with ordinal day
SELECT bill_id,
       FORMAT(bill_date, 'dd''th'' MMM yyyy') AS FmtOrdinal
FROM billing_product.bill;

-- 9. Format line_total as currency
SELECT billdetail_id,
       FORMAT(line_total, 'C2') AS FmtCurrency
FROM billing_product.billdetails;

-- 10. Format bill_date with ISO 8601
SELECT bill_id,
       FORMAT(bill_date, 'yyyy-MM-ddTHH:mm:ss') AS FmtISO8601
FROM billing_product.bill;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Get weekday number (1=Sunday)
SELECT bill_id,
       DATEPART(weekday, bill_date) AS WdayNum
FROM billing_product.bill;

-- 2. Filter bills on Sundays
SELECT * FROM billing_product.bill
WHERE DATEPART(weekday, bill_date) = 1;

-- 3. Filter bills on Saturdays
SELECT * FROM billing_product.bill
WHERE DATEPART(weekday, bill_date) = 7;

-- 4. Count bills per weekday
SELECT DATEPART(weekday, bill_date) AS Wday,
       COUNT(*) AS BillCount
FROM billing_product.bill
GROUP BY DATEPART(weekday, bill_date);

-- 5. Show weekday name alongside bill
SELECT bill_id,
       DATENAME(weekday, bill_date) AS WdayName
FROM billing_product.bill;

-- 6. Bills on business days (Mon–Fri)
SELECT * FROM billing_product.bill
WHERE DATEPART(weekday, bill_date) BETWEEN 2 AND 6;

-- 7. First bill of each weekday
SELECT DATEPART(weekday, bill_date) AS Wday,
       MIN(bill_date) AS FirstDate
FROM billing_product.bill
GROUP BY DATEPART(weekday, bill_date);

-- 8. Bills on weekend days
SELECT * FROM billing_product.bill
WHERE DATEPART(weekday, bill_date) IN (1,7);

-- 9. Add weekday number to each bill_date
SELECT bill_id,
       bill_date,
       DATEPART(weekday, bill_date) + 1 AS NextWeekdayNum
FROM billing_product.bill;

-- 10. Bills skipping weekends (count business days)
SELECT bill_id,
       DATEDIFF(day, 
         bill_date, 
         DATEADD(weekday, 5, bill_date)
       ) AS SkipToFriday
FROM billing_product.bill;
```

## Date to String (CONVERT with style)
```sql
-- 1. Convert bill_date to 'yyyy-mm-dd'
SELECT bill_id,
       CONVERT(varchar(10), bill_date, 23) AS StrISO
FROM billing_product.bill;

-- 2. Convert bill_date to 'mm/dd/yyyy'
SELECT bill_id,
       CONVERT(varchar(10), bill_date, 101) AS StrUS
FROM billing_product.bill;

-- 3. Convert bill_date to 'dd/mm/yyyy'
SELECT bill_id,
       CONVERT(varchar(10), bill_date, 103) AS StrUK
FROM billing_product.bill;

-- 4. Convert bill_date to 'yyyymmdd'
SELECT bill_id,
       CONVERT(varchar(8), bill_date, 112) AS StrCompact
FROM billing_product.bill;

-- 5. Convert bill_date to 'Mon dd yyyy'
SELECT bill_id,
       CONVERT(varchar(11), bill_date, 106) AS StrMed
FROM billing_product.bill;

-- 6. Convert bill_date to 'dd mon yy'
SELECT bill_id,
       CONVERT(varchar(9), bill_date, 6) AS StrShort
FROM billing_product.bill;

-- 7. Convert GETDATE() to ISO8601
SELECT CONVERT(varchar(30), GETDATE(), 126) AS StrISO8601;

-- 8. Convert GETDATE() to style 20
SELECT CONVERT(varchar(30), GETDATE(), 20) AS Str20;

-- 9. Convert GETDATE() to style 1
SELECT CONVERT(varchar(10), GETDATE(), 1) AS Str1;

-- 10. Convert GETDATE() to style 3
SELECT CONVERT(varchar(10), GETDATE(), 3) AS Str3;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. bill_date with time 'yyyy-mm-dd hh:mi:ss'
SELECT bill_id,
       CONVERT(varchar(19), bill_date, 120) AS DT120
FROM billing_product.bill;

-- 2. bill_date with milliseconds 'yyyy-mm-dd hh:mi:ss.mmm'
SELECT bill_id,
       CONVERT(varchar(23), bill_date, 121) AS DT121
FROM billing_product.bill;

-- 3. NOW with milliseconds
SELECT CONVERT(varchar(23), GETDATE(), 121) AS Now121;

-- 4. bill_date in style 113
SELECT bill_id,
       CONVERT(varchar(23), bill_date, 113) AS DT113
FROM billing_product.bill;

-- 5. bill_date in style 109
SELECT bill_id,
       CONVERT(varchar(23), bill_date, 109) AS DT109
FROM billing_product.bill;

-- 6. bill_date in style 126 (ISO8601)
SELECT bill_id,
       CONVERT(varchar(30), bill_date, 126) AS DT126
FROM billing_product.bill;

-- 7. GETDATE() in style 127 (ISO8601 +TZ)
SELECT CONVERT(varchar(30), GETDATE(), 127) AS DT127;

-- 8. bill_date in style 3 with time
SELECT bill_id,
       CONVERT(varchar(20), bill_date, 3) + ' ' + CONVERT(varchar(8), bill_date, 108) AS DT3_108
FROM billing_product.bill;

-- 9. bill_date in style 23 with time
SELECT bill_id,
       CONVERT(varchar(10), bill_date, 23) + ' ' + CONVERT(varchar(8), bill_date, 108) AS DT23_108
FROM billing_product.bill;

-- 10. GETDATE() in style 14 (hh:mi:ss:mmm)
SELECT CONVERT(varchar(12), GETDATE(), 114) AS Time114;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Convert '2023-04-15' to date
SELECT CONVERT(date, '2023-04-15', 23) AS ToDate1;

-- 2. Convert '04/15/2023' US format
SELECT CONVERT(date, '04/15/2023', 101) AS ToDate2;

-- 3. Convert '15/04/2023' UK format
SELECT CONVERT(date, '15/04/2023', 103) AS ToDate3;

-- 4. Convert '20230415' compact format
SELECT CONVERT(date, '20230415', 112) AS ToDate4;

-- 5. CAST string to date
SELECT CAST('2023-04-15' AS date) AS CastDate;

-- 6. TRY_CONVERT date from invalid
SELECT TRY_CONVERT(date, 'InvalidDate', 23) AS TryDate;

-- 7. Convert '15-Apr-2023' format 106
SELECT CONVERT(date, '15 Apr 2023', 106) AS ToDate5;

-- 8. Convert style 1 two-digit year
SELECT CONVERT(date, '04/15/23', 1) AS ToDate6;

-- 9. Convert 'Apr 15, 2023' style 107
SELECT CONVERT(date, 'Apr 15, 2023', 107) AS ToDate7;

-- 10. Convert 'Sat Apr 15 2023' style 100
SELECT CONVERT(date, 'Sat Apr 15 2023', 100) AS ToDate8;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Convert '2023-04-15 13:45:00' to datetime
SELECT CONVERT(datetime, '2023-04-15 13:45:00', 120) AS ToDT1;

-- 2. Convert ISO8601 with mmm '121'
SELECT CONVERT(datetime, '2023-04-15 13:45:00.123', 121) AS ToDT2;

-- 3. CAST ISO string to datetime2
SELECT CAST('2023-04-15T13:45:00' AS datetime2) AS ToDT2_2;

-- 4. TRY_PARSE UK format
SELECT TRY_PARSE('15/04/2023 13:45' AS datetime USING 'en-GB') AS TryDT1;

-- 5. Convert style 113
SELECT CONVERT(datetime, '15 Apr 2023 13:45:00:123', 113) AS ToDT3;

-- 6. Convert style 109
SELECT CONVERT(datetime, 'Apr 15 2023  1:45PM', 109) AS ToDT4;

-- 7. Convert with timezone offset
SELECT CONVERT(datetimeoffset, '2023-04-15 13:45:00 +05:30', 127) AS ToDTO1;

-- 8. TRY_CONVERT datetime2 from compact
SELECT TRY_CONVERT(datetime2, '20230415134500') AS TryDT5;

-- 9. Convert style 126 to datetimeoffset
SELECT CONVERT(datetimeoffset, '2023-04-15T13:45:00.1234567', 126) AS ToDTO2;

-- 10. TRY_PARSE month name format
SELECT TRY_PARSE('April 15, 2023 13:45:00' AS datetime2 USING 'en-US') AS TryDT6;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show current UTC time
SELECT GETDATE() AT TIME ZONE 'UTC' AS UTCNow;

-- 2. Convert current UTC to India Standard Time
SELECT GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS ISTNow;

-- 3. Convert bill_date (assumed UTC) to IST
SELECT bill_id,
       bill_date AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS BillDate_IST
FROM billing_product.bill;

-- 4. Convert bill_date to Pacific Standard Time
SELECT bill_id,
       bill_date AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific Standard Time' AS BillDate_PST
FROM billing_product.bill;

-- 5. Use SWITCHOFFSET to shift bill_dateoffset by +02:00
SELECT bill_id,
       SWITCHOFFSET(bill_date AT TIME ZONE 'UTC', '+02:00') AS BillDate_CET
FROM billing_product.bill;

-- 6. Insert current time with timezone
DECLARE @now_dt datetimeoffset = GETDATE() AT TIME ZONE 'UTC';
SELECT @now_dt AS NowUTC;

-- 7. Filter bills where IST local date is today
SELECT *
FROM billing_product.bill
WHERE CONVERT(date, bill_date AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time') = CAST(GETDATE() AT TIME ZONE 'India Standard Time' AS date);

-- 8. Compare bill_date IST to a fixed IST datetime
SELECT bill_id
FROM billing_product.bill
WHERE (bill_date AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time') > '2023-04-15T00:00:00+05:30';

-- 9. Show difference in hours between UTC and IST for bill_date
SELECT bill_id,
       DATEDIFF(hour, 
         bill_date AT TIME ZONE 'UTC', 
         bill_date AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time'
       ) AS HourOffset
FROM billing_product.bill;

-- 10. Convert bill_date from local to UTC (reverse)
SELECT bill_id,
       SWITCHOFFSET(bill_date AT TIME ZONE 'India Standard Time', '+00:00') AS BillDate_UTC
FROM billing_product.bill;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
