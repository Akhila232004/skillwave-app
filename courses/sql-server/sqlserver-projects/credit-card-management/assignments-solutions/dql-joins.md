![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. List clients with their credit cards
SELECT c.client_id, c.first_name, c.last_name, cc.card_number
FROM credit_card.clients AS c
INNER JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id;
-- 2. List credit cards with their latest statement closing_balance
SELECT cc.card_id, cc.card_number, s.closing_balance
FROM credit_card.credit_cards AS cc
INNER JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id
WHERE s.statement_date = (
  SELECT MAX(statement_date) FROM credit_card.statements WHERE card_id = cc.card_id
);
-- 3. List transactions with merchant and client name
SELECT t.txn_id, t.merchant, c.first_name + ' ' + c.last_name AS client_name, t.amount
FROM credit_card.card_transactions AS t
INNER JOIN credit_card.credit_cards AS cc
  ON t.card_id = cc.card_id
INNER JOIN credit_card.clients AS c
  ON cc.client_id = c.client_id;
-- 4. List payments with statement due_date and card_number
SELECT p.payment_id, p.amount, s.due_date, cc.card_number
FROM credit_card.payments AS p
INNER JOIN credit_card.statements AS s
  ON p.statement_id = s.statement_id
INNER JOIN credit_card.credit_cards AS cc
  ON s.card_id = cc.card_id;
-- 5. List each client’s total spent (sum of transactions)
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, SUM(t.amount) AS total_spent
FROM credit_card.clients AS c
INNER JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
INNER JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id
GROUP BY c.client_id, c.first_name, c.last_name;
-- 6. List statements with payment count
SELECT s.statement_id, s.closing_balance, COUNT(p.payment_id) AS payment_count
FROM credit_card.statements AS s
INNER JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id
GROUP BY s.statement_id, s.closing_balance;
-- 7. List cards and number of transactions per card
SELECT cc.card_id, cc.card_number, COUNT(t.txn_id) AS txn_count
FROM credit_card.credit_cards AS cc
INNER JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id
GROUP BY cc.card_id, cc.card_number;
-- 8. List clients who used a specific merchant (e.g., Amazon)
SELECT DISTINCT c.client_id, c.first_name, c.last_name
FROM credit_card.clients AS c
INNER JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
INNER JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id
WHERE t.merchant = 'Amazon';
-- 9. List statements and associated client email
SELECT s.statement_id, s.closing_balance, c.email
FROM credit_card.statements AS s
INNER JOIN credit_card.credit_cards AS cc
  ON s.card_id = cc.card_id
INNER JOIN credit_card.clients AS c
  ON cc.client_id = c.client_id;
-- 10. List payment methods with average payment amount
SELECT p.payment_method, AVG(p.amount) AS avg_payment
FROM credit_card.payments AS p
INNER JOIN credit_card.statements AS s
  ON p.statement_id = s.statement_id
GROUP BY p.payment_method;
```

## Left Join (Left Outer Join)
```sql
-- 1. List all clients and their cards (include clients with no cards)
SELECT c.client_id, c.first_name, c.last_name, cc.card_number
FROM credit_card.clients AS c
LEFT JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id;
-- 2. List all cards and their transactions (include cards with no transactions)
SELECT cc.card_id, cc.card_number, t.txn_id, t.amount
FROM credit_card.credit_cards AS cc
LEFT JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
-- 3. List all cards and latest statement (include cards without statements)
SELECT cc.card_id, cc.card_number, s.statement_date, s.closing_balance
FROM credit_card.credit_cards AS cc
LEFT JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id
    AND s.statement_date = (
      SELECT MAX(statement_date) FROM credit_card.statements WHERE card_id = cc.card_id
    );
-- 4. List all statements and their payments (include statements with no payments)
SELECT s.statement_id, s.closing_balance, p.payment_id, p.amount
FROM credit_card.statements AS s
LEFT JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;
-- 5. List all clients and any transactions (include clients with no transactions)
SELECT c.client_id, c.first_name, c.last_name, t.txn_id, t.amount
FROM credit_card.clients AS c
LEFT JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
LEFT JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
-- 6. List all card types and average transaction amount (include types with no transactions)
SELECT cc.card_type, AVG(t.amount) AS avg_amount
FROM credit_card.credit_cards AS cc
LEFT JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id
GROUP BY cc.card_type;
-- 7. List all clients and their last payment date (include clients with no payments)
SELECT c.client_id, c.first_name + ' ' + c.last_name AS client_name, MAX(p.payment_date) AS last_payment
FROM credit_card.clients AS c
LEFT JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
LEFT JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id
LEFT JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id
GROUP BY c.client_id, c.first_name, c.last_name;
-- 8. List all merchants and transaction counts (include merchants with zero transactions via derived list)
WITH merchants AS (
  SELECT DISTINCT merchant FROM credit_card.card_transactions
)
SELECT m.merchant, COUNT(t.txn_id) AS txn_count
FROM merchants AS m
LEFT JOIN credit_card.card_transactions AS t
  ON m.merchant = t.merchant
GROUP BY m.merchant;
-- 9. List all cards and due dates (include cards with no statements)
SELECT cc.card_id, cc.card_number, s.due_date
FROM credit_card.credit_cards AS cc
LEFT JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id;
-- 10. List all clients and number of cards (include clients with zero cards)
SELECT c.client_id, c.first_name, c.last_name, COUNT(cc.card_id) AS card_count
FROM credit_card.clients AS c
LEFT JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
GROUP BY c.client_id, c.first_name, c.last_name;
```

## Right Join (Right Outer Join)
```sql
-- 1. List clients and cards (include cards with no matching client)
SELECT c.client_id, c.first_name, c.last_name, cc.card_number
FROM credit_card.clients AS c
RIGHT JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id;
-- 2. List cards and statements (include statements with no matching card)
SELECT cc.card_id, cc.card_number, s.statement_id, s.closing_balance
FROM credit_card.credit_cards AS cc
RIGHT JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id;
-- 3. List statements and payments (include payments with no matching statement)
SELECT s.statement_id, s.closing_balance, p.payment_id, p.amount
FROM credit_card.statements AS s
RIGHT JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;
-- 4. List cards and transactions (include transactions with no matching card)
SELECT cc.card_id, cc.card_number, t.txn_id, t.amount
FROM credit_card.credit_cards AS cc
RIGHT JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
-- 5. List clients and payments (include payments even if client deleted)
SELECT c.client_id, c.first_name, c.last_name, p.payment_id, p.amount
FROM credit_card.clients AS c
RIGHT JOIN (
  credit_card.statements AS s
  RIGHT JOIN credit_card.payments AS p
    ON s.statement_id = p.statement_id
) ON c.client_id = (
  SELECT cc.client_id FROM credit_card.credit_cards cc WHERE cc.card_id = s.card_id
);
-- 6. List all payment methods with payments (include methods from payments table)
SELECT DISTINCT s.payment_method, p.payment_id
FROM credit_card.statements AS s
RIGHT JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;
-- 7. List all merchants showing transactions (include every txn)
SELECT DISTINCT cc.card_number, t.txn_id, t.merchant
FROM credit_card.credit_cards AS cc
RIGHT JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
-- 8. List clients and all their statements (include statements for orphan cards)
SELECT c.client_id, c.first_name, s.statement_id
FROM credit_card.clients AS c
RIGHT JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
RIGHT JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id;
-- 9. List statements and their cards (include cards even if no card_number)
SELECT s.statement_id, s.due_date, cc.card_number
FROM credit_card.statements AS s
RIGHT JOIN credit_card.credit_cards AS cc
  ON s.card_id = cc.card_id;
-- 10. List transactions and client info (include all transactions)
SELECT t.txn_id, t.amount, c.first_name, c.last_name
FROM credit_card.card_transactions AS t
RIGHT JOIN credit_card.credit_cards AS cc
  ON t.card_id = cc.card_id
RIGHT JOIN credit_card.clients AS c
  ON cc.client_id = c.client_id;
```

## Full Join (Full Outer Join)
```sql
-- 1. All clients and cards (include unmatched on both sides)
SELECT c.client_id, c.first_name, cc.card_id, cc.card_number
FROM credit_card.clients AS c
FULL JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id;
-- 2. All cards and statements
SELECT cc.card_id, cc.card_number, s.statement_id, s.closing_balance
FROM credit_card.credit_cards AS cc
FULL JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id;
-- 3. All statements and payments
SELECT s.statement_id, s.closing_balance, p.payment_id, p.amount
FROM credit_card.statements AS s
FULL JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;
-- 4. All cards and transactions
SELECT cc.card_id, cc.card_number, t.txn_id, t.amount
FROM credit_card.credit_cards AS cc
FULL JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
-- 5. All clients and transactions
SELECT c.client_id, c.first_name, t.txn_id, t.amount
FROM credit_card.clients AS c
FULL JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
FULL JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
-- 6. All clients and payments
SELECT c.client_id, c.first_name, p.payment_id, p.amount
FROM credit_card.clients AS c
FULL JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
FULL JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id
FULL JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;
-- 7. All merchants with statements and transactions
WITH all_merchants AS (
  SELECT merchant AS val FROM credit_card.card_transactions
  UNION ALL
  SELECT CAST(statement_id AS VARCHAR) FROM credit_card.statements
)
SELECT * 
FROM all_merchants AS a
FULL JOIN credit_card.card_transactions AS t
  ON a.val = t.merchant;
-- 8. All card types with payments
SELECT cc.card_type, p.payment_id
FROM credit_card.credit_cards AS cc
FULL JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id
FULL JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;
-- 9. All categories and clients
SELECT t.category, c.client_id
FROM credit_card.card_transactions AS t
FULL JOIN credit_card.credit_cards AS cc
  ON t.card_id = cc.card_id
FULL JOIN credit_card.clients AS c
  ON cc.client_id = c.client_id;
-- 10. All statements and transactions by date
SELECT s.statement_date, t.txn_date
FROM credit_card.statements AS s
FULL JOIN credit_card.card_transactions AS t
  ON s.statement_date = t.txn_date;
```

## Cross Join
```sql
-- 1. Cartesian product of all clients and card types
SELECT c.client_id, cc.card_type
FROM credit_card.clients AS c
CROSS JOIN (SELECT DISTINCT card_type FROM credit_card.credit_cards) AS cc;
-- 2. All client–merchant combinations
SELECT c.client_id, t.merchant
FROM credit_card.clients AS c
CROSS JOIN (SELECT DISTINCT merchant FROM credit_card.card_transactions) AS t;
-- 3. All card_number and due_date combinations
SELECT cc.card_number, s.due_date
FROM credit_card.credit_cards AS cc
CROSS JOIN credit_card.statements AS s;
-- 4. All card_number and payment_method combinations
SELECT cc.card_number, p.payment_method
FROM credit_card.credit_cards AS cc
CROSS JOIN credit_card.payments AS p;
-- 5. All merchant and category combinations
SELECT DISTINCT t1.merchant, t2.category
FROM credit_card.card_transactions AS t1
CROSS JOIN credit_card.card_transactions AS t2;
-- 6. All client and statement combinations
SELECT c.client_id, s.statement_id
FROM credit_card.clients AS c
CROSS JOIN credit_card.statements AS s;
-- 7. All transaction and payment combinations
SELECT t.txn_id, p.payment_id
FROM credit_card.card_transactions AS t
CROSS JOIN credit_card.payments AS p;
-- 8. All client and payment_method combinations
SELECT c.client_id, p.payment_method
FROM credit_card.clients AS c
CROSS JOIN credit_card.payments AS p;
-- 9. All category and payment_method combinations
SELECT DISTINCT t.category, p.payment_method
FROM credit_card.card_transactions AS t
CROSS JOIN credit_card.payments AS p;
-- 10. All month–merchant combinations (derive months)
SELECT DISTINCT MONTH(s.statement_date) AS stmt_month, t.merchant
FROM credit_card.statements AS s
CROSS JOIN credit_card.card_transactions AS t;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
