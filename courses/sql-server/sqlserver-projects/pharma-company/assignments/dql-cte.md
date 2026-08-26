![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments

## CTE
1. July-2025 sales per customer, then list only customers with > ₹100,000 revenue
2. Daily shipments (units) in July-2025
3. Inventory snapshot on 2025-07-31 — top 10 products by total on-hand
4. QC pass rate per TestID in July-2025
5. Latest batch per product (by date)
6. Orders in July grouped by weekday
7. Top-5 customers by units shipped overall
8. Products with > 3 formulation components
9. Agencies with ≥ 10 submissions (all-time)
10. Centers with shipments but no inventory on 2025-07-31
11. Customer-country sales in July-2025
12. Products with any batch on last 7 days of July

## Using Multiple CTEs
1. July-2025: revenue per customer with rank and percent of total
2. Inventory vs Shipments on 2025-07-31 by product
3. Top-3 batches per product by size in July
4. QC pass rate per product (via batch linkage), July
5. Customers with orders but no shipments in July
6. Daily net flow per product on last 5 days (Inventory change ≈ today - yesterday)
7. “Latest submission per product” joined to product info
8. Batches per product and share within product (July)
9. Combine customers’ latest order date and latest shipment date
10. Products without any regulatory submission
11. Top-3 revenue customers in July with addresses
12. Formulation % check per product (sum of percentages)

## Recursive CTEs
1. Generate a July-2025 calendar (one row per day)
2. Calendar joined to daily shipments (including zero days)
3. Running total of July orders (simple recursive running sum by date)
4. Expand a small numbers table 1..20
5. Create 10 planned retest dates per QC TestDate (+30 days each step)
6. For each center, generate last 7 calendar days and join inventory count per day
7. Distribute a batch quantity evenly over 5 days (view as plan)
8. Generate 12 future month-ends from 2025-07-31
9. Recursively climb from a product’s first batch date to its last (month by month)
10. Generate 15 sequence rows per selected customer and tag them
11. Build a date grid for all days of July and compute order count per day
12. Recursive cumulative inventory per product across the last 5 days of July

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
