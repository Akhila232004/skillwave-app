![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Union
```sql
-- 1. Customers with invoices in July 2025 OR payments in July 2025 (all such customers)
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
UNION
SELECT DISTINCT i2.CustomerID
FROM energy_company.Payment p
JOIN energy_company.Invoice i2
  ON i2.InvoiceID = p.InvoiceID AND i2.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 2. AssetIDs that EITHER produced energy in July 2025 OR had maintenance in July 2025
SELECT DISTINCT ep.AssetID
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
UNION
SELECT DISTINCT am.AssetID
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 3. Facilities that have assets OR are referenced via any asset maintenance record
SELECT DISTINCT a.FacilityID
FROM energy_company.Asset a
UNION
SELECT DISTINCT f.FacilityID
FROM energy_company.AssetMaintenance am
JOIN energy_company.Asset a2 ON a2.AssetID = am.AssetID
JOIN energy_company.Facility f ON f.FacilityID = a2.FacilityID;

-- 4. Meters that had readings in July 2025 OR were installed in July 2025
SELECT DISTINCT mr.MeterID
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
UNION
SELECT m.MeterID
FROM energy_company.Meter m
WHERE m.InstallationDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. Customers with open invoices OR any overdue invoices as of @RefDate
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.Status = 'Open'
UNION
SELECT DISTINCT i2.CustomerID
FROM energy_company.Invoice i2
WHERE i2.DueDate < @RefDate;

-- 6. RatePlanIDs that are either effective on 2025-07-01 OR used in any 2025 sale
SELECT rp.RatePlanID
FROM energy_company.RatePlan rp
WHERE rp.EffectiveDate <= '2025-07-01'
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-07-01')
UNION
SELECT DISTINCT es.RatePlanID
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 7. Cities with at least one customer OR at least one customer payment in July 2025
SELECT DISTINCT a.City
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
UNION
SELECT DISTINCT a2.City
FROM energy_company.Payment p
JOIN energy_company.Invoice i ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
JOIN energy_company.Customer c2 ON c2.CustomerID = i.CustomerID
JOIN energy_company.Address a2 ON a2.AddressID = c2.AddressID
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 8. CustomerIDs who bought energy in 2025 H1 OR 2025 H2
SELECT DISTINCT es.CustomerID
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-06-30'
UNION
SELECT DISTINCT es2.CustomerID
FROM energy_company.EnergySale es2
WHERE es2.SaleDate BETWEEN '2025-07-01' AND '2025-12-31';

-- 9. Production dates seen in first half of July 2025 OR second half of July 2025
SELECT DISTINCT ep.ProductionDate
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN '2025-07-01' AND '2025-07-15'
UNION
SELECT DISTINCT ep2.ProductionDate
FROM energy_company.EnergyProduction ep2
WHERE ep2.ProductionDate BETWEEN '2025-07-16' AND '2025-07-31'
ORDER BY ProductionDate;

-- 10. AssetIDs belonging to Wind/Solar categories OR Battery Storage
SELECT DISTINCT a.AssetID
FROM energy_company.Asset a
JOIN energy_company.AssetType t ON t.AssetTypeID = a.AssetTypeID
WHERE t.Name IN (N'Wind Turbine', N'Solar PV Array')
UNION
SELECT DISTINCT a2.AssetID
FROM energy_company.Asset a2
JOIN energy_company.AssetType t2 ON t2.AssetTypeID = a2.AssetTypeID
WHERE t2.Name = N'Battery Storage';

-- 11. Meters with extreme readings (very high OR very low) in July 2025
SELECT DISTINCT mr.MeterID
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND mr.Consumption_kWh > 900
UNION
SELECT DISTINCT mr2.MeterID
FROM energy_company.MeterReading mr2
WHERE mr2.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  AND mr2.Consumption_kWh < 100;

-- 12. UNION vs UNION ALL — Customers from City1* combined with City2*
--     (a) Using UNION removes dups, (b) Using UNION ALL preserves dups
-- (a)
SELECT c.CustomerID
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.City LIKE 'City1%'
UNION
SELECT c2.CustomerID
FROM energy_company.Customer c2
JOIN energy_company.Address a2 ON a2.AddressID = c2.AddressID
WHERE a2.City LIKE 'City2%';

-- (b)
SELECT c.CustomerID
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.City LIKE 'City1%'
UNION ALL
SELECT c2.CustomerID
FROM energy_company.Customer c2
JOIN energy_company.Address a2 ON a2.AddressID = c2.AddressID
WHERE a2.City LIKE 'City2%';
```

## Intersect
```sql
-- 1. Customers who had BOTH invoices in July 2025 AND payments in July 2025
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
INTERSECT
SELECT DISTINCT i2.CustomerID
FROM energy_company.Payment p
JOIN energy_company.Invoice i2
  ON i2.InvoiceID = p.InvoiceID AND i2.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 2. Assets that BOTH produced energy in the last 90 days AND had maintenance in the last 90 days
SELECT DISTINCT ep.AssetID
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-90,@RefDate) AND @RefDate
INTERSECT
SELECT DISTINCT am.AssetID
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN DATEADD(DAY,-90,@RefDate) AND @RefDate;

-- 3. Facilities that BOTH have at least one asset in 'Maintenance' status AND at least one maintenance record
SELECT DISTINCT a.FacilityID
FROM energy_company.Asset a
WHERE a.Status = 'Maintenance'
INTERSECT
SELECT DISTINCT f.FacilityID
FROM energy_company.AssetMaintenance am
JOIN energy_company.Asset a2 ON a2.AssetID = am.AssetID
JOIN energy_company.Facility f ON f.FacilityID = a2.FacilityID;

-- 4. Meters with readings in BOTH June 2025 AND July 2025
SELECT DISTINCT mr.MeterID
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN '2025-06-01' AND '2025-06-30'
INTERSECT
SELECT DISTINCT mr2.MeterID
FROM energy_company.MeterReading mr2
WHERE mr2.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 5. Customers who had invoices in July AND also had energy sales in July
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
INTERSECT
SELECT DISTINCT es.CustomerID
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 6. Assets that produced energy on BOTH @RefDate AND the previous day
SELECT ep.AssetID
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate = @RefDate
INTERSECT
SELECT ep2.AssetID
FROM energy_company.EnergyProduction ep2
WHERE ep2.ProductionDate = DATEADD(DAY,-1,@RefDate);

-- 7. Rate plans effective on BOTH 2025-06-30 AND 2025-07-01 (plans spanning boundary)
SELECT rp.RatePlanID
FROM energy_company.RatePlan rp
WHERE rp.EffectiveDate <= '2025-06-30'
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-06-30')
INTERSECT
SELECT rp2.RatePlanID
FROM energy_company.RatePlan rp2
WHERE rp2.EffectiveDate <= '2025-07-01'
  AND (rp2.ExpirationDate IS NULL OR rp2.ExpirationDate >= '2025-07-01');

-- 8. Customers living in City starting with 'City1' AND having at least one open invoice
SELECT DISTINCT c.CustomerID
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.City LIKE 'City1%'
INTERSECT
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.Status = 'Open';

-- 9. Assets that are Active AND have CapacityMW > 300
SELECT a.AssetID
FROM energy_company.Asset a
WHERE a.Status = 'Active'
INTERSECT
SELECT a2.AssetID
FROM energy_company.Asset a2
WHERE a2.CapacityMW > 300;

-- 10. Meters installed before 2025-01-01 AND having July 2025 readings
SELECT m.MeterID
FROM energy_company.Meter m
WHERE m.InstallationDate < '2025-01-01'
INTERSECT
SELECT mr.MeterID
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 11. CustomerIDs that appear in both the top 20 unpaid (open invoices) AND have payments in the last 30 days
SELECT TOP (20) WITH TIES i.CustomerID
FROM energy_company.Invoice i
WHERE i.Status = 'Open'
GROUP BY i.CustomerID
ORDER BY SUM(i.AmountDue) DESC
INTERSECT
SELECT DISTINCT i2.CustomerID
FROM energy_company.Payment p
JOIN energy_company.Invoice i2
  ON i2.InvoiceID = p.InvoiceID AND i2.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate;

-- 12. Days that are BOTH invoice dates AND payment dates in July 2025
SELECT DISTINCT i.InvoiceDate
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
INTERSECT
SELECT DISTINCT p.PaymentDate
FROM energy_company.Payment p
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
ORDER BY InvoiceDate;
```

## Except
```sql
-- 1. Customers with invoices in July 2025 BUT NO payments in July 2025
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
EXCEPT
SELECT DISTINCT i2.CustomerID
FROM energy_company.Payment p
JOIN energy_company.Invoice i2
  ON i2.InvoiceID = p.InvoiceID AND i2.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 2. Meters having July 2025 readings BUT NO readings before July 2025
SELECT DISTINCT mr.MeterID
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
EXCEPT
SELECT DISTINCT mr2.MeterID
FROM energy_company.MeterReading mr2
WHERE mr2.ReadDate < @RefMonthStart;

-- 3. Assets with production in July 2025 BUT NO maintenance in the last year
SELECT DISTINCT ep.AssetID
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
EXCEPT
SELECT DISTINCT am.AssetID
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN DATEADD(YEAR,-1,@RefDate) AND @RefDate;

-- 4. Facilities that have assets BUT are NOT in the IT department
SELECT DISTINCT a.FacilityID
FROM energy_company.Asset a
EXCEPT
SELECT f.FacilityID
FROM energy_company.Facility f
JOIN energy_company.Department d ON d.DepartmentID = f.DepartmentID
WHERE d.Name = N'IT';

-- 5. Rate plans used in 2025 sales BUT NOT effective on 2025-07-01 (e.g., expired H1 plans)
SELECT DISTINCT es.RatePlanID
FROM energy_company.EnergySale es
WHERE es.SaleDate BETWEEN '2025-01-01' AND '2025-12-31'
EXCEPT
SELECT rp.RatePlanID
FROM energy_company.RatePlan rp
WHERE rp.EffectiveDate <= '2025-07-01'
  AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-07-01');

-- 6. USA customers BUT with NO invoices ever (potentially unbilled)
SELECT DISTINCT c.CustomerID
FROM energy_company.Customer c
JOIN energy_company.Address a ON a.AddressID = c.AddressID
WHERE a.Country = 'USA'
EXCEPT
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i;

-- 7. Active assets BUT with NO production in the last 90 days (possible outage)
SELECT a.AssetID
FROM energy_company.Asset a
WHERE a.Status = 'Active'
EXCEPT
SELECT DISTINCT ep.AssetID
FROM energy_company.EnergyProduction ep
WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-90,@RefDate) AND @RefDate;

-- 8. July invoices BUT NOT paid in July (still open or paid later)
SELECT DISTINCT i.InvoiceID
FROM energy_company.Invoice i
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
EXCEPT
SELECT DISTINCT p.InvoiceID
FROM energy_company.Payment p
WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 9. Assets in 'Maintenance' status BUT with NO maintenance record in the last 180 days
SELECT a.AssetID
FROM energy_company.Asset a
WHERE a.Status = 'Maintenance'
EXCEPT
SELECT DISTINCT am.AssetID
FROM energy_company.AssetMaintenance am
WHERE am.MaintenanceDate BETWEEN DATEADD(DAY,-180,@RefDate) AND @RefDate;

-- 10. Meters installed before 2025-01-01 BUT with NO July 2025 reading
SELECT m.MeterID
FROM energy_company.Meter m
WHERE m.InstallationDate < '2025-01-01'
EXCEPT
SELECT DISTINCT mr.MeterID
FROM energy_company.MeterReading mr
WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 11. For a chosen asset (e.g., AssetID = 1), days with production EXCEPT days with low output (<100 MWh)
--     Result = days where production was >= 100 MWh
SELECT ep.ProductionDate
FROM energy_company.EnergyProduction ep
WHERE ep.AssetID = 1
EXCEPT
SELECT ep2.ProductionDate
FROM energy_company.EnergyProduction ep2
WHERE ep2.AssetID = 1
  AND ep2.EnergyMWh < 100;

-- 12. Customers with open invoices (as of @RefDate) EXCEPT those with any payment in the last 30 days
SELECT DISTINCT i.CustomerID
FROM energy_company.Invoice i
WHERE i.Status = 'Open'
EXCEPT
SELECT DISTINCT i2.CustomerID
FROM energy_company.Payment p
JOIN energy_company.Invoice i2
  ON i2.InvoiceID = p.InvoiceID AND i2.InvoiceDate = p.InvoiceDate
WHERE p.PaymentDate BETWEEN DATEADD(DAY,-30,@RefDate) AND @RefDate;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
