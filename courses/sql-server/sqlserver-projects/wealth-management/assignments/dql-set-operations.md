![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. Combine account_ids for 'Checking' and 'Brokerage' accounts.
2. List client_ids who have made a 'Buy' or a 'Sell' transaction.
3. List all asset symbols that are Stocks or ETFs.
4. Combine portfolio_ids created in 2021 and 2022.
5. Combine asset_ids held in portfolio 201 or 202.
6. Combine txn_id for 'Deposit' and 'Withdrawal' transactions.
7. Combine goal_ids for 'Retirement Fund' and 'College Tuition'.
8. Combine first and last names of clients into one name list.
9. Combine distinct years from client join_date and goal target_date.
10. Combine account_type and asset_type into a common list.

## Intersect
1. Clients who have both 'Checking' and 'Savings' accounts.
2. asset_ids present in both portfolios 201 and 202.
3. account_ids with both 'Buy' and 'Sell' transactions.
4. Clients with both 'Retirement Fund' and 'College Savings' goals.
5. Stocks that are also held in any portfolio.
6. Clients who have a 'Checking' account and also hold a portfolio.
7. Clients with financial goals and with transactions.
8. asset_ids with quantity > 100 that also have asset_id > 310.
9. Portfolios created in 2022 that also have assets with quantity > 100.
10. Accounts opened before '2022-01-01' with at least one deposit.

## Except
1. Clients who have accounts but no portfolios.
2. asset_ids defined in assets but not held in any portfolio.
3. account_ids with transactions except those still 'Active'.
4. Clients with goals but no accounts.
5. Portfolios without any assets.
6. Clients who joined before '2021-01-01' but have no goals.
7. Accounts opened after '2022-01-01' with no transactions.
8. Transactions excluding all 'Deposit' entries.
9. asset_ids with acquisition_price < 200 EXCEPT those with quantity > 50.
10. Clients without any transaction history.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
