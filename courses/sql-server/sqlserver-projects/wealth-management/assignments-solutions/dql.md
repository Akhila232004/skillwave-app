![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. List all clients with their IDs and full names.
SELECT client_id, first_name + ' ' + last_name AS full_name
FROM wealth_management.clients;
-- 2. List all accounts with account_id, client_id, and type.
SELECT account_id, client_id, account_type
FROM wealth_management.accounts;
-- 3. List all portfolios with portfolio names and creation dates.
SELECT name, created_date
FROM wealth_management.portfolios;
-- 4. List all assets with symbol and asset_type.
SELECT symbol, asset_type
FROM wealth_management.assets;
-- 5. List portfolio assets entries with portfolio_id, asset_id, and quantity.
SELECT portfolio_id, asset_id, quantity
FROM wealth_management.portfolio_assets;
-- 6. List all transactions showing txn_id, account_id, txn_date, txn_type, and amount.
SELECT txn_id, account_id, txn_date, txn_type, amount
FROM wealth_management.transactions;
-- 7. List all financial goals with goal_name and status.
SELECT goal_name, status
FROM wealth_management.financial_goals;
-- 8. List client contact details: full name, email, phone.
SELECT first_name + ' ' + last_name AS full_name, email, phone
FROM wealth_management.clients;
-- 9. List accounts opened after 2021-01-01.
SELECT account_id, opened_date
FROM wealth_management.accounts
WHERE opened_date > '2021-01-01';
-- 10. List each client's name and number of portfolios they have.
SELECT c.first_name + ' ' + c.last_name AS client_name, COUNT(p.portfolio_id) AS portfolio_count
FROM wealth_management.clients c
LEFT JOIN wealth_management.portfolios p ON c.client_id = p.client_id
GROUP BY c.first_name, c.last_name;
```

## WHERE
```sql
-- 1. Find clients born before 1990-01-01.
SELECT * FROM wealth_management.clients
WHERE date_of_birth < '1990-01-01';
-- 2. Get active accounts.
SELECT * FROM wealth_management.accounts
WHERE status = 'Active';
-- 3. Portfolios created in 2022.
SELECT * FROM wealth_management.portfolios
WHERE YEAR(created_date) = 2022;
-- 4. Assets of type 'Stock'.
SELECT * FROM wealth_management.assets
WHERE asset_type = 'Stock';
-- 5. Portfolio assets with quantity > 100.
SELECT * FROM wealth_management.portfolio_assets
WHERE quantity > 100;
-- 6. 'Buy' transactions.
SELECT * FROM wealth_management.transactions
WHERE txn_type = 'Buy';
-- 7. Transactions with negative amount.
SELECT * FROM wealth_management.transactions
WHERE amount < 0;
-- 8. Financial goals in progress.
SELECT * FROM wealth_management.financial_goals
WHERE status = 'In Progress';
-- 9. Accounts opened between 2020-01-01 and 2021-12-31.
SELECT * FROM wealth_management.accounts
WHERE opened_date BETWEEN '2020-01-01' AND '2021-12-31';
-- 10. Clients with emails ending in 'example.com'.
SELECT * FROM wealth_management.clients
WHERE email LIKE '%@example.com';
```

## GROUP BY
```sql
-- 1. Count clients by join year.
SELECT YEAR(join_date) AS join_year, COUNT(*) AS client_count
FROM wealth_management.clients
GROUP BY YEAR(join_date);
-- 2. Number of accounts per client.
SELECT client_id, COUNT(*) AS account_count
FROM wealth_management.accounts
GROUP BY client_id;
-- 3. Number of portfolios per client.
SELECT client_id, COUNT(*) AS portfolio_count
FROM wealth_management.portfolios
GROUP BY client_id;
-- 4. Number of portfolio_assets per asset.
SELECT asset_id, COUNT(*) AS portfolio_count
FROM wealth_management.portfolio_assets
GROUP BY asset_id;
-- 5. Total asset quantity across all portfolios.
SELECT asset_id, SUM(quantity) AS total_quantity
FROM wealth_management.portfolio_assets
GROUP BY asset_id;
-- 6. Total transaction amount per account.
SELECT account_id, SUM(amount) AS total_amount
FROM wealth_management.transactions
GROUP BY account_id;
-- 7. Total amount per transaction type.
SELECT txn_type, SUM(amount) AS total_amount
FROM wealth_management.transactions
GROUP BY txn_type;
-- 8. Number of goals per status.
SELECT status, COUNT(*) AS goal_count
FROM wealth_management.financial_goals
GROUP BY status;
-- 9. Number of accounts per account_type.
SELECT account_type, COUNT(*) AS count
FROM wealth_management.accounts
GROUP BY account_type;
-- 10. Number of assets per asset_type.
SELECT asset_type, COUNT(*) AS count
FROM wealth_management.assets
GROUP BY asset_type;
```

## HAVING
```sql
-- 1. Clients with more than 2 accounts.
SELECT client_id, COUNT(account_id) AS num_accounts
FROM wealth_management.accounts
GROUP BY client_id
HAVING COUNT(account_id) > 2;
-- 2. Accounts with total deposits > 10000.
SELECT account_id, SUM(amount) AS total_amount
FROM wealth_management.transactions
WHERE amount > 0
GROUP BY account_id
HAVING SUM(amount) > 10000;
-- 3. Assets appearing in more than 3 portfolios.
SELECT asset_id, COUNT(portfolio_id) AS portfolio_count
FROM wealth_management.portfolio_assets
GROUP BY asset_id
HAVING COUNT(portfolio_id) > 3;
-- 4. Transaction types with average amount > 1000.
SELECT txn_type, AVG(amount) AS avg_amount
FROM wealth_management.transactions
GROUP BY txn_type
HAVING AVG(amount) > 1000;
-- 5. Clients with at least 2 portfolios.
SELECT client_id, COUNT(portfolio_id) AS num_portfolios
FROM wealth_management.portfolios
GROUP BY client_id
HAVING COUNT(portfolio_id) >= 2;
-- 6. Accounts where deposits exceed withdrawals.
SELECT account_id
FROM wealth_management.transactions
GROUP BY account_id
HAVING SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END)
     > SUM(CASE WHEN amount < 0 THEN -amount ELSE 0 END);
