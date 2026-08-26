![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Show length of each part_name.
2. Show length of each supplier_name.
3. Show length of part_description.
4. Show length of contact_name.
5. Show combined length of supplier_name and contact_name.
6. Show length of unit_price converted to string.
7. Show length of supplier address.
8. Show length of part_name plus hyphen plus part_description.
9. Show length of email domain in contact_email.
10. Show length of trimmed supplier_name.

## Substring Function (SUBSTRING)
1. Extract first 3 characters of part_name.
2. Extract last 3 characters of part_name.
3. Extract characters 5–8 of supplier_name.
4. Extract first 5 characters of part_description.
5. Extract middle 3 chars of contact_name.
6. Extract 4 chars starting at position 2 of address.
7. Extract 2 chars after hyphen in part_name.
8. Extract domain from contact_email.
9. Extract three chars before extension in contact_email.
10. Extract first letter of each part_name.

## Concatenation Operator (+)
1. Concatenate part_name and part_description.
2. Concatenate supplier_name and address.
3. Concatenate contact_name and contact_email.
4. Concatenate part_name and unit_price.
5. Concatenate supplier_id and supplier_name.
6. Concatenate part_id, part_name, and supplier_id.
7. Concatenate trimmed part_name and uppercase part_description.
8. Concatenate Left 3 of part_name and Right 2 of supplier_name.
9. Concatenate contact_name and phone_number.
10. Concatenate part_name, ' by ', supplier_name.

## Lower Function (LOWER)
1. Convert part_name to lowercase.
2. Convert supplier_name to lowercase.
3. Convert part_description to lowercase.
4. Convert contact_email to lowercase.
5. Compare LOWER(part_name) to 'widget'.
6. Show lowercase supplier address.
7. Show lowercase contact_name.
8. Show lowercase concatenation of name and email.
9. Show lowercase part_name trimmed.
10. Show lowercase domain of contact_email.

## Upper Function (UPPER)
1. Convert part_name to uppercase.
2. Convert supplier_name to uppercase.
3. Convert part_description to uppercase.
4. Convert contact_email to uppercase.
5. Display uppercase address.
6. Compare UPPER(part_name) to 'GIZMO'.
7. Show uppercase concatenation of supplier and contact.
8. Show uppercase left 5 of part_description.
9. Show uppercase reversed part_name.
10. Show uppercase domain of email.

## Trim Function (TRIM)
1. Trim spaces from part_name.
2. Trim spaces from supplier_name.
3. Trim spaces from part_description.
4. Trim spaces from contact_email.
5. Trim and uppercase part_name.
6. Trim and lowercase supplier_name.
7. Trim concatenated fields.
8. Trim phone_number.
9. Trim and substring address.
10. Trim and replace in part_description.

## Ltrim Function (LTRIM)
1. Remove leading spaces from part_name.
2. Remove leading spaces from supplier_name.
3. LTRIM on part_description.
4. LTRIM on contact_email.
5. LTRIM and LEN of part_name.
6. LTRIM and UPPER of supplier_name.
7. LTRIM concatenation.
8. LTRIM on phone_number.
9. LTRIM on address.
10. LTRIM on reversed part_name.

## Rtrim Function (RTRIM)
1. Remove trailing spaces from part_name.
2. Remove trailing spaces from supplier_name.
3. RTRIM on part_description.
4. RTRIM on contact_email.
5. RTRIM and LEN of part_name.
6. RTRIM and LOWER of supplier_name.
7. RTRIM concatenation.
8. RTRIM on phone_number.
9. RTRIM on address.
10. RTRIM on reversed part_name.

## Charindex Function (CHARINDEX)
1. Find position of 'a' in part_name.
2. Position of 'Inc' in supplier_name.
3. Position of '-' in part_description.
4. Position of '@' in contact_email.
5. Position of ' ' in supplier_name.
6. Position of 'oo' in part_name.
7. Position of 'St' in address.
8. Position of 'valve' in part_description.
9. Position of 'Co' in supplier_name.
10. Position of 'x' in part_name.

## Left Function (LEFT)
1. Left 2 chars of part_name.
2. Left 4 chars of supplier_name.
3. Left 5 chars of part_description.
4. Left 1 char of contact_name.
5. Left 3 chars of address.
6. Left 2 chars of unit_price as string.
7. Left of trimmed part_name.
8. Left of lowercased part_name.
9. Left of reversed part_name.
10. Left of concatenated name-description.

## Right Function (RIGHT)
1. Right 2 chars of part_name.
2. Right 3 chars of supplier_name.
3. Right 4 chars of part_description.
4. Right 1 char of contact_name.
5. Right 5 chars of address.
6. Right of unit_price string.
7. Right of trimmed part_name.
8. Right of uppercased part_name.
9. Right of reversed part_name.
10. Right of concatenated name-description.

## Reverse Function (REVERSE)
1. Reverse part_name.
2. Reverse supplier_name.
3. Reverse part_description.
4. Reverse contact_name.
5. Reverse address.
6. Reverse unit_price string.
7. Reverse concatenation of name and description.
8. Reverse trimmed part_name.
9. Reverse lowercase part_name.
10. Reverse uppercase supplier_name.

## Replace Function (REPLACE)
1. Replace 'a' with '@' in part_name.
2. Replace 'Inc' with 'Incorporated' in supplier_name.
3. Replace spaces with underscores in part_name.
4. Replace '-' with '/' in part_description.
5. Replace ' ' with '' in supplier_name.
6. Replace 'Gadget' with 'Tool' in part_name.
7. Replace '.com' with '@domain.com' in contact_email.
8. Replace 'Rubber' with 'Metal' in part_description.
9. Replace multiple spaces with single in address (example).
10. Replace 'o' with '0' in part_name.

## Case Statement (CASE)
1. Categorize parts by price: cheap/mid/expensive.
2. Supplier name length category: short/long.
3. Part_name starts with vowel or consonant.
4. Email domain check.
5. Address contains 'USA'.
6. Part_description length check.
7. Unit_price even or odd cents.
8. Supplier_id odd/even.
9. Nullable contact_name check.
10. Part_name contains 'et'.

## ISNULL Function (ISNULL)
1. Replace NULL contact_name with 'Unknown'.
2. Replace NULL part_description with 'N/A'.
3. Replace NULL phone_number with '000-000-0000'.
4. Replace NULL address with 'No Address'.
5. Use ISNULL to show unit_price or 0.
6. Concatenate ISNULL(contact_name,'Unknown') with email.
7. ISNULL on part_name.
8. ISNULL on supplier_name.
9. ISNULL on part_description trimmed.
10. ISNULL on email domain.

## Coalesce Function (COALESCE)
1. Show first non-null of contact_name, contact_email.
2. Show first non-null of part_description, part_name.
3. COALESCE of supplier_name and address.
4. COALESCE of phone_number and contact_email.
5. COALESCE of unit_price and 0.
6. COALESCE of trimmed part_description and 'None'.
7. COALESCE of supplier_name and 'Unnamed'.
8. COALESCE of Left(part_name,3) and 'XXX'.
9. COALESCE of CHARINDEX result and 0.
10. COALESCE of REPLACE(part_name,'a','') and original.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
