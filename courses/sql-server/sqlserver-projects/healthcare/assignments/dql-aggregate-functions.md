![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Count
1. Total number of patients
2. Patients per city
3. Total appointments in July 2025
4. July appointments by status
5. Distinct providers who had appointments in July
6. Lab orders per provider in July
7. Lab result count by test name
8. July claims by status
9. Prescriptions per patient (top 10)
10. Providers per department

## Sum
1. Total claim charges in July 2025
2. Total payments received in July 2025
3. Payments by method (lifetime)
4. July total charge per patient (top 10)
5. Claim vs paid vs balance per claim
6. Total charges by insurer (via policy)
7. Sum of result values by test in July (for numeric tests)
8. Completed-appointment counts via SUM(CASE) per provider in July
9. Total charges by provider (provider on claim)
10. Total payments by claim status (join to claims)

## Avg
1. Average claim amount (lifetime) and in July
2. Average payment by method
3. Average lab result per test name
4. Average days from claim to payment (per payment)
5. Average number of July appointments per provider
6. Average patient age in years (approx)
7. Average policy duration (days) where expiration exists
8. Average prescription duration (days; open-ended to @Today)
9. Average appointment hour (0–23)
10. Average claim amount by insurer

## Max
1. Maximum claim amount (overall)
2. Maximum claim per patient (top 10 by max claim)
3. Latest appointment per provider
4. Latest lab result date per patient
5. Maximum payment amount by method
6. For each provider: max number of appointments in any single day
7. Latest policy expiration per patient
8. Maximum days to pay per claim (if multiple payments)
9. Max lab result value per test
10. Latest appointment in the system

## Min
1. Minimum claim amount (overall)
2. Earliest appointment per provider
3. Earliest policy effective date per patient
4. Minimum lab result value per test
5. Minimum minutes from order to result per test
6. Earliest payment date per claim
7. Earliest medical record per patient
8. Oldest patient (minimum DOB)
9. Minimum appointments per weekday in July (system-wide)
10. Earliest diagnosis date per patient (patients with any diagnosis)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
