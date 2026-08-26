![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Get length of each client's full name.
SELECT client_id, LEN(first_name + ' ' + last_name) AS name_length
FROM wealth_management.clients;
-- 2. Get length of each asset symbol.
SELECT asset_id, LEN(symbol) AS symbol_length
FROM wealth_management.assets;
-- 3. Find transactions where description length > 20.
SELECT txn_id, description, LEN(description) AS desc_len
FROM wealth_management.transactions
WHERE LEN(description) > 20;
-- 4. List portfolios with name length.
SELECT portfolio_id, name, LEN(name) AS name_length
FROM wealth_management.portfolios;
-- 5. Show length of each client's email.
SELECT client_id, email, LEN(email) AS email_length
FROM wealth_management.clients;
-- 6. Show length of account_type.
SELECT account_id, account_type, LEN(account_type) AS type_length
FROM wealth_management.accounts;
-- 7. Length of financial goal names.
SELECT goal_id, goal_name, LEN(goal_name) AS goal_length
FROM wealth_management.financial_goals;
-- 8. Length of asset names.
SELECT asset_id, name, LEN(name) AS asset_name_length
FROM wealth_management.assets;
-- 9. Length of portfolio asset quantity cast to varchar.
SELECT portfolio_id, asset_id, LEN(CAST(quantity AS VARCHAR(20))) AS qty_len
FROM wealth_management.portfolio_assets;
-- 10. Length of phone numbers.
SELECT client_id, phone, LEN(phone) AS phone_length
FROM wealth_management.clients;
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 3 characters of each client's last name.
SELECT client_id, SUBSTRING(last_name,1,3) AS last3
FROM wealth_management.clients;
-- 2. Characters 1–5 of email.
SELECT client_id, SUBSTRING(email,1,5) AS email_start
FROM wealth_management.clients;
-- 3. First 4 of asset symbols.
SELECT asset_id, SUBSTRING(symbol,1,4) AS sym_part
FROM wealth_management.assets;
-- 4. Middle of portfolio names (chars 3–5).
SELECT portfolio_id, SUBSTRING(name,3,3) AS mid_name
FROM wealth_management.portfolios;
-- 5. First 10 of transaction descriptions.
SELECT txn_id, SUBSTRING(description,1,10) AS desc_preview
FROM wealth_management.transactions;
-- 6. First 2 of account_type.
SELECT account_id, SUBSTRING(account_type,1,2) AS type_code
FROM wealth_management.accounts;
-- 7. Extract year prefix from target_date as string.
SELECT goal_id, SUBSTRING(CONVERT(VARCHAR(10),target_date,120),1,4) AS target_year
FROM wealth_management.financial_goals;
-- 8. First 6 of asset names.
SELECT asset_id, SUBSTRING(name,1,6) AS name_prefix
FROM wealth_management.assets;
-- 9. Extract month-day from opened_date.
SELECT account_id, SUBSTRING(CONVERT(VARCHAR(10),opened_date,120),6,5) AS mm_dd
FROM wealth_management.accounts;
-- 10. Characters 2–4 of phone number.
SELECT client_id, SUBSTRING(phone,2,3) AS phone_mid
FROM wealth_management.clients;
```

## Concatenation Operator (+)
```sql
-- 1. Full client name.
SELECT client_id, first_name + ' ' + last_name AS full_name
FROM wealth_management.clients;
-- 2. Email and phone in one field.
SELECT client_id, email + ' | ' + phone AS contact_info
FROM wealth_management.clients;
-- 3. Portfolio and client names.
SELECT p.portfolio_id, p.name + ' by ' + c.first_name + ' ' + c.last_name AS portfolio_owner
FROM wealth_management.portfolios p
JOIN wealth_management.clients c ON p.client_id = c.client_id;
-- 4. Asset symbol and name.
SELECT asset_id, symbol + ' - ' + name AS asset_desc
FROM wealth_management.assets;
-- 5. Account type and status.
SELECT account_id, account_type + ' (' + status + ')' AS type_status
FROM wealth_management.accounts;
-- 6. Goal name and target date.
SELECT goal_id, goal_name + ' due ' + CONVERT(VARCHAR(10),target_date,120) AS goal_info
FROM wealth_management.financial_goals;
-- 7. Transaction type and amount.
SELECT txn_id, txn_type + ': ' + CAST(amount AS VARCHAR(20)) AS txn_summary
FROM wealth_management.transactions;
-- 8. Portfolio name and creation date.
SELECT portfolio_id, name + ' @ ' + CONVERT(VARCHAR(10),created_date,120) AS info
FROM wealth_management.portfolios;
-- 9. Asset type and symbol.
SELECT asset_id, asset_type + ' - ' + symbol AS type_symbol
FROM wealth_management.assets;
-- 10. Client join date and name.
SELECT client_id, CONVERT(VARCHAR(10),join_date,120) + ' - ' + first_name + ' ' + last_name AS joined
FROM wealth_management.clients;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase all client emails.
SELECT client_id, LOWER(email) AS email_lower
FROM wealth_management.clients;
-- 2. Lowercase asset symbols.
SELECT asset_id, LOWER(symbol) AS symbol_lower
FROM wealth_management.assets;
-- 3. Lowercase portfolio names.
SELECT portfolio_id, LOWER(name) AS name_lower
FROM wealth_management.portfolios;
-- 4. Lowercase account types.
SELECT account_id, LOWER(account_type) AS type_lower
FROM wealth_management.accounts;
-- 5. Lowercase transaction descriptions.
SELECT txn_id, LOWER(description) AS desc_lower
FROM wealth_management.transactions;
-- 6. Lowercase goal statuses.
SELECT goal_id, LOWER(status) AS status_lower
FROM wealth_management.financial_goals;
-- 7. Lowercase asset names.
SELECT asset_id, LOWER(name) AS name_lower
FROM wealth_management.assets;
-- 8. Lowercase phone numbers (no change but cast).
SELECT client_id, LOWER(phone) AS phone_lower
FROM wealth_management.clients;
-- 9. Lowercase concatenated client names.
SELECT client_id, LOWER(first_name + ' ' + last_name) AS name_lower
FROM wealth_management.clients;
-- 10. Lowercase portfolio_owner summary.
SELECT p.portfolio_id, LOWER(p.name + ' by ' + c.first_name) AS owner_lower
FROM wealth_management.portfolios p
JOIN wealth_management.clients c ON p.client_id = c.client_id;
```

## Upper Function (UPPER)
```sql
-- 1. Uppercase all client emails.
SELECT client_id, UPPER(email) AS email_upper
FROM wealth_management.clients;
-- 2. Uppercase asset symbols.
SELECT asset_id, UPPER(symbol) AS symbol_upper
FROM wealth_management.assets;
-- 3. Uppercase portfolio names.
SELECT portfolio_id, UPPER(name) AS name_upper
FROM wealth_management.portfolios;
-- 4. Uppercase account types.
SELECT account_id, UPPER(account_type) AS type_upper
FROM wealth_management.accounts;
-- 5. Uppercase transaction descriptions.
SELECT txn_id, UPPER(description) AS desc_upper
FROM wealth_management.transactions;
-- 6. Uppercase goal statuses.
SELECT goal_id, UPPER(status) AS status_upper
FROM wealth_management.financial_goals;
-- 7. Uppercase asset names.
SELECT asset_id, UPPER(name) AS name_upper
FROM wealth_management.assets;
-- 8. Uppercase phone numbers.
SELECT client_id, UPPER(phone) AS phone_upper
FROM wealth_management.clients;
-- 9. Uppercase concatenated client names.
SELECT client_id, UPPER(first_name + ' ' + last_name) AS name_upper
FROM wealth_management.clients;
-- 10. Uppercase portfolio_owner summary.
SELECT p.portfolio_id, UPPER(p.name + ' by ' + c.first_name) AS owner_upper
FROM wealth_management.portfolios p
JOIN wealth_management.clients c ON p.client_id = c.client_id;
```

## Trim Function (TRIM)
```sql
-- 1. Trim whitespace from transaction descriptions.
SELECT txn_id, TRIM(description) AS desc_trimmed
FROM wealth_management.transactions;
-- 2. Trim portfolio names.
SELECT portfolio_id, TRIM(name) AS name_trimmed
FROM wealth_management.portfolios;
-- 3. Trim client first names.
SELECT client_id, TRIM(first_name) AS fname_trimmed
FROM wealth_management.clients;
-- 4. Trim last names.
SELECT client_id, TRIM(last_name) AS lname_trimmed
FROM wealth_management.clients;
-- 5. Trim asset names.
SELECT asset_id, TRIM(name) AS asset_trimmed
FROM wealth_management.assets;
-- 6. Trim account types.
SELECT account_id, TRIM(account_type) AS type_trimmed
FROM wealth_management.accounts;
-- 7. Trim goal names.
SELECT goal_id, TRIM(goal_name) AS goal_trimmed
FROM wealth_management.financial_goals;
-- 8. Trim email addresses.
SELECT client_id, TRIM(email) AS email_trimmed
FROM wealth_management.clients;
-- 9. Trim phone numbers.
SELECT client_id, TRIM(phone) AS phone_trimmed
FROM wealth_management.clients;
-- 10. Trim concatenated names.
SELECT client_id, TRIM(first_name + ' ' + last_name) AS full_trim
FROM wealth_management.clients;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Remove leading spaces from descriptions.
SELECT txn_id, LTRIM('   ' + description) AS desc_ltrim
FROM wealth_management.transactions;
-- 2. Remove leading spaces from names.
SELECT portfolio_id, LTRIM('  ' + name) AS name_ltrim
FROM wealth_management.portfolios;
-- 3. Remove leading spaces from emails.
SELECT client_id, LTRIM(' ' + email) AS email_ltrim
FROM wealth_management.clients;
-- 4. Remove leading spaces from asset names.
SELECT asset_id, LTRIM('   ' + name) AS name_ltrim
FROM wealth_management.assets;
-- 5. Remove leading spaces from account_type.
SELECT account_id, LTRIM('  ' + account_type) AS type_ltrim
FROM wealth_management.accounts;
-- 6. Remove leading spaces from goal_name.
SELECT goal_id, LTRIM('  ' + goal_name) AS goal_ltrim
FROM wealth_management.financial_goals;
-- 7. Remove leading zeros from quantity if cast to varchar.
SELECT portfolio_id, asset_id, LTRIM('0'+CAST(quantity AS VARCHAR(20))) AS qty_ltrim
FROM wealth_management.portfolio_assets;
-- 8. Remove leading spaces from phone.
SELECT client_id, LTRIM(' '+phone) AS phone_ltrim
FROM wealth_management.clients;
-- 9. Remove leading spaces from concatenated names.
SELECT client_id, LTRIM('  '+first_name + ' ' + last_name) AS full_ltrim
FROM wealth_management.clients;
-- 10. Remove leading spaces from symbol.
SELECT asset_id, LTRIM(' ' + symbol) AS sym_ltrim
FROM wealth_management.assets;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Remove trailing spaces from descriptions.
SELECT txn_id, RTRIM(description + '   ') AS desc_rtrim
FROM wealth_management.transactions;
-- 2. Remove trailing spaces from names.
SELECT portfolio_id, RTRIM(name + '  ') AS name_rtrim
FROM wealth_management.portfolios;
-- 3. Remove trailing spaces from emails.
SELECT client_id, RTRIM(email + ' ') AS email_rtrim
FROM wealth_management.clients;
-- 4. Remove trailing spaces from asset names.
SELECT asset_id, RTRIM(name + '   ') AS name_rtrim
FROM wealth_management.assets;
-- 5. Remove trailing spaces from account_type.
SELECT account_id, RTRIM(account_type + '  ') AS type_rtrim
FROM wealth_management.accounts;
-- 6. Remove trailing spaces from goal_name.
SELECT goal_id, RTRIM(goal_name + '  ') AS goal_rtrim
FROM wealth_management.financial_goals;
-- 7. Remove trailing spaces from phone.
SELECT client_id, RTRIM(phone + ' ') AS phone_rtrim
FROM wealth_management.clients;
-- 8. Remove trailing spaces from concatenated names.
SELECT client_id, RTRIM(first_name + ' ' + last_name + ' ') AS full_rtrim
FROM wealth_management.clients;
-- 9. Remove trailing spaces from symbol.
SELECT asset_id, RTRIM(symbol + ' ') AS sym_rtrim
FROM wealth_management.assets;
-- 10. Remove trailing spaces from status.
SELECT goal_id, RTRIM(status + ' ') AS status_rtrim
FROM wealth_management.financial_goals;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of 'Inc' in asset names.
SELECT asset_id, CHARINDEX('Inc', name) AS pos_inc
FROM wealth_management.assets;
-- 2. Position of '@' in emails.
SELECT client_id, CHARINDEX('@', email) AS pos_at
FROM wealth_management.clients;
-- 3. Position of 'Fund' in goal_name.
SELECT goal_id, CHARINDEX('Fund', goal_name) AS pos_fund
FROM wealth_management.financial_goals;
-- 4. Position of 'Mix' in portfolio names.
SELECT portfolio_id, CHARINDEX('Mix', name) AS pos_mix
FROM wealth_management.portfolios;
-- 5. Position of 'Deposit' in description.
SELECT txn_id, CHARINDEX('Deposit', description) AS pos_dep
FROM wealth_management.transactions;
-- 6. Position of 'Save' in description.
SELECT txn_id, CHARINDEX('Save', description) AS pos_save
FROM wealth_management.transactions;
-- 7. Position of 'Ret' in status.
SELECT goal_id, CHARINDEX('Ret', status) AS pos_ret
FROM wealth_management.financial_goals;
-- 8. Position of '-' in phone.
SELECT client_id, CHARINDEX('-', phone) AS pos_dash
FROM wealth_management.clients;
-- 9. Position of '202' in join_date string.
SELECT client_id, CHARINDEX('202', CONVERT(VARCHAR(10),join_date,120)) AS pos_202
FROM wealth_management.clients;
-- 10. Position of '202' in target_date string.
SELECT goal_id, CHARINDEX('202', CONVERT(VARCHAR(10),target_date,120)) AS pos_202
FROM wealth_management.financial_goals;
```

## Left Function (LEFT)
```sql
-- 1. First 2 letters of each client's first name.
SELECT client_id, LEFT(first_name,2) AS fn_prefix
FROM wealth_management.clients;
-- 2. First 3 of asset symbols.
SELECT asset_id, LEFT(symbol,3) AS sym_prefix
FROM wealth_management.assets;
-- 3. First 4 of portfolio names.
SELECT portfolio_id, LEFT(name,4) AS name_prefix
FROM wealth_management.portfolios;
-- 4. First 5 of email.
SELECT client_id, LEFT(email,5) AS email_prefix
FROM wealth_management.clients;
-- 5. First 2 of account_type.
SELECT account_id, LEFT(account_type,2) AS type_pref
FROM wealth_management.accounts;
-- 6. First 3 of goal_name.
SELECT goal_id, LEFT(goal_name,3) AS goal_pref
FROM wealth_management.financial_goals;
-- 7. First 6 of description.
SELECT txn_id, LEFT(description,6) AS desc_pref
FROM wealth_management.transactions;
-- 8. First 4 of asset name.
SELECT asset_id, LEFT(name,4) AS asset_pref
FROM wealth_management.assets;
-- 9. First 7 of phone.
SELECT client_id, LEFT(phone,7) AS phone_pref
FROM wealth_management.clients;
-- 10. First 4 of status.
SELECT goal_id, LEFT(status,4) AS status_pref
FROM wealth_management.financial_goals;
```

## Right Function (RIGHT)
```sql
-- 1. Last 3 of each client's last name.
SELECT client_id, RIGHT(last_name,3) AS ln_suffix
FROM wealth_management.clients;
-- 2. Last 4 of asset symbols.
SELECT asset_id, RIGHT(symbol,4) AS sym_suf
FROM wealth_management.assets;
-- 3. Last 5 of portfolio names.
SELECT portfolio_id, RIGHT(name,5) AS name_suf
FROM wealth_management.portfolios;
-- 4. Last 3 of email domain.
SELECT client_id, RIGHT(email,3) AS domain_suf
FROM wealth_management.clients;
-- 5. Last 2 of account_type.
SELECT account_id, RIGHT(account_type,2) AS type_suf
FROM wealth_management.accounts;
-- 6. Last 4 of goal_name.
SELECT goal_id, RIGHT(goal_name,4) AS goal_suf
FROM wealth_management.financial_goals;
-- 7. Last 6 of description.
SELECT txn_id, RIGHT(description,6) AS desc_suf
FROM wealth_management.transactions;
-- 8. Last 3 of asset name.
SELECT asset_id, RIGHT(name,3) AS asset_suf
FROM wealth_management.assets;
-- 9. Last 4 of phone.
SELECT client_id, RIGHT(phone,4) AS phone_suf
FROM wealth_management.clients;
-- 10. Last 3 of status.
SELECT goal_id, RIGHT(status,3) AS status_suf
FROM wealth_management.financial_goals;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse each client's first name.
SELECT client_id, REVERSE(first_name) AS fn_rev
FROM wealth_management.clients;
-- 2. Reverse each asset symbol.
SELECT asset_id, REVERSE(symbol) AS sym_rev
FROM wealth_management.assets;
-- 3. Reverse portfolio names.
SELECT portfolio_id, REVERSE(name) AS name_rev
FROM wealth_management.portfolios;
-- 4. Reverse transaction descriptions.
SELECT txn_id, REVERSE(description) AS desc_rev
FROM wealth_management.transactions;
-- 5. Reverse email addresses.
SELECT client_id, REVERSE(email) AS email_rev
FROM wealth_management.clients;
-- 6. Reverse account types.
SELECT account_id, REVERSE(account_type) AS type_rev
FROM wealth_management.accounts;
-- 7. Reverse goal names.
SELECT goal_id, REVERSE(goal_name) AS goal_rev
FROM wealth_management.financial_goals;
-- 8. Reverse phone numbers.
SELECT client_id, REVERSE(phone) AS phone_rev
FROM wealth_management.clients;
-- 9. Reverse asset names.
SELECT asset_id, REVERSE(name) AS asset_rev
FROM wealth_management.assets;
-- 10. Reverse status.
SELECT goal_id, REVERSE(status) AS status_rev
FROM wealth_management.financial_goals;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace 'Inc' with 'Incorporated' in asset names.
SELECT asset_id, REPLACE(name,'Inc','Incorporated') AS new_name
FROM wealth_management.assets;
-- 2. Replace 'Deposit' with 'Dep' in descriptions.
SELECT txn_id, REPLACE(description,'Deposit','Dep') AS desc_short
FROM wealth_management.transactions;
-- 3. Replace 'Checking' with 'Chk' in account_type.
SELECT account_id, REPLACE(account_type,'Checking','Chk') AS type_short
FROM wealth_management.accounts;
-- 4. Replace dashes with spaces in phone.
SELECT client_id, REPLACE(phone,'-',' ') AS phone_spaced
FROM wealth_management.clients;
-- 5. Replace 'Fund' with 'Fd' in goal_name.
SELECT goal_id, REPLACE(goal_name,'Fund','Fd') AS goal_short
FROM wealth_management.financial_goals;
-- 6. Replace 'ETF' with 'Exchange-Traded Fund' in asset_type.
SELECT asset_id, REPLACE(asset_type,'ETF','Exchange-Traded Fund') AS type_full
FROM wealth_management.assets;
-- 7. Replace '/' with '-' in dates for display.
SELECT txn_id, REPLACE(CONVERT(VARCHAR(10),txn_date,101),'/','-') AS date_fmt
FROM wealth_management.transactions;
-- 8. Replace 'Savings' with 'Sav' in account_type.
SELECT account_id, REPLACE(account_type,'Savings','Sav') AS type_abbrev
FROM wealth_management.accounts;
-- 9. Replace 'Retirement' with 'Ret' in portfolio names.
SELECT portfolio_id, REPLACE(name,'Retirement','Ret') AS portfolio_short
FROM wealth_management.portfolios;
-- 10. Replace 'Active' with 'A' in status.
SELECT goal_id, REPLACE(status,'Active','A') AS status_code
FROM wealth_management.financial_goals;
```

## Case Statement (CASE)
```sql
-- 1. Label transactions as 'Credit' or 'Debit'.
SELECT txn_id,
 CASE WHEN amount >= 0 THEN 'Credit' ELSE 'Debit' END AS type
FROM wealth_management.transactions;
-- 2. Categorize accounts as 'Open' or 'Closed'.
SELECT account_id,
 CASE WHEN status = 'Active' THEN 'Open' ELSE 'Closed' END AS open_status
FROM wealth_management.accounts;
-- 3. Classify clients by age group.
SELECT client_id,
 CASE
  WHEN DATEDIFF(YEAR,date_of_birth,GETDATE()) < 30 THEN 'Young'
  WHEN DATEDIFF(YEAR,date_of_birth,GETDATE()) BETWEEN 30 AND 50 THEN 'Mid'
  ELSE 'Senior'
 END AS age_grp
FROM wealth_management.clients;
-- 4. Mark portfolio size.
SELECT portfolio_id,
 CASE WHEN EXISTS (
   SELECT 1 FROM wealth_management.portfolio_assets pa WHERE pa.portfolio_id = p.portfolio_id
 ) THEN 'Populated' ELSE 'Empty' END AS status
FROM wealth_management.portfolios p;
-- 5. Goal progress status.
SELECT goal_id,
 CASE WHEN current_amount >= target_amount THEN 'Achieved'
      WHEN current_amount > 0 THEN 'In Progress'
      ELSE 'Not Started' END AS prog_status
FROM wealth_management.financial_goals;
-- 6. Transaction value bucket.
SELECT txn_id,
 CASE
  WHEN amount > 10000 THEN 'High'
  WHEN amount BETWEEN 1000 AND 10000 THEN 'Medium'
  ELSE 'Low' END AS bucket
FROM wealth_management.transactions;
-- 7. Asset class.
SELECT asset_id,
 CASE WHEN asset_type = 'Stock' THEN 'Equity'
      WHEN asset_type IN ('Bond','ETF') THEN 'Fixed Income'
      ELSE 'Other' END AS class
FROM wealth_management.assets;
-- 8. Client join decade.
SELECT client_id,
 CASE
  WHEN YEAR(join_date) < 2000 THEN 'Pre-2000'
  WHEN YEAR(join_date) BETWEEN 2000 AND 2010 THEN '2000s'
  ELSE '2010+' END AS decade
FROM wealth_management.clients;
-- 9. Account age.
SELECT account_id,
 CASE WHEN DATEDIFF(YEAR,opened_date,GETDATE()) >= 5 THEN 'Old'
      ELSE 'New' END AS age_label
FROM wealth_management.accounts;
-- 10. Portfolio creation era.
SELECT portfolio_id,
 CASE WHEN YEAR(created_date) < 2021 THEN 'Early'
      ELSE 'Recent' END AS era
FROM wealth_management.portfolios;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Default phone to 'N/A'.
SELECT client_id, ISNULL(phone,'N/A') AS phone_no
FROM wealth_management.clients;
-- 2. Default description to 'No desc'.
SELECT txn_id, ISNULL(description,'No desc') AS desc_text
FROM wealth_management.transactions;
-- 3. Default asset name to 'Unknown'.
SELECT asset_id, ISNULL(name,'Unknown') AS asset_name
FROM wealth_management.assets;
-- 4. Default status to 'Unknown'.
SELECT goal_id, ISNULL(status,'Unknown') AS goal_status
FROM wealth_management.financial_goals;
-- 5. Default portfolio name to 'Unnamed'.
SELECT portfolio_id, ISNULL(name,'Unnamed') AS pname
FROM wealth_management.portfolios;
-- 6. Default account_type to 'Standard'.
SELECT account_id, ISNULL(account_type,'Standard') AS atype
FROM wealth_management.accounts;
-- 7. Default email to 'none@example.com'.
SELECT client_id, ISNULL(email,'none@example.com') AS email_addr
FROM wealth_management.clients;
-- 8. Default target_amount to 0.
SELECT goal_id, ISNULL(target_amount,0) AS tgt_amt
FROM wealth_management.financial_goals;
-- 9. Default acquisition_price to 0.
SELECT portfolio_id, asset_id, ISNULL(acquisition_price,0) AS acq_price
FROM wealth_management.portfolio_assets;
-- 10. Default current_amount to 0.
SELECT goal_id, ISNULL(current_amount,0) AS curr_amt
FROM wealth_management.financial_goals;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Show email or phone.
SELECT client_id, COALESCE(email,phone,'N/A') AS contact
FROM wealth_management.clients;
-- 2. Show description or goal_name.
SELECT txn_id, COALESCE(description,CAST(goal_id AS VARCHAR(10)),'None') AS info
FROM wealth_management.transactions;
-- 3. Show portfolio name or 'Unnamed'.
SELECT portfolio_id, COALESCE(name,'Unnamed') AS pname
FROM wealth_management.portfolios;
-- 4. Show asset symbol or 'UNKNOWN'.
SELECT asset_id, COALESCE(symbol,'UNKNOWN') AS sym
FROM wealth_management.assets;
-- 5. Show account_type or 'Standard'.
SELECT account_id, COALESCE(account_type,'Standard') AS atype
FROM wealth_management.accounts;
-- 6. Show goal_name or 'No Goal'.
SELECT goal_id, COALESCE(goal_name,'No Goal') AS gname
FROM wealth_management.financial_goals;
-- 7. Show description, else 'N/A'.
SELECT txn_id, COALESCE(description,'N/A') AS desc_text
FROM wealth_management.transactions;
-- 8. Show phone, else email.
SELECT client_id, COALESCE(phone,email,'None') AS contact
FROM wealth_management.clients;
-- 9. Show current_amount or target_amount.
SELECT goal_id, COALESCE(current_amount,target_amount,0) AS amount
FROM wealth_management.financial_goals;
-- 10. Show quantity or 0.
SELECT portfolio_id, asset_id, COALESCE(quantity,0) AS qty
FROM wealth_management.portfolio_assets;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
