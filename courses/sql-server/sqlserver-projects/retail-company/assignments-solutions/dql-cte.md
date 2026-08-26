![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @StartJuly date = '2025-07-01';
DECLARE @EndJuly   date = '2025-07-31';
```

## CTE
```sql
-- 1. Daily sales in July 2025 (CTE to aggregate once, then top-5 days)
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT TOP (5) OrderDate, DaySales
FROM Daily
ORDER BY DaySales DESC;

-- 2. Active products only (not discontinued), then show top-10 by UnitPrice
WITH ActiveProducts AS (
  SELECT ProductID, Name, CategoryID, SupplierID, UnitPrice
  FROM retail_company.Product
  WHERE Discontinued = 0
)
SELECT TOP (10) *
FROM ActiveProducts
ORDER BY UnitPrice DESC;

-- 3. July orders CTE, then split by status
WITH JulyOrders AS (
  SELECT SalesOrderID, CustomerID, OrderDate, Status, TotalAmount
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT Status, COUNT(*) AS Orders, SUM(TotalAmount) AS Amount
FROM JulyOrders
GROUP BY Status
ORDER BY Amount DESC;

-- 4. Category revenue (from lines) in July
WITH CatSales AS (
  SELECT p.CategoryID, SUM(d.LineTotal) AS CatRevenue
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID
)
SELECT * FROM CatSales ORDER BY CatRevenue DESC;

-- 5. Customer July revenue above 10,000
WITH CustJuly AS (
  SELECT CustomerID, SUM(TotalAmount) AS JulyRevenue
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT *
FROM CustJuly
WHERE JulyRevenue > 10000
ORDER BY JulyRevenue DESC;

-- 6. Orders per customer (whole data), with customer name
WITH CCounts AS (
  SELECT CustomerID, COUNT(*) AS OrderCount
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
)
SELECT c.CustomerID, cu.FirstName, cu.LastName, c.OrderCount
FROM CCounts c
JOIN retail_company.Customer cu ON cu.CustomerID = c.CustomerID
ORDER BY c.OrderCount DESC;

-- 7. Low-stock products (stock-to-reorder ratio < 1.2)
WITH StockRatio AS (
  SELECT ProductID, Name, UnitsInStock, ReorderLevel,
         CASE WHEN ReorderLevel = 0 THEN NULL
              ELSE CAST(UnitsInStock AS decimal(18,2)) / NULLIF(ReorderLevel,0) END AS StockToReorder
  FROM retail_company.Product
)
SELECT *
FROM StockRatio
WHERE StockToReorder IS NOT NULL AND StockToReorder < 1.2
ORDER BY StockToReorder;

-- 8. Above-average price items per category
WITH CatAvg AS (
  SELECT CategoryID, AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgPrice
  FROM retail_company.Product
  GROUP BY CategoryID
)
SELECT p.ProductID, p.Name, p.CategoryID, p.UnitPrice, a.AvgPrice
FROM retail_company.Product p
JOIN CatAvg a ON a.CategoryID = p.CategoryID
WHERE p.UnitPrice > a.AvgPrice
ORDER BY p.CategoryID, p.UnitPrice DESC;

-- 9. Latest inventory snapshot per Product × Warehouse (<= 2025-07-31)
WITH Snap AS (
  SELECT InventoryID, ProductID, WarehouseID, StockDate, QuantityOnHand,
         ROW_NUMBER() OVER (PARTITION BY ProductID, WarehouseID
                            ORDER BY StockDate DESC, InventoryID DESC) AS rn
  FROM retail_company.Inventory
  WHERE StockDate <= '2025-07-31'
)
SELECT ProductID, WarehouseID, StockDate, QuantityOnHand
FROM Snap
WHERE rn = 1
ORDER BY ProductID, WarehouseID;

-- 10. July open purchase orders amount by supplier
WITH JulyPO AS (
  SELECT SupplierID, OrderDate, TotalAmount, Status
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
)
SELECT SupplierID,
       SUM(CASE WHEN Status IN (N'Open', N'Placed') THEN TotalAmount ELSE 0 END) AS OpenOrPlacedAmt
FROM JulyPO
GROUP BY SupplierID
ORDER BY OpenOrPlacedAmt DESC;

-- 11. Top-10 products by July revenue (from lines)
WITH ProdJuly AS (
  SELECT d.ProductID, SUM(d.LineTotal) AS Revenue
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY d.ProductID
)
SELECT TOP (10) p.ProductID, p.Name, pj.Revenue
FROM ProdJuly pj
JOIN retail_company.Product p ON p.ProductID = pj.ProductID
ORDER BY pj.Revenue DESC;

-- 12. Shipping lead time per order and customer-level average
WITH Lead AS (
  SELECT SalesOrderID, CustomerID, OrderDate, ShipDate,
         DATEDIFF(DAY, OrderDate, ShipDate) AS ShipDays
  FROM retail_company.SalesOrder
  WHERE ShipDate IS NOT NULL
)
SELECT CustomerID, AVG(CAST(ShipDays AS decimal(10,2))) AS AvgShipDays
FROM Lead
GROUP BY CustomerID
ORDER BY AvgShipDays;
```

## Using Multiple CTEs
```sql
-- 1. Daily sales (CTE1) → Weekly totals (CTE2)
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE DATEPART(YEAR, OrderDate) = 2025
  GROUP BY OrderDate
),
Weekly AS (
  SELECT DATEPART(isowk, OrderDate) AS ISOWeek, DATEPART(year, OrderDate) AS Yr,
         SUM(DaySales) AS WeekSales
  FROM Daily
  GROUP BY DATEPART(isowk, OrderDate), DATEPART(year, OrderDate)
)
SELECT Yr, ISOWeek, WeekSales
FROM Weekly
ORDER BY Yr, ISOWeek;

-- 2. Compare header vs line totals per order in July
WITH Header AS (
  SELECT SalesOrderID, OrderDate, TotalAmount FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
),
Lines AS (
  SELECT SalesOrderID, OrderDate, SUM(LineTotal) AS SumLines
  FROM retail_company.SalesOrderDetail
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SalesOrderID, OrderDate
)
SELECT h.SalesOrderID, h.OrderDate, h.TotalAmount, l.SumLines,
       (h.TotalAmount - l.SumLines) AS Diff
FROM Header h
LEFT JOIN Lines l ON l.SalesOrderID = h.SalesOrderID AND l.OrderDate = h.OrderDate
ORDER BY ABS(h.TotalAmount - ISNULL(l.SumLines,0)) DESC, h.OrderDate;

-- 3. Top-3 products by price within each category (RankCTE → FilterCTE)
WITH RankCTE AS (
  SELECT CategoryID, ProductID, Name, UnitPrice,
         ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY UnitPrice DESC, ProductID) AS rn
  FROM retail_company.Product
),
FilterCTE AS (
  SELECT * FROM RankCTE WHERE rn <= 3
)
SELECT * FROM FilterCTE
ORDER BY CategoryID, rn;

-- 4. July customers with order count and revenue (two CTEs then join)
WITH Cnt AS (
  SELECT CustomerID, COUNT(*) AS Orders
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
),
Amt AS (
  SELECT CustomerID, SUM(TotalAmount) AS Revenue
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT c.CustomerID, c.Orders, a.Revenue
FROM Cnt c
JOIN Amt a ON a.CustomerID = c.CustomerID
ORDER BY a.Revenue DESC;

-- 5. Supplier July PO total & #products supplied (join two summaries)
WITH POAmt AS (
  SELECT SupplierID, SUM(TotalAmount) AS JulyPO
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SupplierID
),
ProdCnt AS (
  SELECT SupplierID, COUNT(*) AS ProductCount
  FROM retail_company.Product
  GROUP BY SupplierID
)
SELECT p.SupplierID, p.JulyPO, pc.ProductCount
FROM POAmt p
LEFT JOIN ProdCnt pc ON pc.SupplierID = p.SupplierID
ORDER BY p.JulyPO DESC;

-- 6. On-hand per warehouse at month-end & warehouse ranking
WITH WHOnHand AS (
  SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY WarehouseID
),
Ranked AS (
  SELECT WarehouseID, OnHand,
         RANK() OVER (ORDER BY OnHand DESC, WarehouseID) AS WHRank
  FROM WHOnHand
)
SELECT * FROM Ranked ORDER BY WHRank;

-- 7. Customer first & last order dates (two window CTEs) and active span
WITH Base AS (
  SELECT CustomerID, SalesOrderID, OrderDate FROM retail_company.SalesOrder
),
FirstLast AS (
  SELECT CustomerID,
         MIN(OrderDate) AS FirstOrder,
         MAX(OrderDate) AS LastOrder
  FROM Base
  GROUP BY CustomerID
)
SELECT CustomerID, FirstOrder, LastOrder,
       DATEDIFF(DAY, FirstOrder, LastOrder) AS ActiveDays
FROM FirstLast
ORDER BY ActiveDays DESC;

-- 8. Category price stats (CTE1) & product deviation (CTE2)
WITH CatStats AS (
  SELECT CategoryID,
         AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgPrice,
         STDEV(UnitPrice) AS SdPrice
  FROM retail_company.Product
  GROUP BY CategoryID
),
WithDev AS (
  SELECT p.ProductID, p.CategoryID, p.UnitPrice, s.AvgPrice, s.SdPrice,
         (p.UnitPrice - s.AvgPrice) / NULLIF(s.SdPrice,0) AS Z
  FROM retail_company.Product p
  JOIN CatStats s ON s.CategoryID = p.CategoryID
)
SELECT * FROM WithDev
ORDER BY CategoryID, Z DESC;

-- 9. Repeat customers in July (>= 2 orders) with their July revenue
WITH JulyCnt AS (
  SELECT CustomerID, COUNT(*) AS Orders
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
),
JulyAmt AS (
  SELECT CustomerID, SUM(TotalAmount) AS Revenue
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY CustomerID
)
SELECT c.CustomerID, c.Orders, a.Revenue
FROM JulyCnt c
JOIN JulyAmt a ON a.CustomerID = c.CustomerID
WHERE c.Orders >= 2
ORDER BY a.Revenue DESC;

-- 10. Top categories by July revenue and top product per those categories
WITH CatRev AS (
  SELECT p.CategoryID, SUM(d.LineTotal) AS Rev
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID
),
TopProd AS (
  SELECT p.CategoryID, d.ProductID, SUM(d.LineTotal) AS ProdRev,
         ROW_NUMBER() OVER (PARTITION BY p.CategoryID ORDER BY SUM(d.LineTotal) DESC, d.ProductID) AS rn
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY p.CategoryID, d.ProductID
)
SELECT c.CategoryID, c.Rev AS CategoryRevenue,
       tp.ProductID, tp.ProdRev AS TopProductRevenue
FROM CatRev c
JOIN TopProd tp ON tp.CategoryID = c.CategoryID AND tp.rn = 1
ORDER BY c.CategoryID;

-- 11. Lines-per-order (CTE1) joined to header for July orders > 2 lines
WITH LinesPerOrder AS (
  SELECT SalesOrderID, OrderDate, COUNT(*) AS Lines
  FROM retail_company.SalesOrderDetail
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SalesOrderID, OrderDate
)
SELECT s.SalesOrderID, s.OrderDate, l.Lines, s.TotalAmount
FROM retail_company.SalesOrder s
JOIN LinesPerOrder l
  ON l.SalesOrderID = s.SalesOrderID AND l.OrderDate = s.OrderDate
WHERE l.Lines > 2
ORDER BY l.Lines DESC, s.TotalAmount DESC;

-- 12. Products sold in July but NOT supplied by top-PO supplier (two CTEs + EXCEPT)
WITH TopSupplier AS (
  SELECT TOP (1) SupplierID
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY SupplierID
  ORDER BY SUM(TotalAmount) DESC
),
SoldJuly AS (
  SELECT DISTINCT d.ProductID
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN @StartJuly AND @EndJuly
),
TopSuppProducts AS (
  SELECT p.ProductID
  FROM retail_company.Product p
  CROSS JOIN TopSupplier ts
  WHERE p.SupplierID = ts.SupplierID
)
SELECT sj.ProductID
FROM SoldJuly sj
EXCEPT
SELECT tsp.ProductID
FROM TopSuppProducts tsp
ORDER BY ProductID;
```

## Recursive CTEs
```sql
-- 1. Calendar days for July 2025
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
)
SELECT D AS CalDate
FROM Cal
OPTION (MAXRECURSION 1000);

-- 2. July calendar LEFT JOIN daily sales (showing zero-sales days)
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN @StartJuly AND @EndJuly
  GROUP BY OrderDate
)
SELECT c.D AS Date, ISNULL(d.DaySales, 0) AS DaySales
FROM Cal c
LEFT JOIN Daily d ON d.OrderDate = c.D
ORDER BY c.D
OPTION (MAXRECURSION 1000);

