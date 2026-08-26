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
-- 1. Patients with July appointments OR July lab orders
SELECT DISTINCT ap.PatientID
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
UNION
SELECT DISTINCT lo.PatientID
FROM healthcare.LabOrder lo
WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd;

-- 2. Policies active today OR starting in next 30 days (PolicyID)
SELECT DISTINCT PolicyID
FROM healthcare.InsurancePolicy
WHERE EffectiveDate <= @Today
  AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
UNION
SELECT DISTINCT PolicyID
FROM healthcare.InsurancePolicy
WHERE EffectiveDate BETWEEN DATEADD(DAY,1,@Today) AND DATEADD(DAY,30,@Today);

-- 3. Providers with July appointments OR authored records in July
SELECT DISTINCT ap.ProviderID
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
UNION
SELECT DISTINCT mr.AuthorID
FROM healthcare.MedicalRecord mr
WHERE CAST(mr.RecordDate AS date) BETWEEN @RefStart AND @RefEnd;

-- 4. Claims that are Paid OR Partially Paid (ClaimID)
SELECT DISTINCT ClaimID FROM healthcare.Claim WHERE Status = 'Paid'
UNION
SELECT DISTINCT ClaimID FROM healthcare.Claim WHERE Status = 'Partially Paid';

-- 5. Clinical codes universe: ICD-10 (Diagnosis) OR CPT (Procedure) codes
SELECT DISTINCT CAST(ICD10Code AS varchar(20)) AS Code
FROM healthcare.Diagnosis
UNION
SELECT DISTINCT CAST(CPTCode  AS varchar(20)) AS Code
FROM healthcare.ProcedureRecord;

-- 6. Cities from patient addresses OR department locations (string union)
SELECT DISTINCT a.City AS Place
FROM healthcare.Address a
UNION
SELECT DISTINCT d.Location AS Place
FROM healthcare.Department d;

-- 7. Patients with any prescription OR any medical record
SELECT DISTINCT PatientID FROM healthcare.Prescription
UNION
SELECT DISTINCT PatientID FROM healthcare.MedicalRecord;

-- 8. Rooms used in July OR used after July (Location)
SELECT DISTINCT Location
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
UNION
SELECT DISTINCT Location
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) > @RefEnd;

-- 9. Activity months (yyyy-MM) from Appointments OR LabOrders
SELECT DISTINCT CONVERT(char(7), ApptDateTime, 126) AS YearMonth
FROM healthcare.Appointment
UNION
SELECT DISTINCT CONVERT(char(7), OrderDate,    126) AS YearMonth
FROM healthcare.LabOrder;

-- 10. Providers who have claims OR lab orders
SELECT DISTINCT ProviderID FROM healthcare.Claim
UNION
SELECT DISTINCT ProviderID FROM healthcare.LabOrder;

-- 11. Patients who appear in claims OR in payments (via claim)
SELECT DISTINCT PatientID
FROM healthcare.Claim
UNION
SELECT DISTINCT c.PatientID
FROM healthcare.Payment p
JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID;

-- 12. Medications appearing in prescriptions in July OR Aug 2025
SELECT DISTINCT MedicationID
FROM healthcare.Prescription
WHERE StartDate BETWEEN '2025-07-01' AND '2025-07-31'
UNION
SELECT DISTINCT MedicationID
FROM healthcare.Prescription
WHERE StartDate BETWEEN '2025-08-01' AND '2025-08-31';
```

## Intersect
```sql
-- 1. Patients who had July appointments AND July lab orders
SELECT DISTINCT ap.PatientID
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
INTERSECT
SELECT DISTINCT lo.PatientID
FROM healthcare.LabOrder lo
WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd;

-- 2. Providers with July appointments AND July lab orders
SELECT DISTINCT ap.ProviderID
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
INTERSECT
SELECT DISTINCT lo.ProviderID
FROM healthcare.LabOrder lo
WHERE CAST(lo.OrderDate AS date) BETWEEN @RefStart AND @RefEnd;

