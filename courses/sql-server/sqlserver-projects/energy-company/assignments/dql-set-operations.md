![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Union
1. Customers with invoices in July 2025 OR payments in July 2025 (all such customers)
2. AssetIDs that EITHER produced energy in July 2025 OR had maintenance in July 2025
3. Facilities that have assets OR are referenced via any asset maintenance record
4. Meters that had readings in July 2025 OR were installed in July 2025
5. Customers with open invoices OR any overdue invoices as of @RefDate
6. RatePlanIDs that are either effective on 2025-07-01 OR used in any 2025 sale
7. Cities with at least one customer OR at least one customer payment in July 2025
8. CustomerIDs who bought energy in 2025 H1 OR 2025 H2
9. Production dates seen in first half of July 2025 OR second half of July 2025
10. AssetIDs belonging to Wind/Solar categories OR Battery Storage
11. Meters with extreme readings (very high OR very low) in July 2025
12. UNION vs UNION ALL — Customers from City1* combined with City2*

## Intersect
1. Customers who had BOTH invoices in July 2025 AND payments in July 2025
2. Assets that BOTH produced energy in the last 90 days AND had maintenance in the last 90 days
3. Facilities that BOTH have at least one asset in 'Maintenance' status AND at least one maintenance record
4. Meters with readings in BOTH June 2025 AND July 2025
5. Customers who had invoices in July AND also had energy sales in July
6. Assets that produced energy on BOTH @RefDate AND the previous day
7. Rate plans effective on BOTH 2025-06-30 AND 2025-07-01 (plans spanning boundary)
8. Customers living in City starting with 'City1' AND having at least one open invoice
9. Assets that are Active AND have CapacityMW > 300
10. Meters installed before 2025-01-01 AND having July 2025 readings
11. CustomerIDs that appear in both the top 20 unpaid (open invoices) AND have payments in the last 30 days
12. Days that are BOTH invoice dates AND payment dates in July 2025

## Except
1. Customers with invoices in July 2025 BUT NO payments in July 2025
2. Meters having July 2025 readings BUT NO readings before July 2025
3. Assets with production in July 2025 BUT NO maintenance in the last year
4. Facilities that have assets BUT are NOT in the IT department
5. Rate plans used in 2025 sales BUT NOT effective on 2025-07-01 (e.g., expired H1 plans)
6. USA customers BUT with NO invoices ever (potentially unbilled)
7. Active assets BUT with NO production in the last 90 days (possible outage)
8. July invoices BUT NOT paid in July (still open or paid later)
9. Assets in 'Maintenance' status BUT with NO maintenance record in the last 180 days
10. Meters installed before 2025-01-01 BUT with NO July 2025 reading
11. For a chosen asset (e.g., AssetID = 1), days with production EXCEPT days with low output (<100 MWh)
12. Customers with open invoices (as of @RefDate) EXCEPT those with any payment in the last 30 days

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
