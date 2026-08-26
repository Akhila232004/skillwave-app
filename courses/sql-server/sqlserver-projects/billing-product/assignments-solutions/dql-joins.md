![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. List each billdetail with its bill date.
SELECT bd.billdetail_id, b.bill_date
FROM billing_product.billdetails AS bd
INNER JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id;

-- 2. Show each billdetail alongside product name and price.
SELECT bd.billdetail_id, p.product_name, p.price
FROM billing_product.billdetails AS bd
INNER JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 3. List all bills with customer name and total amount.
SELECT b.bill_id, c.customer_name, b.total_amount
FROM billing_product.bill AS b
INNER JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 4. Find customers who have at least one bill.
SELECT DISTINCT c.customer_id, c.customer_name
FROM billing_product.customers AS c
INNER JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id;

-- 5. Show sold products (product_name) and the billdetail IDs.
SELECT DISTINCT p.product_name, bd.billdetail_id
FROM billing_product.products AS p
INNER JOIN billing_product.billdetails AS bd
  ON p.product_id = bd.product_id;

-- 6. Combine billdetails, bills, customers, and products.
SELECT bd.billdetail_id,
       c.customer_name,
       p.product_name,
       bd.quantity,
       bd.line_total
FROM billing_product.billdetails AS bd
INNER JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id
INNER JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id
INNER JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 7. Billdetails for March 2023 with product names.
SELECT bd.billdetail_id, b.bill_date, p.product_name
FROM billing_product.billdetails AS bd
INNER JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id
INNER JOIN billing_product.products AS p
  ON bd.product_id = p.product_id
WHERE MONTH(b.bill_date) = 3 AND YEAR(b.bill_date) = 2023;

-- 8. Count line items per bill.
SELECT b.bill_id, COUNT(bd.billdetail_id) AS items_count
FROM billing_product.bill AS b
INNER JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
GROUP BY b.bill_id;

-- 9. Unique customer–product pairs they purchased.
SELECT DISTINCT c.customer_id, p.product_id
FROM billing_product.customers AS c
INNER JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id
INNER JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
INNER JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 10. Total quantity purchased by each customer.
SELECT c.customer_name, SUM(bd.quantity) AS total_quantity
FROM billing_product.customers AS c
INNER JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id
INNER JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
GROUP BY c.customer_name;
```

## Left Join (Left Outer Join)
```sql
-- 1. All customers and their bills (NULL if no bills).
SELECT c.customer_id, c.customer_name, b.bill_id
FROM billing_product.customers AS c
LEFT JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id;

-- 2. All products and their billdetails (NULL if unsold).
SELECT p.product_id, p.product_name, bd.billdetail_id
FROM billing_product.products AS p
LEFT JOIN billing_product.billdetails AS bd
  ON p.product_id = bd.product_id;

-- 3. All bills with customer info (NULL if no customer).
SELECT b.bill_id, b.bill_date, c.customer_name
FROM billing_product.bill AS b
LEFT JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 4. All billdetails with product info (NULL if product missing).
SELECT bd.billdetail_id, bd.product_id, p.product_name
FROM billing_product.billdetails AS bd
LEFT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 5. Bills, details, and product names (NULLs where no match).
SELECT b.bill_id, bd.billdetail_id, p.product_name
FROM billing_product.bill AS b
LEFT JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
LEFT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 6. Customers and every product (NULL if not purchased).
SELECT c.customer_id, c.customer_name, p.product_name
FROM billing_product.customers AS c
LEFT JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id
LEFT JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
LEFT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 7. Bills and number of line items (zero shows as NULL).
SELECT b.bill_id, COUNT(bd.billdetail_id) AS items_count
FROM billing_product.bill AS b
LEFT JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
GROUP BY b.bill_id;

-- 8. Products and total quantity sold (NULL if none).
SELECT p.product_id, SUM(bd.quantity) AS total_quantity
FROM billing_product.products AS p
LEFT JOIN billing_product.billdetails AS bd
  ON p.product_id = bd.product_id
GROUP BY p.product_id;

-- 9. Customers with their last bill date (NULL if none).
SELECT c.customer_id, MAX(b.bill_date) AS last_bill_date
FROM billing_product.customers AS c
LEFT JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id
GROUP BY c.customer_id;

-- 10. Bills in July 2023 with product names (NULL if no details).
SELECT b.bill_id, b.bill_date, p.product_name
FROM billing_product.bill AS b
LEFT JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
LEFT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id
WHERE MONTH(b.bill_date) = 7 AND YEAR(b.bill_date) = 2023;
```

## Right Join (Right Outer Join)
```sql
-- 1. All customers and their bill IDs (via RIGHT JOIN).
SELECT b.bill_id, c.customer_id, c.customer_name
FROM billing_product.bill AS b
RIGHT JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 2. All bills and their line items (NULL if none).
SELECT bd.billdetail_id, b.bill_id
FROM billing_product.billdetails AS bd
RIGHT JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id;

-- 3. All products with sales details (NULL if none).
SELECT p.product_id, p.product_name, bd.quantity
FROM billing_product.billdetails AS bd
RIGHT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 4. All customers with total billed (NULL if none).
SELECT c.customer_id, c.customer_name, b.total_amount
FROM billing_product.bill AS b
RIGHT JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 5. All bills with customer contact info (NULL if no customer).
SELECT b.bill_id, b.bill_date, c.contact_info
FROM billing_product.bill AS b
RIGHT JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 6. Product names and billdetail IDs (ensure all products).
SELECT p.product_name, bd.billdetail_id
FROM billing_product.billdetails AS bd
RIGHT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 7. Count of bills per customer (zero for none).
SELECT c.customer_name, COUNT(b.bill_id) AS bills_count
FROM billing_product.bill AS b
RIGHT JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id
GROUP BY c.customer_name;

-- 8. Bills in July 2023 with or without line items.
SELECT b.bill_id, bd.billdetail_id
FROM billing_product.billdetails AS bd
RIGHT JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id
WHERE MONTH(b.bill_date) = 7 AND YEAR(b.bill_date) = 2023;

-- 9. Products priced ≥200 with or without sales.
SELECT p.product_name, bd.line_total
FROM billing_product.billdetails AS bd
RIGHT JOIN billing_product.products AS p
  ON bd.product_id = p.product_id
WHERE p.price >= 200;

-- 10. Customers and sum of quantities (NULL if none).
SELECT c.customer_name, SUM(bd.quantity) AS total_qty
FROM billing_product.billdetails AS bd
RIGHT JOIN billing_product.customers AS c
  ON bd.bill_id IN (SELECT bill_id FROM billing_product.bill WHERE customer_id = c.customer_id)
GROUP BY c.customer_name;
```

## Full Join (Full Outer Join)
```sql
-- 1. All customers and bills, matching where possible.
SELECT c.customer_id, c.customer_name, b.bill_id
FROM billing_product.customers AS c
FULL JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id;

-- 2. All products and billdetails, matching where possible.
SELECT p.product_id, p.product_name, bd.billdetail_id
FROM billing_product.products AS p
FULL JOIN billing_product.billdetails AS bd
  ON p.product_id = bd.product_id;

-- 3. All bills and details, matching where possible.
SELECT b.bill_id, b.bill_date, bd.billdetail_id
FROM billing_product.bill AS b
FULL JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id;

-- 4. All bills and customers, matching where possible.
SELECT b.bill_id, b.total_amount, c.customer_name
FROM billing_product.bill AS b
FULL JOIN billing_product.customers AS c
  ON b.customer_id = c.customer_id;

-- 5. Customers linked to details via bills (NULLs if no match).
SELECT c.customer_id, bd.billdetail_id
FROM billing_product.customers AS c
FULL JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id
FULL JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id;

-- 6. Products linked to bills via details (NULLs if no match).
SELECT p.product_id, b.bill_id
FROM billing_product.products AS p
FULL JOIN billing_product.billdetails AS bd
  ON p.product_id = bd.product_id
FULL JOIN billing_product.bill AS b
  ON bd.bill_id = b.bill_id;

-- 7. Full chain: customers → bills → details → products.
SELECT c.customer_name, b.bill_id, bd.billdetail_id, p.product_name
FROM billing_product.customers AS c
FULL JOIN billing_product.bill AS b
  ON c.customer_id = b.customer_id
FULL JOIN billing_product.billdetails AS bd
  ON b.bill_id = bd.bill_id
FULL JOIN billing_product.products AS p
  ON bd.product_id = p.product_id;

-- 8. All total_amount vs. line_total values, matching on equality.
SELECT b.total_amount, bd.line_total
FROM billing_product.bill AS b
FULL JOIN billing_product.billdetails AS bd
  ON b.total_amount = bd.line_total;

-- 9. Aggregate totals per customer vs. per product.
WITH CustTotals AS (
  SELECT customer_id, SUM(total_amount) AS total_billed
  FROM billing_product.bill
  GROUP BY customer_id
),
ProdTotals AS (
  SELECT product_id, SUM(line_total) AS total_sales
  FROM billing_product.billdetails
  GROUP BY product_id
)
SELECT ct.customer_id, ct.total_billed, pt.product_id, pt.total_sales
FROM CustTotals AS ct
FULL JOIN ProdTotals AS pt
  ON ct.customer_id = pt.product_id;

-- 10. All customers and all products, whether purchased or not.
SELECT c.customer_id, p.product_id
FROM billing_product.customers AS c
FULL JOIN billing_product.products AS p
  ON 1=0;  /* forces full outer join with no match, returns all customers + all products */
```

## Cross Join
```sql
-- 1. All possible customer–product pairs.
SELECT c.customer_id, p.product_id
FROM billing_product.customers AS c
CROSS JOIN billing_product.products AS p;

-- 2. Every bill paired with every product.
SELECT b.bill_id, p.product_id
FROM billing_product.bill AS b
CROSS JOIN billing_product.products AS p;

-- 3. Every customer paired with every bill.
SELECT c.customer_id, b.bill_id
FROM billing_product.customers AS c
CROSS JOIN billing_product.bill AS b;

-- 4. Every bill paired with every billdetail.
SELECT b.bill_id, bd.billdetail_id
FROM billing_product.bill AS b
CROSS JOIN billing_product.billdetails AS bd;

-- 5. Every product paired with every billdetail.
SELECT p.product_id, bd.billdetail_id
FROM billing_product.products AS p
CROSS JOIN billing_product.billdetails AS bd;

-- 6. All customer–bill–product triples (two cross joins).
SELECT c.customer_id, b.bill_id, p.product_id
FROM billing_product.customers AS c
CROSS JOIN billing_product.bill AS b
CROSS JOIN billing_product.products AS p;

-- 7. All customer–product combinations they haven’t purchased.
SELECT c.customer_id, p.product_id
FROM billing_product.customers AS c
CROSS JOIN billing_product.products AS p
LEFT JOIN (
  SELECT DISTINCT customer_id, product_id
  FROM billing_product.customers AS cc
  INNER JOIN billing_product.bill AS bb ON cc.customer_id=bb.customer_id
  INNER JOIN billing_product.billdetails AS bdd ON bb.bill_id=bdd.bill_id
) AS purchased
  ON c.customer_id=purchased.customer_id
  AND p.product_id=purchased.product_id
WHERE purchased.product_id IS NULL;

-- 8. All month–year combinations present in bills.
SELECT DISTINCT MONTH(b1.bill_date) AS mon, DISTINCT_MONTH_YEAR.year
FROM (
  SELECT DISTINCT MONTH(bill_date) AS mon FROM billing_product.bill
) AS MONS
CROSS JOIN (
  SELECT DISTINCT YEAR(bill_date) AS year FROM billing_product.bill
) AS YEARS;

-- 9. All product_name–customer_name pairs for a promo list.
SELECT p.product_name, c.customer_name
FROM billing_product.products AS p
CROSS JOIN billing_product.customers AS c;

-- 10. Cartesian product of bill IDs and line totals.
SELECT b.bill_id, bd.line_total
FROM billing_product.bill AS b
CROSS JOIN billing_product.billdetails AS bd;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
