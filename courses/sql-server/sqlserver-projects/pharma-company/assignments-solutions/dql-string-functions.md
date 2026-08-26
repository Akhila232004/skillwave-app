![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Get length of each product name
SELECT ProductID, Name, LEN(Name) AS NameLength
FROM pharma_company.Product;

-- 2. Supplier name length
SELECT SupplierID, Name, LEN(Name) AS SupplierNameLength
FROM pharma_company.Supplier;

-- 3. Customer name length
SELECT CustomerID, Name, LEN(Name) AS CustomerNameLength
FROM pharma_company.Customer;

-- 4. Distribution center name length
SELECT CenterID, Name, LEN(Name) AS DCNameLength
FROM pharma_company.DistributionCenter;

-- 5. Raw material CASNumber length
SELECT RawMaterialID, Name, CASNumber, LEN(CASNumber) AS CASLen
FROM pharma_company.RawMaterial;

-- 6. Regulatory submission document link length
SELECT SubmissionID, DocumentLink, LEN(DocumentLink) AS DocLinkLength
FROM pharma_company.RegulatorySubmission;

-- 7. Equipment name length
SELECT EquipmentID, Name, LEN(Name) AS EquipNameLength
FROM pharma_company.Equipment;

-- 8. City name length from Address
SELECT AddressID, City, LEN(City) AS CityLength
FROM pharma_company.Address;

-- 9. QC result value string length
SELECT ResultID, ResultValue, LEN(ResultValue) AS ValueLength
FROM pharma_company.QCResult;

-- 10. Strength field length
SELECT ProductID, Strength, LEN(Strength) AS StrengthLen
FROM pharma_company.Product;
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 5 characters of product name
SELECT ProductID, SUBSTRING(Name,1,5) AS ShortName
FROM pharma_company.Product;

-- 2. Last 3 digits of CustomerID as string
SELECT CustomerID, SUBSTRING(CAST(CustomerID AS varchar), LEN(CAST(CustomerID AS varchar))-2, 3) AS Last3Digits
FROM pharma_company.Customer;

-- 3. Extract city prefix (first 4 letters)
SELECT AddressID, City, SUBSTRING(City,1,4) AS CityPrefix
FROM pharma_company.Address;

-- 4. Supplier phone area code (first 4 chars)
SELECT SupplierID, Phone, SUBSTRING(Phone,1,4) AS AreaCode
FROM pharma_company.Supplier;

-- 5. First 7 characters of DocumentLink
SELECT SubmissionID, DocumentLink, SUBSTRING(DocumentLink,1,7) AS DocPrefix
FROM pharma_company.RegulatorySubmission;

-- 6. Extract 'DC' prefix from distribution center names
SELECT CenterID, Name, SUBSTRING(Name,1,2) AS Prefix
FROM pharma_company.DistributionCenter;

-- 7. Extract batch year from BatchDate (yyyy-mm-dd format)
SELECT BatchID, BatchDate, SUBSTRING(CONVERT(varchar(10),BatchDate,120),1,4) AS BatchYear
FROM pharma_company.ManufacturingBatch;

-- 8. Extract month from OrderDate
SELECT SalesOrderID, OrderDate, SUBSTRING(CONVERT(varchar(10),OrderDate,120),6,2) AS OrderMonth
FROM pharma_company.SalesOrder;

-- 9. Take first 2 letters of equipment type
SELECT EquipmentID, [Type], SUBSTRING([Type],1,2) AS TypePrefix
FROM pharma_company.Equipment;

-- 10. First 3 characters of Strength
SELECT ProductID, Strength, SUBSTRING(Strength,1,3) AS StrengthPrefix
FROM pharma_company.Product;
```

## Concatenation Operator (+)
```sql
-- 1. Full customer address line
SELECT c.CustomerID, c.Name + ' - ' + a.City + ', ' + a.State AS FullAddress
FROM pharma_company.Customer c
JOIN pharma_company.Address a ON a.AddressID = c.AddressID;

-- 2. Supplier contact info string
SELECT s.Name + ' | ' + ISNULL(s.ContactName,'N/A') + ' | ' + ISNULL(s.Email,'N/A') AS SupplierInfo
FROM pharma_company.Supplier s;

-- 3. Product name with strength
SELECT Name + ' (' + ISNULL(Strength,'N/A') + ')' AS ProductDisplay
FROM pharma_company.Product;

-- 4. Distribution center with country
SELECT dc.Name + ' - ' + a.Country AS DCLocation
FROM pharma_company.DistributionCenter dc
JOIN pharma_company.Address a ON a.AddressID = dc.AddressID;

-- 5. Order label
SELECT CAST(SalesOrderID AS varchar) + ': ' + CAST(TotalUnits AS varchar) + ' units' AS OrderLabel
FROM pharma_company.SalesOrder;

-- 6. Shipment label
SELECT CAST(ShipmentID AS varchar) + ' - ' + CAST(QuantityUnits AS varchar) + ' units' AS ShipmentLabel
FROM pharma_company.Shipment;

-- 7. Regulatory submission title
SELECT Agency + ' - ' + Status + ' on ' + CONVERT(varchar(10),SubmissionDate,120) AS SubmissionTitle
FROM pharma_company.RegulatorySubmission;

-- 8. Batch display
SELECT CAST(BatchID AS varchar) + ' | ' + CAST(QuantityUnits AS varchar) + ' units | ' + Status AS BatchDisplay
FROM pharma_company.ManufacturingBatch;

-- 9. QC result summary
SELECT CAST(ResultID AS varchar) + ' - ' + PassFail + ' (' + ISNULL(ResultValue,'N/A') + ')' AS ResultSummary
FROM pharma_company.QCResult;

-- 10. Equipment label
SELECT Name + ' - ' + [Type] AS EquipLabel
FROM pharma_company.Equipment;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase customer names
SELECT CustomerID, LOWER(Name) AS LowerName
FROM pharma_company.Customer;

-- 2. Lowercase supplier emails
SELECT SupplierID, LOWER(Email) AS LowerEmail
FROM pharma_company.Supplier;

-- 3. Lowercase product names
SELECT ProductID, LOWER(Name) AS LowerName
FROM pharma_company.Product;

-- 4. Lowercase address city
SELECT AddressID, LOWER(City) AS LowerCity
FROM pharma_company.Address;

-- 5. Lowercase regulatory agencies
SELECT SubmissionID, LOWER(Agency) AS LowerAgency
FROM pharma_company.RegulatorySubmission;

-- 6. Lowercase equipment type
SELECT EquipmentID, LOWER([Type]) AS LowerType
FROM pharma_company.Equipment;

-- 7. Lowercase distribution center names
SELECT CenterID, LOWER(Name) AS LowerDC
FROM pharma_company.DistributionCenter;

-- 8. Lowercase QC result value
SELECT ResultID, LOWER(ResultValue) AS LowerValue
FROM pharma_company.QCResult;

-- 9. Lowercase phone numbers
SELECT SupplierID, LOWER(Phone) AS LowerPhone
FROM pharma_company.Supplier;

-- 10. Lowercase document link
SELECT SubmissionID, LOWER(DocumentLink) AS LowerDoc
FROM pharma_company.RegulatorySubmission;
```

## Upper Function (UPPER)
```sql
-- 1. Uppercase customer names
SELECT CustomerID, UPPER(Name) AS UpperName
FROM pharma_company.Customer;

-- 2. Uppercase supplier emails
SELECT SupplierID, UPPER(Email) AS UpperEmail
FROM pharma_company.Supplier;

-- 3. Uppercase product names
SELECT ProductID, UPPER(Name) AS UpperName
FROM pharma_company.Product;

-- 4. Uppercase address city
SELECT AddressID, UPPER(City) AS UpperCity
FROM pharma_company.Address;

-- 5. Uppercase regulatory agencies
SELECT SubmissionID, UPPER(Agency) AS UpperAgency
FROM pharma_company.RegulatorySubmission;

-- 6. Uppercase equipment type
SELECT EquipmentID, UPPER([Type]) AS UpperType
FROM pharma_company.Equipment;

-- 7. Uppercase distribution center names
SELECT CenterID, UPPER(Name) AS UpperDC
FROM pharma_company.DistributionCenter;

-- 8. Uppercase QC result value
SELECT ResultID, UPPER(ResultValue) AS UpperValue
FROM pharma_company.QCResult;

-- 9. Uppercase phone numbers
SELECT SupplierID, UPPER(Phone) AS UpperPhone
FROM pharma_company.Supplier;

-- 10. Uppercase document link
SELECT SubmissionID, UPPER(DocumentLink) AS UpperDoc
FROM pharma_company.RegulatorySubmission;
```

## Trim Function (TRIM)
```sql
-- 1. Trim spaces from supplier name
SELECT SupplierID, TRIM(Name) AS CleanName
FROM pharma_company.Supplier;

-- 2. LTRIM on product name
SELECT ProductID, LTRIM(Name) AS CleanLeft
FROM pharma_company.Product;

-- 3. RTRIM on customer name
SELECT CustomerID, RTRIM(Name) AS CleanRight
FROM pharma_company.Customer;

-- 4. Trim city field
SELECT AddressID, TRIM(City) AS CleanCity
FROM pharma_company.Address;

-- 5. Trim QC result value
SELECT ResultID, TRIM(ResultValue) AS CleanValue
FROM pharma_company.QCResult;

-- 6. Trim phone numbers
SELECT SupplierID, TRIM(Phone) AS CleanPhone
FROM pharma_company.Supplier;

-- 7. Trim document links
SELECT SubmissionID, TRIM(DocumentLink) AS CleanDoc
FROM pharma_company.RegulatorySubmission;

-- 8. LTRIM shipment IDs (string cast)
SELECT ShipmentID, LTRIM(CAST(ShipmentID AS varchar)) AS LeftTrimID
FROM pharma_company.Shipment;

-- 9. RTRIM order IDs
SELECT SalesOrderID, RTRIM(CAST(SalesOrderID AS varchar)) AS RightTrimID
FROM pharma_company.SalesOrder;

-- 10. Trim equipment type
SELECT EquipmentID, TRIM([Type]) AS CleanType
FROM pharma_company.Equipment;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Remove leading spaces from supplier names
SELECT SupplierID, LTRIM(Name) AS CleanName
FROM pharma_company.Supplier;

-- 2. LTRIM product names
SELECT ProductID, LTRIM(Name) AS CleanProduct
FROM pharma_company.Product;

-- 3. LTRIM customer names
SELECT CustomerID, LTRIM(Name) AS CleanCustomer
FROM pharma_company.Customer;

-- 4. LTRIM distribution center names
SELECT CenterID, LTRIM(Name) AS CleanDC
FROM pharma_company.DistributionCenter;

-- 5. LTRIM city names
SELECT AddressID, LTRIM(City) AS CleanCity
FROM pharma_company.Address;

-- 6. LTRIM regulatory agency names
SELECT SubmissionID, LTRIM(Agency) AS CleanAgency
FROM pharma_company.RegulatorySubmission;

-- 7. LTRIM equipment names
SELECT EquipmentID, LTRIM(Name) AS CleanEquip
FROM pharma_company.Equipment;

-- 8. LTRIM QC result values
SELECT ResultID, LTRIM(ResultValue) AS CleanValue
FROM pharma_company.QCResult;

-- 9. LTRIM phone numbers
SELECT SupplierID, LTRIM(Phone) AS CleanPhone
FROM pharma_company.Supplier;

-- 10. LTRIM document links
SELECT SubmissionID, LTRIM(DocumentLink) AS CleanDoc
FROM pharma_company.RegulatorySubmission;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Remove trailing spaces from supplier names
SELECT SupplierID, RTRIM(Name) AS CleanName
FROM pharma_company.Supplier;

-- 2. RTRIM product names
SELECT ProductID, RTRIM(Name) AS CleanProduct
FROM pharma_company.Product;

-- 3. RTRIM customer names
SELECT CustomerID, RTRIM(Name) AS CleanCustomer
FROM pharma_company.Customer;

-- 4. RTRIM distribution center names
SELECT CenterID, RTRIM(Name) AS CleanDC
FROM pharma_company.DistributionCenter;

-- 5. RTRIM city names
SELECT AddressID, RTRIM(City) AS CleanCity
FROM pharma_company.Address;

-- 6. RTRIM regulatory agency names
SELECT SubmissionID, RTRIM(Agency) AS CleanAgency
FROM pharma_company.RegulatorySubmission;

-- 7. RTRIM equipment names
SELECT EquipmentID, RTRIM(Name) AS CleanEquip
FROM pharma_company.Equipment;

-- 8. RTRIM QC result values
SELECT ResultID, RTRIM(ResultValue) AS CleanValue
FROM pharma_company.QCResult;

-- 9. RTRIM phone numbers
SELECT SupplierID, RTRIM(Phone) AS CleanPhone
FROM pharma_company.Supplier;

-- 10. RTRIM document links
SELECT SubmissionID, RTRIM(DocumentLink) AS CleanDoc
FROM pharma_company.RegulatorySubmission;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Find position of '-' in product name
SELECT ProductID, Name, CHARINDEX('-', Name) AS HyphenPos
FROM pharma_company.Product;

-- 2. Find '@' in supplier email
SELECT SupplierID, Email, CHARINDEX('@', Email) AS AtPos
FROM pharma_company.Supplier;

-- 3. Find 'DC' in distribution center name
SELECT CenterID, Name, CHARINDEX('DC', Name) AS DCPos
FROM pharma_company.DistributionCenter;

-- 4. Find 'mg' in strength
SELECT ProductID, Strength, CHARINDEX('mg', Strength) AS MgPos
FROM pharma_company.Product;

-- 5. Find 'Plant' in equipment location
SELECT EquipmentID, Location, CHARINDEX('Plant', Location) AS PlantPos
FROM pharma_company.Equipment;

-- 6. Find 'pdf' in doc link
SELECT SubmissionID, DocumentLink, CHARINDEX('.pdf', DocumentLink) AS PdfPos
FROM pharma_company.RegulatorySubmission;

-- 7. Find 'City' in city name
SELECT AddressID, City, CHARINDEX('City', City) AS CityPos
FROM pharma_company.Address;

-- 8. Find 'Pass' in QC result value
SELECT ResultID, ResultValue, CHARINDEX('Pass', ResultValue) AS PassPos
FROM pharma_company.QCResult;

-- 9. Find '-' in phone number
SELECT SupplierID, Phone, CHARINDEX('-', Phone) AS DashPos
FROM pharma_company.Supplier;

-- 10. Find 'Customer' in customer name
SELECT CustomerID, Name, CHARINDEX('Customer', Name) AS CustPos
FROM pharma_company.Customer;
```

## Left Function (LEFT)
```sql
-- 1. First 5 characters of product name
SELECT ProductID, LEFT(Name,5) AS ProdPrefix
FROM pharma_company.Product;

-- 2. First 3 characters of supplier name
SELECT SupplierID, LEFT(Name,3) AS SupPrefix
FROM pharma_company.Supplier;

-- 3. First 7 characters of customer name
SELECT CustomerID, LEFT(Name,7) AS CustPrefix
FROM pharma_company.Customer;

-- 4. First 4 characters of city
SELECT AddressID, LEFT(City,4) AS CityPrefix
FROM pharma_company.Address;

-- 5. First 2 characters of distribution center name
SELECT CenterID, LEFT(Name,2) AS DCPrefix
FROM pharma_company.DistributionCenter;

-- 6. First 6 characters of regulatory agency name
SELECT SubmissionID, LEFT(Agency,6) AS AgencyPrefix
FROM pharma_company.RegulatorySubmission;

-- 7. First 3 characters of equipment type
SELECT EquipmentID, LEFT([Type],3) AS TypePrefix
FROM pharma_company.Equipment;

-- 8. First 8 characters of document link
SELECT SubmissionID, LEFT(DocumentLink,8) AS DocStart
FROM pharma_company.RegulatorySubmission;

-- 9. First 2 characters of QC result value
SELECT ResultID, LEFT(ResultValue,2) AS ValuePrefix
FROM pharma_company.QCResult;

-- 10. First 4 characters of product strength
SELECT ProductID, LEFT(Strength,4) AS StrengthPrefix
FROM pharma_company.Product;
```

## Right Function (RIGHT)
```sql
-- 1. Last 5 characters of product name
SELECT ProductID, RIGHT(Name,5) AS ProdSuffix
FROM pharma_company.Product;

-- 2. Last 3 characters of supplier name
SELECT SupplierID, RIGHT(Name,3) AS SupSuffix
FROM pharma_company.Supplier;

-- 3. Last 7 characters of customer name
SELECT CustomerID, RIGHT(Name,7) AS CustSuffix
FROM pharma_company.Customer;

-- 4. Last 4 characters of city
SELECT AddressID, RIGHT(City,4) AS CitySuffix
FROM pharma_company.Address;

-- 5. Last 2 characters of distribution center name
SELECT CenterID, RIGHT(Name,2) AS DCSuffix
FROM pharma_company.DistributionCenter;

-- 6. Last 6 characters of regulatory agency name
SELECT SubmissionID, RIGHT(Agency,6) AS AgencySuffix
FROM pharma_company.RegulatorySubmission;

-- 7. Last 3 characters of equipment type
SELECT EquipmentID, RIGHT([Type],3) AS TypeSuffix
FROM pharma_company.Equipment;

-- 8. Last 8 characters of document link
SELECT SubmissionID, RIGHT(DocumentLink,8) AS DocEnd
FROM pharma_company.RegulatorySubmission;

-- 9. Last 2 characters of QC result value
SELECT ResultID, RIGHT(ResultValue,2) AS ValueSuffix
FROM pharma_company.QCResult;

-- 10. Last 4 characters of product strength
SELECT ProductID, RIGHT(Strength,4) AS StrengthSuffix
FROM pharma_company.Product;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse product name
SELECT ProductID, REVERSE(Name) AS RevName
FROM pharma_company.Product;

-- 2. Reverse supplier email
SELECT SupplierID, REVERSE(Email) AS RevEmail
FROM pharma_company.Supplier;

-- 3. Reverse customer name
SELECT CustomerID, REVERSE(Name) AS RevName
FROM pharma_company.Customer;

-- 4. Reverse city
SELECT AddressID, REVERSE(City) AS RevCity
FROM pharma_company.Address;

-- 5. Reverse phone
SELECT SupplierID, REVERSE(Phone) AS RevPhone
FROM pharma_company.Supplier;

-- 6. Reverse regulatory doc link
SELECT SubmissionID, REVERSE(DocumentLink) AS RevDoc
FROM pharma_company.RegulatorySubmission;

-- 7. Reverse QC result value
SELECT ResultID, REVERSE(ResultValue) AS RevValue
FROM pharma_company.QCResult;

-- 8. Reverse equipment name
SELECT EquipmentID, REVERSE(Name) AS RevName
FROM pharma_company.Equipment;

-- 9. Reverse DC name
SELECT CenterID, REVERSE(Name) AS RevDC
FROM pharma_company.DistributionCenter;

-- 10. Reverse order ID
SELECT SalesOrderID, REVERSE(CAST(SalesOrderID AS varchar)) AS RevOrderID
FROM pharma_company.SalesOrder;
```

## Replace Function (REPLACE)
```sql
-- 1. Replace 'Product' with 'Drug' in product names
SELECT ProductID, REPLACE(Name,'Product','Drug') AS NewName
FROM pharma_company.Product;

-- 2. Replace 'Customer' with 'Client'
SELECT CustomerID, REPLACE(Name,'Customer','Client') AS NewName
FROM pharma_company.Customer;

-- 3. Replace '-' with '/' in phone
SELECT SupplierID, Phone, REPLACE(Phone,'-','/') AS NewPhone
FROM pharma_company.Supplier;

-- 4. Replace 'City' with 'Town'
SELECT AddressID, City, REPLACE(City,'City','Town') AS NewCity
FROM pharma_company.Address;

-- 5. Replace '.pdf' with '.docx'
SELECT SubmissionID, DocumentLink, REPLACE(DocumentLink,'.pdf','.docx') AS DocDocx
FROM pharma_company.RegulatorySubmission;

-- 6. Replace 'DC' with 'DistributionCenter'
SELECT CenterID, Name, REPLACE(Name,'DC','DistributionCenter') AS NewName
FROM pharma_company.DistributionCenter;

-- 7. Replace 'Pass' with 'OK' in QC result
SELECT ResultID, ResultValue, REPLACE(ResultValue,'Pass','OK') AS NewValue
FROM pharma_company.QCResult;

-- 8. Replace 'mg' with 'milligrams'
SELECT ProductID, Strength, REPLACE(Strength,'mg','milligrams') AS FullStrength
FROM pharma_company.Product;

-- 9. Replace 'Supplier' with 'Vendor'
SELECT SupplierID, Name, REPLACE(Name,'Supplier','Vendor') AS NewName
FROM pharma_company.Supplier;

-- 10. Replace space with '_' in equipment names
SELECT EquipmentID, Name, REPLACE(Name,' ','_') AS NewName
FROM pharma_company.Equipment;
```

## Case Statement (CASE)
```sql
-- 1. Categorize orders by status
SELECT SalesOrderID, Status,
       CASE Status WHEN 'Open' THEN 'Pending' WHEN 'Shipped' THEN 'Completed' ELSE 'Other' END AS StatusCategory
FROM pharma_company.SalesOrder;

-- 2. Categorize QC result pass/fail
SELECT ResultID, PassFail,
       CASE PassFail WHEN 'P' THEN 'Pass' WHEN 'F' THEN 'Fail' ELSE 'Unknown' END AS ResultStatus
FROM pharma_company.QCResult;

-- 3. Categorize product strength
SELECT ProductID, Strength,
       CASE Strength WHEN '250 mg' THEN 'Low Dose' WHEN '500 mg' THEN 'Medium Dose' ELSE 'Other' END AS DoseCategory
FROM pharma_company.Product;

-- 4. Categorize shipment size
SELECT ShipmentID, QuantityUnits,
       CASE WHEN QuantityUnits < 200 THEN 'Small'
            WHEN QuantityUnits BETWEEN 200 AND 600 THEN 'Medium'
            ELSE 'Large' END AS ShipmentCategory
FROM pharma_company.Shipment;

-- 5. Categorize inventory quantity
SELECT InventoryID, QuantityUnits,
       CASE WHEN QuantityUnits < 2000 THEN 'Low'
            WHEN QuantityUnits < 5000 THEN 'Medium'
            ELSE 'High' END AS StockLevel
FROM pharma_company.Inventory;

-- 6. Categorize suppliers by phone prefix
SELECT SupplierID, Phone,
       CASE WHEN Phone LIKE '+1%' THEN 'US/Canada' ELSE 'International' END AS Region
FROM pharma_company.Supplier;

-- 7. Categorize customers by ID ranges
SELECT CustomerID,
       CASE WHEN CustomerID <= 500 THEN 'Small'
            WHEN CustomerID <= 1500 THEN 'Medium'
            ELSE 'Large' END AS Segment
FROM pharma_company.Customer;

-- 8. Categorize batches by status
SELECT BatchID, Status,
       CASE WHEN Status='Released' THEN 'Good' ELSE 'Check' END AS BatchCategory
FROM pharma_company.ManufacturingBatch;

-- 9. Categorize regulatory submissions by agency
SELECT SubmissionID, Agency,
       CASE Agency WHEN 'FDA' THEN 'US' WHEN 'EMA' THEN 'EU' ELSE 'Other' END AS Region
FROM pharma_company.RegulatorySubmission;

-- 10. Categorize equipment type
SELECT EquipmentID, [Type],
       CASE [Type] WHEN 'Reactor' THEN 'Core' WHEN 'Dryer' THEN 'Support' ELSE 'Other' END AS EquipCategory
FROM pharma_company.Equipment;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Supplier phone default 'N/A'
SELECT SupplierID, ISNULL(Phone,'N/A') AS Phone
FROM pharma_company.Supplier;

-- 2. Supplier email default 'unknown'
SELECT SupplierID, ISNULL(Email,'unknown') AS Email
FROM pharma_company.Supplier;

-- 3. Customer address default 'No Address'
SELECT CustomerID, ISNULL(CAST(AddressID AS varchar),'No Address') AS AddressRef
FROM pharma_company.Customer;

-- 4. Product strength default 'Unknown'
SELECT ProductID, ISNULL(Strength,'Unknown') AS Strength
FROM pharma_company.Product;

-- 5. Batch status default 'Pending'
SELECT BatchID, ISNULL(Status,'Pending') AS Status
FROM pharma_company.ManufacturingBatch;

-- 6. QC result default 'Not Done'
SELECT ResultID, ISNULL(ResultValue,'Not Done') AS ResultVal
FROM pharma_company.QCResult;

-- 7. Shipment carrier default 'None'
SELECT ShipmentID, ISNULL(Carrier,'None') AS Carrier
FROM pharma_company.Shipment;

-- 8. Equipment location default 'Unknown'
SELECT EquipmentID, ISNULL(Location,'Unknown') AS Location
FROM pharma_company.Equipment;

-- 9. Regulatory doc link default 'Not Available'
SELECT SubmissionID, ISNULL(DocumentLink,'Not Available') AS DocLink
FROM pharma_company.RegulatorySubmission;

-- 10. Inventory expiration date default '1900-01-01'
SELECT InventoryID, ISNULL(ExpirationDate,'1900-01-01') AS ExpDate
FROM pharma_company.Inventory;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Supplier email fallback: Email → ContactName → 'Unknown'
SELECT SupplierID, COALESCE(Email,ContactName,'Unknown') AS ContactRef
FROM pharma_company.Supplier;

-- 2. Customer address fallback: AddressID → Name → 'N/A'
SELECT CustomerID, COALESCE(CAST(AddressID AS varchar),Name,'N/A') AS AddressRef
FROM pharma_company.Customer;

-- 3. Product strength fallback
SELECT ProductID, COALESCE(Strength,'Standard') AS FinalStrength
FROM pharma_company.Product;

-- 4. Batch status fallback
SELECT BatchID, COALESCE(Status,'Draft') AS FinalStatus
FROM pharma_company.ManufacturingBatch;

-- 5. QC result fallback
SELECT ResultID, COALESCE(ResultValue,PassFail,'NoResult') AS QCStatus
FROM pharma_company.QCResult;

-- 6. Regulatory doc fallback
SELECT SubmissionID, COALESCE(DocumentLink,Status,'None') AS RefLink
FROM pharma_company.RegulatorySubmission;

-- 7. Equipment location fallback
SELECT EquipmentID, COALESCE(Location,Name,'Unknown') AS LocationRef
FROM pharma_company.Equipment;

-- 8. Shipment carrier fallback
SELECT ShipmentID, COALESCE(Carrier,Status,'Pending') AS CarrierRef
FROM pharma_company.Shipment;

-- 9. Inventory expiry fallback
SELECT InventoryID, COALESCE(CONVERT(varchar(10),ExpirationDate,120),CAST(QuantityUnits AS varchar),'None') AS ExpiryRef
FROM pharma_company.Inventory;

-- 10. Customer fallback to name
SELECT CustomerID, COALESCE(Name,'Anonymous') AS FinalName
FROM pharma_company.Customer;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
