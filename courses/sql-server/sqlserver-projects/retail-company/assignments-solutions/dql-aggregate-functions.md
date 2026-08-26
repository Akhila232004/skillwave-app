![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Total number of customers
SELECT COUNT(*) AS CustomerCount
FROM retail_company.Customer;

-- 2. Count of ACTIVE products (not discontinued)
SELECT COUNT(*) AS ActiveProductCount
FROM retail_company.Product
WHERE Discontinued = 0;

-- 3. Number of sales orders in July 2025
SELECT COUNT(*) AS July2025_OrderCount
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Distinct customers who ordered in July 2025
SELECT COUNT(DISTINCT CustomerID) AS July2025_DistinctCustomers
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Count of order lines (details) in July 2025
SELECT COUNT(*) AS July2025_OrderLines
FROM retail_company.SalesOrderDetail
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 6. Orders per STATUS in July 2025
SELECT Status, COUNT(*) AS Orders
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY Status
ORDER BY Orders DESC;

-- 7. Count of products NEVER ordered (no presence in SalesOrderDetail)
SELECT COUNT(*) AS NeverOrderedProducts
FROM retail_company.Product p
WHERE NOT EXISTS (
  SELECT 1
  FROM retail_company.SalesOrderDetail d
  WHERE d.ProductID = p.ProductID
);

-- 8. Count of categories with NO products
SELECT COUNT(*) AS EmptyCategories
FROM retail_company.ProductCategory pc
WHERE NOT EXISTS (
  SELECT 1
  FROM retail_company.Product p
  WHERE p.CategoryID = pc.CategoryID
);

-- 9. Number of distinct order DAYS in July 2025
SELECT COUNT(DISTINCT OrderDate) AS DistinctOrderDays
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 10. Warehouses count
SELECT COUNT(*) AS WarehouseCount
FROM retail_company.Warehouse;

-- 11. Distinct products SOLD in July 2025
SELECT COUNT(DISTINCT ProductID) AS DistinctProductsSold
FROM retail_company.SalesOrderDetail
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 12. Suppliers with at least one PO in July 2025
SELECT COUNT(DISTINCT SupplierID) AS SuppliersWithPOs
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';
```

## Sum
```sql
-- 1. Total revenue in July 2025 (from order header)
SELECT SUM(TotalAmount) AS July2025_Revenue
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 2. Total revenue in July 2025 (from order lines)
SELECT SUM(LineTotal) AS July2025_Revenue_FromLines
FROM retail_company.SalesOrderDetail
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Total quantity SOLD in July 2025
SELECT SUM(Quantity) AS July2025_QtySold
FROM retail_company.SalesOrderDetail
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 4. Total PO amount in July 2025
SELECT SUM(TotalAmount) AS July2025_PurchaseAmount
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Total quantity PURCHASED per product in July 2025
SELECT pod.ProductID, SUM(pod.Quantity) AS QtyPurchased
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY pod.ProductID
ORDER BY QtyPurchased DESC;

-- 6. Total on-hand inventory on 2025-07-31
SELECT SUM(QuantityOnHand) AS OnHand_2025_07_31
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31';

-- 7. Revenue by CUSTOMER in July 2025
SELECT so.CustomerID, SUM(so.TotalAmount) AS JulyRevenue
FROM retail_company.SalesOrder so
WHERE so.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY so.CustomerID
ORDER BY JulyRevenue DESC;

-- 8. Catalog inventory BOOK value = SUM(UnitPrice * UnitsInStock)
SELECT SUM(UnitPrice * UnitsInStock) AS CatalogBookValue
FROM retail_company.Product;

-- 9. Open vs Shipped amount split (whole dataset)
SELECT
  SUM(CASE WHEN Status = N'Open'    THEN TotalAmount ELSE 0 END) AS OpenAmt,
  SUM(CASE WHEN Status = N'Shipped' THEN TotalAmount ELSE 0 END) AS ShippedAmt,
  SUM(CASE WHEN Status = N'Cancelled' THEN TotalAmount ELSE 0 END) AS CancelledAmt
FROM retail_company.SalesOrder;

-- 10. Daily sales (sum) for July 2025
SELECT OrderDate, SUM(TotalAmount) AS DailySales
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY OrderDate
ORDER BY OrderDate;

-- 11. Sum of order LINES per order in July 2025 (line totals)
SELECT d.SalesOrderID, d.OrderDate, SUM(d.LineTotal) AS SumLineTotal
FROM retail_company.SalesOrderDetail d
WHERE d.OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY d.SalesOrderID, d.OrderDate
ORDER BY d.OrderDate, d.SalesOrderID;

-- 12. Total on-hand by warehouse on 2025-07-31
SELECT WarehouseID, SUM(QuantityOnHand) AS OnHand
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
GROUP BY WarehouseID
ORDER BY OnHand DESC;
```

## Avg
```sql
-- 1. Average order amount overall
SELECT AVG(TotalAmount) AS AvgOrderAmount
FROM retail_company.SalesOrder;

-- 2. Average order amount in July 2025
SELECT AVG(TotalAmount) AS AvgOrderAmount_July2025
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Average quantity per order line (overall)
SELECT AVG(CAST(Quantity AS decimal(10,2))) AS AvgLineQty
FROM retail_company.SalesOrderDetail;

-- 4. Average UnitCost on PO lines in July 2025
SELECT AVG(CAST(pod.UnitCost AS decimal(18,4))) AS AvgUnitCost_July2025
FROM retail_company.PurchaseOrderDetail pod
JOIN retail_company.PurchaseOrder po ON po.PurchaseOrderID = pod.PurchaseOrderID
WHERE po.OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Average product price by category
SELECT p.CategoryID, AVG(CAST(p.UnitPrice AS decimal(18,2))) AS AvgPrice
FROM retail_company.Product p
GROUP BY p.CategoryID
ORDER BY AvgPrice DESC;

-- 6. Average shipping lead time (days) for shipped orders
SELECT AVG(CAST(DATEDIFF(DAY, OrderDate, ShipDate) AS decimal(10,2))) AS AvgShipDays
FROM retail_company.SalesOrder
WHERE ShipDate IS NOT NULL;

-- 7. Average on-hand per product on 2025-07-31
SELECT i.ProductID, AVG(CAST(i.QuantityOnHand AS decimal(18,2))) AS AvgOnHand
FROM retail_company.Inventory i
WHERE i.StockDate = '2025-07-31'
GROUP BY i.ProductID
ORDER BY AvgOnHand DESC;

-- 8. Average orders per DAY in July 2025
WITH Daily AS (
  SELECT OrderDate, COUNT(*) AS Cnt
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY OrderDate
)
SELECT AVG(CAST(Cnt AS decimal(10,2))) AS AvgOrdersPerDay_July2025
FROM Daily;

-- 9. Average number of LINES per order in July 2025
WITH LinesPerOrder AS (
  SELECT SalesOrderID, OrderDate, COUNT(*) AS Lines
  FROM retail_company.SalesOrderDetail
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY SalesOrderID, OrderDate
)
SELECT AVG(CAST(Lines AS decimal(10,2))) AS AvgLinesPerOrder_July2025
FROM LinesPerOrder;

-- 10. Average purchase order amount per supplier (overall)
SELECT SupplierID, AVG(CAST(TotalAmount AS decimal(18,2))) AS AvgPOAmount
FROM retail_company.PurchaseOrder
GROUP BY SupplierID
ORDER BY AvgPOAmount DESC;

-- 11. Average UnitPrice per supplier
SELECT SupplierID, AVG(CAST(UnitPrice AS decimal(18,2))) AS AvgUnitPrice
FROM retail_company.Product
GROUP BY SupplierID
ORDER BY AvgUnitPrice DESC;

-- 12. Average reorder level by category
SELECT CategoryID, AVG(CAST(ReorderLevel AS decimal(10,2))) AS AvgReorderLevel
FROM retail_company.Product
GROUP BY CategoryID
ORDER BY AvgReorderLevel DESC;
```

## Max
```sql
-- 1. Max order amount overall
SELECT MAX(TotalAmount) AS MaxOrderAmount
FROM retail_company.SalesOrder;

-- 2. Max order amount in July 2025
SELECT MAX(TotalAmount) AS MaxOrderAmount_July2025
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Max product UNIT price
SELECT MAX(UnitPrice) AS MaxUnitPrice
FROM retail_company.Product;

-- 4. Max UnitsInStock across products
SELECT MAX(UnitsInStock) AS MaxUnitsInStock
FROM retail_company.Product;

-- 5. Max line quantity on sales orders
SELECT MAX(Quantity) AS MaxSalesLineQty
FROM retail_company.SalesOrderDetail;

-- 6. Most recent order date (latest)
SELECT MAX(OrderDate) AS LatestOrderDate
FROM retail_company.SalesOrder;

-- 7. Latest PO expected date in July 2025 window
SELECT MAX(ExpectedDate) AS LatestExpectedDate_InOrAfterJuly
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 8. Max on-hand per warehouse on 2025-07-31
SELECT WarehouseID, MAX(QuantityOnHand) AS MaxOnHand_Item
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
GROUP BY WarehouseID
ORDER BY MaxOnHand_Item DESC;

-- 9. Day with maximum sales in July 2025 (amount)
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY OrderDate
)
SELECT MAX(DaySales) AS MaxDailySales_July2025
FROM Daily;

