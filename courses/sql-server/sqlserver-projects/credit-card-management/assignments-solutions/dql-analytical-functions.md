![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Running total of transaction amount per card ordered by txn_date
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  t.amount,
  SUM(t.amount) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_total
FROM credit_card.card_transactions AS t;

-- 2. Total number of transactions per client (all time)
SELECT
  c.client_id,
  c.first_name + ' ' + c.last_name AS client_name,
  COUNT(t.txn_id) OVER (PARTITION BY c.client_id) AS total_txns
FROM credit_card.clients AS c
JOIN credit_card.credit_cards AS cc ON c.client_id = cc.client_id
JOIN credit_card.card_transactions AS t ON cc.card_id = t.card_id;

-- 3. Average closing_balance per card over all statements
SELECT
  s.card_id,
  s.statement_date,
  s.closing_balance,
  AVG(s.closing_balance) OVER (PARTITION BY s.card_id) AS avg_closing_balance
FROM credit_card.statements AS s;

-- 4. Cumulative sum of payments per statement ordered by payment_date
SELECT
  p.payment_id,
  p.statement_id,
  p.payment_date,
  p.amount,
  SUM(p.amount) OVER (
    PARTITION BY p.statement_id
    ORDER BY p.payment_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_paid
FROM credit_card.payments AS p;

-- 5. Maximum transaction amount per merchant
SELECT
  t.txn_id,
  t.merchant,
  t.amount,
  MAX(t.amount) OVER (PARTITION BY t.merchant) AS max_by_merchant
FROM credit_card.card_transactions AS t;

-- 6. Minimum transaction amount per merchant
SELECT
  t.txn_id,
  t.merchant,
  t.amount,
  MIN(t.amount) OVER (PARTITION BY t.merchant) AS min_by_merchant
FROM credit_card.card_transactions AS t;

-- 7. Sum of credit_limit per client
SELECT
  cc.client_id,
  cc.card_id,
  cc.credit_limit,
  SUM(cc.credit_limit) OVER (PARTITION BY cc.client_id) AS total_limit
FROM credit_card.credit_cards AS cc;

-- 8. Average transaction amount per category
SELECT
  t.txn_id,
  t.category,
  t.amount,
  AVG(t.amount) OVER (PARTITION BY t.category) AS avg_by_category
FROM credit_card.card_transactions AS t;

-- 9. Count of statements per card
SELECT
  s.statement_id,
  s.card_id,
  COUNT(s.statement_id) OVER (PARTITION BY s.card_id) AS stmt_count
FROM credit_card.statements AS s;

-- 10. Running average of minimum_due per due_date ordered by due_date
SELECT
  s.statement_id,
  s.due_date,
  s.minimum_due,
  AVG(s.minimum_due) OVER (
    ORDER BY s.due_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_avg_min_due
FROM credit_card.statements AS s;
```

## ROW_NUMBER()
```sql
-- 1. Assign row numbers to transactions per card by date
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  ROW_NUMBER() OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS rn_per_card
FROM credit_card.card_transactions AS t;

-- 2. Number cards per client ordered by issue_date
SELECT
  cc.card_id,
  cc.client_id,
  cc.issue_date,
  ROW_NUMBER() OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.issue_date
  ) AS card_seq
FROM credit_card.credit_cards AS cc;

-- 3. Number payments per statement by payment_date
SELECT
  p.payment_id,
  p.statement_id,
  p.payment_date,
  ROW_NUMBER() OVER (
    PARTITION BY p.statement_id
    ORDER BY p.payment_date
  ) AS pay_seq
FROM credit_card.payments AS p;

-- 4. Rank statements per card by closing_balance
SELECT
  s.statement_id,
  s.card_id,
  s.closing_balance,
  ROW_NUMBER() OVER (
    PARTITION BY s.card_id
    ORDER BY s.closing_balance DESC
  ) AS stmt_rank
FROM credit_card.statements AS s;

-- 5. Sequential clients by join_date
SELECT
  client_id,
  join_date,
  ROW_NUMBER() OVER (ORDER BY join_date) AS join_seq
FROM credit_card.clients;

-- 6. Row number of merchants by total transaction count
WITH txn_counts AS (
  SELECT merchant, COUNT(*) AS cnt
  FROM credit_card.card_transactions
  GROUP BY merchant
)
SELECT
  merchant,
  cnt,
  ROW_NUMBER() OVER (ORDER BY cnt DESC) AS mkt_rank
FROM txn_counts;

-- 7. Number of transactions per category by amount desc
SELECT
  t.txn_id,
  t.category,
  t.amount,
  ROW_NUMBER() OVER (
    PARTITION BY t.category
    ORDER BY t.amount DESC
  ) AS rn_by_amount
FROM credit_card.card_transactions AS t;

-- 8. Rank statements globally by minimum_due
SELECT
  statement_id,
  minimum_due,
  ROW_NUMBER() OVER (ORDER BY minimum_due DESC) AS rn_min_due
FROM credit_card.statements;

-- 9. Number of clients sorted by last_name
SELECT
  client_id,
  last_name,
  ROW_NUMBER() OVER (ORDER BY last_name, first_name) AS rn_name
FROM credit_card.clients;

-- 10. Sequential assignment of payments by amount desc
SELECT
  payment_id,
  amount,
  ROW_NUMBER() OVER (ORDER BY amount DESC) AS rn_pay_amt
FROM credit_card.payments;
```

## RANK()
```sql
-- 1. Rank cards per client by credit_limit desc
SELECT
  cc.card_id,
  cc.client_id,
  cc.credit_limit,
  RANK() OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.credit_limit DESC
  ) AS limit_rank
FROM credit_card.credit_cards AS cc;

-- 2. Rank transactions per category by amount desc
SELECT
  t.txn_id,
  t.category,
  t.amount,
  RANK() OVER (
    PARTITION BY t.category
    ORDER BY t.amount DESC
  ) AS txn_rank
FROM credit_card.card_transactions AS t;

-- 3. Rank statements per card by closing_balance
SELECT
  s.statement_id,
  s.card_id,
  s.closing_balance,
  RANK() OVER (
    PARTITION BY s.card_id
    ORDER BY s.closing_balance DESC
  ) AS stmt_rank
FROM credit_card.statements AS s;

-- 4. Rank clients by total payments amount
WITH paid_amt AS (
  SELECT cc.client_id, SUM(p.amount) AS total_paid
  FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  GROUP BY cc.client_id
)
SELECT
  client_id,
  total_paid,
  RANK() OVER (ORDER BY total_paid DESC) AS pay_rank
FROM paid_amt;

-- 5. Rank merchants globally by transaction count
WITH merchant_cnt AS (
  SELECT merchant, COUNT(*) AS cnt
  FROM credit_card.card_transactions
  GROUP BY merchant
)
SELECT
  merchant,
  cnt,
  RANK() OVER (ORDER BY cnt DESC) AS mk_rank
FROM merchant_cnt;

-- 6. Rank clients by number of cards
WITH card_cnt AS (
  SELECT client_id, COUNT(*) AS cnt
  FROM credit_card.credit_cards
  GROUP BY client_id
)
SELECT
  client_id,
  cnt,
  RANK() OVER (ORDER BY cnt DESC) AS card_rank
FROM card_cnt;

-- 7. Rank payments per statement by amount asc
SELECT
  p.payment_id,
  p.statement_id,
  p.amount,
  RANK() OVER (
    PARTITION BY p.statement_id
    ORDER BY p.amount ASC
  ) AS pay_rank
FROM credit_card.payments AS p;

-- 8. Rank statements by minimum_due desc
SELECT
  statement_id,
  minimum_due,
  RANK() OVER (ORDER BY minimum_due DESC) AS min_due_rank
FROM credit_card.statements;

-- 9. Rank transactions per card by date desc
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  RANK() OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date DESC
  ) AS recent_txn_rank
