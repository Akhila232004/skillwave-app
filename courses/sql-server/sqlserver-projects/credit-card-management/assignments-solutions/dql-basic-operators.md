![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions

## Equality Operator (=)
```sql
-- 1. All active credit cards
SELECT * FROM credit_card.credit_cards WHERE status = 'Active';
-- 2. All dining transactions
SELECT * FROM credit_card.card_transactions WHERE category = 'Dining';
-- 3. Client with a specific email
SELECT * FROM credit_card.clients WHERE email = 'alice.green@example.com';
-- 4. Statements with minimum_due = 120.00
SELECT * FROM credit_card.statements WHERE minimum_due = 120.00;
-- 5. Payments made online
SELECT * FROM credit_card.payments WHERE payment_method = 'Online';
-- 6. Cards with credit_limit = 10000
SELECT * FROM credit_card.credit_cards WHERE credit_limit = 10000;
-- 7. Clients who joined on 2023-03-12
SELECT * FROM credit_card.clients WHERE join_date = '2023-03-12';
-- 8. Transactions in USD
SELECT * FROM credit_card.card_transactions WHERE currency = 'USD';
-- 9. Statements due on 2023-06-25
SELECT * FROM credit_card.statements WHERE due_date = '2023-06-25';
-- 10. Payments with amount equal to their statement's minimum_due
SELECT p.* 
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id
WHERE p.amount = s.minimum_due;
```

## Inequality Operator (<>)
```sql
-- 1. All non-active credit cards
SELECT * FROM credit_card.credit_cards WHERE status <> 'Active';
-- 2. Transactions not in Shopping category
SELECT * FROM credit_card.card_transactions WHERE category <> 'Shopping';
-- 3. Clients whose first name is not Alice
SELECT * FROM credit_card.clients WHERE first_name <> 'Alice';
-- 4. Transactions with non-zero amount
SELECT * FROM credit_card.card_transactions WHERE amount <> 0;
-- 5. Statements where opening_balance ≠ closing_balance
SELECT * FROM credit_card.statements WHERE opening_balance <> closing_balance;
-- 6. Payments not via ACH
SELECT * FROM credit_card.payments WHERE payment_method <> 'ACH';
-- 7. Cards where expiry_date ≠ issue_date
SELECT * FROM credit_card.credit_cards WHERE expiry_date <> issue_date;
-- 8. Clients whose email is not client20@example.com
SELECT * FROM credit_card.clients WHERE email <> 'client20@example.com';
-- 9. Statements with minimum_due ≠ 0
SELECT * FROM credit_card.statements WHERE minimum_due <> 0;
-- 10. Payments not matching amount 120
SELECT * FROM credit_card.payments WHERE amount <> 120.00;
```

## IN Operator
```sql
-- 1. Cards in Active or Blocked status
SELECT * FROM credit_card.credit_cards WHERE status IN ('Active','Blocked');
-- 2. Transactions in Groceries, Fuel, or Dining
SELECT * FROM credit_card.card_transactions WHERE category IN ('Groceries','Fuel','Dining');
-- 3. Clients with IDs 1,2,3
SELECT * FROM credit_card.clients WHERE client_id IN (1,2,3);
-- 4. Cards of type Visa or Amex
SELECT * FROM credit_card.credit_cards WHERE card_type IN ('Visa','Amex');
-- 5. Statements due on two specific dates
SELECT * FROM credit_card.statements WHERE due_date IN ('2023-06-25','2023-12-26');
-- 6. Payments via Online or ACH
SELECT * FROM credit_card.payments WHERE payment_method IN ('Online','ACH');
-- 7. Transactions at Amazon, Walmart, or Costco
SELECT * FROM credit_card.card_transactions WHERE merchant IN ('Amazon','Walmart','Costco');
-- 8. Statements with IDs 2001–2003
SELECT * FROM credit_card.statements WHERE statement_id IN (2001,2002,2003);
-- 9. Cards belonging to clients 1,5,10
SELECT * FROM credit_card.credit_cards WHERE client_id IN (1,5,10);
-- 10. Payments with IDs 3001–3003
SELECT * FROM credit_card.payments WHERE payment_id IN (3001,3002,3003);
```

## NOT IN Operator
```sql
-- 1. Cards not Cancelled or Blocked
SELECT * FROM credit_card.credit_cards WHERE status NOT IN ('Cancelled','Blocked');
-- 2. Transactions not in Entertainment or Travel
SELECT * FROM credit_card.card_transactions WHERE category NOT IN ('Entertainment','Travel');
-- 3. Clients excluding IDs 10,20,30
SELECT * FROM credit_card.clients WHERE client_id NOT IN (10,20,30);
-- 4. Cards not of type Visa
SELECT * FROM credit_card.credit_cards WHERE card_type NOT IN ('Visa');
-- 5. Statements not due on given dates
SELECT * FROM credit_card.statements WHERE due_date NOT IN ('2023-06-25','2023-12-26');
-- 6. Payments not by Check
SELECT * FROM credit_card.payments WHERE payment_method NOT IN ('Check');
-- 7. Transactions not at Uber or Delta
SELECT * FROM credit_card.card_transactions WHERE merchant NOT IN ('Uber','Delta');
-- 8. Statements excluding IDs 2016–2017
SELECT * FROM credit_card.statements WHERE statement_id NOT IN (2016,2017);
-- 9. Cards not belonging to clients 2,4,6
SELECT * FROM credit_card.credit_cards WHERE client_id NOT IN (2,4,6);
-- 10. Payments excluding IDs 3001–3002
SELECT * FROM credit_card.payments WHERE payment_id NOT IN (3001,3002);
```

## LIKE Operator
```sql
-- 1. Clients with example.com email
SELECT * FROM credit_card.clients WHERE email LIKE '%@example.com';
-- 2. Cards with numbers starting 'XXXX-XXXX-XXXX-1'
SELECT * FROM credit_card.credit_cards WHERE card_number LIKE 'XXXX-XXXX-XXXX-1%';
-- 3. Transactions at merchants beginning 'Star'
SELECT * FROM credit_card.card_transactions WHERE merchant LIKE 'Star%';
-- 4. Statements whose due_date ends in '-25'
SELECT * FROM credit_card.statements WHERE CONVERT(VARCHAR(10),due_date,120) LIKE '%-25';
-- 5. Payments with methods ending 'line'
SELECT * FROM credit_card.payments WHERE payment_method LIKE '%line';
-- 6. Clients whose last name starts with 'Br'
SELECT * FROM credit_card.clients WHERE last_name LIKE 'Br%';
-- 7. Transactions in categories ending 'ing'
SELECT * FROM credit_card.card_transactions WHERE category LIKE '%ing';
-- 8. Cards of types containing 'Card'
SELECT * FROM credit_card.credit_cards WHERE card_type LIKE '%Card';
-- 9. Payments with method exactly '__Online'
SELECT * FROM credit_card.payments WHERE payment_method LIKE '__Online';
-- 10. Clients with phone pattern '555-'
SELECT * FROM credit_card.clients WHERE phone LIKE '555-%';
```

## NOT LIKE Operator
```sql
-- 1. Clients without example.com email
SELECT * FROM credit_card.clients WHERE email NOT LIKE '%@example.com';
-- 2. Cards not starting with 'XXXX-XXXX-XXXX-1'
SELECT * FROM credit_card.credit_cards WHERE card_number NOT LIKE 'XXXX-XXXX-XXXX-1%';
-- 3. Transactions not at merchants ending 'store'
SELECT * FROM credit_card.card_transactions WHERE merchant NOT LIKE '%store';
-- 4. Statements whose due_date does not end in '-25'
SELECT * FROM credit_card.statements WHERE CONVERT(VARCHAR(10),due_date,120) NOT LIKE '%-25';
-- 5. Payments with methods not starting 'A'
SELECT * FROM credit_card.payments WHERE payment_method NOT LIKE 'A%';
-- 6. Clients whose last_name not starting 'B'
SELECT * FROM credit_card.clients WHERE last_name NOT LIKE 'B%';
-- 7. Transactions whose category not ending 'ies'
SELECT * FROM credit_card.card_transactions WHERE category NOT LIKE '%ies';
-- 8. Cards of types not containing 'Master'
SELECT * FROM credit_card.credit_cards WHERE card_type NOT LIKE '%Master%';
-- 9. Payments not ending in 'line'
SELECT * FROM credit_card.payments WHERE payment_method NOT LIKE '%line';
-- 10. Clients with phone not matching '555-%'
SELECT * FROM credit_card.clients WHERE phone NOT LIKE '555-%';
```

## BETWEEN Operator
```sql
-- 1. Transactions between $10 and $100
SELECT * FROM credit_card.card_transactions WHERE amount BETWEEN 10 AND 100;
-- 2. Statements with closing_balance between 1000 and 2000
SELECT * FROM credit_card.statements WHERE closing_balance BETWEEN 1000 AND 2000;
-- 3. Payments between $50 and $150
SELECT * FROM credit_card.payments WHERE amount BETWEEN 50 AND 150;
-- 4. Clients who joined in 2021–2022
SELECT * FROM credit_card.clients WHERE join_date BETWEEN '2021-01-01' AND '2022-12-31';
-- 5. Cards issued in 2022
SELECT * FROM credit_card.credit_cards WHERE issue_date BETWEEN '2022-01-01' AND '2022-12-31';
-- 6. Transactions in June 2023
SELECT * FROM credit_card.card_transactions WHERE txn_date BETWEEN '2023-06-01' AND '2023-06-30';
-- 7. Statements from June to December 2023
SELECT * FROM credit_card.statements WHERE statement_date BETWEEN '2023-06-01' AND '2023-12-01';
-- 8. Payments in second half 2023
SELECT * FROM credit_card.payments WHERE payment_date BETWEEN '2023-06-01' AND '2023-12-31';
-- 9. Cards with limits between 5000 and 15000
SELECT * FROM credit_card.credit_cards WHERE credit_limit BETWEEN 5000 AND 15000;
-- 10. Refund transactions (negative) between -100 and 0
SELECT * FROM credit_card.card_transactions WHERE amount BETWEEN -100 AND 0;
```

## Greater Than (>)
```sql
-- 1. High-value transactions (>1000)
SELECT * FROM credit_card.card_transactions WHERE amount > 1000;
-- 2. Statements where closing_balance > opening_balance
SELECT * FROM credit_card.statements WHERE closing_balance > opening_balance;
-- 3. Payments greater than their minimum_due
SELECT p.* 
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id
WHERE p.amount > s.minimum_due;
-- 4. Cards with credit_limit >10000
SELECT * FROM credit_card.credit_cards WHERE credit_limit > 10000;
-- 5. Clients older than 40 years
SELECT * FROM credit_card.clients 
WHERE DATEDIFF(year,date_of_birth,GETDATE()) > 40;
-- 6. Transactions after July 1 2023
SELECT * FROM credit_card.card_transactions WHERE txn_date > '2023-07-01';
-- 7. Statements with min_due >100
SELECT * FROM credit_card.statements WHERE minimum_due > 100;
-- 8. Payments with ID >3000
SELECT * FROM credit_card.payments WHERE payment_id > 3000;
-- 9. Cards expiring after 2024-01-01
SELECT * FROM credit_card.credit_cards WHERE expiry_date > '2024-01-01';
-- 10. Transactions above average amount
SELECT * FROM credit_card.card_transactions 
WHERE amount > (SELECT AVG(amount) FROM credit_card.card_transactions);
```

## Greater Than or Equal To (>=)
```sql
-- 1. Transactions ≥100
SELECT * FROM credit_card.card_transactions WHERE amount >= 100;
-- 2. Statements with min_due ≥100
SELECT * FROM credit_card.statements WHERE minimum_due >= 100;
-- 3. Payments ≥ their minimum_due
SELECT p.* 
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id
WHERE p.amount >= s.minimum_due;
-- 4. Cards with credit_limit ≥15000
SELECT * FROM credit_card.credit_cards WHERE credit_limit >= 15000;
-- 5. Clients joined on or after 2022-01-01
SELECT * FROM credit_card.clients WHERE join_date >= '2022-01-01';
-- 6. Transactions on or after 2023-01-01
SELECT * FROM credit_card.card_transactions WHERE txn_date >= '2023-01-01';
-- 7. Statements with closing_balance ≥1200
SELECT * FROM credit_card.statements WHERE closing_balance >= 1200;
-- 8. Payments on or after 2023-06-20
SELECT * FROM credit_card.payments WHERE payment_date >= '2023-06-20';
-- 9. Cards issued on or after 2022-06-01
SELECT * FROM credit_card.credit_cards WHERE issue_date >= '2022-06-01';
-- 10. Transactions ≥ average amount
SELECT * FROM credit_card.card_transactions 
WHERE amount >= (SELECT AVG(amount) FROM credit_card.card_transactions);
```

## Less Than (<)
```sql
-- 1. Small transactions (<20)
SELECT * FROM credit_card.card_transactions WHERE amount < 20;
-- 2. Low closing balances (<500)
SELECT * FROM credit_card.statements WHERE closing_balance < 500;
-- 3. Payments < their minimum_due
SELECT p.* 
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id
WHERE p.amount < s.minimum_due;
-- 4. Cards with limit <10000
SELECT * FROM credit_card.credit_cards WHERE credit_limit < 10000;
-- 5. Clients younger than 30
SELECT * FROM credit_card.clients 
WHERE DATEDIFF(year,date_of_birth,GETDATE()) < 30;
-- 6. Transactions before 2023-06-01
SELECT * FROM credit_card.card_transactions WHERE txn_date < '2023-06-01';
-- 7. Statements with min_due <50
SELECT * FROM credit_card.statements WHERE minimum_due < 50;
-- 8. Payments with ID <3050
SELECT * FROM credit_card.payments WHERE payment_id < 3050;
-- 9. Cards expiring before 2025-01-01
SELECT * FROM credit_card.credit_cards WHERE expiry_date < '2025-01-01';
-- 10. Transactions below average amount
SELECT * FROM credit_card.card_transactions 
WHERE amount < (SELECT AVG(amount) FROM credit_card.card_transactions);
```

## Less Than or Equal To (<=)
```sql
-- 1. Transactions ≤100
SELECT * FROM credit_card.card_transactions WHERE amount <= 100;
-- 2. Statements with min_due ≤120
SELECT * FROM credit_card.statements WHERE minimum_due <= 120;
-- 3. Payments ≤ their minimum_due
SELECT p.* 
FROM credit_card.payments p
JOIN credit_card.statements s ON p.statement_id = s.statement_id
WHERE p.amount <= s.minimum_due;
-- 4. Cards with limit ≤15000
SELECT * FROM credit_card.credit_cards WHERE credit_limit <= 15000;
-- 5. Clients joined on or before 2023-01-01
SELECT * FROM credit_card.clients WHERE join_date <= '2023-01-01';
-- 6. Transactions on or before 2023-07-31
SELECT * FROM credit_card.card_transactions WHERE txn_date <= '2023-07-31';
-- 7. Statements with closing_balance ≤1000
SELECT * FROM credit_card.statements WHERE closing_balance <= 1000;
-- 8. Payments on or before 2023-06-20
SELECT * FROM credit_card.payments WHERE payment_date <= '2023-06-20';
-- 9. Cards issued on or before 2022-06-15
SELECT * FROM credit_card.credit_cards WHERE issue_date <= '2022-06-15';
-- 10. Transactions ≤ average amount
SELECT * FROM credit_card.card_transactions 
WHERE amount <= (SELECT AVG(amount) FROM credit_card.card_transactions);
```

## EXISTS Operator
```sql
-- 1. Clients with at least one card
SELECT * FROM credit_card.clients c
WHERE EXISTS (SELECT 1 FROM credit_card.credit_cards cc WHERE cc.client_id = c.client_id);
-- 2. Cards having any transactions
SELECT * FROM credit_card.credit_cards cc
WHERE EXISTS (SELECT 1 FROM credit_card.card_transactions t WHERE t.card_id = cc.card_id);
-- 3. Clients with statements
SELECT * FROM credit_card.clients c
WHERE EXISTS (
  SELECT 1 FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  WHERE cc.client_id = c.client_id
);
-- 4. Cards with payments via statements
SELECT * FROM credit_card.credit_cards cc
WHERE EXISTS (
  SELECT 1 FROM credit_card.statements s
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  WHERE s.card_id = cc.card_id
);
-- 5. Cards that have Fuel transactions
SELECT DISTINCT cc.card_id FROM credit_card.credit_cards cc
WHERE EXISTS (
  SELECT 1 FROM credit_card.card_transactions t
  WHERE t.card_id = cc.card_id AND t.category = 'Fuel'
);
-- 6. Clients who used ACH payments
SELECT * FROM credit_card.clients c
WHERE EXISTS (
  SELECT 1 FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  WHERE p.payment_method = 'ACH' AND cc.client_id = c.client_id
);
-- 7. Cards already expired
SELECT * FROM credit_card.credit_cards cc
WHERE EXISTS (
  SELECT 1 FROM credit_card.credit_cards c2
  WHERE c2.card_id = cc.card_id AND c2.expiry_date < GETDATE()
);
-- 8. Statements linked to transactions
SELECT * FROM credit_card.statements s
WHERE EXISTS (
  SELECT 1 FROM credit_card.card_transactions t
  WHERE t.card_id = s.card_id
);
-- 9. Payments with valid statements
SELECT * FROM credit_card.payments p
WHERE EXISTS (
  SELECT 1 FROM credit_card.statements s
  WHERE s.statement_id = p.statement_id
);
-- 10. Clients with any transactions
SELECT * FROM credit_card.clients c
WHERE EXISTS (
  SELECT 1 FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  WHERE cc.client_id = c.client_id
);
```

## NOT EXISTS Operator
```sql
-- 1. Clients with no cards
SELECT * FROM credit_card.clients c
WHERE NOT EXISTS (SELECT 1 FROM credit_card.credit_cards cc WHERE cc.client_id = c.client_id);
-- 2. Cards with no transactions
SELECT * FROM credit_card.credit_cards cc
WHERE NOT EXISTS (SELECT 1 FROM credit_card.card_transactions t WHERE t.card_id = cc.card_id);
-- 3. Clients with no payments
SELECT * FROM credit_card.clients c
WHERE NOT EXISTS (
  SELECT 1 FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  WHERE cc.client_id = c.client_id
);
-- 4. Cards with no statements
SELECT * FROM credit_card.credit_cards cc
WHERE NOT EXISTS (SELECT 1 FROM credit_card.statements s WHERE s.card_id = cc.card_id);
-- 5. Statements with no payments
SELECT * FROM credit_card.statements s
WHERE NOT EXISTS (SELECT 1 FROM credit_card.payments p WHERE p.statement_id = s.statement_id);
-- 6. Categories with no refunds
SELECT DISTINCT category FROM credit_card.card_transactions ct
WHERE NOT EXISTS (
  SELECT 1 FROM credit_card.card_transactions t
  WHERE t.category = ct.category AND t.amount < 0
);
-- 7. Clients who never made a transaction
SELECT * FROM credit_card.clients c
WHERE NOT EXISTS (
  SELECT 1 FROM credit_card.credit_cards cc
  JOIN credit_card.card_transactions t ON cc.card_id = t.card_id
  WHERE cc.client_id = c.client_id
);
-- 8. Cards with no high-value transactions (>1000)
SELECT * FROM credit_card.credit_cards cc
WHERE NOT EXISTS (
  SELECT 1 FROM credit_card.card_transactions t
  WHERE t.card_id = cc.card_id AND t.amount > 1000
);
-- 9. Clients who never used Online payments
SELECT * FROM credit_card.clients c
WHERE NOT EXISTS (
  SELECT 1 FROM credit_card.credit_cards cc
  JOIN credit_card.statements s ON cc.card_id = s.card_id
  JOIN credit_card.payments p ON s.statement_id = p.statement_id
  WHERE p.payment_method = 'Online' AND cc.client_id = c.client_id
);
-- 10. Statements where closing_balance ≤ opening_balance
SELECT * FROM credit_card.statements s
WHERE NOT EXISTS (
  SELECT 1 FROM credit_card.statements s2
  WHERE s2.statement_id = s.statement_id AND s2.closing_balance > s2.opening_balance
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