-- 10. Max PO amount (overall)
SELECT MAX(TotalAmount) AS MaxPOAmount
FROM retail_company.PurchaseOrder;

-- 11. Max inventory snapshot date available
SELECT MAX(StockDate) AS LatestStockDate
FROM retail_company.Inventory;

-- 12. Max reorder level by supplier
SELECT SupplierID, MAX(ReorderLevel) AS MaxReorderLevel
FROM retail_company.Product
GROUP BY SupplierID
ORDER BY MaxReorderLevel DESC;
```

## Min
```sql
-- 1. Min order amount overall
SELECT MIN(TotalAmount) AS MinOrderAmount
FROM retail_company.SalesOrder;

-- 2. Min order amount in July 2025
SELECT MIN(TotalAmount) AS MinOrderAmount_July2025
FROM retail_company.SalesOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 3. Minimum product UNIT price
SELECT MIN(UnitPrice) AS MinUnitPrice
FROM retail_company.Product;

-- 4. Min UnitsInStock across products
SELECT MIN(UnitsInStock) AS MinUnitsInStock
FROM retail_company.Product;

-- 5. Smallest line quantity on sales orders
SELECT MIN(Quantity) AS MinSalesLineQty
FROM retail_company.SalesOrderDetail;

-- 6. Earliest order date
SELECT MIN(OrderDate) AS EarliestOrderDate
FROM retail_company.SalesOrder;

