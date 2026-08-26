![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. Combine all product_ids and customer_ids into one list of IDs.
SELECT product_id AS id FROM billing_product.products
UNION
SELECT customer_id FROM billing_product.customers;

-- 2. Combine all bill_ids and billdetail_ids into one list of IDs.
SELECT bill_id AS id FROM billing_product.bill
UNION
SELECT billdetail_id AS id FROM billing_product.billdetails;

-- 3. List all distinct names from products and customers.
SELECT product_name AS name FROM billing_product.products
UNION
SELECT customer_name FROM billing_product.customers;

-- 4. List all IDs from products and billdetails (product_id union billdetail_id).
SELECT product_id AS id FROM billing_product.products
UNION
SELECT billdetail_id FROM billing_product.billdetails;

-- 5. All (year, month) combinations from bills and billdetails.
SELECT YEAR(bill_date) AS yr, MONTH(bill_date) AS mon FROM billing_product.bill
UNION
SELECT YEAR(b.bill_date), MONTH(b.bill_date)
  FROM billing_product.billdetails bd
  JOIN billing_product.bill b ON bd.bill_id = b.bill_id;

-- 6. Combine product_ids priced over 200 and product_ids with line_total over 200.
SELECT product_id FROM billing_product.products WHERE price > 200
UNION
SELECT DISTINCT product_id FROM billing_product.billdetails WHERE line_total > 200;

-- 7. List of customers with customer_id<6 together with customers having bills.
SELECT customer_id FROM billing_product.customers WHERE customer_id < 6
UNION
SELECT DISTINCT customer_id FROM billing_product.bill;

-- 8. All unique total_amount values from bill and line_total from billdetails.
SELECT total_amount AS amount FROM billing_product.bill
UNION
SELECT line_total FROM billing_product.billdetails;

-- 9. Years with bills vs years with billdetails.
SELECT YEAR(bill_date) AS yr FROM billing_product.bill
UNION
SELECT YEAR(b.bill_date)
  FROM billing_product.billdetails bd
  JOIN billing_product.bill b ON bd.bill_id = b.bill_id;

-- 10. Union of product_ids priced <=100 and those priced >=500.
SELECT product_id FROM billing_product.products WHERE price <= 100
UNION
SELECT product_id FROM billing_product.products WHERE price >= 500;
```

## Intersect
```sql
-- 1. IDs present both as product_id and customer_id.
SELECT product_id AS id FROM billing_product.products
INTERSECT
SELECT customer_id FROM billing_product.customers;

-- 2. bill_ids that have corresponding details.
SELECT bill_id FROM billing_product.bill
INTERSECT
SELECT bill_id FROM billing_product.billdetails;

-- 3. Names present in both products and customers.
SELECT product_name AS name FROM billing_product.products
INTERSECT
SELECT customer_name FROM billing_product.customers;

-- 4. Months in which both bills and billdetails exist.
SELECT DISTINCT MONTH(bill_date) AS mon FROM billing_product.bill
INTERSECT
SELECT DISTINCT MONTH(b.bill_date)
  FROM billing_product.billdetails bd
  JOIN billing_product.bill b ON bd.bill_id = b.bill_id;

-- 5. product_ids priced above avg(price) and with line_total above avg(line_total).
SELECT product_id FROM billing_product.products 
 WHERE price > (SELECT AVG(price) FROM billing_product.products)
INTERSECT
SELECT product_id FROM billing_product.billdetails 
 WHERE line_total > (SELECT AVG(line_total) FROM billing_product.billdetails);

-- 6. customer_ids billed in Q1 and also in Q2 of 2023.
SELECT customer_id FROM billing_product.bill 
 WHERE MONTH(bill_date) IN (1,2,3)
INTERSECT
SELECT customer_id FROM billing_product.bill 
 WHERE MONTH(bill_date) IN (4,5,6);

-- 7. product_ids sold in both bill 1 and bill 2.
SELECT product_id FROM billing_product.billdetails WHERE bill_id = 1
INTERSECT
SELECT product_id FROM billing_product.billdetails WHERE bill_id = 2;

-- 8. customers with id≤5 who also have at least one bill.
SELECT customer_id FROM billing_product.customers WHERE customer_id <= 5
INTERSECT
SELECT customer_id FROM billing_product.bill;

-- 9. total_amount values appearing in both bill and line_total.
SELECT total_amount FROM billing_product.bill
INTERSECT
SELECT line_total FROM billing_product.billdetails;

-- 10. Years in both bills and billdetails.
SELECT YEAR(bill_date) FROM billing_product.bill
INTERSECT
SELECT YEAR(b.bill_date)
  FROM billing_product.billdetails bd
  JOIN billing_product.bill b ON bd.bill_id = b.bill_id;
```

## Except
```sql
-- 1. product_ids of products never sold.
SELECT product_id FROM billing_product.products
EXCEPT
SELECT DISTINCT product_id FROM billing_product.billdetails;

-- 2. customer_ids of customers with no bills.
SELECT customer_id FROM billing_product.customers
EXCEPT
SELECT DISTINCT customer_id FROM billing_product.bill;

-- 3. bill_ids that have no details.
SELECT bill_id FROM billing_product.bill
EXCEPT
SELECT DISTINCT bill_id FROM billing_product.billdetails;

-- 4. billdetail_ids that do not match any bill.
SELECT billdetail_id FROM billing_product.billdetails
EXCEPT
SELECT bill_id FROM billing_product.bill;

-- 5. product_ids priced ≤100 that have no line_total ≤100.
SELECT product_id FROM billing_product.products WHERE price <= 100
EXCEPT
SELECT DISTINCT product_id FROM billing_product.billdetails WHERE line_total <= 100;

-- 6. customers ≤id 5 with no bills in H1-2023.
SELECT customer_id FROM billing_product.customers WHERE customer_id <= 5
EXCEPT
SELECT DISTINCT customer_id FROM billing_product.bill 
 WHERE MONTH(bill_date) <= 6 AND YEAR(bill_date)=2023;

-- 7. total_amount values in bills never seen as line_total.
SELECT total_amount FROM billing_product.bill
EXCEPT
SELECT line_total FROM billing_product.billdetails;

-- 8. months with bills but no billdetails.
SELECT DISTINCT MONTH(bill_date) AS mon FROM billing_product.bill
EXCEPT
SELECT DISTINCT MONTH(b.bill_date)
  FROM billing_product.billdetails bd
  JOIN billing_product.bill b ON bd.bill_id = b.bill_id;

-- 9. product_ids ≥200 that have not been sold.
SELECT product_id FROM billing_product.products WHERE price >= 200
EXCEPT
SELECT DISTINCT product_id FROM billing_product.billdetails;

-- 10. customers with bills but none in Q3-2023.
SELECT DISTINCT customer_id FROM billing_product.bill
EXCEPT
SELECT DISTINCT customer_id FROM billing_product.bill 
 WHERE MONTH(bill_date) IN (7,8,9) AND YEAR(bill_date)=2023;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
