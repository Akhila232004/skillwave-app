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
-- 1. July appointments with patient & provider names
SELECT ap.AppointmentID, ap.ApptDateTime, ap.Status,
       p.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       pr.ProviderID, CONCAT(pr.FirstName,' ',pr.LastName) AS Provider, pr.Specialty
FROM healthcare.Appointment ap
JOIN healthcare.Patient   p  ON p.PatientID   = ap.PatientID
JOIN healthcare.Provider  pr ON pr.ProviderID = ap.ProviderID
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
ORDER BY ap.ApptDateTime;

-- 2. Claims in July with insurer and patient
SELECT c.ClaimID, c.ClaimDate, c.TotalCharge, c.Status,
       ip.InsurerName, ip.PolicyNumber,
       p.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient
FROM healthcare.Claim c
JOIN healthcare.InsurancePolicy ip ON ip.PolicyID  = c.PolicyID
JOIN healthcare.Patient         p  ON p.PatientID  = c.PatientID
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
ORDER BY c.ClaimDate DESC, c.ClaimID;

-- 3. Lab results with order and provider
SELECT lr.LabResultID, lr.TestName, lr.ResultValue, lr.Units, lr.ResultDate,
       lo.LabOrderID, lo.Status AS OrderStatus,
       pr.ProviderID, CONCAT(pr.FirstName,' ',pr.LastName) AS Provider
FROM healthcare.LabResult lr
JOIN healthcare.LabOrder  lo ON lo.LabOrderID  = lr.LabOrderID
JOIN healthcare.Provider  pr ON pr.ProviderID  = lo.ProviderID;

-- 4. Prescriptions with medication and prescriber
SELECT prx.PrescriptionID, prx.PatientID,
       m.Name AS Medication, m.Form, m.Strength,
       CONCAT(pv.FirstName,' ',pv.LastName) AS Prescriber,
       prx.Dosage, prx.Frequency, prx.StartDate, prx.EndDate
FROM healthcare.Prescription prx
JOIN healthcare.Medication  m  ON m.MedicationID = prx.MedicationID
JOIN healthcare.Provider    pv ON pv.ProviderID  = prx.ProviderID;

-- 5. Medical records with author and patient
SELECT mr.RecordID, mr.RecordDate, mr.RecordType,
       CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       CONCAT(pr.FirstName,' ',pr.LastName) AS Author
FROM healthcare.MedicalRecord mr
JOIN healthcare.Patient  p  ON p.PatientID   = mr.PatientID
JOIN healthcare.Provider pr ON pr.ProviderID = mr.AuthorID;

-- 6. Procedures with patient and CPT details
SELECT prc.ProcedureID, prc.CPTCode, prc.Description, prc.ProcedureDate,
       mr.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient
FROM healthcare.ProcedureRecord prc
JOIN healthcare.MedicalRecord  mr ON mr.RecordID = prc.RecordID
JOIN healthcare.Patient        p  ON p.PatientID = mr.PatientID;

-- 7. Diagnoses with patient and date
SELECT dx.DiagnosisID, dx.ICD10Code, dx.Description, dx.DiagnosedDate,
       mr.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient
FROM healthcare.Diagnosis     dx
JOIN healthcare.MedicalRecord mr ON mr.RecordID  = dx.RecordID
JOIN healthcare.Patient       p  ON p.PatientID  = mr.PatientID;

-- 8. Appointments with patient city
SELECT ap.AppointmentID, ap.ApptDateTime, ap.Status,
       p.PatientID, a.City, a.State
FROM healthcare.Appointment ap
JOIN healthcare.Patient    p ON p.PatientID   = ap.PatientID
JOIN healthcare.Address    a ON a.AddressID   = p.AddressID;

-- 9. Payments with claim and patient
SELECT pmt.PaymentID, pmt.PaymentDate, pmt.AmountPaid, pmt.PaymentMethod,
       c.ClaimID, c.TotalCharge, c.Status AS ClaimStatus,
       c.PatientID
