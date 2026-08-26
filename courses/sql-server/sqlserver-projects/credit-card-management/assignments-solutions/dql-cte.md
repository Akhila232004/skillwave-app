![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. Total transactions per card
WITH txn_per_card AS (
  SELECT card_id, COUNT(*) AS txn_count
  FROM credit_card.card_transactions
  GROUP BY card_id
)
SELECT * FROM txn_per_card;

-- 2. Total spent per client
WITH spent_per_client AS (
  SELECT cc.client_id, SUM(t.amount) AS total_spent
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  GROUP BY cc.client_id
)
SELECT * FROM spent_per_client;

-- 3. Clients with at least one blocked card
WITH blocked_clients AS (
  SELECT DISTINCT client_id
  FROM credit_card.credit_cards
  WHERE status = 'Blocked'
)
SELECT c.* FROM credit_card.clients c
JOIN blocked_clients b ON c.client_id = b.client_id;

-- 4. Average transaction amount per merchant
WITH avg_txn_merchant AS (
  SELECT merchant, AVG(amount) AS avg_amount
  FROM credit_card.card_transactions
  GROUP BY merchant
)
SELECT * FROM avg_txn_merchant;

-- 5. Statements above average closing balance
WITH avg_closing AS (
  SELECT AVG(closing_balance) AS avg_bal FROM credit_card.statements
)
SELECT s.* 
FROM credit_card.statements s
CROSS JOIN avg_closing a
WHERE s.closing_balance > a.avg_bal;

-- 6. Payment count per client
WITH pay_per_client AS (
  SELECT cc.client_id, COUNT(p.payment_id) AS pay_count
  FROM credit_card.credit_cards cc
  JOIN credit_card.statements st ON cc.card_id = st.card_id
  JOIN credit_card.payments p ON st.statement_id = p.statement_id
  GROUP BY cc.client_id
)
SELECT * FROM pay_per_client;

-- 7. Clients and their most recent transaction date
WITH last_txn AS (
  SELECT cc.client_id, MAX(t.txn_date) AS last_date
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  GROUP BY cc.client_id
)
SELECT c.*, l.last_date
FROM credit_card.clients c
LEFT JOIN last_txn l ON c.client_id = l.client_id;

-- 8. Cards and their next statement due date
WITH next_due AS (
  SELECT card_id, MIN(due_date) AS next_due
  FROM credit_card.statements
  WHERE due_date >= CAST(GETDATE() AS DATE)
  GROUP BY card_id
)
SELECT cc.card_id, cc.card_number, n.next_due
FROM credit_card.credit_cards cc
LEFT JOIN next_due n ON cc.card_id = n.card_id;

-- 9. Top 5 merchants by transaction count
WITH merchant_cnt AS (
  SELECT merchant, COUNT(*) AS cnt
  FROM credit_card.card_transactions
  GROUP BY merchant
)
SELECT TOP 5 * FROM merchant_cnt ORDER BY cnt DESC;

-- 10. Clients and their first/last transaction dates
WITH txn_bounds AS (
  SELECT cc.client_id,
         MIN(t.txn_date) AS first_txn,
         MAX(t.txn_date) AS last_txn
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  GROUP BY cc.client_id
)
SELECT c.*, b.first_txn, b.last_txn
FROM credit_card.clients c
LEFT JOIN txn_bounds b ON c.client_id = b.client_id;
```

## Using Multiple CTEs
```sql
-- 1. Net spend per client = total charges - total refunds
WITH charges AS (
  SELECT cc.client_id, SUM(amount) AS total_charges
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id AND t.amount > 0
  GROUP BY cc.client_id
),
refunds AS (
  SELECT cc.client_id, SUM(-amount) AS total_refunds
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id AND t.amount < 0
  GROUP BY cc.client_id
)
SELECT c.client_id,
       ISNULL(ch.total_charges,0) AS total_charges,
       ISNULL(r.total_refunds,0) AS total_refunds,
       ISNULL(ch.total_charges,0) - ISNULL(r.total_refunds,0) AS net_spend
FROM credit_card.clients c
LEFT JOIN charges ch ON c.client_id = ch.client_id
LEFT JOIN refunds r ON c.client_id = r.client_id;

-- 2. Clients joined in 2023 with their total spent
WITH joined2023 AS (
  SELECT client_id FROM credit_card.clients
  WHERE YEAR(join_date)=2023
),
spent AS (
  SELECT cc.client_id, SUM(t.amount) AS total_spent
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  GROUP BY cc.client_id
)
SELECT j.client_id, s.total_spent
FROM joined2023 j
LEFT JOIN spent s ON j.client_id = s.client_id;

-- 3. Card utilization: limit vs spend
WITH limits AS (
  SELECT card_id, credit_limit FROM credit_card.credit_cards
),
spend AS (
  SELECT card_id, SUM(amount) AS total_spent
  FROM credit_card.card_transactions
  GROUP BY card_id
)
SELECT l.card_id, l.credit_limit, ISNULL(s.total_spent,0) AS spent,
       CAST(ISNULL(s.total_spent,0)*100.0/l.credit_limit AS DECIMAL(5,2)) AS util_pct
FROM limits l
LEFT JOIN spend s ON l.card_id = s.card_id;

-- 4. Statement vs payment summary
WITH stmt_sum AS (
  SELECT statement_id, closing_balance, minimum_due FROM credit_card.statements
),
pay_sum AS (
  SELECT statement_id, SUM(amount) AS paid_amt
  FROM credit_card.payments
  GROUP BY statement_id
)
SELECT s.statement_id, s.closing_balance, s.minimum_due, ISNULL(p.paid_amt,0) AS paid_amt
FROM stmt_sum s
LEFT JOIN pay_sum p ON s.statement_id = p.statement_id;

-- 5. Merchant stats: count & avg
WITH m_cnt AS (
  SELECT merchant, COUNT(*) AS cnt
  FROM credit_card.card_transactions
  GROUP BY merchant
),
m_avg AS (
  SELECT merchant, AVG(amount) AS avg_amt
  FROM credit_card.card_transactions
  GROUP BY merchant
)
SELECT c.merchant, c.cnt, a.avg_amt
FROM m_cnt c
JOIN m_avg a ON c.merchant = a.merchant;

-- 6. Client age group and spend
WITH ages AS (
  SELECT client_id,
         DATEDIFF(year,date_of_birth,GETDATE()) AS age
  FROM credit_card.clients
),
groups AS (
  SELECT client_id,
         CASE WHEN age<30 THEN 'Young' WHEN age<60 THEN 'Adult' ELSE 'Senior' END AS age_group
  FROM ages
),
spend AS (
  SELECT cc.client_id, SUM(t.amount) AS total_spent
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id=t.card_id
  GROUP BY cc.client_id
)
SELECT g.client_id, g.age_group, s.total_spent
FROM groups g
LEFT JOIN spend s ON g.client_id = s.client_id;

-- 7. Monthly counts of statements and payments
WITH stmt_month AS (
  SELECT MONTH(statement_date) AS mn, COUNT(*) AS stmt_cnt
  FROM credit_card.statements GROUP BY MONTH(statement_date)
),
pay_month AS (
  SELECT MONTH(payment_date) AS mn, COUNT(*) AS pay_cnt
  FROM credit_card.payments GROUP BY MONTH(payment_date)
)
SELECT COALESCE(s.mn,p.mn) AS month, s.stmt_cnt, p.pay_cnt
FROM stmt_month s
FULL JOIN pay_month p ON s.mn = p.mn
ORDER BY month;

-- 8. High-limit cards and their last txn
WITH high_cards AS (
  SELECT card_id FROM credit_card.credit_cards WHERE credit_limit>20000
),
last_txn AS (
  SELECT card_id, MAX(txn_date) AS last_date
  FROM credit_card.card_transactions GROUP BY card_id
)
SELECT h.card_id, l.last_date
FROM high_cards h
LEFT JOIN last_txn l ON h.card_id = l.card_id;

-- 9. Clients with no transactions or no payments
WITH no_txn AS (
  SELECT client_id FROM credit_card.clients c
  WHERE NOT EXISTS (
    SELECT 1 FROM credit_card.credit_cards cc
    JOIN credit_card.card_transactions t ON cc.card_id=t.card_id
    WHERE cc.client_id=c.client_id
  )
),
no_pay AS (
  SELECT client_id FROM credit_card.clients c
  WHERE NOT EXISTS (
    SELECT 1 FROM credit_card.credit_cards cc
    JOIN credit_card.statements s ON cc.card_id=s.card_id
    JOIN credit_card.payments p ON s.statement_id=p.statement_id
    WHERE cc.client_id=c.client_id
  )
)
SELECT c.client_id, 
       CASE WHEN n1.client_id IS NOT NULL THEN 1 ELSE 0 END AS no_txn,
       CASE WHEN n2.client_id IS NOT NULL THEN 1 ELSE 0 END AS no_pay
FROM credit_card.clients c
LEFT JOIN no_txn n1 ON c.client_id=n1.client_id
LEFT JOIN no_pay  n2 ON c.client_id=n2.client_id;

-- 10. Filtered transactions then group
WITH recent_txn AS (
  SELECT * FROM credit_card.card_transactions
  WHERE txn_date >= DATEADD(month,-1,GETDATE())
),
cat_sum AS (
  SELECT category, SUM(amount) AS sum_amt
  FROM recent_txn GROUP BY category
)
SELECT * FROM cat_sum ORDER BY sum_amt DESC;
```

## Recursive CTEs
```sql
-- 1. Calendar table for 2023
WITH calendar AS (
  SELECT CAST('2023-01-01' AS DATE) AS cal_date
  UNION ALL
  SELECT DATEADD(day,1,cal_date)
  FROM calendar
  WHERE cal_date < '2023-12-31'
)
SELECT cal_date FROM calendar
OPTION (MAXRECURSION 366);

-- 2. Sequence of months in 2023
WITH months AS (
  SELECT CAST('2023-01-01' AS DATE) AS mon
  UNION ALL
  SELECT DATEADD(month,1,mon) FROM months WHERE mon < '2023-12-01'
)
SELECT mon FROM months
OPTION (MAXRECURSION 12);

-- 3. Statement months per card between issue and expiry
WITH card_months AS (
  SELECT card_id, issue_date AS mon, expiry_date
  FROM credit_card.credit_cards
  UNION ALL
  SELECT card_id, DATEADD(month,1,mon), expiry_date
  FROM card_months
  WHERE DATEADD(month,1,mon) <= expiry_date
)
SELECT card_id, mon FROM card_months
OPTION (MAXRECURSION 100);

-- 4. Days since each client joined (first 30 days)
WITH days_cte AS (
  SELECT client_id, join_date AS dt, 1 AS day_no
  FROM credit_card.clients
  UNION ALL
  SELECT client_id, DATEADD(day,1,dt), day_no+1
  FROM days_cte
  WHERE day_no < 30
)
SELECT client_id, dt, day_no FROM days_cte
OPTION (MAXRECURSION 30);

-- 5. Generate numbers 1–20
WITH nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM nums WHERE n < 20
)
SELECT n FROM nums
OPTION (MAXRECURSION 20);

