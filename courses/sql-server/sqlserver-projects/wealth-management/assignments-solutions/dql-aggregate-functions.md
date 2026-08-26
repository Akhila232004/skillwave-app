![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Total number of clients.
SELECT COUNT(*) AS total_clients FROM wealth_management.clients;
-- 2. Total number of accounts.
SELECT COUNT(*) AS total_accounts FROM wealth_management.accounts;
-- 3. Total number of portfolios.
SELECT COUNT(*) AS total_portfolios FROM wealth_management.portfolios;
-- 4. Total number of assets.
SELECT COUNT(*) AS total_assets FROM wealth_management.assets;
-- 5. Total number of transactions.
SELECT COUNT(*) AS total_transactions FROM wealth_management.transactions;
-- 6. Total number of financial goals.
SELECT COUNT(*) AS total_goals FROM wealth_management.financial_goals;
-- 7. Number of accounts per client.
SELECT client_id, COUNT(*) AS accounts_count
FROM wealth_management.accounts
GROUP BY client_id;
-- 8. Number of portfolios per client.
SELECT client_id, COUNT(*) AS portfolios_count
FROM wealth_management.portfolios
GROUP BY client_id;
-- 9. Number of assets per portfolio.
SELECT portfolio_id, COUNT(*) AS assets_count
FROM wealth_management.portfolio_assets
GROUP BY portfolio_id;
-- 10. Number of transactions by type.
SELECT txn_type, COUNT(*) AS count_by_type
FROM wealth_management.transactions
GROUP BY txn_type;
```

## Sum
```sql
-- 1. Sum of all transaction amounts.
SELECT SUM(amount) AS sum_all_transactions FROM wealth_management.transactions;
-- 2. Sum of all deposits.
SELECT SUM(amount) AS sum_deposits
FROM wealth_management.transactions
WHERE amount > 0;
-- 3. Sum of all withdrawals.
SELECT SUM(amount) AS sum_withdrawals
FROM wealth_management.transactions
WHERE amount < 0;
-- 4. Sum of current amounts across all goals.
SELECT SUM(current_amount) AS sum_current_goals FROM wealth_management.financial_goals;
-- 5. Sum of target amounts across all goals.
SELECT SUM(target_amount) AS sum_target_goals FROM wealth_management.financial_goals;
-- 6. Sum of quantities held in all portfolios.
SELECT SUM(quantity) AS sum_portfolio_quantity FROM wealth_management.portfolio_assets;
-- 7. Sum of acquisition prices across all portfolio assets.
SELECT SUM(acquisition_price) AS sum_acquisition_prices FROM wealth_management.portfolio_assets;
-- 8. Sum of current_amount per client.
SELECT client_id, SUM(current_amount) AS sum_client_current
FROM wealth_management.financial_goals
GROUP BY client_id;
-- 9. Sum of amount per account.
SELECT account_id, SUM(amount) AS sum_account_amount
FROM wealth_management.transactions
GROUP BY account_id;
-- 10. Sum of quantity per asset.
SELECT asset_id, SUM(quantity) AS sum_asset_quantity
FROM wealth_management.portfolio_assets
GROUP BY asset_id;
```

## Avg
```sql
-- 1. Average transaction amount.
SELECT AVG(amount) AS avg_transaction_amount FROM wealth_management.transactions;
-- 2. Average deposit amount.
SELECT AVG(amount) AS avg_deposit
FROM wealth_management.transactions
WHERE amount > 0;
-- 3. Average withdrawal amount.
SELECT AVG(amount) AS avg_withdrawal
FROM wealth_management.transactions
WHERE amount < 0;
-- 4. Average current_amount of goals.
SELECT AVG(current_amount) AS avg_current_goals FROM wealth_management.financial_goals;
-- 5. Average target_amount of goals.
SELECT AVG(target_amount) AS avg_target_goals FROM wealth_management.financial_goals;
-- 6. Average quantity in portfolios.
SELECT AVG(quantity) AS avg_portfolio_quantity FROM wealth_management.portfolio_assets;
-- 7. Average acquisition_price in portfolios.
SELECT AVG(acquisition_price) AS avg_acquisition_price FROM wealth_management.portfolio_assets;
-- 8. Average number of portfolios per client.
SELECT AVG(cnt) AS avg_portfolios_per_client
FROM (
  SELECT client_id, COUNT(*) AS cnt
  FROM wealth_management.portfolios
  GROUP BY client_id
) t;
-- 9. Average number of accounts per client.
SELECT AVG(cnt) AS avg_accounts_per_client
FROM (
  SELECT client_id, COUNT(*) AS cnt
  FROM wealth_management.accounts
  GROUP BY client_id
) t;
-- 10. Average transactions per account.
SELECT AVG(cnt) AS avg_txns_per_account
FROM (
  SELECT account_id, COUNT(*) AS cnt
  FROM wealth_management.transactions
  GROUP BY account_id
) t;
```

## Max
```sql
-- 1. Maximum transaction amount.
SELECT MAX(amount) AS max_transaction FROM wealth_management.transactions;
-- 2. Maximum deposit amount.
SELECT MAX(amount) AS max_deposit
FROM wealth_management.transactions
WHERE amount > 0;
-- 3. Maximum withdrawal amount.
SELECT MIN(amount) AS max_withdrawal  /* most negative = min() */
FROM wealth_management.transactions
WHERE amount < 0;
-- 4. Maximum current_amount in goals.
SELECT MAX(current_amount) AS max_current_goal FROM wealth_management.financial_goals;
-- 5. Maximum target_amount in goals.
SELECT MAX(target_amount) AS max_target_goal FROM wealth_management.financial_goals;
-- 6. Maximum quantity in portfolio_assets.
SELECT MAX(quantity) AS max_portfolio_quantity FROM wealth_management.portfolio_assets;
-- 7. Maximum acquisition_price in portfolio_assets.
SELECT MAX(acquisition_price) AS max_acquisition_price FROM wealth_management.portfolio_assets;
-- 8. Client with most portfolios.
SELECT TOP 1 client_id, COUNT(*) AS num_portfolios
FROM wealth_management.portfolios
GROUP BY client_id
ORDER BY COUNT(*) DESC;
-- 9. Client with most accounts.
SELECT TOP 1 client_id, COUNT(*) AS num_accounts
FROM wealth_management.accounts
GROUP BY client_id
ORDER BY COUNT(*) DESC;
-- 10. Account with most transactions.
SELECT TOP 1 account_id, COUNT(*) AS num_transactions
FROM wealth_management.transactions
GROUP BY account_id
ORDER BY COUNT(*) DESC;
```

## Min
```sql
-- 1. Minimum transaction amount.
SELECT MIN(amount) AS min_transaction FROM wealth_management.transactions;
-- 2. Minimum deposit amount.
SELECT MIN(amount) AS min_deposit
FROM wealth_management.transactions
WHERE amount > 0;
-- 3. Minimum withdrawal amount.
SELECT MAX(amount) AS min_withdrawal  /* least negative = max() */
FROM wealth_management.transactions
WHERE amount < 0;
-- 4. Minimum current_amount in goals.
SELECT MIN(current_amount) AS min_current_goal FROM wealth_management.financial_goals;
-- 5. Minimum target_amount in goals.
SELECT MIN(target_amount) AS min_target_goal FROM wealth_management.financial_goals;
-- 6. Minimum quantity in portfolio_assets.
SELECT MIN(quantity) AS min_portfolio_quantity FROM wealth_management.portfolio_assets;
-- 7. Minimum acquisition_price in portfolio_assets.
SELECT MIN(acquisition_price) AS min_acquisition_price FROM wealth_management.portfolio_assets;
-- 8. Client with fewest portfolios.
SELECT TOP 1 client_id, COUNT(*) AS num_portfolios
FROM wealth_management.portfolios
GROUP BY client_id
ORDER BY COUNT(*) ASC;
-- 9. Client with fewest accounts.
SELECT TOP 1 client_id, COUNT(*) AS num_accounts
FROM wealth_management.accounts
GROUP BY client_id
ORDER BY COUNT(*) ASC;
-- 10. Account with fewest transactions.
SELECT TOP 1 account_id, COUNT(*) AS num_transactions
FROM wealth_management.transactions
GROUP BY account_id
ORDER BY COUNT(*) ASC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
