![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Inner Join
```sql
-- 1. Wells with their Field and Region
SELECT w.WellID, w.Name AS WellName, f.Name AS FieldName, r.Name AS RegionName
FROM   oil_n_gas_company.Well   w
JOIN   oil_n_gas_company.Field  f ON f.FieldID  = w.FieldID
JOIN   oil_n_gas_company.Region r ON r.RegionID = f.RegionID;

-- 2. July production rows with well names
SELECT p.WellID, w.Name AS WellName, p.ProductionDate, p.Oil_bbl, p.Gas_mcf
FROM   oil_n_gas_company.Production p
JOIN   oil_n_gas_company.Well       w ON w.WellID = p.WellID
WHERE  p.ProductionDate BETWEEN @RefStart AND @RefEnd;

-- 3. Shipment lines with product and customer
SELECT s.ShipmentID, s.ShipDate, c.Name AS Customer, pr.Name AS Product, s.Volume_bbl, s.RatePerBbl
FROM   oil_n_gas_company.Shipment s
JOIN   oil_n_gas_company.Customer c ON c.CustomerID = s.ToCustomer
JOIN   oil_n_gas_company.Product  pr ON pr.ProductID = s.ProductID
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today;

-- 4. Pipeline flow with pipeline and endpoint facility names
SELECT pf.PipelineID, pf.FlowDate, pf.Volume_bbl,
       pl.Name AS PipelineName, f1.Name AS FromFacility, f2.Name AS ToFacility
FROM   oil_n_gas_company.PipelineFlow pf
JOIN   oil_n_gas_company.Pipeline     pl ON pl.PipelineID = pf.PipelineID
JOIN   oil_n_gas_company.Facility     f1 ON f1.FacilityID = pl.FromFacility
JOIN   oil_n_gas_company.Facility     f2 ON f2.FacilityID = pl.ToFacility
WHERE  pf.FlowDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today;

-- 5. Inventory snapshots with facility & product names (last 5 days)
SELECT i.SnapshotDate, f.Name AS Facility, p.Name AS Product, i.Quantity_bbl
FROM   oil_n_gas_company.Inventory i
JOIN   oil_n_gas_company.Facility f ON f.FacilityID = i.FacilityID
JOIN   oil_n_gas_company.Product  p ON p.ProductID  = i.ProductID
WHERE  i.SnapshotDate BETWEEN DATEADD(DAY,-5,@Today) AND @Today;

-- 6. Invoices with customer names (July)
SELECT i.InvoiceID, i.InvoiceDate, c.Name AS Customer, i.AmountDue, i.Status
FROM   oil_n_gas_company.Invoice  i
JOIN   oil_n_gas_company.Customer c ON c.CustomerID = i.CustomerID
WHERE  i.InvoiceDate BETWEEN @RefStart AND @RefEnd;

-- 7. Payments joined to invoices and customers
SELECT p.PaymentID, p.PaymentDate, i.InvoiceID, i.InvoiceDate, c.Name AS Customer, p.AmountPaid
FROM   oil_n_gas_company.Payment p
JOIN   oil_n_gas_company.Invoice i
  ON  i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
JOIN   oil_n_gas_company.Customer c ON c.CustomerID = i.CustomerID
WHERE  p.PaymentDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today;

-- 8. Sales contracts with customer & product
SELECT sc.ContractID, c.Name AS Customer, pr.Name AS Product,
       sc.StartDate, sc.EndDate, sc.VolumeCommit_bbl, sc.PricePerBbl
FROM   oil_n_gas_company.SalesContract sc
JOIN   oil_n_gas_company.Customer     c  ON c.CustomerID  = sc.CustomerID
JOIN   oil_n_gas_company.Product      pr ON pr.ProductID  = sc.ProductID;

-- 9. Drilling ops with well and field
SELECT d.OperationID, d.StartDate, d.EndDate, w.Name AS WellName, f.Name AS FieldName
FROM   oil_n_gas_company.DrillingOperation d
JOIN   oil_n_gas_company.Well             w ON w.WellID  = d.WellID
JOIN   oil_n_gas_company.Field            f ON f.FieldID = w.FieldID
WHERE  d.StartDate >= DATEADD(DAY,-120,@Today);

--10. Pipeline maintenance events with pipeline name (AssetType='Pipeline')
SELECT am.MaintenanceID, am.MaintDate, pl.Name AS PipelineName, am.CostUSD, am.Description
FROM   oil_n_gas_company.AssetMaintenance am
JOIN   oil_n_gas_company.Pipeline        pl
  ON   am.AssetType = 'Pipeline' AND pl.PipelineID = am.AssetID
WHERE  am.MaintDate >= DATEADD(DAY,-180,@Today);

--11. Facilities that shipped in July with total volume
SELECT f.Name AS Facility, SUM(s.Volume_bbl) AS TotalVol_bbl
FROM   oil_n_gas_company.Facility f
JOIN   oil_n_gas_company.Shipment s ON s.FromFacility = f.FacilityID
WHERE  s.ShipDate BETWEEN @RefStart AND @RefEnd
GROUP  BY f.Name;

--12. Products shipped in last 14 days with revenue
SELECT p.Name AS Product, SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS RevenueUSD
FROM   oil_n_gas_company.Product  p
JOIN   oil_n_gas_company.Shipment s ON s.ProductID = p.ProductID
WHERE  s.ShipDate BETWEEN DATEADD(DAY,-14,@Today) AND @Today
GROUP  BY p.Name;
```

## Left Join (Left Outer Join)
```sql
-- 1. All fields with (optional) wells count
SELECT f.FieldID, f.Name AS FieldName, COUNT(w.WellID) AS WellCount
FROM   oil_n_gas_company.Field f
LEFT  JOIN oil_n_gas_company.Well  w ON w.FieldID = f.FieldID
GROUP BY f.FieldID, f.Name;

-- 2. All wells with optional July production
SELECT w.WellID, w.Name AS WellName, p.ProductionDate, p.Oil_bbl
FROM   oil_n_gas_company.Well w
LEFT  JOIN oil_n_gas_company.Production p
       ON p.WellID = w.WellID AND p.ProductionDate BETWEEN @RefStart AND @RefEnd
ORDER BY w.WellID, p.ProductionDate;

-- 3. All customers with their latest invoice (if any)
;WITH LastInv AS (
  SELECT i.CustomerID, MAX(i.InvoiceDate) AS LastInvoiceDate
  FROM   oil_n_gas_company.Invoice i
  GROUP  BY i.CustomerID
)
SELECT c.CustomerID, c.Name, i.InvoiceID, i.InvoiceDate, i.AmountDue, i.Status
FROM   oil_n_gas_company.Customer c
LEFT  JOIN LastInv li ON li.CustomerID = c.CustomerID
LEFT  JOIN oil_n_gas_company.Invoice i
       ON  i.CustomerID = c.CustomerID AND i.InvoiceDate = li.LastInvoiceDate;

-- 4. Invoices with (optional) payments total
SELECT i.InvoiceID, i.InvoiceDate, i.CustomerID, i.AmountDue,
       SUM(p.AmountPaid) AS AmountPaid
FROM   oil_n_gas_company.Invoice i
LEFT  JOIN oil_n_gas_company.Payment p
       ON  p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
WHERE  i.InvoiceDate BETWEEN DATEADD(DAY,-60,@Today) AND @Today
GROUP  BY i.InvoiceID, i.InvoiceDate, i.CustomerID, i.AmountDue;

-- 5. Pipelines with recent flow if any (14 days)
SELECT pl.PipelineID, pl.Name, pl.CapacityBbl, pf.FlowDate, pf.Volume_bbl
FROM   oil_n_gas_company.Pipeline pl
LEFT  JOIN oil_n_gas_company.PipelineFlow pf
       ON pf.PipelineID = pl.PipelineID
      AND pf.FlowDate   BETWEEN DATEADD(DAY,-14,@Today) AND @Today
ORDER BY pl.PipelineID, pf.FlowDate DESC;

-- 6. Facilities with shipments in last 30 days (may be NULL)
SELECT f.FacilityID, f.Name, s.ShipDate, s.Volume_bbl
FROM   oil_n_gas_company.Facility f
LEFT  JOIN oil_n_gas_company.Shipment s
       ON s.FromFacility = f.FacilityID
      AND s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today;

-- 7. Products with inventory snapshots in last 7 days (optional)
SELECT p.ProductID, p.Name, i.SnapshotDate, i.Quantity_bbl
FROM   oil_n_gas_company.Product p
LEFT  JOIN oil_n_gas_company.Inventory i
       ON i.ProductID = p.ProductID
      AND i.SnapshotDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY p.ProductID, i.SnapshotDate;

-- 8. Wells with latest drilling start date (if any)
SELECT w.WellID, w.Name,
       d.LastStartDate
FROM   oil_n_gas_company.Well w
LEFT  JOIN (
         SELECT WellID, MAX(StartDate) AS LastStartDate
         FROM   oil_n_gas_company.DrillingOperation
         GROUP  BY WellID
       ) d ON d.WellID = w.WellID;

-- 9. Customers with their address (may be NULL)
SELECT c.CustomerID, c.Name, a.Street, a.City, a.State, a.Country
FROM   oil_n_gas_company.Customer c
LEFT  JOIN oil_n_gas_company.Address  a ON a.AddressID = c.AddressID;

--10. Sales contracts with shipments during contract period (optional)
SELECT sc.ContractID, c.Name AS Customer, p.Name AS Product,
       sc.StartDate, sc.EndDate, s.ShipDate, s.Volume_bbl
FROM   oil_n_gas_company.SalesContract sc
JOIN   oil_n_gas_company.Customer     c  ON c.CustomerID = sc.CustomerID
JOIN   oil_n_gas_company.Product      p  ON p.ProductID  = sc.ProductID
LEFT  JOIN oil_n_gas_company.Shipment s
       ON  s.ToCustomer = sc.CustomerID
       AND s.ProductID  = sc.ProductID
       AND s.ShipDate  BETWEEN sc.StartDate AND COALESCE(sc.EndDate, @Today)
ORDER BY sc.ContractID, s.ShipDate;

--11. Regions with fields and (optional) producing well counts
;WITH FieldCounts AS (
  SELECT f.RegionID, COUNT(*) AS FieldCount
  FROM   oil_n_gas_company.Field f
  GROUP  BY f.RegionID
),
ProdWellCounts AS (
  SELECT f.RegionID, COUNT(DISTINCT w.WellID) AS ProducingWells
  FROM   oil_n_gas_company.Field f
  JOIN   oil_n_gas_company.Well  w ON w.FieldID = f.FieldID AND w.Status = 'Producing'
  GROUP  BY f.RegionID
)
SELECT r.RegionID, r.Name,
       fc.FieldCount,
       pw.ProducingWells
FROM   oil_n_gas_company.Region r
LEFT  JOIN FieldCounts     fc ON fc.RegionID = r.RegionID
LEFT  JOIN ProdWellCounts  pw ON pw.RegionID = r.RegionID;

--12. Wells with last production date (if any)
SELECT w.WellID, w.Name,
       MAX(p.ProductionDate) AS LastProdDate
FROM   oil_n_gas_company.Well w
LEFT  JOIN oil_n_gas_company.Production p ON p.WellID = w.WellID
GROUP BY w.WellID, w.Name;
```

## Right Join (Right Outer Join)
```sql
-- 1. Wells → RIGHT JOIN Field (all fields even w/o wells)
SELECT f.FieldID, f.Name AS FieldName, w.WellID, w.Name AS WellName
FROM   oil_n_gas_company.Well  w
RIGHT JOIN oil_n_gas_company.Field f ON f.FieldID = w.FieldID
ORDER BY f.FieldID, w.WellID;

-- 2. Production (July) → RIGHT JOIN Well (include wells w/o July production)
SELECT w.WellID, w.Name, p.ProductionDate, p.Oil_bbl
FROM   oil_n_gas_company.Production p
RIGHT JOIN oil_n_gas_company.Well      w
       ON w.WellID = p.WellID AND p.ProductionDate BETWEEN @RefStart AND @RefEnd
ORDER BY w.WellID, p.ProductionDate;

-- 3. Payment → RIGHT JOIN Invoice (include invoices without payments)
SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue, p.AmountPaid, p.PaymentDate
FROM   oil_n_gas_company.Payment p
RIGHT JOIN oil_n_gas_company.Invoice i
       ON  i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
ORDER BY i.InvoiceDate DESC, i.InvoiceID;

-- 4. Shipment (30d) → RIGHT JOIN Customer (include customers without shipments)
SELECT c.CustomerID, c.Name, s.ShipDate, s.Volume_bbl
FROM   oil_n_gas_company.Shipment s
RIGHT JOIN oil_n_gas_company.Customer c
       ON c.CustomerID = s.ToCustomer
      AND s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today;

-- 5. PipelineFlow (14d) → RIGHT JOIN Pipeline (include pipelines with no flow)
SELECT pl.PipelineID, pl.Name, pf.FlowDate, pf.Volume_bbl
FROM   oil_n_gas_company.PipelineFlow pf
RIGHT JOIN oil_n_gas_company.Pipeline    pl ON pl.PipelineID = pf.PipelineID
                                           AND pf.FlowDate BETWEEN DATEADD(DAY,-14,@Today) AND @Today;

-- 6. Inventory (7d) → RIGHT JOIN Product (include products w/o snapshots)
SELECT pr.ProductID, pr.Name, i.SnapshotDate, i.Quantity_bbl
FROM   oil_n_gas_company.Inventory i
RIGHT JOIN oil_n_gas_company.Product  pr
       ON pr.ProductID = i.ProductID
      AND i.SnapshotDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
ORDER BY pr.ProductID, i.SnapshotDate;

-- 7. SalesContract → RIGHT JOIN Customer (include customers w/o contracts)
SELECT c.CustomerID, c.Name, sc.ContractID, sc.StartDate, sc.EndDate
FROM   oil_n_gas_company.SalesContract sc
RIGHT JOIN oil_n_gas_company.Customer     c
       ON c.CustomerID = sc.CustomerID
ORDER BY c.CustomerID, sc.ContractID;

-- 8. AssetMaintenance (Facility) → RIGHT JOIN Facility
SELECT f.FacilityID, f.Name, am.MaintDate, am.CostUSD
FROM   oil_n_gas_company.AssetMaintenance am
RIGHT JOIN oil_n_gas_company.Facility       f
       ON am.AssetType = 'Facility' AND f.FacilityID = am.AssetID
ORDER BY f.FacilityID, am.MaintDate DESC;

-- 9. DrillingOperation → RIGHT JOIN Well (include wells without ops)
SELECT w.WellID, w.Name, d.OperationID, d.StartDate, d.EndDate
FROM   oil_n_gas_company.DrillingOperation d
RIGHT JOIN oil_n_gas_company.Well             w ON w.WellID = d.WellID;

--10. Address → RIGHT JOIN Customer (show all customers, address optional)
SELECT c.CustomerID, c.Name, a.City, a.State, a.Country
FROM   oil_n_gas_company.Address  a
RIGHT JOIN oil_n_gas_company.Customer c ON c.AddressID = a.AddressID;

--11. Product → RIGHT JOIN Shipment (last 7d) (all shipments)
SELECT s.ShipmentID, s.ShipDate, p.Name AS Product, s.Volume_bbl, s.RatePerBbl
FROM   oil_n_gas_company.Product  p
RIGHT JOIN oil_n_gas_company.Shipment s
       ON s.ProductID = p.ProductID
      AND s.ShipDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today;

--12. Region → RIGHT JOIN Field (all fields; regions should exist via FK)
SELECT f.FieldID, f.Name AS FieldName, r.Name AS RegionName
FROM   oil_n_gas_company.Region r
RIGHT JOIN oil_n_gas_company.Field  f ON f.RegionID = r.RegionID;
```

## Full Join (Full Outer Join)
```sql
-- 1. Customers with July shipments OR July invoices (combine)
;WITH CS AS (
  SELECT s.ToCustomer AS CustomerID, SUM(CAST(s.Volume_bbl*s.RatePerBbl AS decimal(18,2))) AS ShipRevenue
  FROM   oil_n_gas_company.Shipment s
  WHERE  s.ShipDate BETWEEN @RefStart AND @RefEnd
  GROUP  BY s.ToCustomer
),
CI AS (
  SELECT i.CustomerID, SUM(i.AmountDue) AS InvAmount
  FROM   oil_n_gas_company.Invoice i
  WHERE  i.InvoiceDate BETWEEN @RefStart AND @RefEnd
  GROUP  BY i.CustomerID
)
SELECT COALESCE(cs.CustomerID, ci.CustomerID) AS CustomerID,
       cs.ShipRevenue, ci.InvAmount
FROM   CS cs
FULL  JOIN CI ci ON ci.CustomerID = cs.CustomerID
ORDER  BY CustomerID;

-- 2. Dates with production OR pipeline flow (last 10 days)
;WITH P AS (
  SELECT DISTINCT ProductionDate AS D FROM oil_n_gas_company.Production
  WHERE  ProductionDate BETWEEN DATEADD(DAY,-10,@Today) AND @Today
),
F AS (
  SELECT DISTINCT FlowDate AS D FROM oil_n_gas_company.PipelineFlow
  WHERE  FlowDate BETWEEN DATEADD(DAY,-10,@Today) AND @Today
)
SELECT COALESCE(P.D, F.D) AS DayD,
       CASE WHEN P.D IS NOT NULL THEN 1 ELSE 0 END AS HasProduction,
       CASE WHEN F.D IS NOT NULL THEN 1 ELSE 0 END AS HasFlow
FROM   P
FULL  JOIN F ON F.D = P.D
ORDER  BY DayD DESC;

-- 3. Facilities with either inventory (7d) OR shipments (7d)
;WITH I AS (
  SELECT DISTINCT FacilityID FROM oil_n_gas_company.Inventory
  WHERE  SnapshotDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
),
S AS (
  SELECT DISTINCT FromFacility AS FacilityID FROM oil_n_gas_company.Shipment
  WHERE  ShipDate BETWEEN DATEADD(DAY,-7,@Today) AND @Today
)
SELECT COALESCE(I.FacilityID, S.FacilityID) AS FacilityID, f.Name
FROM   I
FULL  JOIN S ON S.FacilityID = I.FacilityID
JOIN   oil_n_gas_company.Facility f ON f.FacilityID = COALESCE(I.FacilityID, S.FacilityID)
ORDER  BY FacilityID;

-- 4. Products that appear in inventory OR were shipped (90d)
;WITH PI AS (
  SELECT DISTINCT ProductID FROM oil_n_gas_company.Inventory
),
PS AS (
  SELECT DISTINCT ProductID FROM oil_n_gas_company.Shipment
  WHERE  ShipDate BETWEEN DATEADD(DAY,-90,@Today) AND @Today
)
SELECT COALESCE(PI.ProductID, PS.ProductID) AS ProductID, p.Name
FROM   PI
FULL  JOIN PS ON PS.ProductID = PI.ProductID
JOIN   oil_n_gas_company.Product p ON p.ProductID = COALESCE(PI.ProductID, PS.ProductID)
ORDER  BY ProductID;

-- 5. Pipelines with capacity record OR recent flow (14d)
;WITH PL AS (SELECT PipelineID, Name FROM oil_n_gas_company.Pipeline),
   PF AS (SELECT DISTINCT PipelineID FROM oil_n_gas_company.PipelineFlow
          WHERE FlowDate BETWEEN DATEADD(DAY,-14,@Today) AND @Today)
SELECT COALESCE(pl.PipelineID, pf.PipelineID) AS PipelineID, pl.Name,
       CASE WHEN pf.PipelineID IS NOT NULL THEN 1 ELSE 0 END AS HasRecentFlow
FROM   PL pl
FULL  JOIN PF pf ON pf.PipelineID = pl.PipelineID
ORDER  BY PipelineID;

-- 6. Customer–Product pairs in contracts OR in shipments (last 60d)
;WITH CP_Contract AS (
  SELECT CustomerID, ProductID
  FROM   oil_n_gas_company.SalesContract
  GROUP  BY CustomerID, ProductID
),
CP_Ship AS (
  SELECT ToCustomer AS CustomerID, ProductID
  FROM   oil_n_gas_company.Shipment
  WHERE  ShipDate BETWEEN DATEADD(DAY,-60,@Today) AND @Today
  GROUP  BY ToCustomer, ProductID
)
SELECT COALESCE(c.CustomerID,s.CustomerID) AS CustomerID,
       COALESCE(c.ProductID ,s.ProductID ) AS ProductID
FROM   CP_Contract c
FULL  JOIN CP_Ship    s
       ON  s.CustomerID = c.CustomerID AND s.ProductID = c.ProductID
ORDER  BY CustomerID, ProductID;

-- 7. Invoices vs Payments (match by (InvoiceID, InvoiceDate))
;WITH I AS (
  SELECT InvoiceID, InvoiceDate, AmountDue FROM oil_n_gas_company.Invoice
  WHERE  InvoiceDate BETWEEN DATEADD(DAY,-90,@Today) AND @Today
),
P AS (
  SELECT InvoiceID, InvoiceDate, SUM(AmountPaid) AS Paid
  FROM   oil_n_gas_company.Payment
  WHERE  PaymentDate BETWEEN DATEADD(DAY,-90,@Today) AND @Today
  GROUP  BY InvoiceID, InvoiceDate
)
SELECT COALESCE(i.InvoiceID, p.InvoiceID) AS InvoiceID,
       COALESCE(i.InvoiceDate, p.InvoiceDate) AS InvoiceDate,
       i.AmountDue, p.Paid
FROM   I i
FULL  JOIN P p ON p.InvoiceID = i.InvoiceID AND p.InvoiceDate = i.InvoiceDate
ORDER  BY InvoiceDate DESC, InvoiceID;

-- 8. Wells vs maintenance events (AssetType='Well') in last 180 days
;WITH W AS (SELECT WellID, Name FROM oil_n_gas_company.Well),
   M AS (SELECT AssetID AS WellID, MaintDate, CostUSD
         FROM   oil_n_gas_company.AssetMaintenance
         WHERE  AssetType='Well' AND MaintDate >= DATEADD(DAY,-180,@Today))
SELECT COALESCE(W.WellID, M.WellID) AS WellID, W.Name, M.MaintDate, M.CostUSD
FROM   W
FULL  JOIN M ON M.WellID = W.WellID
ORDER  BY WellID, MaintDate DESC;

-- 9. Fields vs Wells (show fields with no wells & any orphan wells)
SELECT f.FieldID, f.Name AS FieldName, w.WellID, w.Name AS WellName
FROM   oil_n_gas_company.Field f
FULL  JOIN oil_n_gas_company.Well  w ON w.FieldID = f.FieldID
ORDER  BY COALESCE(f.FieldID, -1), COALESCE(w.WellID, -1);

--10. Recent drilling ops vs recent production by well (30 days)
;WITH D AS (
  SELECT DISTINCT WellID FROM oil_n_gas_company.DrillingOperation
  WHERE  StartDate >= DATEADD(DAY,-30,CAST(@Today AS datetime2))
),
P AS (
  SELECT DISTINCT WellID FROM oil_n_gas_company.Production
  WHERE  ProductionDate >= DATEADD(DAY,-30,@Today)
)
SELECT COALESCE(D.WellID, P.WellID) AS WellID,
       CASE WHEN D.WellID IS NOT NULL THEN 1 ELSE 0 END AS HasRecentDrill,
       CASE WHEN P.WellID IS NOT NULL THEN 1 ELSE 0 END AS HasRecentProd
FROM   D
FULL  JOIN P ON P.WellID = D.WellID
ORDER  BY WellID;

--11. Customers with payments OR shipments (last 60 days)
;WITH PayCust AS (
  SELECT DISTINCT i.CustomerID
  FROM   oil_n_gas_company.Payment p
  JOIN   oil_n_gas_company.Invoice i
    ON   i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  WHERE  p.PaymentDate BETWEEN DATEADD(DAY,-60,@Today) AND @Today
),
ShipCust AS (
  SELECT DISTINCT ToCustomer AS CustomerID
  FROM   oil_n_gas_company.Shipment
  WHERE  ShipDate BETWEEN DATEADD(DAY,-60,@Today) AND @Today
)
SELECT COALESCE(pc.CustomerID, sc.CustomerID) AS CustomerID
FROM   PayCust pc
FULL  JOIN ShipCust sc ON sc.CustomerID = pc.CustomerID
ORDER  BY CustomerID;

--12. Facilities participating as pipeline endpoints OR having inventory
;WITH Endpoints AS (
  SELECT FromFacility AS FacilityID FROM oil_n_gas_company.Pipeline
  UNION
  SELECT ToFacility   AS FacilityID FROM oil_n_gas_company.Pipeline
),
InvFac AS (
  SELECT DISTINCT FacilityID FROM oil_n_gas_company.Inventory
)
SELECT COALESCE(e.FacilityID, i.FacilityID) AS FacilityID, f.Name
FROM   Endpoints e
FULL  JOIN InvFac   i ON i.FacilityID = e.FacilityID
JOIN   oil_n_gas_company.Facility f ON f.FacilityID = COALESCE(e.FacilityID, i.FacilityID)
ORDER  BY FacilityID;
```

## Cross Join
```sql
-- 1. Product × simple price tiers (what-if)
SELECT p.ProductID, p.Name, t.TierName, t.Multiplier
FROM   oil_n_gas_company.Product p
CROSS  JOIN (VALUES ('Base',1.00),('High',1.10),('Low',0.90)) AS t(TierName,Multiplier);

-- 2. Customers × last 3 month-ends (skeleton for reports)
SELECT c.CustomerID, c.Name, d.EOM
FROM   oil_n_gas_company.Customer c
CROSS  JOIN (VALUES (EOMONTH(DATEADD(MONTH,-2,@Today))),
                    (EOMONTH(DATEADD(MONTH,-1,@Today))),
                    (EOMONTH(@Today))) AS d(EOM);

-- 3. Facilities × last 3 days (inventory planning grid)
SELECT f.FacilityID, f.Name, d.Dt
FROM   oil_n_gas_company.Facility f
CROSS  JOIN (VALUES (DATEADD(DAY,-2,@Today)), (DATEADD(DAY,-1,@Today)), (@Today)) AS d(Dt);

-- 4. Regions × status labels (for QA checks)
SELECT r.RegionID, r.Name, s.StatusLabel
FROM   oil_n_gas_company.Region r
CROSS  JOIN (VALUES ('Active'),('Inactive'),('Planned')) AS s(StatusLabel);

-- 5. Top 5 Products × Top 3 Customers by recent shipments (example grid)
;WITH TopProd AS (
  SELECT TOP (5) s.ProductID, SUM(s.Volume_bbl) AS Vol
  FROM   oil_n_gas_company.Shipment s
  WHERE  s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
  GROUP  BY s.ProductID
  ORDER  BY Vol DESC
),
TopCust AS (
  SELECT TOP (3) s.ToCustomer AS CustomerID, SUM(s.Volume_bbl) AS Vol
  FROM   oil_n_gas_company.Shipment s
  WHERE  s.ShipDate BETWEEN DATEADD(DAY,-30,@Today) AND @Today
  GROUP  BY s.ToCustomer
  ORDER  BY Vol DESC
)
SELECT tp.ProductID, tc.CustomerID
FROM   TopProd tp
CROSS  JOIN TopCust tc;

-- 6. Products × Unit labels (demo enumeration)
SELECT p.ProductID, p.Name, u.UnitLabel
FROM   oil_n_gas_company.Product p
CROSS  JOIN (VALUES ('bbl'),('ton'),('m3')) AS u(UnitLabel);

-- 7. Pipelines × next 3 days (expected flow placeholders)
SELECT pl.PipelineID, pl.Name, d.Dt AS FlowDate
FROM   oil_n_gas_company.Pipeline pl
CROSS  JOIN (VALUES (DATEADD(DAY,1,@Today)),(DATEADD(DAY,2,@Today)),(DATEADD(DAY,3,@Today))) AS d(Dt);

-- 8. Contract months × sample FX scenarios (for pricing what-if)
SELECT DISTINCT EOMONTH(sc.StartDate) AS ContractMonth, fx.Scenario, fx.FX
FROM   oil_n_gas_company.SalesContract sc
CROSS  JOIN (VALUES ('Base',1.00),('WeakUSD',0.95),('StrongUSD',1.05)) AS fx(Scenario,FX);

-- 9. All facilities × selected products (first 3)
SELECT f.FacilityID, f.Name, p.ProductID, p.Name AS Product
FROM   oil_n_gas_company.Facility f
CROSS  JOIN (SELECT TOP (3) * FROM oil_n_gas_company.Product ORDER BY ProductID) p
ORDER  BY f.FacilityID, p.ProductID;

--10. Simple date spine (last 7 days) × metric names
SELECT d.Dt, m.Metric
FROM   (SELECT DATEADD(DAY, -n, @Today) AS Dt
        FROM (VALUES(0),(1),(2),(3),(4),(5),(6)) n(n)) d
CROSS  JOIN (VALUES ('Oil_bbl'),('Gas_mcf')) m(Metric)
ORDER  BY d.Dt DESC, m.Metric;

--11. Regions × two hypothetical tax rates (scenario matrix)
SELECT r.RegionID, r.Name, t.TaxName, t.Rate
FROM   oil_n_gas_company.Region r
CROSS  JOIN (VALUES ('LowTax',0.02),('HighTax',0.05)) t(TaxName,Rate);

--12. First 5 customers × first 4 products (combinatorial grid)
SELECT c.CustomerID, c.Name, p.ProductID, p.Name AS Product
FROM   (SELECT TOP (5) * FROM oil_n_gas_company.Customer ORDER BY CustomerID) c
CROSS  JOIN (SELECT TOP (4) * FROM oil_n_gas_company.Product  ORDER BY ProductID) p
ORDER  BY c.CustomerID, p.ProductID;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
