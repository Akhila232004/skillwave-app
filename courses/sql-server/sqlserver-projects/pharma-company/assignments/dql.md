![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments

## Select
1. List all products with name, strength, and formulation
2. Show supplier contact sheet (supplier, contact, phone, email)
3. Show full customer mailing label (single column)
4. Show product + formulation percent lines (joins)
5. Distinct equipment types present
6. QC tests catalog (id, name, method)
7. Show batches with computed status flag text
8. Show shipments with a computed “UnitsPer100” (decimal)
9. Show sales orders with value per unit (TotalAmount / TotalUnits)
10. Show inventory snapshots with product-centre pairing
11. Show regulatory submissions with a friendly title
12. Distribution centers with their city/state

## WHERE
1. Suppliers with email on example.com domain
2. Raw materials from a specific supplier (e.g., SupplierID = 10)
3. Products that are tablets or capsules
4. Batches produced in July 2025
5. QC results that failed
6. Inventory snapshots for a given center (CenterID = 5) in last 7 days of July 2025
7. Shipments going to customers with IDs 100–120
8. Sales orders that are still open
9. Distribution centers not linked to an address (nulls)
10. Regulatory submissions to FDA or EMA in July 2025
11. Equipment located in Plant-A or Plant-B
12. Customers whose city starts with 'City1'

## GROUP BY
1. Count products per formulation type
2. Total raw materials per supplier
3. Total batches per product in July 2025
4. QC pass/fail counts by TestID for July 2025
5. Inventory total units by center on 2025-07-31
6. Shipments per distribution center in July 2025
7. Sales order totals per customer (units and amount) for July 2025
8. Count of regulatory submissions per agency (all time)
9. Products per strength
10. QC results per batch (how many tests recorded per batch in July 2025)
11. Daily inventory per product for last 5 days of July 2025
12. Shipments per customer on the busiest day (per-customer on 2025-07-31)

## HAVING
1. Products with 3 or more raw materials in formulation
2. Customers with total July 2025 order amount > 50,000
3. Distribution centers that shipped > 10,000 units in July 2025
4. QC tests that have at least 50 results in July 2025
5. Products with total batches >= 20 in July 2025
6. Customers with average order value >= 5,000 in July 2025
7. Products whose total inventory on 2025-07-31 exceeds 50,000 units
8. Agencies with more than 30 submissions overall
9. Customers with at least 5 orders in July 2025
10. Centers with average shipment size < 300 units in July 2025
11. Tests where fail rate (F) count >= 5 in July 2025
12. Customers whose total units ordered in July 2025 >= 2,000

## ORDER BY
1. Products ordered by name ascending
2. Suppliers ordered by most recently updated (UpdatedAt desc)
3. Top sales orders by TotalAmount in July 2025 (show all, just ordered)
4. QC results ordered by TestDate then PassFail (fail first)
5. Inventory on 2025-07-31 ordered by QuantityUnits desc
6. Shipments ordered by date asc then quantity desc
7. Customers ordered by name, then city
8. Distribution centers ordered by country then center name
9. Equipment ordered by location, then type, then name
10. Regulatory submissions ordered by status then date desc
11. Batches ordered by batch date desc then product asc
12. Sales orders ordered by average price per unit (desc)

## TOP
1. Top 10 most recently created customers
2. Top 15 products alphabetically
3. Top 10 sales orders by TotalAmount in July 2025
4. Top 5 distribution centers by total shipments in July 2025
5. Top 10 customers by total order value in July 2025
6. Top 10 batches by QuantityUnits in July 2025
7. TOP WITH TIES: top 5 products by count of batches in July 2025 (ties included)
8. Top 10 QC tests by total result count in July 2025
9. Top 10 inventory lines by quantity on 2025-07-31
10. Top 10 customers by total units shipped in July 2025
11. Top 5 agencies by number of submissions overall
12. Top 10 “value per unit” sales orders in July 2025

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
