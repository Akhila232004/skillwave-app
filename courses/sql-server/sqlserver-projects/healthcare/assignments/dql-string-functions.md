![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments
* Replace literal values as needed on your instance.
```sql
DECLARE @RefStart date = '2025-07-01';
DECLARE @RefEnd   date = '2025-07-31';
DECLARE @Today    date = CAST(GETDATE() AS date);
```

## Length Function (LEN)
1. Length of patient first and last names
2. Providers with NPI length other than 10
3. Long medication names (>= 12 chars)
4. Email lengths for patients
5. Address street name lengths
6. Department name lengths
7. Claim status text length
8. Appointment location length check
9. ICD-10 code length distribution
10. RX instruction length top 20

## Substring Function (SUBSTRING)
1. Extract email domain from patient emails
2. Extract area block from provider phone "+1-555-XXXX"
3. First 3 chars of city
4. Last 4 chars of PolicyNumber (via SUBSTRING + LEN)
5. CPT segments: first two and rest
6. NPI prefix(3) and suffix(3)
7. Appointment date string parts "YYYY-MM" from datetime
8. Medication strength number (before space)
9. Extract city code digits from 'City123'
10. Test code prefix 'T' and numeric suffix

## Concatenation Operator (+)
1. Full patient name
2. Provider display "Name (Specialty)"
3. Address single-line
4. Appointment label
5. Medication display
6. Policy composite key display
7. Lab result display
8. Diagnosis coded description
9. Procedure coded description
10. Claim labeled amount

## Lower Function (LOWER)
1. Lowercase patient emails
2. Lowercase provider specialties
3. Lowercase insurer names
4. Lowercase cities
5. Lowercase medication names
6. Lowercase appointment status
7. Lowercase lab test names
8. Lowercase department names
9. Lowercase claim status
10. Lowercase prescription frequency

## Upper Function (UPPER)
1. Uppercase patient names
2. Uppercase provider specialty
3. Uppercase city/state
4. Uppercase department name
5. Uppercase medication form
6. Uppercase claim status
7. Uppercase appointment status
8. Uppercase test name
9. Uppercase insurer name
10. Uppercase prescription instructions

## Trim Function (TRIM)
1. Trim patient names
2. Trim provider phones
3. Trim room labels
4. Trim medication strings
5. Trim department names
6. Trim patient emails
7. Trim insurer names
8. Trim policy numbers
9. Trim claim status
10. Trim prescription frequency

## Ltrim Function (LTRIM)
1. Left-trim patient first names
2. Left-trim provider emails
3. Left-trim room labels
4. Left-trim medication name
5. Left-trim department name
6. Left-trim insurer name
7. Left-trim policy number
8. Left-trim claim status
9. Left-trim test name
10. Left-trim prescription instructions

## Rtrim Function (RTRIM)
1. Right-trim patient last names
2. Right-trim provider phones
3. Right-trim room labels
4. Right-trim medication strength
5. Right-trim department name
6. Right-trim insurer name
7. Right-trim claim status
8. Right-trim test name
9. Right-trim policy number
10. Right-trim prescription frequency

## Charindex Function (CHARINDEX)
1. Position of '@' in patient emails
2. Find hyphen position in provider phone
3. Check if 'Room-' appears in location
4. Find space in medication strength
5. Find 'Dept-' pattern in department name
6. Find '.' in ICD-10 code
7. Find '-' in policy number/group
8. Find '%' sign in HbA1c units (some units like '%')
9. Find 'Panel' substring in test name
10. Find 'Paid' inside claim status

## Left Function (LEFT)
1. First 5 chars of patient first name
2. City prefixes (first 4)
3. NPI first 4
4. PolicyNumber first 3
5. ICD-10 head (before dot or first 3)
6. CPT first 2
7. TestName first 3
8. Department code 'Dep'?
9. Room prefix
10. Medication name prefix

## Right Function (RIGHT)
1. Last 4 of provider phone
2. City numeric suffix (for 'City123')
3. Last 2 of state (works for codes like 'StateX')
4. Last 3 of NPI
5. Last 2 of ICD-10 (after dot or last 2)
6. Last 3 of CPT
7. Last 2 characters of insurer name
8. Last 5 chars of medication name
9. Last 3 chars of room
10. Last 4 chars of PolicyNumber

## Reverse Function (REVERSE)
1. Reverse NPI numbers
2. Reverse policy numbers
3. Reverse ICD-10 codes
4. Reverse CPT codes
5. Reverse medication names
6. Reverse city strings
7. Reverse patient email
8. Reverse appointment location
9. Reverse test codes
10. Reverse claim status

## Replace Function (REPLACE)
1. Remove hyphens from provider phone
2. Replace 'Dept-' with '' in department name
3. Replace spaces in medication name with underscores
4. Normalize room: remove 'Room-'
5. Replace '.' in ICD-10 with ''
6. Replace '-' in PolicyNumber with ''
7. Replace '%' in units with ' percent'
8. Replace 'PRN' in frequency with 'As Needed'
9. Replace '+' in phone with '00'
10. Replace '@example.com' with '@masked.local'

## Case Statement (CASE)
1. Gender label
2. Appointment status bucket
3. Claim payment state
4. Email domain classification
5. City tier by name suffix number
6. Medication form bucket
7. Policy active flag (text)
8. HbA1c control category
9. Provider seniority by NPI suffix
10. Appointment time-of-day bucket

## ISNULL Function (ISNULL)
1. Default missing patient phone to 'N/A'
2. Default provider email
3. Default appointment location
4. Default prescription end date text
5. Default claim status
6. Default policy group number
7. Default test units
8. Default medication strength
9. Default diagnosis description
10. Default instructions

## Coalesce Function (COALESCE)
1. Preferred contact: patient Email then Phone
2. Provider contact: Email, then Phone, else 'NA'
3. Location fallback: Appointment.Location → Department.Location → 'Unknown'
4. Policy identifier fallback: GroupNumber → PolicyNumber
5. Claim status fallback to 'Pending'
6. Medication descriptor: Strength → Form → '(NA)'
7. Patient name with middle (if existed) demonstration via COALESCE('','')
8. Lab units fallback to reference range text
9. Prescription notes: Instructions → Frequency
10. Address region: State → City → Country

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