FROM healthcare.Payment pmt
JOIN healthcare.Claim   c ON c.ClaimID = pmt.ClaimID;

-- 10. Providers with department name
SELECT pr.ProviderID, CONCAT(pr.FirstName,' ',pr.LastName) AS Provider,
       d.Name AS Department, pr.Specialty
FROM healthcare.Provider   pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID;

-- 11. Appointments with policy active on appointment date
SELECT TOP (100)
       ap.AppointmentID, ap.ApptDateTime, ap.PatientID,
       ip.PolicyID, ip.InsurerName
FROM healthcare.Appointment ap
JOIN healthcare.InsurancePolicy ip
  ON ip.PatientID = ap.PatientID
 AND ip.EffectiveDate <= CAST(ap.ApptDateTime AS date)
 AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate >= CAST(ap.ApptDateTime AS date))
ORDER BY ap.ApptDateTime DESC;

-- 12. CBC results with patient and ordering provider
SELECT lr.LabResultID, lr.TestName, lr.ResultValue, lr.Units, lr.ResultDate,
       lo.PatientID, CONCAT(pr.FirstName,' ',pr.LastName) AS OrderingProvider
FROM healthcare.LabResult lr
JOIN healthcare.LabOrder  lo ON lo.LabOrderID = lr.LabOrderID
JOIN healthcare.Provider  pr ON pr.ProviderID = lo.ProviderID
WHERE lr.TestName = 'CBC';
```

## Left Join (Left Outer Join)
```sql
-- 1. Patients with their July appointment counts (include zero)
SELECT p.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       COUNT(ap.AppointmentID) AS JulyAppts
FROM healthcare.Patient p
LEFT JOIN healthcare.Appointment ap
  ON ap.PatientID = p.PatientID
 AND CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY p.PatientID, p.FirstName, p.LastName
ORDER BY JulyAppts DESC, p.PatientID;

-- 2. Providers and their last appointment date
SELECT pr.ProviderID, CONCAT(pr.FirstName,' ',pr.LastName) AS Provider,
       MAX(ap.ApptDateTime) AS LastAppointment
FROM healthcare.Provider pr
LEFT JOIN healthcare.Appointment ap ON ap.ProviderID = pr.ProviderID
GROUP BY pr.ProviderID, pr.FirstName, pr.LastName;

-- 3. Lab orders with (optional) results count
SELECT lo.LabOrderID, lo.PatientID, lo.ProviderID, lo.Status,
       COUNT(lr.LabResultID) AS ResultCount
FROM healthcare.LabOrder lo
LEFT JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
GROUP BY lo.LabOrderID, lo.PatientID, lo.ProviderID, lo.Status
ORDER BY lo.LabOrderID;

-- 4. Claims with total payments (claims without payments included)
SELECT c.ClaimID, c.PatientID, c.TotalCharge,
       COALESCE(SUM(p.AmountPaid),0) AS TotalPaid
FROM healthcare.Claim c
LEFT JOIN healthcare.Payment p ON p.ClaimID = c.ClaimID
GROUP BY c.ClaimID, c.PatientID, c.TotalCharge
ORDER BY c.ClaimID;

-- 5. Patients with any active policy today (NULL if none)
SELECT p.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       ip.PolicyID, ip.InsurerName
FROM healthcare.Patient p
LEFT JOIN healthcare.InsurancePolicy ip
  ON ip.PatientID = p.PatientID
 AND ip.EffectiveDate <= @Today
 AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate >= @Today)
ORDER BY p.PatientID, ip.PolicyID;

-- 6. Medications with active prescription count (include unused meds)
SELECT m.MedicationID, m.Name,
       COUNT(prx.PrescriptionID) AS ActiveRx
FROM healthcare.Medication m
LEFT JOIN healthcare.Prescription prx
  ON prx.MedicationID = m.MedicationID
 AND prx.StartDate <= @Today
 AND (prx.EndDate IS NULL OR prx.EndDate >= @Today)
