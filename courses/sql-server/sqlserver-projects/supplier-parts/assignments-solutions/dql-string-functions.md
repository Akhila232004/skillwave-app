![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Show length of each part_name.
SELECT part_id, LEN(part_name) AS name_length FROM supplier_parts.parts;
-- 2. Show length of each supplier_name.
SELECT supplier_id, LEN(supplier_name) AS name_length FROM supplier_parts.suppliers;
-- 3. Show length of part_description.
SELECT part_id, LEN(part_description) AS desc_length FROM supplier_parts.parts;
-- 4. Show length of contact_name.
SELECT supplier_id, LEN(contact_name) AS contact_length FROM supplier_parts.suppliers;
-- 5. Show combined length of supplier_name and contact_name.
SELECT supplier_id, LEN(supplier_name + contact_name) AS total_length FROM supplier_parts.suppliers;
-- 6. Show length of unit_price converted to string.
SELECT part_id, LEN(CAST(unit_price AS VARCHAR(20))) AS price_str_length FROM supplier_parts.parts;
-- 7. Show length of supplier address.
SELECT supplier_id, LEN(address) AS address_length FROM supplier_parts.suppliers;
-- 8. Show length of part_name plus hyphen plus part_description.
SELECT part_id, LEN(part_name + '-' + part_description) AS combined_length FROM supplier_parts.parts;
-- 9. Show length of email domain in contact_email.
SELECT supplier_id, LEN(SUBSTRING(contact_email, CHARINDEX('@',contact_email)+1, LEN(contact_email))) AS domain_length FROM supplier_parts.suppliers;
-- 10. Show length of trimmed supplier_name.
SELECT supplier_id, LEN(TRIM(supplier_name)) AS trimmed_length FROM supplier_parts.suppliers;
```

## Substring Function (SUBSTRING)
```sql
-- 1. Extract first 3 characters of part_name.
SELECT part_id, SUBSTRING(part_name,1,3) AS prefix FROM supplier_parts.parts;
-- 2. Extract last 3 characters of part_name.
SELECT part_id, SUBSTRING(part_name,LEN(part_name)-2,3) AS suffix FROM supplier_parts.parts;
-- 3. Extract characters 5–8 of supplier_name.
SELECT supplier_id, SUBSTRING(supplier_name,5,4) AS mid FROM supplier_parts.suppliers;
-- 4. Extract first 5 characters of part_description.
SELECT part_id, SUBSTRING(part_description,1,5) AS start_desc FROM supplier_parts.parts;
-- 5. Extract middle 3 chars of contact_name.
SELECT supplier_id, SUBSTRING(contact_name, LEN(contact_name)/2,3) AS mid_contact FROM supplier_parts.suppliers;
-- 6. Extract 4 chars starting at position 2 of address.
SELECT supplier_id, SUBSTRING(address,2,4) AS addr_fragment FROM supplier_parts.suppliers;
-- 7. Extract 2 chars after hyphen in part_name.
SELECT part_id, SUBSTRING(part_name, CHARINDEX(' ',part_name)+1,2) AS post_space FROM supplier_parts.parts;
-- 8. Extract domain from contact_email.
SELECT supplier_id, SUBSTRING(contact_email,CHARINDEX('@',contact_email)+1,LEN(contact_email)) AS domain FROM supplier_parts.suppliers;
-- 9. Extract three chars before extension in contact_email.
SELECT supplier_id, SUBSTRING(contact_email, CHARINDEX('.',contact_email)-3,3) AS pre_dot FROM supplier_parts.suppliers;
-- 10. Extract first letter of each part_name.
SELECT part_id, SUBSTRING(part_name,1,1) AS first_letter FROM supplier_parts.parts;
```

## Concatenation Operator (+)
```sql
-- 1. Concatenate part_name and part_description.
SELECT part_name + ' - ' + part_description AS full_desc FROM supplier_parts.parts;
-- 2. Concatenate supplier_name and address.
SELECT supplier_name + ', ' + address AS full_addr FROM supplier_parts.suppliers;
-- 3. Concatenate contact_name and contact_email.
SELECT contact_name + ' <' + contact_email + '>' AS contact_info FROM supplier_parts.suppliers;
-- 4. Concatenate part_name and unit_price.
SELECT part_name + ' ($' + CAST(unit_price AS VARCHAR(10)) + ')' AS labeled_price FROM supplier_parts.parts;
-- 5. Concatenate supplier_id and supplier_name.
SELECT CAST(supplier_id AS VARCHAR(5)) + '-' + supplier_name AS sup_label FROM supplier_parts.suppliers;
-- 6. Concatenate part_id, part_name, and supplier_id.
SELECT CAST(part_id AS VARCHAR(5)) + ':' + part_name + ':' + CAST(supplier_id AS VARCHAR(5)) AS composite FROM supplier_parts.parts;
-- 7. Concatenate trimmed part_name and uppercase part_description.
SELECT TRIM(part_name) + ' :: ' + UPPER(part_description) AS combo FROM supplier_parts.parts;
-- 8. Concatenate Left 3 of part_name and Right 2 of supplier_name.
SELECT LEFT(part_name,3) + RIGHT(supplier_name,2) AS mix FROM supplier_parts.parts CROSS JOIN supplier_parts.suppliers;
-- 9. Concatenate contact_name and phone_number.
SELECT contact_name + ' (' + phone_number + ')' AS contact_phone FROM supplier_parts.suppliers;
-- 10. Concatenate part_name, ' by ', supplier_name.
SELECT p.part_name + ' by ' + s.supplier_name AS attribution FROM supplier_parts.parts p INNER JOIN supplier_parts.suppliers s ON p.supplier_id=s.supplier_id;
```

## Lower Function (LOWER)
```sql
-- 1. Convert part_name to lowercase.
SELECT LOWER(part_name) AS lower_name FROM supplier_parts.parts;
-- 2. Convert supplier_name to lowercase.
SELECT LOWER(supplier_name) AS lower_sup FROM supplier_parts.suppliers;
-- 3. Convert part_description to lowercase.
SELECT LOWER(part_description) AS lower_desc FROM supplier_parts.parts;
-- 4. Convert contact_email to lowercase.
SELECT LOWER(contact_email) AS lower_email FROM supplier_parts.suppliers;
-- 5. Compare LOWER(part_name) to 'widget'.
SELECT part_id FROM supplier_parts.parts WHERE LOWER(part_name) = 'widget';
-- 6. Show lowercase supplier address.
SELECT LOWER(address) AS lower_addr FROM supplier_parts.suppliers;
-- 7. Show lowercase contact_name.
SELECT LOWER(contact_name) AS lower_contact FROM supplier_parts.suppliers;
-- 8. Show lowercase concatenation of name and email.
SELECT LOWER(contact_name + ' ' + contact_email) AS info FROM supplier_parts.suppliers;
-- 9. Show lowercase part_name trimmed.
SELECT LOWER(LTRIM(RTRIM(part_name))) AS clean_lower FROM supplier_parts.parts;
-- 10. Show lowercase domain of contact_email.
SELECT LOWER(SUBSTRING(contact_email,CHARINDEX('@',contact_email)+1,LEN(contact_email))) AS lower_domain FROM supplier_parts.suppliers;
```

## Upper Function (UPPER)
```sql
-- 1. Convert part_name to uppercase.
SELECT UPPER(part_name) AS upper_name FROM supplier_parts.parts;
-- 2. Convert supplier_name to uppercase.
SELECT UPPER(supplier_name) AS upper_sup FROM supplier_parts.suppliers;
-- 3. Convert part_description to uppercase.
SELECT UPPER(part_description) AS upper_desc FROM supplier_parts.parts;
-- 4. Convert contact_email to uppercase.
SELECT UPPER(contact_email) AS upper_email FROM supplier_parts.suppliers;
-- 5. Display uppercase address.
SELECT UPPER(address) AS upper_addr FROM supplier_parts.suppliers;
-- 6. Compare UPPER(part_name) to 'GIZMO'.
SELECT part_id FROM supplier_parts.parts WHERE UPPER(part_name) = 'GIZMO';
-- 7. Show uppercase concatenation of supplier and contact.
SELECT UPPER(supplier_name + ' - ' + contact_name) AS pair FROM supplier_parts.suppliers;
-- 8. Show uppercase left 5 of part_description.
SELECT UPPER(LEFT(part_description,5)) AS up_pref FROM supplier_parts.parts;
-- 9. Show uppercase reversed part_name.
SELECT UPPER(REVERSE(part_name)) AS up_rev FROM supplier_parts.parts;
-- 10. Show uppercase domain of email.
SELECT UPPER(SUBSTRING(contact_email,CHARINDEX('@',contact_email)+1,LEN(contact_email))) AS up_domain FROM supplier_parts.suppliers;
```

## Trim Function (TRIM)
```sql
-- 1. Trim spaces from part_name.
SELECT TRIM(part_name) AS clean_name FROM supplier_parts.parts;
-- 2. Trim spaces from supplier_name.
SELECT TRIM(supplier_name) AS clean_sup FROM supplier_parts.suppliers;
-- 3. Trim spaces from part_description.
SELECT TRIM(part_description) AS clean_desc FROM supplier_parts.parts;
-- 4. Trim spaces from contact_email.
SELECT TRIM(contact_email) AS clean_email FROM supplier_parts.suppliers;
-- 5. Trim and uppercase part_name.
SELECT UPPER(TRIM(part_name)) AS up_clean FROM supplier_parts.parts;
-- 6. Trim and lowercase supplier_name.
SELECT LOWER(TRIM(supplier_name)) AS low_clean FROM supplier_parts.suppliers;
-- 7. Trim concatenated fields.
SELECT TRIM(part_name + ' ' + part_description) AS combo_clean FROM supplier_parts.parts;
-- 8. Trim phone_number.
SELECT TRIM(phone_number) AS clean_phone FROM supplier_parts.suppliers;
-- 9. Trim and substring address.
SELECT SUBSTRING(TRIM(address),1,10) AS addr10 FROM supplier_parts.suppliers;
-- 10. Trim and replace in part_description.
SELECT REPLACE(TRIM(part_description),'  ',' ') AS norm_desc FROM supplier_parts.parts;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Remove leading spaces from part_name.
SELECT LTRIM('   ' + part_name) AS left_trimmed FROM supplier_parts.parts;
-- 2. Remove leading spaces from supplier_name.
SELECT LTRIM('  ' + supplier_name) AS left_trim_sup FROM supplier_parts.suppliers;
-- 3. LTRIM on part_description.
SELECT LTRIM(' ' + part_description) AS left_desc FROM supplier_parts.parts;
-- 4. LTRIM on contact_email.
SELECT LTRIM(' ' + contact_email) AS left_email FROM supplier_parts.suppliers;
-- 5. LTRIM and LEN of part_name.
SELECT LEN(LTRIM(part_name)) AS len_ltrim FROM supplier_parts.parts;
-- 6. LTRIM and UPPER of supplier_name.
SELECT UPPER(LTRIM(supplier_name)) AS up_ltrim FROM supplier_parts.suppliers;
-- 7. LTRIM concatenation.
SELECT LTRIM(' ' + part_name + ' - ' + supplier_name) AS combo_trim FROM supplier_parts.parts CROSS JOIN supplier_parts.suppliers;
-- 8. LTRIM on phone_number.
SELECT LTRIM(' ' + phone_number) AS left_phone FROM supplier_parts.suppliers;
-- 9. LTRIM on address.
SELECT LTRIM(' ' + address) AS left_addr FROM supplier_parts.suppliers;
-- 10. LTRIM on reversed part_name.
SELECT LTRIM(REVERSE(' ' + part_name)) AS left_rev FROM supplier_parts.parts;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Remove trailing spaces from part_name.
SELECT RTRIM(part_name + '   ') AS right_trimmed FROM supplier_parts.parts;
-- 2. Remove trailing spaces from supplier_name.
SELECT RTRIM(supplier_name + '  ') AS right_trim_sup FROM supplier_parts.suppliers;
-- 3. RTRIM on part_description.
SELECT RTRIM(part_description + ' ') AS right_desc FROM supplier_parts.parts;
-- 4. RTRIM on contact_email.
SELECT RTRIM(contact_email + ' ') AS right_email FROM supplier_parts.suppliers;
-- 5. RTRIM and LEN of part_name.
SELECT LEN(RTRIM(part_name)) AS len_rtrim FROM supplier_parts.parts;
-- 6. RTRIM and LOWER of supplier_name.
SELECT LOWER(RTRIM(supplier_name)) AS low_rtrim FROM supplier_parts.suppliers;
-- 7. RTRIM concatenation.
SELECT RTRIM(part_name + ' ' + supplier_name + ' ') AS combo_rtrim FROM supplier_parts.parts CROSS JOIN supplier_parts.suppliers;
-- 8. RTRIM on phone_number.
SELECT RTRIM(phone_number + ' ') AS right_phone FROM supplier_parts.suppliers;
-- 9. RTRIM on address.
SELECT RTRIM(address + ' ') AS right_addr FROM supplier_parts.suppliers;
-- 10. RTRIM on reversed part_name.
SELECT RTRIM(REVERSE(part_name) + ' ') AS right_rev FROM supplier_parts.parts;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Find position of 'a' in part_name.
SELECT part_id, CHARINDEX('a',part_name) AS pos FROM supplier_parts.parts;
-- 2. Position of 'Inc' in supplier_name.
SELECT supplier_id, CHARINDEX('Inc',supplier_name) AS pos FROM supplier_parts.suppliers;
-- 3. Position of '-' in part_description.
SELECT part_id, CHARINDEX('-',part_description) AS pos FROM supplier_parts.parts;
-- 4. Position of '@' in contact_email.
SELECT supplier_id, CHARINDEX('@',contact_email) AS pos FROM supplier_parts.suppliers;
-- 5. Position of ' ' in supplier_name.
SELECT supplier_id, CHARINDEX(' ',supplier_name) AS pos FROM supplier_parts.suppliers;
-- 6. Position of 'oo' in part_name.
SELECT part_id, CHARINDEX('oo',part_name) AS pos FROM supplier_parts.parts;
-- 7. Position of 'St' in address.
SELECT supplier_id, CHARINDEX('St',address) AS pos FROM supplier_parts.suppliers;
-- 8. Position of 'valve' in part_description.
SELECT part_id, CHARINDEX('valve',part_description) AS pos FROM supplier_parts.parts;
-- 9. Position of 'Co' in supplier_name.
SELECT supplier_id, CHARINDEX('Co',supplier_name) AS pos FROM supplier_parts.suppliers;
-- 10. Position of 'x' in part_name.
SELECT part_id, CHARINDEX('x',part_name) AS pos FROM supplier_parts.parts;
```

## Left Function (LEFT)
```sql
-- 1. Left 2 chars of part_name.
SELECT part_id, LEFT(part_name,2) AS first2 FROM supplier_parts.parts;
-- 2. Left 4 chars of supplier_name.
SELECT supplier_id, LEFT(supplier_name,4) AS first4 FROM supplier_parts.suppliers;
-- 3. Left 5 chars of part_description.
SELECT part_id, LEFT(part_description,5) AS first5 FROM supplier_parts.parts;
-- 4. Left 1 char of contact_name.
SELECT supplier_id, LEFT(contact_name,1) AS first1 FROM supplier_parts.suppliers;
-- 5. Left 3 chars of address.
SELECT supplier_id, LEFT(address,3) AS first3 FROM supplier_parts.suppliers;
-- 6. Left 2 chars of unit_price as string.
SELECT part_id, LEFT(CAST(unit_price AS VARCHAR(10)),2) AS price_pref FROM supplier_parts.parts;
-- 7. Left of trimmed part_name.
SELECT part_id, LEFT(LTRIM(RTRIM(part_name)),3) AS clean_pref FROM supplier_parts.parts;
-- 8. Left of lowercased part_name.
SELECT part_id, LEFT(LOWER(part_name),3) AS low_pref FROM supplier_parts.parts;
-- 9. Left of reversed part_name.
SELECT part_id, LEFT(REVERSE(part_name),2) AS rev_pref FROM supplier_parts.parts;
-- 10. Left of concatenated name-description.
SELECT LEFT(part_name + part_description,4) AS combo_prefix FROM supplier_parts.parts;
```

## Right Function (RIGHT)
```sql
-- 1. Right 2 chars of part_name.
SELECT part_id, RIGHT(part_name,2) AS last2 FROM supplier_parts.parts;
-- 2. Right 3 chars of supplier_name.
SELECT supplier_id, RIGHT(supplier_name,3) AS last3 FROM supplier_parts.suppliers;
-- 3. Right 4 chars of part_description.
SELECT part_id, RIGHT(part_description,4) AS last4 FROM supplier_parts.parts;
-- 4. Right 1 char of contact_name.
SELECT supplier_id, RIGHT(contact_name,1) AS last1 FROM supplier_parts.suppliers;
-- 5. Right 5 chars of address.
SELECT supplier_id, RIGHT(address,5) AS last5 FROM supplier_parts.suppliers;
-- 6. Right of unit_price string.
SELECT part_id, RIGHT(CAST(unit_price AS VARCHAR(10)),2) AS price_suf FROM supplier_parts.parts;
-- 7. Right of trimmed part_name.
SELECT part_id, RIGHT(LTRIM(RTRIM(part_name)),2) AS clean_suf FROM supplier_parts.parts;
-- 8. Right of uppercased part_name.
SELECT part_id, RIGHT(UPPER(part_name),2) AS up_suf FROM supplier_parts.parts;
-- 9. Right of reversed part_name.
SELECT part_id, RIGHT(REVERSE(part_name),3) AS rev_suf FROM supplier_parts.parts;
-- 10. Right of concatenated name-description.
SELECT RIGHT(part_name + part_description,3) AS combo_suffix FROM supplier_parts.parts;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse part_name.
SELECT part_id, REVERSE(part_name) AS rev_name FROM supplier_parts.parts;
-- 2. Reverse supplier_name.
SELECT supplier_id, REVERSE(supplier_name) AS rev_sup FROM supplier_parts.suppliers;
-- 3. Reverse part_description.
SELECT part_id, REVERSE(part_description) AS rev_desc FROM supplier_parts.parts;
-- 4. Reverse contact_name.
SELECT supplier_id, REVERSE(contact_name) AS rev_contact FROM supplier_parts.suppliers;
-- 5. Reverse address.
SELECT supplier_id, REVERSE(address) AS rev_addr FROM supplier_parts.suppliers;
-- 6. Reverse unit_price string.
SELECT part_id, REVERSE(CAST(unit_price AS VARCHAR(10))) AS rev_price FROM supplier_parts.parts;
-- 7. Reverse concatenation of name and description.
SELECT REVERSE(part_name + part_description) AS rev_combo FROM supplier_parts.parts;
-- 8. Reverse trimmed part_name.
SELECT REVERSE(LTRIM(RTRIM(part_name))) AS rev_clean FROM supplier_parts.parts;
-- 9. Reverse lowercase part_name.
SELECT REVERSE(LOWER(part_name)) AS rev_low FROM supplier_parts.parts;
-- 10. Reverse uppercase supplier_name.
SELECT REVERSE(UPPER(supplier_name)) AS rev_up FROM supplier_parts.suppliers;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace 'a' with '@' in part_name.
SELECT REPLACE(part_name,'a','@') AS repl_name FROM supplier_parts.parts;
-- 2. Replace 'Inc' with 'Incorporated' in supplier_name.
SELECT REPLACE(supplier_name,'Inc','Incorporated') AS repl_sup FROM supplier_parts.suppliers;
-- 3. Replace spaces with underscores in part_name.
SELECT REPLACE(part_name,' ','_') AS no_space FROM supplier_parts.parts;
-- 4. Replace '-' with '/' in part_description.
SELECT REPLACE(part_description,'-','/') AS repl_desc FROM supplier_parts.parts;
-- 5. Replace ' ' with '' in supplier_name.
SELECT REPLACE(supplier_name,' ','') AS no_space_sup FROM supplier_parts.suppliers;
-- 6. Replace 'Gadget' with 'Tool' in part_name.
SELECT REPLACE(part_name,'Gadget','Tool') AS repl_tool FROM supplier_parts.parts;
-- 7. Replace '.com' with '@domain.com' in contact_email.
SELECT REPLACE(contact_email,'.com','@domain.com') AS repl_email FROM supplier_parts.suppliers;
-- 8. Replace 'Rubber' with 'Metal' in part_description.
SELECT REPLACE(part_description,'Rubber','Metal') AS repl_mat FROM supplier_parts.parts;
-- 9. Replace multiple spaces with single in address (example).
SELECT REPLACE(address,'  ',' ') AS norm_addr FROM supplier_parts.suppliers;
-- 10. Replace 'o' with '0' in part_name.
SELECT REPLACE(part_name,'o','0') AS repl_zero FROM supplier_parts.parts;
```

## Case Statement (CASE)
```sql
-- 1. Categorize parts by price: cheap/mid/expensive.
SELECT part_id,
  CASE 
    WHEN unit_price < 5 THEN 'Cheap'
    WHEN unit_price BETWEEN 5 AND 15 THEN 'Moderate'
    ELSE 'Expensive'
  END AS price_category
FROM supplier_parts.parts;
-- 2. Supplier name length category: short/long.
SELECT supplier_id,
  CASE WHEN LEN(supplier_name)<10 THEN 'Short' ELSE 'Long' END AS name_length_cat
FROM supplier_parts.suppliers;
-- 3. Part_name starts with vowel or consonant.
SELECT part_id,
  CASE WHEN LEFT(UPPER(part_name),1) IN ('A','E','I','O','U') THEN 'Vowel' ELSE 'Consonant' END AS start_type
FROM supplier_parts.parts;
-- 4. Email domain check.
SELECT supplier_id,
  CASE WHEN CHARINDEX('@',contact_email)>0 THEN 'Valid' ELSE 'Invalid' END AS email_valid
FROM supplier_parts.suppliers;
-- 5. Address contains 'USA'.
SELECT supplier_id,
  CASE WHEN address LIKE '%USA' THEN 'US' ELSE 'Other' END AS region
FROM supplier_parts.suppliers;
-- 6. Part_description length check.
SELECT part_id,
  CASE WHEN LEN(part_description)>15 THEN 'LongDesc' ELSE 'ShortDesc' END AS desc_len_cat
FROM supplier_parts.parts;
-- 7. Unit_price even or odd cents.
SELECT part_id,
  CASE WHEN RIGHT(CAST(unit_price*100 AS VARCHAR(10)),2)%2=0 THEN 'EvenCents' ELSE 'OddCents' END AS cents_type
FROM supplier_parts.parts;
-- 8. Supplier_id odd/even.
SELECT supplier_id,
  CASE WHEN supplier_id%2=0 THEN 'Even' ELSE 'Odd' END AS id_type
FROM supplier_parts.suppliers;
-- 9. Nullable contact_name check.
SELECT supplier_id,
  CASE WHEN contact_name IS NULL THEN 'NoContact' ELSE 'HasContact' END AS contact_status
FROM supplier_parts.suppliers;
-- 10. Part_name contains 'et'.
SELECT part_id,
  CASE WHEN part_name LIKE '%et%' THEN 'Contains_et' ELSE 'No_et' END AS et_flag
FROM supplier_parts.parts;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Replace NULL contact_name with 'Unknown'.
SELECT supplier_id, ISNULL(contact_name,'Unknown') AS contact_name FROM supplier_parts.suppliers;
-- 2. Replace NULL part_description with 'N/A'.
SELECT part_id, ISNULL(part_description,'N/A') AS part_description FROM supplier_parts.parts;
-- 3. Replace NULL phone_number with '000-000-0000'.
SELECT supplier_id, ISNULL(phone_number,'000-000-0000') AS phone FROM supplier_parts.suppliers;
-- 4. Replace NULL address with 'No Address'.
SELECT supplier_id, ISNULL(address,'No Address') AS address FROM supplier_parts.suppliers;
-- 5. Use ISNULL to show unit_price or 0.
SELECT part_id, ISNULL(unit_price,0) AS price FROM supplier_parts.parts;
-- 6. Concatenate ISNULL(contact_name,'Unknown') with email.
SELECT ISNULL(contact_name,'Unknown') + ' <' + contact_email + '>' AS info FROM supplier_parts.suppliers;
-- 7. ISNULL on part_name.
SELECT ISNULL(part_name,'NoName') AS pname FROM supplier_parts.parts;
-- 8. ISNULL on supplier_name.
SELECT ISNULL(supplier_name,'NoSupplier') AS sname FROM supplier_parts.suppliers;
-- 9. ISNULL on part_description trimmed.
SELECT ISNULL(TRIM(part_description),'Empty') AS desc_trim FROM supplier_parts.parts;
-- 10. ISNULL on email domain.
SELECT ISNULL(SUBSTRING(contact_email,CHARINDEX('@',contact_email)+1,LEN(contact_email)),'NoDomain') AS domain FROM supplier_parts.suppliers;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Show first non-null of contact_name, contact_email.
SELECT supplier_id, COALESCE(contact_name,contact_email) AS contact_info FROM supplier_parts.suppliers;
-- 2. Show first non-null of part_description, part_name.
SELECT part_id, COALESCE(part_description,part_name) AS desc_or_name FROM supplier_parts.parts;
-- 3. COALESCE of supplier_name and address.
SELECT supplier_id, COALESCE(supplier_name,address) AS sup_or_addr FROM supplier_parts.suppliers;
-- 4. COALESCE of phone_number and contact_email.
SELECT supplier_id, COALESCE(phone_number,contact_email) AS primary_contact FROM supplier_parts.suppliers;
-- 5. COALESCE of unit_price and 0.
SELECT part_id, COALESCE(unit_price,0) AS price FROM supplier_parts.parts;
-- 6. COALESCE of trimmed part_description and 'None'.
SELECT part_id, COALESCE(TRIM(part_description),'None') AS desc_clean FROM supplier_parts.parts;
-- 7. COALESCE of supplier_name and 'Unnamed'.
SELECT supplier_id, COALESCE(supplier_name,'Unnamed') AS sname FROM supplier_parts.suppliers;
-- 8. COALESCE of Left(part_name,3) and 'XXX'.
SELECT part_id, COALESCE(LEFT(part_name,3),'XXX') AS code FROM supplier_parts.parts;
-- 9. COALESCE of CHARINDEX result and 0.
SELECT part_id, COALESCE(NULLIF(CHARINDEX('x',part_name),0),0) AS x_pos FROM supplier_parts.parts;
-- 10. COALESCE of REPLACE(part_name,'a','') and original.
SELECT part_id, COALESCE(NULLIF(REPLACE(part_name,'a',''),''),part_name) AS cleaned_name FROM supplier_parts.parts;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
