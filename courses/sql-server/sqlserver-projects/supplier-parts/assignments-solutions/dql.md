![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. Retrieve all columns from the parts table.
SELECT * FROM supplier_parts.parts;

-- 2. Retrieve part_id and part_name from the parts table.
SELECT part_id, part_name FROM supplier_parts.parts;

-- 3. Retrieve supplier_name and contact_email from the suppliers table.
SELECT supplier_name, contact_email FROM supplier_parts.suppliers;

-- 4. Retrieve part_name, unit_price, and supplier_id for all parts.
SELECT part_name, unit_price, supplier_id FROM supplier_parts.parts;

-- 5. Retrieve distinct supplier_id values from the parts table.
SELECT DISTINCT supplier_id FROM supplier_parts.parts;

-- 6. Retrieve part_name and the length of part_name as name_length.
SELECT part_name, LEN(part_name) AS name_length FROM supplier_parts.parts;

-- 7. Retrieve supplier_name in uppercase.
SELECT UPPER(supplier_name) AS supplier_name_upper FROM supplier_parts.suppliers;

-- 8. Retrieve part_name and calculate unit_price with 10% markup as price_markup.
SELECT part_name, unit_price * 1.10 AS price_markup FROM supplier_parts.parts;

-- 9. Retrieve supplier_name concatenated with contact_name as contact_info.
SELECT supplier_name + ' (' + contact_name + ')' AS contact_info FROM supplier_parts.suppliers;

-- 10. Retrieve part_name and current date for each part.
SELECT part_name, GETDATE() AS query_date FROM supplier_parts.parts;
```

## WHERE
```sql
-- 1. List parts with unit_price > 10.
SELECT * FROM supplier_parts.parts WHERE unit_price > 10;

-- 2. List parts with unit_price BETWEEN 5 AND 15.
SELECT * FROM supplier_parts.parts WHERE unit_price BETWEEN 5 AND 15;

-- 3. List parts with part_name containing the letter 'a'.
SELECT * FROM supplier_parts.parts WHERE part_name LIKE '%a%';

-- 4. List suppliers located in 'Anytown, USA'.
SELECT * FROM supplier_parts.suppliers WHERE address LIKE '%Anytown, USA';

-- 5. List suppliers whose name starts with 'A'.
SELECT * FROM supplier_parts.suppliers WHERE supplier_name LIKE 'A%';

-- 6. List parts with unit_price IN specific values (8.99, 11.99, 12.49).
SELECT * FROM supplier_parts.parts WHERE unit_price IN (8.99, 11.99, 12.49);

-- 7. List parts where supplier_id IS NOT NULL.
SELECT * FROM supplier_parts.parts WHERE supplier_id IS NOT NULL;

-- 8. List suppliers with a missing contact_email.
SELECT * FROM supplier_parts.suppliers WHERE contact_email IS NULL;

-- 9. List parts where part_description contains 'useful'.
SELECT * FROM supplier_parts.parts WHERE part_description LIKE '%useful%';

-- 10. List suppliers with phone_number starting with '234-'.
SELECT * FROM supplier_parts.suppliers WHERE phone_number LIKE '234-%';
```

## GROUP BY
```sql
-- 1. Count parts per supplier.
SELECT supplier_id, COUNT(*) AS part_count
FROM supplier_parts.parts
GROUP BY supplier_id;

-- 2. Average unit_price per supplier.
SELECT supplier_id, AVG(unit_price) AS avg_price
FROM supplier_parts.parts
GROUP BY supplier_id;

-- 3. Sum of unit_price per supplier.
SELECT supplier_id, SUM(unit_price) AS total_value
FROM supplier_parts.parts
GROUP BY supplier_id;

-- 4. Maximum unit_price per supplier.
SELECT supplier_id, MAX(unit_price) AS max_price
FROM supplier_parts.parts
GROUP BY supplier_id;

-- 5. Minimum unit_price per supplier.
SELECT supplier_id, MIN(unit_price) AS min_price
FROM supplier_parts.parts
GROUP BY supplier_id;

-- 6. Count distinct unit_price per supplier.
SELECT supplier_id, COUNT(DISTINCT unit_price) AS unique_prices
FROM supplier_parts.parts
GROUP BY supplier_id;

-- 7. Total number of suppliers per address.
SELECT address, COUNT(*) AS suppliers_count
FROM supplier_parts.suppliers
GROUP BY address;

-- 8. Average name_length of parts per supplier.
SELECT p.supplier_id, AVG(LEN(p.part_name)) AS avg_name_length
FROM supplier_parts.parts p
GROUP BY p.supplier_id;

-- 9. Sum of unit_price for parts costing more than 10 per supplier.
SELECT supplier_id, SUM(unit_price) AS total_high_value
FROM supplier_parts.parts
WHERE unit_price > 10
GROUP BY supplier_id;

-- 10. Count parts per supplier ordered by count.
SELECT supplier_id, COUNT(*) AS cnt
FROM supplier_parts.parts
GROUP BY supplier_id;
```

## HAVING
```sql
-- 1. Suppliers with more than 3 parts.
SELECT supplier_id, COUNT(*) AS part_count
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING COUNT(*) > 3;

-- 2. Suppliers with average unit_price greater than 15.
SELECT supplier_id, AVG(unit_price) AS avg_price
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING AVG(unit_price) > 15;

-- 3. Suppliers with minimum unit_price less than 5.
SELECT supplier_id, MIN(unit_price) AS min_price
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING MIN(unit_price) < 5;

-- 4. Suppliers with distinct unit_price count greater than 5.
SELECT supplier_id, COUNT(DISTINCT unit_price) AS unique_prices
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING COUNT(DISTINCT unit_price) > 5;

-- 5. Suppliers whose total value of parts exceeds 100.
SELECT supplier_id, SUM(unit_price) AS total_value
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING SUM(unit_price) > 100;

-- 6. Suppliers where average part_name length is greater than 7.
SELECT supplier_id, AVG(LEN(part_name)) AS avg_name_length
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING AVG(LEN(part_name)) > 7;

-- 7. Suppliers with part count between 2 and 5.
SELECT supplier_id, COUNT(*) AS part_count
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING COUNT(*) BETWEEN 2 AND 5;

-- 8. Suppliers with a maximum unit_price equal to 19.99.
SELECT supplier_id, MAX(unit_price) AS max_price
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING MAX(unit_price) = 19.99;

-- 9. Suppliers where count of parts priced over 10 is more than 3.
SELECT supplier_id, COUNT(*) AS high_value_count
FROM supplier_parts.parts
WHERE unit_price > 10
GROUP BY supplier_id
HAVING COUNT(*) > 3;

-- 10. Addresses with more than one supplier.
SELECT address, COUNT(*) AS supplier_count
FROM supplier_parts.suppliers
GROUP BY address
HAVING COUNT(*) > 1;
```

## ORDER BY
```sql
-- 1. List all parts ordered by unit_price ascending.
SELECT * FROM supplier_parts.parts
ORDER BY unit_price ASC;

-- 2. List all suppliers ordered by supplier_name descending.
SELECT * FROM supplier_parts.suppliers
ORDER BY supplier_name DESC;

-- 3. List part_name and unit_price ordered by unit_price descending.
SELECT part_name, unit_price
FROM supplier_parts.parts
ORDER BY unit_price DESC;

-- 4. List parts with unit_price > 10 ordered by unit_price ascending.
SELECT * FROM supplier_parts.parts
WHERE unit_price > 10
ORDER BY unit_price ASC;

-- 5. List suppliers ordered by the length of their names.
SELECT supplier_name, LEN(supplier_name) AS name_length
FROM supplier_parts.suppliers
ORDER BY name_length;

-- 6. List part_name and markup (10% over unit_price) ordered by markup descending.
SELECT part_name, unit_price * 1.10 AS price_markup
FROM supplier_parts.parts
ORDER BY price_markup DESC;

-- 7. List suppliers ordered by address then supplier_name.
SELECT *
FROM supplier_parts.suppliers
ORDER BY address, supplier_name;

-- 8. List parts ordered by name length then unit_price.
SELECT part_name, unit_price
FROM supplier_parts.parts
ORDER BY LEN(part_name), unit_price;

-- 9. List parts for supplier_id = 2 ordered by unit_price descending.
SELECT *
FROM supplier_parts.parts
WHERE supplier_id = 2
ORDER BY unit_price DESC;

-- 10. List top 5 most expensive parts (using ORDER BY without TOP clause).
SELECT *
FROM supplier_parts.parts
ORDER BY unit_price DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;
```

## TOP
```sql
-- 1. Retrieve top 5 most expensive parts.
SELECT TOP 5 *
FROM supplier_parts.parts
ORDER BY unit_price DESC;

-- 2. Retrieve top 3 cheapest parts.
SELECT TOP 3 *
FROM supplier_parts.parts
ORDER BY unit_price ASC;

-- 3. Retrieve top 5 suppliers by name ascending.
SELECT TOP 5 *
FROM supplier_parts.suppliers
ORDER BY supplier_name ASC;

-- 4. Retrieve top 10 parts for supplier_id = 1 ordered by unit_price descending.
SELECT TOP 10 *
FROM supplier_parts.parts
WHERE supplier_id = 1
ORDER BY unit_price DESC;

-- 5. Retrieve top 5 parts by highest 20% markup potential.
SELECT TOP 5 part_name, unit_price * 1.20 AS markup
FROM supplier_parts.parts
ORDER BY markup DESC;

-- 6. Retrieve top 5 parts by descending part_name length.
SELECT TOP 5 part_name, LEN(part_name) AS name_length
FROM supplier_parts.parts
ORDER BY name_length DESC;

-- 7. Retrieve top 5 suppliers with the longest names.
SELECT TOP 5 supplier_name, LEN(supplier_name) AS name_length
FROM supplier_parts.suppliers
ORDER BY name_length DESC;

-- 8. Retrieve top 3 suppliers by number of parts provided.
SELECT TOP 3 supplier_id, COUNT(*) AS part_count
FROM supplier_parts.parts
GROUP BY supplier_id
ORDER BY part_count DESC;

-- 9. Retrieve top 3 addresses by supplier count.
SELECT TOP 3 address, COUNT(*) AS suppliers_count
FROM supplier_parts.suppliers
GROUP BY address
ORDER BY suppliers_count DESC;

-- 10. Retrieve top 5 parts with highest fractional cents (rightmost two digits).
SELECT TOP 5 *
FROM supplier_parts.parts
ORDER BY RIGHT(CAST(unit_price * 100 AS VARCHAR(10)), 2) DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
