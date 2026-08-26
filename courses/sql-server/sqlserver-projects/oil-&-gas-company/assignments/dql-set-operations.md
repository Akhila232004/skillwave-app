![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Union
1. Wells that are Producing OR Drilling
2. Shipments either in July 2025 OR in last 7 days
3. Customers with shipments (last 30d) OR invoices (last 30d)
4. Products that appear either in Shipments OR in Inventory (any time)
5. Facilities that are pipeline endpoints OR shipment origins
6. Regions having fields discovered in 2025 OR 2024
7. Calendar days with either production OR pipeline flow (last 7 days)
8. Invoices that are Open OR Partially Paid (union of filters)
9. Union ALL (stack measures): last 7d daily Oil and Gas totals
10. Unified cashflow view: Shipment revenue + Payments (last 14d)
11. Wells seen in either DrillingOperation OR Production (last 30d)
12. Names from Facilities and Customers as a single catalog

## Intersect
1. Wells that are Producing AND have July production
2. Customers with shipments (30d) AND open invoices
3. Products present both in Inventory (last 7d) AND Shipments (last 7d)
4. Facilities that are pipeline endpoints AND have inventory snapshots (5d)
5. Dates that have BOTH production and pipeline flow (last 7d)
6. Pipelines with flow last 7d AND capacity ≥ 200k bbl/d
7. Wells with any drilling op AND currently Producing
8. Customers with active contracts today AND shipments in last 60d
9. Regions that have inactive fields AND producing wells
10. Invoices in July that ALSO have payments (match by (InvoiceID,Date))
11. Products appearing BOTH in SalesContract AND in Shipments (90d window)
12. US customers who ALSO shipped in last 30d

## Except
1. Fields with NO wells
2. Wells with NO July production
3. Customers with shipments (30d) EXCEPT those with any payment (30d)
4. Products in Inventory (7d) EXCEPT those shipped (7d)
5. Facilities that are pipeline endpoints EXCEPT shipment origins (30d)
6. Pipelines with capacity ≥ 200k EXCEPT those with any flow (14d)
7. Invoices in July EXCEPT those that received payments
8. Regions with fields EXCEPT regions with producing wells
9. Wells that had drilling operations EXCEPT currently Producing wells
10. Customers with Open invoices EXCEPT those with shipments (90d)
11. Contracted products EXCEPT products present in Inventory
12. Dates with production (7d) EXCEPT dates with pipeline flow (7d)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
