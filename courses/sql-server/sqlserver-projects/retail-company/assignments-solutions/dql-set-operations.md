![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. Customers who ordered in either first-half or second-half of July 2025
SELECT DISTINCT CustomerID
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-15'
UNION
SELECT DISTINCT CustomerID
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-16' AND '2025-07-31';

-- 2. Products that were either SOLD (SO details) or PURCHASED (PO details) in July 2025
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT DISTINCT pod.ProductID
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Countries appearing in either customer or supplier addresses
SELECT DISTINCT a.Country
FROM retail_company.Customer c
JOIN retail_company.Address  a ON a.AddressID = c.AddressID
UNION
SELECT DISTINCT a.Country
FROM retail_company.Supplier s
JOIN retail_company.Address  a ON a.AddressID = s.AddressID;

-- 4. Cities used either as customer home cities or as order Ship-to cities
SELECT DISTINCT a.City
FROM retail_company.Customer c
JOIN retail_company.Address a ON a.AddressID = c.AddressID
UNION
SELECT DISTINCT a2.City
FROM retail_company.SalesOrder so
JOIN retail_company.Address   a2 ON a2.AddressID = so.ShipAddressID;

-- 5. Calendar dates in July 2025 that had either sales orders OR purchase orders
SELECT DISTINCT OrderDate AS Dt
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT DISTINCT OrderDate
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 6. ProductIDs that are either discontinued OR have zero stock
SELECT ProductID
FROM retail_company.Product
WHERE Discontinued = 1
UNION
SELECT ProductID
FROM retail_company.Product
WHERE UnitsInStock = 0;

-- 7. All unique email addresses from customers and suppliers
SELECT Email
FROM retail_company.Customer
WHERE Email IS NOT NULL
UNION
SELECT Email
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 8. Product names that were either sold or purchased in July 2025
SELECT DISTINCT p.Name
FROM retail_company.SalesOrderDetail d
JOIN retail_company.Product p ON p.ProductID = d.ProductID
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT DISTINCT p2.Name
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
JOIN retail_company.Product p2 ON p2.ProductID = pod.ProductID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 9. Customers who either have a profile address set OR ever used a ShipAddress on an order
SELECT DISTINCT c.CustomerID
FROM retail_company.Customer c
WHERE c.AddressID IS NOT NULL
UNION
SELECT DISTINCT so.CustomerID
FROM retail_company.SalesOrder so
WHERE so.ShipAddressID IS NOT NULL;

-- 10. Unified document feed: Sales Orders and Purchase Orders (same shape)
SELECT N'SO' AS DocType, CAST(SalesOrderID AS bigint) AS DocID, OrderDate AS DocDate, TotalAmount
FROM retail_company.SalesOrder
UNION
SELECT N'PO' AS DocType, CAST(PurchaseOrderID AS bigint) AS DocID, OrderDate AS DocDate, TotalAmount
FROM retail_company.PurchaseOrder;

-- 11. (UNION ALL) All business documents per day in July 2025 with counts
WITH AllDocs AS (
  SELECT OrderDate AS Dt FROM retail_company.SalesOrder
  UNION ALL
  SELECT OrderDate      FROM retail_company.PurchaseOrder
)
SELECT Dt, COUNT(*) AS DocsOnDate
FROM AllDocs
WHERE Dt BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY Dt
ORDER BY Dt;

-- 12. Products that are either low stock OR discontinued
SELECT ProductID
FROM retail_company.Product
WHERE UnitsInStock < ReorderLevel
UNION
SELECT ProductID
FROM retail_company.Product
WHERE Discontinued = 1;
```

## Intersect
```sql
-- 1. Products that were BOTH sold and purchased in July 2025
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT DISTINCT pod.ProductID
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 2. Customers who placed July orders AND had a ShipAddress on (at least one) July order
SELECT DISTINCT so.CustomerID
FROM retail_company.SalesOrder so
WHERE so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT DISTINCT so2.CustomerID
FROM retail_company.SalesOrder so2
WHERE so2.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND so2.ShipAddressID IS NOT NULL;

-- 3. City+Country pairs that appear for BOTH customers and suppliers
SELECT DISTINCT a.City, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address  a ON a.AddressID = c.AddressID
INTERSECT
SELECT DISTINCT a2.City, a2.Country
FROM retail_company.Supplier s
JOIN retail_company.Address  a2 ON a2.AddressID = s.AddressID;

-- 4. Dates in July 2025 that had BOTH sales orders and purchase orders
SELECT DISTINCT OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT DISTINCT OrderDate
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Warehouses that recorded inventory on BOTH 2025-07-30 and 2025-07-31
SELECT DISTINCT WarehouseID
FROM retail_company.Inventory
WHERE StockDate = '2025-07-30'
INTERSECT
SELECT DISTINCT WarehouseID
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31';

-- 6. Customers who ordered in BOTH halves of July 2025
SELECT DISTINCT CustomerID
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-15'
INTERSECT
SELECT DISTINCT CustomerID
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-16' AND '2025-07-31';

-- 7. Suppliers with BOTH 'Placed' AND 'Received' POs in July 2025
SELECT DISTINCT SupplierID
FROM retail_company.PurchaseOrder
WHERE Status = N'Placed'  AND OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT DISTINCT SupplierID
FROM retail_company.PurchaseOrder
WHERE Status = N'Received' AND OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 8. Products that appear BOTH in Inventory(2025-07-31) and in any order line in July
SELECT DISTINCT i.ProductID
FROM retail_company.Inventory i
WHERE i.StockDate = '2025-07-31'
INTERSECT
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 9. Orders that BOTH have a ShipDate AND shipped on the same day as order date
SELECT SalesOrderID
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL
INTERSECT
SELECT SalesOrderID
FROM retail_company.SalesOrder
WHERE ShipDate = OrderDate;

-- 10. Email addresses used by BOTH customers and suppliers
SELECT Email
FROM retail_company.Customer
WHERE Email IS NOT NULL
INTERSECT
SELECT Email
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 11. Categories that had BOTH sold products and purchased products in July 2025
SELECT DISTINCT p.CategoryID
FROM retail_company.SalesOrderDetail d
JOIN retail_company.Product p ON p.ProductID = d.ProductID
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT DISTINCT p2.CategoryID
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
JOIN retail_company.Product p2 ON p2.ProductID = pod.ProductID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 12. Calendar dates that had BOTH order dates and ship dates (not necessarily same order)
SELECT DISTINCT OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
INTERSECT
SELECT DISTINCT ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate BETWEEN '2025-07-01' AND '2025-07-31';
```

## Except
```sql
-- 1. Customers with NO orders in July 2025
SELECT c.CustomerID
FROM retail_company.Customer c
EXCEPT
SELECT DISTINCT so.CustomerID
FROM retail_company.SalesOrder so
WHERE so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 2. Products SOLD in July but NOT PURCHASED in July
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT DISTINCT pod.ProductID
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Products PURCHASED in July but NOT SOLD in July
SELECT DISTINCT pod.ProductID
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Cities that have customers but NOT suppliers (City, Country key)
SELECT DISTINCT a.City, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address  a ON a.AddressID = c.AddressID
EXCEPT
SELECT DISTINCT a2.City, a2.Country
FROM retail_company.Supplier s
JOIN retail_company.Address  a2 ON a2.AddressID = s.AddressID;

-- 5. Suppliers with NO purchase orders in July 2025
SELECT s.SupplierID
FROM retail_company.Supplier s
EXCEPT
SELECT DISTINCT po.SupplierID
FROM retail_company.PurchaseOrder po
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 6. Products with Inventory on 2025-07-31 but NOT present in any July order lines
SELECT DISTINCT i.ProductID
FROM retail_company.Inventory i
WHERE i.StockDate = '2025-07-31'
EXCEPT
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 7. Warehouses with inventory on 2025-07-31 but NOT on 2025-07-25
SELECT DISTINCT i.WarehouseID
FROM retail_company.Inventory i
WHERE i.StockDate = '2025-07-31'
EXCEPT
SELECT DISTINCT i2.WarehouseID
FROM retail_company.Inventory i2
WHERE i2.StockDate = '2025-07-25';

-- 8. Customers who ordered (ever) but NEVER provided a ShipAddress on any order
SELECT DISTINCT so.CustomerID
FROM retail_company.SalesOrder so
EXCEPT
SELECT DISTINCT so2.CustomerID
FROM retail_company.SalesOrder so2
WHERE so2.ShipAddressID IS NOT NULL;

-- 9. Active (not discontinued) products that were NEVER ordered
SELECT p.ProductID
FROM retail_company.Product p
WHERE p.Discontinued = 0
EXCEPT
SELECT DISTINCT d.ProductID
FROM retail_company.SalesOrderDetail d;

-- 10. Customer email addresses NOT used by any supplier
SELECT Email
FROM retail_company.Customer
WHERE Email IS NOT NULL
EXCEPT
SELECT Email
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 11. Days in July with sales orders but NO purchase orders
SELECT DISTINCT OrderDate
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
EXCEPT
SELECT DISTINCT OrderDate
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 12. Product categories with NO products
SELECT pc.CategoryID
FROM retail_company.ProductCategory pc
EXCEPT
SELECT DISTINCT p.CategoryID
FROM retail_company.Product p;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
