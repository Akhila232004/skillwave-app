![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Select
1. List patient basic details
2. Provider full name & specialty
3. Appointments with split date/time
4. Patients with city/state (join Address)
5. Distinct appointment statuses
6. Latest 20 medical records (basic select)
7. Prescriptions with medication details
8. Lab results with patient and provider via order
9. Claims with insurer info
10. Payments with claim total (join)
11. Diagnoses with record/date
12. Procedure records with note date and author

## WHERE
1. Appointments in July 2025
2. Cardiology providers
3. Patients aged 65+ (approx by year)
4. HbA1c results above 6.5%
5. Active insurance policies (current)
6. Denied claims in July
7. Payments in the last 7 days
8. Currently active prescriptions
9. Completed appointments in Room-001
10. Progress notes written in July
11. Patients in City10
12. Blood lab orders that are Ordered or In-Process

## GROUP BY
1. Appointment count by status
2. Appointments per provider in July
3. Daily appointment counts (all-time)
4. Lab result count per test name
5. Total charges by insurer in July
6. Payments by method in 2025
7. Diagnosis frequency by ICD-10
8. Active prescription counts per medication
9. Patients per city
10. Providers per department
11. Average claim charge by status
12. Average result value by test name (only numeric tests)

## HAVING
1. Providers with > 50 appointments in July
2. Patients with >= 2 appointments in July
3. Cities with > 100 appointments in July
4. Medications prescribed to >= 50 patients (active now)
5. Insurers with July charges > 100,000
6. Patients with more than 3 diagnoses total
7. Providers with > 10 lab orders in July
8. Departments with >= 40 providers
9. Test names whose average HbA1c >= 6.5 (illustrative)
10. Patients where total payments < total charges (open balance across July claims)
11. Providers with completion rate < 80% in July
12. Assets (procedures by author): providers with > 20 procedures

## ORDER BY
1. Patients by last name, first name
2. Recent appointments first
3. Claims by highest TotalCharge
4. Lab results by ResultDate then TestName
5. Providers by Specialty then LastName
6. Prescriptions ending soonest (NULLs last)
7. Insurance policies by Expiration (NULLs last)
8. Cities by patient count (desc)
9. Departments by provider count (desc), tie-breaker by name
10. Lab orders by status then newest first
11. Medical records (for a patient) by newest first
12. Denied claims by most recent

## TOP
1. Top 10 patients by July claim charges
2. Top 5 providers by July appointment count (WITH TIES)
3. Top 20 latest appointments overall
4. Top 15 largest payments
5. Top 10 medications by active prescription count
6. Top 10 cities by July appointment volume
7. Top 3 lab tests by frequency in July
8. Top 10 providers by July claim charges
9. Top 10 patients by number of lab orders
10. Top 5 departments by provider count
11. Top 10 diagnoses by frequency
12. Per patient: top 1 most expensive claim (CROSS APPLY)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