GROUP BY m.MedicationID, m.Name
ORDER BY ActiveRx DESC, m.Name;

-- 7. Departments with provider counts (include empty depts)
SELECT d.DepartmentID, d.Name, COUNT(pr.ProviderID) AS ProviderCount
FROM healthcare.Department d
LEFT JOIN healthcare.Provider pr ON pr.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentID, d.Name
ORDER BY ProviderCount DESC, d.Name;

-- 8. Appointments with same-day medical note flag
SELECT ap.AppointmentID, ap.ApptDateTime,
       CASE WHEN mr.RecordID IS NULL THEN 0 ELSE 1 END AS HasSameDayNote
FROM healthcare.Appointment ap
LEFT JOIN healthcare.MedicalRecord mr
  ON mr.PatientID = ap.PatientID
 AND CAST(mr.RecordDate AS date) = CAST(ap.ApptDateTime AS date)
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 9. Patients with their last lab result date (NULL if none)
SELECT p.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       x.LastResultDate
FROM healthcare.Patient p
LEFT JOIN (
  SELECT lo.PatientID, MAX(lr.ResultDate) AS LastResultDate
  FROM healthcare.LabOrder lo
  JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
  GROUP BY lo.PatientID
) x ON x.PatientID = p.PatientID
ORDER BY p.PatientID;

-- 10. Policies with claim counts (include policies with 0)
SELECT ip.PolicyID, ip.InsurerName, COUNT(c.ClaimID) AS ClaimCnt
FROM healthcare.InsurancePolicy ip
LEFT JOIN healthcare.Claim c ON c.PolicyID = ip.PolicyID
GROUP BY ip.PolicyID, ip.InsurerName
ORDER BY ClaimCnt DESC, ip.PolicyID;

-- 11. Providers with July lab order counts (include zero)
SELECT pr.ProviderID, CONCAT(pr.FirstName,' ',pr.LastName) AS Provider,
       COUNT(lo.LabOrderID) AS JulyOrders
FROM healthcare.Provider pr
LEFT JOIN healthcare.LabOrder lo
  ON lo.ProviderID = pr.ProviderID
 AND CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY pr.ProviderID, pr.FirstName, pr.LastName
ORDER BY JulyOrders DESC;

-- 12. Medications with last prescribed date (NULL if never)
SELECT m.MedicationID, m.Name, MAX(prx.StartDate) AS LastPrescribed
FROM healthcare.Medication m
LEFT JOIN healthcare.Prescription prx ON prx.MedicationID = m.MedicationID
GROUP BY m.MedicationID, m.Name
ORDER BY LastPrescribed DESC NULLS LAST, m.Name;
```

## Right Join (Right Outer Join)
```sql
-- 1. Providers with July appointment counts (RIGHT join to include all providers)
SELECT pr.ProviderID, CONCAT(pr.FirstName,' ',pr.LastName) AS Provider,
       COUNT(ap.AppointmentID) AS JulyAppts
FROM healthcare.Appointment ap
RIGHT JOIN healthcare.Provider pr
  ON pr.ProviderID = ap.ProviderID
 AND CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY pr.ProviderID, pr.FirstName, pr.LastName
ORDER BY JulyAppts DESC, pr.ProviderID;

-- 2. Lab orders with result counts (RIGHT join to include all orders)
SELECT lo.LabOrderID, lo.Status,
       COUNT(lr.LabResultID) AS ResultCount
FROM healthcare.LabResult lr
RIGHT JOIN healthcare.LabOrder lo ON lo.LabOrderID = lr.LabOrderID
GROUP BY lo.LabOrderID, lo.Status
ORDER BY lo.LabOrderID;

-- 3. Claims with total paid (RIGHT join to include unpaid claims)
SELECT c.ClaimID, c.TotalCharge, COALESCE(SUM(p.AmountPaid),0) AS Paid
FROM healthcare.Payment p
RIGHT JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID
GROUP BY c.ClaimID, c.TotalCharge
ORDER BY c.ClaimID;

