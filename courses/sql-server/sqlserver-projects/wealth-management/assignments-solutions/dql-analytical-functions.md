![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Running total of transaction amounts per account.
SELECT txn_id, account_id, txn_date, amount,
       SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_date
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM wealth_management.transactions;
-- 2. Total portfolios per client.
SELECT client_id, portfolio_id,
       COUNT(portfolio_id) OVER (PARTITION BY client_id) AS total_portfolios
FROM wealth_management.portfolios;
-- 3. Total assets quantity per portfolio.
SELECT portfolio_id, asset_id, quantity,
       SUM(quantity) OVER (PARTITION BY portfolio_id) AS total_qty
FROM wealth_management.portfolio_assets;
-- 4. Cumulative goal progress per client by target_date.
SELECT goal_id, client_id, current_amount, target_date,
       SUM(current_amount) OVER (PARTITION BY client_id ORDER BY target_date
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_progress
FROM wealth_management.financial_goals;
-- 5. Average transaction amount per account.
SELECT txn_id, account_id, amount,
       AVG(amount) OVER (PARTITION BY account_id) AS avg_amount
FROM wealth_management.transactions;
-- 6. Maximum single transaction per account.
SELECT txn_id, account_id, amount,
       MAX(amount) OVER (PARTITION BY account_id) AS max_amount
FROM wealth_management.transactions;
-- 7. Minimum single transaction per account.
SELECT txn_id, account_id, amount,
       MIN(amount) OVER (PARTITION BY account_id) AS min_amount
FROM wealth_management.transactions;
-- 8. Average acquisition_price per asset across all portfolios.
SELECT portfolio_id, asset_id, acquisition_price,
       AVG(acquisition_price) OVER (PARTITION BY asset_id) AS avg_price
FROM wealth_management.portfolio_assets;
-- 9. Moving sum of last 5 transactions globally (by date).
SELECT txn_id, txn_date, amount,
       SUM(amount) OVER (ORDER BY txn_date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS moving_sum_5
FROM wealth_management.transactions;
-- 10. Count of goals per status.
SELECT goal_id, status,
       COUNT(goal_id) OVER (PARTITION BY status) AS goals_by_status
FROM wealth_management.financial_goals;
```

## ROW_NUMBER()
```sql
-- 1. Sequential number of transactions per account by date.
SELECT txn_id, account_id, txn_date,
       ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY txn_date) AS rn
FROM wealth_management.transactions;
-- 2. Order portfolios per client by creation date.
SELECT client_id, portfolio_id, created_date,
       ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY created_date) AS rn
FROM wealth_management.portfolios;
-- 3. Number assets per portfolio by acquisition_date.
SELECT portfolio_id, asset_id, acquisition_date,
       ROW_NUMBER() OVER (PARTITION BY portfolio_id ORDER BY acquisition_date) AS rn
FROM wealth_management.portfolio_assets;
-- 4. Rank client goals by target_date.
SELECT client_id, goal_id, target_date,
       ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY target_date) AS rn
FROM wealth_management.financial_goals;
-- 5. Number accounts per client by opened_date.
SELECT client_id, account_id, opened_date,
       ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY opened_date) AS rn
FROM wealth_management.accounts;
-- 6. Order clients by join_date.
SELECT client_id, first_name, last_name,
       ROW_NUMBER() OVER (ORDER BY join_date) AS rn
FROM wealth_management.clients;
-- 7. Number assets by symbol alphabetically.
SELECT asset_id, symbol,
       ROW_NUMBER() OVER (ORDER BY symbol) AS rn
FROM wealth_management.assets;
-- 8. Order transactions per client across accounts.
SELECT c.client_id, t.txn_id, t.txn_date,
       ROW_NUMBER() OVER (PARTITION BY c.client_id ORDER BY t.txn_date) AS rn
FROM wealth_management.clients c
JOIN wealth_management.accounts a ON c.client_id=a.client_id
JOIN wealth_management.transactions t ON a.account_id=t.account_id;
-- 9. Number portfolio_assets by price descending.
SELECT portfolio_id, asset_id, acquisition_price,
       ROW_NUMBER() OVER (PARTITION BY portfolio_id ORDER BY acquisition_price DESC) AS rn
FROM wealth_management.portfolio_assets;
-- 10. Order goals per client by current_amount desc.
SELECT client_id, goal_id, current_amount,
       ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY current_amount DESC) AS rn
