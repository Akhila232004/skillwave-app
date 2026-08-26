![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Get length of each client's full name.
2. Get length of each asset symbol.
3. Find transactions where description length > 20.
4. List portfolios with name length.
5. Show length of each client's email.
6. Show length of account_type.
7. Length of financial goal names.
8. Length of asset names.
9. Length of portfolio asset quantity cast to varchar.
10. Length of phone numbers.

## Substring Function (SUBSTRING)
1. First 3 characters of each client's last name.
2. Characters 1–5 of email.
3. First 4 of asset symbols.
4. Middle of portfolio names (chars 3–5).
5. First 10 of transaction descriptions.
6. First 2 of account_type.
7. Extract year prefix from target_date as string.
8. First 6 of asset names.
9. Extract month-day from opened_date.
10. Characters 2–4 of phone number.

## Concatenation Operator (+)
1. Full client name.
2. Email and phone in one field.
3. Portfolio and client names.
4. Asset symbol and name.
5. Account type and status.
6. Goal name and target date.
7. Transaction type and amount.
8. Portfolio name and creation date.
9. Asset type and symbol.
10. Client join date and name.

## Lower Function (LOWER)
1. Lowercase all client emails.
2. Lowercase asset symbols.
3. Lowercase portfolio names.
4. Lowercase account types.
5. Lowercase transaction descriptions.
6. Lowercase goal statuses.
7. Lowercase asset names.
8. Lowercase phone numbers (no change but cast).
9. Lowercase concatenated client names.
10. Lowercase portfolio_owner summary.

## Upper Function (UPPER)
1. Uppercase all client emails.
2. Uppercase asset symbols.
3. Uppercase portfolio names.
4. Uppercase account types.
5. Uppercase transaction descriptions.
6. Uppercase goal statuses.
7. Uppercase asset names.
8. Uppercase phone numbers.
9. Uppercase concatenated client names.
10. Uppercase portfolio_owner summary.

## Trim Function (TRIM)
1. Trim whitespace from transaction descriptions.
2. Trim portfolio names.
3. Trim client first names.
4. Trim last names.
5. Trim asset names.
6. Trim account types.
7. Trim goal names.
8. Trim email addresses.
9. Trim phone numbers.
10. Trim concatenated names.

## Ltrim Function (LTRIM)
1. Remove leading spaces from descriptions.
2. Remove leading spaces from names.
3. Remove leading spaces from emails.
4. Remove leading spaces from asset names.
5. Remove leading spaces from account_type.
6. Remove leading spaces from goal_name.
7. Remove leading zeros from quantity if cast to varchar.
8. Remove leading spaces from phone.
9. Remove leading spaces from concatenated names.
10. Remove leading spaces from symbol.

## Rtrim Function (RTRIM)
1. Remove trailing spaces from descriptions.
2. Remove trailing spaces from names.
3. Remove trailing spaces from emails.
4. Remove trailing spaces from asset names.
5. Remove trailing spaces from account_type.
6. Remove trailing spaces from goal_name.
7. Remove trailing spaces from phone.
8. Remove trailing spaces from concatenated names.
9. Remove trailing spaces from symbol.
10. Remove trailing spaces from status.

## Charindex Function (CHARINDEX)
1. Position of 'Inc' in asset names.
2. Position of '@' in emails.
3. Position of 'Fund' in goal_name.
4. Position of 'Mix' in portfolio names.
5. Position of 'Deposit' in description.
6. Position of 'Save' in description.
7. Position of 'Ret' in status.
8. Position of '-' in phone.
9. Position of '202' in join_date string.
10. Position of '202' in target_date string.

## Left Function (LEFT)
1. First 2 letters of each client's first name.
2. First 3 of asset symbols.
3. First 4 of portfolio names.
4. First 5 of email.
5. First 2 of account_type.
6. First 3 of goal_name.
7. First 6 of description.
8. First 4 of asset name.
9. First 7 of phone.
10. First 4 of status.

## Right Function (RIGHT)
1. Last 3 of each client's last name.
2. Last 4 of asset symbols.
3. Last 5 of portfolio names.
4. Last 3 of email domain.
5. Last 2 of account_type.
6. Last 4 of goal_name.
7. Last 6 of description.
8. Last 3 of asset name.
9. Last 4 of phone.
10. Last 3 of status.

## Reverse Function (REVERSE)
1. Reverse each client's first name.
2. Reverse each asset symbol.
3. Reverse portfolio names.
4. Reverse transaction descriptions.
5. Reverse email addresses.
6. Reverse account types.
7. Reverse goal names.
8. Reverse phone numbers.
9. Reverse asset names.
10. Reverse status.

## Replace Function (REPLACE)
1. Replace 'Inc' with 'Incorporated' in asset names.
2. Replace 'Deposit' with 'Dep' in descriptions.
3. Replace 'Checking' with 'Chk' in account_type.
4. Replace dashes with spaces in phone.
5. Replace 'Fund' with 'Fd' in goal_name.
6. Replace 'ETF' with 'Exchange-Traded Fund' in asset_type.
7. Replace '/' with '-' in dates for display.
8. Replace 'Savings' with 'Sav' in account_type.
9. Replace 'Retirement' with 'Ret' in portfolio names.
10. Replace 'Active' with 'A' in status.

## Case Statement (CASE)
1. Label transactions as 'Credit' or 'Debit'.
2. Categorize accounts as 'Open' or 'Closed'.
3. Classify clients by age group.
4. Mark portfolio size.
5. Goal progress status.
6. Transaction value bucket.
7. Asset class.
8. Client join decade.
9. Account age.
10. Portfolio creation era.

## ISNULL Function (ISNULL)
1. Default phone to 'N/A'.
2. Default description to 'No desc'.
3. Default asset name to 'Unknown'.
4. Default status to 'Unknown'.
5. Default portfolio name to 'Unnamed'.
6. Default account_type to 'Standard'.
7. Default email to 'none@example.com'.
8. Default target_amount to 0.
9. Default acquisition_price to 0.
10. Default current_amount to 0.

## Coalesce Function (COALESCE)
1. Show email or phone.
2. Show description or goal_name.
3. Show portfolio name or 'Unnamed'.
4. Show asset symbol or 'UNKNOWN'.
5. Show account_type or 'Standard'.
6. Show goal_name or 'No Goal'.
7. Show description, else 'N/A'.
8. Show phone, else email.
9. Show current_amount or target_amount.
10. Show quantity or 0.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
