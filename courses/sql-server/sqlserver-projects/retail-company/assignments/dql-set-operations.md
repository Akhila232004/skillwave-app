![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. Customers who ordered in either first-half or second-half of July 2025
2. Products that were either SOLD (SO details) or PURCHASED (PO details) in July 2025
3. Countries appearing in either customer or supplier addresses
4. Cities used either as customer home cities or as order Ship-to cities
5. Calendar dates in July 2025 that had either sales orders OR purchase orders
6. ProductIDs that are either discontinued OR have zero stock
7. All unique email addresses from customers and suppliers
8. Product names that were either sold or purchased in July 2025
9. Customers who either have a profile address set OR ever used a ShipAddress on an order
10. Unified document feed: Sales Orders and Purchase Orders (same shape)
11. (UNION ALL) All business documents per day in July 2025 with counts
12. Products that are either low stock OR discontinued

## Intersect
1. Products that were BOTH sold and purchased in July 2025
2. Customers who placed July orders AND had a ShipAddress on (at least one) July order
3. City+Country pairs that appear for BOTH customers and suppliers
4. Dates in July 2025 that had BOTH sales orders and purchase orders
5. Warehouses that recorded inventory on BOTH 2025-07-30 and 2025-07-31
6. Customers who ordered in BOTH halves of July 2025
7. Suppliers with BOTH 'Placed' AND 'Received' POs in July 2025
8. Products that appear BOTH in Inventory(2025-07-31) and in any order line in July
9. Orders that BOTH have a ShipDate AND shipped on the same day as order date
10. Email addresses used by BOTH customers and suppliers
11. Categories that had BOTH sold products and purchased products in July 2025
12. Calendar dates that had BOTH order dates and ship dates (not necessarily same order)

## Except
1. Customers with NO orders in July 2025
2. Products SOLD in July but NOT PURCHASED in July
3. Products PURCHASED in July but NOT SOLD in July
4. Cities that have customers but NOT suppliers (City, Country key)
5. Suppliers with NO purchase orders in July 2025
6. Products with Inventory on 2025-07-31 but NOT present in any July order lines
7. Warehouses with inventory on 2025-07-31 but NOT on 2025-07-25
8. Customers who ordered (ever) but NEVER provided a ShipAddress on any order
9. Active (not discontinued) products that were NEVER ordered
10. Customer email addresses NOT used by any supplier
11. Days in July with sales orders but NO purchase orders
12. Product categories with NO products

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
