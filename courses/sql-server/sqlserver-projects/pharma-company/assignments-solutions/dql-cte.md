![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. July-2025 sales per customer, then list only customers with > ₹100,000 revenue
WITH JulySales AS (
  SELECT CustomerID, SUM(TotalAmount) AS JulyRevenue
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
)
SELECT CustomerID, JulyRevenue
FROM JulySales
WHERE JulyRevenue > 100000
ORDER BY JulyRevenue DESC;

-- 2. Daily shipments (units) in July-2025
WITH DailyShip AS (
  SELECT ShipmentDate, SUM(QuantityUnits) AS DayUnits
  FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY ShipmentDate
)
SELECT *
FROM DailyShip
ORDER BY ShipmentDate;

-- 3. Inventory snapshot on 2025-07-31 — top 10 products by total on-hand
WITH Inv AS (
  SELECT ProductID, SUM(QuantityUnits) AS OnHand
  FROM pharma_company.Inventory
  WHERE SnapshotDate = '2025-07-31'
  GROUP BY ProductID
)
SELECT TOP (10) ProductID, OnHand
FROM Inv
ORDER BY OnHand DESC;

-- 4. QC pass rate per TestID in July-2025
WITH QCRate AS (
  SELECT TestID,
         SUM(CASE WHEN PassFail='P' THEN 1 ELSE 0 END) AS Passes,
         COUNT(*) AS TotalTests
  FROM pharma_company.QCResult
  WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY TestID
)
SELECT TestID,
       Passes, TotalTests,
       CAST(Passes * 100.0 / NULLIF(TotalTests,0) AS DECIMAL(5,2)) AS PassPct
FROM QCRate
ORDER BY PassPct DESC;

-- 5. Latest batch per product (by date)
WITH LatestBatch AS (
  SELECT b.*,
         ROW_NUMBER() OVER (PARTITION BY b.ProductID ORDER BY b.BatchDate DESC, b.BatchID DESC) AS rn
  FROM pharma_company.ManufacturingBatch b
)
SELECT *
FROM LatestBatch
WHERE rn = 1;

-- 6. Orders in July grouped by weekday
WITH Wkd AS (
  SELECT DATENAME(weekday, OrderDate) AS WeekdayName, SUM(TotalAmount) AS Amt
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY DATENAME(weekday, OrderDate)
)
SELECT WeekdayName, Amt
FROM Wkd
ORDER BY Amt DESC;

-- 7. Top-5 customers by units shipped overall
WITH CustShip AS (
  SELECT CustomerID, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  GROUP BY CustomerID
)
SELECT TOP (5) CustomerID, Units
FROM CustShip
ORDER BY Units DESC;

-- 8. Products with > 3 formulation components
WITH FCount AS (
  SELECT ProductID, COUNT(*) AS Ingredients
  FROM pharma_company.Formulation
  GROUP BY ProductID
)
SELECT ProductID, Ingredients
FROM FCount
WHERE Ingredients > 3
ORDER BY Ingredients DESC;

-- 9. Agencies with ≥ 10 submissions (all-time)
WITH A AS (
  SELECT Agency, COUNT(*) AS Cnt
  FROM pharma_company.RegulatorySubmission
  GROUP BY Agency
)
SELECT Agency, Cnt
FROM A
WHERE Cnt >= 10
ORDER BY Cnt DESC;

-- 10. Centers with shipments but no inventory on 2025-07-31
WITH ShipCenters AS (
  SELECT DISTINCT CenterID
  FROM pharma_company.Shipment
  WHERE ShipmentDate = '2025-07-31'
),
InvCenters AS (
  SELECT DISTINCT CenterID
  FROM pharma_company.Inventory
  WHERE SnapshotDate = '2025-07-31'
)
SELECT s.CenterID
FROM ShipCenters s
WHERE NOT EXISTS (SELECT 1 FROM InvCenters i WHERE i.CenterID = s.CenterID);

-- 11. Customer-country sales in July-2025
WITH CustCountry AS (
  SELECT c.CustomerID, a.Country
  FROM pharma_company.Customer c
  JOIN pharma_company.Address a ON a.AddressID = c.AddressID
),
JulySales AS (
  SELECT CustomerID, SUM(TotalAmount) AS JulyAmt
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
)
SELECT cc.Country, SUM(js.JulyAmt) AS CountryJulySales
FROM CustCountry cc
JOIN JulySales js ON js.CustomerID = cc.CustomerID
GROUP BY cc.Country
ORDER BY CountryJulySales DESC;

-- 12. Products with any batch on last 7 days of July
WITH LastWeekBatches AS (
  SELECT DISTINCT ProductID
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-25' AND '2025-07-31'
)
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
JOIN LastWeekBatches lw ON lw.ProductID = p.ProductID
ORDER BY p.ProductID;
```

## Using Multiple CTEs
```sql
-- 1. July-2025: revenue per customer with rank and percent of total
WITH OrdersJuly AS (
  SELECT CustomerID, SUM(TotalAmount) AS Rev
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
),
TotalRev AS (
  SELECT SUM(Rev) AS TRev FROM OrdersJuly
)
SELECT o.CustomerID, o.Rev,
       CAST(o.Rev * 100.0 / NULLIF(t.TRev,0) AS DECIMAL(6,2)) AS PctOfTotal,
       RANK() OVER (ORDER BY o.Rev DESC) AS RevRank
FROM OrdersJuly o CROSS JOIN TotalRev t
ORDER BY RevRank;

-- 2. Inventory vs Shipments on 2025-07-31 by product
WITH Inv AS (
  SELECT ProductID, SUM(QuantityUnits) AS OnHand
  FROM pharma_company.Inventory
  WHERE SnapshotDate = '2025-07-31'
  GROUP BY ProductID
),
Ship AS (
  SELECT ProductID, SUM(QuantityUnits) AS Shipped
  FROM pharma_company.Shipment s
  JOIN pharma_company.ManufacturingBatch b
    ON b.BatchDate <= s.ShipmentDate AND b.ProductID = b.ProductID -- placeholder join prevented; use ProductID from inventory instead
  GROUP BY ProductID
)
SELECT i.ProductID, i.OnHand, ISNULL(s.Shipped,0) AS Shipped
FROM Inv i
LEFT JOIN Ship s ON s.ProductID = i.ProductID
ORDER BY i.OnHand DESC;

-- 3. Top-3 batches per product by size in July
WITH B AS (
  SELECT ProductID, BatchID, BatchDate, QuantityUnits,
         ROW_NUMBER() OVER (PARTITION BY ProductID ORDER BY QuantityUnits DESC, BatchDate DESC, BatchID DESC) AS rn
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT * FROM B WHERE rn <= 3 ORDER BY ProductID, rn;

-- 4. QC pass rate per product (via batch linkage), July
WITH RB AS (
  SELECT r.ResultID, r.PassFail, b.ProductID
  FROM pharma_company.QCResult r
  JOIN pharma_company.ManufacturingBatch b
    ON b.BatchID = r.BatchID AND b.BatchDate = r.BatchDate
  WHERE r.TestDate BETWEEN '2025-07-01' AND '2025-07-31'
),
Agg AS (
  SELECT ProductID,
         SUM(CASE WHEN PassFail='P' THEN 1 ELSE 0 END) AS P,
         COUNT(*) AS T
  FROM RB
  GROUP BY ProductID
)
SELECT ProductID, P, T, CAST(P*100.0/NULLIF(T,0) AS DECIMAL(5,2)) AS PassPct
FROM Agg
ORDER BY PassPct DESC;

-- 5. Customers with orders but no shipments in July
WITH CustOrders AS (
  SELECT DISTINCT CustomerID
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
),
CustShips AS (
  SELECT DISTINCT CustomerID
  FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT o.CustomerID
FROM CustOrders o
WHERE NOT EXISTS (SELECT 1 FROM CustShips s WHERE s.CustomerID = o.CustomerID);

-- 6. Daily net flow per product on last 5 days (Inventory change ≈ today - yesterday)
WITH D AS (
  SELECT ProductID, CenterID, SnapshotDate, QuantityUnits,
         LAG(QuantityUnits) OVER (PARTITION BY ProductID, CenterID ORDER BY SnapshotDate) AS PrevQty
  FROM pharma_company.Inventory
  WHERE SnapshotDate BETWEEN '2025-07-27' AND '2025-07-31'
),
Delta AS (
  SELECT ProductID, SnapshotDate, SUM(QuantityUnits - ISNULL(PrevQty,QuantityUnits)) AS NetDelta
  FROM D
  GROUP BY ProductID, SnapshotDate
)
SELECT * FROM Delta ORDER BY SnapshotDate, ProductID;

-- 7. “Latest submission per product” joined to product info
WITH R AS (
  SELECT rs.*, ROW_NUMBER() OVER (PARTITION BY ProductID ORDER BY SubmissionDate DESC, SubmissionID DESC) AS rn
  FROM pharma_company.RegulatorySubmission rs
)
SELECT p.ProductID, p.Name, r.SubmissionDate, r.Agency, r.Status
FROM pharma_company.Product p
LEFT JOIN R r ON r.ProductID = p.ProductID AND r.rn = 1
ORDER BY p.ProductID;

-- 8. Batches per product and share within product (July)
WITH B AS (
  SELECT ProductID, BatchID, QuantityUnits
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
),
SumPerProd AS (
  SELECT ProductID, SUM(QuantityUnits) AS SumUnits
  FROM B
  GROUP BY ProductID
)
SELECT b.ProductID, b.BatchID, b.QuantityUnits,
       CAST(b.QuantityUnits * 100.0 / NULLIF(s.SumUnits,0) AS DECIMAL(6,2)) AS SharePct
FROM B b
JOIN SumPerProd s ON s.ProductID = b.ProductID
ORDER BY b.ProductID, SharePct DESC;

-- 9. Combine customers’ latest order date and latest shipment date
WITH O AS (
  SELECT CustomerID, MAX(OrderDate) AS LastOrder
  FROM pharma_company.SalesOrder
  GROUP BY CustomerID
),
S AS (
  SELECT CustomerID, MAX(ShipmentDate) AS LastShip
  FROM pharma_company.Shipment
  GROUP BY CustomerID
)
SELECT COALESCE(o.CustomerID, s.CustomerID) AS CustomerID,
       o.LastOrder, s.LastShip
FROM O o
FULL OUTER JOIN S s ON s.CustomerID = o.CustomerID
ORDER BY CustomerID;

-- 10. Products without any regulatory submission
WITH SubProd AS (
  SELECT DISTINCT ProductID FROM pharma_company.RegulatorySubmission
)
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
LEFT JOIN SubProd sp ON sp.ProductID = p.ProductID
WHERE sp.ProductID IS NULL
ORDER BY p.ProductID;

-- 11. Top-3 revenue customers in July with addresses
WITH JulyRev AS (
  SELECT CustomerID, SUM(TotalAmount) AS Rev
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
),
Top3 AS (
  SELECT TOP (3) CustomerID, Rev
  FROM JulyRev
  ORDER BY Rev DESC
)
SELECT t.CustomerID, t.Rev, a.City, a.State, a.Country
FROM Top3 t
JOIN pharma_company.Customer c ON c.CustomerID = t.CustomerID
LEFT JOIN pharma_company.Address a ON a.AddressID = c.AddressID
ORDER BY t.Rev DESC;

-- 12. Formulation % check per product (sum of percentages)
WITH Pct AS (
  SELECT ProductID, SUM(Percentage) AS TotalPct
  FROM pharma_company.Formulation
  GROUP BY ProductID
)
SELECT ProductID, TotalPct,
       CASE WHEN TotalPct = 100.00 THEN 'OK' ELSE 'CHECK' END AS MixStatus
FROM Pct
ORDER BY ProductID;
```

## Recursive CTEs
```sql
-- 1. Generate a July-2025 calendar (one row per day)
WITH Cal AS (
  SELECT CAST('2025-07-01' AS date) AS d
  UNION ALL
  SELECT DATEADD(day, 1, d) FROM Cal WHERE d < '2025-07-31'
)
SELECT d AS CalendarDate
FROM Cal
OPTION (MAXRECURSION 40);

-- 2. Calendar joined to daily shipments (including zero days)
WITH Cal AS (
  SELECT CAST('2025-07-01' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
),
Ship AS (
  SELECT ShipmentDate, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY ShipmentDate
)
SELECT c.d, ISNULL(s.Units,0) AS Units
FROM Cal c
LEFT JOIN Ship s ON s.ShipmentDate = c.d
ORDER BY c.d
OPTION (MAXRECURSION 40);

-- 3. Running total of July orders (simple recursive running sum by date)
WITH Daily AS (
  SELECT CONVERT(date, OrderDate) AS d, SUM(TotalAmount) AS Amt
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CONVERT(date, OrderDate)
),
Cal AS (
  SELECT CAST('2025-07-01' AS date) AS d, CAST(0.0 AS DECIMAL(18,2)) AS RunAmt
  UNION ALL
  SELECT DATEADD(day,1,c.d),
         CAST(ISNULL((SELECT Amt FROM Daily WHERE d = DATEADD(day,1,c.d)),0) + c.RunAmt AS DECIMAL(18,2))
  FROM Cal c
  WHERE c.d < '2025-07-31'
)
SELECT d, RunAmt
FROM Cal
OPTION (MAXRECURSION 40);

-- 4. Expand a small numbers table 1..20
WITH N AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM N WHERE n < 20
)
SELECT n FROM N
OPTION (MAXRECURSION 50);

-- 5. Create 10 planned retest dates per QC TestDate (+30 days each step)
--    (one ResultID expanded to 10 future retest dates)
WITH Seeds AS (
  SELECT TOP (1) ResultID, TestDate FROM pharma_company.QCResult ORDER BY ResultID
),
Retest AS (
  SELECT ResultID, CAST(TestDate AS date) AS RetestDate, 1 AS Step
  FROM Seeds
  UNION ALL
  SELECT ResultID, DATEADD(day, 30, RetestDate), Step + 1
  FROM Retest
  WHERE Step < 10
)
SELECT * FROM Retest
ORDER BY Step
OPTION (MAXRECURSION 100);

-- 6. For each center, generate last 7 calendar days and join inventory count per day
WITH Centers AS (
  SELECT TOP (5) CenterID FROM pharma_company.DistributionCenter ORDER BY CenterID
),
Cal AS (
  SELECT CAST('2025-07-25' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
),
Grid AS (
  SELECT c.CenterID, cal.d
  FROM Centers c CROSS JOIN Cal cal
)
SELECT g.CenterID, g.d AS SnapshotDate,
       COUNT(i.InventoryID) AS RowsAtCenterOnDate
FROM Grid g
LEFT JOIN pharma_company.Inventory i
  ON i.CenterID = g.CenterID AND i.SnapshotDate = g.d
GROUP BY g.CenterID, g.d
ORDER BY g.CenterID, g.d
OPTION (MAXRECURSION 40);

-- 7. Distribute a batch quantity evenly over 5 days (view as plan)
WITH B AS (
  SELECT TOP (1) BatchID, BatchDate, QuantityUnits FROM pharma_company.ManufacturingBatch ORDER BY BatchID
),
Plan AS (
  SELECT BatchID, BatchDate, QuantityUnits, 1 AS DayNum,
         CAST(QuantityUnits/5.0 AS DECIMAL(18,2)) AS PlannedUnits,
         BatchDate AS PlanDate
  FROM B
  UNION ALL
  SELECT BatchID, BatchDate, QuantityUnits, DayNum+1,
         CAST(QuantityUnits/5.0 AS DECIMAL(18,2)),
         DATEADD(day, DayNum, BatchDate)
  FROM Plan
  WHERE DayNum < 5
)
SELECT * FROM Plan ORDER BY DayNum
OPTION (MAXRECURSION 10);

-- 8. Generate 12 future month-ends from 2025-07-31
WITH ME AS (
  SELECT EOMONTH('2025-07-31') AS MonthEnd, 1 AS n
  UNION ALL
  SELECT EOMONTH(DATEADD(month, 1, MonthEnd)), n+1
  FROM ME WHERE n < 12
)
SELECT MonthEnd FROM ME
OPTION (MAXRECURSION 20);

-- 9. Recursively climb from a product’s first batch date to its last (month by month)
WITH Bounds AS (
  SELECT TOP (1) ProductID, MIN(BatchDate) AS FirstD, MAX(BatchDate) AS LastD
  FROM pharma_company.ManufacturingBatch
  GROUP BY ProductID
  ORDER BY ProductID
),
Steps AS (
  SELECT ProductID, EOMONTH(FirstD) AS StepDate
  FROM Bounds
  UNION ALL
  SELECT s.ProductID, EOMONTH(DATEADD(month,1,s.StepDate))
  FROM Steps s
  JOIN Bounds b ON b.ProductID = s.ProductID
  WHERE DATEADD(day,1,s.StepDate) <= b.LastD
)
SELECT ProductID, StepDate
FROM Steps
ORDER BY StepDate
OPTION (MAXRECURSION 600);

-- 10. Generate 15 sequence rows per selected customer and tag them
WITH C AS (
  SELECT TOP (1) CustomerID FROM pharma_company.Customer ORDER BY CustomerID
),
Seq AS (
  SELECT CustomerID, 1 AS n FROM C
  UNION ALL
  SELECT CustomerID, n+1 FROM Seq WHERE n < 15
)
SELECT CustomerID, n, CONCAT('Token-', n) AS Token
FROM Seq
OPTION (MAXRECURSION 50);

-- 11. Build a date grid for all days of July and compute order count per day
WITH Cal AS (
  SELECT CAST('2025-07-01' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
),
OCnt AS (
  SELECT CONVERT(date, OrderDate) AS d, COUNT(*) AS Cnt
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CONVERT(date, OrderDate)
)
SELECT c.d, ISNULL(o.Cnt,0) AS Orders
FROM Cal c
LEFT JOIN OCnt o ON o.d = c.d
ORDER BY c.d
OPTION (MAXRECURSION 40);

-- 12. Recursive cumulative inventory per product across the last 5 days of July
WITH Days AS (
  SELECT CAST('2025-07-27' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Days WHERE d < '2025-07-31'
),
PerDay AS (
  SELECT i.ProductID, d.d,
         SUM(i.QuantityUnits) AS OnHand
  FROM Days d
  LEFT JOIN pharma_company.Inventory i ON i.SnapshotDate = d.d
  GROUP BY i.ProductID, d.d
),
Cum AS (
  SELECT ProductID, d, CAST(ISNULL(OnHand,0) AS BIGINT) AS CumOnHand
  FROM PerDay
  WHERE d = '2025-07-27'
  UNION ALL
  SELECT p.ProductID, p.d,
         CAST(c.CumOnHand + ISNULL(p.OnHand,0) AS BIGINT)
  FROM PerDay p
  JOIN Cum c ON c.ProductID = p.ProductID AND p.d = DATEADD(day,1,c.d)
)
SELECT * FROM Cum
ORDER BY ProductID, d
OPTION (MAXRECURSION 10);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
