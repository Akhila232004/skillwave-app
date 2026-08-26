![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate       date = '2025-07-31';
DECLARE @RefMonthStart date = '2025-07-01';
DECLARE @RefMonthEnd   date = '2025-07-31';
```

## CTE
```sql
-- 1. July production per asset, then pick top 5
WITH JulyProd AS (
  SELECT ep.AssetID, SUM(ep.EnergyMWh) AS July_MWh
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY ep.AssetID
)
SELECT TOP (5) a.AssetID, a.Name, JP.July_MWh
FROM JulyProd JP
JOIN energy_company.Asset a ON a.AssetID = JP.AssetID
ORDER BY JP.July_MWh DESC;

-- 2. July average consumption per meter
WITH JulyRead AS (
  SELECT mr.MeterID, AVG(mr.Consumption_kWh) AS AvgJuly_kWh
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY mr.MeterID
)
SELECT * FROM JulyRead ORDER BY AvgJuly_kWh DESC;

-- 3. Unpaid (open) totals per customer
WITH OpenAR AS (
  SELECT i.CustomerID, SUM(i.AmountDue) AS UnpaidTotal
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
  GROUP BY i.CustomerID
)
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer, oa.UnpaidTotal
FROM OpenAR oa
JOIN energy_company.Customer c ON c.CustomerID = oa.CustomerID
ORDER BY oa.UnpaidTotal DESC;

-- 4. Asset counts per facility
WITH FacAssets AS (
  SELECT a.FacilityID, COUNT(*) AS AssetCount
  FROM energy_company.Asset a
  GROUP BY a.FacilityID
)
SELECT f.FacilityID, f.Name AS Facility, fa.AssetCount
FROM FacAssets fa
JOIN energy_company.Facility f ON f.FacilityID = fa.FacilityID
ORDER BY fa.AssetCount DESC;

-- 5. Rate plans effective on 2025-07-01
WITH EffPlans AS (
  SELECT rp.*
  FROM energy_company.RatePlan rp
  WHERE rp.EffectiveDate <= '2025-07-01'
    AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= '2025-07-01')
)
SELECT RatePlanID, Name, PricePerkWh FROM EffPlans;

-- 6. Monthly 2025 revenue (EOMONTH)
WITH M AS (
  SELECT EOMONTH(es.SaleDate) AS MonthEnd, SUM(es.TotalCharge) AS Revenue
  FROM energy_company.EnergySale es
  WHERE YEAR(es.SaleDate) = 2025
  GROUP BY EOMONTH(es.SaleDate)
)
SELECT * FROM M ORDER BY MonthEnd;

-- 7. A/R aging bucket snapshot vs @RefDate
WITH Aging AS (
  SELECT i.CustomerID, i.InvoiceID, i.InvoiceDate, i.DueDate, i.AmountDue,
         CASE
           WHEN i.DueDate >= @RefDate              THEN 'Current'
           WHEN DATEDIFF(DAY, i.DueDate, @RefDate) BETWEEN 1  AND 30  THEN '1-30'
           WHEN DATEDIFF(DAY, i.DueDate, @RefDate) BETWEEN 31 AND 60  THEN '31-60'
           WHEN DATEDIFF(DAY, i.DueDate, @RefDate) BETWEEN 61 AND 90  THEN '61-90'
           ELSE '90+'
         END AS AgingBucket
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
)
SELECT AgingBucket, SUM(AmountDue) AS BucketTotal
FROM Aging
GROUP BY AgingBucket
ORDER BY CASE AgingBucket WHEN 'Current' THEN 0 WHEN '1-30' THEN 1 WHEN '31-60' THEN 2 WHEN '61-90' THEN 3 ELSE 4 END;

-- 8. Last maintenance per asset
WITH LastMaint AS (
  SELECT am.AssetID, MAX(am.MaintenanceDate) AS LastMaintDate
  FROM energy_company.AssetMaintenance am
  GROUP BY am.AssetID
)
SELECT a.AssetID, a.Name, lm.LastMaintDate
FROM LastMaint lm
JOIN energy_company.Asset a ON a.AssetID = lm.AssetID
ORDER BY lm.LastMaintDate DESC;

-- 9. Grid daily MWh totals (July)
WITH Grid AS (
  SELECT ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY ep.ProductionDate
)
SELECT * FROM Grid ORDER BY ProductionDate;

