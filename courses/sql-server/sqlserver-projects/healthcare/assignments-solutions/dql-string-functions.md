![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Length Function (LEN)
```sql
-- 1. Length of patient first and last names
SELECT PatientID, FirstName, LastName, LEN(FirstName) AS LenFirst, LEN(LastName) AS LenLast
FROM healthcare.Patient;

-- 2. Providers with NPI length other than 10
SELECT ProviderID, NPI_Number, LEN(NPI_Number) AS NpiLen
FROM healthcare.Provider
WHERE LEN(NPI_Number) <> 10;

-- 3. Long medication names (>= 12 chars)
SELECT MedicationID, Name, LEN(Name) AS NameLen
FROM healthcare.Medication
WHERE LEN(Name) >= 12;

-- 4. Email lengths for patients
SELECT PatientID, Email, LEN(Email) AS EmailLen
FROM healthcare.Patient
WHERE Email IS NOT NULL;

-- 5. Address street name lengths
SELECT AddressID, Street, LEN(Street) AS StreetLen
FROM healthcare.Address
ORDER BY StreetLen DESC;

-- 6. Department name lengths
SELECT DepartmentID, Name, LEN(Name) AS DeptNameLen
FROM healthcare.Department;

-- 7. Claim status text length
SELECT ClaimID, Status, LEN(COALESCE(Status,'')) AS StatusLen
FROM healthcare.Claim;

-- 8. Appointment location length check
SELECT AppointmentID, Location, LEN(COALESCE(Location,'')) AS LocLen
FROM healthcare.Appointment;

-- 9. ICD-10 code length distribution
SELECT LEN(ICD10Code) AS CodeLen, COUNT(*) AS Cnt
FROM healthcare.Diagnosis
GROUP BY LEN(ICD10Code)
ORDER BY CodeLen;

-- 10. RX instruction length top 20
SELECT TOP (20) PrescriptionID, Instructions, LEN(COALESCE(Instructions,'')) AS InstrLen
FROM healthcare.Prescription
ORDER BY InstrLen DESC;
```

## Substring Function (SUBSTRING)
```sql
-- 1. Extract email domain from patient emails
SELECT PatientID, Email,
       SUBSTRING(Email, CHARINDEX('@', Email) + 1, 200) AS EmailDomain
FROM healthcare.Patient
WHERE Email LIKE '%@%';

-- 2. Extract area block from provider phone "+1-555-XXXX"
SELECT ProviderID, Phone,
       SUBSTRING(Phone, 5, 3) AS AreaBlock
FROM healthcare.Provider
WHERE Phone LIKE '+_-___-%' ESCAPE '_';

-- 3. First 3 chars of city
SELECT AddressID, City, SUBSTRING(City, 1, 3) AS City3
FROM healthcare.Address;

-- 4. Last 4 chars of PolicyNumber (via SUBSTRING + LEN)
SELECT PolicyID, PolicyNumber,
       SUBSTRING(PolicyNumber, LEN(PolicyNumber) - 3, 4) AS PolicyTail4
FROM healthcare.InsurancePolicy;

-- 5. CPT segments: first two and rest
SELECT ProcedureID, CPTCode,
       SUBSTRING(CPTCode,1,2) AS CPT2,
       SUBSTRING(CPTCode,3,LEN(CPTCode)) AS CPT_Rest
FROM healthcare.ProcedureRecord;

-- 6. NPI prefix(3) and suffix(3)
SELECT ProviderID, NPI_Number,
       SUBSTRING(NPI_Number,1,3) AS NPI_Prefix,
       SUBSTRING(NPI_Number,LEN(NPI_Number)-2,3) AS NPI_Suffix
FROM healthcare.Provider;

-- 7. Appointment date string parts "YYYY-MM" from datetime
SELECT AppointmentID, ApptDateTime,
       SUBSTRING(CONVERT(varchar(10), ApptDateTime, 126),1,7) AS YearMonth
FROM healthcare.Appointment;

-- 8. Medication strength number (before space)
SELECT MedicationID, Strength,
       SUBSTRING(Strength, 1, NULLIF(CHARINDEX(' ',Strength)-1,-1)) AS StrengthNum
FROM healthcare.Medication
WHERE Strength IS NOT NULL;

-- 9. Extract city code digits from 'City123'
SELECT AddressID, City,
       SUBSTRING(City, 5, LEN(City)-4) AS CityCode
FROM healthcare.Address
WHERE City LIKE 'City%';

-- 10. Test code prefix 'T' and numeric suffix
SELECT LabResultID, TestCode,
       SUBSTRING(TestCode,1,1) AS Prefix,
       SUBSTRING(TestCode,2,LEN(TestCode)-1) AS NumericPart
FROM healthcare.LabResult;
```

## Concatenation Operator (+)
```sql
-- 1. Full patient name
SELECT PatientID, FirstName + ' ' + LastName AS FullName
FROM healthcare.Patient;

-- 2. Provider display "Name (Specialty)"
SELECT ProviderID, (FirstName + ' ' + LastName + ' (' + COALESCE(Specialty,'NA') + ')') AS ProviderDisplay
FROM healthcare.Provider;

-- 3. Address single-line
SELECT AddressID, Street + ', ' + City + ', ' + State + ' ' + ZIP + ', ' + Country AS FullAddress
FROM healthcare.Address;

-- 4. Appointment label
SELECT AppointmentID, (CONVERT(varchar(19), ApptDateTime, 120) + ' @ ' + COALESCE(Location,'(no room)')) AS ApptLabel
FROM healthcare.Appointment;

-- 5. Medication display
SELECT MedicationID, (Name + ' ' + COALESCE(Strength,'') + ' ' + COALESCE(Form,'')) AS MedicationDisplay
FROM healthcare.Medication;

-- 6. Policy composite key display
SELECT PolicyID, (InsurerName + ' / ' + PolicyNumber + ' / ' + COALESCE(GroupNumber,'NA')) AS PolicyKey
FROM healthcare.InsurancePolicy;

-- 7. Lab result display
SELECT lr.LabResultID, (lr.TestName + ' = ' + CONVERT(varchar(30), lr.ResultValue) + ' ' + COALESCE(lr.Units,'')) AS ResultDisplay
FROM healthcare.LabResult lr;

-- 8. Diagnosis coded description
SELECT DiagnosisID, (ICD10Code + ' - ' + COALESCE(Description,'')) AS DxDisplay
FROM healthcare.Diagnosis;

-- 9. Procedure coded description
SELECT ProcedureID, (CPTCode + ' - ' + COALESCE(Description,'')) AS ProcDisplay
FROM healthcare.ProcedureRecord;

-- 10. Claim labeled amount
SELECT ClaimID, ('$' + CONVERT(varchar(20), TotalCharge)) AS LabeledCharge
FROM healthcare.Claim;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase patient emails
SELECT PatientID, LOWER(Email) AS EmailLower
FROM healthcare.Patient
WHERE Email IS NOT NULL;

-- 2. Lowercase provider specialties
SELECT ProviderID, LOWER(Specialty) AS SpecialtyLower
FROM healthcare.Provider;

-- 3. Lowercase insurer names
SELECT PolicyID, LOWER(InsurerName) AS InsurerLower
FROM healthcare.InsurancePolicy;

-- 4. Lowercase cities
SELECT AddressID, LOWER(City) AS CityLower
FROM healthcare.Address;

-- 5. Lowercase medication names
SELECT MedicationID, LOWER(Name) AS MedLower
FROM healthcare.Medication;

-- 6. Lowercase appointment status
SELECT AppointmentID, LOWER(COALESCE(Status,'')) AS StatusLower
FROM healthcare.Appointment;

-- 7. Lowercase lab test names
SELECT LabResultID, LOWER(TestName) AS TestLower
FROM healthcare.LabResult;

-- 8. Lowercase department names
SELECT DepartmentID, LOWER(Name) AS DeptLower
FROM healthcare.Department;

-- 9. Lowercase claim status
SELECT ClaimID, LOWER(COALESCE(Status,'')) AS StatusLower
FROM healthcare.Claim;

-- 10. Lowercase prescription frequency
SELECT PrescriptionID, LOWER(COALESCE(Frequency,'')) AS FreqLower
FROM healthcare.Prescription;
```

## Upper Function (UPPER)
```sql
-- 1. Uppercase patient names
SELECT PatientID, UPPER(FirstName) AS FirstUpper, UPPER(LastName) AS LastUpper
FROM healthcare.Patient;

-- 2. Uppercase provider specialty
SELECT ProviderID, UPPER(COALESCE(Specialty,'')) AS SpecUpper
FROM healthcare.Provider;

-- 3. Uppercase city/state
SELECT AddressID, UPPER(City) AS CityUpper, UPPER(State) AS StateUpper
FROM healthcare.Address;

-- 4. Uppercase department name
SELECT DepartmentID, UPPER(Name) AS DeptUpper
FROM healthcare.Department;

-- 5. Uppercase medication form
SELECT MedicationID, UPPER(COALESCE(Form,'')) AS FormUpper
FROM healthcare.Medication;

-- 6. Uppercase claim status
SELECT ClaimID, UPPER(COALESCE(Status,'')) AS StatusUpper
FROM healthcare.Claim;

-- 7. Uppercase appointment status
SELECT AppointmentID, UPPER(COALESCE(Status,'')) AS ApptStatusUpper
FROM healthcare.Appointment;

-- 8. Uppercase test name
SELECT LabResultID, UPPER(TestName) AS TestUpper
FROM healthcare.LabResult;

-- 9. Uppercase insurer name
SELECT PolicyID, UPPER(InsurerName) AS InsurerUpper
FROM healthcare.InsurancePolicy;

-- 10. Uppercase prescription instructions
SELECT PrescriptionID, UPPER(COALESCE(Instructions,'')) AS InstrUpper
FROM healthcare.Prescription;
```

## Trim Function (TRIM)
```sql
-- 1. Trim patient names
SELECT PatientID, TRIM(FirstName) AS FirstNameTrim, TRIM(LastName) AS LastNameTrim
FROM healthcare.Patient;

-- 2. Trim provider phones
SELECT ProviderID, TRIM(COALESCE(Phone,'')) AS PhoneTrim
FROM healthcare.Provider;

-- 3. Trim room labels
SELECT AppointmentID, TRIM(COALESCE(Location,'')) AS RoomTrim
FROM healthcare.Appointment;

-- 4. Trim medication strings
SELECT MedicationID, TRIM(Name) AS NameTrim, TRIM(COALESCE(Form,'')) AS FormTrim
FROM healthcare.Medication;

-- 5. Trim department names
SELECT DepartmentID, TRIM(Name) AS DeptTrim
FROM healthcare.Department;

-- 6. Trim patient emails
SELECT PatientID, TRIM(COALESCE(Email,'')) AS EmailTrim
FROM healthcare.Patient;

-- 7. Trim insurer names
SELECT PolicyID, TRIM(InsurerName) AS InsurerTrim
FROM healthcare.InsurancePolicy;

-- 8. Trim policy numbers
SELECT PolicyID, TRIM(PolicyNumber) AS PolicyNumberTrim
FROM healthcare.InsurancePolicy;

-- 9. Trim claim status
SELECT ClaimID, TRIM(COALESCE(Status,'')) AS StatusTrim
FROM healthcare.Claim;

-- 10. Trim prescription frequency
SELECT PrescriptionID, TRIM(COALESCE(Frequency,'')) AS FreqTrim
FROM healthcare.Prescription;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Left-trim patient first names
SELECT PatientID, LTRIM(FirstName) AS FirstName_LTrim
FROM healthcare.Patient;

-- 2. Left-trim provider emails
SELECT ProviderID, LTRIM(COALESCE(Email,'')) AS Email_LTrim
FROM healthcare.Provider;

-- 3. Left-trim room labels
SELECT AppointmentID, LTRIM(COALESCE(Location,'')) AS Room_LTrim
FROM healthcare.Appointment;

-- 4. Left-trim medication name
SELECT MedicationID, LTRIM(Name) AS Med_LTrim
FROM healthcare.Medication;

-- 5. Left-trim department name
SELECT DepartmentID, LTRIM(Name) AS Dept_LTrim
FROM healthcare.Department;

-- 6. Left-trim insurer name
SELECT PolicyID, LTRIM(InsurerName) AS Insurer_LTrim
FROM healthcare.InsurancePolicy;

-- 7. Left-trim policy number
SELECT PolicyID, LTRIM(PolicyNumber) AS Policy_LTrim
FROM healthcare.InsurancePolicy;

-- 8. Left-trim claim status
SELECT ClaimID, LTRIM(COALESCE(Status,'')) AS Status_LTrim
FROM healthcare.Claim;

-- 9. Left-trim test name
SELECT LabResultID, LTRIM(TestName) AS Test_LTrim
FROM healthcare.LabResult;

-- 10. Left-trim prescription instructions
SELECT PrescriptionID, LTRIM(COALESCE(Instructions,'')) AS Instr_LTrim
FROM healthcare.Prescription;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Right-trim patient last names
SELECT PatientID, RTRIM(LastName) AS LastName_RTrim
FROM healthcare.Patient;

-- 2. Right-trim provider phones
SELECT ProviderID, RTRIM(COALESCE(Phone,'')) AS Phone_RTrim
FROM healthcare.Provider;

-- 3. Right-trim room labels
SELECT AppointmentID, RTRIM(COALESCE(Location,'')) AS Room_RTrim
FROM healthcare.Appointment;

-- 4. Right-trim medication strength
SELECT MedicationID, RTRIM(COALESCE(Strength,'')) AS Strength_RTrim
FROM healthcare.Medication;

-- 5. Right-trim department name
SELECT DepartmentID, RTRIM(Name) AS Dept_RTrim
FROM healthcare.Department;

-- 6. Right-trim insurer name
SELECT PolicyID, RTRIM(InsurerName) AS Insurer_RTrim
FROM healthcare.InsurancePolicy;

-- 7. Right-trim claim status
SELECT ClaimID, RTRIM(COALESCE(Status,'')) AS Status_RTrim
FROM healthcare.Claim;

-- 8. Right-trim test name
SELECT LabResultID, RTRIM(TestName) AS Test_RTrim
FROM healthcare.LabResult;

-- 9. Right-trim policy number
SELECT PolicyID, RTRIM(PolicyNumber) AS Policy_RTrim
FROM healthcare.InsurancePolicy;

-- 10. Right-trim prescription frequency
SELECT PrescriptionID, RTRIM(COALESCE(Frequency,'')) AS Freq_RTrim
FROM healthcare.Prescription;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '@' in patient emails
SELECT PatientID, Email, CHARINDEX('@', Email) AS AtPos
FROM healthcare.Patient
WHERE Email LIKE '%@%';

-- 2. Find hyphen position in provider phone
SELECT ProviderID, Phone, CHARINDEX('-', Phone) AS FirstHyphen
FROM healthcare.Provider
WHERE Phone LIKE '%-%';

-- 3. Check if 'Room-' appears in location
SELECT AppointmentID, Location, CHARINDEX('Room-', COALESCE(Location,'')) AS RoomPos
FROM healthcare.Appointment;

-- 4. Find space in medication strength
SELECT MedicationID, Strength, CHARINDEX(' ', COALESCE(Strength,'')) AS SpacePos
FROM healthcare.Medication;

-- 5. Find 'Dept-' pattern in department name
SELECT DepartmentID, Name, CHARINDEX('Dept-', Name) AS DeptTagPos
FROM healthcare.Department;

-- 6. Find '.' in ICD-10 code
SELECT DiagnosisID, ICD10Code, CHARINDEX('.', ICD10Code) AS DotPos
FROM healthcare.Diagnosis;

-- 7. Find '-' in policy number/group
SELECT PolicyID, PolicyNumber, GroupNumber,
       CHARINDEX('-', PolicyNumber) AS DashPosNum,
       CHARINDEX('-', COALESCE(GroupNumber,'')) AS DashPosGrp
FROM healthcare.InsurancePolicy;

-- 8. Find '%' sign in HbA1c units (some units like '%')
SELECT LabResultID, TestName, Units, CHARINDEX('%', COALESCE(Units,'')) AS PctPos
FROM healthcare.LabResult
WHERE TestName = 'HbA1c';

-- 9. Find 'Panel' substring in test name
SELECT LabResultID, TestName, CHARINDEX('Panel', TestName) AS PanelPos
FROM healthcare.LabResult;

-- 10. Find 'Paid' inside claim status
SELECT ClaimID, Status, CHARINDEX('Paid', COALESCE(Status,'')) AS PaidPos
FROM healthcare.Claim;
```

## Left Function (LEFT)
```sql
-- 1. First 5 chars of patient first name
SELECT PatientID, LEFT(FirstName,5) AS First5
FROM healthcare.Patient;

-- 2. City prefixes (first 4)
SELECT AddressID, LEFT(City,4) AS City4
FROM healthcare.Address;

-- 3. NPI first 4
SELECT ProviderID, LEFT(NPI_Number,4) AS NPI4
FROM healthcare.Provider;

-- 4. PolicyNumber first 3
SELECT PolicyID, LEFT(PolicyNumber,3) AS Policy3
FROM healthcare.InsurancePolicy;

-- 5. ICD-10 head (before dot or first 3)
SELECT DiagnosisID, ICD10Code,
       LEFT(ICD10Code, COALESCE(NULLIF(CHARINDEX('.',ICD10Code)-1,-1), 3)) AS ICDHead
FROM healthcare.Diagnosis;

-- 6. CPT first 2
SELECT ProcedureID, LEFT(CPTCode,2) AS CPT2
FROM healthcare.ProcedureRecord;

-- 7. TestName first 3
SELECT LabResultID, LEFT(TestName,3) AS Test3
FROM healthcare.LabResult;

-- 8. Department code 'Dep'?
SELECT DepartmentID, Name, LEFT(Name,3) AS Prefix3
FROM healthcare.Department;

-- 9. Room prefix
SELECT AppointmentID, Location, LEFT(COALESCE(Location,''),4) AS Loc4
FROM healthcare.Appointment;

-- 10. Medication name prefix
SELECT MedicationID, LEFT(Name,6) AS Med6
FROM healthcare.Medication;
```

## Right Function (RIGHT)
```sql
-- 1. Last 4 of provider phone
SELECT ProviderID, Phone, RIGHT(Phone,4) AS PhoneLast4
FROM healthcare.Provider;

-- 2. City numeric suffix (for 'City123')
SELECT AddressID, City, RIGHT(City, LEN(City)-4) AS CityNum
FROM healthcare.Address
WHERE City LIKE 'City%';

-- 3. Last 2 of state (works for codes like 'StateX')
SELECT AddressID, State, RIGHT(State,2) AS State2
FROM healthcare.Address;

-- 4. Last 3 of NPI
SELECT ProviderID, NPI_Number, RIGHT(NPI_Number,3) AS NpiLast3
FROM healthcare.Provider;

-- 5. Last 2 of ICD-10 (after dot or last 2)
SELECT DiagnosisID, ICD10Code,
       RIGHT(ICD10Code,2) AS ICDTail2
FROM healthcare.Diagnosis;

-- 6. Last 3 of CPT
SELECT ProcedureID, RIGHT(CPTCode,3) AS CPT3
FROM healthcare.ProcedureRecord;

-- 7. Last 2 characters of insurer name
SELECT PolicyID, InsurerName, RIGHT(InsurerName,2) AS Ins2
FROM healthcare.InsurancePolicy;

-- 8. Last 5 chars of medication name
SELECT MedicationID, RIGHT(Name,5) AS MedLast5
FROM healthcare.Medication;

-- 9. Last 3 chars of room
SELECT AppointmentID, Location, RIGHT(COALESCE(Location,''),3) AS RoomLast3
FROM healthcare.Appointment;

-- 10. Last 4 chars of PolicyNumber
SELECT PolicyID, RIGHT(PolicyNumber,4) AS PolicyLast4
FROM healthcare.InsurancePolicy;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse NPI numbers
SELECT ProviderID, NPI_Number, REVERSE(NPI_Number) AS NPI_Rev
FROM healthcare.Provider;

-- 2. Reverse policy numbers
SELECT PolicyID, PolicyNumber, REVERSE(PolicyNumber) AS Policy_Rev
FROM healthcare.InsurancePolicy;

-- 3. Reverse ICD-10 codes
SELECT DiagnosisID, ICD10Code, REVERSE(ICD10Code) AS ICD_Rev
FROM healthcare.Diagnosis;

-- 4. Reverse CPT codes
SELECT ProcedureID, CPTCode, REVERSE(CPTCode) AS CPT_Rev
FROM healthcare.ProcedureRecord;

-- 5. Reverse medication names
SELECT MedicationID, Name, REVERSE(Name) AS Name_Rev
FROM healthcare.Medication;

-- 6. Reverse city strings
SELECT AddressID, City, REVERSE(City) AS City_Rev
FROM healthcare.Address;

-- 7. Reverse patient email
SELECT PatientID, Email, REVERSE(Email) AS Email_Rev
FROM healthcare.Patient
WHERE Email IS NOT NULL;

-- 8. Reverse appointment location
SELECT AppointmentID, Location, REVERSE(COALESCE(Location,'')) AS Loc_Rev
FROM healthcare.Appointment;

-- 9. Reverse test codes
SELECT LabResultID, TestCode, REVERSE(TestCode) AS TestCode_Rev
FROM healthcare.LabResult;

-- 10. Reverse claim status
SELECT ClaimID, Status, REVERSE(COALESCE(Status,'')) AS Status_Rev
FROM healthcare.Claim;
```

## Replace Function (REPLACE)
```sql
-- 1. Remove hyphens from provider phone
SELECT ProviderID, Phone, REPLACE(Phone, '-', '') AS PhoneDigits
FROM healthcare.Provider;

-- 2. Replace 'Dept-' with '' in department name
SELECT DepartmentID, Name, REPLACE(Name,'Dept-','') AS DeptNoPrefix
FROM healthcare.Department;

-- 3. Replace spaces in medication name with underscores
SELECT MedicationID, Name, REPLACE(Name,' ','_') AS Name_Underscore
FROM healthcare.Medication;

-- 4. Normalize room: remove 'Room-'
SELECT AppointmentID, Location, REPLACE(COALESCE(Location,''),'Room-','') AS RoomNumOnly
FROM healthcare.Appointment;

-- 5. Replace '.' in ICD-10 with ''
SELECT DiagnosisID, ICD10Code, REPLACE(ICD10Code,'.','') AS ICD_NoDot
FROM healthcare.Diagnosis;

-- 6. Replace '-' in PolicyNumber with ''
SELECT PolicyID, PolicyNumber, REPLACE(PolicyNumber,'-','') AS PolicyClean
FROM healthcare.InsurancePolicy;

-- 7. Replace '%' in units with ' percent'
SELECT LabResultID, Units, REPLACE(COALESCE(Units,''), '%', ' percent') AS UnitsVerbose
FROM healthcare.LabResult;

-- 8. Replace 'PRN' in frequency with 'As Needed'
SELECT PrescriptionID, Frequency, REPLACE(COALESCE(Frequency,''),'PRN','As Needed') AS FreqExpanded
FROM healthcare.Prescription;

-- 9. Replace '+' in phone with '00'
SELECT ProviderID, Phone, REPLACE(Phone,'+','00') AS PhoneIntl
FROM healthcare.Provider;

-- 10. Replace '@example.com' with '@masked.local'
SELECT PatientID, Email, REPLACE(COALESCE(Email,''),'@example.com','@masked.local') AS EmailMasked
FROM healthcare.Patient;
```

## Case Statement (CASE)
```sql
-- 1. Gender label
SELECT PatientID, Gender,
       CASE Gender WHEN 'M' THEN 'Male' WHEN 'F' THEN 'Female' ELSE 'Other' END AS GenderLabel
FROM healthcare.Patient;

-- 2. Appointment status bucket
SELECT AppointmentID, Status,
       CASE Status
         WHEN 'Completed' THEN 'Done'
         WHEN 'Cancelled' THEN 'Cancelled'
         WHEN 'No-Show'   THEN 'Missed'
         ELSE 'Open'
       END AS StatusBucket
FROM healthcare.Appointment;

-- 3. Claim payment state
SELECT c.ClaimID, c.Status,
       CASE
         WHEN c.Status LIKE 'Paid%' THEN 'Paid'
         WHEN c.Status = 'Partially Paid' THEN 'Partial'
         WHEN c.Status = 'Denied' THEN 'Denied'
         ELSE 'Pending'
       END AS PayState
FROM healthcare.Claim c;

-- 4. Email domain classification
SELECT PatientID, Email,
       CASE
         WHEN Email LIKE '%@example.com' THEN 'Example'
         WHEN Email LIKE '%@%.%' THEN 'Other'
         ELSE 'Unknown'
       END AS DomainClass
FROM healthcare.Patient;

-- 5. City tier by name suffix number
SELECT a.AddressID, a.City,
       CASE
         WHEN TRY_CONVERT(int, RIGHT(a.City, LEN(a.City)-4)) >= 200 THEN 'Tier-1'
         WHEN TRY_CONVERT(int, RIGHT(a.City, LEN(a.City)-4)) BETWEEN 100 AND 199 THEN 'Tier-2'
         ELSE 'Tier-3'
       END AS CityTier
FROM healthcare.Address a
WHERE a.City LIKE 'City%';

-- 6. Medication form bucket
SELECT MedicationID, Form,
       CASE UPPER(COALESCE(Form,''))
         WHEN 'TABLET' THEN 'Oral'
         WHEN 'CAPSULE' THEN 'Oral'
         WHEN 'SYRUP' THEN 'Oral'
         WHEN 'INJECTION' THEN 'Parenteral'
         WHEN 'OINTMENT' THEN 'Topical'
         ELSE 'Other'
       END AS FormBucket
FROM healthcare.Medication;

-- 7. Policy active flag (text)
SELECT PolicyID, EffectiveDate, ExpirationDate,
       CASE WHEN EffectiveDate <= @Today AND (ExpirationDate IS NULL OR ExpirationDate >= @Today)
            THEN 'Active' ELSE 'Inactive' END AS ActiveFlag
FROM healthcare.InsurancePolicy;

-- 8. HbA1c control category
SELECT LabResultID, TestName, ResultValue,
       CASE
         WHEN TestName = 'HbA1c' AND ResultValue < 5.7 THEN 'Normal'
         WHEN TestName = 'HbA1c' AND ResultValue < 6.5 THEN 'Prediabetes'
         WHEN TestName = 'HbA1c' THEN 'Diabetes'
         ELSE 'N/A'
       END AS HbA1cCategory
FROM healthcare.LabResult;

-- 9. Provider seniority by NPI suffix
SELECT ProviderID, NPI_Number,
       CASE WHEN RIGHT(NPI_Number,1) BETWEEN '0' AND '4' THEN 'Senior' ELSE 'Junior' END AS Seniority
FROM healthcare.Provider;

-- 10. Appointment time-of-day bucket
SELECT AppointmentID, ApptDateTime,
       CASE
         WHEN CONVERT(time, ApptDateTime) <  '12:00' THEN 'Morning'
         WHEN CONVERT(time, ApptDateTime) <  '17:00' THEN 'Afternoon'
         ELSE 'Evening'
       END AS DayPart
FROM healthcare.Appointment;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Default missing patient phone to 'N/A'
SELECT PatientID, ISNULL(Phone, 'N/A') AS PhoneSafe
FROM healthcare.Patient;

-- 2. Default provider email
SELECT ProviderID, ISNULL(Email, 'unknown@local') AS EmailSafe
FROM healthcare.Provider;

-- 3. Default appointment location
SELECT AppointmentID, ISNULL(Location,'(TBD)') AS LocationSafe
FROM healthcare.Appointment;

-- 4. Default prescription end date text
SELECT PrescriptionID, ISNULL(CONVERT(varchar(10), EndDate, 120), 'OPEN') AS EndDateText
FROM healthcare.Prescription;

-- 5. Default claim status
SELECT ClaimID, ISNULL(Status,'(No Status)') AS StatusSafe
FROM healthcare.Claim;

-- 6. Default policy group number
SELECT PolicyID, ISNULL(GroupNumber,'(None)') AS GroupSafe
FROM healthcare.InsurancePolicy;

-- 7. Default test units
SELECT LabResultID, TestName, ISNULL(Units,'(unitless)') AS UnitsSafe
FROM healthcare.LabResult;

-- 8. Default medication strength
SELECT MedicationID, Name, ISNULL(Strength,'(NA)') AS StrengthSafe
FROM healthcare.Medication;

-- 9. Default diagnosis description
SELECT DiagnosisID, ICD10Code, ISNULL(Description,'(unspecified)') AS DxDesc
FROM healthcare.Diagnosis;

-- 10. Default instructions
SELECT PrescriptionID, ISNULL(Instructions, 'No special instructions') AS InstrSafe
FROM healthcare.Prescription;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Preferred contact: patient Email then Phone
SELECT PatientID, COALESCE(Email, Phone, '(no contact)') AS PreferredContact
FROM healthcare.Patient;

-- 2. Provider contact: Email, then Phone, else 'NA'
SELECT ProviderID, COALESCE(Email, Phone, 'NA') AS ProviderContact
FROM healthcare.Provider;

-- 3. Location fallback: Appointment.Location → Department.Location → 'Unknown'
SELECT ap.AppointmentID,
       COALESCE(ap.Location, d.Location, 'Unknown') AS EffectiveLocation
FROM healthcare.Appointment ap
LEFT JOIN healthcare.Provider pr ON pr.ProviderID = ap.ProviderID
LEFT JOIN healthcare.Department d ON d.DepartmentID = pr.DepartmentID;

-- 4. Policy identifier fallback: GroupNumber → PolicyNumber
SELECT PolicyID, COALESCE(GroupNumber, PolicyNumber) AS BestGroup
FROM healthcare.InsurancePolicy;

-- 5. Claim status fallback to 'Pending'
SELECT ClaimID, COALESCE(Status, 'Pending') AS StatusEff
FROM healthcare.Claim;

-- 6. Medication descriptor: Strength → Form → '(NA)'
SELECT MedicationID, COALESCE(Strength, Form, '(NA)') AS MedDesc
FROM healthcare.Medication;

-- 7. Patient name with middle (if existed) demonstration via COALESCE('','')
SELECT PatientID, (FirstName + ' ' + COALESCE(NULLIF('', ''), '') + LastName) AS NameDemo
FROM healthcare.Patient;

-- 8. Lab units fallback to reference range text
SELECT LabResultID, TestName,
       COALESCE(Units, ReferenceRange, '(n/a)') AS UnitsOrRef
FROM healthcare.LabResult;

-- 9. Prescription notes: Instructions → Frequency
SELECT PrescriptionID, COALESCE(Instructions, Frequency, '(none)') AS Note
FROM healthcare.Prescription;

-- 10. Address region: State → City → Country
SELECT AddressID, COALESCE(State, City, Country) AS Region
FROM healthcare.Address;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
