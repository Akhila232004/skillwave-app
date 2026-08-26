![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. Distinct client_ids who have transactions or payments
2. All card_ids that appear in transactions or in statements
3. Merchants in June 2023 or July 2023
4. All categories from transactions and all payment methods
5. All expiry_dates of cards and due_dates of statements
6. Clients who joined before 2021 or after 2023
7. Card_types for limits >15000 or limits <5000
8. Merchants for transactions >100 or <10
9. Contact values: emails and phone numbers
10. Statement_ids from December cycle statements or payments

## Intersect
1. Clients with both transactions and payments
2. Card_ids present in both transactions and statements
3. Merchants used in both June and July 2023
4. Card_types common to high-limit cards and active cards
5. Categories in January and February 2023
6. Clients who joined in 2022 and also have transactions
7. Payment methods used in June and December 2023
8. Card_ids expiring after 2024-01-01 and with high limits
9. Merchants used by client 1 and client 2
10. Statement_ids with closing_balance >1000 and due in December

## Except
1. Clients with transactions except those with payments
2. Clients with payments except those with transactions
3. Card_ids in transactions but not in statements
4. Card_ids in statements but not in transactions
5. Merchants in June 2023 but not in July 2023
6. Card_types for high-limit cards except Visa
7. Categories used except Groceries
8. December statements not paid by December 20
9. Clients who joined in 2023 except those who joined in January 2023
10. Payments on or before June 2023 except those via ACH

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