FROM wealth_management.financial_goals;
```

## RANK()
```sql
-- 1. Rank accounts per client by total transaction amount desc.
SELECT account_id, client_id,
       SUM(amount) OVER (PARTITION BY account_id) AS total_amount,
       RANK() OVER (PARTITION BY client_id ORDER BY SUM(amount) OVER (PARTITION BY account_id) DESC) AS r
FROM wealth_management.transactions;
-- 2. Rank portfolios per client by total asset quantity.
SELECT portfolio_id, client_id,
       SUM(quantity) OVER (PARTITION BY portfolio_id) AS total_qty,
       RANK() OVER (PARTITION BY client_id ORDER BY SUM(quantity) OVER (PARTITION BY portfolio_id) DESC) AS r
FROM wealth_management.portfolio_assets;
-- 3. Rank clients by total current goal amount.
SELECT client_id,
       SUM(current_amount) OVER (PARTITION BY client_id) AS tot_current,
       RANK() OVER (ORDER BY SUM(current_amount) OVER (PARTITION BY client_id) DESC) AS r
FROM wealth_management.financial_goals;
-- 4. Rank assets by number of portfolios held.
SELECT asset_id,
       COUNT(portfolio_id) OVER (PARTITION BY asset_id) AS port_count,
       RANK() OVER (ORDER BY COUNT(portfolio_id) OVER (PARTITION BY asset_id) DESC) AS r
FROM wealth_management.portfolio_assets;
-- 5. Rank goals per client by progress percentage.
SELECT client_id, goal_id,
       current_amount*1.0/target_amount AS pct,
       RANK() OVER (PARTITION BY client_id ORDER BY current_amount*1.0/target_amount DESC) AS r
FROM wealth_management.financial_goals;
-- 6. Rank transactions by amount desc globally.
SELECT txn_id, amount,
       RANK() OVER (ORDER BY amount DESC) AS r
FROM wealth_management.transactions;
-- 7. Rank accounts by number of transactions.
SELECT account_id,
       COUNT(txn_id) OVER (PARTITION BY account_id) AS txn_count,
       RANK() OVER (ORDER BY COUNT(txn_id) OVER (PARTITION BY account_id) DESC) AS r
FROM wealth_management.transactions;
-- 8. Rank clients by number of accounts.
SELECT client_id,
       COUNT(account_id) OVER (PARTITION BY client_id) AS acc_count,
       RANK() OVER (ORDER BY COUNT(account_id) OVER (PARTITION BY client_id) DESC) AS r
FROM wealth_management.accounts;
-- 9. Rank portfolios by creation date (older = better).
SELECT portfolio_id, created_date,
       RANK() OVER (ORDER BY created_date) AS r
FROM wealth_management.portfolios;
-- 10. Rank assets by symbol.
SELECT asset_id, symbol,
       RANK() OVER (ORDER BY symbol) AS r
FROM wealth_management.assets;
```

## DENSE_RANK()
```sql
-- 1. Rank accounts per client by total transaction amount desc.
SELECT account_id, client_id,
       SUM(amount) OVER (PARTITION BY account_id) AS total_amount,
       DENSE_RANK() OVER (PARTITION BY client_id ORDER BY SUM(amount) OVER (PARTITION BY account_id) DESC) AS r
FROM wealth_management.transactions;
-- 2. Rank portfolios per client by total asset quantity.
SELECT portfolio_id, client_id,
       SUM(quantity) OVER (PARTITION BY portfolio_id) AS total_qty,
       DENSE_RANK() OVER (PARTITION BY client_id ORDER BY SUM(quantity) OVER (PARTITION BY portfolio_id) DESC) AS r
FROM wealth_management.portfolio_assets;
-- 3. Rank clients by total current goal amount.
SELECT client_id,
       SUM(current_amount) OVER (PARTITION BY client_id) AS tot_current,
       DENSE_RANK() OVER (ORDER BY SUM(current_amount) OVER (PARTITION BY client_id) DESC) AS r
FROM wealth_management.financial_goals;
-- 4. Rank assets by number of portfolios held.
SELECT asset_id,
       COUNT(portfolio_id) OVER (PARTITION BY asset_id) AS port_count,
       DENSE_RANK() OVER (ORDER BY COUNT(portfolio_id) OVER (PARTITION BY asset_id) DESC) AS r
FROM wealth_management.portfolio_assets;
-- 5. Rank goals per client by progress percentage.
SELECT client_id, goal_id,
       current_amount*1.0/target_amount AS pct,
       DENSE_RANK() OVER (PARTITION BY client_id ORDER BY current_amount*1.0/target_amount DESC) AS r
