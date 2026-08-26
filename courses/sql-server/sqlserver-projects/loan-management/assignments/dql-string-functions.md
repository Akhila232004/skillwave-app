![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Get length of each borrower's full name.
2. Get length of each borrower's contact info.
3. Get length of each borrower's address.
4. Get length of each loan's type.
5. Get length of each loan's status.
6. Get length of principal formatted as string.
7. Get length of interest_rate formatted as string.
8. List borrowers with full_name longer than 15 characters.
9. Get length of payment amount formatted as string.
10. Find payments where the formatted payment_date string length > 10.

## Substring Function (SUBSTRING)
1. Extract first name from full_name.
2. Extract last name from full_name.
3. Extract email user part before '@'.
4. Extract email domain part after '@'.
5. Extract street number from address.
6. Extract city from address (after first comma and space).
7. Extract first three letters of loan_type.
8. Extract first letter of status.
9. Extract date part (YYYY-MM-DD) of payment_date.
10. Extract year from payment_date string.

## Concatenation Operator (+)
1. Combine full_name and contact_info.
2. Combine full_name and address.
3. Label loans with ID and type.
4. Label payments with ID and amount.
5. Indicate borrower ID with name.
6. Describe loan principal and rate.
7. Show payment amount on date.
8. Combine first name and last name separated.
9. Concatenate loan_type and status.
10. Combine borrower and loan info.

## Lower Function (LOWER)
1. Convert full_name to lowercase.
2. Convert contact_info to lowercase.
3. Convert address to lowercase.
4. Convert loan_type to lowercase.
5. Convert status to lowercase.
6. Convert email domain to lowercase.
7. Lowercase the first 5 letters of full_name.
8. Lowercase address substring after comma.
9. Lowercase loan_type with label.
10. Lowercase payment_date string.

## Upper Function (UPPER)
1. Convert full_name to uppercase.
2. Convert contact_info to uppercase.
3. Convert address to uppercase.
4. Convert loan_type to uppercase.
5. Convert status to uppercase.
6. Uppercase email user part.
7. Uppercase first 3 letters of loan_type.
8. Uppercase address substring before comma.
9. Uppercase payment_date string.
10. Uppercase concatenated info.

## Trim Function (TRIM)
1. Trim spaces around full_name.
2. Trim spaces around a padded status.
3. Trim spaces around address.
4. Trim spaces around loan_type.
5. Trim spaces around contact_info.
6. Trim spaces around principal_rate label.
7. Trim spaces around payment info.
8. Trim spaces on concatenated name/address.
9. Trim spaces around year substring.
10. Trim spaces around numeric string.

## Ltrim Function (LTRIM)
1. Remove leading spaces from full_name.
2. Remove leading spaces from status.
3. Remove leading spaces from address.
4. Remove leading spaces from loan_type.
5. Remove leading spaces from contact_info.
6. Remove leading spaces from principal string.
7. Remove leading spaces from concatenated info.
8. Remove leading spaces from date string.
9. Remove leading spaces from term_months.
10. Remove leading spaces from loan label.

## Rtrim Function (RTRIM)
1. Remove trailing spaces from full_name.
2. Remove trailing spaces from status.
3. Remove trailing spaces from address.
4. Remove trailing spaces from loan_type.
5. Remove trailing spaces from contact_info.
6. Remove trailing spaces from principal string.
7. Remove trailing spaces from concatenated info.
8. Remove trailing spaces from date string.
9. Remove trailing spaces from term_months.
10. Remove trailing spaces from loan label.

## Charindex Function (CHARINDEX)
1. Find position of space in full_name.
2. Find position of '@' in contact_info.
3. Find position of ',' in address.
4. Find position of 'a' in loan_type.
5. Find position of 't' in status.
6. Find position of '.' in amount string.
7. Find position of '-' in payment_date string.
8. Find position of 'Lo' in loan_type.
9. Find position of 'z' in status (may return 0).
10. Find position of 'Spr' in address.

## Left Function (LEFT)
1. Get first 5 chars of full_name.
2. Get first 3 chars of loan_type.
3. Get first 2 chars of status.
4. Get first 4 chars of address.
5. Get first letter of contact_info.
6. Get first 7 chars of principal string.
7. Get first 10 chars of payment_date string.
8. Get first 6 chars of amount string.
9. Get first 8 chars of CONCAT(full_name and address).
10. Get first 2 chars of term_months.

## Right Function (RIGHT)
1. Get last 5 chars of full_name.
2. Get last 3 chars of loan_type.
3. Get last 2 chars of status.
4. Get last 4 chars of address.
5. Get last char of contact_info.
6. Get last 7 chars of principal string.
7. Get last 10 chars of payment_date string.
8. Get last 6 chars of amount string.
9. Get last 8 chars of CONCAT(full_name and address).
10. Get last 2 chars of term_months.

## Reverse Function (REVERSE)
1. Reverse full_name.
2. Reverse loan_type.
3. Reverse status.
4. Reverse address.
5. Reverse contact_info.
6. Reverse principal string.
7. Reverse payment_date string.
8. Reverse amount string.
9. Reverse concatenated full_name and loan_type.
10. Reverse first name extracted.

## Replace Function (REPLACE)
1. Replace spaces with underscores in full_name.
2. Replace 'St' with 'Street' in address.
3. Replace 'Active' with 'A' in status.
4. Replace 'Personal' with 'Pers' in loan_type.
5. Replace '.' with '' in amount string.
6. Replace '-' with '/' in payment_date string.
7. Replace 'Example' with 'Ex' in email domain.
8. Replace 'Loan' with 'L' in loan_type.
9. Replace commas with semicolons in address.
10. Replace multiple spaces with single in full_name.

## Case Statement (CASE)
1. Categorize loans by principal size.
2. Label payments as High or Low.
3. Categorize borrowers by birth decade.
4. Mark loans as LongTerm or ShortTerm.
5. Indicate if a loan is Active or Not.
6. Classify interest_rate as Low/Medium/High.
7. Flag payments made in 2023.
8. Categorize borrowers as Adult or Minor.
9. Combine loan_type and status into one label.
10. Classify month of payment.

## ISNULL Function (ISNULL)
1. Replace null contact_info with 'No Contact'.
2. Replace null address with 'No Address'.
3. Replace null loan_type with 'Unknown'.
4. Replace null status with 'Unknown'.
5. Replace null principal with 0.
6. Replace null interest_rate with 0.
7. Replace null payment_date with '1900-01-01'.
8. Replace null amount with 0.
9. Replace null principal_component with 0.
10. Replace null interest_component with 0.

## Coalesce Function (COALESCE)
1. Show first non-null contact or address.
2. Show loan_type or 'Unknown'.
3. Show status or 'Unknown'.
4. Show principal or 0.
5. Show interest_rate or 0.
6. Show payment_date or fallback.
7. Show amount or 0.
8. Show principal_component or 0.
9. Show interest_component or 0.
10. First non-null in borrower name or 'Guest'.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