-- 3. Patients with claims in July AND payments in July
SELECT DISTINCT c.PatientID
FROM healthcare.Claim c
WHERE c.ClaimDate BETWEEN @RefStart AND @RefEnd
INTERSECT
SELECT DISTINCT c2.PatientID
FROM healthcare.Payment p
JOIN healthcare.Claim c2 ON c2.ClaimID = p.ClaimID
WHERE p.PaymentDate BETWEEN @RefStart AND @RefEnd;

-- 4. Policies active today AND referenced by any July claim (PolicyID)
SELECT DISTINCT PolicyID
FROM healthcare.InsurancePolicy
WHERE EffectiveDate <= @Today
  AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
INTERSECT
SELECT DISTINCT PolicyID
FROM healthcare.Claim
WHERE ClaimDate BETWEEN @RefStart AND @RefEnd;

-- 5. Lab test names that appear in July AND whose average value (overall) > threshold
SELECT DISTINCT TestName
FROM healthcare.LabResult
WHERE CAST(ResultDate AS date) BETWEEN @RefStart AND @RefEnd
INTERSECT
SELECT TestName
FROM healthcare.LabResult
GROUP BY TestName
HAVING AVG(ResultValue) > 5.0;

-- 6. Patients with an active prescription today AND an appointment in next 7 days
SELECT DISTINCT PatientID
FROM healthcare.Prescription
WHERE StartDate <= @Today
  AND (EndDate IS NULL OR EndDate >= @Today)
INTERSECT
SELECT DISTINCT ap.PatientID
FROM healthcare.Appointment ap
WHERE ap.ApptDateTime >= DATEADD(DAY, 1, @Today)
  AND ap.ApptDateTime <  DATEADD(DAY, 8, @Today);

-- 7. Cardiology providers AND providers with > 20 July appointments
SELECT ProviderID
FROM healthcare.Provider
WHERE Specialty = 'Cardiology'
INTERSECT
SELECT ProviderID
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY ProviderID
HAVING COUNT(*) > 20;

-- 8. Patients living in City10 AND having a BlueShield policy
SELECT p.PatientID
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
WHERE a.City = 'City10'
INTERSECT
SELECT DISTINCT ip.PatientID
FROM healthcare.InsurancePolicy ip
WHERE ip.InsurerName = 'BlueShield';

-- 9. Calendar days with appointments AND lab orders
SELECT CAST(ApptDateTime AS date) AS D
FROM healthcare.Appointment
GROUP BY CAST(ApptDateTime AS date)
INTERSECT
SELECT CAST(OrderDate AS date) AS D
FROM healthcare.LabOrder
GROUP BY CAST(OrderDate AS date);

-- 10. Claims that are Paid AND > $1,000 (ClaimID)
SELECT ClaimID FROM healthcare.Claim WHERE Status = 'Paid'
INTERSECT
SELECT ClaimID FROM healthcare.Claim WHERE TotalCharge > 1000;

