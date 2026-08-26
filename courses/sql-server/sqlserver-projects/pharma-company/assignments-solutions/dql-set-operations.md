![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. All party names (customers + suppliers) with a label
SELECT c.CustomerID AS PartyID, c.Name AS PartyName, 'Customer' AS PartyType
FROM pharma_company.Customer c
UNION
SELECT s.SupplierID, s.Name, 'Supplier'
FROM pharma_company.Supplier s;

-- 2. All cities used by customers or suppliers (distinct)
SELECT a.City
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID
UNION
SELECT a.City
FROM pharma_company.Supplier s
JOIN pharma_company.Address a ON a.AddressID = s.AddressID;

-- 3. Days in July 2025 that had any sales orders or any shipments
SELECT OrderDate AS ActivityDate
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT ShipmentDate
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Product IDs that appear either in Batches or in Inventory snapshots (July 2025)
SELECT ProductID
FROM pharma_company.ManufacturingBatch
WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT ProductID
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Parties (Customer/Supplier) in the USA (unique by name + country)
SELECT c.Name AS PartyName, a.Country
FROM pharma_company.Customer c JOIN pharma_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country = 'USA'
UNION
SELECT s.Name, a.Country
FROM pharma_company.Supplier s JOIN pharma_company.Address a ON a.AddressID = s.AddressID
WHERE a.Country = 'USA';

-- 6. All July-2025 activity dates across Orders, Shipments, QC Tests (as dates)
SELECT OrderDate AS D
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT ShipmentDate
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT TestDate
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 7. Entities that reference Address table (customer/supplier/distribution center) with a tag
SELECT c.CustomerID AS EntityID, c.Name AS EntityName, 'Customer' AS EntityType
FROM pharma_company.Customer c
UNION
SELECT s.SupplierID, s.Name, 'Supplier'
FROM pharma_company.Supplier s
UNION
SELECT dc.CenterID, dc.Name, 'DistributionCenter'
FROM pharma_company.DistributionCenter dc;

-- 8. Products that are either Tablet/Capsule OR have at least one batch (IDs only)
SELECT ProductID
FROM pharma_company.Product
WHERE Formulation IN ('Tablet','Capsule')
UNION
SELECT DISTINCT ProductID
FROM pharma_company.ManufacturingBatch;

-- 9. All agencies that have submissions OR are mentioned in July-2025 (distinct)
SELECT Agency
FROM pharma_company.RegulatorySubmission
UNION
SELECT DISTINCT Agency
FROM pharma_company.RegulatorySubmission
WHERE SubmissionDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 10. Equipment locations or DC cities (place names)
SELECT e.Location AS Place
FROM pharma_company.Equipment e
WHERE e.Location IS NOT NULL
UNION
SELECT a.City
FROM pharma_company.DistributionCenter dc
JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 11. Customer or Supplier emails (normalize column name)
SELECT Email
FROM pharma_company.Supplier
WHERE Email IS NOT NULL AND LEN(Email) > 0
UNION
SELECT ''  -- Customers in this model have no email column; placeholder row eliminated by UNION if empty
WHERE 1 = 0;  -- (Demonstrates compatible structure; effectively returns supplier emails only)

-- 12. Inventory snapshot dates or QC test dates in last week of July
SELECT SnapshotDate AS D
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-25' AND '2025-07-31'
UNION
SELECT TestDate
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-25' AND '2025-07-31';
```

## Intersect
```sql
-- 1. Cities that have BOTH customers and suppliers
SELECT a.City
FROM pharma_company.Customer c JOIN pharma_company.Address a ON a.AddressID = c.AddressID
INTERSECT
SELECT a.City
FROM pharma_company.Supplier s JOIN pharma_company.Address a ON a.AddressID = s.AddressID;

-- 2. Dates in July with BOTH sales orders and shipments
SELECT OrderDate AS ActivityDate
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT ShipmentDate
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. ProductIDs present in BOTH Batches and Inventory during July 2025
SELECT ProductID
FROM pharma_company.ManufacturingBatch
WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT ProductID
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Agencies that have submissions BOTH before and after 2025-07-15
SELECT Agency
FROM pharma_company.RegulatorySubmission
WHERE SubmissionDate < '2025-07-15'
INTERSECT
SELECT Agency
FROM pharma_company.RegulatorySubmission
WHERE SubmissionDate >= '2025-07-15';

-- 5. Customers that BOTH placed orders AND received shipments in July 2025
SELECT CustomerID
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT CustomerID
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 6. Distribution centers that BOTH shipped AND have inventory snapshots on 2025-07-31
SELECT CenterID
FROM pharma_company.Shipment
WHERE ShipmentDate = '2025-07-31'
INTERSECT
SELECT CenterID
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31';

-- 7. Tests that have BOTH pass and fail entries in July 2025
SELECT TestID
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31' AND PassFail = 'P'
INTERSECT
SELECT TestID
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31' AND PassFail = 'F';

-- 8. Products that BOTH have a regulatory submission AND appeared in any batch
SELECT ProductID
FROM pharma_company.RegulatorySubmission
INTERSECT
SELECT ProductID
FROM pharma_company.ManufacturingBatch;

-- 9. Days where BOTH QC tests occurred AND inventory snapshots exist
SELECT TestDate AS D
FROM pharma_company.QCResult
INTERSECT
SELECT SnapshotDate
FROM pharma_company.Inventory;

-- 10. Countries that have BOTH customers and distribution centers
SELECT a.Country
FROM pharma_company.Customer c JOIN pharma_company.Address a ON a.AddressID = c.AddressID
INTERSECT
SELECT a.Country
FROM pharma_company.DistributionCenter dc JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 11. Strength values that appear in BOTH Product and (synthetic) a comparison list
SELECT Strength
FROM pharma_company.Product
WHERE Strength IS NOT NULL
INTERSECT
SELECT v.Strength
FROM (VALUES ('250 mg'),('500 mg'),('10 mg'),('20 mg'),('5 mg')) v(Strength);

-- 12. Product names that are BOTH Tablet AND have at least one QC result via a batch
SELECT p.Name
FROM pharma_company.Product p
WHERE p.Formulation = 'Tablet'
INTERSECT
SELECT p2.Name
FROM pharma_company.QCResult r
JOIN pharma_company.ManufacturingBatch b ON b.BatchID = r.BatchID AND b.BatchDate = r.BatchDate
JOIN pharma_company.Product p2 ON p2.ProductID = b.ProductID;
```

## Except
```sql
-- 1. Cities that have customers EXCEPT those that also have suppliers
SELECT a.City
FROM pharma_company.Customer c JOIN pharma_company.Address a ON a.AddressID = c.AddressID
EXCEPT
SELECT a.City
FROM pharma_company.Supplier s JOIN pharma_company.Address a ON a.AddressID = s.AddressID;

-- 2. Dates with sales orders EXCEPT dates with shipments (July 2025)
SELECT OrderDate
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT ShipmentDate
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. ProductIDs that have batches EXCEPT those that appear in inventory (July 2025)
SELECT ProductID
FROM pharma_company.ManufacturingBatch
WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT ProductID
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Customers who received shipments EXCEPT those who placed orders (July 2025)
SELECT CustomerID
FROM pharma_company.Shipment
WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT CustomerID
FROM pharma_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Agencies with submissions in July EXCEPT those with 'Approved' status in July
SELECT Agency
FROM pharma_company.RegulatorySubmission
WHERE SubmissionDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT Agency
FROM pharma_company.RegulatorySubmission
WHERE SubmissionDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND Status = 'Approved';

-- 6. Distribution centers with inventory on 2025-07-31 EXCEPT those that shipped that day
SELECT CenterID
FROM pharma_company.Inventory
WHERE SnapshotDate = '2025-07-31'
EXCEPT
SELECT CenterID
FROM pharma_company.Shipment
WHERE ShipmentDate = '2025-07-31';

-- 7. Tests executed in July EXCEPT those that ever failed in July
SELECT TestID
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT TestID
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31' AND PassFail = 'F';

-- 8. Tablet products EXCEPT those with any batch
SELECT ProductID
FROM pharma_company.Product
WHERE Formulation = 'Tablet'
EXCEPT
SELECT DISTINCT ProductID
FROM pharma_company.ManufacturingBatch;

-- 9. Customers in USA EXCEPT those that received shipments in July
SELECT c.CustomerID
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country = 'USA'
EXCEPT
SELECT s.CustomerID
FROM pharma_company.Shipment s
WHERE s.ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 10. Cities with distribution centers EXCEPT cities with customers
SELECT a.City
FROM pharma_company.DistributionCenter dc
JOIN pharma_company.Address a ON a.AddressID = dc.AddressID
EXCEPT
SELECT a.City
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID;

-- 11. Products that have regulatory submissions EXCEPT those with 'Approved' status
SELECT DISTINCT ProductID
FROM pharma_company.RegulatorySubmission
EXCEPT
SELECT DISTINCT ProductID
FROM pharma_company.RegulatorySubmission
WHERE Status = 'Approved';

-- 12. July inventory dates EXCEPT days with any QC tests
SELECT DISTINCT SnapshotDate
FROM pharma_company.Inventory
WHERE SnapshotDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT DISTINCT TestDate
FROM pharma_company.QCResult
WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
