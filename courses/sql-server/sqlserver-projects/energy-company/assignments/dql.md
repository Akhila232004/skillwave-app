![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
```

## Select
1. List all customers (basic projection).
2. Distinct list of countries in the Address table.
3. Show customer full name as one column.
4. Build a single-line mailing address string.
5. Show assets with days in service as of @RefDate.
6. EnergyProduction in both MWh and kWh (computed column).
7. Label asset status using CASE.
8. Replace NULL emails with a placeholder.
9. Present rate plans as a display string.
10. Meter label showing serial, type, and install date (YYYY-MM-DD).
11. Show invoice “days overdue” relative to @RefDate (negative = not yet due).
12. Distinct list of meter types.

## WHERE
1. Customers with missing email.
2. Facilities that belong to the 'Maintenance' department.
3. Active assets commissioned after 2022-01-01.
4. Meter readings recorded in July 2025.
5. Energy production for a given set of assets.
6. Rate plans effective on 2025-07-15.
7. Overdue open invoices as of @RefDate.
8. Payments made via ACH or Card.
9. Meters with serial numbers starting with 'SN0001'.
10. Customers who live in City='City10' and Country='USA'.
11. Energy sales with kWhSold between 500 and 1000 in 2025.
12. Maintenance events costing > $500 in the last 90 days from @RefDate.

## GROUP BY
1. Count facilities per department.
2. Asset counts by facility and status.
3. Total MWh per asset in July 2025.
4. Average daily consumption per meter in July 2025.
5. Total revenue per customer (all time).
6. 2025 revenue per rate plan.
7. Number of invoices by status.
8. Payment totals per method by month in 2025.
9. Maintenance cost per asset and type (last 180 days).
10. Customer count by state.
11. Meter counts by type and status.
12. Peak (max) daily production per asset in July 2025.

## HAVING
1. Departments with at least 3 facilities.
2. Facilities that host more than 5 assets.
3. Assets with > 10,000 MWh total in the last 90 days of @RefDate.
4. Customers with > 3000 kWh sold in the last 6 months.
5. Customers with more than 2 open invoices.
6. Meters whose average daily consumption in July 2025 > 800 kWh.
7. Rate plans used in at least 100 sales (all time).
8. Assets with maintenance cost sum > $5,000 in the last year.
9. States with customer count between 10 and 30.
10. Production days where the grid produced > 10,000 MWh.
11. Customers with July 2025 invoices but NO payments in July 2025.
12. Assets with production reported on at least 80 of the last 90 days.

## ORDER BY
1. Customers ordered by LastName, FirstName.
2. Facilities ordered by Department then Facility name.
3. Assets ordered by Status, then newest CommissionDate first.
4. Invoices ordered by highest AmountDue first.
5. EnergyProduction ordered by most recent date and then largest MWh.
6. Meter readings ordered by MeterID, then date ascending.
7. Rate plans ordered by most recent EffectiveDate, then Name.
8. Payments ordered by latest PaymentDate.
9. Maintenance events ordered by highest cost first.
10. Energy sales ordered by largest TotalCharge, then by latest SaleDate.
11. Customers ordered by City then LastName.
12. Assets ordered by Facility name then Asset name.

## TOP
1. Top 10 customers by total revenue (WITH TIES).
2. Top 5 assets by total production in the last 30 days of @RefDate.
3. Top 10 invoices by AmountDue (WITH TIES).
4. Top 3 departments by asset count.
5. Top 1 rate plan by 2025 revenue (WITH TIES).
6. Top 10 meters by average daily consumption in July 2025.
7. Top 20 customers by unpaid amount (sum of open invoices).
8. Top 10 production days by total grid MWh.
9. Top 5 facilities by number of assets.
10. Top 10 customers by number of invoices.
11. Top 10 assets by maintenance cost in the last year.
12. Top 10 cities by customer count (WITH TIES).

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
