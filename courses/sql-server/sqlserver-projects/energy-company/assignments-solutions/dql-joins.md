![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Inner Join
```sql
-- 1. Customers with their address details
SELECT c.CustomerID, c.FirstName, c.LastName, a.City, a.State, a.Country
FROM energy_company.Customer c
INNER JOIN energy_company.Address a
  ON a.AddressID = c.AddressID;

-- 2. Facilities with their department names
SELECT f.FacilityID, f.Name AS Facility, d.Name AS Department
FROM energy_company.Facility f
INNER JOIN energy_company.Department d
  ON d.DepartmentID = f.DepartmentID;

-- 3. Assets with facility and asset type
SELECT a.AssetID, a.Name AS Asset, f.Name AS Facility, t.Name AS AssetType
FROM energy_company.Asset a
INNER JOIN energy_company.Facility f  ON f.FacilityID  = a.FacilityID
INNER JOIN energy_company.AssetType t ON t.AssetTypeID = a.AssetTypeID;

-- 4. Energy production on @RefDate with asset names
SELECT ep.AssetID, a.Name AS Asset, ep.ProductionDate, ep.EnergyMWh
FROM energy_company.EnergyProduction ep
INNER JOIN energy_company.Asset a ON a.AssetID = ep.AssetID
WHERE ep.ProductionDate = @RefDate;

-- 5. July 2025 meter readings with customer names (via Meter)
SELECT mr.MeterID, c.CustomerID, c.FirstName, c.LastName, mr.ReadDate, mr.Consumption_kWh
FROM energy_company.MeterReading mr
INNER JOIN energy_company.Meter m ON m.MeterID = mr.MeterID
INNER JOIN energy_company.Customer c ON c.CustomerID = m.CustomerID
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 6. Energy sales with customer and rate plan (2025)
SELECT es.SaleID, es.SaleDate, c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer,
       rp.Name AS RatePlan, es.kWhSold, es.TotalCharge
FROM energy_company.EnergySale es
INNER JOIN energy_company.Customer c  ON c.CustomerID  = es.CustomerID
INNER JOIN energy_company.RatePlan rp ON rp.RatePlanID = es.RatePlanID
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 7. Invoices joined to their originating sales (composite join)
SELECT i.InvoiceID, i.InvoiceDate, es.SaleID, es.SaleDate, i.AmountDue
FROM energy_company.Invoice i
INNER JOIN energy_company.EnergySale es
  ON es.SaleID = i.SaleID AND es.SaleDate = i.SaleDate;

-- 8. Payments with their invoices (composite join)
SELECT p.PaymentID, p.PaymentDate, i.InvoiceID, i.InvoiceDate, i.AmountDue, p.AmountPaid
FROM energy_company.Payment p
INNER JOIN energy_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate;

-- 9. Asset maintenance with asset & facility info
SELECT am.MaintenanceID, a.AssetID, a.Name AS Asset, f.Name AS Facility,
       am.MaintenanceDate, am.Description, am.CostUSD
FROM energy_company.AssetMaintenance am
INNER JOIN energy_company.Asset a      ON a.AssetID     = am.AssetID
INNER JOIN energy_company.Facility f   ON f.FacilityID  = a.FacilityID;

-- 10. Rate plans effective on a date joined to sales occurring that date range
SELECT DISTINCT rp.RatePlanID, rp.Name
FROM energy_company.RatePlan rp
INNER JOIN energy_company.EnergySale es
  ON es.RatePlanID = rp.RatePlanID
WHERE es.SaleDate BETWEEN '2025-07-01' AND '2025-07-31'
  AND rp.EffectiveDate <= es.SaleDate
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= es.SaleDate);

-- 11. July 2025: customers, their invoices, and any matching payments in July
SELECT c.CustomerID, i.InvoiceID, i.InvoiceDate, i.AmountDue, p.PaymentID, p.PaymentDate, p.AmountPaid
FROM energy_company.Customer c
INNER JOIN energy_company.Invoice i ON i.CustomerID = c.CustomerID
LEFT  JOIN energy_company.Payment p ON p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 12. Assets with their July 2025 total production (grouped)
SELECT a.AssetID, a.Name AS Asset, SUM(ep.EnergyMWh) AS July_TotalMWh
FROM energy_company.Asset a
INNER JOIN energy_company.EnergyProduction ep ON ep.AssetID = a.AssetID
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
GROUP BY a.AssetID, a.Name;
```

## Left Join (Left Outer Join)
```sql
-- 1. All customers with address (customers without address still show)
SELECT c.CustomerID, c.FirstName, c.LastName,
       a.City, a.State, a.Country
FROM energy_company.Customer c
LEFT JOIN energy_company.Address a
  ON a.AddressID = c.AddressID;

-- 2. All facilities with (optional) department
SELECT f.FacilityID, f.Name AS Facility, d.Name AS Department
FROM energy_company.Facility f
LEFT JOIN energy_company.Department d
  ON d.DepartmentID = f.DepartmentID;

-- 3. All assets with (optional) July 2025 production
SELECT a.AssetID, a.Name AS Asset, ep.ProductionDate, ep.EnergyMWh
FROM energy_company.Asset a
LEFT JOIN energy_company.EnergyProduction ep
  ON ep.AssetID = a.AssetID
 AND ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
ORDER BY a.AssetID, ep.ProductionDate;

-- 4. All customers with (optional) July 2025 invoices
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer,
       i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM energy_company.Customer c
LEFT JOIN energy_company.Invoice i
  ON i.CustomerID = c.CustomerID
 AND i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. Rate plans with (optional) 2025 sales counts
SELECT rp.RatePlanID, rp.Name,
       COUNT(es.SaleID) AS Sales2025
FROM energy_company.RatePlan rp
LEFT JOIN energy_company.EnergySale es
  ON es.RatePlanID = rp.RatePlanID
 AND es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY rp.RatePlanID, rp.Name;

-- 6. Invoices with (optional) payments (show payment status)
SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue,
       p.PaymentID, p.PaymentDate, p.AmountPaid,
       CASE WHEN p.PaymentID IS NULL THEN 'Unpaid/No July Payment' ELSE 'Paid (has row)' END AS PaymentStatus
FROM energy_company.Invoice i
LEFT JOIN energy_company.Payment p
  ON p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
 AND p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 7. Meters with (optional) July readings (find meters without readings)
SELECT m.MeterID, m.SerialNumber, mr.ReadDate, mr.Consumption_kWh
FROM energy_company.Meter m
LEFT JOIN energy_company.MeterReading mr
  ON mr.MeterID = m.MeterID
 AND mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
ORDER BY m.MeterID, mr.ReadDate;

-- 8. Active assets with (optional) production in last 90 days (find outages)
SELECT a.AssetID, a.Name AS Asset, ep.ProductionDate, ep.EnergyMWh
FROM energy_company.Asset a
LEFT JOIN energy_company.EnergyProduction ep
  ON ep.AssetID = a.AssetID
 AND ep.ProductionDate BETWEEN DATEADD(DAY,-90,@RefDate) AND @RefDate
WHERE a.Status = 'Active';

-- 9. Facilities with asset counts (0 if none)
SELECT f.FacilityID, f.Name AS Facility, COUNT(a.AssetID) AS AssetCount
FROM energy_company.Facility f
LEFT JOIN energy_company.Asset a
  ON a.FacilityID = f.FacilityID
GROUP BY f.FacilityID, f.Name;

-- 10. Customers with (optional) meters
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer,
       m.MeterID, m.InstallationDate
FROM energy_company.Customer c
LEFT JOIN energy_company.Meter m
  ON m.CustomerID = c.CustomerID;

-- 11. Energy sales with (optional) invoice rows (should match, but demo of LEFT)
SELECT es.SaleID, es.SaleDate, es.TotalCharge, i.InvoiceID, i.InvoiceDate
FROM energy_company.EnergySale es
LEFT JOIN energy_company.Invoice i
  ON i.SaleID = es.SaleID AND i.SaleDate = es.SaleDate;

-- 12. Asset types with (optional) assets (find unused types)
SELECT t.AssetTypeID, t.Name AS AssetType, COUNT(a.AssetID) AS AssetCount
FROM energy_company.AssetType t
LEFT JOIN energy_company.Asset a
  ON a.AssetTypeID = t.AssetTypeID
GROUP BY t.AssetTypeID, t.Name;
```

## Right Join (Right Outer Join)
```sql
-- 1. Departments RIGHT JOIN Facilities (return all facilities)
SELECT d.Name AS Department, f.FacilityID, f.Name AS Facility
FROM energy_company.Department d
RIGHT JOIN energy_company.Facility f
  ON f.DepartmentID = d.DepartmentID;

-- 2. Addresses RIGHT JOIN Customers (return all customers)
SELECT a.City, a.State, a.Country, c.CustomerID, c.FirstName, c.LastName
FROM energy_company.Address a
RIGHT JOIN energy_company.Customer c
  ON c.AddressID = a.AddressID;

-- 3. Facilities RIGHT JOIN Assets (return all assets)
SELECT f.Name AS Facility, a.AssetID, a.Name AS Asset
FROM energy_company.Facility f
RIGHT JOIN energy_company.Asset a
  ON a.FacilityID = f.FacilityID;

-- 4. Asset types RIGHT JOIN Assets (return all assets)
SELECT t.Name AS AssetType, a.AssetID, a.Name AS Asset
FROM energy_company.AssetType t
RIGHT JOIN energy_company.Asset a
  ON a.AssetTypeID = t.AssetTypeID;

-- 5. Assets RIGHT JOIN EnergyProduction (return all production rows)
SELECT a.Name AS Asset, ep.AssetID, ep.ProductionDate, ep.EnergyMWh
FROM energy_company.Asset a
RIGHT JOIN energy_company.EnergyProduction ep
  ON ep.AssetID = a.AssetID
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 6. Customers RIGHT JOIN Meters (return all meters)
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer, m.MeterID, m.SerialNumber
FROM energy_company.Customer c
RIGHT JOIN energy_company.Meter m
  ON m.CustomerID = c.CustomerID;

-- 7. Meters RIGHT JOIN MeterReading (return all readings)
SELECT m.MeterID, m.SerialNumber, mr.ReadDate, mr.Consumption_kWh
FROM energy_company.Meter m
RIGHT JOIN energy_company.MeterReading mr
  ON mr.MeterID = m.MeterID
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 8. Rate plans RIGHT JOIN EnergySale (return all sales)
SELECT rp.RatePlanID, rp.Name AS RatePlan, es.SaleID, es.SaleDate, es.TotalCharge
FROM energy_company.RatePlan rp
RIGHT JOIN energy_company.EnergySale es
  ON es.RatePlanID = rp.RatePlanID
WHERE YEAR(es.SaleDate) = 2025;

-- 9. EnergySale RIGHT JOIN Invoice (return all invoices)
SELECT es.SaleID, es.SaleDate, i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM energy_company.EnergySale es
RIGHT JOIN energy_company.Invoice i
  ON i.SaleID = es.SaleID AND i.SaleDate = es.SaleDate;

-- 10. Invoice RIGHT JOIN Payment (return all payments)
SELECT i.InvoiceID, i.InvoiceDate, p.PaymentID, p.PaymentDate, p.AmountPaid
FROM energy_company.Invoice i
RIGHT JOIN energy_company.Payment p
  ON p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate;

-- 11. Assets RIGHT JOIN AssetMaintenance (return all maintenance events)
SELECT a.AssetID, a.Name AS Asset, am.MaintenanceID, am.MaintenanceDate, am.CostUSD
FROM energy_company.Asset a
RIGHT JOIN energy_company.AssetMaintenance am
  ON am.AssetID = a.AssetID;

-- 12. Department RIGHT JOIN Facility (filter Zone-3; all facilities in Zone-3)
SELECT d.Name AS Department, f.FacilityID, f.Name AS Facility, f.Location
FROM energy_company.Department d
RIGHT JOIN energy_company.Facility f
  ON f.DepartmentID = d.DepartmentID
WHERE f.Location LIKE '%Zone-3%';
```

## Full Join (Full Outer Join)
```sql
-- 1. All invoices and all payments (matched where possible)
SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue,
       p.PaymentID, p.PaymentDate, p.AmountPaid
FROM energy_company.Invoice i
FULL OUTER JOIN energy_company.Payment p
  ON p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate;

-- 2. Assets and their production on @RefDate (include assets with none and any stray rows)
SELECT a.AssetID, a.Name AS Asset, ep.ProductionDate, ep.EnergyMWh
FROM energy_company.Asset a
FULL OUTER JOIN energy_company.EnergyProduction ep
  ON ep.AssetID = a.AssetID AND ep.ProductionDate = @RefDate
ORDER BY a.AssetID, ep.ProductionDate;

-- 3. Meters and July 2025 readings (include meters without readings and vice versa)
SELECT m.MeterID, m.SerialNumber, mr.ReadDate, mr.Consumption_kWh
FROM energy_company.Meter m
FULL OUTER JOIN energy_company.MeterReading mr
  ON mr.MeterID = m.MeterID AND mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
ORDER BY COALESCE(m.MeterID, mr.MeterID), mr.ReadDate;

-- 4. Facilities and assets (include facilities without assets and assets with missing facility)
SELECT f.FacilityID, f.Name AS Facility, a.AssetID, a.Name AS Asset
FROM energy_company.Facility f
FULL OUTER JOIN energy_company.Asset a
  ON a.FacilityID = f.FacilityID;

-- 5. Asset types and assets (include unused types)
SELECT t.AssetTypeID, t.Name AS AssetType, a.AssetID, a.Name AS Asset
FROM energy_company.AssetType t
FULL OUTER JOIN energy_company.Asset a
  ON a.AssetTypeID = t.AssetTypeID;

-- 6. Customers and invoices in July (include customers without invoices and invoices without customer rows)
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer,
       i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM energy_company.Customer c
FULL OUTER JOIN energy_company.Invoice i
  ON i.CustomerID = c.CustomerID
 AND i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 7. Departments and facilities in Zone-2 (include depts without zone-2 facs)
SELECT d.DepartmentID, d.Name AS Department, f.FacilityID, f.Name AS Facility, f.Location
FROM energy_company.Department d
FULL OUTER JOIN energy_company.Facility f
  ON f.DepartmentID = d.DepartmentID AND f.Location LIKE '%Zone-2%';

-- 8. Energy sales in July and invoices in July (unions via FULL JOIN)
SELECT es.SaleID, es.SaleDate, i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM energy_company.EnergySale es
FULL OUTER JOIN energy_company.Invoice i
  ON i.SaleID = es.SaleID AND i.SaleDate = es.SaleDate
WHERE (es.SaleDate BETWEEN @RefMonthStart AND @RefMonthEnd)
   OR (i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd);

-- 9. Assets and maintenance in last 180 days (assets without maint and any maint without asset)
SELECT a.AssetID, a.Name AS Asset, am.MaintenanceID, am.MaintenanceDate, am.CostUSD
FROM energy_company.Asset a
FULL OUTER JOIN energy_company.AssetMaintenance am
  ON am.AssetID = a.AssetID
 AND am.MaintenanceDate BETWEEN DATEADD(DAY,-180,@RefDate) AND @RefDate;

-- 10. Customers (USA only) and payments in July (keep all from both sides)
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer,
       p.PaymentID, p.PaymentDate, p.AmountPaid
FROM energy_company.Customer c
JOIN energy_company.Address ad ON ad.AddressID = c.AddressID AND ad.Country = 'USA'
FULL OUTER JOIN energy_company.Payment p
  ON p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
FULL OUTER JOIN energy_company.Invoice i
  ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
 AND i.CustomerID = c.CustomerID;

-- 11. Production dates and maintenance dates (calendar match/mismatch)
SELECT ep.ProductionDate AS ProdDate, am.MaintenanceDate AS MaintDate
FROM (SELECT DISTINCT ProductionDate FROM energy_company.EnergyProduction) ep
FULL OUTER JOIN (SELECT DISTINCT MaintenanceDate FROM energy_company.AssetMaintenance) am
  ON am.MaintenanceDate = ep.ProductionDate
ORDER BY COALESCE(ep.ProductionDate, am.MaintenanceDate);

-- 12. Rate plans effective in July and sales in July (include plans with no sales and sales with no effective plan match)
SELECT rp.RatePlanID, rp.Name AS RatePlan, es.SaleID, es.SaleDate, es.TotalCharge
FROM energy_company.RatePlan rp
FULL OUTER JOIN energy_company.EnergySale es
  ON es.RatePlanID = rp.RatePlanID
 AND es.SaleDate BETWEEN @RefMonthStart AND @RefMonthEnd
WHERE rp.EffectiveDate <= '2025-07-31'
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-07-01')
   OR es.SaleID IS NOT NULL;
```

## Cross Join
```sql
-- 1. Matrix of Departments × Zones (1..5) to plan coverage
WITH Z AS (
  SELECT 1 AS ZoneNum UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
)
SELECT d.Name AS Department, CONCAT('Zone-', z.ZoneNum) AS Zone
FROM energy_company.Department d
CROSS JOIN Z z
ORDER BY d.Name, z.ZoneNum;

-- 2. Asset types × Departments (theoretical responsibility matrix)
SELECT t.Name AS AssetType, d.Name AS Department
FROM energy_company.AssetType t
CROSS JOIN energy_company.Department d
ORDER BY t.Name, d.Name;

-- 3. Distinct Cities × Distinct Rate Plans (market-plan combinations)
SELECT a.City, rp.Name AS RatePlan
FROM (SELECT DISTINCT City FROM energy_company.Address) a
CROSS JOIN energy_company.RatePlan rp
ORDER BY a.City, rp.Name;

-- 4. Facilities × July weeks (week buckets 1–4)
WITH W(WeekBucket) AS (
  SELECT 'Week1' UNION ALL SELECT 'Week2' UNION ALL SELECT 'Week3' UNION ALL SELECT 'Week4'
)
SELECT f.Name AS Facility, W.WeekBucket
FROM energy_company.Facility f
CROSS JOIN W
ORDER BY f.Name, W.WeekBucket;

-- 5. Asset × small set of target thresholds (for reporting bins)
WITH T(ThresholdMWh) AS (
  SELECT 50 UNION ALL SELECT 100 UNION ALL SELECT 200
)
SELECT a.AssetID, a.Name AS Asset, T.ThresholdMWh
FROM energy_company.Asset a
CROSS JOIN T
ORDER BY a.AssetID, T.ThresholdMWh;

-- 6. Distinct States × MeterType (coverage map)
SELECT s.State, mt.MeterType
FROM (SELECT DISTINCT State FROM energy_company.Address) s
CROSS JOIN (SELECT DISTINCT MeterType FROM energy_company.Meter) mt
ORDER BY s.State, mt.MeterType;

-- 7. Rate plans × Months (H1 2025)
WITH M(MonthEnd) AS (
  SELECT EOMONTH('2025-01-01') UNION ALL SELECT EOMONTH('2025-02-01')
  UNION ALL SELECT EOMONTH('2025-03-01') UNION ALL SELECT EOMONTH('2025-04-01')
  UNION ALL SELECT EOMONTH('2025-05-01') UNION ALL SELECT EOMONTH('2025-06-01')
)
SELECT rp.Name AS RatePlan, M.MonthEnd
FROM energy_company.RatePlan rp
CROSS JOIN M
ORDER BY rp.Name, M.MonthEnd;

-- 8. Customers × a tiny label set (tagging scaffold)
WITH L(Label) AS (SELECT 'VIP' UNION ALL SELECT 'Watch' UNION ALL SELECT 'New')
SELECT TOP (100) c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer, L.Label
FROM energy_company.Customer c
CROSS JOIN L
ORDER BY c.CustomerID, L.Label;

-- 9. Facility × AssetType (potential suitability grid)
SELECT f.Name AS Facility, t.Name AS AssetType
FROM energy_company.Facility f
CROSS JOIN energy_company.AssetType t
ORDER BY f.Name, t.Name;

-- 10. Distinct Cities × July/H2 flags (simple time buckets)
WITH TB(TimeBucket) AS (SELECT 'July-2025' UNION ALL SELECT 'H2-2025')
SELECT a.City, TB.TimeBucket
FROM (SELECT DISTINCT City FROM energy_company.Address) a
CROSS JOIN TB
ORDER BY a.City, TB.TimeBucket;

-- 11. Tiny numbers table × sample to build day offsets (0..6)
WITH N(n) AS (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6)
SELECT a.AssetID, a.Name AS Asset, DATEADD(DAY, n.n, '2025-07-01') AS SampleDate
FROM energy_company.Asset a
CROSS JOIN N
ORDER BY a.AssetID, SampleDate;

-- 12. Distinct States × PaymentMethod (method availability by state)
SELECT s.State, pm.PaymentMethod
FROM (SELECT DISTINCT State FROM energy_company.Address) s
CROSS JOIN (SELECT DISTINCT PaymentMethod FROM energy_company.Payment) pm
ORDER BY s.State, pm.PaymentMethod;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
