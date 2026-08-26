![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Inner Join
1. Customers with their address details
2. Facilities with their department names
3. Assets with facility and asset type
4. Energy production on @RefDate with asset names
5. July 2025 meter readings with customer names (via Meter)
6. Energy sales with customer and rate plan (2025)
7. Invoices joined to their originating sales (composite join)
8. Payments with their invoices (composite join)
9. Asset maintenance with asset & facility info
10. Rate plans effective on a date joined to sales occurring that date range
11. July 2025: customers, their invoices, and any matching payments in July
12. Assets with their July 2025 total production (grouped)

## Left Join (Left Outer Join)
1. All customers with address (customers without address still show)
2. All facilities with (optional) department
3. All assets with (optional) July 2025 production
4. All customers with (optional) July 2025 invoices
5. Rate plans with (optional) 2025 sales counts
6. Invoices with (optional) payments (show payment status)
7. Meters with (optional) July readings (find meters without readings)
8. Active assets with (optional) production in last 90 days (find outages)
9. Facilities with asset counts (0 if none)
10. Customers with (optional) meters
11. Energy sales with (optional) invoice rows (should match, but demo of LEFT)
12. Asset types with (optional) assets (find unused types)

## Right Join (Right Outer Join)
1. Departments RIGHT JOIN Facilities (return all facilities)
2. Addresses RIGHT JOIN Customers (return all customers)
3. Facilities RIGHT JOIN Assets (return all assets)
4. Asset types RIGHT JOIN Assets (return all assets)
5. Assets RIGHT JOIN EnergyProduction (return all production rows)
6. Customers RIGHT JOIN Meters (return all meters)
7. Meters RIGHT JOIN MeterReading (return all readings)
8. Rate plans RIGHT JOIN EnergySale (return all sales)
9. EnergySale RIGHT JOIN Invoice (return all invoices)
10. Invoice RIGHT JOIN Payment (return all payments)
11. Assets RIGHT JOIN AssetMaintenance (return all maintenance events)
12. Department RIGHT JOIN Facility (filter Zone-3; all facilities in Zone-3)

## Full Join (Full Outer Join)
1. All invoices and all payments (matched where possible)
2. Assets and their production on @RefDate (include assets with none and any stray rows)
3. Meters and July 2025 readings (include meters without readings and vice versa)
4. Facilities and assets (include facilities without assets and assets with missing facility)
5. Asset types and assets (include unused types)
6. Customers and invoices in July (include customers without invoices and invoices without customer rows)
7. Departments and facilities in Zone-2 (include depts without zone-2 facs)
8. Energy sales in July and invoices in July (unions via FULL JOIN)
9. Assets and maintenance in last 180 days (assets without maint and any maint without asset)
10. Customers (USA only) and payments in July (keep all from both sides)
11. Production dates and maintenance dates (calendar match/mismatch)
12. Rate plans effective in July and sales in July (include plans with no sales and sales with no effective plan match)

## Cross Join
1. Matrix of Departments × Zones (1..5) to plan coverage
2. Asset types × Departments (theoretical responsibility matrix)
3. Distinct Cities × Distinct Rate Plans (market-plan combinations)
4. Facilities × July weeks (week buckets 1–4)
5. Asset × small set of target thresholds (for reporting bins)
6. Distinct States × MeterType (coverage map)
7. Rate plans × Months (H1 2025)
8. Customers × a tiny label set (tagging scaffold)
9. Facility × AssetType (potential suitability grid)
10. Distinct Cities × July/H2 flags (simple time buckets)
11. Tiny numbers table × sample to build day offsets (0..6)
12. Distinct States × PaymentMethod (method availability by state)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
