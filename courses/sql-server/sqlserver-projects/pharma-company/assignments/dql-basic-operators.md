![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. Product exactly named 'Product-0001'
2. Batches with Status = 'Released'
3. Sales orders for a specific customer (CustomerID = 100)
4. QC results with PassFail = 'P'
5. Inventory snapshots on date = '2025-07-31'
6. Shipments on a specific date
7. Regulatory submissions to a specific agency
8. Supplier at a specific address (AddressID = 1)
9. Equipment exactly of type 'Reactor'
10. Customers located in a specific city (via FK)

## Inequality Operator (<>)
1. Products not capsules
2. Batches not released
3. QC results not passed
4. Inventory snapshots not on '2025-07-31'
5. Equipment not in 'Plant-A'
6. Reg submissions not to 'EMA'
7. Sales orders with status not 'Open'
8. Customers not in 'USA'
9. Suppliers not having an email on example.com
10. Shipments not on '2025-07-01'

## IN Operator
1. Products in specific formulations
2. QC results for specific tests
3. Batches for selected products
4. Sales orders in July on specific dates
5. Shipments from specific centers
6. Customers in a list
7. Equipment types of interest
8. Regulatory submissions to key agencies
9. Suppliers at addresses 1..3
10. Inventory snapshots on last 3 days of July

## NOT IN Operator
1. Products not in Syrup or Injection forms
2. QC results excluding specific tests
3. Batches excluding products 1..5
4. Sales orders not on these dates
5. Shipments not from centers 2 or 3
6. Customers not in the given list
7. Equipment excluding Packaging/Mixer
8. Submissions not to ANVISA or TGA
9. Suppliers not at addresses 10,11
10. Inventory snapshots not on last two days of July

## LIKE Operator
1. Products starting with 'Product-00'
2. Suppliers with email on '@example.com'
3. Customers whose name contains 'Customer-0001'
4. Addresses with City starting 'City1'
5. Equipment located at plants with letter 'A'
6. Regulatory doc links ending with '.pdf'
7. QC ResultValue including 'Pass'
8. Product strengths ending with ' mg'
9. Phone numbers with '555-2'
10. Distribution center names like 'DC-0__' (DC-0xx)

## NOT LIKE Operator
1. Products not starting with 'Product-00'
2. Suppliers without '@example.com' emails
3. Customers whose names don’t contain '-0001'
4. Addresses whose city does not start with 'City1'
5. Equipment not in 'Plant-B' locations
6. Regulatory doc links not pdf
7. QC ResultValue not containing '%'
8. Strength not ending in ' mg'
9. Phones not having '555-'
10. Center names not matching pattern 'DC-___'

## BETWEEN Operator
1. Batches in July 2025
2. Shipments in second half of July 2025
3. Sales orders in first week of July
4. Inventory snapshots for last 5 days of July
5. QC results in last 10 days of July
6. Customers with IDs between 50 and 100
7. Products with IDs between 10 and 25
8. Shipments QuantityUnits between 200 and 400
9. Sales orders TotalUnits between 100 and 200
10. Addresses with ZIP 'Z10000' to 'Z20000'

## Greater Than (>)
1. Shipments with units > 800
2. Sales orders amount > 20000 in July
3. Inventory quantity > 5000 on 2025-07-31
4. Batches with QuantityUnits > 20000
5. Sales orders with TotalUnits > 400
6. Customers with ID > 2000
7. Products with ProductID > 200
8. QC results where ResultID > 2,001,000
9. Shipments on or after '2025-07-20' and QuantityUnits > 600
10. Sales orders with value per unit > 40

## Greater Than or Equal To (>=)
1. Shipments with units >= 900
2. Sales orders with amount >= 50,000 in July
3. Inventory quantity >= 7000 on final day
4. Batches with QuantityUnits >= 25000
5. Sales orders with TotalUnits >= 450
6. Customers with ID >= 2400
7. Products with ProductID >= 230
8. QC results with TestDate >= '2025-07-25'
9. Sales orders with value per unit >= 30
10. Suppliers created at/after a date (UTC)

## Less Than (<)
1. Shipments with units < 200
2. Sales orders with amount < 2000 in July
3. Inventory quantity < 1200 on 2025-07-31
4. Batches with QuantityUnits < 6000
5. Sales orders with TotalUnits < 100
6. Customers with ID < 50
7. Products with ProductID < 10
8. QC results with TestDate < '2025-07-10'
9. Sales orders with value per unit < 15
10. Suppliers created before July 2025

## Less Than or Equal To (<=)
1. Shipments with units <= 150
2. Sales orders with amount <= 5000 in July
3. Inventory quantity <= 1500 on 2025-07-31
4. Batches with QuantityUnits <= 5500
5. Sales orders with TotalUnits <= 80
6. Customers with ID <= 25
7. Products with ProductID <= 5
8. QC results with TestDate <= '2025-07-15'
9. Orders with value per unit <= 10
10. Suppliers created on/before July 10

## EXISTS Operator
1. Products that have at least one batch
2. Customers who placed at least one order in July 2025
3. Batches that have at least one QC result
4. Distribution centers that shipped anything in July
5. Products that have a regulatory submission
6. Customers who received shipments (via Shipment table)
7. Suppliers who supply at least one raw material
8. Products that appear in Inventory on 2025-07-31
9. QC tests that were actually run in July
10. Addresses referenced by any customer

## NOT EXISTS Operator
1. Products that have no batches
2. Customers who placed no orders in July 2025
3. Batches that have no QC result rows
4. Distribution centers that shipped nothing in July
5. Products with no regulatory submission
6. Customers who never received a shipment
7. Suppliers not supplying any raw material
8. Products not present in Inventory on 2025-07-31
9. QC tests never executed in July 2025
10. Addresses unused by both customers and suppliers

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
