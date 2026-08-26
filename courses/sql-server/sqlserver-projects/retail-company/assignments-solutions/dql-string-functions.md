![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments Solutions

## Length Function (LEN)
```sql
-- 1. Length of each product name
SELECT ProductID, Name, LEN(Name) AS NameLen
FROM retail_company.Product;

-- 2. Customer full name length
SELECT CustomerID, FirstName + ' ' + LastName AS FullName,
       LEN(FirstName + ' ' + LastName) AS FullNameLen
FROM retail_company.Customer;

-- 3. Supplier email length (non-null emails)
SELECT SupplierID, Email, LEN(Email) AS EmailLen
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 4. Address street length > 15
SELECT AddressID, Street, LEN(Street) AS StreetLen
FROM retail_company.Address
WHERE LEN(Street) > 15;

-- 5. Count products with short names (<= 12 chars)
SELECT COUNT(*) AS ShortNameProducts
FROM retail_company.Product
WHERE LEN(Name) <= 12;

-- 6. Longest city name per country
WITH CityLen AS (
  SELECT Country, City, LEN(City) AS L,
         ROW_NUMBER() OVER (PARTITION BY Country ORDER BY LEN(City) DESC, City) AS rn
  FROM retail_company.Address
)
SELECT Country, City, L AS CityLen
FROM CityLen WHERE rn = 1
ORDER BY Country;

-- 7. Phone length distribution (customers)
SELECT LEN(Phone) AS PhoneLen, COUNT(*) AS Cnt
FROM retail_company.Customer
WHERE Phone IS NOT NULL
GROUP BY LEN(Phone)
ORDER BY PhoneLen;

-- 8. Orders whose Status text length = 6 (e.g., 'Open'≠6, 'Shipped'=7)
SELECT SalesOrderID, Status, LEN(Status) AS StatusLen
FROM retail_company.SalesOrder
WHERE LEN(Status) = 6;

-- 9. Warehouses with short names (< 5 chars)
SELECT WarehouseID, Name
FROM retail_company.Warehouse
WHERE LEN(Name) < 5;

-- 10. Average product name length by category
SELECT p.CategoryID, AVG(CAST(LEN(p.Name) AS decimal(10,2))) AS AvgNameLen
FROM retail_company.Product p
GROUP BY p.CategoryID
ORDER BY AvgNameLen DESC;
```

## Substring Function (SUBSTRING)
```sql
-- 1. First 5 chars of each product name
SELECT ProductID, Name, SUBSTRING(Name,1,5) AS First5
FROM retail_company.Product;

-- 2. Extract area code from customer phone '+1-444-1234' -> '444'
SELECT CustomerID, Phone,
       SUBSTRING(Phone, 4, 3) AS AreaCode
FROM retail_company.Customer
WHERE Phone LIKE '+1-%';

-- 3. Email username part before '@' (customers)
SELECT CustomerID, Email,
       SUBSTRING(Email, 1, CHARINDEX('@', Email + '@') - 1) AS EmailUser
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 4. Email domain part after '@' (suppliers)
SELECT SupplierID, Email,
       SUBSTRING(Email, CHARINDEX('@', Email + '@') + 1, 200) AS EmailDomain
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 5. Extract 'WH' code letters from warehouse name 'WH-001' -> 'WH'
SELECT WarehouseID, Name,
       SUBSTRING(Name, 1, CHARINDEX('-', Name + '-') - 1) AS CodePrefix
FROM retail_company.Warehouse;

-- 6. Get ZIP numeric part after 'Z' (e.g., 'Z12345' -> '12345')
SELECT AddressID, ZIP,
       SUBSTRING(ZIP, 2, LEN(ZIP)-1) AS ZipNum
FROM retail_company.Address
WHERE ZIP LIKE 'Z%';

-- 7. Middle 3 letters of product name starting at pos 3
SELECT ProductID, Name, SUBSTRING(Name, 3, 3) AS Mid3
FROM retail_company.Product
WHERE LEN(Name) >= 5;

-- 8. Order status first char
SELECT SalesOrderID, Status, SUBSTRING(Status,1,1) AS FirstChar
FROM retail_company.SalesOrder;

-- 9. Category short code: first 3 letters of name (pad if shorter)
SELECT CategoryID, Name,
       SUBSTRING(Name + '___', 1, 3) AS CatCode
FROM retail_company.ProductCategory;

-- 10. Take last 4 chars of phone using SUBSTRING + LEN
SELECT CustomerID, Phone,
       SUBSTRING(Phone, NULLIF(LEN(Phone) - 3, 0), 4) AS Last4
FROM retail_company.Customer
WHERE Phone IS NOT NULL;
```

## Concatenation Operator (+)
```sql
-- 1. Full customer name
SELECT CustomerID, FirstName + ' ' + LastName AS FullName
FROM retail_company.Customer;

-- 2. Product label "Name (CategoryID)"
SELECT ProductID, Name + ' (' + CAST(CategoryID AS varchar(10)) + ')' AS ProductLabel
FROM retail_company.Product;

-- 3. Full address line
SELECT AddressID,
       Street + ', ' + City + ', ' + State + ' ' + ZIP + ', ' + Country AS FullAddress
FROM retail_company.Address;

-- 4. Supplier contact string
SELECT s.SupplierID,
       s.Name + ' — ' + ISNULL(s.ContactName,'(no contact)') AS SupplierContact
FROM retail_company.Supplier s;

-- 5. Warehouse descriptor
SELECT WarehouseID, Name + ' @ ' + ISNULL(Location,'(unknown)') AS WarehouseDesc
FROM retail_company.Warehouse;

-- 6. Email mailto link-ish text
SELECT CustomerID,
       'mailto:' + ISNULL(Email,'no-email@example.com') AS MailTo
FROM retail_company.Customer;

-- 7. Product composite key text
SELECT ProductID,
       'P#' + RIGHT('000000'+CAST(ProductID AS varchar(6)),6) AS ProductKeyText
FROM retail_company.Product;

-- 8. Order display "SO-<id> on <date>"
SELECT SalesOrderID,
       'SO-' + CAST(SalesOrderID AS varchar(20)) + ' on ' + CONVERT(varchar(10), OrderDate, 120) AS Display
FROM retail_company.SalesOrder;

-- 9. Category breadcrumb with description
SELECT CategoryID, Name + COALESCE(' — ' + Description,'') AS Crumb
FROM retail_company.ProductCategory;

-- 10. Purchase order label "PO:<id>|Supp:<id>"
SELECT po.PurchaseOrderID,
       'PO:' + CAST(po.PurchaseOrderID AS varchar(20)) + '|Supp:' + CAST(po.SupplierID AS varchar(10)) AS Label
FROM retail_company.PurchaseOrder po;
```

## Lower Function (LOWER)
```sql
-- 1. Lowercase product names
SELECT ProductID, LOWER(Name) AS NameLower
FROM retail_company.Product;

-- 2. Lowercase customer emails
SELECT CustomerID, LOWER(Email) AS EmailLower
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 3. Lowercase city and country
SELECT AddressID, LOWER(City) AS CityLower, LOWER(Country) AS CountryLower
FROM retail_company.Address;

-- 4. Normalized supplier contact name
SELECT SupplierID, LOWER(ContactName) AS ContactLower
FROM retail_company.Supplier
WHERE ContactName IS NOT NULL;

-- 5. Lower status for grouping
SELECT LOWER(Status) AS StatusLower, COUNT(*) AS Cnt
FROM retail_company.SalesOrder
GROUP BY LOWER(Status);

-- 6. Lower product category names
SELECT CategoryID, LOWER(Name) AS CategoryLower
FROM retail_company.ProductCategory;

-- 7. Lower warehouse names and locations
SELECT WarehouseID, LOWER(Name) AS NameLower, LOWER(Location) AS LocationLower
FROM retail_company.Warehouse;

-- 8. Lowercase unique email domains (customers)
SELECT DISTINCT LOWER(SUBSTRING(Email, CHARINDEX('@', Email+'@')+1, 200)) AS Domain
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 9. Lowercase country distinct list
SELECT DISTINCT LOWER(Country) AS CountryLower
FROM retail_company.Address;

-- 10. Lowercase combined "name (status)"
SELECT SalesOrderID,
       LOWER(CONCAT(CONCAT('so-', SalesOrderID), ' (', Status, ')')) AS SoStatusLower
FROM retail_company.SalesOrder;
```

## Upper Function (UPPER)
```sql
-- 1. Uppercase product names
SELECT ProductID, UPPER(Name) AS NameUpper
FROM retail_company.Product;

-- 2. Uppercase customer last names
SELECT CustomerID, UPPER(LastName) AS LastUpper
FROM retail_company.Customer;

-- 3. Uppercase countries and two-letter pseudo-code (first 2)
SELECT AddressID, UPPER(Country) AS CountryUpper, UPPER(LEFT(Country,2)) AS CCode2
FROM retail_company.Address;

-- 4. Uppercase supplier names and emails
SELECT SupplierID, UPPER(Name) AS SupplierUpper, UPPER(Email) AS EmailUpper
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 5. Uppercase statuses distinct
SELECT DISTINCT UPPER(Status) AS StatusUpper
FROM retail_company.SalesOrder;

-- 6. Uppercase category names
SELECT CategoryID, UPPER(Name) AS CatUpper
FROM retail_company.ProductCategory;

-- 7. Uppercase warehouse descriptors
SELECT WarehouseID, UPPER(Name + ' @ ' + ISNULL(Location,'')) AS WHUpper
FROM retail_company.Warehouse;

-- 8. Upper order label
SELECT SalesOrderID,
       UPPER('SO-' + CAST(SalesOrderID AS varchar(20))) AS SoLabelUpper
FROM retail_company.SalesOrder;

-- 9. Uppercase city-country pair
SELECT AddressID, UPPER(City + ', ' + Country) AS CityCountryUpper
FROM retail_company.Address;

-- 10. Upper customer full names
SELECT CustomerID, UPPER(FirstName + ' ' + LastName) AS FullNameUpper
FROM retail_company.Customer;
```

## Trim Function (TRIM)
```sql
-- 1. Trimmed customer names
SELECT CustomerID, TRIM(FirstName) AS FirstNameTrim, TRIM(LastName) AS LastNameTrim
FROM retail_company.Customer;

-- 2. Trim product names and compare length change
SELECT ProductID, Name,
       LEN(Name) AS BeforeLen, LEN(TRIM(Name)) AS AfterLen
FROM retail_company.Product;

-- 3. Trim city/state/ZIP
SELECT AddressID, TRIM(City) AS CityTrim, TRIM(State) AS StateTrim, TRIM(ZIP) AS ZIPTrim
FROM retail_company.Address;

-- 4. Trim supplier contact and email (keep NULLs)
SELECT SupplierID, TRIM(ContactName) AS ContactTrim, TRIM(Email) AS EmailTrim
FROM retail_company.Supplier;

-- 5. Orders with status after TRIM (defensive)
SELECT SalesOrderID, TRIM(Status) AS StatusTrim
FROM retail_company.SalesOrder;

-- 6. Trim warehouse names/location then concat
SELECT WarehouseID, TRIM(Name) + ' @ ' + TRIM(ISNULL(Location,'')) AS WHClean
FROM retail_company.Warehouse;

-- 7. Customers where TRIM(Email) ends with '@example.com'
SELECT CustomerID, Email
FROM retail_company.Customer
WHERE Email IS NOT NULL AND TRIM(Email) LIKE '%@example.com';

-- 8. Trimmed full address single line
SELECT AddressID,
       TRIM(Street) + ', ' + TRIM(City) + ', ' + TRIM(State) + ' ' + TRIM(ZIP) AS FullAddrTrim
FROM retail_company.Address;

-- 9. Detect leading/trailing spaces in category names
SELECT CategoryID, Name
FROM retail_company.ProductCategory
WHERE LEN(Name) <> LEN(TRIM(Name));

-- 10. Normalize phones: TRIM then length
SELECT CustomerID, TRIM(Phone) AS PhoneTrim, LEN(TRIM(Phone)) AS L
FROM retail_company.Customer
WHERE Phone IS NOT NULL;
```

## Ltrim Function (LTRIM)
```sql
-- 1. Remove leading spaces from product names
SELECT ProductID, LTRIM(Name) AS Name_LTrim
FROM retail_company.Product;

-- 2. Leading spaces in customer first names
SELECT CustomerID, FirstName, LEN(FirstName) - LEN(LTRIM(FirstName)) AS LeadingSpaces
FROM retail_company.Customer
WHERE FirstName IS NOT NULL;

-- 3. Left-trim ship-to city
SELECT SalesOrderID, LTRIM(a.City) AS ShipCity_LTrim
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID;

-- 4. LTRIM on state and zip
SELECT AddressID, LTRIM(State) AS State_LTrim, LTRIM(ZIP) AS ZIP_LTrim
FROM retail_company.Address;

-- 5. LTRIM contact name
SELECT SupplierID, LTRIM(ContactName) AS Contact_LTrim
FROM retail_company.Supplier
WHERE ContactName IS NOT NULL;

-- 6. LTRIM email (customers)
SELECT CustomerID, LTRIM(Email) AS Email_LTrim
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 7. Compare before/after on warehouse name
SELECT WarehouseID, '"' + Name + '"' AS Before, '"' + LTRIM(Name) + '"' AS After
FROM retail_company.Warehouse;

-- 8. Detect if leading spaces exist in category names
SELECT CategoryID, Name
FROM retail_company.ProductCategory
WHERE Name <> LTRIM(Name);

-- 9. LTRIM phone and compute length
SELECT CustomerID, Phone, LEN(LTRIM(Phone)) AS LenAfter
FROM retail_company.Customer
WHERE Phone IS NOT NULL;

-- 10. LTRIM combined full name
SELECT CustomerID, LTRIM(FirstName) + ' ' + LTRIM(LastName) AS FullName_LTrim
FROM retail_company.Customer;
```

## Rtrim Function (RTRIM)
```sql
-- 1. Remove trailing spaces from product names
SELECT ProductID, RTRIM(Name) AS Name_RTrim
FROM retail_company.Product;

-- 2. Trailing spaces length for customer last names
SELECT CustomerID, LastName,
       LEN(LastName) - LEN(RTRIM(LastName)) AS TrailingSpaces
FROM retail_company.Customer
WHERE LastName IS NOT NULL;

-- 3. RTRIM ship-to state and ZIP
SELECT SalesOrderID, RTRIM(a.State) AS ShipState_RTrim, RTRIM(a.ZIP) AS ShipZIP_RTrim
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID;

-- 4. RTRIM contact name and email
SELECT SupplierID, RTRIM(ContactName) AS Contact_RTrim, RTRIM(Email) AS Email_RTrim
FROM retail_company.Supplier;

-- 5. RTRIM warehouse location
SELECT WarehouseID, RTRIM(Location) AS Location_RTrim
FROM retail_company.Warehouse;

-- 6. Detect trailing spaces in category names
SELECT CategoryID, Name
FROM retail_company.ProductCategory
WHERE Name <> RTRIM(Name);

-- 7. RTRIM city and compare lengths
SELECT AddressID, City, LEN(City) AS L1, LEN(RTRIM(City)) AS L2
FROM retail_company.Address;

-- 8. RTRIM phone for customers
SELECT CustomerID, RTRIM(Phone) AS Phone_RTrim
FROM retail_company.Customer
WHERE Phone IS NOT NULL;

-- 9. RTRIM concatenated address string
SELECT AddressID, Street + ', ' + RTRIM(City) + ', ' + RTRIM(State) AS Addr_RTrim
FROM retail_company.Address;

-- 10. Order status RTRIM then distinct
SELECT DISTINCT RTRIM(Status) AS Status_RTrim
FROM retail_company.SalesOrder;
```

## Charindex Function (CHARINDEX)
```sql
-- 1. Position of '@' in customer emails
SELECT CustomerID, Email, CHARINDEX('@', Email) AS AtPos
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 2. Does product name contain a dash?
SELECT ProductID, Name, CHARINDEX('-', Name) AS DashPos
FROM retail_company.Product;

-- 3. Find hyphen in warehouse name 'WH-001'
SELECT WarehouseID, Name, CHARINDEX('-', Name) AS HyphenPos
FROM retail_company.Warehouse;

-- 4. First space in supplier ContactName
SELECT SupplierID, ContactName, CHARINDEX(' ', ContactName + ' ') AS FirstSpace
FROM retail_company.Supplier;

-- 5. City contains 'City1'?
SELECT AddressID, City
FROM retail_company.Address
WHERE CHARINDEX('City1', City) > 0;

-- 6. Position of 'Zone' in Location
SELECT WarehouseID, Location, CHARINDEX('Zone', ISNULL(Location,'')) AS ZonePos
FROM retail_company.Warehouse;

-- 7. Orders whose Status contains 'hip'
SELECT SalesOrderID, Status
FROM retail_company.SalesOrder
WHERE CHARINDEX('hip', Status) > 0;

-- 8. Domain extraction using CHARINDEX + SUBSTRING (suppliers)
SELECT SupplierID, Email,
       SUBSTRING(Email, CHARINDEX('@', Email+'@')+1, 200) AS Domain
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 9. Left of dash in product names
SELECT ProductID, Name,
       LEFT(Name, NULLIF(CHARINDEX('-', Name + '-') - 1, -1)) AS LeftOfDash
FROM retail_company.Product;

-- 10. Right of dash in product names
SELECT ProductID, Name,
       SUBSTRING(Name, CHARINDEX('-', Name + '-') + 1, 200) AS RightOfDash
FROM retail_company.Product;
```

## Left Function (LEFT)
```sql
-- 1. First 3 chars of product name
SELECT ProductID, Name, LEFT(Name,3) AS First3
FROM retail_company.Product;

-- 2. Country 2-letter pseudo-code
SELECT AddressID, Country, LEFT(Country,2) AS CC2
FROM retail_company.Address;

-- 3. First letter of order status
SELECT SalesOrderID, Status, LEFT(Status,1) AS StatusInitial
FROM retail_company.SalesOrder;

-- 4. Warehouse code prefix from 'WH-001' -> 'WH'
SELECT WarehouseID, Name, LEFT(Name, CHARINDEX('-', Name + '-') - 1) AS CodePrefix
FROM retail_company.Warehouse;

-- 5. Customer first initial + last name
SELECT CustomerID, LEFT(FirstName,1) + LastName AS Handle
FROM retail_company.Customer;

-- 6. First 5 chars of supplier name
SELECT SupplierID, Name, LEFT(Name,5) AS First5
FROM retail_company.Supplier;

-- 7. Left 4 of ZIP
SELECT AddressID, ZIP, LEFT(ZIP,4) AS ZIP4
FROM retail_company.Address;

-- 8. Left pad product ID to 6 with zeros (via RIGHT, but show LEFT on text)
SELECT ProductID, LEFT('000000' + CAST(ProductID AS varchar(6)), 6) AS LeftPad6
FROM retail_company.Product;

-- 9. Left part of email before '@' (alt)
SELECT CustomerID, Email, LEFT(Email, CHARINDEX('@', Email+'@')-1) AS UserPart
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 10. Left of city name up to first space
SELECT AddressID, City, LEFT(City, NULLIF(CHARINDEX(' ', City + ' ') - 1, -1)) AS FirstWord
FROM retail_company.Address;
```

## Right Function (RIGHT)
```sql
-- 1. Last 3 chars of product name
SELECT ProductID, Name, RIGHT(Name,3) AS Last3
FROM retail_company.Product;

-- 2. Last 4 of phone
SELECT CustomerID, Phone, RIGHT(Phone,4) AS Last4
FROM retail_company.Customer
WHERE Phone IS NOT NULL AND LEN(Phone) >= 4;

-- 3. Warehouse numeric suffix from 'WH-001' -> '001'
SELECT WarehouseID, Name, RIGHT(Name, 3) AS Suffix3
FROM retail_company.Warehouse
WHERE LEN(Name) >= 3;

-- 4. Last 2 chars of country
SELECT AddressID, Country, RIGHT(Country,2) AS CountryTail2
FROM retail_company.Address;

-- 5. Right 3 chars of category name
SELECT CategoryID, Name, RIGHT(Name,3) AS CatEnd3
FROM retail_company.ProductCategory;

-- 6. Right of email after '@' using RIGHT + LEN - CHARINDEX
SELECT SupplierID, Email,
       RIGHT(Email, LEN(Email) - CHARINDEX('@', Email+'@')) AS Domain
FROM retail_company.Supplier
WHERE Email IS NOT NULL;

-- 7. Right 5 of ZIP (pad with zeros if shorter)
SELECT AddressID, RIGHT('00000' + ZIP, 5) AS ZIP5
FROM retail_company.Address;

-- 8. Right 6 of product name
SELECT ProductID, Name, RIGHT(Name,6) AS Tail6
FROM retail_company.Product;

-- 9. Last word of status (handles one-word too)
SELECT SalesOrderID, Status,
       RIGHT(Status, LEN(Status) - CHARINDEX(' ', REVERSE(REPLACE(Status,' ','  ')))) AS LastWordGuess
FROM retail_company.SalesOrder;

-- 10. Right 2 chars of state
SELECT AddressID, State, RIGHT(State,2) AS State2
FROM retail_company.Address;
```

## Reverse Function (REVERSE)
```sql
-- 1. Reverse product names
SELECT ProductID, Name, REVERSE(Name) AS Reversed
FROM retail_company.Product;

-- 2. Reverse ZIP codes
SELECT AddressID, ZIP, REVERSE(ZIP) AS ZIPRev
FROM retail_company.Address;

-- 3. Detect palindromic city names
SELECT AddressID, City
FROM retail_company.Address
WHERE City = REVERSE(City);

-- 4. Reverse emails (fun)
SELECT CustomerID, Email, REVERSE(Email) AS EmailRev
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 5. Reverse status text
SELECT SalesOrderID, Status, REVERSE(Status) AS StatusRev
FROM retail_company.SalesOrder;

-- 6. Reverse supplier contact names
SELECT SupplierID, ContactName, REVERSE(ContactName) AS ContactRev
FROM retail_company.Supplier
WHERE ContactName IS NOT NULL;

-- 7. Reverse warehouse names
SELECT WarehouseID, Name, REVERSE(Name) AS WHRev
FROM retail_company.Warehouse;

-- 8. Reverse product category names
SELECT CategoryID, Name, REVERSE(Name) AS CatRev
FROM retail_company.ProductCategory;

-- 9. Reverse phone
SELECT CustomerID, Phone, REVERSE(Phone) AS PhoneRev
FROM retail_company.Customer
WHERE Phone IS NOT NULL;

-- 10. Orders where reversed status contains 'NEPO' (reverse of 'OPEN')
SELECT SalesOrderID, Status
FROM retail_company.SalesOrder
WHERE REVERSE(Status) LIKE '%NEPO%';
```

## Replace Function (REPLACE)
```sql
-- 1. Remove dashes from phone
SELECT CustomerID, Phone, REPLACE(Phone, '-', '') AS PhoneNoDash
FROM retail_company.Customer
WHERE Phone IS NOT NULL;

-- 2. Replace 'Product-' in name
SELECT ProductID, Name, REPLACE(Name,'Product-','') AS NameNoPrefix
FROM retail_company.Product;

-- 3. Replace spaces in supplier names with underscores
SELECT SupplierID, Name, REPLACE(Name,' ','_') AS NameSlug
FROM retail_company.Supplier;

-- 4. Replace 'Zone-' in warehouse location
SELECT WarehouseID, Location, REPLACE(ISNULL(Location,''),'Zone-','') AS ZoneNum
FROM retail_company.Warehouse;

-- 5. Normalize emails to lowercase then replace domain
SELECT CustomerID, Email,
       REPLACE(LOWER(Email),'@email.com','@example.com') AS NewEmail
FROM retail_company.Customer
WHERE Email IS NOT NULL;

-- 6. Replace city 'City0' with 'CityZero' (view only)
SELECT AddressID, City, REPLACE(City,'City0','CityZero') AS CityFixed
FROM retail_company.Address;

-- 7. Replace double spaces in category descriptions
SELECT CategoryID, Description, REPLACE(Description,'  ',' ') AS DescNoDoubleSpaces
FROM retail_company.ProductCategory
WHERE Description IS NOT NULL;

-- 8. Strip commas from address street
SELECT AddressID, Street, REPLACE(Street,',','') AS StreetNoComma
FROM retail_company.Address;

-- 9. Replace 'Cancelled' status spelling to 'Canceled' (US style)
SELECT SalesOrderID, Status, REPLACE(Status,'Cancelled','Canceled') AS StatusUS
FROM retail_company.SalesOrder;

-- 10. Replace 'Supplier ' prefix in supplier names
SELECT SupplierID, Name, REPLACE(Name,'Supplier ','') AS ShortName
FROM retail_company.Supplier;
```

## Case Statement (CASE)
```sql
-- 1. Order status classification
SELECT SalesOrderID, Status,
       CASE Status WHEN N'Open' THEN 'Pending'
                   WHEN N'Shipped' THEN 'Completed'
                   WHEN N'Cancelled' THEN 'Void'
                   ELSE 'Other' END AS StatusClass
FROM retail_company.SalesOrder;

-- 2. Product price band
SELECT ProductID, Name, UnitPrice,
       CASE WHEN UnitPrice < 50 THEN 'Low'
            WHEN UnitPrice <= 150 THEN 'Mid'
            ELSE 'High' END AS PriceBand
FROM retail_company.Product;

-- 3. Email availability label (customers)
SELECT CustomerID, Email,
       CASE WHEN Email IS NULL OR LEN(LTRIM(RTRIM(Email)))=0 THEN 'No Email' ELSE 'Has Email' END AS EmailFlag
FROM retail_company.Customer;

-- 4. Stock health label
SELECT ProductID, UnitsInStock, ReorderLevel,
       CASE WHEN UnitsInStock < ReorderLevel THEN 'LOW'
            WHEN UnitsInStock = ReorderLevel THEN 'AT-THRESHOLD'
            ELSE 'OK' END AS StockHealth
FROM retail_company.Product;

-- 5. Country region grouping (sample)
SELECT AddressID, Country,
       CASE Country
         WHEN 'USA' THEN 'Americas'
         WHEN 'Canada' THEN 'Americas'
         WHEN 'Brazil' THEN 'Americas'
         WHEN 'UK' THEN 'EMEA'
         WHEN 'Germany' THEN 'EMEA'
         WHEN 'India' THEN 'APAC'
         WHEN 'Australia' THEN 'APAC'
         ELSE 'Other' END AS Region
FROM retail_company.Address;

-- 6. PO status message
SELECT PurchaseOrderID, Status,
       CASE Status
         WHEN N'Open' THEN 'Awaiting placement'
         WHEN N'Placed' THEN 'Supplier confirmed'
         WHEN N'Received' THEN 'Completed'
         ELSE 'Unknown' END AS StatusMsg
FROM retail_company.PurchaseOrder;

-- 7. Customer phone format check
SELECT CustomerID, Phone,
       CASE WHEN Phone LIKE '+1-%' THEN 'US/Canada Format'
            WHEN Phone LIKE '+%-___-____' THEN 'Intl Format'
            ELSE 'Other/Unknown' END AS PhoneFmt
FROM retail_company.Customer
WHERE Phone IS NOT NULL;

-- 8. Warehouse location zone bucket
SELECT WarehouseID, Location,
       CASE
         WHEN Location LIKE 'Zone-A' THEN 'A'
         WHEN Location LIKE 'Zone-B' THEN 'B'
         WHEN Location LIKE 'Zone-C' THEN 'C'
         ELSE 'Other' END AS ZoneBucket
FROM retail_company.Warehouse;

-- 9. Order size label based on TotalAmount
SELECT SalesOrderID, TotalAmount,
       CASE WHEN TotalAmount >= 10000 THEN 'Large'
            WHEN TotalAmount >= 3000 THEN 'Medium'
            ELSE 'Small' END AS OrderSize
FROM retail_company.SalesOrder;

-- 10. Supplier email domain group
SELECT SupplierID, Email,
       CASE
         WHEN Email LIKE '%@example.com' THEN 'Example'
         WHEN Email LIKE '%@gmail.com'   THEN 'Gmail'
         WHEN Email IS NULL              THEN 'None'
         ELSE 'Other'
       END AS DomainGroup
FROM retail_company.Supplier;
```

## ISNULL Function (ISNULL)
```sql
-- 1. Replace NULL emails with placeholder (customers)
SELECT CustomerID, ISNULL(Email, 'no-email@example.com') AS EmailSafe
FROM retail_company.Customer;

-- 2. Replace NULL contact names (suppliers)
SELECT SupplierID, ISNULL(ContactName, '(no contact)') AS ContactSafe
FROM retail_company.Supplier;

-- 3. Replace NULL warehouse locations with 'Unknown'
SELECT WarehouseID, ISNULL(Location, 'Unknown') AS LocationSafe
FROM retail_company.Warehouse;

-- 4. Ship city safe (orders)
SELECT SalesOrderID, ISNULL(a.City,'(no ship city)') AS ShipCity
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Address a ON a.AddressID = so.ShipAddressID;

-- 5. Safe category description
SELECT CategoryID, Name, ISNULL(Description,'(none)') AS DescriptionSafe
FROM retail_company.ProductCategory;

-- 6. Address street safe
SELECT AddressID, ISNULL(Street,'') AS StreetSafe
FROM retail_company.Address;

-- 7. Product name safe
SELECT ProductID, ISNULL(Name,'(unnamed)') AS ProductNameSafe
FROM retail_company.Product;

-- 8. Order status safe
SELECT SalesOrderID, ISNULL(Status,'(unknown)') AS StatusSafe
FROM retail_company.SalesOrder;

-- 9. Supplier email safe lowercased
SELECT SupplierID, LOWER(ISNULL(Email,'no-email@example.com')) AS EmailLowerSafe
FROM retail_company.Supplier;

-- 10. Phone safe then length
SELECT CustomerID, ISNULL(Phone,'') AS PhoneSafe, LEN(ISNULL(Phone,'')) AS SafeLen
FROM retail_company.Customer;
```

## Coalesce Function (COALESCE)
```sql
-- 1. Prefer customer Email then phone as contact
SELECT CustomerID,
       COALESCE(Email, Phone, '(no contact)') AS PreferredContact
FROM retail_company.Customer;

-- 2. Preferred location text: ShipAddress city, else customer city
SELECT so.SalesOrderID,
       COALESCE(a_ship.City, a_cust.City, '(unknown)') AS PreferredCity
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Customer c    ON c.CustomerID = so.CustomerID
LEFT JOIN retail_company.Address a_cust ON a_cust.AddressID = c.AddressID
LEFT JOIN retail_company.Address a_ship ON a_ship.AddressID = so.ShipAddressID;

-- 3. Product display name: Product.Name else '(unnamed)'
SELECT ProductID, COALESCE(Name,'(unnamed)') AS DisplayName
FROM retail_company.Product;

-- 4. Supplier contact: ContactName else Supplier.Name
SELECT s.SupplierID, COALESCE(s.ContactName, s.Name) AS PrimaryContactText
FROM retail_company.Supplier s;

-- 5. Warehouse label: Name @ Location or Name
SELECT WarehouseID, COALESCE(Name + ' @ ' + Location, Name) AS WHLabel
FROM retail_company.Warehouse;

-- 6. Category description or category name
SELECT CategoryID, COALESCE(Description, Name) AS AboutCategory
FROM retail_company.ProductCategory;

-- 7. Customer address line: prefer ShipAddress, fallback Customer address
SELECT so.SalesOrderID,
       COALESCE(a_ship.Street, a_cust.Street, '(no street)') AS StreetLine
FROM retail_company.SalesOrder so
LEFT JOIN retail_company.Customer c     ON c.CustomerID = so.CustomerID
LEFT JOIN retail_company.Address a_cust ON a_cust.AddressID = c.AddressID
LEFT JOIN retail_company.Address a_ship ON a_ship.AddressID = so.ShipAddressID;

-- 8. Email domain (customer->supplier fallback) demo
SELECT COALESCE(
         SUBSTRING(c.Email, CHARINDEX('@', c.Email+'@')+1, 200),
         SUBSTRING(s.Email, CHARINDEX('@', s.Email+'@')+1, 200),
         '(no domain)'
       ) AS DomainPick
FROM retail_company.Customer c
FULL JOIN retail_company.Supplier s ON 1=0  -- just to project rows; real use would JOIN keys
WHERE (c.Email IS NOT NULL OR s.Email IS NOT NULL);

-- 9. Phone or 'N/A' for suppliers
SELECT SupplierID, COALESCE(Phone, 'N/A') AS PhoneOrNA
FROM retail_company.Supplier;

-- 10. Generic name picker: Product.Name else Supplier.Name else '(unknown)'
SELECT COALESCE(p.Name, s.Name, '(unknown)') AS AnyName
FROM retail_company.Product p
FULL JOIN retail_company.Supplier s ON 1=0;  -- structure-only example
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
