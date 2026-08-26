![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
```

## Count
1. Total number of customers
2. Number of facilities per department
3. Distinct number of cities with at least one customer
4. Assets per status
5. Production rows recorded in July 2025
6. Number of meters per customer (expect ~1)
7. Invoices per status
8. Payments per method in 2025
9. Maintenance events in the last 180 days
10. Energy sales count per rate plan in 2025
11. Days produced (distinct dates) per asset in last 30 days
12. Number of customers with at least one open invoice

## Sum
1. Total 2025 revenue (sum of TotalCharge)
2. kWh sold per customer in last 6 months
3. Total unpaid (sum AmountDue) for open invoices
4. Amount paid per method
5. Total MWh per asset in July 2025
6. Total consumption per meter in July 2025
7. Maintenance cost per asset in the last year
8. Grid daily total production (sum across all assets)
9. 2025 revenue per rate plan
10. Unpaid amount per customer (open invoices)
11. Monthly 2025 kWh totals
12. Facility-level production in July (join assets → facility)

## Avg
1. Average daily consumption per meter (July 2025)
2. Average daily production per asset (July 2025)
3. Average sale amount per customer (2025)
4. Average PricePerkWh of plans effective on 2025-07-01
5. Average AmountDue per invoice status
6. Average days-to-pay (invoice → payment) overall
7. Average asset capacity by asset type
8. Average monthly kWh sold per customer (2025)
9. Average maintenance cost per description type (last year)
10. Average production across assets for each day in July
11. 30-day average production per asset (ending @RefDate)
12. Average city-level consumption in July (join readings → city)

## Max
1. Maximum invoice AmountDue
2. Maximum daily production per asset (July 2025)
3. Maximum consumption per meter (July 2025)
4. Maximum kWhSold per customer for any month in 2025
5. Most recent commissioning date per facility
6. Latest invoice date per customer
7. Max payment amount per method
8. Maximum capacity per asset type
9. Max maintenance cost per asset (last year)
10. Most recent production date per asset
11. Customer with max invoice count (via subquery)
12. Day with maximum grid MWh

## Min
1. Earliest asset commission date
2. Minimum daily production per asset (July 2025)
3. Minimum consumption per meter (July 2025)
4. Minimum monthly kWhSold per customer (2025)
5. Earliest meter installation per customer
6. Minimum AmountDue among open invoices
7. Minimum payment amount per method
8. Oldest maintenance date per asset
9. Minimum capacity per facility
10. Earliest sale date per customer
11. Earliest invoice in 2025
12. Lowest PricePerkWh among plans effective on 2025-07-01

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