FROM wealth_management.financial_goals;
-- 6. Rank transactions by amount desc globally.
SELECT txn_id, amount,
       DENSE_RANK() OVER (ORDER BY amount DESC) AS r
FROM wealth_management.transactions;
-- 7. Rank accounts by number of transactions.
SELECT account_id,
       COUNT(txn_id) OVER (PARTITION BY account_id) AS txn_count,
       DENSE_RANK() OVER (ORDER BY COUNT(txn_id) OVER (PARTITION BY account_id) DESC) AS r
FROM wealth_management.transactions;
-- 8. Rank clients by number of accounts.
SELECT client_id,
       COUNT(account_id) OVER (PARTITION BY client_id) AS acc_count,
       DENSE_RANK() OVER (ORDER BY COUNT(account_id) OVER (PARTITION BY client_id) DESC) AS r
FROM wealth_management.accounts;
-- 9. Rank portfolios by creation date (older = better).
SELECT portfolio_id, created_date,
       DENSE_RANK() OVER (ORDER BY created_date) AS r
FROM wealth_management.portfolios;
-- 10. Rank assets by symbol.
SELECT asset_id, symbol,
       DENSE_RANK() OVER (ORDER BY symbol) AS r
FROM wealth_management.assets;
```

## NTILE(n)
```sql
-- 1. Divide clients into 4 quartiles by total_current_amount.
SELECT client_id,
       SUM(current_amount) OVER (PARTITION BY client_id) AS tot_current,
       NTILE(4) OVER (ORDER BY SUM(current_amount) OVER (PARTITION BY client_id)) AS quartile
FROM wealth_management.financial_goals;
-- 2. Quartile of accounts by total transaction amount.
SELECT account_id,
       SUM(amount) OVER (PARTITION BY account_id) AS tot_amt,
       NTILE(4) OVER (ORDER BY SUM(amount) OVER (PARTITION BY account_id)) AS q
FROM wealth_management.transactions;
-- 3. Quartile of portfolios by total asset quantity.
SELECT portfolio_id,
       SUM(quantity) OVER (PARTITION BY portfolio_id) AS tot_qty,
       NTILE(4) OVER (ORDER BY SUM(quantity) OVER (PARTITION BY portfolio_id)) AS q
FROM wealth_management.portfolio_assets;
-- 4. Quartile of assets by number of portfolios.
SELECT asset_id,
       COUNT(portfolio_id) OVER (PARTITION BY asset_id) AS cnt,
       NTILE(4) OVER (ORDER BY COUNT(portfolio_id) OVER (PARTITION BY asset_id)) AS q
FROM wealth_management.portfolio_assets;
-- 5. Quartile of transactions by amount.
SELECT txn_id, amount,
       NTILE(4) OVER (ORDER BY amount) AS q
FROM wealth_management.transactions;
-- 6. Quartile of goals by target_amount.
SELECT goal_id, target_amount,
       NTILE(4) OVER (ORDER BY target_amount) AS q
FROM wealth_management.financial_goals;
-- 7. Quartile of portfolios by creation date.
SELECT portfolio_id, created_date,
       NTILE(4) OVER (ORDER BY created_date) AS q
FROM wealth_management.portfolios;
-- 8. Quartile of accounts by opened_date.
SELECT account_id, opened_date,
       NTILE(4) OVER (ORDER BY opened_date) AS q
FROM wealth_management.accounts;
-- 9. Quartile of assets by asset_id.
SELECT asset_id,
       NTILE(4) OVER (ORDER BY asset_id) AS q
FROM wealth_management.assets;
-- 10. Quartile of clients by join_date.
SELECT client_id,
       NTILE(4) OVER (ORDER BY join_date) AS q
FROM wealth_management.clients;
```

## LAG()
```sql
-- 1. Previous transaction amount per account.
SELECT txn_id, account_id, txn_date, amount,
       LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_date) AS prev_amt
FROM wealth_management.transactions;
-- 2. Previous transaction date per account.
SELECT txn_id, account_id, txn_date,
       LAG(txn_date) OVER (PARTITION BY account_id ORDER BY txn_date) AS prev_date
FROM wealth_management.transactions;
-- 3. Previous goal current_amount per client.
SELECT goal_id, client_id, current_amount, target_date,
       LAG(current_amount) OVER (PARTITION BY client_id ORDER BY target_date) AS prev_progress
