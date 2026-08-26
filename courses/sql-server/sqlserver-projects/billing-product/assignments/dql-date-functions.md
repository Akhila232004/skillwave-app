![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Display current date and time
2. Display only the current date
3. Display only the current time
4. Insert a new bill with bill_date = GETDATE()
5. Update bill_date of bill_id = 5 to GETDATE()
6. List bills with bill_date on or before now
7. List bills created today
8. Show GETDATE() formatted as ISO
9. Show current year using GETDATE()
10. Show weekday name of GETDATE()

## Date Part Function (DATEPART)
1. Extract year from each bill_date
2. Extract month from each bill_date
3. Extract day from each bill_date
4. Extract hour from current time
5. Extract minute from current time
6. Extract second from current time
7. Extract weekday index (1=Sunday)
8. Extract ISO week number
9. Extract day of year
10. Extract quarter

## Date Difference Function (DATEDIFF)
1. Days since each bill_date
2. Months since each bill_date
3. Years since each bill_date
4. Hours between bill_date and now
5. Minutes between bill_date and now
6. Seconds between bill_date and now
7. Days between bill 1 and bill 2
8. Weeks between earliest and latest bill
9. Months between first and last bill of customer_id=3
10. Days difference from a fixed date

## Date Addition/Subtraction (DATEADD)
1. Add 7 days to each bill_date
2. Subtract 7 days from each bill_date
3. Add 1 month to each bill_date
4. Subtract 1 month from each bill_date
5. Add 1 year to each bill_date
6. Subtract 1 year from each bill_date
7. Add 3 hours to current time
8. Add 30 minutes to current time
9. Add 45 seconds to current time
10. Calculate due date 30 days after bill_date

## Date Formatting (FORMAT)
1. Format bill_date as 'yyyy-MM-dd'
2. Format bill_date as 'dd/MM/yyyy'
3. Format bill_date as 'MMMM dd, yyyy'
4. Format bill_date time as 'HH:mm:ss'
5. Format now as 'yyyy-MM-dd HH:mm'
7. Format bill_date as month name short
8. Format bill_date with ordinal day
9. Format line_total as currency
10. Format bill_date with ISO 8601

## Weekday Function (DATEPART weekday)
1. Get weekday number (1=Sunday)
2. Filter bills on Sundays
3. Filter bills on Saturdays
4. Count bills per weekday
5. Show weekday name alongside bill
6. Bills on business days (Mon–Fri)
7. First bill of each weekday
8. Bills on weekend days
9. Add weekday number to each bill_date
10. Bills skipping weekends (count business days)

## Date to String (CONVERT with style)
1. Convert bill_date to 'yyyy-mm-dd'
2. Convert bill_date to 'mm/dd/yyyy'
3. Convert bill_date to 'dd/mm/yyyy'
4. Convert bill_date to 'yyyymmdd'
5. Convert bill_date to 'Mon dd yyyy'
6. Convert bill_date to 'dd mon yy'
7. Convert GETDATE() to ISO8601
8. Convert GETDATE() to style 20
9. Convert GETDATE() to style 1
10. Convert GETDATE() to style 3

## DateTime to String (CONVERT with style)
1. bill_date with time 'yyyy-mm-dd hh:mi:ss'
2. bill_date with milliseconds 'yyyy-mm-dd hh:mi:ss.mmm'
3. NOW with milliseconds
4. bill_date in style 113
5. bill_date in style 109
6. bill_date in style 126 (ISO8601)
7. GETDATE() in style 127 (ISO8601 +TZ)
8. bill_date in style 3 with time
9. bill_date in style 23 with time
10. GETDATE() in style 14 (hh:mi:ss:mmm)

## String to Date (CONVERT/CAST)
1. Convert '2023-04-15' to date
2. Convert '04/15/2023' US format
3. Convert '15/04/2023' UK format
4. Convert '20230415' compact format
5. CAST string to date
6. TRY_CONVERT date from invalid
7. Convert '15-Apr-2023' format 106
8. Convert style 1 two-digit year
9. Convert 'Apr 15, 2023' style 107
10. Convert 'Sat Apr 15 2023' style 100

## String to DateTime (CONVERT/TRY_PARSE)
1. Convert '2023-04-15 13:45:00' to datetime
2. Convert ISO8601 with mmm '121'
3. CAST ISO string to datetime2
4. TRY_PARSE UK format
5. Convert style 113
6. Convert style 109
7. Convert with timezone offset
8. TRY_CONVERT datetime2 from compact
9. Convert style 126 to datetimeoffset
10. TRY_PARSE month name format

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show current UTC time
2. Convert current UTC to India Standard Time
3. Convert bill_date (assumed UTC) to IST
4. Convert bill_date to Pacific Standard Time
5. Use SWITCHOFFSET to shift bill_dateoffset by +02:00
6. Insert current time with timezone
7. Filter bills where IST local date is today
8. Compare bill_date IST to a fixed IST datetime
9. Show difference in hours between UTC and IST for bill_date
10. Convert bill_date from local to UTC (reverse)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
