![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. July-2025 orders with customer full name
2. Order lines with product & category info (July-2025)
3. Purchase order lines with supplier & product names (July-2025)
4. Inventory (2025-07-31) with product & warehouse
5. Orders with ship-to city & country (when present)
6. Active products with category & supplier
7. July-2025 revenue per category (from order lines)
8. Compare order TotalAmount vs sum of line totals (for July-2025)
9. Customers with July order line counts
10. Products sold to customers in Germany (July-2025)
11. Supplier totals from PO lines in July-2025
12. Per-warehouse distinct products with inventory on 2025-07-31

## Left Join (Left Outer Join)
1. All customers with (optional) address details
2. All products with July-2025 sold quantity (0 if none)
3. Categories with product counts (including empty categories)
4. Suppliers with their product counts (including suppliers with none)
5. Products with inventory total on 2025-07-31 (0 if no row)
6. All orders with number of lines (0 if none)
7. Warehouses with total on-hand on 2025-07-31 (0 if none)
8. Products with latest PO price in July-2025 (if any)
9. Customers with their latest order date (NULL if no orders)
10. Products with “ever sold” flag
11. Suppliers with July-2025 PO totals (0 if none)
12. Orders with optional ship-to city

## Right Join (Right Outer Join)
1. All customers with their order counts (RIGHT JOIN from SO to Customer)
2. All warehouses with inventory on 2025-07-31 (0 if none)
3. All products with their supplier names (RIGHT JOIN Supplier->Product)
4. All products with their category names (RIGHT JOIN Category->Product)
5. All customers with address (RIGHT JOIN Address->Customer)
6. All orders with line counts (RIGHT JOIN Detail->Order)
7. All suppliers with July PO totals (RIGHT JOIN PO->Supplier)
8. All orders with ship address info (RIGHT JOIN Address->Order)
9. All inventory rows with product name (RIGHT JOIN Product->Inventory)
10. All PO lines with PO header info (RIGHT JOIN PO->POD)
11. All order lines with order status (RIGHT JOIN SO->SOD)
12. All customers with “ever purchased product 1” flag (RIGHT JOIN Detail->Customer)

## Full Join (Full Outer Join)
1. Customers vs. July-2025 ordering customers (who ordered / who did not)
2. Products SOLD vs PURCHASED in July-2025
3. Warehouses with inventory on 2025-07-30 vs 2025-07-31
4. Suppliers with POs vs. Suppliers with Products
5. Orders vs. summed order lines (which orders mismatch)
6. Products vs. inventory on 2025-07-31 (which products have no stock rows; which inventory rows orphaned)
7. Customer cities vs Ship-to cities (unified view)
8. Sales dates vs Purchase dates in July-2025
9. Category presence in sold vs purchased products (July-2025)
10. Customer set vs Orders with ship address set (who never shipped anywhere)
11. Inventory product set on 2025-07-30 vs 2025-07-31 with delta indicator
12. Supplier addresses vs customer addresses (shared / unique address cities)

## Cross Join
1. Create a product × warehouse grid for first 3 warehouses & first 5 products
2. Last 7 days of July × all warehouses (date grid)
3. Status dimension × July-2025 dates
4. Top-3 customers × Top-3 categories (planning matrix)
5. Build a small numbers table (1..10) × a single warehouse
6. Price buckets × category listing
7. Small calendar (3 days) × first 3 products (availability plan)
8. Status × Customer: build a checkerboard to later left-join counts
9. Three warehouses × three zones we want to validate
10. “What-if” discount grid: 5 products × discounts (5%,10%,15%)
11. Product × MonthEnd (3 months from July)
12. Category × Status × Day (tiny cubes)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
