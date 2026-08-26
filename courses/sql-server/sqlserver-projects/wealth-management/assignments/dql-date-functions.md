![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Display current date and time.
2. Display current date only.
3. List clients who joined today.
4. List accounts opened today.
5. Count transactions up to now.
6. Show days since each client's join.
7. Show portfolio retrieval timestamp.
8. List transactions with current query time.
9. Show goal query timestamp.
10. List portfolio creation with current timestamp.

## Date Part Function (DATEPART)
1. Extract year from client join_date.
2. Extract month from join_date.
3. Extract day from transaction txn_date.
4. Extract hour from current datetime.
5. Extract minute from current datetime.
6. Extract second from current datetime.
7. Extract quarter from portfolio created_date.
8. Extract week of year from client join_date.
9. Extract day of year from financial goal target_date.
10. Extract ISO year from acquisition_date.

## Date Difference Function (DATEDIFF)
1. Calculate days since client joined.
2. Calculate months since account opened.
3. Calculate years until goal target_date.
4. Calculate hours between a transaction and now.
5. Days between portfolio creation and today.
6. Days between two transactions.
7. Months between acquisition and today.
8. Years since client birth (age).
9. Days to first transaction after join.
10. Weeks from join_date to goal target_date.

## Date Addition/Subtraction (DATEADD)
1. Add 30 days to client join_date.
2. Subtract 1 month from account opened_date.
3. Add 1 year to financial goal target_date.
4. Subtract 7 days from transaction txn_date.
5. Add 6 hours to acquisition_date.
6. Subtract 15 days from portfolio created_date.
7. Add 90 minutes to now.
8. Subtract 2 years from target_date.
9. Add 100 days to join_date.
10. Subtract 3 months from opened_date.

## Date Formatting (FORMAT)
1. Format join_date as 'dd/MM/yyyy'.
2. Format opened_date as 'MMMM yyyy'.
3. Format txn_date as 'yyyy-MM-dd HH:mm'.
4. Format target_date as 'MMM dd, yyyy'.
5. Format created_date as 'yyyy/MM/dd'.
6. Format acquisition_date as 'dd MMM yyyy'.
7. Format current time as 'hh:mm tt'.
8. Format date_of_birth as 'dddd, MMMM d'.
9. Format txn_date as ISO 8601.
10. Format target_date as long date.

## Weekday Function (DATEPART weekday)
1. Extract weekday number from txn_date.
2. List transactions on Monday (weekday = 2).
3. Count transactions by weekday.
4. Clients who joined on Friday.
5. Extract weekday of account opened_date.
6. Goals due on weekends.
7. Portfolio creation weekday.
8. Transactions on first day of week (weekday=1).
9. Clients with join_date weekday between 2 and 6.
10. Goals with target weekday.

## Date to String (CONVERT with style)
1. Convert join_date to mm/dd/yyyy.
2. Convert opened_date to dd/mm/yyyy.
3. Convert txn_date to yyyymmdd.
4. Convert target_date to 'mon dd yyyy'.
5. Convert created_date to dd Mon yyyy.
6. Convert acquisition_date to yyyy-mm-dd.
7. Convert date_of_birth to mm-dd-yy.
8. Convert target_date to default style.
9. Convert txn_date to style 120.
10. Convert join_date to style 113.

## DateTime to String (CONVERT with style)
1. Convert GETDATE() to style 121.
2. Convert txn_date to style 20.
3. Convert target_date to style 126.
4. Convert GETDATE() to style 100.
5. Convert created_date to style 109.
6. Convert acquisition_date to style 113.
7. Convert txn_date to style 120.
8. Convert GETDATE() with milliseconds.
9. Convert date_of_birth to style 103.
10. Convert opened_date to style 1.

## String to Date (CONVERT/CAST)
1. Convert '01/15/2022' to date.
2. Convert '15/01/2022' to date.
3. Convert '20220115' to date.
4. Convert 'Jan 15 2022' to date.
5. Convert '2022-01-15' to date.
6. Convert '15-Jan-2022' to date.
7. Convert '15.01.2022' to date.
8. Convert '2022/01/15' to date.
9. Convert '2022-Jan-15' to date.
10. Convert '01-15-2022' to date.

## String to DateTime (CONVERT/TRY_PARSE)
1. Convert '2022-01-15 10:30:00' to datetime.
2. Convert '15/01/2022 16:45:00' to datetime.
3. Convert '20220115 103000' to datetime.
4. Convert 'Jan 15 2022 1:30PM' to datetime.
5. Convert '2022-01-15T10:30:00' to datetime2.
6. Convert '2022/01/15 10:30' to datetime.
7. Convert '01-15-2022 10:30:00' to datetime.
8. Convert '15 Jan 2022 10:30:00' to datetime.
9. Convert '2022.01.15 10:30:00' to datetime.
10. Convert '2022-01-15 10:30:00.123' to datetime2.

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show current UTC time.
2. Convert GETDATE() to India Standard Time.
3. Convert transaction time to Eastern Standard Time.
4. Convert target_date to Pacific Standard Time.
5. Show server datetimeoffset.
6. Convert client join_date midnight to UTC.
7. Convert portfolio created_date to Central Europe Time.
8. Show current time in GMT.
9. Convert opened_date to Japan Standard Time.
10. Convert acquisition_date to Australian Eastern Standard Time.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
