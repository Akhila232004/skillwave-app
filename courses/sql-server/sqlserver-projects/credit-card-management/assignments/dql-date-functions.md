![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Show current date and time
2. Today’s date only
3. Clients who joined today
4. Transactions that occurred today
5. Statements generated today
6. Cards expiring today
7. Payments made up to now
8. Cards issued in last 30 days
9. Statements due in next 7 days
10. Payments made in last 24 hours

## Date Part Function (DATEPART)
1. Year of each client’s join_date
2. Month of each transaction
3. Day of month of each payment
4. Hour component of current time
5. Minute component of each payment
6. Second component of current time
7. Weekday number (1=Sunday) of each statement
8. ISO week number of each transaction
9. Quarter of each card’s issue_date
10. Day of year of each transaction

## Date Difference Function (DATEDIFF)
1. Days since each client joined
2. Months between issue and expiry of each card
3. Years between birth and today (age)
4. Hours between statement_date and due_date
5. Minutes between transaction and now
6. Seconds between payment and now
7. Days between statement and payment for each payment
8. Weeks since each client joined
9. Months since last statement for each card
10. Days between first and last transaction per card

## Date Addition/Subtraction (DATEADD)
1. Add 1 month to each card’s issue_date
2. Subtract 1 month from each expiry_date
3. Add 1 year to each client’s join_date
4. Subtract 7 days from each statement_date
5. Add 30 minutes to each transaction time
6. Subtract 2 hours from each payment time
7. Add 10 days to join_date for trial expiration
8. Add 7 days to due_date for grace period
9. Subtract 1 quarter from each statement_date
10. Add 90 days to expiry_date for extended validity

## Date Formatting (FORMAT)
1. Format join_date as yyyy-MM-dd
2. Format txn_date as MMM dd, yyyy
3. Format payment_date as MM/dd/yyyy HH:mm
4. Format statement_date as dddd, MMMM dd yyyy
5. Format due_date as yyyyMMdd
6. Format expiry_date with time
7. Format GETDATE() as yyyy-MM-dd HH:mm:ss
8. Format join_date as dd/MM/yyyy
9. Format txn_date as yyyy-MM
10. Format payment_date as hh:mm:ss

## Weekday Function (DATEPART weekday)
1. Numeric weekday of join_date (1=Sunday)
2. Weekday of txn_date
3. Weekday of statement_date
4. Weekday of due_date
5. Weekday of payment_date
6. Count transactions on weekends
7. Count payments on weekdays
8. List clients who joined on a Monday (weekday=2)
9. List statements generated on Friday (weekday=6)
10. List transactions on Wednesday (weekday=4)

## Date to String (CONVERT with style)
1. Convert statement_date to varchar style 101 (MM/dd/yyyy)
2. Convert due_date to style 112 (yyyyMMdd)
3. Convert join_date to style 103 (dd/MM/yyyy)
4. Convert txn_date to style 120 (yyyy-MM-dd hh:mi:ss)
5. Convert payment_date to style 1 (MM/dd/yy)
6. Convert expiry_date to style 23 (yyyy-MM-dd)
7. Convert issue_date to style 101
8. Convert date_of_birth to style 126 (ISO8601)
9. Convert statement_date to style 109 (mon dd yyyy hh:mi:ss:mmmAM)
10. Convert payment_date to style 114 (hh:mi:ss:mmm)

## DateTime to String (CONVERT with style)
1. Convert GETDATE() to ISO8601
2. Convert payment_date to style 121 (ODBC canonical)
3. Convert txn_date to style 126
4. Convert join_date (date-only) to datetime string style 120
5. Convert statement_date to style 109
6. Convert due_date to style 108 (hh:mi:ss)
7. Convert expiry_date to style 130 (Europe default + timezone)
8. Convert issue_date to style 101 + time 108
9. Convert date_of_birth to style 103 + time 114
10. Convert payment_date to style 100 (mon dd yyyy hh:miAM)

## String to Date (CONVERT/CAST)
1. Parse '2023-06-01' to DATE
2. Parse '06/25/2023' with style 101
3. Parse '20230601' with style 112
4. Parse '01 Jun 2023' with style 106
5. Parse '2023-06-01 12:00' to DATE
6. Parse transaction date strings from a derived table
7. Parse '2023-12-01T00:00:00' as DATE
8. Parse '25/12/2023' with style 103
9. Parse '2023 12 01' with style 120
10. Parse payment_date strings back to DATE

## String to DateTime (CONVERT/TRY_PARSE)
1. Parse '2023-06-01 10:15:00' to DATETIME
2. Parse '06/25/2023 14:30' with style 101
3. Parse '20230601 101500' with style 112
4. Parse 'Jun 01 2023 10:15AM' with style 100
5. Parse '2023-06-01T10:15:00' ISO8601
6. Reparse txn_date strings to DATETIME
7. Parse '2023/06/01 10:15:00' with style 111
8. Parse '01.06.2023 10:15' with style 104
9. Parse payment_date back to DATETIME2
10. Parse '2023-06-01 10:15:00.123' as DATETIME2(3)

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Convert current time to UTC
2. Convert join_date (assumed local) to UTC
3. Convert payment_date from UTC to India Standard Time
4. Convert txn_date from UTC to Eastern Standard Time
5. Show offset of current time
6. Switch existing datetimeoffset to +05:30
7. List statement_date in UTC and IST
8. Convert expiry_date (date-only) to midnight IST
9. Convert issue_date to local server time zone
10. Compare two zones for GETDATE()

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
