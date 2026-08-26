![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Equality Operator (=)
1. Cardiology providers
2. Completed appointments
3. Female patients
4. HbA1c lab results
5. Insurance from BlueShield
6. Paid claims
7. Prescriptions with BID frequency
8. Blood specimen orders
9. Department = Dept-001
10. Addresses in USA

## Inequality Operator (<>)
1. Providers not in Dermatology
2. Appointments not Cancelled
3. Non-male patients
4. Lab results other than TSH
5. Claims not Denied
6. Orders not Urine specimens
7. Departments not on Floor 1
8. Medications not in Injection form
9. Procedures with CPT code not '00000'
10. Providers not in Dept-010 (by name join)

## IN Operator
1. Appointments in Completed/Rescheduled
2. Providers in select specialties
3. Orders of Blood/Urine
4. Claims Paid or Partially Paid
5. Medications in oral forms
6. Patients in specific cities
7. Common test names
8. Prescription frequencies (BID/TID/QID)
9. Policies with selected insurers
10. Departments by name set

## NOT IN Operator
1. Appointments excluding Cancelled/No-Show
2. Orders excluding Stool/Tissue specimens
3. Providers excluding Pediatrics/Dermatology
4. Patients not in two cities
5. Claims not Denied
6. Medications not in Injection/Ointment
7. Prescriptions not PRN
8. Results not CRP
9. Departments excluding Dept-001
10. Addresses not in USA/Canada

## LIKE Operator
1. Patient first names starting with 'PatFirst1'
2. Emails at example.com
3. NPIs starting with '1'
4. Rooms starting Room-00*
5. Cities beginning with 'City1'
6. Departments 'Dept-0__' (three digits)
7. Medication code-like names 'Med-00__'
8. ICD-10 codes beginning with 'I'
9. CPT codes starting with '12'
10. Provider phone block +1-555-*

## NOT LIKE Operator
1. Patient emails not example.com
2. Providers whose first name not starting 'ProvFirst1'
3. Cities not starting with 'City2'
4. Medication names not starting with 'Med-0'
5. Tests not containing 'Panel'
6. Rooms not in 001-009 (pattern)
7. ICD10 not starting with 'I'
8. CPT not starting with '000'
9. Claim status not starting with 'Pa' (Paid/Partially Paid)
10. Frequencies not ending with 'ID' (keeps Once daily/PRN)

## BETWEEN Operator
1. Appointments in July 2025 (date-only)
2. Claims between Jul 10 and Jul 20
3. Lab results in July
4. Payments between $100 and $500
5. Patients born 1970-1990
6. Policies effective in 2025
7. Prescriptions starting in first half of July
8. Procedures performed in July
9. HbA1c 4.0–7.0 %
10. Providers in departments 1–5

## Greater Than (>)
1. Payments > $1,000
2. Claims > $2,000
3. LDL (use Lipid Panel) values > 200 (illustrative)
4. Appointments after July
5. Patients born after 2005-01-01
6. Prescriptions where EndDate > StartDate
7. Diagnoses after mid-July
8. Providers in higher floors (> 8) (via dept join)
9. Orders older than 7 days
10. Cities with > 100 patients (HAVING with >)

## Greater Than or Equal To (>=)
1. Payments >= $500
2. Claims on/after July 15
3. Appointments on/after July 1
4. Prescriptions ending on/after today
5. Policies effective on/after 2025-01-01
6. Departments on floor >= 10
7. Procedures on/after Jul 20
8. Test results value >= 5 for CRP
9. Providers in departments id >= 100
10. Cities with >= 50 patients

## Less Than (<)
1. Payments < $100
2. Claims < $200
3. Patients born before 1980
4. Appointments scheduled before July
5. Policies expiring before today
6. Procedures before July 10
7. CRP results < 5
8. Departments on floor < 3
9. Orders within 3 days age
10. Cities with < 20 patients

## Less Than or Equal To (<=)
1. Payments <= $50
2. Claims <= $150
3. Patients born on/before 1975-12-31
4. Appointments on/before July 15
5. Policies expiring on/before 2025-08-31
6. Procedures on/before Jul 05
7. HbA1c <= 6.5
8. Departments on floor <= 2
9. Orders placed within last 1 day (age <= 1)
10. Cities with <= 10 patients

## EXISTS Operator
1. Patients with any appointment in July
2. Providers who have lab orders
3. Policies with at least one claim
4. Claims that have payments
5. Patients with an active prescription
6. Medical records that have diagnoses
7. Lab orders with results
8. Providers who authored any medical record
9. Patients with BlueShield policy active today
10. Providers with Cancelled appointments

## NOT EXISTS Operator
1. Patients without any appointment in July
2. Providers with no appointments in July
3. Claims with no payments
4. Patients with no active policy today
5. Lab orders without results
6. Patients with no prescriptions
7. Providers with no lab orders
8. Medical records without diagnoses
9. Patients without any insurance policy
10. Appointments without a same-day medical record (per patient)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
