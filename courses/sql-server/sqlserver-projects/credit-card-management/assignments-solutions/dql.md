![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. Retrieve all columns from clients
SELECT * 
FROM credit_card.clients;

-- 2. Retrieve first_name and last_name of all clients
SELECT first_name, last_name 
FROM credit_card.clients;

-- 3. Retrieve card_number and card_type for all active credit cards
SELECT card_number, card_type 
FROM credit_card.credit_cards
WHERE status = 'Active';

-- 4. Retrieve txn_date and amount for all card transactions
SELECT txn_date, amount 
FROM credit_card.card_transactions;

-- 5. Retrieve statement_id, closing_balance, due_date from statements
SELECT statement_id, closing_balance, due_date 
FROM credit_card.statements;

-- 6. Retrieve payment_id, payment_date, amount from payments
SELECT payment_id, payment_date, amount 
FROM credit_card.payments;

-- 7. List client full name and their card_number
SELECT c.first_name + ' ' + c.last_name AS client_name, cc.card_number
FROM credit_card.clients AS c
JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id;

-- 8. List card_number with its closing_balance
SELECT cc.card_number, s.closing_balance
FROM credit_card.credit_cards AS cc
JOIN credit_card.statements AS s
  ON cc.card_id = s.card_id;

-- 9. List statement_date and payment_date for each payment
SELECT s.statement_date, p.payment_date
FROM credit_card.statements AS s
JOIN credit_card.payments AS p
  ON s.statement_id = p.statement_id;

-- 10. List each client’s name, merchant, and transaction amount
SELECT c.first_name + ' ' + c.last_name AS client_name, t.merchant, t.amount
FROM credit_card.clients AS c
JOIN credit_card.credit_cards AS cc
  ON c.client_id = cc.client_id
JOIN credit_card.card_transactions AS t
  ON cc.card_id = t.card_id;
```

## WHERE
```sql
-- 1. Transactions greater than 500
SELECT * 
FROM credit_card.card_transactions
WHERE amount > 500;

-- 2. Transactions in USD only
SELECT * 
FROM credit_card.card_transactions
WHERE currency = 'USD';

-- 3. Transactions in July 2023
SELECT * 
FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-07-01' AND '2023-07-31';

-- 4. Blocked credit cards
SELECT * 
FROM credit_card.credit_cards
WHERE status = 'Blocked';

-- 5. Clients who joined after January 1, 2022
SELECT * 
FROM credit_card.clients
WHERE join_date > '2022-01-01';

-- 6. Statements with closing_balance over 1,000
SELECT * 
FROM credit_card.statements
WHERE closing_balance > 1000;

-- 7. Payments made online
SELECT * 
FROM credit_card.payments
WHERE payment_method = 'Online';

-- 8. Groceries transactions over 200
SELECT * 
FROM credit_card.card_transactions
WHERE category = 'Groceries'
  AND amount > 200;

-- 9. Expired cards (expiry_date before today)
SELECT * 
FROM credit_card.credit_cards
WHERE expiry_date < GETDATE();

-- 10. Payments where amount is less than the statement’s minimum_due
SELECT p.*
FROM credit_card.payments AS p
JOIN credit_card.statements AS s
  ON p.statement_id = s.statement_id
WHERE p.amount < s.minimum_due;
```

## GROUP BY
```sql
-- 1. Count transactions per client
SELECT c.client_id, COUNT(t.txn_id) AS txn_count
FROM credit_card.clients AS c
JOIN credit_card.credit_cards AS cc ON c.client_id = cc.client_id
JOIN credit_card.card_transactions AS t ON cc.card_id = t.card_id
GROUP BY c.client_id;

-- 2. Sum transaction amounts per card
SELECT card_id, SUM(amount) AS total_spent
FROM credit_card.card_transactions
GROUP BY card_id;

-- 3. Average transaction amount per category
SELECT category, AVG(amount) AS avg_amount
FROM credit_card.card_transactions
GROUP BY category;

-- 4. Number of cards per client
SELECT client_id, COUNT(card_id) AS card_count
FROM credit_card.credit_cards
GROUP BY client_id;

-- 5. Total minimum_due per due_date
SELECT due_date, SUM(minimum_due) AS total_min_due
FROM credit_card.statements
GROUP BY due_date;

-- 6. Count payments by payment_method
SELECT payment_method, COUNT(payment_id) AS payment_count
FROM credit_card.payments
GROUP BY payment_method;

-- 7. Sum closing_balance by card_type
SELECT cc.card_type, SUM(s.closing_balance) AS total_balance
FROM credit_card.credit_cards AS cc
JOIN credit_card.statements AS s ON cc.card_id = s.card_id
GROUP BY cc.card_type;

-- 8. Number of transactions per merchant
SELECT merchant, COUNT(txn_id) AS txn_count
FROM credit_card.card_transactions
GROUP BY merchant;

-- 9. Average credit_limit per card_type
SELECT card_type, AVG(credit_limit) AS avg_limit
FROM credit_card.credit_cards
GROUP BY card_type;

-- 10. Number of statements per card
SELECT card_id, COUNT(statement_id) AS stmt_count
FROM credit_card.statements
GROUP BY card_id;
```

## HAVING
```sql
-- 1. Categories with average amount > 100
SELECT category, AVG(amount) AS avg_amount
FROM credit_card.card_transactions
GROUP BY category
HAVING AVG(amount) > 100;

-- 2. Clients with more than 1 card
SELECT client_id, COUNT(card_id) AS card_count
FROM credit_card.credit_cards
GROUP BY client_id
HAVING COUNT(card_id) > 1;

-- 3. Merchants with total spend > 1,000
SELECT merchant, SUM(amount) AS total_spent
FROM credit_card.card_transactions
GROUP BY merchant
HAVING SUM(amount) > 1000;

-- 4. Card types with average limit > 12,000
SELECT card_type, AVG(credit_limit) AS avg_limit
FROM credit_card.credit_cards
GROUP BY card_type
HAVING AVG(credit_limit) > 12000;

-- 5. Payment methods used more than 50 times
SELECT payment_method, COUNT(payment_id) AS usage_count
FROM credit_card.payments
GROUP BY payment_method
HAVING COUNT(payment_id) > 50;

-- 6. Months with total closing balances > 5,000
SELECT MONTH(statement_date) AS stmt_month, SUM(closing_balance) AS total_balance
FROM credit_card.statements
GROUP BY MONTH(statement_date)
HAVING SUM(closing_balance) > 5000;

-- 7. Clients with more than 10 transactions
SELECT c.client_id, COUNT(t.txn_id) AS txn_count
FROM credit_card.clients AS c
JOIN credit_card.credit_cards AS cc ON c.client_id = cc.client_id
JOIN credit_card.card_transactions AS t ON cc.card_id = t.card_id
GROUP BY c.client_id
HAVING COUNT(t.txn_id) > 10;

-- 8. Categories having refunds (negative amounts)
SELECT category, COUNT(*) AS refund_count
FROM credit_card.card_transactions
WHERE amount < 0
GROUP BY category
HAVING COUNT(*) > 0;

-- 9. Card statuses that appear more than 5 times
SELECT status, COUNT(card_id) AS count_status
FROM credit_card.credit_cards
GROUP BY status
HAVING COUNT(card_id) > 5;

-- 10. Clients whose total payments < total minimum_due
SELECT s.client_id
FROM (
  SELECT cc.client_id, SUM(p.amount) AS total_paid, SUM(s.minimum_due) AS total_due
  FROM credit_card.statements AS s
  JOIN credit_card.credit_cards AS cc ON s.card_id = cc.card_id
  JOIN credit_card.payments AS p ON s.statement_id = p.statement_id
  GROUP BY cc.client_id
) AS t
WHERE t.total_paid < t.total_due;
```

## ORDER BY
```sql
-- 1. List clients by newest join_date first
SELECT * 
FROM credit_card.clients
ORDER BY join_date DESC;

-- 2. List credit cards by descending credit_limit
SELECT * 
FROM credit_card.credit_cards
ORDER BY credit_limit DESC;

-- 3. List transactions in ascending txn_date
SELECT * 
FROM credit_card.card_transactions
ORDER BY txn_date ASC;

-- 4. List statements by latest statement_date
SELECT * 
FROM credit_card.statements
ORDER BY statement_date DESC;

-- 5. List payments by smallest amount first
SELECT * 
FROM credit_card.payments
ORDER BY amount ASC;

-- 6. List clients alphabetically by last_name then first_name
SELECT * 
FROM credit_card.clients
ORDER BY last_name, first_name;

-- 7. List credit cards by soonest expiry_date
SELECT * 
FROM credit_card.credit_cards
ORDER BY expiry_date ASC;

-- 8. List transactions by category asc, amount desc
SELECT * 
FROM credit_card.card_transactions
ORDER BY category ASC, amount DESC;

-- 9. List statements by highest closing_balance
SELECT * 
FROM credit_card.statements
ORDER BY closing_balance DESC;

-- 10. List payments by most recent payment_date
SELECT * 
FROM credit_card.payments
ORDER BY payment_date DESC;
```

## TOP
```sql
-- 1. Top 5 cards with highest credit_limit
SELECT TOP 5 * 
FROM credit_card.credit_cards
ORDER BY credit_limit DESC;

-- 2. Top 10 largest transactions by amount
SELECT TOP 10 * 
FROM credit_card.card_transactions
ORDER BY amount DESC;

-- 3. Top 3 clients with the most cards
SELECT TOP 3 client_id, COUNT(card_id) AS card_count
FROM credit_card.credit_cards
GROUP BY client_id
ORDER BY card_count DESC;

-- 4. Top 5 merchants by number of transactions
SELECT TOP 5 merchant, COUNT(txn_id) AS txn_count
FROM credit_card.card_transactions
GROUP BY merchant
ORDER BY txn_count DESC;

-- 5. Top 3 categories by total spend
SELECT TOP 3 category, SUM(amount) AS total_spent
FROM credit_card.card_transactions
GROUP BY category
ORDER BY total_spent DESC;

-- 6. Top 5 cards with highest average transaction amount
SELECT TOP 5 t.card_id, AVG(t.amount) AS avg_txn
FROM credit_card.card_transactions AS t
GROUP BY t.card_id
ORDER BY avg_txn DESC;

-- 7. Top 5 months with most statements generated
SELECT TOP 5 MONTH(statement_date) AS stmt_month, COUNT(*) AS count_statements
FROM credit_card.statements
GROUP BY MONTH(statement_date)
ORDER BY count_statements DESC;

-- 8. Top 5 payment methods by usage
SELECT TOP 5 payment_method, COUNT(payment_id) AS usage_count
FROM credit_card.payments
GROUP BY payment_method
ORDER BY usage_count DESC;

-- 9. Top 5 clients by total payments amount
SELECT TOP 5 cc.client_id, SUM(p.amount) AS total_paid
FROM credit_card.credit_cards AS cc
JOIN credit_card.statements AS s ON cc.card_id = s.card_id
JOIN credit_card.payments AS p ON s.statement_id = p.statement_id
GROUP BY cc.client_id
ORDER BY total_paid DESC;

-- 10. Top 5 cards nearing expiry soonest
SELECT TOP 5 card_id, expiry_date
FROM credit_card.credit_cards
ORDER BY expiry_date ASC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
