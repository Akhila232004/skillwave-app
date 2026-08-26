![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Count
```sql
-- 1. Total number of patients
SELECT COUNT(*) AS PatientCount
FROM healthcare.Patient;

-- 2. Patients per city
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
ORDER BY PatientCount DESC, a.City;

-- 3. Total appointments in July 2025
SELECT COUNT(*) AS JulyAppointments
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 4. July appointments by status
SELECT COALESCE(Status,'(None)') AS Status, COUNT(*) AS Cnt
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY COALESCE(Status,'(None)')
ORDER BY Cnt DESC;

-- 5. Distinct providers who had appointments in July
SELECT COUNT(DISTINCT ProviderID) AS ProvidersWithJulyAppointments
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 6. Lab orders per provider in July
SELECT lo.ProviderID, COUNT(*) AS OrdersJuly
FROM healthcare.LabOrder lo
WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY lo.ProviderID
ORDER BY OrdersJuly DESC, lo.ProviderID;

-- 7. Lab result count by test name
SELECT lr.TestName, COUNT(*) AS ResultCount
FROM healthcare.LabResult lr
GROUP BY lr.TestName
ORDER BY ResultCount DESC, lr.TestName;

-- 8. July claims by status
SELECT COALESCE(c.Status,'(None)') AS Status, COUNT(*) AS ClaimCnt
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY COALESCE(c.Status,'(None)')
ORDER BY ClaimCnt DESC;

-- 9. Prescriptions per patient (top 10)
SELECT TOP (10) pr.PatientID, COUNT(*) AS RxCount
FROM healthcare.Prescription pr
GROUP BY pr.PatientID
ORDER BY RxCount DESC, pr.PatientID;

-- 10. Providers per department
SELECT d.DepartmentID, d.Name, COUNT(pr.ProviderID) AS ProviderCount
FROM healthcare.Department d
LEFT JOIN healthcare.Provider pr ON pr.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentID, d.Name
ORDER BY ProviderCount DESC, d.DepartmentID;
```

## Sum
```sql
-- 1. Total claim charges in July 2025
SELECT SUM(c.TotalCharge) AS JulyTotalCharges
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd;

-- 2. Total payments received in July 2025
SELECT SUM(p.AmountPaid) AS JulyTotalPaid
FROM healthcare.Payment p
WHERE p.PaymentDate BETWEEN @RefStart AND @RefEnd;

-- 3. Payments by method (lifetime)
SELECT COALESCE(p.PaymentMethod,'(None)') AS Method, SUM(p.AmountPaid) AS TotalPaid
FROM healthcare.Payment p
GROUP BY COALESCE(p.PaymentMethod,'(None)')
ORDER BY TotalPaid DESC, Method;

-- 4. July total charge per patient (top 10)
SELECT TOP (10) c.PatientID, SUM(c.TotalCharge) AS PatientJulyCharge
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY c.PatientID
ORDER BY PatientJulyCharge DESC, c.PatientID;

-- 5. Claim vs paid vs balance per claim
SELECT c.ClaimID,
       c.TotalCharge,
       COALESCE(SUM(p.AmountPaid), 0) AS TotalPaid,
       c.TotalCharge - COALESCE(SUM(p.AmountPaid), 0) AS Balance
FROM healthcare.Claim c
LEFT JOIN healthcare.Payment p ON p.ClaimID = c.ClaimID
GROUP BY c.ClaimID, c.TotalCharge
ORDER BY Balance DESC, c.ClaimID;

-- 6. Total charges by insurer (via policy)
SELECT ip.InsurerName, SUM(c.TotalCharge) AS TotalCharges
FROM healthcare.Claim c
JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID
GROUP BY ip.InsurerName
ORDER BY TotalCharges DESC, ip.InsurerName;

-- 7. Sum of result values by test in July (for numeric tests)
SELECT lr.TestName, SUM(lr.ResultValue) AS SumValueJuly
FROM healthcare.LabResult lr
WHERE CAST(lr.ResultDate AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY lr.TestName
ORDER BY SumValueJuly DESC;

-- 8. Completed-appointment counts via SUM(CASE) per provider in July
SELECT ap.ProviderID,
       SUM(CASE WHEN ap.Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedCnt,
       COUNT(*) AS TotalJulyAppts
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY ap.ProviderID
ORDER BY CompletedCnt DESC, ap.ProviderID;

-- 9. Total charges by provider (provider on claim)
SELECT c.ProviderID, SUM(c.TotalCharge) AS TotalCharge
FROM healthcare.Claim c
GROUP BY c.ProviderID
ORDER BY TotalCharge DESC, c.ProviderID;

-- 10. Total payments by claim status (join to claims)
SELECT COALESCE(c.Status,'(None)') AS ClaimStatus, SUM(p.AmountPaid) AS TotalPaid
FROM healthcare.Payment p
JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID
GROUP BY COALESCE(c.Status,'(None)')
ORDER BY TotalPaid DESC, ClaimStatus;
```

## Avg
```sql
-- 1. Average claim amount (lifetime) and in July
SELECT AVG(c.TotalCharge) AS AvgClaim_All
FROM healthcare.Claim c;

SELECT AVG(c.TotalCharge) AS AvgClaim_July
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd;

-- 2. Average payment by method
SELECT COALESCE(p.PaymentMethod,'(None)') AS Method, AVG(p.AmountPaid) AS AvgPaid
FROM healthcare.Payment p
GROUP BY COALESCE(p.PaymentMethod,'(None)')
ORDER BY AvgPaid DESC, Method;

-- 3. Average lab result per test name
SELECT lr.TestName, AVG(lr.ResultValue) AS AvgValue
FROM healthcare.LabResult lr
GROUP BY lr.TestName
ORDER BY AvgValue DESC;

-- 4. Average days from claim to payment (per payment)
SELECT AVG(DATEDIFF(DAY, c.ClaimDate, p.PaymentDate) * 1.0) AS AvgDaysToPay
FROM healthcare.Payment p
JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID;

-- 5. Average number of July appointments per provider
WITH per_provider AS (
  SELECT ProviderID, COUNT(*) AS Cnt
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY ProviderID
)
SELECT AVG(Cnt * 1.0) AS AvgApptsPerProvider_July
FROM per_provider;

-- 6. Average patient age in years (approx)
SELECT AVG(DATEDIFF(YEAR, p.DOB, @Today) * 1.0) AS AvgAgeYears
FROM healthcare.Patient p;

-- 7. Average policy duration (days) where expiration exists
SELECT AVG(DATEDIFF(DAY, ip.EffectiveDate, ip.ExpirationDate) * 1.0) AS AvgPolicyDays
FROM healthcare.InsurancePolicy ip
WHERE ip.ExpirationDate IS NOT NULL;

-- 8. Average prescription duration (days; open-ended to @Today)
SELECT AVG(DATEDIFF(DAY, pr.StartDate, COALESCE(pr.EndDate, @Today)) * 1.0) AS AvgRxDays
FROM healthcare.Prescription pr;

-- 9. Average appointment hour (0–23)
SELECT AVG(DATEPART(HOUR, ApptDateTime) * 1.0) AS AvgApptHour
FROM healthcare.Appointment;

-- 10. Average claim amount by insurer
SELECT ip.InsurerName, AVG(c.TotalCharge) AS AvgClaim
FROM healthcare.Claim c
JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID
GROUP BY ip.InsurerName
ORDER BY AvgClaim DESC, ip.InsurerName;
```

## Max
```sql
-- 1. Maximum claim amount (overall)
SELECT MAX(c.TotalCharge) AS MaxClaim
FROM healthcare.Claim c;

-- 2. Maximum claim per patient (top 10 by max claim)
SELECT TOP (10) c.PatientID, MAX(c.TotalCharge) AS MaxClaimPerPatient
FROM healthcare.Claim c
GROUP BY c.PatientID
ORDER BY MaxClaimPerPatient DESC, c.PatientID;

-- 3. Latest appointment per provider
SELECT ap.ProviderID, MAX(ap.ApptDateTime) AS LatestAppt
FROM healthcare.Appointment ap
GROUP BY ap.ProviderID
ORDER BY LatestAppt DESC;

-- 4. Latest lab result date per patient
SELECT lo.PatientID, MAX(lr.ResultDate) AS LatestResult
FROM healthcare.LabOrder lo
JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
GROUP BY lo.PatientID
ORDER BY LatestResult DESC;

-- 5. Maximum payment amount by method
SELECT COALESCE(p.PaymentMethod,'(None)') AS Method, MAX(p.AmountPaid) AS MaxPaid
FROM healthcare.Payment p
GROUP BY COALESCE(p.PaymentMethod,'(None)')
ORDER BY MaxPaid DESC, Method;

-- 6. For each provider: max number of appointments in any single day
WITH per_day AS (
  SELECT ProviderID, CAST(ApptDateTime AS date) AS D, COUNT(*) AS Cnt
  FROM healthcare.Appointment
  GROUP BY ProviderID, CAST(ApptDateTime AS date)
)
SELECT ProviderID, MAX(Cnt) AS MaxApptsInADay
FROM per_day
GROUP BY ProviderID
ORDER BY MaxApptsInADay DESC, ProviderID;

-- 7. Latest policy expiration per patient
SELECT ip.PatientID, MAX(ip.ExpirationDate) AS LatestExpiration
FROM healthcare.InsurancePolicy ip
GROUP BY ip.PatientID
ORDER BY LatestExpiration DESC;

-- 8. Maximum days to pay per claim (if multiple payments)
SELECT c.ClaimID, MAX(DATEDIFF(DAY, c.ClaimDate, p.PaymentDate)) AS MaxDaysToPay
FROM healthcare.Claim c
JOIN healthcare.Payment p ON p.ClaimID = c.ClaimID
GROUP BY c.ClaimID
ORDER BY MaxDaysToPay DESC, c.ClaimID;

-- 9. Max lab result value per test
SELECT lr.TestName, MAX(lr.ResultValue) AS MaxValue
FROM healthcare.LabResult lr
GROUP BY lr.TestName
ORDER BY MaxValue DESC;

-- 10. Latest appointment in the system
SELECT MAX(ApptDateTime) AS LatestAppointment
FROM healthcare.Appointment;
```

## Min
```sql
-- 1. Minimum claim amount (overall)
SELECT MIN(c.TotalCharge) AS MinClaim
FROM healthcare.Claim c;

-- 2. Earliest appointment per provider
SELECT ap.ProviderID, MIN(ap.ApptDateTime) AS EarliestAppt
FROM healthcare.Appointment ap
GROUP BY ap.ProviderID
ORDER BY EarliestAppt, ap.ProviderID;

-- 3. Earliest policy effective date per patient
SELECT ip.PatientID, MIN(ip.EffectiveDate) AS FirstEffective
FROM healthcare.InsurancePolicy ip
GROUP BY ip.PatientID
ORDER BY FirstEffective, ip.PatientID;

-- 4. Minimum lab result value per test
SELECT lr.TestName, MIN(lr.ResultValue) AS MinValue
FROM healthcare.LabResult lr
GROUP BY lr.TestName
ORDER BY MinValue, lr.TestName;

-- 5. Minimum minutes from order to result per test
SELECT lr.TestName, MIN(DATEDIFF(MINUTE, lo.OrderDate, lr.ResultDate)) AS MinMinutesToResult
FROM healthcare.LabResult lr
JOIN healthcare.LabOrder lo ON lo.LabOrderID = lr.LabOrderID
GROUP BY lr.TestName
ORDER BY MinMinutesToResult, lr.TestName;

-- 6. Earliest payment date per claim
SELECT p.ClaimID, MIN(p.PaymentDate) AS FirstPaymentDate
FROM healthcare.Payment p
GROUP BY p.ClaimID
ORDER BY FirstPaymentDate, p.ClaimID;

-- 7. Earliest medical record per patient
SELECT mr.PatientID, MIN(mr.RecordDate) AS FirstRecord
FROM healthcare.MedicalRecord mr
GROUP BY mr.PatientID
ORDER BY FirstRecord, mr.PatientID;

-- 8. Oldest patient (minimum DOB)
SELECT MIN(p.DOB) AS OldestDOB
FROM healthcare.Patient p;

-- 9. Minimum appointments per weekday in July (system-wide)
WITH by_wd AS (
  SELECT DATEPART(WEEKDAY, ApptDateTime) AS WD, COUNT(*) AS Cnt
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY DATEPART(WEEKDAY, ApptDateTime)
)
SELECT MIN(Cnt) AS MinApptsByWeekday_July
FROM by_wd;

-- 10. Earliest diagnosis date per patient (patients with any diagnosis)
SELECT mr.PatientID, MIN(dx.DiagnosedDate) AS FirstDiagnosis
FROM healthcare.MedicalRecord mr
JOIN healthcare.Diagnosis dx ON dx.RecordID = mr.RecordID
GROUP BY mr.PatientID
ORDER BY FirstDiagnosis, mr.PatientID;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