FROM wealth_management.financial_goals;
-- 4. Previous acquisition_price per portfolio.
SELECT portfolio_id, asset_id, acquisition_price, acquisition_date,
       LAG(acquisition_price) OVER (PARTITION BY portfolio_id ORDER BY acquisition_date) AS prev_price
FROM wealth_management.portfolio_assets;
-- 5. Previous opened_date per client.
SELECT client_id, account_id, opened_date,
       LAG(opened_date) OVER (PARTITION BY client_id ORDER BY opened_date) AS prev_open
FROM wealth_management.accounts;
-- 6. Previous creation date per client’s portfolios.
SELECT client_id, portfolio_id, created_date,
       LAG(created_date) OVER (PARTITION BY client_id ORDER BY created_date) AS prev_created
FROM wealth_management.portfolios;
-- 7. Previous symbol per alphabetic asset list.
SELECT asset_id, symbol,
       LAG(symbol) OVER (ORDER BY symbol) AS prev_symbol
FROM wealth_management.assets;
-- 8. Previous phone value per client.
SELECT client_id, phone,
       LAG(phone) OVER (PARTITION BY client_id ORDER BY join_date) AS prev_phone
FROM wealth_management.clients;
-- 9. Previous target_amount per client.
SELECT goal_id, client_id, target_amount,
       LAG(target_amount) OVER (PARTITION BY client_id ORDER BY target_date) AS prev_target
FROM wealth_management.financial_goals;
-- 10. Previous quantity per asset across all portfolios.
SELECT portfolio_id, asset_id, quantity,
       LAG(quantity) OVER (PARTITION BY asset_id ORDER BY acquisition_date) AS prev_qty
FROM wealth_management.portfolio_assets;
```

## LEAD()
```sql
-- 1. Next transaction amount per account.
SELECT txn_id, account_id, txn_date, amount,
       LEAD(amount) OVER (PARTITION BY account_id ORDER BY txn_date) AS next_amt
FROM wealth_management.transactions;
-- 2. Next transaction date per account.
SELECT txn_id, account_id, txn_date,
       LEAD(txn_date) OVER (PARTITION BY account_id ORDER BY txn_date) AS next_date
FROM wealth_management.transactions;
-- 3. Next goal target_date per client.
SELECT goal_id, client_id, target_date,
       LEAD(target_date) OVER (PARTITION BY client_id ORDER BY target_date) AS next_target
FROM wealth_management.financial_goals;
-- 4. Next acquisition_price per portfolio.
SELECT portfolio_id, asset_id, acquisition_price, acquisition_date,
       LEAD(acquisition_price) OVER (PARTITION BY portfolio_id ORDER BY acquisition_date) AS next_price
FROM wealth_management.portfolio_assets;
-- 5. Next account opened_date per client.
SELECT client_id, account_id, opened_date,
       LEAD(opened_date) OVER (PARTITION BY client_id ORDER BY opened_date) AS next_open
FROM wealth_management.accounts;
-- 6. Next portfolio creation date per client.
SELECT client_id, portfolio_id, created_date,
       LEAD(created_date) OVER (PARTITION BY client_id ORDER BY created_date) AS next_created
FROM wealth_management.portfolios;
-- 7. Next symbol per alphabetic asset list.
SELECT asset_id, symbol,
       LEAD(symbol) OVER (ORDER BY symbol) AS next_symbol
FROM wealth_management.assets;
-- 8. Next phone per client by join_date.
SELECT client_id, phone,
       LEAD(phone) OVER (PARTITION BY client_id ORDER BY join_date) AS next_phone
FROM wealth_management.clients;
-- 9. Next current_amount per client.
SELECT goal_id, client_id, current_amount,
       LEAD(current_amount) OVER (PARTITION BY client_id ORDER BY target_date) AS next_progress
FROM wealth_management.financial_goals;
-- 10. Next quantity per asset.
SELECT portfolio_id, asset_id, quantity,
       LEAD(quantity) OVER (PARTITION BY asset_id ORDER BY acquisition_date) AS next_qty
