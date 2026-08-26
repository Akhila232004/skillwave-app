![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. List all parts with their supplier names.
SELECT p.part_name, s.supplier_name
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id;

-- 2. Show part_name and supplier_name for parts priced > 10.
SELECT p.part_name, s.supplier_name, p.unit_price
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id
WHERE p.unit_price > 10;

-- 3. Show part_id, part_name, and contact_email for all parts.
SELECT p.part_id, p.part_name, s.contact_email
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id;

-- 4. Show part_name and supplier contact_name.
SELECT p.part_name, s.contact_name
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id;

-- 5. Show part_name, supplier_name, unit_price for suppliers in 'Anytown, USA'.
SELECT p.part_name, s.supplier_name, p.unit_price
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id
WHERE s.address LIKE '%Anytown, USA';

-- 6. List part_name and supplier phone_number.
SELECT p.part_name, s.phone_number
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id;

-- 7. List part_name with supplier address.
SELECT p.part_name, s.address
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id;

-- 8. Show part_name and supplier_name for parts with unit_price BETWEEN 5 AND 15.
SELECT p.part_name, s.supplier_name
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id
WHERE p.unit_price BETWEEN 5 AND 15;

-- 9. Show part_name and supplier_name for suppliers with name starting 'G'.
SELECT p.part_name, s.supplier_name
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id
WHERE s.supplier_name LIKE 'G%';

-- 10. Show top 5 most expensive parts with supplier_name.
SELECT TOP 5 p.part_name, s.supplier_name, p.unit_price
FROM supplier_parts.parts p
INNER JOIN supplier_parts.suppliers s
  ON p.supplier_id = s.supplier_id
ORDER BY p.unit_price DESC;
```

## Left Join (Left Outer Join)
```sql
-- 1. List all suppliers and any parts they supply.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 2. Show supplier_name and unit_price (NULL if no parts).
SELECT s.supplier_name, p.unit_price
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 3. List suppliers and the count of parts they supply.
SELECT s.supplier_name, COUNT(p.part_id) AS part_count
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
GROUP BY s.supplier_name;

-- 4. List suppliers and total unit_price of their parts.
SELECT s.supplier_name, SUM(p.unit_price) AS total_value
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
GROUP BY s.supplier_name;

-- 5. List suppliers and average part name length.
SELECT s.supplier_name, AVG(LEN(p.part_name)) AS avg_name_length
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
GROUP BY s.supplier_name;

-- 6. List suppliers with parts priced > 15, showing NULL if none.
SELECT s.supplier_name, p.unit_price
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id AND p.unit_price > 15;

-- 7. List suppliers and any part_description containing 'valve'.
SELECT s.supplier_name, p.part_description
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id AND p.part_description LIKE '%valve%';

-- 8. Show suppliers and part_id (NULL if none).
SELECT s.supplier_name, p.part_id
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 9. List suppliers and distinct unit_price values.
SELECT s.supplier_name, DISTINCT p.unit_price
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 10. Show suppliers and parts for supplier_id <= 3.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
LEFT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE s.supplier_id <= 3;
```

## Right Join (Right Outer Join)
```sql
-- 1. List all parts and their suppliers (including parts without suppliers).
SELECT p.part_name, s.supplier_name
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 2. Show part_name and contact_email (NULL if supplier missing).
SELECT p.part_name, s.contact_email
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 3. List parts with unit_price and supplier phone_number.
SELECT p.part_name, p.unit_price, s.phone_number
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 4. Show parts and supplier address.
SELECT p.part_name, s.address
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 5. List parts with no matching supplier (NULL supplier_name).
SELECT p.part_name
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE s.supplier_id IS NULL;

-- 6. Show parts priced < 5 with supplier_name.
SELECT p.part_name, s.supplier_name
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE p.unit_price < 5;

-- 7. Show part_id, part_name, and supplier_id (NULL if none).
SELECT p.part_id, p.part_name, s.supplier_id
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 8. List parts and supplier_name for supplier_name LIKE 'P%'.
SELECT p.part_name, s.supplier_name
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE s.supplier_name LIKE 'P%';

-- 9. List parts and supplier_name for supplier_id > 5.
SELECT p.part_name, s.supplier_name
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE s.supplier_id > 5;

-- 10. Show top 3 cheapest parts with supplier_name.
SELECT TOP 3 p.part_name, p.unit_price, s.supplier_name
FROM supplier_parts.suppliers s
RIGHT JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
ORDER BY p.unit_price ASC;
```

## Full Join (Full Outer Join)
```sql
-- 1. List all suppliers and parts, matching where possible.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 2. Show all part_name and contact_email pairs.
SELECT p.part_name, s.contact_email
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 3. List all supplier_name and unit_price.
SELECT s.supplier_name, p.unit_price
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 4. Show all suppliers with no parts and parts with no suppliers.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE s.supplier_id IS NULL OR p.supplier_id IS NULL;

-- 5. List all part_id and supplier_id pairs.
SELECT p.part_id, s.supplier_id
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 6. Show all part_name and supplier_address.
SELECT p.part_name, s.address
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 7. List all parts priced > 15 and suppliers without parts.
SELECT s.supplier_name, p.part_name, p.unit_price
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE p.unit_price > 15 OR s.supplier_id IS NULL;

-- 8. Show all suppliers with part_description containing 'gear' or suppliers without parts.
SELECT s.supplier_name, p.part_description
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE p.part_description LIKE '%gear%' OR s.supplier_id IS NULL;

-- 9. List all part_name and supplier_phone.
SELECT p.part_name, s.phone_number
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id;

-- 10. Show all part_name and supplier_name for supplier_id <= 2 or unmatched.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
FULL JOIN supplier_parts.parts p
  ON s.supplier_id = p.supplier_id
WHERE s.supplier_id <= 2 OR s.supplier_id IS NULL;
```

## Cross Join
```sql
-- 1. List every combination of supplier_name and part_name.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p;

-- 2. Count total combinations of suppliers and parts.
SELECT COUNT(*) AS total_combinations
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p;

-- 3. List supplier_name and unit_price for all combinations.
SELECT s.supplier_name, p.unit_price
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p;

-- 4. Show combinations where part_id < 5.
SELECT s.supplier_name, p.part_id
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p
WHERE p.part_id < 5;

-- 5. List supplier_name and part_description combinations.
SELECT s.supplier_name, p.part_description
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p;

-- 6. Show combinations where supplier_id = 1.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p
WHERE s.supplier_id = 1;

-- 7. List combinations where unit_price > 15.
SELECT s.supplier_name, p.part_name, p.unit_price
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p
WHERE p.unit_price > 15;

-- 8. Show combinations limited to top 10 by part_id.
SELECT TOP 10 s.supplier_name, p.part_name, p.part_id
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p
ORDER BY p.part_id;

-- 9. List supplier_name and rightmost two digits of unit_price for all combinations.
SELECT s.supplier_name, RIGHT(CAST(p.unit_price * 100 AS VARCHAR(10)), 2) AS cents
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p;

-- 10. Show combinations where part_name LIKE 'G%' and supplier_name LIKE 'A%'.
SELECT s.supplier_name, p.part_name
FROM supplier_parts.suppliers s
CROSS JOIN supplier_parts.parts p
WHERE p.part_name LIKE 'G%' AND s.supplier_name LIKE 'A%';
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
