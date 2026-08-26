![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. Combine account_ids for 'Checking' and 'Brokerage' accounts.
SELECT account_id
FROM wealth_management.accounts
WHERE account_type = 'Checking'
UNION
SELECT account_id
FROM wealth_management.accounts
WHERE account_type = 'Brokerage';

-- 2. List client_ids who have made a 'Buy' or a 'Sell' transaction.
SELECT DISTINCT c.client_id
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id = a.client_id
JOIN wealth_management.transactions t ON a.account_id = t.account_id
WHERE t.txn_type = 'Buy'
UNION
SELECT DISTINCT c.client_id
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id = a.client_id
JOIN wealth_management.transactions t ON a.account_id = t.account_id
WHERE t.txn_type = 'Sell';

-- 3. List all asset symbols that are Stocks or ETFs.
SELECT symbol
FROM wealth_management.assets
WHERE asset_type = 'Stock'
UNION
SELECT symbol
FROM wealth_management.assets
WHERE asset_type = 'ETF';

-- 4. Combine portfolio_ids created in 2021 and 2022.
SELECT portfolio_id
FROM wealth_management.portfolios
WHERE YEAR(created_date) = 2021
UNION
SELECT portfolio_id
FROM wealth_management.portfolios
WHERE YEAR(created_date) = 2022;

-- 5. Combine asset_ids held in portfolio 201 or 202.
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE portfolio_id = 201
UNION
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE portfolio_id = 202;

-- 6. Combine txn_id for 'Deposit' and 'Withdrawal' transactions.
SELECT txn_id
FROM wealth_management.transactions
WHERE txn_type = 'Deposit'
UNION
SELECT txn_id
FROM wealth_management.transactions
WHERE txn_type = 'Withdrawal';

-- 7. Combine goal_ids for 'Retirement Fund' and 'College Tuition'.
SELECT goal_id
FROM wealth_management.financial_goals
WHERE goal_name = 'Retirement Fund'
UNION
SELECT goal_id
FROM wealth_management.financial_goals
WHERE goal_name = 'College Tuition';

-- 8. Combine first and last names of clients into one name list.
SELECT first_name AS name
FROM wealth_management.clients
UNION
SELECT last_name AS name
FROM wealth_management.clients;

-- 9. Combine distinct years from client join_date and goal target_date.
SELECT DISTINCT YEAR(join_date) AS year_val
FROM wealth_management.clients
UNION
SELECT DISTINCT YEAR(target_date)
FROM wealth_management.financial_goals;

-- 10. Combine account_type and asset_type into a common list.
SELECT account_type AS type_name
FROM wealth_management.accounts
UNION
SELECT asset_type
FROM wealth_management.assets;
```

## Intersect
```sql
-- 1. Clients who have both 'Checking' and 'Savings' accounts.
SELECT client_id
FROM wealth_management.accounts
WHERE account_type = 'Checking'
INTERSECT
SELECT client_id
FROM wealth_management.accounts
WHERE account_type = 'Savings';

-- 2. asset_ids present in both portfolios 201 and 202.
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE portfolio_id = 201
INTERSECT
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE portfolio_id = 202;

-- 3. account_ids with both 'Buy' and 'Sell' transactions.
SELECT account_id
FROM wealth_management.transactions
WHERE txn_type = 'Buy'
INTERSECT
SELECT account_id
FROM wealth_management.transactions
WHERE txn_type = 'Sell';

-- 4. Clients with both 'Retirement Fund' and 'College Savings' goals.
SELECT client_id
FROM wealth_management.financial_goals
WHERE goal_name = 'Retirement Fund'
INTERSECT
SELECT client_id
FROM wealth_management.financial_goals
WHERE goal_name = 'College Savings';

-- 5. Stocks that are also held in any portfolio.
SELECT symbol
FROM wealth_management.assets
WHERE asset_type = 'Stock'
INTERSECT
SELECT a.symbol
FROM wealth_management.assets a
JOIN wealth_management.portfolio_assets pa ON a.asset_id = pa.asset_id;

-- 6. Clients who have a 'Checking' account and also hold a portfolio.
SELECT client_id
FROM wealth_management.accounts
WHERE account_type = 'Checking'
INTERSECT
SELECT client_id
FROM wealth_management.portfolios;

-- 7. Clients with financial goals and with transactions.
SELECT client_id
FROM wealth_management.financial_goals
INTERSECT
SELECT c.client_id
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id = a.client_id
JOIN wealth_management.transactions t ON a.account_id = t.account_id;

-- 8. asset_ids with quantity > 100 that also have asset_id > 310.
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE quantity > 100
INTERSECT
SELECT asset_id
FROM wealth_management.assets
WHERE asset_id > 310;

-- 9. Portfolios created in 2022 that also have assets with quantity > 100.
SELECT portfolio_id
FROM wealth_management.portfolios
WHERE YEAR(created_date) = 2022
INTERSECT
SELECT portfolio_id
FROM wealth_management.portfolio_assets
WHERE quantity > 100;

-- 10. Accounts opened before '2022-01-01' with at least one deposit.
SELECT account_id
FROM wealth_management.accounts
WHERE opened_date < '2022-01-01'
INTERSECT
SELECT account_id
FROM wealth_management.transactions
WHERE amount > 0;
```

## Except
```sql
-- 1. Clients who have accounts but no portfolios.
SELECT client_id
FROM wealth_management.accounts
EXCEPT
SELECT client_id
FROM wealth_management.portfolios;

-- 2. asset_ids defined in assets but not held in any portfolio.
SELECT asset_id
FROM wealth_management.assets
EXCEPT
SELECT asset_id
FROM wealth_management.portfolio_assets;

-- 3. account_ids with transactions except those still 'Active'.
SELECT account_id
FROM wealth_management.transactions
EXCEPT
SELECT account_id
FROM wealth_management.accounts
WHERE status = 'Active';

-- 4. Clients with goals but no accounts.
SELECT client_id
FROM wealth_management.financial_goals
EXCEPT
SELECT client_id
FROM wealth_management.accounts;

-- 5. Portfolios without any assets.
SELECT portfolio_id
FROM wealth_management.portfolios
EXCEPT
SELECT portfolio_id
FROM wealth_management.portfolio_assets;

-- 6. Clients who joined before '2021-01-01' but have no goals.
SELECT client_id
FROM wealth_management.clients
WHERE join_date < '2021-01-01'
EXCEPT
SELECT client_id
FROM wealth_management.financial_goals;

-- 7. Accounts opened after '2022-01-01' with no transactions.
SELECT account_id
FROM wealth_management.accounts
WHERE opened_date > '2022-01-01'
EXCEPT
SELECT account_id
FROM wealth_management.transactions;

-- 8. Transactions excluding all 'Deposit' entries.
SELECT txn_id
FROM wealth_management.transactions
EXCEPT
SELECT txn_id
FROM wealth_management.transactions
WHERE txn_type = 'Deposit';

-- 9. asset_ids with acquisition_price < 200 EXCEPT those with quantity > 50.
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE acquisition_price < 200
EXCEPT
SELECT asset_id
FROM wealth_management.portfolio_assets
WHERE quantity > 50;

-- 10. Clients without any transaction history.
SELECT client_id
FROM wealth_management.clients
EXCEPT
SELECT c.client_id
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id = a.client_id
JOIN wealth_management.transactions t ON a.account_id = t.account_id;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
