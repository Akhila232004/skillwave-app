![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Equality Operator (=)
```sql
-- 1. Regions in India
SELECT RegionID, Name FROM oil_n_gas_company.Region
WHERE Country = 'India';

-- 2. Producing wells
SELECT WellID, Name, FieldID FROM oil_n_gas_company.Well
WHERE Status = 'Producing';

-- 3. Wells of type 'Oil'
SELECT WellID, Name, WellType FROM oil_n_gas_company.Well
WHERE WellType = 'Oil';

-- 4. Pipelines with exact capacity 100000 bbl/d
SELECT PipelineID, Name, CapacityBbl FROM oil_n_gas_company.Pipeline
WHERE CapacityBbl = 100000;

-- 5. Invoices with status 'Open'
SELECT InvoiceID, CustomerID, InvoiceDate, AmountDue FROM oil_n_gas_company.Invoice
WHERE Status = 'Open';

-- 6. Shipments for product 'Diesel'
SELECT s.ShipmentID, s.ShipDate, s.Volume_bbl
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product p ON p.ProductID = s.ProductID
WHERE p.Name = 'Diesel';

-- 7. Facilities exactly of type 'Refinery'
SELECT FacilityID, Name FROM oil_n_gas_company.Facility
WHERE FacilityType = 'Refinery';

-- 8. Sales contracts that end today
SELECT ContractID, CustomerID, EndDate
FROM oil_n_gas_company.SalesContract
WHERE EndDate = @Today;

-- 9. Drilling operations currently 'Active'
SELECT OperationID, WellID FROM oil_n_gas_company.DrillingOperation
WHERE Status = 'Active';

-- 10. Products named 'Gasoline'
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name = 'Gasoline';
```

## Inequality Operator (<>)
```sql
-- 1. Regions not in USA
SELECT RegionID, Name, Country FROM oil_n_gas_company.Region
WHERE Country <> 'USA';

-- 2. Wells not of type 'Injector'
SELECT WellID, Name, WellType FROM oil_n_gas_company.Well
WHERE WellType <> 'Injector';

-- 3. Fields not 'Inactive'
SELECT FieldID, Name, Status FROM oil_n_gas_company.Field
WHERE Status <> 'Inactive';

-- 4. Invoices not 'Open'
SELECT InvoiceID, Status, AmountDue FROM oil_n_gas_company.Invoice
WHERE Status <> 'Open';

-- 5. Shipments whose rate is not 0
SELECT ShipmentID, RatePerBbl FROM oil_n_gas_company.Shipment
WHERE RatePerBbl <> 0;

-- 6. Facilities not of type 'Terminal'
SELECT FacilityID, Name, FacilityType FROM oil_n_gas_company.Facility
WHERE FacilityType <> 'Terminal';

-- 7. Drilling operations not completed
SELECT OperationID, Status FROM oil_n_gas_company.DrillingOperation
WHERE Status <> 'Completed';

-- 8. Products not named like crude blends (exact name compare)
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name <> 'Crude Blend A' AND Name <> 'Crude Blend B';

-- 9. Customers whose city is not 'City0'
SELECT c.CustomerID, c.Name, a.City
FROM oil_n_gas_company.Customer c
LEFT JOIN oil_n_gas_company.Address a ON a.AddressID = c.AddressID
WHERE a.City <> 'City0';

-- 10. Production rows where Oil_bbl not equal to 0
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE Oil_bbl <> 0;
```

## IN Operator
```sql
-- 1. Facilities of selected types
SELECT FacilityID, Name, FacilityType FROM oil_n_gas_company.Facility
WHERE FacilityType IN ('Refinery','Terminal','Storage');

-- 2. Wells with selected statuses
SELECT WellID, Name, Status FROM oil_n_gas_company.Well
WHERE Status IN ('Producing','Drilling');

-- 3. Regions in selected countries
SELECT RegionID, Name, Country FROM oil_n_gas_company.Region
WHERE Country IN ('India','Norway','Brazil');

-- 4. Products of key list
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name IN ('Gasoline','Diesel','Jet Fuel');

-- 5. Fields discovered in specific years
SELECT FieldID, Name, DiscoveryDate FROM oil_n_gas_company.Field
WHERE YEAR(DiscoveryDate) IN (2023,2024,2025);

-- 6. Invoices with statuses of interest
SELECT InvoiceID, Status, AmountDue FROM oil_n_gas_company.Invoice
WHERE Status IN ('Open','Paid','Partially Paid');

-- 7. Shipments for products in crude family (via subquery)
SELECT s.ShipmentID, s.ProductID, s.Volume_bbl
FROM oil_n_gas_company.Shipment s
WHERE s.ProductID IN (
  SELECT ProductID FROM oil_n_gas_company.Product
  WHERE Name IN ('Crude Blend A','Crude Blend B','Condensate')
);

-- 8. Pipeline flows for selected pipeline IDs
SELECT PipelineID, FlowDate, Volume_bbl
FROM oil_n_gas_company.PipelineFlow
WHERE PipelineID IN (1,2,3,4,5);

-- 9. Customers in selected states
SELECT c.CustomerID, c.Name, a.State
FROM oil_n_gas_company.Customer c
JOIN oil_n_gas_company.Address a ON a.AddressID = c.AddressID
WHERE a.State IN ('State1','State2','State3');

-- 10. Maintenance events for asset types of interest
SELECT MaintenanceID, AssetType, AssetID, MaintDate
FROM oil_n_gas_company.AssetMaintenance
WHERE AssetType IN ('Well','Pipeline','Facility');
```

## NOT IN Operator
```sql
-- 1. Regions not in North America (example countries)
SELECT RegionID, Name, Country FROM oil_n_gas_company.Region
WHERE Country NOT IN ('USA','Canada');

-- 2. Wells not in 'Producing' or 'Drilling'
SELECT WellID, Name, Status FROM oil_n_gas_company.Well
WHERE Status NOT IN ('Producing','Drilling');

-- 3. Products not among road fuels
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name NOT IN ('Gasoline','Diesel','Jet Fuel');

-- 4. Facilities not of selected types
SELECT FacilityID, Name, FacilityType FROM oil_n_gas_company.Facility
WHERE FacilityType NOT IN ('Refinery','Terminal');

-- 5. Shipments not for crude family
SELECT s.ShipmentID, s.ProductID, s.Volume_bbl
FROM oil_n_gas_company.Shipment s
WHERE s.ProductID NOT IN (
  SELECT ProductID FROM oil_n_gas_company.Product
  WHERE Name IN ('Crude Blend A','Crude Blend B','Condensate')
);

-- 6. Customers not from specific cities
SELECT c.CustomerID, c.Name, a.City
FROM oil_n_gas_company.Customer c
JOIN oil_n_gas_company.Address a ON a.AddressID = c.AddressID
WHERE a.City NOT IN ('City1','City2','City3');

-- 7. Pipelines not in given list
SELECT PipelineID, Name FROM oil_n_gas_company.Pipeline
WHERE PipelineID NOT IN (10,20,30);

-- 8. Invoices not in 'Open' or 'Paid'
SELECT InvoiceID, Status FROM oil_n_gas_company.Invoice
WHERE Status NOT IN ('Open','Paid');

-- 9. Maintenance events not for wells
SELECT MaintenanceID, AssetType FROM oil_n_gas_company.AssetMaintenance
WHERE AssetType NOT IN ('Well');

-- 10. Fields not discovered in the last 3 years (year-based)
SELECT FieldID, Name, DiscoveryDate FROM oil_n_gas_company.Field
WHERE YEAR(DiscoveryDate) NOT IN (YEAR(@Today), YEAR(@Today)-1, YEAR(@Today)-2);
```

## LIKE Operator
```sql
-- 1. Regions whose names start with 'Reg'
SELECT RegionID, Name FROM oil_n_gas_company.Region
WHERE Name LIKE 'Reg%';

-- 2. Facilities in locations starting with 'Area-1'
SELECT FacilityID, Name, Location FROM oil_n_gas_company.Facility
WHERE Location LIKE 'Area-1%';

-- 3. Customers whose names end with '007'
SELECT CustomerID, Name FROM oil_n_gas_company.Customer
WHERE Name LIKE '%007';

-- 4. Products containing 'Crude'
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name LIKE '%Crude%';

-- 5. Address ZIPs starting with '12'
SELECT AddressID, ZIP FROM oil_n_gas_company.Address
WHERE ZIP LIKE '12%';

-- 6. Pipeline names with a hyphen-number pattern
SELECT PipelineID, Name FROM oil_n_gas_company.Pipeline
WHERE Name LIKE 'Pipeline-%';

-- 7. Field names with two digits at the end
SELECT FieldID, Name FROM oil_n_gas_company.Field
WHERE Name LIKE '%[0-9][0-9]';

-- 8. Wells with 'Well-1%' prefix
SELECT WellID, Name FROM oil_n_gas_company.Well
WHERE Name LIKE 'Well-1%';

-- 9. Facilities labelled 'Refinery' inside name string
SELECT FacilityID, Name FROM oil_n_gas_company.Facility
WHERE Name LIKE '%Refinery%';

-- 10. City names containing 'City1'
SELECT AddressID, City FROM oil_n_gas_company.Address
WHERE City LIKE '%City1%';
```

## NOT LIKE Operator
```sql
-- 1. Regions not starting with 'Region-1'
SELECT RegionID, Name FROM oil_n_gas_company.Region
WHERE Name NOT LIKE 'Region-1%';

-- 2. Facilities whose location does not include 'Area-'
SELECT FacilityID, Name, Location FROM oil_n_gas_company.Facility
WHERE Location NOT LIKE 'Area-%' OR Location IS NULL;

-- 3. Customers not ending with '000'
SELECT CustomerID, Name FROM oil_n_gas_company.Customer
WHERE Name NOT LIKE '%000';

-- 4. Products not containing 'Crude'
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name NOT LIKE '%Crude%';

-- 5. Addresses where City not matching 'City1%'
SELECT AddressID, City FROM oil_n_gas_company.Address
WHERE City NOT LIKE 'City1%';

-- 6. Wells whose name not starting with 'Well-9'
SELECT WellID, Name FROM oil_n_gas_company.Well
WHERE Name NOT LIKE 'Well-9%';

-- 7. Pipelines not named 'Pipeline-%5' (ending with 5)
SELECT PipelineID, Name FROM oil_n_gas_company.Pipeline
WHERE Name NOT LIKE 'Pipeline-%5';

-- 8. Fields not containing hyphen (unlikely; for pattern demo)
SELECT FieldID, Name FROM oil_n_gas_company.Field
WHERE Name NOT LIKE '%-%';

-- 9. Facilities whose type does not contain 'or' (string demo)
SELECT FacilityID, FacilityType FROM oil_n_gas_company.Facility
WHERE FacilityType NOT LIKE '%or%';

-- 10. Products not starting with 'G'
SELECT ProductID, Name FROM oil_n_gas_company.Product
WHERE Name NOT LIKE 'G%';
```

## BETWEEN Operator
```sql
-- 1. Production rows in July 2025
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE ProductionDate BETWEEN @RefStart AND @RefEnd;

-- 2. Shipments in last 30 days
SELECT ShipmentID, ShipDate, Volume_bbl
FROM oil_n_gas_company.Shipment
WHERE ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today;

-- 3. Pipeline flows in the last week
SELECT PipelineID, FlowDate, Volume_bbl
FROM oil_n_gas_company.PipelineFlow
WHERE FlowDate BETWEEN DATEADD(DAY, -7, @Today) AND @Today;

-- 4. Invoices billed in July 2025
SELECT InvoiceID, InvoiceDate, AmountDue
FROM oil_n_gas_company.Invoice
WHERE InvoiceDate BETWEEN @RefStart AND @RefEnd;

-- 5. Payments posted in Q3 2025
SELECT PaymentID, PaymentDate, AmountPaid
FROM oil_n_gas_company.Payment
WHERE PaymentDate BETWEEN '2025-07-01' AND '2025-09-30';

-- 6. Drilling operations starting this year
SELECT OperationID, StartDate
FROM oil_n_gas_company.DrillingOperation
WHERE StartDate BETWEEN '2025-01-01' AND '2025-12-31T23:59:59.9999999';

-- 7. Facilities created in the last 90 days
SELECT FacilityID, CreatedAt
FROM oil_n_gas_company.Facility
WHERE CAST(CreatedAt AS date) BETWEEN DATEADD(DAY, -90, @Today) AND @Today;

-- 8. Products with APIGravity between 35 and 45
SELECT ProductID, Name, APIGravity
FROM oil_n_gas_company.Product
WHERE APIGravity BETWEEN 35 AND 45;

-- 9. Shipments with rate between $50 and $70
SELECT ShipmentID, RatePerBbl
FROM oil_n_gas_company.Shipment
WHERE RatePerBbl BETWEEN 50 AND 70;

-- 10. Inventory snapshots across last 5 days
SELECT FacilityID, SnapshotDate, Quantity_bbl
FROM oil_n_gas_company.Inventory
WHERE SnapshotDate BETWEEN DATEADD(DAY, -5, @Today) AND @Today;
```

## Greater Than (>)
```sql
-- 1. Pipelines over 100k bbl/d capacity
SELECT PipelineID, Name, CapacityBbl FROM oil_n_gas_company.Pipeline
WHERE CapacityBbl > 100000;

-- 2. Shipments with volume > 500 bbl
SELECT ShipmentID, Volume_bbl FROM oil_n_gas_company.Shipment
WHERE Volume_bbl > 500;

-- 3. Shipments with rate > $70/bbl
SELECT ShipmentID, RatePerBbl FROM oil_n_gas_company.Shipment
WHERE RatePerBbl > 70;

-- 4. Invoices with AmountDue > $250k
SELECT InvoiceID, AmountDue FROM oil_n_gas_company.Invoice
WHERE AmountDue > 250000;

-- 5. Production oil > 150 bbl/day
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE Oil_bbl > 150;

-- 6. Gas production > 1000 mcf/day
SELECT WellID, ProductionDate, Gas_mcf
FROM oil_n_gas_company.Production
WHERE Gas_mcf > 1000;

-- 7. Maintenance costs > $10k
SELECT MaintenanceID, AssetType, CostUSD
FROM oil_n_gas_company.AssetMaintenance
WHERE CostUSD > 10000;

-- 8. Payments > $100k
SELECT PaymentID, AmountPaid FROM oil_n_gas_company.Payment
WHERE AmountPaid > 100000;

-- 9. Inventory quantity > 75,000 bbl
SELECT FacilityID, SnapshotDate, Quantity_bbl
FROM oil_n_gas_company.Inventory
WHERE Quantity_bbl > 75000;

-- 10. Drilling ops lasting > 60 days
SELECT OperationID, DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) AS Days
FROM oil_n_gas_company.DrillingOperation
WHERE DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) > 60;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Wells spudded on/after 2020-01-01
SELECT WellID, Name, SpudDate FROM oil_n_gas_company.Well
WHERE SpudDate >= '2020-01-01';

-- 2. Pipelines capacity ≥ 200k bbl/d
SELECT PipelineID, Name, CapacityBbl FROM oil_n_gas_company.Pipeline
WHERE CapacityBbl >= 200000;

-- 3. Rate per bbl ≥ $60
SELECT ShipmentID, RatePerBbl FROM oil_n_gas_company.Shipment
WHERE RatePerBbl >= 60;

-- 4. AmountDue ≥ $1M
SELECT InvoiceID, AmountDue FROM oil_n_gas_company.Invoice
WHERE AmountDue >= 1000000;

-- 5. Oil ≥ 100 bbl/day
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE Oil_bbl >= 100;

-- 6. Gas ≥ 500 mcf/day
SELECT WellID, ProductionDate, Gas_mcf
FROM oil_n_gas_company.Production
WHERE Gas_mcf >= 500;

-- 7. Maintenance cost ≥ $50k
SELECT MaintenanceID, CostUSD FROM oil_n_gas_company.AssetMaintenance
WHERE CostUSD >= 50000;

-- 8. Payments ≥ $250k
SELECT PaymentID, AmountPaid FROM oil_n_gas_company.Payment
WHERE AmountPaid >= 250000;

-- 9. Inventory ≥ 20k bbl
SELECT FacilityID, SnapshotDate, Quantity_bbl
FROM oil_n_gas_company.Inventory
WHERE Quantity_bbl >= 20000;

-- 10. Contracts starting this year or later
SELECT ContractID, StartDate FROM oil_n_gas_company.SalesContract
WHERE StartDate >= '2025-01-01';
```

## Less Than (<)
```sql
-- 1. Pipelines under 50k bbl/d capacity
SELECT PipelineID, Name, CapacityBbl FROM oil_n_gas_company.Pipeline
WHERE CapacityBbl < 50000;

-- 2. Shipments volume < 200 bbl
SELECT ShipmentID, Volume_bbl FROM oil_n_gas_company.Shipment
WHERE Volume_bbl < 200;

-- 3. Rate per bbl < $45
SELECT ShipmentID, RatePerBbl FROM oil_n_gas_company.Shipment
WHERE RatePerBbl < 45;

-- 4. AmountDue < $10k
SELECT InvoiceID, AmountDue FROM oil_n_gas_company.Invoice
WHERE AmountDue < 10000;

-- 5. Oil < 25 bbl/day
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE Oil_bbl < 25;

-- 6. Gas < 100 mcf/day
SELECT WellID, ProductionDate, Gas_mcf
FROM oil_n_gas_company.Production
WHERE Gas_mcf < 100;

-- 7. Maintenance cost < $1,000
SELECT MaintenanceID, CostUSD FROM oil_n_gas_company.AssetMaintenance
WHERE CostUSD < 1000;

-- 8. Inventory < 5k bbl
SELECT FacilityID, SnapshotDate, Quantity_bbl
FROM oil_n_gas_company.Inventory
WHERE Quantity_bbl < 5000;

-- 9. Contracts shorter than 30 days (when EndDate present)
SELECT ContractID, StartDate, EndDate
FROM oil_n_gas_company.SalesContract
WHERE EndDate IS NOT NULL AND DATEDIFF(DAY, StartDate, EndDate) < 30;

-- 10. Drilling ops shorter than 7 days
SELECT OperationID, StartDate, EndDate
FROM oil_n_gas_company.DrillingOperation
WHERE DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) < 7;
```

## Less Than or Equal To (<=)
```sql
-- 1. Pipelines capacity ≤ 75k bbl/d
SELECT PipelineID, Name, CapacityBbl FROM oil_n_gas_company.Pipeline
WHERE CapacityBbl <= 75000;

-- 2. Shipments volume ≤ 150 bbl
SELECT ShipmentID, Volume_bbl FROM oil_n_gas_company.Shipment
WHERE Volume_bbl <= 150;

-- 3. Rate per bbl ≤ $55
SELECT ShipmentID, RatePerBbl FROM oil_n_gas_company.Shipment
WHERE RatePerBbl <= 55;

-- 4. AmountDue ≤ $1k
SELECT InvoiceID, AmountDue FROM oil_n_gas_company.Invoice
WHERE AmountDue <= 1000;

-- 5. Oil ≤ 40 bbl/day
SELECT WellID, ProductionDate, Oil_bbl
FROM oil_n_gas_company.Production
WHERE Oil_bbl <= 40;

-- 6. Gas ≤ 300 mcf/day
SELECT WellID, ProductionDate, Gas_mcf
FROM oil_n_gas_company.Production
WHERE Gas_mcf <= 300;

-- 7. Maintenance cost ≤ $2,500
SELECT MaintenanceID, CostUSD FROM oil_n_gas_company.AssetMaintenance
WHERE CostUSD <= 2500;

-- 8. Inventory ≤ 10k bbl
SELECT FacilityID, SnapshotDate, Quantity_bbl
FROM oil_n_gas_company.Inventory
WHERE Quantity_bbl <= 10000;

-- 9. Contracts ending on/before @Today
SELECT ContractID, EndDate FROM oil_n_gas_company.SalesContract
WHERE EndDate IS NOT NULL AND EndDate <= @Today;

-- 10. Drilling ops lasting ≤ 3 days
SELECT OperationID, StartDate, EndDate
FROM oil_n_gas_company.DrillingOperation
WHERE DATEDIFF(DAY, StartDate, COALESCE(EndDate, @Today)) <= 3;
```

## EXISTS Operator
```sql
-- 1. Fields that have at least one producing well
SELECT f.FieldID, f.Name
FROM oil_n_gas_company.Field f
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.Well w
  WHERE w.FieldID = f.FieldID AND w.Status = 'Producing'
);

-- 2. Wells that have production in July
SELECT w.WellID, w.Name
FROM oil_n_gas_company.Well w
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.Production p
  WHERE p.WellID = w.WellID AND p.ProductionDate BETWEEN @RefStart AND @RefEnd
);

-- 3. Customers who have shipments in the last 30 days
SELECT c.CustomerID, c.Name
FROM oil_n_gas_company.Customer c
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.Shipment s
  WHERE s.ToCustomer = c.CustomerID
    AND s.ShipDate BETWEEN DATEADD(DAY, -30, @Today) AND @Today
);

-- 4. Pipelines that recorded flow yesterday
SELECT pl.PipelineID, pl.Name
FROM oil_n_gas_company.Pipeline pl
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.PipelineFlow pf
  WHERE pf.PipelineID = pl.PipelineID AND pf.FlowDate = DATEADD(DAY, -1, @Today)
);

-- 5. Invoices that have at least one payment
SELECT i.InvoiceID, i.InvoiceDate
FROM oil_n_gas_company.Invoice i
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.Payment p
  WHERE p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
);

-- 6. Facilities that shipped anything in July
SELECT f.FacilityID, f.Name
FROM oil_n_gas_company.Facility f
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.Shipment s
  WHERE s.FromFacility = f.FacilityID
    AND s.ShipDate BETWEEN @RefStart AND @RefEnd
);

-- 7. Products that appear in any sales contract
SELECT pr.ProductID, pr.Name
FROM oil_n_gas_company.Product pr
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.SalesContract sc
  WHERE sc.ProductID = pr.ProductID
);

-- 8. Regions that contain at least one inactive field
SELECT r.RegionID, r.Name
FROM oil_n_gas_company.Region r
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.Field f
  WHERE f.RegionID = r.RegionID AND f.Status = 'Inactive'
);

-- 9. Wells that ever had a drilling operation
SELECT w.WellID, w.Name
FROM oil_n_gas_company.Well w
WHERE EXISTS (
  SELECT 1 FROM oil_n_gas_company.DrillingOperation d
  WHERE d.WellID = w.WellID
);

-- 10. Assets that had maintenance in the last 90 days (by type/id)
SELECT DISTINCT am.AssetType, am.AssetID
FROM oil_n_gas_company.AssetMaintenance am
WHERE EXISTS (
  SELECT 1
  FROM oil_n_gas_company.AssetMaintenance am2
  WHERE am2.AssetType = am.AssetType
    AND am2.AssetID   = am.AssetID
    AND am2.MaintDate >= DATEADD(DAY, -90, @Today)
);
```

## NOT EXISTS Operator
```sql
-- 1. Fields with no wells
SELECT f.FieldID, f.Name
FROM oil_n_gas_company.Field f
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Well w WHERE w.FieldID = f.FieldID
);

-- 2. Wells with no production in July
SELECT w.WellID, w.Name
FROM oil_n_gas_company.Well w
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Production p
  WHERE p.WellID = w.WellID AND p.ProductionDate BETWEEN @RefStart AND @RefEnd
);

-- 3. Customers with no shipments in last 60 days
SELECT c.CustomerID, c.Name
FROM oil_n_gas_company.Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Shipment s
  WHERE s.ToCustomer = c.CustomerID
    AND s.ShipDate BETWEEN DATEADD(DAY, -60, @Today) AND @Today
);

-- 4. Pipelines with no flow in last 14 days
SELECT pl.PipelineID, pl.Name
FROM oil_n_gas_company.Pipeline pl
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.PipelineFlow pf
  WHERE pf.PipelineID = pl.PipelineID
    AND pf.FlowDate BETWEEN DATEADD(DAY, -14, @Today) AND @Today
);

-- 5. Invoices that have received no payments
SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM oil_n_gas_company.Invoice i
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Payment p
  WHERE p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
);

-- 6. Facilities with no inventory snapshots in last 10 days
SELECT f.FacilityID, f.Name
FROM oil_n_gas_company.Facility f
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Inventory i
  WHERE i.FacilityID = f.FacilityID
    AND i.SnapshotDate BETWEEN DATEADD(DAY, -10, @Today) AND @Today
);

-- 7. Products never shipped (ever)
SELECT pr.ProductID, pr.Name
FROM oil_n_gas_company.Product pr
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Shipment s
  WHERE s.ProductID = pr.ProductID
);

-- 8. Regions with no inactive fields
SELECT r.RegionID, r.Name
FROM oil_n_gas_company.Region r
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Field f
  WHERE f.RegionID = r.RegionID AND f.Status = 'Inactive'
);

-- 9. Wells without any drilling operation
SELECT w.WellID, w.Name
FROM oil_n_gas_company.Well w
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.DrillingOperation d
  WHERE d.WellID = w.WellID
);

-- 10. Customers without open invoices
SELECT c.CustomerID, c.Name
FROM oil_n_gas_company.Customer c
WHERE NOT EXISTS (
  SELECT 1 FROM oil_n_gas_company.Invoice i
  WHERE i.CustomerID = c.CustomerID AND i.Status = 'Open'
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
