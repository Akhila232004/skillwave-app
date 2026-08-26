![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Running total oil per well by ProductionDate
2. 7-day moving average oil per well (centered on current row)
3. Daily oil share of the well’s month total
4. Cumulative pipeline throughput by day (per pipeline)
5. Invoice running balance by customer ordered by InvoiceDate
6. Count of production rows per well alongside each row
7. Max daily oil seen so far per well (running max)
8. Average RatePerBbl per product (windowed, no GROUP BY)
9. Last 30 days oil per well as a window sum (relative to each row)
10. Customer monthly invoice total annotated on each invoice of that month

## ROW_NUMBER()
1. Latest 3 production days per well
2. First shipment per customer (earliest ShipDate)
3. Top 5 highest daily oil entries per well
4. Pick latest payment per invoice
5. Latest drilling operation per well
6. First inventory snapshot per (Facility, Product)
7. Top 3 invoice amounts per customer
8. First flow record per pipeline
9. Choose one open invoice per customer (arbitrary: latest)
10. Most recent maintenance event per (AssetType, AssetID)

## RANK()
1. Rank wells by total monthly oil (latest month)
2. Rank customers by invoice amount (overall)
3. Rank products by shipment revenue (current quarter)
4. Rank fields by average daily gas
5. Rank pipelines by last 30 days throughput
6. Rank customers by average days to pay
7. Rank wells by maximum single-day oil
8. Rank months (overall) by total shipment revenue
9. Rank products by average RatePerBbl
10. Rank facilities by average inventory quantity

## DENSE_RANK()
1. Dense rank wells by monthly oil within each month (handles ties)
2. Dense rank customers by monthly invoice total
3. Dense rank pipelines by monthly flow
4. Dense rank products by shipment revenue per month
5. Dense rank fields by maximum single-day gas per month
6. Dense rank customers by average days-to-pay each quarter
7. Dense rank wells by monthly oil within field
8. Dense rank facilities by average inventory in latest month
9. Dense rank products by average observed RatePerBbl in latest month
10. Dense rank regions by sum of field max daily oil (proxy strength)

## NTILE(n)
1. Quartiles of wells by average daily oil
2. Deciles of customers by total invoice amount
3. Quintiles of pipelines by last 30-day flow
4. Quartiles of products by average RatePerBbl
5. Quartiles of fields by average gas
6. NTILE(3): facilities by average inventory
7. NTILE(6): wells by maximum daily oil
8. NTILE(4): customers by average days-to-pay (ascending → lower is better)
9. NTILE(8): shipments by RatePerBbl (price bands)
10. NTILE(4): regions by sum of field average oil

## LAG()
1. Day-over-day change in oil per well
2. Day-over-day % change (safe divide)
3. Shipment RatePerBbl delta vs previous shipment for the same customer
4. Invoice amount change vs prior invoice per customer
5. Flow change per pipeline
6. Days between maintenance events per asset
7. Gas_mcf change 7 days back per well
8. Rate change per product across shipments (by ShipDate)
9. Customer running total of payments and increment since last payment
10. Oil deviation from previous month’s average per well

## LEAD()
1. Next day oil per well and next-day change
2. Next maintenance date per asset and gap in days
3. Next shipment rate per product (to anticipate price)
4. Next payment date per invoice
5. Next pipeline flow value per pipeline
6. Next month invoice amount per customer
7. Next drilling operation status per well
8. Next inventory quantity per (Facility, Product)
9. Next day gas change per well
10. Next invoice date and gap days per customer

## FIRST_VALUE()
1. First production date & value per well (shown on every row)
2. First shipment rate per customer
3. First maintenance date per asset
4. First flow date/volume per pipeline
5. First invoice amount per customer
6. First drilling status per well
7. First observed RatePerBbl per product
8. First snapshot quantity per (Facility, Product)
9. First payment amount per invoice
10. First Oil_bbl for each month per well (window across the month)

## LAST_VALUE()
1. Last production date & oil per well (on each row)
2. Latest shipment rate per customer (shown on all rows)
3. Last maintenance date per asset
4. Latest flow volume per pipeline
5. Last invoice amount per customer
6. Last drilling status per well
7. Latest observed RatePerBbl per product
8. Last snapshot quantity per (Facility, Product)
9. Last payment amount per invoice
10. Last Oil_bbl in each month per well (month-end)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
