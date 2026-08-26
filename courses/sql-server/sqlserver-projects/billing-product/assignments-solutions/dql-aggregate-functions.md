![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Count all products
SELECT COUNT(*) AS TotalProducts
FROM billing_product.products;

-- 2. Count all customers
SELECT COUNT(*) AS TotalCustomers
FROM billing_product.customers;

-- 3. Count all bills
SELECT COUNT(*) AS TotalBills
FROM billing_product.bill;

-- 4. Count all bill details
SELECT COUNT(*) AS TotalBillDetails
FROM billing_product.billdetails;

-- 5. Count distinct products sold
SELECT COUNT(DISTINCT product_id) AS DistinctProductsSold
FROM billing_product.billdetails;

-- 6. Count bills per customer
SELECT customer_id, COUNT(*) AS BillsCount
FROM billing_product.bill
GROUP BY customer_id;

-- 7. Count line items per bill
SELECT bill_id, COUNT(*) AS LineItemCount
FROM billing_product.billdetails
GROUP BY bill_id;

-- 8. Count customers with at least one bill
SELECT COUNT(DISTINCT customer_id) AS CustomersWithBills
FROM billing_product.bill;

-- 9. Count products never sold
SELECT COUNT(*) AS UnsoldProducts
FROM billing_product.products
WHERE product_id NOT IN (
  SELECT product_id FROM billing_product.billdetails
);

-- 10. Count bills issued in 2023
SELECT COUNT(*) AS BillsIn2023
FROM billing_product.bill
WHERE YEAR(bill_date) = 2023;
```

## Sum
```sql
-- 1. Sum of all bill total_amounts
SELECT SUM(total_amount) AS SumAllBillAmounts
FROM billing_product.bill;

-- 2. Sum of all line totals
SELECT SUM(line_total) AS SumAllLineTotals
FROM billing_product.billdetails;

-- 3. Sum of prices of all products
SELECT SUM(price) AS SumAllProductPrices
FROM billing_product.products;

-- 4. Sum total_amount per customer
SELECT customer_id, SUM(total_amount) AS SumPerCustomer
FROM billing_product.bill
GROUP BY customer_id;

-- 5. Sum line_total per product
SELECT product_id, SUM(line_total) AS SumPerProduct
FROM billing_product.billdetails
GROUP BY product_id;

-- 6. Sum quantity sold per product
SELECT product_id, SUM(quantity) AS TotalQuantitySold
FROM billing_product.billdetails
GROUP BY product_id;

-- 7. Sum total_amount for bills in Q1 2023
SELECT SUM(total_amount) AS SumQ1_2023
FROM billing_product.bill
WHERE MONTH(bill_date) BETWEEN 1 AND 3 AND YEAR(bill_date) = 2023;

-- 8. Sum line_total for bill_id = 1
SELECT SUM(line_total) AS SumBill1Details
FROM billing_product.billdetails
WHERE bill_id = 1;

-- 9. Sum of total_amount for customers with ID ≤ 5
SELECT SUM(total_amount) AS SumCustomers1to5
FROM billing_product.bill
WHERE customer_id <= 5;

-- 10. Sum of price*quantity for all line items
SELECT SUM(p.price * bd.quantity) AS ComputedLineSum
FROM billing_product.billdetails bd
JOIN billing_product.products p ON bd.product_id = p.product_id;
```

## Avg
```sql
-- 1. Average price of products
SELECT AVG(price) AS AvgProductPrice
FROM billing_product.products;

-- 2. Average total_amount of bills
SELECT AVG(total_amount) AS AvgBillAmount
FROM billing_product.bill;

-- 3. Average line_total of bill details
SELECT AVG(line_total) AS AvgLineTotal
FROM billing_product.billdetails;

-- 4. Average quantity per line item
SELECT AVG(quantity) AS AvgQuantity
FROM billing_product.billdetails;

-- 5. Average total_amount per customer
SELECT customer_id, AVG(total_amount) AS AvgPerCustomer
FROM billing_product.bill
GROUP BY customer_id;

-- 6. Average line_total per product
SELECT product_id, AVG(line_total) AS AvgPerProduct
FROM billing_product.billdetails
GROUP BY product_id;

-- 7. Average total_amount for bills in March 2023
SELECT AVG(total_amount) AS AvgMarch2023
FROM billing_product.bill
WHERE MONTH(bill_date) = 3 AND YEAR(bill_date) = 2023;

-- 8. Average quantity per bill
SELECT bill_id, AVG(quantity) AS AvgQtyPerBill
FROM billing_product.billdetails
GROUP BY bill_id;

-- 9. Average price of sold products only
SELECT AVG(p.price) AS AvgSoldProductPrice
FROM billing_product.products p
WHERE EXISTS (
  SELECT 1 FROM billing_product.billdetails bd WHERE bd.product_id = p.product_id
);

-- 10. Average total_amount per month in 2023
SELECT MONTH(bill_date) AS Mon, AVG(total_amount) AS AvgAmt
FROM billing_product.bill
WHERE YEAR(bill_date) = 2023
GROUP BY MONTH(bill_date);
```

## Max
```sql
-- 1. Maximum product price
SELECT MAX(price) AS MaxProductPrice
FROM billing_product.products;

-- 2. Maximum bill total_amount
SELECT MAX(total_amount) AS MaxBillAmount
FROM billing_product.bill;

-- 3. Maximum line_total in details
SELECT MAX(line_total) AS MaxLineTotal
FROM billing_product.billdetails;

-- 4. Maximum quantity in bill details
SELECT MAX(quantity) AS MaxQuantity
FROM billing_product.billdetails;

-- 5. Highest total_amount per customer
SELECT customer_id, MAX(total_amount) AS MaxPerCustomer
FROM billing_product.bill
GROUP BY customer_id;

-- 6. Highest line_total per bill
SELECT bill_id, MAX(line_total) AS MaxLinePerBill
FROM billing_product.billdetails
GROUP BY bill_id;

-- 7. Maximum price among sold products
SELECT MAX(p.price) AS MaxSoldPrice
FROM billing_product.products p
JOIN billing_product.billdetails bd ON p.product_id = bd.product_id;

-- 8. Latest bill_date
SELECT MAX(bill_date) AS LatestBillDate
FROM billing_product.bill;

-- 9. Maximum number of items in a single bill
SELECT bill_id, MAX(item_count) AS MaxItems
FROM (
  SELECT bill_id, COUNT(*) AS item_count
  FROM billing_product.billdetails
  GROUP BY bill_id
) AS t;

-- 10. Maximum total_amount in 2023
SELECT MAX(total_amount) AS MaxAmt2023
FROM billing_product.bill
WHERE YEAR(bill_date) = 2023;
```

## Min
```sql
-- 1. Minimum product price
SELECT MIN(price) AS MinProductPrice
FROM billing_product.products;

-- 2. Minimum bill total_amount
SELECT MIN(total_amount) AS MinBillAmount
FROM billing_product.bill;

-- 3. Minimum line_total in details
SELECT MIN(line_total) AS MinLineTotal
FROM billing_product.billdetails;

-- 4. Minimum quantity in bill details
SELECT MIN(quantity) AS MinQuantity
FROM billing_product.billdetails;

-- 5. Lowest total_amount per customer
SELECT customer_id, MIN(total_amount) AS MinPerCustomer
FROM billing_product.bill
GROUP BY customer_id;

-- 6. Lowest line_total per bill
SELECT bill_id, MIN(line_total) AS MinLinePerBill
FROM billing_product.billdetails
GROUP BY bill_id;

-- 7. Minimum price among sold products
SELECT MIN(p.price) AS MinSoldPrice
FROM billing_product.products p
JOIN billing_product.billdetails bd ON p.product_id = bd.product_id;

-- 8. Earliest bill_date
SELECT MIN(bill_date) AS EarliestBillDate
FROM billing_product.bill;

-- 9. Minimum number of items in a single bill
SELECT bill_id, MIN(item_count) AS MinItems
FROM (
  SELECT bill_id, COUNT(*) AS item_count
  FROM billing_product.billdetails
  GROUP BY bill_id
) AS t;

-- 10. Minimum total_amount in 2023
SELECT MIN(total_amount) AS MinAmt2023
FROM billing_product.bill
WHERE YEAR(bill_date) = 2023;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
