![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Current Date and time (GETDATE)
1. Patients with appointments today (local server date)
2. Appointments in the next 7 days
3. Claims filed in the last 30 days
4. Payments received today (by PaymentDate)
5. Policies that start today
6. Medical records created within last 24 hours
7. Prescriptions starting within next 3 days
8. Lab orders placed in the last 2 hours
9. Appointments remaining today
10. Show server local and UTC clock

## Date Part Function (DATEPART)
1. Appointments by year and month
2. Claims by quarter of 2025
3. Peak appointment hour in July
4. Lab orders by minute bucket (last hour)
5. Patients by birth month
6. Prescriptions by week number in July
7. Medical records by day of month for July
8. Appointments by year only (distinct)
9. Claims by month name in 2025
10. Payments by hour (today)

## Date Difference Function (DATEDIFF)
1. Days between claim and payment (per payment)
2. Appointment lead time (days from now)
3. Patient age in years (approx)
4. Hours since last lab order per patient
5. Days coverage remaining for active policies
6. Minutes between order and result
7. Days from prescription start to end
8. Days since commission (use Department.Floor as dummy? N/A) – use Provider CreatedAt
9. Days between successive appointments for a patient (window)
10. Claims aging bucket (days since claim)

## Date Addition/Subtraction (DATEADD)
1. Appointments in the previous week
2. Claims due for follow-up 14 days after filing (today hits follow-up)
3. Prescriptions ending within next 10 days
4. Policies starting within next month
5. Lab orders older than 48 hours
6. Appointments scheduled exactly one month after @RefStart
7. Claims in the last quarter (past 90 days)
8. Extend policies by 15 days (projection)
9. Appointments between first and last day of current month
10. Payments in the next business week (5 days)

## Date Formatting (FORMAT)
1. Appointment as 'ddd, dd MMM yyyy HH:mm'
2. Claim month label 'yyyy-MM'
3. Payment date friendly 'MMMM dd, yyyy'
4. Policy period 'dd-MMM-yyyy'
5. Record timestamp with AM/PM
6. Lab result datetime ISO-like
7. Day name of appointment
8. Quarter label 'Q# yyyy'
9. Week-of-year 'yyyy-ww'
10. Time-only 'HH:mm:ss'

## Weekday Function (DATEPART weekday)
1. Appointments by weekday name in July
2. Claims by weekday number (1..7)
3. Lab orders placed on weekends
4. Payments received on Monday
5. Appointments scheduled on Friday afternoons (12:00–17:00)
6. Prescriptions started on Sundays
7. Medical notes authored on Wednesdays
8. Policies effective on Mondays
9. Procedures performed on Tuesdays
10. Appointments by weekday number for current month

## Date to String (CONVERT with style)
1. ClaimDate as 'YYYYMMDD' (112)
2. PaymentDate as 'MM/DD/YYYY' (101)
3. EffectiveDate as 'DD-Mon-YYYY' via FORMAT
4. ProcedureDate as 'YYYY.MM.DD' (102 uses YYYY.MM.DD)
5. DiagnosedDate as 'DD/MM/YYYY' (103)
6. StartDate as 'Mon DD, YYYY' (FORMAT)
7. EndDate as 'YYYY-WeekWW' (FORMAT)
8. RecordDate (date part) ISO date
9. OrderDate (date) 'ddd dd MMM'
10. Policy expiration short 'yy/MM'

## DateTime to String (CONVERT with style)
1. Appointment ISO 8601 'yyyy-mm-ddThh:mi:ss' (126)
2. RecordDate ODBC canonical (120)
3. OrderDate RFC-like (113: dd mon yyyy hh:mi:ss:mmm)
4. ResultDate ANSI (121)
5. ApptDateTime US default (100)
6. Record time only (hh:mm:ss)
7. ApptDateTime with AM/PM (109)
8. OrderDate 'dd/mm/yyyy hh:mi:ss' (103/108 mix)
9. ResultDate 'yyyyMMdd HHmmss'
10. Appointment month label 'MMM yyyy'

## String to Date (CONVERT/CAST)
1. Claims on '2025-07-15' (ISO, style 23)
2. Claims on '07/20/2025' (US, 101)
3. Diagnoses on '15/07/2025' (British/French, 103)
4. Procedures on '2025.07.10' (102)
5. Policies effective '20250701' (112)
6. Prescriptions starting 'July 05, 2025' (style 0)
7. Payments on '20-Jul-2025'
8. Appointments on '2025/07/25'
9. Lab orders on '25.07.2025'
10. Claims on '25-07-2025'

## String to DateTime (CONVERT/TRY_PARSE)
1. Appointments at '2025-07-15 13:30:00' (120)
2. Records at '2025-07-01T09:00:00' (126)
3. Lab orders at '07/10/2025 03:15:00 PM' (109)
4. Results at '10.07.2025 18:45:00' (104 + time append)
5. Appointments at '15-07-2025 08:00' (105)
6. Records at 'July 22, 2025 07:30'
7. Orders at '20250720 140000' (ISO basic)
8. Payments at '2025/07/21 10:00:00' (111 w/ time)
9. Appointments at '2025.07.25 16:00:00' (102 w/ time)
10. Results at '25-07-2025 23:59:59' (105)

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show UTC vs India Standard Time for server clock
2. Convert appointment times (assumed local) to UTC and IST (projection)
3. Convert UTC audit CreatedAt to IST for Providers
4. Payments “today” in IST (cast by IST date)
5. Lab orders in last 6 hours by IST clock
6. Group appointments by IST calendar date
7. Claims filed in July by IST (treat ClaimDate as UTC midnight)
8. Earliest medical record today in IST
9. Next 12 hours appointments by IST clock
10. Show IST local time fields split

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
