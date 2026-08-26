![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Get length of each product name
2. Supplier name length
3. Customer name length
4. Distribution center name length
5. Raw material CASNumber length
6. Regulatory submission document link length
7. Equipment name length
8. City name length from Address
9. QC result value string length
10. Strength field length

## Substring Function (SUBSTRING)
1. First 5 characters of product name
2. Last 3 digits of CustomerID as string
3. Extract city prefix (first 4 letters)
4. Supplier phone area code (first 4 chars)
5. First 7 characters of DocumentLink
6. Extract 'DC' prefix from distribution center names
7. Extract batch year from BatchDate (yyyy-mm-dd format)
8. Extract month from OrderDate
9. Take first 2 letters of equipment type
10. First 3 characters of Strength

## Concatenation Operator (+)
1. Full customer address line
2. Supplier contact info string
3. Product name with strength
4. Distribution center with country
5. Order label
6. Shipment label
7. Regulatory submission title
8. Batch display
9. QC result summary
10. Equipment label

## Lower Function (LOWER)
1. Lowercase customer names
2. Lowercase supplier emails
3. Lowercase product names
4. Lowercase address city
5. Lowercase regulatory agencies
6. Lowercase equipment type
7. Lowercase distribution center names
8. Lowercase QC result value
9. Lowercase phone numbers
10. Lowercase document link

## Upper Function (UPPER)
1. Uppercase customer names
2. Uppercase supplier emails
3. Uppercase product names
4. Uppercase address city
5. Uppercase regulatory agencies
6. Uppercase equipment type
7. Uppercase distribution center names
8. Uppercase QC result value
9. Uppercase phone numbers
10. Uppercase document link

## Trim Function (TRIM)
1. Trim spaces from supplier name
2. LTRIM on product name
3. RTRIM on customer name
4. Trim city field
5. Trim QC result value
6. Trim phone numbers
7. Trim document links
8. LTRIM shipment IDs (string cast)
9. RTRIM order IDs
10. Trim equipment type

## Ltrim Function (LTRIM)
1. Remove leading spaces from supplier names
2. LTRIM product names
3. LTRIM customer names
4. LTRIM distribution center names
5. LTRIM city names
6. LTRIM regulatory agency names
7. LTRIM equipment names
8. LTRIM QC result values
9. LTRIM phone numbers
10. LTRIM document links

## Rtrim Function (RTRIM)
1. Remove trailing spaces from supplier names
2. RTRIM product names
3. RTRIM customer names
4. RTRIM distribution center names
5. RTRIM city names
6. RTRIM regulatory agency names
7. RTRIM equipment names
8. RTRIM QC result values
9. RTRIM phone numbers
10. RTRIM document links

## Charindex Function (CHARINDEX)
1. Find position of '-' in product name
2. Find '@' in supplier email
3. Find 'DC' in distribution center name
4. Find 'mg' in strength
5. Find 'Plant' in equipment location
6. Find 'pdf' in doc link
7. Find 'City' in city name
8. Find 'Pass' in QC result value
9. Find '-' in phone number
10. Find 'Customer' in customer name

## Left Function (LEFT)
1. First 5 characters of product name
2. First 3 characters of supplier name
3. First 7 characters of customer name
4. First 4 characters of city
5. First 2 characters of distribution center name
6. First 6 characters of regulatory agency name
7. First 3 characters of equipment type
8. First 8 characters of document link
9. First 2 characters of QC result value
10. First 4 characters of product strength

## Right Function (RIGHT)
1. Last 5 characters of product name
2. Last 3 characters of supplier name
3. Last 7 characters of customer name
4. Last 4 characters of city
5. Last 2 characters of distribution center name
6. Last 6 characters of regulatory agency name
7. Last 3 characters of equipment type
8. Last 8 characters of document link
9. Last 2 characters of QC result value
10. Last 4 characters of product strength

## Reverse Function (REVERSE)
1. Reverse product name
2. Reverse supplier email
3. Reverse customer name
4. Reverse city
5. Reverse phone
6. Reverse regulatory doc link
7. Reverse QC result value
8. Reverse equipment name
9. Reverse DC name
10. Reverse order ID

## Replace Function (REPLACE)
1. Replace 'Product' with 'Drug' in product names
2. Replace 'Customer' with 'Client'
3. Replace '-' with '/' in phone
4. Replace 'City' with 'Town'
5. Replace '.pdf' with '.docx'
6. Replace 'DC' with 'DistributionCenter'
7. Replace 'Pass' with 'OK' in QC result
8. Replace 'mg' with 'milligrams'
9. Replace 'Supplier' with 'Vendor'
10. Replace space with '_' in equipment names

## Case Statement (CASE)
1. Categorize orders by status
2. Categorize QC result pass/fail
3. Categorize product strength
4. Categorize shipment size
5. Categorize inventory quantity
6. Categorize suppliers by phone prefix
7. Categorize customers by ID ranges
8. Categorize batches by status
9. Categorize regulatory submissions by agency
10. Categorize equipment type

## ISNULL Function (ISNULL)
1. Supplier phone default 'N/A'
2. Supplier email default 'unknown'
3. Customer address default 'No Address'
4. Product strength default 'Unknown'
5. Batch status default 'Pending'
6. QC result default 'Not Done'
7. Shipment carrier default 'None'
8. Equipment location default 'Unknown'
9. Regulatory doc link default 'Not Available'
10. Inventory expiration date default '1900-01-01'

## Coalesce Function (COALESCE)
1. Supplier email fallback: Email → ContactName → 'Unknown'
2. Customer address fallback: AddressID → Name → 'N/A'
3. Product strength fallback
4. Batch status fallback
5. QC result fallback
6. Regulatory doc fallback
7. Equipment location fallback
8. Shipment carrier fallback
9. Inventory expiry fallback
10. Customer fallback to name

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
