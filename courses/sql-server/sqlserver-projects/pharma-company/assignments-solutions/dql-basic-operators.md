![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions

## Equality Operator (=)
```sql
-- 1. Product exactly named 'Product-0001'
SELECT ProductID, Name, Strength, Formulation
FROM pharma_company.Product
WHERE Name = 'Product-0001';

-- 2. Batches with Status = 'Released'
SELECT BatchID, ProductID, BatchDate, Status
FROM pharma_company.ManufacturingBatch
WHERE Status = 'Released';

-- 3. Sales orders for a specific customer (CustomerID = 100)
SELECT SalesOrderID, CustomerID, OrderDate, TotalUnits, TotalAmount
FROM pharma_company.SalesOrder
WHERE CustomerID = 100;

-- 4. QC results with PassFail = 'P'
SELECT ResultID, BatchID, TestID, TestDate, PassFail
FROM pharma_company.QCResult
WHERE PassFail = 'P';

-- 5. Inventory snapshots on date = '2025-07-31'
SELECT InventoryID, CenterID, ProductID, SnapshotDate, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31';

-- 6. Shipments on a specific date
SELECT ShipmentID, CenterID, CustomerID, ShipmentDate, QuantityUnits
FROM pharma_company.Shipment
WHERE ShipmentDate = '2025-07-15';

-- 7. Regulatory submissions to a specific agency
SELECT SubmissionID, ProductID, Agency, SubmissionDate, Status
FROM pharma_company.RegulatorySubmission
WHERE Agency = 'FDA';

-- 8. Supplier at a specific address (AddressID = 1)
SELECT SupplierID, Name, AddressID
FROM pharma_company.Supplier
WHERE AddressID = 1;

-- 9. Equipment exactly of type 'Reactor'
SELECT EquipmentID, Name, [Type], Location
FROM pharma_company.Equipment
WHERE [Type] = 'Reactor';

-- 10. Customers located in a specific city (via FK)
SELECT c.CustomerID, c.Name, a.City
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID
WHERE a.City = 'City10';
```

## Inequality Operator (<>)
```sql
-- 1. Products not capsules
SELECT ProductID, Name, Formulation
FROM pharma_company.Product
WHERE Formulation <> 'Capsule';

-- 2. Batches not released
SELECT BatchID, ProductID, Status
FROM pharma_company.ManufacturingBatch
WHERE Status <> 'Released';

-- 3. QC results not passed
SELECT ResultID, PassFail
FROM pharma_company.QCResult
WHERE PassFail <> 'P';

-- 4. Inventory snapshots not on '2025-07-31'
SELECT InventoryID, SnapshotDate
FROM pharma_company.Inventory
WHERE SnapshotDate <> '2025-07-31';

-- 5. Equipment not in 'Plant-A'
SELECT EquipmentID, Name, Location
FROM pharma_company.Equipment
WHERE Location <> 'Plant-A';

-- 6. Reg submissions not to 'EMA'
SELECT SubmissionID, Agency
FROM pharma_company.RegulatorySubmission
WHERE Agency <> 'EMA';

-- 7. Sales orders with status not 'Open'
SELECT SalesOrderID, Status
FROM pharma_company.SalesOrder
WHERE Status <> N'Open';

-- 8. Customers not in 'USA'
SELECT c.CustomerID, c.Name, a.Country
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country <> 'USA';

-- 9. Suppliers not having an email on example.com
SELECT SupplierID, Name, Email
FROM pharma_company.Supplier
WHERE Email NOT LIKE '%@example.com';

-- 10. Shipments not on '2025-07-01'
SELECT ShipmentID, ShipmentDate
FROM pharma_company.Shipment
WHERE ShipmentDate <> '2025-07-01';
```

## IN Operator
```sql
-- 1. Products in specific formulations
SELECT ProductID, Name, Formulation
FROM pharma_company.Product
WHERE Formulation IN ('Tablet','Injection');

-- 2. QC results for specific tests
SELECT ResultID, TestID, TestDate
FROM pharma_company.QCResult
WHERE TestID IN (1,2,3);

-- 3. Batches for selected products
SELECT BatchID, ProductID, BatchDate
FROM pharma_company.ManufacturingBatch
WHERE ProductID IN (10, 20, 30);

-- 4. Sales orders in July on specific dates
SELECT SalesOrderID, OrderDate
FROM pharma_company.SalesOrder
WHERE OrderDate IN ('2025-07-01','2025-07-15','2025-07-31');

-- 5. Shipments from specific centers
SELECT ShipmentID, CenterID, ShipmentDate
FROM pharma_company.Shipment
WHERE CenterID IN (1,5,10);

-- 6. Customers in a list
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID IN (100, 200, 300);

-- 7. Equipment types of interest
SELECT EquipmentID, Name, [Type]
FROM pharma_company.Equipment
WHERE [Type] IN ('Reactor','Dryer','Mixer');

-- 8. Regulatory submissions to key agencies
SELECT SubmissionID, Agency, Status
FROM pharma_company.RegulatorySubmission
WHERE Agency IN ('FDA','EMA','PMDA');

-- 9. Suppliers at addresses 1..3
SELECT SupplierID, Name, AddressID
FROM pharma_company.Supplier
WHERE AddressID IN (1,2,3);

-- 10. Inventory snapshots on last 3 days of July
SELECT InventoryID, SnapshotDate
FROM pharma_company.Inventory
WHERE SnapshotDate IN ('2025-07-29','2025-07-30','2025-07-31');
```

## NOT IN Operator
```sql
-- 1. Products not in Syrup or Injection forms
SELECT ProductID, Name, Formulation
FROM pharma_company.Product
WHERE Formulation NOT IN ('Syrup','Injection');

-- 2. QC results excluding specific tests
SELECT ResultID, TestID
FROM pharma_company.QCResult
WHERE TestID NOT IN (4,5);

-- 3. Batches excluding products 1..5
SELECT BatchID, ProductID
FROM pharma_company.ManufacturingBatch
WHERE ProductID NOT IN (1,2,3,4,5);

-- 4. Sales orders not on these dates
SELECT SalesOrderID, OrderDate
FROM pharma_company.SalesOrder
WHERE OrderDate NOT IN ('2025-07-04','2025-07-14');

-- 5. Shipments not from centers 2 or 3
SELECT ShipmentID, CenterID
FROM pharma_company.Shipment
WHERE CenterID NOT IN (2,3);

-- 6. Customers not in the given list
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID NOT IN (11,12,13);

-- 7. Equipment excluding Packaging/Mixer
SELECT EquipmentID, Name, [Type]
FROM pharma_company.Equipment
WHERE [Type] NOT IN ('Packaging','Mixer');

-- 8. Submissions not to ANVISA or TGA
SELECT SubmissionID, Agency
FROM pharma_company.RegulatorySubmission
WHERE Agency NOT IN ('ANVISA','TGA');

-- 9. Suppliers not at addresses 10,11
SELECT SupplierID, Name, AddressID
FROM pharma_company.Supplier
WHERE AddressID NOT IN (10,11);

-- 10. Inventory snapshots not on last two days of July
SELECT InventoryID, SnapshotDate
FROM pharma_company.Inventory
WHERE SnapshotDate NOT IN ('2025-07-30','2025-07-31');
```

## LIKE Operator
```sql
-- 1. Products starting with 'Product-00'
SELECT ProductID, Name
FROM pharma_company.Product
WHERE Name LIKE 'Product-00%';

-- 2. Suppliers with email on '@example.com'
SELECT SupplierID, Name, Email
FROM pharma_company.Supplier
WHERE Email LIKE '%@example.com';

-- 3. Customers whose name contains 'Customer-0001'
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE Name LIKE '%Customer-0001%';

-- 4. Addresses with City starting 'City1'
SELECT AddressID, City
FROM pharma_company.Address
WHERE City LIKE 'City1%';

-- 5. Equipment located at plants with letter 'A'
SELECT EquipmentID, Name, Location
FROM pharma_company.Equipment
WHERE Location LIKE 'Plant-A%';

-- 6. Regulatory doc links ending with '.pdf'
SELECT SubmissionID, DocumentLink
FROM pharma_company.RegulatorySubmission
WHERE DocumentLink LIKE '%.pdf';

-- 7. QC ResultValue including 'Pass'
SELECT ResultID, ResultValue
FROM pharma_company.QCResult
WHERE ResultValue LIKE '%Pass%';

-- 8. Product strengths ending with ' mg'
SELECT ProductID, Strength
FROM pharma_company.Product
WHERE Strength LIKE '% mg';

-- 9. Phone numbers with '555-2'
SELECT SupplierID, Phone
FROM pharma_company.Supplier
WHERE Phone LIKE '%555-2%';

-- 10. Distribution center names like 'DC-0__' (DC-0xx)
SELECT CenterID, Name
FROM pharma_company.DistributionCenter
WHERE Name LIKE 'DC-0__';
```

## NOT LIKE Operator
```sql
-- 1. Products not starting with 'Product-00'
SELECT ProductID, Name
FROM pharma_company.Product
WHERE Name NOT LIKE 'Product-00%';

-- 2. Suppliers without '@example.com' emails
SELECT SupplierID, Name, Email
FROM pharma_company.Supplier
WHERE Email NOT LIKE '%@example.com';

-- 3. Customers whose names don’t contain '-0001'
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE Name NOT LIKE '%-0001%';

-- 4. Addresses whose city does not start with 'City1'
SELECT AddressID, City
FROM pharma_company.Address
WHERE City NOT LIKE 'City1%';

-- 5. Equipment not in 'Plant-B' locations
SELECT EquipmentID, Name, Location
FROM pharma_company.Equipment
WHERE Location NOT LIKE 'Plant-B%';

-- 6. Regulatory doc links not pdf
SELECT SubmissionID, DocumentLink
FROM pharma_company.RegulatorySubmission
WHERE DocumentLink NOT LIKE '%.pdf';

-- 7. QC ResultValue not containing '%'
SELECT ResultID, ResultValue
FROM pharma_company.QCResult
WHERE ResultValue NOT LIKE '%\%%' ESCAPE '\';

-- 8. Strength not ending in ' mg'
SELECT ProductID, Strength
FROM pharma_company.Product
WHERE Strength NOT LIKE '% mg';

-- 9. Phones not having '555-'
SELECT SupplierID, Phone
FROM pharma_company.Supplier
WHERE Phone NOT LIKE '%555-%';

-- 10. Center names not matching pattern 'DC-___'
SELECT CenterID, Name
FROM pharma_company.DistributionCenter
WHERE Name NOT LIKE 'DC-___';
```

## BETWEEN Operator
```sql
-- 1. Batches in July 2025
SELECT BatchID, ProductID, BatchDate
FROM pharma_company.ManufacturingBatch
WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 2. Shipments in second half of July 2025
SELECT ShipmentID, ShipmentDate, QuantityUnits
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-16' AND '2025-07-31';

-- 3. Sales orders in first week of July
SELECT SalesOrderID, OrderDate, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-07';

-- 4. Inventory snapshots for last 5 days of July
SELECT InventoryID, SnapshotDate, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-27' AND '2025-07-31';

-- 5. QC results in last 10 days of July
SELECT ResultID, TestDate, PassFail
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-22' AND '2025-07-31';

-- 6. Customers with IDs between 50 and 100
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID BETWEEN 50 AND 100;

-- 7. Products with IDs between 10 and 25
SELECT ProductID, Name
FROM pharma_company.Product
WHERE ProductID BETWEEN 10 AND 25;

-- 8. Shipments QuantityUnits between 200 and 400
SELECT ShipmentID, QuantityUnits
FROM pharma_company.Shipment
WHERE QuantityUnits BETWEEN 200 AND 400;

-- 9. Sales orders TotalUnits between 100 and 200
SELECT SalesOrderID, TotalUnits
FROM pharma_company.SalesOrder
WHERE TotalUnits BETWEEN 100 AND 200;

-- 10. Addresses with ZIP 'Z10000' to 'Z20000'
SELECT AddressID, ZIP
FROM pharma_company.Address
WHERE ZIP BETWEEN 'Z10000' AND 'Z20000';
```

## Greater Than (>)
```sql
-- 1. Shipments with units > 800
SELECT ShipmentID, QuantityUnits
FROM pharma_company.Shipment
WHERE QuantityUnits > 800;

-- 2. Sales orders amount > 20000 in July
SELECT SalesOrderID, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND TotalAmount > 20000;

-- 3. Inventory quantity > 5000 on 2025-07-31
SELECT InventoryID, ProductID, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
  AND QuantityUnits > 5000;

-- 4. Batches with QuantityUnits > 20000
SELECT BatchID, QuantityUnits
FROM pharma_company.ManufacturingBatch
WHERE QuantityUnits > 20000;

-- 5. Sales orders with TotalUnits > 400
SELECT SalesOrderID, TotalUnits
FROM pharma_company.SalesOrder
WHERE TotalUnits > 400;

-- 6. Customers with ID > 2000
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID > 2000;

-- 7. Products with ProductID > 200
SELECT ProductID, Name
FROM pharma_company.Product
WHERE ProductID > 200;

-- 8. QC results where ResultID > 2,001,000
SELECT ResultID, TestDate
FROM pharma_company.QCResult
WHERE ResultID > 2001000;

-- 9. Shipments on or after '2025-07-20' and QuantityUnits > 600
SELECT ShipmentID, ShipmentDate, QuantityUnits
FROM pharma_company.Shipment
WHERE ShipmentDate >= '2025-07-20' AND QuantityUnits > 600;

-- 10. Sales orders with value per unit > 40
SELECT SalesOrderID, TotalAmount, TotalUnits
FROM pharma_company.SalesOrder
WHERE (TotalAmount / NULLIF(TotalUnits,0)) > 40;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Shipments with units >= 900
SELECT ShipmentID, QuantityUnits
FROM pharma_company.Shipment
WHERE QuantityUnits >= 900;

-- 2. Sales orders with amount >= 50,000 in July
SELECT SalesOrderID, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND TotalAmount >= 50000;

-- 3. Inventory quantity >= 7000 on final day
SELECT InventoryID, ProductID, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
  AND QuantityUnits >= 7000;

-- 4. Batches with QuantityUnits >= 25000
SELECT BatchID, QuantityUnits
FROM pharma_company.ManufacturingBatch
WHERE QuantityUnits >= 25000;

-- 5. Sales orders with TotalUnits >= 450
SELECT SalesOrderID, TotalUnits
FROM pharma_company.SalesOrder
WHERE TotalUnits >= 450;

-- 6. Customers with ID >= 2400
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID >= 2400;

-- 7. Products with ProductID >= 230
SELECT ProductID, Name
FROM pharma_company.Product
WHERE ProductID >= 230;

-- 8. QC results with TestDate >= '2025-07-25'
SELECT ResultID, TestDate
FROM pharma_company.QCResult
WHERE TestDate >= '2025-07-25';

-- 9. Sales orders with value per unit >= 30
SELECT SalesOrderID, TotalAmount, TotalUnits
FROM pharma_company.SalesOrder
WHERE (TotalAmount / NULLIF(TotalUnits,0)) >= 30;

-- 10. Suppliers created at/after a date (UTC)
SELECT SupplierID, CreatedAt
FROM pharma_company.Supplier
WHERE CreatedAt >= '2025-07-01T00:00:00';
```

## Less Than (<)
```sql
-- 1. Shipments with units < 200
SELECT ShipmentID, QuantityUnits
FROM pharma_company.Shipment
WHERE QuantityUnits < 200;

-- 2. Sales orders with amount < 2000 in July
SELECT SalesOrderID, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND TotalAmount < 2000;

-- 3. Inventory quantity < 1200 on 2025-07-31
SELECT InventoryID, ProductID, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
  AND QuantityUnits < 1200;

-- 4. Batches with QuantityUnits < 6000
SELECT BatchID, QuantityUnits
FROM pharma_company.ManufacturingBatch
WHERE QuantityUnits < 6000;

-- 5. Sales orders with TotalUnits < 100
SELECT SalesOrderID, TotalUnits
FROM pharma_company.SalesOrder
WHERE TotalUnits < 100;

-- 6. Customers with ID < 50
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID < 50;

-- 7. Products with ProductID < 10
SELECT ProductID, Name
FROM pharma_company.Product
WHERE ProductID < 10;

-- 8. QC results with TestDate < '2025-07-10'
SELECT ResultID, TestDate
FROM pharma_company.QCResult
WHERE TestDate < '2025-07-10';

-- 9. Sales orders with value per unit < 15
SELECT SalesOrderID, TotalAmount, TotalUnits
FROM pharma_company.SalesOrder
WHERE (TotalAmount / NULLIF(TotalUnits,0)) < 15;

-- 10. Suppliers created before July 2025
SELECT SupplierID, CreatedAt
FROM pharma_company.Supplier
WHERE CreatedAt < '2025-07-01T00:00:00';
```

## Less Than or Equal To (<=)
```sql
-- 1. Shipments with units <= 150
SELECT ShipmentID, QuantityUnits
FROM pharma_company.Shipment
WHERE QuantityUnits <= 150;

-- 2. Sales orders with amount <= 5000 in July
SELECT SalesOrderID, TotalAmount
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND TotalAmount <= 5000;

-- 3. Inventory quantity <= 1500 on 2025-07-31
SELECT InventoryID, ProductID, QuantityUnits
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
  AND QuantityUnits <= 1500;

-- 4. Batches with QuantityUnits <= 5500
SELECT BatchID, QuantityUnits
FROM pharma_company.ManufacturingBatch
WHERE QuantityUnits <= 5500;

-- 5. Sales orders with TotalUnits <= 80
SELECT SalesOrderID, TotalUnits
FROM pharma_company.SalesOrder
WHERE TotalUnits <= 80;

-- 6. Customers with ID <= 25
SELECT CustomerID, Name
FROM pharma_company.Customer
WHERE CustomerID <= 25;

-- 7. Products with ProductID <= 5
SELECT ProductID, Name
FROM pharma_company.Product
WHERE ProductID <= 5;

-- 8. QC results with TestDate <= '2025-07-15'
SELECT ResultID, TestDate
FROM pharma_company.QCResult
WHERE TestDate <= '2025-07-15';

-- 9. Orders with value per unit <= 10
SELECT SalesOrderID, TotalAmount, TotalUnits
FROM pharma_company.SalesOrder
WHERE (TotalAmount / NULLIF(TotalUnits,0)) <= 10;

-- 10. Suppliers created on/before July 10
SELECT SupplierID, CreatedAt
FROM pharma_company.Supplier
WHERE CreatedAt <= '2025-07-10T23:59:59.999';
```

## EXISTS Operator
```sql
-- 1. Products that have at least one batch
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.ManufacturingBatch b
  WHERE b.ProductID = p.ProductID
);

-- 2. Customers who placed at least one order in July 2025
SELECT c.CustomerID, c.Name
FROM pharma_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.SalesOrder o
  WHERE o.CustomerID = c.CustomerID
    AND o.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 3. Batches that have at least one QC result
SELECT b.BatchID, b.ProductID
FROM pharma_company.ManufacturingBatch b
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.QCResult r
  WHERE r.BatchID = b.BatchID
    AND r.BatchDate = b.BatchDate
);

-- 4. Distribution centers that shipped anything in July
SELECT dc.CenterID, dc.Name
FROM pharma_company.DistributionCenter dc
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.Shipment s
  WHERE s.CenterID = dc.CenterID
    AND s.ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 5. Products that have a regulatory submission
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.RegulatorySubmission rs
  WHERE rs.ProductID = p.ProductID
);

-- 6. Customers who received shipments (via Shipment table)
SELECT c.CustomerID, c.Name
FROM pharma_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.Shipment s
  WHERE s.CustomerID = c.CustomerID
);

-- 7. Suppliers who supply at least one raw material
SELECT s.SupplierID, s.Name
FROM pharma_company.Supplier s
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.RawMaterial rm
  WHERE rm.SupplierID = s.SupplierID
);

-- 8. Products that appear in Inventory on 2025-07-31
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.Inventory i
  WHERE i.ProductID = p.ProductID
    AND i.SnapshotDate = '2025-07-31'
);

-- 9. QC tests that were actually run in July
SELECT t.TestID, t.Name
FROM pharma_company.QualityTest t
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.QCResult r
  WHERE r.TestID = t.TestID
    AND r.TestDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 10. Addresses referenced by any customer
SELECT a.AddressID, a.City, a.Country
FROM pharma_company.Address a
WHERE EXISTS (
  SELECT 1
  FROM pharma_company.Customer c
  WHERE c.AddressID = a.AddressID
);
```

## NOT EXISTS Operator
```sql
-- 1. Products that have no batches
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.ManufacturingBatch b
  WHERE b.ProductID = p.ProductID
);

-- 2. Customers who placed no orders in July 2025
SELECT c.CustomerID, c.Name
FROM pharma_company.Customer c
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.SalesOrder o
  WHERE o.CustomerID = c.CustomerID
    AND o.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 3. Batches that have no QC result rows
SELECT b.BatchID, b.ProductID
FROM pharma_company.ManufacturingBatch b
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.QCResult r
  WHERE r.BatchID = b.BatchID
    AND r.BatchDate = b.BatchDate
);

-- 4. Distribution centers that shipped nothing in July
SELECT dc.CenterID, dc.Name
FROM pharma_company.DistributionCenter dc
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.Shipment s
  WHERE s.CenterID = dc.CenterID
    AND s.ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 5. Products with no regulatory submission
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.RegulatorySubmission rs
  WHERE rs.ProductID = p.ProductID
);

-- 6. Customers who never received a shipment
SELECT c.CustomerID, c.Name
FROM pharma_company.Customer c
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.Shipment s
  WHERE s.CustomerID = c.CustomerID
);

-- 7. Suppliers not supplying any raw material
SELECT s.SupplierID, s.Name
FROM pharma_company.Supplier s
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.RawMaterial rm
  WHERE rm.SupplierID = s.SupplierID
);

-- 8. Products not present in Inventory on 2025-07-31
SELECT p.ProductID, p.Name
FROM pharma_company.Product p
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.Inventory i
  WHERE i.ProductID = p.ProductID
    AND i.SnapshotDate = '2025-07-31'
);

-- 9. QC tests never executed in July 2025
SELECT t.TestID, t.Name
FROM pharma_company.QualityTest t
WHERE NOT EXISTS (
  SELECT 1
  FROM pharma_company.QCResult r
  WHERE r.TestID = t.TestID
    AND r.TestDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 10. Addresses unused by both customers and suppliers
SELECT a.AddressID, a.City, a.State, a.Country
FROM pharma_company.Address a
WHERE NOT EXISTS (
  SELECT 1 FROM pharma_company.Customer c WHERE c.AddressID = a.AddressID
)
AND NOT EXISTS (
  SELECT 1 FROM pharma_company.Supplier s WHERE s.AddressID = a.AddressID
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
