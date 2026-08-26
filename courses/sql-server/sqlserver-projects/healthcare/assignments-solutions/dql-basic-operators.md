![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Equality Operator (=)
```sql
-- 1. Cardiology providers
SELECT ProviderID, FirstName, LastName, Specialty
FROM healthcare.Provider
WHERE Specialty = 'Cardiology';

-- 2. Completed appointments
SELECT *
FROM healthcare.Appointment
WHERE Status = 'Completed';

-- 3. Female patients
SELECT PatientID, FirstName, LastName, Gender
FROM healthcare.Patient
WHERE Gender = 'F';

-- 4. HbA1c lab results
SELECT *
FROM healthcare.LabResult
WHERE TestName = 'HbA1c';

-- 5. Insurance from BlueShield
SELECT *
FROM healthcare.InsurancePolicy
WHERE InsurerName = 'BlueShield';

-- 6. Paid claims
SELECT *
FROM healthcare.Claim
WHERE Status = 'Paid';

-- 7. Prescriptions with BID frequency
SELECT *
FROM healthcare.Prescription
WHERE Frequency = 'BID';

-- 8. Blood specimen orders
SELECT *
FROM healthcare.LabOrder
WHERE SpecimenType = 'Blood';

-- 9. Department = Dept-001
SELECT *
FROM healthcare.Department
WHERE Name = 'Dept-001';

-- 10. Addresses in USA
SELECT *
FROM healthcare.Address
WHERE Country = 'USA';
```

## Inequality Operator (<>)
```sql
-- 1. Providers not in Dermatology
SELECT ProviderID, FirstName, LastName, Specialty
FROM healthcare.Provider
WHERE Specialty <> 'Dermatology';

-- 2. Appointments not Cancelled
SELECT *
FROM healthcare.Appointment
WHERE Status <> 'Cancelled';

-- 3. Non-male patients
SELECT PatientID, FirstName, LastName, Gender
FROM healthcare.Patient
WHERE Gender <> 'M';

-- 4. Lab results other than TSH
SELECT *
FROM healthcare.LabResult
WHERE TestName <> 'TSH';

-- 5. Claims not Denied
SELECT *
FROM healthcare.Claim
WHERE Status <> 'Denied';

-- 6. Orders not Urine specimens
SELECT *
FROM healthcare.LabOrder
WHERE SpecimenType <> 'Urine';

-- 7. Departments not on Floor 1
SELECT *
FROM healthcare.Department
WHERE Floor <> 1;

-- 8. Medications not in Injection form
SELECT *
FROM healthcare.Medication
WHERE Form <> 'Injection';

-- 9. Procedures with CPT code not '00000'
SELECT *
FROM healthcare.ProcedureRecord
WHERE CPTCode <> '00000';

-- 10. Providers not in Dept-010 (by name join)
SELECT pr.*
FROM healthcare.Provider pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
WHERE d.Name <> 'Dept-010';
```

## IN Operator
```sql
-- 1. Appointments in Completed/Rescheduled
SELECT *
FROM healthcare.Appointment
WHERE Status IN ('Completed','Rescheduled');

-- 2. Providers in select specialties
SELECT ProviderID, FirstName, LastName, Specialty
FROM healthcare.Provider
WHERE Specialty IN ('Cardiology','Oncology','Neurology');

-- 3. Orders of Blood/Urine
SELECT *
FROM healthcare.LabOrder
WHERE SpecimenType IN ('Blood','Urine');

-- 4. Claims Paid or Partially Paid
SELECT *
FROM healthcare.Claim
WHERE Status IN ('Paid','Partially Paid');

-- 5. Medications in oral forms
SELECT *
FROM healthcare.Medication
WHERE Form IN ('Tablet','Capsule','Syrup');

-- 6. Patients in specific cities
SELECT p.PatientID, p.FirstName, p.LastName, a.City
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
WHERE a.City IN ('City10','City20','City30');

-- 7. Common test names
SELECT *
FROM healthcare.LabResult
WHERE TestName IN ('CBC','Lipid Panel','HbA1c');

-- 8. Prescription frequencies (BID/TID/QID)
SELECT *
FROM healthcare.Prescription
WHERE Frequency IN ('BID','TID','QID');

-- 9. Policies with selected insurers
SELECT *
FROM healthcare.InsurancePolicy
WHERE InsurerName IN ('BlueShield','Cigna','Humana');

-- 10. Departments by name set
SELECT *
FROM healthcare.Department
WHERE Name IN ('Dept-001','Dept-010','Dept-100');
```

## NOT IN Operator
```sql
-- 1. Appointments excluding Cancelled/No-Show
SELECT *
FROM healthcare.Appointment
WHERE Status NOT IN ('Cancelled','No-Show');

-- 2. Orders excluding Stool/Tissue specimens
SELECT *
FROM healthcare.LabOrder
WHERE SpecimenType NOT IN ('Stool','Tissue');

-- 3. Providers excluding Pediatrics/Dermatology
SELECT ProviderID, FirstName, LastName, Specialty
FROM healthcare.Provider
WHERE Specialty NOT IN ('Pediatrics','Dermatology');

-- 4. Patients not in two cities
SELECT p.PatientID, p.FirstName, p.LastName, a.City
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
WHERE a.City NOT IN ('City0','City1');

-- 5. Claims not Denied
SELECT *
FROM healthcare.Claim
WHERE Status NOT IN ('Denied');

-- 6. Medications not in Injection/Ointment
SELECT *
FROM healthcare.Medication
WHERE Form NOT IN ('Injection','Ointment');

-- 7. Prescriptions not PRN
SELECT *
FROM healthcare.Prescription
WHERE Frequency NOT IN ('PRN');

-- 8. Results not CRP
SELECT *
FROM healthcare.LabResult
WHERE TestName NOT IN ('CRP');

-- 9. Departments excluding Dept-001
SELECT *
FROM healthcare.Department
WHERE Name NOT IN ('Dept-001');

-- 10. Addresses not in USA/Canada
SELECT *
FROM healthcare.Address
WHERE Country NOT IN ('USA','Canada');
```

## LIKE Operator
```sql
-- 1. Patient first names starting with 'PatFirst1'
SELECT PatientID, FirstName, LastName
FROM healthcare.Patient
WHERE FirstName LIKE 'PatFirst1%';

-- 2. Emails at example.com
SELECT PatientID, Email
FROM healthcare.Patient
WHERE Email LIKE '%@example.com';

-- 3. NPIs starting with '1'
SELECT ProviderID, NPI_Number
FROM healthcare.Provider
WHERE NPI_Number LIKE '1%';

-- 4. Rooms starting Room-00*
SELECT *
FROM healthcare.Appointment
WHERE Location LIKE 'Room-00%';

-- 5. Cities beginning with 'City1'
SELECT *
FROM healthcare.Address
WHERE City LIKE 'City1%';

-- 6. Departments 'Dept-0__' (three digits)
SELECT *
FROM healthcare.Department
WHERE Name LIKE 'Dept-0__';

-- 7. Medication code-like names 'Med-00__'
SELECT *
FROM healthcare.Medication
WHERE Name LIKE 'Med-00__';

-- 8. ICD-10 codes beginning with 'I'
SELECT *
FROM healthcare.Diagnosis
WHERE ICD10Code LIKE 'I%';

-- 9. CPT codes starting with '12'
SELECT *
FROM healthcare.ProcedureRecord
WHERE CPTCode LIKE '12%';

-- 10. Provider phone block +1-555-*
SELECT ProviderID, Phone
FROM healthcare.Provider
WHERE Phone LIKE '+1-555-%';
```

## NOT LIKE Operator
```sql
-- 1. Patient emails not example.com
SELECT PatientID, Email
FROM healthcare.Patient
WHERE Email NOT LIKE '%@example.com';

-- 2. Providers whose first name not starting 'ProvFirst1'
SELECT ProviderID, FirstName, LastName
FROM healthcare.Provider
WHERE FirstName NOT LIKE 'ProvFirst1%';

-- 3. Cities not starting with 'City2'
SELECT *
FROM healthcare.Address
WHERE City NOT LIKE 'City2%';

-- 4. Medication names not starting with 'Med-0'
SELECT *
FROM healthcare.Medication
WHERE Name NOT LIKE 'Med-0%';

-- 5. Tests not containing 'Panel'
SELECT *
FROM healthcare.LabResult
WHERE TestName NOT LIKE '%Panel%';

-- 6. Rooms not in 001-009 (pattern)
SELECT *
FROM healthcare.Appointment
WHERE Location NOT LIKE 'Room-00[1-9]';

-- 7. ICD10 not starting with 'I'
SELECT *
FROM healthcare.Diagnosis
WHERE ICD10Code NOT LIKE 'I%';

-- 8. CPT not starting with '000'
SELECT *
FROM healthcare.ProcedureRecord
WHERE CPTCode NOT LIKE '000%';

-- 9. Claim status not starting with 'Pa' (Paid/Partially Paid)
SELECT *
FROM healthcare.Claim
WHERE Status NOT LIKE 'Pa%';

-- 10. Frequencies not ending with 'ID' (keeps Once daily/PRN)
SELECT *
FROM healthcare.Prescription
WHERE Frequency NOT LIKE '%ID';
```

## BETWEEN Operator
```sql
-- 1. Appointments in July 2025 (date-only)
SELECT *
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd;

-- 2. Claims between Jul 10 and Jul 20
SELECT *
FROM healthcare.Claim
WHERE ClaimDate BETWEEN '2025-07-10' AND '2025-07-20';

-- 3. Lab results in July
SELECT *
FROM healthcare.LabResult
WHERE CAST(ResultDate AS date) BETWEEN @RefStart AND @RefEnd;

-- 4. Payments between $100 and $500
SELECT *
FROM healthcare.Payment
WHERE AmountPaid BETWEEN 100 AND 500;

-- 5. Patients born 1970-1990
SELECT PatientID, FirstName, LastName, DOB
FROM healthcare.Patient
WHERE DOB BETWEEN '1970-01-01' AND '1990-12-31';

-- 6. Policies effective in 2025
SELECT *
FROM healthcare.InsurancePolicy
WHERE EffectiveDate BETWEEN '2025-01-01' AND '2025-12-31';

-- 7. Prescriptions starting in first half of July
SELECT *
FROM healthcare.Prescription
WHERE StartDate BETWEEN '2025-07-01' AND '2025-07-15';

-- 8. Procedures performed in July
SELECT *
FROM healthcare.ProcedureRecord
WHERE ProcedureDate BETWEEN @RefStart AND @RefEnd;

-- 9. HbA1c 4.0–7.0 %
SELECT *
FROM healthcare.LabResult
WHERE TestName = 'HbA1c'
  AND ResultValue BETWEEN 4.0 AND 7.0;

-- 10. Providers in departments 1–5
SELECT *
FROM healthcare.Provider
WHERE DepartmentID BETWEEN 1 AND 5;
```

## Greater Than (>)
```sql
-- 1. Payments > $1,000
SELECT *
FROM healthcare.Payment
WHERE AmountPaid > 1000;

-- 2. Claims > $2,000
SELECT *
FROM healthcare.Claim
WHERE TotalCharge > 2000;

-- 3. LDL (use Lipid Panel) values > 200 (illustrative)
SELECT *
FROM healthcare.LabResult
WHERE TestName = 'Lipid Panel'
  AND ResultValue > 200;

-- 4. Appointments after July
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime > @RefEnd;

-- 5. Patients born after 2005-01-01
SELECT PatientID, FirstName, LastName, DOB
FROM healthcare.Patient
WHERE DOB > '2005-01-01';

-- 6. Prescriptions where EndDate > StartDate
SELECT *
FROM healthcare.Prescription
WHERE EndDate > StartDate;

-- 7. Diagnoses after mid-July
SELECT *
FROM healthcare.Diagnosis
WHERE DiagnosedDate > '2025-07-15';

-- 8. Providers in higher floors (> 8) (via dept join)
SELECT pr.*
FROM healthcare.Provider pr
JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID
WHERE d.Floor > 8;

-- 9. Orders older than 7 days
SELECT *
FROM healthcare.LabOrder
WHERE DATEDIFF(DAY, OrderDate, @Today) > 7;

-- 10. Cities with > 100 patients (HAVING with >)
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
HAVING COUNT(*) > 100
ORDER BY PatientCount DESC;
```

## Greater Than or Equal To (>=)
```sql
-- 1. Payments >= $500
SELECT *
FROM healthcare.Payment
WHERE AmountPaid >= 500;

-- 2. Claims on/after July 15
SELECT *
FROM healthcare.Claim
WHERE ClaimDate >= '2025-07-15';

-- 3. Appointments on/after July 1
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime >= @RefStart;

-- 4. Prescriptions ending on/after today
SELECT *
FROM healthcare.Prescription
WHERE EndDate >= @Today;

-- 5. Policies effective on/after 2025-01-01
SELECT *
FROM healthcare.InsurancePolicy
WHERE EffectiveDate >= '2025-01-01';

-- 6. Departments on floor >= 10
SELECT *
FROM healthcare.Department
WHERE Floor >= 10;

-- 7. Procedures on/after Jul 20
SELECT *
FROM healthcare.ProcedureRecord
WHERE ProcedureDate >= '2025-07-20';

-- 8. Test results value >= 5 for CRP
SELECT *
FROM healthcare.LabResult
WHERE TestName = 'CRP'
  AND ResultValue >= 5;

-- 9. Providers in departments id >= 100
SELECT *
FROM healthcare.Provider
WHERE DepartmentID >= 100;

-- 10. Cities with >= 50 patients
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
HAVING COUNT(*) >= 50
ORDER BY PatientCount DESC;
```

## Less Than (<)
```sql
-- 1. Payments < $100
SELECT *
FROM healthcare.Payment
WHERE AmountPaid < 100;

-- 2. Claims < $200
SELECT *
FROM healthcare.Claim
WHERE TotalCharge < 200;

-- 3. Patients born before 1980
SELECT PatientID, FirstName, LastName, DOB
FROM healthcare.Patient
WHERE DOB < '1980-01-01';

-- 4. Appointments scheduled before July
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime < @RefStart;

-- 5. Policies expiring before today
SELECT *
FROM healthcare.InsurancePolicy
WHERE ExpirationDate < @Today;

-- 6. Procedures before July 10
SELECT *
FROM healthcare.ProcedureRecord
WHERE ProcedureDate < '2025-07-10';

-- 7. CRP results < 5
SELECT *
FROM healthcare.LabResult
WHERE TestName = 'CRP'
  AND ResultValue < 5;

-- 8. Departments on floor < 3
SELECT *
FROM healthcare.Department
WHERE Floor < 3;

-- 9. Orders within 3 days age
SELECT *
FROM healthcare.LabOrder
WHERE DATEDIFF(DAY, OrderDate, @Today) < 3;

-- 10. Cities with < 20 patients
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
HAVING COUNT(*) < 20
ORDER BY PatientCount;
```

## Less Than or Equal To (<=)
```sql
-- 1. Payments <= $50
SELECT *
FROM healthcare.Payment
WHERE AmountPaid <= 50;

-- 2. Claims <= $150
SELECT *
FROM healthcare.Claim
WHERE TotalCharge <= 150;

-- 3. Patients born on/before 1975-12-31
SELECT PatientID, FirstName, LastName, DOB
FROM healthcare.Patient
WHERE DOB <= '1975-12-31';

-- 4. Appointments on/before July 15
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime <= '2025-07-15';

-- 5. Policies expiring on/before 2025-08-31
SELECT *
FROM healthcare.InsurancePolicy
WHERE ExpirationDate <= '2025-08-31';

-- 6. Procedures on/before Jul 05
SELECT *
FROM healthcare.ProcedureRecord
WHERE ProcedureDate <= '2025-07-05';

-- 7. HbA1c <= 6.5
SELECT *
FROM healthcare.LabResult
WHERE TestName = 'HbA1c'
  AND ResultValue <= 6.5;

-- 8. Departments on floor <= 2
SELECT *
FROM healthcare.Department
WHERE Floor <= 2;

-- 9. Orders placed within last 1 day (age <= 1)
SELECT *
FROM healthcare.LabOrder
WHERE DATEDIFF(DAY, OrderDate, @Today) <= 1;

-- 10. Cities with <= 10 patients
SELECT a.City, COUNT(*) AS PatientCount
FROM healthcare.Patient p
JOIN healthcare.Address a ON a.AddressID = p.AddressID
GROUP BY a.City
HAVING COUNT(*) <= 10
ORDER BY PatientCount;
```

## EXISTS Operator
```sql
-- 1. Patients with any appointment in July
SELECT p.*
FROM healthcare.Patient p
WHERE EXISTS (
  SELECT 1
  FROM healthcare.Appointment ap
  WHERE ap.PatientID = p.PatientID
    AND CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
);

-- 2. Providers who have lab orders
SELECT pr.*
FROM healthcare.Provider pr
WHERE EXISTS (
  SELECT 1 FROM healthcare.LabOrder lo
  WHERE lo.ProviderID = pr.ProviderID
);

-- 3. Policies with at least one claim
SELECT ip.*
FROM healthcare.InsurancePolicy ip
WHERE EXISTS (
  SELECT 1 FROM healthcare.Claim c
  WHERE c.PolicyID = ip.PolicyID
);

-- 4. Claims that have payments
SELECT c.*
FROM healthcare.Claim c
WHERE EXISTS (
  SELECT 1 FROM healthcare.Payment p
  WHERE p.ClaimID = c.ClaimID
);

-- 5. Patients with an active prescription
SELECT p.*
FROM healthcare.Patient p
WHERE EXISTS (
  SELECT 1 FROM healthcare.Prescription pr
  WHERE pr.PatientID = p.PatientID
    AND pr.StartDate <= @Today
    AND (pr.EndDate IS NULL OR pr.EndDate >= @Today)
);

-- 6. Medical records that have diagnoses
SELECT mr.*
FROM healthcare.MedicalRecord mr
WHERE EXISTS (
  SELECT 1 FROM healthcare.Diagnosis d
  WHERE d.RecordID = mr.RecordID
);

-- 7. Lab orders with results
SELECT lo.*
FROM healthcare.LabOrder lo
WHERE EXISTS (
  SELECT 1 FROM healthcare.LabResult lr
  WHERE lr.LabOrderID = lo.LabOrderID
);

-- 8. Providers who authored any medical record
SELECT pr.*
FROM healthcare.Provider pr
WHERE EXISTS (
  SELECT 1 FROM healthcare.MedicalRecord mr
  WHERE mr.AuthorID = pr.ProviderID
);

-- 9. Patients with BlueShield policy active today
SELECT p.*
FROM healthcare.Patient p
WHERE EXISTS (
  SELECT 1 FROM healthcare.InsurancePolicy ip
  WHERE ip.PatientID = p.PatientID
    AND ip.InsurerName = 'BlueShield'
    AND ip.EffectiveDate <= @Today
    AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate >= @Today)
);

-- 10. Providers with Cancelled appointments
SELECT pr.*
FROM healthcare.Provider pr
WHERE EXISTS (
  SELECT 1 FROM healthcare.Appointment ap
  WHERE ap.ProviderID = pr.ProviderID
    AND ap.Status = 'Cancelled'
);
```

## NOT EXISTS Operator
```sql
-- 1. Patients without any appointment in July
SELECT p.*
FROM healthcare.Patient p
WHERE NOT EXISTS (
  SELECT 1
  FROM healthcare.Appointment ap
  WHERE ap.PatientID = p.PatientID
    AND CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
);

-- 2. Providers with no appointments in July
SELECT pr.*
FROM healthcare.Provider pr
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.Appointment ap
  WHERE ap.ProviderID = pr.ProviderID
    AND CAST(ap.ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
);

-- 3. Claims with no payments
SELECT c.*
FROM healthcare.Claim c
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.Payment p
  WHERE p.ClaimID = c.ClaimID
);

-- 4. Patients with no active policy today
SELECT p.*
FROM healthcare.Patient p
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.InsurancePolicy ip
  WHERE ip.PatientID = p.PatientID
    AND ip.EffectiveDate <= @Today
    AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate >= @Today)
);

-- 5. Lab orders without results
SELECT lo.*
FROM healthcare.LabOrder lo
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.LabResult lr
  WHERE lr.LabOrderID = lo.LabOrderID
);

-- 6. Patients with no prescriptions
SELECT p.*
FROM healthcare.Patient p
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.Prescription pr
  WHERE pr.PatientID = p.PatientID
);

-- 7. Providers with no lab orders
SELECT pr.*
FROM healthcare.Provider pr
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.LabOrder lo
  WHERE lo.ProviderID = pr.ProviderID
);

-- 8. Medical records without diagnoses
SELECT mr.*
FROM healthcare.MedicalRecord mr
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.Diagnosis d
  WHERE d.RecordID = mr.RecordID
);

-- 9. Patients without any insurance policy
SELECT p.*
FROM healthcare.Patient p
WHERE NOT EXISTS (
  SELECT 1 FROM healthcare.InsurancePolicy ip
  WHERE ip.PatientID = p.PatientID
);

-- 10. Appointments without a same-day medical record (per patient)
SELECT ap.*
FROM healthcare.Appointment ap
WHERE NOT EXISTS (
  SELECT 1
  FROM healthcare.MedicalRecord mr
  WHERE mr.PatientID = ap.PatientID
    AND CAST(mr.RecordDate AS date) = CAST(ap.ApptDateTime AS date)
);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
