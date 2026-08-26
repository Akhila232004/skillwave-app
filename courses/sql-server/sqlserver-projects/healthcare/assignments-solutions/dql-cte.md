![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## CTE
```sql
-- 1. July appointments with simple CTE, then count by status
WITH JulyAppts AS (
  SELECT AppointmentID, PatientID, ProviderID, ApptDateTime, Status
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
)
SELECT COALESCE(Status,'(None)') AS Status, COUNT(*) AS Cnt
FROM JulyAppts
GROUP BY COALESCE(Status,'(None)')
ORDER BY Cnt DESC;

-- 2. Active policies today
WITH ActivePolicy AS (
  SELECT PolicyID, PatientID, InsurerName, EffectiveDate, ExpirationDate
  FROM healthcare.InsurancePolicy
  WHERE EffectiveDate <= @Today AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
)
SELECT * FROM ActivePolicy;

-- 3. Claim + total paid + balance by claim
WITH PayByClaim AS (
  SELECT p.ClaimID, SUM(p.AmountPaid) AS TotalPaid
  FROM healthcare.Payment p
  GROUP BY p.ClaimID
)
SELECT c.ClaimID, c.PatientID, c.TotalCharge, COALESCE(pb.TotalPaid,0) AS TotalPaid,
       c.TotalCharge - COALESCE(pb.TotalPaid,0) AS Balance
FROM healthcare.Claim c
LEFT JOIN PayByClaim pb ON pb.ClaimID = c.ClaimID
ORDER BY Balance DESC, c.ClaimID;

-- 4. Patient ages (approx) with CTE
WITH PatientAge AS (
  SELECT PatientID, FirstName, LastName, DOB, DATEDIFF(YEAR, DOB, @Today) AS AgeYears
  FROM healthcare.Patient
)
SELECT * FROM PatientAge ORDER BY AgeYears DESC, PatientID;

-- 5. Latest lab result per LabOrder (ROW_NUMBER in CTE)
WITH LR AS (
  SELECT lr.*, ROW_NUMBER() OVER (PARTITION BY lr.LabOrderID ORDER BY lr.ResultDate DESC, lr.LabResultID DESC) AS rn
  FROM healthcare.LabResult lr
)
SELECT LabOrderID, LabResultID, TestName, ResultDate, ResultValue
FROM LR WHERE rn = 1;

-- 6. Provider July appointment counts
WITH PJuly AS (
  SELECT ProviderID FROM healthcare.Appointment WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
)
SELECT ProviderID, COUNT(*) AS JulyApptCount
FROM PJuly
GROUP BY ProviderID
ORDER BY JulyApptCount DESC, ProviderID;

-- 7. Active prescriptions today with medication info
WITH ActiveRx AS (
  SELECT pr.PrescriptionID, pr.PatientID, pr.ProviderID, pr.MedicationID,
         pr.StartDate, pr.EndDate
  FROM healthcare.Prescription pr
  WHERE pr.StartDate <= @Today AND (pr.EndDate IS NULL OR pr.EndDate >= @Today)
)
SELECT ar.*, m.Name AS MedicationName, m.Strength, m.Form
FROM ActiveRx ar
JOIN healthcare.Medication m ON m.MedicationID = ar.MedicationID;

-- 8. Lab turnaround (minutes) – top 20 slowest
WITH TAT AS (
  SELECT lr.LabResultID, lo.PatientID, lo.ProviderID,
         lo.OrderDate, lr.ResultDate,
         DATEDIFF(MINUTE, lo.OrderDate, lr.ResultDate) AS MinutesToResult
  FROM healthcare.LabOrder lo
  JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
)
SELECT TOP (20) * FROM TAT
ORDER BY MinutesToResult DESC, LabResultID;

-- 9. Appointments by weekday in July
WITH JulyAppts AS (
  SELECT ApptDateTime FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
)
SELECT DATENAME(WEEKDAY, ApptDateTime) AS WeekdayName, COUNT(*) AS Cnt
FROM JulyAppts
GROUP BY DATENAME(WEEKDAY, ApptDateTime), DATEPART(WEEKDAY, ApptDateTime)
ORDER BY DATEPART(WEEKDAY, MAX(ApptDateTime));

-- 10. Top 10 cities by patient count
WITH CityCounts AS (
  SELECT a.City, COUNT(*) AS PatientCnt
  FROM healthcare.Patient p JOIN healthcare.Address a ON a.AddressID = p.AddressID
  GROUP BY a.City
)
SELECT TOP (10) * FROM CityCounts ORDER BY PatientCnt DESC, City;

-- 11. First appointment date per patient (MIN in CTE)
WITH FirstAppt AS (
  SELECT PatientID, MIN(CAST(ApptDateTime AS date)) AS FirstApptDate
  FROM healthcare.Appointment
  GROUP BY PatientID
)
SELECT * FROM FirstAppt ORDER BY FirstApptDate, PatientID;

-- 12. Daily claim totals in July
WITH JulyClaims AS (
  SELECT CAST(ClaimDate AS date) AS D, SUM(TotalCharge) AS DayTotal$
  FROM healthcare.Claim
  WHERE ClaimDate BETWEEN @RefStart AND @RefEnd
  GROUP BY CAST(ClaimDate AS date)
)
SELECT * FROM JulyClaims ORDER BY D;
```

## Using Multiple CTEs
```sql
-- 1. July -> Completed -> counts per provider
WITH July AS (
  SELECT AppointmentID, ProviderID, Status
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
),
Completed AS (
  SELECT ProviderID FROM July WHERE Status = 'Completed'
)
SELECT ProviderID, COUNT(*) AS CompletedJuly
FROM Completed
GROUP BY ProviderID
ORDER BY CompletedJuly DESC, ProviderID;

-- 2. Patients with ≥ 3 July appointments
WITH July AS (
  SELECT PatientID FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
),
Agg AS (
  SELECT PatientID, COUNT(*) AS Cnt FROM July GROUP BY PatientID
)
SELECT PatientID, Cnt
FROM Agg
WHERE Cnt >= 3
ORDER BY Cnt DESC, PatientID;

-- 3. Claim/payments/balance + bucket
WITH Paid AS (
  SELECT ClaimID, SUM(AmountPaid) AS Paid$ FROM healthcare.Payment GROUP BY ClaimID
),
Bal AS (
  SELECT c.ClaimID, c.PatientID, c.TotalCharge, COALESCE(p.Paid$,0) AS Paid$,
         c.TotalCharge - COALESCE(p.Paid$,0) AS Balance$
  FROM healthcare.Claim c LEFT JOIN Paid p ON p.ClaimID = c.ClaimID
),
Bucket AS (
  SELECT *, CASE
              WHEN Balance$ = 0 THEN 'Paid'
              WHEN Balance$ <= 100 THEN '<=100'
              WHEN Balance$ <= 500 THEN '<=500'
              ELSE '>500'
            END AS BalanceBucket
  FROM Bal
)
SELECT BalanceBucket, COUNT(*) AS Claims
FROM Bucket
GROUP BY BalanceBucket
ORDER BY CASE BalanceBucket WHEN 'Paid' THEN 0 WHEN '<=100' THEN 1 WHEN '<=500' THEN 2 ELSE 3 END;

-- 4. Active policy patients → July claims for those patients
WITH ActivePol AS (
  SELECT DISTINCT PatientID
  FROM healthcare.InsurancePolicy
  WHERE EffectiveDate <= @Today AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
),
JulyClaims AS (
  SELECT PatientID, SUM(TotalCharge) AS July$ FROM healthcare.Claim
  WHERE ClaimDate BETWEEN @RefStart AND @RefEnd
  GROUP BY PatientID
)
SELECT ap.PatientID, COALESCE(jc.July$,0) AS July$
FROM ActivePol ap
LEFT JOIN JulyClaims jc ON jc.PatientID = ap.PatientID
ORDER BY July$ DESC, ap.PatientID;

-- 5. Lab TAT per provider → rank by avg minutes
WITH JoinLR AS (
  SELECT lo.ProviderID, lo.OrderDate, lr.ResultDate,
         DATEDIFF(MINUTE, lo.OrderDate, lr.ResultDate) AS MinToResult
  FROM healthcare.LabOrder lo
  JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
  WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd
),
Agg AS (
  SELECT ProviderID, AVG(MinToResult*1.0) AS AvgMinToResult
  FROM JoinLR GROUP BY ProviderID
),
Ranked AS (
  SELECT ProviderID, AvgMinToResult,
         RANK() OVER (ORDER BY AvgMinToResult ASC) AS FastestRank
  FROM Agg
)
SELECT TOP (10) * FROM Ranked ORDER BY FastestRank, ProviderID;

-- 6. Appointment gaps > 30 days per patient
WITH A AS (
  SELECT PatientID, ApptDateTime,
         ROW_NUMBER() OVER (PARTITION BY PatientID ORDER BY ApptDateTime) AS rn
  FROM healthcare.Appointment
),
Pairs AS (
  SELECT cur.PatientID, cur.ApptDateTime AS CurrAppt, prev.ApptDateTime AS PrevAppt
  FROM A cur
  LEFT JOIN A prev
    ON prev.PatientID = cur.PatientID AND prev.rn = cur.rn - 1
)
SELECT PatientID, PrevAppt, CurrAppt, DATEDIFF(DAY, PrevAppt, CurrAppt) AS GapDays
FROM Pairs
WHERE PrevAppt IS NOT NULL AND DATEDIFF(DAY, PrevAppt, CurrAppt) > 30
ORDER BY GapDays DESC, PatientID;

-- 7. Overlapping prescriptions per patient (same time window)
WITH Rx AS (
  SELECT PatientID, PrescriptionID, StartDate, COALESCE(EndDate, '9999-12-31') AS EndDate
  FROM healthcare.Prescription
),
Pairs AS (
  SELECT r1.PatientID, r1.PrescriptionID AS Rx1, r2.PrescriptionID AS Rx2,
         r1.StartDate AS S1, r1.EndDate AS E1, r2.StartDate AS S2, r2.EndDate AS E2
  FROM Rx r1
  JOIN Rx r2 ON r2.PatientID = r1.PatientID AND r2.PrescriptionID > r1.PrescriptionID
)
SELECT PatientID, Rx1, Rx2
FROM Pairs
WHERE S1 <= E2 AND S2 <= E1
ORDER BY PatientID, Rx1, Rx2;

-- 8. Provider July metrics: completed appts + distinct patients
WITH July AS (
  SELECT * FROM healthcare.Appointment WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
),
Completed AS (
  SELECT ProviderID, COUNT(*) AS CompletedCnt
  FROM July WHERE Status = 'Completed' GROUP BY ProviderID
),
DistinctPts AS (
  SELECT ProviderID, COUNT(DISTINCT PatientID) AS DistPatients
  FROM July GROUP BY ProviderID
)
SELECT COALESCE(c.ProviderID, d.ProviderID) AS ProviderID,
       COALESCE(c.CompletedCnt,0) AS CompletedCnt,
       COALESCE(d.DistPatients,0) AS DistPatients
FROM Completed c
FULL JOIN DistinctPts d ON d.ProviderID = c.ProviderID
ORDER BY CompletedCnt DESC, DistPatients DESC, ProviderID;

-- 9. Day-of-month appointment histogram for July
WITH Days AS (
  SELECT CAST(ApptDateTime AS date) AS D
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
),
Agg AS (
  SELECT DAY(D) AS DayNum, COUNT(*) AS ApptCnt
  FROM Days GROUP BY DAY(D)
)
SELECT DayNum, ApptCnt FROM Agg ORDER BY DayNum;

-- 10. Policy durations → categorize
WITH Dur AS (
  SELECT PolicyID, PatientID,
         DATEDIFF(DAY, EffectiveDate, COALESCE(ExpirationDate, @Today)) AS DurationDays
  FROM healthcare.InsurancePolicy
),
Bucket AS (
  SELECT *, CASE
              WHEN DurationDays < 90 THEN '<90d'
              WHEN DurationDays <= 180 THEN '90-180d'
              ELSE '>180d'
            END AS DurBucket
  FROM Dur
)
SELECT DurBucket, COUNT(*) AS Policies
FROM Bucket
GROUP BY DurBucket
ORDER BY CASE DurBucket WHEN '<90d' THEN 0 WHEN '90-180d' THEN 1 ELSE 2 END;

-- 11. Combined patient KPIs: appts, claims, prescriptions
WITH Ap AS (
  SELECT PatientID, COUNT(*) AS ApptCnt FROM healthcare.Appointment GROUP BY PatientID
),
Cl AS (
  SELECT PatientID, COUNT(*) AS ClaimCnt, SUM(TotalCharge) AS Claim$
  FROM healthcare.Claim GROUP BY PatientID
),
Rx AS (
  SELECT PatientID, COUNT(*) AS RxCnt FROM healthcare.Prescription GROUP BY PatientID
)
SELECT COALESCE(a.PatientID, c.PatientID, r.PatientID) AS PatientID,
       COALESCE(a.ApptCnt,0) AS ApptCnt,
       COALESCE(c.ClaimCnt,0) AS ClaimCnt,
       COALESCE(c.Claim$,0)  AS Claim$,
       COALESCE(r.RxCnt,0)   AS RxCnt
FROM Ap a
FULL JOIN Cl c ON c.PatientID = a.PatientID
FULL JOIN Rx r ON r.PatientID = COALESCE(a.PatientID, c.PatientID)
ORDER BY Claim$ DESC, ApptCnt DESC, PatientID;

-- 12. Top 5 providers by July completed rate (completed / total)
WITH July AS (
  SELECT ProviderID, Status FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
),
Agg AS (
  SELECT ProviderID,
         SUM(CASE WHEN Status='Completed' THEN 1 ELSE 0 END) AS CompletedCnt,
         COUNT(*) AS TotalCnt
  FROM July GROUP BY ProviderID
)
SELECT TOP (5) ProviderID,
       CompletedCnt, TotalCnt,
       CAST(100.0*CompletedCnt/NULLIF(TotalCnt,0) AS decimal(5,2)) AS CompletedRatePct
FROM Agg
ORDER BY CompletedRatePct DESC, CompletedCnt DESC, ProviderID;
```

## Recursive CTEs
```sql
-- 1. Calendar days in July 2025 + appointment counts
WITH Days AS (
  SELECT @RefStart AS D
  UNION ALL
  SELECT DATEADD(DAY, 1, D) FROM Days WHERE D < @RefEnd
),
ApCounts AS (
  SELECT CAST(ApptDateTime AS date) AS D, COUNT(*) AS ApptCnt
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY CAST(ApptDateTime AS date)
)
SELECT d.D, COALESCE(a.ApptCnt,0) AS ApptCnt
FROM Days d LEFT JOIN ApCounts a ON a.D = d.D
ORDER BY d.D
OPTION (MAXRECURSION 0);

-- 2. Hours 0..23 today + appointments per hour
WITH Hours AS (
  SELECT 0 AS H
  UNION ALL
  SELECT H+1 FROM Hours WHERE H < 23
)
SELECT h.H AS HourOfDay,
       COUNT(*) AS Appts
FROM Hours h
LEFT JOIN healthcare.Appointment ap
  ON CAST(ap.ApptDateTime AS date) = @Today AND DATEPART(HOUR, ap.ApptDateTime) = h.H
GROUP BY h.H
ORDER BY h.H
OPTION (MAXRECURSION 24);

-- 3. Month series for 2025 + claim totals
WITH Months AS (
  SELECT CAST('2025-01-01' AS date) AS M
  UNION ALL
  SELECT DATEADD(MONTH, 1, M) FROM Months WHERE M < '2025-12-01'
),
Claims AS (
  SELECT DATEFROMPARTS(2025, MONTH(ClaimDate), 1) AS M, SUM(TotalCharge) AS Total$
  FROM healthcare.Claim WHERE YEAR(ClaimDate)=2025
  GROUP BY DATEFROMPARTS(2025, MONTH(ClaimDate), 1)
)
SELECT m.M, COALESCE(c.Total$,0) AS Total$
FROM Months m LEFT JOIN Claims c ON c.M = m.M
ORDER BY m.M
OPTION (MAXRECURSION 12);

-- 4. Weekly windows from @RefStart stepping 7 days (till @RefEnd)
WITH Weeks AS (
  SELECT @RefStart AS WStart, DATEADD(DAY, 6, @RefStart) AS WEnd
  UNION ALL
  SELECT DATEADD(DAY, 7, WStart), DATEADD(DAY, 13, WStart)
  FROM Weeks WHERE DATEADD(DAY, 7, WStart) <= @RefEnd
)
SELECT WStart, WEnd,
       (SELECT COUNT(*) FROM healthcare.Claim c
         WHERE c.ClaimDate BETWEEN WStart AND WEnd) AS ClaimsInWeek
FROM Weeks
ORDER BY WStart
OPTION (MAXRECURSION 60);

-- 5. Cumulative payments per claim (ordered) using recursive row chain
WITH P AS (
  SELECT p.ClaimID, p.PaymentID, p.PaymentDate, p.AmountPaid,
         ROW_NUMBER() OVER (PARTITION BY p.ClaimID ORDER BY p.PaymentDate, p.PaymentID) AS rn
  FROM healthcare.Payment p
),
R AS (
  SELECT ClaimID, PaymentID, PaymentDate, AmountPaid, rn, AmountPaid AS CumPaid
  FROM P WHERE rn = 1
  UNION ALL
  SELECT p.ClaimID, p.PaymentID, p.PaymentDate, p.AmountPaid, p.rn,
         r.CumPaid + p.AmountPaid
  FROM R
  JOIN P p ON p.ClaimID = R.ClaimID AND p.rn = R.rn + 1
)
SELECT ClaimID, PaymentID, PaymentDate, AmountPaid, rn, CumPaid
FROM R
ORDER BY ClaimID, rn
OPTION (MAXRECURSION 0);

-- 6. Next 12 months from today
WITH NextMonths AS (
  SELECT DATEFROMPARTS(YEAR(@Today), MONTH(@Today), 1) AS M, 1 AS n
  UNION ALL
  SELECT DATEADD(MONTH, 1, M), n+1 FROM NextMonths WHERE n < 12
)
SELECT M FROM NextMonths ORDER BY M OPTION (MAXRECURSION 12);

-- 7. Expand policy coverage by months (cap at @Today if open)
WITH Pol AS (
  SELECT PolicyID, EffectiveDate,
         COALESCE(ExpirationDate, @Today) AS EndDate
  FROM healthcare.InsurancePolicy
),
Span AS (
  SELECT PolicyID,
         DATEFROMPARTS(YEAR(EffectiveDate), MONTH(EffectiveDate), 1) AS M,
         DATEFROMPARTS(YEAR(EndDate), MONTH(EndDate), 1) AS MEnd
  FROM Pol
),
Explode AS (
  SELECT PolicyID, M, MEnd
  FROM Span
  UNION ALL
  SELECT PolicyID, DATEADD(MONTH, 1, M), MEnd
  FROM Explode
  WHERE DATEADD(MONTH, 1, M) <= MEnd
)
SELECT PolicyID, M AS CoverageMonth
FROM Explode
ORDER BY PolicyID, M
OPTION (MAXRECURSION 0);

-- 8. Expand prescription days within July (patient-days on therapy)
WITH Rx AS (
  SELECT PrescriptionID, PatientID,
         CASE WHEN StartDate < @RefStart THEN @RefStart ELSE StartDate END AS S,
         CASE WHEN COALESCE(EndDate, @RefEnd) > @RefEnd THEN @RefEnd ELSE COALESCE(EndDate, @RefEnd) END AS E
  FROM healthcare.Prescription
  WHERE COALESCE(EndDate, @RefEnd) >= @RefStart AND StartDate <= @RefEnd
),
Days AS (
  SELECT PrescriptionID, PatientID, S AS D, E
  FROM Rx
  UNION ALL
  SELECT PrescriptionID, PatientID, DATEADD(DAY,1,D), E
  FROM Days WHERE DATEADD(DAY,1,D) <= E
)
SELECT PatientID, COUNT(*) AS TherapyDaysInJuly
FROM Days
GROUP BY PatientID
ORDER BY TherapyDaysInJuly DESC, PatientID
OPTION (MAXRECURSION 0);

-- 9. Last 10 calendar days from @Today backwards + lab order counts
WITH LastDays AS (
  SELECT @Today AS D, 1 AS n
  UNION ALL
  SELECT DATEADD(DAY, -1, D), n+1 FROM LastDays WHERE n < 10
)
SELECT D, (SELECT COUNT(*) FROM healthcare.LabOrder lo WHERE CAST(lo.OrderDate AS date) = D) AS LabOrders
FROM LastDays
ORDER BY D DESC
OPTION (MAXRECURSION 10);

-- 10. Next 15 business days (skip Sat/Sun)
WITH Days AS (
  SELECT @Today AS D, 0 AS cnt
  UNION ALL
  SELECT DATEADD(DAY, 1, D),
         cnt + CASE WHEN DATENAME(WEEKDAY, DATEADD(DAY, 1, D)) IN ('Saturday','Sunday') THEN 0 ELSE 1 END
  FROM Days
  WHERE cnt < 15
)
SELECT TOP (15) D AS BusinessDay
FROM Days
WHERE DATENAME(WEEKDAY, D) NOT IN ('Saturday','Sunday')
ORDER BY D
OPTION (MAXRECURSION 1000);

-- 11. Quarter series for 2025 + claim totals by quarter
WITH Qtrs AS (
  SELECT CAST('2025-01-01' AS date) AS QStart, 1 AS Qn
  UNION ALL
  SELECT DATEADD(QUARTER, 1, QStart), Qn+1 FROM Qtrs WHERE Qn < 4
),
Agg AS (
  SELECT DATEPART(QUARTER, ClaimDate) AS Qn, SUM(TotalCharge) AS Total$
  FROM healthcare.Claim WHERE YEAR(ClaimDate)=2025
  GROUP BY DATEPART(QUARTER, ClaimDate)
)
SELECT q.Qn, q.QStart, COALESCE(a.Total$,0) AS Total$
FROM Qtrs q LEFT JOIN Agg a ON a.Qn = q.Qn
ORDER BY q.Qn
OPTION (MAXRECURSION 4);

-- 12. Generate 1..N (N=25) and use to return top-N claims by amount
DECLARE @N int = 25;
WITH Nums AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM Nums WHERE n+1 <= @N
)
SELECT TOP (@N) c.*
FROM healthcare.Claim c
ORDER BY c.TotalCharge DESC, c.ClaimID
OPTION (MAXRECURSION 0);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
