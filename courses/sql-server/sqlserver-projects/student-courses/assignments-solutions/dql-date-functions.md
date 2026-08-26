![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Display current date and time
SELECT GETDATE() AS current_datetime;
-- 2. Display current date only
SELECT CONVERT(date, GETDATE()) AS current_date;
-- 3. List students with enrollment_date and current timestamp
SELECT student_id, first_name + ' ' + last_name AS student, enrollment_date, GETDATE() AS now_time
FROM student_courses.students;
-- 4. Check semester status based on current date
SELECT semester_id, semester_name, end_date,
       CASE WHEN end_date < GETDATE() THEN 'Ended' ELSE 'Ongoing' END AS status
FROM student_courses.semesters;
-- 5. Add current timestamp column to courses
SELECT course_id, course_name, GETDATE() AS snapshot_time
FROM student_courses.courses;
-- 6. Retrieve current UTC datetime
SELECT GETUTCDATE() AS current_utc_datetime;
-- 7. Compare GETDATE() with SYSDATETIME()
SELECT GETDATE() AS dt_now, SYSDATETIME() AS sys_dt;
-- 8. Days since enrollment for first student
SELECT TOP 1 student_id, enrollment_date, GETDATE() AS now,
       DATEDIFF(day, enrollment_date, GETDATE()) AS days_since_enrollment
FROM student_courses.students
ORDER BY student_id;
-- 9. Students enrolled today
SELECT * FROM student_courses.students
WHERE CONVERT(date, enrollment_date) = CONVERT(date, GETDATE());
-- 10. Current datetime rounded to minute
SELECT DATEADD(minute, DATEDIFF(minute, 0, GETDATE()), 0) AS rounded_to_minute;
```

## Date Part Function (DATEPART)
```sql
-- 1. Year of enrollment
SELECT student_id, DATEPART(year, enrollment_date) AS enroll_year
FROM student_courses.students;
-- 2. Month of enrollment
SELECT student_id, DATEPART(month, enrollment_date) AS enroll_month
FROM student_courses.students;
-- 3. Day of enrollment
SELECT student_id, DATEPART(day, enrollment_date) AS enroll_day
FROM student_courses.students;
-- 4. Hour of semester start (always 0)
SELECT semester_id, DATEPART(hour, start_date) AS start_hour
FROM student_courses.semesters;
-- 5. Week of year for semester end
SELECT semester_id, DATEPART(week, end_date) AS end_week
FROM student_courses.semesters;
-- 6. Quarter of course creation (by semester start)
SELECT c.course_id, DATEPART(quarter, sem.start_date) AS quarter_offered
FROM student_courses.courses c
JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id;
-- 7. Day of year for enrollment
SELECT student_id, DATEPART(dayofyear, enrollment_date) AS day_of_year
FROM student_courses.students;
-- 8. ISO week number of enrollment
SELECT student_id, DATEPART(isowk, enrollment_date) AS iso_week
FROM student_courses.students;
-- 9. Millisecond of current timestamp
SELECT DATEPART(millisecond, SYSDATETIME()) AS current_ms;
-- 10. Microsecond of current timestamp
SELECT DATEPART(microsecond, SYSDATETIME()) AS current_us;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days between semester start and end
SELECT semester_id,
       DATEDIFF(day, start_date, end_date) AS duration_days
FROM student_courses.semesters;
-- 2. Months since student enrollment
SELECT student_id,
       DATEDIFF(month, enrollment_date, GETDATE()) AS months_since_enroll
FROM student_courses.students;
-- 3. Years between semester start and today
SELECT semester_id,
       DATEDIFF(year, start_date, GETDATE()) AS years_since_start
FROM student_courses.semesters;
-- 4. Hours until semester end
SELECT semester_id,
       DATEDIFF(hour, GETDATE(), end_date) AS hours_until_end
FROM student_courses.semesters;
-- 5. Minutes since first course inserted (assume course_id=1)
SELECT DATEDIFF(minute, GETDATE(), GETDATE()) AS dummy;  -- placeholder
-- 6. Seconds between two known dates
SELECT DATEDIFF(second, '2025-01-01', '2025-01-02') AS seconds_diff;
-- 7. Weeks between two semesters
SELECT DATEDIFF(week, 
       (SELECT start_date FROM student_courses.semesters WHERE semester_id=1),
       (SELECT start_date FROM student_courses.semesters WHERE semester_id=4)
) AS weeks_between;
-- 8. Milliseconds between now and SYSDATETIME()
SELECT DATEDIFF(millisecond, GETDATE(), SYSDATETIME()) AS ms_diff;
-- 9. Days since last student enrolled (max enrollment_date)
SELECT DATEDIFF(day,
       (SELECT MAX(enrollment_date) FROM student_courses.students),
       GETDATE()
) AS days_since_last_enroll;
-- 10. Months between semester 2 and semester 5 start
SELECT DATEDIFF(month,
       (SELECT start_date FROM student_courses.semesters WHERE semester_id=2),
       (SELECT start_date FROM student_courses.semesters WHERE semester_id=5)
) AS months_between;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Add 30 days to enrollment_date
SELECT student_id, DATEADD(day, 30, enrollment_date) AS plus_30_days
FROM student_courses.students;
-- 2. Subtract 7 days from semester end_date
SELECT semester_id, DATEADD(day, -7, end_date) AS one_week_before
FROM student_courses.semesters;
-- 3. Add 1 month to semester start
SELECT semester_id, DATEADD(month, 1, start_date) AS plus_1_month
FROM student_courses.semesters;
-- 4. Subtract 1 year from enrollment_date
SELECT student_id, DATEADD(year, -1, enrollment_date) AS minus_1_year
FROM student_courses.students;
-- 5. Add 2 hours to current time
SELECT DATEADD(hour, 2, GETDATE()) AS plus_2_hours;
-- 6. Subtract 15 minutes from current time
SELECT DATEADD(minute, -15, GETDATE()) AS minus_15_minutes;
-- 7. Add 100 milliseconds to SYSDATETIME()
SELECT DATEADD(millisecond, 100, SYSDATETIME()) AS plus_100_ms;
-- 8. Add 2 quarters to semester start (6 months)
SELECT semester_id, DATEADD(month, 6, start_date) AS plus_6_months
FROM student_courses.semesters;
-- 9. Subtract 10 seconds from current time
SELECT DATEADD(second, -10, GETDATE()) AS minus_10_seconds;
-- 10. Add 5 years to semester start
SELECT semester_id, DATEADD(year, 5, start_date) AS plus_5_years
FROM student_courses.semesters;
```

## Date Formatting (FORMAT)
```sql
-- 1. Format enrollment_date as 'dd/MM/yyyy'
SELECT student_id, FORMAT(enrollment_date, 'dd/MM/yyyy') AS enroll_ddmmyyyy
FROM student_courses.students;
-- 2. Format start_date as 'MMMM yyyy'
SELECT semester_id, FORMAT(start_date, 'MMMM yyyy') AS month_year
FROM student_courses.semesters;
-- 3. Format end_date as 'yyyy-MM-dd HH:mm:ss'
SELECT semester_id, FORMAT(end_date, 'yyyy-MM-dd HH:mm:ss') AS end_full
FROM student_courses.semesters;
-- 4. Format GETDATE() as 'ddd, dd MMM yyyy'
SELECT FORMAT(GETDATE(), 'ddd, dd MMM yyyy') AS short_date;
-- 5. Format enrollment_date with day name
SELECT student_id, FORMAT(enrollment_date, 'dddd') AS day_name
FROM student_courses.students;
-- 6. Format course timestamp placeholder
SELECT FORMAT(GETDATE(), 'yyyyMMdd') AS yyyymmdd;
-- 7. Format start_date as ISO8601
SELECT semester_id, FORMAT(start_date, 's') AS iso8601
FROM student_courses.semesters;
-- 8. Format enrollment_date as 'M/d/yyyy h:mm tt'
SELECT student_id, FORMAT(enrollment_date, 'M/d/yyyy h:mm tt') AS friendly_dt
FROM student_courses.students;
-- 9. Format end_date as 'yyyy-MM'
SELECT semester_id, FORMAT(end_date, 'yyyy-MM') AS year_month
FROM student_courses.semesters;
-- 10. Format current date in Japanese style
SELECT FORMAT(GETDATE(), 'yyyy年MM月dd日') AS jap_date;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Weekday number of enrollment_date
SELECT student_id, DATEPART(weekday, enrollment_date) AS enroll_wday
FROM student_courses.students;
-- 2. Weekday name of enrollment_date
SELECT student_id, DATENAME(weekday, enrollment_date) AS enroll_wday_name
FROM student_courses.students;
-- 3. Weekday of semester start
SELECT semester_id, DATEPART(weekday, start_date) AS start_wday
FROM student_courses.semesters;
-- 4. Weekday of semester end
SELECT semester_id, DATENAME(weekday, end_date) AS end_wday_name
FROM student_courses.semesters;
-- 5. Students enrolled on Monday
SELECT * FROM student_courses.students
WHERE DATEPART(weekday, enrollment_date) = 2;
-- 6. Semesters starting on Friday
SELECT * FROM student_courses.semesters
WHERE DATENAME(weekday, start_date) = 'Friday';
-- 7. Count of students by weekday
SELECT DATENAME(weekday, enrollment_date) AS wday, COUNT(*) AS cnt
FROM student_courses.students
GROUP BY DATENAME(weekday, enrollment_date);
-- 8. Courses offered on a Sunday (dummy using start_date weekday)
SELECT c.course_id, c.course_name
FROM student_courses.courses c
JOIN student_courses.semesters sem ON c.semester_id = sem.semester_id
WHERE DATEPART(weekday, sem.start_date) = 1;
-- 9. List enrollment weekday and student
SELECT student_id,
       DATENAME(weekday, enrollment_date) + ': ' + first_name + ' ' + last_name AS info
FROM student_courses.students;
-- 10. Next Monday after enrollment
SELECT student_id,
       DATEADD(day,
         (9 - DATEPART(weekday, enrollment_date)) % 7,
         enrollment_date
       ) AS next_monday
FROM student_courses.students;
```

## Date to String (CONVERT with style)
```sql
-- 1. U.S. format mm/dd/yyyy (style 101)
SELECT student_id, CONVERT(varchar(10), enrollment_date, 101) AS us_date
FROM student_courses.students;
-- 2. British format dd/mm/yyyy (style 103)
SELECT student_id, CONVERT(varchar(10), enrollment_date, 103) AS uk_date
FROM student_courses.students;
-- 3. ISO yyyymmdd (style 112)
SELECT semester_id, CONVERT(varchar(8), start_date, 112) AS iso_date
FROM student_courses.semesters;
-- 4. 24-hour datetime (style 120)
SELECT semester_id, CONVERT(varchar, end_date, 120) AS dt_24h
FROM student_courses.semesters;
-- 5. Full month name and year (style 107)
SELECT semester_id, CONVERT(varchar, start_date, 107) AS nice_date
FROM student_courses.semesters;
-- 6. Mon dd, yyyy (style 100)
SELECT student_id, CONVERT(varchar, enrollment_date, 100) AS mon_date
FROM student_courses.students;
-- 7. yyyy-mm-ddThh:mi:ss.mmm (style 126)
SELECT course_id, CONVERT(varchar, GETDATE(), 126) AS iso8601wd
FROM student_courses.courses;
-- 8. ddd Mon dd yyyy (style 109)
SELECT student_id, CONVERT(varchar, enrollment_date, 109) AS style109
FROM student_courses.students;
-- 9. mm dd yyyy hh:miAM (style 0)
SELECT student_id, CONVERT(varchar, enrollment_date, 0) AS style0
FROM student_courses.students;
-- 10. Default string style (style 0) for semester
SELECT semester_id, CONVERT(varchar, start_date, 0) AS default_str
FROM student_courses.semesters;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. yyyy-MM-dd HH:mm:ss (style 120)
SELECT course_id, CONVERT(varchar, GETDATE(), 120) AS dt120
FROM student_courses.courses;
-- 2. yyyy-MM-ddThh:mm:ss (style 126)
SELECT course_id, CONVERT(varchar, GETDATE(), 126) AS dt126
FROM student_courses.courses;
-- 3. Mon dd yyyy hh:miAM (style 100)
SELECT student_id, CONVERT(varchar, SYSDATETIME(), 100) AS dt100
FROM student_courses.students;
-- 4. dd MMM yyyy hh:mi:ss:mmm (style 113)
SELECT student_id, CONVERT(varchar, SYSDATETIME(), 113) AS dt113
FROM student_courses.students;
-- 5. mm/dd/yy hh:miAM (style 1)
SELECT student_id, CONVERT(varchar, SYSDATETIME(), 1) AS dt1
FROM student_courses.students;
-- 6. dd/mm/yy hh:miAM (style 3)
SELECT student_id, CONVERT(varchar, SYSDATETIME(), 3) AS dt3
FROM student_courses.students;
-- 7. ISO week date style (style 127)
SELECT course_id, CONVERT(varchar, GETDATE(), 127) AS dt127
FROM student_courses.courses;
-- 8. Short date + long time (style 109)
SELECT student_id, CONVERT(varchar, SYSDATETIME(), 109) AS dt109
FROM student_courses.students;
-- 9. ODBC canonical (style 121)
SELECT course_id, CONVERT(varchar, GETDATE(), 121) AS dt121
FROM student_courses.courses;
-- 10. Default datetime style (style 0)
SELECT student_id, CONVERT(varchar, SYSDATETIME(), 0) AS dt0
FROM student_courses.students;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Convert '2025-09-01' to date
SELECT CONVERT(date, '2025-09-01', 23) AS dt1;
-- 2. Convert '09/01/2025' using style 101
SELECT CONVERT(date, '09/01/2025', 101) AS dt2;
-- 3. Convert '01/09/2025' using style 103
SELECT CONVERT(date, '01/09/2025', 103) AS dt3;
-- 4. Convert '20250901' using style 112
SELECT CONVERT(date, '20250901', 112) AS dt4;
-- 5. Parse semester start_date string
SELECT CONVERT(date, '2024-01-15', 120) AS sem_start;
-- 6. Convert '15-Jan-2025' using style 106
SELECT CONVERT(date, '15 Jan 2025', 106) AS dt106;
-- 7. Convert student enrollment_date string placeholder
SELECT CONVERT(date, '08/05/2023', 101) AS enroll_str;
-- 8. Convert ISO string with time to date only
SELECT CONVERT(date, '2025-05-15T00:00:00', 126) AS iso_date_only;
-- 9. Convert '2025.05.15' using style 102
SELECT CONVERT(date, '2025.05.15', 102) AS dt102;
-- 10. Convert mixed format using PARSE
SELECT PARSE('15/05/2025' AS date USING 'en-GB') AS parsed_dt;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. CAST '2025-09-01 08:30:00' AS datetime
SELECT CAST('2025-09-01 08:30:00' AS datetime) AS dt1;
-- 2. CONVERT datetime '2025-09-01T08:30:00' using 126
SELECT CONVERT(datetime, '2025-09-01T08:30:00', 126) AS dt126;
-- 3. CAST '08/05/2023 14:45' AS datetime using 101
SELECT CONVERT(datetime, '08/05/2023 14:45', 101) AS dt101;
-- 4. Parse with milliseconds
SELECT CAST('2025-09-01 08:30:00.123' AS datetime2) AS dt2;
-- 5. Use PARSE to datetime
SELECT PARSE('September 01, 2025 08:30:00' AS datetime USING 'en-US') AS dt_parsed;
-- 6. Convert string with timezone offset to datetimeoffset
SELECT CONVERT(datetimeoffset, '2025-09-01 08:30:00 +05:30', 127) AS dto;
-- 7. CAST '2025-09-01' AS datetime results in midnight
SELECT CAST('2025-09-01' AS datetime) AS dt_midnight;
-- 8. Convert VARCHAR datetime from course creation
SELECT CONVERT(datetime, FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss'), 120) AS dt_fmt;
-- 9. CAST enrollment_date string placeholder
SELECT CAST(CONVERT(varchar(10), enrollment_date, 120) AS datetime) AS enroll_dt;
-- 10. Convert timezone-naive string to datetime2
SELECT CAST('2025-09-01T08:30:00' AS datetime2) AS dt2_naive;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Convert GETDATE() to UTC
SELECT GETDATE() AT TIME ZONE 'UTC' AS utc_now;
-- 2. Convert GETUTCDATE() to India Standard Time
SELECT GETUTCDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS ist_now;
-- 3. Show enrollment_date as datetimeoffset in IST
SELECT student_id,
       CAST(enrollment_date AS datetime2) AT TIME ZONE 'India Standard Time' AS enroll_ist
FROM student_courses.students;
-- 4. Convert semester start to Pacific Standard Time
SELECT semester_id,
       CAST(start_date AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific Standard Time' AS pst_start
FROM student_courses.semesters;
-- 5. Current time in Tokyo
SELECT GETDATE() AT TIME ZONE 'Tokyo Standard Time' AS tokyo_now;
-- 6. SWITCHOFFSET example: add 3 hours offset
SELECT SWITCHOFFSET(SYSDATETIMEOFFSET(), '+03:00') AS offset_plus3;
-- 7. Convert course snapshot to local time
SELECT course_id,
       GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'Central Europe Standard Time' AS ces_snapshot
FROM student_courses.courses;
-- 8. List enrollment in UTC and local
SELECT student_id,
       CAST(enrollment_date AS datetime2) AT TIME ZONE 'UTC' AS enroll_utc,
       CAST(enrollment_date AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS enroll_ist
FROM student_courses.students;
-- 9. Show current datetimeoffset
SELECT SYSDATETIMEOFFSET() AS current_offset;
-- 10. Convert end_date to Eastern Standard Time
SELECT semester_id,
       CAST(end_date AS datetime2) AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time' AS est_end
FROM student_courses.semesters;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
