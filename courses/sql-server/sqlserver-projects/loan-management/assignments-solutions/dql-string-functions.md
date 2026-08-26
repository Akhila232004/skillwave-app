![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Get length of each borrower's full name.
SELECT borrower_id, LEN(full_name) AS name_length FROM loan_management.borrowers;
-- 2. Get length of each borrower's contact info.
SELECT borrower_id, LEN(contact_info) AS contact_length FROM loan_management.borrowers;
-- 3. Get length of each borrower's address.
SELECT borrower_id, LEN(address) AS address_length FROM loan_management.borrowers;
-- 4. Get length of each loan's type.
SELECT loan_id, LEN(loan_type) AS type_length FROM loan_management.loans;
-- 5. Get length of each loan's status.
SELECT loan_id, LEN(status) AS status_length FROM loan_management.loans;
-- 6. Get length of principal formatted as string.
SELECT loan_id, LEN(CONVERT(VARCHAR(20), principal)) AS principal_length FROM loan_management.loans;
-- 7. Get length of interest_rate formatted as string.
SELECT loan_id, LEN(CONVERT(VARCHAR(20), interest_rate)) AS rate_length FROM loan_management.loans;
-- 8. List borrowers with full_name longer than 15 characters.
SELECT borrower_id, full_name FROM loan_management.borrowers WHERE LEN(full_name) > 15;
-- 9. Get length of payment amount formatted as string.
SELECT payment_id, LEN(CONVERT(VARCHAR(20), amount)) AS amount_length FROM loan_management.loan_payments;
-- 10. Find payments where the formatted payment_date string length > 10.
SELECT payment_id, LEN(CONVERT(VARCHAR(20), payment_date, 120)) AS date_length
  FROM loan_management.loan_payments
 WHERE LEN(CONVERT(VARCHAR(20), payment_date, 120)) > 10;
```

## Substring Function (SUBSTRING)
```sql
-- 1. Extract first name from full_name.
SELECT borrower_id,
       SUBSTRING(full_name,1,CHARINDEX(' ',full_name)-1) AS first_name
  FROM loan_management.borrowers;
-- 2. Extract last name from full_name.
SELECT borrower_id,
       SUBSTRING(full_name,CHARINDEX(' ',full_name)+1, LEN(full_name)) AS last_name
  FROM loan_management.borrowers;
-- 3. Extract email user part before '@'.
SELECT borrower_id,
       SUBSTRING(contact_info,1,CHARINDEX('@',contact_info)-1) AS email_user
  FROM loan_management.borrowers;
-- 4. Extract email domain part after '@'.
SELECT borrower_id,
       SUBSTRING(contact_info,CHARINDEX('@',contact_info)+1,LEN(contact_info)) AS email_domain
  FROM loan_management.borrowers;
-- 5. Extract street number from address.
SELECT borrower_id,
       SUBSTRING(address,1,CHARINDEX(' ',address)-1) AS street_number
  FROM loan_management.borrowers;
-- 6. Extract city from address (after first comma and space).
SELECT borrower_id,
       SUBSTRING(address,CHARINDEX(',',address)+2,LEN(address)) AS city
  FROM loan_management.borrowers;
-- 7. Extract first three letters of loan_type.
SELECT loan_id, SUBSTRING(loan_type,1,3) AS type_prefix FROM loan_management.loans;
-- 8. Extract first letter of status.
SELECT loan_id, SUBSTRING(status,1,1) AS status_code FROM loan_management.loans;
-- 9. Extract date part (YYYY-MM-DD) of payment_date.
SELECT payment_id,
       SUBSTRING(CONVERT(VARCHAR(10),payment_date,120),1,10) AS pay_date
  FROM loan_management.loan_payments;
-- 10. Extract year from payment_date string.
SELECT payment_id,
       SUBSTRING(CONVERT(VARCHAR(10),payment_date,120),1,4) AS pay_year
  FROM loan_management.loan_payments;
```

## Concatenation Operator (+)
```sql
-- 1. Combine full_name and contact_info.
SELECT borrower_id,
       full_name + ' <' + contact_info + '>' AS contact_display
  FROM loan_management.borrowers;
-- 2. Combine full_name and address.
SELECT borrower_id,
       full_name + ' - ' + address AS info
  FROM loan_management.borrowers;
-- 3. Label loans with ID and type.
SELECT loan_id,
       'Loan #' + CAST(loan_id AS VARCHAR(10)) + ': ' + loan_type AS loan_label
  FROM loan_management.loans;
-- 4. Label payments with ID and amount.
SELECT payment_id,
       'Payment ' + CAST(payment_id AS VARCHAR(10)) + ': ' + CAST(amount AS VARCHAR(20)) AS pay_label
  FROM loan_management.loan_payments;
-- 5. Indicate borrower ID with name.
SELECT borrower_id,
       full_name + ' (ID ' + CAST(borrower_id AS VARCHAR(10)) + ')' AS borrower_tag
  FROM loan_management.borrowers;
-- 6. Describe loan principal and rate.
SELECT loan_id,
       CAST(principal AS VARCHAR(20)) + ' @ ' + CAST(interest_rate AS VARCHAR(10)) AS principal_rate
  FROM loan_management.loans;
-- 7. Show payment amount on date.
SELECT payment_id,
       'Paid ' + CAST(amount AS VARCHAR(20)) + ' on ' + CONVERT(VARCHAR(10),payment_date,120) AS payment_info
  FROM loan_management.loan_payments;
-- 8. Combine first name and last name separated.
SELECT borrower_id,
       SUBSTRING(full_name,1,CHARINDEX(' ',full_name)-1)
       + ' | '
       + SUBSTRING(full_name,CHARINDEX(' ',full_name)+1,LEN(full_name)) AS split_name
  FROM loan_management.borrowers;
-- 9. Concatenate loan_type and status.
SELECT loan_id,
       loan_type + ' (' + status + ')' AS type_status
  FROM loan_management.loans;
-- 10. Combine borrower and loan info.
SELECT b.borrower_id,
       b.full_name
       + ' took a '
       + l.loan_type
       + ' loan of '
       + CAST(l.principal AS VARCHAR(20)) AS summary
  FROM loan_management.borrowers b
  JOIN loan_management.loans l ON b.borrower_id = l.borrower_id;
```

## Lower Function (LOWER)
```sql
-- 1. Convert full_name to lowercase.
SELECT borrower_id, LOWER(full_name) AS name_lower FROM loan_management.borrowers;
-- 2. Convert contact_info to lowercase.
SELECT borrower_id, LOWER(contact_info) AS contact_lower FROM loan_management.borrowers;
-- 3. Convert address to lowercase.
SELECT borrower_id, LOWER(address) AS address_lower FROM loan_management.borrowers;
-- 4. Convert loan_type to lowercase.
SELECT loan_id, LOWER(loan_type) AS type_lower FROM loan_management.loans;
-- 5. Convert status to lowercase.
SELECT loan_id, LOWER(status) AS status_lower FROM loan_management.loans;
-- 6. Convert email domain to lowercase.
SELECT borrower_id,
       LOWER(SUBSTRING(contact_info,CHARINDEX('@',contact_info)+1,LEN(contact_info))) AS domain_lower
  FROM loan_management.borrowers;
-- 7. Lowercase the first 5 letters of full_name.
SELECT borrower_id, LOWER(LEFT(full_name,5)) AS name_prefix_lower FROM loan_management.borrowers;
-- 8. Lowercase address substring after comma.
SELECT borrower_id,
       LOWER(SUBSTRING(address,CHARINDEX(',',address)+2,LEN(address))) AS city_lower
  FROM loan_management.borrowers;
-- 9. Lowercase loan_type with label.
SELECT loan_id,
       LOWER('Type: ' + loan_type) AS labeled_lower FROM loan_management.loans;
-- 10. Lowercase payment_date string.
SELECT payment_id, LOWER(CONVERT(VARCHAR(10),payment_date,120)) AS date_lower FROM loan_management.loan_payments;
```

## Upper Function (UPPER)
```sql
-- 1. Convert full_name to uppercase.
SELECT borrower_id, UPPER(full_name) AS name_upper FROM loan_management.borrowers;
-- 2. Convert contact_info to uppercase.
SELECT borrower_id, UPPER(contact_info) AS contact_upper FROM loan_management.borrowers;
-- 3. Convert address to uppercase.
SELECT borrower_id, UPPER(address) AS address_upper FROM loan_management.borrowers;
-- 4. Convert loan_type to uppercase.
SELECT loan_id, UPPER(loan_type) AS type_upper FROM loan_management.loans;
-- 5. Convert status to uppercase.
SELECT loan_id, UPPER(status) AS status_upper FROM loan_management.loans;
-- 6. Uppercase email user part.
SELECT borrower_id,
       UPPER(SUBSTRING(contact_info,1,CHARINDEX('@',contact_info)-1)) AS user_upper
  FROM loan_management.borrowers;
-- 7. Uppercase first 3 letters of loan_type.
SELECT loan_id, UPPER(SUBSTRING(loan_type,1,3)) AS type_code_upper FROM loan_management.loans;
-- 8. Uppercase address substring before comma.
SELECT borrower_id,
       UPPER(LEFT(address,CHARINDEX(',',address)-1)) AS street_upper
  FROM loan_management.borrowers;
-- 9. Uppercase payment_date string.
SELECT payment_id, UPPER(CONVERT(VARCHAR(10),payment_date,120)) AS date_upper FROM loan_management.loan_payments;
-- 10. Uppercase concatenated info.
SELECT borrower_id,
       UPPER(full_name + ' - ' + address) AS combined_upper FROM loan_management.borrowers;
```

## Trim Function (TRIM)
```sql
-- 1. Trim spaces around full_name.
SELECT borrower_id, TRIM(full_name) AS name_trim FROM loan_management.borrowers;
-- 2. Trim spaces around a padded status.
SELECT loan_id, TRIM(' ' + status + '  ') AS status_trim FROM loan_management.loans;
-- 3. Trim spaces around address.
SELECT borrower_id, TRIM(address) AS address_trim FROM loan_management.borrowers;
-- 4. Trim spaces around loan_type.
SELECT loan_id, TRIM('   ' + loan_type + '  ') AS type_trim FROM loan_management.loans;
-- 5. Trim spaces around contact_info.
SELECT borrower_id, TRIM(' ' + contact_info + ' ') AS contact_trim FROM loan_management.borrowers;
-- 6. Trim spaces around principal_rate label.
SELECT loan_id, TRIM(' ' + CAST(principal AS VARCHAR(20)) + ' @ ' + CAST(interest_rate AS VARCHAR(10))) AS label_trim FROM loan_management.loans;
-- 7. Trim spaces around payment info.
SELECT payment_id, TRIM(' Paid ' + CAST(amount AS VARCHAR(20)) + ' ') AS pay_trim FROM loan_management.loan_payments;
-- 8. Trim spaces on concatenated name/address.
SELECT borrower_id, TRIM(' ' + full_name + ' - ' + address + ' ') AS info_trim FROM loan_management.borrowers;
-- 9. Trim spaces around year substring.
SELECT payment_id, TRIM(SUBSTRING(CONVERT(VARCHAR(10),payment_date,120),1,4)) AS year_trim FROM loan_management.loan_payments;
-- 10. Trim spaces around numeric string.
SELECT loan_id, TRIM(CAST(term_months AS VARCHAR(10))) AS term_trim FROM loan_management.loans;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Remove leading spaces from full_name.
SELECT borrower_id, LTRIM('   ' + full_name) AS name_ltrim FROM loan_management.borrowers;
-- 2. Remove leading spaces from status.
SELECT loan_id, LTRIM(' ' + status) AS status_ltrim FROM loan_management.loans;
-- 3. Remove leading spaces from address.
SELECT borrower_id, LTRIM('    ' + address) AS address_ltrim FROM loan_management.borrowers;
-- 4. Remove leading spaces from loan_type.
SELECT loan_id, LTRIM(' ' + loan_type) AS type_ltrim FROM loan_management.loans;
-- 5. Remove leading spaces from contact_info.
SELECT borrower_id, LTRIM(' ' + contact_info) AS contact_ltrim FROM loan_management.borrowers;
-- 6. Remove leading spaces from principal string.
SELECT loan_id, LTRIM('  ' + CAST(principal AS VARCHAR(20))) AS pri_ltrim FROM loan_management.loans;
-- 7. Remove leading spaces from concatenated info.
SELECT borrower_id, LTRIM('  ' + full_name + '|' + address) AS info_ltrim FROM loan_management.borrowers;
-- 8. Remove leading spaces from date string.
SELECT payment_id, LTRIM(' ' + CONVERT(VARCHAR(10),payment_date,120)) AS date_ltrim FROM loan_management.loan_payments;
-- 9. Remove leading spaces from term_months.
SELECT loan_id, LTRIM('   ' + CAST(term_months AS VARCHAR(10))) AS term_ltrim FROM loan_management.loans;
-- 10. Remove leading spaces from loan label.
SELECT loan_id, LTRIM(' ' + 'Loan#' + CAST(loan_id AS VARCHAR(10))) AS label_ltrim FROM loan_management.loans;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Remove trailing spaces from full_name.
SELECT borrower_id, RTRIM(full_name + '   ') AS name_rtrim FROM loan_management.borrowers;
-- 2. Remove trailing spaces from status.
SELECT loan_id, RTRIM(status + ' ') AS status_rtrim FROM loan_management.loans;
-- 3. Remove trailing spaces from address.
SELECT borrower_id, RTRIM(address + '    ') AS address_rtrim FROM loan_management.borrowers;
-- 4. Remove trailing spaces from loan_type.
SELECT loan_id, RTRIM(loan_type + ' ') AS type_rtrim FROM loan_management.loans;
-- 5. Remove trailing spaces from contact_info.
SELECT borrower_id, RTRIM(contact_info + ' ') AS contact_rtrim FROM loan_management.borrowers;
-- 6. Remove trailing spaces from principal string.
SELECT loan_id, RTRIM(CAST(principal AS VARCHAR(20)) + '  ') AS pri_rtrim FROM loan_management.loans;
-- 7. Remove trailing spaces from concatenated info.
SELECT borrower_id, RTRIM(full_name + '|' + address + '  ') AS info_rtrim FROM loan_management.borrowers;
-- 8. Remove trailing spaces from date string.
SELECT payment_id, RTRIM(CONVERT(VARCHAR(10),payment_date,120) + ' ') AS date_rtrim FROM loan_management.loan_payments;
-- 9. Remove trailing spaces from term_months.
SELECT loan_id, RTRIM(CAST(term_months AS VARCHAR(10)) + '   ') AS term_rtrim FROM loan_management.loans;
-- 10. Remove trailing spaces from loan label.
SELECT loan_id, RTRIM('Loan#' + CAST(loan_id AS VARCHAR(10)) + ' ') AS label_rtrim FROM loan_management.loans;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Find position of space in full_name.
SELECT borrower_id, CHARINDEX(' ',full_name) AS space_pos FROM loan_management.borrowers;
-- 2. Find position of '@' in contact_info.
SELECT borrower_id, CHARINDEX('@',contact_info) AS at_pos FROM loan_management.borrowers;
-- 3. Find position of ',' in address.
SELECT borrower_id, CHARINDEX(',',address) AS comma_pos FROM loan_management.borrowers;
-- 4. Find position of 'a' in loan_type.
SELECT loan_id, CHARINDEX('a',loan_type) AS a_pos FROM loan_management.loans;
-- 5. Find position of 't' in status.
SELECT loan_id, CHARINDEX('t',status) AS t_pos FROM loan_management.loans;
-- 6. Find position of '.' in amount string.
SELECT payment_id, CHARINDEX('.',CAST(amount AS VARCHAR(20))) AS dot_pos FROM loan_management.loan_payments;
-- 7. Find position of '-' in payment_date string.
SELECT payment_id, CHARINDEX('-',CONVERT(VARCHAR(10),payment_date,120)) AS dash_pos FROM loan_management.loan_payments;
-- 8. Find position of 'Lo' in loan_type.
SELECT loan_id, CHARINDEX('Lo',loan_type) AS lo_pos FROM loan_management.loans;
-- 9. Find position of 'z' in status (may return 0).
SELECT loan_id, CHARINDEX('z',status) AS z_pos FROM loan_management.loans;
-- 10. Find position of 'Spr' in address.
SELECT borrower_id, CHARINDEX('Spr',address) AS spr_pos FROM loan_management.borrowers;
```

## Left Function (LEFT)
```sql
-- 1. Get first 5 chars of full_name.
SELECT borrower_id, LEFT(full_name,5) AS name_start FROM loan_management.borrowers;
-- 2. Get first 3 chars of loan_type.
SELECT loan_id, LEFT(loan_type,3) AS type_code FROM loan_management.loans;
-- 3. Get first 2 chars of status.
SELECT loan_id, LEFT(status,2) AS status_code FROM loan_management.loans;
-- 4. Get first 4 chars of address.
SELECT borrower_id, LEFT(address,4) AS addr_start FROM loan_management.borrowers;
-- 5. Get first letter of contact_info.
SELECT borrower_id, LEFT(contact_info,1) AS first_char_email FROM loan_management.borrowers;
-- 6. Get first 7 chars of principal string.
SELECT loan_id, LEFT(CAST(principal AS VARCHAR(20)),7) AS pri_start FROM loan_management.loans;
-- 7. Get first 10 chars of payment_date string.
SELECT payment_id, LEFT(CONVERT(VARCHAR(10),payment_date,120),10) AS date_part FROM loan_management.loan_payments;
-- 8. Get first 6 chars of amount string.
SELECT payment_id, LEFT(CAST(amount AS VARCHAR(20)),6) AS amt_start FROM loan_management.loan_payments;
-- 9. Get first 8 chars of CONCAT(full_name and address).
SELECT borrower_id, LEFT(full_name + address,8) AS combo_start FROM loan_management.borrowers;
-- 10. Get first 2 chars of term_months.
SELECT loan_id, LEFT(CAST(term_months AS VARCHAR(10)),2) AS term_start FROM loan_management.loans;
```

## Right Function (RIGHT)
```sql
-- 1. Get last 5 chars of full_name.
SELECT borrower_id, RIGHT(full_name,5) AS name_end FROM loan_management.borrowers;
-- 2. Get last 3 chars of loan_type.
SELECT loan_id, RIGHT(loan_type,3) AS type_end FROM loan_management.loans;
-- 3. Get last 2 chars of status.
SELECT loan_id, RIGHT(status,2) AS status_end FROM loan_management.loans;
-- 4. Get last 4 chars of address.
SELECT borrower_id, RIGHT(address,4) AS addr_end FROM loan_management.borrowers;
-- 5. Get last char of contact_info.
SELECT borrower_id, RIGHT(contact_info,1) AS email_end FROM loan_management.borrowers;
-- 6. Get last 7 chars of principal string.
SELECT loan_id, RIGHT(CAST(principal AS VARCHAR(20)),7) AS pri_end FROM loan_management.loans;
-- 7. Get last 10 chars of payment_date string.
SELECT payment_id, RIGHT(CONVERT(VARCHAR(10),payment_date,120),10) AS date_end FROM loan_management.loan_payments;
-- 8. Get last 6 chars of amount string.
SELECT payment_id, RIGHT(CAST(amount AS VARCHAR(20)),6) AS amt_end FROM loan_management.loan_payments;
-- 9. Get last 8 chars of CONCAT(full_name and address).
SELECT borrower_id, RIGHT(full_name + address,8) AS combo_end FROM loan_management.borrowers;
-- 10. Get last 2 chars of term_months.
SELECT loan_id, RIGHT(CAST(term_months AS VARCHAR(10)),2) AS term_end FROM loan_management.loans;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse full_name.
SELECT borrower_id, REVERSE(full_name) AS name_rev FROM loan_management.borrowers;
-- 2. Reverse loan_type.
SELECT loan_id, REVERSE(loan_type) AS type_rev FROM loan_management.loans;
-- 3. Reverse status.
SELECT loan_id, REVERSE(status) AS status_rev FROM loan_management.loans;
-- 4. Reverse address.
SELECT borrower_id, REVERSE(address) AS addr_rev FROM loan_management.borrowers;
-- 5. Reverse contact_info.
SELECT borrower_id, REVERSE(contact_info) AS contact_rev FROM loan_management.borrowers;
-- 6. Reverse principal string.
SELECT loan_id, REVERSE(CAST(principal AS VARCHAR(20))) AS pri_rev FROM loan_management.loans;
-- 7. Reverse payment_date string.
SELECT payment_id, REVERSE(CONVERT(VARCHAR(10),payment_date,120)) AS date_rev FROM loan_management.loan_payments;
-- 8. Reverse amount string.
SELECT payment_id, REVERSE(CAST(amount AS VARCHAR(20))) AS amt_rev FROM loan_management.loan_payments;
-- 9. Reverse concatenated full_name and loan_type.
SELECT loan_id, REVERSE(full_name + '|' + loan_type) AS combo_rev FROM loan_management.loans l
  JOIN loan_management.borrowers b ON l.borrower_id = b.borrower_id;
-- 10. Reverse first name extracted.
SELECT borrower_id, REVERSE(SUBSTRING(full_name,1,CHARINDEX(' ',full_name)-1)) AS first_rev FROM loan_management.borrowers;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace spaces with underscores in full_name.
SELECT borrower_id, REPLACE(full_name,' ','_') AS name_no_space FROM loan_management.borrowers;
-- 2. Replace 'St' with 'Street' in address.
SELECT borrower_id, REPLACE(address,'St','Street') AS addr_full FROM loan_management.borrowers;
-- 3. Replace 'Active' with 'A' in status.
SELECT loan_id, REPLACE(status,'Active','A') AS status_short FROM loan_management.loans;
-- 4. Replace 'Personal' with 'Pers' in loan_type.
SELECT loan_id, REPLACE(loan_type,'Personal','Pers') AS type_short FROM loan_management.loans;
-- 5. Replace '.' with '' in amount string.
SELECT payment_id, REPLACE(CAST(amount AS VARCHAR(20)),'.','') AS amt_clean FROM loan_management.loan_payments;
-- 6. Replace '-' with '/' in payment_date string.
SELECT payment_id, REPLACE(CONVERT(VARCHAR(10),payment_date,120),'-','/') AS date_fmt FROM loan_management.loan_payments;
-- 7. Replace 'Example' with 'Ex' in email domain.
SELECT borrower_id,
       REPLACE(contact_info,'@example.com','@ex.com') AS email_new
  FROM loan_management.borrowers;
-- 8. Replace 'Loan' with 'L' in loan_type.
SELECT loan_id, REPLACE(loan_type,'Loan','L') AS type_code FROM loan_management.loans;
-- 9. Replace commas with semicolons in address.
SELECT borrower_id, REPLACE(address,',',';') AS addr_semicolon FROM loan_management.borrowers;
-- 10. Replace multiple spaces with single in full_name.
SELECT borrower_id,
       REPLACE(REPLACE(full_name,'  ',' '),'  ',' ') AS name_clean
  FROM loan_management.borrowers;
```

## Case Statement (CASE)
```sql
-- 1. Categorize loans by principal size.
SELECT loan_id,
       CASE
         WHEN principal < 20000 THEN 'Small'
         WHEN principal BETWEEN 20000 AND 50000 THEN 'Medium'
         ELSE 'Large'
       END AS principal_category
  FROM loan_management.loans;
-- 2. Label payments as High or Low.
SELECT payment_id,
       CASE WHEN amount > 1000 THEN 'High' ELSE 'Low' END AS payment_level
  FROM loan_management.loan_payments;
-- 3. Categorize borrowers by birth decade.
SELECT borrower_id,
       CASE
         WHEN YEAR(date_of_birth) < 1980 THEN 'Before 80s'
         WHEN YEAR(date_of_birth) BETWEEN 1980 AND 1999 THEN '80s-90s'
         ELSE '2000s+'
       END AS dob_group
  FROM loan_management.borrowers;
-- 4. Mark loans as LongTerm or ShortTerm.
SELECT loan_id,
       CASE WHEN term_months >= 60 THEN 'LongTerm' ELSE 'ShortTerm' END AS term_type
  FROM loan_management.loans;
-- 5. Indicate if a loan is Active or Not.
SELECT loan_id,
       CASE status WHEN 'Active' THEN 'Yes' ELSE 'No' END AS is_active
  FROM loan_management.loans;
-- 6. Classify interest_rate as Low/Medium/High.
SELECT loan_id,
       CASE
         WHEN interest_rate < 0.04 THEN 'Low'
         WHEN interest_rate BETWEEN 0.04 AND 0.05 THEN 'Medium'
         ELSE 'High'
       END AS rate_category
  FROM loan_management.loans;
-- 7. Flag payments made in 2023.
SELECT payment_id,
       CASE WHEN YEAR(payment_date)=2023 THEN '2023' ELSE 'Other' END AS pay_year
  FROM loan_management.loan_payments;
-- 8. Categorize borrowers as Adult or Minor.
SELECT borrower_id,
       CASE WHEN DATEDIFF(YEAR,date_of_birth,GETDATE())>=18 THEN 'Adult' ELSE 'Minor' END AS age_group
  FROM loan_management.borrowers;
-- 9. Combine loan_type and status into one label.
SELECT loan_id,
       CASE
         WHEN status='Active' THEN loan_type + ' (Ongoing)'
         ELSE loan_type + ' (Closed)'
       END AS loan_label
  FROM loan_management.loans;
-- 10. Classify month of payment.
SELECT payment_id,
       CASE MONTH(payment_date)
         WHEN 1 THEN 'Jan'
         WHEN 2 THEN 'Feb'
         WHEN 3 THEN 'Mar'
         WHEN 4 THEN 'Apr'
         WHEN 5 THEN 'May'
         WHEN 6 THEN 'Jun'
         WHEN 7 THEN 'Jul'
         WHEN 8 THEN 'Aug'
         WHEN 9 THEN 'Sep'
         WHEN 10 THEN 'Oct'
         WHEN 11 THEN 'Nov'
         ELSE 'Dec'
       END AS pay_month
  FROM loan_management.loan_payments;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Replace null contact_info with 'No Contact'.
SELECT borrower_id, ISNULL(contact_info,'No Contact') AS contact_safe FROM loan_management.borrowers;
-- 2. Replace null address with 'No Address'.
SELECT borrower_id, ISNULL(address,'No Address') AS address_safe FROM loan_management.borrowers;
-- 3. Replace null loan_type with 'Unknown'.
SELECT loan_id, ISNULL(loan_type,'Unknown') AS type_safe FROM loan_management.loans;
-- 4. Replace null status with 'Unknown'.
SELECT loan_id, ISNULL(status,'Unknown') AS status_safe FROM loan_management.loans;
-- 5. Replace null principal with 0.
SELECT loan_id, ISNULL(principal,0) AS principal_safe FROM loan_management.loans;
-- 6. Replace null interest_rate with 0.
SELECT loan_id, ISNULL(interest_rate,0) AS rate_safe FROM loan_management.loans;
-- 7. Replace null payment_date with '1900-01-01'.
SELECT payment_id, ISNULL(CONVERT(DATE,payment_date),'1900-01-01') AS date_safe FROM loan_management.loan_payments;
-- 8. Replace null amount with 0.
SELECT payment_id, ISNULL(amount,0) AS amount_safe FROM loan_management.loan_payments;
-- 9. Replace null principal_component with 0.
SELECT payment_id, ISNULL(principal_component,0) AS prin_comp_safe FROM loan_management.loan_payments;
-- 10. Replace null interest_component with 0.
SELECT payment_id, ISNULL(interest_component,0) AS int_comp_safe FROM loan_management.loan_payments;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Show first non-null contact or address.
SELECT borrower_id, COALESCE(contact_info,address,'N/A') AS contact_or_addr FROM loan_management.borrowers;
-- 2. Show loan_type or 'Unknown'.
SELECT loan_id, COALESCE(loan_type,'Unknown') AS type_co FROM loan_management.loans;
-- 3. Show status or 'Unknown'.
SELECT loan_id, COALESCE(status,'Unknown') AS status_co FROM loan_management.loans;
-- 4. Show principal or 0.
SELECT loan_id, COALESCE(principal,0) AS principal_co FROM loan_management.loans;
-- 5. Show interest_rate or 0.
SELECT loan_id, COALESCE(interest_rate,0) AS rate_co FROM loan_management.loans;
-- 6. Show payment_date or fallback.
SELECT payment_id, COALESCE(CONVERT(VARCHAR(10),payment_date,120),'1900-01-01') AS date_co FROM loan_management.loan_payments;
-- 7. Show amount or 0.
SELECT payment_id, COALESCE(amount,0) AS amount_co FROM loan_management.loan_payments;
-- 8. Show principal_component or 0.
SELECT payment_id, COALESCE(principal_component,0) AS prin_comp_co FROM loan_management.loan_payments;
-- 9. Show interest_component or 0.
SELECT payment_id, COALESCE(interest_component,0) AS int_comp_co FROM loan_management.loan_payments;
-- 10. First non-null in borrower name or 'Guest'.
SELECT borrower_id, COALESCE(full_name,'Guest') AS name_co FROM loan_management.borrowers;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
