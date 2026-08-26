![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Length of each product name
2. Customer full name length
3. Supplier email length (non-null emails)
4. Address street length > 15
5. Count products with short names (<= 12 chars)
6. Longest city name per country
7. Phone length distribution (customers)
8. Orders whose Status text length = 6 (e.g., 'Open'≠6, 'Shipped'=7)
9. Warehouses with short names (< 5 chars)
10. Average product name length by category

## Substring Function (SUBSTRING)
1. First 5 chars of each product name
2. Extract area code from customer phone '+1-444-1234' -> '444'
3. Email username part before '@' (customers)
4. Email domain part after '@' (suppliers)
5. Extract 'WH' code letters from warehouse name 'WH-001' -> 'WH'
6. Get ZIP numeric part after 'Z' (e.g., 'Z12345' -> '12345')
7. Middle 3 letters of product name starting at pos 3
8. Order status first char
9. Category short code: first 3 letters of name (pad if shorter)
10. Take last 4 chars of phone using SUBSTRING + LEN

## Concatenation Operator (+)
1. Full customer name
2. Product label "Name (CategoryID)"
3. Full address line
4. Supplier contact string
5. Warehouse descriptor
6. Email mailto link-ish text
7. Product composite key text
8. Order display "SO-<id> on <date>"
9. Category breadcrumb with description
10. Purchase order label "PO:<id>|Supp:<id>"

## Lower Function (LOWER)
1. Lowercase product names
2. Lowercase customer emails
3. Lowercase city and country
4. Normalized supplier contact name
5. Lower status for grouping
6. Lower product category names
7. Lower warehouse names and locations
8. Lowercase unique email domains (customers)
9. Lowercase country distinct list
10. Lowercase combined "name (status)"

## Upper Function (UPPER)
1. Uppercase product names
2. Uppercase customer last names
3. Uppercase countries and two-letter pseudo-code (first 2)
4. Uppercase supplier names and emails
5. Uppercase statuses distinct
6. Uppercase category names
7. Uppercase warehouse descriptors
8. Upper order label
9. Uppercase city-country pair
10. Upper customer full names

## Trim Function (TRIM)
1. Trimmed customer names
2. Trim product names and compare length change
3. Trim city/state/ZIP
4. Trim supplier contact and email (keep NULLs)
5. Orders with status after TRIM (defensive)
6. Trim warehouse names/location then concat
7. Customers where TRIM(Email) ends with '@example.com'
8. Trimmed full address single line
9. Detect leading/trailing spaces in category names
10. Normalize phones: TRIM then length

## Ltrim Function (LTRIM)
1. Remove leading spaces from product names
2. Leading spaces in customer first names
3. Left-trim ship-to city
4. LTRIM on state and zip
5. LTRIM contact name
6. LTRIM email (customers)
7. Compare before/after on warehouse name
8. Detect if leading spaces exist in category names
9. LTRIM phone and compute length
10. LTRIM combined full name

## Rtrim Function (RTRIM)
1. Remove trailing spaces from product names
2. Trailing spaces length for customer last names
3. RTRIM ship-to state and ZIP
4. RTRIM contact name and email
5. RTRIM warehouse location
6. Detect trailing spaces in category names
7. RTRIM city and compare lengths
8. RTRIM phone for customers
9. RTRIM concatenated address string
10. Order status RTRIM then distinct

## Charindex Function (CHARINDEX)
1. Position of '@' in customer emails
2. Does product name contain a dash?
3. Find hyphen in warehouse name 'WH-001'
4. First space in supplier ContactName
5. City contains 'City1'?
6. Position of 'Zone' in Location
7. Orders whose Status contains 'hip'
8. Domain extraction using CHARINDEX + SUBSTRING (suppliers)
9. Left of dash in product names
10. Right of dash in product names

## Left Function (LEFT)
1. First 3 chars of product name
2. Country 2-letter pseudo-code
3. First letter of order status
4. Warehouse code prefix from 'WH-001' -> 'WH'
5. Customer first initial + last name
6. First 5 chars of supplier name
7. Left 4 of ZIP
8. Left pad product ID to 6 with zeros (via RIGHT, but show LEFT on text)
9. Left part of email before '@' (alt)
10. Left of city name up to first space

## Right Function (RIGHT)
1. Last 3 chars of product name
2. Last 4 of phone
3. Warehouse numeric suffix from 'WH-001' -> '001'
4. Last 2 chars of country
5. Right 3 chars of category name
6. Right of email after '@' using RIGHT + LEN - CHARINDEX
7. Right 5 of ZIP (pad with zeros if shorter)
8. Right 6 of product name
9. Last word of status (handles one-word too)
10. Right 2 chars of state

## Reverse Function (REVERSE)
1. Reverse product names
2. Reverse ZIP codes
3. Detect palindromic city names
4. Reverse emails (fun)
5. Reverse status text
6. Reverse supplier contact names
7. Reverse warehouse names
8. Reverse product category names
9. Reverse phone
10. Orders where reversed status contains 'NEPO' (reverse of 'OPEN')

## Replace Function (REPLACE)
1. Remove dashes from phone
2. Replace 'Product-' in name
3. Replace spaces in supplier names with underscores
4. Replace 'Zone-' in warehouse location
5. Normalize emails to lowercase then replace domain
6. Replace city 'City0' with 'CityZero' (view only)
7. Replace double spaces in category descriptions
8. Strip commas from address street
9. Replace 'Cancelled' status spelling to 'Canceled' (US style)
10. Replace 'Supplier ' prefix in supplier names

## Case Statement (CASE)
1. Order status classification
2. Product price band
3. Email availability label (customers)
4. Stock health label
5. Country region grouping (sample)
6. PO status message
7. Customer phone format check
8. Warehouse location zone bucket
9. Order size label based on TotalAmount
10. Supplier email domain group

## ISNULL Function (ISNULL)
1. Replace NULL emails with placeholder (customers)
2. Replace NULL contact names (suppliers)
3. Replace NULL warehouse locations with 'Unknown'
4. Ship city safe (orders)
5. Safe category description
6. Address street safe
7. Product name safe
8. Order status safe
9. Supplier email safe lowercased
10. Phone safe then length

## Coalesce Function (COALESCE)
1. Prefer customer Email then phone as contact
2. Preferred location text: ShipAddress city, else customer city
3. Product display name: Product.Name else '(unnamed)'
4. Supplier contact: ContactName else Supplier.Name
5. Warehouse label: Name @ Location or Name
6. Category description or category name
7. Customer address line: prefer ShipAddress, fallback Customer address
8. Email domain (customer->supplier fallback) demo
9. Phone or 'N/A' for suppliers
10. Generic name picker: Product.Name else Supplier.Name else '(unknown)'

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
