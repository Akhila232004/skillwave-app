![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions

## Equality Operator (=)
```sql
-- 1. Orders with status exactly 'Open'
SELECT SalesOrderID, OrderDate, Status, TotalAmount
FROM retail_company.SalesOrder
WHERE Status = N'Open';

-- 2. Inventory on a specific date (2025-07-31)
SELECT InventoryID, ProductID, WarehouseID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31';

-- 3. Products in CategoryID = 1
SELECT ProductID, Name, CategoryID, UnitPrice
FROM retail_company.Product
WHERE CategoryID = 1;

-- 4. Customers located in India
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country = 'India';

-- 5. Warehouses at exact location 'Zone-A'
SELECT WarehouseID, Name, Location
FROM retail_company.Warehouse
WHERE Location = 'Zone-A';

-- 6. Discontinued products (flag equals 1)
SELECT ProductID, Name, Discontinued
FROM retail_company.Product
WHERE Discontinued = 1;

-- 7. Purchase orders that are 'Received'
SELECT PurchaseOrderID, OrderDate, ExpectedDate, Status
FROM retail_company.PurchaseOrder
WHERE Status = N'Received';

-- 8. Order lines with quantity exactly 1
SELECT SalesOrderDetailID, SalesOrderID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity = 1;

-- 9. Orders shipped on the same day as order date
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate = OrderDate;

-- 10. Suppliers with a specific email
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
WHERE Email = 'supplier10@example.com';
```

## Inequality Operator (<>)
```sql
-- 1. Orders not 'Cancelled'
SELECT SalesOrderID, OrderDate, Status
FROM retail_company.SalesOrder
WHERE Status <> N'Cancelled';

-- 2. Products not in CategoryID 1
SELECT ProductID, Name, CategoryID
FROM retail_company.Product
WHERE CategoryID <> 1;

-- 3. Suppliers without email set (email <> some literal AND IS NOT NULL guard)
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
WHERE Email IS NOT NULL AND Email <> 'supplier1@example.com';

-- 4. Warehouses not in 'Zone-A'
SELECT WarehouseID, Name, Location
FROM retail_company.Warehouse
WHERE Location <> 'Zone-A';

-- 5. Customers not in 'USA'
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country <> 'USA';

-- 6. Orders with ShipDate not equal to OrderDate (and not null)
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL AND ShipDate <> OrderDate;

-- 7. Products where UnitsInStock not equal to ReorderLevel
SELECT ProductID, Name, UnitsInStock, ReorderLevel
FROM retail_company.Product
WHERE UnitsInStock <> ReorderLevel;

-- 8. Purchase orders not 'Open'
SELECT PurchaseOrderID, Status, OrderDate
FROM retail_company.PurchaseOrder
WHERE Status <> N'Open';

-- 9. Customers with phone not equal to a given number
SELECT CustomerID, FirstName, LastName, Phone
FROM retail_company.Customer
WHERE Phone IS NOT NULL AND Phone <> '+1-444-3000';

-- 10. Order lines whose computed LineTotal not equal to UnitPrice*Quantity (sanity check)
SELECT SalesOrderDetailID, UnitPrice, Quantity, LineTotal
FROM retail_company.SalesOrderDetail
WHERE LineTotal <> UnitPrice * Quantity;  -- should return 0 rows if consistent
```

## IN Operator
```sql
-- 1. Orders with status in ('Open','Shipped')
SELECT SalesOrderID, Status, OrderDate
FROM retail_company.SalesOrder
WHERE Status IN (N'Open', N'Shipped');

-- 2. Products in category list (1,2,3)
SELECT ProductID, Name, CategoryID
FROM retail_company.Product
WHERE CategoryID IN (1,2,3);

-- 3. Suppliers with emails in a set
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
WHERE Email IN ('supplier1@example.com','supplier2@example.com','supplier3@example.com');

-- 4. Orders on specific dates in July 2025
SELECT SalesOrderID, OrderDate, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate IN ('2025-07-10','2025-07-15','2025-07-31');

-- 5. Warehouses in any of these zones
SELECT WarehouseID, Name, Location
FROM retail_company.Warehouse
WHERE Location IN ('Zone-A','Zone-B','Zone-C');

-- 6. Customers in selected countries
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country IN ('India','Germany','Canada');

-- 7. Purchase orders in statuses
SELECT PurchaseOrderID, Status
FROM retail_company.PurchaseOrder
WHERE Status IN (N'Open',N'Placed');

-- 8. Products with UnitPrice in a discrete set
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice IN (49.99, 99.99, 199.99);

-- 9. Order lines for some product IDs
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE ProductID IN (10,20,30,40);

-- 10. Inventory snapshots for warehouses 1..3
SELECT InventoryID, WarehouseID, StockDate, QuantityOnHand
FROM retail_company.Inventory
WHERE WarehouseID IN (1,2,3);
```

## NOT IN Operator
```sql
-- 1. Orders not in statuses ('Cancelled','Shipped')
SELECT SalesOrderID, Status, OrderDate
FROM retail_company.SalesOrder
WHERE Status NOT IN (N'Cancelled', N'Shipped');

-- 2. Products not in categories (4,5,6)
SELECT ProductID, Name, CategoryID
FROM retail_company.Product
WHERE CategoryID NOT IN (4,5,6);

-- 3. Warehouses not in Zone-B/C
SELECT WarehouseID, Name, Location
FROM retail_company.Warehouse
WHERE Location NOT IN ('Zone-B','Zone-C');

-- 4. Customers not in selected countries
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country NOT IN ('USA','UK');

-- 5. Suppliers whose emails are not one of the listed
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
WHERE Email NOT IN ('supplier10@example.com','supplier11@example.com');

-- 6. Orders not on specific dates
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate NOT IN ('2025-07-01','2025-07-31');

-- 7. Order lines not for product set
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE ProductID NOT IN (1,2,3);

-- 8. Purchase orders not in statuses Open/Placed
SELECT PurchaseOrderID, Status
FROM retail_company.PurchaseOrder
WHERE Status NOT IN (N'Open',N'Placed');

-- 9. Products not discontinued/not active list (by ID exclusion)
SELECT ProductID, Name
FROM retail_company.Product
WHERE ProductID NOT IN (101,102,103);

-- 10. Inventories not in warehouses 4 or 5 on 2025-07-31
SELECT InventoryID, WarehouseID, ProductID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
  AND WarehouseID NOT IN (4,5);
```

## LIKE Operator
```sql
-- 1. Products starting with 'Product-00'
SELECT ProductID, Name
FROM retail_company.Product
WHERE Name LIKE 'Product-00%';

-- 2. Customers whose first name starts with 'First1'
SELECT CustomerID, FirstName, LastName
FROM retail_company.Customer
WHERE FirstName LIKE 'First1%';

-- 3. Supplier emails ending with '@example.com'
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
WHERE Email LIKE '%@example.com';

-- 4. City names containing 'City1'
SELECT AddressID, City
FROM retail_company.Address
WHERE City LIKE '%City1%';

-- 5. Products with 'Pro' anywhere (case-insensitive default)
SELECT ProductID, Name
FROM retail_company.Product
WHERE Name LIKE '%Pro%';

-- 6. Category names with three digits (use underscore)
SELECT CategoryID, Name
FROM retail_company.ProductCategory
WHERE Name LIKE 'Category-___';

-- 7. Phone numbers with '+1-444-' prefix
SELECT CustomerID, Phone
FROM retail_company.Customer
WHERE Phone LIKE '+1-444-%';

-- 8. Warehouses named 'WH-0__' (WH-0 followed by any two chars)
SELECT WarehouseID, Name
FROM retail_company.Warehouse
WHERE Name LIKE 'WH-0__';

-- 9. Address ZIPs beginning with 'Z10'
SELECT AddressID, ZIP
FROM retail_company.Address
WHERE ZIP LIKE 'Z10%';

-- 10. Orders whose status contains 'hip' (e.g., Shipped)
SELECT SalesOrderID, Status
FROM retail_company.SalesOrder
WHERE Status LIKE '%hip%';
```

## NOT LIKE Operator
```sql
-- 1. Products NOT starting with 'Product-00'
SELECT ProductID, Name
FROM retail_company.Product
WHERE Name NOT LIKE 'Product-00%';

-- 2. Customers whose last name does NOT start with 'Last2'
SELECT CustomerID, FirstName, LastName
FROM retail_company.Customer
WHERE LastName NOT LIKE 'Last2%';

-- 3. Supplier emails not from example.com
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
WHERE Email IS NOT NULL AND Email NOT LIKE '%@example.com';

-- 4. Cities NOT containing 'City5'
SELECT AddressID, City
FROM retail_company.Address
WHERE City NOT LIKE '%City5%';

-- 5. Warehouses NOT matching pattern 'WH-1__'
SELECT WarehouseID, Name
FROM retail_company.Warehouse
WHERE Name NOT LIKE 'WH-1__';

-- 6. ZIPs not starting with 'Z000'
SELECT AddressID, ZIP
FROM retail_company.Address
WHERE ZIP NOT LIKE 'Z000%';

-- 7. Customers with phone not in '+1-444-%'
SELECT CustomerID, Phone
FROM retail_company.Customer
WHERE Phone IS NOT NULL AND Phone NOT LIKE '+1-444-%';

-- 8. Categories not like 'Category-00_'
SELECT CategoryID, Name
FROM retail_company.ProductCategory
WHERE Name NOT LIKE 'Category-00_';

-- 9. Product names not containing dash '-'
SELECT ProductID, Name
FROM retail_company.Product
WHERE Name NOT LIKE '%-%';

-- 10. Orders whose status doesn’t contain 'pen' (i.e., not 'Open')
SELECT SalesOrderID, Status
FROM retail_company.SalesOrder
WHERE Status NOT LIKE '%pen%';
```

## BETWEEN Operator
```sql
-- 1. Orders between 2025-07-10 and 2025-07-20 (inclusive)
SELECT SalesOrderID, OrderDate, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-10' AND '2025-07-20';

-- 2. Products priced between 50 and 150
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice BETWEEN 50 AND 150
ORDER BY UnitPrice;

-- 3. Order lines with quantity between 3 and 7
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity BETWEEN 3 AND 7;

-- 4. Inventory snapshot dates between 2025-07-25 and 2025-07-31
SELECT InventoryID, StockDate, ProductID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate BETWEEN '2025-07-25' AND '2025-07-31';

-- 5. Purchase orders expected between 2025-07-15 and 2025-07-25
SELECT PurchaseOrderID, ExpectedDate, Status
FROM retail_company.PurchaseOrder
WHERE ExpectedDate BETWEEN '2025-07-15' AND '2025-07-25';

-- 6. Products with UnitsInStock between 100 and 300
SELECT ProductID, Name, UnitsInStock
FROM retail_company.Product
WHERE UnitsInStock BETWEEN 100 AND 300;

-- 7. ReorderLevel between 10 and 60
SELECT ProductID, Name, ReorderLevel
FROM retail_company.Product
WHERE ReorderLevel BETWEEN 10 AND 60;

-- 8. TotalAmount between 1,000 and 10,000 in July
SELECT SalesOrderID, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND TotalAmount BETWEEN 1000 AND 10000;

-- 9. CategoryID between 2 and 5
SELECT ProductID, Name, CategoryID
FROM retail_company.Product
WHERE CategoryID BETWEEN 2 AND 5;

-- 10. SupplierID between 10 and 20
SELECT SupplierID, Name
FROM retail_company.Supplier
WHERE SupplierID BETWEEN 10 AND 20;
```

## Greater Than (>)
```sql
-- 1. Orders with amount > 10,000
SELECT SalesOrderID, TotalAmount
FROM retail_company.SalesOrder
WHERE TotalAmount > 10000;

-- 2. Products with price > 200
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice > 200;

-- 3. Order lines with quantity > 5
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity > 5;

-- 4. Inventory on 2025-07-31 with QuantityOnHand > 5000
SELECT InventoryID, ProductID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31' AND QuantityOnHand > 5000;

-- 5. Products where UnitsInStock > ReorderLevel
SELECT ProductID, Name, UnitsInStock, ReorderLevel
FROM retail_company.Product
WHERE UnitsInStock > ReorderLevel;

-- 6. Purchase orders with TotalAmount > 50,000
SELECT PurchaseOrderID, TotalAmount
FROM retail_company.PurchaseOrder
WHERE TotalAmount > 50000;

-- 7. Suppliers with ID > 20
SELECT SupplierID, Name
FROM retail_company.Supplier
WHERE SupplierID > 20;

-- 8. Customers with ID > 300
SELECT CustomerID, FirstName, LastName
FROM retail_company.Customer
WHERE CustomerID > 300;

-- 9. Orders dated after 2025-07-20
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate > '2025-07-20';

-- 10. Products with ReorderLevel > 40
SELECT ProductID, Name, ReorderLevel
FROM retail_company.Product
WHERE ReorderLevel > 40;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Orders on/after 2025-07-15
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-15';

-- 2. Products priced >= 99.99
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice >= 99.99;

-- 3. Order lines with quantity >= 10
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity >= 10;

-- 4. Inventory (2025-07-31) with QuantityOnHand >= 8000
SELECT InventoryID, ProductID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31' AND QuantityOnHand >= 8000;

-- 5. Purchase orders with TotalAmount >= 100,000
SELECT PurchaseOrderID, TotalAmount
FROM retail_company.PurchaseOrder
WHERE TotalAmount >= 100000;

-- 6. Products with UnitsInStock >= ReorderLevel
SELECT ProductID, Name, UnitsInStock, ReorderLevel
FROM retail_company.Product
WHERE UnitsInStock >= ReorderLevel;

-- 7. Suppliers with ID >= 10
SELECT SupplierID, Name
FROM retail_company.Supplier
WHERE SupplierID >= 10;

-- 8. Customers with ID >= 500
SELECT CustomerID, FirstName, LastName
FROM retail_company.Customer
WHERE CustomerID >= 500;

-- 9. ReorderLevel >= 30
SELECT ProductID, Name, ReorderLevel
FROM retail_company.Product
WHERE ReorderLevel >= 30;

-- 10. Orders with TotalAmount >= 5,000
SELECT SalesOrderID, TotalAmount
FROM retail_company.SalesOrder
WHERE TotalAmount >= 5000;
```

## Less Than (<)
```sql
-- 1. Orders with amount < 1,000
SELECT SalesOrderID, TotalAmount
FROM retail_company.SalesOrder
WHERE TotalAmount < 1000;

-- 2. Products priced < 50
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice < 50;

-- 3. Order lines with quantity < 3
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity < 3;

-- 4. Inventory (2025-07-31) with QuantityOnHand < 500
SELECT InventoryID, ProductID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31' AND QuantityOnHand < 500;

-- 5. Products with UnitsInStock < ReorderLevel
SELECT ProductID, Name, UnitsInStock, ReorderLevel
FROM retail_company.Product
WHERE UnitsInStock < ReorderLevel;

-- 6. Purchase orders with TotalAmount < 5,000
SELECT PurchaseOrderID, TotalAmount
FROM retail_company.PurchaseOrder
WHERE TotalAmount < 5000;

-- 7. Suppliers with ID < 5
SELECT SupplierID, Name
FROM retail_company.Supplier
WHERE SupplierID < 5;

-- 8. Customers with ID < 50
SELECT CustomerID, FirstName, LastName
FROM retail_company.Customer
WHERE CustomerID < 50;

-- 9. ReorderLevel < 25
SELECT ProductID, Name, ReorderLevel
FROM retail_company.Product
WHERE ReorderLevel < 25;

-- 10. Orders before 2025-07-10
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate < '2025-07-10';
```

## Less Than or Equal To (<=)
```sql
-- 1. Orders on/before 2025-07-05
SELECT SalesOrderID, OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate <= '2025-07-05';

-- 2. Products priced <= 20
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice <= 20;

-- 3. Order lines with quantity <= 2
SELECT SalesOrderDetailID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity <= 2;

-- 4. Inventory (2025-07-31) with QuantityOnHand <= 1000
SELECT InventoryID, ProductID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31' AND QuantityOnHand <= 1000;

-- 5. Purchase orders with TotalAmount <= 10,000
SELECT PurchaseOrderID, TotalAmount
FROM retail_company.PurchaseOrder
WHERE TotalAmount <= 10000;

-- 6. Products with UnitsInStock <= ReorderLevel
SELECT ProductID, Name, UnitsInStock, ReorderLevel
FROM retail_company.Product
WHERE UnitsInStock <= ReorderLevel;

-- 7. Suppliers with ID <= 12
SELECT SupplierID, Name
FROM retail_company.Supplier
WHERE SupplierID <= 12;

-- 8. Customers with ID <= 100
SELECT CustomerID, FirstName, LastName
FROM retail_company.Customer
WHERE CustomerID <= 100;

-- 9. ReorderLevel <= 15
SELECT ProductID, Name, ReorderLevel
FROM retail_company.Product
WHERE ReorderLevel <= 15;

-- 10. Orders with TotalAmount <= 1,500
SELECT SalesOrderID, TotalAmount
FROM retail_company.SalesOrder
WHERE TotalAmount <= 1500;
```

## EXISTS Operator
```sql
-- 1. Customers who placed at least one order in July 2025
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName
FROM retail_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM retail_company.SalesOrder so
  WHERE so.CustomerID = c.CustomerID
    AND so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 2. Products that appear in any order line
SELECT p.ProductID, p.Name
FROM retail_company.Product p
WHERE EXISTS (
  SELECT 1
  FROM retail_company.SalesOrderDetail d
  WHERE d.ProductID = p.ProductID
);

-- 3. Categories that have at least one product
SELECT pc.CategoryID, pc.Name
FROM retail_company.ProductCategory pc
WHERE EXISTS (
  SELECT 1 FROM retail_company.Product p
  WHERE p.CategoryID = pc.CategoryID
);

-- 4. Suppliers that supply at least one product
SELECT s.SupplierID, s.Name
FROM retail_company.Supplier s
WHERE EXISTS (
  SELECT 1 FROM retail_company.Product p
  WHERE p.SupplierID = s.SupplierID
);

-- 5. Orders that have at least one line
SELECT so.SalesOrderID, so.OrderDate
FROM retail_company.SalesOrder so
WHERE EXISTS (
  SELECT 1 FROM retail_company.SalesOrderDetail d
  WHERE d.SalesOrderID = so.SalesOrderID
    AND d.OrderDate = so.OrderDate
);

-- 6. Products with any inventory snapshot on 2025-07-31
SELECT p.ProductID, p.Name
FROM retail_company.Product p
WHERE EXISTS (
  SELECT 1
  FROM retail_company.Inventory i
  WHERE i.ProductID = p.ProductID
    AND i.StockDate = '2025-07-31'
);

-- 7. Suppliers with any purchase order in July 2025
SELECT s.SupplierID, s.Name
FROM retail_company.Supplier s
WHERE EXISTS (
  SELECT 1 FROM retail_company.PurchaseOrder po
  WHERE po.SupplierID = s.SupplierID
    AND po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 8. Warehouses having inventory rows
SELECT w.WarehouseID, w.Name
FROM retail_company.Warehouse w
WHERE EXISTS (
  SELECT 1 FROM retail_company.Inventory i
  WHERE i.WarehouseID = w.WarehouseID
);

-- 9. Customers with shipping addresses (ShipAddressID set on any order)
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName
FROM retail_company.Customer c
WHERE EXISTS (
  SELECT 1 FROM retail_company.SalesOrder so
  WHERE so.CustomerID = c.CustomerID AND so.ShipAddressID IS NOT NULL
);

-- 10. Products that are part of any purchase order detail
SELECT p.ProductID, p.Name
FROM retail_company.Product p
WHERE EXISTS (
  SELECT 1 FROM retail_company.PurchaseOrderDetail pod
  WHERE pod.ProductID = p.ProductID
);
```

## NOT EXISTS Operator
```sql
-- 1. Customers with no orders in July 2025
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName
FROM retail_company.Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.SalesOrder so
  WHERE so.CustomerID = c.CustomerID
    AND so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 2. Products that were never ordered (no order lines at all)
SELECT p.ProductID, p.Name
FROM retail_company.Product p
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.SalesOrderDetail d
  WHERE d.ProductID = p.ProductID
);

-- 3. Categories without products
SELECT pc.CategoryID, pc.Name
FROM retail_company.ProductCategory pc
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.Product p
  WHERE p.CategoryID = pc.CategoryID
);

-- 4. Suppliers that do not supply any product
SELECT s.SupplierID, s.Name
FROM retail_company.Supplier s
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.Product p
  WHERE p.SupplierID = s.SupplierID
);

-- 5. Orders that (unexpectedly) have no lines
SELECT so.SalesOrderID, so.OrderDate
FROM retail_company.SalesOrder so
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.SalesOrderDetail d
  WHERE d.SalesOrderID = so.SalesOrderID
    AND d.OrderDate = so.OrderDate
);

-- 6. Products with no inventory on 2025-07-31
SELECT p.ProductID, p.Name
FROM retail_company.Product p
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.Inventory i
  WHERE i.ProductID = p.ProductID
    AND i.StockDate = '2025-07-31'
);

-- 7. Warehouses without any inventory row
SELECT w.WarehouseID, w.Name
FROM retail_company.Warehouse w
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.Inventory i
  WHERE i.WarehouseID = w.WarehouseID
);

-- 8. Suppliers without purchase orders in July 2025
SELECT s.SupplierID, s.Name
FROM retail_company.Supplier s
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.PurchaseOrder po
  WHERE po.SupplierID = s.SupplierID
    AND po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
);

-- 9. Customers who have never specified a shipping address on any order
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName
FROM retail_company.Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.SalesOrder so
  WHERE so.CustomerID = c.CustomerID AND so.ShipAddressID IS NOT NULL
);

-- 10. Products never purchased via any PO detail
SELECT p.ProductID, p.Name
FROM retail_company.Product p
WHERE NOT EXISTS (
  SELECT 1 FROM retail_company.PurchaseOrderDetail pod
  WHERE pod.ProductID = p.ProductID
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
