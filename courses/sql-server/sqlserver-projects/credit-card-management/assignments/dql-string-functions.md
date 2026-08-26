![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Length of each client’s first name
2. Length of each email address
3. Length of each card_number
4. Length of each merchant name
5. Length of category values
6. Length of payment_method
7. Length of status in credit_cards
8. Length of CONCAT(first_name, ' ', last_name)
9. Length of currency code
10. Length of due_date when cast to string

## Substring Function (SUBSTRING)
1. First 4 digits of card_number
2. Extract domain from email
3. First 3 letters of merchant
4. Characters 6–9 of card_number
5. Last 4 of card_number using LEN
6. Middle 5 of category
7. Year from statement_date as string
8. Month from payment_date as string
9. First name initial
10. Last 2 of payment_method

## Concatenation Operator (+)
1. Full client name
2. Card info: type and number
3. Merchant and amount
4. Email label
5. Statement summary
6. Payment record
7. Client age statement
8. Category and currency
9. Card status message
10. Merchant-city mock (assume city)

## Lower Function (LOWER)
1. Lowercase all emails
2. Lowercase merchant names
3. Lowercase categories
4. Lowercase status
5. Lowercase payment methods
6. Lowercase card_type
7. Lowercase first_name
8. Lowercase last_name
9. Lowercase currency codes
10. Lowercase CONCAT of names

## Upper Function (UPPER)
1. Uppercase all emails
2. Uppercase merchant names
3. Uppercase categories
4. Uppercase status
5. Uppercase payment methods
6. Uppercase card_type
7. Uppercase first_name
8. Uppercase last_name
9. Uppercase currency codes
10. Uppercase full name

## Trim Function (TRIM)
1. Trim whitespace around first_name
2. Trim whitespace around last_name
3. Trim around email
4. Trim around card_number
5. Trim around merchant
6. Trim around category
7. Trim around status
8. Trim around payment_method
9. Trim around phone
10. Trim around CONCAT of names

## Ltrim Function (LTRIM)
1. LTRIM first_name
2. LTRIM last_name
3. LTRIM email
4. LTRIM card_number
5. LTRIM merchant
6. LTRIM category
7. LTRIM status
8. LTRIM payment_method
9. LTRIM phone
10. LTRIM CONCAT names

## Rtrim Function (RTRIM)
1. RTRIM first_name
2. RTRIM last_name
3. RTRIM email
4. RTRIM card_number
5. RTRIM merchant
6. RTRIM category
7. RTRIM status
8. RTRIM payment_method
9. RTRIM phone
10. RTRIM CONCAT names

## Charindex Function (CHARINDEX)
1. Position of '@' in email
2. Position of '-' in card_number
3. Position of 'Star' in merchant
4. Position of 'USD' in currency
5. Position of 'a' in category
6. Position of 'Online' in payment_method
7. Position of 'Active' in status
8. Position of space in first_name
9. Position of ':' in CONCAT of merchant:amount
10. Position of '2023' in statement_date string

## Left Function (LEFT)
1. First 4 of card_number
2. First 3 of first_name
3. First 2 of currency
4. First letter of payment_method
5. First 5 of merchant
6. First 6 of email
7. First word of category
8. First 3 of status
9. First digit of statement_id cast
10. First 3 of last_name

## Right Function (RIGHT)
1. Last 4 of card_number
2. Last 3 of first_name
3. Last 2 of currency
4. Last letter of payment_method
5. Last 5 of merchant
6. Last 6 of email
7. Last word of category
8. Last 3 of status
9. Last digit of statement_id
10. Last 3 of last_name

## Reverse Function (REVERSE)
1. Reverse card_number
2. Reverse first_name
3. Reverse merchant
4. Reverse category
5. Reverse email
6. Reverse status
7. Reverse payment_method
8. Reverse CONCAT of names
9. Reverse currency
10. Reverse statement_date string

## Replace Function (REPLACE)
1. Remove dashes from card_number
2. Abbreviate MasterCard to MC
3. Replace USD with US_Dollar
4. Replace space in merchant with underscore
5. Replace Online with WEB
6. Mask email domain
7. Replace Active with 1, others with 0 using nested REPLACE
8. Standardize category spelling
9. Replace commas in CONCAT summary
10. Replace periods in amount with comma

## Case Statement (CASE)
1. Label transaction type
2. High vs low limit cards
3. Payment punctuality
4. Client age group
5. Statement balance status
6. Card expiry status
7. Payment method category
8. Transaction size
9. Client join decade
10. Category food vs other

## ISNULL Function (ISNULL)
1. Replace null phone with 'N/A'
2. Replace null merchant with 'Unknown'
3. Replace null category with 'Misc'
4. Replace null payment_method with 'Unknown'
5. Replace null status with 'Inactive'
6. Replace null email with placeholder
7. Replace null last_name with first_name
8. Replace null opening_balance with 0
9. Replace null closing_balance with opening_balance
10. Replace null credit_limit with default

## Coalesce Function (COALESCE)
1. Phone or email or 'N/A'
2. Category or 'Other'
3. Merchant or card_number
4. Payment_method or 'Unknown'
5. First non-null between last and first name
6. Expiry_date or issue_date
7. Closing_balance or opening_balance
8. Category, merchant, or 'N/A'
9. Payment_date or statement_date
10. Status or 'Unknown'

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
