![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Running total of transaction amount per card ordered by txn_date
2. Total number of transactions per client (all time)
3. Average closing_balance per card over all statements
4. Cumulative sum of payments per statement ordered by payment_date
5. Maximum transaction amount per merchant
6. Minimum transaction amount per merchant
7. Sum of credit_limit per client
8. Average transaction amount per category
9. Count of statements per card
10. Running average of minimum_due per due_date ordered by due_date

## ROW_NUMBER()
1. Assign row numbers to transactions per card by date
2. Number cards per client ordered by issue_date
3. Number payments per statement by payment_date
4. Rank statements per card by closing_balance
5. Sequential clients by join_date
6. Row number of merchants by total transaction count
7. Number of transactions per category by amount desc
8. Rank statements globally by minimum_due
9. Number of clients sorted by last_name
10. Sequential assignment of payments by amount desc

## RANK()
1. Rank cards per client by credit_limit desc
2. Rank transactions per category by amount desc
3. Rank statements per card by closing_balance
4. Rank clients by total payments amount
5. Rank merchants globally by transaction count
6. Rank clients by number of cards
7. Rank payments per statement by amount asc
8. Rank statements by minimum_due desc
9. Rank transactions per card by date desc
10. Rank clients by join_date desc

## DENSE_RANK()
1. Dense rank cards per client by credit_limit desc
2. Dense rank transactions per category by amount desc
3. Dense rank statements per card by closing_balance
4. Dense rank clients by total payments
5. Dense rank merchants by txn count
6. Dense rank clients by number of cards
7. Dense rank payments per statement by amount asc
8. Dense rank statements by minimum_due desc
9. Dense rank transactions per card by date desc
10. Dense rank clients by join_date desc

## NTILE(n)
1. Quartile of transaction amounts per category
2. Decile of transaction amounts overall
3. Tertile of credit_limit per card_type
4. Quartile of closing_balance per statement_date month
5. Quintile of payment amounts per statement
6. Quartile of total payments per client
7. Quartile of transaction count per client
8. Quartile of minimum_due per card
9. Quartile of join_date year among clients
10. Quartile of average txn amount per card

## LAG()
1. Previous transaction amount per card by date
2. Previous statement closing_balance per card
3. Previous payment date per statement
4. Previous credit_limit per client by issue_date
5. Previous minimum_due per statement_date
6. Previous join_date per client alphabetically
7. Previous transaction category per card
8. Previous payment amount per client
9. Previous transaction date per card
10. Previous status per card when reissued

## LEAD()
1. Next transaction amount per card by date
2. Next statement closing_balance per card
3. Next payment date per statement
4. Next credit_limit per client by issue_date
5. Next minimum_due per statement_date
6. Next join_date per client alphabetically
7. Next transaction category per card
8. Next payment amount per client
9. Next transaction date per card
10. Next status per card when reissued

## FIRST_VALUE()
1. First transaction amount per card by date
2. First statement closing_balance per card
3. First payment date per statement
4. First credit_limit per client
5. First minimum_due overall by date
6. First join_date alphabetically by name
7. First transaction category per card
8. First payment amount per client
9. First transaction date per card
10. First status per card when issued

## LAST_VALUE()
1. Last transaction amount per card by date (requires framing)
2. Last statement closing_balance per card
3. Last payment date per statement
4. Last credit_limit per client
5. Last minimum_due overall by date
6. Last join_date alphabetically by name
7. Last transaction category per card
8. Last payment amount per client
9. Last transaction date per card
10. Last status per card when reissued

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
