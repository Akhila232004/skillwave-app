![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. List each client with their total number of accounts.
WITH client_accounts AS (
  SELECT client_id, COUNT(*) AS account_count
  FROM wealth_management.accounts
  GROUP BY client_id
)
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, ca.account_count
FROM client_accounts ca
JOIN wealth_management.clients c ON ca.client_id = c.client_id;

-- 2. Compute sum of deposits per account using a CTE.
WITH deposit_sums AS (
  SELECT account_id, SUM(amount) AS total_deposits
  FROM wealth_management.transactions
  WHERE amount > 0
  GROUP BY account_id
)
SELECT ds.account_id, ds.total_deposits
FROM deposit_sums ds;

-- 3. Find portfolios with more than 2 assets.
WITH portfolio_asset_counts AS (
  SELECT portfolio_id, COUNT(*) AS asset_count
  FROM wealth_management.portfolio_assets
  GROUP BY portfolio_id
)
SELECT portfolio_id, asset_count
FROM portfolio_asset_counts
WHERE asset_count > 2;

-- 4. List financial goals with percentage progress.
WITH goal_progress AS (
  SELECT goal_id,
         current_amount * 1.0 / target_amount AS progress_pct
  FROM wealth_management.financial_goals
)
SELECT * FROM goal_progress;

-- 5. Identify high‐value transactions (> 10,000).
WITH high_value_txns AS (
  SELECT txn_id, account_id, amount
  FROM wealth_management.transactions
  WHERE amount > 10000
)
SELECT * FROM high_value_txns;

-- 6. Join clients and portfolios to show owner names.
WITH client_list AS (
  SELECT client_id, first_name + ' ' + last_name AS client_name
  FROM wealth_management.clients
)
SELECT cl.client_name, p.portfolio_id, p.name AS portfolio_name
FROM wealth_management.portfolios p
JOIN client_list cl ON p.client_id = cl.client_id;

-- 7. Clients older than 40 years.
WITH client_age AS (
  SELECT client_id,
         DATEDIFF(year, date_of_birth, GETDATE()) AS age
  FROM wealth_management.clients
)
SELECT * FROM client_age WHERE age > 40;

-- 8. Assets acquired in 2023.
WITH acq_2023 AS (
  SELECT portfolio_id, asset_id, acquisition_date
  FROM wealth_management.portfolio_assets
  WHERE YEAR(acquisition_date) = 2023
)
SELECT * FROM acq_2023;

-- 9. Average transaction amount per account.
WITH avg_txn AS (
  SELECT account_id, AVG(amount) AS avg_amount
  FROM wealth_management.transactions
  GROUP BY account_id
)
SELECT * FROM avg_txn;

-- 10. Portfolio asset values (quantity × acquisition_price).
WITH portfolio_values AS (
  SELECT portfolio_id,
         SUM(quantity * acquisition_price) AS total_value
  FROM wealth_management.portfolio_assets
  GROUP BY portfolio_id
)
SELECT * FROM portfolio_values;
```

## Using Multiple CTEs
```sql
-- 1. Show client names and their total deposits.
WITH clients_cte AS (
  SELECT client_id, first_name + ' ' + last_name AS client_name
  FROM wealth_management.clients
),
deposits_cte AS (
  SELECT a.client_id, SUM(t.amount) AS total_deposits
  FROM wealth_management.accounts a
  JOIN wealth_management.transactions t ON a.account_id = t.account_id
  WHERE t.amount > 0
  GROUP BY a.client_id
)
SELECT c.client_name, d.total_deposits
FROM clients_cte c
LEFT JOIN deposits_cte d ON c.client_id = d.client_id;

-- 2. Compare portfolio counts and goal counts per client.
WITH portfolio_counts AS (
  SELECT client_id, COUNT(*) AS num_portfolios
  FROM wealth_management.portfolios
  GROUP BY client_id
),
goal_counts AS (
  SELECT client_id, COUNT(*) AS num_goals
  FROM wealth_management.financial_goals
  GROUP BY client_id
)
SELECT pc.client_id, pc.num_portfolios, gc.num_goals
FROM portfolio_counts pc
FULL JOIN goal_counts gc ON pc.client_id = gc.client_id;

-- 3. List assets with average price and total quantity.
WITH avg_price AS (
  SELECT asset_id, AVG(acquisition_price) AS avg_price
  FROM wealth_management.portfolio_assets
  GROUP BY asset_id
),
total_qty AS (
  SELECT asset_id, SUM(quantity) AS total_quantity
  FROM wealth_management.portfolio_assets
  GROUP BY asset_id
)
SELECT a.asset_id, a.symbol, ap.avg_price, tq.total_quantity
FROM wealth_management.assets a
JOIN avg_price ap ON a.asset_id = ap.asset_id
JOIN total_qty tq ON a.asset_id = tq.asset_id;

-- 4. Clients’ first and last transaction dates.
WITH first_txn AS (
  SELECT a.client_id, MIN(t.txn_date) AS first_date
  FROM wealth_management.accounts a
  JOIN wealth_management.transactions t ON a.account_id = t.account_id
  GROUP BY a.client_id
),
last_txn AS (
  SELECT a.client_id, MAX(t.txn_date) AS last_date
  FROM wealth_management.accounts a
  JOIN wealth_management.transactions t ON a.account_id = t.account_id
  GROUP BY a.client_id
)
SELECT f.client_id, f.first_date, l.last_date
FROM first_txn f
JOIN last_txn l ON f.client_id = l.client_id;

-- 5. Account balances vs. goal targets.
WITH account_balances AS (
  SELECT account_id, SUM(amount) AS balance
  FROM wealth_management.transactions
  GROUP BY account_id
),
goal_targets AS (
  SELECT client_id, SUM(target_amount) AS total_target
  FROM wealth_management.financial_goals
  GROUP BY client_id
)
SELECT a.account_id, a.balance, g.total_target
FROM account_balances a
JOIN wealth_management.accounts acc ON a.account_id = acc.account_id
JOIN goal_targets g ON acc.client_id = g.client_id;

-- 6. Recent activity: last 5 transactions and goals per client.
WITH recent_txns AS (
  SELECT t.*, ROW_NUMBER() OVER (PARTITION BY a.client_id ORDER BY t.txn_date DESC) AS rn
  FROM wealth_management.transactions t
  JOIN wealth_management.accounts a ON t.account_id = a.account_id
),
recent_goals AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY target_date DESC) AS rn
  FROM wealth_management.financial_goals
)
SELECT 'Txn' AS type, account_id AS id, txn_date AS date, amount AS value
FROM recent_txns WHERE rn <= 5
UNION ALL
SELECT 'Goal', client_id, target_date, current_amount
FROM recent_goals WHERE rn <= 5
ORDER BY date DESC;

