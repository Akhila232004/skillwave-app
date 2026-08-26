![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - String Functions Assignments

## Length Function (LEN)
1. Facility name lengths
2. Product names with length > 8
3. Customer names sorted by length
4. Pipeline name length and capacity
5. Address street length
6. Well name vs status length
7. RigName length (NULL-safe)
8. Invoice status length distribution
9. Field name length and discovery year
10. AssetMaintenance description length (top 20)

## Substring Function (SUBSTRING)
1. First 5 chars of facility names
2. Extract numeric suffix from 'Region-###'
3. Get 'Well' prefix + first 3 digits from Well name
4. Address street number (after 'No.')
5. ZIP last 4 using SUBSTRING
6. Product code (first 3 chars)
7. Pipeline short label: first 9 chars
8. Customer short tag: first 12 chars of name
9. Field tag: 'F-' + first 6 of name
10. Shipment month (YYYY-MM) from date as string

## Concatenation Operator (+)
1. City, State label
2. Full facility label
3. Customer + ID string
4. Pipeline endpoints string
5. Product + API (nullable) pretty label
6. Well display: Name + Status
7. Contract caption: Cust + Prod
8. Invoice key string (composite)
9. RigName fallback
10. Facility-page slug (lowercase, hyphenated)

## Lower Function (LOWER)
1. Lowercase customer names
2. Lowercase facility + location
3. Lowercase product names distinct
4. Lowercase pipeline names
5. Lowercase address city/state
6. Lowercase field names
7. Lowercase well status
8. Lowercase invoice status distinct
9. Lowercase rig names
10. Lowercase shipment product label

## Upper Function (UPPER)
1. UPPER customer names
2. UPPER facility label
3. UPPER product names
4. UPPER address country
5. UPPER well status
6. UPPER pipeline names
7. UPPER invoice status
8. UPPER field names
9. UPPER rig name (fallback)
10. UPPER product + API tag

## Trim Function (TRIM)
1. Trim a padded facility name (simulate padding)
2. Trim location (may already be clean)
3. Trim customer name + city composite
4. Trim rig names
5. Trim 'Well' label
6. Trim product names before comparison
7. Trim field names and show length after
8. Trim pipeline names and compare
9. Trim address street
10. Trim invoice status just in case

## Ltrim Function (LTRIM)
1. Left-trim padded names (simulate)
2. Left-trim location
3. Left-trim rig
4. Left-trim '  Well-XX'
5. Left-trim city
6. Compare lengths before/after LTRIM
7. LTRIM invoice status (demo)
8. LTRIM on composite string
9. LTRIM facility + location
10. LTRIM product + API

## Rtrim Function (RTRIM)
1. Right-trim padded name (simulate)
2. Right-trim city
3. Right-trim facility label
4. Right-trim rig
5. Compare lengths before/after RTRIM
6. RTRIM pipeline name
7. RTRIM invoice status
8. RTRIM field name
9. RTRIM well name + status
10. RTRIM shipment product label

## Charindex Function (CHARINDEX)
1. Position of '-' in region names
2. Find 'Rig' occurrence in RigName
3. Facilities whose name contains 'Ref'
4. Customers whose name contains 'Customer-00'
5. Address streets containing 'St'
6. Pipelines with number '1' in name
7. Fields whose name contains 'Field-1'
8. Products containing space
9. Wells containing hyphen
10. Invoice statuses containing space

## Left Function (LEFT)
1. Left 4 of customer name
2. Facility code (first 3)
3. Product prefix (first 2)
4. Region prefix
5. Field short
6. Pipeline short
7. Well short
8. Address ZIP first 2
9. Invoice date string LEFT 7 (YYYY-MM)
10. RigName first 5 (NULL-safe)

## Right Function (RIGHT)
1. Right 3 of customer name
2. Right 3 of region name (numeric tail)
3. Right 4 of field name
4. Right 2 of state
5. Right 5 of pipeline name
6. Right 6 of ZIP with padding
7. Right 3 of product name
8. Right 8 of facility name
9. Right 5 of well name
10. Right 10 of street

## Reverse Function (REVERSE)
1. Reverse pipeline names
2. Reverse customer names (fun)
3. Reverse product names
4. Reverse facility names
5. Reverse region names
6. Reverse field names
7. Reverse well names
8. Reverse city names
9. Reverse invoice status
10. Reverse rig names

## Replace Function (REPLACE)
1. Replace hyphen with space in region names
2. Replace 'Customer-' with 'Cust #'
3. Replace spaces with underscores in facility names
4. Replace spaces with '-' in product names
5. Replace 'St' with 'Street' in address street (demo)
6. Remove spaces from rig names
7. Replace 'Well-' with 'W#'
8. Replace 'Field-' with 'F#'
9. Replace 'Pipeline-' with 'PL-'
10. Replace spaces with '' in city (compact key)

## Case Statement (CASE)
1. Categorize product name length
2. Facility type label
3. Well status flag
4. Invoice status normalization (upper)
5. Address country group
6. Field activity based on any producing wells
7. Customer name class by prefix
8. Rig presence
9. Product light/heavy by API (text label)
10. Pipeline capacity band as text

## ISNULL Function (ISNULL)
1. RigName default
2. Facility location default
3. Product API to string default
4. Product Sulfur% to string default
5. WellType default text
6. Address State default (should exist; demo)
7. Invoice status default
8. AssetMaintenance description default
9. Pipeline name default (demo)
10. SalesContract end date text

## Coalesce Function (COALESCE)
1. RigName with fallback to 'Rig-<OperationID>'
2. Facility display: Name @ Location (fallbacks)
3. Customer display prefers name, else 'Customer-<ID>'
4. Product API string with NA fallback
5. Invoice status normalized
6. WellType/Status combined (prefer WellType)
7. Address city fallback to state, then country
8. Pipeline route names (prefer facility names; safe)
9. Field label fallback to Region name
10. Payment amount text with fallback

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
