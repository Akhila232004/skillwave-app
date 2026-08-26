![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Show the current date and time.
SELECT GETDATE() AS current_datetime;
-- 2. List each part with the query execution timestamp.
SELECT part_name, GETDATE() AS current_datetime FROM supplier_parts.parts;
-- 3. List each supplier with the current date only.
SELECT supplier_name, CAST(GETDATE() AS DATE) AS today_date FROM supplier_parts.suppliers;
-- 4. Show unit_price alongside the current time.
SELECT part_name, unit_price, CONVERT(TIME, GETDATE()) AS current_time FROM supplier_parts.parts;
-- 5. Return current date/time in ISO 8601 format.
SELECT CONVERT(CHAR(33), GETDATE(), 126) AS iso8601_datetime;
-- 6. Show current datetime and current date as separate columns.
SELECT GETDATE() AS full_datetime, CAST(GETDATE() AS DATE) AS only_date;
-- 7. Display current datetime offset.
SELECT SYSDATETIMEOFFSET() AS datetime_with_offset;
-- 8. Show current UTC date/time.
SELECT GETUTCDATE() AS utc_datetime;
-- 9. Show current server timestamp.
SELECT CURRENT_TIMESTAMP AS server_timestamp;
-- 10. List parts with current year.
SELECT part_name, DATEPART(year, GETDATE()) AS current_year FROM supplier_parts.parts;
```

## Date Part Function (DATEPART)
```sql
-- 1. Extract current year.
SELECT DATEPART(year, GETDATE()) AS year_now;
-- 2. Extract current month.
SELECT DATEPART(month, GETDATE()) AS month_now;
-- 3. Extract current day of month.
SELECT DATEPART(day, GETDATE()) AS day_now;
-- 4. Extract current hour.
SELECT DATEPART(hour, GETDATE()) AS hour_now;
-- 5. Extract current minute.
SELECT DATEPART(minute, GETDATE()) AS minute_now;
-- 6. Extract current second.
SELECT DATEPART(second, GETDATE()) AS second_now;
-- 7. Show part with month of retrieval.
SELECT part_name, DATEPART(month, GETDATE()) AS retrieval_month FROM supplier_parts.parts;
-- 8. Show supplier with year of retrieval.
SELECT supplier_name, DATEPART(year, GETDATE()) AS retrieval_year FROM supplier_parts.suppliers;
-- 9. Extract ISO week number.
SELECT DATEPART(iso_week, GETDATE()) AS iso_week;
-- 10. Extract day of year.
SELECT DATEPART(dayofyear, GETDATE()) AS day_of_year;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days since start of 2025.
SELECT DATEDIFF(day, '2025-01-01', GETDATE()) AS days_since_year_start;
-- 2. Months since January 2025.
SELECT DATEDIFF(month, '2025-01-01', GETDATE()) AS months_since;
-- 3. Years since 2000.
SELECT DATEDIFF(year, '2000-01-01', GETDATE()) AS years_since_2000;
-- 4. Hours since Aug 1, 2025.
SELECT DATEDIFF(hour, '2025-08-01', GETDATE()) AS hours_since_aug1;
-- 5. Minutes since midnight today.
SELECT DATEDIFF(minute, CAST(GETDATE() AS DATE), GETDATE()) AS minutes_today;
-- 6. Seconds since midnight.
SELECT DATEDIFF(second, CAST(GETDATE() AS DATE), GETDATE()) AS seconds_today;
-- 7. Days until New Year’s Day 2026.
SELECT DATEDIFF(day, GETDATE(), '2026-01-01') AS days_to_2026;
-- 8. Weeks since start of 2025.
SELECT DATEDIFF(week, '2025-01-01', GETDATE()) AS weeks_since;
-- 9. Milliseconds since midnight.
SELECT DATEDIFF(millisecond, CAST(GETDATE() AS DATE), GETDATE()) AS ms_today;
-- 10. Days between two literal dates.
SELECT DATEDIFF(day, '2025-07-01', '2025-08-05') AS days_between;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Date one week from now.
SELECT DATEADD(day, 7, GETDATE()) AS one_week_later;
-- 2. Date one month ago.
SELECT DATEADD(month, -1, GETDATE()) AS one_month_ago;
-- 3. Date one year from now.
SELECT DATEADD(year, 1, GETDATE()) AS next_year;
-- 4. Time 3 hours from now.
SELECT DATEADD(hour, 3, GETDATE()) AS three_hours_later;
-- 5. Time 30 minutes ago.
SELECT DATEADD(minute, -30, GETDATE()) AS thirty_minutes_ago;
-- 6. Date 10 days before today.
SELECT DATEADD(day, -10, GETDATE()) AS ten_days_ago;
-- 7. Date 90 seconds from now.
SELECT DATEADD(second, 90, GETDATE()) AS ninety_seconds_later;
-- 8. Date 2 quarters from now.
SELECT DATEADD(quarter, 2, GETDATE()) AS two_quarters_later;
-- 9. Date 100 milliseconds from now.
SELECT DATEADD(millisecond, 100, GETDATE()) AS ms_later;
-- 10. Time 5 hours ago with parts context.
SELECT part_name, DATEADD(hour, -5, GETDATE()) AS five_hours_ago FROM supplier_parts.parts;
```

## Date Formatting (FORMAT)
```sql
-- 1. Format current date as 'yyyy-MM-dd'.
SELECT FORMAT(GETDATE(), 'yyyy-MM-dd') AS fmt_iso_date;
-- 2. Format as 'dd/MM/yyyy'.
SELECT FORMAT(GETDATE(), 'dd/MM/yyyy') AS fmt_eu_date;
-- 3. Format as 'MMMM dd, yyyy'.
SELECT FORMAT(GETDATE(), 'MMMM dd, yyyy') AS fmt_long_date;
-- 4. Format as 'hh:mm tt'.
SELECT FORMAT(GETDATE(), 'hh:mm tt') AS fmt_time_ampm;
-- 5. Format as 'yyyy-MM-dd HH:mm:ss'.
SELECT FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss') AS fmt_full;
-- 6. Format year and week number.
SELECT FORMAT(GETDATE(), 'yyyy-\\WW') AS fmt_year_week;
-- 7. Format as 'ddd, MMM dd yyyy'.
SELECT FORMAT(GETDATE(), 'ddd, MMM dd yyyy') AS fmt_short_day;
-- 8. Format as ISO with offset.
SELECT FORMAT(SYSDATETIMEOFFSET(), 'o') AS fmt_roundtrip;
-- 9. Format parts with timestamp.
SELECT part_name, FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm') AS fmt_part FROM supplier_parts.parts;
-- 10. Format suppliers with date and time.
SELECT supplier_name, FORMAT(GETDATE(), 'dd MMM yyyy, HH:mm:ss') AS fmt_sup FROM supplier_parts.suppliers;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Day of week number for today.
SELECT DATEPART(weekday, GETDATE()) AS weekday_num;
-- 2. Day of week name using FORMAT.
SELECT FORMAT(GETDATE(), 'dddd') AS weekday_name;
-- 3. Weekday for a literal date.
SELECT DATEPART(weekday, '2025-08-01') AS weekday_aug1;
-- 4. Parts with weekday of retrieval.
SELECT part_name, DATEPART(weekday, GETDATE()) AS weekday_now FROM supplier_parts.parts;
-- 5. Suppliers with weekday of retrieval.
SELECT supplier_name, DATEPART(weekday, GETDATE()) AS weekday_now FROM supplier_parts.suppliers;
-- 6. ISO weekday number (1–7).
SELECT DATEPART(isowkday, GETDATE()) AS iso_weekday;
-- 7. Parts weekday for a past date.
SELECT part_name, DATEPART(weekday, '2025-07-01') AS weekday_july FROM supplier_parts.parts;
-- 8. Suppliers weekday for start of month.
SELECT supplier_name, DATEPART(weekday, '2025-08-01') AS weekday_month FROM supplier_parts.suppliers;
-- 9. Weekday for end of year.
SELECT DATEPART(weekday, '2025-12-31') AS weekday_eoy;
-- 10. Weekday number and name.
SELECT DATEPART(weekday, GETDATE()) AS wd_num, FORMAT(GETDATE(), 'dddd') AS wd_name;
```

## Date to String (CONVERT with style)
```sql
-- 1. Convert to 'MM/dd/yyyy'.
SELECT CONVERT(VARCHAR(10), GETDATE(), 101) AS us_format;
-- 2. Convert to 'dd-MM-yyyy'.
SELECT CONVERT(VARCHAR(10), GETDATE(), 105) AS de_format;
-- 3. Convert to 'yyyyMMdd'.
SELECT CONVERT(VARCHAR(8), GETDATE(), 112) AS yyyymmdd;
-- 4. Convert to 'Mon dd yyyy'.
SELECT CONVERT(VARCHAR(11), GETDATE(), 106) AS fmt_106;
-- 5. Convert to 'yyyy-MM-dd'.
SELECT CONVERT(VARCHAR(10), GETDATE(), 23) AS iso_short;
-- 6. Convert to 'hh:mm:ss'.
SELECT CONVERT(VARCHAR(8), GETDATE(), 108) AS fmt_time;
-- 7. Convert to ODBC canonical.
SELECT CONVERT(VARCHAR(23), GETDATE(), 121) AS fmt_121;
-- 8. Parts with US date.
SELECT part_name, CONVERT(VARCHAR(10), GETDATE(), 101) AS us_date FROM supplier_parts.parts;
-- 9. Suppliers with German date.
SELECT supplier_name, CONVERT(VARCHAR(10), GETDATE(), 104) AS de_date FROM supplier_parts.suppliers;
-- 10. Date-only string for today.
SELECT CONVERT(VARCHAR(10), CAST(GETDATE() AS DATE), 120) AS yyyy_mm_dd;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. ODBC canonical full.
SELECT CONVERT(VARCHAR(23), GETDATE(), 121) AS datetime_121;
-- 2. ISO8601 without offset.
SELECT CONVERT(VARCHAR(19), GETDATE(), 120) AS datetime_120;
-- 3. ODBC canonical with offset.
SELECT CONVERT(VARCHAR(30), SYSDATETIMEOFFSET(), 127) AS dtoffset_127;
-- 4. Style 0 (mon dd yyyy hh:miAM).
SELECT CONVERT(VARCHAR(30), GETDATE(), 0) AS style_0;
-- 5. Style 1 (mm/dd/yy).
SELECT CONVERT(VARCHAR(8), GETDATE(), 1) AS style_1;
-- 6. Parts with datetime.
SELECT part_name, CONVERT(VARCHAR(23), GETDATE(), 121) AS dt_part FROM supplier_parts.parts;
-- 7. Suppliers with datetime.
SELECT supplier_name, CONVERT(VARCHAR(19), GETDATE(), 120) AS dt_sup FROM supplier_parts.suppliers;
-- 8. Style 100 (mon dd yyyy hh:miAM).
SELECT CONVERT(VARCHAR(30), GETDATE(), 100) AS style_100;
-- 9. Style 101 (mm/dd/yyyy).
SELECT CONVERT(VARCHAR(10), GETDATE(), 101) AS style_101;
-- 10. Style 103 (dd/mm/yyyy).
SELECT CONVERT(VARCHAR(10), GETDATE(), 103) AS style_103;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Cast ISO string to DATE.
SELECT CAST('2025-08-05' AS DATE) AS dt1;
-- 2. Cast US format to DATE.
SELECT CAST('08/05/2025' AS DATE) AS dt2;
-- 3. Convert with style 103.
SELECT CONVERT(DATE, '05/08/2025', 103) AS dt3;
-- 4. Convert with style 112.
SELECT CONVERT(DATE, '20250805', 112) AS dt4;
-- 5. Convert with style 120.
SELECT CONVERT(DATE, '2025-08-05 00:00:00', 120) AS dt5;
-- 6. Parts with parsed date.
SELECT part_name, CAST('2025-08-05' AS DATE) AS parsed FROM supplier_parts.parts;
-- 7. Suppliers with parsed date.
SELECT supplier_name, CONVERT(DATE, '05-08-2025', 105) AS parsed FROM supplier_parts.suppliers;
-- 8. Convert 'Aug 05 2025' to DATE.
SELECT CONVERT(DATE, 'Aug 05 2025', 107) AS dt6;
-- 9. Cast '2025-08' to DATE (first day).
SELECT CAST('2025-08-01' AS DATE) AS dt7;
-- 10. Convert with style 101.
SELECT CONVERT(DATE, '08/05/2025', 101) AS dt8;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Cast ISO string to DATETIME.
SELECT CAST('2025-08-05 14:30:00' AS DATETIME) AS dts1;
-- 2. Convert US format with style 101.
SELECT CONVERT(DATETIME, '08/05/2025 14:30', 101) AS dts2;
-- 3. Convert style 120.
SELECT CONVERT(DATETIME, '2025-08-05 14:30:00', 120) AS dts3;
-- 4. Cast verbose string.
SELECT CAST('Aug 5, 2025 2:30 PM' AS DATETIME) AS dts4;
-- 5. Convert style 113.
SELECT CONVERT(DATETIME, '05 Aug 2025 14:30:00:000', 113) AS dts5;
-- 6. Parts with parsed datetime.
SELECT part_name, CAST('2025-08-05T14:30:00' AS DATETIME) AS dt_part FROM supplier_parts.parts;
-- 7. Suppliers with parsed datetime.
SELECT supplier_name, CONVERT(DATETIME, '2025-08-05 02:30 PM', 0) AS dt_sup FROM supplier_parts.suppliers;
-- 8. Convert style 1.
SELECT CONVERT(DATETIME, '08/05/25 14:30', 1) AS dts6;
-- 9. Convert style 3.
SELECT CONVERT(DATETIME, '05/08/2025 14:30', 3) AS dts7;
-- 10. Convert style 126.
SELECT CONVERT(DATETIME, '2025-08-05T14:30:00', 126) AS dts8;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show current datetime with offset.
SELECT SYSDATETIMEOFFSET() AS current_dto;
-- 2. Convert UTC to local.
SELECT GETUTCDATE() AT TIME ZONE 'India Standard Time' AS ist_time;
-- 3. Convert local to UTC.
SELECT GETDATE() AT TIME ZONE 'UTC' AS utc_time;
-- 4. Convert to Pacific Standard Time.
SELECT GETDATE() AT TIME ZONE 'Pacific Standard Time' AS pst_time;
-- 5. Switch offset to +05:30.
SELECT SWITCHOFFSET(SYSDATETIMEOFFSET(), '+05:30') AS as_ist;
-- 6. Convert to Eastern Standard Time.
SELECT GETDATE() AT TIME ZONE 'Eastern Standard Time' AS est_time;
-- 7. Current UTC datetime offset.
SELECT SYSUTCDATETIME() AS sys_utc;
-- 8. Convert to Central Europe.
SELECT GETDATE() AT TIME ZONE 'Central Europe Standard Time' AS cest_time;
-- 9. Convert to Tokyo time.
SELECT GETDATE() AT TIME ZONE 'Tokyo Standard Time' AS tokyo_time;
-- 10. List parts with IST timestamp.
SELECT part_name, GETDATE() AT TIME ZONE 'India Standard Time' AS ist_timestamp FROM supplier_parts.parts;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