-- 6. Cumulative transaction sum per card via recursion (first 5 txns)
WITH ordered_txn AS (
  SELECT t.*,
         ROW_NUMBER() OVER (PARTITION BY t.card_id ORDER BY t.txn_date) AS rn
  FROM credit_card.card_transactions t
),
cum AS (
  SELECT card_id, rn, amount, amount AS running_total
  FROM ordered_txn WHERE rn = 1
  UNION ALL
  SELECT o.card_id, o.rn, o.amount, c.running_total + o.amount
  FROM ordered_txn o
  JOIN cum c ON o.card_id = c.card_id AND o.rn = c.rn + 1
  WHERE o.rn <= 5
)
SELECT * FROM cum ORDER BY card_id, rn
OPTION (MAXRECURSION 5);

-- 7. Next 5 due dates per statement
WITH due_dates AS (
  SELECT statement_id, due_date, 1 AS occ
  FROM credit_card.statements
  UNION ALL
  SELECT statement_id, DATEADD(month,1,due_date), occ+1
  FROM due_dates
  WHERE occ < 5
)
SELECT statement_id, due_date, occ FROM due_dates
OPTION (MAXRECURSION 5);

-- 8. Client age progression (first 5 years)
WITH age_seq AS (
  SELECT client_id, date_of_birth AS dt, 0 AS yrs
  FROM credit_card.clients
  UNION ALL
  SELECT client_id, DATEADD(year,1,dt), yrs+1
  FROM age_seq
  WHERE yrs < 4
)
SELECT client_id, dt AS age_date, yrs FROM age_seq
OPTION (MAXRECURSION 5);

-- 9. Generate weeks between two dates (first 10 weeks)
WITH week_seq AS (
  SELECT CAST('2023-01-01' AS DATE) AS wk_start, 1 AS wk_no
  UNION ALL
  SELECT DATEADD(week,1,wk_start), wk_no+1
  FROM week_seq WHERE wk_no < 10
)
SELECT wk_no, wk_start FROM week_seq
OPTION (MAXRECURSION 10);

-- 10. Sequence of payment_ids in order (first 10)
WITH pay_ord AS (
  SELECT payment_id, ROW_NUMBER() OVER (ORDER BY payment_date) AS rn
  FROM credit_card.payments
),
pay_seq AS (
  SELECT payment_id, rn FROM pay_ord WHERE rn = 1
  UNION ALL
  SELECT o.payment_id, o.rn
  FROM pay_ord o
  JOIN pay_seq p ON o.rn = p.rn + 1
  WHERE o.rn <= 10
)
SELECT payment_id, rn FROM pay_seq ORDER BY rn
OPTION (MAXRECURSION 10);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