-- 3. Running cumulative July sales using recursion
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
Daily AS (
  SELECT c.D AS OrderDate, ISNULL(SUM(s.TotalAmount),0) AS DaySales
  FROM Cal c
  LEFT JOIN retail_company.SalesOrder s ON s.OrderDate = c.D
  GROUP BY c.D
),
Cum AS (
  SELECT OrderDate, DaySales, DaySales AS CumSales
  FROM Daily WHERE OrderDate = @StartJuly
  UNION ALL
  SELECT d.OrderDate, d.DaySales, c.CumSales + d.DaySales
  FROM Cum c
  JOIN Daily d ON d.OrderDate = DATEADD(DAY, 1, c.OrderDate)
)
SELECT * FROM Cum ORDER BY OrderDate
OPTION (MAXRECURSION 1000);

-- 4. Generate sequence 1..31 via recursion (utility)
WITH N AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM N WHERE n < 31
)
SELECT n FROM N
OPTION (MAXRECURSION 1000);

-- 5. Rolling 7-day sum via recursive walk (for July)
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
Daily AS (
  SELECT c.D AS OrderDate, ISNULL(SUM(s.TotalAmount),0) AS DaySales
  FROM Cal c
  LEFT JOIN retail_company.SalesOrder s ON s.OrderDate = c.D
  GROUP BY c.D
),
Roll AS (
  SELECT OrderDate, DaySales, CAST(DaySales AS decimal(18,2)) AS Sum7
  FROM Daily WHERE OrderDate = @StartJuly
  UNION ALL
  SELECT d.OrderDate, d.DaySales,
         CAST((
           SELECT SUM(D2.DaySales)
           FROM Daily D2
           WHERE D2.OrderDate BETWEEN DATEADD(DAY, -6, d.OrderDate) AND d.OrderDate
         ) AS decimal(18,2)) AS Sum7
  FROM Roll r
  JOIN Daily d ON d.OrderDate = DATEADD(DAY, 1, r.OrderDate)
)
SELECT * FROM Roll ORDER BY OrderDate
OPTION (MAXRECURSION 1000);

