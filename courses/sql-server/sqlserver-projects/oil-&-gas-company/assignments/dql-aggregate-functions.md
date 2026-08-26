![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments

## Count
1. Total wells overall
2. Wells per field
3. Wells by status
4. Fields per region
5. Distinct production days per well (observed days)
6. Drilling operations started per month (yyyy-mm)
7. Shipments per product in the last 30 days
8. Customers with at least one shipment (distinct)
9. Invoices by status
10. Payments per invoice (how many partials/splits)
11. Inventory snapshots per (Facility, Product)
12. Pipeline flow days per pipeline (observed days with data)

## Sum
1. Total oil produced overall
2. Total gas produced by field (via Well -> Field)
3. Shipment revenue per product (Volume * Rate)
4. Amount due per customer (invoice totals)
5. Payments received per customer (join Invoice -> Payment)
6. Outstanding per customer = SUM(AmountDue) - SUM(AmountPaid)
7. Total maintenance spend by asset type
8. Pipeline throughput (sum) by month
9. Inventory value proxy: sum quantity by facility (bbl)
10. Sum of oil production per well over the last 14 days
11. Sum of Volume_bbl shipped per customer last month
12. Total committed volume in active contracts

## Avg
1. Average daily oil per well
2. Average pipeline flow per pipeline
3. Average RatePerBbl per product (from shipments)
4. Average invoice amount per customer
5. Average days to pay per customer
6. Average drilling duration (days)
7. Average daily gas by field
8. Average inventory quantity by (Facility, Product)
9. Average monthly revenue per customer (based on invoices)
10. Average oil per weekday (which days perform best)
11. Average RatePerBbl per customer
12. Average maintenance cost per asset type

## Max
1. Latest production date per well
2. Maximum daily oil per well
3. Max shipment volume per product
4. Max invoice amount overall
5. Max pipeline capacity
6. Max maintenance cost per asset type
7. Max RatePerBbl observed per customer
8. Max payment amount (single payment)
9. Latest invoice date per customer
10. Max gas produced in a single day per field
11. Max inventory snapshot quantity per (Facility, Product)
12. Latest drilling end per well (last completion)

## Min
1. Earliest spud date overall
2. Earliest production date per well
3. Minimum daily oil per well
4. Minimum pipeline flow per pipeline
5. Minimum RatePerBbl per product
6. Minimum invoice amount overall
7. Earliest invoice date per customer
8. Minimum maintenance cost per asset type
9. Minimum inventory snapshot quantity per (Facility, Product)
10. Minimum days to pay (fastest payments)
11. Earliest drilling start per well
12. Minimum daily gas per field

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
