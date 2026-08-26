![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Inner Join
1. July appointments with patient & provider names
2. Claims in July with insurer and patient
3. Lab results with order and provider
4. Prescriptions with medication and prescriber
5. Medical records with author and patient
6. Procedures with patient and CPT details
7. Diagnoses with patient and date
8. Appointments with patient city
9. Payments with claim and patient
10. Providers with department name
11. Appointments with policy active on appointment date
12. CBC results with patient and ordering provider

## Left Join (Left Outer Join)
1. Patients with their July appointment counts (include zero)
2. Providers and their last appointment date
3. Lab orders with (optional) results count
4. Claims with total payments (claims without payments included)
5. Patients with any active policy today (NULL if none)
6. Medications with active prescription count (include unused meds)
7. Departments with provider counts (include empty depts)
8. Appointments with same-day medical note flag
9. Patients with their last lab result date (NULL if none)
10. Policies with claim counts (include policies with 0)
11. Providers with July lab order counts (include zero)
12. Medications with last prescribed date (NULL if never)

## Right Join (Right Outer Join)
1. Providers with July appointment counts (RIGHT join to include all providers)
2. Lab orders with result counts (RIGHT join to include all orders)
3. Claims with total paid (RIGHT join to include unpaid claims)
4. Medications with prescription counts (RIGHT join to include unused meds)
5. Patients with note counts (RIGHT join to include patients without notes)
6. Records with diagnosis counts (RIGHT join keeps all records)
7. Records with procedure counts (RIGHT join keeps all records)
8. Patients with policy counts (RIGHT join includes patients without policy)
9. Departments with provider counts (RIGHT join to include all depts)
10. Providers with lab order counts (RIGHT join to include all providers)
11. Policies with claim counts (RIGHT join to include all policies)
12. Patients with appointment counts (RIGHT join includes patients with none)

## Full Join (Full Outer Join)
1. Patients vs. July appointments (show who lacks/has appointments)
2. Claims vs. Payments with match indicators
3. Lab orders vs. results (find orders without results and orphans)
4. Medical records vs. diagnoses
5. Medical records vs. procedures
6. Providers vs. July appointments (providers without appts & orphan appts)
7. Patients vs. active policies today
8. Medications vs. currently active prescriptions
9. Departments vs. providers (highlight empty departments)
10. Patients vs. July lab orders
11. Patients vs. July claims
12. Same-day appointments vs. notes (per patient)

## Cross Join
1. Build a July schedule grid: Cardiology providers × 3 rooms
2. Hours (09–17) × next 3 weekdays (template slots)
3. Top 5 providers × top 5 test names (matrix plan)
4. Distinct appointment statuses × rooms (first 5 rooms)
5. Insurers × months (Jul–Sep 2025) template grid
6. Providers (Dermatology) × 15-minute slots (09:00, 09:15, ..., 10:45)
7. Cities (top 5 by patients) × specialties (top 5 by providers)
8. Test names × units (as observed)
9. Three sample dates × three sample rooms (quick grid)
10. Policy carriers × status buckets (Claim)
11. Providers (top 3 by July appts) × next 5 dates (rolling)
12. Departments × sample floor labels (template)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
