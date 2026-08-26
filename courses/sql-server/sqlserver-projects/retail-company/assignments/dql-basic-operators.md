![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. Orders with status exactly 'Open'
2. Inventory on a specific date (2025-07-31)
3. Products in CategoryID = 1
4. Customers located in India
5. Warehouses at exact location 'Zone-A'
6. Discontinued products (flag equals 1)
7. Purchase orders that are 'Received'
8. Order lines with quantity exactly 1
9. Orders shipped on the same day as order date
10. Suppliers with a specific email

## Inequality Operator (<>)
1. Orders not 'Cancelled'
2. Products not in CategoryID 1
3. Suppliers without email set (email <> some literal AND IS NOT NULL guard)
4. Warehouses not in 'Zone-A'
5. Customers not in 'USA'
6. Orders with ShipDate not equal to OrderDate (and not null)
7. Products where UnitsInStock not equal to ReorderLevel
8. Purchase orders not 'Open'
9. Customers with phone not equal to a given number
10. Order lines whose computed LineTotal not equal to UnitPrice*Quantity (sanity check)

## IN Operator
1. Orders with status in ('Open','Shipped')
2. Products in category list (1,2,3)
3. Suppliers with emails in a set
4. Orders on specific dates in July 2025
5. Warehouses in any of these zones
6. Customers in selected countries
7. Purchase orders in statuses
8. Products with UnitPrice in a discrete set
9. Order lines for some product IDs
10. Inventory snapshots for warehouses 1..3

## NOT IN Operator
1. Orders not in statuses ('Cancelled','Shipped')
2. Products not in categories (4,5,6)
3. Warehouses not in Zone-B/C
4. Customers not in selected countries
5. Suppliers whose emails are not one of the listed
6. Orders not on specific dates
7. Order lines not for product set
8. Purchase orders not in statuses Open/Placed
9. Products not discontinued/not active list (by ID exclusion)
10. Inventories not in warehouses 4 or 5 on 2025-07-31

## LIKE Operator
1. Products starting with 'Product-00'
2. Customers whose first name starts with 'First1'
3. Supplier emails ending with '@example.com'
4. City names containing 'City1'
5. Products with 'Pro' anywhere (case-insensitive default)
6. Category names with three digits (use underscore)
7. Phone numbers with '+1-444-' prefix
8. Warehouses named 'WH-0__' (WH-0 followed by any two chars)
9. Address ZIPs beginning with 'Z10'
10. Orders whose status contains 'hip' (e.g., Shipped)

## NOT LIKE Operator
1. Products NOT starting with 'Product-00'
2. Customers whose last name does NOT start with 'Last2'
3. Supplier emails not from example.com
4. Cities NOT containing 'City5'
5. Warehouses NOT matching pattern 'WH-1__'
6. ZIPs not starting with 'Z000'
7. Customers with phone not in '+1-444-%'
8. Categories not like 'Category-00_'
9. Product names not containing dash '-'
10. Orders whose status doesn’t contain 'pen' (i.e., not 'Open')

## BETWEEN Operator
1. Orders between 2025-07-10 and 2025-07-20 (inclusive)
2. Products priced between 50 and 150
3. Order lines with quantity between 3 and 7
4. Inventory snapshot dates between 2025-07-25 and 2025-07-31
5. Purchase orders expected between 2025-07-15 and 2025-07-25
6. Products with UnitsInStock between 100 and 300
7. ReorderLevel between 10 and 60
8. TotalAmount between 1,000 and 10,000 in July
9. CategoryID between 2 and 5
10. SupplierID between 10 and 20

## Greater Than (>)
1. Orders with amount > 10,000
2. Products with price > 200
3. Order lines with quantity > 5
4. Inventory on 2025-07-31 with QuantityOnHand > 5000
5. Products where UnitsInStock > ReorderLevel
6. Purchase orders with TotalAmount > 50,000
7. Suppliers with ID > 20
8. Customers with ID > 300
9. Orders dated after 2025-07-20
10. Products with ReorderLevel > 40

## Greater Than or Equal To (>=)
1. Orders on/after 2025-07-15
2. Products priced >= 99.99
3. Order lines with quantity >= 10
4. Inventory (2025-07-31) with QuantityOnHand >= 8000
5. Purchase orders with TotalAmount >= 100,000
6. Products with UnitsInStock >= ReorderLevel
7. Suppliers with ID >= 10
8. Customers with ID >= 500
9. ReorderLevel >= 30
10. Orders with TotalAmount >= 5,000

## Less Than (<)
1. Orders with amount < 1,000
2. Products priced < 50
3. Order lines with quantity < 3
4. Inventory (2025-07-31) with QuantityOnHand < 500
5. Products with UnitsInStock < ReorderLevel
6. Purchase orders with TotalAmount < 5,000
7. Suppliers with ID < 5
8. Customers with ID < 50
9. ReorderLevel < 25
10. Orders before 2025-07-10

## Less Than or Equal To (<=)
1. Orders on/before 2025-07-05
2. Products priced <= 20
3. Order lines with quantity <= 2
4. Inventory (2025-07-31) with QuantityOnHand <= 1000
5. Purchase orders with TotalAmount <= 10,000
6. Products with UnitsInStock <= ReorderLevel
7. Suppliers with ID <= 12
8. Customers with ID <= 100
9. ReorderLevel <= 15
10. Orders with TotalAmount <= 1,500

## EXISTS Operator
1. Customers who placed at least one order in July 2025
2. Products that appear in any order line
3. Categories that have at least one product
4. Suppliers that supply at least one product
5. Orders that have at least one line
6. Products with any inventory snapshot on 2025-07-31
7. Suppliers with any purchase order in July 2025
8. Warehouses having inventory rows
9. Customers with shipping addresses (ShipAddressID set on any order)
10. Products that are part of any purchase order detail

## NOT EXISTS Operator
1. Customers with no orders in July 2025
2. Products that were never ordered (no order lines at all)
3. Categories without products
4. Suppliers that do not supply any product
5. Orders that (unexpectedly) have no lines
6. Products with no inventory on 2025-07-31
7. Warehouses without any inventory row
8. Suppliers without purchase orders in July 2025
9. Customers who have never specified a shipping address on any order
10. Products never purchased via any PO detail

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
