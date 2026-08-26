![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. Total number of bills per customer
WITH BillCount AS (
  SELECT customer_id,
         COUNT(*) AS num_bills
  FROM billing_product.bill
  GROUP BY customer_id
)
SELECT * FROM BillCount;

-- 2. Total line items per bill
WITH ItemsPerBill AS (
  SELECT bill_id,
         COUNT(*) AS item_count
  FROM billing_product.billdetails
  GROUP BY bill_id
)
SELECT * FROM ItemsPerBill;

-- 3. Average bill amount per customer
WITH AvgBillAmt AS (
  SELECT customer_id,
         AVG(total_amount) AS avg_amount
  FROM billing_product.bill
  GROUP BY customer_id
)
SELECT * FROM AvgBillAmt;

-- 4. Highest single line_total per product
WITH MaxLinePerProd AS (
  SELECT product_id,
         MAX(line_total) AS max_line
  FROM billing_product.billdetails
  GROUP BY product_id
)
SELECT * FROM MaxLinePerProd;

-- 5. Customers with no bills
WITH C AS (
  SELECT customer_id FROM billing_product.customers
),
B AS (
  SELECT DISTINCT customer_id FROM billing_product.bill
)
SELECT C.customer_id
FROM C
LEFT JOIN B ON C.customer_id = B.customer_id
WHERE B.customer_id IS NULL;

-- 6. Products never sold
WITH P AS (
  SELECT product_id FROM billing_product.products
),
S AS (
  SELECT DISTINCT product_id FROM billing_product.billdetails
)
SELECT P.product_id
FROM P
LEFT JOIN S ON P.product_id = S.product_id
WHERE S.product_id IS NULL;

-- 7. Bill summary (count & sum) for bills in Q1 2023
WITH Q1Bills AS (
  SELECT bill_id, total_amount
  FROM billing_product.bill
  WHERE bill_date BETWEEN '2023-01-01' AND '2023-03-31'
)
SELECT
  COUNT(*) AS count_q1,
  SUM(total_amount) AS sum_q1
FROM Q1Bills;

-- 8. Distinct billing months
WITH Months AS (
  SELECT DISTINCT YEAR(bill_date) AS yr,
                  MONTH(bill_date) AS mon
  FROM billing_product.bill
)
SELECT * FROM Months;

-- 9. Join bill and items count via CTE
WITH Items AS (
  SELECT bill_id, COUNT(*) AS cnt
  FROM billing_product.billdetails
  GROUP BY bill_id
)
SELECT b.bill_id, b.total_amount, i.cnt AS items_count
FROM billing_product.bill b
JOIN Items i ON b.bill_id = i.bill_id;

-- 10. Customers’ spend & items via CTE
WITH Spend AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM billing_product.bill GROUP BY customer_id
), 
Items AS (
  SELECT b.customer_id, COUNT(*) AS total_items
  FROM billing_product.billdetails d
  JOIN billing_product.bill b ON b.bill_id = d.bill_id
  GROUP BY b.customer_id
)
SELECT s.customer_id, s.total_spent, i.total_items
FROM Spend s
JOIN Items i ON s.customer_id = i.customer_id;
```

## Using Multiple CTEs
```sql
-- 1. Compare customer spend vs. average
WITH CustSpend AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM billing_product.bill GROUP BY customer_id
),
AvgSpend AS (
  SELECT AVG(total_spent) AS avg_spent FROM CustSpend
)
SELECT c.customer_id, c.total_spent,
       CASE WHEN c.total_spent > a.avg_spent THEN 'Above Avg' ELSE 'Below Avg' END AS status
FROM CustSpend c CROSS JOIN AvgSpend a;

-- 2. Bills & details summary together
WITH BillSum AS (
  SELECT bill_id, SUM(line_total) AS sum_lines
  FROM billing_product.billdetails GROUP BY bill_id
),
BillCnt AS (
  SELECT bill_id, COUNT(*) AS cnt_items
  FROM billing_product.billdetails GROUP BY bill_id
)
SELECT b.bill_id, bs.sum_lines, bc.cnt_items
FROM billing_product.bill b
LEFT JOIN BillSum bs ON b.bill_id = bs.bill_id
LEFT JOIN BillCnt bc ON b.bill_id = bc.bill_id;