-- 10. City-level July average consumption
WITH CityJuly AS (
  SELECT a.City, AVG(mr.Consumption_kWh) AS AvgJuly_kWh
  FROM energy_company.MeterReading mr
  JOIN energy_company.Meter m    ON m.MeterID = mr.MeterID
  JOIN energy_company.Customer c ON c.CustomerID = m.CustomerID
  JOIN energy_company.Address a  ON a.AddressID = c.AddressID
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY a.City
)
SELECT * FROM CityJuly ORDER BY AvgJuly_kWh DESC;

-- 11. Meters installed before 2025 with July totals
WITH OldMeters AS (
  SELECT MeterID FROM energy_company.Meter WHERE InstallationDate < '2025-01-01'
),
JulySum AS (
  SELECT mr.MeterID, SUM(mr.Consumption_kWh) AS July_kWh
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY mr.MeterID
)
SELECT om.MeterID, js.July_kWh
FROM OldMeters om
LEFT JOIN JulySum js ON js.MeterID = om.MeterID
ORDER BY js.July_kWh DESC;

-- 12. Assets with share of their facility capacity
WITH FacCap AS (
  SELECT a.FacilityID, SUM(a.CapacityMW) AS FacilityMW
  FROM energy_company.Asset a
  GROUP BY a.FacilityID
)
SELECT f.Name AS Facility, a.AssetID, a.Name AS Asset, a.CapacityMW,
       100.0 * a.CapacityMW / NULLIF(fc.FacilityMW,0) AS PctOfFacility
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID
JOIN FacCap fc ON fc.FacilityID = a.FacilityID
ORDER BY Facility, PctOfFacility DESC;
```

## Using Multiple CTEs
```sql
-- 1. July revenue vs July payments per customer
WITH JulySales AS (
  SELECT es.CustomerID, SUM(es.TotalCharge) AS RevJuly
  FROM energy_company.EnergySale es
  WHERE es.SaleDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY es.CustomerID
),
JulyPays AS (
  SELECT i.CustomerID, SUM(p.AmountPaid) AS PaidJuly
  FROM energy_company.Payment p
  JOIN energy_company.Invoice i ON i.InvoiceID = p.InvoiceID AND i.InvoiceDate = p.InvoiceDate
  WHERE p.PaymentDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY i.CustomerID
)
SELECT c.CustomerID, CONCAT(c.FirstName,' ',c.LastName) AS Customer,
       js.RevJuly, jp.PaidJuly, COALESCE(js.RevJuly,0)-COALESCE(jp.PaidJuly,0) AS Net
FROM energy_company.Customer c
LEFT JOIN JulySales js ON js.CustomerID = c.CustomerID
LEFT JOIN JulyPays  jp ON jp.CustomerID = c.CustomerID
ORDER BY Net DESC;

