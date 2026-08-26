![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @StartJuly date = '2025-07-01';
DECLARE @EndJuly   date = '2025-07-31';
```

## Aggregate Functions
1. Running total revenue per CUSTOMER in July 2025 (by OrderDate)
2. Running daily sales (all customers) across 2025
3. 7-day moving average of daily sales in July 2025 window
4. Customer share of July revenue (% of total)
5. Category share of July line revenue
6. Lines per order as a window column (no GROUP BY)
7. Product UnitPrice: avg, min, max within CATEGORY as window columns
8. Supplier running PO amount over time
9. Daily order count with running count across July
10. Average line quantity per CUSTOMER (window on detail rows)
11. Daily orders count & share of week (window by ISO week)
12. Product UnitPrice z-score within category

## ROW_NUMBER()
1. Latest order per CUSTOMER (pick rn=1)
2. Top-3 most expensive products per CATEGORY
3. First order of each DAY (by SalesOrderID)
4. Top-5 revenue orders per DAY
5. Deduplicate customers by Email, keep the earliest CustomerID
6. Most recent inventory per PRODUCT × WAREHOUSE on/before 2025-07-31
7. Top-10 customers by order COUNT in July 2025
8. First PO per SUPPLIER in July 2025
9. By CATEGORY: rank products by July quantity sold (top-3)
10. Sample every 2nd order per CUSTOMER (rn % 2 = 1)
11. Sequence lines within each ORDER (by ProductID)
12. Global sequence of orders by OrderDate then ID

## RANK()
1. Rank customers by July 2025 revenue (ties share rank)
2. Rank products by UnitPrice within CATEGORY
3. Rank days in July by daily sales
4. Rank suppliers by July PO amount
5. Rank warehouses by on-hand (2025-07-31)
6. Rank categories by July revenue (from lines)
7. Global rank of products by UnitsInStock
8. Rank orders by line count (ties keep same rank)
9. Rank customers by average order amount
10. Rank products by total quantity SOLD overall
11. Rank POs by amount within each SUPPLIER
12. Rank months of 2025 by revenue

## DENSE_RANK()
1. Dense-rank categories by number of products (ties without gaps)
2. Dense-rank products by UnitPrice within CATEGORY
3. Dense-rank days by July daily sales
4. Dense-rank suppliers by PO count in July
5. Dense-rank customers by total orders overall
6. Dense-rank warehouses by total on-hand (2025-07-31)
7. Dense-rank products by total July quantity sold within CATEGORY
8. Dense-rank categories by average product price
9. Dense-rank order days by number of orders
10. Dense-rank products by UnitsInStock
11. Dense-rank suppliers by July PO amount
12. Dense-rank customers by average order amount

## NTILE(n)
1. Customers into revenue QUARTILES for July 2025
2. Products into PRICE QUINTILES (by UnitPrice)
3. Suppliers into TERTILES by July PO amount
4. Days of July into sales QUARTILES
5. Warehouses into QUARTILES by on-hand (2025-07-31)
6. Orders into DECILES by TotalAmount
7. Products into QUARTILES by UnitsInStock
8. Categories into TERTILES by average product price
9. Customers into QUARTILES by July order COUNT
10. Products into QUINTILES by July quantity SOLD
11. POs into QUARTILES by TotalAmount WITHIN each Supplier
12. Order lines into DECILES by LineTotal within their ORDER

## LAG()
1. Day-over-day change in daily sales during July
2. Customer’s days since previous order
3. Product PO UnitCost change vs previous PO (by date)
4. Inventory day-over-day delta per PRODUCT × WAREHOUSE
5. Order count per day vs previous day
6. Customer order amount vs previous order amount
7. Supplier PO amount vs previous PO
8. Change in shipping lead time vs previous order for same CUSTOMER
9. Gap in inventory dates (days) per PRODUCT × WAREHOUSE
10. Category daily revenue vs previous day revenue
11. Previous line’s quantity within each ORDER
12. Customer spend trend flag vs previous order (Up/Down/Same)

## LEAD()
1. Next order date per CUSTOMER and gap days
2. Next inventory date per PRODUCT × WAREHOUSE and gap
3. Next PO expected date per SUPPLIER
4. Next day’s sales per DAY
5. Next line total within ORDER
6. Next PO UnitCost for PRODUCT (timeline)
7. Next order amount per CUSTOMER
8. Next warehouse on-hand by date per PRODUCT
9. Next order date globally
10. Next day with zero orders (lookahead) — shows next date regardless; caller can filter
11. Next customer order within July only
12. Next category day sales

## FIRST_VALUE()
1. First order date per CUSTOMER
2. First PO date per SUPPLIER
3. For each PRODUCT: first PO UnitCost (chronologically)
4. Cheapest product price within CATEGORY using FIRST_VALUE (order by UnitPrice ASC)
5. First order ID of each DAY
6. First inventory quantity for PRODUCT in July (by date)
7. First order amount per CUSTOMER in July
8. First product ID alphabetically within CATEGORY (by Name)
9. First warehouse quantity per PRODUCT on 2025-07-31 (by WarehouseID)
10. First PO amount per SUPPLIER (by OrderDate)
11. First SOLD date per PRODUCT (by OrderDate)
12. First daily sales value of July (same for all rows) using window

## LAST_VALUE()
1. Last order date per CUSTOMER
2. Last PO date per SUPPLIER
3. For each PRODUCT: last inventory date in July
4. Most expensive product price within CATEGORY via LAST_VALUE
5. Last order ID of each DAY
6. Last quantity per PRODUCT on 2025-07-31 across warehouses (by WarehouseID)
7. Last July order amount per CUSTOMER
8. Last PO UnitCost per PRODUCT (chronological)
9. Last product name alphabetically within CATEGORY
10. Last expected date per SUPPLIER
11. Last SOLD day per PRODUCT in July
12. For each day of July: show the month’s LAST daily sales (same value on every row)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
