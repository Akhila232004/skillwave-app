![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions

## Current Date and time (GETDATE)
```sql
-- 1. Show current date and time
SELECT GETDATE() AS CurrentDateTime;
-- 2. Today’s date only
SELECT CAST(GETDATE() AS DATE) AS TodayDate;
-- 3. Clients who joined today
SELECT * FROM credit_card.clients
WHERE join_date = CAST(GETDATE() AS DATE);
-- 4. Transactions that occurred today
SELECT * FROM credit_card.card_transactions
WHERE txn_date = CAST(GETDATE() AS DATE);
-- 5. Statements generated today
SELECT * FROM credit_card.statements
WHERE statement_date = CAST(GETDATE() AS DATE);
-- 6. Cards expiring today
SELECT * FROM credit_card.credit_cards
WHERE expiry_date = CAST(GETDATE() AS DATE);
-- 7. Payments made up to now
SELECT * FROM credit_card.payments
WHERE payment_date <= GETDATE();
-- 8. Cards issued in last 30 days
SELECT * FROM credit_card.credit_cards
WHERE issue_date >= DATEADD(day, -30, GETDATE());
-- 9. Statements due in next 7 days
SELECT * FROM credit_card.statements
WHERE due_date BETWEEN GETDATE() AND DATEADD(day, 7, GETDATE());
-- 10. Payments made in last 24 hours
SELECT * FROM credit_card.payments
WHERE payment_date >= DATEADD(hour, -24, GETDATE());
```

## Date Part Function (DATEPART)
```sql
-- 1. Year of each client’s join_date
SELECT client_id, DATEPART(year, join_date) AS JoinYear
FROM credit_card.clients;
-- 2. Month of each transaction
SELECT txn_id, DATEPART(month, txn_date) AS TxnMonth
FROM credit_card.card_transactions;
-- 3. Day of month of each payment
SELECT payment_id, DATEPART(day, payment_date) AS PayDay
FROM credit_card.payments;
-- 4. Hour component of current time
SELECT DATEPART(hour, GETDATE()) AS CurrentHour;
-- 5. Minute component of each payment
SELECT payment_id, DATEPART(minute, payment_date) AS PayMinute
FROM credit_card.payments;
-- 6. Second component of current time
SELECT DATEPART(second, GETDATE()) AS CurrentSecond;
-- 7. Weekday number (1=Sunday) of each statement
SELECT statement_id, DATEPART(weekday, statement_date) AS StatementWeekday
FROM credit_card.statements;
-- 8. ISO week number of each transaction
SELECT txn_id, DATEPART(isowk, txn_date) AS TxnISOWeek
FROM credit_card.card_transactions;
-- 9. Quarter of each card’s issue_date
SELECT card_id, DATEPART(qq, issue_date) AS IssueQuarter
FROM credit_card.credit_cards;
-- 10. Day of year of each transaction
SELECT txn_id, DATEPART(dayofyear, txn_date) AS DayOfYear
FROM credit_card.card_transactions;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days since each client joined
SELECT client_id, DATEDIFF(day, join_date, GETDATE()) AS DaysSinceJoin
FROM credit_card.clients;
-- 2. Months between issue and expiry of each card
SELECT card_id, DATEDIFF(month, issue_date, expiry_date) AS MonthsValid
FROM credit_card.credit_cards;
-- 3. Years between birth and today (age)
SELECT client_id, DATEDIFF(year, date_of_birth, GETDATE()) AS AgeYears
FROM credit_card.clients;
-- 4. Hours between statement_date and due_date
SELECT statement_id, DATEDIFF(hour, statement_date, due_date) AS HoursToDue
FROM credit_card.statements;
-- 5. Minutes between transaction and now
SELECT txn_id, DATEDIFF(minute, txn_date, GETDATE()) AS MinsSinceTxn
FROM credit_card.card_transactions;
-- 6. Seconds between payment and now
SELECT payment_id, DATEDIFF(second, payment_date, GETDATE()) AS SecsSincePay
FROM credit_card.payments;
-- 7. Days between statement and payment for each payment
SELECT p.payment_id, DATEDIFF(day, s.statement_date, p.payment_date) AS DaysToPay
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id;
-- 8. Weeks since each client joined
SELECT client_id, DATEDIFF(week, join_date, GETDATE()) AS WeeksSinceJoin
FROM credit_card.clients;
-- 9. Months since last statement for each card
SELECT card_id, DATEDIFF(month,
    (SELECT MAX(statement_date) FROM credit_card.statements WHERE card_id = cc.card_id),
    GETDATE()
) AS MonthsSinceLastStmt
FROM credit_card.credit_cards AS cc;
-- 10. Days between first and last transaction per card
SELECT card_id,
       DATEDIFF(day,
         MIN(txn_date), MAX(txn_date)
       ) AS DaysBetweenTxns
FROM credit_card.card_transactions
GROUP BY card_id;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Add 1 month to each card’s issue_date
SELECT card_id, DATEADD(month, 1, issue_date) AS NextIssueDate
FROM credit_card.credit_cards;
-- 2. Subtract 1 month from each expiry_date
SELECT card_id, DATEADD(month, -1, expiry_date) AS PrevMonthExpiry
FROM credit_card.credit_cards;
-- 3. Add 1 year to each client’s join_date
SELECT client_id, DATEADD(year, 1, join_date) AS OneYearMark
FROM credit_card.clients;
-- 4. Subtract 7 days from each statement_date
SELECT statement_id, DATEADD(day, -7, statement_date) AS WeekBeforeStmt
FROM credit_card.statements;
-- 5. Add 30 minutes to each transaction time
SELECT txn_id, DATEADD(minute, 30, txn_date) AS TxnPlus30Min
FROM credit_card.card_transactions;
-- 6. Subtract 2 hours from each payment time
SELECT payment_id, DATEADD(hour, -2, payment_date) AS PayMinus2Hr
FROM credit_card.payments;
-- 7. Add 10 days to join_date for trial expiration
SELECT client_id, DATEADD(day, 10, join_date) AS TrialExpires
FROM credit_card.clients;
-- 8. Add 7 days to due_date for grace period
SELECT statement_id, DATEADD(day, 7, due_date) AS GraceDueDate
FROM credit_card.statements;
-- 9. Subtract 1 quarter from each statement_date
SELECT statement_id, DATEADD(quarter, -1, statement_date) AS PrevQuarterStmt
FROM credit_card.statements;
-- 10. Add 90 days to expiry_date for extended validity
SELECT card_id, DATEADD(day, 90, expiry_date) AS ExtendedExpiry
FROM credit_card.credit_cards;
```

## Date Formatting (FORMAT)
```sql
-- 1. Format join_date as yyyy-MM-dd
SELECT client_id, FORMAT(join_date,'yyyy-MM-dd') AS JoinISO
FROM credit_card.clients;
-- 2. Format txn_date as MMM dd, yyyy
SELECT txn_id, FORMAT(txn_date,'MMM dd, yyyy') AS TxnPretty
FROM credit_card.card_transactions;
-- 3. Format payment_date as MM/dd/yyyy HH:mm
SELECT payment_id, FORMAT(payment_date,'MM/dd/yyyy HH:mm') AS PayFormatted
FROM credit_card.payments;
-- 4. Format statement_date as dddd, MMMM dd yyyy
SELECT statement_id, FORMAT(statement_date,'dddd, MMMM dd yyyy') AS StmtLong
FROM credit_card.statements;
-- 5. Format due_date as yyyyMMdd
SELECT statement_id, FORMAT(due_date,'yyyyMMdd') AS DueCompact
FROM credit_card.statements;
-- 6. Format expiry_date with time
SELECT card_id, FORMAT(expiry_date,'yyyy-MM-dd hh:mm tt') AS ExpiryWithTime
FROM credit_card.credit_cards;
-- 7. Format GETDATE() as yyyy-MM-dd HH:mm:ss
SELECT FORMAT(GETDATE(),'yyyy-MM-dd HH:mm:ss') AS NowFormatted;
-- 8. Format join_date as dd/MM/yyyy
SELECT client_id, FORMAT(join_date,'dd/MM/yyyy') AS JoinDMY
FROM credit_card.clients;
-- 9. Format txn_date as yyyy-MM
SELECT txn_id, FORMAT(txn_date,'yyyy-MM') AS TxnYearMonth
FROM credit_card.card_transactions;
-- 10. Format payment_date as hh:mm:ss
SELECT payment_id, FORMAT(payment_date,'HH:mm:ss') AS PayTime
FROM credit_card.payments;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Numeric weekday of join_date (1=Sunday)
SELECT client_id, DATEPART(weekday,join_date) AS JoinWeekday
FROM credit_card.clients;
-- 2. Weekday of txn_date
SELECT txn_id, DATEPART(weekday,txn_date) AS TxnWeekday
FROM credit_card.card_transactions;
-- 3. Weekday of statement_date
SELECT statement_id, DATEPART(weekday,statement_date) AS StmtWeekday
FROM credit_card.statements;
-- 4. Weekday of due_date
SELECT statement_id, DATEPART(weekday,due_date) AS DueWeekday
FROM credit_card.statements;
-- 5. Weekday of payment_date
SELECT payment_id, DATEPART(weekday,payment_date) AS PayWeekday
FROM credit_card.payments;
-- 6. Count transactions on weekends
SELECT DATEPART(weekday,txn_date) AS Weekday, COUNT(*) AS Cnt
FROM credit_card.card_transactions
GROUP BY DATEPART(weekday,txn_date)
HAVING DATEPART(weekday,txn_date) IN (1,7);
-- 7. Count payments on weekdays
SELECT DATEPART(weekday,payment_date) AS Weekday, COUNT(*) AS Cnt
FROM credit_card.payments
GROUP BY DATEPART(weekday,payment_date)
HAVING DATEPART(weekday,payment_date) BETWEEN 2 AND 6;
-- 8. List clients who joined on a Monday (weekday=2)
SELECT * FROM credit_card.clients
WHERE DATEPART(weekday,join_date)=2;
-- 9. List statements generated on Friday (weekday=6)
SELECT * FROM credit_card.statements
WHERE DATEPART(weekday,statement_date)=6;
-- 10. List transactions on Wednesday (weekday=4)
SELECT * FROM credit_card.card_transactions
WHERE DATEPART(weekday,txn_date)=4;
```

## Date to String (CONVERT with style)
```sql
-- 1. Convert statement_date to varchar style 101 (MM/dd/yyyy)
SELECT statement_id, CONVERT(VARCHAR(10),statement_date,101) AS Stmt101
FROM credit_card.statements;
-- 2. Convert due_date to style 112 (yyyyMMdd)
SELECT statement_id, CONVERT(VARCHAR(8),due_date,112) AS Due112
FROM credit_card.statements;
-- 3. Convert join_date to style 103 (dd/MM/yyyy)
SELECT client_id, CONVERT(VARCHAR(10),join_date,103) AS Join103
FROM credit_card.clients;
-- 4. Convert txn_date to style 120 (yyyy-MM-dd hh:mi:ss)
SELECT txn_id, CONVERT(VARCHAR(19),txn_date,120) AS Txn120
FROM credit_card.card_transactions;
-- 5. Convert payment_date to style 1 (MM/dd/yy)
SELECT payment_id, CONVERT(VARCHAR(8),payment_date,1) AS PayStyle1
FROM credit_card.payments;
-- 6. Convert expiry_date to style 23 (yyyy-MM-dd)
SELECT card_id, CONVERT(VARCHAR(10),expiry_date,23) AS Expiry23
FROM credit_card.credit_cards;
-- 7. Convert issue_date to style 101
SELECT card_id, CONVERT(VARCHAR(10),issue_date,101) AS Issue101
FROM credit_card.credit_cards;
-- 8. Convert date_of_birth to style 126 (ISO8601)
SELECT client_id, CONVERT(VARCHAR(30),date_of_birth,126) AS DOB126
FROM credit_card.clients;
-- 9. Convert statement_date to style 109 (mon dd yyyy hh:mi:ss:mmmAM)
SELECT statement_id, CONVERT(VARCHAR(30),statement_date,109) AS Stmt109
FROM credit_card.statements;
-- 10. Convert payment_date to style 114 (hh:mi:ss:mmm)
SELECT payment_id, CONVERT(VARCHAR(12),payment_date,114) AS Pay114
FROM credit_card.payments;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. Convert GETDATE() to ISO8601
SELECT CONVERT(VARCHAR(30),GETDATE(),126) AS NowISO8601;
-- 2. Convert payment_date to style 121 (ODBC canonical)
SELECT payment_id, CONVERT(VARCHAR(30),payment_date,121) AS Pay121
FROM credit_card.payments;
-- 3. Convert txn_date to style 126
SELECT txn_id, CONVERT(VARCHAR(30),txn_date,126) AS Txn126
FROM credit_card.card_transactions;
-- 4. Convert join_date (date-only) to datetime string style 120
SELECT client_id, CONVERT(VARCHAR(19),CAST(join_date AS DATETIME),120) AS JoinDateTime
FROM credit_card.clients;
-- 5. Convert statement_date to style 109
SELECT statement_id, CONVERT(VARCHAR(30),statement_date,109) AS Stmt109dt
FROM credit_card.statements;
-- 6. Convert due_date to style 108 (hh:mi:ss)
SELECT statement_id, CONVERT(VARCHAR(8),due_date,108) AS DueTimeOnly
FROM credit_card.statements;
-- 7. Convert expiry_date to style 130 (Europe default + timezone)
SELECT card_id, CONVERT(VARCHAR(50),expiry_date,130) AS Expiry130
FROM credit_card.credit_cards;
-- 8. Convert issue_date to style 101 + time 108
SELECT card_id, CONVERT(VARCHAR(10),issue_date,101)+' '+CONVERT(VARCHAR(8),issue_date,108) AS IssueDT
FROM credit_card.credit_cards;
-- 9. Convert date_of_birth to style 103 + time 114
SELECT client_id, CONVERT(VARCHAR(10),date_of_birth,103)+' '+CONVERT(VARCHAR(12),date_of_birth,114) AS DOBDT
FROM credit_card.clients;
-- 10. Convert payment_date to style 100 (mon dd yyyy hh:miAM)
SELECT payment_id, CONVERT(VARCHAR(30),payment_date,100) AS Pay100
FROM credit_card.payments;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Parse '2023-06-01' to DATE
SELECT CAST('2023-06-01' AS DATE) AS ParsedDate;
-- 2. Parse '06/25/2023' with style 101
SELECT CONVERT(DATE,'06/25/2023',101) AS ParsedDate101;
-- 3. Parse '20230601' with style 112
SELECT CONVERT(DATE,'20230601',112) AS ParsedDate112;
-- 4. Parse '01 Jun 2023' with style 106
SELECT CONVERT(DATE,'01 Jun 2023',106) AS ParsedDate106;
-- 5. Parse '2023-06-01 12:00' to DATE
SELECT CAST('2023-06-01 12:00' AS DATE) AS ParsedDateTimeToDate;
-- 6. Parse transaction date strings from a derived table
SELECT CONVERT(DATE,CAST(txn_date AS VARCHAR),120) AS ReparsedTxnDate
FROM credit_card.card_transactions;
-- 7. Parse '2023-12-01T00:00:00' as DATE
SELECT CAST('2023-12-01T00:00:00' AS DATE) AS ParsedISODate;
-- 8. Parse '25/12/2023' with style 103
SELECT CONVERT(DATE,'25/12/2023',103) AS ParsedDateUK;
-- 9. Parse '2023 12 01' with style 120
SELECT CONVERT(DATE,'2023 12 01',120) AS ParsedDateSpaced;
-- 10. Parse payment_date strings back to DATE
SELECT CAST(CONVERT(VARCHAR(10),payment_date,120) AS DATE) AS RoundTripDate
FROM credit_card.payments;
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Parse '2023-06-01 10:15:00' to DATETIME
SELECT CAST('2023-06-01 10:15:00' AS DATETIME) AS ParsedDT;
-- 2. Parse '06/25/2023 14:30' with style 101
SELECT CONVERT(DATETIME,'06/25/2023 14:30',101) AS ParsedDT101;
-- 3. Parse '20230601 101500' with style 112
SELECT CONVERT(DATETIME,'20230601 101500',112) AS ParsedDT112;
-- 4. Parse 'Jun 01 2023 10:15AM' with style 100
SELECT CONVERT(DATETIME,'Jun 01 2023 10:15AM',100) AS ParsedDT100;
-- 5. Parse '2023-06-01T10:15:00' ISO8601
SELECT CAST('2023-06-01T10:15:00' AS DATETIME2) AS ParsedISO;
-- 6. Reparse txn_date strings to DATETIME
SELECT CAST(CONVERT(VARCHAR(19),txn_date,120) AS DATETIME) AS RoundTripTxnDT
FROM credit_card.card_transactions;
-- 7. Parse '2023/06/01 10:15:00' with style 111
SELECT CONVERT(DATETIME,'2023/06/01 10:15:00',111) AS Parsed111;
-- 8. Parse '01.06.2023 10:15' with style 104
SELECT CONVERT(DATETIME,'01.06.2023 10:15',104) AS Parsed104;
-- 9. Parse payment_date back to DATETIME2
SELECT CAST(CONVERT(VARCHAR(23),payment_date,121) AS DATETIME2) AS RoundTripPayDT
FROM credit_card.payments;
-- 10. Parse '2023-06-01 10:15:00.123' as DATETIME2(3)
SELECT CAST('2023-06-01 10:15:00.123' AS DATETIME2(3)) AS ParsedDT3;
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Convert current time to UTC
SELECT GETDATE() AT TIME ZONE 'UTC' AS NowUTC;
-- 2. Convert join_date (assumed local) to UTC
SELECT client_id, join_date AT TIME ZONE 'India Standard Time' AT TIME ZONE 'UTC' AS JoinUTC
FROM credit_card.clients;
-- 3. Convert payment_date from UTC to India Standard Time
SELECT payment_id, payment_date AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS PayIST
FROM credit_card.payments;
-- 4. Convert txn_date from UTC to Eastern Standard Time
SELECT txn_id, txn_date AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time' AS TxnEST
FROM credit_card.card_transactions;
-- 5. Show offset of current time
SELECT SYSDATETIMEOFFSET() AS CurrentOffset;
-- 6. Switch existing datetimeoffset to +05:30
SELECT SWITCHOFFSET(SYSDATETIMEOFFSET(), '+05:30') AS Offset0530;
-- 7. List statement_date in UTC and IST
SELECT statement_id,
       statement_date AT TIME ZONE 'UTC'       AS StmtUTC,
       statement_date AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS StmtIST
FROM credit_card.statements;
-- 8. Convert expiry_date (date-only) to midnight IST
SELECT card_id,
       CAST(expiry_date AS DATETIME2) AT TIME ZONE 'UTC' AT TIME ZONE 'India Standard Time' AS ExpiryIST
FROM credit_card.credit_cards;
-- 9. Convert issue_date to local server time zone
SELECT card_id, issue_date AT TIME ZONE 'UTC' AT TIME ZONE SYSUTCDATETIME() AS IssueLocal
FROM credit_card.credit_cards;
-- 10. Compare two zones for GETDATE()
SELECT 
  GETDATE() AT TIME ZONE 'UTC'             AS UTC_Time,
  GETDATE() AT TIME ZONE 'UTC' AT TIME ZONE 'Pacific Standard Time' AS PST_Time;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