FROM credit_card.card_transactions AS t;

-- 10. Rank clients by join_date desc
SELECT
  client_id,
  join_date,
  RANK() OVER (ORDER BY join_date DESC) AS join_rank
FROM credit_card.clients;
```

## DENSE_RANK()
```sql
-- 1. Dense rank cards per client by credit_limit desc
SELECT
  cc.card_id,
  cc.client_id,
  cc.credit_limit,
  DENSE_RANK() OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.credit_limit DESC
  ) AS dense_limit_rank
FROM credit_card.credit_cards AS cc;

-- 2. Dense rank transactions per category by amount desc
SELECT
  t.txn_id,
  t.category,
  t.amount,
  DENSE_RANK() OVER (
    PARTITION BY t.category
    ORDER BY t.amount DESC
  ) AS dense_txn_rank
FROM credit_card.card_transactions AS t;

-- 3. Dense rank statements per card by closing_balance
SELECT
  s.statement_id,
  s.card_id,
  s.closing_balance,
  DENSE_RANK() OVER (
    PARTITION BY s.card_id
    ORDER BY s.closing_balance DESC
  ) AS dense_stmt_rank
FROM credit_card.statements AS s;

-- 4. Dense rank clients by total payments
WITH paid_amt AS (
  SELECT cc.client_id, SUM(p.amount) AS total_paid
  FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  GROUP BY cc.client_id
)
SELECT
  client_id,
  total_paid,
  DENSE_RANK() OVER (ORDER BY total_paid DESC) AS dense_pay_rank
