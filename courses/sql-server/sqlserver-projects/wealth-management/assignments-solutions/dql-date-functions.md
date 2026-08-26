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
SELECT CAST(GETDATE() AS date) AS current_date;
-- 3. List clients who joined today.
SELECT * FROM wealth_management.clients WHERE join_date = CAST(GETDATE() AS date);
-- 4. List accounts opened today.
SELECT * FROM wealth_management.accounts WHERE opened_date = CAST(GETDATE() AS date);
-- 5. Count transactions up to now.
SELECT COUNT(*) AS transactions_to_now FROM wealth_management.transactions WHERE txn_date <= GETDATE();
-- 6. Show days since each client's join.
SELECT client_id, DATEDIFF(day, join_date, GETDATE()) AS days_since_join FROM wealth_management.clients;
-- 7. Show portfolio retrieval timestamp.
SELECT portfolio_id, GETDATE() AS retrieval_time FROM wealth_management.portfolios;
-- 8. List transactions with current query time.
SELECT txn_id, txn_date, GETDATE() AS query_time FROM wealth_management.transactions;
-- 9. Show goal query timestamp.
SELECT goal_id, target_date, GETDATE() AS queried_at FROM wealth_management.financial_goals;
-- 10. List portfolio creation with current timestamp.
SELECT portfolio_id, created_date, GETDATE() AS current_time FROM wealth_management.portfolios;
```

## Date Part Function (DATEPART)
```sql
-- 1. Extract year from client join_date.
SELECT client_id, DATEPART(year, join_date) AS join_year FROM wealth_management.clients;
-- 2. Extract month from join_date.
SELECT client_id, DATEPART(month, join_date) AS join_month FROM wealth_management.clients;
-- 3. Extract day from transaction txn_date.
SELECT txn_id, DATEPART(day, txn_date) AS txn_day FROM wealth_management.transactions;
-- 4. Extract hour from current datetime.
SELECT DATEPART(hour, GETDATE()) AS current_hour;
-- 5. Extract minute from current datetime.
SELECT DATEPART(minute, GETDATE()) AS current_minute;
-- 6. Extract second from current datetime.
SELECT DATEPART(second, GETDATE()) AS current_second;
-- 7. Extract quarter from portfolio created_date.
SELECT portfolio_id, DATEPART(quarter, created_date) AS created_quarter FROM wealth_management.portfolios;
-- 8. Extract week of year from client join_date.
SELECT client_id, DATEPART(week, join_date) AS join_week FROM wealth_management.clients;
-- 9. Extract day of year from financial goal target_date.
SELECT goal_id, DATEPART(dayofyear, target_date) AS target_day_of_year FROM wealth_management.financial_goals;
-- 10. Extract ISO year from acquisition_date.
SELECT portfolio_id, asset_id, DATEPART(iso_year, acquisition_date) AS acq_iso_year FROM wealth_management.portfolio_assets;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Calculate days since client joined.
SELECT client_id, DATEDIFF(day, join_date, GETDATE()) AS days_since_join FROM wealth_management.clients;
-- 2. Calculate months since account opened.
SELECT account_id, DATEDIFF(month, opened_date, GETDATE()) AS months_open FROM wealth_management.accounts;
-- 3. Calculate years until goal target_date.
SELECT goal_id, DATEDIFF(year, GETDATE(), target_date) AS years_until_target FROM wealth_management.financial_goals;
-- 4. Calculate hours between a transaction and now.
SELECT txn_id, DATEDIFF(hour, txn_date, GETDATE()) AS hours_since_txn FROM wealth_management.transactions;
-- 5. Days between portfolio creation and today.
SELECT portfolio_id, DATEDIFF(day, created_date, GETDATE()) AS days_since_created FROM wealth_management.portfolios;
-- 6. Days between two transactions.
SELECT t1.txn_id AS txn1, t2.txn_id AS txn2,
       DATEDIFF(day, t1.txn_date, t2.txn_date) AS day_diff
FROM wealth_management.transactions t1
JOIN wealth_management.transactions t2 ON t1.txn_id < t2.txn_id;
-- 7. Months between acquisition and today.
SELECT portfolio_id, asset_id,
       DATEDIFF(month, acquisition_date, GETDATE()) AS months_held
FROM wealth_management.portfolio_assets;
-- 8. Years since client birth (age).
SELECT client_id, DATEDIFF(year, date_of_birth, GETDATE()) AS age FROM wealth_management.clients;
-- 9. Days to first transaction after join.
SELECT c.client_id,
       DATEDIFF(day, c.join_date, MIN(t.txn_date)) AS days_to_first_txn
