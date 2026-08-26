![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Running total of bill total_amount ordered by bill_date
SELECT
  bill_id,
  bill_date,
  total_amount,
  SUM(total_amount) OVER (
    ORDER BY bill_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS RunningTotal
FROM billing_product.bill;
-- 2. Running average of total_amount over last 2 bills
SELECT
  bill_id,
  bill_date,
  total_amount,
  AVG(total_amount) OVER (
    ORDER BY bill_date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS RunningAvgLast3
FROM billing_product.bill;
-- 3. Sum of line_total partitioned by bill_id
SELECT
  billdetail_id,
  bill_id,
  line_total,
  SUM(line_total) OVER (PARTITION BY bill_id) AS BillDetailSum
FROM billing_product.billdetails;
-- 4. Average line_total partitioned by product_id
SELECT
  billdetail_id,
  product_id,
  line_total,
  AVG(line_total) OVER (PARTITION BY product_id) AS ProdAvgLineTotal
FROM billing_product.billdetails;
-- 5. Cumulative sum of total_amount per customer ordered by bill_date
SELECT
  bill_id,
  customer_id,
  bill_date,
  total_amount,
  SUM(total_amount) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
    ROWS UNBOUNDED PRECEDING
  ) AS CustRunningTotal
FROM billing_product.bill;
-- 6. Cumulative max of total_amount across all bills
SELECT
  bill_id,
  bill_date,
  total_amount,
  MAX(total_amount) OVER (
    ORDER BY bill_date
    ROWS UNBOUNDED PRECEDING
  ) AS RunningMax
FROM billing_product.bill;
-- 7. Cumulative min line_total partitioned by product_id
SELECT
  billdetail_id,
  product_id,
  line_total,
  MIN(line_total) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
    ROWS UNBOUNDED PRECEDING
  ) AS ProdRunningMin
FROM billing_product.billdetails;
-- 8. Count of billdetails per product using window function
SELECT
  billdetail_id,
  product_id,
  quantity,
  COUNT(*) OVER (PARTITION BY product_id) AS CountPerProduct
FROM billing_product.billdetails;
-- 9. Overall sum and average price of products
SELECT
  product_id,
  price,
  SUM(price) OVER () AS TotalPriceSum,
  AVG(price) OVER () AS AvgPriceAll
FROM billing_product.products;
-- 10. Count of bills per month using window
SELECT
  bill_id,
  bill_date,
  COUNT(*) OVER (
    PARTITION BY YEAR(bill_date), MONTH(bill_date)
  ) AS BillsPerMonth
FROM billing_product.bill;
```

## ROW_NUMBER()
```sql
-- 1. Row number of bills ordered by bill_date
SELECT
  bill_id,
  bill_date,
  ROW_NUMBER() OVER (ORDER BY bill_date) AS RowNumByDate
FROM billing_product.bill;
-- 2. Row number per customer ordered by bill_date
SELECT
  bill_id,
  customer_id,
  bill_date,
  ROW_NUMBER() OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
  ) AS RowNumPerCustomer
FROM billing_product.bill;
-- 3. Row number of products ordered by price desc
SELECT
  product_id,
  product_name,
  price,
  ROW_NUMBER() OVER (ORDER BY price DESC) AS RowNumByPriceDesc
FROM billing_product.products;
-- 4. Row number per bill for billdetails by line_total desc
SELECT
  billdetail_id,
  bill_id,
  line_total,
  ROW_NUMBER() OVER (
    PARTITION BY bill_id
    ORDER BY line_total DESC
  ) AS RowNumDtlByValue
FROM billing_product.billdetails;
-- 5. Sequential row numbers for billdetails
SELECT
  billdetail_id,
  product_id,
  ROW_NUMBER() OVER (ORDER BY billdetail_id) AS SequentialNum
FROM billing_product.billdetails;
-- 6. Row number of customers by name
SELECT
  customer_id,
  customer_name,
  ROW_NUMBER() OVER (ORDER BY customer_name) AS CustRowNum
FROM billing_product.customers;
-- 7. Row number partitioned by month of bill_date
SELECT
  bill_id,
  bill_date,
  ROW_NUMBER() OVER (
    PARTITION BY YEAR(bill_date), MONTH(bill_date)
    ORDER BY bill_date
  ) AS RowNumByMonth
FROM billing_product.bill;
-- 8. Row number of line items overall by line_total
SELECT
  billdetail_id,
  line_total,
  ROW_NUMBER() OVER (ORDER BY line_total DESC) AS RowNumByLineTotal
