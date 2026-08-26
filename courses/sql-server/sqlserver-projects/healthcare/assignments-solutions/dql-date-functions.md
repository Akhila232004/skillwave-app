![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments Solutions
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Current Date and time (GETDATE)
```sql
-- 1. Patients with appointments today (local server date)
SELECT DISTINCT p.PatientID, p.FirstName, p.LastName
FROM healthcare.Appointment ap
JOIN healthcare.Patient p ON p.PatientID = ap.PatientID
WHERE CAST(ap.ApptDateTime AS date) = CAST(GETDATE() AS date);

-- 2. Appointments in the next 7 days
SELECT ap.*
FROM healthcare.Appointment ap
WHERE ap.ApptDateTime >= GETDATE()
  AND ap.ApptDateTime <  DATEADD(DAY, 7, GETDATE());

-- 3. Claims filed in the last 30 days
SELECT c.*
FROM healthcare.Claim c
WHERE c.ClaimDate >= DATEADD(DAY, -30, CAST(GETDATE() AS date));

-- 4. Payments received today (by PaymentDate)
SELECT p.*
FROM healthcare.Payment p
WHERE p.PaymentDate = CAST(GETDATE() AS date);

-- 5. Policies that start today
SELECT ip.*
FROM healthcare.InsurancePolicy ip
WHERE ip.EffectiveDate = CAST(GETDATE() AS date);

-- 6. Medical records created within last 24 hours
SELECT mr.*
FROM healthcare.MedicalRecord mr
WHERE mr.RecordDate >= DATEADD(HOUR, -24, SYSDATETIME());

-- 7. Prescriptions starting within next 3 days
SELECT pr.*
FROM healthcare.Prescription pr
WHERE pr.StartDate BETWEEN CAST(GETDATE() AS date) AND DATEADD(DAY, 3, CAST(GETDATE() AS date));

-- 8. Lab orders placed in the last 2 hours
SELECT lo.*
FROM healthcare.LabOrder lo
WHERE lo.OrderDate >= DATEADD(HOUR, -2, SYSDATETIME());

-- 9. Appointments remaining today
SELECT ap.*
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) = CAST(GETDATE() AS date)
  AND ap.ApptDateTime >= SYSDATETIME();

-- 10. Show server local and UTC clock
SELECT GETDATE()      AS LocalNow,
       GETUTCDATE()   AS UtcNow,
       SYSDATETIME()  AS LocalNowPrecise,
       SYSUTCDATETIME() AS UtcNowPrecise;
```

## Date Part Function (DATEPART)
```sql
-- 1. Appointments by year and month
SELECT DATEPART(YEAR, ApptDateTime)  AS ApptYear,
       DATEPART(MONTH, ApptDateTime) AS ApptMonth,
       COUNT(*) AS Cnt
FROM healthcare.Appointment
GROUP BY DATEPART(YEAR, ApptDateTime), DATEPART(MONTH, ApptDateTime)
ORDER BY ApptYear, ApptMonth;

-- 2. Claims by quarter of 2025
SELECT DATEPART(QUARTER, ClaimDate) AS Qtr, COUNT(*) AS ClaimCnt
FROM healthcare.Claim
WHERE DATEPART(YEAR, ClaimDate) = 2025
GROUP BY DATEPART(QUARTER, ClaimDate)
ORDER BY Qtr;

-- 3. Peak appointment hour in July
SELECT DATEPART(HOUR, ApptDateTime) AS HourOfDay, COUNT(*) AS Cnt
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY DATEPART(HOUR, ApptDateTime)
ORDER BY Cnt DESC;

-- 4. Lab orders by minute bucket (last hour)
SELECT DATEPART(MINUTE, OrderDate) AS MinBucket, COUNT(*) AS Orders
FROM healthcare.LabOrder
WHERE OrderDate >= DATEADD(HOUR, -1, SYSDATETIME())
GROUP BY DATEPART(MINUTE, OrderDate)
ORDER BY MinBucket;

-- 5. Patients by birth month
SELECT DATEPART(MONTH, DOB) AS BirthMonth, COUNT(*) AS PatientCnt
FROM healthcare.Patient
GROUP BY DATEPART(MONTH, DOB)
ORDER BY BirthMonth;

-- 6. Prescriptions by week number in July
SELECT DATEPART(WEEK, StartDate) AS WeekNo, COUNT(*) AS RxCnt
FROM healthcare.Prescription
WHERE StartDate BETWEEN @RefStart AND @RefEnd
GROUP BY DATEPART(WEEK, StartDate)
ORDER BY WeekNo;

-- 7. Medical records by day of month for July
SELECT DATEPART(DAY, RecordDate) AS DayOfMonth, COUNT(*) AS Notes
FROM healthcare.MedicalRecord
WHERE CAST(RecordDate AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY DATEPART(DAY, RecordDate)
ORDER BY DayOfMonth;

-- 8. Appointments by year only (distinct)
SELECT DISTINCT DATEPART(YEAR, ApptDateTime) AS ApptYear
FROM healthcare.Appointment
ORDER BY ApptYear;

-- 9. Claims by month name in 2025
SELECT DATENAME(MONTH, ClaimDate) AS MonthName, COUNT(*) AS Cnt
FROM healthcare.Claim
WHERE DATEPART(YEAR, ClaimDate) = 2025
GROUP BY DATENAME(MONTH, ClaimDate), DATEPART(MONTH, ClaimDate)
ORDER BY DATEPART(MONTH, MAX(ClaimDate));

-- 10. Payments by hour (today)
SELECT DATEPART(HOUR, CAST(PaymentDate AS datetime2)) AS HourOfDay, COUNT(*) AS Payments
FROM healthcare.Payment
WHERE PaymentDate = CAST(GETDATE() AS date)
GROUP BY DATEPART(HOUR, CAST(PaymentDate AS datetime2))
ORDER BY HourOfDay;
```

## Date Difference Function (DATEDIFF)
```sql
-- 1. Days between claim and payment (per payment)
SELECT p.PaymentID, p.ClaimID, c.ClaimDate, p.PaymentDate,
       DATEDIFF(DAY, c.ClaimDate, p.PaymentDate) AS DaysToPay
FROM healthcare.Payment p
JOIN healthcare.Claim c ON c.ClaimID = p.ClaimID;

-- 2. Appointment lead time (days from now)
SELECT ap.AppointmentID, ap.ApptDateTime,
       DATEDIFF(DAY, GETDATE(), ap.ApptDateTime) AS DaysFromNow
FROM healthcare.Appointment ap;

-- 3. Patient age in years (approx)
SELECT PatientID, FirstName, LastName, DOB,
       DATEDIFF(YEAR, DOB, @Today) AS AgeYears
FROM healthcare.Patient;

-- 4. Hours since last lab order per patient
WITH last_lo AS (
  SELECT lo.PatientID, MAX(lo.OrderDate) AS LastOrder
  FROM healthcare.LabOrder lo
  GROUP BY lo.PatientID
)
SELECT p.PatientID, DATEDIFF(HOUR, l.LastOrder, SYSDATETIME()) AS HoursSinceLastOrder
FROM healthcare.Patient p
JOIN last_lo l ON l.PatientID = p.PatientID;

-- 5. Days coverage remaining for active policies
SELECT ip.PolicyID, ip.PatientID, ip.EffectiveDate, ip.ExpirationDate,
       CASE WHEN ip.ExpirationDate IS NULL THEN NULL
            ELSE DATEDIFF(DAY, @Today, ip.ExpirationDate) END AS DaysRemaining
FROM healthcare.InsurancePolicy ip
WHERE ip.EffectiveDate <= @Today AND (ip.ExpirationDate IS NULL OR ip.ExpirationDate >= @Today);

-- 6. Minutes between order and result
SELECT lr.LabResultID, lo.OrderDate, lr.ResultDate,
       DATEDIFF(MINUTE, lo.OrderDate, lr.ResultDate) AS MinutesToResult
FROM healthcare.LabResult lr
JOIN healthcare.LabOrder lo ON lo.LabOrderID = lr.LabOrderID;

-- 7. Days from prescription start to end
SELECT pr.PrescriptionID, pr.StartDate, pr.EndDate,
       DATEDIFF(DAY, pr.StartDate, COALESCE(pr.EndDate, @Today)) AS DurationDays
FROM healthcare.Prescription pr;

-- 8. Days since commission (use Department.Floor as dummy? N/A) – use Provider CreatedAt
SELECT pr.ProviderID, pr.CreatedAt,
       DATEDIFF(DAY, pr.CreatedAt, SYSUTCDATETIME()) AS DaysSinceCreatedUTC
FROM healthcare.Provider pr;

-- 9. Days between successive appointments for a patient (window)
WITH x AS (
  SELECT ap.PatientID, ap.ApptDateTime,
         LAG(ap.ApptDateTime) OVER (PARTITION BY ap.PatientID ORDER BY ap.ApptDateTime) AS PrevAppt
  FROM healthcare.Appointment ap
)
SELECT PatientID, ApptDateTime, PrevAppt,
       CASE WHEN PrevAppt IS NULL THEN NULL ELSE DATEDIFF(DAY, PrevAppt, ApptDateTime) END AS DaysBetween
FROM x;

-- 10. Claims aging bucket (days since claim)
SELECT c.ClaimID, c.ClaimDate,
       DATEDIFF(DAY, c.ClaimDate, CAST(GETDATE() AS date)) AS AgeDays
FROM healthcare.Claim c;
```

## Date Addition/Subtraction (DATEADD)
```sql
-- 1. Appointments in the previous week
SELECT ap.*
FROM healthcare.Appointment ap
WHERE ap.ApptDateTime >= DATEADD(DAY, -7, GETDATE())
  AND ap.ApptDateTime <  GETDATE();

-- 2. Claims due for follow-up 14 days after filing (today hits follow-up)
SELECT c.*
FROM healthcare.Claim c
WHERE DATEADD(DAY, 14, c.ClaimDate) = CAST(GETDATE() AS date);

-- 3. Prescriptions ending within next 10 days
SELECT pr.*
FROM healthcare.Prescription pr
WHERE pr.EndDate IS NOT NULL
  AND pr.EndDate <= DATEADD(DAY, 10, @Today);

-- 4. Policies starting within next month
SELECT ip.*
FROM healthcare.InsurancePolicy ip
WHERE ip.EffectiveDate >= @Today
  AND ip.EffectiveDate <  DATEADD(MONTH, 1, @Today);

-- 5. Lab orders older than 48 hours
SELECT lo.*
FROM healthcare.LabOrder lo
WHERE lo.OrderDate < DATEADD(HOUR, -48, SYSDATETIME());

-- 6. Appointments scheduled exactly one month after @RefStart
SELECT ap.*
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) = DATEADD(MONTH, 1, @RefStart);

-- 7. Claims in the last quarter (past 90 days)
SELECT c.*
FROM healthcare.Claim c
WHERE c.ClaimDate >= DATEADD(DAY, -90, @Today);

-- 8. Extend policies by 15 days (projection)
SELECT ip.PolicyID, ip.EffectiveDate, ip.ExpirationDate,
       DATEADD(DAY, 15, ip.ExpirationDate) AS ExpirationPlus15
FROM healthcare.InsurancePolicy ip
WHERE ip.ExpirationDate IS NOT NULL;

-- 9. Appointments between first and last day of current month
SELECT ap.*
FROM healthcare.Appointment ap
WHERE CAST(ap.ApptDateTime AS date) BETWEEN
      DATEFROMPARTS(YEAR(@Today), MONTH(@Today), 1)
  AND EOMONTH(@Today);

-- 10. Payments in the next business week (5 days)
SELECT p.*
FROM healthcare.Payment p
WHERE p.PaymentDate > @Today
  AND p.PaymentDate <= DATEADD(DAY, 5, @Today);
```

## Date Formatting (FORMAT)
```sql
-- 1. Appointment as 'ddd, dd MMM yyyy HH:mm'
SELECT AppointmentID, FORMAT(ApptDateTime, 'ddd, dd MMM yyyy HH:mm') AS ApptPretty
FROM healthcare.Appointment;

-- 2. Claim month label 'yyyy-MM'
SELECT ClaimID, FORMAT(ClaimDate, 'yyyy-MM') AS ClaimMonth
FROM healthcare.Claim;

-- 3. Payment date friendly 'MMMM dd, yyyy'
SELECT PaymentID, FORMAT(PaymentDate, 'MMMM dd, yyyy') AS PaymentNice
FROM healthcare.Payment;

-- 4. Policy period 'dd-MMM-yyyy'
SELECT PolicyID,
       FORMAT(EffectiveDate, 'dd-MMM-yyyy') AS StartFmt,
       FORMAT(ExpirationDate, 'dd-MMM-yyyy') AS EndFmt
FROM healthcare.InsurancePolicy;

-- 5. Record timestamp with AM/PM
SELECT RecordID, FORMAT(RecordDate, 'yyyy-MM-dd hh:mm tt') AS Record12h
FROM healthcare.MedicalRecord;

-- 6. Lab result datetime ISO-like
SELECT LabResultID, FORMAT(ResultDate, 'yyyy-MM-ddTHH:mm:ss') AS ResultISO
FROM healthcare.LabResult;

-- 7. Day name of appointment
SELECT AppointmentID, FORMAT(ApptDateTime, 'dddd') AS DayName
FROM healthcare.Appointment;

-- 8. Quarter label 'Q# yyyy'
SELECT ClaimID, 'Q' + FORMAT(DATEPART(QUARTER, ClaimDate), '0') + ' ' + FORMAT(ClaimDate, 'yyyy') AS QtrLabel
FROM healthcare.Claim;

-- 9. Week-of-year 'yyyy-ww'
SELECT AppointmentID, FORMAT(ApptDateTime, 'yyyy-ww') AS YearWeek
FROM healthcare.Appointment;

-- 10. Time-only 'HH:mm:ss'
SELECT AppointmentID, FORMAT(ApptDateTime, 'HH:mm:ss') AS TimeOnly
FROM healthcare.Appointment;
```

## Weekday Function (DATEPART weekday)
```sql
-- 1. Appointments by weekday name in July
SELECT DATENAME(WEEKDAY, ApptDateTime) AS WeekdayName, COUNT(*) AS Cnt
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN @RefStart AND @RefEnd
GROUP BY DATENAME(WEEKDAY, ApptDateTime), DATEPART(WEEKDAY, ApptDateTime)
ORDER BY DATEPART(WEEKDAY, MAX(ApptDateTime));

-- 2. Claims by weekday number (1..7)
SELECT DATEPART(WEEKDAY, ClaimDate) AS WeekdayNo, COUNT(*) AS Claims
FROM healthcare.Claim
GROUP BY DATEPART(WEEKDAY, ClaimDate)
ORDER BY WeekdayNo;

-- 3. Lab orders placed on weekends
SELECT lo.*
FROM healthcare.LabOrder lo
WHERE DATENAME(WEEKDAY, lo.OrderDate) IN ('Saturday','Sunday');

-- 4. Payments received on Monday
SELECT p.*
FROM healthcare.Payment p
WHERE DATENAME(WEEKDAY, CAST(p.PaymentDate AS datetime2)) = 'Monday';

-- 5. Appointments scheduled on Friday afternoons (12:00–17:00)
SELECT ap.*
FROM healthcare.Appointment ap
WHERE DATENAME(WEEKDAY, ap.ApptDateTime) = 'Friday'
  AND CONVERT(time, ap.ApptDateTime) BETWEEN '12:00' AND '17:00';

-- 6. Prescriptions started on Sundays
SELECT pr.*
FROM healthcare.Prescription pr
WHERE DATENAME(WEEKDAY, pr.StartDate) = 'Sunday';

-- 7. Medical notes authored on Wednesdays
SELECT mr.*
FROM healthcare.MedicalRecord mr
WHERE DATENAME(WEEKDAY, mr.RecordDate) = 'Wednesday';

-- 8. Policies effective on Mondays
SELECT ip.*
FROM healthcare.InsurancePolicy ip
WHERE DATENAME(WEEKDAY, ip.EffectiveDate) = 'Monday';

-- 9. Procedures performed on Tuesdays
SELECT prc.*
FROM healthcare.ProcedureRecord prc
WHERE DATENAME(WEEKDAY, prc.ProcedureDate) = 'Tuesday';

-- 10. Appointments by weekday number for current month
SELECT DATEPART(WEEKDAY, ApptDateTime) AS WeekdayNo, COUNT(*) AS Cnt
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) BETWEEN DATEFROMPARTS(YEAR(@Today), MONTH(@Today), 1) AND EOMONTH(@Today)
GROUP BY DATEPART(WEEKDAY, ApptDateTime)
ORDER BY WeekdayNo;
```

## Date to String (CONVERT with style)
```sql
-- 1. ClaimDate as 'YYYYMMDD' (112)
SELECT ClaimID, CONVERT(varchar(8), ClaimDate, 112) AS ClaimDate_YYYYMMDD
FROM healthcare.Claim;

-- 2. PaymentDate as 'MM/DD/YYYY' (101)
SELECT PaymentID, CONVERT(varchar(10), PaymentDate, 101) AS PaymentDate_US
FROM healthcare.Payment;

-- 3. EffectiveDate as 'DD-Mon-YYYY' via FORMAT
SELECT PolicyID, FORMAT(EffectiveDate, 'dd-MMM-yyyy') AS EffFmt
FROM healthcare.InsurancePolicy;

-- 4. ProcedureDate as 'YYYY.MM.DD' (102 uses YYYY.MM.DD)
SELECT ProcedureID, CONVERT(varchar(10), ProcedureDate, 102) AS Proc_YYYYMMDD_Dots
FROM healthcare.ProcedureRecord;

-- 5. DiagnosedDate as 'DD/MM/YYYY' (103)
SELECT DiagnosisID, CONVERT(varchar(10), DiagnosedDate, 103) AS Dx_EU
FROM healthcare.Diagnosis;

-- 6. StartDate as 'Mon DD, YYYY' (FORMAT)
SELECT PrescriptionID, FORMAT(StartDate, 'MMM dd, yyyy') AS Start_Pretty
FROM healthcare.Prescription;

-- 7. EndDate as 'YYYY-WeekWW' (FORMAT)
SELECT PrescriptionID, FORMAT(EndDate, 'yyyy-\\W\\W') + RIGHT('0' + CAST(DATEPART(WEEK, EndDate) AS varchar(2)), 2) AS End_YearWeek
FROM healthcare.Prescription
WHERE EndDate IS NOT NULL;

-- 8. RecordDate (date part) ISO date
SELECT RecordID, CONVERT(varchar(10), CAST(RecordDate AS date), 23) AS RecordISODate
FROM healthcare.MedicalRecord;

-- 9. OrderDate (date) 'ddd dd MMM'
SELECT LabOrderID, FORMAT(CAST(OrderDate AS date), 'ddd dd MMM') AS OrderShort
FROM healthcare.LabOrder;

-- 10. Policy expiration short 'yy/MM'
SELECT PolicyID, FORMAT(ExpirationDate, 'yy/MM') AS ExpYYMM
FROM healthcare.InsurancePolicy;
```

## DateTime to String (CONVERT with style)
```sql
-- 1. Appointment ISO 8601 'yyyy-mm-ddThh:mi:ss' (126)
SELECT AppointmentID, CONVERT(varchar(19), ApptDateTime, 126) AS Appt_ISO
FROM healthcare.Appointment;

-- 2. RecordDate ODBC canonical (120)
SELECT RecordID, CONVERT(varchar(19), RecordDate, 120) AS Record_ODBC
FROM healthcare.MedicalRecord;

-- 3. OrderDate RFC-like (113: dd mon yyyy hh:mi:ss:mmm)
SELECT LabOrderID, CONVERT(varchar(26), OrderDate, 113) AS Order_RFCish
FROM healthcare.LabOrder;

-- 4. ResultDate ANSI (121)
SELECT LabResultID, CONVERT(varchar(23), ResultDate, 121) AS Result_ANSI
FROM healthcare.LabResult;

-- 5. ApptDateTime US default (100)
SELECT AppointmentID, CONVERT(varchar(24), ApptDateTime, 100) AS Appt_USA
FROM healthcare.Appointment;

-- 6. Record time only (hh:mm:ss)
SELECT RecordID, CONVERT(varchar(8), RecordDate, 108) AS Record_Time
FROM healthcare.MedicalRecord;

-- 7. ApptDateTime with AM/PM (109)
SELECT AppointmentID, CONVERT(varchar(26), ApptDateTime, 109) AS Appt_AMPM
FROM healthcare.Appointment;

-- 8. OrderDate 'dd/mm/yyyy hh:mi:ss' (103/108 mix)
SELECT LabOrderID, CONVERT(varchar(10), OrderDate, 103) + ' ' + CONVERT(varchar(8), OrderDate, 108) AS Order_EU_Time
FROM healthcare.LabOrder;

-- 9. ResultDate 'yyyyMMdd HHmmss'
SELECT LabResultID, FORMAT(ResultDate, 'yyyyMMdd HHmmss') AS Result_Compact
FROM healthcare.LabResult;

-- 10. Appointment month label 'MMM yyyy'
SELECT AppointmentID, FORMAT(ApptDateTime, 'MMM yyyy') AS Appt_Month
FROM healthcare.Appointment;
```

## String to Date (CONVERT/CAST)
```sql
-- 1. Claims on '2025-07-15' (ISO, style 23)
SELECT *
FROM healthcare.Claim
WHERE ClaimDate = CONVERT(date, '2025-07-15', 23);

-- 2. Claims on '07/20/2025' (US, 101)
SELECT *
FROM healthcare.Claim
WHERE ClaimDate = CONVERT(date, '07/20/2025', 101);

-- 3. Diagnoses on '15/07/2025' (British/French, 103)
SELECT *
FROM healthcare.Diagnosis
WHERE DiagnosedDate = CONVERT(date, '15/07/2025', 103);

-- 4. Procedures on '2025.07.10' (102)
SELECT *
FROM healthcare.ProcedureRecord
WHERE ProcedureDate = CONVERT(date, '2025.07.10', 102);

-- 5. Policies effective '20250701' (112)
SELECT *
FROM healthcare.InsurancePolicy
WHERE EffectiveDate = CONVERT(date, '20250701', 112);

-- 6. Prescriptions starting 'July 05, 2025' (style 0)
SELECT *
FROM healthcare.Prescription
WHERE StartDate = TRY_CONVERT(date, 'July 05, 2025', 0);

-- 7. Payments on '20-Jul-2025'
SELECT *
FROM healthcare.Payment
WHERE PaymentDate = TRY_CONVERT(date, '20-Jul-2025', 0);

-- 8. Appointments on '2025/07/25'
SELECT *
FROM healthcare.Appointment
WHERE CAST(ApptDateTime AS date) = TRY_CONVERT(date, '2025/07/25', 111); -- 111: yyyy/mm/dd

-- 9. Lab orders on '25.07.2025'
SELECT *
FROM healthcare.LabOrder
WHERE CAST(OrderDate AS date) = TRY_CONVERT(date, '25.07.2025', 104); -- German dd.mm.yyyy

-- 10. Claims on '25-07-2025'
SELECT *
FROM healthcare.Claim
WHERE ClaimDate = TRY_CONVERT(date, '25-07-2025', 105); -- Italian dd-mm-yyyy
```

## String to DateTime (CONVERT/TRY_PARSE)
```sql
-- 1. Appointments at '2025-07-15 13:30:00' (120)
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime = CONVERT(datetime2, '2025-07-15 13:30:00', 120);

-- 2. Records at '2025-07-01T09:00:00' (126)
SELECT *
FROM healthcare.MedicalRecord
WHERE RecordDate = CONVERT(datetime2, '2025-07-01T09:00:00', 126);

-- 3. Lab orders at '07/10/2025 03:15:00 PM' (109)
SELECT *
FROM healthcare.LabOrder
WHERE OrderDate = TRY_CONVERT(datetime2, '07/10/2025 03:15:00 PM', 109);

-- 4. Results at '10.07.2025 18:45:00' (104 + time append)
SELECT *
FROM healthcare.LabResult
WHERE ResultDate = TRY_CONVERT(datetime2, '10.07.2025 18:45:00', 104);

-- 5. Appointments at '15-07-2025 08:00' (105)
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime = TRY_CONVERT(datetime2, '15-07-2025 08:00', 105);

-- 6. Records at 'July 22, 2025 07:30'
SELECT *
FROM healthcare.MedicalRecord
WHERE RecordDate = TRY_CONVERT(datetime2, 'July 22, 2025 07:30', 0);

-- 7. Orders at '20250720 140000' (ISO basic)
SELECT *
FROM healthcare.LabOrder
WHERE OrderDate = TRY_CONVERT(datetime2, '20250720 140000', 0);

-- 8. Payments at '2025/07/21 10:00:00' (111 w/ time)
SELECT *
FROM healthcare.Payment
WHERE CAST(PaymentDate AS datetime2) = TRY_CONVERT(datetime2, '2025/07/21 10:00:00', 111);

-- 9. Appointments at '2025.07.25 16:00:00' (102 w/ time)
SELECT *
FROM healthcare.Appointment
WHERE ApptDateTime = TRY_CONVERT(datetime2, '2025.07.25 16:00:00', 102);

-- 10. Results at '25-07-2025 23:59:59' (105)
SELECT *
FROM healthcare.LabResult
WHERE ResultDate = TRY_CONVERT(datetime2, '25-07-2025 23:59:59', 105);
```

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
```sql
-- 1. Show UTC vs India Standard Time for server clock
SELECT SYSUTCDATETIME()                                      AS UtcNow,
       SYSUTCDATETIME() AT TIME ZONE 'UTC'                   AS UtcOffset,
       (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS IST_Offset;

-- 2. Convert appointment times (assumed local) to UTC and IST (projection)
SELECT AppointmentID,
       ApptDateTime                                            AS LocalAssumed,
       ApptDateTime AT TIME ZONE 'India Standard Time'         AS IST_Offset,
       (ApptDateTime AT TIME ZONE 'India Standard Time') AT TIME ZONE 'UTC' AS AsUTC
FROM healthcare.Appointment;

-- 3. Convert UTC audit CreatedAt to IST for Providers
SELECT ProviderID,
       CreatedAt                          AS CreatedUTC,
       (CreatedAt AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS CreatedIST
FROM healthcare.Provider;

-- 4. Payments “today” in IST (cast by IST date)
SELECT p.*
FROM healthcare.Payment p
WHERE CAST( (CAST(p.PaymentDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS date)
      = CAST( (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS date);

-- 5. Lab orders in last 6 hours by IST clock
SELECT lo.*
FROM healthcare.LabOrder lo
WHERE ( (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' )
    - ( (CAST(lo.OrderDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' )
      <= 6.0/24.0;  -- 6 hours

-- 6. Group appointments by IST calendar date
SELECT CAST( (ApptDateTime AT TIME ZONE 'India Standard Time') AS date) AS IST_Date, COUNT(*) AS ApptCnt
FROM healthcare.Appointment
GROUP BY CAST( (ApptDateTime AT TIME ZONE 'India Standard Time') AS date)
ORDER BY IST_Date;

-- 7. Claims filed in July by IST (treat ClaimDate as UTC midnight)
SELECT COUNT(*) AS ClaimsISTJuly
FROM healthcare.Claim
WHERE CAST( (CAST(ClaimDate AS datetime2) AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS date)
      BETWEEN '2025-07-01' AND '2025-07-31';

-- 8. Earliest medical record today in IST
SELECT TOP (1) mr.*
FROM healthcare.MedicalRecord mr
WHERE CAST( (mr.RecordDate AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS date)
      = CAST( (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS date)
ORDER BY mr.RecordDate;

-- 9. Next 12 hours appointments by IST clock
SELECT ap.*
FROM healthcare.Appointment ap
WHERE (ap.ApptDateTime AT TIME ZONE 'India Standard Time')
      BETWEEN (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time'
          AND  DATEADD(HOUR, 12, (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time');

-- 10. Show IST local time fields split
SELECT (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time' AS NowIST,
       DATENAME(WEEKDAY, (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time') AS IST_DayName,
       DATEPART(HOUR, (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')     AS IST_Hour,
       DATEPART(MINUTE, (SYSUTCDATETIME() AT TIME ZONE 'UTC') AT TIME ZONE 'India Standard Time')   AS IST_Minute;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
