![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions

## Equality Operator (=)
```sql
-- 1. List clients named 'Alice'.
SELECT * FROM wealth_management.clients WHERE first_name = 'Alice';
-- 2. Find accounts of type 'Checking'.
SELECT * FROM wealth_management.accounts WHERE account_type = 'Checking';
-- 3. Get the 'Retirement Mix' portfolio.
SELECT * FROM wealth_management.portfolios WHERE name = 'Retirement Mix';
-- 4. Show asset with symbol 'AAPL'.
SELECT * FROM wealth_management.assets WHERE symbol = 'AAPL';
-- 5. Find portfolio_assets with quantity = 100.
SELECT * FROM wealth_management.portfolio_assets WHERE quantity = 100;
-- 6. List all 'Deposit' transactions.
SELECT * FROM wealth_management.transactions WHERE txn_type = 'Deposit';
-- 7. Get financial goals in status 'In Progress'.
SELECT * FROM wealth_management.financial_goals WHERE status = 'In Progress';
-- 8. Clients who joined on '2022-01-15'.
SELECT * FROM wealth_management.clients WHERE join_date = '2022-01-15';
-- 9. Accounts opened on '2021-06-30'.
SELECT * FROM wealth_management.accounts WHERE opened_date = '2021-06-30';
-- 10. Goals with target_date = '2030-06-30'.
SELECT * FROM wealth_management.financial_goals WHERE target_date = '2030-06-30';
```

## Inequality Operator (<>)
```sql
-- 1. Clients whose last name is not 'Green'.
SELECT * FROM wealth_management.clients WHERE last_name <> 'Green';
-- 2. Accounts where status is not 'Closed'.
SELECT * FROM wealth_management.accounts WHERE status <> 'Closed';
-- 3. Portfolios not named 'Growth Stocks'.
SELECT * FROM wealth_management.portfolios WHERE name <> 'Growth Stocks';
-- 4. Assets not of type 'ETF'.
SELECT * FROM wealth_management.assets WHERE asset_type <> 'ETF';
-- 5. Portfolio_assets where acquisition_price <> 100.00.
SELECT * FROM wealth_management.portfolio_assets WHERE acquisition_price <> 100.00;
-- 6. Transactions not of type 'Sell'.
SELECT * FROM wealth_management.transactions WHERE txn_type <> 'Sell';
-- 7. Goals where current_amount <> 0.
SELECT * FROM wealth_management.financial_goals WHERE current_amount <> 0;
-- 8. Clients whose email is not 'alice.green@example.com'.
SELECT * FROM wealth_management.clients WHERE email <> 'alice.green@example.com';
-- 9. Accounts for client_id not equal to 1.
SELECT * FROM wealth_management.accounts WHERE client_id <> 1;
-- 10. Portfolios with client_id not equal to 2.
SELECT * FROM wealth_management.portfolios WHERE client_id <> 2;
```

## IN Operator
```sql
-- 1. Clients with IDs 1, 2, or 3.
SELECT * FROM wealth_management.clients WHERE client_id IN (1,2,3);
-- 2. Accounts of type Checking or Savings.
SELECT * FROM wealth_management.accounts WHERE account_type IN ('Checking','Savings');
-- 3. Portfolios named 'Retirement Mix' or 'Growth Stocks'.
SELECT * FROM wealth_management.portfolios WHERE name IN ('Retirement Mix','Growth Stocks');
-- 4. Assets with symbols AAPL, GOOG, MSFT.
SELECT * FROM wealth_management.assets WHERE symbol IN ('AAPL','GOOG','MSFT');
-- 5. Portfolio_assets for asset_ids 301,302,303.
SELECT * FROM wealth_management.portfolio_assets WHERE asset_id IN (301,302,303);
-- 6. Transactions of amounts 5000.00, 3000.00, or 4500.00.
SELECT * FROM wealth_management.transactions WHERE amount IN (5000.00,3000.00,4500.00);
-- 7. Goals with status In Progress or Paused.
SELECT * FROM wealth_management.financial_goals WHERE status IN ('In Progress','Paused');
-- 8. Clients with last names Green, Lee, Ng.
SELECT * FROM wealth_management.clients WHERE last_name IN ('Green','Lee','Ng');
-- 9. Accounts with IDs 101 or 102.
SELECT * FROM wealth_management.accounts WHERE account_id IN (101,102);
-- 10. Portfolios with IDs 201,202,203.
SELECT * FROM wealth_management.portfolios WHERE portfolio_id IN (201,202,203);
```

## NOT IN Operator
```sql
-- 1. Clients excluding IDs 1,2,3.
SELECT * FROM wealth_management.clients WHERE client_id NOT IN (1,2,3);
-- 2. Accounts with status not in 'Closed'.
SELECT * FROM wealth_management.accounts WHERE status NOT IN ('Closed');
-- 3. Portfolios not belonging to clients 1 or 2.
SELECT * FROM wealth_management.portfolios WHERE client_id NOT IN (1,2);
-- 4. Assets excluding symbols AAPL, GOOG.
SELECT * FROM wealth_management.assets WHERE symbol NOT IN ('AAPL','GOOG');
-- 5. Portfolio_assets excluding portfolio_ids 201,202.
SELECT * FROM wealth_management.portfolio_assets WHERE portfolio_id NOT IN (201,202);
-- 6. Transactions not of types Buy or Sell.
SELECT * FROM wealth_management.transactions WHERE txn_type NOT IN ('Buy','Sell');
-- 7. Goals not in status 'Achieved'.
SELECT * FROM wealth_management.financial_goals WHERE status NOT IN ('Achieved');
-- 8. Clients excluding two emails.
SELECT * FROM wealth_management.clients WHERE email NOT IN ('alice.green@example.com','bob.lee@example.com');
-- 9. Accounts not of type 'Brokerage'.
SELECT * FROM wealth_management.accounts WHERE account_type NOT IN ('Brokerage');
-- 10. Portfolios not created on these dates.
SELECT * FROM wealth_management.portfolios WHERE created_date NOT IN ('2022-01-20','2022-02-01');
```

## LIKE Operator
```sql
-- 1. Emails ending @example.com.
SELECT * FROM wealth_management.clients WHERE email LIKE '%@example.com';
-- 2. Account types starting with 'Brok'.
SELECT * FROM wealth_management.accounts WHERE account_type LIKE 'Brok%';
-- 3. Portfolio names ending in 'Fund'.
SELECT * FROM wealth_management.portfolios WHERE name LIKE '%Fund';
-- 4. Asset names containing 'Inc.'.
SELECT * FROM wealth_management.assets WHERE name LIKE '%Inc.%';
-- 5. Quantities starting with 1.
SELECT * FROM wealth_management.portfolio_assets WHERE CAST(quantity AS VARCHAR(10)) LIKE '1%';
-- 6. Descriptions containing 'deposit'.
SELECT * FROM wealth_management.transactions WHERE description LIKE '%deposit%';
-- 7. Goal names containing 'Retirement'.
SELECT * FROM wealth_management.financial_goals WHERE goal_name LIKE '%Retirement%';
-- 8. First names starting with 'A'.
SELECT * FROM wealth_management.clients WHERE first_name LIKE 'A%';
-- 9. Symbols with second letter O.
SELECT * FROM wealth_management.assets WHERE symbol LIKE '_O%';
-- 10. Portfolio names containing 'Mix'.
SELECT * FROM wealth_management.portfolios WHERE name LIKE '%Mix%';
```

## NOT LIKE Operator
```sql
-- 1. Emails not ending @example.com.
SELECT * FROM wealth_management.clients WHERE email NOT LIKE '%@example.com';
-- 2. Accounts not 'Active'.
SELECT * FROM wealth_management.accounts WHERE status NOT LIKE 'Active';
-- 3. Portfolios not ending in 'Fund'.
SELECT * FROM wealth_management.portfolios WHERE name NOT LIKE '%Fund';
-- 4. Asset types not starting with 'St'.
SELECT * FROM wealth_management.assets WHERE asset_type NOT LIKE 'St%';
-- 5. Descriptions not containing 'Buy'.
SELECT * FROM wealth_management.transactions WHERE description NOT LIKE '%Buy%';
-- 6. Goals not containing 'Fund'.
SELECT * FROM wealth_management.financial_goals WHERE goal_name NOT LIKE '%Fund';
-- 7. First names not starting with 'A'.
SELECT * FROM wealth_management.clients WHERE first_name NOT LIKE 'A%';
-- 8. Symbols not containing 'A'.
SELECT * FROM wealth_management.assets WHERE symbol NOT LIKE '%A%';
-- 9. Portfolio names not ending in 'Mix'.
SELECT * FROM wealth_management.portfolios WHERE name NOT LIKE '%Mix';
-- 10. Account types not containing 'ing'.
SELECT * FROM wealth_management.accounts WHERE account_type NOT LIKE '%ing';
```

## BETWEEN Operator
```sql
-- 1. Transactions amount between 1000 and 5000.
SELECT * FROM wealth_management.transactions WHERE amount BETWEEN 1000 AND 5000;
-- 2. Accounts opened between 2021-01-01 and 2022-12-31.
SELECT * FROM wealth_management.accounts WHERE opened_date BETWEEN '2021-01-01' AND '2022-12-31';
-- 3. Clients born between 1980-01-01 and 1990-12-31.
SELECT * FROM wealth_management.clients WHERE date_of_birth BETWEEN '1980-01-01' AND '1990-12-31';
-- 4. Prices between 100 and 200.
SELECT * FROM wealth_management.portfolio_assets WHERE acquisition_price BETWEEN 100 AND 200;
-- 5. Portfolios created between 2020-01-01 and 2021-12-31.
SELECT * FROM wealth_management.portfolios WHERE created_date BETWEEN '2020-01-01' AND '2021-12-31';
-- 6. Goals with target_amount between 50000 and 200000.
SELECT * FROM wealth_management.financial_goals WHERE target_amount BETWEEN 50000 AND 200000;
-- 7. Assets with IDs between 300 and 310.
SELECT * FROM wealth_management.assets WHERE asset_id BETWEEN 300 AND 310;
-- 8. Transactions in 2022.
SELECT * FROM wealth_management.transactions WHERE txn_date BETWEEN '2022-01-01' AND '2022-12-31';
-- 9. Clients joined between 2020-01-01 and 2023-12-31.
SELECT * FROM wealth_management.clients WHERE join_date BETWEEN '2020-01-01' AND '2023-12-31';
-- 10. Accounts with IDs between 105 and 115.
SELECT * FROM wealth_management.accounts WHERE account_id BETWEEN 105 AND 115;
```

## Greater Than (>)
```sql
-- 1. Portfolio_assets with quantity > 100.
SELECT * FROM wealth_management.portfolio_assets WHERE quantity > 100;
-- 2. Transactions with amount > 1000.
SELECT * FROM wealth_management.transactions WHERE amount > 1000;
-- 3. Goals with current_amount > 50000.
SELECT * FROM wealth_management.financial_goals WHERE current_amount > 50000;
-- 4. Clients born after 1990-01-01.
SELECT * FROM wealth_management.clients WHERE date_of_birth > '1990-01-01';
-- 5. Accounts with ID > 120.
SELECT * FROM wealth_management.accounts WHERE account_id > 120;
-- 6. Assets with ID > 315.
SELECT * FROM wealth_management.assets WHERE asset_id > 315;
-- 7. Portfolios created after 2022-06-01.
SELECT * FROM wealth_management.portfolios WHERE created_date > '2022-06-01';
-- 8. Transactions after 2023-01-01.
SELECT * FROM wealth_management.transactions WHERE txn_date > '2023-01-01';
-- 9. Clients who joined after 2021-01-01.
SELECT * FROM wealth_management.clients WHERE join_date > '2021-01-01';
-- 10. Prices greater than 300.
SELECT * FROM wealth_management.portfolio_assets WHERE acquisition_price > 300;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Clients with ID >= 10.
SELECT * FROM wealth_management.clients WHERE client_id >= 10;
-- 2. Accounts opened on or after 2021-06-30.
SELECT * FROM wealth_management.accounts WHERE opened_date >= '2021-06-30';
-- 3. Portfolios with ID >= 205.
SELECT * FROM wealth_management.portfolios WHERE portfolio_id >= 205;
-- 4. Assets with ID >= 310.
SELECT * FROM wealth_management.assets WHERE asset_id >= 310;
-- 5. Portfolio_assets with quantity >= 150.
SELECT * FROM wealth_management.portfolio_assets WHERE quantity >= 150;
-- 6. Transactions with amount >= 2000.
SELECT * FROM wealth_management.transactions WHERE amount >= 2000;
-- 7. Goals with target_amount >= 100000.
SELECT * FROM wealth_management.financial_goals WHERE target_amount >= 100000;
-- 8. Clients born on or after 1985-01-01.
SELECT * FROM wealth_management.clients WHERE date_of_birth >= '1985-01-01';
-- 9. Accounts with ID >= 110.
SELECT * FROM wealth_management.accounts WHERE account_id >= 110;
-- 10. Transactions on or after 2022-07-01.
SELECT * FROM wealth_management.transactions WHERE txn_date >= '2022-07-01';
```

## Less Than (<)
```sql
-- 1. Clients born before 1990-01-01.
SELECT * FROM wealth_management.clients WHERE date_of_birth < '1990-01-01';
-- 2. Accounts opened before 2021-01-01.
SELECT * FROM wealth_management.accounts WHERE opened_date < '2021-01-01';
-- 3. Portfolios created before 2021-01-01.
SELECT * FROM wealth_management.portfolios WHERE created_date < '2021-01-01';
-- 4. Assets with ID < 310.
SELECT * FROM wealth_management.assets WHERE asset_id < 310;
-- 5. Portfolio_assets with quantity < 50.
SELECT * FROM wealth_management.portfolio_assets WHERE quantity < 50;
-- 6. Transactions with negative amounts.
SELECT * FROM wealth_management.transactions WHERE amount < 0;
-- 7. Goals with current_amount < 20000.
SELECT * FROM wealth_management.financial_goals WHERE current_amount < 20000;
-- 8. Accounts with ID < 105.
SELECT * FROM wealth_management.accounts WHERE account_id < 105;
-- 9. Clients who joined before 2021-01-01.
SELECT * FROM wealth_management.clients WHERE join_date < '2021-01-01';
-- 10. Portfolios with ID < 210.
SELECT * FROM wealth_management.portfolios WHERE portfolio_id < 210;
```

## Less Than or Equal To (<=)
```sql
-- 1. Clients born on or before 1990-12-31.
SELECT * FROM wealth_management.clients WHERE date_of_birth <= '1990-12-31';
-- 2. Accounts opened on or before 2022-05-20.
SELECT * FROM wealth_management.accounts WHERE opened_date <= '2022-05-20';
-- 3. Portfolios created on or before 2022-07-01.
SELECT * FROM wealth_management.portfolios WHERE created_date <= '2022-07-01';
-- 4. Assets with ID <= 305.
SELECT * FROM wealth_management.assets WHERE asset_id <= 305;
-- 5. Portfolio_assets with quantity <= 100.
SELECT * FROM wealth_management.portfolio_assets WHERE quantity <= 100;
-- 6. Transactions with amount <= 500.
SELECT * FROM wealth_management.transactions WHERE amount <= 500;
-- 7. Goals with current_amount <= 50000.
SELECT * FROM wealth_management.financial_goals WHERE current_amount <= 50000;
-- 8. Accounts with ID <= 115.
SELECT * FROM wealth_management.accounts WHERE account_id <= 115;
-- 9. Clients who joined on or before 2022-01-15.
SELECT * FROM wealth_management.clients WHERE join_date <= '2022-01-15';
-- 10. Transactions on or before 2022-03-05.
SELECT * FROM wealth_management.transactions WHERE txn_date <= '2022-03-05';
```

## EXISTS Operator
```sql
-- 1. Clients having at least one account.
SELECT * FROM wealth_management.clients c
WHERE EXISTS (SELECT 1 FROM wealth_management.accounts a WHERE a.client_id = c.client_id);
-- 2. Clients having at least one transaction.
SELECT * FROM wealth_management.clients c
WHERE EXISTS (
  SELECT 1 FROM wealth_management.accounts a
  JOIN wealth_management.transactions t ON a.account_id = t.account_id
  WHERE a.client_id = c.client_id
);
-- 3. Portfolios that contain assets.
SELECT * FROM wealth_management.portfolios p
WHERE EXISTS (SELECT 1 FROM wealth_management.portfolio_assets pa WHERE pa.portfolio_id = p.portfolio_id);
-- 4. Assets held in any portfolio.
SELECT * FROM wealth_management.assets a
WHERE EXISTS (SELECT 1 FROM wealth_management.portfolio_assets pa WHERE pa.asset_id = a.asset_id);
-- 5. Accounts with deposits.
SELECT * FROM wealth_management.accounts a
WHERE EXISTS (SELECT 1 FROM wealth_management.transactions t WHERE t.account_id = a.account_id AND t.amount > 0);
-- 6. Accounts with withdrawals.
SELECT * FROM wealth_management.accounts a
WHERE EXISTS (SELECT 1 FROM wealth_management.transactions t WHERE t.account_id = a.account_id AND t.amount < 0);
-- 7. Clients with financial goals.
SELECT * FROM wealth_management.clients c
WHERE EXISTS (SELECT 1 FROM wealth_management.financial_goals f WHERE f.client_id = c.client_id);
-- 8. Goals linked to clients.
SELECT * FROM wealth_management.financial_goals f
WHERE EXISTS (SELECT 1 FROM wealth_management.clients c WHERE c.client_id = f.client_id);
-- 9. Transactions for valid accounts.
SELECT * FROM wealth_management.transactions t
WHERE EXISTS (SELECT 1 FROM wealth_management.accounts a WHERE a.account_id = t.account_id);
-- 10. Portfolio_assets for valid portfolios.
SELECT * FROM wealth_management.portfolio_assets pa
WHERE EXISTS (SELECT 1 FROM wealth_management.portfolios p WHERE p.portfolio_id = pa.portfolio_id);
```

## NOT EXISTS Operator
```sql
-- 1. Clients with no accounts.
SELECT * FROM wealth_management.clients c
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.accounts a WHERE a.client_id = c.client_id);
-- 2. Clients with no transactions.
SELECT * FROM wealth_management.clients c
WHERE NOT EXISTS (
  SELECT 1 FROM wealth_management.accounts a
  JOIN wealth_management.transactions t ON a.account_id = t.account_id
  WHERE a.client_id = c.client_id
);
-- 3. Portfolios with no assets.
SELECT * FROM wealth_management.portfolios p
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.portfolio_assets pa WHERE pa.portfolio_id = p.portfolio_id);
-- 4. Assets not held by any portfolio.
SELECT * FROM wealth_management.assets a
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.portfolio_assets pa WHERE pa.asset_id = a.asset_id);
-- 5. Accounts with no transactions.
SELECT * FROM wealth_management.accounts a
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.transactions t WHERE t.account_id = a.account_id);
-- 6. Clients with no financial goals.
SELECT * FROM wealth_management.clients c
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.financial_goals f WHERE f.client_id = c.client_id);
-- 7. Goals not linked to any client.
SELECT * FROM wealth_management.financial_goals f
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.clients c WHERE c.client_id = f.client_id);
-- 8. Transactions without a closed account.
SELECT * FROM wealth_management.transactions t
WHERE NOT EXISTS (
  SELECT 1 FROM wealth_management.accounts a
  WHERE a.account_id = t.account_id AND a.status = 'Closed'
);
-- 9. Portfolio_assets without valid assets.
SELECT * FROM wealth_management.portfolio_assets pa
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.assets a WHERE a.asset_id = pa.asset_id);
-- 10. Portfolios without any clients.
SELECT * FROM wealth_management.portfolios p
WHERE NOT EXISTS (SELECT 1 FROM wealth_management.clients c WHERE c.client_id = p.client_id);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