-- 2. Day grid totals then add 7-day moving average
WITH D AS (
  SELECT ep.ProductionDate, SUM(ep.EnergyMWh) AS GridMWh
  FROM energy_company.EnergyProduction ep
  WHERE ep.ProductionDate BETWEEN DATEADD(DAY,-20,@RefDate) AND @RefDate
  GROUP BY ep.ProductionDate
),
S AS (
  SELECT D.*,
         AVG(D.GridMWh) OVER (ORDER BY D.ProductionDate ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS MA7
  FROM D
)
SELECT * FROM S ORDER BY ProductionDate;

-- 3. City counts, then top 10 cities by customer population
WITH CityCount AS (
  SELECT a.City, COUNT(*) AS Custs
  FROM energy_company.Customer c
  JOIN energy_company.Address a ON a.AddressID = c.AddressID
  GROUP BY a.City
),
TopCity AS (
  SELECT TOP (10) * FROM CityCount ORDER BY Custs DESC
)
SELECT * FROM TopCity ORDER BY Custs DESC;

-- 4. Active assets and their maintenance counts in last 180 days; list assets with zero
WITH ActiveAssets AS (
  SELECT AssetID, Name, FacilityID FROM energy_company.Asset WHERE Status = 'Active'
),
Maint180 AS (
  SELECT am.AssetID, COUNT(*) AS MaintCnt
  FROM energy_company.AssetMaintenance am
  WHERE am.MaintenanceDate BETWEEN DATEADD(DAY,-180,@RefDate) AND @RefDate
  GROUP BY am.AssetID
)
SELECT a.AssetID, a.Name, COALESCE(m.MaintCnt,0) AS MaintCnt_180d
FROM ActiveAssets a
LEFT JOIN Maint180 m ON m.AssetID = a.AssetID
ORDER BY MaintCnt_180d, a.AssetID;

-- 5. Effective plan per sale date (filter July)
WITH EffPlan AS (
  SELECT es.SaleID, es.SaleDate, es.CustomerID, es.RatePlanID
  FROM energy_company.EnergySale es
  WHERE es.SaleDate BETWEEN @RefMonthStart AND @RefMonthEnd
),
PlanMeta AS (
  SELECT rp.RatePlanID, rp.Name, rp.PricePerkWh
  FROM energy_company.RatePlan rp
)
SELECT e.SaleID, e.SaleDate, e.CustomerID, p.Name, p.PricePerkWh
FROM EffPlan e
JOIN PlanMeta p ON p.RatePlanID = e.RatePlanID
ORDER BY e.SaleDate, e.SaleID;

-- 6. Open invoices, then total open by city
WITH OpenInv AS (
  SELECT i.InvoiceID, i.CustomerID, i.AmountDue
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
),
CityJoin AS (
  SELECT oi.InvoiceID, oi.AmountDue, a.City
  FROM OpenInv oi
  JOIN energy_company.Customer c ON c.CustomerID = oi.CustomerID
  JOIN energy_company.Address  a ON a.AddressID = c.AddressID
)
SELECT City, SUM(AmountDue) AS OpenByCity
FROM CityJoin
GROUP BY City
ORDER BY OpenByCity DESC;

-- 7. Meter July stats and spikes (>150% of avg)
WITH Stats AS (
  SELECT mr.MeterID, AVG(mr.Consumption_kWh) AS AvgJuly
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY mr.MeterID
),
Spikes AS (
  SELECT mr.MeterID, mr.ReadDate, mr.Consumption_kWh
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
)
SELECT s.MeterID, sp.ReadDate, sp.Consumption_kWh, s.AvgJuly
FROM Stats s
JOIN Spikes sp ON sp.MeterID = s.MeterID
WHERE sp.Consumption_kWh > 1.5 * s.AvgJuly
ORDER BY s.MeterID, sp.ReadDate;

-- 8. First/last reading in July per meter and span
WITH Bounds AS (
  SELECT mr.MeterID, MIN(mr.ReadDate) AS FirstRead, MAX(mr.ReadDate) AS LastRead
  FROM energy_company.MeterReading mr
  WHERE mr.ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY mr.MeterID
),
Span AS (
  SELECT MeterID, FirstRead, LastRead, DATEDIFF(DAY, FirstRead, LastRead) AS DaysSpan
  FROM Bounds
)
SELECT * FROM Span ORDER BY DaysSpan DESC;

-- 9. Normalize asset statuses (A/M/R), then counts
WITH Norm AS (
  SELECT CASE a.Status WHEN 'Active' THEN 'A' WHEN 'Maintenance' THEN 'M' WHEN 'Retired' THEN 'R' ELSE 'X' END AS St
  FROM energy_company.Asset a
)
SELECT St, COUNT(*) AS Cnt
FROM Norm
GROUP BY St;

-- 10. Top 10 customers by 2025 revenue, then list their July invoices
WITH Rev AS (
  SELECT es.CustomerID, SUM(es.TotalCharge) AS Revenue2025
  FROM energy_company.EnergySale es
  WHERE YEAR(es.SaleDate) = 2025
  GROUP BY es.CustomerID
),
Top10 AS (
  SELECT TOP (10) * FROM Rev ORDER BY Revenue2025 DESC
)
SELECT t.CustomerID, i.InvoiceID, i.InvoiceDate, i.AmountDue
FROM Top10 t
JOIN energy_company.Invoice i ON i.CustomerID = t.CustomerID
WHERE i.InvoiceDate BETWEEN @RefMonthStart AND @RefMonthEnd
ORDER BY t.Revenue2025 DESC, i.InvoiceDate;

-- 11. Asset share of grid per day (> 20%) in July
WITH Grid AS (
  SELECT ProductionDate, SUM(EnergyMWh) AS GridMWh
  FROM energy_company.EnergyProduction
  WHERE ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY ProductionDate
),
Joiny AS (
  SELECT ep.ProductionDate, ep.AssetID, ep.EnergyMWh, g.GridMWh
  FROM energy_company.EnergyProduction ep
  JOIN Grid g ON g.ProductionDate = ep.ProductionDate
  WHERE ep.ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
)
SELECT ProductionDate, AssetID, EnergyMWh, GridMWh,
       100.0 * EnergyMWh / NULLIF(GridMWh,0) AS SharePct
FROM Joiny
WHERE 100.0 * EnergyMWh / NULLIF(GridMWh,0) > 20
ORDER BY ProductionDate, SharePct DESC;

-- 12. Facility capacity totals then rank assets within
WITH FacTotals AS (
  SELECT FacilityID, SUM(CapacityMW) AS FT
  FROM energy_company.Asset
  GROUP BY FacilityID
),
Ranked AS (
  SELECT f.Name AS Facility, a.AssetID, a.Name AS Asset, a.CapacityMW, ft.FT,
         100.0 * a.CapacityMW / NULLIF(ft.FT,0) AS PctOfFac
  FROM energy_company.Asset a
  JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID
  JOIN FacTotals ft ON ft.FacilityID = a.FacilityID
)
SELECT * FROM Ranked ORDER BY Facility, PctOfFac DESC;
```

## Recursive CTEs
```sql
-- 1. Generate a July-2025 calendar and left join daily grid totals
WITH Cal AS (
  SELECT @RefMonthStart AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Cal WHERE D < @RefMonthEnd
),
Grid AS (
  SELECT ProductionDate, SUM(EnergyMWh) AS GridMWh
  FROM energy_company.EnergyProduction
  WHERE ProductionDate BETWEEN @RefMonthStart AND @RefMonthEnd
  GROUP BY ProductionDate
)
SELECT Cal.D, COALESCE(g.GridMWh, 0) AS GridMWh
FROM Cal
LEFT JOIN Grid g ON g.ProductionDate = Cal.D
ORDER BY Cal.D
OPTION (MAXRECURSION 1000);

-- 2. Last 30 days calendar ending @RefDate and production by asset 1
WITH Cal AS (
  SELECT DATEADD(DAY,-29,@RefDate) AS D
  UNION ALL
  SELECT DATEADD(DAY,1,D) FROM Cal WHERE D < @RefDate
)
SELECT Cal.D,
       COALESCE(SUM(ep.EnergyMWh),0) AS Asset1_MWh
FROM Cal
LEFT JOIN energy_company.EnergyProduction ep
  ON ep.ProductionDate = Cal.D AND ep.AssetID = 1
GROUP BY Cal.D
ORDER BY Cal.D
OPTION (MAXRECURSION 1000);

-- 3. Generate all month-ends in 2025
WITH M AS (
  SELECT EOMONTH('2025-01-01') AS MEnd
  UNION ALL
  SELECT EOMONTH(DATEADD(MONTH,1,MEnd)) FROM M WHERE MEnd < '2025-12-31'
)
SELECT * FROM M OPTION (MAXRECURSION 100);

-- 4. Weekly reminders for open invoices until DueDate (7-day cadence)
WITH Rem AS (
  SELECT i.InvoiceID, i.InvoiceDate, i.DueDate, DATEADD(DAY,7,i.InvoiceDate) AS RemDate
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
  UNION ALL
  SELECT r.InvoiceID, r.InvoiceDate, r.DueDate, DATEADD(DAY,7,r.RemDate)
  FROM Rem r
  WHERE DATEADD(DAY,7,r.RemDate) <= r.DueDate
)
SELECT InvoiceID, InvoiceDate, DueDate, RemDate
FROM Rem
ORDER BY InvoiceID, RemDate
OPTION (MAXRECURSION 1000);

-- 5. Generate numbers 1..31 (utility)
WITH N AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM N WHERE n < 31
)
SELECT * FROM N OPTION (MAXRECURSION 100);

