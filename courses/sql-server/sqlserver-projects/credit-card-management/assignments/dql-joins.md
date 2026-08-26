![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. List clients with their credit cards
2. List credit cards with their latest statement closing_balance
3. List transactions with merchant and client name
4. List payments with statement due_date and card_number
5. List each client’s total spent (sum of transactions)
6. List statements with payment count
7. List cards and number of transactions per card
8. List clients who used a specific merchant (e.g., Amazon)
9. List statements and associated client email
10. List payment methods with average payment amount

## Left Join (Left Outer Join)
1. List all clients and their cards (include clients with no cards)
2. List all cards and their transactions (include cards with no transactions)
3. List all cards and latest statement (include cards without statements)
4. List all statements and their payments (include statements with no payments)
5. List all clients and any transactions (include clients with no transactions)
6. List all card types and average transaction amount (include types with no transactions)
7. List all clients and their last payment date (include clients with no payments)
8. List all merchants and transaction counts (include merchants with zero transactions via derived list)
9. List all cards and due dates (include cards with no statements)
10. List all clients and number of cards (include clients with zero cards)

## Right Join (Right Outer Join)
1. List clients and cards (include cards with no matching client)
2. List cards and statements (include statements with no matching card)
3. List statements and payments (include payments with no matching statement)
4. List cards and transactions (include transactions with no matching card)
5. List clients and payments (include payments even if client deleted)
6. List all payment methods with payments (include methods from payments table)
7. List all merchants showing transactions (include every txn)
8. List clients and all their statements (include statements for orphan cards)
9. List statements and their cards (include cards even if no card_number)
10. List transactions and client info (include all transactions)

## Full Join (Full Outer Join)
1. All clients and cards (include unmatched on both sides)
2. All cards and statements
3. All statements and payments
4. All cards and transactions
5. All clients and transactions
6. All clients and payments
7. All merchants with statements and transactions
8. All card types with payments
9. All categories and clients
10. All statements and transactions by date

## Cross Join
1. Cartesian product of all clients and card types
2. All client–merchant combinations
3. All card_number and due_date combinations
4. All card_number and payment_method combinations
5. All merchant and category combinations
6. All client and statement combinations
7. All transaction and payment combinations
8. All client and payment_method combinations
9. All category and payment_method combinations
10. All month–merchant combinations (derive months)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