-- 7. Statuses with more than one goal.
SELECT status, COUNT(goal_id) AS num_goals
FROM wealth_management.financial_goals
GROUP BY status
HAVING COUNT(goal_id) > 1;
-- 8. Accounts with 2 or more transactions before 2021.
SELECT account_id, COUNT(txn_id) AS txn_count
FROM wealth_management.transactions
WHERE txn_date < '2021-01-01'
GROUP BY account_id
HAVING COUNT(txn_id) >= 2;
-- 9. Clients with average transaction amount > 500.
SELECT c.client_id, AVG(t.amount) AS avg_txn
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id = a.client_id
JOIN wealth_management.transactions t ON a.account_id = t.account_id
GROUP BY c.client_id
HAVING AVG(t.amount) > 500;
-- 10. Assets with total quantity < 50.
SELECT asset_id, SUM(quantity) AS total_qty
FROM wealth_management.portfolio_assets
GROUP BY asset_id
HAVING SUM(quantity) < 50;
```

## ORDER BY
```sql
-- 1. Clients by last_name ascending.
SELECT * FROM wealth_management.clients
ORDER BY last_name ASC;
-- 2. Clients by join_date descending.
SELECT * FROM wealth_management.clients
ORDER BY join_date DESC;
-- 3. Accounts by opened_date ascending.
SELECT * FROM wealth_management.accounts
ORDER BY opened_date ASC;
-- 4. Portfolios by created_date descending.
SELECT * FROM wealth_management.portfolios
ORDER BY created_date DESC;
-- 5. Assets by name ascending.
SELECT * FROM wealth_management.assets
ORDER BY name ASC;
-- 6. Portfolio_assets by acquisition_date descending.
SELECT * FROM wealth_management.portfolio_assets
ORDER BY acquisition_date DESC;
-- 7. Transactions by txn_date descending.
SELECT * FROM wealth_management.transactions
ORDER BY txn_date DESC;
-- 8. Financial goals by target_date ascending.
SELECT * FROM wealth_management.financial_goals
ORDER BY target_date ASC;
-- 9. Transactions by amount descending.
SELECT * FROM wealth_management.transactions
ORDER BY amount DESC;
-- 10. Assets by symbol descending.
SELECT * FROM wealth_management.assets
ORDER BY symbol DESC;
```

## TOP
```sql
-- 1. Top 5 clients by earliest join date.
SELECT TOP 5 client_id, join_date
FROM wealth_management.clients
ORDER BY join_date ASC;
-- 2. Top 5 clients with most accounts.
SELECT TOP 5 c.client_id, COUNT(a.account_id) AS account_count
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id = a.client_id
GROUP BY c.client_id
ORDER BY COUNT(a.account_id) DESC;
-- 3. Top 5 accounts by number of transactions.
SELECT TOP 5 account_id, COUNT(txn_id) AS txn_count
FROM wealth_management.transactions
GROUP BY account_id
ORDER BY COUNT(txn_id) DESC;
-- 4. Top 3 portfolios by number of assets.
SELECT TOP 3 portfolio_id, COUNT(asset_id) AS asset_count
FROM wealth_management.portfolio_assets
GROUP BY portfolio_id
ORDER BY COUNT(asset_id) DESC;
-- 5. Top 5 assets by total quantity.
SELECT TOP 5 asset_id, SUM(quantity) AS total_quantity
FROM wealth_management.portfolio_assets
GROUP BY asset_id
ORDER BY SUM(quantity) DESC;
-- 6. Top 5 accounts by total transaction amount.
SELECT TOP 5 account_id, SUM(amount) AS total_amount
FROM wealth_management.transactions
GROUP BY account_id
ORDER BY SUM(amount) DESC;
-- 7. Top 5 financial goals by target amount.
SELECT TOP 5 goal_id, target_amount
FROM wealth_management.financial_goals
ORDER BY target_amount DESC;
-- 8. Top 5 clients by total current goal amount.
SELECT TOP 5 c.client_id, SUM(f.current_amount) AS total_current
FROM wealth_management.clients c
JOIN wealth_management.financial_goals f ON c.client_id = f.client_id
GROUP BY c.client_id
ORDER BY SUM(f.current_amount) DESC;
-- 9. Top 3 highest individual transactions.
SELECT TOP 3 *
FROM wealth_management.transactions
ORDER BY amount DESC;
-- 10. Top 5 assets alphabetically.
SELECT TOP 5 *
FROM wealth_management.assets
ORDER BY name ASC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