-- 7. Earliest PO expected date in July 2025 window
SELECT MIN(ExpectedDate) AS EarliestExpectedDate_InOrAfterJuly
FROM retail_company.PurchaseOrder
WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 8. Min on-hand per warehouse on 2025-07-31
SELECT WarehouseID, MIN(QuantityOnHand) AS MinOnHand_Item
FROM retail_company.Inventory
WHERE StockDate = '2025-07-31'
GROUP BY WarehouseID
ORDER BY MinOnHand_Item ASC;

-- 9. Day with minimum sales in July 2025 (amount)
WITH Daily AS (
  SELECT OrderDate, SUM(TotalAmount) AS DaySales
  FROM retail_company.SalesOrder
  WHERE OrderDate BETWEEN '2025-07-01' AND '2025-07-31'
  GROUP BY OrderDate
)
SELECT MIN(DaySales) AS MinDailySales_July2025
FROM Daily;

-- 10. Min PO amount (overall)
SELECT MIN(TotalAmount) AS MinPOAmount
FROM retail_company.PurchaseOrder;

-- 11. Oldest inventory snapshot date
SELECT MIN(StockDate) AS EarliestStockDate
FROM retail_company.Inventory;

-- 12. Min reorder level by category
SELECT CategoryID, MIN(ReorderLevel) AS MinReorderLevel
FROM retail_company.Product
GROUP BY CategoryID
ORDER BY MinReorderLevel ASC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
