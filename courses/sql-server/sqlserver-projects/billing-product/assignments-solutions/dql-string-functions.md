![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Get length of each product_name
SELECT product_id, product_name, LEN(product_name) AS name_length
FROM billing_product.products;
-- 2. Get length of each customer_name
SELECT customer_id, customer_name, LEN(customer_name) AS name_length
FROM billing_product.customers;
-- 3. Get length of contact_info
SELECT customer_id, contact_info, LEN(contact_info) AS info_length
FROM billing_product.customers;
-- 4. Get length of line_total (as varchar)
SELECT billdetail_id, line_total, LEN(CAST(line_total AS VARCHAR(20))) AS len_line_total
FROM billing_product.billdetails;
-- 5. Length of concatenated product_name and price
SELECT product_id, product_name, price,
       LEN(product_name + ' ' + CAST(price AS VARCHAR(10))) AS len_display
FROM billing_product.products;
-- 6. Products where product_name length > 6
SELECT product_id, product_name
FROM billing_product.products
WHERE LEN(product_name) > 6;
-- 7. Customers where customer_name length <= 10
SELECT customer_id, customer_name
FROM billing_product.customers
WHERE LEN(customer_name) <= 10;
-- 8. Products ordered by product_name length descending
SELECT product_id, product_name
FROM billing_product.products
ORDER BY LEN(product_name) DESC;
-- 9. Products with name length greater than average
SELECT product_id, product_name
FROM billing_product.products
WHERE LEN(product_name) > (SELECT AVG(LEN(product_name)) FROM billing_product.products);
-- 10. Count of products grouped by name length
SELECT LEN(product_name) AS name_len, COUNT(*) AS product_count
FROM billing_product.products
GROUP BY LEN(product_name);
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 3 characters of product_name
SELECT product_id, SUBSTRING(product_name,1,3) AS first3
FROM billing_product.products;
-- 2. First name from customer_name
SELECT customer_id,
       SUBSTRING(customer_name,1,CHARINDEX(' ',customer_name)-1) AS first_name
FROM billing_product.customers
WHERE CHARINDEX(' ',customer_name) > 0;
-- 3. Domain from contact_info (after '@')
SELECT customer_id, contact_info,
       SUBSTRING(contact_info,CHARINDEX('@',contact_info)+1,LEN(contact_info)) AS domain
FROM billing_product.customers;
-- 4. Characters 2–4 of product_name
SELECT product_id, SUBSTRING(product_name,2,3) AS mid_chars
FROM billing_product.products;
-- 5. Last 3 characters of product_name
SELECT product_id,
       SUBSTRING(product_name,LEN(product_name)-2,3) AS last3
FROM billing_product.products;
-- 6. Year from bill_date
SELECT bill_id,
       SUBSTRING(CONVERT(VARCHAR(10),bill_date,23),1,4) AS bill_year
FROM billing_product.bill;
-- 7. Whole part of line_total
SELECT billdetail_id,
       SUBSTRING(CAST(line_total AS VARCHAR(20)),1,CHARINDEX('.',CAST(line_total AS VARCHAR(20)))-1) AS whole_part
FROM billing_product.billdetails;
-- 8. Initial of customer_name
SELECT customer_id,
       SUBSTRING(customer_name,1,1) AS initial
FROM billing_product.customers;
-- 9. Username from contact_info (before '@')
SELECT customer_id,
       SUBSTRING(contact_info,1,CHARINDEX('@',contact_info)-1) AS username
FROM billing_product.customers;
-- 10. Remove first character of product_name
SELECT product_id,
       SUBSTRING(product_name,2,LEN(product_name)) AS trimmed_name
FROM billing_product.products;
```

## Concatenation Operator (+)
```sql
-- 1. Customer contact card
SELECT customer_id,
       customer_name + ' <' + contact_info + '>' AS contact_card
FROM billing_product.customers;
-- 2. Product display string
SELECT product_id,
       product_name + ' - $' + CAST(price AS VARCHAR(10)) AS display
FROM billing_product.products;
-- 3. Bill summary text
SELECT bill_id,
       'Bill #' + CAST(bill_id AS VARCHAR(10)) + ': $' + CAST(total_amount AS VARCHAR(10)) AS summary
FROM billing_product.bill;
-- 4. Line item summary
SELECT bd.billdetail_id,
       p.product_name + ' x' + CAST(bd.quantity AS VARCHAR(10))
       + ' = $' + CAST(bd.line_total AS VARCHAR(10)) AS line_summary
FROM billing_product.billdetails AS bd
JOIN billing_product.products AS p ON bd.product_id = p.product_id;
-- 5. Year–month string for bills
SELECT bill_id,
       CAST(YEAR(bill_date) AS VARCHAR(4)) + '-' +
       RIGHT('00' + CAST(MONTH(bill_date) AS VARCHAR(2)),2) AS year_month
FROM billing_product.bill;
-- 6. Last, First format for customer names
SELECT customer_id,
       SUBSTRING(customer_name,CHARINDEX(' ',customer_name)+1,LEN(customer_name))
       + ', ' +
       SUBSTRING(customer_name,1,CHARINDEX(' ',customer_name)-1) AS last_first
FROM billing_product.customers
WHERE CHARINDEX(' ',customer_name) > 0;
-- 7. Promotional message for products
SELECT product_id,
       product_name + ' is awesome!' AS promo_msg
FROM billing_product.products;
-- 8. Quantity and unit price info
SELECT bd.billdetail_id,
       'Qty:' + CAST(bd.quantity AS VARCHAR(10))
       + ', Price each:' + CAST(p.price AS VARCHAR(10)) AS info
FROM billing_product.billdetails AS bd
JOIN billing_product.products AS p ON bd.product_id = p.product_id;
-- 9. Reach text for customers
SELECT customer_id,
       'Reach at: ' + contact_info AS reach
FROM billing_product.customers;
-- 10. Bill owing information
SELECT bill_id,
       'Customer ' + CAST(customer_id AS VARCHAR(10))
       + ' owes $' + CAST(total_amount AS VARCHAR(10)) AS owing_info
FROM billing_product.bill;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase all product names
SELECT product_id, LOWER(product_name) AS lower_name
FROM billing_product.products;
-- 2. Lowercase all customer names
SELECT customer_id, LOWER(customer_name) AS lower_name
FROM billing_product.customers;
-- 3. Lowercase contact_info
SELECT customer_id, LOWER(contact_info) AS lower_info
FROM billing_product.customers;
-- 4. Filter products where lowercase name starts with 'm'
SELECT product_id, product_name
FROM billing_product.products
WHERE LOWER(product_name) LIKE 'm%';
-- 5. Convert bill_date to lowercase string (for demos)
SELECT bill_id, LOWER(CONVERT(VARCHAR(10),bill_date,23)) AS lower_date
FROM billing_product.bill;
-- 6. Lowercase line_total cast
SELECT billdetail_id, LOWER(CAST(line_total AS VARCHAR(20))) AS lower_total
FROM billing_product.billdetails;
-- 7. Compare lowercase contact_info domain
SELECT customer_id, contact_info
FROM billing_product.customers
WHERE LOWER(contact_info) LIKE '%@example.com';
-- 8. Order customers by lowercase name
SELECT customer_id, customer_name
FROM billing_product.customers
ORDER BY LOWER(customer_name);
-- 9. Count lowercase occurrence of letter 'a' in product_name
SELECT product_id, product_name,
       LEN(product_name) - LEN(REPLACE(LOWER(product_name),'a','')) AS a_count
FROM billing_product.products;
-- 10. Show distinct lowercase product names
SELECT DISTINCT LOWER(product_name) AS lower_name
FROM billing_product.products;
```

## Upper Function (UPPER)
```sql
-- 1. Uppercase all product names
SELECT product_id, UPPER(product_name) AS upper_name
FROM billing_product.products;
-- 2. Uppercase all customer names
SELECT customer_id, UPPER(customer_name) AS upper_name
FROM billing_product.customers;
-- 3. Uppercase contact_info
SELECT customer_id, UPPER(contact_info) AS upper_info
FROM billing_product.customers;
-- 4. Filter products where uppercase name contains 'O'
SELECT product_id, product_name
FROM billing_product.products
WHERE UPPER(product_name) LIKE '%O%';
-- 5. Convert bill_date to uppercase string
SELECT bill_id, UPPER(CONVERT(VARCHAR(10),bill_date,23)) AS upper_date
FROM billing_product.bill;
-- 6. Uppercase line_total cast
SELECT billdetail_id, UPPER(CAST(line_total AS VARCHAR(20))) AS upper_total
FROM billing_product.billdetails;
-- 7. Compare uppercase contact_info domain
SELECT customer_id, contact_info
FROM billing_product.customers
WHERE UPPER(contact_info) LIKE '%@EXAMPLE.COM';
-- 8. Order products by uppercase name
SELECT product_id, product_name
FROM billing_product.products
ORDER BY UPPER(product_name);
-- 9. Concatenate uppercase summary
SELECT product_id,
       UPPER(product_name) + ' COSTS $' + CAST(price AS VARCHAR(10)) AS summary
FROM billing_product.products;
-- 10. Show distinct uppercase customer names
SELECT DISTINCT UPPER(customer_name) AS upper_name
FROM billing_product.customers;
```

## Trim Function (TRIM)
```sql
-- 1. Trim spaces around padded product_name
SELECT product_id,
       TRIM(' ' FROM '  ' + product_name + '  ') AS trimmed_name
FROM billing_product.products;
-- 2. Trim spaces from contact_info (no-op demo)
SELECT customer_id,
       TRIM(contact_info) AS trimmed_info
FROM billing_product.customers;
-- 3. Trim dashes around product_name
SELECT product_id,
       TRIM('-' FROM '-' + product_name + '-') AS trimmed_dash
FROM billing_product.products;
-- 4. Trim zeros around product_id cast
SELECT product_id,
       TRIM('0' FROM '000' + CAST(product_id AS VARCHAR(10))) AS trimmed_zero
FROM billing_product.products;
-- 5. Use TRIM in WHERE to match exact contact_info
SELECT customer_id, contact_info
FROM billing_product.customers
WHERE TRIM(contact_info) = 'john.doe@example.com';
-- 6. Trim spaces in aliased string
SELECT product_id,
       TRIM(' ' FROM ' ' + product_name + ' ') AS clean_name
FROM billing_product.products;
-- 7. Trim custom character '*' around product_name
SELECT product_id,
       TRIM('*' FROM '*' + product_name + '*') AS trimmed_star
FROM billing_product.products;
-- 8. Trim leading and trailing underscores
SELECT product_id,
       TRIM('_' FROM '_' + product_name + '_') AS trimmed_underscore
FROM billing_product.products;
-- 9. Count trimmed vs original length
SELECT product_id,
       LEN(product_name) AS orig_len,
       LEN(TRIM(' ' FROM ' ' + product_name + ' ')) AS trimmed_len
FROM billing_product.products;
-- 10. Trim in a subquery
SELECT p.product_id, p.product_name
FROM (
  SELECT product_id,
         TRIM(' ' FROM '  ' + product_name + '  ') AS product_name
  FROM billing_product.products
) AS p;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Ltrim spaces on left of padded product_name
SELECT product_id,
       LTRIM('  ' + product_name) AS ltrim_name
FROM billing_product.products;
-- 2. Ltrim spaces on left of contact_info
SELECT customer_id,
       LTRIM(' ' + contact_info) AS ltrim_info
FROM billing_product.customers;
-- 3. Ltrim zeros on left of product_id cast
SELECT product_id,
       LTRIM('000' + CAST(product_id AS VARCHAR)) AS ltrim_zero
FROM billing_product.products;
-- 4. Ltrim dashes on left
SELECT product_id,
       LTRIM('-' + product_name) AS ltrim_dash
FROM billing_product.products;
-- 5. Filter with LTRIM to match
SELECT customer_id, contact_info
FROM billing_product.customers
WHERE LTRIM(contact_info) LIKE 'jane%';
-- 6. LTRIM in alias
SELECT product_id,
       LTRIM('  ' + product_name) AS clean_left
FROM billing_product.products;
-- 7. LTRIM numeric prefix
SELECT billdetail_id,
       LTRIM('000' + CAST(line_total AS VARCHAR)) AS clean_total
FROM billing_product.billdetails;
-- 8. LTRIM in ORDER BY
SELECT customer_name
FROM billing_product.customers
ORDER BY LTRIM(customer_name);
-- 9. Compare LTRIM vs original
SELECT product_id,
       product_name,
       LTRIM(product_name) AS ltrimmed
FROM billing_product.products;
-- 10. Use LTRIM in JOIN key
SELECT c.customer_id, b.bill_id
FROM billing_product.customers AS c
JOIN billing_product.bill AS b
  ON LTRIM(c.customer_id) = b.customer_id;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Rtrim spaces on right of padded product_name
SELECT product_id,
       RTRIM(product_name + '  ') AS rtrim_name
FROM billing_product.products;
-- 2. Rtrim spaces on right of contact_info
SELECT customer_id,
       RTRIM(contact_info + ' ') AS rtrim_info
FROM billing_product.customers;
-- 3. Rtrim zeros on right of product_id cast
SELECT product_id,
       RTRIM(CAST(product_id AS VARCHAR) + '000') AS rtrim_zero
FROM billing_product.products;
-- 4. Rtrim dashes on right
SELECT product_id,
       RTRIM(product_name + '-') AS rtrim_dash
FROM billing_product.products;
-- 5. Filter with RTRIM to match
SELECT customer_id, contact_info
FROM billing_product.customers
WHERE RTRIM(contact_info) LIKE '%@example.com';
-- 6. RTRIM in alias
SELECT product_id,
       RTRIM(product_name + '  ') AS clean_right
FROM billing_product.products;
-- 7. RTRIM numeric suffix
SELECT billdetail_id,
       RTRIM(CAST(line_total AS VARCHAR) + '00') AS clean_total
FROM billing_product.billdetails;
-- 8. RTRIM in ORDER BY
SELECT product_name
FROM billing_product.products
ORDER BY RTRIM(product_name);
-- 9. Compare RTRIM vs original
SELECT product_id,
       product_name,
       RTRIM(product_name) AS rtrimmed
FROM billing_product.products;
-- 10. Use RTRIM in WHERE
SELECT * FROM billing_product.customers
WHERE RTRIM(contact_info) = 'michael.johnson@example.com';
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '@' in contact_info
SELECT customer_id,
       CHARINDEX('@',contact_info) AS at_pos
FROM billing_product.customers;
-- 2. Position of 'phone' in product_name
SELECT product_id,
       CHARINDEX('phone',product_name) AS pos_phone
FROM billing_product.products;
-- 3. Filter products containing 'er'
SELECT product_id, product_name
FROM billing_product.products
WHERE CHARINDEX('er',product_name) > 0;
-- 4. Find hyphen position in concatenated string
SELECT product_id,
       CHARINDEX('-',product_name + '-X') AS dash_pos
FROM billing_product.products;
-- 5. First space in customer_name
SELECT customer_id,
       CHARINDEX(' ',customer_name) AS space_pos
FROM billing_product.customers;
-- 6. Position of '.' in CAST(total_amount)
SELECT bill_id,
       CHARINDEX('.',CAST(total_amount AS VARCHAR(20))) AS dot_pos
FROM billing_product.bill;
-- 7. Any digit position in contact_info
SELECT customer_id,
       CHARINDEX('1',contact_info) AS pos1
FROM billing_product.customers;
-- 8. Nested CHARINDEX to get domain
SELECT customer_id,
       SUBSTRING(contact_info,CHARINDEX('@',contact_info)+1,CHARINDEX('.',contact_info,CHARINDEX('@',contact_info))-CHARINDEX('@',contact_info)-1) AS domain_name
FROM billing_product.customers;
-- 9. Filter customers with no '@'
SELECT customer_id, contact_info
FROM billing_product.customers
WHERE CHARINDEX('@',contact_info) = 0;
-- 10. Use CHARINDEX in ORDER BY
SELECT contact_info
FROM billing_product.customers
ORDER BY CHARINDEX('@',contact_info);
```

## Left Function (LEFT)
```sql
-- 1. First 2 letters of product_name
SELECT product_id, LEFT(product_name,2) AS left2
FROM billing_product.products;
-- 2. First letter of customer_name
SELECT customer_id, LEFT(customer_name,1) AS initial
FROM billing_product.customers;
-- 3. First 4 chars of contact_info
SELECT customer_id, LEFT(contact_info,4) AS prefix
FROM billing_product.customers;
-- 4. First 4 digits of year-month
SELECT bill_id, LEFT(CONVERT(VARCHAR(7),bill_date,120),7) AS year_mon
FROM billing_product.bill;
-- 5. First 5 chars of CAST(line_total)
SELECT billdetail_id, LEFT(CAST(line_total AS VARCHAR(20)),5) AS left_part
FROM billing_product.billdetails;
-- 6. LEFT combined string
SELECT product_id,
       LEFT(product_name + '|' + CAST(price AS VARCHAR), CHARINDEX('|',product_name+'|')-1) AS name_only
FROM billing_product.products;
-- 7. LEFT in WHERE
SELECT * FROM billing_product.products
WHERE LEFT(product_name,3) = 'Cam';
-- 8. LEFT for formatting
SELECT customer_id,
       LEFT(customer_name,CHARINDEX(' ',customer_name)-1) AS first_name
FROM billing_product.customers
WHERE CHARINDEX(' ',customer_name)>0;
-- 9. LEFT in ORDER BY
SELECT product_name
FROM billing_product.products
ORDER BY LEFT(product_name,1);
-- 10. LEFT nested
SELECT bill_id,
       LEFT(RIGHT(CONVERT(VARCHAR(10),bill_date,23),5),2) AS day_part
FROM billing_product.bill;
```

## Right Function (RIGHT)
```sql
-- 1. Last 2 letters of product_name
SELECT product_id, RIGHT(product_name,2) AS right2
FROM billing_product.products;
-- 2. Last letter of customer_name
SELECT customer_id, RIGHT(customer_name,1) AS last_initial
FROM billing_product.customers;
-- 3. Last 4 chars of contact_info
SELECT customer_id, RIGHT(contact_info,4) AS suffix
FROM billing_product.customers;
-- 4. Day from bill_date
SELECT bill_id, RIGHT(CONVERT(VARCHAR(10),bill_date,23),2) AS day_part
FROM billing_product.bill;
-- 5. Last 3 of CAST(line_total)
SELECT billdetail_id, RIGHT(CAST(line_total AS VARCHAR(20)),3) AS right_part
FROM billing_product.billdetails;
-- 6. RIGHT combined string
SELECT product_id,
       RIGHT(product_name + '##',2) AS padded_end
FROM billing_product.products;
-- 7. RIGHT in WHERE
SELECT * FROM billing_product.products
WHERE RIGHT(product_name,3) = 'ter';
-- 8. RIGHT for formatting
SELECT customer_id,
       RIGHT(contact_info,CHARINDEX('@',REVERSE(contact_info))-1) AS domain_ext
FROM billing_product.customers;
-- 9. RIGHT in ORDER BY
SELECT bill_id
FROM billing_product.bill
ORDER BY RIGHT(CONVERT(VARCHAR(10),bill_date,23),2);
-- 10. RIGHT nested
SELECT billdetail_id,
       RIGHT(LEFT(CAST(line_total AS VARCHAR),5),2) AS inner_part
FROM billing_product.billdetails;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse product_name
SELECT product_id, REVERSE(product_name) AS rev_name
FROM billing_product.products;
-- 2. Reverse customer_name
SELECT customer_id, REVERSE(customer_name) AS rev_name
FROM billing_product.customers;
-- 3. Reverse contact_info
SELECT customer_id, REVERSE(contact_info) AS rev_info
FROM billing_product.customers;
-- 4. Reverse year-month string
SELECT bill_id, REVERSE(CONVERT(VARCHAR(7),bill_date,120)) AS rev_year_mon
FROM billing_product.bill;
-- 5. Reverse CAST(line_total)
SELECT billdetail_id, REVERSE(CAST(line_total AS VARCHAR(20))) AS rev_total
FROM billing_product.billdetails;
-- 6. Reverse concatenated string
SELECT product_id,
       REVERSE(product_name + '-' + CAST(price AS VARCHAR)) AS rev_display
FROM billing_product.products;
-- 7. Filter reversed names starting with 'pt'
SELECT product_id, REVERSE(product_name) AS rev_name
FROM billing_product.products
WHERE REVERSE(product_name) LIKE 'pt%';
-- 8. Reverse and take LEFT
SELECT product_id,
       LEFT(REVERSE(product_name),3) AS rev_left3
FROM billing_product.products;
-- 9. Reverse email domain
SELECT customer_id,
       REVERSE(SUBSTRING(REVERSE(contact_info),1,CHARINDEX('@',REVERSE(contact_info))-1)) AS rev_domain
FROM billing_product.customers;
-- 10. Nested REVERSE(REPLACE())
SELECT customer_id,
       REPLACE(REVERSE(REVERSE(contact_info)),'@','[at]') AS replaced_email
FROM billing_product.customers;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace spaces with underscores in product_name
SELECT product_id,
       REPLACE(product_name,' ','_') AS name_uscore
FROM billing_product.products;
-- 2. Replace '@example.com' with '@gmail.com'
SELECT customer_id,
       REPLACE(contact_info,'@example.com','@gmail.com') AS new_email
FROM billing_product.customers;
-- 3. Remove 'Bill' from summary
SELECT bill_id,
       REPLACE('Bill #' + CAST(bill_id AS VARCHAR),'Bill','') AS no_bill
FROM billing_product.bill;
-- 4. Replace '.' with ',' in line_total
SELECT billdetail_id,
       REPLACE(CAST(line_total AS VARCHAR(20)),'.',',') AS euro_format
FROM billing_product.billdetails;
-- 5. Replace '-' with '/ ' in year_month
SELECT bill_id,
       REPLACE(CAST(YEAR(bill_date) AS VARCHAR)+'-'+RIGHT('00'+CAST(MONTH(bill_date) AS VARCHAR),2),'-','/') AS formatted_date
FROM billing_product.bill;
-- 6. Replace 'o' with '0' in product_name
SELECT product_id,
       REPLACE(product_name,'o','0') AS zero_o
FROM billing_product.products;
-- 7. Replace duplicate spaces in contact_info
SELECT customer_id,
       REPLACE(contact_info,'  ',' ') AS single_space
FROM billing_product.customers;
-- 8. Remove prefix 'www.' in contact_info (demo)
SELECT customer_id,
       REPLACE(contact_info,'www.','') AS no_www
FROM billing_product.customers;
-- 9. Replace 'x' in line_summary
SELECT billdetail_id,
       REPLACE(p.product_name + ' x' + CAST(bd.quantity AS VARCHAR),'x','*') AS new_summary
FROM billing_product.billdetails bd
JOIN billing_product.products p ON bd.product_id=p.product_id;
-- 10. Nested REPLACE to mask digits
SELECT customer_id,
       REPLACE(REPLACE(contact_info,'1','*'),'2','*') AS masked_info
FROM billing_product.customers;
```

## Case Statement (CASE)
```sql
-- 1. Label products as 'Expensive' or 'Cheap'
SELECT product_id, product_name, price,
       CASE WHEN price > 500 THEN 'Expensive' ELSE 'Cheap' END AS price_label
FROM billing_product.products;
-- 2. Bill details as 'Bulk' or 'Single'
SELECT billdetail_id, quantity,
       CASE WHEN quantity > 1 THEN 'Bulk' ELSE 'Single' END AS qty_type
FROM billing_product.billdetails;
-- 3. Customer contact method
SELECT customer_id, contact_info,
       CASE WHEN CHARINDEX('@',contact_info)>0 THEN 'Email' ELSE 'Phone' END AS contact_type
FROM billing_product.customers;
-- 4. Bill seasons based on month
SELECT bill_id, bill_date,
       CASE
         WHEN MONTH(bill_date) IN (12,1,2) THEN 'Winter'
         WHEN MONTH(bill_date) IN (3,4,5) THEN 'Spring'
         WHEN MONTH(bill_date) IN (6,7,8) THEN 'Summer'
         ELSE 'Fall'
       END AS season
FROM billing_product.bill;
-- 5. Round line_total to nearest hundred
SELECT billdetail_id, line_total,
       CASE
         WHEN line_total % 100 = 0 THEN 'Exact'
         ELSE 'Non-Exact'
       END AS round_type
FROM billing_product.billdetails;
-- 6. Price category with three tiers
SELECT product_id, price,
       CASE
         WHEN price < 100 THEN 'Low'
         WHEN price < 300 THEN 'Medium'
         ELSE 'High'
       END AS tier
FROM billing_product.products;
-- 7. Customer name initial group
SELECT customer_id, customer_name,
       CASE LEFT(customer_name,1)
         WHEN 'J' THEN 'Group J'
         WHEN 'A' THEN 'Group A'
         ELSE 'Other'
       END AS name_group
FROM billing_product.customers;
-- 8. Bill status based on total_amount
SELECT bill_id, total_amount,
       CASE
         WHEN total_amount < 1000 THEN 'Low'
         WHEN total_amount < 2000 THEN 'Medium'
         ELSE 'High'
       END AS amt_category
FROM billing_product.bill;
-- 9. Combine CASE with CONCAT
SELECT product_id,
       CASE WHEN price > 200 THEN product_name + ' (Premium)'
            ELSE product_name + ' (Standard)' END AS label
FROM billing_product.products;
-- 10. Nested CASE to highlight large orders
SELECT billdetail_id, quantity,
       CASE
         WHEN quantity > 10 THEN 'Very Large'
         WHEN quantity > 5 THEN 'Large'
         ELSE 'Normal'
       END AS order_size
FROM billing_product.billdetails;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Default contact_info if NULL
SELECT customer_id, ISNULL(contact_info,'No Contact') AS contact
FROM billing_product.customers;
-- 2. Default product_name if NULL
SELECT product_id, ISNULL(product_name,'Unknown') AS name
FROM billing_product.products;
-- 3. Default price if NULL
SELECT product_id, ISNULL(price,0.00) AS price
FROM billing_product.products;
-- 4. Default bill_date if NULL
SELECT bill_id, ISNULL(bill_date,'1900-01-01') AS bill_date
FROM billing_product.bill;
-- 5. Default total_amount if NULL
SELECT bill_id, ISNULL(total_amount,0.00) AS amt
FROM billing_product.bill;
-- 6. Default line_total if NULL
SELECT billdetail_id, ISNULL(line_total,0.00) AS total
FROM billing_product.billdetails;
-- 7. ISNULL in concatenation
SELECT customer_id,
       ISNULL(customer_name,'Unknown') + ' <' + ISNULL(contact_info,'N/A') + '>' AS card
FROM billing_product.customers;
-- 8. ISNULL in WHERE
SELECT * FROM billing_product.products
WHERE ISNULL(price,0) > 100;
-- 9. ISNULL in ORDER BY
SELECT product_id, price
FROM billing_product.products
ORDER BY ISNULL(price,0) DESC;
-- 10. ISNULL to avoid division by zero
SELECT bill_id, total_amount,
       total_amount / ISNULL(NULLIF(quantity,0),1) AS per_item
FROM billing_product.billdetails;
```

## Coalesce Function (COALESCE)
```sql
-- 1. First non-NULL contact_info or default
SELECT customer_id, COALESCE(contact_info,'No Contact') AS contact
FROM billing_product.customers;
-- 2. Coalesce product_name and 'Unknown'
SELECT product_id, COALESCE(product_name,'Unknown') AS name
FROM billing_product.products;
-- 3. Coalesce price, 0.00, and 100.00
SELECT product_id, COALESCE(price,0.00,100.00) AS price_val
FROM billing_product.products;
-- 4. Coalesce bill_date and GETDATE()
SELECT bill_id, COALESCE(bill_date,GETDATE()) AS bill_date
FROM billing_product.bill;
-- 5. Coalesce total_amount, 0
SELECT bill_id, COALESCE(total_amount,0.00) AS amt
FROM billing_product.bill;
-- 6. Coalesce line_total or price*quantity
SELECT bd.billdetail_id,
       COALESCE(line_total, p.price * bd.quantity) AS total
FROM billing_product.billdetails AS bd
JOIN billing_product.products AS p ON bd.product_id=p.product_id;
-- 7. Coalesce in concatenation with multiple fields
SELECT customer_id,
       COALESCE(customer_name,'Unknown') + ' <' + COALESCE(contact_info,'N/A') + '>' AS card
FROM billing_product.customers;
-- 8. Coalesce in WHERE
SELECT * FROM billing_product.products
WHERE COALESCE(price,0) BETWEEN 50 AND 200;
-- 9. Coalesce in ORDER BY
SELECT product_id, price
FROM billing_product.products
ORDER BY COALESCE(price,0) ASC;
-- 10. Coalesce with NULLIF to avoid nulls
SELECT bill_id,
       COALESCE(total_amount,NULLIF(total_amount,0),0) AS safe_amt
FROM billing_product.bill;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
