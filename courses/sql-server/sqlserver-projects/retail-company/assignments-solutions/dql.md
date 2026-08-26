![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. Basic product list with price alias
SELECT ProductID, Name AS ProductName, UnitPrice AS Price
FROM retail_company.Product;

-- 2. Customer full name (computed) with email
SELECT CustomerID,
       FirstName + ' ' + LastName AS FullName,
       Email
FROM retail_company.Customer;

-- 3. Distinct countries in the customer addresses
SELECT DISTINCT a.Country
FROM retail_company.Customer c
JOIN retail_company.Address  a ON a.AddressID = c.AddressID
ORDER BY a.Country;

-- 4. Sales order details showing computed LineTotal
SELECT SalesOrderDetailID, SalesOrderID, OrderDate, ProductID, UnitPrice, Quantity, LineTotal
FROM retail_company.SalesOrderDetail;

-- 5. Product with Category and Supplier names
SELECT p.ProductID, p.Name AS ProductName, pc.Name AS Category, s.Name AS Supplier
FROM retail_company.Product p
JOIN retail_company.ProductCategory pc ON pc.CategoryID = p.CategoryID
JOIN retail_company.Supplier       s  ON s.SupplierID   = p.SupplierID;

-- 6. Orders with derived year and month columns
SELECT SalesOrderID, OrderDate,
       DATEPART(year, OrderDate)  AS OrderYear,
       DATEPART(month, OrderDate) AS OrderMonth
FROM retail_company.SalesOrder;

-- 7. Inventory rows with low-stock flag (using product ReorderLevel)
SELECT i.InventoryID, i.ProductID, i.WarehouseID, i.StockDate, i.QuantityOnHand,
       CASE WHEN i.QuantityOnHand < p.ReorderLevel THEN 1 ELSE 0 END AS IsLowStock
FROM retail_company.Inventory i
JOIN retail_company.Product  p ON p.ProductID = i.ProductID;

-- 8. Purchase order lines with supplier and product names
SELECT pod.PurchaseOrderDetailID, po.PurchaseOrderID, s.Name AS Supplier,
       p.Name AS Product, pod.UnitCost, pod.Quantity, pod.LineTotal
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder      po ON po.PurchaseOrderID = pod.PurchaseOrderID
JOIN retail_company.Supplier           s  ON s.SupplierID       = po.SupplierID
JOIN retail_company.Product            p  ON p.ProductID        = pod.ProductID;

-- 9. Concatenated ship-to string for orders (when address present)
SELECT so.SalesOrderID,
       COALESCE(a.Street + ', ' + a.City + ', ' + a.State + ' ' + a.ZIP + ', ' + a.Country, 'N/A') AS ShipTo
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID;

-- 10. Discontinued products with a friendly label
SELECT ProductID, Name,
       CASE WHEN Discontinued = 1 THEN 'Discontinued' ELSE 'Active' END AS StatusLabel
FROM retail_company.Product;

-- 11. Product margin preview (hypothetical 35% margin on UnitPrice)
SELECT ProductID, Name, UnitPrice,
       CAST(UnitPrice * 0.35 AS decimal(18,2)) AS HypotheticalMargin
FROM retail_company.Product;

-- 12. Orders with customer and total amount
SELECT so.SalesOrderID, so.OrderDate, c.FirstName + ' ' + c.LastName AS CustomerName, so.TotalAmount
FROM retail_company.SalesOrder so
JOIN retail_company.Customer   c  ON c.CustomerID = so.CustomerID;
```

## WHERE
```sql
-- 1. Active (not discontinued) products
SELECT ProductID, Name, Discontinued
FROM retail_company.Product
WHERE Discontinued = 0;

-- 2. Products priced between 100 and 200 (inclusive)
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
WHERE UnitPrice BETWEEN 100 AND 200
ORDER BY UnitPrice;

-- 3. Customers from India
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS FullName, a.Country
FROM retail_company.Customer c
JOIN retail_company.Address  a ON a.AddressID = c.AddressID
WHERE a.Country = 'India';

-- 4. Orders placed in July 2025
SELECT SalesOrderID, OrderDate, Status, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01';

-- 5. Orders that have shipped (ShipDate not null)
SELECT SalesOrderID, OrderDate, ShipDate
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL;

-- 6. Inventory snapshots on 2025-07-31
SELECT InventoryID, ProductID, WarehouseID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31';

-- 7. Products below reorder level
SELECT ProductID, Name, UnitsInStock, ReorderLevel
FROM retail_company.Product
WHERE UnitsInStock < ReorderLevel;

-- 8. Suppliers with email and US/Canada phone code
SELECT SupplierID, Name, Email, Phone
FROM retail_company.Supplier
WHERE Email IS NOT NULL AND Phone LIKE '+1%';

-- 9. Sales order lines with quantity >= 5
SELECT SalesOrderDetailID, SalesOrderID, ProductID, Quantity
FROM retail_company.SalesOrderDetail
WHERE Quantity >= 5;

-- 10. Warehouses in Zone-A
SELECT WarehouseID, Name, Location
FROM retail_company.Warehouse
WHERE Location = 'Zone-A';

-- 11. Purchase orders expected after 2025-07-20
SELECT PurchaseOrderID, OrderDate, ExpectedDate, Status
FROM retail_company.PurchaseOrder
WHERE ExpectedDate > '2025-07-20';

-- 12. Open orders not yet shipped
SELECT SalesOrderID, OrderDate, Status, ShipDate
FROM retail_company.SalesOrder
WHERE Status = N'Open' AND ShipDate IS NULL;
```

## GROUP BY
```sql
-- 1. Orders count per customer in July 2025
SELECT CustomerID, COUNT(*) AS OrdersInJuly
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
ORDER BY OrdersInJuly DESC;

-- 2. Revenue per order date in July 2025
SELECT OrderDate, SUM(TotalAmount) AS Revenue
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY OrderDate
ORDER BY OrderDate;

-- 3. Quantity sold per product in July 2025
SELECT ProductID, SUM(Quantity) AS QtySold
FROM retail_company.SalesOrderDetail
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY ProductID
ORDER BY QtySold DESC;

-- 4. Total on-hand by warehouse on 2025-07-31
SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
GROUP BY WarehouseID
ORDER BY OnHand DESC;

-- 5. Purchase order total per supplier in July 2025
SELECT SupplierID, SUM(TotalAmount) AS POTotal
FROM retail_company.PurchaseOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY SupplierID
ORDER BY POTotal DESC;

-- 6. Product count per category
SELECT CategoryID, COUNT(*) AS ProductCount
FROM retail_company.Product
GROUP BY CategoryID
ORDER BY ProductCount DESC;

-- 7. Average product price per category
SELECT CategoryID, AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgPrice
FROM retail_company.Product
GROUP BY CategoryID
ORDER BY AvgPrice DESC;

-- 8. Average order line quantity per product (overall)
SELECT ProductID, AVG(CAST(Quantity AS decimal(18,4))) AS AvgQty
FROM retail_company.SalesOrderDetail
GROUP BY ProductID
ORDER BY AvgQty DESC;

-- 9. Orders count by status
SELECT Status, COUNT(*) AS Cnt
FROM retail_company.SalesOrder
GROUP BY Status
ORDER BY Cnt DESC;

-- 10. Distinct ordering customers per day in July 2025
SELECT OrderDate, COUNT(DISTINCT CustomerID) AS DistinctCustomers
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY OrderDate
ORDER BY OrderDate;

-- 11. Inventory by product across all warehouses on 2025-07-31
SELECT ProductID, SUM(QuantityOnHand) AS TotalOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
GROUP BY ProductID
ORDER BY TotalOnHand DESC;

-- 12. Purchase order lines summary by product
SELECT ProductID, SUM(Quantity) AS TotalQty, SUM(LineTotal) AS TotalCost
FROM retail_company.PurchaseOrderDetail
GROUP BY ProductID
ORDER BY TotalQty DESC;
```

## HAVING
```sql
-- 1. Customers with July revenue > 100,000
SELECT CustomerID, SUM(TotalAmount) AS JulyRevenue
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
HAVING SUM(TotalAmount) > 100000
ORDER BY JulyRevenue DESC;

-- 2. Products with July quantity sold >= 100
SELECT ProductID, SUM(Quantity) AS QtyJuly
FROM retail_company.SalesOrderDetail
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY ProductID
HAVING SUM(Quantity) >= 100
ORDER BY QtyJuly DESC;

-- 3. Categories with average price > 150
SELECT CategoryID, AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgPrice
FROM retail_company.Product
GROUP BY CategoryID
HAVING AVG(UnitPrice) > 150
ORDER BY AvgPrice DESC;

-- 4. Suppliers with at least 5 products
SELECT SupplierID, COUNT(*) AS ProductCount
FROM retail_company.Product
GROUP BY SupplierID
HAVING COUNT(*) >= 5
ORDER BY ProductCount DESC;

-- 5. Days in July with more than 50 orders
SELECT OrderDate, COUNT(*) AS OrdersCnt
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY OrderDate
HAVING COUNT(*) > 50
ORDER BY OrdersCnt DESC;

-- 6. Warehouses with total on-hand > 100,000 on 2025-07-31
SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
GROUP BY WarehouseID
HAVING SUM(QuantityOnHand) > 100000
ORDER BY OnHand DESC;

-- 7. Countries with July revenue between 50,000 and 250,000
SELECT a.Country, SUM(so.TotalAmount) AS Revenue
FROM retail_company.SalesOrder so
JOIN retail_company.Customer   c  ON c.CustomerID = so.CustomerID
JOIN retail_company.Address    a  ON a.AddressID  = c.AddressID
WHERE so.OrderDate >= '2025-07-01' AND so.OrderDate < '2025-08-01'
GROUP BY a.Country
HAVING SUM(so.TotalAmount) BETWEEN 50000 AND 250000
ORDER BY Revenue DESC;

-- 8. Products appearing in more than 10 order lines (overall)
SELECT ProductID, COUNT(*) AS LineCount
FROM retail_company.SalesOrderDetail
GROUP BY ProductID
HAVING COUNT(*) > 10
ORDER BY LineCount DESC;

-- 9. Customers who ordered on at least 5 distinct days in July
SELECT CustomerID, COUNT(DISTINCT OrderDate) AS DistinctOrderDays
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY CustomerID
HAVING COUNT(DISTINCT OrderDate) >= 5
ORDER BY DistinctOrderDays DESC;

-- 10. Suppliers whose July PO total exceeds 200,000
SELECT SupplierID, SUM(TotalAmount) AS POTotalJuly
FROM retail_company.PurchaseOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY SupplierID
HAVING SUM(TotalAmount) > 200000
ORDER BY POTotalJuly DESC;

-- 11. Products with average ordered quantity >= 3 in July
SELECT ProductID, AVG(CAST(Quantity AS decimal(18,4))) AS AvgQtyJuly
FROM retail_company.SalesOrderDetail
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
GROUP BY ProductID
HAVING AVG(Quantity) >= 3
ORDER BY AvgQtyJuly DESC;

-- 12. Categories having at least 10 products
SELECT CategoryID, COUNT(*) AS ProductCount
FROM retail_company.Product
GROUP BY CategoryID
HAVING COUNT(*) >= 10
ORDER BY ProductCount DESC;
```

## ORDER BY
```sql
-- 1. Products by price descending, then name
SELECT ProductID, Name, UnitPrice
FROM retail_company.Product
ORDER BY UnitPrice DESC, Name;

-- 2. Customers ordered by last name, first name
SELECT CustomerID, LastName, FirstName, Email
FROM retail_company.Customer
ORDER BY LastName, FirstName;

-- 3. July orders by highest TotalAmount, then most recent
SELECT SalesOrderID, OrderDate, TotalAmount
FROM retail_company.SalesOrder
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
ORDER BY TotalAmount DESC, OrderDate DESC, SalesOrderID DESC;

-- 4. Inventory on 2025-07-31 by lowest stock first
SELECT ProductID, WarehouseID, QuantityOnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
ORDER BY QuantityOnHand ASC;

-- 5. Suppliers by name (A → Z)
SELECT SupplierID, Name, Email
FROM retail_company.Supplier
ORDER BY Name ASC;

-- 6. Categories by name (A → Z)
SELECT CategoryID, Name
FROM retail_company.ProductCategory
ORDER BY Name;

-- 7. Order lines by LineTotal (largest first)
SELECT SalesOrderDetailID, SalesOrderID, ProductID, LineTotal
FROM retail_company.SalesOrderDetail
ORDER BY LineTotal DESC;

-- 8. Purchase orders by earliest ExpectedDate first
SELECT PurchaseOrderID, OrderDate, ExpectedDate, Status, TotalAmount
FROM retail_company.PurchaseOrder
ORDER BY ExpectedDate, PurchaseOrderID;

-- 9. Warehouses by location then name
SELECT WarehouseID, Location, Name
FROM retail_company.Warehouse
ORDER BY Location, Name;

-- 10. Products: active first, then discontinued, each by name
SELECT ProductID, Name, Discontinued
FROM retail_company.Product
ORDER BY Discontinued ASC, Name;

-- 11. Sales orders sorted by custom status priority (Open → Shipped → Cancelled)
SELECT SalesOrderID, Status, OrderDate
FROM retail_company.SalesOrder
ORDER BY CASE Status
           WHEN N'Open'      THEN 1
           WHEN N'Shipped'   THEN 2
           WHEN N'Cancelled' THEN 3
           ELSE 4
         END,
         OrderDate DESC;

-- 12. Purchase orders sorted by status priority (Open → Placed → Received)
SELECT PurchaseOrderID, Status, OrderDate
FROM retail_company.PurchaseOrder
ORDER BY CASE Status
           WHEN N'Open'    THEN 1
           WHEN N'Placed'  THEN 2
           WHEN N'Received'THEN 3
           ELSE 4
         END,
         OrderDate DESC;
```

## TOP
```sql
-- 1. Top 10 customers by July revenue (WITH TIES)
WITH R AS (
  SELECT CustomerID, SUM(TotalAmount) AS RevJuly
  FROM retail_company.SalesOrder
  WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
  GROUP BY CustomerID
)
SELECT TOP (10) WITH TIES CustomerID, RevJuly
FROM R
ORDER BY RevJuly DESC;

-- 2. Top 5 products by July quantity sold
WITH S AS (
  SELECT ProductID, SUM(Quantity) AS QtyJuly
  FROM retail_company.SalesOrderDetail
  WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
  GROUP BY ProductID
)
SELECT TOP (5) ProductID, QtyJuly
FROM S
ORDER BY QtyJuly DESC;

-- 3. Top 20 most expensive products
SELECT TOP (20) ProductID, Name, UnitPrice
FROM retail_company.Product
ORDER BY UnitPrice DESC, ProductID;

-- 4. Top 10 most recent orders (by date then ID)
SELECT TOP (10) SalesOrderID, OrderDate, TotalAmount
FROM retail_company.SalesOrder
ORDER BY OrderDate DESC, SalesOrderID DESC;

-- 5. Top 3 categories by product count
WITH C AS (
  SELECT CategoryID, COUNT(*) AS ProductCount
  FROM retail_company.Product
  GROUP BY CategoryID
)
SELECT TOP (3) CategoryID, ProductCount
FROM C
ORDER BY ProductCount DESC;

-- 6. Top 5 suppliers by July PO total
WITH P AS (
  SELECT SupplierID, SUM(TotalAmount) AS POTotalJuly
  FROM retail_company.PurchaseOrder
  WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
  GROUP BY SupplierID
)
SELECT TOP (5) SupplierID, POTotalJuly
FROM P
ORDER BY POTotalJuly DESC;

-- 7. Top 10 customers by order count overall
WITH C AS (
  SELECT CustomerID, COUNT(*) AS OrderCount
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
)
SELECT TOP (10) CustomerID, OrderCount
FROM C
ORDER BY OrderCount DESC;

-- 8. Top 10 largest purchase orders by amount
SELECT TOP (10) PurchaseOrderID, TotalAmount, SupplierID, OrderDate
FROM retail_company.PurchaseOrder
ORDER BY TotalAmount DESC;

-- 9. Top 5 warehouses by on-hand on 2025-07-31
WITH W AS (
  SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY WarehouseID
)
SELECT TOP (5) WarehouseID, OnHand
FROM W
ORDER BY OnHand DESC;

-- 10. Top 15 order lines by LineTotal in July
SELECT TOP (15) SalesOrderDetailID, SalesOrderID, OrderDate, ProductID, LineTotal
FROM retail_company.SalesOrderDetail
WHERE OrderDate >= '2025-07-01' AND OrderDate < '2025-08-01'
ORDER BY LineTotal DESC;

-- 11. Top 10 cities by July revenue
WITH R AS (
  SELECT a.City, SUM(so.TotalAmount) AS Revenue
  FROM retail_company.SalesOrder so
  JOIN retail_company.Customer   c ON c.CustomerID = so.CustomerID
  JOIN retail_company.Address    a ON a.AddressID  = c.AddressID
  WHERE so.OrderDate >= '2025-07-01' AND so.OrderDate < '2025-08-01'
  GROUP BY a.City
)
SELECT TOP (10) City, Revenue
FROM R
ORDER BY Revenue DESC;

-- 12. Top 1 most expensive product per category (using TOP WITH TIES + window)
WITH Ranked AS (
  SELECT p.CategoryID, p.ProductID, p.Name, p.UnitPrice,
         DENSE_RANK() OVER (PARTITION BY p.CategoryID ORDER BY p.UnitPrice DESC, p.ProductID) AS rnk
  FROM retail_company.Product p
)
SELECT CategoryID, ProductID, Name, UnitPrice
FROM Ranked
WHERE rnk = 1
ORDER BY CategoryID, ProductID;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