FROM paid_amt;

-- 5. Dense rank merchants by txn count
WITH merchant_cnt AS (
  SELECT merchant, COUNT(*) AS cnt
  FROM credit_card.card_transactions
  GROUP BY merchant
)
SELECT
  merchant,
  cnt,
  DENSE_RANK() OVER (ORDER BY cnt DESC) AS dense_mk_rank
FROM merchant_cnt;

-- 6. Dense rank clients by number of cards
WITH card_cnt AS (
  SELECT client_id, COUNT(*) AS cnt
  FROM credit_card.credit_cards
  GROUP BY client_id
)
SELECT
  client_id,
  cnt,
  DENSE_RANK() OVER (ORDER BY cnt DESC) AS dense_card_rank
FROM card_cnt;

-- 7. Dense rank payments per statement by amount asc
SELECT
  p.payment_id,
  p.statement_id,
  p.amount,
  DENSE_RANK() OVER (
    PARTITION BY p.statement_id
    ORDER BY p.amount ASC
  ) AS dense_pay_rank
FROM credit_card.payments AS p;

-- 8. Dense rank statements by minimum_due desc
SELECT
  statement_id,
  minimum_due,
  DENSE_RANK() OVER (ORDER BY minimum_due DESC) AS dense_min_due_rank
FROM credit_card.statements;

-- 9. Dense rank transactions per card by date desc
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  DENSE_RANK() OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date DESC
  ) AS dense_recent_txn_rank
FROM credit_card.card_transactions AS t;

-- 10. Dense rank clients by join_date desc
SELECT
  client_id,
  join_date,
  DENSE_RANK() OVER (ORDER BY join_date DESC) AS dense_join_rank
FROM credit_card.clients;
```

## NTILE(n)
```sql
-- 1. Quartile of transaction amounts per category
SELECT
  t.txn_id,
  t.category,
  t.amount,
  NTILE(4) OVER (
    PARTITION BY t.category
    ORDER BY t.amount
  ) AS quartile
FROM credit_card.card_transactions AS t;

-- 2. Decile of transaction amounts overall
SELECT
  txn_id,
  amount,
  NTILE(10) OVER (ORDER BY amount) AS decile
FROM credit_card.card_transactions;

-- 3. Tertile of credit_limit per card_type
SELECT
  card_id,
  card_type,
  credit_limit,
  NTILE(3) OVER (
    PARTITION BY card_type
    ORDER BY credit_limit
  ) AS tertile
FROM credit_card.credit_cards;

-- 4. Quartile of closing_balance per statement_date month
SELECT
  statement_id,
  closing_balance,
  NTILE(4) OVER (
    PARTITION BY MONTH(statement_date)
    ORDER BY closing_balance
  ) AS balance_quartile
FROM credit_card.statements;

-- 5. Quintile of payment amounts per statement
SELECT
  payment_id,
  statement_id,
  amount,
  NTILE(5) OVER (
    PARTITION BY statement_id
    ORDER BY amount
  ) AS payment_quintile
FROM credit_card.payments;