-- 6. Calendar weeks starting from the Monday of the first week in July (iterative add 7 days)
WITH WeekStarts AS (
  SELECT DATEADD(DAY,
                 (1 - DATEPART(WEEKDAY, @StartJuly) + 7) % 7, @StartJuly) AS WStart  -- next Monday or same if Monday
  UNION ALL
  SELECT DATEADD(DAY, 7, WStart) FROM WeekStarts WHERE WStart < @EndJuly
)
SELECT WStart AS WeekStart
FROM WeekStarts
OPTION (MAXRECURSION 100);

-- 7. Inventory day-by-day carry-forward per product (single product demo)
--    Pick one ProductID (e.g., the smallest with snapshots)
DECLARE @OneProduct int =
(SELECT TOP (1) ProductID FROM retail_company.Inventory ORDER BY ProductID);

WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
Raw AS (
  SELECT c.D AS StockDate,
         (SELECT TOP (1) QuantityOnHand
          FROM retail_company.Inventory i
          WHERE i.ProductID = @OneProduct AND i.StockDate = c.D
          ORDER BY i.InventoryID DESC) AS Qty
  FROM Cal c
),
Carry AS (
  SELECT StockDate, ISNULL(Qty, 0) AS Qty, ISNULL(Qty, 0) AS CarryQty
  FROM Raw WHERE StockDate = @StartJuly
  UNION ALL
  SELECT r.StockDate, ISNULL(r.Qty, 0),
         CASE WHEN r.Qty IS NOT NULL THEN r.Qty ELSE Carry.CarryQty END
  FROM Carry
  JOIN Raw r ON r.StockDate = DATEADD(DAY, 1, Carry.StockDate)
)
SELECT StockDate, CarryQty AS QuantityOnHand_CarryForward
FROM Carry
ORDER BY StockDate
OPTION (MAXRECURSION 1000);

