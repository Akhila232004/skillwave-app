![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Union
1. Patients with July appointments OR July lab orders
2. Policies active today OR starting in next 30 days (PolicyID)
3. Providers with July appointments OR authored records in July
4. Claims that are Paid OR Partially Paid (ClaimID)
5. Clinical codes universe: ICD-10 (Diagnosis) OR CPT (Procedure) codes
6. Cities from patient addresses OR department locations (string union)
7. Patients with any prescription OR any medical record
8. Rooms used in July OR used after July (Location)
9. Activity months (yyyy-MM) from Appointments OR LabOrders
10. Providers who have claims OR lab orders
11. Patients who appear in claims OR in payments (via claim)
12. Medications appearing in prescriptions in July OR Aug 2025

## Intersect
1. Patients who had July appointments AND July lab orders
2. Providers with July appointments AND July lab orders
3. Patients with claims in July AND payments in July
4. Policies active today AND referenced by any July claim (PolicyID)
5. Lab test names that appear in July AND whose average value (overall) > threshold
6. Patients with an active prescription today AND an appointment in next 7 days
7. Cardiology providers AND providers with > 20 July appointments
8. Patients living in City10 AND having a BlueShield policy
9. Calendar days with appointments AND lab orders
10. Claims that are Paid AND > $1,000 (ClaimID)
11. Departments that have providers AND (those providers) had appointments in July
12. Patients with diagnoses (any) AND procedure records (any)

## Except
1. Patients with July appointments EXCEPT those whose July appointments were Completed
2. Providers with any July appointment EXCEPT providers with any Cancelled appointment in July
3. Policies active today EXCEPT policies attached to Denied claims (PolicyID)
4. Patients with prescriptions EXCEPT patients with any appointment ever
5. Lab test names EXCEPT ones containing 'Panel'
6. Cities that have patients EXCEPT cities with July appointments
7. Claims EXCEPT claims that have any payment (unpaid claims)
8. Patients with any policy EXCEPT patients with an active policy today
9. Providers with lab orders EXCEPT providers who authored any medical record
10. Patients with lab results EXCEPT patients with prescriptions
11. Rooms used in July EXCEPT rooms used after July
12. July claims EXCEPT those Paid or Partially Paid (i.e., unpaid/denied/pending)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