-- 6. Quartile of total payments per client
WITH client_paid AS (
  SELECT cc.client_id, SUM(p.amount) AS total_paid
  FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  GROUP BY cc.client_id
)
SELECT
  client_id,
  total_paid,
  NTILE(4) OVER (ORDER BY total_paid) AS client_quartile
FROM client_paid;

-- 7. Quartile of transaction count per client
WITH txn_cnt AS (
  SELECT cc.client_id, COUNT(t.txn_id) AS cnt
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  GROUP BY cc.client_id
)
SELECT
  client_id,
  cnt,
  NTILE(4) OVER (ORDER BY cnt) AS client_txn_quartile
FROM txn_cnt;

-- 8. Quartile of minimum_due per card
SELECT
  s.statement_id,
  s.card_id,
  s.minimum_due,
  NTILE(4) OVER (
    PARTITION BY s.card_id
    ORDER BY s.minimum_due
  ) AS due_quartile
FROM credit_card.statements AS s;

-- 9. Quartile of join_date year among clients
SELECT
  client_id,
  join_date,
  NTILE(4) OVER (
    ORDER BY YEAR(join_date)
  ) AS join_quartile
FROM credit_card.clients;

-- 10. Quartile of average txn amount per card
WITH avg_txn AS (
  SELECT card_id, AVG(amount) AS avg_amt
  FROM credit_card.card_transactions
  GROUP BY card_id
)
SELECT
  card_id,
  avg_amt,
  NTILE(4) OVER (ORDER BY avg_amt) AS avg_txn_quartile
FROM avg_txn;
```

## LAG()
```sql
-- 1. Previous transaction amount per card by date
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  t.amount,
  LAG(t.amount) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS prev_amount
FROM credit_card.card_transactions AS t;

-- 2. Previous statement closing_balance per card
SELECT
  s.statement_id,
  s.card_id,
  s.statement_date,
  s.closing_balance,
  LAG(s.closing_balance) OVER (
    PARTITION BY s.card_id
    ORDER BY s.statement_date
  ) AS prev_closing
FROM credit_card.statements AS s;

-- 3. Previous payment date per statement
SELECT
  p.payment_id,
  p.statement_id,
  p.payment_date,
  LAG(p.payment_date) OVER (
    PARTITION BY p.statement_id
    ORDER BY p.payment_date
  ) AS prev_payment
FROM credit_card.payments AS p;

-- 4. Previous credit_limit per client by issue_date
SELECT
  cc.card_id,
  cc.client_id,
  cc.issue_date,
  cc.credit_limit,
  LAG(cc.credit_limit) OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.issue_date
  ) AS prev_limit
FROM credit_card.credit_cards AS cc;

-- 5. Previous minimum_due per statement_date
SELECT
  s.statement_id,
  s.statement_date,
  s.minimum_due,
  LAG(s.minimum_due) OVER (
    ORDER BY s.statement_date
  ) AS prev_min_due
FROM credit_card.statements AS s;

-- 6. Previous join_date per client alphabetically
SELECT
  client_id,
  first_name,
  join_date,
  LAG(join_date) OVER (
    ORDER BY last_name, first_name
  ) AS prev_join
FROM credit_card.clients;

-- 7. Previous transaction category per card
SELECT
  t.txn_id,
  t.card_id,
  t.category,
  LAG(t.category) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS prev_category
FROM credit_card.card_transactions AS t;

-- 8. Previous payment amount per client
SELECT
  p.payment_id,
  cc.client_id,
  p.amount,
  LAG(p.amount) OVER (
    PARTITION BY cc.client_id
    ORDER BY p.payment_date
  ) AS prev_pay_amt
FROM credit_card.statements s
JOIN credit_card.payments p ON s.statement_id = p.statement_id
JOIN credit_card.credit_cards cc ON s.card_id = cc.card_id;

-- 9. Previous transaction date per card
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  LAG(t.txn_date) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS prev_txn_date
FROM credit_card.card_transactions AS t;

-- 10. Previous status per card when reissued
SELECT
  cc.card_id,
  cc.issue_date,
  cc.status,
  LAG(cc.status) OVER (
    PARTITION BY cc.card_id
    ORDER BY cc.issue_date
  ) AS prev_status
