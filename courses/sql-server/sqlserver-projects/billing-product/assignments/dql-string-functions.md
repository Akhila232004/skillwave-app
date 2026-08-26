![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Get length of each product_name
2. Get length of each customer_name
3. Get length of contact_info
4. Get length of line_total (as varchar)
5. Length of concatenated product_name and price
6. Products where product_name length > 6
7. Customers where customer_name length <= 10
8. Products ordered by product_name length descending
9. Products with name length greater than average
10. Count of products grouped by name length

## Substring Function (SUBSTRING)
1. First 3 characters of product_name
2. First name from customer_name
3. Domain from contact_info (after '@')
4. Characters 2–4 of product_name
5. Last 3 characters of product_name
6. Year from bill_date
7. Whole part of line_total
8. Initial of customer_name
9. Username from contact_info (before '@')
10. Remove first character of product_name

## Concatenation Operator (+)
1. Customer contact card
2. Product display string
3. Bill summary text
4. Line item summary
5. Year–month string for bills
6. Last, First format for customer names
7. Promotional message for products
8. Quantity and unit price info
9. Reach text for customers
10. Bill owing information

## Lower Function (LOWER)
1. Lowercase all product names
2. Lowercase all customer names
3. Lowercase contact_info
4. Filter products where lowercase name starts with 'm'
5. Convert bill_date to lowercase string (for demos)
6. Lowercase line_total cast
7. Compare lowercase contact_info domain
8. Order customers by lowercase name
9. Count lowercase occurrence of letter 'a' in product_name
10. Show distinct lowercase product names

## Upper Function (UPPER)
1. Uppercase all product names
2. Uppercase all customer names
3. Uppercase contact_info
4. Filter products where uppercase name contains 'O'
5. Convert bill_date to uppercase string
6. Uppercase line_total cast
7. Compare uppercase contact_info domain
8. Order products by uppercase name
9. Concatenate uppercase summary
10. Show distinct uppercase customer names

## Trim Function (TRIM)
1. Trim spaces around padded product_name
2. Trim spaces from contact_info (no-op demo)
3. Trim dashes around product_name
4. Trim zeros around product_id cast
5. Use TRIM in WHERE to match exact contact_info
6. Trim spaces in aliased string
7. Trim custom character '*' around product_name
8. Trim leading and trailing underscores
9. Count trimmed vs original length
10. Trim in a subquery

## Ltrim Function (LTRIM)
1. Ltrim spaces on left of padded product_name
2. Ltrim spaces on left of contact_info
3. Ltrim zeros on left of product_id cast
4. Ltrim dashes on left
5. Filter with LTRIM to match
6. LTRIM in alias
7. LTRIM numeric prefix
8. LTRIM in ORDER BY
9. Compare LTRIM vs original
10. Use LTRIM in JOIN key

## Rtrim Function (RTRIM)
1. Rtrim spaces on right of padded product_name
2. Rtrim spaces on right of contact_info
3. Rtrim zeros on right of product_id cast
4. Rtrim dashes on right
5. Filter with RTRIM to match
6. RTRIM in alias
7. RTRIM numeric suffix
8. RTRIM in ORDER BY
9. Compare RTRIM vs original
10. Use RTRIM in WHERE

## Charindex Function (CHARINDEX)
1. Position of '@' in contact_info
2. Position of 'phone' in product_name
3. Filter products containing 'er'
4. Find hyphen position in concatenated string
5. First space in customer_name
6. Position of '.' in CAST(total_amount)
7. Any digit position in contact_info
8. Nested CHARINDEX to get domain
9. Filter customers with no '@'
10. Use CHARINDEX in ORDER BY

## Left Function (LEFT)
1. First 2 letters of product_name
2. First letter of customer_name
3. First 4 chars of contact_info
4. First 4 digits of year-month
5. First 5 chars of CAST(line_total)
6. LEFT combined string
7. LEFT in WHERE
8. LEFT for formatting
9. LEFT in ORDER BY
10. LEFT nested

## Right Function (RIGHT)
1. Last 2 letters of product_name
2. Last letter of customer_name
3. Last 4 chars of contact_info
4. Day from bill_date
5. Last 3 of CAST(line_total)
6. RIGHT combined string
7. RIGHT in WHERE
8. RIGHT for formatting
9. RIGHT in ORDER BY
10. RIGHT nested

## Reverse Function (REVERSE)
1. Reverse product_name
2. Reverse customer_name
3. Reverse contact_info
4. Reverse year-month string
5. Reverse CAST(line_total)
6. Reverse concatenated string
7. Filter reversed names starting with 'pt'
8. Reverse and take LEFT
9. Reverse email domain
10. Nested REVERSE(REPLACE())

## Replace Function (REPLACE)
1. Replace spaces with underscores in product_name
2. Replace '@example.com' with '@gmail.com'
3. Remove 'Bill' from summary
4. Replace '.' with ',' in line_total
5. Replace '-' with '/ ' in year_month
6. Replace 'o' with '0' in product_name
7. Replace duplicate spaces in contact_info
8. Remove prefix 'www.' in contact_info (demo)
9. Replace 'x' in line_summary
10. Nested REPLACE to mask digits

## Case Statement (CASE)
1. Label products as 'Expensive' or 'Cheap'
2. Bill details as 'Bulk' or 'Single'
3. Customer contact method
4. Bill seasons based on month
5. Round line_total to nearest hundred
6. Price category with three tiers
7. Customer name initial group
8. Bill status based on total_amount
9. Combine CASE with CONCAT
10. Nested CASE to highlight large orders

## ISNULL Function (ISNULL)
1. Default contact_info if NULL
2. Default product_name if NULL
3. Default price if NULL
4. Default bill_date if NULL
5. Default total_amount if NULL
6. Default line_total if NULL
7. ISNULL in concatenation
8. ISNULL in WHERE
9. ISNULL in ORDER BY
10. ISNULL to avoid division by zero

## Coalesce Function (COALESCE)
1. First non-NULL contact_info or default
2. Coalesce product_name and 'Unknown'
3. Coalesce price, 0.00, and 100.00
4. Coalesce bill_date and GETDATE()
5. Coalesce total_amount, 0
6. Coalesce line_total or price*quantity
7. Coalesce in concatenation with multiple fields
8. Coalesce in WHERE
9. Coalesce in ORDER BY
10. Coalesce with NULLIF to avoid nulls

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
