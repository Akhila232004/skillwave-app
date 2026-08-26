![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Inner Join
1. Wells with their Field and Region
2. July production rows with well names
3. Shipment lines with product and customer
4. Pipeline flow with pipeline and endpoint facility names
5. Inventory snapshots with facility & product names (last 5 days)
6. Invoices with customer names (July)
7. Payments joined to invoices and customers
8. Sales contracts with customer & product
9. Drilling ops with well and field
10. Pipeline maintenance events with pipeline name (AssetType='Pipeline')
11. Facilities that shipped in July with total volume
12. Products shipped in last 14 days with revenue

## Left Join (Left Outer Join)
1. All fields with (optional) wells count
2. All wells with optional July production
3. All customers with their latest invoice (if any)
4. Invoices with (optional) payments total
5. Pipelines with recent flow if any (14 days)
6. Facilities with shipments in last 30 days (may be NULL)
7. Products with inventory snapshots in last 7 days (optional)
8. Wells with latest drilling start date (if any)
9. Customers with their address (may be NULL)
10. Sales contracts with shipments during contract period (optional)
11. Regions with fields and (optional) producing well counts
12. Wells with last production date (if any)

## Right Join (Right Outer Join)
1. Wells → RIGHT JOIN Field (all fields even w/o wells)
2. Production (July) → RIGHT JOIN Well (include wells w/o July production)
3. Payment → RIGHT JOIN Invoice (include invoices without payments)
4. Shipment (30d) → RIGHT JOIN Customer (include customers without shipments)
5. PipelineFlow (14d) → RIGHT JOIN Pipeline (include pipelines with no flow)
6. Inventory (7d) → RIGHT JOIN Product (include products w/o snapshots)
7. SalesContract → RIGHT JOIN Customer (include customers w/o contracts)
8. AssetMaintenance (Facility) → RIGHT JOIN Facility
9. DrillingOperation → RIGHT JOIN Well (include wells without ops)
10. Address → RIGHT JOIN Customer (show all customers, address optional)
11. Product → RIGHT JOIN Shipment (last 7d) (all shipments)
12. Region → RIGHT JOIN Field (all fields; regions should exist via FK)

## Full Join (Full Outer Join)
1. Customers with July shipments OR July invoices (combine)
2. Dates with production OR pipeline flow (last 10 days)
3. Facilities with either inventory (7d) OR shipments (7d)
4. Products that appear in inventory OR were shipped (90d)
5. Pipelines with capacity record OR recent flow (14d)
6. Customer–Product pairs in contracts OR in shipments (last 60d)
7. Invoices vs Payments (match by (InvoiceID, InvoiceDate))
8. Wells vs maintenance events (AssetType='Well') in last 180 days
9. Fields vs Wells (show fields with no wells & any orphan wells)
10. Recent drilling ops vs recent production by well (30 days)
11. Customers with payments OR shipments (last 60 days)
12. Facilities participating as pipeline endpoints OR having inventory

## Cross Join
1. Product × simple price tiers (what-if)
2. Customers × last 3 month-ends (skeleton for reports)
3. Facilities × last 3 days (inventory planning grid)
4. Regions × status labels (for QA checks)
5. Top 5 Products × Top 3 Customers by recent shipments (example grid)
6. Products × Unit labels (demo enumeration)
7. Pipelines × next 3 days (expected flow placeholders)
8. Contract months × sample FX scenarios (for pricing what-if)
9. All facilities × selected products (first 3)
10. Simple date spine (last 7 days) × metric names
11. Regions × two hypothetical tax rates (scenario matrix)
12. First 5 customers × first 4 products (combinatorial grid)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