-- 7. Client summary: portfolios, assets, and goals.
WITH pc AS (
  SELECT client_id, COUNT(*) AS portfolios
  FROM wealth_management.portfolios GROUP BY client_id
),
ac AS (
  SELECT p.client_id, COUNT(pa.asset_id) AS assets
  FROM wealth_management.portfolios p
  JOIN wealth_management.portfolio_assets pa ON p.portfolio_id = pa.portfolio_id
  GROUP BY p.client_id
),
gc AS (
  SELECT client_id, COUNT(*) AS goals
  FROM wealth_management.financial_goals GROUP BY client_id
)
SELECT c.client_id, c.first_name + ' ' + c.last_name AS name,
       COALESCE(pc.portfolios,0) AS portfolios,
       COALESCE(ac.assets,0) AS assets,
       COALESCE(gc.goals,0) AS goals
FROM wealth_management.clients c
LEFT JOIN pc ON c.client_id=pc.client_id
LEFT JOIN ac ON c.client_id=ac.client_id
LEFT JOIN gc ON c.client_id=gc.client_id;

-- 8. Compare average transaction and average deposit per account.
WITH avg_txn AS (
  SELECT account_id, AVG(amount) AS avg_all
  FROM wealth_management.transactions GROUP BY account_id
),
avg_dep AS (
  SELECT account_id, AVG(amount) AS avg_dep
  FROM wealth_management.transactions WHERE amount>0 GROUP BY account_id
)
SELECT a.account_id, at.avg_all, ad.avg_dep
FROM wealth_management.accounts a
LEFT JOIN avg_txn at ON a.account_id=at.account_id
LEFT JOIN avg_dep ad ON a.account_id=ad.account_id;

-- 9. Portfolio value vs. asset count.
WITH pv AS (
  SELECT portfolio_id, SUM(quantity*acquisition_price) AS total_value
  FROM wealth_management.portfolio_assets GROUP BY portfolio_id
),
pc AS (
  SELECT portfolio_id, COUNT(*) AS asset_count
  FROM wealth_management.portfolio_assets GROUP BY portfolio_id
)
SELECT p.portfolio_id, pv.total_value, pc.asset_count
FROM wealth_management.portfolios p
LEFT JOIN pv ON p.portfolio_id=pv.portfolio_id
LEFT JOIN pc ON p.portfolio_id=pc.portfolio_id;

-- 10. High‐risk clients: top 5 by withdrawal volume.
WITH withdrawals AS (
  SELECT a.client_id, SUM(-t.amount) AS total_withdrawals
  FROM wealth_management.accounts a
  JOIN wealth_management.transactions t ON a.account_id=t.account_id
  WHERE t.amount<0
  GROUP BY a.client_id
)
SELECT TOP 5 c.client_id, c.first_name + ' ' + c.last_name AS name, w.total_withdrawals
FROM withdrawals w
JOIN wealth_management.clients c ON w.client_id=c.client_id
ORDER BY w.total_withdrawals DESC;
```

## Recursive CTEs
```sql
-- 1. Generate numbers 1–12 (months).
WITH nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM nums WHERE n<12
)
SELECT * FROM nums OPTION (MAXRECURSION 12);