-- 4. Medications with prescription counts (RIGHT join to include unused meds)
SELECT m.MedicationID, m.Name, COUNT(prx.PrescriptionID) AS RxCount
FROM healthcare.Prescription prx
RIGHT JOIN healthcare.Medication m ON m.MedicationID = prx.MedicationID
GROUP BY m.MedicationID, m.Name
ORDER BY RxCount DESC, m.Name;

-- 5. Patients with note counts (RIGHT join to include patients without notes)
SELECT p.PatientID, CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       COUNT(mr.RecordID) AS NoteCount
FROM healthcare.MedicalRecord mr
RIGHT JOIN healthcare.Patient p ON p.PatientID = mr.PatientID
GROUP BY p.PatientID, p.FirstName, p.LastName
ORDER BY NoteCount DESC, p.PatientID;

-- 6. Records with diagnosis counts (RIGHT join keeps all records)
SELECT mr.RecordID, COUNT(dx.DiagnosisID) AS DxCount
FROM healthcare.Diagnosis dx
RIGHT JOIN healthcare.MedicalRecord mr ON mr.RecordID = dx.RecordID
GROUP BY mr.RecordID
ORDER BY DxCount DESC, mr.RecordID;

-- 7. Records with procedure counts (RIGHT join keeps all records)
SELECT mr.RecordID, COUNT(prc.ProcedureID) AS ProcCount
FROM healthcare.ProcedureRecord prc
RIGHT JOIN healthcare.MedicalRecord mr ON mr.RecordID = prc.RecordID
GROUP BY mr.RecordID
ORDER BY ProcCount DESC, mr.RecordID;

-- 8. Patients with policy counts (RIGHT join includes patients without policy)
SELECT p.PatientID, COUNT(ip.PolicyID) AS PolicyCnt
FROM healthcare.InsurancePolicy ip
RIGHT JOIN healthcare.Patient p ON p.PatientID = ip.PatientID
GROUP BY p.PatientID
ORDER BY PolicyCnt DESC, p.PatientID;

-- 9. Departments with provider counts (RIGHT join to include all depts)
SELECT d.DepartmentID, d.Name, COUNT(pr.ProviderID) AS ProviderCount
FROM healthcare.Provider pr
RIGHT JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
GROUP BY d.DepartmentID, d.Name
ORDER BY ProviderCount DESC, d.Name;

-- 10. Providers with lab order counts (RIGHT join to include all providers)
SELECT pr.ProviderID, COUNT(lo.LabOrderID) AS OrderCnt
FROM healthcare.LabOrder lo
RIGHT JOIN healthcare.Provider pr ON pr.ProviderID = lo.ProviderID
GROUP BY pr.ProviderID
ORDER BY OrderCnt DESC, pr.ProviderID;

-- 11. Policies with claim counts (RIGHT join to include all policies)
SELECT ip.PolicyID, COUNT(c.ClaimID) AS ClaimCnt
FROM healthcare.Claim c
RIGHT JOIN healthcare.InsurancePolicy ip ON ip.PolicyID = c.PolicyID
GROUP BY ip.PolicyID
ORDER BY ClaimCnt DESC, ip.PolicyID;

-- 12. Patients with appointment counts (RIGHT join includes patients with none)
SELECT p.PatientID, COUNT(ap.AppointmentID) AS ApptCnt
FROM healthcare.Appointment ap
RIGHT JOIN healthcare.Patient p ON p.PatientID = ap.PatientID
GROUP BY p.PatientID
ORDER BY ApptCnt DESC, p.PatientID;
```

## Full Join (Full Outer Join)
```sql
-- 1. Patients vs. July appointments (show who lacks/has appointments)
SELECT COALESCE(p.PatientID, ap.PatientID) AS PatientID,
       p.FirstName, p.LastName,
       ap.AppointmentID, ap.ApptDateTime
FROM healthcare.Patient p
FULL JOIN (
  SELECT * FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
) ap
  ON ap.PatientID = p.PatientID