-- 11. Departments that have providers AND (those providers) had appointments in July
SELECT d.DepartmentID
FROM healthcare.Department d
JOIN healthcare.Provider pr ON pr.DepartmentID = d.DepartmentID
INTERSECT
SELECT d2.DepartmentID
FROM healthcare.Appointment ap
JOIN healthcare.Provider pr2 ON pr2.ProviderID = ap.ProviderID
JOIN healthcare.Department d2 ON d2.DepartmentID = pr2.DepartmentID
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 12. Patients with diagnoses (any) AND procedure records (any)
SELECT DISTINCT mr.PatientID
FROM healthcare.MedicalRecord mr
JOIN healthcare.Diagnosis dx ON dx.RecordID = mr.RecordID
INTERSECT
SELECT DISTINCT mr2.PatientID
FROM healthcare.MedicalRecord mr2
JOIN healthcare.ProcedureRecord pr ON pr.RecordID = mr2.RecordID;
```

## Except
```sql
-- 1. Patients with July appointments EXCEPT those whose July appointments were Completed
SELECT DISTINCT ap.PatientID
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
EXCEPT
SELECT DISTINCT ap2.PatientID
FROM healthcare.Appointment ap2
WHERE CAST(ap2.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  AND ap2.Status = 'Completed';

-- 2. Providers with any July appointment EXCEPT providers with any Cancelled appointment in July
SELECT DISTINCT ap.ProviderID
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
EXCEPT
SELECT DISTINCT ap2.ProviderID
FROM healthcare.Appointment ap2
WHERE CAST(ap2.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
  AND ap2.Status = 'Cancelled';

-- 3. Policies active today EXCEPT policies attached to Denied claims (PolicyID)
SELECT DISTINCT PolicyID
FROM healthcare.InsurancePolicy
WHERE EffectiveDate <= @Today
  AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
EXCEPT
SELECT DISTINCT PolicyID
FROM healthcare.Claim
WHERE Status = 'Denied';

-- 4. Patients with prescriptions EXCEPT patients with any appointment ever
SELECT DISTINCT PatientID
FROM healthcare.Prescription
EXCEPT
SELECT DISTINCT PatientID
FROM healthcare.Appointment;

-- 5. Lab test names EXCEPT ones containing 'Panel'
SELECT DISTINCT TestName
FROM healthcare.LabResult
EXCEPT
SELECT DISTINCT TestName
FROM healthcare.LabResult
WHERE TestName LIKE '%Panel%';

-- 6. Cities that have patients EXCEPT cities with July appointments
SELECT DISTINCT a.City
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
EXCEPT
SELECT DISTINCT a2.City
FROM healthcare.Appointment ap
JOIN healthcare.Patient p2 ON p2.PatientID = ap.PatientID
JOIN healthcare.Address a2 ON a2.AddressID = p2.AddressID
WHERE CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 7. Claims EXCEPT claims that have any payment (unpaid claims)
SELECT DISTINCT c.ClaimID
FROM healthcare.Claim c
EXCEPT
SELECT DISTINCT p.ClaimID
FROM healthcare.Payment p;

-- 8. Patients with any policy EXCEPT patients with an active policy today
SELECT DISTINCT PatientID
FROM healthcare.InsurancePolicy
EXCEPT
SELECT DISTINCT PatientID
FROM healthcare.InsurancePolicy
WHERE EffectiveDate <= @Today
  AND (ExpirationDate IS NULL OR ExpirationDate >= @Today);

-- 9. Providers with lab orders EXCEPT providers who authored any medical record
SELECT DISTINCT lo.ProviderID
FROM healthcare.LabOrder lo
EXCEPT
SELECT DISTINCT mr.AuthorID
FROM healthcare.MedicalRecord mr;

-- 10. Patients with lab results EXCEPT patients with prescriptions
SELECT DISTINCT lo.PatientID
FROM healthcare.LabOrder lo
JOIN healthcare.LabResult lr ON lr.LabOrderID = lo.LabOrderID
EXCEPT
SELECT DISTINCT pr.PatientID
FROM healthcare.Prescription pr;

-- 11. Rooms used in July EXCEPT rooms used after July
SELECT DISTINCT Location
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
EXCEPT
SELECT DISTINCT Location
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) > @RefEnd;

-- 12. July claims EXCEPT those Paid or Partially Paid (i.e., unpaid/denied/pending)
SELECT DISTINCT ClaimID
FROM healthcare.Claim
WHERE ClaimDate BETWEEN @RefStart AND @RefEnd
EXCEPT
SELECT DISTINCT ClaimID
FROM healthcare.Claim
WHERE ClaimDate BETWEEN @RefStart AND @RefEnd
  AND Status IN ('Paid','Partially Paid');
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
