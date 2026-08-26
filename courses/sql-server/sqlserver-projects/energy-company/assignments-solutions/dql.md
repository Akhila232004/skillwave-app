![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial

##### [Back To Contents](./README.md)
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions
* To make date-based tasks reproducible, we’ll use a fixed reference date(Changeable as needed).
```sql
DECLARE @RefDate date = '2025-07-31';
```

## Select
```sql
-- 1. List all customers (basic projection).
SELECT CustomerID, FirstName, LastName, Email, Phone, AddressID, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy
FROM energy_company.Customer;

-- 2. Distinct list of countries in the Address table.
SELECT DISTINCT Country
FROM energy_company.Address;

-- 3. Show customer full name as one column.
SELECT CustomerID,
       CONCAT(FirstName, ' ', LastName) AS FullName
FROM energy_company.Customer;

-- 4. Build a single-line mailing address string.
SELECT AddressID,
       CONCAT(Street, ', ', City, ', ', State, ' ', ZIP, ', ', Country) AS AddressLine
FROM energy_company.Address;

-- 5. Show assets with days in service as of @RefDate.
SELECT AssetID, Name, Status, CommissionDate,
       DATEDIFF(DAY, CommissionDate, @RefDate) AS DaysInService
FROM energy_company.Asset;

-- 6. EnergyProduction in both MWh and kWh (computed column).
SELECT ProductionID, AssetID, ProductionDate, EnergyMWh,
       CAST(EnergyMWh * 1000.0 AS DECIMAL(18,2)) AS Energy_kWh
FROM energy_company.EnergyProduction;

-- 7. Label asset status using CASE.
SELECT AssetID, Name, Status,
       CASE Status
         WHEN 'Active'       THEN 'In Service'
         WHEN 'Maintenance'  THEN 'Temporarily Down'
         WHEN 'Retired'      THEN 'Out of Service'
         ELSE 'Unknown'
       END AS StatusLabel
FROM energy_company.Asset;

-- 8. Replace NULL emails with a placeholder.
SELECT CustomerID, COALESCE(Email, '[no-email]') AS Email
FROM energy_company.Customer;

-- 9. Present rate plans as a display string.
SELECT RatePlanID,
       CONCAT(Name, ' @ $', CAST(PricePerkWh AS varchar(20)), '/kWh') AS PlanDisplay
FROM energy_company.RatePlan;

-- 10. Meter label showing serial, type, and install date (YYYY-MM-DD).
SELECT MeterID,
       CONCAT(SerialNumber, ' - ', COALESCE(MeterType, 'Unknown'),
              ' (', CONVERT(varchar(10), InstallationDate, 120), ')') AS MeterLabel
FROM energy_company.Meter;

-- 11. Show invoice “days overdue” relative to @RefDate (negative = not yet due).
SELECT InvoiceID, CustomerID, InvoiceDate, DueDate, AmountDue, Status,
       DATEDIFF(DAY, DueDate, @RefDate) AS DaysOverdue
FROM energy_company.Invoice;

-- 12. Distinct list of meter types.
SELECT DISTINCT MeterType
FROM energy_company.Meter;
```

## WHERE
```sql
-- 1. Customers with missing email.
SELECT CustomerID, FirstName, LastName
FROM energy_company.Customer
WHERE Email IS NULL;

-- 2. Facilities that belong to the 'Maintenance' department.
SELECT f.FacilityID, f.Name
FROM energy_company.Facility AS f
JOIN energy_company.Department AS d
  ON f.DepartmentID = d.DepartmentID
WHERE d.Name = N'Maintenance';

-- 3. Active assets commissioned after 2022-01-01.
SELECT AssetID, Name, CommissionDate
FROM energy_company.Asset
WHERE Status = 'Active'
  AND CommissionDate > '2022-01-01';

-- 4. Meter readings recorded in July 2025.
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN '2025-07-01' AND '2025-07-31';

-- 5. Energy production for a given set of assets.
SELECT AssetID, ProductionDate, EnergyMWh
FROM energy_company.EnergyProduction
WHERE AssetID IN (1, 2, 3);

-- 6. Rate plans effective on 2025-07-15.
SELECT RatePlanID, Name, EffectiveDate, ExpirationDate
FROM energy_company.RatePlan
WHERE EffectiveDate <= '2025-07-15'
  AND (ExpirationDate IS NULL OR ExpirationDate >= '2025-07-15');

-- 7. Overdue open invoices as of @RefDate.
SELECT InvoiceID, CustomerID, AmountDue, DueDate
FROM energy_company.Invoice
WHERE Status = 'Open'
  AND DueDate < @RefDate;

-- 8. Payments made via ACH or Card.
SELECT PaymentID, PaymentDate, AmountPaid, PaymentMethod
FROM energy_company.Payment
WHERE PaymentMethod IN ('ACH','Card');

-- 9. Meters with serial numbers starting with 'SN0001'.
SELECT MeterID, SerialNumber
FROM energy_company.Meter
WHERE SerialNumber LIKE 'SN0001%';

-- 10. Customers who live in City='City10' and Country='USA'.
SELECT c.CustomerID, c.FirstName, c.LastName
FROM energy_company.Customer AS c
JOIN energy_company.Address  AS a
  ON c.AddressID = a.AddressID
WHERE a.City = 'City10'
  AND a.Country = 'USA';

-- 11. Energy sales with kWhSold between 500 and 1000 in 2025.
SELECT SaleID, CustomerID, SaleDate, kWhSold, TotalCharge
FROM energy_company.EnergySale
WHERE SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
  AND kWhSold BETWEEN 500 AND 1000;

-- 12. Maintenance events costing > $500 in the last 90 days from @RefDate.
SELECT MaintenanceID, AssetID, MaintenanceDate, Description, CostUSD
FROM energy_company.AssetMaintenance
WHERE CostUSD > 500
  AND MaintenanceDate BETWEEN DATEADD(DAY, -90, @RefDate) AND @RefDate;
```

## GROUP BY
```sql
-- 1. Count facilities per department.
SELECT d.Name AS Department, COUNT(*) AS FacilityCount
FROM energy_company.Facility AS f
JOIN energy_company.Department AS d
  ON f.DepartmentID = d.DepartmentID
GROUP BY d.Name;

-- 2. Asset counts by facility and status.
SELECT f.Name AS Facility, a.Status, COUNT(*) AS AssetCount
FROM energy_company.Asset AS a
JOIN energy_company.Facility AS f
  ON a.FacilityID = f.FacilityID
GROUP BY f.Name, a.Status;

-- 3. Total MWh per asset in July 2025.
SELECT AssetID,
       YEAR(ProductionDate)  AS Yr,
       MONTH(ProductionDate) AS Mo,
       SUM(EnergyMWh)        AS TotalMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY AssetID, YEAR(ProductionDate), MONTH(ProductionDate);

-- 4. Average daily consumption per meter in July 2025.
SELECT MeterID, AVG(Consumption_kWh) AS AvgDaily_kWh
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY MeterID;

-- 5. Total revenue per customer (all time).
SELECT CustomerID, SUM(TotalCharge) AS Revenue
FROM energy_company.EnergySale
GROUP BY CustomerID;

-- 6. 2025 revenue per rate plan.
SELECT RatePlanID, SUM(TotalCharge) AS Revenue2025
FROM energy_company.EnergySale
WHERE SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY RatePlanID;

-- 7. Number of invoices by status.
SELECT Status, COUNT(*) AS InvoiceCount
FROM energy_company.Invoice
GROUP BY Status;

-- 8. Payment totals per method by month in 2025.
SELECT PaymentMethod,
       YEAR(PaymentDate)  AS Yr,
       MONTH(PaymentDate) AS Mo,
       SUM(AmountPaid)    AS TotalPaid
FROM energy_company.Payment
WHERE PaymentDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY PaymentMethod, YEAR(PaymentDate), MONTH(PaymentDate);

-- 9. Maintenance cost per asset and type (last 180 days).
SELECT AssetID, Description, SUM(CostUSD) AS TotalCost
FROM energy_company.AssetMaintenance
WHERE MaintenanceDate BETWEEN DATEADD(DAY, -180, @RefDate) AND @RefDate
GROUP BY AssetID, Description;

-- 10. Customer count by state.
SELECT a.State, COUNT(*) AS CustomerCount
FROM energy_company.Customer AS c
JOIN energy_company.Address  AS a
  ON c.AddressID = a.AddressID
GROUP BY a.State;

-- 11. Meter counts by type and status.
SELECT MeterType, Status, COUNT(*) AS MeterCount
FROM energy_company.Meter
GROUP BY MeterType, Status;

-- 12. Peak (max) daily production per asset in July 2025.
SELECT AssetID, MAX(EnergyMWh) AS PeakDailyMWh
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY AssetID;
```

## HAVING
```sql
-- 1. Departments with at least 3 facilities.
SELECT d.Name AS Department, COUNT(*) AS FacilityCount
FROM energy_company.Facility AS f
JOIN energy_company.Department AS d
  ON f.DepartmentID = d.DepartmentID
GROUP BY d.Name
HAVING COUNT(*) >= 3;

-- 2. Facilities that host more than 5 assets.
SELECT f.FacilityID, f.Name, COUNT(*) AS AssetCount
FROM energy_company.Asset AS a
JOIN energy_company.Facility AS f
  ON a.FacilityID = f.FacilityID
GROUP BY f.FacilityID, f.Name
HAVING COUNT(*) > 5;

-- 3. Assets with > 10,000 MWh total in the last 90 days of @RefDate.
SELECT AssetID, SUM(EnergyMWh) AS TotalMWh_90d
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN DATEADD(DAY, -90, @RefDate) AND @RefDate
GROUP BY AssetID
HAVING SUM(EnergyMWh) > 10000;

-- 4. Customers with > 3000 kWh sold in the last 6 months.
SELECT CustomerID, SUM(kWhSold) AS kWh_6mo
FROM energy_company.EnergySale
WHERE SaleDate BETWEEN DATEADD(MONTH, -6, @RefDate) AND @RefDate
GROUP BY CustomerID
HAVING SUM(kWhSold) > 3000;

-- 5. Customers with more than 2 open invoices.
SELECT CustomerID, COUNT(*) AS OpenInvoices
FROM energy_company.Invoice
WHERE Status = 'Open'
GROUP BY CustomerID
HAVING COUNT(*) > 2;

-- 6. Meters whose average daily consumption in July 2025 > 800 kWh.
SELECT MeterID, AVG(Consumption_kWh) AS AvgDailyJuly
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY MeterID
HAVING AVG(Consumption_kWh) > 800;

-- 7. Rate plans used in at least 100 sales (all time).
SELECT RatePlanID, COUNT(*) AS SaleCount
FROM energy_company.EnergySale
GROUP BY RatePlanID
HAVING COUNT(*) >= 100;

-- 8. Assets with maintenance cost sum > $5,000 in the last year.
SELECT AssetID, SUM(CostUSD) AS Cost1Y
FROM energy_company.AssetMaintenance
WHERE MaintenanceDate BETWEEN DATEADD(YEAR, -1, @RefDate) AND @RefDate
GROUP BY AssetID
HAVING SUM(CostUSD) > 5000;

-- 9. States with customer count between 10 and 30.
SELECT a.State, COUNT(*) AS CustomerCount
FROM energy_company.Customer AS c
JOIN energy_company.Address  AS a
  ON c.AddressID = a.AddressID
GROUP BY a.State
HAVING COUNT(*) BETWEEN 10 AND 30;

-- 10. Production days where the grid produced > 10,000 MWh.
SELECT ProductionDate, SUM(EnergyMWh) AS GridMWh
FROM energy_company.EnergyProduction
GROUP BY ProductionDate
HAVING SUM(EnergyMWh) > 10000;

-- 11. Customers with July 2025 invoices but NO payments in July 2025.
SELECT i.CustomerID, COUNT(*) AS JulyInvoices, SUM(i.AmountDue) AS JulyAmountDue
FROM energy_company.Invoice AS i
LEFT JOIN energy_company.Payment AS p
  ON p.InvoiceID = i.InvoiceID
 AND p.InvoiceDate = i.InvoiceDate
 AND p.PaymentDate BETWEEN '2025-07-01' AND '2025-07-31'
WHERE i.InvoiceDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY i.CustomerID
HAVING SUM(CASE WHEN p.PaymentID IS NOT NULL THEN 1 ELSE 0 END) = 0;

-- 12. Assets with production reported on at least 80 of the last 90 days.
SELECT AssetID, COUNT(DISTINCT ProductionDate) AS DaysReported
FROM energy_company.EnergyProduction
WHERE ProductionDate BETWEEN DATEADD(DAY, -90, @RefDate) AND @RefDate
GROUP BY AssetID
HAVING COUNT(DISTINCT ProductionDate) >= 80;
```

## ORDER BY
```sql
-- 1. Customers ordered by LastName, FirstName.
SELECT CustomerID, LastName, FirstName, Email
FROM energy_company.Customer
ORDER BY LastName, FirstName;

-- 2. Facilities ordered by Department then Facility name.
SELECT f.FacilityID, f.Name AS Facility, d.Name AS Department
FROM energy_company.Facility AS f
LEFT JOIN energy_company.Department AS d
  ON f.DepartmentID = d.DepartmentID
ORDER BY d.Name, f.Name;

-- 3. Assets ordered by Status, then newest CommissionDate first.
SELECT AssetID, Name, Status, CommissionDate
FROM energy_company.Asset
ORDER BY Status, CommissionDate DESC;

-- 4. Invoices ordered by highest AmountDue first.
SELECT InvoiceID, CustomerID, InvoiceDate, AmountDue
FROM energy_company.Invoice
ORDER BY AmountDue DESC;

-- 5. EnergyProduction ordered by most recent date and then largest MWh.
SELECT ProductionDate, AssetID, EnergyMWh
FROM energy_company.EnergyProduction
ORDER BY ProductionDate DESC, EnergyMWh DESC;

-- 6. Meter readings ordered by MeterID, then date ascending.
SELECT MeterID, ReadDate, Consumption_kWh
FROM energy_company.MeterReading
ORDER BY MeterID, ReadDate;

-- 7. Rate plans ordered by most recent EffectiveDate, then Name.
SELECT RatePlanID, Name, EffectiveDate, ExpirationDate
FROM energy_company.RatePlan
ORDER BY EffectiveDate DESC, Name;

-- 8. Payments ordered by latest PaymentDate.
SELECT PaymentID, InvoiceID, PaymentDate, AmountPaid, PaymentMethod
FROM energy_company.Payment
ORDER BY PaymentDate DESC;

-- 9. Maintenance events ordered by highest cost first.
SELECT MaintenanceID, AssetID, MaintenanceDate, CostUSD
FROM energy_company.AssetMaintenance
ORDER BY CostUSD DESC;

-- 10. Energy sales ordered by largest TotalCharge, then by latest SaleDate.
SELECT SaleID, CustomerID, SaleDate, TotalCharge
FROM energy_company.EnergySale
ORDER BY TotalCharge DESC, SaleDate DESC;

-- 11. Customers ordered by City then LastName.
SELECT c.CustomerID, a.City, c.LastName, c.FirstName
FROM energy_company.Customer AS c
JOIN energy_company.Address  AS a
  ON c.AddressID = a.AddressID
ORDER BY a.City, c.LastName;

-- 12. Assets ordered by Facility name then Asset name.
SELECT a.AssetID, f.Name AS Facility, a.Name AS Asset
FROM energy_company.Asset AS a
JOIN energy_company.Facility AS f
  ON a.FacilityID = f.FacilityID
ORDER BY f.Name, a.Name;
```

## TOP
```sql
-- 1. Top 10 customers by total revenue (WITH TIES).
SELECT TOP (10) WITH TIES
       c.CustomerID,
       CONCAT(c.FirstName, ' ', c.LastName) AS Customer,
       SUM(es.TotalCharge) AS Revenue
FROM energy_company.EnergySale AS es
JOIN energy_company.Customer  AS c
  ON es.CustomerID = c.CustomerID
GROUP BY c.CustomerID, c.FirstName, c.LastName
ORDER BY Revenue DESC;

-- 2. Top 5 assets by total production in the last 30 days of @RefDate.
SELECT TOP (5)
       a.AssetID, a.Name,
       SUM(ep.EnergyMWh) AS MWh_30d
FROM energy_company.EnergyProduction AS ep
JOIN energy_company.Asset            AS a
  ON ep.AssetID = a.AssetID
WHERE ep.ProductionDate BETWEEN DATEADD(DAY, -30, @RefDate) AND @RefDate
GROUP BY a.AssetID, a.Name
ORDER BY MWh_30d DESC;

-- 3. Top 10 invoices by AmountDue (WITH TIES).
SELECT TOP (10) WITH TIES
       InvoiceID, CustomerID, InvoiceDate, AmountDue
FROM energy_company.Invoice
ORDER BY AmountDue DESC;

-- 4. Top 3 departments by asset count.
SELECT TOP (3)
       d.Name AS Department,
       COUNT(*) AS AssetCount
FROM energy_company.Asset AS a
JOIN energy_company.Facility AS f
  ON a.FacilityID = f.FacilityID
JOIN energy_company.Department AS d
  ON f.DepartmentID = d.DepartmentID
GROUP BY d.Name
ORDER BY AssetCount DESC;

-- 5. Top 1 rate plan by 2025 revenue (WITH TIES).
SELECT TOP (1) WITH TIES
       rp.RatePlanID, rp.Name,
       SUM(es.TotalCharge) AS Revenue2025
FROM energy_company.EnergySale AS es
JOIN energy_company.RatePlan   AS rp
  ON es.RatePlanID = rp.RatePlanID
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY rp.RatePlanID, rp.Name
ORDER BY Revenue2025 DESC;

-- 6. Top 10 meters by average daily consumption in July 2025.
SELECT TOP (10)
       mr.MeterID,
       AVG(mr.Consumption_kWh) AS AvgDailyJuly
FROM energy_company.MeterReading AS mr
WHERE mr.ReadDate BETWEEN '2025-07-01' AND '2025-07-31'
GROUP BY mr.MeterID
ORDER BY AvgDailyJuly DESC;

-- 7. Top 20 customers by unpaid amount (sum of open invoices).
SELECT TOP (20)
       c.CustomerID,
       CONCAT(c.FirstName, ' ', c.LastName) AS Customer,
       SUM(i.AmountDue) AS UnpaidTotal
FROM energy_company.Invoice AS i
JOIN energy_company.Customer AS c
  ON i.CustomerID = c.CustomerID
WHERE i.Status = 'Open'
GROUP BY c.CustomerID, c.FirstName, c.LastName
ORDER BY UnpaidTotal DESC;

-- 8. Top 10 production days by total grid MWh.
SELECT TOP (10)
       ProductionDate,
       SUM(EnergyMWh) AS GridMWh
FROM energy_company.EnergyProduction
GROUP BY ProductionDate
ORDER BY GridMWh DESC;

-- 9. Top 5 facilities by number of assets.
SELECT TOP (5)
       f.FacilityID, f.Name,
       COUNT(*) AS AssetCount
FROM energy_company.Asset AS a
JOIN energy_company.Facility AS f
  ON a.FacilityID = f.FacilityID
GROUP BY f.FacilityID, f.Name
ORDER BY AssetCount DESC;

-- 10. Top 10 customers by number of invoices.
SELECT TOP (10)
       c.CustomerID,
       CONCAT(c.FirstName, ' ', c.LastName) AS Customer,
       COUNT(*) AS InvoiceCount
FROM energy_company.Invoice AS i
JOIN energy_company.Customer AS c
  ON i.CustomerID = c.CustomerID
GROUP BY c.CustomerID, c.FirstName, c.LastName
ORDER BY InvoiceCount DESC;

-- 11. Top 10 assets by maintenance cost in the last year.
SELECT TOP (10)
       a.AssetID, a.Name,
       SUM(am.CostUSD) AS Cost1Y
FROM energy_company.AssetMaintenance AS am
JOIN energy_company.Asset            AS a
  ON am.AssetID = a.AssetID
WHERE am.MaintenanceDate BETWEEN DATEADD(YEAR, -1, @RefDate) AND @RefDate
GROUP BY a.AssetID, a.Name
ORDER BY Cost1Y DESC;

-- 12. Top 10 cities by customer count (WITH TIES).
SELECT TOP (10) WITH TIES
       a.City,
       COUNT(*) AS CustomerCount
FROM energy_company.Customer AS c
JOIN energy_company.Address  AS a
  ON c.AddressID = a.AddressID
GROUP BY a.City
ORDER BY CustomerCount DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
