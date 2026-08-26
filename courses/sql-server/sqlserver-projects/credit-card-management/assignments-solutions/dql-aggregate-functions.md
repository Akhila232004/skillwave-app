![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Count total clients
SELECT COUNT(*) AS total_clients FROM credit_card.clients;
-- 2. Count total credit cards
SELECT COUNT(*) AS total_cards FROM credit_card.credit_cards;
-- 3. Count total transactions
SELECT COUNT(*) AS total_txns FROM credit_card.card_transactions;
-- 4. Count total statements
SELECT COUNT(*) AS total_statements FROM credit_card.statements;
-- 5. Count total payments
SELECT COUNT(*) AS total_payments FROM credit_card.payments;
-- 6. Count cards per client
SELECT client_id, COUNT(card_id) AS cards_per_client
FROM credit_card.credit_cards
GROUP BY client_id;
-- 7. Count transactions per merchant
SELECT merchant, COUNT(txn_id) AS txns_per_merchant
FROM credit_card.card_transactions
GROUP BY merchant;
-- 8. Count statements per card
SELECT card_id, COUNT(statement_id) AS statements_per_card
FROM credit_card.statements
GROUP BY card_id;
-- 9. Count payments per statement
SELECT statement_id, COUNT(payment_id) AS payments_per_statement
FROM credit_card.payments
GROUP BY statement_id;
-- 10. Count active vs blocked cards
SELECT status, COUNT(*) AS count_by_status
FROM credit_card.credit_cards
GROUP BY status;
-- 11. Count transactions by category
SELECT category, COUNT(*) AS count_by_category
FROM credit_card.card_transactions
GROUP BY category;
-- 12. Count clients who joined in 2023
SELECT COUNT(*) AS joined_2023
FROM credit_card.clients
WHERE YEAR(join_date) = 2023;
```

## Sum
```sql
-- 1. Sum of all transaction amounts
SELECT SUM(amount) AS total_spent FROM credit_card.card_transactions;
-- 2. Sum of charges (positive amounts)
SELECT SUM(amount) AS sum_charges
FROM credit_card.card_transactions
WHERE amount > 0;
-- 3. Sum of refunds (negative amounts)
SELECT SUM(amount) AS sum_refunds
FROM credit_card.card_transactions
WHERE amount < 0;
-- 4. Sum of closing balances across statements
SELECT SUM(closing_balance) AS total_closing_balance
FROM credit_card.statements;
-- 5. Sum of opening balances across statements
SELECT SUM(opening_balance) AS total_opening_balance
FROM credit_card.statements;
-- 6. Sum of payments per payment method
SELECT payment_method, SUM(amount) AS sum_by_method
FROM credit_card.payments
GROUP BY payment_method;
-- 7. Sum of credit_limit per card_type
SELECT card_type, SUM(credit_limit) AS sum_limit
FROM credit_card.credit_cards
GROUP BY card_type;
-- 8. Sum of minimum_due per due_date
SELECT due_date, SUM(minimum_due) AS sum_min_due
FROM credit_card.statements
GROUP BY due_date;
-- 9. Sum of transaction amounts per client
SELECT c.client_id, SUM(t.amount) AS sum_by_client
FROM credit_card.clients c
JOIN credit_card.credit_cards cc ON c.client_id = cc.client_id
JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
GROUP BY c.client_id;
-- 10. Sum of payments per client
SELECT c.client_id, SUM(p.amount) AS sum_paid
FROM credit_card.clients c
JOIN credit_card.credit_cards cc ON c.client_id = cc.client_id
JOIN credit_card.statements s ON cc.card_id = s.card_id
JOIN credit_card.payments p ON s.statement_id = p.statement_id
GROUP BY c.client_id;
-- 11. Sum of transaction amounts per category
SELECT category, SUM(amount) AS sum_by_category
FROM credit_card.card_transactions
GROUP BY category;
-- 12. Sum of minimum_due per client
SELECT cc.client_id, SUM(s.minimum_due) AS sum_min_due
FROM credit_card.statements s
JOIN credit_card.credit_cards cc ON s.card_id = cc.card_id
GROUP BY cc.client_id;
```

## Avg
```sql
-- 1. Average transaction amount
SELECT AVG(amount) AS avg_txn_amount FROM credit_card.card_transactions;
-- 2. Average charge amount (positive)
SELECT AVG(amount) AS avg_charge
FROM credit_card.card_transactions
WHERE amount > 0;
-- 3. Average refund amount (negative)
SELECT AVG(amount) AS avg_refund
FROM credit_card.card_transactions
WHERE amount < 0;
-- 4. Average closing balance
SELECT AVG(closing_balance) AS avg_closing_balance
FROM credit_card.statements;
-- 5. Average opening balance
SELECT AVG(opening_balance) AS avg_opening_balance
FROM credit_card.statements;
-- 6. Average payment amount
SELECT AVG(amount) AS avg_payment FROM credit_card.payments;
-- 7. Average credit_limit per client
SELECT client_id, AVG(credit_limit) AS avg_limit
FROM credit_card.credit_cards
GROUP BY client_id;
-- 8. Average minimum_due overall
SELECT AVG(minimum_due) AS avg_min_due
FROM credit_card.statements;
-- 9. Average transactions per client
SELECT c.client_id, AVG(txn_count) AS avg_txns
FROM (
  SELECT cc.client_id, COUNT(t.txn_id) AS txn_count
  FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  GROUP BY cc.client_id
) AS sub
GROUP BY c.client_id;
-- 10. Average payments per statement
SELECT statement_id, AVG(count_p) AS avg_payments
FROM (
  SELECT statement_id, COUNT(payment_id) AS count_p
  FROM credit_card.payments
  GROUP BY statement_id
) AS sub
GROUP BY statement_id;
-- 11. Average sum of transactions per card
SELECT card_id, AVG(total_by_card) AS avg_sum_txns
FROM (
  SELECT card_id, SUM(amount) AS total_by_card
  FROM credit_card.card_transactions
  GROUP BY card_id
) AS sub
GROUP BY card_id;
-- 12. Average days to pay a statement
SELECT AVG(DATEDIFF(day, s.statement_date, p.payment_date)) AS avg_days_to_pay
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id;
```

## Max
```sql
-- 1. Maximum transaction amount
SELECT MAX(amount) AS max_txn_amount FROM credit_card.card_transactions;
-- 2. Maximum closing_balance
SELECT MAX(closing_balance) AS max_closing_balance FROM credit_card.statements;
-- 3. Maximum opening_balance
SELECT MAX(opening_balance) AS max_opening_balance FROM credit_card.statements;
-- 4. Maximum payment amount
SELECT MAX(amount) AS max_payment FROM credit_card.payments;
-- 5. Maximum credit_limit
SELECT MAX(credit_limit) AS max_credit_limit FROM credit_card.credit_cards;
-- 6. Maximum minimum_due
SELECT MAX(minimum_due) AS max_minimum_due FROM credit_card.statements;
-- 7. Client with maximum cards
SELECT TOP 1 client_id, COUNT(card_id) AS max_cards
FROM credit_card.credit_cards
GROUP BY client_id
ORDER BY COUNT(card_id) DESC;
-- 8. Card with maximum total spend
SELECT TOP 1 card_id, SUM(amount) AS total_spent
FROM credit_card.card_transactions
GROUP BY card_id
ORDER BY SUM(amount) DESC;
-- 9. Statement with maximum payments
SELECT TOP 1 statement_id, COUNT(payment_id) AS payment_count
FROM credit_card.payments
GROUP BY statement_id
ORDER BY COUNT(payment_id) DESC;
-- 10. Merchant with largest single transaction
SELECT TOP 1 merchant, amount
FROM credit_card.card_transactions
ORDER BY amount DESC;
-- 11. Latest join_date
SELECT MAX(join_date) AS latest_join FROM credit_card.clients;
-- 12. Latest transaction date
SELECT MAX(txn_date) AS latest_txn FROM credit_card.card_transactions;
```

## Min
```sql
-- 1. Minimum transaction amount
SELECT MIN(amount) AS min_txn_amount FROM credit_card.card_transactions;
-- 2. Minimum closing_balance
SELECT MIN(closing_balance) AS min_closing_balance FROM credit_card.statements;
-- 3. Minimum opening_balance
SELECT MIN(opening_balance) AS min_opening_balance FROM credit_card.statements;
-- 4. Minimum payment amount
SELECT MIN(amount) AS min_payment FROM credit_card.payments;
-- 5. Minimum credit_limit
SELECT MIN(credit_limit) AS min_credit_limit FROM credit_card.credit_cards;
-- 6. Minimum minimum_due
SELECT MIN(minimum_due) AS min_minimum_due FROM credit_card.statements;
-- 7. Client with fewest cards
SELECT TOP 1 client_id, COUNT(card_id) AS card_count
FROM credit_card.credit_cards
GROUP BY client_id
ORDER BY COUNT(card_id) ASC;
-- 8. Card with smallest total spend
SELECT TOP 1 card_id, SUM(amount) AS total_spent
FROM credit_card.card_transactions
GROUP BY card_id
ORDER BY SUM(amount) ASC;
-- 9. Statement with fewest payments
SELECT TOP 1 statement_id, COUNT(payment_id) AS payment_count
FROM credit_card.payments
GROUP BY statement_id
ORDER BY COUNT(payment_id) ASC;
-- 10. Earliest join_date
SELECT MIN(join_date) AS earliest_join FROM credit_card.clients;
-- 11. Earliest transaction date
SELECT MIN(txn_date) AS earliest_txn FROM credit_card.card_transactions;
-- 12. Earliest payment date
SELECT MIN(payment_date) AS earliest_payment FROM credit_card.payments;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
