![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Count all products
SELECT COUNT(*) AS ProductCount
FROM pharma_company.Product;

-- 2. Count tablets vs other formulations
SELECT Formulation, COUNT(*) AS Cnt
FROM pharma_company.Product
GROUP BY Formulation;

-- 3. Count batches produced in July 2025
SELECT COUNT(*) AS JulyBatchCount
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01';

-- 4. Count distinct products that had batches in July 2025
SELECT COUNT(DISTINCT ProductID) AS DistinctProductsWithJulyBatches
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01';

-- 5. Count QC results by pass/fail in July 2025
SELECT PassFail, COUNT(*) AS ResultCount
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY PassFail;

-- 6. Count shipments per distribution center in July 2025
SELECT CenterID, COUNT(*) AS Shipments
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID;

-- 7. Count sales orders per customer in July 2025
SELECT CustomerID, COUNT(*) AS OrdersInJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID;

-- 8. Count inventory snapshot rows per day (last 5 days of July)
SELECT SnapshotDate, COUNT(*) AS SnapshotRows
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-27' AND '2025-07-31'
GROUP BY SnapshotDate
ORDER BY SnapshotDate;

-- 9. Count raw materials supplied by each supplier
SELECT SupplierID, COUNT(*) AS RawMaterialsSupplied
FROM pharma_company.RawMaterial
GROUP BY SupplierID;

-- 10. Count regulatory submissions per agency
SELECT Agency, COUNT(*) AS SubmissionCount
FROM pharma_company.RegulatorySubmission
GROUP BY Agency;

-- 11. Count quality tests executed per product in July 2025
SELECT b.ProductID, COUNT(*) AS QCResults
FROM pharma_company.QCResult r
JOIN pharma_company.ManufacturingBatch b
  ON b.BatchID = r.BatchID AND b.BatchDate = r.BatchDate
WHERE r.TestDate >= '2025-07-01' AND r.TestDate < '2025-08-01'
GROUP BY b.ProductID;

-- 12. Count customers by country
SELECT a.Country, COUNT(*) AS CustomersInCountry
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID
GROUP BY a.Country;
```

## Sum
```sql
-- 1. Sum of QuantityUnits shipped in July 2025
SELECT SUM(QuantityUnits) AS UnitsShippedJuly
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01';

-- 2. Sum of TotalAmount per customer in July 2025
SELECT CustomerID, SUM(TotalAmount) AS RevenueJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY RevenueJuly DESC;

-- 3. Sum of TotalUnits per customer (year-to-date)
SELECT CustomerID, SUM(TotalUnits) AS UnitsYTD
FROM pharma_company.SalesOrder
WHERE OrderDate >= DATEFROMPARTS(YEAR('2025-07-31'), 1, 1)
  AND OrderDate <= '2025-07-31'
GROUP BY CustomerID;

-- 4. Total inventory on-hand by product on 2025-07-31
SELECT ProductID, SUM(QuantityUnits) AS OnHandUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
GROUP BY ProductID
ORDER BY OnHandUnits DESC;

-- 5. Total batches’ output per product in July 2025
SELECT ProductID, SUM(QuantityUnits) AS ProducedUnits
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID
ORDER BY ProducedUnits DESC;

-- 6. Total shipments per distribution center per day (last 7 days of July)
SELECT CenterID, ShipmentDate, SUM(QuantityUnits) AS Units
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-25' AND '2025-07-31'
GROUP BY CenterID, ShipmentDate
ORDER BY ShipmentDate, CenterID;

-- 7. Sum of TotalAmount for shipped orders only (Status = 'Shipped')
SELECT SUM(TotalAmount) AS ShippedRevenue
FROM pharma_company.SalesOrder
WHERE Status = N'Shipped';

-- 8. Sum of inventory by center for a specific product (e.g., ProductID = 10)
SELECT CenterID, SUM(QuantityUnits) AS OnHand
FROM pharma_company.Inventory
WHERE ProductID = 10 AND SnapshotDate = '2025-07-31'
GROUP BY CenterID
ORDER BY OnHand DESC;

-- 9. Sum of sales per weekday in July 2025
SELECT DATENAME(weekday, OrderDate) AS WeekdayName, SUM(TotalAmount) AS SalesAmt
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY DATENAME(weekday, OrderDate);

-- 10. Cumulative shipments per customer (overall)
SELECT CustomerID, SUM(QuantityUnits) AS TotalUnitsShipped
FROM pharma_company.Shipment
GROUP BY CustomerID
ORDER BY TotalUnitsShipped DESC;

-- 11. Total QC tests recorded per TestID in July 2025
SELECT TestID, SUM(1) AS TotalResults
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY TestID;

-- 12. Total order units and amount per customer in July 2025
SELECT CustomerID, SUM(TotalUnits) AS Units, SUM(TotalAmount) AS Amount
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY Amount DESC;
```

## Avg
```sql
-- 1. Average shipment size in July 2025
SELECT AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgShipmentUnitsJuly
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01';

-- 2. Average order value (TotalAmount) in July 2025
SELECT AVG(CAST(TotalAmount AS DECIMAL(18,2))) AS AvgOrderValueJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01';

-- 3. Average units per order by customer (July 2025)
SELECT CustomerID, AVG(CAST(TotalUnits AS DECIMAL(18,4))) AS AvgUnitsPerOrder
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID;

-- 4. Average on-hand inventory per product on 2025-07-31
SELECT ProductID, AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgOnHandPerCenter
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
GROUP BY ProductID;

-- 5. Average batch size per product (July 2025)
SELECT ProductID, AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgBatchUnits
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID;

-- 6. Average daily shipments per center in July 2025
SELECT CenterID, AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgDailyUnits
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID;

-- 7. Average order value per weekday (July 2025)
SELECT DATENAME(weekday, OrderDate) AS WeekdayName,
       AVG(CAST(TotalAmount AS DECIMAL(18,2))) AS AvgOrderValue
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY DATENAME(weekday, OrderDate);

-- 8. Average number of QC results per batch in July 2025
WITH R AS (
  SELECT BatchID, BatchDate, COUNT(*) AS Cnt
  FROM pharma_company.QCResult
  WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
  GROUP BY BatchID, BatchDate
)
SELECT AVG(CAST(Cnt AS DECIMAL(10,2))) AS AvgResultsPerBatch
FROM R;

-- 9. Average TotalAmount per customer overall
SELECT CustomerID, AVG(CAST(TotalAmount AS DECIMAL(18,2))) AS AvgOrderAmount
FROM pharma_company.SalesOrder
GROUP BY CustomerID;

-- 10. Average inventory by center for a given product (e.g., ID=10) over last 5 days of July
SELECT CenterID, AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgUnits
FROM pharma_company.Inventory
WHERE ProductID = 10 AND SnapshotDate BETWEEN '2025-07-27' AND '2025-07-31'
GROUP BY CenterID;

-- 11. Average units shipped per customer in July 2025
SELECT CustomerID, AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgUnitsPerShipment
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CustomerID;

-- 12. Average batch size overall
SELECT AVG(CAST(QuantityUnits AS DECIMAL(18,2))) AS AvgBatchUnitsOverall
FROM pharma_company.ManufacturingBatch;
```

## Max
```sql
-- 1. Maximum shipment quantity in July 2025
SELECT MAX(QuantityUnits) AS MaxShipmentUnitsJuly
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01';

-- 2. Max TotalAmount of any order in July 2025
SELECT MAX(TotalAmount) AS MaxOrderValueJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01';

-- 3. Latest BatchDate overall
SELECT MAX(BatchDate) AS LatestBatchDate
FROM pharma_company.ManufacturingBatch;

-- 4. Maximum on-hand inventory per product on 2025-07-31
SELECT ProductID, MAX(QuantityUnits) AS MaxOnHandAcrossCenters
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
GROUP BY ProductID
ORDER BY MaxOnHandAcrossCenters DESC;

-- 5. Customer with maximum July order units
SELECT TOP (1) WITH TIES CustomerID, SUM(TotalUnits) AS UnitsJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY UnitsJuly DESC;

-- 6. Max shipments per day (units) in July, by center
SELECT CenterID, ShipmentDate, MAX(QuantityUnits) AS MaxUnitsThatDay
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID, ShipmentDate;

-- 7. Maximum batch size per product in July 2025
SELECT ProductID, MAX(QuantityUnits) AS MaxBatchUnits
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID;

-- 8. Max TotalAmount per customer overall
SELECT CustomerID, MAX(TotalAmount) AS MaxOrderAmount
FROM pharma_company.SalesOrder
GROUP BY CustomerID;

-- 9. Latest SnapshotDate recorded
SELECT MAX(SnapshotDate) AS LatestSnapshotDate
FROM pharma_company.Inventory;

-- 10. Max number of QC results on a single day (overall)
SELECT TestDate, COUNT(*) AS ResultsCount
FROM pharma_company.QCResult
GROUP BY TestDate
ORDER BY ResultsCount DESC;

-- 11. Most recent regulatory submission date per agency
SELECT Agency, MAX(SubmissionDate) AS LatestSubmission
FROM pharma_company.RegulatorySubmission
GROUP BY Agency;

-- 12. Latest CreatedAt among suppliers
SELECT MAX(CreatedAt) AS LatestSupplierCreateTime
FROM pharma_company.Supplier;
```

## Min
```sql
-- 1. Minimum shipment quantity in July 2025
SELECT MIN(QuantityUnits) AS MinShipmentUnitsJuly
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01';

-- 2. Smallest order value (TotalAmount) in July 2025
SELECT MIN(TotalAmount) AS MinOrderValueJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01';

-- 3. Earliest BatchDate overall
SELECT MIN(BatchDate) AS EarliestBatchDate
FROM pharma_company.ManufacturingBatch;

-- 4. Minimum on-hand inventory per product on 2025-07-31
SELECT ProductID, MIN(QuantityUnits) AS MinOnHandAcrossCenters
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
GROUP BY ProductID
ORDER BY MinOnHandAcrossCenters ASC;

-- 5. Customer with minimum July revenue (among those who ordered)
SELECT TOP (1) WITH TIES CustomerID, SUM(TotalAmount) AS RevenueJuly
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY RevenueJuly ASC;

-- 6. Minimum batch size per product in July 2025
SELECT ProductID, MIN(QuantityUnits) AS MinBatchUnits
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID;

-- 7. Earliest SnapshotDate recorded
SELECT MIN(SnapshotDate) AS EarliestSnapshotDate
FROM pharma_company.Inventory;

-- 8. Minimum TotalUnits per customer overall (among their orders)
SELECT CustomerID, MIN(TotalUnits) AS MinOrderUnits
FROM pharma_company.SalesOrder
GROUP BY CustomerID;

-- 9. Earliest regulatory submission per product
SELECT ProductID, MIN(SubmissionDate) AS FirstSubmission
FROM pharma_company.RegulatorySubmission
GROUP BY ProductID;

-- 10. Earliest order date per customer
SELECT CustomerID, MIN(OrderDate) AS FirstOrderDate
FROM pharma_company.SalesOrder
GROUP BY CustomerID;

-- 11. Minimum daily shipments by center in July 2025
SELECT CenterID, ShipmentDate, MIN(QuantityUnits) AS MinUnitsThatDay
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID, ShipmentDate;

-- 12. Oldest supplier CreatedAt
SELECT MIN(CreatedAt) AS OldestSupplierCreateTime
FROM pharma_company.Supplier;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
