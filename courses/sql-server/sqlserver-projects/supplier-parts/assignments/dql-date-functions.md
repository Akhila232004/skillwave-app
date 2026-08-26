![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Show the current date and time.
2. List each part with the query execution timestamp.
3. List each supplier with the current date only.
4. Show unit_price alongside the current time.
5. Return current date/time in ISO 8601 format.
6. Show current datetime and current date as separate columns.
7. Display current datetime offset.
8. Show current UTC date/time.
9. Show current server timestamp.
10. List parts with current year.

## Date Part Function (DATEPART)
1. Extract current year.
2. Extract current month.
3. Extract current day of month.
4. Extract current hour.
5. Extract current minute.
6. Extract current second.
7. Show part with month of retrieval.
8. Show supplier with year of retrieval.
9. Extract ISO week number.
10. Extract day of year.

## Date Difference Function (DATEDIFF)
1. Days since start of 2025.
2. Months since January 2025.
3. Years since 2000.
4. Hours since Aug 1, 2025.
5. Minutes since midnight today.
6. Seconds since midnight.
7. Days until New Year’s Day 2026.
8. Weeks since start of 2025.
9. Milliseconds since midnight.
10. Days between two literal dates.

## Date Addition/Subtraction (DATEADD)
1. Date one week from now.
2. Date one month ago.
3. Date one year from now.
4. Time 3 hours from now.
5. Time 30 minutes ago.
6. Date 10 days before today.
7. Date 90 seconds from now.
8. Date 2 quarters from now.
9. Date 100 milliseconds from now.
10. Time 5 hours ago with parts context.

## Date Formatting (FORMAT)
1. Format current date as 'yyyy-MM-dd'.
2. Format as 'dd/MM/yyyy'.
3. Format as 'MMMM dd, yyyy'.
4. Format as 'hh:mm tt'.
5. Format as 'yyyy-MM-dd HH:mm:ss'.
6. Format year and week number.
7. Format as 'ddd, MMM dd yyyy'.
8. Format as ISO with offset.
9. Format parts with timestamp.
10. Format suppliers with date and time.

## Weekday Function (DATEPART weekday)
1. Day of week number for today.
2. Day of week name using FORMAT.
3. Weekday for a literal date.
4. Parts with weekday of retrieval.
5. Suppliers with weekday of retrieval.
6. ISO weekday number (1–7).
7. Parts weekday for a past date.
8. Suppliers weekday for start of month.
9. Weekday for end of year.
10. Weekday number and name.

## Date to String (CONVERT with style)
1. Convert to 'MM/dd/yyyy'.
2. Convert to 'dd-MM-yyyy'.
3. Convert to 'yyyyMMdd'.
4. Convert to 'Mon dd yyyy'.
5. Convert to 'yyyy-MM-dd'.
6. Convert to 'hh:mm:ss'.
7. Convert to ODBC canonical.
8. Parts with US date.
9. Suppliers with German date.
10. Date-only string for today.

## DateTime to String (CONVERT with style)
1. ODBC canonical full.
2. ISO8601 without offset.
3. ODBC canonical with offset.
4. Style 0 (mon dd yyyy hh:miAM).
5. Style 1 (mm/dd/yy).
6. Parts with datetime.
7. Suppliers with datetime.
8. Style 100 (mon dd yyyy hh:miAM).
9. Style 101 (mm/dd/yyyy).
10. Style 103 (dd/mm/yyyy).

## String to Date (CONVERT/CAST)
1. Cast ISO string to DATE.
2. Cast US format to DATE.
3. Convert with style 103.
4. Convert with style 112.
5. Convert with style 120.
6. Parts with parsed date.
7. Suppliers with parsed date.
8. Convert 'Aug 05 2025' to DATE.
9. Cast '2025-08' to DATE (first day).
10. Convert with style 101.

## String to DateTime (CONVERT/TRY_PARSE)
1. Cast ISO string to DATETIME.
2. Convert US format with style 101.
3. Convert style 120.
4. Cast verbose string.
5. Convert style 113.
6. Parts with parsed datetime.
7. Suppliers with parsed datetime.
8. Convert style 1.
9. Convert style 3.
10. Convert style 126.

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show current datetime with offset.
2. Convert UTC to local.
3. Convert local to UTC.
4. Convert to Pacific Standard Time.
5. Switch offset to +05:30.
6. Convert to Eastern Standard Time.
7. Current UTC datetime offset.
8. Convert to Central Europe.
9. Convert to Tokyo time.
10. List parts with IST timestamp.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
