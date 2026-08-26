![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Running total of sales amount by customer in July 2025 (by OrderDate)
SELECT
  SalesOrderID, CustomerID, OrderDate, TotalAmount,
  SUM(TotalAmount) OVER (PARTITION BY CustomerID
                         ORDER BY OrderDate, SalesOrderID
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningAmount_Cust
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 2. Daily total shipments + share of day per shipment (per day)
SELECT
  ShipmentDate, ShipmentID, CenterID, QuantityUnits,
  SUM(QuantityUnits) OVER (PARTITION BY ShipmentDate) AS DayUnits,
  CAST(QuantityUnits * 1.0 /
       NULLIF(SUM(QuantityUnits) OVER (PARTITION BY ShipmentDate),0) AS DECIMAL(10,4)) AS ShareOfDay
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Average batch size per product (window) next to each batch
SELECT
  b.BatchID, b.ProductID, b.BatchDate, b.QuantityUnits,
  AVG(CAST(b.QuantityUnits AS DECIMAL(18,2))) OVER (PARTITION BY b.ProductID) AS AvgBatchPerProduct
FROM pharma_company.ManufacturingBatch b
WHERE b.BatchDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Count of QC results per batch (window) printed on each row
SELECT
  r.ResultID, r.BatchID, r.TestID, r.TestDate,
  COUNT(*) OVER (PARTITION BY r.BatchID, r.BatchDate) AS QCCountPerBatch
FROM pharma_company.QCResult r
WHERE r.TestDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Max order value per customer (window) alongside each order
SELECT
  SalesOrderID, CustomerID, OrderDate, TotalAmount,
  MAX(TotalAmount) OVER (PARTITION BY CustomerID) AS MaxOrderForCustomer
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 6. Rolling 7-day sum of shipments per center (by date)
SELECT
  CenterID, ShipmentDate, QuantityUnits,
  SUM(QuantityUnits) OVER (PARTITION BY CenterID
                           ORDER BY ShipmentDate
                           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS Rolling7DayUnits
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 7. Rank-style dense count of distinct shipment days per center (windowed count distinct via separate step)
WITH D AS (
  SELECT DISTINCT CenterID, ShipmentDate FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT
  CenterID, ShipmentDate,
  COUNT(*) OVER (PARTITION BY CenterID) AS DaysShippedInJuly
FROM D;

-- 8. Percent of monthly revenue by customer (July 2025)
WITH O AS (
  SELECT * FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT
  CustomerID, SalesOrderID, TotalAmount,
  CAST(TotalAmount * 100.0 /
       NULLIF(SUM(TotalAmount) OVER (),0) AS DECIMAL(6,2)) AS PctOfJulyRevenue
FROM O;

-- 9. Min/Max inventory per product across centers on 2025-07-31 (window)
SELECT
  ProductID, CenterID, SnapshotDate, QuantityUnits,
  MIN(QuantityUnits) OVER (PARTITION BY ProductID) AS MinAcrossCenters,
  MAX(QuantityUnits) OVER (PARTITION BY ProductID) AS MaxAcrossCenters
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31';

-- 10. Running count of orders per customer by date
SELECT
  SalesOrderID, CustomerID, OrderDate,
  COUNT(*) OVER (PARTITION BY CustomerID
                 ORDER BY OrderDate, SalesOrderID
                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningOrderCount
FROM pharma_company.SalesOrder;
```

## ROW_NUMBER()
```sql
-- 1. Number each customer’s orders by recency (latest first)
SELECT
  CustomerID, SalesOrderID, OrderDate, TotalAmount,
  ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY OrderDate DESC, SalesOrderID DESC) AS rn
FROM pharma_company.SalesOrder;

-- 2. First inventory row per product on 2025-07-31 (smallest CenterID)
WITH R AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY ProductID ORDER BY CenterID) AS rn
  FROM pharma_company.Inventory
  WHERE SnapshotDate = '2025-07-31'
)
SELECT * FROM R WHERE rn = 1;

-- 3. Top-1 latest batch per product
WITH R AS (
  SELECT b.*,
         ROW_NUMBER() OVER (PARTITION BY b.ProductID ORDER BY b.BatchDate DESC, b.BatchID DESC) AS rn
  FROM pharma_company.ManufacturingBatch b
)
SELECT * FROM R WHERE rn = 1;

-- 4. First regulatory submission per product by date
WITH R AS (
  SELECT rs.*,
         ROW_NUMBER() OVER (PARTITION BY ProductID ORDER BY SubmissionDate, SubmissionID) AS rn
  FROM pharma_company.RegulatorySubmission rs
)
SELECT * FROM R WHERE rn = 1;

-- 5. First 3 orders per customer in July 2025
WITH R AS (
  SELECT so.*,
         ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS rn
  FROM pharma_company.SalesOrder so
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT * FROM R WHERE rn <= 3;

-- 6. Latest QC result per batch
WITH R AS (
  SELECT r.*,
         ROW_NUMBER() OVER (PARTITION BY r.BatchID, r.BatchDate ORDER BY r.TestDate DESC, r.ResultID DESC) AS rn
  FROM pharma_company.QCResult r
)
SELECT * FROM R WHERE rn = 1;

-- 7. First shipment per customer (overall)
WITH R AS (
  SELECT s.*,
         ROW_NUMBER() OVER (PARTITION BY s.CustomerID ORDER BY s.ShipmentDate, s.ShipmentID) AS rn
  FROM pharma_company.Shipment s
)
SELECT * FROM R WHERE rn = 1;

-- 8. Latest supplier rows (by UpdatedAt) numbered
SELECT
  s.SupplierID, s.Name, s.UpdatedAt,
  ROW_NUMBER() OVER (ORDER BY s.UpdatedAt DESC, s.SupplierID DESC) AS rn
FROM pharma_company.Supplier s;

-- 9. Top 5 shipments per center by units on 2025-07-31
WITH R AS (
  SELECT s.*,
         ROW_NUMBER() OVER (PARTITION BY s.CenterID ORDER BY s.QuantityUnits DESC, s.ShipmentID) AS rn
  FROM pharma_company.Shipment s
  WHERE s.ShipmentDate = '2025-07-31'
)
SELECT * FROM R WHERE rn <= 5;

-- 10. First QC test run per TestID in July 2025
WITH R AS (
  SELECT r.*,
         ROW_NUMBER() OVER (PARTITION BY r.TestID ORDER BY r.TestDate, r.ResultID) AS rn
  FROM pharma_company.QCResult r
  WHERE r.TestDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT * FROM R WHERE rn = 1;
```

## RANK()
```sql
-- 1. Rank customers by total July revenue (ties keep same rank)
WITH S AS (
  SELECT CustomerID, SUM(TotalAmount) AS JulyRevenue
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
)
SELECT
  CustomerID, JulyRevenue,
  RANK() OVER (ORDER BY JulyRevenue DESC) AS RevenueRank
FROM S;

-- 2. Rank products by total batches produced in July
WITH B AS (
  SELECT ProductID, SUM(QuantityUnits) AS Units
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY ProductID
)
SELECT ProductID, Units, RANK() OVER (ORDER BY Units DESC) AS ProdRank
FROM B;

-- 3. Per-center daily shipment units ranked (2025-07-31)
WITH D AS (
  SELECT CenterID, ShipmentID, QuantityUnits
  FROM pharma_company.Shipment
  WHERE ShipmentDate = '2025-07-31'
)
SELECT CenterID, ShipmentID, QuantityUnits,
       RANK() OVER (PARTITION BY CenterID ORDER BY QuantityUnits DESC) AS RankInCenter
FROM D;

-- 4. Rank tests by number of failures in July
WITH F AS (
  SELECT TestID, SUM(CASE WHEN PassFail='F' THEN 1 ELSE 0 END) AS Failures
  FROM pharma_company.QCResult
  WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY TestID
)
SELECT TestID, Failures, RANK() OVER (ORDER BY Failures DESC) AS FailRank
FROM F;

-- 5. Rank customers by total units shipped overall
WITH T AS (
  SELECT CustomerID, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  GROUP BY CustomerID
)
SELECT CustomerID, Units, RANK() OVER (ORDER BY Units DESC) AS ShipRank
FROM T;

-- 6. Rank products by total on-hand (2025-07-31)
WITH I AS (
  SELECT ProductID, SUM(QuantityUnits) AS OnHand
  FROM pharma_company.Inventory
  WHERE SnapshotDate='2025-07-31'
  GROUP BY ProductID
)
SELECT ProductID, OnHand, RANK() OVER (ORDER BY OnHand DESC) AS OnHandRank
FROM I;

-- 7. Rank agencies by submissions count
WITH A AS (
  SELECT Agency, COUNT(*) AS Cnt
  FROM pharma_company.RegulatorySubmission
  GROUP BY Agency
)
SELECT Agency, Cnt, RANK() OVER (ORDER BY Cnt DESC) AS AgencyRank
FROM A;

-- 8. Rank customers by their single largest order (July)
WITH O AS (
  SELECT CustomerID, MAX(TotalAmount) AS MaxOrder
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
)
SELECT CustomerID, MaxOrder, RANK() OVER (ORDER BY MaxOrder DESC) AS MaxOrderRank
FROM O;

-- 9. Rank centers by total shipments in July
WITH C AS (
  SELECT CenterID, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CenterID
)
SELECT CenterID, Units, RANK() OVER (ORDER BY Units DESC) AS CenterRank
FROM C;

-- 10. Rank raw material suppliers by count of materials
WITH S AS (
  SELECT SupplierID, COUNT(*) AS RMCount
  FROM pharma_company.RawMaterial
  GROUP BY SupplierID
)
SELECT SupplierID, RMCount, RANK() OVER (ORDER BY RMCount DESC) AS SupplierRank
FROM S;
```

## DENSE_RANK()
```sql
-- 1. Dense rank products by batch units in July
WITH B AS (
  SELECT ProductID, SUM(QuantityUnits) AS Units
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY ProductID
)
SELECT ProductID, Units, DENSE_RANK() OVER (ORDER BY Units DESC) AS DRank
FROM B;

-- 2. Dense rank customers by July revenue
WITH Rv AS (
  SELECT CustomerID, SUM(TotalAmount) AS Rev
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
)
SELECT CustomerID, Rev, DENSE_RANK() OVER (ORDER BY Rev DESC) AS DRevRank
FROM Rv;

-- 3. Dense rank test IDs by failure count in July
WITH F AS (
  SELECT TestID, SUM(CASE WHEN PassFail='F' THEN 1 ELSE 0 END) AS Failures
  FROM pharma_company.QCResult
  WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY TestID
)
SELECT TestID, Failures, DENSE_RANK() OVER (ORDER BY Failures DESC) AS DFailRank
FROM F;

-- 4. Dense rank centers by shipments on 2025-07-31
WITH D AS (
  SELECT CenterID, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  WHERE ShipmentDate='2025-07-31'
  GROUP BY CenterID
)
SELECT CenterID, Units, DENSE_RANK() OVER (ORDER BY Units DESC) AS DCenterRank
FROM D;

-- 5. Dense rank customers by max single order (overall)
WITH M AS (
  SELECT CustomerID, MAX(TotalAmount) AS MaxOrder
  FROM pharma_company.SalesOrder
  GROUP BY CustomerID
)
SELECT CustomerID, MaxOrder, DENSE_RANK() OVER (ORDER BY MaxOrder DESC) AS DMaxOrderRank
FROM M;

-- 6. Dense rank products by on-hand (2025-07-31)
WITH I AS (
  SELECT ProductID, SUM(QuantityUnits) AS OnHand
  FROM pharma_company.Inventory
  WHERE SnapshotDate='2025-07-31'
  GROUP BY ProductID
)
SELECT ProductID, OnHand, DENSE_RANK() OVER (ORDER BY OnHand DESC) AS DOnHandRank
FROM I;

-- 7. Dense rank agencies by submissions in July only
WITH A AS (
  SELECT Agency, COUNT(*) AS Cnt
  FROM pharma_company.RegulatorySubmission
  WHERE SubmissionDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY Agency
)
SELECT Agency, Cnt, DENSE_RANK() OVER (ORDER BY Cnt DESC) AS DAgencyRank
FROM A;

-- 8. Dense rank batches within product by size (July)
WITH B AS (
  SELECT ProductID, BatchID, QuantityUnits
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT ProductID, BatchID, QuantityUnits,
       DENSE_RANK() OVER (PARTITION BY ProductID ORDER BY QuantityUnits DESC) AS RankInProduct
FROM B;

-- 9. Dense rank customers by total shipped units overall
WITH S AS (
  SELECT CustomerID, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  GROUP BY CustomerID
)
SELECT CustomerID, Units, DENSE_RANK() OVER (ORDER BY Units DESC) AS DShipRank
FROM S;

-- 10. Dense rank centers by distinct shipment days in July
WITH D AS (
  SELECT CenterID, COUNT(DISTINCT ShipmentDate) AS ShipDays
  FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CenterID
)
SELECT CenterID, ShipDays, DENSE_RANK() OVER (ORDER BY ShipDays DESC) AS DDaysRank
FROM D;
```

## NTILE(n)
```sql
-- 1. Quartiles of customers by July revenue
WITH Rv AS (
  SELECT CustomerID, SUM(TotalAmount) AS JulyRevenue
  FROM pharma_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CustomerID
)
SELECT CustomerID, JulyRevenue, NTILE(4) OVER (ORDER BY JulyRevenue DESC) AS RevenueQuartile
FROM Rv;

-- 2. Deciles of products by July batch units
WITH B AS (
  SELECT ProductID, SUM(QuantityUnits) AS Units
  FROM pharma_company.ManufacturingBatch
  WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY ProductID
)
SELECT ProductID, Units, NTILE(10) OVER (ORDER BY Units DESC) AS Decile
FROM B;

-- 3. Tertiles of centers by shipments in July
WITH C AS (
  SELECT CenterID, SUM(QuantityUnits) AS Units
  FROM pharma_company.Shipment
  WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY CenterID
)
SELECT CenterID, Units, NTILE(3) OVER (ORDER BY Units DESC) AS Tier
FROM C;

-- 4. Quartiles of orders by value in July
SELECT
  SalesOrderID, CustomerID, TotalAmount,
  NTILE(4) OVER (ORDER BY TotalAmount DESC) AS ValueQuartile
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Quintiles of inventory per product-center on 2025-07-31
SELECT
  ProductID, CenterID, QuantityUnits,
  NTILE(5) OVER (PARTITION BY ProductID ORDER BY QuantityUnits DESC) AS QuintileInProduct
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31';

-- 6. Quartiles of shipments per customer by units (July)
SELECT
  CustomerID, ShipmentID, QuantityUnits,
  NTILE(4) OVER (PARTITION BY CustomerID ORDER BY QuantityUnits DESC) AS QuartilePerCustomer
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 7. Quartiles of batches per product by size (July)
SELECT
  ProductID, BatchID, QuantityUnits,
  NTILE(4) OVER (PARTITION BY ProductID ORDER BY QuantityUnits DESC) AS BatchQuartile
FROM pharma_company.ManufacturingBatch
WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 8. NTILE(2): split agencies by total submissions (all time)
WITH A AS (
  SELECT Agency, COUNT(*) AS Cnt
  FROM pharma_company.RegulatorySubmission
  GROUP BY Agency
)
SELECT Agency, Cnt, NTILE(2) OVER (ORDER BY Cnt DESC) AS Half
FROM A;

-- 9. NTILE(6): six buckets of order values overall
SELECT
  SalesOrderID, TotalAmount,
  NTILE(6) OVER (ORDER BY TotalAmount DESC) AS Sextile
FROM pharma_company.SalesOrder;

-- 10. NTILE(4): split QC failure counts per test (July)
WITH F AS (
  SELECT TestID, SUM(CASE WHEN PassFail='F' THEN 1 ELSE 0 END) AS Fails
  FROM pharma_company.QCResult
  WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY TestID
)
SELECT TestID, Fails, NTILE(4) OVER (ORDER BY Fails DESC) AS FailQuartile
FROM F;
```

## LAG()
```sql
-- 1. Previous day’s shipments per center (by date)
SELECT
  CenterID, ShipmentDate, SUM(QuantityUnits) AS DayUnits,
  LAG(SUM(QuantityUnits)) OVER (PARTITION BY CenterID ORDER BY ShipmentDate) AS PrevDayUnits
FROM pharma_company.Shipment
GROUP BY CenterID, ShipmentDate;

-- 2. Previous order value per customer
SELECT
  CustomerID, SalesOrderID, OrderDate, TotalAmount,
  LAG(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS PrevOrderAmount
FROM pharma_company.SalesOrder;

-- 3. Previous batch size per product
SELECT
  ProductID, BatchID, BatchDate, QuantityUnits,
  LAG(QuantityUnits) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID) AS PrevBatchUnits
FROM pharma_company.ManufacturingBatch;

-- 4. QC result previous Pass/Fail within batch
SELECT
  BatchID, BatchDate, ResultID, TestDate, PassFail,
  LAG(PassFail) OVER (PARTITION BY BatchID, BatchDate ORDER BY TestDate, ResultID) AS PrevPassFail
FROM pharma_company.QCResult;

-- 5. Previous inventory per center-product
SELECT
  CenterID, ProductID, SnapshotDate, QuantityUnits,
  LAG(QuantityUnits) OVER (PARTITION BY CenterID, ProductID ORDER BY SnapshotDate) AS PrevQty
FROM pharma_company.Inventory;

-- 6. Previous shipment for a customer (units)
SELECT
  CustomerID, ShipmentID, ShipmentDate, QuantityUnits,
  LAG(QuantityUnits) OVER (PARTITION BY CustomerID ORDER BY ShipmentDate, ShipmentID) AS PrevUnits
FROM pharma_company.Shipment;

-- 7. Previous submission status per product
SELECT
  ProductID, SubmissionID, SubmissionDate, Status,
  LAG(Status) OVER (PARTITION BY ProductID ORDER BY SubmissionDate, SubmissionID) AS PrevStatus
FROM pharma_company.RegulatorySubmission;

-- 8. Previous supplier update time (global)
SELECT
  SupplierID, UpdatedAt,
  LAG(UpdatedAt) OVER (ORDER BY UpdatedAt, SupplierID) AS PrevUpdatedAt
FROM pharma_company.Supplier;

-- 9. Previous order date per customer and gap days
SELECT
  CustomerID, SalesOrderID, OrderDate,
  LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS PrevOrderDate,
  DATEDIFF(day, LAG(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID), OrderDate) AS GapDays
FROM pharma_company.SalesOrder;

-- 10. Compare batch-to-batch delta per product
SELECT
  ProductID, BatchID, BatchDate, QuantityUnits,
  QuantityUnits - LAG(QuantityUnits) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID) AS DeltaFromPrev
FROM pharma_company.ManufacturingBatch;
```

## LEAD()
```sql
-- 1. Next day’s shipments per center (by date)
SELECT
  CenterID, ShipmentDate, SUM(QuantityUnits) AS DayUnits,
  LEAD(SUM(QuantityUnits)) OVER (PARTITION BY CenterID ORDER BY ShipmentDate) AS NextDayUnits
FROM pharma_company.Shipment
GROUP BY CenterID, ShipmentDate;

-- 2. Next order value per customer
SELECT
  CustomerID, SalesOrderID, OrderDate, TotalAmount,
  LEAD(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS NextOrderAmount
FROM pharma_company.SalesOrder;

-- 3. Next batch size per product
SELECT
  ProductID, BatchID, BatchDate, QuantityUnits,
  LEAD(QuantityUnits) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID) AS NextBatchUnits
FROM pharma_company.ManufacturingBatch;

-- 4. QC result next Pass/Fail within batch
SELECT
  BatchID, BatchDate, ResultID, TestDate, PassFail,
  LEAD(PassFail) OVER (PARTITION BY BatchID, BatchDate ORDER BY TestDate, ResultID) AS NextPassFail
FROM pharma_company.QCResult;

-- 5. Next inventory per center-product
SELECT
  CenterID, ProductID, SnapshotDate, QuantityUnits,
  LEAD(QuantityUnits) OVER (PARTITION BY CenterID, ProductID ORDER BY SnapshotDate) AS NextQty
FROM pharma_company.Inventory;

-- 6. Next shipment for a customer (units)
SELECT
  CustomerID, ShipmentID, ShipmentDate, QuantityUnits,
  LEAD(QuantityUnits) OVER (PARTITION BY CustomerID ORDER BY ShipmentDate, ShipmentID) AS NextUnits
FROM pharma_company.Shipment;

-- 7. Next submission status per product
SELECT
  ProductID, SubmissionID, SubmissionDate, Status,
  LEAD(Status) OVER (PARTITION BY ProductID ORDER BY SubmissionDate, SubmissionID) AS NextStatus
FROM pharma_company.RegulatorySubmission;

-- 8. Next supplier update time (global)
SELECT
  SupplierID, UpdatedAt,
  LEAD(UpdatedAt) OVER (ORDER BY UpdatedAt, SupplierID) AS NextUpdatedAt
FROM pharma_company.Supplier;

-- 9. Days until next order per customer
SELECT
  CustomerID, SalesOrderID, OrderDate,
  LEAD(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID) AS NextOrderDate,
  DATEDIFF(day, OrderDate,
           LEAD(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID)) AS DaysUntilNext
FROM pharma_company.SalesOrder;

-- 10. Predict next-day inventory change (simple diff)
SELECT
  CenterID, ProductID, SnapshotDate, QuantityUnits,
  LEAD(QuantityUnits) OVER (PARTITION BY CenterID, ProductID ORDER BY SnapshotDate) - QuantityUnits AS NextDayDelta
FROM pharma_company.Inventory;
```

## FIRST_VALUE()
```sql
-- 1. First order date per customer (shown on each order)
SELECT
  CustomerID, SalesOrderID, OrderDate,
  FIRST_VALUE(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID
                               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstOrderDate
FROM pharma_company.SalesOrder;

-- 2. First shipment units per customer
SELECT
  CustomerID, ShipmentID, ShipmentDate, QuantityUnits,
  FIRST_VALUE(QuantityUnits) OVER (PARTITION BY CustomerID ORDER BY ShipmentDate, ShipmentID
                                   ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstShipUnits
FROM pharma_company.Shipment;

-- 3. First batch size per product (overall order)
SELECT
  ProductID, BatchID, BatchDate, QuantityUnits,
  FIRST_VALUE(QuantityUnits) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID
                                   ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstBatchUnits
FROM pharma_company.ManufacturingBatch;

-- 4. First QC result (by date) per batch
SELECT
  BatchID, BatchDate, ResultID, TestDate, PassFail,
  FIRST_VALUE(ResultID) OVER (PARTITION BY BatchID, BatchDate ORDER BY TestDate, ResultID
                              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstResultID
FROM pharma_company.QCResult;

-- 5. First inventory quantity per center-product
SELECT
  CenterID, ProductID, SnapshotDate, QuantityUnits,
  FIRST_VALUE(QuantityUnits) OVER (
     PARTITION BY CenterID, ProductID
     ORDER BY SnapshotDate
     ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstQty
FROM pharma_company.Inventory;

-- 6. First submission status per product
SELECT
  ProductID, SubmissionID, SubmissionDate, Status,
  FIRST_VALUE(Status) OVER (PARTITION BY ProductID ORDER BY SubmissionDate, SubmissionID
                            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstStatus
FROM pharma_company.RegulatorySubmission;

-- 7. First order amount per customer (with ties handled by SalesOrderID)
SELECT
  CustomerID, SalesOrderID, TotalAmount,
  FIRST_VALUE(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstAmount
FROM pharma_company.SalesOrder;

-- 8. First batch date per product
SELECT
  ProductID, BatchID, BatchDate,
  FIRST_VALUE(BatchDate) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID
                               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstBatchDate
FROM pharma_company.ManufacturingBatch;

-- 9. First shipment date per center
SELECT
  CenterID, ShipmentID, ShipmentDate,
  FIRST_VALUE(ShipmentDate) OVER (PARTITION BY CenterID ORDER BY ShipmentDate, ShipmentID
                                  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstShipDate
FROM pharma_company.Shipment;

-- 10. First QC Pass/Fail per TestID in July
SELECT
  TestID, ResultID, TestDate, PassFail,
  FIRST_VALUE(PassFail) OVER (PARTITION BY TestID ORDER BY TestDate, ResultID
                              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstOutcome
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31';
```

## LAST_VALUE()
```sql
-- 1. Last order date per customer (on each order)
SELECT
  CustomerID, SalesOrderID, OrderDate,
  LAST_VALUE(OrderDate) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID
                              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastOrderDate
FROM pharma_company.SalesOrder;

-- 2. Last shipment units per customer
SELECT
  CustomerID, ShipmentID, ShipmentDate, QuantityUnits,
  LAST_VALUE(QuantityUnits) OVER (PARTITION BY CustomerID ORDER BY ShipmentDate, ShipmentID
                                  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastShipUnits
FROM pharma_company.Shipment;

-- 3. Last batch size per product
SELECT
  ProductID, BatchID, BatchDate, QuantityUnits,
  LAST_VALUE(QuantityUnits) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID
                                  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastBatchUnits
FROM pharma_company.ManufacturingBatch;

-- 4. Last QC result ID per batch
SELECT
  BatchID, BatchDate, ResultID, TestDate,
  LAST_VALUE(ResultID) OVER (PARTITION BY BatchID, BatchDate ORDER BY TestDate, ResultID
                             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastResultID
FROM pharma_company.QCResult;

-- 5. Last inventory quantity per center-product
SELECT
  CenterID, ProductID, SnapshotDate, QuantityUnits,
  LAST_VALUE(QuantityUnits) OVER (
     PARTITION BY CenterID, ProductID
     ORDER BY SnapshotDate
     ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastQty
FROM pharma_company.Inventory;

-- 6. Last submission status per product
SELECT
  ProductID, SubmissionID, SubmissionDate, Status,
  LAST_VALUE(Status) OVER (PARTITION BY ProductID ORDER BY SubmissionDate, SubmissionID
                           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastStatus
FROM pharma_company.RegulatorySubmission;

-- 7. Last order amount per customer
SELECT
  CustomerID, SalesOrderID, TotalAmount,
  LAST_VALUE(TotalAmount) OVER (PARTITION BY CustomerID ORDER BY OrderDate, SalesOrderID
                                ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastAmount
FROM pharma_company.SalesOrder;

-- 8. Last batch date per product
SELECT
  ProductID, BatchID, BatchDate,
  LAST_VALUE(BatchDate) OVER (PARTITION BY ProductID ORDER BY BatchDate, BatchID
                              ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastBatchDate
FROM pharma_company.ManufacturingBatch;

-- 9. Last shipment date per center
SELECT
  CenterID, ShipmentID, ShipmentDate,
  LAST_VALUE(ShipmentDate) OVER (PARTITION BY CenterID ORDER BY ShipmentDate, ShipmentID
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastShipDate
FROM pharma_company.Shipment;

-- 10. Last QC outcome per TestID in July
SELECT
  TestID, ResultID, TestDate, PassFail,
  LAST_VALUE(PassFail) OVER (PARTITION BY TestID ORDER BY TestDate, ResultID
                             ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastOutcome
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
