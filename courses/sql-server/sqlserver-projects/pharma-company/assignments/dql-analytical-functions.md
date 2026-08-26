![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Running total of sales amount by customer in July 2025 (by OrderDate)
2. Daily total shipments + share of day per shipment (per day)
3. Average batch size per product (window) next to each batch
4. Count of QC results per batch (window) printed on each row
5. Max order value per customer (window) alongside each order
6. Rolling 7-day sum of shipments per center (by date)
7. Rank-style dense count of distinct shipment days per center (windowed count distinct via separate step)
8. Percent of monthly revenue by customer (July 2025)
9. Min/Max inventory per product across centers on 2025-07-31 (window)
10. Running count of orders per customer by date

## ROW_NUMBER()
1. Number each customer’s orders by recency (latest first)
2. First inventory row per product on 2025-07-31 (smallest CenterID)
3. Top-1 latest batch per product
4. First regulatory submission per product by date
5. First 3 orders per customer in July 2025
6. Latest QC result per batch
7. First shipment per customer (overall)
8. Latest supplier rows (by UpdatedAt) numbered
9. Top 5 shipments per center by units on 2025-07-31
10. First QC test run per TestID in July 2025

## RANK()
1. Rank customers by total July revenue (ties keep same rank)
2. Rank products by total batches produced in July
3. Per-center daily shipment units ranked (2025-07-31)
4. Rank tests by number of failures in July
5. Rank customers by total units shipped overall
6. Rank products by total on-hand (2025-07-31)
7. Rank agencies by submissions count
8. Rank customers by their single largest order (July)
9. Rank centers by total shipments in July
10. Rank raw material suppliers by count of materials

## DENSE_RANK()
1. Dense rank products by batch units in July
2. Dense rank customers by July revenue
3. Dense rank test IDs by failure count in July
4. Dense rank centers by shipments on 2025-07-31
5. Dense rank customers by max single order (overall)
6. Dense rank products by on-hand (2025-07-31)
7. Dense rank agencies by submissions in July only
8. Dense rank batches within product by size (July)
9. Dense rank customers by total shipped units overall
10. Dense rank centers by distinct shipment days in July

## NTILE(n)
1. Quartiles of customers by July revenue
2. Deciles of products by July batch units
3. Tertiles of centers by shipments in July
4. Quartiles of orders by value in July
5. Quintiles of inventory per product-center on 2025-07-31
6. Quartiles of shipments per customer by units (July)
7. Quartiles of batches per product by size (July)
8. NTILE(2): split agencies by total submissions (all time)
9. NTILE(6): six buckets of order values overall
10. NTILE(4): split QC failure counts per test (July)

## LAG()
1. Previous day’s shipments per center (by date)
2. Previous order value per customer
3. Previous batch size per product
4. QC result previous Pass/Fail within batch
5. Previous inventory per center-product
6. Previous shipment for a customer (units)
7. Previous submission status per product
8. Previous supplier update time (global)
9. Previous order date per customer and gap days
10. Compare batch-to-batch delta per product

## LEAD()
1. Next day’s shipments per center (by date)
2. Next order value per customer
3. Next batch size per product
4. QC result next Pass/Fail within batch
5. Next inventory per center-product
6. Next shipment for a customer (units)
7. Next submission status per product
8. Next supplier update time (global)
9. Days until next order per customer
10. Predict next-day inventory change (simple diff)

## FIRST_VALUE()
1. First order date per customer (shown on each order)
2. First shipment units per customer
3. First batch size per product (overall order)
4. First QC result (by date) per batch
5. First inventory quantity per center-product
6. First submission status per product
7. First order amount per customer (with ties handled by SalesOrderID)
8. First batch date per product
9. First shipment date per center
10. First QC Pass/Fail per TestID in July

## LAST_VALUE()
1. Last order date per customer (on each order)
2. Last shipment units per customer
3. Last batch size per product
4. Last QC result ID per batch
5. Last inventory quantity per center-product
6. Last submission status per product
7. Last order amount per customer
8. Last batch date per product
9. Last shipment date per center
10. Last QC outcome per TestID in July

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
