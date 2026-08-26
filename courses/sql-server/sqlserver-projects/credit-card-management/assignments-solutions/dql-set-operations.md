![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. Distinct client_ids who have transactions or payments
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
UNION
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.statements s ON cc.card_id = s.card_id
JOIN credit_card.payments p ON s.statement_id = p.statement_id;

-- 2. All card_ids that appear in transactions or in statements
SELECT DISTINCT card_id FROM credit_card.card_transactions
UNION
SELECT DISTINCT card_id FROM credit_card.statements;

-- 3. Merchants in June 2023 or July 2023
SELECT DISTINCT merchant FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-06-01' AND '2023-06-30'
UNION
SELECT DISTINCT merchant FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-07-01' AND '2023-07-31';

-- 4. All categories from transactions and all payment methods
SELECT category AS val FROM credit_card.card_transactions
UNION
SELECT payment_method FROM credit_card.payments;

-- 5. All expiry_dates of cards and due_dates of statements
SELECT expiry_date AS date_val FROM credit_card.credit_cards
UNION
SELECT due_date FROM credit_card.statements;

-- 6. Clients who joined before 2021 or after 2023
SELECT client_id FROM credit_card.clients WHERE join_date < '2021-01-01'
UNION
SELECT client_id FROM credit_card.clients WHERE join_date > '2023-01-01';

-- 7. Card_types for limits >15000 or limits <5000
SELECT card_type FROM credit_card.credit_cards WHERE credit_limit > 15000
UNION
SELECT card_type FROM credit_card.credit_cards WHERE credit_limit < 5000;

-- 8. Merchants for transactions >100 or <10
SELECT merchant FROM credit_card.card_transactions WHERE amount > 100
UNION
SELECT merchant FROM credit_card.card_transactions WHERE amount < 10;

-- 9. Contact values: emails and phone numbers
SELECT email AS contact FROM credit_card.clients
UNION
SELECT phone FROM credit_card.clients;

-- 10. Statement_ids from December cycle statements or payments
SELECT statement_id FROM credit_card.statements WHERE statement_date = '2023-12-01'
UNION
SELECT statement_id FROM credit_card.payments WHERE payment_date = '2023-12-20';
```

## Intersect
```sql
-- 1. Clients with both transactions and payments
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
INTERSECT
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.statements s ON cc.card_id = s.card_id
JOIN credit_card.payments p ON s.statement_id = p.statement_id;

-- 2. Card_ids present in both transactions and statements
SELECT DISTINCT card_id FROM credit_card.card_transactions
INTERSECT
SELECT DISTINCT card_id FROM credit_card.statements;

-- 3. Merchants used in both June and July 2023
SELECT merchant FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-06-01' AND '2023-06-30'
INTERSECT
SELECT merchant FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-07-01' AND '2023-07-31';

-- 4. Card_types common to high-limit cards and active cards
SELECT card_type FROM credit_card.credit_cards WHERE credit_limit > 5000
INTERSECT
SELECT card_type FROM credit_card.credit_cards WHERE status = 'Active';

-- 5. Categories in January and February 2023
SELECT DISTINCT category FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-01-01' AND '2023-01-31'
INTERSECT
SELECT DISTINCT category FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-02-01' AND '2023-02-28';

-- 6. Clients who joined in 2022 and also have transactions
SELECT client_id FROM credit_card.clients
WHERE join_date BETWEEN '2022-01-01' AND '2022-12-31'
INTERSECT
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.card_transactions t ON cc.card_id = t.card_id;

-- 7. Payment methods used in June and December 2023
SELECT DISTINCT payment_method FROM credit_card.payments
WHERE payment_date BETWEEN '2023-06-01' AND '2023-06-30'
INTERSECT
SELECT DISTINCT payment_method FROM credit_card.payments
WHERE payment_date BETWEEN '2023-12-01' AND '2023-12-31';

-- 8. Card_ids expiring after 2024-01-01 and with high limits
SELECT card_id FROM credit_card.credit_cards WHERE expiry_date > '2024-01-01'
INTERSECT
SELECT card_id FROM credit_card.credit_cards WHERE credit_limit > 10000;

-- 9. Merchants used by client 1 and client 2
SELECT t.merchant
FROM credit_card.card_transactions t
JOIN credit_card.credit_cards cc ON t.card_id = cc.card_id
WHERE cc.client_id = 1
INTERSECT
SELECT t.merchant
FROM credit_card.card_transactions t
JOIN credit_card.credit_cards cc ON t.card_id = cc.card_id
WHERE cc.client_id = 2;

-- 10. Statement_ids with closing_balance >1000 and due in December
SELECT statement_id FROM credit_card.statements WHERE closing_balance > 1000
INTERSECT
SELECT statement_id FROM credit_card.statements WHERE MONTH(due_date) = 12;
```

## Except
```sql
-- 1. Clients with transactions except those with payments
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
EXCEPT
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.statements s ON cc.card_id = s.card_id
JOIN credit_card.payments p ON s.statement_id = p.statement_id;

-- 2. Clients with payments except those with transactions
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.statements s ON cc.card_id = s.card_id
JOIN credit_card.payments p ON s.statement_id = p.statement_id
EXCEPT
SELECT DISTINCT cc.client_id
FROM credit_card.credit_cards cc
JOIN credit_card.card_transactions t ON cc.card_id = t.card_id;

-- 3. Card_ids in transactions but not in statements
SELECT DISTINCT card_id FROM credit_card.card_transactions
EXCEPT
SELECT DISTINCT card_id FROM credit_card.statements;

-- 4. Card_ids in statements but not in transactions
SELECT DISTINCT card_id FROM credit_card.statements
EXCEPT
SELECT DISTINCT card_id FROM credit_card.card_transactions;

-- 5. Merchants in June 2023 but not in July 2023
SELECT merchant FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-06-01' AND '2023-06-30'
EXCEPT
SELECT merchant FROM credit_card.card_transactions
WHERE txn_date BETWEEN '2023-07-01' AND '2023-07-31';

-- 6. Card_types for high-limit cards except Visa
SELECT card_type FROM credit_card.credit_cards WHERE credit_limit > 10000
EXCEPT
SELECT card_type FROM credit_card.credit_cards WHERE card_type = 'Visa';

-- 7. Categories used except Groceries
SELECT DISTINCT category FROM credit_card.card_transactions
EXCEPT
SELECT DISTINCT category FROM credit_card.card_transactions WHERE category = 'Groceries';

-- 8. December statements not paid by December 20
SELECT statement_id FROM credit_card.statements WHERE statement_date = '2023-12-01'
EXCEPT
SELECT statement_id FROM credit_card.payments WHERE payment_date = '2023-12-20';

-- 9. Clients who joined in 2023 except those who joined in January 2023
SELECT client_id FROM credit_card.clients WHERE join_date BETWEEN '2023-01-01' AND '2023-12-31'
EXCEPT
SELECT client_id FROM credit_card.clients WHERE join_date BETWEEN '2023-01-01' AND '2023-01-31';

-- 10. Payments on or before June 2023 except those via ACH
SELECT payment_id FROM credit_card.payments WHERE payment_date <= '2023-06-30'
EXCEPT
SELECT payment_id FROM credit_card.payments WHERE payment_method = 'ACH';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
