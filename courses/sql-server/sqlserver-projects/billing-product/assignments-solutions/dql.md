![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. List all products.
SELECT * 
FROM billing_product.products;

-- 2. Retrieve only product_name and price for every product.
SELECT product_name, price 
FROM billing_product.products;

-- 3. Show customer_id and customer_name for all customers.
SELECT customer_id, customer_name 
FROM billing_product.customers;

-- 4. Display bill_id, bill_date and total_amount from all bills.
SELECT bill_id, bill_date, total_amount 
FROM billing_product.bill;

-- 5. Show every column from billdetails.
SELECT * 
FROM billing_product.billdetails;

-- 6. List each line item’s billdetail_id, product_name and line_total.
SELECT bd.billdetail_id,
       p.product_name,
       bd.line_total
FROM billing_product.billdetails AS bd
JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 7. Show customer_name with each bill_date.
SELECT c.customer_name,
       b.bill_date
FROM billing_product.bill AS b
JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 8. List distinct customer_id values from the bill table.
SELECT DISTINCT customer_id 
FROM billing_product.bill;

-- 9. Concatenate customer_name and contact_info into one column called contact_card.
SELECT 
  customer_name 
  + ' <' 
  + contact_info 
  + '>' AS contact_card
FROM billing_product.customers;

-- 10. Show product_name, price, and (price * 2) as double_price.
SELECT product_name,
       price,
       price * 2 AS double_price
FROM billing_product.products;
```

## WHERE
```sql
-- 1. List products priced above 500.
SELECT * 
FROM billing_product.products
WHERE price > 500;

-- 2. List products with price between 100 and 500.
SELECT * 
FROM billing_product.products
WHERE price BETWEEN 100 AND 500;

-- 3. Find customers whose names start with 'J'.
SELECT * 
FROM billing_product.customers
WHERE customer_name LIKE 'J%';

-- 4. Show bills issued after June 1, 2023.
SELECT * 
FROM billing_product.bill
WHERE bill_date > '2023-06-01';

-- 5. List bills where total_amount is at least 1000.
SELECT * 
FROM billing_product.bill
WHERE total_amount >= 1000.00;

-- 6. Show billdetails having quantity greater than 2.
SELECT * 
FROM billing_product.billdetails
WHERE quantity > 2;

-- 7. List billdetails where line_total is less than the product’s price.
SELECT bd.*
FROM billing_product.billdetails AS bd
JOIN billing_product.products AS p
  ON bd.product_id = p.product_id
WHERE bd.line_total < p.price;

-- 8. Show all bills for customer_id = 3.
SELECT * 
FROM billing_product.bill
WHERE customer_id = 3;

-- 9. Find products whose name contains 'phone'.
SELECT * 
FROM billing_product.products
WHERE product_name LIKE '%phone%';

-- 10. List billdetails for bills in March 2023.
SELECT bd.*
FROM billing_product.billdetails AS bd
JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id
WHERE MONTH(b.bill_date) = 3
  AND YEAR(b.bill_date) = 2023;
```

## GROUP BY
```sql
-- 1. Count total number of products.
SELECT COUNT(*) AS product_count
FROM billing_product.products;

-- 2. Count how many bills each customer has.
SELECT customer_id,
       COUNT(*) AS bills_count
FROM billing_product.bill
GROUP BY customer_id;

-- 3. Sum total_amount per customer.
SELECT customer_id,
       SUM(total_amount) AS total_billed
FROM billing_product.bill
GROUP BY customer_id;

-- 4. Sum of line_total by product (show product_name).
SELECT p.product_name,
       SUM(bd.line_total) AS total_sales
FROM billing_product.billdetails AS bd
JOIN billing_product.products AS p
  ON bd.product_id = p.product_id
GROUP BY p.product_name;

-- 5. Count line items per bill.
SELECT bill_id,
       COUNT(*) AS items_count
FROM billing_product.billdetails
GROUP BY bill_id;

-- 6. Total quantity sold per product_id.
SELECT product_id,
       SUM(quantity) AS total_quantity
FROM billing_product.billdetails
GROUP BY product_id;

-- 7. Average line_total per bill.
SELECT bill_id,
       AVG(line_total) AS avg_line_total
FROM billing_product.billdetails
GROUP BY bill_id;

-- 8. Count distinct products per bill.
SELECT bill_id,
       COUNT(DISTINCT product_id) AS distinct_products
FROM billing_product.billdetails
GROUP BY bill_id;

-- 9. Sum of total_amount per month.
SELECT YEAR(bill_date) AS yr,
       MONTH(bill_date) AS mon,
       SUM(total_amount) AS sum_per_month
FROM billing_product.bill
GROUP BY YEAR(bill_date), MONTH(bill_date);

-- 10. Count of customers.
SELECT COUNT(*) AS customer_count
FROM billing_product.customers;
```

## HAVING
```sql
-- 1. Customers having more than 2 bills.
SELECT customer_id,
       COUNT(*) AS bills_count
FROM billing_product.bill
GROUP BY customer_id
HAVING COUNT(*) > 2;

-- 2. Products billed more than 5 times.
SELECT product_id,
       COUNT(*) AS times_billed
FROM billing_product.billdetails
GROUP BY product_id
HAVING COUNT(*) > 5;

-- 3. Bills where sum of line_total > 1000.
SELECT bill_id,
       SUM(line_total) AS sum_lines
FROM billing_product.billdetails
GROUP BY bill_id
HAVING SUM(line_total) > 1000;

-- 4. Customers whose total billed amount > 5000.
SELECT customer_id,
       SUM(total_amount) AS total_billed
FROM billing_product.bill
GROUP BY customer_id
HAVING SUM(total_amount) > 5000;

-- 5. Products with average line_total > 300.
SELECT product_id,
       AVG(line_total) AS avg_line
FROM billing_product.billdetails
GROUP BY product_id
HAVING AVG(line_total) > 300;

-- 6. Months with more than 3 bills.
SELECT YEAR(bill_date) AS yr,
       MONTH(bill_date) AS mon,
       COUNT(*) AS bills_count
FROM billing_product.bill
GROUP BY YEAR(bill_date), MONTH(bill_date)
HAVING COUNT(*) > 3;

-- 7. Bills containing more than 3 distinct products.
SELECT bill_id,
       COUNT(DISTINCT product_id) AS distinct_count
FROM billing_product.billdetails
GROUP BY bill_id
HAVING COUNT(DISTINCT product_id) > 3;

-- 8. Customers with any single bill > 2000.
SELECT customer_id,
       MAX(total_amount) AS max_bill
FROM billing_product.bill
GROUP BY customer_id
HAVING MAX(total_amount) > 2000;

-- 9. Products whose total quantity sold > 10.
SELECT product_id,
       SUM(quantity) AS total_qty
FROM billing_product.billdetails
GROUP BY product_id
HAVING SUM(quantity) > 10;

-- 10. Customers with between 2 and 5 bills.
SELECT customer_id,
       COUNT(*) AS bills_count
FROM billing_product.bill
GROUP BY customer_id
HAVING COUNT(*) BETWEEN 2 AND 5;
```

## ORDER BY
```sql
-- 1. Products ordered by price ascending.
SELECT * 
FROM billing_product.products
ORDER BY price ASC;

-- 2. Products ordered by price descending.
SELECT * 
FROM billing_product.products
ORDER BY price DESC;

-- 3. Customers sorted alphabetically by name.
SELECT * 
FROM billing_product.customers
ORDER BY customer_name;

-- 4. Bills sorted by bill_date newest first.
SELECT * 
FROM billing_product.bill
ORDER BY bill_date DESC;

-- 5. Bills sorted by total_amount lowest first.
SELECT * 
FROM billing_product.bill
ORDER BY total_amount ASC;

-- 6. Billdetails sorted by line_total descending.
SELECT * 
FROM billing_product.billdetails
ORDER BY line_total DESC;

-- 7. Products sorted by price ASC, then product_name DESC.
SELECT * 
FROM billing_product.products
ORDER BY price ASC, product_name DESC;

-- 8. Bills ordered by customer_id, then bill_date.
SELECT * 
FROM billing_product.bill
ORDER BY customer_id, bill_date;

-- 9. Billdetails ordered by bill_id ASC, quantity DESC.
SELECT * 
FROM billing_product.billdetails
ORDER BY bill_id ASC, quantity DESC;

-- 10. Customers ordered by LEN(customer_name) descending.
SELECT * 
FROM billing_product.customers
ORDER BY LEN(customer_name) DESC;
```

## TOP
```sql
-- 1. Top 5 most expensive products.
SELECT TOP 5 *
FROM billing_product.products
ORDER BY price DESC;

-- 2. Top 3 customers by number of bills.
SELECT TOP 3 customer_id,
       COUNT(*) AS bills_count
FROM billing_product.bill
GROUP BY customer_id
ORDER BY COUNT(*) DESC;

-- 3. Top 5 bills by total_amount.
SELECT TOP 5 *
FROM billing_product.bill
ORDER BY total_amount DESC;

-- 4. Top 10 billdetails by line_total.
SELECT TOP 10 *
FROM billing_product.billdetails
ORDER BY line_total DESC;

-- 5. The single product with the highest price.
SELECT TOP 1 *
FROM billing_product.products
ORDER BY price DESC;

-- 6. Top 5 products by total quantity sold.
SELECT TOP 5 bd.product_id,
       SUM(bd.quantity) AS total_qty
FROM billing_product.billdetails AS bd
GROUP BY bd.product_id
ORDER BY SUM(bd.quantity) DESC;

-- 7. Top 3 customers by total billed amount.
SELECT TOP 3 customer_id,
       SUM(total_amount) AS total_billed
FROM billing_product.bill
GROUP BY customer_id
ORDER BY SUM(total_amount) DESC;

-- 8. Top 5 most recent bills.
SELECT TOP 5 *
FROM billing_product.bill
ORDER BY bill_date DESC;

-- 9. Top 5 customers alphabetically.
SELECT TOP 5 *
FROM billing_product.customers
ORDER BY customer_name ASC;

-- 10. Top 2 bills for customer_id = 1 by bill_date.
SELECT TOP 2 *
FROM billing_product.bill
WHERE customer_id = 1
ORDER BY bill_date DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
