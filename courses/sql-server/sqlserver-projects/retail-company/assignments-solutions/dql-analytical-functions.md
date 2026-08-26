![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @StartJuly date = '2025-07-01';
DECLARE @EndJuly   date = '2025-07-31';
```

## Aggregate Functions
```sql
-- 1. Running total revenue per CUSTOMER in July 2025 (by OrderDate)
WITH July AS (
  SELECT CustomerID, OrderDate, TotalAmount
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT CustomerID, OrderDate, TotalAmount,
       SUM(TotalAmount) OVER (PARTITION BY CustomerID
                              ORDER BY OrderDate, (SELECT 1)
                              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal
FROM July
ORDER BY CustomerID, OrderDate;

-- 2. Running daily sales (all customers) across 2025
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE DATEPART(YEAR, OrderDate) = 2025
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       SUM(DaySales) OVER (ORDER BY OrderDate
                           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS CumSalesYTD
FROM Daily
ORDER BY OrderDate;

-- 3. 7-day moving average of daily sales in July 2025 window
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       AVG(CAST(DaySales AS decimal(18,2))) OVER (
         ORDER BY OrderDate
         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ) AS MA7
FROM Daily
ORDER BY OrderDate;

-- 4. Customer share of July revenue (% of total)
WITH CustSum AS (
  SELECT CustomerID, SUM(TotalAmount) AS CustJulyAmt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT CustomerID, CustJulyAmt,
       CustJulyAmt * 100.0 / NULLIF(SUM(CustJulyAmt) OVER (), 0) AS PctOfJuly
FROM CustSum
ORDER BY CustJulyAmt DESC;

-- 5. Category share of July line revenue
WITH CatSum AS (
  SELECT p.CategoryID, SUM(d.LineTotal) AS CatJulyAmt
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID
)
SELECT CategoryID, CatJulyAmt,
       CatJulyAmt * 100.0 / NULLIF(SUM(CatJulyAmt) OVER (), 0) AS PctOfJuly
FROM CatSum
ORDER BY CatJulyAmt DESC;

-- 6. Lines per order as a window column (no GROUP BY)
SELECT d.SalesOrderID, d.OrderDate, d.SalesOrderDetailID,
       COUNT(*) OVER (PARTITION BY d.SalesOrderID, d.OrderDate) AS LinesInOrder
FROM retail_company.SalesOrderDetail d
ORDER BY d.OrderDate DESC, d.SalesOrderID DESC, d.SalesOrderDetailID;

-- 7. Product UnitPrice: avg, min, max within CATEGORY as window columns
SELECT p.ProductID, p.CategoryID, p.Name, p.UnitPrice,
       AVG(p.UnitPrice) OVER (PARTITION BY p.CategoryID) AS AvgInCat,
       MIN(p.UnitPrice) OVER (PARTITION BY p.CategoryID) AS MinInCat,
       MAX(p.UnitPrice) OVER (PARTITION BY p.CategoryID) AS MaxInCat
FROM retail_company.Product p
ORDER BY p.CategoryID, p.UnitPrice DESC;

-- 8. Supplier running PO amount over time
WITH PO AS (
  SELECT SupplierID, OrderDate, TotalAmount
  FROM retail_company.PurchaseOrder
)
SELECT SupplierID, OrderDate, TotalAmount,
       SUM(TotalAmount) OVER (PARTITION BY SupplierID
                              ORDER BY OrderDate
                              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningPO
FROM PO
ORDER BY SupplierID, OrderDate;

-- 9. Daily order count with running count across July
WITH DailyCnt AS (
  SELECT OrderDate, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, Cnt,
       SUM(Cnt) OVER (ORDER BY OrderDate
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningCount
FROM DailyCnt
ORDER BY OrderDate;

-- 10. Average line quantity per CUSTOMER (window on detail rows)
SELECT so.CustomerID, d.SalesOrderID, d.OrderDate, d.Quantity,
       AVG(CAST(d.Quantity AS decimal(10,2))) OVER (PARTITION BY so.CustomerID) AS AvgQtyPerCustomer
FROM retail_company.SalesOrderDetail d
JOIN retail_company.SalesOrder so
  ON so.SalesOrderID = d.SalesOrderID AND so.OrderDate = d.OrderDate
ORDER BY so.CustomerID, d.OrderDate, d.SalesOrderID;

-- 11. Daily orders count & share of week (window by ISO week)
WITH Orders AS (
  SELECT OrderDate, COUNT(*) AS DayCnt,
         DATEPART(isowk, OrderDate) AS IsoWk, DATEPART(year, OrderDate) AS Yr
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT Yr, IsoWk, OrderDate, DayCnt,
       DayCnt * 100.0 / NULLIF(SUM(DayCnt) OVER (PARTITION BY Yr, IsoWk), 0) AS PctOfWeek
FROM Orders
ORDER BY Yr, IsoWk, OrderDate;

-- 12. Product UnitPrice z-score within category
SELECT p.ProductID, p.CategoryID, p.UnitPrice,
       (p.UnitPrice - AVG(p.UnitPrice) OVER (PARTITION BY p.CategoryID))
       / NULLIF(STDEV(p.UnitPrice) OVER (PARTITION BY p.CategoryID), 0) AS ZScoreInCat
FROM retail_company.Product p
ORDER BY p.CategoryID, ZScoreInCat DESC;
```

## ROW_NUMBER()
```sql
-- 1. Latest order per CUSTOMER (pick rn=1)
WITH CLast AS (
  SELECT so.CustomerID, so.SalesOrderID, so.OrderDate,
         ROW_NUMBER() OVER (PARTITION BY so.CustomerID
                            ORDER BY so.OrderDate DESC, so.SalesOrderID DESC) AS rn
  FROM retail_company.SalesOrder so
)
SELECT *
FROM CLast
WHERE rn = 1
ORDER BY CustomerID;

-- 2. Top-3 most expensive products per CATEGORY
WITH Ranked AS (
  SELECT p.CategoryID, p.ProductID, p.Name, p.UnitPrice,
         ROW_NUMBER() OVER (PARTITION BY p.CategoryID ORDER BY p.UnitPrice DESC, p.ProductID) AS rn
  FROM retail_company.Product p
)
SELECT *
FROM Ranked
WHERE rn <= 3
ORDER BY CategoryID, rn;

-- 3. First order of each DAY (by SalesOrderID)
WITH DFirst AS (
  SELECT SalesOrderID, OrderDate,
         ROW_NUMBER() OVER (PARTITION BY OrderDate ORDER BY SalesOrderID) AS rn
  FROM retail_company.SalesOrder
)
SELECT *
FROM DFirst
WHERE rn = 1
ORDER BY OrderDate;

-- 4. Top-5 revenue orders per DAY
WITH DayOrders AS (
  SELECT SalesOrderID, OrderDate, TotalAmount,
         ROW_NUMBER() OVER (PARTITION BY OrderDate ORDER BY TotalAmount DESC, SalesOrderID DESC) AS rn
  FROM retail_company.SalesOrder
)
SELECT *
FROM DayOrders
WHERE rn <= 5
ORDER BY OrderDate, rn;

-- 5. Deduplicate customers by Email, keep the earliest CustomerID
WITH Dedup AS (
  SELECT CustomerID, Email,
         ROW_NUMBER() OVER (PARTITION BY Email ORDER BY CustomerID) AS rn
  FROM retail_company.Customer
  WHERE Email IS NOT NULL
)
SELECT *
FROM Dedup
WHERE rn = 1
ORDER BY Email;

-- 6. Most recent inventory per PRODUCT × WAREHOUSE on/before 2025-07-31
WITH Snap AS (
  SELECT InventoryID, ProductID, WarehouseID, StockDate,
         ROW_NUMBER() OVER (PARTITION BY ProductID, WarehouseID
                            ORDER BY StockDate DESC, InventoryID DESC) AS rn
  FROM retail_company.Inventory
  WHERE StockDate <= '2025-07-31'
)
SELECT *
FROM Snap
WHERE rn = 1
ORDER BY ProductID, WarehouseID;

-- 7. Top-10 customers by order COUNT in July 2025
WITH Counts AS (
  SELECT CustomerID, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
),
Ranked AS (
  SELECT CustomerID, Cnt,
         ROW_NUMBER() OVER (ORDER BY Cnt DESC, CustomerID) AS rn
  FROM Counts
)
SELECT *
FROM Ranked
WHERE rn <= 10
ORDER BY rn;

-- 8. First PO per SUPPLIER in July 2025
WITH FirstPO AS (
  SELECT SupplierID, PurchaseOrderID, OrderDate,
         ROW_NUMBER() OVER (PARTITION BY SupplierID ORDER BY OrderDate, PurchaseOrderID) AS rn
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT *
FROM FirstPO
WHERE rn = 1
ORDER BY SupplierID;

-- 9. By CATEGORY: rank products by July quantity sold (top-3)
WITH Sums AS (
  SELECT p.CategoryID, d.ProductID, SUM(d.Quantity) AS Qty
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID, d.ProductID
),
R AS (
  SELECT CategoryID, ProductID, Qty,
         ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY Qty DESC, ProductID) AS rn
  FROM Sums
)
SELECT *
FROM R
WHERE rn <= 3
ORDER BY CategoryID, rn;

-- 10. Sample every 2nd order per CUSTOMER (rn % 2 = 1)
WITH Seq AS (
  SELECT CustomerID, SalesOrderID, OrderDate,
         ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS rn
  FROM retail_company.SalesOrder
)
SELECT CustomerID, SalesOrderID, OrderDate
FROM Seq
WHERE rn % 2 = 1
ORDER BY CustomerID, rn;

-- 11. Sequence lines within each ORDER (by ProductID)
SELECT d.SalesOrderID, d.OrderDate, d.SalesOrderDetailID, d.ProductID,
       ROW_NUMBER() OVER (PARTITION BY d.SalesOrderID, d.OrderDate
                          ORDER BY d.ProductID, d.SalesOrderDetailID) AS LineSeq
FROM retail_company.SalesOrderDetail d
ORDER BY d.OrderDate DESC, d.SalesOrderID DESC, LineSeq;

-- 12. Global sequence of orders by OrderDate then ID
SELECT SalesOrderID, OrderDate,
       ROW_NUMBER() OVER (ORDER BY OrderDate, SalesOrderID) AS GlobalSeq
FROM retail_company.SalesOrder
ORDER BY GlobalSeq;
```

## RANK()
```sql
-- 1. Rank customers by July 2025 revenue (ties share rank)
WITH CustSum AS (
  SELECT CustomerID, SUM(TotalAmount) AS Amt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT CustomerID, Amt,
       RANK() OVER (ORDER BY Amt DESC) AS RankJuly
FROM CustSum
ORDER BY RankJuly;

-- 2. Rank products by UnitPrice within CATEGORY
SELECT CategoryID, ProductID, Name, UnitPrice,
       RANK() OVER (PARTITION BY CategoryID ORDER BY UnitPrice DESC, ProductID) AS PriceRank
FROM retail_company.Product
ORDER BY CategoryID, PriceRank;

-- 3. Rank days in July by daily sales
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       RANK() OVER (ORDER BY DaySales DESC) AS SalesRank
FROM Daily
ORDER BY SalesRank;

-- 4. Rank suppliers by July PO amount
WITH S AS (
  SELECT SupplierID, SUM(TotalAmount) AS Amt
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SupplierID
)
SELECT SupplierID, Amt,
       RANK() OVER (ORDER BY Amt DESC) AS RankPO
FROM S
ORDER BY RankPO;

-- 5. Rank warehouses by on-hand (2025-07-31)
WITH W AS (
  SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY WarehouseID
)
SELECT WarehouseID, OnHand,
       RANK() OVER (ORDER BY OnHand DESC) AS WHRank
FROM W
ORDER BY WHRank;

-- 6. Rank categories by July revenue (from lines)
WITH C AS (
  SELECT p.CategoryID, SUM(d.LineTotal) AS Amt
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID
)
SELECT CategoryID, Amt,
       RANK() OVER (ORDER BY Amt DESC) AS CatRank
FROM C
ORDER BY CatRank;

-- 7. Global rank of products by UnitsInStock
SELECT ProductID, UnitsInStock,
       RANK() OVER (ORDER BY UnitsInStock DESC, ProductID) AS StockRank
FROM retail_company.Product
ORDER BY StockRank;

-- 8. Rank orders by line count (ties keep same rank)
WITH L AS (
  SELECT SalesOrderID, OrderDate, COUNT(*) AS Lines
  FROM retail_company.SalesOrderDetail
  GROUP BY SalesOrderID, OrderDate
)
SELECT SalesOrderID, OrderDate, Lines,
       RANK() OVER (ORDER BY Lines DESC, SalesOrderID DESC) AS LineRank
FROM L
ORDER BY LineRank;

-- 9. Rank customers by average order amount
WITH A AS (
  SELECT CustomerID, AVG(CAST(TotalAmount AS decimal(18,2))) AS AvgAmt
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
)
SELECT CustomerID, AvgAmt,
       RANK() OVER (ORDER BY AvgAmt DESC) AS AvgRank
FROM A
ORDER BY AvgRank;

-- 10. Rank products by total quantity SOLD overall
WITH Q AS (
  SELECT d.ProductID, SUM(d.Quantity) AS Qty
  FROM retail_company.SalesOrderDetail d
  GROUP BY d.ProductID
)
SELECT ProductID, Qty,
       RANK() OVER (ORDER BY Qty DESC, ProductID) AS QtyRank
FROM Q
ORDER BY QtyRank;

-- 11. Rank POs by amount within each SUPPLIER
SELECT SupplierID, PurchaseOrderID, TotalAmount,
       RANK() OVER (PARTITION BY SupplierID ORDER BY TotalAmount DESC, PurchaseOrderID DESC) AS RankInSupp
FROM retail_company.PurchaseOrder
ORDER BY SupplierID, RankInSupp;

-- 12. Rank months of 2025 by revenue
WITH M AS (
  SELECT DATEPART(MONTH, OrderDate) AS Mo, SUM(TotalAmount) AS Amt
  FROM retail_company.SalesOrder
  WHERE DATEPART(YEAR, OrderDate) = 2025
  GROUP BY DATEPART(MONTH, OrderDate)
)
SELECT Mo, Amt,
       RANK() OVER (ORDER BY Amt DESC) AS MonthRank
FROM M
ORDER BY MonthRank;
```

## DENSE_RANK()
```sql
-- 1. Dense-rank categories by number of products (ties without gaps)
WITH C AS (
  SELECT CategoryID, COUNT(*) AS Cnt
  FROM retail_company.Product
  GROUP BY CategoryID
)
SELECT CategoryID, Cnt,
       DENSE_RANK() OVER (ORDER BY Cnt DESC) AS DRank
FROM C
ORDER BY DRank;

-- 2. Dense-rank products by UnitPrice within CATEGORY
SELECT CategoryID, ProductID, UnitPrice,
       DENSE_RANK() OVER (PARTITION BY CategoryID ORDER BY UnitPrice DESC) AS DensePriceRank
FROM retail_company.Product
ORDER BY CategoryID, DensePriceRank;

-- 3. Dense-rank days by July daily sales
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       DENSE_RANK() OVER (ORDER BY DaySales DESC) AS DR
FROM Daily
ORDER BY DR;

-- 4. Dense-rank suppliers by PO count in July
WITH S AS (
  SELECT SupplierID, COUNT(*) AS Cnt
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SupplierID
)
SELECT SupplierID, Cnt,
       DENSE_RANK() OVER (ORDER BY Cnt DESC) AS DR
FROM S
ORDER BY DR;

-- 5. Dense-rank customers by total orders overall
WITH Cnt AS (
  SELECT CustomerID, COUNT(*) AS Orders
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
)
SELECT CustomerID, Orders,
       DENSE_RANK() OVER (ORDER BY Orders DESC) AS DR
FROM Cnt
ORDER BY DR;

-- 6. Dense-rank warehouses by total on-hand (2025-07-31)
WITH W AS (
  SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY WarehouseID
)
SELECT WarehouseID, OnHand,
       DENSE_RANK() OVER (ORDER BY OnHand DESC) AS DR
FROM W
ORDER BY DR;

-- 7. Dense-rank products by total July quantity sold within CATEGORY
WITH Q AS (
  SELECT p.CategoryID, d.ProductID, SUM(d.Quantity) AS Qty
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID, d.ProductID
)
SELECT CategoryID, ProductID, Qty,
       DENSE_RANK() OVER (PARTITION BY CategoryID ORDER BY Qty DESC) AS DR
FROM Q
ORDER BY CategoryID, DR;

-- 8. Dense-rank categories by average product price
WITH A AS (
  SELECT CategoryID, AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgPrice
  FROM retail_company.Product
  GROUP BY CategoryID
)
SELECT CategoryID, AvgPrice,
       DENSE_RANK() OVER (ORDER BY AvgPrice DESC) AS DR
FROM A
ORDER BY DR;

-- 9. Dense-rank order days by number of orders
WITH D AS (
  SELECT OrderDate, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  GROUP BY OrderDate
)
SELECT OrderDate, Cnt,
       DENSE_RANK() OVER (ORDER BY Cnt DESC) AS DR
FROM D
ORDER BY DR;

-- 10. Dense-rank products by UnitsInStock
SELECT ProductID, UnitsInStock,
       DENSE_RANK() OVER (ORDER BY UnitsInStock DESC) AS DR
FROM retail_company.Product
ORDER BY DR;

-- 11. Dense-rank suppliers by July PO amount
WITH S AS (
  SELECT SupplierID, SUM(TotalAmount) AS Amt
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SupplierID
)
SELECT SupplierID, Amt,
       DENSE_RANK() OVER (ORDER BY Amt DESC) AS DR
FROM S
ORDER BY DR;

-- 12. Dense-rank customers by average order amount
WITH A AS (
  SELECT CustomerID, AVG(CAST(TotalAmount AS decimal(18,2))) AS AvgAmt
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
)
SELECT CustomerID, AvgAmt,
       DENSE_RANK() OVER (ORDER BY AvgAmt DESC) AS DR
FROM A
ORDER BY DR;
```

## NTILE(n)
```sql
-- 1. Customers into revenue QUARTILES for July 2025
WITH C AS (
  SELECT CustomerID, SUM(TotalAmount) AS JulyAmt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT CustomerID, JulyAmt,
       NTILE(4) OVER (ORDER BY JulyAmt DESC) AS Quartile
FROM C
ORDER BY Quartile, JulyAmt DESC;

-- 2. Products into PRICE QUINTILES (by UnitPrice)
SELECT ProductID, Name, UnitPrice,
       NTILE(5) OVER (ORDER BY UnitPrice DESC) AS PriceQuintile
FROM retail_company.Product
ORDER BY PriceQuintile, UnitPrice DESC;

-- 3. Suppliers into TERTILES by July PO amount
WITH S AS (
  SELECT SupplierID, SUM(TotalAmount) AS JulyPO
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SupplierID
)
SELECT SupplierID, JulyPO,
       NTILE(3) OVER (ORDER BY JulyPO DESC) AS Tertile
FROM S
ORDER BY Tertile, JulyPO DESC;

-- 4. Days of July into sales QUARTILES
WITH D AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       NTILE(4) OVER (ORDER BY DaySales DESC) AS SalesQuartile
FROM D
ORDER BY SalesQuartile, DaySales DESC;

-- 5. Warehouses into QUARTILES by on-hand (2025-07-31)
WITH W AS (
  SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY WarehouseID
)
SELECT WarehouseID, OnHand,
       NTILE(4) OVER (ORDER BY OnHand DESC) AS WHQuartile
FROM W
ORDER BY WHQuartile, OnHand DESC;

-- 6. Orders into DECILES by TotalAmount
SELECT SalesOrderID, OrderDate, TotalAmount,
       NTILE(10) OVER (ORDER BY TotalAmount DESC) AS AmountDecile
FROM retail_company.SalesOrder
ORDER BY AmountDecile, TotalAmount DESC;

-- 7. Products into QUARTILES by UnitsInStock
SELECT ProductID, UnitsInStock,
       NTILE(4) OVER (ORDER BY UnitsInStock DESC) AS StockQuartile
FROM retail_company.Product
ORDER BY StockQuartile, UnitsInStock DESC;

-- 8. Categories into TERTILES by average product price
WITH A AS (
  SELECT CategoryID, AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgPrice
  FROM retail_company.Product
  GROUP BY CategoryID
)
SELECT CategoryID, AvgPrice,
       NTILE(3) OVER (ORDER BY AvgPrice DESC) AS PriceTertile
FROM A
ORDER BY PriceTertile, AvgPrice DESC;

-- 9. Customers into QUARTILES by July order COUNT
WITH C AS (
  SELECT CustomerID, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT CustomerID, Cnt,
       NTILE(4) OVER (ORDER BY Cnt DESC) AS ActivityQuartile
FROM C
ORDER BY ActivityQuartile, Cnt DESC;

-- 10. Products into QUINTILES by July quantity SOLD
WITH Q AS (
  SELECT d.ProductID, SUM(d.Quantity) AS Qty
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY d.ProductID
)
SELECT ProductID, Qty,
       NTILE(5) OVER (ORDER BY Qty DESC) AS QtyQuintile
FROM Q
ORDER BY QtyQuintile, Qty DESC;

-- 11. POs into QUARTILES by TotalAmount WITHIN each Supplier
SELECT SupplierID, PurchaseOrderID, TotalAmount,
       NTILE(4) OVER (PARTITION BY SupplierID ORDER BY TotalAmount DESC) AS QuartileInSupplier
FROM retail_company.PurchaseOrder
ORDER BY SupplierID, QuartileInSupplier, TotalAmount DESC;

-- 12. Order lines into DECILES by LineTotal within their ORDER
SELECT SalesOrderID, OrderDate, SalesOrderDetailID, LineTotal,
       NTILE(10) OVER (PARTITION BY SalesOrderID, OrderDate ORDER BY LineTotal DESC) AS DecileInOrder
FROM retail_company.SalesOrderDetail
ORDER BY OrderDate DESC, SalesOrderID DESC, DecileInOrder;
```

## LAG()
```sql
-- 1. Day-over-day change in daily sales during July
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       LAG(DaySales) OVER (ORDER BY OrderDate) AS PrevDaySales,
       DaySales - ISNULL(LAG(DaySales) OVER (ORDER BY OrderDate), 0) AS Delta
FROM Daily
ORDER BY OrderDate;

-- 2. Customer’s days since previous order
WITH COrd AS (
  SELECT CustomerID, SalesOrderID, OrderDate,
         LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS PrevOrderDate
  FROM retail_company.SalesOrder
)
SELECT CustomerID, SalesOrderID, OrderDate, PrevOrderDate,
       DATEDIFF(DAY, PrevOrderDate, OrderDate) AS DaysSincePrev
FROM COrd
ORDER BY CustomerID, OrderDate;

-- 3. Product PO UnitCost change vs previous PO (by date)
WITH Hist AS (
  SELECT pod.ProductID, po.OrderDate, pod.UnitCost,
         LAG(pod.UnitCost) OVER (PARTITION BY pod.ProductID ORDER BY po.OrderDate, po.PurchaseOrderID, pod.PurchaseOrderDetailID) AS PrevCost
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
)
SELECT ProductID, OrderDate, UnitCost, PrevCost,
       UnitCost - PrevCost AS Delta
FROM Hist
ORDER BY ProductID, OrderDate;

-- 4. Inventory day-over-day delta per PRODUCT × WAREHOUSE
WITH I AS (
  SELECT ProductID, WarehouseID, StockDate, QuantityOnHand,
         LAG(QuantityOnHand) OVER (PARTITION BY ProductID, WarehouseID ORDER BY StockDate, InventoryID) AS PrevQty
  FROM retail_company.Inventory
)
SELECT ProductID, WarehouseID, StockDate, QuantityOnHand, PrevQty,
       QuantityOnHand - PrevQty AS Delta
FROM I
ORDER BY ProductID, WarehouseID, StockDate;

-- 5. Order count per day vs previous day
WITH D AS (
  SELECT OrderDate, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  GROUP BY OrderDate
)
SELECT OrderDate, Cnt,
       LAG(Cnt) OVER (ORDER BY OrderDate) AS PrevCnt,
       Cnt - ISNULL(LAG(Cnt) OVER (ORDER BY OrderDate), 0) AS Delta
FROM D
ORDER BY OrderDate;

-- 6. Customer order amount vs previous order amount
WITH A AS (
  SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount,
         LAG(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS PrevAmt
  FROM retail_company.SalesOrder
)
SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount, PrevAmt,
       TotalAmount - PrevAmt AS Delta
FROM A
ORDER BY CustomerID, OrderDate;

-- 7. Supplier PO amount vs previous PO
WITH S AS (
  SELECT SupplierID, PurchaseOrderID, OrderDate, TotalAmount,
         LAG(TotalAmount) OVER (PARTITION BY SupplierID ORDER BY OrderDate, PurchaseOrderID) AS PrevAmt
  FROM retail_company.PurchaseOrder
)
SELECT SupplierID, PurchaseOrderID, OrderDate, TotalAmount, PrevAmt,
       TotalAmount - PrevAmt AS Delta
FROM S
ORDER BY SupplierID, OrderDate;

-- 8. Change in shipping lead time vs previous order for same CUSTOMER
WITH LeadT AS (
  SELECT SalesOrderID, CustomerID, OrderDate, ShipDate,
         DATEDIFF(DAY, OrderDate, ShipDate) AS ShipDays
  FROM retail_company.SalesOrder
  WHERE ShipDate IS NOT NULL
),
C AS (
  SELECT *, LAG(ShipDays) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS PrevShipDays
  FROM LeadT
)
SELECT CustomerID, SalesOrderID, OrderDate, ShipDays, PrevShipDays,
       ShipDays - PrevShipDays AS DeltaDays
FROM C
ORDER BY CustomerID, OrderDate;

-- 9. Gap in inventory dates (days) per PRODUCT × WAREHOUSE
WITH G AS (
  SELECT ProductID, WarehouseID, StockDate,
         LAG(StockDate) OVER (PARTITION BY ProductID, WarehouseID ORDER BY StockDate) AS PrevDate
  FROM retail_company.Inventory
)
SELECT ProductID, WarehouseID, StockDate, PrevDate,
       DATEDIFF(DAY, PrevDate, StockDate) AS GapDays
FROM G
ORDER BY ProductID, WarehouseID, StockDate;

-- 10. Category daily revenue vs previous day revenue
WITH DayCat AS (
  SELECT p.CategoryID, d.OrderDate, SUM(d.LineTotal) AS CatDaySales
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  GROUP BY p.CategoryID, d.OrderDate
)
SELECT CategoryID, OrderDate, CatDaySales,
       LAG(CatDaySales) OVER (PARTITION BY CategoryID ORDER BY OrderDate) AS PrevCatDaySales,
       CatDaySales - ISNULL(LAG(CatDaySales) OVER (PARTITION BY CategoryID ORDER BY OrderDate),0) AS Delta
FROM DayCat
ORDER BY CategoryID, OrderDate;

-- 11. Previous line’s quantity within each ORDER
SELECT SalesOrderID, OrderDate, SalesOrderDetailID, Quantity,
       LAG(Quantity) OVER (PARTITION BY SalesOrderID, OrderDate ORDER BY SalesOrderDetailID) AS PrevQty
FROM retail_company.SalesOrderDetail
ORDER BY OrderDate DESC, SalesOrderID DESC, SalesOrderDetailID;

-- 12. Customer spend trend flag vs previous order (Up/Down/Same)
WITH A AS (
  SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount,
         LAG(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS PrevAmt
  FROM retail_company.SalesOrder
)
SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount,
       CASE WHEN PrevAmt IS NULL THEN 'N/A'
            WHEN TotalAmount > PrevAmt THEN 'Up'
            WHEN TotalAmount < PrevAmt THEN 'Down'
            ELSE 'Same' END AS Trend
FROM A
ORDER BY CustomerID, OrderDate;
```

## LEAD()
```sql
-- 1. Next order date per CUSTOMER and gap days
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate,
         LEAD(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS NextOrderDate
  FROM retail_company.SalesOrder
)
SELECT CustomerID, SalesOrderID, OrderDate, NextOrderDate,
       DATEDIFF(DAY, OrderDate, NextOrderDate) AS DaysToNext
FROM C
ORDER BY CustomerID, OrderDate;

-- 2. Next inventory date per PRODUCT × WAREHOUSE and gap
WITH I AS (
  SELECT ProductID, WarehouseID, StockDate,
         LEAD(StockDate) OVER (PARTITION BY ProductID, WarehouseID ORDER BY StockDate) AS NextStockDate
  FROM retail_company.Inventory
)
SELECT ProductID, WarehouseID, StockDate, NextStockDate,
       DATEDIFF(DAY, StockDate, NextStockDate) AS GapDays
FROM I
ORDER BY ProductID, WarehouseID, StockDate;

-- 3. Next PO expected date per SUPPLIER
WITH P AS (
  SELECT SupplierID, PurchaseOrderID, ExpectedDate,
         LEAD(ExpectedDate) OVER (PARTITION BY SupplierID ORDER BY ExpectedDate, PurchaseOrderID) AS NextExpected
  FROM retail_company.PurchaseOrder
)
SELECT SupplierID, PurchaseOrderID, ExpectedDate, NextExpected
FROM P
ORDER BY SupplierID, ExpectedDate;

-- 4. Next day’s sales per DAY
WITH D AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       LEAD(DaySales) OVER (ORDER BY OrderDate) AS NextDaySales
FROM D
ORDER BY OrderDate;

-- 5. Next line total within ORDER
SELECT SalesOrderID, OrderDate, SalesOrderDetailID, LineTotal,
       LEAD(LineTotal) OVER (PARTITION BY SalesOrderID, OrderDate ORDER BY SalesOrderDetailID) AS NextLineTotal
FROM retail_company.SalesOrderDetail
ORDER BY OrderDate DESC, SalesOrderID DESC, SalesOrderDetailID;

-- 6. Next PO UnitCost for PRODUCT (timeline)
WITH H AS (
  SELECT pod.ProductID, po.OrderDate, pod.UnitCost,
         LEAD(pod.UnitCost) OVER (PARTITION BY pod.ProductID ORDER BY po.OrderDate, po.PurchaseOrderID, pod.PurchaseOrderDetailID) AS NextCost
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
)
SELECT ProductID, OrderDate, UnitCost, NextCost
FROM H
ORDER BY ProductID, OrderDate;

-- 7. Next order amount per CUSTOMER
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount,
         LEAD(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS NextAmt
  FROM retail_company.SalesOrder
)
SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount, NextAmt
FROM C
ORDER BY CustomerID, OrderDate;

-- 8. Next warehouse on-hand by date per PRODUCT
WITH I AS (
  SELECT ProductID, StockDate, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  GROUP BY ProductID, StockDate
),
N AS (
  SELECT ProductID, StockDate, OnHand,
         LEAD(OnHand) OVER (PARTITION BY ProductID ORDER BY StockDate) AS NextOnHand
  FROM I
)
SELECT *
FROM N
ORDER BY ProductID, StockDate;

-- 9. Next order date globally
SELECT SalesOrderID, OrderDate,
       LEAD(OrderDate) OVER (ORDER BY OrderDate, SalesOrderID) AS NextOrderDate
FROM retail_company.SalesOrder
ORDER BY OrderDate, SalesOrderID;

-- 10. Next day with zero orders (lookahead) — shows next date regardless; caller can filter
WITH D AS (
  SELECT OrderDate, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  GROUP BY OrderDate
)
SELECT OrderDate, Cnt,
       LEAD(CASE WHEN Cnt=0 THEN OrderDate END) OVER (ORDER BY OrderDate) AS NextZeroOrderDay
FROM D
ORDER BY OrderDate;

-- 11. Next customer order within July only
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate,
         LEAD(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS NextOrderDate
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT *
FROM C
ORDER BY CustomerID, OrderDate;

-- 12. Next category day sales
WITH DayCat AS (
  SELECT p.CategoryID, d.OrderDate, SUM(d.LineTotal) AS CatDaySales
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  GROUP BY p.CategoryID, d.OrderDate
)
SELECT CategoryID, OrderDate, CatDaySales,
       LEAD(CatDaySales) OVER (PARTITION BY CategoryID ORDER BY OrderDate) AS NextCatDaySales
FROM DayCat
ORDER BY CategoryID, OrderDate;
```

## FIRST_VALUE()
```sql
-- 1. First order date per CUSTOMER
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate,
         FIRST_VALUE(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS FirstOrderDate
  FROM retail_company.SalesOrder
)
SELECT *
FROM C
ORDER BY CustomerID, OrderDate;

-- 2. First PO date per SUPPLIER
SELECT SupplierID, PurchaseOrderID, OrderDate,
       FIRST_VALUE(OrderDate) OVER (PARTITION BY SupplierID ORDER BY OrderDate, PurchaseOrderID) AS FirstPODate
FROM retail_company.PurchaseOrder
ORDER BY SupplierID, OrderDate;

-- 3. For each PRODUCT: first PO UnitCost (chronologically)
WITH H AS (
  SELECT pod.ProductID, po.OrderDate, pod.UnitCost,
         FIRST_VALUE(pod.UnitCost) OVER (PARTITION BY pod.ProductID ORDER BY po.OrderDate, po.PurchaseOrderID, pod.PurchaseOrderDetailID) AS FirstCost
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
)
SELECT *
FROM H
ORDER BY ProductID, OrderDate;

-- 4. Cheapest product price within CATEGORY using FIRST_VALUE (order by UnitPrice ASC)
SELECT CategoryID, ProductID, UnitPrice,
       FIRST_VALUE(UnitPrice) OVER (PARTITION BY CategoryID ORDER BY UnitPrice ASC, ProductID) AS CatMinPrice
FROM retail_company.Product
ORDER BY CategoryID, UnitPrice;

-- 5. First order ID of each DAY
SELECT SalesOrderID, OrderDate,
       FIRST_VALUE(SalesOrderID) OVER (PARTITION BY OrderDate ORDER BY SalesOrderID) AS FirstSOOfDay
FROM retail_company.SalesOrder
ORDER BY OrderDate, SalesOrderID;

-- 6. First inventory quantity for PRODUCT in July (by date)
WITH I AS (
  SELECT ProductID, StockDate, QuantityOnHand,
         FIRST_VALUE(QuantityOnHand) OVER (PARTITION BY ProductID ORDER BY StockDate, InventoryID) AS FirstQtyJuly
  FROM retail_company.Inventory
  WHERE StockDate BETWEEN @StartJuly AND @EndJuly
)
SELECT *
FROM I
ORDER BY ProductID, StockDate;

-- 7. First order amount per CUSTOMER in July
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount,
         FIRST_VALUE(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS FirstAmtJuly
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT *
FROM C
ORDER BY CustomerID, OrderDate;

-- 8. First product ID alphabetically within CATEGORY (by Name)
SELECT CategoryID, ProductID, Name,
       FIRST_VALUE(ProductID) OVER (PARTITION BY CategoryID ORDER BY Name, ProductID) AS FirstProdInCatByName
FROM retail_company.Product
ORDER BY CategoryID, Name;

-- 9. First warehouse quantity per PRODUCT on 2025-07-31 (by WarehouseID)
WITH W AS (
  SELECT ProductID, WarehouseID, QuantityOnHand,
         FIRST_VALUE(QuantityOnHand) OVER (PARTITION BY ProductID ORDER BY WarehouseID) AS FirstWHQty
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
)
SELECT *
FROM W
ORDER BY ProductID, WarehouseID;

-- 10. First PO amount per SUPPLIER (by OrderDate)
SELECT SupplierID, PurchaseOrderID, OrderDate, TotalAmount,
       FIRST_VALUE(TotalAmount) OVER (PARTITION BY SupplierID ORDER BY OrderDate, PurchaseOrderID) AS FirstPOAmt
FROM retail_company.PurchaseOrder
ORDER BY SupplierID, OrderDate;

-- 11. First SOLD date per PRODUCT (by OrderDate)
WITH S AS (
  SELECT d.ProductID, d.OrderDate,
         FIRST_VALUE(d.OrderDate) OVER (PARTITION BY d.ProductID ORDER BY d.OrderDate) AS FirstSoldDate
  FROM retail_company.SalesOrderDetail d
)
SELECT DISTINCT ProductID, FirstSoldDate
FROM S
ORDER BY ProductID;

-- 12. First daily sales value of July (same for all rows) using window
WITH D AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       FIRST_VALUE(DaySales) OVER (ORDER BY OrderDate) AS FirstDaySalesInJuly
FROM D
ORDER BY OrderDate;
```

## LAST_VALUE()
```sql
-- 1. Last order date per CUSTOMER
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate,
         LAST_VALUE(OrderDate) OVER (
           PARTITION BY CustomerID
           ORDER BY OrderDate, SalesOrderID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastOrderDate
  FROM retail_company.SalesOrder
)
SELECT DISTINCT CustomerID, LastOrderDate
FROM C
ORDER BY CustomerID;

-- 2. Last PO date per SUPPLIER
WITH P AS (
  SELECT SupplierID, PurchaseOrderID, OrderDate,
         LAST_VALUE(OrderDate) OVER (
           PARTITION BY SupplierID
           ORDER BY OrderDate, PurchaseOrderID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastPODate
  FROM retail_company.PurchaseOrder
)
SELECT DISTINCT SupplierID, LastPODate
FROM P
ORDER BY SupplierID;

-- 3. For each PRODUCT: last inventory date in July
WITH I AS (
  SELECT ProductID, StockDate,
         LAST_VALUE(StockDate) OVER (
           PARTITION BY ProductID
           ORDER BY StockDate
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastJulyStockDate
  FROM retail_company.Inventory
  WHERE StockDate BETWEEN @StartJuly AND @EndJuly
)
SELECT DISTINCT ProductID, LastJulyStockDate
FROM I
ORDER BY ProductID;

-- 4. Most expensive product price within CATEGORY via LAST_VALUE
SELECT CategoryID, ProductID, UnitPrice,
       LAST_VALUE(UnitPrice) OVER (
         PARTITION BY CategoryID
         ORDER BY UnitPrice ASC, ProductID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS CatMaxPrice
FROM retail_company.Product
ORDER BY CategoryID, UnitPrice;

-- 5. Last order ID of each DAY
WITH D AS (
  SELECT SalesOrderID, OrderDate,
         LAST_VALUE(SalesOrderID) OVER (
           PARTITION BY OrderDate
           ORDER BY SalesOrderID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastSOOfDay
  FROM retail_company.SalesOrder
)
SELECT DISTINCT OrderDate, LastSOOfDay
FROM D
ORDER BY OrderDate;

-- 6. Last quantity per PRODUCT on 2025-07-31 across warehouses (by WarehouseID)
WITH W AS (
  SELECT ProductID, WarehouseID, QuantityOnHand,
         LAST_VALUE(QuantityOnHand) OVER (
           PARTITION BY ProductID
           ORDER BY WarehouseID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastWHQty
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
)
SELECT DISTINCT ProductID, LastWHQty
FROM W
ORDER BY ProductID;

-- 7. Last July order amount per CUSTOMER
WITH C AS (
  SELECT CustomerID, SalesOrderID, OrderDate, TotalAmount,
         LAST_VALUE(TotalAmount) OVER (
           PARTITION BY CustomerID
           ORDER BY OrderDate, SalesOrderID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastAmtJuly
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT DISTINCT CustomerID, LastAmtJuly
FROM C
ORDER BY CustomerID;

-- 8. Last PO UnitCost per PRODUCT (chronological)
WITH H AS (
  SELECT pod.ProductID, po.OrderDate, pod.UnitCost,
         LAST_VALUE(pod.UnitCost) OVER (
           PARTITION BY pod.ProductID
           ORDER BY po.OrderDate, po.PurchaseOrderID, pod.PurchaseOrderDetailID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastCost
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
)
SELECT DISTINCT ProductID, LastCost
FROM H
ORDER BY ProductID;

-- 9. Last product name alphabetically within CATEGORY
WITH P AS (
  SELECT CategoryID, ProductID, Name,
         LAST_VALUE(Name) OVER (
           PARTITION BY CategoryID
           ORDER BY Name, ProductID
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastNameAlpha
  FROM retail_company.Product
)
SELECT DISTINCT CategoryID, LastNameAlpha
FROM P
ORDER BY CategoryID;

-- 10. Last expected date per SUPPLIER
WITH P AS (
  SELECT SupplierID, ExpectedDate,
         LAST_VALUE(ExpectedDate) OVER (
           PARTITION BY SupplierID
           ORDER BY ExpectedDate
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastExpected
  FROM retail_company.PurchaseOrder
  WHERE ExpectedDate IS NOT NULL
)
SELECT DISTINCT SupplierID, LastExpected
FROM P
ORDER BY SupplierID;

-- 11. Last SOLD day per PRODUCT in July
WITH S AS (
  SELECT d.ProductID, d.OrderDate,
         LAST_VALUE(d.OrderDate) OVER (
           PARTITION BY d.ProductID
           ORDER BY d.OrderDate
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
         ) AS LastSoldDateJuly
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT DISTINCT ProductID, LastSoldDateJuly
FROM S
ORDER BY ProductID;

-- 12. For each day of July: show the month’s LAST daily sales (same value on every row)
WITH D AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT OrderDate, DaySales,
       LAST_VALUE(DaySales) OVER (
         ORDER BY OrderDate
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS LastDaySalesInJuly
FROM D
ORDER BY OrderDate;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
