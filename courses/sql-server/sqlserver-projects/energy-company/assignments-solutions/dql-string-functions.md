![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions
* Replace literal values as needed on your instance.
* @RefDate anchors “relative” time filters to the July 2025 dataset provided.
```sql
DECLARE @RefDate date      = '2025-07-31';
DECLARE @RefMonthStart date= '2025-07-01';
DECLARE @RefMonthEnd   date= '2025-07-31';
```

## Length Function (LEN)
```sql
-- 1. Length of first and last names
SELECT CustomerID, FirstName, LastName, LEN(FirstName) AS LenFirst, LEN(LastName) AS LenLast
FROM energy_company.Customer;

-- 2. Customers with email length > 12
SELECT CustomerID, Email, LEN(Email) AS EmailLen
FROM energy_company.Customer
WHERE Email IS NOT NULL AND LEN(Email) > 12;

-- 3. Cities with name length between 5 and 8
SELECT AddressID, City, LEN(City) AS CityLen
FROM energy_company.Address
WHERE LEN(City) BETWEEN 5 AND 8;

-- 4. Meter serial numbers and their lengths (expect 9 like 'SN0000001')
SELECT MeterID, SerialNumber, LEN(SerialNumber) AS SerialLen
FROM energy_company.Meter;

-- 5. Facility names length
SELECT FacilityID, Name, LEN(Name) AS NameLen
FROM energy_company.Facility;

-- 6. Rate plan names with length >= 10
SELECT RatePlanID, Name, LEN(Name) AS NameLen
FROM energy_company.RatePlan
WHERE LEN(Name) >= 10;

-- 7. Street field trimmed vs raw length
SELECT AddressID, Street, LEN(Street) AS RawLen, LEN(LTRIM(RTRIM(Street))) AS TrimLen
FROM energy_company.Address;

-- 8. State abbreviations (show where length <= 5)
SELECT AddressID, State, LEN(State) AS StateLen
FROM energy_company.Address
WHERE LEN(State) <= 5;

-- 9. Payment method text length
SELECT PaymentID, PaymentMethod, LEN(COALESCE(PaymentMethod,'')) AS MethodLen
FROM energy_company.Payment;

-- 10. Asset status length
SELECT AssetID, Status, LEN(Status) AS StatusLen
FROM energy_company.Asset;
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 3 characters of City
SELECT AddressID, City, SUBSTRING(City,1,3) AS City3
FROM energy_company.Address;

-- 2. Last 3 characters of ZIP via SUBSTRING and LEN
SELECT AddressID, ZIP, SUBSTRING(ZIP, LEN(ZIP)-2, 3) AS ZipLast3
FROM energy_company.Address;

-- 3. Extract number part from 'Facility-12' (after hyphen)
SELECT FacilityID, Name,
       SUBSTRING(Name, CHARINDEX('-',Name)+1, 10) AS NameNumPart
FROM energy_company.Facility
WHERE CHARINDEX('-',Name) > 0;

-- 4. Get 'Zone-X' from Location 'Zone-X'
SELECT FacilityID, Location, SUBSTRING(Location, CHARINDEX('Zone',Location), 6) AS ZoneTag
FROM energy_company.Facility
WHERE Location LIKE '%Zone-%';

-- 5. First 5 chars of FirstName
SELECT CustomerID, FirstName, SUBSTRING(FirstName,1,5) AS FN5
FROM energy_company.Customer;

-- 6. Domain part of Email (after @)
SELECT CustomerID, Email,
       SUBSTRING(Email, CHARINDEX('@',Email)+1, 200) AS Domain
FROM energy_company.Customer
WHERE Email LIKE '%@%';

-- 7. Year from InvoiceDate as text
SELECT InvoiceID, InvoiceDate, SUBSTRING(CONVERT(varchar(10),InvoiceDate,120),1,4) AS Yr
FROM energy_company.Invoice;

-- 8. Take 'SN' prefix from SerialNumber
SELECT MeterID, SerialNumber, SUBSTRING(SerialNumber,1,2) AS Prefix
FROM energy_company.Meter;

-- 9. Middle of RatePlan name (chars 5–12)
SELECT RatePlanID, Name, SUBSTRING(Name,5,8) AS MidChunk
FROM energy_company.RatePlan;

-- 10. Extract 'Asset' or first 5 of asset name
SELECT AssetID, Name, SUBSTRING(Name,1,5) AS First5
FROM energy_company.Asset;
```

## Concatenation Operator (+)
```sql
-- 1. Full name as single column
SELECT CustomerID, ISNULL(FirstName,'') + ' ' + ISNULL(LastName,'') AS FullName
FROM energy_company.Customer;

-- 2. Mailing address line
SELECT AddressID, Street + ', ' + City + ', ' + State + ' ' + ZIP + ', ' + Country AS AddressLine
FROM energy_company.Address;

-- 3. Asset label with facility
SELECT a.AssetID, a.Name + ' @ ' + f.Name AS AssetAtFacility
FROM energy_company.Asset a
JOIN energy_company.Facility f ON f.FacilityID = a.FacilityID;

-- 4. Meter display
SELECT m.MeterID, m.SerialNumber + ' (' + ISNULL(m.MeterType,'Unknown') + ')' AS MeterDisplay
FROM energy_company.Meter m;

-- 5. Rate plan display with price
SELECT RatePlanID, Name + ' - $' + CONVERT(varchar(20), PricePerkWh) + '/kWh' AS PlanDisplay
FROM energy_company.RatePlan;

-- 6. Invoice label
SELECT InvoiceID, 'INV-' + CONVERT(varchar(20),InvoiceID) + ' [' + CONVERT(varchar(10),InvoiceDate,120) + ']' AS InvoiceLabel
FROM energy_company.Invoice;

-- 7. Payment reference
SELECT PaymentID, 'PMT ' + CONVERT(varchar(10),PaymentDate,120) + ' $' + CONVERT(varchar(20),AmountPaid) AS PaymentRef
FROM energy_company.Payment;

-- 8. City, state tuple
SELECT AddressID, City + ', ' + State AS CityState
FROM energy_company.Address;

-- 9. Production label
SELECT ep.AssetID,
       CONVERT(varchar(10), ep.ProductionDate,120) + ': ' + CONVERT(varchar(20), ep.EnergyMWh) + ' MWh' AS ProdLabel
FROM energy_company.EnergyProduction ep;

-- 10. Customer + Email display
SELECT CustomerID, ISNULL(FirstName,'') + ' ' + ISNULL(LastName,'') + ' <' + ISNULL(Email,'no-email') + '>' AS Contact
FROM energy_company.Customer;
```

## Lower Function (LOWER)
```sql
-- 1. Emails lowercased
SELECT CustomerID, LOWER(Email) AS EmailLower
FROM energy_company.Customer;

-- 2. City lowercased
SELECT AddressID, LOWER(City) AS CityLower
FROM energy_company.Address;

-- 3. Rate plan lowercase
SELECT RatePlanID, LOWER(Name) AS PlanLower
FROM energy_company.RatePlan;

-- 4. Facility name lowercase
SELECT FacilityID, LOWER(Name) AS FacilityLower
FROM energy_company.Facility;

-- 5. Payment method lowercase
SELECT PaymentID, LOWER(COALESCE(PaymentMethod,'')) AS MethodLower
FROM energy_company.Payment;

-- 6. Serial number lowercase
SELECT MeterID, LOWER(SerialNumber) AS SerialLower
FROM energy_company.Meter;

-- 7. Status lowercase
SELECT AssetID, LOWER(Status) AS StatusLower
FROM energy_company.Asset;

-- 8. State lowercase
SELECT AddressID, LOWER(State) AS StateLower
FROM energy_company.Address;

-- 9. Department lowercase
SELECT DepartmentID, LOWER(Name) AS DeptLower
FROM energy_company.Department;

-- 10. AssetType lowercase
SELECT AssetTypeID, LOWER(Name) AS TypeLower
FROM energy_company.AssetType;
```

## Upper Function (UPPER)
```sql
-- 1. First + last name upper
SELECT CustomerID, UPPER(FirstName) AS FN_UP, UPPER(LastName) AS LN_UP
FROM energy_company.Customer;

-- 2. Email domain upper
SELECT CustomerID, Email,
       UPPER(SUBSTRING(Email, CHARINDEX('@',Email)+1, 200)) AS DomainUpper
FROM energy_company.Customer
WHERE Email LIKE '%@%';

-- 3. State upper
SELECT AddressID, UPPER(State) AS StateUpper
FROM energy_company.Address;

-- 4. Facility name upper
SELECT FacilityID, UPPER(Name) AS FacilityUpper
FROM energy_company.Facility;

-- 5. Rate plan upper
SELECT RatePlanID, UPPER(Name) AS PlanUpper
FROM energy_company.RatePlan;

-- 6. Serial number upper
SELECT MeterID, UPPER(SerialNumber) AS SerialUpper
FROM energy_company.Meter;

-- 7. Department upper
SELECT DepartmentID, UPPER(Name) AS DeptUpper
FROM energy_company.Department;

-- 8. AssetType upper
SELECT AssetTypeID, UPPER(Name) AS TypeUpper
FROM energy_company.AssetType;

-- 9. Country upper
SELECT AddressID, UPPER(Country) AS CountryUpper
FROM energy_company.Address;

-- 10. Status upper
SELECT AssetID, UPPER(Status) AS StatusUpper
FROM energy_company.Asset;
```

## Trim Function (TRIM)
```sql
-- 1. Trim City
SELECT AddressID, City AS Raw, TRIM(City) AS Trimmed
FROM energy_company.Address;

-- 2. Trim State
SELECT AddressID, State AS Raw, TRIM(State) AS Trimmed
FROM energy_company.Address;

-- 3. Trim Street
SELECT AddressID, Street AS Raw, TRIM(Street) AS Trimmed
FROM energy_company.Address;

-- 4. Trim ZIP
SELECT AddressID, ZIP AS Raw, TRIM(ZIP) AS Trimmed
FROM energy_company.Address;

-- 5. Trim Country
SELECT AddressID, Country AS Raw, TRIM(Country) AS Trimmed
FROM energy_company.Address;

-- 6. Trim FirstName/LastName
SELECT CustomerID, TRIM(FirstName) AS FirstTrim, TRIM(LastName) AS LastTrim
FROM energy_company.Customer;

-- 7. Trim Facility Name
SELECT FacilityID, TRIM(Name) AS FacilityTrim
FROM energy_company.Facility;

-- 8. Trim RatePlan Name
SELECT RatePlanID, TRIM(Name) AS PlanTrim
FROM energy_company.RatePlan;

-- 9. Trim PaymentMethod
SELECT PaymentID, TRIM(COALESCE(PaymentMethod,'')) AS MethodTrim
FROM energy_company.Payment;

-- 10. Trim Asset Status
SELECT AssetID, TRIM(Status) AS StatusTrim
FROM energy_company.Asset;
```

## Ltrim Function (LTRIM)
```sql
-- 1. LTRIM Street
SELECT AddressID, LTRIM(Street) AS Street_L
FROM energy_company.Address;

-- 2. LTRIM City
SELECT AddressID, LTRIM(City) AS City_L
FROM energy_company.Address;

-- 3. LTRIM State
SELECT AddressID, LTRIM(State) AS State_L
FROM energy_company.Address;

-- 4. LTRIM ZIP
SELECT AddressID, LTRIM(ZIP) AS ZIP_L
FROM energy_company.Address;

-- 5. LTRIM Country
SELECT AddressID, LTRIM(Country) AS Country_L
FROM energy_company.Address;

-- 6. LTRIM FirstName
SELECT CustomerID, LTRIM(FirstName) AS First_L
FROM energy_company.Customer;

-- 7. LTRIM LastName
SELECT CustomerID, LTRIM(LastName) AS Last_L
FROM energy_company.Customer;

-- 8. LTRIM Facility Name
SELECT FacilityID, LTRIM(Name) AS Facility_L
FROM energy_company.Facility;

-- 9. LTRIM RatePlan Name
SELECT RatePlanID, LTRIM(Name) AS Plan_L
FROM energy_company.RatePlan;

-- 10. LTRIM PaymentMethod
SELECT PaymentID, LTRIM(COALESCE(PaymentMethod,'')) AS Method_L
FROM energy_company.Payment;
```

## Rtrim Function (RTRIM)
```sql
-- 1. RTRIM Street
SELECT AddressID, RTRIM(Street) AS Street_R
FROM energy_company.Address;

-- 2. RTRIM City
SELECT AddressID, RTRIM(City) AS City_R
FROM energy_company.Address;

-- 3. RTRIM State
SELECT AddressID, RTRIM(State) AS State_R
FROM energy_company.Address;

-- 4. RTRIM ZIP
SELECT AddressID, RTRIM(ZIP) AS ZIP_R
FROM energy_company.Address;

-- 5. RTRIM Country
SELECT AddressID, RTRIM(Country) AS Country_R
FROM energy_company.Address;

-- 6. RTRIM FirstName
SELECT CustomerID, RTRIM(FirstName) AS First_R
FROM energy_company.Customer;

-- 7. RTRIM LastName
SELECT CustomerID, RTRIM(LastName) AS Last_R
FROM energy_company.Customer;

-- 8. RTRIM Facility Name
SELECT FacilityID, RTRIM(Name) AS Facility_R
FROM energy_company.Facility;

-- 9. RTRIM RatePlan Name
SELECT RatePlanID, RTRIM(Name) AS Plan_R
FROM energy_company.RatePlan;

-- 10. RTRIM PaymentMethod
SELECT PaymentID, RTRIM(COALESCE(PaymentMethod,'')) AS Method_R
FROM energy_company.Payment;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '@' in Email
SELECT CustomerID, Email, CHARINDEX('@',Email) AS AtPos
FROM energy_company.Customer
WHERE Email IS NOT NULL;

-- 2. Position of '-' in Facility name
SELECT FacilityID, Name, CHARINDEX('-',Name) AS HyphenPos
FROM energy_company.Facility;

-- 3. Position of 'Zone' in Location
SELECT FacilityID, Location, CHARINDEX('Zone',Location) AS ZonePos
FROM energy_company.Facility;

-- 4. Position of ' ' in FirstName (if any)
SELECT CustomerID, FirstName, CHARINDEX(' ',FirstName) AS SpacePos
FROM energy_company.Customer;

-- 5. Position of 'Turbine' in AssetType
SELECT AssetTypeID, Name, CHARINDEX('Turbine',Name) AS TurbinePos
FROM energy_company.AssetType;

-- 6. Position of '.' in Email domain
SELECT CustomerID, Email, CHARINDEX('.', Email) AS DotPos
FROM energy_company.Customer
WHERE Email LIKE '%@%';

-- 7. Position of 'SN' in SerialNumber
SELECT MeterID, SerialNumber, CHARINDEX('SN', SerialNumber) AS SNPos
FROM energy_company.Meter;

-- 8. First hyphen in RatePlan Name
SELECT RatePlanID, Name, CHARINDEX('-', Name) AS HyphenPos
FROM energy_company.RatePlan;

-- 9. Position of '2025' in RatePlan Name
SELECT RatePlanID, Name, CHARINDEX('2025', Name) AS Pos2025
FROM energy_company.RatePlan;

-- 10. Position of 'Zone-3' in Location
SELECT FacilityID, Location, CHARINDEX('Zone-3', Location) AS Z3Pos
FROM energy_company.Facility;
```

## Left Function (LEFT)
```sql
-- 1. First 2 of SerialNumber
SELECT MeterID, SerialNumber, LEFT(SerialNumber,2) AS Prefix
FROM energy_company.Meter;

-- 2. First 4 of ZIP
SELECT AddressID, ZIP, LEFT(ZIP,4) AS Zip4
FROM energy_company.Address;

-- 3. First letter of State
SELECT AddressID, State, LEFT(State,1) AS StateInitial
FROM energy_company.Address;

-- 4. First 3 of City
SELECT AddressID, City, LEFT(City,3) AS City3
FROM energy_company.Address;

-- 5. First 5 of RatePlan Name
SELECT RatePlanID, Name, LEFT(Name,5) AS Name5
FROM energy_company.RatePlan;

-- 6. First 7 of Facility Name
SELECT FacilityID, Name, LEFT(Name,7) AS Name7
FROM energy_company.Facility;

-- 7. First 4 of FirstName
SELECT CustomerID, FirstName, LEFT(FirstName,4) AS FN4
FROM energy_company.Customer;

-- 8. First 10 of Email
SELECT CustomerID, Email, LEFT(Email,10) AS Email10
FROM energy_company.Customer;

-- 9. First 2 of Status
SELECT AssetID, Status, LEFT(Status,2) AS St2
FROM energy_company.Asset;

-- 10. First 3 of PaymentMethod
SELECT PaymentID, PaymentMethod, LEFT(COALESCE(PaymentMethod,''),3) AS PM3
FROM energy_company.Payment;
```

## Right Function (RIGHT)
```sql
-- 1. Last 4 of Phone
SELECT CustomerID, Phone, RIGHT(Phone,4) AS PhoneLast4
FROM energy_company.Customer;

-- 2. Last 3 of ZIP
SELECT AddressID, ZIP, RIGHT(ZIP,3) AS ZipLast3
FROM energy_company.Address;

-- 3. Last 2 of SerialNumber
SELECT MeterID, SerialNumber, RIGHT(SerialNumber,2) AS SNLast2
FROM energy_company.Meter;

-- 4. Last 5 of RatePlan Name
SELECT RatePlanID, Name, RIGHT(Name,5) AS NameLast5
FROM energy_company.RatePlan;

-- 5. Last 3 of City
SELECT AddressID, City, RIGHT(City,3) AS CityLast3
FROM energy_company.Address;

-- 6. Last 4 of InvoiceID as text
SELECT InvoiceID, RIGHT('000000' + CONVERT(varchar(12),InvoiceID), 4) AS InvLast4
FROM energy_company.Invoice;

-- 7. Last 2 of State
SELECT AddressID, State, RIGHT(State,2) AS StateLast2
FROM energy_company.Address;

-- 8. Last char of Status
SELECT AssetID, Status, RIGHT(Status,1) AS LastChar
FROM energy_company.Asset;

-- 9. Last 6 of Email
SELECT CustomerID, Email, RIGHT(Email,6) AS EmailLast6
FROM energy_company.Customer
WHERE Email IS NOT NULL;

-- 10. Last 3 of Facility Name
SELECT FacilityID, Name, RIGHT(Name,3) AS NameLast3
FROM energy_company.Facility;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse email
SELECT CustomerID, Email, REVERSE(Email) AS EmailRev
FROM energy_company.Customer;

-- 2. Reverse SerialNumber
SELECT MeterID, SerialNumber, REVERSE(SerialNumber) AS SerialRev
FROM energy_company.Meter;

-- 3. Reverse City
SELECT AddressID, City, REVERSE(City) AS CityRev
FROM energy_company.Address;

-- 4. Reverse State
SELECT AddressID, State, REVERSE(State) AS StateRev
FROM energy_company.Address;

-- 5. Reverse RatePlan Name
SELECT RatePlanID, Name, REVERSE(Name) AS NameRev
FROM energy_company.RatePlan;

-- 6. Reverse Facility Name
SELECT FacilityID, Name, REVERSE(Name) AS NameRev
FROM energy_company.Facility;

-- 7. Reverse Status
SELECT AssetID, Status, REVERSE(Status) AS StatusRev
FROM energy_company.Asset;

-- 8. Reverse Country
SELECT AddressID, Country, REVERSE(Country) AS CountryRev
FROM energy_company.Address;

-- 9. Reverse PaymentMethod
SELECT PaymentID, PaymentMethod, REVERSE(COALESCE(PaymentMethod,'')) AS MethodRev
FROM energy_company.Payment;

-- 10. Reverse FirstName + LastName
SELECT CustomerID, REVERSE(ISNULL(FirstName,'') + ' ' + ISNULL(LastName,'')) AS NameRev
FROM energy_company.Customer;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace 'Facility-' with 'Fac-'
SELECT FacilityID, Name, REPLACE(Name, 'Facility-', 'Fac-') AS NameShort
FROM energy_company.Facility;

-- 2. Replace 'Zone-' with 'Z'
SELECT FacilityID, Location, REPLACE(Location, 'Zone-', 'Z') AS LocShort
FROM energy_company.Facility;

-- 3. Replace '@example.com' with '@mail.local'
SELECT CustomerID, Email, REPLACE(Email, '@example.com','@mail.local') AS EmailNew
FROM energy_company.Customer;

-- 4. Replace spaces with underscores in rate plan names
SELECT RatePlanID, Name, REPLACE(Name,' ','_') AS NameSlug
FROM energy_company.RatePlan;

-- 5. Remove 'SN' from serial
SELECT MeterID, SerialNumber, REPLACE(SerialNumber,'SN','') AS SerialNoPrefix
FROM energy_company.Meter;

-- 6. Replace 'Active' with 'A'
SELECT AssetID, Status, REPLACE(Status,'Active','A') AS StatusShort
FROM energy_company.Asset;

-- 7. Replace '-' with '' in ZIP
SELECT AddressID, ZIP, REPLACE(ZIP,'-','') AS ZipCompact
FROM energy_company.Address;

-- 8. Replace '(' and ')' in Phone
SELECT CustomerID, Phone, REPLACE(REPLACE(Phone,'(',''),')','') AS PhoneNoParens
FROM energy_company.Customer;

-- 9. Replace '2025' with 'Y25' in plan names
SELECT RatePlanID, Name, REPLACE(Name,'2025','Y25') AS NameY25
FROM energy_company.RatePlan;

-- 10. Replace NULL PaymentMethod to 'Unknown' (via COALESCE+REPLACE demo)
SELECT PaymentID, COALESCE(PaymentMethod,'Unknown') AS MethodFixed
FROM energy_company.Payment;
```

## Case Statement (CASE)
```sql
-- 1. Email domain label
SELECT CustomerID, Email,
       CASE
         WHEN Email LIKE '%@gmail.%'  THEN 'Gmail'
         WHEN Email LIKE '%@yahoo.%'  THEN 'Yahoo'
         WHEN Email LIKE '%@example.%' THEN 'Example'
         WHEN Email IS NULL           THEN 'Missing'
         ELSE 'Other'
       END AS DomainLabel
FROM energy_company.Customer;

-- 2. Asset health label from Status
SELECT AssetID, Status,
       CASE Status
         WHEN 'Active' THEN 'OK'
         WHEN 'Maintenance' THEN 'Needs Attention'
         WHEN 'Retired' THEN 'Out'
         ELSE 'Unknown'
       END AS Health
FROM energy_company.Asset;

-- 3. Payment size bucket
SELECT PaymentID, AmountPaid,
       CASE
         WHEN AmountPaid >= 500 THEN 'Large'
         WHEN AmountPaid >= 200 THEN 'Medium'
         WHEN AmountPaid > 0    THEN 'Small'
         ELSE 'Zero'
       END AS SizeBucket
FROM energy_company.Payment;

-- 4. City group by first letter
SELECT AddressID, City,
       CASE WHEN LEFT(City,1) BETWEEN 'A' AND 'M' THEN 'A-M' ELSE 'N-Z' END AS CityGroup
FROM energy_company.Address;

-- 5. Plan price tier
SELECT RatePlanID, PricePerkWh,
       CASE
         WHEN PricePerkWh < 0.10 THEN 'Low'
         WHEN PricePerkWh <= 0.105 THEN 'Mid'
         ELSE 'High'
       END AS PriceTier
FROM energy_company.RatePlan;

-- 6. Overdue invoice flag
SELECT InvoiceID, DueDate,
       CASE WHEN DueDate < @RefDate THEN 'Overdue' ELSE 'Not Due' END AS DueFlag
FROM energy_company.Invoice;

-- 7. Meter type classification
SELECT MeterID, COALESCE(MeterType,'') AS MeterType,
       CASE COALESCE(MeterType,'')
         WHEN 'Smart' THEN 'Advanced'
         WHEN 'Basic' THEN 'Legacy'
         ELSE 'Unknown'
       END AS TypeClass
FROM energy_company.Meter;

-- 8. Facility zone number from Location
SELECT FacilityID, Location,
       CASE
         WHEN Location LIKE '%Zone-1%' THEN 'Z1'
         WHEN Location LIKE '%Zone-2%' THEN 'Z2'
         WHEN Location LIKE '%Zone-3%' THEN 'Z3'
         WHEN Location LIKE '%Zone-4%' THEN 'Z4'
         ELSE 'Z5+'
       END AS ZoneCode
FROM energy_company.Facility;

-- 9. Consumption band using July readings (per row)
SELECT MeterID, ReadDate, Consumption_kWh,
       CASE
         WHEN Consumption_kWh >= 900 THEN 'Very High'
         WHEN Consumption_kWh >= 600 THEN 'High'
         WHEN Consumption_kWh >= 300 THEN 'Medium'
         ELSE 'Low'
       END AS Band
FROM energy_company.MeterReading
WHERE ReadDate BETWEEN @RefMonthStart AND @RefMonthEnd;

-- 10. Customer initial category (A–F, G–M, N–Z)
SELECT CustomerID, LastName,
       CASE
         WHEN UPPER(LEFT(LastName,1)) BETWEEN 'A' AND 'F' THEN 'A-F'
         WHEN UPPER(LEFT(LastName,1)) BETWEEN 'G' AND 'M' THEN 'G-M'
         ELSE 'N-Z'
       END AS InitialBucket
FROM energy_company.Customer;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Email fallback
SELECT CustomerID, ISNULL(Email, 'no-email@local') AS EmailFixed
FROM energy_company.Customer;

-- 2. Phone fallback
SELECT CustomerID, ISNULL(Phone, 'N/A') AS PhoneFixed
FROM energy_company.Customer;

-- 3. MeterType fallback
SELECT MeterID, ISNULL(MeterType, 'Unknown') AS MeterTypeFixed
FROM energy_company.Meter;

-- 4. PaymentMethod fallback
SELECT PaymentID, ISNULL(PaymentMethod, 'Unknown') AS MethodFixed
FROM energy_company.Payment;

-- 5. Asset CommissionDate fallback to '2000-01-01'
SELECT AssetID, ISNULL(CommissionDate, '2000-01-01') AS CommDateFixed
FROM energy_company.Asset;

-- 6. RatePlan Description fallback
SELECT RatePlanID, ISNULL(Description, '(none)') AS DescFixed
FROM energy_company.RatePlan;

-- 7. Address State fallback
SELECT AddressID, ISNULL(State,'Unknown') AS StateFixed
FROM energy_company.Address;

-- 8. Facility Location fallback
SELECT FacilityID, ISNULL(Location,'Unknown') AS LocationFixed
FROM energy_company.Facility;

-- 9. AssetMaintenance Description fallback
SELECT MaintenanceID, ISNULL(Description,'(no-notes)') AS DescFixed
FROM energy_company.AssetMaintenance;

-- 10. Customer AddressID to 0 if NULL
SELECT CustomerID, ISNULL(AddressID,0) AS AddressID_Fixed
FROM energy_company.Customer;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Pick first non-null contact: Email then Phone
SELECT CustomerID, COALESCE(Email, Phone, 'no-contact') AS PrimaryContact
FROM energy_company.Customer;

-- 2. Pick first non-null location: Facility.Location or 'Unknown'
SELECT FacilityID, COALESCE(Location,'Unknown') AS Loc
FROM energy_company.Facility;

-- 3. Pick PaymentMethod or 'ACH' default
SELECT PaymentID, COALESCE(PaymentMethod,'ACH') AS MethodPref
FROM energy_company.Payment;

-- 4. Customer full name handling NULLs
SELECT CustomerID, COALESCE(FirstName,'') + ' ' + COALESCE(LastName,'') AS FullName
FROM energy_company.Customer;

-- 5. Asset status fallback chain
SELECT AssetID, COALESCE(Status,'Active') AS StatusFixed
FROM energy_company.Asset;

-- 6. MeterType fallback chain to 'Basic'
SELECT MeterID, COALESCE(MeterType,'Basic') AS TypeFixed
FROM energy_company.Meter;

-- 7. RatePlan description or name
SELECT RatePlanID, COALESCE(Description, Name) AS PlanDescOrName
FROM energy_company.RatePlan;

-- 8. Address state/city fallback to 'NA'
SELECT AddressID, COALESCE(State,'NA') AS StateX, COALESCE(City,'NA') AS CityX
FROM energy_company.Address;

-- 9. Invoice status or 'Open'
SELECT InvoiceID, COALESCE(Status,'Open') AS StatusX
FROM energy_company.Invoice;

-- 10. AssetMaintenance performer or 'Vendor'
SELECT MaintenanceID, COALESCE(CONVERT(varchar(20),PerformedBy),'Vendor') AS PerformedByX
FROM energy_company.AssetMaintenance;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