FROM billing_product.billdetails;
-- 9. Row number per product partition by billdetails ordered by quantity
SELECT
  billdetail_id,
  product_id,
  quantity,
  ROW_NUMBER() OVER (
    PARTITION BY product_id
    ORDER BY quantity DESC
  ) AS RowNumQtyPerProduct
FROM billing_product.billdetails;
-- 10. Row number for bills with highest total_amount first
SELECT
  bill_id,
  total_amount,
  ROW_NUMBER() OVER (ORDER BY total_amount DESC) AS RowNumByAmount
FROM billing_product.bill;
```

## RANK()
```sql
-- 1. Rank bills by total_amount desc
SELECT
  bill_id,
  total_amount,
  RANK() OVER (ORDER BY total_amount DESC) AS RankByAmount
FROM billing_product.bill;
-- 2. Rank products by price desc
SELECT
  product_id,
  price,
  RANK() OVER (ORDER BY price DESC) AS RankByPrice
FROM billing_product.products;
-- 3. Rank customers by number of bills
SELECT
  customer_id,
  COUNT(*) AS BillCount,
  RANK() OVER (
    ORDER BY COUNT(*) DESC
  ) AS RankByBillCount
FROM billing_product.bill
GROUP BY customer_id;
-- 4. Rank billdetails within each bill by line_total
SELECT
  billdetail_id,
  bill_id,
  line_total,
  RANK() OVER (
    PARTITION BY bill_id
    ORDER BY line_total DESC
  ) AS RankDtlByValue
FROM billing_product.billdetails;
-- 5. Rank bills per customer by total_amount
SELECT
  bill_id,
  customer_id,
  total_amount,
  RANK() OVER (
    PARTITION BY customer_id
    ORDER BY total_amount DESC
  ) AS RankByCustAmt
FROM billing_product.bill;
-- 6. Rank products by total quantity sold
SELECT
  product_id,
  SUM(quantity) AS TotalQty,
  RANK() OVER (
    ORDER BY SUM(quantity) DESC
  ) AS RankByQty
FROM billing_product.billdetails
GROUP BY product_id;
-- 7. Rank months by total sales
SELECT
  YEAR(bill_date) AS Yr,
  MONTH(bill_date) AS Mon,
  SUM(total_amount) AS MonthSales,
  RANK() OVER (
    ORDER BY SUM(total_amount) DESC
  ) AS RankMonthSales
FROM billing_product.bill
GROUP BY YEAR(bill_date), MONTH(bill_date);
-- 8. Rank line items globally by line_total
SELECT
  billdetail_id,
  line_total,
  RANK() OVER (ORDER BY line_total DESC) AS RankGlobalDtl
FROM billing_product.billdetails;
-- 9. Rank customers by average bill amount
SELECT
  customer_id,
  AVG(total_amount) AS AvgAmt,
  RANK() OVER (
    ORDER BY AVG(total_amount) DESC
  ) AS RankByAvgAmt
FROM billing_product.bill
GROUP BY customer_id;
-- 10. Rank products by average line_total
SELECT
  product_id,
  AVG(line_total) AS AvgLine,
  RANK() OVER (
    ORDER BY AVG(line_total) DESC
  ) AS RankByAvgLine
FROM billing_product.billdetails
GROUP BY product_id;
```

## DENSE_RANK()
```sql
-- 1. Dense rank bills by total_amount desc
SELECT
  bill_id,
  total_amount,
  DENSE_RANK() OVER (ORDER BY total_amount DESC) AS DenseRankAmt
FROM billing_product.bill;
-- 2. Dense rank products by price desc
SELECT
  product_id,
  price,
  DENSE_RANK() OVER (ORDER BY price DESC) AS DenseRankPrice
FROM billing_product.products;
-- 3. Dense rank customers by bill count
SELECT
  customer_id,
  COUNT(*) AS BillCount,
  DENSE_RANK() OVER (
    ORDER BY COUNT(*) DESC
  ) AS DenseRankBillCnt
FROM billing_product.bill
GROUP BY customer_id;
-- 4. Dense rank billdetails within bill
SELECT
  billdetail_id,
  bill_id,
  line_total,
  DENSE_RANK() OVER (
    PARTITION BY bill_id
    ORDER BY line_total DESC
  ) AS DenseRankDtl
