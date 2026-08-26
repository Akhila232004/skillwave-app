![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Length of each client’s first name
SELECT client_id, LEN(first_name) AS first_name_length FROM credit_card.clients;
-- 2. Length of each email address
SELECT client_id, LEN(email) AS email_length FROM credit_card.clients;
-- 3. Length of each card_number
SELECT card_id, LEN(card_number) AS card_number_length FROM credit_card.credit_cards;
-- 4. Length of each merchant name
SELECT txn_id, LEN(merchant) AS merchant_length FROM credit_card.card_transactions;
-- 5. Length of category values
SELECT DISTINCT category, LEN(category) AS category_length FROM credit_card.card_transactions;
-- 6. Length of payment_method
SELECT payment_id, LEN(payment_method) AS method_length FROM credit_card.payments;
-- 7. Length of status in credit_cards
SELECT card_id, LEN(status) AS status_length FROM credit_card.credit_cards;
-- 8. Length of CONCAT(first_name, ' ', last_name)
SELECT client_id, LEN(first_name + ' ' + last_name) AS full_name_length FROM credit_card.clients;
-- 9. Length of currency code
SELECT txn_id, LEN(currency) AS currency_length FROM credit_card.card_transactions;
-- 10. Length of due_date when cast to string
SELECT statement_id, LEN(CONVERT(VARCHAR(10), due_date, 120)) AS due_date_length FROM credit_card.statements;
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 4 digits of card_number
SELECT card_id, SUBSTRING(card_number,1,4) AS first4 FROM credit_card.credit_cards;
-- 2. Extract domain from email
SELECT client_id, SUBSTRING(email, CHARINDEX('@',email)+1, LEN(email)) AS domain FROM credit_card.clients;
-- 3. First 3 letters of merchant
SELECT txn_id, SUBSTRING(merchant,1,3) AS mkt_prefix FROM credit_card.card_transactions;
-- 4. Characters 6–9 of card_number
SELECT card_id, SUBSTRING(card_number,6,4) AS mid_digits FROM credit_card.credit_cards;
-- 5. Last 4 of card_number using LEN
SELECT card_id, SUBSTRING(card_number,LEN(card_number)-3,4) AS last4 FROM credit_card.credit_cards;
-- 6. Middle 5 of category
SELECT txn_id, SUBSTRING(category,2,5) AS cat_mid FROM credit_card.card_transactions;
-- 7. Year from statement_date as string
SELECT statement_id, SUBSTRING(CONVERT(VARCHAR(10),statement_date,120),1,4) AS year FROM credit_card.statements;
-- 8. Month from payment_date as string
SELECT payment_id, SUBSTRING(CONVERT(VARCHAR(10),payment_date,120),6,2) AS month FROM credit_card.payments;
-- 9. First name initial
SELECT client_id, SUBSTRING(first_name,1,1) AS initial FROM credit_card.clients;
-- 10. Last 2 of payment_method
SELECT payment_id, SUBSTRING(payment_method,LEN(payment_method)-1,2) AS pm_suffix FROM credit_card.payments;
```

## Concatenation Operator (+)
```sql
-- 1. Full client name
SELECT client_id, first_name + ' ' + last_name AS full_name FROM credit_card.clients;
-- 2. Card info: type and number
SELECT card_id, card_type + ' - ' + card_number AS card_info FROM credit_card.credit_cards;
-- 3. Merchant and amount
SELECT txn_id, merchant + ': $' + CAST(amount AS VARCHAR(20)) AS merch_amount FROM credit_card.card_transactions;
-- 4. Email label
SELECT client_id, 'Email: ' + email AS email_label FROM credit_card.clients;
-- 5. Statement summary
SELECT statement_id, 'Balance: ' + CAST(closing_balance AS VARCHAR(20)) + ' Due: ' + CONVERT(VARCHAR(10),due_date,120) AS summary FROM credit_card.statements;
-- 6. Payment record
SELECT payment_id, 'Paid ' + CAST(amount AS VARCHAR(20)) + ' via ' + payment_method AS pay_record FROM credit_card.payments;
-- 7. Client age statement
SELECT client_id, first_name + ' is ' + CAST(DATEDIFF(year,date_of_birth,GETDATE()) AS VARCHAR(3)) + ' years old' AS age_stmt FROM credit_card.clients;
-- 8. Category and currency
SELECT txn_id, category + ' (' + currency + ')' AS cat_curr FROM credit_card.card_transactions;
-- 9. Card status message
SELECT card_id, 'Status: ' + status AS status_msg FROM credit_card.credit_cards;
-- 10. Merchant-city mock (assume city)
SELECT txn_id, merchant + ', City' AS merch_city FROM credit_card.card_transactions;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase all emails
SELECT client_id, LOWER(email) AS email_lower FROM credit_card.clients;
-- 2. Lowercase merchant names
SELECT txn_id, LOWER(merchant) AS merchant_lower FROM credit_card.card_transactions;
-- 3. Lowercase categories
SELECT DISTINCT LOWER(category) AS category_lower FROM credit_card.card_transactions;
-- 4. Lowercase status
SELECT card_id, LOWER(status) AS status_lower FROM credit_card.credit_cards;
-- 5. Lowercase payment methods
SELECT payment_id, LOWER(payment_method) AS method_lower FROM credit_card.payments;
-- 6. Lowercase card_type
SELECT card_id, LOWER(card_type) AS type_lower FROM credit_card.credit_cards;
-- 7. Lowercase first_name
SELECT client_id, LOWER(first_name) AS fname_lower FROM credit_card.clients;
-- 8. Lowercase last_name
SELECT client_id, LOWER(last_name) AS lname_lower FROM credit_card.clients;
-- 9. Lowercase currency codes
SELECT txn_id, LOWER(currency) AS currency_lower FROM credit_card.card_transactions;
-- 10. Lowercase CONCAT of names
SELECT client_id, LOWER(first_name + ' ' + last_name) AS fullname_lower FROM credit_card.clients;
```

## Upper Function (UPPER)
```sql
-- 1. Uppercase all emails
SELECT client_id, UPPER(email) AS email_upper FROM credit_card.clients;
-- 2. Uppercase merchant names
SELECT txn_id, UPPER(merchant) AS merchant_upper FROM credit_card.card_transactions;
-- 3. Uppercase categories
SELECT DISTINCT UPPER(category) AS category_upper FROM credit_card.card_transactions;
-- 4. Uppercase status
SELECT card_id, UPPER(status) AS status_upper FROM credit_card.credit_cards;
-- 5. Uppercase payment methods
SELECT payment_id, UPPER(payment_method) AS method_upper FROM credit_card.payments;
-- 6. Uppercase card_type
SELECT card_id, UPPER(card_type) AS type_upper FROM credit_card.credit_cards;
-- 7. Uppercase first_name
SELECT client_id, UPPER(first_name) AS fname_upper FROM credit_card.clients;
-- 8. Uppercase last_name
SELECT client_id, UPPER(last_name) AS lname_upper FROM credit_card.clients;
-- 9. Uppercase currency codes
SELECT txn_id, UPPER(currency) AS currency_upper FROM credit_card.card_transactions;
-- 10. Uppercase full name
SELECT client_id, UPPER(first_name + ' ' + last_name) AS fullname_upper FROM credit_card.clients;
```

## Trim Function (TRIM)
```sql
-- 1. Trim whitespace around first_name
SELECT client_id, TRIM(first_name) AS fname_trim FROM credit_card.clients;
-- 2. Trim whitespace around last_name
SELECT client_id, TRIM(last_name) AS lname_trim FROM credit_card.clients;
-- 3. Trim around email
SELECT client_id, TRIM(email) AS email_trim FROM credit_card.clients;
-- 4. Trim around card_number
SELECT card_id, TRIM(card_number) AS card_trim FROM credit_card.credit_cards;
-- 5. Trim around merchant
SELECT txn_id, TRIM(merchant) AS merch_trim FROM credit_card.card_transactions;
-- 6. Trim around category
SELECT DISTINCT TRIM(category) AS cat_trim FROM credit_card.card_transactions;
-- 7. Trim around status
SELECT card_id, TRIM(status) AS status_trim FROM credit_card.credit_cards;
-- 8. Trim around payment_method
SELECT payment_id, TRIM(payment_method) AS method_trim FROM credit_card.payments;
-- 9. Trim around phone
SELECT client_id, TRIM(phone) AS phone_trim FROM credit_card.clients;
-- 10. Trim around CONCAT of names
SELECT client_id, TRIM(first_name + ' ' + last_name) AS fn_fn_trim FROM credit_card.clients;
```

## Ltrim Function (LTRIM)
```sql
-- 1. LTRIM first_name
SELECT client_id, LTRIM(first_name) AS fname_ltrim FROM credit_card.clients;
-- 2. LTRIM last_name
SELECT client_id, LTRIM(last_name) AS lname_ltrim FROM credit_card.clients;
-- 3. LTRIM email
SELECT client_id, LTRIM(email) AS email_ltrim FROM credit_card.clients;
-- 4. LTRIM card_number
SELECT card_id, LTRIM(card_number) AS card_ltrim FROM credit_card.credit_cards;
-- 5. LTRIM merchant
SELECT txn_id, LTRIM(merchant) AS merch_ltrim FROM credit_card.card_transactions;
-- 6. LTRIM category
SELECT DISTINCT LTRIM(category) AS cat_ltrim FROM credit_card.card_transactions;
-- 7. LTRIM status
SELECT card_id, LTRIM(status) AS status_ltrim FROM credit_card.credit_cards;
-- 8. LTRIM payment_method
SELECT payment_id, LTRIM(payment_method) AS method_ltrim FROM credit_card.payments;
-- 9. LTRIM phone
SELECT client_id, LTRIM(phone) AS phone_ltrim FROM credit_card.clients;
-- 10. LTRIM CONCAT names
SELECT client_id, LTRIM(first_name + ' ' + last_name) AS fullname_ltrim FROM credit_card.clients;
```

## Rtrim Function (RTRIM)
```sql
-- 1. RTRIM first_name
SELECT client_id, RTRIM(first_name) AS fname_rtrim FROM credit_card.clients;
-- 2. RTRIM last_name
SELECT client_id, RTRIM(last_name) AS lname_rtrim FROM credit_card.clients;
-- 3. RTRIM email
SELECT client_id, RTRIM(email) AS email_rtrim FROM credit_card.clients;
-- 4. RTRIM card_number
SELECT card_id, RTRIM(card_number) AS card_rtrim FROM credit_card.credit_cards;
-- 5. RTRIM merchant
SELECT txn_id, RTRIM(merchant) AS merch_rtrim FROM credit_card.card_transactions;
-- 6. RTRIM category
SELECT DISTINCT RTRIM(category) AS cat_rtrim FROM credit_card.card_transactions;
-- 7. RTRIM status
SELECT card_id, RTRIM(status) AS status_rtrim FROM credit_card.credit_cards;
-- 8. RTRIM payment_method
SELECT payment_id, RTRIM(payment_method) AS method_rtrim FROM credit_card.payments;
-- 9. RTRIM phone
SELECT client_id, RTRIM(phone) AS phone_rtrim FROM credit_card.clients;
-- 10. RTRIM CONCAT names
SELECT client_id, RTRIM(first_name + ' ' + last_name) AS fullname_rtrim FROM credit_card.clients;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '@' in email
SELECT client_id, CHARINDEX('@',email) AS pos_at FROM credit_card.clients;
-- 2. Position of '-' in card_number
SELECT card_id, CHARINDEX('-',card_number) AS pos_dash FROM credit_card.credit_cards;
-- 3. Position of 'Star' in merchant
SELECT txn_id, CHARINDEX('Star',merchant) AS pos_star FROM credit_card.card_transactions;
-- 4. Position of 'USD' in currency
SELECT txn_id, CHARINDEX('USD',currency) AS pos_usd FROM credit_card.card_transactions;
-- 5. Position of 'a' in category
SELECT txn_id, CHARINDEX('a',category) AS pos_a FROM credit_card.card_transactions;
-- 6. Position of 'Online' in payment_method
SELECT payment_id, CHARINDEX('Online',payment_method) AS pos_online FROM credit_card.payments;
-- 7. Position of 'Active' in status
SELECT card_id, CHARINDEX('Active',status) AS pos_active FROM credit_card.credit_cards;
-- 8. Position of space in first_name
SELECT client_id, CHARINDEX(' ',first_name) AS pos_space FROM credit_card.clients;
-- 9. Position of ':' in CONCAT of merchant:amount
SELECT txn_id, CHARINDEX(':',merchant + ':' + CAST(amount AS VARCHAR)) AS pos_colon FROM credit_card.card_transactions;
-- 10. Position of '2023' in statement_date string
SELECT statement_id, CHARINDEX('2023',CONVERT(VARCHAR(10),statement_date,120)) AS pos_year FROM credit_card.statements;
```

## Left Function (LEFT)
```sql
-- 1. First 4 of card_number
SELECT card_id, LEFT(card_number,4) AS left4 FROM credit_card.credit_cards;
-- 2. First 3 of first_name
SELECT client_id, LEFT(first_name,3) AS fn3 FROM credit_card.clients;
-- 3. First 2 of currency
SELECT txn_id, LEFT(currency,2) AS cur2 FROM credit_card.card_transactions;
-- 4. First letter of payment_method
SELECT payment_id, LEFT(payment_method,1) AS pm1 FROM credit_card.payments;
-- 5. First 5 of merchant
SELECT txn_id, LEFT(merchant,5) AS m5 FROM credit_card.card_transactions;
-- 6. First 6 of email
SELECT client_id, LEFT(email,6) AS email6 FROM credit_card.clients;
-- 7. First word of category
SELECT txn_id, LEFT(category,CHARINDEX(' ',category + ' ')-1) AS first_word FROM credit_card.card_transactions;
-- 8. First 3 of status
SELECT card_id, LEFT(status,3) AS status3 FROM credit_card.credit_cards;
-- 9. First digit of statement_id cast
SELECT statement_id, LEFT(CAST(statement_id AS VARCHAR(10)),1) AS sid1 FROM credit_card.statements;
-- 10. First 3 of last_name
SELECT client_id, LEFT(last_name,3) AS ln3 FROM credit_card.clients;
```

## Right Function (RIGHT)
```sql
-- 1. Last 4 of card_number
SELECT card_id, RIGHT(card_number,4) AS last4 FROM credit_card.credit_cards;
-- 2. Last 3 of first_name
SELECT client_id, RIGHT(first_name,3) AS fn3 FROM credit_card.clients;
-- 3. Last 2 of currency
SELECT txn_id, RIGHT(currency,2) AS cur2 FROM credit_card.card_transactions;
-- 4. Last letter of payment_method
SELECT payment_id, RIGHT(payment_method,1) AS pm1 FROM credit_card.payments;
-- 5. Last 5 of merchant
SELECT txn_id, RIGHT(merchant,5) AS m5 FROM credit_card.card_transactions;
-- 6. Last 6 of email
SELECT client_id, RIGHT(email,6) AS email6 FROM credit_card.clients;
-- 7. Last word of category
SELECT txn_id, RIGHT(category,CHARINDEX(' ',REVERSE(category) + ' ')-1) AS last_word FROM credit_card.card_transactions;
-- 8. Last 3 of status
SELECT card_id, RIGHT(status,3) AS status3 FROM credit_card.credit_cards;
-- 9. Last digit of statement_id
SELECT statement_id, RIGHT(CAST(statement_id AS VARCHAR(10)),1) AS sid1 FROM credit_card.statements;
-- 10. Last 3 of last_name
SELECT client_id, RIGHT(last_name,3) AS ln3 FROM credit_card.clients;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse card_number
SELECT card_id, REVERSE(card_number) AS rev_card FROM credit_card.credit_cards;
-- 2. Reverse first_name
SELECT client_id, REVERSE(first_name) AS rev_fn FROM credit_card.clients;
-- 3. Reverse merchant
SELECT txn_id, REVERSE(merchant) AS rev_merch FROM credit_card.card_transactions;
-- 4. Reverse category
SELECT DISTINCT category, REVERSE(category) AS rev_cat FROM credit_card.card_transactions;
-- 5. Reverse email
SELECT client_id, REVERSE(email) AS rev_email FROM credit_card.clients;
-- 6. Reverse status
SELECT card_id, REVERSE(status) AS rev_status FROM credit_card.credit_cards;
-- 7. Reverse payment_method
SELECT payment_id, REVERSE(payment_method) AS rev_method FROM credit_card.payments;
-- 8. Reverse CONCAT of names
SELECT client_id, REVERSE(first_name + ' ' + last_name) AS rev_fullname FROM credit_card.clients;
-- 9. Reverse currency
SELECT txn_id, REVERSE(currency) AS rev_curr FROM credit_card.card_transactions;
-- 10. Reverse statement_date string
SELECT statement_id, REVERSE(CONVERT(VARCHAR(10),statement_date,120)) AS rev_sdate FROM credit_card.statements;
```

## Replace Function (REPLACE)
```sql
-- 1. Remove dashes from card_number
SELECT card_id, REPLACE(card_number,'-','') AS clean_card FROM credit_card.credit_cards;
-- 2. Abbreviate MasterCard to MC
SELECT card_id, REPLACE(card_type,'MasterCard','MC') AS type_abbrev FROM credit_card.credit_cards;
-- 3. Replace USD with US_Dollar
SELECT txn_id, REPLACE(currency,'USD','US_Dollar') AS curr_full FROM credit_card.card_transactions;
-- 4. Replace space in merchant with underscore
SELECT txn_id, REPLACE(merchant,' ','_') AS merch_snake FROM credit_card.card_transactions;
-- 5. Replace Online with WEB
SELECT payment_id, REPLACE(payment_method,'Online','WEB') AS method_web FROM credit_card.payments;
-- 6. Mask email domain
SELECT client_id, REPLACE(email,RIGHT(email,LEN(email)-CHARINDEX('@',email)),'@*****') AS email_mask FROM credit_card.clients;
-- 7. Replace Active with 1, others with 0 using nested REPLACE
SELECT card_id, REPLACE(REPLACE(status,'Active','1'),'Blocked','0') AS status_bin FROM credit_card.credit_cards;
-- 8. Standardize category spelling
SELECT txn_id, REPLACE(category,'Groceries','Grocery') AS cat_std FROM credit_card.card_transactions;
-- 9. Replace commas in CONCAT summary
SELECT statement_id, REPLACE('Balance,' + CAST(closing_balance AS VARCHAR),',',' -') AS stmt_clean FROM credit_card.statements;
-- 10. Replace periods in amount with comma
SELECT txn_id, REPLACE(CAST(amount AS VARCHAR),'.',',') AS amt_comma FROM credit_card.card_transactions;
```

## Case Statement (CASE)
```sql
-- 1. Label transaction type
SELECT txn_id, CASE WHEN amount>=0 THEN 'Charge' ELSE 'Refund' END AS txn_type FROM credit_card.card_transactions;
-- 2. High vs low limit cards
SELECT card_id, CASE WHEN credit_limit>10000 THEN 'High' ELSE 'Standard' END AS limit_category FROM credit_card.credit_cards;
-- 3. Payment punctuality
SELECT p.payment_id, CASE WHEN p.payment_date<=s.due_date THEN 'On Time' ELSE 'Late' END AS pay_status
FROM credit_card.payments p JOIN credit_card.statements s ON p.statement_id=s.statement_id;
-- 4. Client age group
SELECT client_id, CASE WHEN DATEDIFF(year,date_of_birth,GETDATE())<30 THEN 'Young' WHEN DATEDIFF(year,date_of_birth,GETDATE())<=60 THEN 'Adult' ELSE 'Senior' END AS age_group FROM credit_card.clients;
-- 5. Statement balance status
SELECT statement_id, CASE WHEN closing_balance>0 THEN 'Outstanding' ELSE 'Zero' END AS balance_status FROM credit_card.statements;
-- 6. Card expiry status
SELECT card_id, CASE WHEN expiry_date<GETDATE() THEN 'Expired' ELSE 'Valid' END AS expiry_status FROM credit_card.credit_cards;
-- 7. Payment method category
SELECT payment_id, CASE WHEN payment_method IN ('ACH','Online') THEN 'Electronic' ELSE 'Manual' END AS method_cat FROM credit_card.payments;
-- 8. Transaction size
SELECT txn_id, CASE WHEN amount>500 THEN 'Large' WHEN amount>=100 THEN 'Medium' ELSE 'Small' END AS size_category FROM credit_card.card_transactions;
-- 9. Client join decade
SELECT client_id, CASE WHEN join_date<'2021-01-01' THEN 'Pre-2021' ELSE '2021+' END AS join_period FROM credit_card.clients;
-- 10. Category food vs other
SELECT txn_id, CASE WHEN category IN ('Groceries','Dining') THEN 'Food' ELSE 'Other' END AS cat_group FROM credit_card.card_transactions;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Replace null phone with 'N/A'
SELECT client_id, ISNULL(phone,'N/A') AS phone_val FROM credit_card.clients;
-- 2. Replace null merchant with 'Unknown'
SELECT txn_id, ISNULL(merchant,'Unknown') AS merch_val FROM credit_card.card_transactions;
-- 3. Replace null category with 'Misc'
SELECT txn_id, ISNULL(category,'Misc') AS cat_val FROM credit_card.card_transactions;
-- 4. Replace null payment_method with 'Unknown'
SELECT payment_id, ISNULL(payment_method,'Unknown') AS method_val FROM credit_card.payments;
-- 5. Replace null status with 'Inactive'
SELECT card_id, ISNULL(status,'Inactive') AS status_val FROM credit_card.credit_cards;
-- 6. Replace null email with placeholder
SELECT client_id, ISNULL(email,'noemail@example.com') AS email_val FROM credit_card.clients;
-- 7. Replace null last_name with first_name
SELECT client_id, ISNULL(last_name,first_name) AS name_val FROM credit_card.clients;
-- 8. Replace null opening_balance with 0
SELECT statement_id, ISNULL(opening_balance,0) AS open_bal FROM credit_card.statements;
-- 9. Replace null closing_balance with opening_balance
SELECT statement_id, ISNULL(closing_balance,opening_balance) AS close_bal FROM credit_card.statements;
-- 10. Replace null credit_limit with default
SELECT card_id, ISNULL(credit_limit,5000) AS limit_val FROM credit_card.credit_cards;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Phone or email or 'N/A'
SELECT client_id, COALESCE(phone,email,'N/A') AS contact FROM credit_card.clients;
-- 2. Category or 'Other'
SELECT txn_id, COALESCE(category,'Other') AS cat_val FROM credit_card.card_transactions;
-- 3. Merchant or card_number
SELECT txn_id, COALESCE(merchant,CAST(card_id AS VARCHAR)) AS merch_or_id FROM credit_card.card_transactions;
-- 4. Payment_method or 'Unknown'
SELECT payment_id, COALESCE(payment_method,'Unknown') AS method_val FROM credit_card.payments;
-- 5. First non-null between last and first name
SELECT client_id, COALESCE(last_name,first_name,'Guest') AS name_val FROM credit_card.clients;
-- 6. Expiry_date or issue_date
SELECT card_id, COALESCE(expiry_date,issue_date) AS exp_or_issue FROM credit_card.credit_cards;
-- 7. Closing_balance or opening_balance
SELECT statement_id, COALESCE(closing_balance,opening_balance) AS balance_val FROM credit_card.statements;
-- 8. Category, merchant, or 'N/A'
SELECT txn_id, COALESCE(category,merchant,'N/A') AS cat_merch FROM credit_card.card_transactions;
-- 9. Payment_date or statement_date
SELECT payment_id, COALESCE(payment_date,CONVERT(DATE,'1900-01-01')) AS pay_or_default FROM credit_card.payments;
-- 10. Status or 'Unknown'
SELECT card_id, COALESCE(status,'Unknown') AS status_val FROM credit_card.credit_cards;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
