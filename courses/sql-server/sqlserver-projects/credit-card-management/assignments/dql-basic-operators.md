![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. All active credit cards
2. All dining transactions
3. Client with a specific email
4. Statements with minimum_due = 120.00
5. Payments made online
6. Cards with credit_limit = 10000
7. Clients who joined on 2023-03-12
8. Transactions in USD
9. Statements due on 2023-06-25
10. Payments with amount equal to their statement's minimum_due

## Inequality Operator (<>)
1. All non-active credit cards
2. Transactions not in Shopping category
3. Clients whose first name is not Alice
4. Transactions with non-zero amount
5. Statements where opening_balance ≠ closing_balance
6. Payments not via ACH
7. Cards where expiry_date ≠ issue_date
8. Clients whose email is not client20@example.com
9. Statements with minimum_due ≠ 0
10. Payments not matching amount 120

## IN Operator
1. Cards in Active or Blocked status
2. Transactions in Groceries, Fuel, or Dining
3. Clients with IDs 1,2,3
4. Cards of type Visa or Amex
5. Statements due on two specific dates
6. Payments via Online or ACH
7. Transactions at Amazon, Walmart, or Costco
8. Statements with IDs 2001–2003
9. Cards belonging to clients 1,5,10
10. Payments with IDs 3001–3003

## NOT IN Operator
1. Cards not Cancelled or Blocked
2. Transactions not in Entertainment or Travel
3. Clients excluding IDs 10,20,30
4. Cards not of type Visa
5. Statements not due on given dates
6. Payments not by Check
7. Transactions not at Uber or Delta
8. Statements excluding IDs 2016–2017
9. Cards not belonging to clients 2,4,6
10. Payments excluding IDs 3001–3002

## LIKE Operator
1. Clients with example.com email
2. Cards with numbers starting 'XXXX-XXXX-XXXX-1'
3. Transactions at merchants beginning 'Star'
4. Statements whose due_date ends in '-25'
5. Payments with methods ending 'line'
6. Clients whose last name starts with 'Br'
7. Transactions in categories ending 'ing'
8. Cards of types containing 'Card'
9. Payments with method exactly '__Online'
10. Clients with phone pattern '555-'

## NOT LIKE Operator
1. Clients without example.com email
2. Cards not starting with 'XXXX-XXXX-XXXX-1'
3. Transactions not at merchants ending 'store'
4. Statements whose due_date does not end in '-25'
5. Payments with methods not starting 'A'
6. Clients whose last_name not starting 'B'
7. Transactions whose category not ending 'ies'
8. Cards of types not containing 'Master'
9. Payments not ending in 'line'
10. Clients with phone not matching '555-%'

## BETWEEN Operator
1. Transactions between $10 and $100
2. Statements with closing_balance between 1000 and 2000
3. Payments between $50 and $150
4. Clients who joined in 2021–2022
5. Cards issued in 2022
6. Transactions in June 2023
7. Statements from June to December 2023
8. Payments in second half 2023
9. Cards with limits between 5000 and 15000
10. Refund transactions (negative) between -100 and 0

## Greater Than (>)
1. High-value transactions (>1000)
2. Statements where closing_balance > opening_balance
3. Payments greater than their minimum_due
4. Cards with credit_limit >10000
5. Clients older than 40 years
6. Transactions after July 1 2023
7. Statements with min_due >100
8. Payments with ID >3000
9. Cards expiring after 2024-01-01
10. Transactions above average amount

## Greater Than or Equal To (>=)
1. Transactions ≥100
2. Statements with min_due ≥100
3. Payments ≥ their minimum_due
4. Cards with credit_limit ≥15000
5. Clients joined on or after 2022-01-01
6. Transactions on or after 2023-01-01
7. Statements with closing_balance ≥1200
8. Payments on or after 2023-06-20
9. Cards issued on or after 2022-06-01
10. Transactions ≥ average amount

## Less Than (<)
1. Small transactions (<20)
2. Low closing balances (<500)
3. Payments < their minimum_due
4. Cards with limit <10000
5. Clients younger than 30
6. Transactions before 2023-06-01
7. Statements with min_due <50
8. Payments with ID <3050
9. Cards expiring before 2025-01-01
10. Transactions below average amount

## Less Than or Equal To (<=)
1. Transactions ≤100
2. Statements with min_due ≤120
3. Payments ≤ their minimum_due
4. Cards with limit ≤15000
5. Clients joined on or before 2023-01-01
6. Transactions on or before 2023-07-31
7. Statements with closing_balance ≤1000
8. Payments on or before 2023-06-20
9. Cards issued on or before 2022-06-15
10. Transactions ≤ average amount

## EXISTS Operator
1. Clients with at least one card
2. Cards having any transactions
3. Clients with statements
4. Cards with payments via statements
5. Cards that have Fuel transactions
6. Clients who used ACH payments
7. Cards already expired
8. Statements linked to transactions
9. Payments with valid statements
10. Clients with any transactions

## NOT EXISTS Operator
1. Clients with no cards
2. Cards with no transactions
3. Clients with no payments
4. Cards with no statements
5. Statements with no payments
6. Categories with no refunds
7. Clients who never made a transaction
8. Cards with no high-value transactions (>1000)
9. Clients who never used Online payments
10. Statements where closing_balance ≤ opening_balance

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
