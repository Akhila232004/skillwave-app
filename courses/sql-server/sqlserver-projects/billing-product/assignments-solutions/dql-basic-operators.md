![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions

## Equality Operator (=)
```sql
-- 1. Products priced exactly 100.00
SELECT * FROM billing_product.products WHERE price = 100.00;
-- 2. Customers with customer_id = 5
SELECT * FROM billing_product.customers WHERE customer_id = 5;
-- 3. Bills for customer_id = 3
SELECT * FROM billing_product.bill WHERE customer_id = 3;
-- 4. Billdetails for product_id = 2
SELECT * FROM billing_product.billdetails WHERE product_id = 2;
-- 5. Products named 'Laptop'
SELECT * FROM billing_product.products WHERE product_name = 'Laptop';
-- 6. Customers named 'Jane Smith'
SELECT * FROM billing_product.customers WHERE customer_name = 'Jane Smith';
-- 7. Bills on '2023-04-15'
SELECT * FROM billing_product.bill WHERE bill_date = '2023-04-15';
-- 8. Billdetails where quantity = 5
SELECT * FROM billing_product.billdetails WHERE quantity = 5;
-- 9. Bills totaling 1200.00
SELECT * FROM billing_product.bill WHERE total_amount = 1200.00;
-- 10. Product with product_id = 10
SELECT * FROM billing_product.products WHERE product_id = 10;
```

## Inequality Operator (<>)
```sql
-- 1. Products not priced 100.00
SELECT * FROM billing_product.products WHERE price <> 100.00;
-- 2. Customers except customer_id = 1
SELECT * FROM billing_product.customers WHERE customer_id <> 1;
-- 3. Bills not for customer_id = 3
SELECT * FROM billing_product.bill WHERE customer_id <> 3;
-- 4. Billdetails for products other than product_id = 2
SELECT * FROM billing_product.billdetails WHERE product_id <> 2;
-- 5. Products not named 'Mouse'
SELECT * FROM billing_product.products WHERE product_name <> 'Mouse';
-- 6. Customers whose contact_info is not 'jane.smith@example.com'
SELECT * FROM billing_product.customers WHERE contact_info <> 'jane.smith@example.com';
-- 7. Bills not totaling 2150.00
SELECT * FROM billing_product.bill WHERE total_amount <> 2150.00;
-- 8. Billdetails where quantity <> 1
SELECT * FROM billing_product.billdetails WHERE quantity <> 1;
-- 9. Bills not on '2023-06-25'
SELECT * FROM billing_product.bill WHERE bill_date <> '2023-06-25';
-- 10. Products not priced 500.00
SELECT * FROM billing_product.products WHERE price <> 500.00;
```

## IN Operator
```sql
-- 1. Products with IDs in (1,2,3)
SELECT * FROM billing_product.products WHERE product_id IN (1,2,3);
-- 2. Customers with IDs in (1,3,5,7)
SELECT * FROM billing_product.customers WHERE customer_id IN (1,3,5,7);
-- 3. Bills with bill_id in (2,4,6,8)
SELECT * FROM billing_product.bill WHERE bill_id IN (2,4,6,8);
-- 4. Billdetails for bills 1,2,3
SELECT * FROM billing_product.billdetails WHERE bill_id IN (1,2,3);
-- 5. Products priced in (100.00,200.00,300.00)
SELECT * FROM billing_product.products WHERE price IN (100.00,200.00,300.00);
-- 6. Customers named 'John Doe' or 'Emily Davis'
SELECT * FROM billing_product.customers WHERE customer_name IN ('John Doe','Emily Davis');
-- 7. Bills totaling 800.00, 1100.00 or 1200.00
SELECT * FROM billing_product.bill WHERE total_amount IN (800.00,1100.00,1200.00);
-- 8. Billdetails for products 4,5,6
SELECT * FROM billing_product.billdetails WHERE product_id IN (4,5,6);
-- 9. Bills issued in months Jan(1), Apr(4), Jul(7)
SELECT * FROM billing_product.bill WHERE MONTH(bill_date) IN (1,4,7);
-- 10. Customers whose contact_info domain is example.com or gmail.com
SELECT * FROM billing_product.customers WHERE contact_info LIKE '%@example.com' OR contact_info LIKE '%@gmail.com';
```

## NOT IN Operator
```sql
-- 1. Products with IDs not in (1,2,3)
SELECT * FROM billing_product.products WHERE product_id NOT IN (1,2,3);
-- 2. Customers with IDs not in (1,5,9)
SELECT * FROM billing_product.customers WHERE customer_id NOT IN (1,5,9);
-- 3. Bills with bill_id not in (1,3,5)
SELECT * FROM billing_product.bill WHERE bill_id NOT IN (1,3,5);
-- 4. Billdetails with detail IDs not in (1,2,3,4)
SELECT * FROM billing_product.billdetails WHERE billdetail_id NOT IN (1,2,3,4);
-- 5. Products not priced 50.00 or 150.00
SELECT * FROM billing_product.products WHERE price NOT IN (50.00,150.00);
-- 6. Customers not named 'Michael Johnson' or 'Sarah Taylor'
SELECT * FROM billing_product.customers WHERE customer_name NOT IN ('Michael Johnson','Sarah Taylor');
-- 7. Bills for customers not in (2,4,6)
SELECT * FROM billing_product.bill WHERE customer_id NOT IN (2,4,6);
-- 8. Billdetails with quantity not 1 or 2
SELECT * FROM billing_product.billdetails WHERE quantity NOT IN (1,2);
-- 9. Bills not in year 2023
SELECT * FROM billing_product.bill WHERE YEAR(bill_date) NOT IN (2023);
-- 10. Products whose names are not 'Laptop' or 'Monitor'
SELECT * FROM billing_product.products WHERE product_name NOT IN ('Laptop','Monitor');
```

## LIKE Operator
```sql
-- 1. Products containing 'phone'
SELECT * FROM billing_product.products WHERE product_name LIKE '%phone%';
-- 2. Customers whose name starts with 'J'
SELECT * FROM billing_product.customers WHERE customer_name LIKE 'J%';
-- 3. Bills where total_amount begins with '1'
SELECT * FROM billing_product.bill WHERE CAST(total_amount AS VARCHAR(10)) LIKE '1%';
-- 4. Billdetails where line_total ends with '00'
SELECT * FROM billing_product.billdetails WHERE CAST(line_total AS VARCHAR(10)) LIKE '%00';
-- 5. Products ending in 'ouse' (e.g. Mouse)
SELECT * FROM billing_product.products WHERE product_name LIKE '%ouse';
-- 6. Customers with email at example.com
SELECT * FROM billing_product.customers WHERE contact_info LIKE '%@example.com';
-- 7. Bills issued in July 2023
SELECT * FROM billing_product.bill WHERE CONVERT(VARCHAR(10), bill_date, 23) LIKE '2023-07-%';
-- 8. Billdetails with quantity two-digit
SELECT * FROM billing_product.billdetails WHERE CAST(quantity AS VARCHAR(10)) LIKE '__';
-- 9. Products ending with 'Drive'
SELECT * FROM billing_product.products WHERE product_name LIKE '%Drive';
-- 10. Customers whose name contains 'a'
SELECT * FROM billing_product.customers WHERE customer_name LIKE '%a%';
```

## NOT LIKE Operator
```sql
-- 1. Products not containing 'phone'
SELECT * FROM billing_product.products WHERE product_name NOT LIKE '%phone%';
-- 2. Customers whose name does not start with 'J'
SELECT * FROM billing_product.customers WHERE customer_name NOT LIKE 'J%';
-- 3. Bills where total_amount does not begin with '2'
SELECT * FROM billing_product.bill WHERE CAST(total_amount AS VARCHAR(10)) NOT LIKE '2%';
-- 4. Billdetails where line_total does not end with '50'
SELECT * FROM billing_product.billdetails WHERE CAST(line_total AS VARCHAR(10)) NOT LIKE '%50';
-- 5. Products not starting with 'M'
SELECT * FROM billing_product.products WHERE product_name NOT LIKE 'M%';
-- 6. Customers without example.com email
SELECT * FROM billing_product.customers WHERE contact_info NOT LIKE '%@example.com';
-- 7. Bills not in 2023
SELECT * FROM billing_product.bill WHERE CONVERT(VARCHAR(10), bill_date, 23) NOT LIKE '2023-%';
-- 8. Billdetails where quantity is not two-digit
SELECT * FROM billing_product.billdetails WHERE CAST(quantity AS VARCHAR(10)) NOT LIKE '__';
-- 9. Products without letter 'a'
SELECT * FROM billing_product.products WHERE product_name NOT LIKE '%a%';
-- 10. Customers whose name is not 'Smith'
SELECT * FROM billing_product.customers WHERE customer_name NOT LIKE '%Smith%';
```

## BETWEEN Operator
```sql
-- 1. Products priced between 100 and 500
SELECT * FROM billing_product.products WHERE price BETWEEN 100 AND 500;
-- 2. Bills dated between '2023-03-01' and '2023-06-30'
SELECT * FROM billing_product.bill WHERE bill_date BETWEEN '2023-03-01' AND '2023-06-30';
-- 3. Billdetails with quantity between 2 and 5
SELECT * FROM billing_product.billdetails WHERE quantity BETWEEN 2 AND 5;
-- 4. Bills totaling between 1000 and 2000
SELECT * FROM billing_product.bill WHERE total_amount BETWEEN 1000 AND 2000;
-- 5. Customers with IDs between 5 and 10
SELECT * FROM billing_product.customers WHERE customer_id BETWEEN 5 AND 10;
-- 6. Products with IDs between 3 and 7
SELECT * FROM billing_product.products WHERE product_id BETWEEN 3 AND 7;
-- 7. Billdetails with line_total between 200 and 1000
SELECT * FROM billing_product.billdetails WHERE line_total BETWEEN 200 AND 1000;
-- 8. Bills in months April(4) to August(8)
SELECT * FROM billing_product.bill WHERE MONTH(bill_date) BETWEEN 4 AND 8;
-- 9. Products priced between 30 and 150
SELECT * FROM billing_product.products WHERE price BETWEEN 30 AND 150;
-- 10. Billdetails with quantity between 1 and 3
SELECT * FROM billing_product.billdetails WHERE quantity BETWEEN 1 AND 3;
```

## Greater Than (>)
```sql
-- 1. Products priced above 500
SELECT * FROM billing_product.products WHERE price > 500;
-- 2. Bills totaling more than 1500
SELECT * FROM billing_product.bill WHERE total_amount > 1500;
-- 3. Billdetails with quantity > 2
SELECT * FROM billing_product.billdetails WHERE quantity > 2;
-- 4. Bills issued after '2023-05-01'
SELECT * FROM billing_product.bill WHERE bill_date > '2023-05-01';
-- 5. Products with product_id > 5
SELECT * FROM billing_product.products WHERE product_id > 5;
-- 6. Customers with customer_id > 10
SELECT * FROM billing_product.customers WHERE customer_id > 10;
-- 7. Billdetails where line_total > 300
SELECT * FROM billing_product.billdetails WHERE line_total > 300;
-- 8. Bills for customers with ID > 3
SELECT * FROM billing_product.bill WHERE customer_id > 3;
-- 9. Products priced above the average price
SELECT * FROM billing_product.products WHERE price > (SELECT AVG(price) FROM billing_product.products);
-- 10. Bills totaling above the average total_amount
SELECT * FROM billing_product.bill WHERE total_amount > (SELECT AVG(total_amount) FROM billing_product.bill);
```

## Greater Than or Equal To (>=)
```sql
-- 1. Products priced at least 500
SELECT * FROM billing_product.products WHERE price >= 500;
-- 2. Bills totaling at least 1000
SELECT * FROM billing_product.bill WHERE total_amount >= 1000;
-- 3. Billdetails with quantity >= 1
SELECT * FROM billing_product.billdetails WHERE quantity >= 1;
-- 4. Bills issued on or after '2023-07-01'
SELECT * FROM billing_product.bill WHERE bill_date >= '2023-07-01';
-- 5. Products with product_id >= 7
SELECT * FROM billing_product.products WHERE product_id >= 7;
-- 6. Customers with customer_id >= 5
SELECT * FROM billing_product.customers WHERE customer_id >= 5;
-- 7. Billdetails where line_total >= 150
SELECT * FROM billing_product.billdetails WHERE line_total >= 150;
-- 8. Bills for customers with ID >= 2
SELECT * FROM billing_product.bill WHERE customer_id >= 2;
-- 9. Products priced at least 200
SELECT * FROM billing_product.products WHERE price >= 200;
-- 10. Billdetails with quantity at least 10
SELECT * FROM billing_product.billdetails WHERE quantity >= 10;
```

## Less Than (<)
```sql
-- 1. Products priced below 500
SELECT * FROM billing_product.products WHERE price < 500;
-- 2. Bills totaling less than 1000
SELECT * FROM billing_product.bill WHERE total_amount < 1000;
-- 3. Billdetails with quantity < 2
SELECT * FROM billing_product.billdetails WHERE quantity < 2;
-- 4. Bills issued before '2023-05-01'
SELECT * FROM billing_product.bill WHERE bill_date < '2023-05-01';
-- 5. Products with product_id < 5
SELECT * FROM billing_product.products WHERE product_id < 5;
-- 6. Customers with customer_id < 5
SELECT * FROM billing_product.customers WHERE customer_id < 5;
-- 7. Billdetails where line_total < 300
SELECT * FROM billing_product.billdetails WHERE line_total < 300;
-- 8. Bills for customers with ID < 3
SELECT * FROM billing_product.bill WHERE customer_id < 3;
-- 9. Products priced below average price
SELECT * FROM billing_product.products WHERE price < (SELECT AVG(price) FROM billing_product.products);
-- 10. Bills totaling less than the maximum total_amount
SELECT * FROM billing_product.bill WHERE total_amount < (SELECT MAX(total_amount) FROM billing_product.bill);
```

## Less Than or Equal To (<=)
```sql
-- 1. Products priced up to 500
SELECT * FROM billing_product.products WHERE price <= 500;
-- 2. Bills totaling up to 1200
SELECT * FROM billing_product.bill WHERE total_amount <= 1200;
-- 3. Billdetails with quantity <= 1
SELECT * FROM billing_product.billdetails WHERE quantity <= 1;
-- 4. Bills issued on or before '2023-08-01'
SELECT * FROM billing_product.bill WHERE bill_date <= '2023-08-01';
-- 5. Products with product_id <= 10
SELECT * FROM billing_product.products WHERE product_id <= 10;
-- 6. Customers with customer_id <= 10
SELECT * FROM billing_product.customers WHERE customer_id <= 10;
-- 7. Billdetails where line_total <= 200
SELECT * FROM billing_product.billdetails WHERE line_total <= 200;
-- 8. Bills for customers with ID <= 4
SELECT * FROM billing_product.bill WHERE customer_id <= 4;
-- 9. Products priced at most 150
SELECT * FROM billing_product.products WHERE price <= 150;
-- 10. Billdetails with quantity up to 5
SELECT * FROM billing_product.billdetails WHERE quantity <= 5;
```

## EXISTS Operator
```sql
-- 1. Customers having at least one bill
SELECT * FROM billing_product.customers c
WHERE EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.customer_id = c.customer_id
);
-- 2. Products that have been sold at least once
SELECT * FROM billing_product.products p
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id
);
-- 3. Bills with at least one line item quantity > 2
SELECT * FROM billing_product.bill b
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.bill_id = b.bill_id AND bd.quantity > 2
);
-- 4. Products sold in bill 1
SELECT * FROM billing_product.products p
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id AND bd.bill_id = 1
);
-- 5. Customers with bills in March 2023
SELECT * FROM billing_product.customers c
WHERE EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.customer_id = c.customer_id
    AND MONTH(b.bill_date) = 3
    AND YEAR(b.bill_date) = 2023
);
-- 6. Bills containing product_id = 1
SELECT * FROM billing_product.bill b
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.bill_id = b.bill_id AND bd.product_id = 1
);
-- 7. Products with any line_total > 500
SELECT * FROM billing_product.products p
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id AND bd.line_total > 500
);
-- 8. Customers with any bill > 2000
SELECT * FROM billing_product.customers c
WHERE EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.customer_id = c.customer_id AND b.total_amount > 2000
);
-- 9. Bills having at least one item priced > 300
SELECT * FROM billing_product.bill b
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  JOIN billing_product.products p ON bd.product_id = p.product_id
  WHERE bd.bill_id = b.bill_id AND p.price > 300
);
-- 10. Products with quantity sold >= 5 in any bill
SELECT * FROM billing_product.products p
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id AND bd.quantity >= 5
);
```

## NOT EXISTS Operator
```sql
-- 1. Customers with no bills
SELECT * FROM billing_product.customers c
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.customer_id = c.customer_id
);
-- 2. Products never sold
SELECT * FROM billing_product.products p
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id
);
-- 3. Bills with no line items
SELECT * FROM billing_product.bill b
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.bill_id = b.bill_id
);
-- 4. Customers without bills after June 1, 2023
SELECT * FROM billing_product.customers c
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.customer_id = c.customer_id AND b.bill_date > '2023-06-01'
);
-- 5. Products with no line_total above 200
SELECT * FROM billing_product.products p
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id AND bd.line_total > 200
);
-- 6. Bills without any item quantity > 3
SELECT * FROM billing_product.bill b
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.bill_id = b.bill_id AND bd.quantity > 3
);
-- 7. Products with no sales of quantity >= 2
SELECT * FROM billing_product.products p
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.billdetails bd
  WHERE bd.product_id = p.product_id AND bd.quantity >= 2
);
-- 8. Customers with no bills under 1000
SELECT * FROM billing_product.customers c
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.customer_id = c.customer_id AND b.total_amount < 1000
);
-- 9. Billdetails without a matching bill (FK test)
SELECT * FROM billing_product.billdetails bd
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.bill b
  WHERE b.bill_id = bd.bill_id
);
-- 10. Billdetails without a matching product (FK test)
SELECT * FROM billing_product.billdetails bd
WHERE NOT EXISTS (
  SELECT 1 FROM billing_product.products p
  WHERE p.product_id = bd.product_id
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
