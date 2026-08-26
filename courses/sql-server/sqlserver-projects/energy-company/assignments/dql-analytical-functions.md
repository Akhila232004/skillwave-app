![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
```

## Aggregate Functions
1. Running total MWh per asset in July (date order)
2. 7-reading moving average consumption per meter in July
3. Customer monthly revenue with running YTD (2025)
4. Percent of grid MWh contributed by each asset per day
5. Average invoice amount per customer with difference from overall avg
6. Cumulative count of invoices per customer by date
7. Min/Max daily production per asset across July shown on each row
8. Rolling 30-day sum MWh per asset ending at @RefDate (row-based)
9. Windowed count of payments per customer in July
10. Capacity rank share: asset capacity vs facility total

## ROW_NUMBER()
1. Latest invoice per customer (pick rn=1)
2. Top 3 daily production rows per asset in July
3. First meter reading in July per meter
4. Deduplicate customers by Email keeping most recently created
5. Latest maintenance event per asset
6. Most recent sale per customer
7. First asset per facility by name
8. Top 5 customers by unpaid amount (with ROW_NUMBER over order)
9. First effective rate plan per month
10. Earliest commissioned asset per asset type

## RANK()
1. Rank customers by total 2025 revenue (ties share same rank)
2. Rank assets by total July MWh
3. Per-facility rank of asset capacities
4. Monthly day rank by grid production (which day was most productive)
5. Rank cities by July average consumption
6. Rank plans by 2025 revenue
7. Per-customer rank of invoices by AmountDue (largest first)
8. Rank assets by most recent maintenance date (newest first)
9. Rank departments by count of facilities
10. Rank customers by number of payments in July

## DENSE_RANK()
1. Dense rank assets by July total MWh
2. Dense rank customers by 2025 kWh sold
3. Dense rank facilities by number of assets
4. Dense rank rate plans by price
5. Dense rank maintenance costs by asset (max cost)
6. Dense rank customers by open unpaid total
7. Dense rank cities by average July consumption
8. Dense rank assets by capacity within facility
9. Dense rank days by grid MWh (descending)
10. Dense rank invoices by AmountDue per customer

## NTILE(n)
1. Quartiles of assets by July total MWh
2. Deciles of customers by 2025 revenue
3. Quintiles of facilities by asset count
4. Tertiles of meters by July total consumption
5. Quartiles of assets by capacity within facility
6. Deciles of customers by unpaid open amount
7. Quartiles of days by grid MWh in July
8. Quintiles of rate plans by 2025 revenue
9. Quartiles of maintenance cost per asset (last year)
10. Quartiles of invoices by AmountDue per customer

## LAG()
1. Day-over-day change in consumption per meter (July)
2. Production change vs previous day per asset
3. Invoice amount change from prior invoice per customer
4. Days since last maintenance event per asset
5. Rate plan change detection per customer (by sale month)
6. Payment gap (days) since previous payment per customer
7. Consumption spike flag (> 200 kWh jump)
8. Rolling min vs previous value per asset
9. Detect invoice date gaps > 31 days per customer
10. Delta of monthly kWh per customer (month-over-month)

## LEAD()
1. Next invoice date per customer
2. Next payment date for each payment (per customer)
3. Next maintenance date per asset
4. Days to next reading per meter
5. Next month’s kWh per customer (for % change calc)
6. Sales row with comparison to next sale amount (per customer)
7. Invoice → Next DueDate (should be next invoice’s due date)
8. Asset production with next day MWh for delta
9. Meter reading with next consumption to compute forward diff
10. Maintenance cost compared to next maintenance cost

## FIRST_VALUE()
1. First invoice date per customer (display on each row)
2. First sale month per customer (EOMONTH)
3. First maintenance date per asset
4. First production date per asset in July
5. First rate plan effective overall
6. First meter installation date per customer
7. First asset commission date per facility
8. First payment date per customer in 2025
9. First occurrence of maximum daily MWh per asset in July (tie-breaking by date)
10. First open invoice date per customer

## LAST_VALUE()
1. Last invoice date per customer (broadcast to each row)
2. Last payment date per customer
3. Last maintenance date per asset
4. Last production date per asset in July
5. Last month with sales per customer (EOMONTH)
6. Last effective rate plan overall
7. Last meter install date per customer
8. Last (max) AmountDue per customer shown on each invoice row
9. Last (latest) commission date per facility
10. Last grid production day in July (broadcast)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
