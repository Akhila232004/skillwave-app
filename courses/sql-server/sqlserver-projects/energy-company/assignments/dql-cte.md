![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
```

## CTE
1. July production per asset, then pick top 5
2. July average consumption per meter
3. Unpaid (open) totals per customer
4. Asset counts per facility
5. Rate plans effective on 2025-07-01
6. Monthly 2025 revenue (EOMONTH)
7. A/R aging bucket snapshot vs @RefDate
8. Last maintenance per asset
9. Grid daily MWh totals (July)
10. City-level July average consumption
11. Meters installed before 2025 with July totals
12. Assets with share of their facility capacity

## Using Multiple CTEs
1. July revenue vs July payments per customer
2. Day grid totals then add 7-day moving average
3. City counts, then top 10 cities by customer population
4. Active assets and their maintenance counts in last 180 days; list assets with zero
5. Effective plan per sale date (filter July)
6. Open invoices, then total open by city
7. Meter July stats and spikes (>150% of avg)
8. First/last reading in July per meter and span
9. Normalize asset statuses (A/M/R), then counts
10. Top 10 customers by 2025 revenue, then list their July invoices
11. Asset share of grid per day (> 20%) in July
12. Facility capacity totals then rank assets within

## Recursive CTEs
1. Generate a July-2025 calendar and left join daily grid totals
2. Last 30 days calendar ending @RefDate and production by asset 1
3. Generate all month-ends in 2025
4. Weekly reminders for open invoices until DueDate (7-day cadence)
5. Generate numbers 1..31 (utility)
6. Build a simple date dimension for Q3-2025 and mark weekends
7. Asset preventive schedule every 180 days from CommissionDate up to @RefDate+360
8. For each effective rate plan, expand daily coverage within July
9. Generate a small hours-of-day table (0..23) and join to payments made today (illustrative)
10. Produce the next 4 Fridays from @RefDate
11. Generate month sequence from the earliest sale month to @RefDate month
12. Rolling “next due check dates” every 15 days for all open invoices

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
