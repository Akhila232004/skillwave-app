![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Equality Operator (=)
1. Regions in India
2. Producing wells
3. Wells of type 'Oil'
4. Pipelines with exact capacity 100000 bbl/d
5. Invoices with status 'Open'
6. Shipments for product 'Diesel'
7. Facilities exactly of type 'Refinery'
8. Sales contracts that end today
9. Drilling operations currently 'Active'
10. Products named 'Gasoline'

## Inequality Operator (<>)
1. Regions not in USA
2. Wells not of type 'Injector'
3. Fields not 'Inactive'
4. Invoices not 'Open'
5. Shipments whose rate is not 0
6. Facilities not of type 'Terminal'
7. Drilling operations not completed
8. Products not named like crude blends (exact name compare)
9. Customers whose city is not 'City0'
10. Production rows where Oil_bbl not equal to 0

## IN Operator
1. Facilities of selected types
2. Wells with selected statuses
3. Regions in selected countries
4. Products of key list
5. Fields discovered in specific years
6. Invoices with statuses of interest
7. Shipments for products in crude family (via subquery)
8. Pipeline flows for selected pipeline IDs
9. Customers in selected states
10. Maintenance events for asset types of interest

## NOT IN Operator
1. Regions not in North America (example countries)
2. Wells not in 'Producing' or 'Drilling'
3. Products not among road fuels
4. Facilities not of selected types
5. Shipments not for crude family
6. Customers not from specific cities
7. Pipelines not in given list
8. Invoices not in 'Open' or 'Paid'
9. Maintenance events not for wells
10. Fields not discovered in the last 3 years (year-based)

## LIKE Operator
1. Regions whose names start with 'Reg'
2. Facilities in locations starting with 'Area-1'
3. Customers whose names end with '007'
4. Products containing 'Crude'
5. Address ZIPs starting with '12'
6. Pipeline names with a hyphen-number pattern
7. Field names with two digits at the end
8. Wells with 'Well-1%' prefix
9. Facilities labelled 'Refinery' inside name string
10. City names containing 'City1'

## NOT LIKE Operator
1. Regions not starting with 'Region-1'
2. Facilities whose location does not include 'Area-'
3. Customers not ending with '000'
4. Products not containing 'Crude'
5. Addresses where City not matching 'City1%'
6. Wells whose name not starting with 'Well-9'
7. Pipelines not named 'Pipeline-%5' (ending with 5)
8. Fields not containing hyphen (unlikely; for pattern demo)
9. Facilities whose type does not contain 'or' (string demo)
10. Products not starting with 'G'

## BETWEEN Operator
1. Production rows in July 2025
2. Shipments in last 30 days
3. Pipeline flows in the last week
4. Invoices billed in July 2025
5. Payments posted in Q3 2025
6. Drilling operations starting this year
7. Facilities created in the last 90 days
8. Products with APIGravity between 35 and 45
9. Shipments with rate between $50 and $70
10. Inventory snapshots across last 5 days

## Greater Than (>)
1. Pipelines over 100k bbl/d capacity
2. Shipments with volume > 500 bbl
3. Shipments with rate > $70/bbl
4. Invoices with AmountDue > $250k
5. Production oil > 150 bbl/day
6. Gas production > 1000 mcf/day
7. Maintenance costs > $10k
8. Payments > $100k
9. Inventory quantity > 75,000 bbl
10. Drilling ops lasting > 60 days

## Greater Than or Equal To (>=)
1. Wells spudded on/after 2020-01-01
2. Pipelines capacity ≥ 200k bbl/d
3. Rate per bbl ≥ $60
4. AmountDue ≥ $1M
5. Oil ≥ 100 bbl/day
6. Gas ≥ 500 mcf/day
7. Maintenance cost ≥ $50k
8. Payments ≥ $250k
9. Inventory ≥ 20k bbl
10. Contracts starting this year or later

## Less Than (<)
1. Pipelines under 50k bbl/d capacity
2. Shipments volume < 200 bbl
3. Rate per bbl < $45
4. AmountDue < $10k
5. Oil < 25 bbl/day
6. Gas < 100 mcf/day
7. Maintenance cost < $1,000
8. Inventory < 5k bbl
9. Contracts shorter than 30 days (when EndDate present)
10. Drilling ops shorter than 7 days

## Less Than or Equal To (<=)
1. Pipelines capacity ≤ 75k bbl/d
2. Shipments volume ≤ 150 bbl
3. Rate per bbl ≤ $55
4. AmountDue ≤ $1k
5. Oil ≤ 40 bbl/day
6. Gas ≤ 300 mcf/day
7. Maintenance cost ≤ $2,500
8. Inventory ≤ 10k bbl
9. Contracts ending on/before @Today
10. Drilling ops lasting ≤ 3 days

## EXISTS Operator
1. Fields that have at least one producing well
2. Wells that have production in July
3. Customers who have shipments in the last 30 days
4. Pipelines that recorded flow yesterday
5. Invoices that have at least one payment
6. Facilities that shipped anything in July
7. Products that appear in any sales contract
8. Regions that contain at least one inactive field
9. Wells that ever had a drilling operation
10. Assets that had maintenance in the last 90 days (by type/id)

## NOT EXISTS Operator
1. Fields with no wells
2. Wells with no production in July
3. Customers with no shipments in last 60 days
4. Pipelines with no flow in last 14 days
5. Invoices that have received no payments
6. Facilities with no inventory snapshots in last 10 days
7. Products never shipped (ever)
8. Regions with no inactive fields
9. Wells without any drilling operation
10. Customers without open invoices

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
