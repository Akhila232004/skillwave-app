![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. Customer with mailing city/state (Customer ↔ Address)
SELECT c.CustomerID, c.Name AS CustomerName, a.City, a.State, a.Country
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID;

-- 2. Supplier contact and city (Supplier ↔ Address)
SELECT s.SupplierID, s.Name AS SupplierName, s.ContactName, s.Email, a.City, a.Country
FROM pharma_company.Supplier s
JOIN pharma_company.Address a ON a.AddressID = s.AddressID;

-- 3. Distribution centers with city/state (DC ↔ Address)
SELECT dc.CenterID, dc.Name AS CenterName, a.City, a.State
FROM pharma_company.DistributionCenter dc
JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 4. Sales orders with customer name (SalesOrder ↔ Customer)
SELECT so.SalesOrderID, so.OrderDate, so.TotalAmount, c.CustomerID, c.Name AS CustomerName
FROM pharma_company.SalesOrder so
JOIN pharma_company.Customer c ON c.CustomerID = so.CustomerID;

-- 5. Shipments with center & customer names (Shipment ↔ DC ↔ Customer)
SELECT sh.ShipmentID, sh.ShipmentDate, sh.QuantityUnits,
       dc.Name AS CenterName, c.Name AS CustomerName
FROM pharma_company.Shipment sh
JOIN pharma_company.DistributionCenter dc ON dc.CenterID = sh.CenterID
JOIN pharma_company.Customer c ON c.CustomerID = sh.CustomerID;

-- 6. Batches with product info (ManufacturingBatch ↔ Product)
SELECT b.BatchID, b.BatchDate, b.QuantityUnits, b.Status,
       p.ProductID, p.Name AS ProductName, p.Formulation
FROM pharma_company.ManufacturingBatch b
JOIN pharma_company.Product p ON p.ProductID = b.ProductID;

-- 7. QC results with batch & product (QCResult ↔ Batch ↔ Product)
SELECT r.ResultID, r.TestDate, r.PassFail, b.BatchID, b.BatchDate, p.Name AS ProductName
FROM pharma_company.QCResult r
JOIN pharma_company.ManufacturingBatch b
  ON b.BatchID = r.BatchID AND b.BatchDate = r.BatchDate
JOIN pharma_company.Product p ON p.ProductID = b.ProductID;

-- 8. Formulation lines with product & raw material (Formulation ↔ Product ↔ RawMaterial)
SELECT f.ProductID, p.Name AS ProductName, f.RawMaterialID, rm.Name AS RawMaterialName, f.Percentage
FROM pharma_company.Formulation f
JOIN pharma_company.Product p ON p.ProductID = f.ProductID
JOIN pharma_company.RawMaterial rm ON rm.RawMaterialID = f.RawMaterialID;

-- 9. Inventory snapshot with product & center names (Inventory ↔ Product ↔ DC)
SELECT i.InventoryID, i.SnapshotDate, i.QuantityUnits,
       p.Name AS ProductName, dc.Name AS CenterName
FROM pharma_company.Inventory i
JOIN pharma_company.Product p ON p.ProductID = i.ProductID
JOIN pharma_company.DistributionCenter dc ON dc.CenterID = i.CenterID;

-- 10. Regulatory submissions with product info (RegSubmission ↔ Product)
SELECT rs.SubmissionID, rs.Agency, rs.Status, rs.SubmissionDate,
       p.ProductID, p.Name AS ProductName
FROM pharma_company.RegulatorySubmission rs
JOIN pharma_company.Product p ON p.ProductID = rs.ProductID;

-- 11. Raw materials with their supplier name (RawMaterial ↔ Supplier)
SELECT rm.RawMaterialID, rm.Name AS RawMaterialName, s.SupplierID, s.Name AS SupplierName
FROM pharma_company.RawMaterial rm
JOIN pharma_company.Supplier s ON s.SupplierID = rm.SupplierID;

-- 12. Quality tests executed per batch (QCResult ↔ QualityTest)
SELECT r.ResultID, r.BatchID, r.TestDate, qt.TestID, qt.Name AS TestName, qt.Method
FROM pharma_company.QCResult r
JOIN pharma_company.QualityTest qt ON qt.TestID = r.TestID;
```

## Left Join (Left Outer Join)
```sql
-- 1. All customers and their mailing city (null if no address)
SELECT c.CustomerID, c.Name AS CustomerName, a.City, a.State
FROM pharma_company.Customer c
LEFT JOIN pharma_company.Address a ON a.AddressID = c.AddressID;

-- 2. All suppliers and their address (allowing missing AddressID)
SELECT s.SupplierID, s.Name AS SupplierName, a.City, a.Country
FROM pharma_company.Supplier s
LEFT JOIN pharma_company.Address a ON a.AddressID = s.AddressID;

-- 3. All distribution centers with city (including centers without address)
SELECT dc.CenterID, dc.Name, a.City, a.State
FROM pharma_company.DistributionCenter dc
LEFT JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 4. All products with any regulatory submission (nulls for no submission)
SELECT p.ProductID, p.Name AS ProductName, rs.Agency, rs.Status, rs.SubmissionDate
FROM pharma_company.Product p
LEFT JOIN pharma_company.RegulatorySubmission rs ON rs.ProductID = p.ProductID;

-- 5. All products with last inventory on 2025-07-31 (may be null)
SELECT p.ProductID, p.Name AS ProductName, i.SnapshotDate, i.QuantityUnits
FROM pharma_company.Product p
LEFT JOIN pharma_company.Inventory i
  ON i.ProductID = p.ProductID AND i.SnapshotDate = '2025-07-31';

-- 6. All batches with QC results (show nulls if none)
SELECT b.BatchID, b.BatchDate, p.Name AS ProductName, r.ResultID, r.TestID, r.PassFail
FROM pharma_company.ManufacturingBatch b
LEFT JOIN pharma_company.QCResult r
  ON r.BatchID = b.BatchID AND r.BatchDate = b.BatchDate
LEFT JOIN pharma_company.Product p ON p.ProductID = b.ProductID;

-- 7. All customers with July-2025 orders (nulls if none)
SELECT c.CustomerID, c.Name, so.SalesOrderID, so.OrderDate, so.TotalAmount
FROM pharma_company.Customer c
LEFT JOIN pharma_company.SalesOrder so
  ON so.CustomerID = c.CustomerID
 AND so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 8. All centers with shipments on 2025-07-31 (nulls if none that day)
SELECT dc.CenterID, dc.Name, s.ShipmentID, s.QuantityUnits
FROM pharma_company.DistributionCenter dc
LEFT JOIN pharma_company.Shipment s
  ON s.CenterID = dc.CenterID AND s.ShipmentDate = '2025-07-31';

-- 9. All products and their formulation lines (null if none)
SELECT p.ProductID, p.Name AS ProductName, f.RawMaterialID, f.Percentage
FROM pharma_company.Product p
LEFT JOIN pharma_company.Formulation f ON f.ProductID = p.ProductID
ORDER BY p.ProductID, f.RawMaterialID;

-- 10. All equipment with location's address city (equipment has only Location text; demo null join)
-- (Mapping table doesn't exist; emulate by joining to DC on matching name - for illustration assume Location = 'Plant-A' etc.)
SELECT e.EquipmentID, e.Name, e.Location, a.City
FROM pharma_company.Equipment e
LEFT JOIN pharma_company.DistributionCenter dc ON 1=0  -- no real mapping; yields null City
LEFT JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 11. All suppliers with any raw materials supplied
SELECT s.SupplierID, s.Name AS SupplierName, rm.RawMaterialID, rm.Name AS RawMaterialName
FROM pharma_company.Supplier s
LEFT JOIN pharma_company.RawMaterial rm ON rm.SupplierID = s.SupplierID;

-- 12. All quality tests with July-2025 execution examples
SELECT qt.TestID, qt.Name AS TestName, r.ResultID, r.TestDate
FROM pharma_company.QualityTest qt
LEFT JOIN pharma_company.QCResult r
  ON r.TestID = qt.TestID
 AND r.TestDate BETWEEN '2025-07-01' AND '2025-07-31';
```

## Right Join (Right Outer Join)
```sql
-- 1. Orders (preserved) with customer names (null if missing customer)
SELECT c.Name AS CustomerName, so.SalesOrderID, so.OrderDate, so.TotalAmount
FROM pharma_company.Customer c
RIGHT JOIN pharma_company.SalesOrder so ON so.CustomerID = c.CustomerID;

-- 2. Shipments (preserved) with center names
SELECT s.ShipmentID, s.ShipmentDate, s.QuantityUnits, dc.Name AS CenterName
FROM pharma_company.DistributionCenter dc
RIGHT JOIN pharma_company.Shipment s ON s.CenterID = dc.CenterID;

-- 3. Shipments (preserved) with customer names
SELECT s.ShipmentID, s.ShipmentDate, c.Name AS CustomerName, s.QuantityUnits
FROM pharma_company.Customer c
RIGHT JOIN pharma_company.Shipment s ON s.CustomerID = c.CustomerID;

-- 4. Inventory (preserved) with product names
SELECT i.InventoryID, i.SnapshotDate, i.QuantityUnits, p.Name AS ProductName
FROM pharma_company.Product p
RIGHT JOIN pharma_company.Inventory i ON i.ProductID = p.ProductID;

-- 5. QC results (preserved) with test names
SELECT r.ResultID, r.TestDate, qt.Name AS TestName, r.PassFail
FROM pharma_company.QualityTest qt
RIGHT JOIN pharma_company.QCResult r ON r.TestID = qt.TestID;

-- 6. Batches (preserved) with product names
SELECT b.BatchID, b.BatchDate, p.Name AS ProductName, b.Status
FROM pharma_company.Product p
RIGHT JOIN pharma_company.ManufacturingBatch b ON b.ProductID = p.ProductID;

-- 7. Formulation (preserved) with product names
SELECT f.ProductID, p.Name AS ProductName, f.RawMaterialID, f.Percentage
FROM pharma_company.Product p
RIGHT JOIN pharma_company.Formulation f ON f.ProductID = p.ProductID;

-- 8. Raw materials (preserved) with supplier names
SELECT rm.RawMaterialID, rm.Name AS RawMaterialName, s.Name AS SupplierName
FROM pharma_company.Supplier s
RIGHT JOIN pharma_company.RawMaterial rm ON rm.SupplierID = s.SupplierID;

-- 9. DCs' addresses (addresses preserved) – demo: show any addresses linked to DCs
SELECT a.AddressID, a.City, a.State, dc.CenterID, dc.Name
FROM pharma_company.DistributionCenter dc
RIGHT JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 10. Customers' addresses (addresses preserved)
SELECT a.AddressID, a.City, a.State, c.CustomerID, c.Name
FROM pharma_company.Customer c
RIGHT JOIN pharma_company.Address a ON a.AddressID = c.AddressID;
```

## Full Join (Full Outer Join)
```sql
-- 1. All cities used by customers or suppliers with who uses them
SELECT COALESCE(a1.City, a2.City) AS City,
       CASE WHEN a1.City IS NOT NULL THEN 1 ELSE 0 END AS HasCustomers,
       CASE WHEN a2.City IS NOT NULL THEN 1 ELSE 0 END AS HasSuppliers
FROM (SELECT DISTINCT a.City FROM pharma_company.Customer c JOIN pharma_company.Address a ON a.AddressID = c.AddressID) a1
FULL OUTER JOIN (SELECT DISTINCT a.City FROM pharma_company.Supplier s JOIN pharma_company.Address a ON a.AddressID = s.AddressID) a2
  ON a1.City = a2.City;

-- 2. Days with orders or shipments (all days, marked)
SELECT COALESCE(o.OrderDate, sh.ShipmentDate) AS ActivityDate,
       CASE WHEN o.OrderDate IS NOT NULL THEN 1 ELSE 0 END AS HadOrders,
       CASE WHEN sh.ShipmentDate IS NOT NULL THEN 1 ELSE 0 END AS HadShipments
FROM (SELECT DISTINCT OrderDate FROM pharma_company.SalesOrder) o
FULL OUTER JOIN (SELECT DISTINCT ShipmentDate FROM pharma_company.Shipment) sh
  ON o.OrderDate = sh.ShipmentDate;

-- 3. Products that appear in batches or inventory on 2025-07-31
SELECT COALESCE(b.ProductID, i.ProductID) AS ProductID,
       CASE WHEN b.ProductID IS NOT NULL THEN 1 ELSE 0 END AS InBatches,
       CASE WHEN i.ProductID IS NOT NULL THEN 1 ELSE 0 END AS InInventory_2025_07_31
FROM (SELECT DISTINCT ProductID FROM pharma_company.ManufacturingBatch) b
FULL OUTER JOIN (SELECT DISTINCT ProductID FROM pharma_company.Inventory WHERE SnapshotDate='2025-07-31') i
  ON b.ProductID = i.ProductID;

-- 4. Customers who ordered or received shipments in July-2025
SELECT COALESCE(o.CustomerID, s.CustomerID) AS CustomerID,
       CASE WHEN o.CustomerID IS NOT NULL THEN 1 ELSE 0 END AS Ordered,
       CASE WHEN s.CustomerID IS NOT NULL THEN 1 ELSE 0 END AS ShippedTo
FROM (SELECT DISTINCT CustomerID FROM pharma_company.SalesOrder WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31') o
FULL OUTER JOIN (SELECT DISTINCT CustomerID FROM pharma_company.Shipment WHERE ShipmentDate BETWEEN '2025-07-01' AND '2025-07-31') s
  ON o.CustomerID = s.CustomerID;

-- 5. Centers with inventory on 2025-07-31 or shipments the same day
SELECT COALESCE(inv.CenterID, shp.CenterID) AS CenterID,
       CASE WHEN inv.CenterID IS NOT NULL THEN 1 ELSE 0 END AS HadInventory,
       CASE WHEN shp.CenterID IS NOT NULL THEN 1 ELSE 0 END AS HadShipments
FROM (SELECT DISTINCT CenterID FROM pharma_company.Inventory WHERE SnapshotDate='2025-07-31') inv
FULL OUTER JOIN (SELECT DISTINCT CenterID FROM pharma_company.Shipment WHERE ShipmentDate='2025-07-31') shp
  ON inv.CenterID = shp.CenterID;

-- 6. QC tests that passed or failed in July-2025
SELECT COALESCE(p.TestID, f.TestID) AS TestID,
       CASE WHEN p.TestID IS NOT NULL THEN 1 ELSE 0 END AS HasPass,
       CASE WHEN f.TestID IS NOT NULL THEN 1 ELSE 0 END AS HasFail
FROM (SELECT DISTINCT TestID FROM pharma_company.QCResult WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31' AND PassFail='P') p
FULL OUTER JOIN (SELECT DISTINCT TestID FROM pharma_company.QCResult WHERE TestDate BETWEEN '2025-07-01' AND '2025-07-31' AND PassFail='F') f
  ON p.TestID = f.TestID;

-- 7. Products with regulatory submissions or batches
SELECT COALESCE(rs.ProductID, b.ProductID) AS ProductID,
       CASE WHEN rs.ProductID IS NOT NULL THEN 1 ELSE 0 END AS HasSubmission,
       CASE WHEN b.ProductID IS NOT NULL THEN 1 ELSE 0 END AS HasBatch
FROM (SELECT DISTINCT ProductID FROM pharma_company.RegulatorySubmission) rs
FULL OUTER JOIN (SELECT DISTINCT ProductID FROM pharma_company.ManufacturingBatch) b
  ON rs.ProductID = b.ProductID;

-- 8. Addresses used by either customers or suppliers (one list)
SELECT COALESCE(ac.AddressID, asup.AddressID) AS AddressID,
       CASE WHEN ac.AddressID IS NOT NULL THEN 1 ELSE 0 END AS UsedByCustomer,
       CASE WHEN asup.AddressID IS NOT NULL THEN 1 ELSE 0 END AS UsedBySupplier
FROM (SELECT DISTINCT AddressID FROM pharma_company.Customer WHERE AddressID IS NOT NULL) ac
FULL OUTER JOIN (SELECT DISTINCT AddressID FROM pharma_company.Supplier WHERE AddressID IS NOT NULL) asup
  ON ac.AddressID = asup.AddressID;

-- 9. Days with QC tests or inventory snapshots (all unique dates)
SELECT COALESCE(q.TestDate, i.SnapshotDate) AS D,
       CASE WHEN q.TestDate IS NOT NULL THEN 1 ELSE 0 END AS HasQC,
       CASE WHEN i.SnapshotDate IS NOT NULL THEN 1 ELSE 0 END AS HasInventory
FROM (SELECT DISTINCT TestDate FROM pharma_company.QCResult) q
FULL OUTER JOIN (SELECT DISTINCT SnapshotDate FROM pharma_company.Inventory) i
  ON q.TestDate = i.SnapshotDate;

-- 10. Suppliers or raw materials having associations
SELECT COALESCE(s.SupplierID, rm.SupplierID) AS SupplierID,
       s.Name AS SupplierName, rm.RawMaterialID, rm.Name AS RawMaterialName
FROM pharma_company.Supplier s
FULL OUTER JOIN pharma_company.RawMaterial rm
  ON rm.SupplierID = s.SupplierID;

-- 11. Centers or equipment locations (textual match demo; yields mostly nulls)
SELECT dc.Name AS CenterName, e.Name AS EquipmentName, COALESCE(dc.Name, e.Location) AS Place
FROM pharma_company.DistributionCenter dc
FULL OUTER JOIN pharma_company.Equipment e ON 1=0;  -- illustrative

-- 12. Products appearing in inventory last 5 days of July or having July batches
SELECT COALESCE(inv.ProductID, bt.ProductID) AS ProductID,
       CASE WHEN inv.ProductID IS NOT NULL THEN 1 ELSE 0 END AS InInvLast5Days,
       CASE WHEN bt.ProductID IS NOT NULL THEN 1 ELSE 0 END AS HasJulyBatch
FROM (SELECT DISTINCT ProductID FROM pharma_company.Inventory WHERE SnapshotDate BETWEEN '2025-07-27' AND '2025-07-31') inv
FULL OUTER JOIN (SELECT DISTINCT ProductID FROM pharma_company.ManufacturingBatch WHERE BatchDate BETWEEN '2025-07-01' AND '2025-07-31') bt
  ON inv.ProductID = bt.ProductID;
```

## Cross Join
```sql
-- 1. Generate a small calendar for last 5 days of July (derived list) × a sample product set
WITH Dates AS (
  SELECT CAST('2025-07-27' AS date) AS d UNION ALL
  SELECT '2025-07-28' UNION ALL SELECT '2025-07-29' UNION ALL
  SELECT '2025-07-30' UNION ALL SELECT '2025-07-31'
),
Products AS (
  SELECT TOP (5) ProductID, Name FROM pharma_company.Product ORDER BY ProductID
)
SELECT d.d AS SnapshotDate, p.ProductID, p.Name
FROM Dates d
CROSS JOIN Products p;

-- 2. Cartesian of 3 agencies × 3 statuses (reference lists)
WITH Agencies AS (SELECT v AS Agency FROM (VALUES ('FDA'),('EMA'),('PMDA')) x(v)),
     Statuses AS (SELECT v AS Status FROM (VALUES ('Pending'),('Approved'),('In Review')) x(v))
SELECT a.Agency, s.Status
FROM Agencies a
CROSS JOIN Statuses s;

-- 3. Prototype daily center-product grid (TOP to limit)
SELECT TOP (50) d.d AS SnapshotDate, dc.CenterID, p.ProductID
FROM (SELECT TOP (10) CenterID FROM pharma_company.DistributionCenter ORDER BY CenterID) dc
CROSS JOIN (SELECT TOP (5) ProductID FROM pharma_company.Product ORDER BY ProductID) p
CROSS JOIN (
  SELECT CAST('2025-07-27' AS date) AS d UNION ALL
  SELECT '2025-07-28' UNION ALL SELECT '2025-07-29' UNION ALL
  SELECT '2025-07-30' UNION ALL SELECT '2025-07-31'
) d;

-- 4. Price tiers × strength variants (synthetic lists)
WITH PriceTier AS (SELECT v AS Tier FROM (VALUES ('Low'),('Mid'),('High')) x(v)),
     Strengths AS (SELECT DISTINCT Strength FROM pharma_company.Product WHERE Strength IS NOT NULL)
SELECT pt.Tier, s.Strength
FROM PriceTier pt
CROSS JOIN Strengths s;

-- 5. QA matrix: subset of tests × subset of products
SELECT TOP (100) qt.TestID, qt.Name AS TestName, p.ProductID, p.Name AS ProductName
FROM (SELECT TOP (10) TestID, Name FROM pharma_company.QualityTest ORDER BY TestID) qt
CROSS JOIN (SELECT TOP (10) ProductID, Name FROM pharma_company.Product ORDER BY ProductID) p;

-- 6. Shipment planning slots: 3 time windows × 5 centers
WITH Slots AS (SELECT v AS Slot FROM (VALUES ('Morning'),('Afternoon'),('Evening')) x(v))
SELECT s.Slot, dc.CenterID, dc.Name
FROM Slots s
CROSS JOIN (SELECT TOP (5) CenterID, Name FROM pharma_company.DistributionCenter ORDER BY CenterID) dc;

-- 7. Batch QC run schedule seeds: 2 offset days × 5 batches
WITH Offsets AS (SELECT v AS DayOffset FROM (VALUES (1),(2)) x(v))
SELECT b.BatchID, b.BatchDate, o.DayOffset, DATEADD(DAY, o.DayOffset, b.BatchDate) AS PlannedTestDate
FROM (SELECT TOP (5) BatchID, BatchDate FROM pharma_company.ManufacturingBatch ORDER BY BatchDate DESC) b
CROSS JOIN Offsets o;

-- 8. Label templates: 4 locales × 5 products
WITH Locales AS (SELECT v AS Locale FROM (VALUES ('en-US'),('en-GB'),('de-DE'),('hi-IN')) x(v))
SELECT l.Locale, p.ProductID, p.Name
FROM Locales l
CROSS JOIN (SELECT TOP (5) ProductID, Name FROM pharma_company.Product ORDER BY ProductID) p;

-- 9. Demand scenarios: 3 multipliers × 5 customers' July totals
WITH Mult AS (SELECT v AS m FROM (VALUES (0.9),(1.0),(1.1)) x(v)),
     CustAgg AS (
       SELECT TOP (5) CustomerID, SUM(TotalUnits) AS JulyUnits
       FROM pharma_company.SalesOrder
       WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
       GROUP BY CustomerID
       ORDER BY SUM(TotalUnits) DESC
     )
SELECT c.CustomerID, c.JulyUnits, m.m AS Multiplier,
       CAST(c.JulyUnits * m.m AS DECIMAL(18,2)) AS ScenarioUnits
FROM CustAgg c
CROSS JOIN Mult m;

-- 10. Inventory drain tests: 3 daily decrements × 5 product-center pairs
WITH Decs AS (SELECT v AS Decrement FROM (VALUES (50),(100),(200)) x(v))
SELECT TOP (100)
  i.CenterID, i.ProductID, i.SnapshotDate, i.QuantityUnits,
  d.Decrement, i.QuantityUnits - d.Decrement AS PostDecrement
FROM pharma_company.Inventory i
CROSS JOIN Decs d
WHERE i.SnapshotDate = '2025-07-31';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
