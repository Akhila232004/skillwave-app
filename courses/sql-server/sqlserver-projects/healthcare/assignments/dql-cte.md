![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## CTE
1. July appointments with simple CTE, then count by status
2. Active policies today
3. Claim + total paid + balance by claim
4. Patient ages (approx) with CTE
5. Latest lab result per LabOrder (ROW_NUMBER in CTE)
6. Provider July appointment counts
7. Active prescriptions today with medication info
8. Lab turnaround (minutes) – top 20 slowest
9. Appointments by weekday in July
10. Top 10 cities by patient count
11. First appointment date per patient (MIN in CTE)
12. Daily claim totals in July

## Using Multiple CTEs
1. July -> Completed -> counts per provider
2. Patients with ≥ 3 July appointments
3. Claim/payments/balance + bucket
4. Active policy patients → July claims for those patients
5. Lab TAT per provider → rank by avg minutes
6. Appointment gaps > 30 days per patient
7. Overlapping prescriptions per patient (same time window)
8. Provider July metrics: completed appts + distinct patients
9. Day-of-month appointment histogram for July
10. Policy durations → categorize
11. Combined patient KPIs: appts, claims, prescriptions
12. Top 5 providers by July completed rate (completed / total)

## Recursive CTEs
1. Calendar days in July 2025 + appointment counts
2. Hours 0..23 today + appointments per hour
3. Month series for 2025 + claim totals
4. Weekly windows from @RefStart stepping 7 days (till @RefEnd)
5. Cumulative payments per claim (ordered) using recursive row chain
6. Next 12 months from today
7. Expand policy coverage by months (cap at @Today if open)
8. Expand prescription days within July (patient-days on therapy)
9. Last 10 calendar days from @Today backwards + lab order counts
10. Next 15 business days (skip Sat/Sun)
11. Quarter series for 2025 + claim totals by quarter
12. Generate 1..N (N=25) and use to return top-N claims by amount

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
