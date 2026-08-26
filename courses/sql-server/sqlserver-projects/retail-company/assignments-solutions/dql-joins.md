![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. July-2025 orders with customer full name
SELECT so.SalesOrderID, so.OrderDate,
       c.FirstName + ' ' + c.LastName AS CustomerName, so.Status, so.TotalAmount
FROM retail_company.SalesOrder so
INNER JOIN retail_company.Customer c
  ON c.CustomerID = so.CustomerID
WHERE so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 2. Order lines with product & category info (July-2025)
SELECT d.SalesOrderDetailID, d.SalesOrderID, d.OrderDate,
       p.ProductID, p.Name AS ProductName, pc.Name AS Category,
       d.UnitPrice, d.Quantity, d.LineTotal
FROM retail_company.SalesOrderDetail d
INNER JOIN retail_company.Product p  ON p.ProductID  = d.ProductID
INNER JOIN retail_company.ProductCategory pc ON pc.CategoryID = p.CategoryID
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Purchase order lines with supplier & product names (July-2025)
SELECT po.PurchaseOrderID, po.OrderDate, s.Name AS Supplier,
       p.ProductID, p.Name AS Product, pod.UnitCost, pod.Quantity, pod.LineTotal
FROM retail_company.PurchaseOrderDetail pod
INNER JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
INNER JOIN retail_company.Supplier s        ON s.SupplierID       = po.SupplierID
INNER JOIN retail_company.Product p         ON p.ProductID        = pod.ProductID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Inventory (2025-07-31) with product & warehouse
SELECT i.InventoryID, i.StockDate, w.Name AS Warehouse, p.Name AS Product, i.QuantityOnHand
FROM retail_company.Inventory i
INNER JOIN retail_company.Warehouse w ON w.WarehouseID = i.WarehouseID
INNER JOIN retail_company.Product   p ON p.ProductID   = i.ProductID
WHERE i.StockDate = '2025-07-31';

-- 5. Orders with ship-to city & country (when present)
SELECT so.SalesOrderID, so.OrderDate, a.City, a.Country
FROM retail_company.SalesOrder so
INNER JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID;

-- 6. Active products with category & supplier
SELECT p.ProductID, p.Name AS Product, pc.Name AS Category, s.Name AS Supplier
FROM retail_company.Product p
INNER JOIN retail_company.ProductCategory pc ON pc.CategoryID = p.CategoryID
INNER JOIN retail_company.Supplier s        ON s.SupplierID   = p.SupplierID
WHERE p.Discontinued = 0;

-- 7. July-2025 revenue per category (from order lines)
SELECT pc.CategoryID, pc.Name AS Category,
       SUM(d.LineTotal) AS JulyRevenue
FROM retail_company.SalesOrderDetail d
INNER JOIN retail_company.Product p  ON p.ProductID  = d.ProductID
INNER JOIN retail_company.ProductCategory pc ON pc.CategoryID = p.CategoryID
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY pc.CategoryID, pc.Name
ORDER BY JulyRevenue DESC;

-- 8. Compare order TotalAmount vs sum of line totals (for July-2025)
WITH LineSums AS (
  SELECT d.SalesOrderID, d.OrderDate, SUM(d.LineTotal) AS SumLines
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY d.SalesOrderID, d.OrderDate
)
SELECT so.SalesOrderID, so.OrderDate, so.TotalAmount, ls.SumLines,
       (so.TotalAmount - ls.SumLines) AS Diff
FROM retail_company.SalesOrder so
INNER JOIN LineSums ls
  ON ls.SalesOrderID = so.SalesOrderID AND ls.OrderDate = so.OrderDate
WHERE so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
ORDER BY ABS(so.TotalAmount - ls.SumLines) DESC;

-- 9. Customers with July order line counts
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS CustomerName,
       COUNT(*) AS LineCount
FROM retail_company.Customer c
INNER JOIN retail_company.SalesOrder so
  ON so.CustomerID = c.CustomerID
INNER JOIN retail_company.SalesOrderDetail d
  ON d.SalesOrderID = so.SalesOrderID AND d.OrderDate = so.OrderDate
WHERE so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY c.CustomerID, c.FirstName, c.LastName
ORDER BY LineCount DESC;

-- 10. Products sold to customers in Germany (July-2025)
SELECT DISTINCT p.ProductID, p.Name AS Product
FROM retail_company.SalesOrderDetail d
INNER JOIN retail_company.SalesOrder so
  ON so.SalesOrderID = d.SalesOrderID AND so.OrderDate = d.OrderDate
INNER JOIN retail_company.Customer c ON c.CustomerID = so.CustomerID
INNER JOIN retail_company.Address  a ON a.AddressID  = c.AddressID
INNER JOIN retail_company.Product  p ON p.ProductID  = d.ProductID
WHERE a.Country = 'Germany'
  AND d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 11. Supplier totals from PO lines in July-2025
SELECT s.SupplierID, s.Name AS Supplier, SUM(pod.LineTotal) AS JulyPOCost
FROM retail_company.PurchaseOrderDetail pod
INNER JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
INNER JOIN retail_company.Supplier s       ON s.SupplierID       = po.SupplierID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY s.SupplierID, s.Name
ORDER BY JulyPOCost DESC;

-- 12. Per-warehouse distinct products with inventory on 2025-07-31
SELECT w.WarehouseID, w.Name AS Warehouse, COUNT(DISTINCT i.ProductID) AS DistinctProducts
FROM retail_company.Inventory i
INNER JOIN retail_company.Warehouse w ON w.WarehouseID = i.WarehouseID
WHERE i.StockDate = '2025-07-31'
GROUP BY w.WarehouseID, w.Name
ORDER BY DistinctProducts DESC;
```

## Left Join (Left Outer Join)
```sql
-- 1. All customers with (optional) address details
SELECT c.CustomerID, c.FirstName, c.LastName,
       a.City, a.State, a.Country
FROM retail_company.Customer c
LEFT JOIN retail_company.Address a ON a.AddressID = c.AddressID;

-- 2. All products with July-2025 sold quantity (0 if none)
WITH Sold AS (
  SELECT d.ProductID, SUM(d.Quantity) AS QtySold
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY d.ProductID
)
SELECT p.ProductID, p.Name, COALESCE(s.QtySold,0) AS QtySoldJuly
FROM retail_company.Product p
LEFT JOIN Sold s ON s.ProductID = p.ProductID
ORDER BY QtySoldJuly DESC, p.ProductID;

-- 3. Categories with product counts (including empty categories)
SELECT pc.CategoryID, pc.Name AS Category,
       COUNT(p.ProductID) AS ProductCount
FROM retail_company.ProductCategory pc
LEFT JOIN retail_company.Product p ON p.CategoryID = pc.CategoryID
GROUP BY pc.CategoryID, pc.Name
ORDER BY ProductCount DESC;

-- 4. Suppliers with their product counts (including suppliers with none)
SELECT s.SupplierID, s.Name AS Supplier,
       COUNT(p.ProductID) AS ProductCount
FROM retail_company.Supplier s
LEFT JOIN retail_company.Product p ON p.SupplierID = s.SupplierID
GROUP BY s.SupplierID, s.Name
ORDER BY ProductCount DESC;

-- 5. Products with inventory total on 2025-07-31 (0 if no row)
WITH Inv AS (
  SELECT ProductID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY ProductID
)
SELECT p.ProductID, p.Name, COALESCE(i.OnHand,0) AS OnHand_2025_07_31
FROM retail_company.Product p
LEFT JOIN Inv i ON i.ProductID = p.ProductID
ORDER BY OnHand_2025_07_31 DESC;

-- 6. All orders with number of lines (0 if none)
WITH LineCnt AS (
  SELECT SalesOrderID, OrderDate, COUNT(*) AS Lines
  FROM retail_company.SalesOrderDetail
  GROUP BY SalesOrderID, OrderDate
)
SELECT so.SalesOrderID, so.OrderDate, COALESCE(l.Lines,0) AS LineCount
FROM retail_company.SalesOrder so
LEFT JOIN LineCnt l
  ON l.SalesOrderID = so.SalesOrderID AND l.OrderDate = so.OrderDate
ORDER BY so.OrderDate DESC, so.SalesOrderID DESC;

-- 7. Warehouses with total on-hand on 2025-07-31 (0 if none)
WITH W AS (
  SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
  FROM retail_company.Inventory
  WHERE StockDate = '2025-07-31'
  GROUP BY WarehouseID
)
SELECT wh.WarehouseID, wh.Name, COALESCE(w.OnHand,0) AS OnHand_2025_07_31
FROM retail_company.Warehouse wh
LEFT JOIN W w ON w.WarehouseID = wh.WarehouseID
ORDER BY OnHand_2025_07_31 DESC;

-- 8. Products with latest PO price in July-2025 (if any)
WITH RankedPO AS (
  SELECT pod.ProductID, pod.UnitCost, po.OrderDate,
         ROW_NUMBER() OVER (PARTITION BY pod.ProductID
                            ORDER BY po.OrderDate DESC, po.PurchaseOrderID DESC, pod.PurchaseOrderDetailID DESC) AS rn
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
  WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT p.ProductID, p.Name,
       r.UnitCost AS LatestJulyPOCost, r.OrderDate AS LatestJulyPODate
FROM retail_company.Product p
LEFT JOIN RankedPO r ON r.ProductID = p.ProductID AND r.rn = 1
ORDER BY p.ProductID;

-- 9. Customers with their latest order date (NULL if no orders)
WITH LastOrder AS (
  SELECT CustomerID, MAX(OrderDate) AS LastOrderDate
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
)
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS CustomerName, lo.LastOrderDate
FROM retail_company.Customer c
LEFT JOIN LastOrder lo ON lo.CustomerID = c.CustomerID
ORDER BY c.CustomerID;

-- 10. Products with “ever sold” flag
WITH Ever AS (
  SELECT DISTINCT ProductID FROM retail_company.SalesOrderDetail
)
SELECT p.ProductID, p.Name,
       CASE WHEN e.ProductID IS NULL THEN 0 ELSE 1 END AS EverSold
FROM retail_company.Product p
LEFT JOIN Ever e ON e.ProductID = p.ProductID;

-- 11. Suppliers with July-2025 PO totals (0 if none)
WITH POTot AS (
  SELECT SupplierID, SUM(TotalAmount) AS JulyPO
  FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY SupplierID
)
SELECT s.SupplierID, s.Name, COALESCE(p.JulyPO,0) AS JulyPO
FROM retail_company.Supplier s
LEFT JOIN POTot p ON p.SupplierID = s.SupplierID
ORDER BY JulyPO DESC;

-- 12. Orders with optional ship-to city
SELECT so.SalesOrderID, so.OrderDate, so.Status,
       a.City AS ShipCity
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID
ORDER BY so.OrderDate DESC, so.SalesOrderID DESC;
```

## Right Join (Right Outer Join)
```sql
-- 1. All customers with their order counts (RIGHT JOIN from SO to Customer)
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS CustomerName,
       COUNT(so.SalesOrderID) AS OrderCount
FROM retail_company.SalesOrder so
RIGHT JOIN retail_company.Customer c
  ON c.CustomerID = so.CustomerID
GROUP BY c.CustomerID, c.FirstName, c.LastName
ORDER BY OrderCount DESC, c.CustomerID;

-- 2. All warehouses with inventory on 2025-07-31 (0 if none)
SELECT w.WarehouseID, w.Name,
       SUM(CASE WHEN i.StockDate = '2025-07-31' THEN i.QuantityOnHand ELSE 0 END) AS OnHand_2025_07_31
FROM retail_company.Inventory i
RIGHT JOIN retail_company.Warehouse w
  ON w.WarehouseID = i.WarehouseID
GROUP BY w.WarehouseID, w.Name
ORDER BY OnHand_2025_07_31 DESC;

-- 3. All products with their supplier names (RIGHT JOIN Supplier->Product)
SELECT p.ProductID, p.Name AS Product, s.Name AS Supplier
FROM retail_company.Supplier s
RIGHT JOIN retail_company.Product p
  ON p.SupplierID = s.SupplierID
ORDER BY p.ProductID;

-- 4. All products with their category names (RIGHT JOIN Category->Product)
SELECT p.ProductID, p.Name AS Product, pc.Name AS Category
FROM retail_company.ProductCategory pc
RIGHT JOIN retail_company.Product p
  ON p.CategoryID = pc.CategoryID
ORDER BY p.ProductID;

-- 5. All customers with address (RIGHT JOIN Address->Customer)
SELECT c.CustomerID, c.FirstName, c.LastName, a.City, a.Country
FROM retail_company.Address a
RIGHT JOIN retail_company.Customer c
  ON c.AddressID = a.AddressID
ORDER BY c.CustomerID;

-- 6. All orders with line counts (RIGHT JOIN Detail->Order)
SELECT so.SalesOrderID, so.OrderDate, COUNT(d.SalesOrderDetailID) AS LineCount
FROM retail_company.SalesOrderDetail d
RIGHT JOIN retail_company.SalesOrder so
  ON so.SalesOrderID = d.SalesOrderID AND so.OrderDate = d.OrderDate
GROUP BY so.SalesOrderID, so.OrderDate
ORDER BY so.OrderDate DESC, so.SalesOrderID DESC;

-- 7. All suppliers with July PO totals (RIGHT JOIN PO->Supplier)
SELECT s.SupplierID, s.Name,
       SUM(CASE WHEN po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
                THEN po.TotalAmount ELSE 0 END) AS JulyPO
FROM retail_company.PurchaseOrder po
RIGHT JOIN retail_company.Supplier s
  ON s.SupplierID = po.SupplierID
GROUP BY s.SupplierID, s.Name
ORDER BY JulyPO DESC;

-- 8. All orders with ship address info (RIGHT JOIN Address->Order)
SELECT so.SalesOrderID, so.OrderDate, a.City, a.State, a.Country
FROM retail_company.Address a
RIGHT JOIN retail_company.SalesOrder so
  ON so.ShipAddressID = a.AddressID
ORDER BY so.OrderDate DESC, so.SalesOrderID DESC;

-- 9. All inventory rows with product name (RIGHT JOIN Product->Inventory)
SELECT i.InventoryID, i.StockDate, p.Name AS Product, i.QuantityOnHand
FROM retail_company.Product p
RIGHT JOIN retail_company.Inventory i
  ON i.ProductID = p.ProductID
ORDER BY i.StockDate DESC, i.InventoryID DESC;

-- 10. All PO lines with PO header info (RIGHT JOIN PO->POD)
SELECT pod.PurchaseOrderDetailID, po.PurchaseOrderID, po.OrderDate, pod.ProductID, pod.UnitCost, pod.Quantity
FROM retail_company.PurchaseOrder po
RIGHT JOIN retail_company.PurchaseOrderDetail pod
  ON pod.PurchaseOrderID = po.PurchaseOrderID
ORDER BY po.OrderDate DESC, po.PurchaseOrderID DESC;

-- 11. All order lines with order status (RIGHT JOIN SO->SOD)
SELECT d.SalesOrderDetailID, d.SalesOrderID, d.ProductID, so.Status
FROM retail_company.SalesOrder so
RIGHT JOIN retail_company.SalesOrderDetail d
  ON d.SalesOrderID = so.SalesOrderID AND d.OrderDate = so.OrderDate
ORDER BY d.SalesOrderDetailID;

-- 12. All customers with “ever purchased product 1” flag (RIGHT JOIN Detail->Customer)
WITH CustProd AS (
  SELECT DISTINCT so.CustomerID
  FROM retail_company.SalesOrder so
  JOIN retail_company.SalesOrderDetail d
    ON d.SalesOrderID = so.SalesOrderID AND d.OrderDate = so.OrderDate
  WHERE d.ProductID = 1
)
SELECT c.CustomerID, c.FirstName + ' ' + c.LastName AS CustomerName,
       CASE WHEN cp.CustomerID IS NULL THEN 0 ELSE 1 END AS BoughtProd1
FROM CustProd cp
RIGHT JOIN retail_company.Customer c
  ON c.CustomerID = cp.CustomerID
ORDER BY c.CustomerID;
```

## Full Join (Full Outer Join)
```sql
-- 1. Customers vs. July-2025 ordering customers (who ordered / who did not)
WITH JulyCust AS (
  SELECT DISTINCT CustomerID
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT COALESCE(c.CustomerID, jc.CustomerID) AS CustomerID,
       CASE WHEN jc.CustomerID IS NULL THEN 0 ELSE 1 END AS OrderedInJuly
FROM retail_company.Customer c
FULL OUTER JOIN JulyCust jc ON jc.CustomerID = c.CustomerID
ORDER BY CustomerID;

-- 2. Products SOLD vs PURCHASED in July-2025
WITH Sold AS (
  SELECT DISTINCT d.ProductID
  FROM retail_company.SalesOrderDetail d
  WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
),
Purchased AS (
  SELECT DISTINCT pod.ProductID
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
  WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT COALESCE(s.ProductID, pu.ProductID) AS ProductID,
       CASE WHEN s.ProductID  IS NULL THEN 0 ELSE 1 END AS SoldJuly,
       CASE WHEN pu.ProductID IS NULL THEN 0 ELSE 1 END AS PurchasedJuly
FROM Sold s
FULL OUTER JOIN Purchased pu ON pu.ProductID = s.ProductID
ORDER BY ProductID;

-- 3. Warehouses with inventory on 2025-07-30 vs 2025-07-31
WITH D1 AS (
  SELECT DISTINCT WarehouseID FROM retail_company.Inventory WHERE StockDate = '2025-07-30'
),
D2 AS (
  SELECT DISTINCT WarehouseID FROM retail_company.Inventory WHERE StockDate = '2025-07-31'
)
SELECT COALESCE(d1.WarehouseID, d2.WarehouseID) AS WarehouseID,
       CASE WHEN d1.WarehouseID IS NULL THEN 0 ELSE 1 END AS Has_0730,
       CASE WHEN d2.WarehouseID IS NULL THEN 0 ELSE 1 END AS Has_0731
FROM D1 d1
FULL OUTER JOIN D2 d2 ON d2.WarehouseID = d1.WarehouseID
ORDER BY WarehouseID;

-- 4. Suppliers with POs vs. Suppliers with Products
WITH S_PO AS (
  SELECT DISTINCT SupplierID FROM retail_company.PurchaseOrder
),
S_Prod AS (
  SELECT DISTINCT SupplierID FROM retail_company.Product
)
SELECT COALESCE(spo.SupplierID, spr.SupplierID) AS SupplierID,
       CASE WHEN spo.SupplierID IS NULL THEN 0 ELSE 1 END AS HasPOs,
       CASE WHEN spr.SupplierID IS NULL THEN 0 ELSE 1 END AS HasProducts
FROM S_PO spo
FULL OUTER JOIN S_Prod spr ON spr.SupplierID = spo.SupplierID
ORDER BY SupplierID;

-- 5. Orders vs. summed order lines (which orders mismatch)
WITH SumLines AS (
  SELECT SalesOrderID, OrderDate, SUM(LineTotal) AS SumLines
  FROM retail_company.SalesOrderDetail
  GROUP BY SalesOrderID, OrderDate
)
SELECT COALESCE(so.SalesOrderID, sl.SalesOrderID) AS SalesOrderID,
       COALESCE(so.OrderDate,  sl.OrderDate)  AS OrderDate,
       so.TotalAmount, sl.SumLines,
       CASE WHEN so.SalesOrderID IS NULL OR sl.SalesOrderID IS NULL THEN 'Missing'
            WHEN so.TotalAmount <> sl.SumLines THEN 'Mismatch'
            ELSE 'OK' END AS CheckStatus
FROM retail_company.SalesOrder so
FULL OUTER JOIN SumLines sl
  ON sl.SalesOrderID = so.SalesOrderID AND sl.OrderDate = so.OrderDate
ORDER BY OrderDate DESC, SalesOrderID DESC;

-- 6. Products vs. inventory on 2025-07-31 (which products have no stock rows; which inventory rows orphaned)
WITH Inv AS (
  SELECT DISTINCT ProductID FROM retail_company.Inventory WHERE StockDate = '2025-07-31'
)
SELECT COALESCE(p.ProductID, i.ProductID) AS ProductID,
       CASE WHEN p.ProductID IS NULL THEN 'OrphanInventory'      -- inventory has product missing (shouldn’t happen)
            WHEN i.ProductID IS NULL THEN 'NoInventoryRow'       -- product has no inventory that day
            ELSE 'OK' END AS Status
FROM retail_company.Product p
FULL OUTER JOIN Inv i ON i.ProductID = p.ProductID
ORDER BY ProductID;

-- 7. Customer cities vs Ship-to cities (unified view)
WITH CustCities AS (
  SELECT DISTINCT a.City, a.Country
  FROM retail_company.Customer c JOIN retail_company.Address a ON a.AddressID = c.AddressID
),
ShipCities AS (
  SELECT DISTINCT a.City, a.Country
  FROM retail_company.SalesOrder so JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID
)
SELECT COALESCE(cc.City, sc.City) AS City,
       COALESCE(cc.Country, sc.Country) AS Country,
       CASE WHEN cc.City IS NULL THEN 0 ELSE 1 END AS IsCustomerCity,
       CASE WHEN sc.City IS NULL THEN 0 ELSE 1 END AS IsShipCity
FROM CustCities cc
FULL OUTER JOIN ShipCities sc ON sc.City = cc.City AND sc.Country = cc.Country
ORDER BY Country, City;

-- 8. Sales dates vs Purchase dates in July-2025
WITH S AS (
  SELECT DISTINCT OrderDate FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
),
P AS (
  SELECT DISTINCT OrderDate FROM retail_company.PurchaseOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT COALESCE(s.OrderDate, p.OrderDate) AS Dt,
       CASE WHEN s.OrderDate IS NULL THEN 0 ELSE 1 END AS HasSales,
       CASE WHEN p.OrderDate IS NULL THEN 0 ELSE 1 END AS HasPurchases
FROM S s
FULL OUTER JOIN P p ON p.OrderDate = s.OrderDate
ORDER BY Dt;

-- 9. Category presence in sold vs purchased products (July-2025)
WITH SoldCat AS (
  SELECT DISTINCT p.CategoryID
  FROM retail_company.SalesOrderDetail d
  JOIN retail_company.Product p ON p.ProductID = d.ProductID
  WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
),
PurchCat AS (
  SELECT DISTINCT p.CategoryID
  FROM retail_company.PurchaseOrderDetail pod
  JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
  JOIN retail_company.Product p ON p.ProductID = pod.ProductID
  WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
)
SELECT COALESCE(sc.CategoryID, pc.CategoryID) AS CategoryID,
       CASE WHEN sc.CategoryID IS NULL THEN 0 ELSE 1 END AS SoldJuly,
       CASE WHEN pc.CategoryID IS NULL THEN 0 ELSE 1 END AS PurchasedJuly
FROM SoldCat sc
FULL OUTER JOIN PurchCat pc ON pc.CategoryID = sc.CategoryID
ORDER BY CategoryID;

-- 10. Customer set vs Orders with ship address set (who never shipped anywhere)
WITH ShipCust AS (
  SELECT DISTINCT CustomerID FROM retail_company.SalesOrder WHERE ShipAddressID IS NOT NULL
)
SELECT COALESCE(c.CustomerID, s.CustomerID) AS CustomerID,
       CASE WHEN s.CustomerID IS NULL THEN 0 ELSE 1 END AS HasShipAddressEver
FROM retail_company.Customer c
FULL OUTER JOIN ShipCust s ON s.CustomerID = c.CustomerID
ORDER BY CustomerID;

-- 11. Inventory product set on 2025-07-30 vs 2025-07-31 with delta indicator
WITH D30 AS (
  SELECT ProductID FROM retail_company.Inventory WHERE StockDate = '2025-07-30'
),
D31 AS (
  SELECT ProductID FROM retail_company.Inventory WHERE StockDate = '2025-07-31'
)
SELECT COALESCE(d30.ProductID, d31.ProductID) AS ProductID,
       CASE WHEN d30.ProductID IS NULL THEN 0 ELSE 1 END AS Has_0730,
       CASE WHEN d31.ProductID IS NULL THEN 0 ELSE 1 END AS Has_0731
FROM D30 d30
FULL OUTER JOIN D31 d31 ON d31.ProductID = d30.ProductID
ORDER BY ProductID;

-- 12. Supplier addresses vs customer addresses (shared / unique address cities)
WITH SA AS (
  SELECT DISTINCT a.City, a.Country FROM retail_company.Supplier s
  JOIN retail_company.Address a ON a.AddressID = s.AddressID
),
CA AS (
  SELECT DISTINCT a.City, a.Country FROM retail_company.Customer c
  JOIN retail_company.Address a ON a.AddressID = c.AddressID
)
SELECT COALESCE(sa.City, ca.City) AS City,
       COALESCE(sa.Country, ca.Country) AS Country,
       CASE WHEN sa.City IS NULL THEN 0 ELSE 1 END AS IsSupplierCity,
       CASE WHEN ca.City IS NULL THEN 0 ELSE 1 END AS IsCustomerCity
FROM SA sa
FULL OUTER JOIN CA ca ON ca.City = sa.City AND ca.Country = sa.Country
ORDER BY Country, City;
```

## Cross Join
```sql
-- 1. Create a product × warehouse grid for first 3 warehouses & first 5 products
WITH W AS (
  SELECT TOP (3) WarehouseID, Name FROM retail_company.Warehouse ORDER BY WarehouseID
),
P AS (
  SELECT TOP (5) ProductID, Name FROM retail_company.Product ORDER BY ProductID
)
SELECT w.WarehouseID, w.Name AS Warehouse, p.ProductID, p.Name AS Product
FROM W w
CROSS JOIN P p
ORDER BY w.WarehouseID, p.ProductID;

-- 2. Last 7 days of July × all warehouses (date grid)
WITH Cal AS (
  SELECT CAST('2025-07-25' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
)
SELECT w.WarehouseID, w.Name, c.d AS DateSlot
FROM retail_company.Warehouse w
CROSS JOIN Cal c
ORDER BY w.WarehouseID, c.d
OPTION (MAXRECURSION 50);

-- 3. Status dimension × July-2025 dates
WITH Cal AS (
  SELECT CAST('2025-07-01' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
),
StatusDim AS (
  SELECT v.Status FROM (VALUES (N'Open'),(N'Shipped'),(N'Cancelled')) v(Status)
)
SELECT c.d AS Dt, s.Status
FROM Cal c
CROSS JOIN StatusDim s
ORDER BY c.d, s.Status
OPTION (MAXRECURSION 50);

-- 4. Top-3 customers × Top-3 categories (planning matrix)
WITH CustTop AS (
  SELECT TOP (3) CustomerID
  FROM retail_company.SalesOrder
  GROUP BY CustomerID
  ORDER BY COUNT(*) DESC
),
CatTop AS (
  SELECT TOP (3) CategoryID, Name FROM retail_company.ProductCategory ORDER BY CategoryID
)
SELECT ct.CustomerID, c.FirstName + ' ' + c.LastName AS CustomerName,
       cat.CategoryID, cat.Name AS Category
FROM CustTop ct
CROSS JOIN CatTop cat
JOIN retail_company.Customer c ON c.CustomerID = ct.CustomerID
ORDER BY ct.CustomerID, cat.CategoryID;

-- 5. Build a small numbers table (1..10) × a single warehouse
WITH N(n) AS (
  SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
)
SELECT w.WarehouseID, w.Name, n.n AS Slot
FROM (SELECT TOP (1) * FROM retail_company.Warehouse ORDER BY WarehouseID) w
CROSS JOIN N
ORDER BY n.n;

-- 6. Price buckets × category listing
WITH Buckets AS (
  SELECT * FROM (VALUES
    ('<=50', 0.00, 50.00),
    ('50-150', 50.00, 150.00),
    ('150-300', 150.00, 300.00),
    ('>300', 300.00, 1000000.00)
  ) b(Bucket, MinPrice, MaxPrice)
)
SELECT b.Bucket, pc.CategoryID, pc.Name AS Category
FROM Buckets b
CROSS JOIN retail_company.ProductCategory pc
ORDER BY b.MinPrice, pc.CategoryID;

-- 7. Small calendar (3 days) × first 3 products (availability plan)
WITH Cal AS (
  SELECT CAST('2025-07-29' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
),
P AS (
  SELECT TOP (3) ProductID, Name FROM retail_company.Product ORDER BY ProductID
)
SELECT c.d AS PlanDate, p.ProductID, p.Name
FROM Cal c
CROSS JOIN P p
ORDER BY c.d, p.ProductID
OPTION (MAXRECURSION 10);

-- 8. Status × Customer: build a checkerboard to later left-join counts
WITH StatusDim AS (
  SELECT v.Status FROM (VALUES (N'Open'),(N'Shipped'),(N'Cancelled')) v(Status)
),
Cust AS (
  SELECT TOP (5) CustomerID, FirstName + ' ' + LastName AS CustomerName
  FROM retail_company.Customer ORDER BY CustomerID
)
SELECT s.Status, c.CustomerID, c.CustomerName
FROM StatusDim s
CROSS JOIN Cust c
ORDER BY s.Status, c.CustomerID;

-- 9. Three warehouses × three zones we want to validate
WITH Zones(z) AS (SELECT 'Zone-A' UNION ALL SELECT 'Zone-B' UNION ALL SELECT 'Zone-C')
SELECT TOP (3) w.WarehouseID, w.Name, z.z AS ExpectedZone
FROM retail_company.Warehouse w
CROSS JOIN Zones z
ORDER BY w.WarehouseID, z.z;

-- 10. “What-if” discount grid: 5 products × discounts (5%,10%,15%)
WITH P AS (
  SELECT TOP (5) ProductID, Name, UnitPrice FROM retail_company.Product ORDER BY UnitPrice DESC
),
Disc AS (
  SELECT * FROM (VALUES (0.05),(0.10),(0.15)) d(DiscRate)
)
SELECT p.ProductID, p.Name, p.UnitPrice,
       d.DiscRate,
       CAST(p.UnitPrice * (1 - d.DiscRate) AS decimal(18,2)) AS PriceAfterDiscount
FROM P p
CROSS JOIN Disc d
ORDER BY p.UnitPrice DESC, d.DiscRate;

-- 11. Product × MonthEnd (3 months from July)
WITH MonthEnds AS (
  SELECT EOMONTH('2025-07-01') AS ME
  UNION ALL SELECT EOMONTH(DATEADD(month,1,ME)) FROM MonthEnds WHERE ME < '2025-09-30'
)
SELECT TOP (3) p.ProductID, p.Name, me.ME AS MonthEnd
FROM retail_company.Product p
CROSS JOIN MonthEnds me
ORDER BY p.ProductID, me.ME
OPTION (MAXRECURSION 10);

-- 12. Category × Status × Day (tiny cubes)
WITH Cat AS (
  SELECT TOP (2) CategoryID, Name FROM retail_company.ProductCategory ORDER BY CategoryID
),
StatusDim AS (
  SELECT v.Status FROM (VALUES (N'Open'),(N'Shipped')) v(Status)
),
Cal AS (
  SELECT CAST('2025-07-30' AS date) AS d
  UNION ALL SELECT DATEADD(day,1,d) FROM Cal WHERE d < '2025-07-31'
)
SELECT c.CategoryID, c.Name AS Category, s.Status, cal.d AS Dt
FROM Cat c
CROSS JOIN StatusDim s
CROSS JOIN Cal cal
ORDER BY c.CategoryID, s.Status, cal.d
OPTION (MAXRECURSION 10);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