FROM billing_product.billdetails;
-- 5. Dense rank products by sales quantity
SELECT
  product_id,
  SUM(quantity) AS TotalQty,
  DENSE_RANK() OVER (
    ORDER BY SUM(quantity) DESC
  ) AS DenseRankQty
FROM billing_product.billdetails
GROUP BY product_id;
-- 6. Dense rank months by sales
SELECT
  YEAR(bill_date) AS Yr,
  MONTH(bill_date) AS Mon,
  SUM(total_amount) AS Sales,
  DENSE_RANK() OVER (
    ORDER BY SUM(total_amount) DESC
  ) AS DenseRankMonth
FROM billing_product.bill
GROUP BY YEAR(bill_date), MONTH(bill_date);
-- 7. Dense rank customers by average bill
SELECT
  customer_id,
  AVG(total_amount) AS AvgAmt,
  DENSE_RANK() OVER (
    ORDER BY AVG(total_amount) DESC
  ) AS DenseRankAvg
FROM billing_product.bill
GROUP BY customer_id;
-- 8. Dense rank line items by value
SELECT
  billdetail_id,
  line_total,
  DENSE_RANK() OVER (ORDER BY line_total DESC) AS DenseRankLine
FROM billing_product.billdetails;
-- 9. Dense rank bills by date (earliest first)
SELECT
  bill_id,
  bill_date,
  DENSE_RANK() OVER (ORDER BY bill_date) AS DenseRankDate
FROM billing_product.bill;
-- 10. Dense rank products by length of name
SELECT
  product_id,
  LEN(product_name) AS NameLen,
  DENSE_RANK() OVER (
    ORDER BY LEN(product_name) DESC
  ) AS DenseRankNameLen
FROM billing_product.products;
```

## NTILE(n)
```sql
-- 1. Divide bills into 4 quartiles by total_amount
SELECT
  bill_id,
  total_amount,
  NTILE(4) OVER (ORDER BY total_amount) AS Quartile
FROM billing_product.bill;
-- 2. Divide customers into 3 buckets by total bills
SELECT
  customer_id,
  COUNT(*) AS BillCount,
  NTILE(3) OVER (ORDER BY COUNT(*) DESC) AS CustomerBucket
FROM billing_product.bill
GROUP BY customer_id;
-- 3. Divide products into 5 buckets by price
SELECT
  product_id,
  price,
  NTILE(5) OVER (ORDER BY price) AS PriceBucket
FROM billing_product.products;
-- 4. Divide billdetails into 4 buckets by line_total
SELECT
  billdetail_id,
  line_total,
  NTILE(4) OVER (ORDER BY line_total) AS DtlBucket
FROM billing_product.billdetails;
-- 5. Divide bills into 2 halves by date
SELECT
  bill_id,
  bill_date,
  NTILE(2) OVER (ORDER BY bill_date) AS HalvesByDate
FROM billing_product.bill;
-- 6. Divide customers into 4 segments by average bill
SELECT
  customer_id,
  AVG(total_amount) AS AvgAmt,
  NTILE(4) OVER (ORDER BY AVG(total_amount)) AS SegByAvg
FROM billing_product.bill
GROUP BY customer_id;
-- 7. Divide products into 3 segments by quantity sold
SELECT
  product_id,
  SUM(quantity) AS TotalQty,
  NTILE(3) OVER (ORDER BY SUM(quantity)) AS SegQty
FROM billing_product.billdetails
GROUP BY product_id;
-- 8. Divide months into 4 quarters by sales
SELECT
  YEAR(bill_date) AS Yr,
  MONTH(bill_date) AS Mon,
  SUM(total_amount) AS Sales,
  NTILE(4) OVER (ORDER BY SUM(total_amount)) AS SalesQuartile
FROM billing_product.bill
GROUP BY YEAR(bill_date), MONTH(bill_date);
-- 9. Divide line items into 10 deciles by quantity
SELECT
  billdetail_id,
  quantity,
  NTILE(10) OVER (ORDER BY quantity) AS DecileQty
FROM billing_product.billdetails;
-- 10. Divide bills into buckets by customer count
SELECT
  b.bill_id,
  COUNT(bd.billdetail_id) AS ItemCount,
  NTILE(3) OVER (ORDER BY COUNT(bd.billdetail_id)) AS BucketByItems
FROM billing_product.bill AS b
JOIN billing_product.billdetails AS bd ON b.bill_id = bd.bill_id
GROUP BY b.bill_id;
```

## LAG()
```sql
-- 1. Previous bill amount for each bill ordered by date
SELECT
  bill_id,
  bill_date,
  total_amount,
  LAG(total_amount) OVER (ORDER BY bill_date) AS PrevBillAmt
