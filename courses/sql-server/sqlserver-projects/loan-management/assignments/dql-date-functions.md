![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions Assignments

## Current Date and time (GETDATE)
1. Display current date and time.
2. Display current date only.
3. Find loans started today.
4. Find payments made up to current datetime.
5. List borrowers whose birthday is today.
6. Calculate seconds since a loan started.
7. Show loans created within the last 7 days.
8. Insert a test payment record using current datetime.
9. Delete the test payment record inserted today.
10. Update a loan’s start_date to current date for loan_id = 1.

## Date Part Function (DATEPART)
1. Extract year from loan start_date.
2. Extract month from payment_date.
3. Extract day from borrower date_of_birth.
4. Extract hour from current datetime.
5. Extract minute from current datetime.
6. Extract second from current datetime.
7. Extract quarter from loan start_date.
8. Extract week of year from payment_date.
9. Extract ISO year from payment_date.
10. Extract microsecond from SYSDATETIME().

## Date Difference Function (DATEDIFF)
1. Calculate days between loan start_date and today.
2. Calculate months between start_date and payment_date.
3. Calculate years between date_of_birth and today.
4. Calculate hours between two specific payments (IDs 1 and 2).
5. Calculate seconds between GETDATE() and loan start_date.
6. Calculate days between the two most recent payments.
7. Calculate weeks since loan start.
8. Calculate milliseconds between GETDATE() and SYSDATETIME().
9. Calculate full day difference ignoring time portion.
10. Approximate business days (exclude weekends).

## Date Addition/Subtraction (DATEADD)
1. Add 30 days to loan start_date.
2. Subtract 15 days from payment_date.
3. Add 6 months to loan start_date.
4. Subtract 1 year from date_of_birth.
5. Add 2 hours to current datetime.
6. Subtract 30 minutes from current datetime.
7. Add 100 milliseconds to SYSDATETIME().
8. Add 10 days to the latest payment_date.
9. Subtract the loan term from start_date for loan_id=2.
10. Add 90 days to today.

## Date Formatting (FORMAT)
1. Format payment_date as 'yyyy-MM-dd'.
2. Format date_of_birth as 'MMMM dd, yyyy'.
3. Format start_date as 'dd/MM/yyyy'.
4. Format GETDATE() as 'hh:mm:ss tt'.
5. Format GETDATE() as full datetime 'yyyy-MM-dd HH:mm:ss'.
6. Format payment_date as weekday name.
7. Format date_of_birth as 'yy-MM-dd'.
8. Format start_date as 'MMM dd'.
9. Format GETDATE() with general date/time specifier.
10. Format payment_date with ordinal day (e.g., 'dd''th'' MMM yyyy').

## Weekday Function (DATEPART weekday)
1. Get numeric weekday of payment_date.
2. Get weekday name using DATENAME.
3. Find loans that started on Monday (weekday=2).
4. Count payments by weekday.
5. List borrowers with birthday on weekend (1=Sunday,7=Saturday).
6. Show today’s weekday name.
7. Next payment weekday for loan_id=9.
8. Loans starting on Friday.
9. Payments mid-week (Tue-Thu).
10. Borrowers born on Tuesday.

## Date to String (CONVERT with style)
1. Convert start_date to varchar (style 101 mm/dd/yyyy).
2. Convert payment_date to varchar (style 103 dd/mm/yyyy).
3. Convert date_of_birth to style 112 (yyyyMMdd).
4. Convert GETDATE() to style 120 (yyyy-mm-dd hh:mi:ss).
5. Convert GETDATE() to style 1 (mm/dd/yy).
6. Convert start_date to style 3 (dd/mm/yy).
7. Convert payment_date to style 126 (ISO8601).
8. Convert date_of_birth to style 13 (dd mon yyyy hh:mi:ss:mmm).
9. Convert GETDATE() to style 9 (Mon dd yyyy hh:mi:ss).
10. Convert payment_date to style 20 (yyyy-mm-dd hh:mi:ss).

## DateTime to String (CONVERT with style)
1. Convert SYSDATETIME() to ISO 8601 with ms.
2. Convert loan start_date to 'yyyy/MM/dd HH:mm'.
3. Convert payment_date to RFC1123 pattern.
4. Convert GETDATE() to 'yyyyMMdd HHmmss'.
5. Convert payment_date to 'MM-dd-yyyy hh:mm tt'.
6. Convert date_of_birth to 'dddd, MMMM dd, yyyy'.
7. Convert SYSDATETIMEOFFSET() to string with offset.
8. Convert GETDATE() to 'MMM dd yyyy, HH:mm:ss'.
9. Convert start_date to 'dd.MM.yyyy'.
10. Convert payment_date to Chinese pattern.

## String to Date (CONVERT/CAST)
1. Convert '2025-08-05' to date.
2. Convert '08/05/2025' to date (style 101).
3. Convert '05-08-2025' to date (style 105).
4. Convert '20250805' to date (style 112).
5. Convert 'Aug 05 2025' to date (style 106).
6. Parse ISO string to date.
7. Convert stored date_of_birth string back to date.
8. Parse '2025.08.05' to date.
9. Convert '05 Aug 2025' to date (style 113).
10. Convert '2025/08/05' to date (style 111).

## String to DateTime (CONVERT/TRY_PARSE)
1. Convert '2025-08-05 14:30:00' to datetime.
2. Convert '08/05/2025 02:30 PM' to datetime (style 101).
3. Convert '2025-08-05T14:30:00' to datetime2.
4. Parse 'Aug 05 2025 14:30:00' to datetime.
5. Convert '20250805 143000' to datetime (style 112).
6. Convert '2025/08/05 14:30:00' to datetime (style 111).
7. Convert date_of_birth + ' 00:00:00' to datetime.
8. Convert '2025-08-05 14:30:00.123' to datetime2.
9. Parse '05 Aug 2025 14:30:00' to datetime2.
10. Convert '2025-08-05T14:30:00Z' to datetimeoffset.

## DateTime and TimeZone (AT TIME ZONE / SWITCHOFFSET)
1. Show current datetime with offset.
2. Convert GETDATE() to UTC.
3. Convert GETDATE() to India Standard Time.
4. Convert loan start_date from UTC to IST.
5. Convert payment_date from UTC to Eastern Standard Time.
6. Use SWITCHOFFSET to change server offset to +05:30.
7. Find current UTC datetimeoffset.
8. Convert date_of_birth to datetimeoffset at UTC.
9. Convert payment_date to Pacific Standard Time.
10. Query the server’s current time zone.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
