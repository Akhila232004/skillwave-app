![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Display current date and time
2. Display current date only
3. List students with enrollment_date and current timestamp
4. Check semester status based on current date
5. Add current timestamp column to courses
6. Retrieve current UTC datetime
7. Compare GETDATE() with SYSDATETIME()
8. Days since enrollment for first student
9. Students enrolled today
10. Current datetime rounded to minute

## Date Part Function (DATEPART)
1. Year of enrollment
2. Month of enrollment
3. Day of enrollment
4. Hour of semester start (always 0)
5. Week of year for semester end
6. Quarter of course creation (by semester start)
7. Day of year for enrollment
8. ISO week number of enrollment
9. Millisecond of current timestamp
10. Microsecond of current timestamp

## Date Difference Function (DATEDIFF)
1. Days between semester start and end
2. Months since student enrollment
3. Years between semester start and today
4. Hours until semester end
5. Minutes since first course inserted (assume course_id=1)
6. Seconds between two known dates
7. Weeks between two semesters
8. Milliseconds between now and SYSDATETIME()
9. Days since last student enrolled (max enrollment_date)
10. Months between semester 2 and semester 5 start

## Date Addition/Subtraction (DATEADD)
1. Add 30 days to enrollment_date
2. Subtract 7 days from semester end_date
3. Add 1 month to semester start
4. Subtract 1 year from enrollment_date
5. Add 2 hours to current time
6. Subtract 15 minutes from current time
7. Add 100 milliseconds to SYSDATETIME()
8. Add 2 quarters to semester start (6 months)
9. Subtract 10 seconds from current time
10. Add 5 years to semester start

## Date Formatting (FORMAT)
1. Format enrollment_date as 'dd/MM/yyyy'
2. Format start_date as 'MMMM yyyy'
3. Format end_date as 'yyyy-MM-dd HH:mm:ss'
4. Format GETDATE() as 'ddd, dd MMM yyyy'
5. Format enrollment_date with day name
6. Format course timestamp placeholder
7. Format start_date as ISO8601
8. Format enrollment_date as 'M/d/yyyy h:mm tt'
9. Format end_date as 'yyyy-MM'
10. Format current date in Japanese style

## Weekday Function (DATEPART weekday)
1. Weekday number of enrollment_date
2. Weekday name of enrollment_date
3. Weekday of semester start
4. Weekday of semester end
5. Students enrolled on Monday
6. Semesters starting on Friday
7. Count of students by weekday
8. Courses offered on a Sunday (dummy using start_date weekday)
9. List enrollment weekday and student
10. Next Monday after enrollment

## Date to String (CONVERT with style)
1. U.S. format mm/dd/yyyy (style 101)
2. British format dd/mm/yyyy (style 103)
3. ISO yyyymmdd (style 112)
4. 24-hour datetime (style 120)
5. Full month name and year (style 107)
6. Mon dd, yyyy (style 100)
7. yyyy-mm-ddThh:mi:ss.mmm (style 126)
8. ddd Mon dd yyyy (style 109)
9. mm dd yyyy hh:miAM (style 0)
10. Default string style (style 0) for semester

## DateTime to String (CONVERT with style)
1. yyyy-MM-dd HH:mm:ss (style 120)
2. yyyy-MM-ddThh:mm:ss (style 126)
3. Mon dd yyyy hh:miAM (style 100)
4. dd MMM yyyy hh:mi:ss:mmm (style 113)
5. mm/dd/yy hh:miAM (style 1)
6. dd/mm/yy hh:miAM (style 3)
7. ISO week date style (style 127)
8. Short date + long time (style 109)
9. ODBC canonical (style 121)
10. Default datetime style (style 0)

## String to Date (CONVERT/CAST)
1. Convert '2025-09-01' to date
2. Convert '09/01/2025' using style 101
3. Convert '01/09/2025' using style 103
4. Convert '20250901' using style 112
5. Parse semester start_date string
6. Convert '15-Jan-2025' using style 106
7. Convert student enrollment_date string placeholder
8. Convert ISO string with time to date only
9. Convert '2025.05.15' using style 102
10. Convert mixed format using PARSE

## String to DateTime (CONVERT/TRY_PARSE)
1. CAST '2025-09-01 08:30:00' AS datetime
2. CONVERT datetime '2025-09-01T08:30:00' using 126
3. CAST '08/05/2023 14:45' AS datetime using 101
4. Parse with milliseconds
5. Use PARSE to datetime
6. Convert string with timezone offset to datetimeoffset
7. CAST '2025-09-01' AS datetime results in midnight
8. Convert VARCHAR datetime from course creation
9. CAST enrollment_date string placeholder
10. Convert timezone-naive string to datetime2

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Convert GETDATE() to UTC
2. Convert GETUTCDATE() to India Standard Time
3. Show enrollment_date as datetimeoffset in IST
4. Convert semester start to Pacific Standard Time
5. Current time in Tokyo
6. SWITCHOFFSET example: add 3 hours offset
7. Convert course snapshot to local time
8. List enrollment in UTC and local
9. Show current datetimeoffset
10. Convert end_date to Eastern Standard Time

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