ORDER BY PatientID, ApptDateTime;

-- 2. Claims vs. Payments with match indicators
SELECT COALESCE(c.ClaimID, p.ClaimID) AS ClaimID,
       c.TotalCharge, p.AmountPaid,
       CASE WHEN c.ClaimID IS NULL THEN 'PaymentOnly'
            WHEN p.ClaimID IS NULL THEN 'ClaimOnly'
            ELSE 'Matched' END AS MatchType
FROM healthcare.Claim c
FULL JOIN healthcare.Payment p
  ON p.ClaimID = c.ClaimID
ORDER BY ClaimID;

-- 3. Lab orders vs. results (find orders without results and orphans)
SELECT COALESCE(lo.LabOrderID, lr.LabOrderID) AS LabOrderID,
       lo.Status AS OrderStatus, lr.LabResultID, lr.TestName,
       CASE WHEN lo.LabOrderID IS NULL THEN 'ResultOrphan'
            WHEN lr.LabResultID IS NULL THEN 'OrderNoResult'
            ELSE 'HasResult' END AS StatusFlag
FROM healthcare.LabOrder lo
FULL JOIN healthcare.LabResult lr
  ON lr.LabOrderID = lo.LabOrderID
ORDER BY LabOrderID, LabResultID;

-- 4. Medical records vs. diagnoses
SELECT COALESCE(mr.RecordID, dx.RecordID) AS RecordID,
       mr.RecordDate, dx.DiagnosisID, dx.ICD10Code
FROM healthcare.MedicalRecord mr
FULL JOIN healthcare.Diagnosis dx
  ON dx.RecordID = mr.RecordID
ORDER BY RecordID;

-- 5. Medical records vs. procedures
SELECT COALESCE(mr.RecordID, prc.RecordID) AS RecordID,
       mr.RecordDate, prc.ProcedureID, prc.CPTCode
FROM healthcare.MedicalRecord mr
FULL JOIN healthcare.ProcedureRecord prc
  ON prc.RecordID = mr.RecordID
ORDER BY RecordID;

-- 6. Providers vs. July appointments (providers without appts & orphan appts)
SELECT COALESCE(pr.ProviderID, ap.ProviderID) AS ProviderID,
       CONCAT(pr.FirstName,' ',pr.LastName) AS Provider,
       ap.AppointmentID, ap.ApptDateTime
FROM healthcare.Provider pr
FULL JOIN (
  SELECT * FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
) ap
  ON ap.ProviderID = pr.ProviderID
ORDER BY ProviderID, ApptDateTime;

-- 7. Patients vs. active policies today
SELECT COALESCE(p.PatientID, ip.PatientID) AS PatientID,
       CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       ip.PolicyID, ip.InsurerName
FROM healthcare.Patient p
FULL JOIN (
  SELECT * FROM healthcare.InsurancePolicy
  WHERE EffectiveDate <= @Today
    AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
) ip
  ON ip.PatientID = p.PatientID
ORDER BY PatientID;

-- 8. Medications vs. currently active prescriptions
SELECT COALESCE(m.MedicationID, prx.MedicationID) AS MedicationID,
       m.Name, prx.PrescriptionID, prx.StartDate, prx.EndDate
FROM healthcare.Medication m
FULL JOIN (
  SELECT * FROM healthcare.Prescription
  WHERE StartDate <= @Today
    AND (EndDate IS NULL OR EndDate >= @Today)
) prx
  ON prx.MedicationID = m.MedicationID
ORDER BY MedicationID, prx.PrescriptionID;

-- 9. Departments vs. providers (highlight empty departments)
SELECT COALESCE(d.DepartmentID, pr.DepartmentID) AS DepartmentID,
       d.Name AS Department, pr.ProviderID
FROM healthcare.Department d
FULL JOIN healthcare.Provider pr
  ON pr.DepartmentID = d.DepartmentID
ORDER BY DepartmentID, pr.ProviderID;

