![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Union
```sql
-- 1. Wells that are Producing OR Drilling
SELECT WellID, Name, Status
FROM   oil_n_gas_company.Well
WHERE  Status = 'Producing'
UNION
SELECT WellID, Name, Status
FROM   oil_n_gas_company.Well
WHERE  Status = 'Drilling'
ORDER BY WellID;

-- 2. Shipments either in July 2025 OR in last 7 days
SELECT ShipmentID, ShipDate, ToCustomer
FROM   oil_n_gas_company.Shipment
WHERE  ShipDate BETWEEN @RefStart AND @RefEnd
UNION
SELECT ShipmentID, ShipDate, ToCustomer
FROM   oil_n_gas_company.Shipment
WHERE  ShipDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY ShipDate DESC, ShipmentID DESC;

-- 3. Customers with shipments (last 30d) OR invoices (last 30d)
SELECT DISTINCT ToCustomer AS CustomerID
FROM   oil_n_gas_company.Shipment
WHERE  ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
UNION
SELECT DISTINCT CustomerID
FROM   oil_n_gas_company.Invoice
WHERE  InvoiceDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
ORDER BY CustomerID;

-- 4. Products that appear either in Shipments OR in Inventory (any time)
SELECT ProductID, CAST('Shipment' AS nvarchar(20)) AS Source
FROM   oil_n_gas_company.Shipment
UNION
SELECT ProductID, 'Inventory'
FROM   oil_n_gas_company.Inventory
ORDER BY ProductID, Source;

-- 5. Facilities that are pipeline endpoints OR shipment origins
SELECT FromFacility AS FacilityID
FROM   oil_n_gas_company.Pipeline
UNION
SELECT ToFacility
FROM   oil_n_gas_company.Pipeline
UNION
SELECT FromFacility
FROM   oil_n_gas_company.Shipment
ORDER BY FacilityID;

-- 6. Regions having fields discovered in 2025 OR 2024
SELECT DISTINCT r.RegionID, r.Name AS RegionName, 2025 AS DiscYear
FROM   oil_n_gas_company.Region r
JOIN   oil_n_gas_company.Field  f ON f.RegionID = r.RegionID
WHERE  YEAR(f.DiscoveryDate) = 2025
UNION
SELECT DISTINCT r.RegionID, r.Name, 2024
FROM   oil_n_gas_company.Region r
JOIN   oil_n_gas_company.Field  f ON f.RegionID = r.RegionID
WHERE  YEAR(f.DiscoveryDate) = 2024
ORDER BY RegionID, DiscYear DESC;

-- 7. Calendar days with either production OR pipeline flow (last 7 days)
SELECT DISTINCT ProductionDate AS DayD
FROM   oil_n_gas_company.Production
WHERE  ProductionDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
UNION
SELECT DISTINCT FlowDate
FROM   oil_n_gas_company.PipelineFlow
WHERE  FlowDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY DayD DESC;

-- 8. Invoices that are Open OR Partially Paid (union of filters)
SELECT InvoiceID, InvoiceDate, CustomerID, AmountDue, Status
FROM   oil_n_gas_company.Invoice
WHERE  Status = 'Open'
UNION
SELECT InvoiceID, InvoiceDate, CustomerID, AmountDue, Status
FROM   oil_n_gas_company.Invoice
WHERE  Status = 'Partially Paid'
ORDER BY AmountDue DESC;

-- 9. Union ALL (stack measures): last 7d daily Oil and Gas totals
SELECT CAST('Oil' AS nvarchar(10)) AS Measure, ProductionDate AS D,
       CAST(SUM(Oil_bbl) AS decimal(18,2)) AS Val
FROM   oil_n_gas_company.Production
WHERE  ProductionDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
GROUP BY ProductionDate
UNION ALL
SELECT 'Gas', ProductionDate,
       CAST(SUM(Gas_mcf) AS decimal(18,2))
FROM   oil_n_gas_company.Production
WHERE  ProductionDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
GROUP BY ProductionDate
ORDER BY D DESC, Measure;

-- 10. Unified cashflow view: Shipment revenue + Payments (last 14d)
SELECT CAST('ShipmentRevenue' AS nvarchar(20)) AS TxType,
       ShipDate AS TxDate,
       CAST(Volume_bbl * RatePerBbl AS decimal(18,2)) AS AmountUSD
FROM   oil_n_gas_company.Shipment
WHERE  ShipDate BETWEEN DATEADD(DAY,-14,@Today) AND @Today
UNION ALL
SELECT 'Payment', PaymentDate, CAST(AmountPaid AS decimal(18,2))
FROM   oil_n_gas_company.Payment
WHERE  PaymentDate BETWEEN DATEADD(DAY,-14,@Today) AND @Today
ORDER BY TxDate DESC, TxType;

-- 11. Wells seen in either DrillingOperation OR Production (last 30d)
SELECT DISTINCT WellID
FROM   oil_n_gas_company.DrillingOperation
WHERE  StartDate >= DATEADD(DAY,-30,CAST(@Today AS datetime2))
UNION
SELECT DISTINCT WellID
FROM   oil_n_gas_company.Production
WHERE  ProductionDate >= DATEADD(DAY,-30,@Today)
ORDER BY WellID;

-- 12. Names from Facilities and Customers as a single catalog
SELECT Name, CAST('Facility' AS nvarchar(10)) AS Entity
FROM   oil_n_gas_company.Facility
UNION
SELECT Name, 'Customer'
FROM   oil_n_gas_company.Customer
ORDER BY Entity, Name;
```

## Intersect
```sql
-- 1. Wells that are Producing AND have July production
SELECT w.WellID
FROM   oil_n_gas_company.Well w
WHERE  w.Status = 'Producing'
INTERSECT
SELECT DISTINCT p.WellID
FROM   oil_n_gas_company.Production p
WHERE  p.ProductionDate BETWEEN @RefStart AND @RefEnd
ORDER BY WellID;

-- 2. Customers with shipments (30d) AND open invoices
SELECT DISTINCT s.ToCustomer
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
INTERSECT
SELECT i.CustomerID
FROM   oil_n_gas_company.Invoice i
WHERE  i.Status = 'Open'
ORDER BY ToCustomer;

-- 3. Products present both in Inventory (last 7d) AND Shipments (last 7d)
SELECT DISTINCT i.ProductID
FROM   oil_n_gas_company.Inventory i
WHERE  i.SnapshotDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
INTERSECT
SELECT DISTINCT s.ProductID
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY ProductID;

-- 4. Facilities that are pipeline endpoints AND have inventory snapshots (5d)
SELECT FromFacility
FROM   oil_n_gas_company.Pipeline
INTERSECT
SELECT DISTINCT FacilityID
FROM   oil_n_gas_company.Inventory
WHERE  SnapshotDate BETWEEN DATEADD(DAY,-5,@Today) AND @Today
UNION
SELECT ToFacility
FROM   oil_n_gas_company.Pipeline
INTERSECT
SELECT DISTINCT FacilityID
FROM   oil_n_gas_company.Inventory
WHERE  SnapshotDate BETWEEN DATEADD(DAY,-5,@Today) AND @Today;

-- 5. Dates that have BOTH production and pipeline flow (last 7d)
SELECT DISTINCT ProductionDate
FROM   oil_n_gas_company.Production
WHERE  ProductionDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
INTERSECT
SELECT DISTINCT FlowDate
FROM   oil_n_gas_company.PipelineFlow
WHERE  FlowDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY ProductionDate DESC;

-- 6. Pipelines with flow last 7d AND capacity ≥ 200k bbl/d
SELECT DISTINCT pf.PipelineID
FROM   oil_n_gas_company.PipelineFlow pf
WHERE  pf.FlowDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
INTERSECT
SELECT pl.PipelineID
FROM   oil_n_gas_company.Pipeline pl
WHERE  pl.CapacityBbl >= 200000;

-- 7. Wells with any drilling op AND currently Producing
SELECT DISTINCT d.WellID
FROM   oil_n_gas_company.DrillingOperation d
INTERSECT
SELECT w.WellID
FROM   oil_n_gas_company.Well w
WHERE  w.Status = 'Producing';

-- 8. Customers with active contracts today AND shipments in last 60d
SELECT DISTINCT sc.CustomerID
FROM   oil_n_gas_company.SalesContract sc
WHERE  sc.StartDate <= @Today AND (sc.EndDate IS NULL OR sc.EndDate >= @Today)
INTERSECT
SELECT DISTINCT s.ToCustomer
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-60,@Today) AND @Today
ORDER BY CustomerID;

-- 9. Regions that have inactive fields AND producing wells
SELECT DISTINCT r.RegionID
FROM   oil_n_gas_company.Region r
JOIN   oil_n_gas_company.Field  f ON f.RegionID = r.RegionID
WHERE  f.Status = 'Inactive'
INTERSECT
SELECT DISTINCT r2.RegionID
FROM   oil_n_gas_company.Region r2
JOIN   oil_n_gas_company.Field  f2 ON f2.RegionID = r2.RegionID
JOIN   oil_n_gas_company.Well   w  ON w.FieldID    = f2.FieldID
WHERE  w.Status = 'Producing'
ORDER BY RegionID;

-- 10. Invoices in July that ALSO have payments (match by (InvoiceID,Date))
SELECT i.InvoiceID, i.InvoiceDate
FROM   oil_n_gas_company.Invoice i
WHERE  i.InvoiceDate BETWEEN @RefStart AND @RefEnd
INTERSECT
SELECT DISTINCT p.InvoiceID, p.InvoiceDate
FROM   oil_n_gas_company.Payment p
ORDER BY InvoiceDate DESC, InvoiceID;

-- 11. Products appearing BOTH in SalesContract AND in Shipments (90d window)
SELECT DISTINCT sc.ProductID
FROM   oil_n_gas_company.SalesContract sc
INTERSECT
SELECT DISTINCT s.ProductID
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-90,@Today) AND @Today
ORDER BY ProductID;

-- 12. US customers who ALSO shipped in last 30d
SELECT c.CustomerID
FROM   oil_n_gas_company.Customer c
JOIN   oil_n_gas_company.Address  a ON a.AddressID = c.AddressID
WHERE  a.Country = 'USA'
INTERSECT
SELECT DISTINCT s.ToCustomer
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
ORDER BY CustomerID;
```

## Except
```sql
-- 1. Fields with NO wells
SELECT f.FieldID
FROM   oil_n_gas_company.Field f
EXCEPT
SELECT DISTINCT w.FieldID
FROM   oil_n_gas_company.Well w
ORDER BY FieldID;

-- 2. Wells with NO July production
SELECT w.WellID
FROM   oil_n_gas_company.Well w
EXCEPT
SELECT DISTINCT p.WellID
FROM   oil_n_gas_company.Production p
WHERE  p.ProductionDate BETWEEN @RefStart AND @RefEnd
ORDER BY WellID;

-- 3. Customers with shipments (30d) EXCEPT those with any payment (30d)
SELECT DISTINCT s.ToCustomer
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
EXCEPT
SELECT DISTINCT i.CustomerID
FROM   oil_n_gas_company.Payment p
JOIN   oil_n_gas_company.Invoice i
       ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
WHERE  p.PaymentDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
ORDER BY ToCustomer;

-- 4. Products in Inventory (7d) EXCEPT those shipped (7d)
SELECT DISTINCT i.ProductID
FROM   oil_n_gas_company.Inventory i
WHERE  i.SnapshotDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
EXCEPT
SELECT DISTINCT s.ProductID
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY ProductID;

-- 5. Facilities that are pipeline endpoints EXCEPT shipment origins (30d)
SELECT FromFacility AS FacilityID
FROM   oil_n_gas_company.Pipeline
UNION
SELECT ToFacility
FROM   oil_n_gas_company.Pipeline
EXCEPT
SELECT DISTINCT FromFacility
FROM   oil_n_gas_company.Shipment
WHERE  ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
ORDER BY FacilityID;

-- 6. Pipelines with capacity ≥ 200k EXCEPT those with any flow (14d)
SELECT pl.PipelineID
FROM   oil_n_gas_company.Pipeline pl
WHERE  pl.CapacityBbl >= 200000
EXCEPT
SELECT DISTINCT pf.PipelineID
FROM   oil_n_gas_company.PipelineFlow pf
WHERE  pf.FlowDate BETWEEN DATEADD(DAY,-14,@Today) AND @Today
ORDER BY PipelineID;

-- 7. Invoices in July EXCEPT those that received payments
SELECT i.InvoiceID, i.InvoiceDate
FROM   oil_n_gas_company.Invoice i
WHERE  i.InvoiceDate BETWEEN @RefStart AND @RefEnd
EXCEPT
SELECT DISTINCT p.InvoiceID, p.InvoiceDate
FROM   oil_n_gas_company.Payment p
ORDER BY InvoiceDate DESC, InvoiceID;

-- 8. Regions with fields EXCEPT regions with producing wells
SELECT DISTINCT f.RegionID
FROM   oil_n_gas_company.Field f
EXCEPT
SELECT DISTINCT f2.RegionID
FROM   oil_n_gas_company.Field f2
JOIN   oil_n_gas_company.Well  w ON w.FieldID = f2.FieldID
WHERE  w.Status = 'Producing'
ORDER BY RegionID;

-- 9. Wells that had drilling operations EXCEPT currently Producing wells
SELECT DISTINCT d.WellID
FROM   oil_n_gas_company.DrillingOperation d
EXCEPT
SELECT w.WellID
FROM   oil_n_gas_company.Well w
WHERE  w.Status = 'Producing'
ORDER BY WellID;

-- 10. Customers with Open invoices EXCEPT those with shipments (90d)
SELECT DISTINCT i.CustomerID
FROM   oil_n_gas_company.Invoice i
WHERE  i.Status = 'Open'
EXCEPT
SELECT DISTINCT s.ToCustomer
FROM   oil_n_gas_company.Shipment s
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-90,@Today) AND @Today
ORDER BY CustomerID;

-- 11. Contracted products EXCEPT products present in Inventory
SELECT DISTINCT sc.ProductID
FROM   oil_n_gas_company.SalesContract sc
EXCEPT
SELECT DISTINCT i.ProductID
FROM   oil_n_gas_company.Inventory i
ORDER BY ProductID;

-- 12. Dates with production (7d) EXCEPT dates with pipeline flow (7d)
SELECT DISTINCT ProductionDate AS D
FROM   oil_n_gas_company.Production
WHERE  ProductionDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
EXCEPT
SELECT DISTINCT FlowDate
FROM   oil_n_gas_company.PipelineFlow
WHERE  FlowDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY D DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
