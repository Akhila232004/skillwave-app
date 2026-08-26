![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Length Function (LEN)
1. Length of first and last names
2. Customers with email length > 12
3. Cities with name length between 5 and 8
4. Meter serial numbers and their lengths (expect 9 like 'SN0000001')
5. Facility names length
6. Rate plan names with length >= 10
7. Street field trimmed vs raw length
8. State abbreviations (show where length <= 5)
9. Payment method text length
10. Asset status length

## Substring Function (SUBSTRING)
1. First 3 characters of City
2. Last 3 characters of ZIP via SUBSTRING and LEN
3. Extract number part from 'Facility-12' (after hyphen)
4. Get 'Zone-X' from Location 'Zone-X'
5. First 5 chars of FirstName
6. Domain part of Email (after @)
7. Year from InvoiceDate as text
8. Take 'SN' prefix from SerialNumber
9. Middle of RatePlan name (chars 5–12)
10. Extract 'Asset' or first 5 of asset name

## Concatenation Operator (+)
1. Full name as single column
2. Mailing address line
3. Asset label with facility
4. Meter display
5. Rate plan display with price
6. Invoice label
7. Payment reference
8. City, state tuple
9. Production label
10. Customer + Email display

## Lower Function (LOWER)
1. Emails lowercased
2. City lowercased
3. Rate plan lowercase
4. Facility name lowercase
5. Payment method lowercase
6. Serial number lowercase
7. Status lowercase
8. State lowercase
9. Department lowercase
10. AssetType lowercase

## Upper Function (UPPER)
1. First + last name upper
2. Email domain upper
3. State upper
4. Facility name upper
5. Rate plan upper
6. Serial number upper
7. Department upper
8. AssetType upper
9. Country upper
10. Status upper

## Trim Function (TRIM)
1. Trim City
2. Trim State
3. Trim Street
4. Trim ZIP
5. Trim Country
6. Trim FirstName/LastName
7. Trim Facility Name
8. Trim RatePlan Name
9. Trim PaymentMethod
10. Trim Asset Status

## Ltrim Function (LTRIM)
1. LTRIM Street
2. LTRIM City
3. LTRIM State
4. LTRIM ZIP
5. LTRIM Country
6. LTRIM FirstName
7. LTRIM LastName
8. LTRIM Facility Name
9. LTRIM RatePlan Name
10. LTRIM PaymentMethod

## Rtrim Function (RTRIM)
1. RTRIM Street
2. RTRIM City
3. RTRIM State
4. RTRIM ZIP
5. RTRIM Country
6. RTRIM FirstName
7. RTRIM LastName
8. RTRIM Facility Name
9. RTRIM RatePlan Name
10. RTRIM PaymentMethod

## Charindex Function (CHARINDEX)
1. Position of '@' in Email
2. Position of '-' in Facility name
3. Position of 'Zone' in Location
4. Position of ' ' in FirstName (if any)
5. Position of 'Turbine' in AssetType
6. Position of '.' in Email domain
7. Position of 'SN' in SerialNumber
8. First hyphen in RatePlan Name
9. Position of '2025' in RatePlan Name
10. Position of 'Zone-3' in Location

## Left Function (LEFT)
1. First 2 of SerialNumber
2. First 4 of ZIP
3. First letter of State
4. First 3 of City
5. First 5 of RatePlan Name
6. First 7 of Facility Name
7. First 4 of FirstName
8. First 10 of Email
9. First 2 of Status
10. First 3 of PaymentMethod

## Right Function (RIGHT)
1. Last 4 of Phone
2. Last 3 of ZIP
3. Last 2 of SerialNumber
4. Last 5 of RatePlan Name
5. Last 3 of City
6. Last 4 of InvoiceID as text
7. Last 2 of State
8. Last char of Status
9. Last 6 of Email
10. Last 3 of Facility Name

## Reverse Function (REVERSE)
1. Reverse email
2. Reverse SerialNumber
3. Reverse City
4. Reverse State
5. Reverse RatePlan Name
6. Reverse Facility Name
7. Reverse Status
8. Reverse Country
9. Reverse PaymentMethod
10. Reverse FirstName + LastName

## Replace Function (REPLACE)
1. Replace 'Facility-' with 'Fac-'
2. Replace 'Zone-' with 'Z'
3. Replace '@example.com' with '@mail.local'
4. Replace spaces with underscores in rate plan names
5. Remove 'SN' from serial
6. Replace 'Active' with 'A'
7. Replace '-' with '' in ZIP
8. Replace '(' and ')' in Phone
9. Replace '2025' with 'Y25' in plan names
10. Replace NULL PaymentMethod to 'Unknown' (via COALESCE+REPLACE demo)

## Case Statement (CASE)
1. Email domain label
2. Asset health label from Status
3. Payment size bucket
4. City group by first letter
5. Plan price tier
6. Overdue invoice flag
7. Meter type classification
8. Facility zone number from Location
9. Consumption band using July readings (per row)
10. Customer initial category (A–F, G–M, N–Z)

## ISNULL Function (ISNULL)
1. Email fallback
2. Phone fallback
3. MeterType fallback
4. PaymentMethod fallback
5. Asset CommissionDate fallback to '2000-01-01'
6. RatePlan Description fallback
7. Address State fallback
8. Facility Location fallback
9. AssetMaintenance Description fallback
10. Customer AddressID to 0 if NULL

## Coalesce Function (COALESCE)
1. Pick first non-null contact: Email then Phone
2. Pick first non-null location: Facility.Location or 'Unknown'
3. Pick PaymentMethod or 'ACH' default
4. Customer full name handling NULLs
5. Asset status fallback chain
6. MeterType fallback chain to 'Basic'
7. RatePlan description or name
8. Address state/city fallback to 'NA'
9. Invoice status or 'Open'
10. AssetMaintenance performer or 'Vendor'

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