-- 8. Build months of 2025 and attach revenue per month
WITH Months AS (
  SELECT CAST('2025-01-01' AS date) AS MStart
  UNION ALL
  SELECT DATEADD(MONTH, 1, MStart) FROM Months WHERE MStart < '2025-12-01'
),
MR AS (
  SELECT m.MStart,
         (SELECT ISNULL(SUM(TotalAmount),0)
          FROM retail_company.SalesOrder s
          WHERE s.OrderDate >= m.MStart
            AND s.OrderDate <  DATEADD(MONTH, 1, m.MStart)) AS Revenue
  FROM Months m
)
SELECT MStart, Revenue
FROM MR
ORDER BY MStart
OPTION (MAXRECURSION 100);

-- 9. Recursively accumulate per-day order counts (alternative to window)
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
DayCnt AS (
  SELECT c.D AS Day, ISNULL(COUNT(s.SalesOrderID),0) AS Orders
  FROM Cal c LEFT JOIN retail_company.SalesOrder s ON s.OrderDate = c.D
  GROUP BY c.D
),
Cum AS (
  SELECT Day, Orders, Orders AS CumOrders
  FROM DayCnt WHERE Day = @StartJuly
  UNION ALL
  SELECT d.Day, d.Orders, c.CumOrders + d.Orders
  FROM Cum c
  JOIN DayCnt d ON d.Day = DATEADD(DAY, 1, c.Day)
)
SELECT * FROM Cum ORDER BY Day
OPTION (MAXRECURSION 1000);