FROM wealth_management.portfolio_assets;
```

## FIRST_VALUE()
```sql
-- 1. First transaction amount per account.
SELECT txn_id, account_id, amount,
       FIRST_VALUE(amount) OVER (PARTITION BY account_id ORDER BY txn_date
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_amt
FROM wealth_management.transactions;
-- 2. First opened_date per client.
SELECT client_id, account_id, opened_date,
       FIRST_VALUE(opened_date) OVER (PARTITION BY client_id ORDER BY opened_date
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_open
FROM wealth_management.accounts;
-- 3. First goal target_date per client.
SELECT client_id, goal_id, target_date,
       FIRST_VALUE(target_date) OVER (PARTITION BY client_id ORDER BY target_date
                                      ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_target
FROM wealth_management.financial_goals;
-- 4. First portfolio creation date per client.
SELECT client_id, portfolio_id, created_date,
       FIRST_VALUE(created_date) OVER (PARTITION BY client_id ORDER BY created_date
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_created
FROM wealth_management.portfolios;
-- 5. First acquisition_date per portfolio.
SELECT portfolio_id, asset_id, acquisition_date,
       FIRST_VALUE(acquisition_date) OVER (PARTITION BY portfolio_id ORDER BY acquisition_date
                                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_acq
FROM wealth_management.portfolio_assets;
-- 6. First client join_date.
SELECT client_id, join_date,
       FIRST_VALUE(join_date) OVER (ORDER BY join_date
                                    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS earliest_join
FROM wealth_management.clients;
-- 7. First asset symbol alphabetically.
SELECT asset_id, symbol,
       FIRST_VALUE(symbol) OVER (ORDER BY symbol
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_sym
FROM wealth_management.assets;
-- 8. First current_amount per client.
SELECT client_id, current_amount, target_date,
       FIRST_VALUE(current_amount) OVER (PARTITION BY client_id ORDER BY target_date
                                         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_prog
FROM wealth_management.financial_goals;
-- 9. First transaction date globally.
SELECT txn_id, txn_date,
       FIRST_VALUE(txn_date) OVER (ORDER BY txn_date
                                   ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_txn
FROM wealth_management.transactions;
-- 10. First quantity per asset across portfolios.
SELECT portfolio_id, asset_id, quantity,
       FIRST_VALUE(quantity) OVER (PARTITION BY asset_id ORDER BY acquisition_date
                                   ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS first_qty
FROM wealth_management.portfolio_assets;
```

## LAST_VALUE()
```sql
-- 1. Last transaction amount per account.
SELECT txn_id, account_id, amount,
       LAST_VALUE(amount) OVER (PARTITION BY account_id ORDER BY txn_date
                                ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_amt
FROM wealth_management.transactions;
-- 2. Last opened_date per client.
SELECT client_id, account_id, opened_date,
       LAST_VALUE(opened_date) OVER (PARTITION BY client_id ORDER BY opened_date
                                     ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_open
FROM wealth_management.accounts;
-- 3. Last goal target_date per client.
SELECT client_id, goal_id, target_date,
       LAST_VALUE(target_date) OVER (PARTITION BY client_id ORDER BY target_date
                                     ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_target
FROM wealth_management.financial_goals;
-- 4. Last portfolio creation date per client.
SELECT client_id, portfolio_id, created_date,
       LAST_VALUE(created_date) OVER (PARTITION BY client_id ORDER BY created_date
                                      ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_created
FROM wealth_management.portfolios;
-- 5. Last acquisition_date per portfolio.
SELECT portfolio_id, asset_id, acquisition_date,
       LAST_VALUE(acquisition_date) OVER (PARTITION BY portfolio_id ORDER BY acquisition_date
                                          ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_acq
FROM wealth_management.portfolio_assets;
-- 6. Latest client join_date.
SELECT client_id, join_date,
       LAST_VALUE(join_date) OVER (ORDER BY join_date
                                   ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS latest_join
FROM wealth_management.clients;
-- 7. Last asset symbol alphabetically.
SELECT asset_id, symbol,
       LAST_VALUE(symbol) OVER (ORDER BY symbol
                                ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_sym
FROM wealth_management.assets;
-- 8. Last current_amount per client.
SELECT client_id, current_amount, target_date,
       LAST_VALUE(current_amount) OVER (PARTITION BY client_id ORDER BY target_date
                                        ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_prog
FROM wealth_management.financial_goals;
-- 9. Last transaction date globally.
SELECT txn_id, txn_date,
       LAST_VALUE(txn_date) OVER (ORDER BY txn_date
                                  ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_txn
FROM wealth_management.transactions;
-- 10. Last quantity per asset across portfolios.
SELECT portfolio_id, asset_id, quantity,
       LAST_VALUE(quantity) OVER (PARTITION BY asset_id ORDER BY acquisition_date
                                  ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS last_qty
FROM wealth_management.portfolio_assets;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