-- 6. Build a simple date dimension for Q3-2025 and mark weekends
WITH Cal AS (
  SELECT CAST('2025-07-01' AS date) AS D
  UNION ALL
  SELECT DATEADD(DAY,1,D) FROM Cal WHERE D < '2025-09-30'
)
SELECT D,
       DATENAME(WEEKDAY, D) AS Wkday,
       CASE WHEN DATENAME(WEEKDAY, D) IN ('Saturday','Sunday') THEN 1 ELSE 0 END AS IsWeekend
FROM Cal
OPTION (MAXRECURSION 1000);

-- 7. Asset preventive schedule every 180 days from CommissionDate up to @RefDate+360
WITH Seeds AS (
  SELECT a.AssetID, a.Name, a.CommissionDate AS NextDate
  FROM energy_company.Asset a
  WHERE a.CommissionDate IS NOT NULL
  UNION ALL
  SELECT s.AssetID, s.Name, DATEADD(DAY,180,s.NextDate)
  FROM Seeds s
  WHERE DATEADD(DAY,180,s.NextDate) <= DATEADD(DAY,360,@RefDate)
)
SELECT AssetID, Name, NextDate AS ScheduledMaintDate
FROM Seeds
ORDER BY AssetID, NextDate
OPTION (MAXRECURSION 2000);