FROM billing_product.bill;
-- 2. Previous bill date per customer
SELECT
  bill_id,
  customer_id,
  bill_date,
  LAG(bill_date) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
  ) AS PrevBillDate
FROM billing_product.bill;
-- 3. Previous line_total per bill
SELECT
  billdetail_id,
  bill_id,
  line_total,
  LAG(line_total) OVER (
    PARTITION BY bill_id
    ORDER BY billdetail_id
  ) AS PrevLineTotal
FROM billing_product.billdetails;
-- 4. Previous quantity per product
SELECT
  billdetail_id,
  product_id,
  quantity,
  LAG(quantity) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
  ) AS PrevQty
FROM billing_product.billdetails;
-- 5. Difference from previous bill amount
SELECT
  bill_id,
  total_amount,
  total_amount - LAG(total_amount) OVER (ORDER BY bill_date) AS DiffPrevAmt
FROM billing_product.bill;
-- 6. Previous bill_id
SELECT
  bill_id,
  LAG(bill_id) OVER (ORDER BY bill_date) AS PrevBillID
FROM billing_product.bill;
-- 7. Previous product price
SELECT
  product_id,
  price,
  LAG(price) OVER (ORDER BY price) AS PrevPrice
FROM billing_product.products;
-- 8. Previous customer's contact_info
SELECT
  customer_id,
  contact_info,
  LAG(contact_info) OVER (ORDER BY customer_id) AS PrevContact
FROM billing_product.customers;
-- 9. Previous quantity in all details
SELECT
  billdetail_id,
  quantity,
  LAG(quantity) OVER (ORDER BY billdetail_id) AS PrevQuantity
FROM billing_product.billdetails;
-- 10. Previous line_total per product partition
SELECT
  billdetail_id,
  line_total,
  LAG(line_total) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
  ) AS PrevDtlByProduct
FROM billing_product.billdetails;
```

## LEAD()
```sql
-- 1. Next bill amount for each bill ordered by date
SELECT
  bill_id,
  bill_date,
  total_amount,
  LEAD(total_amount) OVER (ORDER BY bill_date) AS NextBillAmt
FROM billing_product.bill;

-- 2. Next bill date per customer
SELECT
  bill_id,
  customer_id,
  bill_date,
  LEAD(bill_date) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
  ) AS NextBillDate
FROM billing_product.bill;

-- 3. Next line_total per bill
SELECT
  billdetail_id,
  bill_id,
  line_total,
  LEAD(line_total) OVER (
    PARTITION BY bill_id
    ORDER BY billdetail_id
  ) AS NextLineTotal
FROM billing_product.billdetails;

-- 4. Next quantity per product
SELECT
  billdetail_id,
  product_id,
  quantity,
  LEAD(quantity) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
  ) AS NextQty
FROM billing_product.billdetails;

-- 5. Difference to next bill amount
SELECT
  bill_id,
  total_amount,
  LEAD(total_amount) OVER (ORDER BY bill_date) - total_amount AS DiffNextAmt
FROM billing_product.bill;

-- 6. Next bill_id in sequence
SELECT
  bill_id,
  LEAD(bill_id) OVER (ORDER BY bill_date) AS NextBillID
FROM billing_product.bill;

-- 7. Next product price ordered by price
SELECT
  product_id,
  price,
  LEAD(price) OVER (ORDER BY price) AS NextPrice
FROM billing_product.products;

-- 8. Next customer's contact_info alphabetically
SELECT
  customer_id,
  customer_name,
  LEAD(contact_info) OVER (ORDER BY customer_name) AS NextContact
FROM billing_product.customers;

-- 9. Next quantity overall
SELECT
  billdetail_id,
  quantity,
  LEAD(quantity) OVER (ORDER BY billdetail_id) AS NextQuantity
FROM billing_product.billdetails;

-- 10. Next line_total partitioned by product
SELECT
  billdetail_id,
  product_id,
  line_total,
  LEAD(line_total) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
  ) AS NextDtlByProduct
FROM billing_product.billdetails;
```

## FIRST_VALUE()
```sql
-- 1. First bill_date per customer
SELECT
  bill_id,
  customer_id,
  bill_date,
  FIRST_VALUE(bill_date) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
  ) AS FirstBillDate
FROM billing_product.bill;

-- 2. First total_amount per customer
SELECT
  bill_id,
  customer_id,
  total_amount,
  FIRST_VALUE(total_amount) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
  ) AS FirstBillAmt