FROM credit_card.credit_cards AS cc;
```

## LEAD()
```sql
-- 1. Next transaction amount per card by date
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  t.amount,
  LEAD(t.amount) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS next_amount
FROM credit_card.card_transactions AS t;

-- 2. Next statement closing_balance per card
SELECT
  s.statement_id,
  s.card_id,
  s.statement_date,
  s.closing_balance,
  LEAD(s.closing_balance) OVER (
    PARTITION BY s.card_id
    ORDER BY s.statement_date
  ) AS next_closing
FROM credit_card.statements AS s;

-- 3. Next payment date per statement
SELECT
  p.payment_id,
  p.statement_id,
  p.payment_date,
  LEAD(p.payment_date) OVER (
    PARTITION BY p.statement_id
    ORDER BY p.payment_date
  ) AS next_payment
FROM credit_card.payments AS p;

-- 4. Next credit_limit per client by issue_date
SELECT
  cc.card_id,
  cc.client_id,
  cc.issue_date,
  cc.credit_limit,
  LEAD(cc.credit_limit) OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.issue_date
  ) AS next_limit
FROM credit_card.credit_cards AS cc;

-- 5. Next minimum_due per statement_date
SELECT
  s.statement_id,
  s.statement_date,
  s.minimum_due,
  LEAD(s.minimum_due) OVER (
    ORDER BY s.statement_date
  ) AS next_min_due
FROM credit_card.statements AS s;

-- 6. Next join_date per client alphabetically
SELECT
  client_id,
  first_name,
  join_date,
  LEAD(join_date) OVER (
    ORDER BY last_name, first_name
  ) AS next_join
FROM credit_card.clients;

-- 7. Next transaction category per card
SELECT
  t.txn_id,
  t.card_id,
  t.category,
  LEAD(t.category) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS next_category
FROM credit_card.card_transactions AS t;

-- 8. Next payment amount per client
SELECT
  p.payment_id,
  cc.client_id,
  p.amount,
  LEAD(p.amount) OVER (
    PARTITION BY cc.client_id
    ORDER BY p.payment_date
  ) AS next_pay_amt
FROM credit_card.statements s
JOIN credit_card.payments p ON s.statement_id = p.statement_id
JOIN credit_card.credit_cards cc ON s.card_id = cc.card_id;

-- 9. Next transaction date per card
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  LEAD(t.txn_date) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS next_txn_date
FROM credit_card.card_transactions AS t;

-- 10. Next status per card when reissued
SELECT
  cc.card_id,
  cc.issue_date,
  cc.status,
  LEAD(cc.status) OVER (
    PARTITION BY cc.card_id
    ORDER BY cc.issue_date
  ) AS next_status
FROM credit_card.credit_cards AS cc;
```

## FIRST_VALUE()
```sql
-- 1. First transaction amount per card by date
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  t.amount,
  FIRST_VALUE(t.amount) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS first_txn_amount
FROM credit_card.card_transactions AS t;

-- 2. First statement closing_balance per card
SELECT
  s.statement_id,
  s.card_id,
  s.statement_date,
  s.closing_balance,
  FIRST_VALUE(s.closing_balance) OVER (
    PARTITION BY s.card_id
    ORDER BY s.statement_date
  ) AS first_closing
FROM credit_card.statements AS s;

-- 3. First payment date per statement
SELECT
  p.payment_id,
  p.statement_id,
  p.payment_date,
  FIRST_VALUE(p.payment_date) OVER (
    PARTITION BY p.statement_id
    ORDER BY p.payment_date
  ) AS first_payment
FROM credit_card.payments AS p;

-- 4. First credit_limit per client
SELECT
  cc.card_id,
  cc.client_id,
  cc.credit_limit,
  FIRST_VALUE(cc.credit_limit) OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.issue_date
  ) AS first_limit
FROM credit_card.credit_cards AS cc;

-- 5. First minimum_due overall by date
SELECT
  s.statement_id,
  s.statement_date,
  s.minimum_due,
  FIRST_VALUE(s.minimum_due) OVER (ORDER BY s.statement_date) AS first_min_due
FROM credit_card.statements AS s;

