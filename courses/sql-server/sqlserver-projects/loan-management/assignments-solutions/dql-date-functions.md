![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Display current date and time.
SELECT GETDATE() AS current_datetime;
-- 2. Display current date only.
SELECT CAST(GETDATE() AS DATE) AS current_date;
-- 3. Find loans started today.
SELECT * FROM loan_management.loans
 WHERE CAST(start_date AS DATE) = CAST(GETDATE() AS DATE);
-- 4. Find payments made up to current datetime.
SELECT * FROM loan_management.loan_payments
 WHERE payment_date <= CAST(GETDATE() AS DATE);
-- 5. List borrowers whose birthday is today.
SELECT * FROM loan_management.borrowers
 WHERE DATEPART(month, date_of_birth) = DATEPART(month, GETDATE())
   AND DATEPART(day,   date_of_birth) = DATEPART(day,   GETDATE());
-- 6. Calculate seconds since a loan started.
SELECT loan_id,
       DATEDIFF(second, start_date, GETDATE()) AS seconds_since_start
  FROM loan_management.loans;
-- 7. Show loans created within the last 7 days.
SELECT * FROM loan_management.loans
 WHERE start_date >= DATEADD(day, -7, CAST(GETDATE() AS DATE));
-- 8. Insert a test payment record using current datetime.
INSERT INTO loan_management.loan_payments (payment_id, loan_id, payment_date, amount, principal_component, interest_component)
VALUES (999, 1, GETDATE(), 100.00, 80.00, 20.00);
-- 9. Delete the test payment record inserted today.
DELETE FROM loan_management.loan_payments
 WHERE payment_id = 999
   AND CAST(payment_date AS DATE) = CAST(GETDATE() AS DATE);
-- 10. Update a loan’s start_date to current date for loan_id = 1.
UPDATE loan_management.loans
   SET start_date = CAST(GETDATE() AS DATE)
 WHERE loan_id = 1;
```

## Date Part Function (DATEPART)
```sql
-- 1. Extract year from loan start_date.
SELECT loan_id, DATEPART(year, start_date)   AS start_year FROM loan_management.loans;
-- 2. Extract month from payment_date.
SELECT payment_id, DATEPART(month, payment_date) AS pay_month FROM loan_management.loan_payments;
-- 3. Extract day from borrower date_of_birth.
SELECT borrower_id, DATEPART(day, date_of_birth)  AS birth_day FROM loan_management.borrowers;
-- 4. Extract hour from current datetime.
SELECT DATEPART(hour,   GETDATE()) AS current_hour;
-- 5. Extract minute from current datetime.
SELECT DATEPART(minute, GETDATE()) AS current_minute;
-- 6. Extract second from current datetime.
SELECT DATEPART(second, GETDATE()) AS current_second;
-- 7. Extract quarter from loan start_date.
SELECT loan_id, DATEPART(quarter, start_date) AS start_quarter FROM loan_management.loans;
-- 8. Extract week of year from payment_date.
SELECT payment_id, DATEPART(week, payment_date)   AS pay_week FROM loan_management.loan_payments;
-- 9. Extract ISO year from payment_date.
SELECT payment_id, DATEPART(isoyear, payment_date) AS iso_year FROM loan_management.loan_payments;
-- 10. Extract microsecond from SYSDATETIME().
SELECT DATEPART(microsecond, SYSDATETIME())     AS current_microsecond;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Calculate days between loan start_date and today.
SELECT loan_id,
       DATEDIFF(day, start_date, GETDATE()) AS days_since_start
  FROM loan_management.loans;
-- 2. Calculate months between start_date and payment_date.
SELECT p.payment_id,
       DATEDIFF(month, l.start_date, p.payment_date) AS months_between
  FROM loan_management.loan_payments p
  JOIN loan_management.loans l ON p.loan_id = l.loan_id;
-- 3. Calculate years between date_of_birth and today.
SELECT borrower_id,
       DATEDIFF(year, date_of_birth, GETDATE())  AS age_years
  FROM loan_management.borrowers;
-- 4. Calculate hours between two specific payments (IDs 1 and 2).
SELECT DATEDIFF(hour,
       (SELECT payment_date FROM loan_management.loan_payments WHERE payment_id = 1),
       (SELECT payment_date FROM loan_management.loan_payments WHERE payment_id = 2)
       ) AS hours_diff;
-- 5. Calculate seconds between GETDATE() and loan start_date.
SELECT loan_id,
       DATEDIFF(second, start_date, GETDATE())  AS seconds_diff
  FROM loan_management.loans;
-- 6. Calculate days between the two most recent payments.
WITH LastTwo AS (
  SELECT TOP 2 payment_date
    FROM loan_management.loan_payments
   ORDER BY payment_date DESC
)
SELECT DATEDIFF(day, MIN(payment_date), MAX(payment_date)) AS days_between
  FROM LastTwo;
-- 7. Calculate weeks since loan start.
SELECT loan_id,
       DATEDIFF(week, start_date, GETDATE())    AS weeks_since_start
  FROM loan_management.loans;
-- 8. Calculate milliseconds between GETDATE() and SYSDATETIME().
SELECT DATEDIFF(millisecond, GETDATE(), SYSDATETIME()) AS ms_diff;
-- 9. Calculate full day difference ignoring time portion.
SELECT loan_id,
       DATEDIFF(day, CAST(start_date AS DATE), CAST(GETDATE() AS DATE)) AS full_days_diff
  FROM loan_management.loans;
-- 10. Approximate business days (exclude weekends).
SELECT loan_id,
       DATEDIFF(day, start_date, GETDATE())
       - (DATEDIFF(week, start_date, GETDATE()) * 2) AS approx_business_days
  FROM loan_management.loans;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Add 30 days to loan start_date.
SELECT loan_id,
       DATEADD(day,   30, start_date) AS plus_30_days
  FROM loan_management.loans;
-- 2. Subtract 15 days from payment_date.
SELECT payment_id,
       DATEADD(day,  -15, payment_date) AS minus_15_days
  FROM loan_management.loan_payments;
-- 3. Add 6 months to loan start_date.
SELECT loan_id,
       DATEADD(month, 6, start_date) AS plus_6_months
  FROM loan_management.loans;
-- 4. Subtract 1 year from date_of_birth.
SELECT borrower_id,
       DATEADD(year, -1, date_of_birth) AS one_year_earlier
  FROM loan_management.borrowers;
-- 5. Add 2 hours to current datetime.
SELECT DATEADD(hour, 2, GETDATE())   AS plus_2_hours;
-- 6. Subtract 30 minutes from current datetime.
SELECT DATEADD(minute, -30, GETDATE()) AS minus_30_minutes;
-- 7. Add 100 milliseconds to SYSDATETIME().
SELECT DATEADD(millisecond, 100, SYSDATETIME()) AS plus_100_ms;
-- 8. Add 10 days to the latest payment_date.
SELECT TOP 1 DATEADD(day, 10, payment_date) AS next_due
  FROM loan_management.loan_payments ORDER BY payment_date DESC;
-- 9. Subtract the loan term from start_date for loan_id=2.
SELECT loan_id,
       DATEADD(month, -term_months, start_date) AS original_start
  FROM loan_management.loans WHERE loan_id = 2;
-- 10. Add 90 days to today.
SELECT DATEADD(day, 90, CAST(GETDATE() AS DATE)) AS date_in_90_days;
```

## Date Formatting (FORMAT)
```sql
-- 1. Format payment_date as 'yyyy-MM-dd'.
SELECT payment_id, FORMAT(payment_date, 'yyyy-MM-dd')         AS fmt_iso
  FROM loan_management.loan_payments;
-- 2. Format date_of_birth as 'MMMM dd, yyyy'.
SELECT borrower_id, FORMAT(date_of_birth, 'MMMM dd, yyyy')     AS fmt_long
  FROM loan_management.borrowers;
-- 3. Format start_date as 'dd/MM/yyyy'.
SELECT loan_id, FORMAT(start_date, 'dd/MM/yyyy')               AS fmt_eu
  FROM loan_management.loans;
-- 4. Format GETDATE() as 'hh:mm:ss tt'.
SELECT FORMAT(GETDATE(), 'hh:mm:ss tt')                        AS fmt_time;
-- 5. Format GETDATE() as full datetime 'yyyy-MM-dd HH:mm:ss'.
SELECT FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss')                AS fmt_full_dt;
-- 6. Format payment_date as weekday name.
SELECT payment_id, FORMAT(payment_date, 'dddd')                AS fmt_weekday
  FROM loan_management.loan_payments;
-- 7. Format date_of_birth as 'yy-MM-dd'.
SELECT borrower_id, FORMAT(date_of_birth, 'yy-MM-dd')          AS fmt_short
  FROM loan_management.borrowers;
-- 8. Format start_date as 'MMM dd'.
SELECT loan_id, FORMAT(start_date, 'MMM dd')                   AS fmt_monthday
  FROM loan_management.loans;
-- 9. Format GETDATE() with general date/time specifier.
SELECT FORMAT(GETDATE(), 'g')                                   AS fmt_general;
-- 10. Format payment_date with ordinal day (e.g., 'dd''th'' MMM yyyy').
SELECT payment_id,
       FORMAT(payment_date, 'dd\\'th\\' MMM yyyy')             AS fmt_ordinal
  FROM loan_management.loan_payments;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Get numeric weekday of payment_date.
SELECT payment_id, DATEPART(weekday, payment_date) AS wd_num
  FROM loan_management.loan_payments;
-- 2. Get weekday name using DATENAME.
SELECT payment_id, DATENAME(weekday, payment_date) AS wd_name
  FROM loan_management.loan_payments;
-- 3. Find loans that started on Monday (weekday=2).
SELECT * FROM loan_management.loans
 WHERE DATEPART(weekday, start_date) = 2;
-- 4. Count payments by weekday.
SELECT DATEPART(weekday, payment_date) AS wd, COUNT(*) AS cnt
  FROM loan_management.loan_payments
 GROUP BY DATEPART(weekday, payment_date);
-- 5. List borrowers with birthday on weekend (1=Sunday,7=Saturday).
SELECT borrower_id, full_name
  FROM loan_management.borrowers
 WHERE DATEPART(weekday, date_of_birth) IN (1,7);
-- 6. Show today’s weekday name.
SELECT DATENAME(weekday, GETDATE()) AS today_name;
-- 7. Next payment weekday for loan_id=9.
SELECT TOP 1 DATENAME(weekday, payment_date) AS next_pay_day
  FROM loan_management.loan_payments
 WHERE loan_id = 9
 ORDER BY payment_date ASC;
-- 8. Loans starting on Friday.
SELECT * FROM loan_management.loans
 WHERE DATENAME(weekday, start_date) = 'Friday';
-- 9. Payments mid-week (Tue-Thu).
SELECT * FROM loan_management.loan_payments
 WHERE DATEPART(weekday, payment_date) BETWEEN 3 AND 5;
-- 10. Borrowers born on Tuesday.
SELECT * FROM loan_management.borrowers
 WHERE DATENAME(weekday, date_of_birth) = 'Tuesday';
```

## Date to String (CONVERT with style)
```sql
-- 1. Convert start_date to varchar (style 101 mm/dd/yyyy).
SELECT loan_id, CONVERT(VARCHAR(10), start_date, 101) AS str_usa FROM loan_management.loans;
-- 2. Convert payment_date to varchar (style 103 dd/mm/yyyy).
SELECT payment_id, CONVERT(VARCHAR(10), payment_date, 103) AS str_uk FROM loan_management.loan_payments;
-- 3. Convert date_of_birth to style 112 (yyyyMMdd).
SELECT borrower_id, CONVERT(VARCHAR(8), date_of_birth, 112) AS str_basic FROM loan_management.borrowers;
-- 4. Convert GETDATE() to style 120 (yyyy-mm-dd hh:mi:ss).
SELECT CONVERT(VARCHAR(19), GETDATE(), 120) AS str_datetime;
-- 5. Convert GETDATE() to style 1 (mm/dd/yy).
SELECT CONVERT(VARCHAR(8), GETDATE(), 1) AS str_short;
-- 6. Convert start_date to style 3 (dd/mm/yy).
SELECT loan_id, CONVERT(VARCHAR(8), start_date, 3) AS str_br FROM loan_management.loans;
-- 7. Convert payment_date to style 126 (ISO8601).
SELECT payment_id, CONVERT(VARCHAR(30), payment_date, 126) AS str_iso8601 FROM loan_management.loan_payments;
-- 8. Convert date_of_birth to style 13 (dd mon yyyy hh:mi:ss:mmm).
SELECT borrower_id, CONVERT(VARCHAR(23), date_of_birth, 13) AS str_dbg FROM loan_management.borrowers;
-- 9. Convert GETDATE() to style 9 (Mon dd yyyy hh:mi:ss).
SELECT CONVERT(VARCHAR(30), GETDATE(), 9) AS str_usa_long;
-- 10. Convert payment_date to style 20 (yyyy-mm-dd hh:mi:ss).
SELECT payment_id, CONVERT(VARCHAR(20), payment_date, 20) AS str_20 FROM loan_management.loan_payments;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. Convert SYSDATETIME() to ISO 8601 with ms.
SELECT FORMAT(SYSDATETIME(), 'yyyy-MM-ddTHH:mm:ss.fff') AS dt_isoMs;
-- 2. Convert loan start_date to 'yyyy/MM/dd HH:mm'.
SELECT loan_id, FORMAT(CAST(start_date AS DATETIME), 'yyyy/MM/dd HH:mm') AS dt_fmt FROM loan_management.loans;
-- 3. Convert payment_date to RFC1123 pattern.
SELECT payment_id, FORMAT(payment_date, 'R') AS dt_rfc FROM loan_management.loan_payments;
-- 4. Convert GETDATE() to 'yyyyMMdd HHmmss'.
SELECT FORMAT(GETDATE(), 'yyyyMMdd HHmmss') AS dt_compact;
-- 5. Convert payment_date to 'MM-dd-yyyy hh:mm tt'.
SELECT payment_id, FORMAT(payment_date, 'MM-dd-yyyy hh:mm tt') AS dt_us FROM loan_management.loan_payments;
-- 6. Convert date_of_birth to 'dddd, MMMM dd, yyyy'.
SELECT borrower_id, FORMAT(date_of_birth, 'dddd, MMMM dd, yyyy') AS dob_long FROM loan_management.borrowers;
-- 7. Convert SYSDATETIMEOFFSET() to string with offset.
SELECT FORMAT(SYSDATETIMEOFFSET(), 'yyyy-MM-dd HH:mm:ss zzz') AS dto_str;
-- 8. Convert GETDATE() to 'MMM dd yyyy, HH:mm:ss'.
SELECT FORMAT(GETDATE(), 'MMM dd yyyy, HH:mm:ss') AS dt_custom;
-- 9. Convert start_date to 'dd.MM.yyyy'.
SELECT loan_id, FORMAT(start_date, 'dd.MM.yyyy') AS dt_euro FROM loan_management.loans;
-- 10. Convert payment_date to Chinese pattern.
SELECT payment_id, FORMAT(payment_date, 'yyyy年MM月dd日 HH时mm分ss秒', 'zh-CN') AS dt_cn FROM loan_management.loan_payments;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Convert '2025-08-05' to date.
SELECT CAST('2025-08-05' AS DATE)                AS dt1;
-- 2. Convert '08/05/2025' to date (style 101).
SELECT CONVERT(DATE, '08/05/2025', 101)           AS dt2;
-- 3. Convert '05-08-2025' to date (style 105).
SELECT CONVERT(DATE, '05-08-2025', 105)           AS dt3;
-- 4. Convert '20250805' to date (style 112).
SELECT CONVERT(DATE, '20250805', 112)             AS dt4;
-- 5. Convert 'Aug 05 2025' to date (style 106).
SELECT CONVERT(DATE, 'Aug 05 2025', 106)          AS dt5;
-- 6. Parse ISO string to date.
SELECT PARSE('2025-08-05T00:00:00' AS DATE USING 'en-US') AS dt6;
-- 7. Convert stored date_of_birth string back to date.
SELECT borrower_id,
       CONVERT(DATE, CONVERT(VARCHAR(10), date_of_birth, 120), 120) AS dt7
  FROM loan_management.borrowers;
-- 8. Parse '2025.08.05' to date.
SELECT PARSE('2025.08.05' AS DATE USING 'en-US') AS dt8;
-- 9. Convert '05 Aug 2025' to date (style 113).
SELECT CONVERT(DATE, '05 Aug 2025', 113)          AS dt9;
-- 10. Convert '2025/08/05' to date (style 111).
SELECT CONVERT(DATE, '2025/08/05', 111)           AS dt10;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Convert '2025-08-05 14:30:00' to datetime.
SELECT CAST('2025-08-05 14:30:00' AS DATETIME)    AS dt1;
-- 2. Convert '08/05/2025 02:30 PM' to datetime (style 101).
SELECT CONVERT(DATETIME, '08/05/2025 02:30 PM', 101) AS dt2;
-- 3. Convert '2025-08-05T14:30:00' to datetime2.
SELECT CAST('2025-08-05T14:30:00' AS DATETIME2)   AS dt3;
-- 4. Parse 'Aug 05 2025 14:30:00' to datetime.
SELECT PARSE('Aug 05 2025 14:30:00' AS DATETIME USING 'en-US') AS dt4;
-- 5. Convert '20250805 143000' to datetime (style 112).
SELECT CONVERT(DATETIME, '20250805 143000', 112)  AS dt5;
-- 6. Convert '2025/08/05 14:30:00' to datetime (style 111).
SELECT CONVERT(DATETIME, '2025/08/05 14:30:00', 111) AS dt6;
-- 7. Convert date_of_birth + ' 00:00:00' to datetime.
SELECT borrower_id,
       CAST(CONVERT(VARCHAR(10), date_of_birth, 120) + ' 00:00:00' AS DATETIME) AS dt7
  FROM loan_management.borrowers;
-- 8. Convert '2025-08-05 14:30:00.123' to datetime2.
SELECT CAST('2025-08-05 14:30:00.123' AS DATETIME2) AS dt8;
-- 9. Parse '05 Aug 2025 14:30:00' to datetime2.
SELECT PARSE('05 Aug 2025 14:30:00' AS DATETIME2 USING 'en-US') AS dt9;
-- 10. Convert '2025-08-05T14:30:00Z' to datetimeoffset.
SELECT CAST('2025-08-05T14:30:00Z' AS DATETIMEOFFSET) AS dto1;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show current datetime with offset.
SELECT SYSDATETIMEOFFSET()                                  AS current_offset;
-- 2. Convert GETDATE() to UTC.
SELECT GETDATE() AT TIME ZONE 'UTC'                          AS utc_time;
-- 3. Convert GETDATE() to India Standard Time.
SELECT GETDATE() AT TIME ZONE 'India Standard Time'          AS ist_time;
-- 4. Convert loan start_date from UTC to IST.
SELECT loan_id,
       CAST(start_date AS DATETIME) AT TIME ZONE 'UTC'
         AT TIME ZONE 'India Standard Time'                AS start_ist
  FROM loan_management.loans;
-- 5. Convert payment_date from UTC to Eastern Standard Time.
SELECT payment_id,
       CAST(payment_date AS DATETIME) AT TIME ZONE 'UTC'
         AT TIME ZONE 'Eastern Standard Time'              AS pay_est
  FROM loan_management.loan_payments;
-- 6. Use SWITCHOFFSET to change server offset to +05:30.
SELECT SWITCHOFFSET(SYSDATETIMEOFFSET(), '+05:30')           AS offset_ist;
-- 7. Find current UTC datetimeoffset.
SELECT SYSDATETIMEOFFSET() AT TIME ZONE 'UTC'                AS curr_utc_offset;
-- 8. Convert date_of_birth to datetimeoffset at UTC.
SELECT borrower_id,
       TODATETIMEOFFSET(CAST(date_of_birth AS DATETIME), '+00:00') AS dob_utc
  FROM loan_management.borrowers;
-- 9. Convert payment_date to Pacific Standard Time.
SELECT payment_id,
       CAST(payment_date AS DATETIME) AT TIME ZONE 'UTC'
         AT TIME ZONE 'Pacific Standard Time'               AS pay_pst
  FROM loan_management.loan_payments;
-- 10. Query the server’s current time zone.
SELECT * FROM sys.time_zone_info WHERE is_current = 1;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