FROM billing_product.bill;

-- 3. First line_total per bill
SELECT
  billdetail_id,
  bill_id,
  line_total,
  FIRST_VALUE(line_total) OVER (
    PARTITION BY bill_id
    ORDER BY billdetail_id
  ) AS FirstLineTotal
FROM billing_product.billdetails;

-- 4. First quantity per product
SELECT
  billdetail_id,
  product_id,
  quantity,
  FIRST_VALUE(quantity) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
  ) AS FirstQty
FROM billing_product.billdetails;

-- 5. First product_name alphabetically
SELECT
  product_id,
  product_name,
  FIRST_VALUE(product_name) OVER (ORDER BY product_name) AS FirstNameAlpha
FROM billing_product.products;

-- 6. First billdetail_id per bill
SELECT
  billdetail_id,
  bill_id,
  FIRST_VALUE(billdetail_id) OVER (
    PARTITION BY bill_id
    ORDER BY billdetail_id
  ) AS FirstDtlID
FROM billing_product.billdetails;

-- 7. First product price in ascending order
SELECT
  product_id,
  price,
  FIRST_VALUE(price) OVER (ORDER BY price) AS FirstPriceLow
FROM billing_product.products;

-- 8. First customer contact_info alphabetically
SELECT
  customer_id,
  contact_info,
  FIRST_VALUE(contact_info) OVER (ORDER BY contact_info) AS FirstContactAlpha
FROM billing_product.customers;

-- 9. First bill_id per month
SELECT
  bill_id,
  bill_date,
  FIRST_VALUE(bill_id) OVER (
    PARTITION BY YEAR(bill_date), MONTH(bill_date)
    ORDER BY bill_date
  ) AS FirstBillOfMonth
FROM billing_product.bill;

-- 10. First line_total overall
SELECT
  billdetail_id,
  line_total,
  FIRST_VALUE(line_total) OVER (ORDER BY line_total) AS FirstLineOverall
FROM billing_product.billdetails;
```

## LAST_VALUE()
```sql
-- 1. Last bill_date per customer
SELECT
  bill_id,
  customer_id,
  bill_date,
  LAST_VALUE(bill_date) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastBillDate
FROM billing_product.bill;

-- 2. Last total_amount per customer
SELECT
  bill_id,
  customer_id,
  total_amount,
  LAST_VALUE(total_amount) OVER (
    PARTITION BY customer_id
    ORDER BY bill_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastBillAmt
FROM billing_product.bill;

-- 3. Last line_total per bill
SELECT
  billdetail_id,
  bill_id,
  line_total,
  LAST_VALUE(line_total) OVER (
    PARTITION BY bill_id
    ORDER BY billdetail_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastLineTotal
FROM billing_product.billdetails;

-- 4. Last quantity per product
SELECT
  billdetail_id,
  product_id,
  quantity,
  LAST_VALUE(quantity) OVER (
    PARTITION BY product_id
    ORDER BY billdetail_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastQty
FROM billing_product.billdetails;

-- 5. Last product_name alphabetically
SELECT
  product_id,
  product_name,
  LAST_VALUE(product_name) OVER (
    ORDER BY product_name
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastNameAlpha
FROM billing_product.products;

-- 6. Last billdetail_id per bill
SELECT
  billdetail_id,
  bill_id,
  LAST_VALUE(billdetail_id) OVER (
    PARTITION BY bill_id
    ORDER BY billdetail_id
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastDtlID
FROM billing_product.billdetails;

-- 7. Last product price in ascending order
SELECT
  product_id,
  price,
  LAST_VALUE(price) OVER (
    ORDER BY price
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastPriceHigh
FROM billing_product.products;

-- 8. Last customer contact_info alphabetically
SELECT
  customer_id,
  contact_info,
  LAST_VALUE(contact_info) OVER (
    ORDER BY contact_info
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastContactAlpha
FROM billing_product.customers;

-- 9. Last bill_id per month
SELECT
  bill_id,
  bill_date,
  LAST_VALUE(bill_id) OVER (
    PARTITION BY YEAR(bill_date), MONTH(bill_date)
    ORDER BY bill_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastBillOfMonth
FROM billing_product.bill;

-- 10. Last line_total overall
SELECT
  billdetail_id,
  line_total,
  LAST_VALUE(line_total) OVER (
    ORDER BY line_total
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS LastLineOverall
FROM billing_product.billdetails;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
