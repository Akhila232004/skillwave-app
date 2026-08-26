![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments

## CTE
1. Last 30 days total oil per well
2. Customer-month shipment revenue (Volume × Rate)
3. Latest pipeline flow record per pipeline
4. Outstanding per customer (Invoices − Payments)
5. Active contracts and committed volume by product
6. Latest inventory snapshot per (Facility, Product)
7. High-performing wells (Avg Oil > 100 bbl)
8. Currently active drilling operations
9. Daily Oil/Gas ratio per well for the last 7 days
10. Shipment price bands by product
11. Region-level total oil using Well→Field→Region
12. Invoice payment coverage (% paid) per invoice

## Using Multiple CTEs
1. Top customers by revenue in the latest shipment month
2. Well monthly oil and rank within field
3. Invoice totals, payments, and outstanding by customer
4. Pipeline 30-day throughput vs capacity utilization
5. Active contracts exploded with product names (summary)
6. Facility-product average vs facility total share
7. Shipment revenue this quarter and ranking by product
8. Well performance: average oil & gas with field/region
9. Customers split by payment speed (<=30 days vs >30)
10. Open invoices with last payment (if any)
11. Monthly invoice totals vs payments received
12. Field production league table in the latest month

## Recursive CTEs
1. Generate the last 14 calendar days and join daily oil totals (all wells)
2. Month sequence (min..max ShipDate) with shipment revenue by month
3. Hierarchy expansion: Region → Field → Well
4. Expand active contracts into one row per month
5. Forecast next 10 days using last 7-day average per (one sample) Well
6. Running balance by invoice after each payment (per invoice)
7. Daily calendar for last 10 days per (one sample) Pipeline with flows
8. Enumerate days from earliest to latest ProductionDate (global)
9. Field→Well list with ordinal numbering via recursion
10. Generate next 12 month-ends from today
11. Fill missing inventory dates for (one sample) Facility-Product combo (last 7 days)
12. Rolling day index to label the last 15 days

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
