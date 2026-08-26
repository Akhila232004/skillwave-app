![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Aggregate Functions
1. Total appointments per patient (repeated on each of their rows)
2. July appointments per provider
3. Total claim charge per patient (lifetime)
4. Total payment per claim (lifetime)
5. Average lab result by TestName (repeat per row)
6. Running (cumulative) charges per patient by ClaimDate
7. Running appointment count per provider (chronological)
8. Claim amount as % of patient’s total
9. 3-point moving average of lab value per patient+test (current & 2 prev)
10. Min/Max claim per patient (on each claim row)

## ROW_NUMBER()
1. Latest appointment per patient
2. Top 3 prescriptions per patient by StartDate
3. Latest lab result per LabOrder
4. First diagnosis per patient
5. First policy per patient by EffectiveDate
6. Most recent appointment per provider+room
7. Deduplicate patients by Email (keep smallest PatientID)
8. First two claims of 2025 per patient
9. Appointment sequence number per patient
10. Latest payment per claim

## RANK()
1. Rank providers by July appointment count
2. Rank patients by total July claim charges
3. Rank test names by average value (overall)
4. Rank departments by number of providers
5. Rank policies by total claim charges
6. Rank providers by average minutes to result (lower is better)
7. Rank patients by count of July lab orders
8. Rank providers by total payments received (via their claims)
9. Rank cities by number of patients
10. Rank medications by active prescription count (today)

## DENSE_RANK()
1. Dense rank claim amounts within each patient (highest first)
2. Dense rank daily appointment counts per provider
3. Dense rank lab result values per (patient,test)
4. Dense rank providers by total claim charges
5. Dense rank medications by number of prescriptions
6. Dense rank patients by first appointment date
7. Dense rank insurers by average claim
8. Dense rank cities by patient count
9. Dense rank providers by distinct patients seen in July
10. Dense rank patients by age (older = rank 1)

## NTILE(n)
1. Quartiles of providers by July appointment counts
2. Deciles of patients by total lifetime claim charges
3. Quintiles of lab result values within each TestName
4. Quartiles of July claims by amount
5. Tertiles of policy durations (where expiration exists)
6. Quartiles of appointment lead time (days from today) within provider
7. Quartiles of total paid per claim
8. Quartiles of departments by provider count
9. Quintiles of cities by number of patients
10. Deciles of patients by lifetime appointment count

## LAG()
1. Claim amount delta vs previous claim per patient
2. Days since previous appointment per patient
3. Lab result change per (patient,test)
4. Payment delta per claim
5. Policy gap detection per patient (days from prev Expiration to next Effective)
6. Provider change between consecutive appointments per patient
7. Appointment status change flag (per appointment)
8. Repeated diagnosis detection (same as previous ICD10 for patient)
9. Minutes between consecutive lab results per order
10. Payment method changed flag per claim

## LEAD()
1. Next appointment per patient + days until next
2. Next lab result date/value per (patient,test)
3. Next payment per claim
4. Next prescription start per patient (overlap check)
5. Next policy effective per patient
6. Next diagnosis date for same patient
7. Next provider (continuity) for a patient
8. Next claim date per patient
9. Next lab result per LabOrder
10. Next appointment status per patient

## FIRST_VALUE()
1. First (earliest) appointment per patient (shown on every row)
2. First diagnosis date per patient
3. First lab result per order by ResultDate
4. First policy effective date per patient
5. First payment date per claim
6. First specialty a patient encountered (by earliest appointment)
7. First insurer for patient (by earliest policy)
8. First prescription start date per patient
9. First recorded medical note per patient
10. First lab TestName per order (alphabetically on first date)

## LAST_VALUE()
1. Last (latest) appointment per patient (shown on every row)
2. Last payment date per claim
3. Last lab result per order
4. Last policy expiration date per patient (ignoring NULLs via ordering key)
5. Last diagnosis date per patient
6. Last prescription end per patient (treat OPEN as latest via sort key)
7. Last result value per (patient,test)
8. Last appointment status per patient
9. Last claim date per patient
10. Last payment method per claim

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
