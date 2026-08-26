![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Facility name lengths
SELECT f.FacilityID, f.Name, LEN(f.Name) AS NameLen
FROM oil_n_gas_company.Facility f
ORDER BY NameLen DESC, f.FacilityID;

-- 2. Product names with length > 8
SELECT p.ProductID, p.Name, LEN(p.Name) AS NameLen
FROM oil_n_gas_company.Product p
WHERE LEN(p.Name) > 8
ORDER BY p.ProductID;

-- 3. Customer names sorted by length
SELECT c.CustomerID, c.Name, LEN(c.Name) AS NameLen
FROM oil_n_gas_company.Customer c
ORDER BY LEN(c.Name) DESC, c.CustomerID;

-- 4. Pipeline name length and capacity
SELECT pl.PipelineID, pl.Name, LEN(pl.Name) AS NameLen, pl.CapacityBbl
FROM oil_n_gas_company.Pipeline pl;

-- 5. Address street length
SELECT a.AddressID, a.Street, LEN(a.Street) AS StreetLen
FROM oil_n_gas_company.Address a
ORDER BY StreetLen DESC;

-- 6. Well name vs status length
SELECT w.WellID, w.Name, w.Status, LEN(w.Status) AS StatusLen
FROM oil_n_gas_company.Well w
ORDER BY w.WellID;

-- 7. RigName length (NULL-safe)
SELECT d.OperationID, ISNULL(d.RigName,'(no-rig)') AS RigName, LEN(ISNULL(d.RigName,'')) AS RigLen
FROM oil_n_gas_company.DrillingOperation d
ORDER BY RigLen DESC, d.OperationID;

-- 8. Invoice status length distribution
SELECT i.Status, COUNT(*) AS Cnt, MIN(LEN(i.Status)) AS MinLen, MAX(LEN(i.Status)) AS MaxLen
FROM oil_n_gas_company.Invoice i
GROUP BY i.Status;

-- 9. Field name length and discovery year
SELECT f.FieldID, f.Name, LEN(f.Name) AS NameLen, YEAR(f.DiscoveryDate) AS DiscYear
FROM oil_n_gas_company.Field f
ORDER BY DiscYear DESC, NameLen DESC;

-- 10. AssetMaintenance description length (top 20)
SELECT TOP (20) am.MaintenanceID, am.Description, LEN(ISNULL(am.Description,'')) AS DescLen
FROM oil_n_gas_company.AssetMaintenance am
ORDER BY DescLen DESC, am.MaintenanceID;
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 5 chars of facility names
SELECT f.FacilityID, f.Name, SUBSTRING(f.Name,1,5) AS First5
FROM oil_n_gas_company.Facility f;

-- 2. Extract numeric suffix from 'Region-###'
SELECT r.RegionID, r.Name, SUBSTRING(r.Name, CHARINDEX('-',r.Name)+1, 10) AS RegionNum
FROM oil_n_gas_company.Region r
WHERE CHARINDEX('-', r.Name) > 0;

-- 3. Get 'Well' prefix + first 3 digits from Well name
SELECT w.WellID, w.Name, SUBSTRING(w.Name,1,7) AS Prefix7
FROM oil_n_gas_company.Well w;

-- 4. Address street number (after 'No.')
SELECT a.AddressID, a.Street,
       SUBSTRING(a.Street, CHARINDEX('.',a.Street)+2, CHARINDEX(' ',a.Street+' ', CHARINDEX('.',a.Street)+2) - (CHARINDEX('.',a.Street)+2)) AS StreetNo
FROM oil_n_gas_company.Address a
WHERE CHARINDEX('No.', a.Street) = 1;

-- 5. ZIP last 4 using SUBSTRING
SELECT a.AddressID, a.ZIP, SUBSTRING(a.ZIP, LEN(a.ZIP)-3, 4) AS ZipLast4
FROM oil_n_gas_company.Address a;

-- 6. Product code (first 3 chars)
SELECT p.ProductID, p.Name, SUBSTRING(p.Name,1,3) AS Code3
FROM oil_n_gas_company.Product p;

-- 7. Pipeline short label: first 9 chars
SELECT pl.PipelineID, pl.Name, SUBSTRING(pl.Name,1,9) AS ShortName
FROM oil_n_gas_company.Pipeline pl;

-- 8. Customer short tag: first 12 chars of name
SELECT c.CustomerID, c.Name, SUBSTRING(c.Name,1,12) AS ShortTag
FROM oil_n_gas_company.Customer c;

-- 9. Field tag: 'F-' + first 6 of name
SELECT f.FieldID, 'F-' + SUBSTRING(f.Name,1,6) AS FieldTag
FROM oil_n_gas_company.Field f;

-- 10. Shipment month (YYYY-MM) from date as string
SELECT s.ShipmentID, s.ShipDate,
       SUBSTRING(CONVERT(varchar(10), s.ShipDate, 23),1,7) AS ShipYYYYMM
FROM oil_n_gas_company.Shipment s;
```

## Concatenation Operator (+)
```sql
-- 1. City, State label
SELECT a.AddressID, a.City + ', ' + a.State AS CityState
FROM oil_n_gas_company.Address a;

-- 2. Full facility label
SELECT f.FacilityID, f.Name + ' @ ' + ISNULL(f.Location,'(Unknown)') AS FacilityLabel
FROM oil_n_gas_company.Facility f;

-- 3. Customer + ID string
SELECT c.CustomerID, c.Name + ' [ID=' + CONVERT(varchar(10), c.CustomerID) + ']' AS CustKey
FROM oil_n_gas_company.Customer c;

-- 4. Pipeline endpoints string
SELECT pl.PipelineID,
       pl.Name + ' (' + CONVERT(varchar(10), pl.FromFacility) + '→' + CONVERT(varchar(10), pl.ToFacility) + ')' AS PipeRoute
FROM oil_n_gas_company.Pipeline pl;

-- 5. Product + API (nullable) pretty label
SELECT p.ProductID, p.Name + ' API=' + ISNULL(CONVERT(varchar(10), p.APIGravity),'NA') AS ProdAPI
FROM oil_n_gas_company.Product p;

-- 6. Well display: Name + Status
SELECT w.WellID, w.Name + ' [' + ISNULL(w.Status,'?') + ']' AS WellDisp
FROM oil_n_gas_company.Well w;

-- 7. Contract caption: Cust + Prod
SELECT sc.ContractID, c.Name + ' - ' + pr.Name AS ContractCaption
FROM oil_n_gas_company.SalesContract sc
JOIN oil_n_gas_company.Customer c ON c.CustomerID = sc.CustomerID
JOIN oil_n_gas_company.Product  pr ON pr.ProductID = sc.ProductID;

-- 8. Invoice key string (composite)
SELECT i.InvoiceID, i.InvoiceDate,
       CONVERT(varchar(10), i.InvoiceID) + '/' + CONVERT(varchar(10), i.InvoiceDate, 23) AS InvoiceKey
FROM oil_n_gas_company.Invoice i;

-- 9. RigName fallback
SELECT d.OperationID, ISNULL(d.RigName,'Rig-' + CONVERT(varchar(10), d.OperationID)) AS RigShown
FROM oil_n_gas_company.DrillingOperation d;

-- 10. Facility-page slug (lowercase, hyphenated)
SELECT f.FacilityID,
       LOWER(REPLACE(f.Name + '-' + ISNULL(f.Location,''), ' ', '-')) AS Slug
FROM oil_n_gas_company.Facility f;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase customer names
SELECT c.CustomerID, LOWER(c.Name) AS name_lower
FROM oil_n_gas_company.Customer c;

-- 2. Lowercase facility + location
SELECT f.FacilityID, LOWER(f.Name + COALESCE(' @ ' + f.Location,'')) AS label_lower
FROM oil_n_gas_company.Facility f;

-- 3. Lowercase product names distinct
SELECT DISTINCT LOWER(p.Name) AS product_lower
FROM oil_n_gas_company.Product p;

-- 4. Lowercase pipeline names
SELECT pl.PipelineID, LOWER(pl.Name) AS pipe_lower
FROM oil_n_gas_company.Pipeline pl;

-- 5. Lowercase address city/state
SELECT a.AddressID, LOWER(a.City) AS city_lower, LOWER(a.State) AS state_lower
FROM oil_n_gas_company.Address a;

-- 6. Lowercase field names
SELECT f.FieldID, LOWER(f.Name) AS field_lower
FROM oil_n_gas_company.Field f;

-- 7. Lowercase well status
SELECT w.WellID, LOWER(ISNULL(w.Status,'')) AS status_lower
FROM oil_n_gas_company.Well w;

-- 8. Lowercase invoice status distinct
SELECT DISTINCT LOWER(i.Status) AS status_lower
FROM oil_n_gas_company.Invoice i;

-- 9. Lowercase rig names
SELECT d.OperationID, LOWER(ISNULL(d.RigName,'')) AS rig_lower
FROM oil_n_gas_company.DrillingOperation d;

-- 10. Lowercase shipment product label
SELECT s.ShipmentID, LOWER(p.Name) AS product_lower
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product p ON p.ProductID = s.ProductID;
```

## Upper Function (UPPER)
```sql
-- 1. UPPER customer names
SELECT c.CustomerID, UPPER(c.Name) AS NAME_UP
FROM oil_n_gas_company.Customer c;

-- 2. UPPER facility label
SELECT f.FacilityID, UPPER(f.Name + COALESCE(' @ ' + f.Location,'')) AS LABEL_UP
FROM oil_n_gas_company.Facility f;

-- 3. UPPER product names
SELECT p.ProductID, UPPER(p.Name) AS PROD_UP
FROM oil_n_gas_company.Product p;

-- 4. UPPER address country
SELECT a.AddressID, UPPER(a.Country) AS COUNTRY_UP
FROM oil_n_gas_company.Address a;

-- 5. UPPER well status
SELECT w.WellID, UPPER(ISNULL(w.Status,'')) AS STATUS_UP
FROM oil_n_gas_company.Well w;

-- 6. UPPER pipeline names
SELECT pl.PipelineID, UPPER(pl.Name) AS PIPE_UP
FROM oil_n_gas_company.Pipeline pl;

-- 7. UPPER invoice status
SELECT DISTINCT UPPER(i.Status) AS INV_STATUS_UP
FROM oil_n_gas_company.Invoice i;

-- 8. UPPER field names
SELECT f.FieldID, UPPER(f.Name) AS FIELD_UP
FROM oil_n_gas_company.Field f;

-- 9. UPPER rig name (fallback)
SELECT d.OperationID, UPPER(ISNULL(d.RigName,'UNKNOWN')) AS RIG_UP
FROM oil_n_gas_company.DrillingOperation d;

-- 10. UPPER product + API tag
SELECT p.ProductID, UPPER(p.Name) + ' API=' + ISNULL(CONVERT(varchar(10), p.APIGravity),'NA') AS TAG_UP
FROM oil_n_gas_company.Product p;
```

## Trim Function (TRIM)
```sql
-- 1. Trim a padded facility name (simulate padding)
SELECT f.FacilityID, TRIM('  ' + f.Name + '   ') AS Trimmed
FROM oil_n_gas_company.Facility f;

-- 2. Trim location (may already be clean)
SELECT f.FacilityID, TRIM(ISNULL(f.Location,'')) AS LocTrim
FROM oil_n_gas_company.Facility f;

-- 3. Trim customer name + city composite
SELECT c.CustomerID, TRIM(c.Name + '  ') + ' / ' + TRIM(a.City + ' ') AS LabelTrim
FROM oil_n_gas_company.Customer c
LEFT JOIN oil_n_gas_company.Address a ON a.AddressID = c.AddressID;

-- 4. Trim rig names
SELECT d.OperationID, TRIM(ISNULL(d.RigName,'')) AS RigTrim
FROM oil_n_gas_company.DrillingOperation d;

-- 5. Trim 'Well' label
SELECT w.WellID, TRIM(' ' + w.Name + ' ') AS WellTrim
FROM oil_n_gas_company.Well w;

-- 6. Trim product names before comparison
SELECT p.ProductID
FROM oil_n_gas_company.Product p
WHERE TRIM(p.Name) LIKE 'C%';

-- 7. Trim field names and show length after
SELECT f.FieldID, TRIM(f.Name) AS TName, LEN(TRIM(f.Name)) AS LenAfter
FROM oil_n_gas_company.Field f;

-- 8. Trim pipeline names and compare
SELECT pl.PipelineID, TRIM(pl.Name) AS PName
FROM oil_n_gas_company.Pipeline pl
WHERE TRIM(pl.Name) <> pl.Name OR 1=1;

-- 9. Trim address street
SELECT a.AddressID, TRIM(a.Street) AS StreetTrim
FROM oil_n_gas_company.Address a;

-- 10. Trim invoice status just in case
SELECT DISTINCT TRIM(i.Status) AS StatusTrim
FROM oil_n_gas_company.Invoice i;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Left-trim padded names (simulate)
SELECT p.ProductID, LTRIM('   ' + p.Name) AS LT
FROM oil_n_gas_company.Product p;

-- 2. Left-trim location
SELECT f.FacilityID, LTRIM(ISNULL(f.Location,'')) AS LocLT
FROM oil_n_gas_company.Facility f;

-- 3. Left-trim rig
SELECT d.OperationID, LTRIM(ISNULL(d.RigName,'')) AS RigLT
FROM oil_n_gas_company.DrillingOperation d;

-- 4. Left-trim '  Well-XX'
SELECT w.WellID, LTRIM('  ' + w.Name) AS WellLT
FROM oil_n_gas_company.Well w;

-- 5. Left-trim city
SELECT a.AddressID, LTRIM(a.City) AS CityLT
FROM oil_n_gas_company.Address a;

-- 6. Compare lengths before/after LTRIM
SELECT a.AddressID, LEN('   '+a.State) AS BeforeLen, LEN(LTRIM('   '+a.State)) AS AfterLen
FROM oil_n_gas_company.Address a;

-- 7. LTRIM invoice status (demo)
SELECT DISTINCT LTRIM(i.Status) AS StatusLT
FROM oil_n_gas_company.Invoice i;

-- 8. LTRIM on composite string
SELECT c.CustomerID, LTRIM('   ' + c.Name + ' / ' + a.State) AS LabelLT
FROM oil_n_gas_company.Customer c
LEFT JOIN oil_n_gas_company.Address a ON a.AddressID = c.AddressID;

-- 9. LTRIM facility + location
SELECT f.FacilityID, LTRIM('  ' + f.Name + ' @ ' + ISNULL(f.Location,'')) AS FacLT
FROM oil_n_gas_company.Facility f;

-- 10. LTRIM product + API
SELECT p.ProductID, LTRIM('  ' + p.Name + ' API=' + ISNULL(CONVERT(varchar(10),p.APIGravity),'NA')) AS ProdLT
FROM oil_n_gas_company.Product p;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Right-trim padded name (simulate)
SELECT p.ProductID, RTRIM(p.Name + '   ') AS RT
FROM oil_n_gas_company.Product p;

-- 2. Right-trim city
SELECT a.AddressID, RTRIM(a.City) AS CityRT
FROM oil_n_gas_company.Address a;

-- 3. Right-trim facility label
SELECT f.FacilityID, RTRIM(f.Name + ' @ ' + ISNULL(f.Location,'')) AS FacRT
FROM oil_n_gas_company.Facility f;

-- 4. Right-trim rig
SELECT d.OperationID, RTRIM(ISNULL(d.RigName,'')) AS RigRT
FROM oil_n_gas_company.DrillingOperation d;

-- 5. Compare lengths before/after RTRIM
SELECT a.AddressID, LEN(a.Street+'  ') AS BeforeLen, LEN(RTRIM(a.Street+'  ')) AS AfterLen
FROM oil_n_gas_company.Address a;

-- 6. RTRIM pipeline name
SELECT pl.PipelineID, RTRIM(pl.Name) AS PipeRT
FROM oil_n_gas_company.Pipeline pl;

-- 7. RTRIM invoice status
SELECT DISTINCT RTRIM(i.Status) AS StatusRT
FROM oil_n_gas_company.Invoice i;

-- 8. RTRIM field name
SELECT f.FieldID, RTRIM(f.Name) AS FieldRT
FROM oil_n_gas_company.Field f;

-- 9. RTRIM well name + status
SELECT w.WellID, RTRIM(w.Name + ' [' + ISNULL(w.Status,'') + ']') AS WellRT
FROM oil_n_gas_company.Well w;

-- 10. RTRIM shipment product label
SELECT s.ShipmentID, RTRIM(p.Name) AS ProductRT
FROM oil_n_gas_company.Shipment s
JOIN oil_n_gas_company.Product p ON p.ProductID = s.ProductID;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '-' in region names
SELECT r.RegionID, r.Name, CHARINDEX('-', r.Name) AS DashPos
FROM oil_n_gas_company.Region r;

-- 2. Find 'Rig' occurrence in RigName
SELECT d.OperationID, d.RigName, CHARINDEX('Rig', ISNULL(d.RigName,'')) AS RigPos
FROM oil_n_gas_company.DrillingOperation d;

-- 3. Facilities whose name contains 'Ref'
SELECT f.FacilityID, f.Name
FROM oil_n_gas_company.Facility f
WHERE CHARINDEX('Ref', f.Name) > 0;

-- 4. Customers whose name contains 'Customer-00'
SELECT c.CustomerID, c.Name
FROM oil_n_gas_company.Customer c
WHERE CHARINDEX('Customer-00', c.Name) > 0;

-- 5. Address streets containing 'St'
SELECT a.AddressID, a.Street
FROM oil_n_gas_company.Address a
WHERE CHARINDEX('St', a.Street) > 0;

-- 6. Pipelines with number '1' in name
SELECT pl.PipelineID, pl.Name
FROM oil_n_gas_company.Pipeline pl
WHERE CHARINDEX('1', pl.Name) > 0;

-- 7. Fields whose name contains 'Field-1'
SELECT f.FieldID, f.Name
FROM oil_n_gas_company.Field f
WHERE CHARINDEX('Field-1', f.Name) > 0;

-- 8. Products containing space
SELECT p.ProductID, p.Name
FROM oil_n_gas_company.Product p
WHERE CHARINDEX(' ', p.Name) > 0;

-- 9. Wells containing hyphen
SELECT w.WellID, w.Name
FROM oil_n_gas_company.Well w
WHERE CHARINDEX('-', w.Name) > 0;

-- 10. Invoice statuses containing space
SELECT DISTINCT i.Status
FROM oil_n_gas_company.Invoice i
WHERE CHARINDEX(' ', i.Status) > 0;
```

## Left Function (LEFT)
```sql
-- 1. Left 4 of customer name
SELECT c.CustomerID, LEFT(c.Name,4) AS Left4
FROM oil_n_gas_company.Customer c;

-- 2. Facility code (first 3)
SELECT f.FacilityID, LEFT(f.Name,3) AS FacCode
FROM oil_n_gas_company.Facility f;

-- 3. Product prefix (first 2)
SELECT p.ProductID, LEFT(p.Name,2) AS ProdPrefix
FROM oil_n_gas_company.Product p;

-- 4. Region prefix
SELECT r.RegionID, LEFT(r.Name,6) AS RegionPrefix
FROM oil_n_gas_company.Region r;

-- 5. Field short
SELECT f.FieldID, LEFT(f.Name,7) AS FieldShort
FROM oil_n_gas_company.Field f;

-- 6. Pipeline short
SELECT pl.PipelineID, LEFT(pl.Name,9) AS PipeShort
FROM oil_n_gas_company.Pipeline pl;

-- 7. Well short
SELECT w.WellID, LEFT(w.Name,7) AS WellShort
FROM oil_n_gas_company.Well w;

-- 8. Address ZIP first 2
SELECT a.AddressID, LEFT(a.ZIP,2) AS ZipFirst2
FROM oil_n_gas_company.Address a;

-- 9. Invoice date string LEFT 7 (YYYY-MM)
SELECT i.InvoiceID, LEFT(CONVERT(varchar(10), i.InvoiceDate, 23),7) AS InvYYYYMM
FROM oil_n_gas_company.Invoice i;

-- 10. RigName first 5 (NULL-safe)
SELECT d.OperationID, LEFT(ISNULL(d.RigName,''),5) AS Rig5
FROM oil_n_gas_company.DrillingOperation d;
```

## Right Function (RIGHT)
```sql
-- 1. Right 3 of customer name
SELECT c.CustomerID, RIGHT(c.Name,3) AS Right3
FROM oil_n_gas_company.Customer c;

-- 2. Right 3 of region name (numeric tail)
SELECT r.RegionID, RIGHT(r.Name,3) AS RegTail
FROM oil_n_gas_company.Region r;

-- 3. Right 4 of field name
SELECT f.FieldID, RIGHT(f.Name,4) AS FieldTail
FROM oil_n_gas_company.Field f;

-- 4. Right 2 of state
SELECT a.AddressID, RIGHT(a.State,2) AS StateTail
FROM oil_n_gas_company.Address a;

-- 5. Right 5 of pipeline name
SELECT pl.PipelineID, RIGHT(pl.Name,5) AS PipeTail
FROM oil_n_gas_company.Pipeline pl;

-- 6. Right 6 of ZIP with padding
SELECT a.AddressID, RIGHT('000000'+a.ZIP,6) AS ZipPad6
FROM oil_n_gas_company.Address a;

-- 7. Right 3 of product name
SELECT p.ProductID, RIGHT(p.Name,3) AS ProdTail
FROM oil_n_gas_company.Product p;

-- 8. Right 8 of facility name
SELECT f.FacilityID, RIGHT(f.Name,8) AS FacTail
FROM oil_n_gas_company.Facility f;

-- 9. Right 5 of well name
SELECT w.WellID, RIGHT(w.Name,5) AS WellTail
FROM oil_n_gas_company.Well w;

-- 10. Right 10 of street
SELECT a.AddressID, RIGHT(a.Street,10) AS StreetTail
FROM oil_n_gas_company.Address a;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse pipeline names
SELECT pl.PipelineID, pl.Name, REVERSE(pl.Name) AS NameRev
FROM oil_n_gas_company.Pipeline pl;

-- 2. Reverse customer names (fun)
SELECT c.CustomerID, c.Name, REVERSE(c.Name) AS NameRev
FROM oil_n_gas_company.Customer c;

-- 3. Reverse product names
SELECT p.ProductID, p.Name, REVERSE(p.Name) AS ProdRev
FROM oil_n_gas_company.Product p;

-- 4. Reverse facility names
SELECT f.FacilityID, f.Name, REVERSE(f.Name) AS FacRev
FROM oil_n_gas_company.Facility f;

-- 5. Reverse region names
SELECT r.RegionID, r.Name, REVERSE(r.Name) AS RegRev
FROM oil_n_gas_company.Region r;

-- 6. Reverse field names
SELECT f.FieldID, f.Name, REVERSE(f.Name) AS FieldRev
FROM oil_n_gas_company.Field f;

-- 7. Reverse well names
SELECT w.WellID, w.Name, REVERSE(w.Name) AS WellRev
FROM oil_n_gas_company.Well w;

-- 8. Reverse city names
SELECT a.AddressID, a.City, REVERSE(a.City) AS CityRev
FROM oil_n_gas_company.Address a;

-- 9. Reverse invoice status
SELECT DISTINCT i.Status, REVERSE(i.Status) AS StatusRev
FROM oil_n_gas_company.Invoice i;

-- 10. Reverse rig names
SELECT d.OperationID, d.RigName, REVERSE(ISNULL(d.RigName,'')) AS RigRev
FROM oil_n_gas_company.DrillingOperation d;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace hyphen with space in region names
SELECT r.RegionID, REPLACE(r.Name,'-',' ') AS NameClean
FROM oil_n_gas_company.Region r;

-- 2. Replace 'Customer-' with 'Cust #'
SELECT c.CustomerID, REPLACE(c.Name,'Customer-','Cust #') AS Friendly
FROM oil_n_gas_company.Customer c;

-- 3. Replace spaces with underscores in facility names
SELECT f.FacilityID, REPLACE(f.Name,' ','_') AS FacSlug
FROM oil_n_gas_company.Facility f;

-- 4. Replace spaces with '-' in product names
SELECT p.ProductID, REPLACE(p.Name,' ','-') AS ProdSlug
FROM oil_n_gas_company.Product p;

-- 5. Replace 'St' with 'Street' in address street (demo)
SELECT a.AddressID, a.Street, REPLACE(a.Street,' St',' Street') AS StreetFixed
FROM oil_n_gas_company.Address a;

-- 6. Remove spaces from rig names
SELECT d.OperationID, REPLACE(ISNULL(d.RigName,''),' ','') AS RigCompact
FROM oil_n_gas_company.DrillingOperation d;

-- 7. Replace 'Well-' with 'W#'
SELECT w.WellID, REPLACE(w.Name,'Well-','W#') AS WellShort
FROM oil_n_gas_company.Well w;

-- 8. Replace 'Field-' with 'F#'
SELECT f.FieldID, REPLACE(f.Name,'Field-','F#') AS FieldShort
FROM oil_n_gas_company.Field f;

-- 9. Replace 'Pipeline-' with 'PL-'
SELECT pl.PipelineID, REPLACE(pl.Name,'Pipeline-','PL-') AS PipeShort
FROM oil_n_gas_company.Pipeline pl;

-- 10. Replace spaces with '' in city (compact key)
SELECT a.AddressID, REPLACE(a.City,' ','') AS CityKey
FROM oil_n_gas_company.Address a;
```

## Case Statement (CASE)
```sql
-- 1. Categorize product name length
SELECT p.ProductID, p.Name,
       CASE WHEN LEN(p.Name) <= 6 THEN 'Short'
            WHEN LEN(p.Name) <= 10 THEN 'Medium'
            ELSE 'Long' END AS NameLenCat
FROM oil_n_gas_company.Product p;

-- 2. Facility type label
SELECT f.FacilityID, f.Name, f.FacilityType,
       CASE f.FacilityType
         WHEN 'Refinery' THEN 'REF'
         WHEN 'Terminal' THEN 'TERM'
         WHEN 'Storage'  THEN 'STO'
         ELSE 'OTHER' END AS TypeCode
FROM oil_n_gas_company.Facility f;

-- 3. Well status flag
SELECT w.WellID, w.Name, w.Status,
       CASE WHEN w.Status = 'Producing' THEN 'Active'
            WHEN w.Status = 'Drilling'  THEN 'In-Work'
            ELSE 'Other' END AS StatusGrp
FROM oil_n_gas_company.Well w;

-- 4. Invoice status normalization (upper)
SELECT DISTINCT i.Status,
       CASE WHEN UPPER(i.Status) IN ('OPEN') THEN 'OPEN'
            WHEN UPPER(i.Status) LIKE '%PARTIAL%' THEN 'PARTIAL'
            WHEN UPPER(i.Status) LIKE '%PAID%' THEN 'PAID'
            ELSE 'OTHER' END AS Norm
FROM oil_n_gas_company.Invoice i;

-- 5. Address country group
SELECT a.AddressID, a.Country,
       CASE a.Country WHEN 'USA' THEN 'NORTH AMERICA' ELSE 'INTL' END AS CtryGrp
FROM oil_n_gas_company.Address a;

-- 6. Field activity based on any producing wells
SELECT f.FieldID, f.Name,
       CASE WHEN EXISTS (SELECT 1 FROM oil_n_gas_company.Well w WHERE w.FieldID=f.FieldID AND w.Status='Producing')
            THEN 'Has Producing Wells' ELSE 'No Producing Wells' END AS Activity
FROM oil_n_gas_company.Field f;

-- 7. Customer name class by prefix
SELECT c.CustomerID, c.Name,
       CASE WHEN LEFT(c.Name,8)='Customer' THEN 'Std' ELSE 'Custom' END AS NameClass
FROM oil_n_gas_company.Customer c;

-- 8. Rig presence
SELECT d.OperationID,
       CASE WHEN d.RigName IS NULL OR LTRIM(RTRIM(d.RigName))='' THEN 'No Rig' ELSE 'Has Rig' END AS RigFlag
FROM oil_n_gas_company.DrillingOperation d;

-- 9. Product light/heavy by API (text label)
SELECT p.ProductID, p.Name,
       CASE WHEN p.APIGravity IS NULL THEN 'NA'
            WHEN p.APIGravity >= 35 THEN 'Light'
            WHEN p.APIGravity >= 25 THEN 'Medium'
            ELSE 'Heavy' END AS APIClass
FROM oil_n_gas_company.Product p;

-- 10. Pipeline capacity band as text
SELECT pl.PipelineID, pl.Name,
       CASE WHEN pl.CapacityBbl >= 200000 THEN 'High'
            WHEN pl.CapacityBbl >= 100000 THEN 'Medium'
            ELSE 'Low' END AS CapBand
FROM oil_n_gas_company.Pipeline pl;
```

## ISNULL Function (ISNULL)
```sql
-- 1. RigName default
SELECT d.OperationID, ISNULL(d.RigName,'(Rig not set)') AS RigNameSafe
FROM oil_n_gas_company.DrillingOperation d;

-- 2. Facility location default
SELECT f.FacilityID, f.Name, ISNULL(f.Location,'(Unknown Loc)') AS LocationSafe
FROM oil_n_gas_company.Facility f;

-- 3. Product API to string default
SELECT p.ProductID, p.Name, ISNULL(CONVERT(varchar(10),p.APIGravity),'NA') AS API_Txt
FROM oil_n_gas_company.Product p;

-- 4. Product Sulfur% to string default
SELECT p.ProductID, p.Name, ISNULL(CONVERT(varchar(10),p.SulfurPct),'NA') AS S_Txt
FROM oil_n_gas_company.Product p;

-- 5. WellType default text
SELECT w.WellID, w.Name, ISNULL(w.WellType,'(Unknown)') AS WellTypeSafe
FROM oil_n_gas_company.Well w;

-- 6. Address State default (should exist; demo)
SELECT a.AddressID, ISNULL(a.State,'N/A') AS StateSafe
FROM oil_n_gas_company.Address a;

-- 7. Invoice status default
SELECT i.InvoiceID, i.InvoiceDate, ISNULL(i.Status,'Open') AS StatusSafe
FROM oil_n_gas_company.Invoice i;

-- 8. AssetMaintenance description default
SELECT am.MaintenanceID, ISNULL(am.Description,'(No desc)') AS DescSafe
FROM oil_n_gas_company.AssetMaintenance am;

-- 9. Pipeline name default (demo)
SELECT pl.PipelineID, ISNULL(pl.Name,'(Unnamed)') AS PipeSafe
FROM oil_n_gas_company.Pipeline pl;

-- 10. SalesContract end date text
SELECT sc.ContractID, ISNULL(CONVERT(varchar(10), sc.EndDate, 23), 'Open-Ended') AS EndTxt
FROM oil_n_gas_company.SalesContract sc;
```

## Coalesce Function (COALESCE)
```sql
-- 1. RigName with fallback to 'Rig-<OperationID>'
SELECT d.OperationID, COALESCE(NULLIF(LTRIM(RTRIM(d.RigName)),''), 'Rig-' + CONVERT(varchar(10), d.OperationID)) AS RigFinal
FROM oil_n_gas_company.DrillingOperation d;

-- 2. Facility display: Name @ Location (fallbacks)
SELECT f.FacilityID, f.Name + ' @ ' + COALESCE(NULLIF(f.Location,''),'(Unknown)') AS FacDisp
FROM oil_n_gas_company.Facility f;

-- 3. Customer display prefers name, else 'Customer-<ID>'
SELECT c.CustomerID, COALESCE(NULLIF(c.Name,''), 'Customer-' + CONVERT(varchar(10), c.CustomerID)) AS CustDisp
FROM oil_n_gas_company.Customer c;

-- 4. Product API string with NA fallback
SELECT p.ProductID, p.Name, COALESCE(CONVERT(varchar(10), p.APIGravity),'NA') AS API_Text
FROM oil_n_gas_company.Product p;

-- 5. Invoice status normalized
SELECT i.InvoiceID, COALESCE(NULLIF(i.Status,''),'Open') AS StatusNorm
FROM oil_n_gas_company.Invoice i;

-- 6. WellType/Status combined (prefer WellType)
SELECT w.WellID, COALESCE(w.WellType, w.Status, '(Unknown)') AS TypeOrStatus
FROM oil_n_gas_company.Well w;

-- 7. Address city fallback to state, then country
SELECT a.AddressID, COALESCE(NULLIF(a.City,''), NULLIF(a.State,''), a.Country) AS Place
FROM oil_n_gas_company.Address a;

-- 8. Pipeline route names (prefer facility names; safe)
SELECT pl.PipelineID,
       COALESCE(f1.Name, 'Fac#'+CONVERT(varchar(10), pl.FromFacility)) AS FromName,
       COALESCE(f2.Name, 'Fac#'+CONVERT(varchar(10), pl.ToFacility))   AS ToName
FROM oil_n_gas_company.Pipeline pl
LEFT JOIN oil_n_gas_company.Facility f1 ON f1.FacilityID = pl.FromFacility
LEFT JOIN oil_n_gas_company.Facility f2 ON f2.FacilityID = pl.ToFacility;

-- 9. Field label fallback to Region name
SELECT f.FieldID, COALESCE(NULLIF(f.Name,''), r.Name) AS Label
FROM oil_n_gas_company.Field f
JOIN oil_n_gas_company.Region r ON r.RegionID = f.RegionID;

-- 10. Payment amount text with fallback
SELECT p.PaymentID, COALESCE(CONVERT(varchar(20), p.AmountPaid), '(No Amount)') AS AmtText
FROM oil_n_gas_company.Payment p;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
