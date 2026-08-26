![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. List clients with their accounts.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS full_name, a.account_id, a.account_type
FROM wealth_management.clients c
INNER JOIN wealth_management.accounts a ON c.client_id = a.client_id;
-- 2. List portfolios with owner names.
SELECT p.portfolio_id, p.name AS portfolio_name, c.first_name + ' ' + c.last_name AS client_name
FROM wealth_management.portfolios p
INNER JOIN wealth_management.clients c ON p.client_id = c.client_id;
-- 3. List transactions with client info.
SELECT t.txn_id, t.txn_date, t.amount, c.client_id, c.first_name + ' ' + c.last_name AS client_name
FROM wealth_management.transactions t
INNER JOIN wealth_management.accounts a ON t.account_id = a.account_id
INNER JOIN wealth_management.clients c ON a.client_id = c.client_id;
-- 4. List assets in portfolios.
SELECT a.asset_id, a.symbol, pa.portfolio_id
FROM wealth_management.assets a
INNER JOIN wealth_management.portfolio_assets pa ON a.asset_id = pa.asset_id;
-- 5. List goals with client email.
SELECT f.goal_name, f.target_date, c.email
FROM wealth_management.financial_goals f
INNER JOIN wealth_management.clients c ON f.client_id = c.client_id;
-- 6. List portfolio assets with asset and portfolio names.
SELECT pa.portfolio_id, p.name AS portfolio_name, pa.asset_id, a.symbol, pa.quantity
FROM wealth_management.portfolio_assets pa
INNER JOIN wealth_management.portfolios p ON pa.portfolio_id = p.portfolio_id
INNER JOIN wealth_management.assets a ON pa.asset_id = a.asset_id;
-- 7. Accounts and their transaction counts.
SELECT a.account_id, COUNT(t.txn_id) AS txn_count
FROM wealth_management.accounts a
INNER JOIN wealth_management.transactions t ON a.account_id = t.account_id
GROUP BY a.account_id;
-- 8. Clients and their goal progress.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, f.goal_name, f.current_amount, f.target_amount
FROM wealth_management.clients c
INNER JOIN wealth_management.financial_goals f ON c.client_id = f.client_id;
-- 9. Accounts linked to portfolios via client.
SELECT a.account_id, p.portfolio_id
FROM wealth_management.accounts a
INNER JOIN wealth_management.portfolios p ON a.client_id = p.client_id;
-- 10. Clients who made withdrawals.
SELECT DISTINCT c.client_id, c.first_name + ' ' + c.last_name AS full_name, t.txn_id, t.amount
FROM wealth_management.clients c
INNER JOIN wealth_management.accounts a ON c.client_id = a.client_id
INNER JOIN wealth_management.transactions t ON a.account_id = t.account_id
WHERE t.amount < 0;
```

## Left Join (Left Outer Join)
```sql
-- 1. All clients and any accounts.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS full_name, a.account_id, a.account_type
FROM wealth_management.clients c
LEFT JOIN wealth_management.accounts a ON c.client_id = a.client_id;
-- 2. Portfolios and asset counts (NULLs allowed).
SELECT p.portfolio_id, p.name AS portfolio_name, COUNT(pa.asset_id) AS asset_count
FROM wealth_management.portfolios p
LEFT JOIN wealth_management.portfolio_assets pa ON p.portfolio_id = pa.portfolio_id
GROUP BY p.portfolio_id, p.name;
-- 3. Accounts and transaction counts (zero if none).
SELECT a.account_id, COUNT(t.txn_id) AS txn_count
FROM wealth_management.accounts a
LEFT JOIN wealth_management.transactions t ON a.account_id = t.account_id
GROUP BY a.account_id;
-- 4. Clients and goal counts.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, COUNT(f.goal_id) AS goal_count
FROM wealth_management.clients c
LEFT JOIN wealth_management.financial_goals f ON c.client_id = f.client_id
GROUP BY c.client_id, c.first_name, c.last_name;
-- 5. Assets and portfolio membership count.
SELECT a.asset_id, a.symbol, COUNT(pa.portfolio_id) AS portfolio_count
FROM wealth_management.assets a
LEFT JOIN wealth_management.portfolio_assets pa ON a.asset_id = pa.asset_id
GROUP BY a.asset_id, a.symbol;
-- 6. Clients and last transaction date.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, MAX(t.txn_date) AS last_txn
FROM wealth_management.clients c
LEFT JOIN wealth_management.accounts a ON c.client_id = a.client_id
LEFT JOIN wealth_management.transactions t ON a.account_id = t.account_id
GROUP BY c.client_id, c.first_name, c.last_name;
-- 7. Portfolios and owner emails.
SELECT p.portfolio_id, p.name, c.email
FROM wealth_management.portfolios p
LEFT JOIN wealth_management.clients c ON p.client_id = c.client_id;
-- 8. Goals and client names.
SELECT f.goal_id, f.goal_name, c.first_name + ' ' + c.last_name AS client_name
FROM wealth_management.financial_goals f
LEFT JOIN wealth_management.clients c ON f.client_id = c.client_id;
-- 9. Portfolios and total asset quantity.
SELECT p.portfolio_id, p.name, SUM(pa.quantity) AS total_qty
FROM wealth_management.portfolios p
LEFT JOIN wealth_management.portfolio_assets pa ON p.portfolio_id = pa.portfolio_id
GROUP BY p.portfolio_id, p.name;
-- 10. Accounts and max transaction amount.
SELECT a.account_id, MAX(t.amount) AS max_amount
FROM wealth_management.accounts a
LEFT JOIN wealth_management.transactions t ON a.account_id = t.account_id
GROUP BY a.account_id;
```

## Right Join (Right Outer Join)
```sql
-- 1. All accounts and any clients.
SELECT a.account_id, a.account_type, c.client_id, c.first_name + ' ' + c.last_name AS client_name
FROM wealth_management.clients c
RIGHT JOIN wealth_management.accounts a ON c.client_id = a.client_id;
-- 2. All assets and their portfolio entries.
SELECT a.asset_id, a.symbol, pa.portfolio_id, pa.quantity
FROM wealth_management.portfolio_assets pa
RIGHT JOIN wealth_management.assets a ON pa.asset_id = a.asset_id;
-- 3. All portfolios and any clients.
SELECT p.portfolio_id, p.name AS portfolio_name, c.client_id, c.first_name + ' ' + c.last_name AS client_name
FROM wealth_management.clients c
RIGHT JOIN wealth_management.portfolios p ON c.client_id = p.client_id;
-- 4. All transactions and any accounts.
SELECT t.txn_id, t.amount, a.account_id, a.account_type
FROM wealth_management.accounts a
RIGHT JOIN wealth_management.transactions t ON a.account_id = t.account_id;
-- 5. All goals and any clients.
SELECT f.goal_id, f.goal_name, c.client_id, c.first_name + ' ' + c.last_name AS client_name
FROM wealth_management.clients c
RIGHT JOIN wealth_management.financial_goals f ON c.client_id = f.client_id;
-- 6. Assets and portfolios via RIGHT JOIN (inverse of left join).
SELECT pa.portfolio_id, pa.asset_id, a.symbol
FROM wealth_management.assets a
RIGHT JOIN wealth_management.portfolio_assets pa ON a.asset_id = pa.asset_id;
-- 7. Transactions and deposits count per account.
SELECT t.txn_id, a.account_id
FROM wealth_management.accounts a
RIGHT JOIN wealth_management.transactions t ON a.account_id = t.account_id AND t.amount > 0;
-- 8. Portfolios and transaction link via accounts.
SELECT p.portfolio_id, t.txn_id
FROM wealth_management.portfolios p
RIGHT JOIN wealth_management.accounts a ON p.client_id = a.client_id
RIGHT JOIN wealth_management.transactions t ON a.account_id = t.account_id;
-- 9. Clients and held assets via portfolios.
SELECT c.client_id, pa.asset_id
FROM wealth_management.clients c
RIGHT JOIN wealth_management.portfolios p ON c.client_id = p.client_id
RIGHT JOIN wealth_management.portfolio_assets pa ON p.portfolio_id = pa.portfolio_id;
-- 10. Goals and transactions via client-account relationship.
SELECT f.goal_id, t.txn_id
FROM wealth_management.financial_goals f
RIGHT JOIN wealth_management.clients c ON f.client_id = c.client_id
RIGHT JOIN wealth_management.accounts a ON c.client_id = a.client_id
RIGHT JOIN wealth_management.transactions t ON a.account_id = t.account_id;
```

## Full Join (Full Outer Join)
```sql
-- 1. All clients and all accounts.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, a.account_id
FROM wealth_management.clients c
FULL OUTER JOIN wealth_management.accounts a ON c.client_id = a.client_id;
-- 2. All portfolios and all portfolio_assets.
SELECT p.portfolio_id, p.name AS portfolio_name, pa.asset_id, pa.quantity
FROM wealth_management.portfolios p
FULL OUTER JOIN wealth_management.portfolio_assets pa ON p.portfolio_id = pa.portfolio_id;
-- 3. All assets and all portfolio entries.
SELECT a.asset_id, a.symbol, pa.portfolio_id
FROM wealth_management.assets a
FULL OUTER JOIN wealth_management.portfolio_assets pa ON a.asset_id = pa.asset_id;
-- 4. All accounts and all transactions.
SELECT a.account_id, a.account_type, t.txn_id, t.amount
FROM wealth_management.accounts a
FULL OUTER JOIN wealth_management.transactions t ON a.account_id = t.account_id;
-- 5. All clients and all financial goals.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, f.goal_id, f.goal_name
FROM wealth_management.clients c
FULL OUTER JOIN wealth_management.financial_goals f ON c.client_id = f.client_id;
-- 6. All portfolios and all clients.
SELECT p.portfolio_id, p.name, c.client_id
FROM wealth_management.portfolios p
FULL OUTER JOIN wealth_management.clients c ON p.client_id = c.client_id;
-- 7. All accounts and all portfolios via client.
SELECT a.account_id, p.portfolio_id
FROM wealth_management.accounts a
FULL OUTER JOIN wealth_management.portfolios p ON a.client_id = p.client_id;
-- 8. All transactions and all goals via client-account.
SELECT t.txn_id, f.goal_id
FROM wealth_management.transactions t
FULL OUTER JOIN wealth_management.accounts a ON t.account_id = a.account_id
FULL OUTER JOIN wealth_management.financial_goals f ON a.client_id = f.client_id;
-- 9. All assets and all transactions via portfolio_assets→accounts.
SELECT a.asset_id, t.txn_id
FROM wealth_management.assets a
FULL OUTER JOIN wealth_management.portfolio_assets pa ON a.asset_id = pa.asset_id
FULL OUTER JOIN wealth_management.accounts a2 ON pa.portfolio_id = a2.account_id
FULL OUTER JOIN wealth_management.transactions t ON a2.account_id = t.account_id;
-- 10. All goals and all portfolio_assets via client→portfolio→assets.
SELECT f.goal_id, pa.asset_id
FROM wealth_management.financial_goals f
FULL OUTER JOIN wealth_management.clients c ON f.client_id = c.client_id
FULL OUTER JOIN wealth_management.portfolios p ON c.client_id = p.client_id
FULL OUTER JOIN wealth_management.portfolio_assets pa ON p.portfolio_id = pa.portfolio_id;
```

## Cross Join
```sql
-- 1. Pair each client with each account type.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, at.account_type
FROM wealth_management.clients c
CROSS JOIN (SELECT DISTINCT account_type FROM wealth_management.accounts) AS at;
-- 2. Pair each portfolio with each asset type.
SELECT p.portfolio_id, p.name AS portfolio_name, at.asset_type
FROM wealth_management.portfolios p
CROSS JOIN (SELECT DISTINCT asset_type FROM wealth_management.assets) AS at;
-- 3. Pair clients and goal names.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, g.goal_name
FROM wealth_management.clients c
CROSS JOIN (SELECT DISTINCT goal_name FROM wealth_management.financial_goals) AS g;
-- 4. Pair accounts and transaction types.
SELECT a.account_id, tx.txn_type
FROM wealth_management.accounts a
CROSS JOIN (SELECT DISTINCT txn_type FROM wealth_management.transactions) AS tx;
-- 5. Pair portfolios and account types.
SELECT p.portfolio_id, p.name AS portfolio_name, at.account_type
FROM wealth_management.portfolios p
CROSS JOIN (SELECT DISTINCT account_type FROM wealth_management.accounts) AS at;
-- 6. Pair assets and clients.
SELECT a.asset_id, a.symbol, c.client_id
FROM wealth_management.assets a
CROSS JOIN wealth_management.clients c;
-- 7. Pair portfolio_assets with goal statuses.
SELECT pa.portfolio_id, pa.asset_id, gs.status
FROM wealth_management.portfolio_assets pa
CROSS JOIN (SELECT DISTINCT status FROM wealth_management.financial_goals) AS gs;
-- 8. Pair clients and target amounts.
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, ga.target_amount
FROM wealth_management.clients c
CROSS JOIN (SELECT DISTINCT target_amount FROM wealth_management.financial_goals) AS ga;
-- 9. Pair transactions and portfolios.
SELECT t.txn_id, p.portfolio_id
FROM wealth_management.transactions t
CROSS JOIN wealth_management.portfolios p;
-- 10. Pair accounts and portfolios.
SELECT a.account_id, p.portfolio_id
FROM wealth_management.accounts a
CROSS JOIN wealth_management.portfolios p;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