-- 10. Build a sequence 1..n for top-N filtering per category (N=3)
WITH N AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM N WHERE n < 3
),
Ranked AS (
  SELECT p.CategoryID, p.ProductID, p.Name, p.UnitPrice,
         ROW_NUMBER() OVER (PARTITION BY p.CategoryID ORDER BY p.UnitPrice DESC, p.ProductID) AS rn
  FROM retail_company.Product p
)
SELECT r.CategoryID, r.ProductID, r.Name, r.UnitPrice
FROM Ranked r
JOIN N ON N.n = r.rn
ORDER BY r.CategoryID, r.rn
OPTION (MAXRECURSION 1000);

-- 11. Recursively expand dates and union purchase-order counts
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
POCnt AS (
  SELECT c.D AS Day, ISNULL(COUNT(po.PurchaseOrderID),0) AS POs
  FROM Cal c LEFT JOIN retail_company.PurchaseOrder po ON po.OrderDate = c.D
  GROUP BY c.D
)
SELECT * FROM POCnt ORDER BY Day
OPTION (MAXRECURSION 1000);

-- 12. Recursively compute a simple “sales momentum” (today vs prior day)
WITH Cal AS (
  SELECT @StartJuly AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @EndJuly
),
Daily AS (
  SELECT c.D AS OrderDate, ISNULL(SUM(s.TotalAmount),0) AS DaySales
  FROM Cal c LEFT JOIN retail_company.SalesOrder s ON s.OrderDate = c.D
  GROUP BY c.D
),
Momentum AS (
  SELECT OrderDate, DaySales, CAST(0 AS decimal(18,2)) AS Delta
  FROM Daily WHERE OrderDate = @StartJuly
  UNION ALL
  SELECT d.OrderDate, d.DaySales,
         CAST(d.DaySales - m.DaySales AS decimal(18,2)) AS Delta
  FROM Momentum m
  JOIN Daily d ON d.OrderDate = DATEADD(DAY, 1, m.OrderDate)
)
SELECT * FROM Momentum ORDER BY OrderDate
OPTION (MAXRECURSION 1000);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