FROM wealth_management.clients c
LEFT JOIN wealth_management.accounts a ON c.client_id = a.client_id
LEFT JOIN wealth_management.transactions t ON a.account_id = t.account_id
GROUP BY c.client_id, c.join_date;
-- 10. Weeks from join_date to goal target_date.
SELECT f.goal_id,
       DATEDIFF(week, c.join_date, f.target_date) AS weeks_to_goal
FROM wealth_management.financial_goals f
JOIN wealth_management.clients c ON f.client_id = c.client_id;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Add 30 days to client join_date.
SELECT client_id, DATEADD(day, 30, join_date) AS join_plus_30 FROM wealth_management.clients;
-- 2. Subtract 1 month from account opened_date.
SELECT account_id, DATEADD(month, -1, opened_date) AS opened_minus_1m FROM wealth_management.accounts;
-- 3. Add 1 year to financial goal target_date.
SELECT goal_id, DATEADD(year, 1, target_date) AS extended_target FROM wealth_management.financial_goals;
-- 4. Subtract 7 days from transaction txn_date.
SELECT txn_id, DATEADD(day, -7, txn_date) AS txn_minus_week FROM wealth_management.transactions;
-- 5. Add 6 hours to acquisition_date.
SELECT portfolio_id, asset_id,
       DATEADD(hour, 6, CAST(acquisition_date AS datetime)) AS acq_plus_6h
FROM wealth_management.portfolio_assets;
-- 6. Subtract 15 days from portfolio created_date.
SELECT portfolio_id, DATEADD(day, -15, created_date) AS created_minus_15 FROM wealth_management.portfolios;
-- 7. Add 90 minutes to now.
SELECT DATEADD(minute, 90, GETDATE()) AS now_plus_90min;
-- 8. Subtract 2 years from target_date.
SELECT goal_id, DATEADD(year, -2, target_date) AS goal_minus_2y FROM wealth_management.financial_goals;
-- 9. Add 100 days to join_date.
SELECT client_id, DATEADD(day, 100, join_date) AS join_plus_100 FROM wealth_management.clients;
-- 10. Subtract 3 months from opened_date.
SELECT account_id, DATEADD(month, -3, opened_date) AS opened_minus_3m FROM wealth_management.accounts;
```

## Date Formatting (FORMAT)
```sql
-- 1. Format join_date as 'dd/MM/yyyy'.
SELECT client_id, FORMAT(join_date, 'dd/MM/yyyy') AS join_fmt FROM wealth_management.clients;
-- 2. Format opened_date as 'MMMM yyyy'.
SELECT account_id, FORMAT(opened_date, 'MMMM yyyy') AS opened_month FROM wealth_management.accounts;
-- 3. Format txn_date as 'yyyy-MM-dd HH:mm'.
SELECT txn_id, FORMAT(txn_date, 'yyyy-MM-dd HH:mm') AS txn_fmt FROM wealth_management.transactions;
-- 4. Format target_date as 'MMM dd, yyyy'.
SELECT goal_id, FORMAT(target_date, 'MMM dd, yyyy') AS target_fmt FROM wealth_management.financial_goals;
-- 5. Format created_date as 'yyyy/MM/dd'.
SELECT portfolio_id, FORMAT(created_date, 'yyyy/MM/dd') AS created_fmt FROM wealth_management.portfolios;
-- 6. Format acquisition_date as 'dd MMM yyyy'.
SELECT portfolio_id, asset_id,
       FORMAT(acquisition_date, 'dd MMM yyyy') AS acq_fmt
FROM wealth_management.portfolio_assets;
-- 7. Format current time as 'hh:mm tt'.
SELECT FORMAT(GETDATE(), 'hh:mm tt') AS current_time;
-- 8. Format date_of_birth as 'dddd, MMMM d'.
SELECT client_id, FORMAT(date_of_birth, 'dddd, MMMM d') AS dob_fmt FROM wealth_management.clients;
-- 9. Format txn_date as ISO 8601.
SELECT txn_id, FORMAT(txn_date, 's') AS txn_iso FROM wealth_management.transactions;
-- 10. Format target_date as long date.
SELECT goal_id, FORMAT(target_date, 'D') AS target_long FROM wealth_management.financial_goals;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Extract weekday number from txn_date.
SELECT txn_id, DATEPART(weekday, txn_date) AS txn_weekday FROM wealth_management.transactions;
-- 2. List transactions on Monday (weekday = 2).
SELECT * FROM wealth_management.transactions WHERE DATEPART(weekday, txn_date) = 2;
-- 3. Count transactions by weekday.
SELECT DATEPART(weekday, txn_date) AS weekday, COUNT(*) AS count
FROM wealth_management.transactions
GROUP BY DATEPART(weekday, txn_date);
-- 4. Clients who joined on Friday.
SELECT * FROM wealth_management.clients WHERE DATEPART(weekday, join_date) = 6;
-- 5. Extract weekday of account opened_date.
SELECT account_id, DATEPART(weekday, opened_date) AS opened_wday FROM wealth_management.accounts;
-- 6. Goals due on weekends.
SELECT * FROM wealth_management.financial_goals WHERE DATEPART(weekday, target_date) IN (1,7);
-- 7. Portfolio creation weekday.
SELECT portfolio_id, DATEPART(weekday, created_date) AS created_wday FROM wealth_management.portfolios;
-- 8. Transactions on first day of week (weekday=1).
SELECT * FROM wealth_management.transactions WHERE DATEPART(weekday, txn_date) = 1;
-- 9. Clients with join_date weekday between 2 and 6.
SELECT client_id, first_name, last_name
FROM wealth_management.clients
WHERE DATEPART(weekday, join_date) BETWEEN 2 AND 6;
-- 10. Goals with target weekday.
SELECT goal_id, goal_name,
       DATEPART(weekday, target_date) AS goal_wday
