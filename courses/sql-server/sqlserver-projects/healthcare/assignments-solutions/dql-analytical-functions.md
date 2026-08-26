![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Aggregate Functions
```sql
-- 1. Total appointments per patient (repeated on each of their rows)
SELECT ap.PatientID, ap.AppointmentID,
       COUNT(*) OVER (PARTITION BY ap.PatientID) AS ApptCountPerPatient
FROM healthcare.Appointment ap;

-- 2. July appointments per provider
SELECT ap.AppointmentID, ap.ProviderID,
       COUNT(*) OVER (PARTITION BY ap.ProviderID) AS JulyApptsPerProvider
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 3. Total claim charge per patient (lifetime)
SELECT c.ClaimID, c.PatientID, c.TotalCharge,
       SUM(c.TotalCharge) OVER (PARTITION BY c.PatientID) AS PatientTotalClaim$
FROM healthcare.Claim c;

-- 4. Total payment per claim (lifetime)
SELECT p.PaymentID, p.ClaimID, p.AmountPaid,
       SUM(p.AmountPaid) OVER (PARTITION BY p.ClaimID) AS ClaimPaid$
FROM healthcare.Payment p;

-- 5. Average lab result by TestName (repeat per row)
SELECT lr.LabResultID, lr.TestName, lr.ResultValue,
       AVG(lr.ResultValue) OVER (PARTITION BY lr.TestName) AS AvgByTest
FROM healthcare.LabResult lr;

-- 6. Running (cumulative) charges per patient by ClaimDate
SELECT c.PatientID, c.ClaimID, c.ClaimDate, c.TotalCharge,
       SUM(c.TotalCharge) OVER (
         PARTITION BY c.PatientID
         ORDER BY c.ClaimDate, c.ClaimID
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningCharge$
FROM healthcare.Claim c;

-- 7. Running appointment count per provider (chronological)
SELECT ap.ProviderID, ap.AppointmentID, ap.ApptDateTime,
       COUNT(*) OVER (
         PARTITION BY ap.ProviderID
         ORDER BY ap.ApptDateTime, ap.AppointmentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningApptCnt
FROM healthcare.Appointment ap;

-- 8. Claim amount as % of patient’s total
SELECT c.PatientID, c.ClaimID, c.TotalCharge,
       100.0 * c.TotalCharge
       / NULLIF(SUM(c.TotalCharge) OVER (PARTITION BY c.PatientID), 0) AS PctOfPatientTotal
FROM healthcare.Claim c;

-- 9. 3-point moving average of lab value per patient+test (current & 2 prev)
SELECT lo.PatientID, lr.LabResultID, lr.TestName, lr.ResultDate, lr.ResultValue,
       AVG(lr.ResultValue) OVER (
         PARTITION BY lo.PatientID, lr.TestName
         ORDER BY lr.ResultDate, lr.LabResultID
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS MA3
FROM healthcare.LabOrder lo
JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID;

-- 10. Min/Max claim per patient (on each claim row)
SELECT c.PatientID, c.ClaimID, c.TotalCharge,
       MIN(c.TotalCharge) OVER (PARTITION BY c.PatientID) AS MinClaim$,
       MAX(c.TotalCharge) OVER (PARTITION BY c.PatientID) AS MaxClaim$
FROM healthcare.Claim c;
```

## ROW_NUMBER()
```sql
-- 1. Latest appointment per patient
WITH ApptRN AS (
  SELECT ap.*, ROW_NUMBER() OVER (
           PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime DESC, ap.AppointmentID DESC) AS rn
  FROM healthcare.Appointment ap
)
SELECT * FROM ApptRN WHERE rn = 1;

-- 2. Top 3 prescriptions per patient by StartDate
WITH RxRN AS (
  SELECT pr.*, ROW_NUMBER() OVER (
           PARTITION BY pr.PatientID ORDER BY pr.StartDate DESC, pr.PrescriptionID DESC) AS rn
  FROM healthcare.Prescription pr
)
SELECT * FROM RxRN WHERE rn <= 3 ORDER BY PatientID, rn;

-- 3. Latest lab result per LabOrder
WITH LR AS (
  SELECT lr.*, ROW_NUMBER() OVER (
           PARTITION BY lr.LabOrderID ORDER BY lr.ResultDate DESC, lr.LabResultID DESC) AS rn
  FROM healthcare.LabResult lr
)
SELECT * FROM LR WHERE rn = 1;

-- 4. First diagnosis per patient
WITH DxRN AS (
  SELECT mr.PatientID, dx.*, ROW_NUMBER() OVER (
           PARTITION BY mr.PatientID ORDER BY dx.DiagnosedDate ASC, dx.DiagnosisID ASC) AS rn
  FROM healthcare.Diagnosis dx
  JOIN healthcare.MedicalRecord mr ON mr.RecordID = dx.RecordID
)
SELECT * FROM DxRN WHERE rn = 1;

-- 5. First policy per patient by EffectiveDate
WITH PolRN AS (
  SELECT ip.*, ROW_NUMBER() OVER (
           PARTITION BY ip.PatientID ORDER BY ip.EffectiveDate ASC, ip.PolicyID ASC) AS rn
  FROM healthcare.InsurancePolicy ip
)
SELECT * FROM PolRN WHERE rn = 1;

-- 6. Most recent appointment per provider+room
WITH PRoom AS (
  SELECT ap.*, ROW_NUMBER() OVER (
           PARTITION BY ap.ProviderID, ap.Location
           ORDER BY ap.ApptDateTime DESC, ap.AppointmentID DESC) AS rn
  FROM healthcare.Appointment ap
)
SELECT * FROM PRoom WHERE rn = 1;

-- 7. Deduplicate patients by Email (keep smallest PatientID)
WITH P AS (
  SELECT p.*, ROW_NUMBER() OVER (
           PARTITION BY p.Email ORDER BY p.PatientID ASC) AS rn
  FROM healthcare.Patient p
  WHERE p.Email IS NOT NULL
)
SELECT * FROM P WHERE rn = 1;

-- 8. First two claims of 2025 per patient
WITH C AS (
  SELECT c.*, ROW_NUMBER() OVER (
           PARTITION BY c.PatientID ORDER BY c.ClaimDate ASC, c.ClaimID ASC) AS rn
  FROM healthcare.Claim c
  WHERE YEAR(c.ClaimDate) = 2025
)
SELECT * FROM C WHERE rn <= 2 ORDER BY PatientID, rn;

-- 9. Appointment sequence number per patient
SELECT ap.PatientID, ap.AppointmentID, ap.ApptDateTime,
       ROW_NUMBER() OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID) AS SeqNo
FROM healthcare.Appointment ap;

-- 10. Latest payment per claim
WITH PayRN AS (
  SELECT p.*, ROW_NUMBER() OVER (
           PARTITION BY p.ClaimID ORDER BY p.PaymentDate DESC, p.PaymentID DESC) AS rn
  FROM healthcare.Payment p
)
SELECT * FROM PayRN WHERE rn = 1;
```

## RANK()
```sql
-- 1. Rank providers by July appointment count
WITH P AS (
  SELECT ap.ProviderID, COUNT(*) AS JulyCnt
  FROM healthcare.Appointment ap
  WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY ap.ProviderID
)
SELECT ProviderID, JulyCnt,
       RANK() OVER (ORDER BY JulyCnt DESC) AS RankByAppts
FROM P
ORDER BY RankByAppts, ProviderID;

-- 2. Rank patients by total July claim charges
WITH C AS (
  SELECT c.PatientID, SUM(c.TotalCharge) AS July$
  FROM healthcare.Claim c
  WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
  GROUP BY c.PatientID
)
SELECT PatientID, July$,
       RANK() OVER (ORDER BY July$ DESC) AS RankBy$
FROM C
ORDER BY RankBy$, PatientID;

-- 3. Rank test names by average value (overall)
WITH T AS (
  SELECT lr.TestName, AVG(lr.ResultValue) AS AvgVal
  FROM healthcare.LabResult lr
  GROUP BY lr.TestName
)
SELECT TestName, AvgVal,
       RANK() OVER (ORDER BY AvgVal DESC) AS RankAvg
FROM T;

-- 4. Rank departments by number of providers
WITH D AS (
  SELECT d.DepartmentID, d.Name, COUNT(pr.ProviderID) AS ProvCnt
  FROM healthcare.Department d
  LEFT JOIN healthcare.Provider pr ON pr.DepartmentID = d.DepartmentID
  GROUP BY d.DepartmentID, d.Name
)
SELECT *, RANK() OVER (ORDER BY ProvCnt DESC) AS RankByProv
FROM D;

-- 5. Rank policies by total claim charges
WITH P AS (
  SELECT c.PolicyID, SUM(c.TotalCharge) AS Total$
  FROM healthcare.Claim c
  GROUP BY c.PolicyID
)
SELECT PolicyID, Total$,
       RANK() OVER (ORDER BY Total$ DESC) AS RankByTotal
FROM P;

-- 6. Rank providers by average minutes to result (lower is better)
WITH X AS (
  SELECT pr.ProviderID,
         AVG(DATEDIFF(MINUTE, lo.OrderDate, lr.ResultDate) * 1.0) AS AvgMin
  FROM healthcare.LabOrder lo
  JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
  JOIN healthcare.Provider pr  ON pr.ProviderID = lo.ProviderID
  GROUP BY pr.ProviderID
)
SELECT ProviderID, AvgMin,
       RANK() OVER (ORDER BY AvgMin ASC) AS RankFastest
FROM X;

-- 7. Rank patients by count of July lab orders
WITH P AS (
  SELECT lo.PatientID, COUNT(*) AS OrdersJuly
  FROM healthcare.LabOrder lo
  WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY lo.PatientID
)
SELECT *, RANK() OVER (ORDER BY OrdersJuly DESC) AS RankByOrders
FROM P;

-- 8. Rank providers by total payments received (via their claims)
WITH X AS (
  SELECT c.ProviderID, SUM(p.AmountPaid) AS Paid$
  FROM healthcare.Payment p
  JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID
  GROUP BY c.ProviderID
)
SELECT ProviderID, Paid$,
       RANK() OVER (ORDER BY Paid$ DESC) AS RankByPaid
FROM X;

-- 9. Rank cities by number of patients
WITH C AS (
  SELECT a.City, COUNT(*) AS PatientCnt
  FROM healthcare.Patient p
  JOIN healthcare.Address a ON a.AddressID = p.AddressID
  GROUP BY a.City
)
SELECT City, PatientCnt,
       RANK() OVER (ORDER BY PatientCnt DESC) AS RankByPatients
FROM C;

-- 10. Rank medications by active prescription count (today)
WITH M AS (
  SELECT prx.MedicationID, COUNT(*) AS ActiveCnt
  FROM healthcare.Prescription prx
  WHERE prx.StartDate <= @Today AND (prx.EndDate IS NULL OR prx.EndDate >= @Today)
  GROUP BY prx.MedicationID
)
SELECT MedicationID, ActiveCnt,
       RANK() OVER (ORDER BY ActiveCnt DESC) AS RankByActive
FROM M;
```

## DENSE_RANK()
```sql
-- 1. Dense rank claim amounts within each patient (highest first)
SELECT c.PatientID, c.ClaimID, c.TotalCharge,
       DENSE_RANK() OVER (PARTITION BY c.PatientID ORDER BY c.TotalCharge DESC) AS DenseRankAmt
FROM healthcare.Claim c
ORDER BY c.PatientID, DenseRankAmt, c.ClaimID;

-- 2. Dense rank daily appointment counts per provider
WITH D AS (
  SELECT ap.ProviderID, CAST(ap.ApptDateTime AS date) AS D, COUNT(*) AS Cnt
  FROM healthcare.Appointment ap
  GROUP BY ap.ProviderID, CAST(ap.ApptDateTime AS date)
)
SELECT ProviderID, D, Cnt,
       DENSE_RANK() OVER (PARTITION BY ProviderID ORDER BY Cnt DESC) AS DR_DayLoad
FROM D;

-- 3. Dense rank lab result values per (patient,test)
WITH X AS (
  SELECT lo.PatientID, lr.TestName, lr.ResultDate, lr.ResultValue
  FROM healthcare.LabOrder lo
  JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
)
SELECT *, DENSE_RANK() OVER (
         PARTITION BY PatientID, TestName ORDER BY ResultValue DESC) AS DR_Value
FROM X;

-- 4. Dense rank providers by total claim charges
WITH P AS (
  SELECT c.ProviderID, SUM(c.TotalCharge) AS Total$
  FROM healthcare.Claim c
  GROUP BY c.ProviderID
)
SELECT ProviderID, Total$,
       DENSE_RANK() OVER (ORDER BY Total$ DESC) AS DR_ByTotal
FROM P;

-- 5. Dense rank medications by number of prescriptions
WITH M AS (
  SELECT prx.MedicationID, COUNT(*) AS RxCnt
  FROM healthcare.Prescription prx
  GROUP BY prx.MedicationID
)
SELECT MedicationID, RxCnt,
       DENSE_RANK() OVER (ORDER BY RxCnt DESC) AS DR_ByRx
FROM M;

-- 6. Dense rank patients by first appointment date
WITH A AS (
  SELECT ap.PatientID, MIN(CAST(ap.ApptDateTime AS date)) AS FirstAppt
  FROM healthcare.Appointment ap
  GROUP BY ap.PatientID
)
SELECT PatientID, FirstAppt,
       DENSE_RANK() OVER (ORDER BY FirstAppt ASC) AS DR_FirstSeen
FROM A;

-- 7. Dense rank insurers by average claim
WITH I AS (
  SELECT ip.InsurerName, AVG(c.TotalCharge) AS Avg$
  FROM healthcare.Claim c
  JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID
  GROUP BY ip.InsurerName
)
SELECT InsurerName, Avg$,
       DENSE_RANK() OVER (ORDER BY Avg$ DESC) AS DR_Avg
FROM I;

-- 8. Dense rank cities by patient count
WITH C AS (
  SELECT a.City, COUNT(*) AS Cnt
  FROM healthcare.Patient p JOIN healthcare.Address a ON a.AddressID = p.AddressID
  GROUP BY a.City
)
SELECT City, Cnt, DENSE_RANK() OVER (ORDER BY Cnt DESC) AS DR_City
FROM C;

-- 9. Dense rank providers by distinct patients seen in July
WITH P AS (
  SELECT ap.ProviderID, COUNT(DISTINCT ap.PatientID) AS DistPatients
  FROM healthcare.Appointment ap
  WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY ap.ProviderID
)
SELECT ProviderID, DistPatients,
       DENSE_RANK() OVER (ORDER BY DistPatients DESC) AS DR_DistPts
FROM P;

-- 10. Dense rank patients by age (older = rank 1)
SELECT p.PatientID, p.DOB,
       DENSE_RANK() OVER (ORDER BY p.DOB ASC) AS DR_Age
FROM healthcare.Patient p;
```

## NTILE(n)
```sql
-- 1. Quartiles of providers by July appointment counts
WITH P AS (
  SELECT ap.ProviderID, COUNT(*) AS JulyCnt
  FROM healthcare.Appointment ap
  WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY ap.ProviderID
)
SELECT ProviderID, JulyCnt, NTILE(4) OVER (ORDER BY JulyCnt DESC) AS Quartile
FROM P;

-- 2. Deciles of patients by total lifetime claim charges
WITH C AS (
  SELECT c.PatientID, SUM(c.TotalCharge) AS Total$
  FROM healthcare.Claim c
  GROUP BY c.PatientID
)
SELECT PatientID, Total$, NTILE(10) OVER (ORDER BY Total$ DESC) AS Decile
FROM C;

-- 3. Quintiles of lab result values within each TestName
SELECT lr.TestName, lr.LabResultID, lr.ResultValue,
       NTILE(5) OVER (PARTITION BY lr.TestName ORDER BY lr.ResultValue DESC) AS QuintileByTest
FROM healthcare.LabResult lr;

-- 4. Quartiles of July claims by amount
SELECT c.ClaimID, c.TotalCharge,
       NTILE(4) OVER (ORDER BY c.TotalCharge DESC) AS QuartileByAmt
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd;

-- 5. Tertiles of policy durations (where expiration exists)
WITH P AS (
  SELECT ip.PolicyID, DATEDIFF(DAY, ip.EffectiveDate, ip.ExpirationDate) AS DurationDays
  FROM healthcare.InsurancePolicy ip
  WHERE ip.ExpirationDate IS NOT NULL
)
SELECT PolicyID, DurationDays, NTILE(3) OVER (ORDER BY DurationDays DESC) AS Tertile
FROM P;

-- 6. Quartiles of appointment lead time (days from today) within provider
SELECT ap.ProviderID, ap.AppointmentID,
       DATEDIFF(DAY, GETDATE(), ap.ApptDateTime) AS LeadDays,
       NTILE(4) OVER (
         PARTITION BY ap.ProviderID ORDER BY DATEDIFF(DAY, GETDATE(), ap.ApptDateTime) DESC) AS Q_ByLead
FROM healthcare.Appointment ap;

-- 7. Quartiles of total paid per claim
WITH X AS (
  SELECT c.ClaimID, COALESCE(SUM(p.AmountPaid),0) AS Paid$
  FROM healthcare.Claim c
  LEFT JOIN healthcare.Payment p ON p.ClaimID = c.ClaimID
  GROUP BY c.ClaimID
)
SELECT ClaimID, Paid$, NTILE(4) OVER (ORDER BY Paid$ DESC) AS QuartilePaid
FROM X;

-- 8. Quartiles of departments by provider count
WITH D AS (
  SELECT d.DepartmentID, COUNT(pr.ProviderID) AS ProvCnt
  FROM healthcare.Department d LEFT JOIN healthcare.Provider pr ON pr.DepartmentID = d.DepartmentID
  GROUP BY d.DepartmentID
)
SELECT DepartmentID, ProvCnt, NTILE(4) OVER (ORDER BY ProvCnt DESC) AS DeptQuartile
FROM D;

-- 9. Quintiles of cities by number of patients
WITH C AS (
  SELECT a.City, COUNT(*) AS Cnt
  FROM healthcare.Patient p JOIN healthcare.Address a ON a.AddressID = p.AddressID
  GROUP BY a.City
)
SELECT City, Cnt, NTILE(5) OVER (ORDER BY Cnt DESC) AS QuintileCity
FROM C;

-- 10. Deciles of patients by lifetime appointment count
WITH A AS (
  SELECT ap.PatientID, COUNT(*) AS ApptCnt
  FROM healthcare.Appointment ap
  GROUP BY ap.PatientID
)
SELECT PatientID, ApptCnt, NTILE(10) OVER (ORDER BY ApptCnt DESC) AS DecileAppts
FROM A;
```

## LAG()
```sql
-- 1. Claim amount delta vs previous claim per patient
WITH C AS (
  SELECT c.PatientID, c.ClaimID, c.ClaimDate, c.TotalCharge,
         LAG(c.TotalCharge) OVER (PARTITION BY c.PatientID ORDER BY c.ClaimDate, c.ClaimID) AS PrevAmt
  FROM healthcare.Claim c
)
SELECT *, (TotalCharge - PrevAmt) AS DeltaAmt
FROM C;

-- 2. Days since previous appointment per patient
SELECT ap.PatientID, ap.AppointmentID, ap.ApptDateTime,
       DATEDIFF(DAY,
         LAG(ap.ApptDateTime) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID),
         ap.ApptDateTime) AS DaysSincePrev
FROM healthcare.Appointment ap;

-- 3. Lab result change per (patient,test)
SELECT lo.PatientID, lr.TestName, lr.ResultDate, lr.ResultValue,
       (lr.ResultValue - LAG(lr.ResultValue) OVER (
         PARTITION BY lo.PatientID, lr.TestName ORDER BY lr.ResultDate, lr.LabResultID)) AS DeltaVal
FROM healthcare.LabOrder lo
JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID;

-- 4. Payment delta per claim
SELECT p.ClaimID, p.PaymentID, p.PaymentDate, p.AmountPaid,
       (p.AmountPaid - LAG(p.AmountPaid) OVER (
         PARTITION BY p.ClaimID ORDER BY p.PaymentDate, p.PaymentID)) AS DeltaPaid
FROM healthcare.Payment p;

-- 5. Policy gap detection per patient (days from prev Expiration to next Effective)
WITH P AS (
  SELECT ip.PatientID, ip.PolicyID, ip.EffectiveDate, ip.ExpirationDate,
         LAG(ip.ExpirationDate) OVER (PARTITION BY ip.PatientID ORDER BY ip.EffectiveDate, ip.PolicyID) AS PrevExp
  FROM healthcare.InsurancePolicy ip
)
SELECT *, DATEDIFF(DAY, PrevExp, EffectiveDate) AS GapDays
FROM P;

-- 6. Provider change between consecutive appointments per patient
SELECT ap.PatientID, ap.AppointmentID, ap.ApptDateTime, ap.ProviderID,
       LAG(ap.ProviderID) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID) AS PrevProviderID
FROM healthcare.Appointment ap;

-- 7. Appointment status change flag (per appointment)
SELECT ap.AppointmentID, ap.Status,
       CASE WHEN ap.Status <> LAG(ap.Status) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID)
            THEN 1 ELSE 0 END AS StatusChanged
FROM healthcare.Appointment ap;

-- 8. Repeated diagnosis detection (same as previous ICD10 for patient)
WITH D AS (
  SELECT mr.PatientID, dx.DiagnosisID, dx.ICD10Code, dx.DiagnosedDate,
         LAG(dx.ICD10Code) OVER (
           PARTITION BY mr.PatientID ORDER BY dx.DiagnosedDate, dx.DiagnosisID) AS PrevICD
  FROM healthcare.Diagnosis dx
  JOIN healthcare.MedicalRecord mr ON mr.RecordID = dx.RecordID
)
SELECT *, CASE WHEN ICD10Code = PrevICD THEN 1 ELSE 0 END AS RepeatedICD
FROM D;

-- 9. Minutes between consecutive lab results per order
SELECT lr.LabOrderID, lr.LabResultID, lr.ResultDate,
       DATEDIFF(MINUTE,
         LAG(lr.ResultDate) OVER (PARTITION BY lr.LabOrderID ORDER BY lr.ResultDate, lr.LabResultID),
         lr.ResultDate) AS MinutesSincePrev
FROM healthcare.LabResult lr;

-- 10. Payment method changed flag per claim
SELECT p.ClaimID, p.PaymentID, p.PaymentMethod,
       CASE WHEN p.PaymentMethod <> LAG(p.PaymentMethod) OVER (
              PARTITION BY p.ClaimID ORDER BY p.PaymentDate, p.PaymentID)
            THEN 1 ELSE 0 END AS MethodChanged
FROM healthcare.Payment p;
```

## LEAD()
```sql
-- 1. Next appointment per patient + days until next
SELECT ap.PatientID, ap.AppointmentID, ap.ApptDateTime,
       LEAD(ap.ApptDateTime) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID) AS NextAppt,
       DATEDIFF(DAY, ap.ApptDateTime,
         LEAD(ap.ApptDateTime) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID)) AS DaysToNext
FROM healthcare.Appointment ap;

-- 2. Next lab result date/value per (patient,test)
SELECT lo.PatientID, lr.TestName, lr.ResultDate, lr.ResultValue,
       LEAD(lr.ResultDate) OVER (
         PARTITION BY lo.PatientID, lr.TestName ORDER BY lr.ResultDate, lr.LabResultID) AS NextDate,
       LEAD(lr.ResultValue) OVER (
         PARTITION BY lo.PatientID, lr.TestName ORDER BY lr.ResultDate, lr.LabResultID) AS NextValue
FROM healthcare.LabOrder lo
JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID;

-- 3. Next payment per claim
SELECT p.ClaimID, p.PaymentID, p.PaymentDate, p.AmountPaid,
       LEAD(p.PaymentDate) OVER (PARTITION BY p.ClaimID ORDER BY p.PaymentDate, p.PaymentID) AS NextPaymentDate,
       LEAD(p.AmountPaid) OVER (PARTITION BY p.ClaimID ORDER BY p.PaymentDate, p.PaymentID) AS NextAmount
FROM healthcare.Payment p;

-- 4. Next prescription start per patient (overlap check)
SELECT pr.PatientID, pr.PrescriptionID, pr.StartDate, pr.EndDate,
       LEAD(pr.StartDate) OVER (PARTITION BY pr.PatientID ORDER BY pr.StartDate, pr.PrescriptionID) AS NextStart
FROM healthcare.Prescription pr;

-- 5. Next policy effective per patient
SELECT ip.PatientID, ip.PolicyID, ip.EffectiveDate,
       LEAD(ip.EffectiveDate) OVER (PARTITION BY ip.PatientID ORDER BY ip.EffectiveDate, ip.PolicyID) AS NextEffective
FROM healthcare.InsurancePolicy ip;

-- 6. Next diagnosis date for same patient
SELECT mr.PatientID, dx.DiagnosisID, dx.DiagnosedDate,
       LEAD(dx.DiagnosedDate) OVER (
         PARTITION BY mr.PatientID ORDER BY dx.DiagnosedDate, dx.DiagnosisID) AS NextDxDate
FROM healthcare.Diagnosis dx
JOIN healthcare.MedicalRecord mr ON mr.RecordID = dx.RecordID;

-- 7. Next provider (continuity) for a patient
SELECT ap.PatientID, ap.AppointmentID, ap.ProviderID,
       LEAD(ap.ProviderID) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID) AS NextProviderID
FROM healthcare.Appointment ap;

-- 8. Next claim date per patient
SELECT c.PatientID, c.ClaimID, c.ClaimDate,
       LEAD(c.ClaimDate) OVER (PARTITION BY c.PatientID ORDER BY c.ClaimDate, c.ClaimID) AS NextClaimDate
FROM healthcare.Claim c;

-- 9. Next lab result per LabOrder
SELECT lr.LabOrderID, lr.LabResultID, lr.ResultDate,
       LEAD(lr.LabResultID) OVER (PARTITION BY lr.LabOrderID ORDER BY lr.ResultDate, lr.LabResultID) AS NextResultID
FROM healthcare.LabResult lr;

-- 10. Next appointment status per patient
SELECT ap.PatientID, ap.AppointmentID, ap.Status,
       LEAD(ap.Status) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime, ap.AppointmentID) AS NextStatus
FROM healthcare.Appointment ap;
```

## FIRST_VALUE()
```sql
-- 1. First (earliest) appointment per patient (shown on every row)
SELECT ap.PatientID, ap.AppointmentID, ap.ApptDateTime,
       FIRST_VALUE(ap.ApptDateTime) OVER (
         PARTITION BY ap.PatientID
         ORDER BY ap.ApptDateTime, ap.AppointmentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstAppt
FROM healthcare.Appointment ap;

-- 2. First diagnosis date per patient
SELECT mr.PatientID, dx.DiagnosisID, dx.DiagnosedDate,
       FIRST_VALUE(dx.DiagnosedDate) OVER (
         PARTITION BY mr.PatientID
         ORDER BY dx.DiagnosedDate, dx.DiagnosisID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstDxDate
FROM healthcare.Diagnosis dx
JOIN healthcare.MedicalRecord mr ON mr.RecordID = dx.RecordID;

-- 3. First lab result per order by ResultDate
SELECT lr.LabOrderID, lr.LabResultID, lr.ResultDate,
       FIRST_VALUE(lr.LabResultID) OVER (
         PARTITION BY lr.LabOrderID
         ORDER BY lr.ResultDate, lr.LabResultID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstResultID
FROM healthcare.LabResult lr;

-- 4. First policy effective date per patient
SELECT ip.PatientID, ip.PolicyID, ip.EffectiveDate,
       FIRST_VALUE(ip.EffectiveDate) OVER (
         PARTITION BY ip.PatientID
         ORDER BY ip.EffectiveDate, ip.PolicyID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstEffective
FROM healthcare.InsurancePolicy ip;

-- 5. First payment date per claim
SELECT p.ClaimID, p.PaymentID, p.PaymentDate,
       FIRST_VALUE(p.PaymentDate) OVER (
         PARTITION BY p.ClaimID
         ORDER BY p.PaymentDate, p.PaymentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstPaymentDate
FROM healthcare.Payment p;

-- 6. First specialty a patient encountered (by earliest appointment)
WITH ApSpec AS (
  SELECT ap.PatientID, ap.ApptDateTime, pr.Specialty
  FROM healthcare.Appointment ap
  JOIN healthcare.Provider pr ON pr.ProviderID = ap.ProviderID
)
SELECT PatientID, ApptDateTime, Specialty,
       FIRST_VALUE(Specialty) OVER (
         PARTITION BY PatientID
         ORDER BY ApptDateTime
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstSpecialty
FROM ApSpec;

-- 7. First insurer for patient (by earliest policy)
SELECT ip.PatientID, ip.PolicyID, ip.InsurerName, ip.EffectiveDate,
       FIRST_VALUE(ip.InsurerName) OVER (
         PARTITION BY ip.PatientID
         ORDER BY ip.EffectiveDate, ip.PolicyID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstInsurer
FROM healthcare.InsurancePolicy ip;

-- 8. First prescription start date per patient
SELECT pr.PatientID, pr.PrescriptionID, pr.StartDate,
       FIRST_VALUE(pr.StartDate) OVER (
         PARTITION BY pr.PatientID
         ORDER BY pr.StartDate, pr.PrescriptionID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstRxStart
FROM healthcare.Prescription pr;

-- 9. First recorded medical note per patient
SELECT mr.PatientID, mr.RecordID, mr.RecordDate,
       FIRST_VALUE(mr.RecordDate) OVER (
         PARTITION BY mr.PatientID
         ORDER BY mr.RecordDate, mr.RecordID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstNoteDate
FROM healthcare.MedicalRecord mr;

-- 10. First lab TestName per order (alphabetically on first date)
SELECT lr.LabOrderID, lr.LabResultID, lr.TestName, lr.ResultDate,
       FIRST_VALUE(lr.TestName) OVER (
         PARTITION BY lr.LabOrderID
         ORDER BY lr.ResultDate, lr.TestName
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS FirstTestName
FROM healthcare.LabResult lr;
```

## LAST_VALUE()
```sql
-- 1. Last (latest) appointment per patient (shown on every row)
SELECT ap.PatientID, ap.AppointmentID, ap.ApptDateTime,
       LAST_VALUE(ap.ApptDateTime) OVER (
         PARTITION BY ap.PatientID
         ORDER BY ap.ApptDateTime, ap.AppointmentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastAppt
FROM healthcare.Appointment ap;

-- 2. Last payment date per claim
SELECT p.ClaimID, p.PaymentID, p.PaymentDate,
       LAST_VALUE(p.PaymentDate) OVER (
         PARTITION BY p.ClaimID
         ORDER BY p.PaymentDate, p.PaymentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastPaymentDate
FROM healthcare.Payment p;

-- 3. Last lab result per order
SELECT lr.LabOrderID, lr.LabResultID, lr.ResultDate,
       LAST_VALUE(lr.LabResultID) OVER (
         PARTITION BY lr.LabOrderID
         ORDER BY lr.ResultDate, lr.LabResultID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastResultID
FROM healthcare.LabResult lr;

-- 4. Last policy expiration date per patient (ignoring NULLs via ordering key)
SELECT ip.PatientID, ip.PolicyID, ip.ExpirationDate,
       LAST_VALUE(ip.ExpirationDate) OVER (
         PARTITION BY ip.PatientID
         ORDER BY CASE WHEN ip.ExpirationDate IS NULL THEN '0001-01-01' ELSE CONVERT(date, ip.ExpirationDate) END,
                  ip.PolicyID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastExpDate_BySort
FROM healthcare.InsurancePolicy ip;

-- 5. Last diagnosis date per patient
SELECT mr.PatientID, dx.DiagnosisID, dx.DiagnosedDate,
       LAST_VALUE(dx.DiagnosedDate) OVER (
         PARTITION BY mr.PatientID
         ORDER BY dx.DiagnosedDate, dx.DiagnosisID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastDxDate
FROM healthcare.Diagnosis dx
JOIN healthcare.MedicalRecord mr ON mr.RecordID = dx.RecordID;

-- 6. Last prescription end per patient (treat OPEN as latest via sort key)
SELECT pr.PatientID, pr.PrescriptionID, pr.EndDate,
       LAST_VALUE(pr.EndDate) OVER (
         PARTITION BY pr.PatientID
         ORDER BY CASE WHEN pr.EndDate IS NULL THEN '9999-12-31' ELSE pr.EndDate END,
                  pr.PrescriptionID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastRxEnd_BySort
FROM healthcare.Prescription pr;

-- 7. Last result value per (patient,test)
SELECT lo.PatientID, lr.TestName, lr.ResultDate, lr.ResultValue,
       LAST_VALUE(lr.ResultValue) OVER (
         PARTITION BY lo.PatientID, lr.TestName
         ORDER BY lr.ResultDate, lr.LabResultID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastVal
FROM healthcare.LabOrder lo
JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID;

-- 8. Last appointment status per patient
SELECT ap.PatientID, ap.AppointmentID, ap.Status, ap.ApptDateTime,
       LAST_VALUE(ap.Status) OVER (
         PARTITION BY ap.PatientID
         ORDER BY ap.ApptDateTime, ap.AppointmentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastStatus
FROM healthcare.Appointment ap;

-- 9. Last claim date per patient
SELECT c.PatientID, c.ClaimID, c.ClaimDate,
       LAST_VALUE(c.ClaimDate) OVER (
         PARTITION BY c.PatientID
         ORDER BY c.ClaimDate, c.ClaimID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastClaimDate
FROM healthcare.Claim c;

-- 10. Last payment method per claim
SELECT p.ClaimID, p.PaymentID, p.PaymentMethod,
       LAST_VALUE(p.PaymentMethod) OVER (
         PARTITION BY p.ClaimID
         ORDER BY p.PaymentDate, p.PaymentID
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastMethod
FROM healthcare.Payment p;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
