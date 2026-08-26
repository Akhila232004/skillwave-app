![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Equality Operator (=)
1. Active assets
2. Facilities in the 'Maintenance' department
3. Customers living in USA
4. A specific facility by exact name
5. Rate plan by exact name
6. Meter type equals 'Smart'
7. Open invoices
8. Payments made via ACH
9. Asset type equals 'Wind Turbine'
10. A customer by exact last name

## Inequality Operator (<>)
1. Assets not Active
2. Invoices not Open
3. Customers not in 'City0'
4. Assets whose FacilityID not equal to 1
5. Payments not by Check
6. Rate plans not named 'Home Saver 2024'
7. Meters not 'Active'
8. Departments not 'Maintenance'
9. Addresses not in 'USA'
10. Customers whose last name is not 'Last10'

## IN Operator
1. Facilities in given departments
2. Assets with statuses in a set
3. Rate plans by a known ID list
4. Customers in selected cities
5. Meters whose serial starts with SN00010–SN00019 (via IN on LEFT())
6. Payments by certain methods
7. Energy sales in 2025 for selected customers
8. Facilities by names
9. Asset types in a set
10. Invoices whose status is in a set

## NOT IN Operator
1. Assets not in given statuses
2. Customers not in certain cities
3. Facilities not in these departments
4. Meters not of the given types
5. Rate plans not currently in 2025 range (by ID list)
6. Invoices not Open or Paid
7. Payments not made by Card/ACH
8. Customers not in USA (if any)
9. Facilities not in specified names
10. Asset types excluding Transformers & Boilers

## LIKE Operator
1. Emails ending with example.com
2. Facility names starting with 'Facility-1'
3. Serial numbers starting with 'SN0001'
4. Streets starting with 'No.' and ending 'Main St'
5. States starting with 'State1' (e.g., State10..State19)
6. Cities 1–3 (City1, City2, City3) using bracket class
7. Asset types containing 'Turbine'
8. Customers with FirstName beginning 'First1'
9. Facility Zones via Location (e.g., 'Zone-2')
10. Rate plan names with '2025'

## NOT LIKE Operator
1. Emails not from example.com (ignore NULLs)
2. Facility names not starting with 'Facility-1'
3. States not starting with 'State1'
4. Cities not in 1–3 using bracket class negation
5. Asset type names not containing 'Turbine'
6. Serial numbers not starting with 'SN0001'
7. First names not starting with 'First1'
8. Locations not containing 'Zone-1'
9. Rate plan names not containing '2025'
10. Streets not ending 'Main St'

## BETWEEN Operator
1. Meter readings in July 2025
2. Energy production in last 30 days (ending @RefDate)
3. Energy sales in 2025 H1
4. Rate plans priced between $0.10 and $0.11 per kWh
5. Invoices due within July 2025
6. Maintenance costs between $200 and $500
7. Assets commissioned between 2020-01-01 and @RefDate
8. kWhSold between 500 and 1000 in 2025
9. AmountDue between $50 and $200
10. Consumption between 100 and 800 kWh in July 2025

## Greater Than (>)
1. Assets with capacity > 300 MW
2. Meter readings over 800 kWh in July 2025
3. Invoices with AmountDue > $500
4. Payments greater than $200
5. Energy sales > $700 total charge
6. Maintenance costs > $750
7. Assets with > 1000 days in service
8. Daily production > 200 MWh on @RefDate
9. Price per kWh > $0.10
10. Customers with more than 1 invoice (via correlated count)

## Greater Than or Equal To (>=)
1. Assets with capacity >= 400 MW
2. Consumption >= 900 kWh in July 2025
3. Invoices due on or before @RefDate
4. Payments on/after July 15, 2025
5. Sales on/after 2025-05-01
6. PricePerkWh >= 0.1025
7. Assets commissioned on/after 2018-01-01
8. AmountDue >= $250
9. EnergyMWh >= 300 on @RefDate
10. Customers with >= 3 invoices

## Less Than (<)
1. Capacity < 100 MW
2. Consumption < 200 kWh in July 2025
3. AmountDue < $100
4. Payments before 2025-07-10
5. Sales before March 2025
6. PricePerkWh < 0.10
7. CommissionDate < 2015
8. EnergyMWh < 100 on @RefDate
9. Customers with < 2 invoices
10. Maintenance cost < $300

## Less Than or Equal To (<=)
1. Capacity <= 75 MW
2. Consumption <= 150 kWh in July 2025
3. AmountDue <= $120
4. Payments on/before 2025-07-05
5. Sales on/before 2025-04-30
6. PricePerkWh <= 0.10
7. CommissionDate <= 2010-01-01
8. EnergyMWh <= 80 on @RefDate
9. Customers with <= 1 invoice
10. Maintenance cost <= $250

## EXISTS Operator
1. Customers who have at least one invoice
2. Facilities that have assets
3. Assets that produced energy in last 30 days
4. Customers who made payments in July 2025
5. Rate plans that were actually used in sales
6. Meters that have readings in July 2025
7. Customers with open invoices
8. Assets with any maintenance
9. Departments that own at least one facility in Zone-3
10. Customers whose July 2025 invoices were paid in July 2025

## NOT EXISTS Operator
1. Customers with no invoices
2. Facilities with no assets
3. Assets with no energy production ever
4. Customers with July 2025 invoices but no July 2025 payments
5. Rate plans with no sales in 2025
6. Assets with no maintenance in the last 180 days
7. Meters with no readings before 2025-03-01
8. Customers with no open invoices
9. Departments with no facilities in Zone-5
10. Invoices that have no matching payment rows

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
