![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. List clients named 'Alice'.
2. Find accounts of type 'Checking'.
3. Get the 'Retirement Mix' portfolio.
4. Show asset with symbol 'AAPL'.
5. Find portfolio_assets with quantity = 100.
6. List all 'Deposit' transactions.
7. Get financial goals in status 'In Progress'.
8. Clients who joined on '2022-01-15'.
9. Accounts opened on '2021-06-30'.
10. Goals with target_date = '2030-06-30'.

## Inequality Operator (<>)
1. Clients whose last name is not 'Green'.
2. Accounts where status is not 'Closed'.
3. Portfolios not named 'Growth Stocks'.
4. Assets not of type 'ETF'.
5. Portfolio_assets where acquisition_price <> 100.00.
6. Transactions not of type 'Sell'.
7. Goals where current_amount <> 0.
8. Clients whose email is not 'alice.green@example.com'.
9. Accounts for client_id not equal to 1.
10. Portfolios with client_id not equal to 2.

## IN Operator
1. Clients with IDs 1, 2, or 3.
2. Accounts of type Checking or Savings.
3. Portfolios named 'Retirement Mix' or 'Growth Stocks'.
4. Assets with symbols AAPL, GOOG, MSFT.
5. Portfolio_assets for asset_ids 301,302,303.
6. Transactions of amounts 5000.00, 3000.00, or 4500.00.
7. Goals with status In Progress or Paused.
8. Clients with last names Green, Lee, Ng.
9. Accounts with IDs 101 or 102.
10. Portfolios with IDs 201,202,203.

## NOT IN Operator
1. Clients excluding IDs 1,2,3.
2. Accounts with status not in 'Closed'.
3. Portfolios not belonging to clients 1 or 2.
4. Assets excluding symbols AAPL, GOOG.
5. Portfolio_assets excluding portfolio_ids 201,202.
6. Transactions not of types Buy or Sell.
7. Goals not in status 'Achieved'.
8. Clients excluding two emails.
9. Accounts not of type 'Brokerage'.
10. Portfolios not created on these dates.

## LIKE Operator
1. Emails ending @example.com.
2. Account types starting with 'Brok'.
3. Portfolio names ending in 'Fund'.
4. Asset names containing 'Inc.'.
5. Quantities starting with 1.
6. Descriptions containing 'deposit'.
7. Goal names containing 'Retirement'.
8. First names starting with 'A'.
9. Symbols with second letter O.
10. Portfolio names containing 'Mix'.

## NOT LIKE Operator
1. Emails not ending @example.com.
2. Accounts not 'Active'.
3. Portfolios not ending in 'Fund'.
4. Asset types not starting with 'St'.
5. Descriptions not containing 'Buy'.
6. Goals not containing 'Fund'.
7. First names not starting with 'A'.
8. Symbols not containing 'A'.
9. Portfolio names not ending in 'Mix'.
10. Account types not containing 'ing'.

## BETWEEN Operator
1. Transactions amount between 1000 and 5000.
2. Accounts opened between 2021-01-01 and 2022-12-31.
3. Clients born between 1980-01-01 and 1990-12-31.
4. Prices between 100 and 200.
5. Portfolios created between 2020-01-01 and 2021-12-31.
6. Goals with target_amount between 50000 and 200000.
7. Assets with IDs between 300 and 310.
8. Transactions in 2022.
9. Clients joined between 2020-01-01 and 2023-12-31.
10. Accounts with IDs between 105 and 115.

## Greater Than (>)
1. Portfolio_assets with quantity > 100.
2. Transactions with amount > 1000.
3. Goals with current_amount > 50000.
4. Clients born after 1990-01-01.
5. Accounts with ID > 120.
6. Assets with ID > 315.
7. Portfolios created after 2022-06-01.
8. Transactions after 2023-01-01.
9. Clients who joined after 2021-01-01.
10. Prices greater than 300.

## Greater Than or Equal To (>=)
1. Clients with ID >= 10.
2. Accounts opened on or after 2021-06-30.
3. Portfolios with ID >= 205.
4. Assets with ID >= 310.
5. Portfolio_assets with quantity >= 150.
6. Transactions with amount >= 2000.
7. Goals with target_amount >= 100000.
8. Clients born on or after 1985-01-01.
9. Accounts with ID >= 110.
10. Transactions on or after 2022-07-01.

## Less Than (<)
1. Clients born before 1990-01-01.
2. Accounts opened before 2021-01-01.
3. Portfolios created before 2021-01-01.
4. Assets with ID < 310.
5. Portfolio_assets with quantity < 50.
6. Transactions with negative amounts.
7. Goals with current_amount < 20000.
8. Accounts with ID < 105.
9. Clients who joined before 2021-01-01.
10. Portfolios with ID < 210.

## Less Than or Equal To (<=)
1. Clients born on or before 1990-12-31.
2. Accounts opened on or before 2022-05-20.
3. Portfolios created on or before 2022-07-01.
4. Assets with ID <= 305.
5. Portfolio_assets with quantity <= 100.
6. Transactions with amount <= 500.
7. Goals with current_amount <= 50000.
8. Accounts with ID <= 115.
9. Clients who joined on or before 2022-01-15.
10. Transactions on or before 2022-03-05.

## EXISTS Operator
1. Clients having at least one account.
2. Clients having at least one transaction.
3. Portfolios that contain assets.
4. Assets held in any portfolio.
5. Accounts with deposits.
6. Accounts with withdrawals.
7. Clients with financial goals.
8. Goals linked to clients.
9. Transactions for valid accounts.
10. Portfolio_assets for valid portfolios.

## NOT EXISTS Operator
1. Clients with no accounts.
2. Clients with no transactions.
3. Portfolios with no assets.
4. Assets not held by any portfolio.
5. Accounts with no transactions.
6. Clients with no financial goals.
7. Goals not linked to any client.
8. Transactions without a closed account.
9. Portfolio_assets without valid assets.
10. Portfolios without any clients.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
