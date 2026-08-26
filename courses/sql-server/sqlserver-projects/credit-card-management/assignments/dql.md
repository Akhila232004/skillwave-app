![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments

## Select
1. Retrieve all columns from clients
2. Retrieve first_name and last_name of all clients
3. Retrieve card_number and card_type for all active credit cards
4. Retrieve txn_date and amount for all card transactions
5. Retrieve statement_id, closing_balance, due_date from statements
6. Retrieve payment_id, payment_date, amount from payments
7. List client full name and their card_number
8. List card_number with its closing_balance
9. List statement_date and payment_date for each payment
10. List each client’s name, merchant, and transaction amount

## WHERE
1. Transactions greater than 500
2. Transactions in USD only
3. Transactions in July 2023
4. Blocked credit cards
5. Clients who joined after January 1, 2022
6. Statements with closing_balance over 1,000
7. Payments made online
8. Groceries transactions over 200
9. Expired cards (expiry_date before today)
10. Payments where amount is less than the statement’s minimum_due

## GROUP BY
1. Count transactions per client
2. Sum transaction amounts per card
3. Average transaction amount per category
4. Number of cards per client
5. Total minimum_due per due_date
6. Count payments by payment_method
7. Sum closing_balance by card_type
8. Number of transactions per merchant
9. Average credit_limit per card_type
10. Number of statements per card

## HAVING
1. Categories with average amount > 100
2. Clients with more than 1 card
3. Merchants with total spend > 1,000
4. Card types with average limit > 12,000
5. Payment methods used more than 50 times
6. Months with total closing balances > 5,000
7. Clients with more than 10 transactions
8. Categories having refunds (negative amounts)
9. Card statuses that appear more than 5 times
10. Clients whose total payments < total minimum_due

## ORDER BY
1. List clients by newest join_date first
2. List credit cards by descending credit_limit
3. List transactions in ascending txn_date
4. List statements by latest statement_date
5. List payments by smallest amount first
6. List clients alphabetically by last_name then first_name
7. List credit cards by soonest expiry_date
8. List transactions by category asc, amount desc
9. List statements by highest closing_balance
10. List payments by most recent payment_date

## TOP
1. Top 5 cards with highest credit_limit
2. Top 10 largest transactions by amount
3. Top 3 clients with the most cards
4. Top 5 merchants by number of transactions
5. Top 3 categories by total spend
6. Top 5 cards with highest average transaction amount
7. Top 5 months with most statements generated
8. Top 5 payment methods by usage
9. Top 5 clients by total payments amount
10. Top 5 cards nearing expiry soonest

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
