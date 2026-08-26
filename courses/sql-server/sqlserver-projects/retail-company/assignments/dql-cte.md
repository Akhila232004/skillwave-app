![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @StartJuly date = '2025-07-01';
DECLARE @EndJuly   date = '2025-07-31';
```

## CTE
1. Daily sales in July 2025 (CTE to aggregate once, then top-5 days)
2. Active products only (not discontinued), then show top-10 by UnitPrice
3. July orders CTE, then split by status
4. Category revenue (from lines) in July
5. Customer July revenue above 10,000
6. Orders per customer (whole data), with customer name
7. Low-stock products (stock-to-reorder ratio < 1.2)
8. Above-average price items per category
9. Latest inventory snapshot per Product × Warehouse (<= 2025-07-31)
10. July open purchase orders amount by supplier
11. Top-10 products by July revenue (from lines)
12. Shipping lead time per order and customer-level average

## Using Multiple CTEs
1. Daily sales (CTE1) → Weekly totals (CTE2)
2. Compare header vs line totals per order in July
3. Top-3 products by price within each category (RankCTE → FilterCTE)
4. July customers with order count and revenue (two CTEs then join)
5. Supplier July PO total & #products supplied (join two summaries)
6. On-hand per warehouse at month-end & warehouse ranking
7. Customer first & last order dates (two window CTEs) and active span
8. Category price stats (CTE1) & product deviation (CTE2)
9. Repeat customers in July (>= 2 orders) with their July revenue
10. Top categories by July revenue and top product per those categories
11. Lines-per-order (CTE1) joined to header for July orders > 2 lines
12. Products sold in July but NOT supplied by top-PO supplier (two CTEs + EXCEPT)

## Recursive CTEs
1. Calendar days for July 2025
2. July calendar LEFT JOIN daily sales (showing zero-sales days)
3. Running cumulative July sales using recursion
4. Generate sequence 1..31 via recursion (utility)
5. Rolling 7-day sum via recursive walk (for July)
6. Calendar weeks starting from the Monday of the first week in July (iterative add 7 days)
7. Inventory day-by-day carry-forward per product (single product demo)
8. Build months of 2025 and attach revenue per month
9. Recursively accumulate per-day order counts (alternative to window)
10. Build a sequence 1..n for top-N filtering per category (N=3)
11. Recursively expand dates and union purchase-order counts
12. Recursively compute a simple “sales momentum” (today vs prior day)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