-- 10. Patients vs. July lab orders
SELECT COALESCE(p.PatientID, lo.PatientID) AS PatientID,
       CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       lo.LabOrderID, lo.OrderDate
FROM healthcare.Patient p
FULL JOIN (
  SELECT * FROM healthcare.LabOrder
  WHERE CAST(OrderDate AS date) BETWEEN @RefStart AND @RefEnd
) lo
  ON lo.PatientID = p.PatientID
ORDER BY PatientID, lo.OrderDate;

-- 11. Patients vs. July claims
SELECT COALESCE(p.PatientID, c.PatientID) AS PatientID,
       CONCAT(p.FirstName,' ',p.LastName) AS Patient,
       c.ClaimID, c.ClaimDate, c.TotalCharge
FROM healthcare.Patient p
FULL JOIN (
  SELECT * FROM healthcare.Claim
  WHERE ClaimDate BETWEEN @RefStart AND @RefEnd
) c
  ON c.PatientID = p.PatientID
ORDER BY PatientID, c.ClaimDate;

-- 12. Same-day appointments vs. notes (per patient)
SELECT COALESCE(ap.PatientID, mr.PatientID) AS PatientID,
       ap.AppointmentID, ap.ApptDateTime,
       mr.RecordID, mr.RecordDate
FROM (
  SELECT * FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
) ap
FULL JOIN healthcare.MedicalRecord mr
  ON mr.PatientID = ap.PatientID
 AND CAST(mr.RecordDate AS date) = CAST(ap.ApptDateTime AS date)
ORDER BY PatientID, ApptDateTime;
```

## Cross Join
```sql
-- 1. Build a July schedule grid: Cardiology providers × 3 rooms
WITH Rooms AS (
  SELECT v.Room FROM (VALUES ('Room-001'),('Room-002'),('Room-003')) v(Room)
),
Cardio AS (
  SELECT ProviderID, CONCAT(FirstName,' ',LastName) AS Provider
  FROM healthcare.Provider
  WHERE Specialty = 'Cardiology'
)
SELECT c.ProviderID, c.Provider, r.Room
FROM Cardio c
CROSS JOIN Rooms r
ORDER BY c.ProviderID, r.Room;

-- 2. Hours (09–17) × next 3 weekdays (template slots)
WITH Hours AS (
  SELECT v.H AS Hr FROM (VALUES (9),(10),(11),(12),(13),(14),(15),(16),(17)) v(H)
),
Days AS (
  SELECT CAST(DATEADD(DAY, n, @RefStart) AS date) AS D
  FROM (VALUES (0),(1),(2)) n(n)
)
SELECT d.D, h.Hr
FROM Days d
CROSS JOIN Hours h
ORDER BY d.D, h.Hr;

-- 3. Top 5 providers × top 5 test names (matrix plan)
WITH TopProv AS (
  SELECT TOP (5) ProviderID, COUNT(*) AS ApptCnt
  FROM healthcare.Appointment
  GROUP BY ProviderID
  ORDER BY ApptCnt DESC
),
TopTests AS (
  SELECT TOP (5) TestName, COUNT(*) AS Cnt
  FROM healthcare.LabResult
  GROUP BY TestName
  ORDER BY Cnt DESC
)
SELECT tp.ProviderID, tt.TestName
FROM TopProv tp
CROSS JOIN TopTests tt
ORDER BY tp.ProviderID, tt.TestName;

-- 4. Distinct appointment statuses × rooms (first 5 rooms)
WITH Rooms AS (
  SELECT DISTINCT TOP (5) Location AS Room
  FROM healthcare.Appointment
  WHERE Location IS NOT NULL
)
SELECT s.Status, r.Room
FROM (SELECT DISTINCT Status FROM healthcare.Appointment) s
CROSS JOIN Rooms r
ORDER BY s.Status, r.Room;

