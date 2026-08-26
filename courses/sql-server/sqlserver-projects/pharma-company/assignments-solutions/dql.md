![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. List all products with name, strength, and formulation
SELECT ProductID, Name, Strength, Formulation
FROM pharma_company.Product;

-- 2. Show supplier contact sheet (supplier, contact, phone, email)
SELECT SupplierID, Name AS SupplierName, ContactName, Phone, Email
FROM pharma_company.Supplier;

-- 3. Show full customer mailing label (single column)
SELECT 
  c.CustomerID,
  c.Name AS CustomerName,
  CONCAT(a.Street, ', ', a.City, ', ', a.State, ' ', a.ZIP, ', ', a.Country) AS MailingLabel
FROM pharma_company.Customer c
LEFT JOIN pharma_company.Address a ON c.AddressID = a.AddressID;

-- 4. Show product + formulation percent lines (joins)
SELECT f.ProductID, p.Name AS ProductName, f.RawMaterialID, f.Percentage
FROM pharma_company.Formulation f
JOIN pharma_company.Product p ON p.ProductID = f.ProductID;

-- 5. Distinct equipment types present
SELECT DISTINCT [Type] AS EquipmentType
FROM pharma_company.Equipment;

-- 6. QC tests catalog (id, name, method)
SELECT TestID, Name AS TestName, Method
FROM pharma_company.QualityTest;

-- 7. Show batches with computed status flag text
SELECT 
  BatchID, ProductID, BatchDate, QuantityUnits,
  CASE WHEN Status = 'Released' THEN 'Ready to ship' ELSE 'On hold' END AS StatusNote
FROM pharma_company.ManufacturingBatch;

-- 8. Show shipments with a computed “UnitsPer100” (decimal)
SELECT 
  ShipmentID, CenterID, CustomerID, ShipmentDate, QuantityUnits,
  CAST(QuantityUnits / 100.0 AS DECIMAL(10,2)) AS UnitsPer100
FROM pharma_company.Shipment;

-- 9. Show sales orders with value per unit (TotalAmount / TotalUnits)
SELECT 
  SalesOrderID, CustomerID, OrderDate, TotalUnits, TotalAmount,
  CAST(TotalAmount / NULLIF(TotalUnits,0) AS DECIMAL(18,2)) AS ValuePerUnit
FROM pharma_company.SalesOrder;

-- 10. Show inventory snapshots with product-centre pairing
SELECT InventoryID, CenterID, ProductID, SnapshotDate, QuantityUnits
FROM pharma_company.Inventory;

-- 11. Show regulatory submissions with a friendly title
SELECT 
  SubmissionID,
  ProductID,
  CONCAT(Agency, ' Submission on ', CONVERT(varchar(10), SubmissionDate, 120)) AS SubmissionTitle,
  Status,
  DocumentLink
FROM pharma_company.RegulatorySubmission;

-- 12. Distribution centers with their city/state
SELECT 
  dc.CenterID, dc.Name AS CenterName, a.City, a.State, a.Country
FROM pharma_company.DistributionCenter dc
LEFT JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;
```

## WHERE
```sql
-- 1. Suppliers with email on example.com domain
SELECT SupplierID, Name, Email
FROM pharma_company.Supplier
WHERE Email LIKE '%@example.com';

-- 2. Raw materials from a specific supplier (e.g., SupplierID = 10)
SELECT RawMaterialID, Name, SupplierID
FROM pharma_company.RawMaterial
WHERE SupplierID = 10;

-- 3. Products that are tablets or capsules
SELECT ProductID, Name, Formulation
FROM pharma_company.Product
WHERE Formulation IN ('Tablet','Capsule');

-- 4. Batches produced in July 2025
SELECT BatchID, ProductID, BatchDate, Status
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01';

-- 5. QC results that failed
SELECT ResultID, BatchID, TestID, TestDate, PassFail
FROM pharma_company.QCResult
WHERE PassFail = 'F';

-- 6. Inventory snapshots for a given center (CenterID = 5) in last 7 days of July 2025
SELECT InventoryID, ProductID, SnapshotDate, QuantityUnits
FROM pharma_company.Inventory
WHERE CenterID = 5
  AND SnapshotDate BETWEEN '2025-07-25' AND '2025-07-31';

-- 7. Shipments going to customers with IDs 100–120
SELECT ShipmentID, CustomerID, ShipmentDate, QuantityUnits
FROM pharma_company.Shipment
WHERE CustomerID BETWEEN 100 AND 120;

-- 8. Sales orders that are still open
SELECT SalesOrderID, CustomerID, OrderDate, Status
FROM pharma_company.SalesOrder
WHERE Status = N'Open';

-- 9. Distribution centers not linked to an address (nulls)
SELECT CenterID, Name
FROM pharma_company.DistributionCenter
WHERE AddressID IS NULL;

-- 10. Regulatory submissions to FDA or EMA in July 2025
SELECT SubmissionID, ProductID, Agency, SubmissionDate, Status
FROM pharma_company.RegulatorySubmission
WHERE Agency IN ('FDA','EMA')
  AND SubmissionDate >= '2025-07-01' AND SubmissionDate < '2025-08-01';

-- 11. Equipment located in Plant-A or Plant-B
SELECT EquipmentID, Name, [Type], Location
FROM pharma_company.Equipment
WHERE Location IN ('Plant-A','Plant-B');

-- 12. Customers whose city starts with 'City1'
SELECT c.CustomerID, c.Name, a.City
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID
WHERE a.City LIKE 'City1%';
```

## GROUP BY
```sql
-- 1. Count products per formulation type
SELECT Formulation, COUNT(*) AS ProductCount
FROM pharma_company.Product
GROUP BY Formulation;

-- 2. Total raw materials per supplier
SELECT rm.SupplierID, COUNT(*) AS RawMaterialCount
FROM pharma_company.RawMaterial rm
GROUP BY rm.SupplierID;

-- 3. Total batches per product in July 2025
SELECT ProductID, COUNT(*) AS BatchCount
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID;

-- 4. QC pass/fail counts by TestID for July 2025
SELECT TestID, PassFail, COUNT(*) AS ResultCount
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY TestID, PassFail;

-- 5. Inventory total units by center on 2025-07-31
SELECT CenterID, SUM(QuantityUnits) AS TotalUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
GROUP BY CenterID;

-- 6. Shipments per distribution center in July 2025
SELECT CenterID, SUM(QuantityUnits) AS UnitsShipped
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID;

-- 7. Sales order totals per customer (units and amount) for July 2025
SELECT CustomerID, SUM(TotalUnits) AS Units, SUM(TotalAmount) AS Amount
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID;

-- 8. Count of regulatory submissions per agency (all time)
SELECT Agency, COUNT(*) AS SubmissionCount
FROM pharma_company.RegulatorySubmission
GROUP BY Agency;

-- 9. Products per strength
SELECT Strength, COUNT(*) AS ProductCount
FROM pharma_company.Product
GROUP BY Strength;

-- 10. QC results per batch (how many tests recorded per batch in July 2025)
SELECT BatchID, COUNT(*) AS TestsRecorded
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY BatchID;

-- 11. Daily inventory per product for last 5 days of July 2025
SELECT SnapshotDate, ProductID, SUM(QuantityUnits) AS TotalUnits
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-27' AND '2025-07-31'
GROUP BY SnapshotDate, ProductID;

-- 12. Shipments per customer on the busiest day (per-customer on 2025-07-31)
SELECT CustomerID, SUM(QuantityUnits) AS UnitsShipped
FROM pharma_company.Shipment
WHERE ShipmentDate = '2025-07-31'
GROUP BY CustomerID;
```

## HAVING
```sql
-- 1. Products with 3 or more raw materials in formulation
SELECT f.ProductID, COUNT(*) AS RawMatCount
FROM pharma_company.Formulation f
GROUP BY f.ProductID
HAVING COUNT(*) >= 3;

-- 2. Customers with total July 2025 order amount > 50,000
SELECT CustomerID, SUM(TotalAmount) AS TotalAmt
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
HAVING SUM(TotalAmount) > 50000;

-- 3. Distribution centers that shipped > 10,000 units in July 2025
SELECT CenterID, SUM(QuantityUnits) AS UnitsShipped
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID
HAVING SUM(QuantityUnits) > 10000;

-- 4. QC tests that have at least 50 results in July 2025
SELECT TestID, COUNT(*) AS ResultCount
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY TestID
HAVING COUNT(*) >= 50;

-- 5. Products with total batches >= 20 in July 2025
SELECT ProductID, COUNT(*) AS BatchCount
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID
HAVING COUNT(*) >= 20;

-- 6. Customers with average order value >= 5,000 in July 2025
SELECT CustomerID, AVG(TotalAmount) AS AvgOrderValue
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
HAVING AVG(TotalAmount) >= 5000;

-- 7. Products whose total inventory on 2025-07-31 exceeds 50,000 units
SELECT ProductID, SUM(QuantityUnits) AS TotalUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
GROUP BY ProductID
HAVING SUM(QuantityUnits) > 50000;

-- 8. Agencies with more than 30 submissions overall
SELECT Agency, COUNT(*) AS Cnt
FROM pharma_company.RegulatorySubmission
GROUP BY Agency
HAVING COUNT(*) > 30;

-- 9. Customers with at least 5 orders in July 2025
SELECT CustomerID, COUNT(*) AS OrderCount
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
HAVING COUNT(*) >= 5;

-- 10. Centers with average shipment size < 300 units in July 2025
SELECT CenterID, AVG(QuantityUnits) AS AvgUnits
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID
HAVING AVG(QuantityUnits) < 300;

-- 11. Tests where fail rate (F) count >= 5 in July 2025
SELECT TestID, SUM(CASE WHEN PassFail = 'F' THEN 1 ELSE 0 END) AS FailCount
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY TestID
HAVING SUM(CASE WHEN PassFail = 'F' THEN 1 ELSE 0 END) >= 5;

-- 12. Customers whose total units ordered in July 2025 >= 2,000
SELECT CustomerID, SUM(TotalUnits) AS Units
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
HAVING SUM(TotalUnits) >= 2000;
```

## ORDER BY
```sql
-- 1. Products ordered by name ascending
SELECT ProductID, Name, Strength, Formulation
FROM pharma_company.Product
ORDER BY Name ASC;

-- 2. Suppliers ordered by most recently updated (UpdatedAt desc)
SELECT SupplierID, Name, UpdatedAt
FROM pharma_company.Supplier
ORDER BY UpdatedAt DESC, SupplierID DESC;

-- 3. Top sales orders by TotalAmount in July 2025 (show all, just ordered)
SELECT SalesOrderID, CustomerID, OrderDate, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
ORDER BY TotalAmount DESC;

-- 4. QC results ordered by TestDate then PassFail (fail first)
SELECT ResultID, TestID, TestDate, PassFail
FROM pharma_company.QCResult
ORDER BY TestDate ASC, CASE WHEN PassFail = 'F' THEN 0 ELSE 1 END, ResultID;

-- 5. Inventory on 2025-07-31 ordered by QuantityUnits desc
SELECT CenterID, ProductID, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
ORDER BY QuantityUnits DESC;

-- 6. Shipments ordered by date asc then quantity desc
SELECT ShipmentID, ShipmentDate, CustomerID, QuantityUnits
FROM pharma_company.Shipment
ORDER BY ShipmentDate ASC, QuantityUnits DESC;

-- 7. Customers ordered by name, then city
SELECT c.CustomerID, c.Name, a.City, a.State
FROM pharma_company.Customer c
LEFT JOIN pharma_company.Address a ON a.AddressID = c.AddressID
ORDER BY c.Name ASC, a.City ASC;

-- 8. Distribution centers ordered by country then center name
SELECT dc.CenterID, dc.Name, a.Country
FROM pharma_company.DistributionCenter dc
LEFT JOIN pharma_company.Address a ON a.AddressID = dc.AddressID
ORDER BY a.Country, dc.Name;

-- 9. Equipment ordered by location, then type, then name
SELECT EquipmentID, Name, [Type], Location
FROM pharma_company.Equipment
ORDER BY Location, [Type], Name;

-- 10. Regulatory submissions ordered by status then date desc
SELECT SubmissionID, ProductID, Agency, Status, SubmissionDate
FROM pharma_company.RegulatorySubmission
ORDER BY Status, SubmissionDate DESC;

-- 11. Batches ordered by batch date desc then product asc
SELECT BatchID, ProductID, BatchDate, Status
FROM pharma_company.ManufacturingBatch
ORDER BY BatchDate DESC, ProductID ASC;

-- 12. Sales orders ordered by average price per unit (desc)
SELECT SalesOrderID, CustomerID, TotalAmount, TotalUnits,
       CAST(TotalAmount / NULLIF(TotalUnits,0) AS DECIMAL(18,2)) AS AvgPricePerUnit
FROM pharma_company.SalesOrder
ORDER BY CAST(TotalAmount / NULLIF(TotalUnits,0) AS DECIMAL(18,2)) DESC, SalesOrderID;
```

## TOP
```sql
-- 1. Top 10 most recently created customers
SELECT TOP (10) CustomerID, Name, CreatedAt
FROM pharma_company.Customer
ORDER BY CreatedAt DESC;

-- 2. Top 15 products alphabetically
SELECT TOP (15) ProductID, Name, Strength, Formulation
FROM pharma_company.Product
ORDER BY Name ASC;

-- 3. Top 10 sales orders by TotalAmount in July 2025
SELECT TOP (10) SalesOrderID, CustomerID, OrderDate, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
ORDER BY TotalAmount DESC;

-- 4. Top 5 distribution centers by total shipments in July 2025
SELECT TOP (5) CenterID, SUM(QuantityUnits) AS UnitsShipped
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CenterID
ORDER BY SUM(QuantityUnits) DESC;

-- 5. Top 10 customers by total order value in July 2025
SELECT TOP (10) CustomerID, SUM(TotalAmount) AS TotalAmt
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY SUM(TotalAmount) DESC;

-- 6. Top 10 batches by QuantityUnits in July 2025
SELECT TOP (10) BatchID, ProductID, BatchDate, QuantityUnits
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
ORDER BY QuantityUnits DESC;

-- 7. TOP WITH TIES: top 5 products by count of batches in July 2025 (ties included)
SELECT TOP (5) WITH TIES ProductID, COUNT(*) AS BatchCount
FROM pharma_company.ManufacturingBatch
WHERE BatchDate >= '2025-07-01' AND BatchDate < '2025-08-01'
GROUP BY ProductID
ORDER BY COUNT(*) DESC;

-- 8. Top 10 QC tests by total result count in July 2025
SELECT TOP (10) TestID, COUNT(*) AS ResultCount
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-01' AND TestDate < '2025-08-01'
GROUP BY TestID
ORDER BY COUNT(*) DESC;

-- 9. Top 10 inventory lines by quantity on 2025-07-31
SELECT TOP (10) CenterID, ProductID, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
ORDER BY QuantityUnits DESC;

-- 10. Top 10 customers by total units shipped in July 2025
SELECT TOP (10) CustomerID, SUM(QuantityUnits) AS UnitsShipped
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-01' AND ShipmentDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY SUM(QuantityUnits) DESC;

-- 11. Top 5 agencies by number of submissions overall
SELECT TOP (5) Agency, COUNT(*) AS SubmissionCount
FROM pharma_company.RegulatorySubmission
GROUP BY Agency
ORDER BY COUNT(*) DESC;

-- 12. Top 10 “value per unit” sales orders in July 2025
SELECT TOP (10)
  SalesOrderID, CustomerID, OrderDate, TotalUnits, TotalAmount,
  CAST(TotalAmount / NULLIF(TotalUnits,0) AS DECIMAL(18,2)) AS ValuePerUnit
FROM pharma_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
ORDER BY CAST(TotalAmount / NULLIF(TotalUnits,0) AS DECIMAL(18,2)) DESC, SalesOrderID;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
