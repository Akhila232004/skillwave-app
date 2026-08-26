![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Select
```sql
-- 1. List patient basic details
SELECT PatientID, FirstName, LastName, DOB, Gender, Phone, Email
FROM healthcare.Patient;

-- 2. Provider full name & specialty
SELECT ProviderID,
       CONCAT(FirstName, ' ', LastName) AS ProviderName,
       Specialty, DepartmentID
FROM healthcare.Provider;

-- 3. Appointments with split date/time
SELECT AppointmentID, PatientID, ProviderID,
       ApptDateTime,
       CAST(ApptDateTime AS date)      AS ApptDate,
       CONVERT(varchar(8), ApptDateTime, 108) AS ApptTime,
       ApptType, Status, Location
FROM healthcare.Appointment;

-- 4. Patients with city/state (join Address)
SELECT p.PatientID, p.FirstName, p.LastName, a.City, a.State, a.Country
FROM healthcare.Patient p
LEFT JOIN healthcare.Address a ON a.AddressID = p.AddressID;

-- 5. Distinct appointment statuses
SELECT DISTINCT Status
FROM healthcare.Appointment;

-- 6. Latest 20 medical records (basic select)
SELECT TOP (20) RecordID, PatientID, RecordDate, RecordType, AuthorID
FROM healthcare.MedicalRecord
ORDER BY RecordDate DESC;

-- 7. Prescriptions with medication details
SELECT pr.PrescriptionID, pr.PatientID, pr.ProviderID,
       m.Name AS Medication, m.Form, m.Strength,
       pr.Dosage, pr.Frequency, pr.StartDate, pr.EndDate
FROM healthcare.Prescription pr
JOIN healthcare.Medication m ON m.MedicationID = pr.MedicationID;

-- 8. Lab results with patient and provider via order
SELECT lr.LabResultID, lo.PatientID, lo.ProviderID,
       lr.TestCode, lr.TestName, lr.ResultValue, lr.Units, lr.ResultDate
FROM healthcare.LabResult lr
JOIN healthcare.LabOrder  lo ON lo.LabOrderID = lr.LabOrderID;

-- 9. Claims with insurer info
SELECT c.ClaimID, c.PatientID, c.ProviderID, ip.InsurerName, ip.PolicyNumber,
       c.ClaimDate, c.TotalCharge, c.Status
FROM healthcare.Claim c
JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID;

-- 10. Payments with claim total (join)
SELECT p.PaymentID, p.ClaimID, p.PaymentDate, p.AmountPaid, p.PaymentMethod,
       c.TotalCharge, c.Status AS ClaimStatus
FROM healthcare.Payment p
JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID;

-- 11. Diagnoses with record/date
SELECT d.DiagnosisID, d.RecordID, d.ICD10Code, d.Description, d.DiagnosedDate
FROM healthcare.Diagnosis d;

-- 12. Procedure records with note date and author
SELECT pr.ProcedureID, pr.RecordID, pr.CPTCode, pr.Description, pr.ProcedureDate,
       mr.PatientID, mr.AuthorID
FROM healthcare.ProcedureRecord pr
JOIN healthcare.MedicalRecord mr ON mr.RecordID = pr.RecordID;
```

## WHERE
```sql
-- 1. Appointments in July 2025
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime >= @RefStart
  AND ApptDateTime <  DATEADD(DAY, 1, @RefEnd);

-- 2. Cardiology providers
SELECT ProviderID, FirstName, LastName, Specialty
FROM healthcare.Provider
WHERE Specialty = 'Cardiology';

-- 3. Patients aged 65+ (approx by year)
SELECT PatientID, FirstName, LastName, DOB
FROM healthcare.Patient
WHERE DATEDIFF(YEAR, DOB, @Today) >= 65;

-- 4. HbA1c results above 6.5%
SELECT lr.*
FROM healthcare.LabResult lr
WHERE lr.TestName = 'HbA1c'
  AND lr.ResultValue > 6.5;

-- 5. Active insurance policies (current)
SELECT *
FROM healthcare.InsurancePolicy
WHERE EffectiveDate <= @Today
  AND (ExpirationDate IS NULL OR ExpirationDate >= @Today);

-- 6. Denied claims in July
SELECT *
FROM healthcare.Claim
WHERE Status = 'Denied'
  AND ClaimDate BETWEEN @RefStart AND @RefEnd;

-- 7. Payments in the last 7 days
SELECT *
FROM healthcare.Payment
WHERE PaymentDate >= DATEADD(DAY, -7, @Today);

-- 8. Currently active prescriptions
SELECT *
FROM healthcare.Prescription
WHERE StartDate <= @Today
  AND (EndDate IS NULL OR EndDate >= @Today);

-- 9. Completed appointments in Room-001
SELECT *
FROM healthcare.Appointment
WHERE Status = 'Completed'
  AND Location = 'Room-001';

-- 10. Progress notes written in July
SELECT *
FROM healthcare.MedicalRecord
WHERE RecordType = 'Progress Note'
  AND CAST(RecordDate AS date) BETWEEN @RefStart AND @RefEnd;

-- 11. Patients in City10
SELECT p.PatientID, p.FirstName, p.LastName, a.City
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
WHERE a.City = 'City10';

-- 12. Blood lab orders that are Ordered or In-Process
SELECT *
FROM healthcare.LabOrder
WHERE SpecimenType = 'Blood'
  AND Status IN ('Ordered','In-Process');
```

## GROUP BY
```sql
-- 1. Appointment count by status
SELECT Status, COUNT(*) AS Cnt
FROM healthcare.Appointment
GROUP BY Status
ORDER BY Cnt DESC;

-- 2. Appointments per provider in July
SELECT ProviderID, COUNT(*) AS JulyAppts
FROM healthcare.Appointment
WHERE ApptDateTime BETWEEN @RefStart AND DATEADD(DAY, 1, @RefEnd)
GROUP BY ProviderID
ORDER BY JulyAppts DESC;

-- 3. Daily appointment counts (all-time)
SELECT CAST(ApptDateTime AS date) AS ApptDate, COUNT(*) AS Cnt
FROM healthcare.Appointment
GROUP BY CAST(ApptDateTime AS date)
ORDER BY ApptDate;

-- 4. Lab result count per test name
SELECT TestName, COUNT(*) AS ResultCount
FROM healthcare.LabResult
GROUP BY TestName
ORDER BY ResultCount DESC;

-- 5. Total charges by insurer in July
SELECT ip.InsurerName, SUM(c.TotalCharge) AS TotalCharges
FROM healthcare.Claim c
JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY ip.InsurerName
ORDER BY TotalCharges DESC;

-- 6. Payments by method in 2025
SELECT COALESCE(PaymentMethod, 'Unknown') AS PaymentMethod,
       SUM(AmountPaid) AS Paid
FROM healthcare.Payment
WHERE PaymentDate BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY COALESCE(PaymentMethod, 'Unknown')
ORDER BY Paid DESC;

-- 7. Diagnosis frequency by ICD-10
SELECT ICD10Code, COUNT(*) AS DxCount
FROM healthcare.Diagnosis
GROUP BY ICD10Code
ORDER BY DxCount DESC;

-- 8. Active prescription counts per medication
SELECT m.Name AS Medication, COUNT(*) AS ActiveRx
FROM healthcare.Prescription pr
JOIN healthcare.Medication m ON m.MedicationID = pr.MedicationID
WHERE pr.StartDate <= @Today
  AND (pr.EndDate IS NULL OR pr.EndDate >= @Today)
GROUP BY m.Name
ORDER BY ActiveRx DESC;

-- 9. Patients per city
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
LEFT JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
ORDER BY PatientCount DESC;

-- 10. Providers per department
SELECT d.Name AS Department, COUNT(*) AS ProviderCount
FROM healthcare.Provider pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
GROUP BY d.Name
ORDER BY ProviderCount DESC;

-- 11. Average claim charge by status
SELECT Status, AVG(TotalCharge) AS AvgCharge
FROM healthcare.Claim
GROUP BY Status
ORDER BY AvgCharge DESC;

-- 12. Average result value by test name (only numeric tests)
SELECT TestName, AVG(ResultValue) AS AvgValue
FROM healthcare.LabResult
GROUP BY TestName
ORDER BY AvgValue DESC;
```

## HAVING
```sql
-- 1. Providers with > 50 appointments in July
SELECT ProviderID, COUNT(*) AS JulyAppts
FROM healthcare.Appointment
WHERE ApptDateTime BETWEEN @RefStart AND DATEADD(DAY,1,@RefEnd)
GROUP BY ProviderID
HAVING COUNT(*) > 50
ORDER BY JulyAppts DESC;

-- 2. Patients with >= 2 appointments in July
SELECT PatientID, COUNT(*) AS JulyAppts
FROM healthcare.Appointment
WHERE ApptDateTime BETWEEN @RefStart AND DATEADD(DAY,1,@RefEnd)
GROUP BY PatientID
HAVING COUNT(*) >= 2
ORDER BY JulyAppts DESC;

-- 3. Cities with > 100 appointments in July
SELECT a.City, COUNT(*) AS JulyAppts
FROM healthcare.Appointment ap
JOIN healthcare.Patient p ON p.PatientID = ap.PatientID
JOIN healthcare.Address a ON a.AddressID = p.AddressID
WHERE ap.ApptDateTime BETWEEN @RefStart AND DATEADD(DAY,1,@RefEnd)
GROUP BY a.City
HAVING COUNT(*) > 100
ORDER BY JulyAppts DESC;

-- 4. Medications prescribed to >= 50 patients (active now)
SELECT m.Name, COUNT(DISTINCT pr.PatientID) AS PatientCnt
FROM healthcare.Prescription pr
JOIN healthcare.Medication m ON m.MedicationID = pr.MedicationID
WHERE pr.StartDate <= @Today
  AND (pr.EndDate IS NULL OR pr.EndDate >= @Today)
GROUP BY m.Name
HAVING COUNT(DISTINCT pr.PatientID) >= 50
ORDER BY PatientCnt DESC;

-- 5. Insurers with July charges > 100,000
SELECT ip.InsurerName, SUM(c.TotalCharge) AS JulyCharges
FROM healthcare.Claim c
JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY ip.InsurerName
HAVING SUM(c.TotalCharge) > 100000
ORDER BY JulyCharges DESC;

-- 6. Patients with more than 3 diagnoses total
SELECT mr.PatientID, COUNT(*) AS DxCount
FROM healthcare.Diagnosis d
JOIN healthcare.MedicalRecord mr ON mr.RecordID = d.RecordID
GROUP BY mr.PatientID
HAVING COUNT(*) > 3
ORDER BY DxCount DESC;

-- 7. Providers with > 10 lab orders in July
SELECT lo.ProviderID, COUNT(*) AS OrdersJuly
FROM healthcare.LabOrder lo
WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY lo.ProviderID
HAVING COUNT(*) > 10
ORDER BY OrdersJuly DESC;

-- 8. Departments with >= 40 providers
SELECT d.Name, COUNT(*) AS ProviderCount
FROM healthcare.Provider pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
GROUP BY d.Name
HAVING COUNT(*) >= 40
ORDER BY ProviderCount DESC;

-- 9. Test names whose average HbA1c >= 6.5 (illustrative)
SELECT lr.TestName, AVG(lr.ResultValue) AS AvgVal
FROM healthcare.LabResult lr
WHERE lr.TestName = 'HbA1c'
GROUP BY lr.TestName
HAVING AVG(lr.ResultValue) >= 6.5;

-- 10. Patients where total payments < total charges (open balance across July claims)
SELECT c.PatientID,
       SUM(c.TotalCharge) AS JulyCharges,
       COALESCE(SUM(p.AmountPaid),0) AS JulyPayments
FROM healthcare.Claim c
LEFT JOIN healthcare.Payment p ON p.ClaimID = c.ClaimID
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY c.PatientID
HAVING COALESCE(SUM(p.AmountPaid),0) < SUM(c.TotalCharge)
ORDER BY JulyCharges DESC;

-- 11. Providers with completion rate < 80% in July
SELECT ap.ProviderID,
       SUM(CASE WHEN ap.Status = 'Completed' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS CompletionRate
FROM healthcare.Appointment ap
WHERE ap.ApptDateTime BETWEEN @RefStart AND DATEADD(DAY,1,@RefEnd)
GROUP BY ap.ProviderID
HAVING SUM(CASE WHEN ap.Status = 'Completed' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) < 0.8
ORDER BY CompletionRate;

-- 12. Assets (procedures by author): providers with > 20 procedures
SELECT mr.AuthorID AS ProviderID, COUNT(*) AS ProcCount
FROM healthcare.ProcedureRecord pr
JOIN healthcare.MedicalRecord mr ON mr.RecordID = pr.RecordID
GROUP BY mr.AuthorID
HAVING COUNT(*) > 20
ORDER BY ProcCount DESC;
```

## ORDER BY
```sql
-- 1. Patients by last name, first name
SELECT PatientID, LastName, FirstName, DOB
FROM healthcare.Patient
ORDER BY LastName, FirstName;

-- 2. Recent appointments first
SELECT TOP (100) *
FROM healthcare.Appointment
ORDER BY ApptDateTime DESC;

-- 3. Claims by highest TotalCharge
SELECT ClaimID, PatientID, ClaimDate, TotalCharge
FROM healthcare.Claim
ORDER BY TotalCharge DESC;

-- 4. Lab results by ResultDate then TestName
SELECT LabResultID, TestName, ResultValue, Units, ResultDate
FROM healthcare.LabResult
ORDER BY ResultDate DESC, TestName;

-- 5. Providers by Specialty then LastName
SELECT ProviderID, Specialty, LastName, FirstName
FROM healthcare.Provider
ORDER BY Specialty, LastName, FirstName;

-- 6. Prescriptions ending soonest (NULLs last)
SELECT PrescriptionID, PatientID, MedicationID, StartDate, EndDate
FROM healthcare.Prescription
ORDER BY CASE WHEN EndDate IS NULL THEN 1 ELSE 0 END, EndDate;

-- 7. Insurance policies by Expiration (NULLs last)
SELECT PolicyID, PatientID, InsurerName, EffectiveDate, ExpirationDate
FROM healthcare.InsurancePolicy
ORDER BY CASE WHEN ExpirationDate IS NULL THEN 1 ELSE 0 END, ExpirationDate;

-- 8. Cities by patient count (desc)
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
LEFT JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
ORDER BY PatientCount DESC, a.City;

-- 9. Departments by provider count (desc), tie-breaker by name
SELECT d.Name, COUNT(*) AS ProviderCount
FROM healthcare.Provider pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
GROUP BY d.Name
ORDER BY ProviderCount DESC, d.Name;

-- 10. Lab orders by status then newest first
SELECT LabOrderID, PatientID, ProviderID, Status, OrderDate
FROM healthcare.LabOrder
ORDER BY Status, OrderDate DESC;

-- 11. Medical records (for a patient) by newest first
SELECT TOP (50) *
FROM healthcare.MedicalRecord
WHERE PatientID = 1
ORDER BY RecordDate DESC;

-- 12. Denied claims by most recent
SELECT ClaimID, ClaimDate, TotalCharge
FROM healthcare.Claim
WHERE Status = 'Denied'
ORDER BY ClaimDate DESC;
```

## TOP
```sql
-- 1. Top 10 patients by July claim charges
SELECT TOP (10) c.PatientID, SUM(c.TotalCharge) AS JulyCharges
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY c.PatientID
ORDER BY JulyCharges DESC;

-- 2. Top 5 providers by July appointment count (WITH TIES)
SELECT TOP (5) WITH TIES ap.ProviderID, COUNT(*) AS JulyAppts
FROM healthcare.Appointment ap
WHERE ap.ApptDateTime BETWEEN @RefStart AND DATEADD(DAY,1,@RefEnd)
GROUP BY ap.ProviderID
ORDER BY JulyAppts DESC;

-- 3. Top 20 latest appointments overall
SELECT TOP (20) *
FROM healthcare.Appointment
ORDER BY ApptDateTime DESC;

-- 4. Top 15 largest payments
SELECT TOP (15) PaymentID, ClaimID, AmountPaid, PaymentDate
FROM healthcare.Payment
ORDER BY AmountPaid DESC, PaymentDate DESC;

-- 5. Top 10 medications by active prescription count
SELECT TOP (10) m.Name, COUNT(*) AS ActiveRx
FROM healthcare.Prescription pr
JOIN healthcare.Medication m ON m.MedicationID = pr.MedicationID
WHERE pr.StartDate <= @Today
  AND (pr.EndDate IS NULL OR pr.EndDate >= @Today)
GROUP BY m.Name
ORDER BY ActiveRx DESC;

-- 6. Top 10 cities by July appointment volume
SELECT TOP (10) a.City, COUNT(*) AS JulyAppts
FROM healthcare.Appointment ap
JOIN healthcare.Patient p ON p.PatientID = ap.PatientID
JOIN healthcare.Address a ON a.AddressID = p.AddressID
WHERE ap.ApptDateTime BETWEEN @RefStart AND DATEADD(DAY,1,@RefEnd)
GROUP BY a.City
ORDER BY JulyAppts DESC;

-- 7. Top 3 lab tests by frequency in July
SELECT TOP (3) lr.TestName, COUNT(*) AS Cnt
FROM healthcare.LabResult lr
WHERE CAST(lr.ResultDate AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY lr.TestName
ORDER BY Cnt DESC;

-- 8. Top 10 providers by July claim charges
SELECT TOP (10) c.ProviderID, SUM(c.TotalCharge) AS JulyCharges
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
GROUP BY c.ProviderID
ORDER BY JulyCharges DESC;

-- 9. Top 10 patients by number of lab orders
SELECT TOP (10) lo.PatientID, COUNT(*) AS OrdersCnt
FROM healthcare.LabOrder lo
GROUP BY lo.PatientID
ORDER BY OrdersCnt DESC;

-- 10. Top 5 departments by provider count
SELECT TOP (5) d.Name, COUNT(*) AS ProviderCount
FROM healthcare.Provider pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
GROUP BY d.Name
ORDER BY ProviderCount DESC;

-- 11. Top 10 diagnoses by frequency
SELECT TOP (10) ICD10Code, COUNT(*) AS DxCount
FROM healthcare.Diagnosis
GROUP BY ICD10Code
ORDER BY DxCount DESC;

-- 12. Per patient: top 1 most expensive claim (CROSS APPLY)
SELECT p.PatientID, c1.ClaimID, c1.TotalCharge, c1.ClaimDate
FROM healthcare.Patient p
CROSS APPLY (
  SELECT TOP (1) c.ClaimID, c.TotalCharge, c.ClaimDate
  FROM healthcare.Claim c
  WHERE c.PatientID = p.PatientID
  ORDER BY c.TotalCharge DESC, c.ClaimDate DESC
) c1
ORDER BY c1.TotalCharge DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
