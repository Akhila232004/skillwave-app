![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Select
1. List all regions
2. Wells with days since spud
3. Fields with their region names
4. Production rows in the July window
5. Shipments with computed revenue (last 30 days)
6. Pipelines with capacity in kbbl
7. Inventory with facility & product names
8. Invoices with current balance (AmountDue - total payments)
9. Sales contracts with duration (days)
10. Currently active drilling operations with elapsed days
11. Facility label (name + type + location)
12. Customers with city/country

## WHERE
1. Regions in USA
2. Producing wells
3. Wells spudded before 2020
4. Fields discovered in the last 5 years
5. July production rows with Oil_bbl > 100
6. Shipments for product 'Diesel'
7. High-capacity pipelines (> 100,000 bbl/d)
8. Open invoices
9. Payments in last 30 days
10. Contracts active today
11. Facilities of type Refinery or Terminal
12. Drilling ops that ended in July

## GROUP BY
1. Field counts per region
2. Well counts by type
3. Daily total production (all wells)
4. July production per well
5. Shipment metrics by product (last 30 days)
6. Inventory totals by facility & date (last 7 days)
7. Revenue by customer-month from shipments
8. Payments per invoice
9. Pipeline flow totals (last 30 days)
10. Maintenance events count by asset type (last 180 days)
11. Drilling operations count by status
12. Patients? (N/A) ⇒ Customers by country via address

## HAVING
1. Regions with > 10 fields
2. Fields with ≥ 50 wells
3. Wells with July oil > 3,000 bbl
4. Products with revenue > $1,000,000 in last 90 days
5. Customers with unpaid balance > 0
6. Pipelines with avg daily flow (last 30d) > 75% of capacity
7. Facilities with avg inventory > 50,000 bbl (last 30 days)
8. Assets (type+id) with maintenance cost > $100k in last 180 days
9. Customers with ≥ 5 shipments in last 30 days
10. Fields with at least 1 producing well
11. Wells with > 3 drilling operations
12. Products shipped to ≥ 10 distinct customers (90 days)

## ORDER BY
1. Wells ordered by SpudDate (newest first; NULLs last)
2. Fields ordered by DiscoveryDate then Name
3. Regions ordered by Country then Name
4. Shipments (last 30d) ordered by Revenue DESC
5. Pipelines by Capacity DESC
6. Invoices ordered by Status then AmountDue DESC
7. Maintenance events ordered by date & cost
8. Customers ordered by Name
9. July 1st production ordered by Oil DESC
10. Payments ordered by PaymentDate DESC
11. Facilities ordered by custom type priority (Refinery > Terminal > others)
12. Pipeline flows (7 days) ordered by Pipeline then FlowDate DESC

## TOP
1. Top 10 wells by July oil production
2. Top 5 customers by shipment revenue (last 30 days)
3. Top 20 shipments by volume
4. Top 15 invoices by AmountDue
5. Top 10 pipelines by avg flow (last 30 days)
6. Top 3 fields by well count (WITH TIES)
7. Top 10 facilities by latest-day total inventory
8. Top 10 products by shipment revenue (90 days)
9. Top 5 regions by July oil production
10. Top 25 most maintained assets (by event count)
11. Top 10 longest drilling operations (by duration days)
12. Top 1 percent shipments by revenue (last 90 days, WITH TIES)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