-- 2. Monthly goal snapshots for client 1 for 6 months.
WITH month_seq AS (
  SELECT 0 AS m
  UNION ALL
  SELECT m+1 FROM month_seq WHERE m<5
),
snapshots AS (
  SELECT gs.client_id,
         DATEADD(month, ms.m, GETDATE()) AS snapshot_date,
         fg.current_amount
  FROM month_seq ms
  JOIN wealth_management.financial_goals fg ON fg.client_id=1
)
SELECT * FROM snapshots OPTION (MAXRECURSION 6);

-- 3. Running balance per account.
WITH txn_cte AS (
  SELECT account_id, txn_date, amount
  FROM wealth_management.transactions
),
running AS (
  SELECT account_id, txn_date, amount,
         amount AS balance
  FROM txn_cte WHERE txn_date = (SELECT MIN(txn_date) FROM txn_cte t2 WHERE t2.account_id=txn_cte.account_id)
  UNION ALL
  SELECT r.account_id, t.txn_date, t.amount,
         r.balance + t.amount
  FROM running r
  JOIN txn_cte t ON t.account_id=r.account_id AND t.txn_date > r.txn_date
)
SELECT account_id, txn_date, balance
FROM running
OPTION (MAXRECURSION 0);

-- 4. Date series from earliest join to today.
WITH date_range AS (
  SELECT MIN(join_date) AS dt FROM wealth_management.clients
),
dates AS (
  SELECT dt FROM date_range
  UNION ALL
  SELECT DATEADD(day,1,dt) FROM dates WHERE dt < CAST(GETDATE() AS date)
)
SELECT dt FROM dates OPTION (MAXRECURSION 0);

-- 5. Cumulative transactions by day.
WITH days AS (
  SELECT DISTINCT CAST(txn_date AS date) AS day
  FROM wealth_management.transactions
),
daily_sum AS (
  SELECT day, SUM(amount) AS day_sum
  FROM wealth_management.transactions
  GROUP BY CAST(txn_date AS date)
),
cum AS (
  SELECT day, day_sum, day_sum AS cum_sum FROM daily_sum WHERE day = (SELECT MIN(day) FROM daily_sum)
  UNION ALL
  SELECT d.day, ds.day_sum, c.cum_sum + ds.day_sum
  FROM cum c
  JOIN daily_sum ds ON ds.day = DATEADD(day,1,c.day)
)
SELECT * FROM cum ORDER BY day OPTION (MAXRECURSION 0);

-- 6. Hierarchical goal dependency (fictional parent_goal_id).
WITH goal_hierarchy AS (
  SELECT goal_id, parent_goal_id, goal_name
  FROM wealth_management.financial_goals
  WHERE parent_goal_id IS NULL
  UNION ALL
  SELECT fg.goal_id, fg.parent_goal_id, fg.goal_name
  FROM wealth_management.financial_goals fg
  JOIN goal_hierarchy gh ON fg.parent_goal_id = gh.goal_id
)
SELECT * FROM goal_hierarchy OPTION (MAXRECURSION 0);

-- 7. Generate 5‐year projection points.
WITH seq AS (
  SELECT 0 AS y
  UNION ALL
  SELECT y+1 FROM seq WHERE y<5
)
SELECT y AS years_ahead, DATEADD(year,y,GETDATE()) AS projected_date
FROM seq OPTION (MAXRECURSION 6);

-- 8. Client tenure in years recursively.
WITH cte0 AS (
  SELECT client_id, DATEDIFF(year, join_date, GETDATE()) AS tenure
  FROM wealth_management.clients
),
cte_rec AS (
  SELECT client_id, tenure FROM cte0
  UNION ALL
  SELECT client_id, tenure-1 FROM cte_rec WHERE tenure>0
)
SELECT DISTINCT client_id, tenure FROM cte_rec OPTION (MAXRECURSION 0);

-- 9. Split portfolio values into deciles.
WITH pv AS (
  SELECT portfolio_id, SUM(quantity*acquisition_price) AS value
  FROM wealth_management.portfolio_assets GROUP BY portfolio_id
),
deciles AS (
  SELECT portfolio_id, value,
         NTILE(10) OVER (ORDER BY value) AS decile
  FROM pv
)
SELECT * FROM deciles;

-- 10. Build a calendar of weekdays for next 7 days.
WITH dates AS (
  SELECT CAST(GETDATE() AS date) AS dt
  UNION ALL
  SELECT DATEADD(day,1,dt) FROM dates WHERE dt < DATEADD(day,6,GETDATE())
)
SELECT dt, DATENAME(weekday,dt) AS weekday FROM dates OPTION (MAXRECURSION 7);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
