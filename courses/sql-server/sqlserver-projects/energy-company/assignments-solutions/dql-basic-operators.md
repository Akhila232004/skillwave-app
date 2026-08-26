![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Equality Operator (=)
```sql
-- 1. Active assets
SELECT AssetID, Name, Status
FROM energy_company.Asset
WHERE Status = 'Active';

-- 2. Facilities in the 'Maintenance' department
SELECT f.FacilityID, f.Name
FROM energy_company.Facility f
JOIN energy_company.Department d ON d.DepartmentID = f.DepartmentID
WHERE d.Name = N'Maintenance';

-- 3. Customers living in USA
SELECT c.CustomerID, c.FirstName, c.LastName
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country = 'USA';

-- 4. A specific facility by exact name
SELECT FacilityID, Name
FROM energy_company.Facility
WHERE Name = 'Facility-1';

-- 5. Rate plan by exact name
SELECT RatePlanID, Name, PricePerkWh
FROM energy_company.RatePlan
WHERE Name = 'Standard 2025 H2';

-- 6. Meter type equals 'Smart'
SELECT MeterID, SerialNumber, MeterType
FROM energy_company.Meter
WHERE MeterType = 'Smart';

-- 7. Open invoices
SELECT InvoiceID, CustomerID, AmountDue, Status
FROM energy_company.Invoice
WHERE Status = 'Open';

-- 8. Payments made via ACH
SELECT PaymentID, InvoiceID, PaymentDate, AmountPaid
FROM energy_company.Payment
WHERE PaymentMethod = 'ACH';

-- 9. Asset type equals 'Wind Turbine'
SELECT AssetTypeID, Name
FROM energy_company.AssetType
WHERE Name = 'Wind Turbine';

-- 10. A customer by exact last name
SELECT CustomerID, FirstName, LastName
FROM energy_company.Customer
WHERE LastName = 'Last100';
```

## Inequality Operator (<>)
```sql
-- 1. Assets not Active
SELECT AssetID, Name, Status
FROM energy_company.Asset
WHERE Status <> 'Active';

-- 2. Invoices not Open
SELECT InvoiceID, Status, AmountDue
FROM energy_company.Invoice
WHERE Status <> 'Open';

-- 3. Customers not in 'City0'
SELECT c.CustomerID, a.City
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.City <> 'City0';

-- 4. Assets whose FacilityID not equal to 1
SELECT AssetID, Name, FacilityID
FROM energy_company.Asset
WHERE FacilityID <> 1;

-- 5. Payments not by Check
SELECT PaymentID, PaymentMethod
FROM energy_company.Payment
WHERE COALESCE(PaymentMethod,'') <> 'Check';

-- 6. Rate plans not named 'Home Saver 2024'
SELECT RatePlanID, Name
FROM energy_company.RatePlan
WHERE Name <> 'Home Saver 2024';

-- 7. Meters not 'Active'
SELECT MeterID, Status
FROM energy_company.Meter
WHERE Status <> 'Active';

-- 8. Departments not 'Maintenance'
SELECT DepartmentID, Name
FROM energy_company.Department
WHERE Name <> 'Maintenance';

-- 9. Addresses not in 'USA'
SELECT AddressID, Country
FROM energy_company.Address
WHERE Country <> 'USA';

-- 10. Customers whose last name is not 'Last10'
SELECT CustomerID, FirstName, LastName
FROM energy_company.Customer
WHERE LastName <> 'Last10';
```

## IN Operator
```sql
-- 1. Facilities in given departments
SELECT f.FacilityID, f.Name, d.Name AS Department
FROM energy_company.Facility f
JOIN energy_company.Department d ON d.DepartmentID = f.DepartmentID
WHERE d.Name IN (N'Generation', N'Maintenance');

-- 2. Assets with statuses in a set
SELECT AssetID, Name, Status
FROM energy_company.Asset
WHERE Status IN ('Active','Maintenance');

-- 3. Rate plans by a known ID list
SELECT RatePlanID, Name
FROM energy_company.RatePlan
WHERE RatePlanID IN (1,2,3);

-- 4. Customers in selected cities
SELECT c.CustomerID, a.City
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.City IN ('City1','City5','City10');

-- 5. Meters whose serial starts with SN00010–SN00019 (via IN on LEFT())
SELECT MeterID, SerialNumber
FROM energy_company.Meter
WHERE LEFT(SerialNumber,6) IN ('SN0001','SN0002'); -- coarse bucket

-- 6. Payments by certain methods
SELECT PaymentID, PaymentMethod, AmountPaid
FROM energy_company.Payment
WHERE PaymentMethod IN ('Card','ACH');

-- 7. Energy sales in 2025 for selected customers
SELECT SaleID, CustomerID, SaleDate, TotalCharge
FROM energy_company.EnergySale
WHERE YEAR(SaleDate) = 2025
  AND CustomerID IN (1,2,3,4,5);

-- 8. Facilities by names
SELECT FacilityID, Name
FROM energy_company.Facility
WHERE Name IN ('Facility-3','Facility-7','Facility-12');

-- 9. Asset types in a set
SELECT AssetTypeID, Name
FROM energy_company.AssetType
WHERE Name IN (N'Gas Turbine', N'Steam Turbine', N'Wind Turbine');

-- 10. Invoices whose status is in a set
SELECT InvoiceID, Status, AmountDue
FROM energy_company.Invoice
WHERE Status IN ('Open','Closed','Paid');  -- adjust if you use different lifecycle
```

## NOT IN Operator
```sql
-- 1. Assets not in given statuses
SELECT AssetID, Name, Status
FROM energy_company.Asset
WHERE Status NOT IN ('Active','Maintenance');

-- 2. Customers not in certain cities
SELECT c.CustomerID, a.City
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.City NOT IN ('City0','City1');

-- 3. Facilities not in these departments
SELECT f.FacilityID, f.Name
FROM energy_company.Facility f
JOIN energy_company.Department d ON d.DepartmentID = f.DepartmentID
WHERE d.Name NOT IN (N'IT', N'Finance');

-- 4. Meters not of the given types
SELECT MeterID, MeterType
FROM energy_company.Meter
WHERE COALESCE(MeterType,'') NOT IN ('Smart','Basic');

-- 5. Rate plans not currently in 2025 range (by ID list)
SELECT RatePlanID, Name
FROM energy_company.RatePlan
WHERE RatePlanID NOT IN (2,3); -- assumes 2 & 3 are 2025 plans in sample

-- 6. Invoices not Open or Paid
SELECT InvoiceID, Status
FROM energy_company.Invoice
WHERE Status NOT IN ('Open','Paid');

-- 7. Payments not made by Card/ACH
SELECT PaymentID, PaymentMethod
FROM energy_company.Payment
WHERE COALESCE(PaymentMethod,'') NOT IN ('Card','ACH');

-- 8. Customers not in USA (if any)
SELECT c.CustomerID, a.Country
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country NOT IN ('USA');

-- 9. Facilities not in specified names
SELECT FacilityID, Name
FROM energy_company.Facility
WHERE Name NOT IN ('Facility-1','Facility-2');

-- 10. Asset types excluding Transformers & Boilers
SELECT AssetTypeID, Name
FROM energy_company.AssetType
WHERE Name NOT IN (N'Transformer', N'Boiler');
```

## LIKE Operator
```sql
-- 1. Emails ending with example.com
SELECT CustomerID, Email
FROM energy_company.Customer
WHERE Email LIKE '%@example.com';

-- 2. Facility names starting with 'Facility-1'
SELECT FacilityID, Name
FROM energy_company.Facility
WHERE Name LIKE 'Facility-1%';

-- 3. Serial numbers starting with 'SN0001'
SELECT MeterID, SerialNumber
FROM energy_company.Meter
WHERE SerialNumber LIKE 'SN0001%';

-- 4. Streets starting with 'No.' and ending 'Main St'
SELECT AddressID, Street
FROM energy_company.Address
WHERE Street LIKE 'No.% Main St';

-- 5. States starting with 'State1' (e.g., State10..State19)
SELECT AddressID, State
FROM energy_company.Address
WHERE State LIKE 'State1%';

-- 6. Cities 1–3 (City1, City2, City3) using bracket class
SELECT AddressID, City
FROM energy_company.Address
WHERE City LIKE 'City[1-3]%';

-- 7. Asset types containing 'Turbine'
SELECT AssetTypeID, Name
FROM energy_company.AssetType
WHERE Name LIKE '%Turbine%';

-- 8. Customers with FirstName beginning 'First1'
SELECT CustomerID, FirstName
FROM energy_company.Customer
WHERE FirstName LIKE 'First1%';

-- 9. Facility Zones via Location (e.g., 'Zone-2')
SELECT FacilityID, Name, Location
FROM energy_company.Facility
WHERE Location LIKE '%Zone-2%';

-- 10. Rate plan names with '2025'
SELECT RatePlanID, Name
FROM energy_company.RatePlan
WHERE Name LIKE '%2025%';
```

## NOT LIKE Operator
```sql
-- 1. Emails not from example.com (ignore NULLs)
SELECT CustomerID, Email
FROM energy_company.Customer
WHERE Email IS NOT NULL
  AND Email NOT LIKE '%@example.com';

-- 2. Facility names not starting with 'Facility-1'
SELECT FacilityID, Name
FROM energy_company.Facility
WHERE Name NOT LIKE 'Facility-1%';

-- 3. States not starting with 'State1'
SELECT AddressID, State
FROM energy_company.Address
WHERE State NOT LIKE 'State1%';

-- 4. Cities not in 1–3 using bracket class negation
SELECT AddressID, City
FROM energy_company.Address
WHERE City NOT LIKE 'City[1-3]%';

-- 5. Asset type names not containing 'Turbine'
SELECT AssetTypeID, Name
FROM energy_company.AssetType
WHERE Name NOT LIKE '%Turbine%';

-- 6. Serial numbers not starting with 'SN0001'
SELECT MeterID, SerialNumber
FROM energy_company.Meter
WHERE SerialNumber NOT LIKE 'SN0001%';

-- 7. First names not starting with 'First1'
SELECT CustomerID, FirstName
FROM energy_company.Customer
WHERE FirstName NOT LIKE 'First1%';

-- 8. Locations not containing 'Zone-1'
SELECT FacilityID, Name, Location
FROM energy_company.Facility
WHERE COALESCE(Location,'') NOT LIKE '%Zone-1%';

-- 9. Rate plan names not containing '2025'
SELECT RatePlanID, Name
FROM energy_company.RatePlan
WHERE Name NOT LIKE '%2025%';

-- 10. Streets not ending 'Main St'
SELECT AddressID, Street
FROM energy_company.Address
WHERE Street NOT LIKE '% Main St';
```

## BETWEEN Operator
```sql
-- 1. Meter readings in July 2025
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 2. Energy production in last 30 days (ending @RefDate)
SELECT AssetID, ProductionDate, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate;

-- 3. Energy sales in 2025 H1
SELECT SaleID, CustomerID, SaleDate, TotalCharge
FROM energy_company.EnergySale
WHERE SaleDate BETWEEN '2025-01-01' AND '2025-06-30';

-- 4. Rate plans priced between $0.10 and $0.11 per kWh
SELECT RatePlanID, Name, PricePerkWh
FROM energy_company.RatePlan
WHERE PricePerkWh BETWEEN 0.10 AND 0.11;

-- 5. Invoices due within July 2025
SELECT InvoiceID, DueDate, AmountDue
FROM energy_company.Invoice
WHERE DueDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 6. Maintenance costs between $200 and $500
SELECT MaintenanceID, AssetID, CostUSD
FROM energy_company.AssetMaintenance
WHERE CostUSD BETWEEN 200 AND 500;

-- 7. Assets commissioned between 2020-01-01 and @RefDate
SELECT AssetID, Name, CommissionDate
FROM energy_company.Asset
WHERE CommissionDate BETWEEN '2020-01-01' AND @RefDate;

-- 8. kWhSold between 500 and 1000 in 2025
SELECT SaleID, CustomerID, kWhSold
FROM energy_company.EnergySale
WHERE SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
  AND kWhSold BETWEEN 500 AND 1000;

-- 9. AmountDue between $50 and $200
SELECT InvoiceID, AmountDue
FROM energy_company.Invoice
WHERE AmountDue BETWEEN 50 AND 200;

-- 10. Consumption between 100 and 800 kWh in July 2025
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND Consumption_kWh BETWEEN 100 AND 800;
```

## Greater Than (>)
```sql
-- 1. Assets with capacity > 300 MW
SELECT AssetID, Name, CapacityMW
FROM energy_company.Asset
WHERE CapacityMW > 300;

-- 2. Meter readings over 800 kWh in July 2025
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND Consumption_kWh > 800;

-- 3. Invoices with AmountDue > $500
SELECT InvoiceID, AmountDue
FROM energy_company.Invoice
WHERE AmountDue > 500;

-- 4. Payments greater than $200
SELECT PaymentID, AmountPaid
FROM energy_company.Payment
WHERE AmountPaid > 200;

-- 5. Energy sales > $700 total charge
SELECT SaleID, TotalCharge
FROM energy_company.EnergySale
WHERE TotalCharge > 700;

-- 6. Maintenance costs > $750
SELECT MaintenanceID, CostUSD
FROM energy_company.AssetMaintenance
WHERE CostUSD > 750;

-- 7. Assets with > 1000 days in service
SELECT AssetID, Name, DATEDIFF(DAY, CommissionDate, @RefDate) AS DaysInService
FROM energy_company.Asset
WHERE DATEDIFF(DAY, CommissionDate, @RefDate) > 1000;

-- 8. Daily production > 200 MWh on @RefDate
SELECT AssetID, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate = @RefDate
  AND EnergyMWh > 200;

-- 9. Price per kWh > $0.10
SELECT RatePlanID, Name, PricePerkWh
FROM energy_company.RatePlan
WHERE PricePerkWh > 0.10;

-- 10. Customers with more than 1 invoice (via correlated count)
SELECT c.CustomerID, COUNT(*) AS InvoiceCount
FROM energy_company.Customer c
JOIN energy_company.Invoice i ON i.CustomerID = c.CustomerID
GROUP BY c.CustomerID
HAVING COUNT(*) > 1;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Assets with capacity >= 400 MW
SELECT AssetID, Name, CapacityMW
FROM energy_company.Asset
WHERE CapacityMW >= 400;

-- 2. Consumption >= 900 kWh in July 2025
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND Consumption_kWh >= 900;

-- 3. Invoices due on or before @RefDate
SELECT InvoiceID, DueDate, AmountDue
FROM energy_company.Invoice
WHERE DueDate <= @RefDate;  -- also demonstrates <=

-- 4. Payments on/after July 15, 2025
SELECT PaymentID, PaymentDate, AmountPaid
FROM energy_company.Payment
WHERE PaymentDate >= '2025-07-15';

-- 5. Sales on/after 2025-05-01
SELECT SaleID, SaleDate, TotalCharge
FROM energy_company.EnergySale
WHERE SaleDate >= '2025-05-01';

-- 6. PricePerkWh >= 0.1025
SELECT RatePlanID, Name, PricePerkWh
FROM energy_company.RatePlan
WHERE PricePerkWh >= 0.1025;

-- 7. Assets commissioned on/after 2018-01-01
SELECT AssetID, Name, CommissionDate
FROM energy_company.Asset
WHERE CommissionDate >= '2018-01-01';

-- 8. AmountDue >= $250
SELECT InvoiceID, AmountDue
FROM energy_company.Invoice
WHERE AmountDue >= 250;

-- 9. EnergyMWh >= 300 on @RefDate
SELECT AssetID, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate = @RefDate
  AND EnergyMWh >= 300;

-- 10. Customers with >= 3 invoices
SELECT c.CustomerID, COUNT(*) AS InvoiceCount
FROM energy_company.Customer c
JOIN energy_company.Invoice i ON i.CustomerID = c.CustomerID
GROUP BY c.CustomerID
HAVING COUNT(*) >= 3;
```

## Less Than (<)
```sql
-- 1. Capacity < 100 MW
SELECT AssetID, Name, CapacityMW
FROM energy_company.Asset
WHERE CapacityMW < 100;

-- 2. Consumption < 200 kWh in July 2025
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND Consumption_kWh < 200;

-- 3. AmountDue < $100
SELECT InvoiceID, AmountDue
FROM energy_company.Invoice
WHERE AmountDue < 100;

-- 4. Payments before 2025-07-10
SELECT PaymentID, PaymentDate, AmountPaid
FROM energy_company.Payment
WHERE PaymentDate < '2025-07-10';

-- 5. Sales before March 2025
SELECT SaleID, SaleDate
FROM energy_company.EnergySale
WHERE SaleDate < '2025-03-01';

-- 6. PricePerkWh < 0.10
SELECT RatePlanID, Name, PricePerkWh
FROM energy_company.RatePlan
WHERE PricePerkWh < 0.10;

-- 7. CommissionDate < 2015
SELECT AssetID, Name, CommissionDate
FROM energy_company.Asset
WHERE CommissionDate < '2015-01-01';

-- 8. EnergyMWh < 100 on @RefDate
SELECT AssetID, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate = @RefDate
  AND EnergyMWh < 100;

-- 9. Customers with < 2 invoices
SELECT c.CustomerID, COUNT(*) AS InvoiceCount
FROM energy_company.Customer c
LEFT JOIN energy_company.Invoice i ON i.CustomerID = c.CustomerID
GROUP BY c.CustomerID
HAVING COUNT(i.InvoiceID) < 2;

-- 10. Maintenance cost < $300
SELECT MaintenanceID, CostUSD
FROM energy_company.AssetMaintenance
WHERE CostUSD < 300;
```

## Less Than or Equal To (<=)
```sql
-- 1. Capacity <= 75 MW
SELECT AssetID, Name, CapacityMW
FROM energy_company.Asset
WHERE CapacityMW <= 75;

-- 2. Consumption <= 150 kWh in July 2025
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND Consumption_kWh <= 150;

-- 3. AmountDue <= $120
SELECT InvoiceID, AmountDue
FROM energy_company.Invoice
WHERE AmountDue <= 120;

-- 4. Payments on/before 2025-07-05
SELECT PaymentID, PaymentDate, AmountPaid
FROM energy_company.Payment
WHERE PaymentDate <= '2025-07-05';

-- 5. Sales on/before 2025-04-30
SELECT SaleID, SaleDate
FROM energy_company.EnergySale
WHERE SaleDate <= '2025-04-30';

-- 6. PricePerkWh <= 0.10
SELECT RatePlanID, Name, PricePerkWh
FROM energy_company.RatePlan
WHERE PricePerkWh <= 0.10;

-- 7. CommissionDate <= 2010-01-01
SELECT AssetID, Name, CommissionDate
FROM energy_company.Asset
WHERE CommissionDate <= '2010-01-01';

-- 8. EnergyMWh <= 80 on @RefDate
SELECT AssetID, EnergyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate = @RefDate
  AND EnergyMWh <= 80;

-- 9. Customers with <= 1 invoice
SELECT c.CustomerID, COUNT(*) AS InvoiceCount
FROM energy_company.Customer c
LEFT JOIN energy_company.Invoice i ON i.CustomerID = c.CustomerID
GROUP BY c.CustomerID
HAVING COUNT(i.InvoiceID) <= 1;

-- 10. Maintenance cost <= $250
SELECT MaintenanceID, CostUSD
FROM energy_company.AssetMaintenance
WHERE CostUSD <= 250;
```

## EXISTS Operator
```sql
-- 1. Customers who have at least one invoice
SELECT c.CustomerID, c.FirstName, c.LastName
FROM energy_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  WHERE i.CustomerID = c.CustomerID
);

-- 2. Facilities that have assets
SELECT f.FacilityID, f.Name
FROM energy_company.Facility f
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Asset a
  WHERE a.FacilityID = f.FacilityID
);

-- 3. Assets that produced energy in last 30 days
SELECT a.AssetID, a.Name
FROM energy_company.Asset a
WHERE EXISTS (
  SELECT 1
  FROM energy_company.EnergyProduction ep
  WHERE ep.AssetID = a.AssetID
    AND ep.ProductionDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate
);

-- 4. Customers who made payments in July 2025
SELECT c.CustomerID, c.FirstName, c.LastName
FROM energy_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  JOIN energy_company.Payment p
    ON p.InvoiceID = i.InvoiceID
   AND p.InvoiceDate = i.InvoiceDate
  WHERE i.CustomerID = c.CustomerID
    AND p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
);

-- 5. Rate plans that were actually used in sales
SELECT rp.RatePlanID, rp.Name
FROM energy_company.RatePlan rp
WHERE EXISTS (
  SELECT 1
  FROM energy_company.EnergySale es
  WHERE es.RatePlanID = rp.RatePlanID
);

-- 6. Meters that have readings in July 2025
SELECT m.MeterID, m.SerialNumber
FROM energy_company.Meter m
WHERE EXISTS (
  SELECT 1
  FROM energy_company.MeterReading mr
  WHERE mr.MeterID = m.MeterID
    AND mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
);

-- 7. Customers with open invoices
SELECT c.CustomerID
FROM energy_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  WHERE i.CustomerID = c.CustomerID
    AND i.Status = 'Open'
);

-- 8. Assets with any maintenance
SELECT a.AssetID, a.Name
FROM energy_company.Asset a
WHERE EXISTS (
  SELECT 1
  FROM energy_company.AssetMaintenance am
  WHERE am.AssetID = a.AssetID
);

-- 9. Departments that own at least one facility in Zone-3
SELECT d.DepartmentID, d.Name
FROM energy_company.Department d
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Facility f
  WHERE f.DepartmentID = d.DepartmentID
    AND f.Location LIKE '%Zone-3%'
);

-- 10. Customers whose July 2025 invoices were paid in July 2025
SELECT c.CustomerID
FROM energy_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  JOIN energy_company.Payment p
    ON p.InvoiceID = i.InvoiceID
   AND p.InvoiceDate = i.InvoiceDate
  WHERE i.CustomerID = c.CustomerID
    AND i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
    AND p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
);
```

## NOT EXISTS Operator
```sql
-- 1. Customers with no invoices
SELECT c.CustomerID, c.FirstName, c.LastName
FROM energy_company.Customer c
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  WHERE i.CustomerID = c.CustomerID
);

-- 2. Facilities with no assets
SELECT f.FacilityID, f.Name
FROM energy_company.Facility f
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.Asset a
  WHERE a.FacilityID = f.FacilityID
);

-- 3. Assets with no energy production ever
SELECT a.AssetID, a.Name
FROM energy_company.Asset a
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.EnergyProduction ep
  WHERE ep.AssetID = a.AssetID
);

-- 4. Customers with July 2025 invoices but no July 2025 payments
SELECT c.CustomerID
FROM energy_company.Customer c
WHERE EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  WHERE i.CustomerID = c.CustomerID
    AND i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
)
AND NOT EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  JOIN energy_company.Payment p
    ON p.InvoiceID = i.InvoiceID
   AND p.InvoiceDate = i.InvoiceDate
  WHERE i.CustomerID = c.CustomerID
    AND p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
);

-- 5. Rate plans with no sales in 2025
SELECT rp.RatePlanID, rp.Name
FROM energy_company.RatePlan rp
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.EnergySale es
  WHERE es.RatePlanID = rp.RatePlanID
    AND es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
);

-- 6. Assets with no maintenance in the last 180 days
SELECT a.AssetID, a.Name
FROM energy_company.Asset a
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.AssetMaintenance am
  WHERE am.AssetID = a.AssetID
    AND am.MaintenanceDate BETWEEN DATEADD(DAY,-180,@RefDate) AND @RefDate
);

-- 7. Meters with no readings before 2025-03-01
SELECT m.MeterID, m.SerialNumber
FROM energy_company.Meter m
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.MeterReading mr
  WHERE mr.MeterID = m.MeterID
    AND mr.ReadDate < '2025-03-01'
);

-- 8. Customers with no open invoices
SELECT c.CustomerID
FROM energy_company.Customer c
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.Invoice i
  WHERE i.CustomerID = c.CustomerID
    AND i.Status = 'Open'
);

-- 9. Departments with no facilities in Zone-5
SELECT d.DepartmentID, d.Name
FROM energy_company.Department d
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.Facility f
  WHERE f.DepartmentID = d.DepartmentID
    AND f.Location LIKE '%Zone-5%'
);

-- 10. Invoices that have no matching payment rows
SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM energy_company.Invoice i
WHERE NOT EXISTS (
  SELECT 1
  FROM energy_company.Payment p
  WHERE p.InvoiceID = i.InvoiceID
    AND p.InvoiceDate = i.InvoiceDate
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