-- 6. First join_date alphabetically by name
SELECT
  client_id,
  first_name,
  last_name,
  FIRST_VALUE(join_date) OVER (
    ORDER BY last_name, first_name
  ) AS first_join
FROM credit_card.clients;

-- 7. First transaction category per card
SELECT
  t.txn_id,
  t.card_id,
  t.category,
  FIRST_VALUE(t.category) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS first_category
FROM credit_card.card_transactions AS t;

-- 8. First payment amount per client
SELECT
  p.payment_id,
  cc.client_id,
  p.amount,
  FIRST_VALUE(p.amount) OVER (
    PARTITION BY cc.client_id
    ORDER BY p.payment_date
  ) AS first_pay_amt
FROM credit_card.statements s
JOIN credit_card.payments p ON s.statement_id = p.statement_id
JOIN credit_card.credit_cards cc ON s.card_id = cc.card_id;

-- 9. First transaction date per card
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  FIRST_VALUE(t.txn_date) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
  ) AS first_txn_date
FROM credit_card.card_transactions AS t;

-- 10. First status per card when issued
SELECT
  cc.card_id,
  cc.issue_date,
  cc.status,
  FIRST_VALUE(cc.status) OVER (
    PARTITION BY cc.card_id
    ORDER BY cc.issue_date
  ) AS first_status
FROM credit_card.credit_cards AS cc;
```

## LAST_VALUE()
```sql
-- 1. Last transaction amount per card by date (requires framing)
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  t.amount,
  LAST_VALUE(t.amount) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_txn_amount
FROM credit_card.card_transactions AS t;

-- 2. Last statement closing_balance per card
SELECT
  s.statement_id,
  s.card_id,
  s.statement_date,
  s.closing_balance,
  LAST_VALUE(s.closing_balance) OVER (
    PARTITION BY s.card_id
    ORDER BY s.statement_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_closing
FROM credit_card.statements AS s;

-- 3. Last payment date per statement
SELECT
  p.payment_id,
  p.statement_id,
  p.payment_date,
  LAST_VALUE(p.payment_date) OVER (
    PARTITION BY p.statement_id
    ORDER BY p.payment_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_payment
FROM credit_card.payments AS p;

-- 4. Last credit_limit per client
SELECT
  cc.card_id,
  cc.client_id,
  cc.credit_limit,
  LAST_VALUE(cc.credit_limit) OVER (
    PARTITION BY cc.client_id
    ORDER BY cc.issue_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_limit
FROM credit_card.credit_cards AS cc;

-- 5. Last minimum_due overall by date
SELECT
  s.statement_id,
  s.statement_date,
  s.minimum_due,
  LAST_VALUE(s.minimum_due) OVER (
    ORDER BY s.statement_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_min_due
FROM credit_card.statements AS s;

-- 6. Last join_date alphabetically by name
SELECT
  client_id,
  first_name,
  last_name,
  LAST_VALUE(join_date) OVER (
    ORDER BY last_name, first_name
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_join
FROM credit_card.clients;

-- 7. Last transaction category per card
SELECT
  t.txn_id,
  t.card_id,
  t.category,
  LAST_VALUE(t.category) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_category
FROM credit_card.card_transactions AS t;

-- 8. Last payment amount per client
SELECT
  p.payment_id,
  cc.client_id,
  p.amount,
  LAST_VALUE(p.amount) OVER (
    PARTITION BY cc.client_id
    ORDER BY p.payment_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_pay_amt
FROM credit_card.statements s
JOIN credit_card.payments p ON s.statement_id = p.statement_id
JOIN credit_card.credit_cards cc ON s.card_id = cc.card_id;

-- 9. Last transaction date per card
SELECT
  t.txn_id,
  t.card_id,
  t.txn_date,
  LAST_VALUE(t.txn_date) OVER (
    PARTITION BY t.card_id
    ORDER BY t.txn_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_txn_date
FROM credit_card.card_transactions AS t;

-- 10. Last status per card when reissued
SELECT
  cc.card_id,
  cc.issue_date,
  cc.status,
  LAST_VALUE(cc.status) OVER (
    PARTITION BY cc.card_id
    ORDER BY cc.issue_date
    ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
  ) AS last_status
FROM credit_card.credit_cards AS cc;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
