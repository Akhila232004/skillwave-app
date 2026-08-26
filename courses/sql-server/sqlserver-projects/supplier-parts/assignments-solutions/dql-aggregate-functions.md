![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Count total number of parts.
SELECT COUNT(*) AS total_parts FROM supplier_parts.parts;
-- 2. Count distinct suppliers for parts.
SELECT COUNT(DISTINCT supplier_id) AS distinct_suppliers FROM supplier_parts.parts;
-- 3. Count parts per supplier.
SELECT supplier_id, COUNT(*) AS part_count
FROM supplier_parts.parts
GROUP BY supplier_id;
-- 4. Count total suppliers.
SELECT COUNT(*) AS total_suppliers FROM supplier_parts.suppliers;
-- 5. Count suppliers with an email on file.
SELECT COUNT(*) AS suppliers_with_email
FROM supplier_parts.suppliers
WHERE contact_email IS NOT NULL;
-- 6. Count parts priced over 10.
SELECT COUNT(*) AS parts_gt_10
FROM supplier_parts.parts
WHERE unit_price > 10;
-- 7. Count parts by price range.
SELECT
  CASE 
    WHEN unit_price < 5 THEN '<5'
    WHEN unit_price BETWEEN 5 AND 15 THEN '5-15'
    ELSE '>15'
  END AS price_range,
  COUNT(*) AS count
FROM supplier_parts.parts
GROUP BY
  CASE 
    WHEN unit_price < 5 THEN '<5'
    WHEN unit_price BETWEEN 5 AND 15 THEN '5-15'
    ELSE '>15'
  END;
-- 8. Count parts whose description contains 'valve'.
SELECT COUNT(*) AS valve_parts
FROM supplier_parts.parts
WHERE part_description LIKE '%valve%';
-- 9. Count suppliers per city (city extracted from address).
SELECT
  SUBSTRING(address, CHARINDEX(',',address)+2, CHARINDEX(',',address,CHARINDEX(',',address)+1)-CHARINDEX(',',address)-2) AS city,
  COUNT(*) AS suppliers_count
FROM supplier_parts.suppliers
GROUP BY
  SUBSTRING(address, CHARINDEX(',',address)+2, CHARINDEX(',',address,CHARINDEX(',',address)+1)-CHARINDEX(',',address)-2);
-- 10. Count parts priced above the average price.
SELECT COUNT(*) AS parts_above_avg
FROM supplier_parts.parts
WHERE unit_price > (SELECT AVG(unit_price) FROM supplier_parts.parts);
```

## Sum
```sql
-- 1. Sum of all unit prices.
SELECT SUM(unit_price) AS total_price FROM supplier_parts.parts;
-- 2. Sum of unit prices per supplier.
SELECT supplier_id, SUM(unit_price) AS total_by_supplier
FROM supplier_parts.parts
GROUP BY supplier_id;
-- 3. Sum of prices for parts over 10.
SELECT SUM(unit_price) AS sum_gt_10
FROM supplier_parts.parts
WHERE unit_price > 10;
-- 4. Sum of prices for part_id 1–20.
SELECT SUM(unit_price) AS sum_first_20
FROM supplier_parts.parts
WHERE part_id BETWEEN 1 AND 20;
-- 5. Sum of prices grouped into low/high.
SELECT
  SUM(CASE WHEN unit_price < 10 THEN unit_price ELSE 0 END) AS sum_low,
  SUM(CASE WHEN unit_price >= 10 THEN unit_price ELSE 0 END) AS sum_high
FROM supplier_parts.parts;
-- 6. Sum of prices by price range.
SELECT
  CASE WHEN unit_price < 5 THEN '<5' WHEN unit_price BETWEEN 5 AND 15 THEN '5-15' ELSE '>15' END AS range,
  SUM(unit_price) AS range_sum
FROM supplier_parts.parts
GROUP BY CASE WHEN unit_price < 5 THEN '<5' WHEN unit_price BETWEEN 5 AND 15 THEN '5-15' ELSE '>15' END;
-- 7. Sum of prices for suppliers with more than 2 parts.
SELECT supplier_id, SUM(unit_price) AS sum_value
FROM supplier_parts.parts
GROUP BY supplier_id
HAVING COUNT(*) > 2;
-- 8. Sum of top 5 most expensive parts.
SELECT SUM(unit_price) AS sum_top5
FROM (
  SELECT TOP 5 unit_price
  FROM supplier_parts.parts
  ORDER BY unit_price DESC
) t;
-- 9. Sum of (price minus average price).
SELECT SUM(unit_price - (SELECT AVG(unit_price) FROM supplier_parts.parts)) AS sum_diff_avg
FROM supplier_parts.parts;
-- 10. Sum of prices for parts with odd supplier_id.
SELECT SUM(unit_price) AS sum_odd_sup
FROM supplier_parts.parts
WHERE supplier_id % 2 = 1;
```

## Avg
```sql
-- 1. Average price of all parts.
SELECT AVG(unit_price) AS avg_price FROM supplier_parts.parts;
-- 2. Average price per supplier.
SELECT supplier_id, AVG(unit_price) AS avg_by_supplier
FROM supplier_parts.parts
GROUP BY supplier_id;
-- 3. Average price for parts with long descriptions.
SELECT AVG(unit_price) AS avg_long_desc
FROM supplier_parts.parts
WHERE LEN(part_description) > 10;
-- 4. Average price for supplier_ids 1–3.
SELECT AVG(unit_price) AS avg_sup123
FROM supplier_parts.parts
WHERE supplier_id IN (1,2,3);
-- 5. Average price of parts over 10.
SELECT AVG(unit_price) AS avg_gt_10
FROM supplier_parts.parts
WHERE unit_price > 10;
-- 6. Rounded average price.
SELECT ROUND(AVG(unit_price),2) AS avg_rounded FROM supplier_parts.parts;
-- 7. Average price by range.
SELECT
  CASE WHEN unit_price < 5 THEN '<5' WHEN unit_price BETWEEN 5 AND 15 THEN '5-15' ELSE '>15' END AS range,
  AVG(unit_price) AS avg_price
FROM supplier_parts.parts
GROUP BY CASE WHEN unit_price < 5 THEN '<5' WHEN unit_price BETWEEN 5 AND 15 THEN '5-15' ELSE '>15' END;
-- 8. Average price for odd supplier_id.
SELECT AVG(unit_price) AS avg_odd_sup
FROM supplier_parts.parts
WHERE supplier_id % 2 = 1;
-- 9. Average of the 5 cheapest parts.
SELECT AVG(unit_price) AS avg_cheapest5
FROM (
  SELECT TOP 5 unit_price
  FROM supplier_parts.parts
  ORDER BY unit_price ASC
) t;
-- 10. Average deviation from overall average.
SELECT AVG(unit_price - (SELECT AVG(unit_price) FROM supplier_parts.parts)) AS avg_diff
FROM supplier_parts.parts;
```

## Max
```sql
-- 1. Maximum price of all parts.
SELECT MAX(unit_price) AS max_price FROM supplier_parts.parts;
-- 2. Maximum price per supplier.
SELECT supplier_id, MAX(unit_price) AS max_by_supplier
FROM supplier_parts.parts
GROUP BY supplier_id;
-- 3. Maximum part_id.
SELECT MAX(part_id) AS max_part_id FROM supplier_parts.parts;
-- 4. Longest part_name length.
SELECT MAX(LEN(part_name)) AS max_name_len FROM supplier_parts.parts;
-- 5. Maximum price for supplier_id > 5.
SELECT MAX(unit_price) AS max_sup_gt5
FROM supplier_parts.parts
WHERE supplier_id > 5;
-- 6. Maximum price for parts containing 'Metal'.
SELECT MAX(unit_price) AS max_metal
FROM supplier_parts.parts
WHERE part_description LIKE '%Metal%';
-- 7. Maximum price by range.
SELECT
  CASE WHEN unit_price < 10 THEN '<10' ELSE '>=10' END AS range,
  MAX(unit_price) AS max_price
FROM supplier_parts.parts
GROUP BY CASE WHEN unit_price < 10 THEN '<10' ELSE '>=10' END;
-- 8. Maximum deviation from average.
SELECT MAX(unit_price - (SELECT AVG(unit_price) FROM supplier_parts.parts)) AS max_diff
FROM supplier_parts.parts;
-- 9. Maximum price of parts with NULL supplier.
SELECT MAX(unit_price) AS max_null_sup
FROM supplier_parts.parts
WHERE supplier_id IS NULL;
-- 10. Maximum price for part_id < 20.
SELECT MAX(unit_price) AS max_first20
FROM supplier_parts.parts
WHERE part_id < 20;
```

## Min
```sql
-- 1. Minimum price of all parts.
SELECT MIN(unit_price) AS min_price FROM supplier_parts.parts;
-- 2. Minimum price per supplier.
SELECT supplier_id, MIN(unit_price) AS min_by_supplier
FROM supplier_parts.parts
GROUP BY supplier_id;
-- 3. Minimum part_id.
SELECT MIN(part_id) AS min_part_id FROM supplier_parts.parts;
-- 4. Shortest part_name length.
SELECT MIN(LEN(part_name)) AS min_name_len FROM supplier_parts.parts;
-- 5. Minimum price for supplier_id <= 3.
SELECT MIN(unit_price) AS min_sup_le3
FROM supplier_parts.parts
WHERE supplier_id <= 3;
-- 6. Minimum price for parts containing 'rubber'.
SELECT MIN(unit_price) AS min_rubber
FROM supplier_parts.parts
WHERE part_description LIKE '%rubber%';
-- 7. Minimum price by range.
SELECT
  CASE WHEN unit_price < 10 THEN '<10' ELSE '>=10' END AS range,
  MIN(unit_price) AS min_price
FROM supplier_parts.parts
GROUP BY CASE WHEN unit_price < 10 THEN '<10' ELSE '>=10' END;
-- 8. Minimum deviation from average.
SELECT MIN(unit_price - (SELECT AVG(unit_price) FROM supplier_parts.parts)) AS min_diff
FROM supplier_parts.parts;
-- 9. Minimum price among top 5 expensive parts.
SELECT MIN(unit_price) AS min_of_top5
FROM (
  SELECT TOP 5 unit_price
  FROM supplier_parts.parts
  ORDER BY unit_price DESC
) t;
-- 10. Minimum price for part_id > 20.
SELECT MIN(unit_price) AS min_after20
FROM supplier_parts.parts
WHERE part_id > 20;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