-- 8. For each effective rate plan, expand daily coverage within July
WITH PlanDays AS (
  SELECT rp.RatePlanID,
         CASE WHEN rp.EffectiveDate > @RefMonthStart THEN rp.EffectiveDate ELSE @RefMonthStart END AS D,
         rp.ExpirationDate
  FROM energy_company.RatePlan rp
  WHERE rp.EffectiveDate <= @RefMonthEnd
    AND (rp.ExpirationDate IS NULL OR rp.ExpirationDate >= @RefMonthStart)

  UNION ALL
  SELECT pd.RatePlanID, DATEADD(DAY,1,pd.D), pd.ExpirationDate
  FROM PlanDays pd
  WHERE DATEADD(DAY,1,pd.D) <= @RefMonthEnd
    AND (pd.ExpirationDate IS NULL OR DATEADD(DAY,1,pd.D) <= pd.ExpirationDate)
)
SELECT RatePlanID, D
FROM PlanDays
ORDER BY RatePlanID, D
OPTION (MAXRECURSION 1000);

-- 9. Generate a small hours-of-day table (0..23) and join to payments made today (illustrative)
WITH H AS (
  SELECT 0 AS h
  UNION ALL
  SELECT h+1 FROM H WHERE h < 23
)
SELECT H.h AS HourOfDay, COUNT(p.PaymentID) AS Payments
FROM H
LEFT JOIN energy_company.Payment p
  ON CAST(p.PaymentDate AS date) = CAST(GETDATE() AS date)  -- date-only in sample
GROUP BY H.h
ORDER BY H.h
OPTION (MAXRECURSION 100);

-- 10. Produce the next 4 Fridays from @RefDate
WITH F AS (
  SELECT CASE WHEN DATENAME(WEEKDAY,@RefDate)='Friday' THEN @RefDate
              ELSE DATEADD(DAY,( (7 + 5 - DATEPART(WEEKDAY,@RefDate)) % 7 ), @RefDate) END AS D, 1 AS k
  UNION ALL
  SELECT DATEADD(DAY,7,D), k+1 FROM F WHERE k < 4
)
SELECT k AS Seq, D AS FridayDate FROM F OPTION (MAXRECURSION 10);

-- 11. Generate month sequence from the earliest sale month to @RefDate month
WITH Seed AS (
  SELECT EOMONTH(MIN(SaleDate)) AS MEnd FROM energy_company.EnergySale
),
Months AS (
  SELECT (SELECT MEnd FROM Seed) AS MEnd
  UNION ALL
  SELECT EOMONTH(DATEADD(MONTH,1,MEnd)) FROM Months WHERE MEnd < EOMONTH(@RefDate)
)
SELECT * FROM Months OPTION (MAXRECURSION 200);

-- 12. Rolling “next due check dates” every 15 days for all open invoices
WITH DueRoll AS (
  SELECT i.InvoiceID, i.InvoiceDate, i.DueDate,
         DATEADD(DAY,15,i.InvoiceDate) AS CheckDate
  FROM energy_company.Invoice i
  WHERE i.Status = 'Open'
  UNION ALL
  SELECT dr.InvoiceID, dr.InvoiceDate, dr.DueDate,
         DATEADD(DAY,15,dr.CheckDate)
  FROM DueRoll dr
  WHERE DATEADD(DAY,15,dr.CheckDate) <= dr.DueDate
)
SELECT InvoiceID, InvoiceDate, DueDate, CheckDate
FROM DueRoll
ORDER BY InvoiceID, CheckDate
OPTION (MAXRECURSION 2000);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
