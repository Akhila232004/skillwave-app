![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. All party names (customers + suppliers) with a label
2. All cities used by customers or suppliers (distinct)
3. Days in July 2025 that had any sales orders or any shipments
4. Product IDs that appear either in Batches or in Inventory snapshots (July 2025)
5. Parties (Customer/Supplier) in the USA (unique by name + country)
6. All July-2025 activity dates across Orders, Shipments, QC Tests (as dates)
7. Entities that reference Address table (customer/supplier/distribution center) with a tag
8. Products that are either Tablet/Capsule OR have at least one batch (IDs only)
9. All agencies that have submissions OR are mentioned in July-2025 (distinct)
10. Equipment locations or DC cities (place names)
11. Customer or Supplier emails (normalize column name)
12. Inventory snapshot dates or QC test dates in last week of July

## Intersect
1. Cities that have BOTH customers and suppliers
2. Dates in July with BOTH sales orders and shipments
3. ProductIDs present in BOTH Batches and Inventory during July 2025
4. Agencies that have submissions BOTH before and after 2025-07-15
5. Customers that BOTH placed orders AND received shipments in July 2025
6. Distribution centers that BOTH shipped AND have inventory snapshots on 2025-07-31
7. Tests that have BOTH pass and fail entries in July 2025
8. Products that BOTH have a regulatory submission AND appeared in any batch
9. Days where BOTH QC tests occurred AND inventory snapshots exist
10. Countries that have BOTH customers and distribution centers
11. Strength values that appear in BOTH Product and (synthetic) a comparison list
12. Product names that are BOTH Tablet AND have at least one QC result via a batch

## Except
1. Cities that have customers EXCEPT those that also have suppliers
2. Dates with sales orders EXCEPT dates with shipments (July 2025)
3. ProductIDs that have batches EXCEPT those that appear in inventory (July 2025)
4. Customers who received shipments EXCEPT those who placed orders (July 2025)
5. Agencies with submissions in July EXCEPT those with 'Approved' status in July
6. Distribution centers with inventory on 2025-07-31 EXCEPT those that shipped that day
7. Tests executed in July EXCEPT those that ever failed in July
8. Tablet products EXCEPT those with any batch
9. Customers in USA EXCEPT those that received shipments in July
10. Cities with distribution centers EXCEPT cities with customers
11. Products that have regulatory submissions EXCEPT those with 'Approved' status
12. July inventory dates EXCEPT days with any QC tests

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
