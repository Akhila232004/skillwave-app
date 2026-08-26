![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. List distinct supplier_id values from parts and suppliers.
2. List all distinct names from part_name and supplier_name.
3. Combine part_name and supplier_name labeled as item_type.
4. List contact_email and part_description as info.
5. List supplier_id > 3 from parts and suppliers.
6. List supplier_id values including duplicates (UNION ALL).
7. List top 5 expensive and top 5 cheapest parts.
8. List part names and supplier names for supplier_id = 2.
9. List combined id_list from part_id and supplier_id.
10. List addresses containing 'St' and phone_numbers starting with '3'.

## Intersect
1. Find supplier_ids common to parts and suppliers.
2. Find names common to part_name and supplier_name.
3. Find supplier_names common to supplier_name and contact_name.
4. Find supplier_ids from parts with unit_price > 15 that exist in suppliers.
5. Find part_names that appear in part_description.
6. Find part_id values common to two subsets: < 10 and > 5.
7. Find supplier_ids whose average unit_price > 12.
8. Find part_names common to parts priced between 5 and 15 and supplier_names.
9. Find ids common to part_id and supplier_id within parts.
10. Find contact_emails ending with '.com' in suppliers.

## Except
1. List supplier_ids in suppliers that are not in parts.
2. List supplier_ids in parts that are not in suppliers.
3. List part_names not present as supplier_names.
4. List supplier_names not present as contact_names.
5. List part_ids not matching any supplier_id.
6. List supplier_ids ≤ 3 except those ≤ 1.
7. List part_names priced ≤ 10 except those priced ≤ 5.
8. List addresses excluding those containing 'Anytown'.
9. List phone_numbers for suppliers not having supplier_id < 5.
10. List parts priced > 5 except those priced > 15.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
