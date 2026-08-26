![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments

## Select
1. Basic product list with price alias
2. Customer full name (computed) with email
3. Distinct countries in the customer addresses
4. Sales order details showing computed LineTotal
5. Product with Category and Supplier names
6. Orders with derived year and month columns
7. Inventory rows with low-stock flag (using product ReorderLevel)
8. Purchase order lines with supplier and product names
9. Concatenated ship-to string for orders (when address present)
10. Discontinued products with a friendly label
11. Product margin preview (hypothetical 35% margin on UnitPrice)
12. Orders with customer and total amount

## WHERE
1. Active (not discontinued) products
2. Products priced between 100 and 200 (inclusive)
3. Customers from India
4. Orders placed in July 2025
5. Orders that have shipped (ShipDate not null)
6. Inventory snapshots on 2025-07-31
7. Products below reorder level
8. Suppliers with email and US/Canada phone code
9. Sales order lines with quantity >= 5
10. Warehouses in Zone-A
11. Purchase orders expected after 2025-07-20
12. Open orders not yet shipped

## GROUP BY
1. Orders count per customer in July 2025
2. Revenue per order date in July 2025
3. Quantity sold per product in July 2025
4. Total on-hand by warehouse on 2025-07-31
5. Purchase order total per supplier in July 2025
6. Product count per category
7. Average product price per category
8. Average order line quantity per product (overall)
9. Orders count by status
10. Distinct ordering customers per day in July 2025
11. Inventory by product across all warehouses on 2025-07-31
12. Purchase order lines summary by product

## HAVING
1. Customers with July revenue > 100,000
2. Products with July quantity sold >= 100
3. Categories with average price > 150
4. Suppliers with at least 5 products
5. Days in July with more than 50 orders
6. Warehouses with total on-hand > 100,000 on 2025-07-31
7. Countries with July revenue between 50,000 and 250,000
8. Products appearing in more than 10 order lines (overall)
9. Customers who ordered on at least 5 distinct days in July
10. Suppliers whose July PO total exceeds 200,000
11. Products with average ordered quantity >= 3 in July
12. Categories having at least 10 products

## ORDER BY
1. Products by price descending, then name
2. Customers ordered by last name, first name
3. July orders by highest TotalAmount, then most recent
4. Inventory on 2025-07-31 by lowest stock first
5. Suppliers by name (A → Z)
6. Categories by name (A → Z)
7. Order lines by LineTotal (largest first)
8. Purchase orders by earliest ExpectedDate first
9. Warehouses by location then name
10. Products: active first, then discontinued, each by name
11. Sales orders sorted by custom status priority (Open → Shipped → Cancelled)
12. Purchase orders sorted by status priority (Open → Placed → Received)

## TOP
1. Top 10 customers by July revenue (WITH TIES)
2. Top 5 products by July quantity sold
3. Top 20 most expensive products
4. Top 10 most recent orders (by date then ID)
5. Top 3 categories by product count
6. Top 5 suppliers by July PO total
7. Top 10 customers by order count overall
8. Top 10 largest purchase orders by amount
9. Top 5 warehouses by on-hand on 2025-07-31
10. Top 15 order lines by LineTotal in July
11. Top 10 cities by July revenue
12. Top 1 most expensive product per category (using TOP WITH TIES + window)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
