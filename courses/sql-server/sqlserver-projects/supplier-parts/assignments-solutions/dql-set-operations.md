![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. List distinct supplier_id values from parts and suppliers.
SELECT supplier_id FROM supplier_parts.parts
UNION
SELECT supplier_id FROM supplier_parts.suppliers;

-- 2. List all distinct names from part_name and supplier_name.
SELECT part_name AS name FROM supplier_parts.parts
UNION
SELECT supplier_name FROM supplier_parts.suppliers;

-- 3. Combine part_name and supplier_name labeled as item_type.
SELECT part_name AS item, 'Part' AS item_type FROM supplier_parts.parts
UNION
SELECT supplier_name, 'Supplier' FROM supplier_parts.suppliers;

-- 4. List contact_email and part_description as info.
SELECT contact_email AS info FROM supplier_parts.suppliers
UNION
SELECT part_description FROM supplier_parts.parts;

-- 5. List supplier_id > 3 from parts and suppliers.
SELECT supplier_id FROM supplier_parts.parts WHERE supplier_id > 3
UNION
SELECT supplier_id FROM supplier_parts.suppliers WHERE supplier_id > 3;

-- 6. List supplier_id values including duplicates (UNION ALL).
SELECT supplier_id FROM supplier_parts.parts
UNION ALL
SELECT supplier_id FROM supplier_parts.suppliers;

-- 7. List top 5 expensive and top 5 cheapest parts.
(SELECT TOP 5 part_name, unit_price FROM supplier_parts.parts ORDER BY unit_price DESC)
UNION
(SELECT TOP 5 part_name, unit_price FROM supplier_parts.parts ORDER BY unit_price ASC);

-- 8. List part names and supplier names for supplier_id = 2.
SELECT part_name FROM supplier_parts.parts WHERE supplier_id = 2
UNION
SELECT supplier_name FROM supplier_parts.suppliers WHERE supplier_id = 2;

-- 9. List combined id_list from part_id and supplier_id.
SELECT part_id AS id FROM supplier_parts.parts
UNION
SELECT supplier_id FROM supplier_parts.suppliers;

-- 10. List addresses containing 'St' and phone_numbers starting with '3'.
SELECT address AS contact FROM supplier_parts.suppliers WHERE address LIKE '%St%'
UNION
SELECT phone_number FROM supplier_parts.suppliers WHERE phone_number LIKE '3%';
```

## Intersect
```sql
-- 1. Find supplier_ids common to parts and suppliers.
SELECT supplier_id FROM supplier_parts.parts
INTERSECT
SELECT supplier_id FROM supplier_parts.suppliers;

-- 2. Find names common to part_name and supplier_name.
SELECT part_name AS name FROM supplier_parts.parts
INTERSECT
SELECT supplier_name FROM supplier_parts.suppliers;

-- 3. Find supplier_names common to supplier_name and contact_name.
SELECT supplier_name AS name FROM supplier_parts.suppliers
INTERSECT
SELECT contact_name FROM supplier_parts.suppliers;

-- 4. Find supplier_ids from parts with unit_price > 15 that exist in suppliers.
SELECT supplier_id FROM supplier_parts.parts WHERE unit_price > 15
INTERSECT
SELECT supplier_id FROM supplier_parts.suppliers;

-- 5. Find part_names that appear in part_description.
SELECT part_name AS text FROM supplier_parts.parts
INTERSECT
SELECT part_description FROM supplier_parts.parts;

-- 6. Find part_id values common to two subsets: < 10 and > 5.
SELECT part_id FROM supplier_parts.parts WHERE part_id < 10
INTERSECT
SELECT part_id FROM supplier_parts.parts WHERE part_id > 5;

-- 7. Find supplier_ids whose average unit_price > 12.
SELECT supplier_id
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING AVG(unit_price) > 12
INTERSECT
SELECT supplier_id FROM supplier_parts.suppliers;

-- 8. Find part_names common to parts priced between 5 and 15 and supplier_names.
SELECT part_name FROM supplier_parts.parts WHERE unit_price BETWEEN 5 AND 15
INTERSECT
SELECT supplier_name FROM supplier_parts.suppliers;

-- 9. Find ids common to part_id and supplier_id within parts.
SELECT part_id FROM supplier_parts.parts
INTERSECT
SELECT supplier_id FROM supplier_parts.parts;

-- 10. Find contact_emails ending with '.com' in suppliers.
SELECT contact_email FROM supplier_parts.suppliers WHERE contact_email LIKE '%.com'
INTERSECT
SELECT contact_email FROM supplier_parts.suppliers;
```

## Except
```sql
-- 1. List supplier_ids in suppliers that are not in parts.
SELECT supplier_id FROM supplier_parts.suppliers
EXCEPT
SELECT supplier_id FROM supplier_parts.parts;

-- 2. List supplier_ids in parts that are not in suppliers.
SELECT supplier_id FROM supplier_parts.parts
EXCEPT
SELECT supplier_id FROM supplier_parts.suppliers;

-- 3. List part_names not present as supplier_names.
SELECT part_name AS name FROM supplier_parts.parts
EXCEPT
SELECT supplier_name FROM supplier_parts.suppliers;

-- 4. List supplier_names not present as contact_names.
SELECT supplier_name FROM supplier_parts.suppliers
EXCEPT
SELECT contact_name FROM supplier_parts.suppliers;

-- 5. List part_ids not matching any supplier_id.
SELECT part_id FROM supplier_parts.parts
EXCEPT
SELECT supplier_id FROM supplier_parts.suppliers;

-- 6. List supplier_ids ≤ 3 except those ≤ 1.
SELECT supplier_id FROM supplier_parts.suppliers WHERE supplier_id <= 3
EXCEPT
SELECT supplier_id FROM supplier_parts.suppliers WHERE supplier_id <= 1;

-- 7. List part_names priced ≤ 10 except those priced ≤ 5.
SELECT part_name FROM supplier_parts.parts WHERE unit_price <= 10
EXCEPT
SELECT part_name FROM supplier_parts.parts WHERE unit_price <= 5;

-- 8. List addresses excluding those containing 'Anytown'.
SELECT address FROM supplier_parts.suppliers
EXCEPT
SELECT address FROM supplier_parts.suppliers WHERE address LIKE '%Anytown%';

-- 9. List phone_numbers for suppliers not having supplier_id < 5.
SELECT phone_number FROM supplier_parts.suppliers
EXCEPT
SELECT phone_number FROM supplier_parts.suppliers WHERE supplier_id < 5;

-- 10. List parts priced > 5 except those priced > 15.
(SELECT part_name, unit_price FROM supplier_parts.parts WHERE unit_price > 5)
EXCEPT
(SELECT part_name, unit_price FROM supplier_parts.parts WHERE unit_price > 15);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