-- 3. Top 5 customers by spend and their bill count
WITH CustSpend AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM billing_product.bill GROUP BY customer_id
),
Top5Cust AS (
  SELECT TOP 5 customer_id FROM CustSpend ORDER BY total_spent DESC
),
CustBills AS (
  SELECT customer_id, COUNT(*) AS num_bills
  FROM billing_product.bill GROUP BY customer_id
)
SELECT t.customer_id, cs.total_spent, cb.num_bills
FROM Top5Cust t
JOIN CustSpend cs ON cs.customer_id = t.customer_id
JOIN CustBills cb ON cb.customer_id = t.customer_id;

-- 4. Monthly sales and item count
WITH MonthlySales AS (
  SELECT YEAR(bill_date) AS yr, MONTH(bill_date) AS mon, SUM(total_amount) AS sales
  FROM billing_product.bill GROUP BY YEAR(bill_date), MONTH(bill_date)
),
MonthlyItems AS (
  SELECT YEAR(b.bill_date) AS yr, MONTH(b.bill_date) AS mon, COUNT(*) AS items
  FROM billing_product.billdetails d
  JOIN billing_product.bill b ON b.bill_id = d.bill_id
  GROUP BY YEAR(b.bill_date), MONTH(b.bill_date)
)
SELECT m.yr, m.mon, m.sales, mi.items
FROM MonthlySales m
LEFT JOIN MonthlyItems mi ON m.yr = mi.yr AND m.mon = mi.mon;

-- 5. Products sold vs. unsold
WITH Sold AS (
  SELECT DISTINCT product_id FROM billing_product.billdetails
),
AllProd AS (
  SELECT product_id FROM billing_product.products
)
SELECT a.product_id,
       CASE WHEN s.product_id IS NOT NULL THEN 'Sold' ELSE 'Unsold' END AS status
FROM AllProd a
LEFT JOIN Sold s ON a.product_id = s.product_id;

-- 6. Customer last bill date & next due via CTEs
WITH LastBill AS (
  SELECT customer_id, MAX(bill_date) AS last_dt
  FROM billing_product.bill GROUP BY customer_id
),
NextDue AS (
  SELECT customer_id, DATEADD(day,30,last_dt) AS next_due
  FROM LastBill
)
SELECT l.customer_id, l.last_dt, n.next_due
FROM LastBill l JOIN NextDue n ON l.customer_id = n.customer_id;

-- 7. Bill detail enriched with product price
WITH ProdPrice AS (
  SELECT product_id, price FROM billing_product.products
),
Detail AS (
  SELECT d.billdetail_id, d.bill_id, d.product_id, d.quantity, d.line_total
  FROM billing_product.billdetails d
)
SELECT det.*, pp.price
FROM Detail det
JOIN ProdPrice pp ON det.product_id = pp.product_id;

-- 8. Customers and whether they are VIP (spend>2000)
WITH CustSpend AS (
  SELECT customer_id, SUM(total_amount) AS total_spent
  FROM billing_product.bill GROUP BY customer_id
),
VIP AS (
  SELECT customer_id, CASE WHEN total_spent>2000 THEN 1 ELSE 0 END AS is_vip
  FROM CustSpend
)
SELECT c.customer_id, c.customer_name, v.is_vip
FROM billing_product.customers c
LEFT JOIN VIP v ON c.customer_id = v.customer_id;

-- 9. Bill ranking by total_amount and detail count
WITH BillAmt AS (
  SELECT bill_id, total_amount FROM billing_product.bill
),
BillCnt AS (
  SELECT bill_id, COUNT(*) AS cnt FROM billing_product.billdetails GROUP BY bill_id
),
Ranked AS (
  SELECT a.bill_id, a.total_amount, c.cnt,
         RANK() OVER (ORDER BY a.total_amount DESC) AS amt_rank,
         RANK() OVER (ORDER BY c.cnt DESC) AS cnt_rank
  FROM BillAmt a JOIN BillCnt c ON a.bill_id=c.bill_id
)
SELECT * FROM Ranked;