-- 5. Insurers × months (Jul–Sep 2025) template grid
WITH Months AS (
  SELECT CAST('2025-07-01' AS date) AS M
  UNION ALL SELECT '2025-08-01'
  UNION ALL SELECT '2025-09-01'
)
SELECT DISTINCT ip.InsurerName, m.M
FROM healthcare.InsurancePolicy ip
CROSS JOIN Months m
ORDER BY ip.InsurerName, m.M;

-- 6. Providers (Dermatology) × 15-minute slots (09:00, 09:15, ..., 10:45)
WITH Slots AS (
  SELECT v.Slot FROM (VALUES ('09:00'),('09:15'),('09:30'),('09:45'),
                             ('10:00'),('10:15'),('10:30'),('10:45')) v(Slot)
),
Derm AS (
  SELECT ProviderID, CONCAT(FirstName,' ',LastName) AS Provider
  FROM healthcare.Provider
  WHERE Specialty = 'Dermatology'
)
SELECT d.ProviderID, d.Provider, s.Slot
FROM Derm d
CROSS JOIN Slots s
ORDER BY d.ProviderID, s.Slot;

-- 7. Cities (top 5 by patients) × specialties (top 5 by providers)
WITH TopCities AS (
  SELECT TOP (5) a.City, COUNT(*) AS Cnt
  FROM healthcare.Patient p
  JOIN healthcare.Address a ON a.AddressID = p.AddressID
  GROUP BY a.City
  ORDER BY Cnt DESC
),
TopSpecs AS (
  SELECT TOP (5) Specialty, COUNT(*) AS Cnt
  FROM healthcare.Provider
  GROUP BY Specialty
  ORDER BY Cnt DESC
)
SELECT tc.City, ts.Specialty
FROM TopCities tc
CROSS JOIN TopSpecs ts
ORDER BY tc.City, ts.Specialty;

-- 8. Test names × units (as observed)
WITH Names AS (
  SELECT DISTINCT TestName FROM healthcare.LabResult
),
Units AS (
  SELECT DISTINCT Units FROM healthcare.LabResult WHERE Units IS NOT NULL
)
SELECT n.TestName, u.Units
FROM Names n
CROSS JOIN Units u
ORDER BY n.TestName, u.Units;

-- 9. Three sample dates × three sample rooms (quick grid)
SELECT d.D, r.Room
FROM (VALUES (CAST('2025-07-10' AS date)),
             (CAST('2025-07-11' AS date)),
             (CAST('2025-07-12' AS date))) d(D)
CROSS JOIN (VALUES ('Room-001'),('Room-002'),('Room-003')) r(Room)
ORDER BY d.D, r.Room;

-- 10. Policy carriers × status buckets (Claim)
WITH Carriers AS (
  SELECT DISTINCT InsurerName FROM healthcare.InsurancePolicy
),
Buckets AS (
  SELECT v.B AS ClaimStatus FROM (VALUES ('Submitted'),('Adjudicating'),('Denied'),('Paid'),('Partially Paid'),('Pending')) v(B)
)
SELECT c.InsurerName, b.ClaimStatus
FROM Carriers c
CROSS JOIN Buckets b
ORDER BY c.InsurerName, b.ClaimStatus;

-- 11. Providers (top 3 by July appts) × next 5 dates (rolling)
WITH TopProv AS (
  SELECT TOP (3) ProviderID, COUNT(*) AS Cnt
  FROM healthcare.Appointment
  WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  GROUP BY ProviderID
  ORDER BY Cnt DESC
),
NextDays AS (
  SELECT CAST(DATEADD(DAY, n, @RefEnd) AS date) AS D
  FROM (VALUES (1),(2),(3),(4),(5)) n(n)
)
SELECT tp.ProviderID, nd.D
FROM TopProv tp
CROSS JOIN NextDays nd
ORDER BY tp.ProviderID, nd.D;

-- 12. Departments × sample floor labels (template)
SELECT d.Name AS Department, f.FloorLabel
FROM healthcare.Department d
CROSS JOIN (VALUES ('L1'),('L2'),('L3')) f(FloorLabel)
ORDER BY d.Name, f.FloorLabel;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