FROM wealth_management.financial_goals;
```

## Date to String (CONVERT with style)
```sql
-- 1. Convert join_date to mm/dd/yyyy.
SELECT client_id, CONVERT(varchar(10), join_date, 101) AS join_101 FROM wealth_management.clients;
-- 2. Convert opened_date to dd/mm/yyyy.
SELECT account_id, CONVERT(varchar(10), opened_date, 103) AS opened_103 FROM wealth_management.accounts;
-- 3. Convert txn_date to yyyymmdd.
SELECT txn_id, CONVERT(varchar(8), txn_date, 112) AS txn_112 FROM wealth_management.transactions;
-- 4. Convert target_date to 'mon dd yyyy'.
SELECT goal_id, CONVERT(varchar(11), target_date, 106) AS target_106 FROM wealth_management.financial_goals;
-- 5. Convert created_date to dd Mon yyyy.
SELECT portfolio_id, CONVERT(varchar(11), created_date, 106) AS created_106 FROM wealth_management.portfolios;
-- 6. Convert acquisition_date to yyyy-mm-dd.
SELECT portfolio_id, asset_id, CONVERT(varchar(10), acquisition_date, 23) AS acq_23 FROM wealth_management.portfolio_assets;
-- 7. Convert date_of_birth to mm-dd-yy.
SELECT client_id, CONVERT(varchar(8), date_of_birth, 1) AS dob_1 FROM wealth_management.clients;
-- 8. Convert target_date to default style.
SELECT goal_id, CONVERT(varchar(30), target_date, 0) AS target0 FROM wealth_management.financial_goals;
-- 9. Convert txn_date to style 120.
SELECT txn_id, CONVERT(varchar(19), txn_date, 120) AS txn120 FROM wealth_management.transactions;
-- 10. Convert join_date to style 113.
SELECT client_id, CONVERT(varchar(30), join_date, 113) AS join113 FROM wealth_management.clients;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. Convert GETDATE() to style 121.
SELECT CONVERT(varchar(30), GETDATE(), 121) AS now121;
-- 2. Convert txn_date to style 20.
SELECT txn_id, CONVERT(varchar(19), txn_date, 20) AS txn20 FROM wealth_management.transactions;
-- 3. Convert target_date to style 126.
SELECT goal_id, CONVERT(varchar(30), target_date, 126) AS target126 FROM wealth_management.financial_goals;
-- 4. Convert GETDATE() to style 100.
SELECT CONVERT(varchar(30), GETDATE(), 100) AS now100;
-- 5. Convert created_date to style 109.
SELECT portfolio_id, CONVERT(varchar(30), created_date, 109) AS created109 FROM wealth_management.portfolios;
-- 6. Convert acquisition_date to style 113.
SELECT portfolio_id, asset_id, CONVERT(varchar(30), acquisition_date, 113) AS acq113 FROM wealth_management.portfolio_assets;
-- 7. Convert txn_date to style 120.
SELECT txn_id, CONVERT(varchar(19), txn_date, 120) AS txn_iso FROM wealth_management.transactions;
-- 8. Convert GETDATE() with milliseconds.
SELECT CONVERT(varchar(23), GETDATE(), 121) AS now_milli;
-- 9. Convert date_of_birth to style 103.
SELECT client_id, CONVERT(varchar(10), date_of_birth, 103) AS dob_str FROM wealth_management.clients;
-- 10. Convert opened_date to style 1.
SELECT account_id, CONVERT(varchar(8), opened_date, 1) AS opened1 FROM wealth_management.accounts;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Convert '01/15/2022' to date.
SELECT CONVERT(date, '01/15/2022', 101) AS d1;
-- 2. Convert '15/01/2022' to date.
SELECT CONVERT(date, '15/01/2022', 103) AS d2;
-- 3. Convert '20220115' to date.
SELECT CONVERT(date, '20220115', 112) AS d3;
-- 4. Convert 'Jan 15 2022' to date.
SELECT CONVERT(date, 'Jan 15 2022', 106) AS d4;
-- 5. Convert '2022-01-15' to date.
SELECT CONVERT(date, '2022-01-15', 23) AS d5;
-- 6. Convert '15-Jan-2022' to date.
SELECT CONVERT(date, '15-Jan-2022', 106) AS d6;
-- 7. Convert '15.01.2022' to date.
SELECT CONVERT(date, '15.01.2022', 104) AS d7;
-- 8. Convert '2022/01/15' to date.
SELECT CONVERT(date, '2022/01/15', 111) AS d8;
-- 9. Convert '2022-Jan-15' to date.
SELECT CONVERT(date, '2022-Jan-15', 106) AS d9;
-- 10. Convert '01-15-2022' to date.
SELECT CONVERT(date, '01-15-2022', 110) AS d10;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Convert '2022-01-15 10:30:00' to datetime.
SELECT CONVERT(datetime, '2022-01-15 10:30:00', 120) AS dt1;
-- 2. Convert '15/01/2022 16:45:00' to datetime.
SELECT CONVERT(datetime, '15/01/2022 16:45:00', 103) AS dt2;
-- 3. Convert '20220115 103000' to datetime.
SELECT CONVERT(datetime, '20220115 103000', 112) AS dt3;
-- 4. Convert 'Jan 15 2022 1:30PM' to datetime.
SELECT CONVERT(datetime, 'Jan 15 2022 1:30PM', 109) AS dt4;
-- 5. Convert '2022-01-15T10:30:00' to datetime2.
SELECT CONVERT(datetime2, '2022-01-15T10:30:00', 126) AS dt5;
-- 6. Convert '2022/01/15 10:30' to datetime.
SELECT CONVERT(datetime, '2022/01/15 10:30', 111) AS dt6;
-- 7. Convert '01-15-2022 10:30:00' to datetime.
SELECT CONVERT(datetime, '01-15-2022 10:30:00', 110) AS dt7;
-- 8. Convert '15 Jan 2022 10:30:00' to datetime.
SELECT CONVERT(datetime, '15 Jan 2022 10:30:00', 106) AS dt8;
-- 9. Convert '2022.01.15 10:30:00' to datetime.
SELECT CONVERT(datetime, '2022.01.15 10:30:00', 102) AS dt9;
-- 10. Convert '2022-01-15 10:30:00.123' to datetime2.
SELECT CONVERT(datetime2, '2022-01-15 10:30:00.123', 121) AS dt10;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show current UTC time.
SELECT GETDATE() AT TIME ZONE 'UTC' AS utc_time;
-- 2. Convert GETDATE() to India Standard Time.
SELECT GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS ist_time;
-- 3. Convert transaction time to Eastern Standard Time.
SELECT txn_id, txn_date AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time' AS txn_est
FROM wealth_management.transactions;
-- 4. Convert target_date to Pacific Standard Time.
SELECT goal_id, target_date AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific Standard Time' AS goal_pst
FROM wealth_management.financial_goals;
-- 5. Show server datetimeoffset.
SELECT SYSDATETIMEOFFSET() AS sys_offset;
-- 6. Convert client join_date midnight to UTC.
SELECT client_id,
       CAST(join_date AS datetime2) AT TIME ZONE 'India Standard Time' AT TIME ZONE 'UTC' AS join_utc
FROM wealth_management.clients;
-- 7. Convert portfolio created_date to Central Europe Time.
SELECT portfolio_id,
       created_date AT TIME ZONE 'UTC' AT TIME ZONE 'Central Europe Standard Time' AS created_cet
FROM wealth_management.portfolios;
-- 8. Show current time in GMT.
SELECT GETDATE() AT TIME ZONE 'GMT Standard Time' AS gmt_time;
-- 9. Convert opened_date to Japan Standard Time.
SELECT account_id,
       opened_date AT TIME ZONE 'UTC' AT TIME ZONE 'Tokyo Standard Time' AS opened_jst
FROM wealth_management.accounts;
-- 10. Convert acquisition_date to Australian Eastern Standard Time.
SELECT portfolio_id, asset_id,
       acquisition_date AT TIME ZONE 'UTC' AT TIME ZONE 'AUS Eastern Standard Time' AS acq_aest
FROM wealth_management.portfolio_assets;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