-- 10. Customer  —  product purchase matrix via CTEs
WITH CustList AS (
  SELECT customer_id FROM billing_product.customers
),
ProdList AS (
  SELECT product_id FROM billing_product.products
),
Purch AS (
  SELECT DISTINCT b.customer_id, d.product_id
  FROM billing_product.billdetails d
  JOIN billing_product.bill b ON b.bill_id=d.bill_id
)
SELECT c.customer_id, p.product_id,
       CASE WHEN pu.product_id IS NOT NULL THEN 'Y' ELSE 'N' END AS purchased
FROM CustList c
CROSS JOIN ProdList p
LEFT JOIN Purch pu ON pu.customer_id=c.customer_id AND pu.product_id=p.product_id;
```

## Recursive CTEs
```sql
-- 1. Generate numbers 1 through 10
WITH Numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM Numbers WHERE n<10
)
SELECT * FROM Numbers;

-- 2. Calendar dates between two extremes
WITH DateRange AS (
  SELECT MIN(bill_date) AS dt FROM billing_product.bill
  UNION ALL
  SELECT DATEADD(day,1,dt) FROM DateRange WHERE dt < (SELECT MAX(bill_date) FROM billing_product.bill)
)
SELECT * FROM DateRange;

-- 3. First day of each month in 2023
WITH Months AS (
  SELECT CAST('2023-01-01' AS date) AS m
  UNION ALL
  SELECT DATEADD(month,1,m) FROM Months WHERE m<'2023-12-01'
)
SELECT m FROM Months;

-- 4. Fibonacci sequence first 10 values
WITH Fib AS (
  SELECT 1 AS a, 1 AS b, 1 AS idx
  UNION ALL
  SELECT b, a+b, idx+1 FROM Fib WHERE idx<10
)
SELECT idx, a AS fibonacci FROM Fib;

-- 5. Cumulative monthly sales via recursion
WITH Months AS (
  SELECT 1 AS mon, YEAR(MIN(bill_date)) AS yr FROM billing_product.bill
  UNION ALL
  SELECT mon+1, yr FROM Months WHERE mon<12
),
Sales AS (
  SELECT m.yr, m.mon,
         (SELECT SUM(total_amount) FROM billing_product.bill
          WHERE YEAR(bill_date)=m.yr AND MONTH(bill_date)=m.mon) AS monthly_sales
  FROM Months m
)
SELECT * FROM Sales;

-- 6. Generate invoice sequence IDs
WITH InvSeq AS (
  SELECT 1000 AS inv
  UNION ALL
  SELECT inv+1 FROM InvSeq WHERE inv<1010
)
SELECT * FROM InvSeq;

-- 7. List next 5 due dates per bill
WITH LastBill AS (
  SELECT bill_id, bill_date FROM billing_product.bill
),
Due AS (
  SELECT bill_id, bill_date AS due_date, 1 AS cycle FROM LastBill
  UNION ALL
  SELECT bill_id, DATEADD(day,30,due_date), cycle+1
  FROM Due WHERE cycle<5
)
SELECT * FROM Due ORDER BY bill_id, cycle;

-- 8. Years from oldest to current year
WITH Years AS (
  SELECT YEAR(MIN(bill_date)) AS yr FROM billing_product.bill
  UNION ALL
  SELECT yr+1 FROM Years WHERE yr<YEAR(GETDATE())
)
SELECT yr FROM Years;

-- 9. Build a running customer spend list
WITH Spend AS (
  SELECT customer_id, SUM(total_amount) AS amount
  FROM billing_product.bill GROUP BY customer_id
), 
Rec AS (
  SELECT customer_id, amount, 1 AS rn FROM Spend WHERE customer_id = (SELECT MIN(customer_id) FROM Spend)
  UNION ALL
  SELECT s.customer_id, s.amount, rn+1
  FROM Rec r
  JOIN Spend s ON s.customer_id = (
    SELECT MIN(customer_id) FROM Spend WHERE customer_id > r.customer_id
  )
)
SELECT * FROM Rec;

-- 10. Recursive product price depreciation (10% per year for 5 years)
WITH Dep0 AS (
  SELECT product_id, price, 0 AS year FROM billing_product.products
), DepN AS (
  SELECT product_id, price * POWER(0.9,year) AS dep_price, year
  FROM Dep0
  UNION ALL
  SELECT product_id, price * POWER(0.9,year+1), year+1
  FROM DepN WHERE year<4
)
SELECT * FROM DepN ORDER BY product_id, year;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
