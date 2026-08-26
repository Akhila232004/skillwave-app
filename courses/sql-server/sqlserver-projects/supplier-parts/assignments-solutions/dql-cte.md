![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. Use a CTE to select parts with price > 10.
WITH ExpensiveParts AS (
  SELECT part_id, part_name, unit_price
  FROM supplier_parts.parts
  WHERE unit_price > 10
)
SELECT * FROM ExpensiveParts;

-- 2. CTE of supplier summaries (id and name), then select from it.
WITH SupplierSummary AS (
  SELECT supplier_id, supplier_name
  FROM supplier_parts.suppliers
)
SELECT * FROM SupplierSummary;

-- 3. CTE to compute part name lengths.
WITH NameLengths AS (
  SELECT part_id, LEN(part_name) AS name_len
  FROM supplier_parts.parts
)
SELECT * FROM NameLengths WHERE name_len > 6;

-- 4. CTE to get average price per supplier.
WITH AvgPrice AS (
  SELECT supplier_id, AVG(unit_price) AS avg_price
  FROM supplier_parts.parts
  GROUP BY supplier_id
)
SELECT * FROM AvgPrice WHERE avg_price > 12;

-- 5. CTE for parts starting with 'G'.
WITH GParts AS (
  SELECT part_id, part_name
  FROM supplier_parts.parts
  WHERE part_name LIKE 'G%'
)
SELECT * FROM GParts;

-- 6. CTE to extract city from supplier address.
WITH SupplierCity AS (
  SELECT supplier_id,
         SUBSTRING(address,CHARINDEX(',',address)+2,CHARINDEX(',',address,CHARINDEX(',',address)+1)-CHARINDEX(',',address)-2) AS city
  FROM supplier_parts.suppliers
)
SELECT * FROM SupplierCity WHERE city = 'Anytown';

-- 7. CTE to tag parts as Cheap/Moderate/Expensive.
WITH PriceCategory AS (
  SELECT part_id,
         CASE 
           WHEN unit_price < 5 THEN 'Cheap'
           WHEN unit_price BETWEEN 5 AND 15 THEN 'Moderate'
           ELSE 'Expensive'
         END AS category
  FROM supplier_parts.parts
)
SELECT * FROM PriceCategory;

-- 8. CTE to list NULL-email suppliers.
WITH NoEmail AS (
  SELECT supplier_id, supplier_name
  FROM supplier_parts.suppliers
  WHERE contact_email IS NULL
)
SELECT * FROM NoEmail;

-- 9. CTE to compute price markup (+20%).
WITH Markup AS (
  SELECT part_id, part_name, unit_price * 1.2 AS price_markup
  FROM supplier_parts.parts
)
SELECT * FROM Markup WHERE price_markup > 20;

-- 10. CTE to find parts with description containing 'valve'.
WITH ValveParts AS (
  SELECT part_id, part_name, part_description
  FROM supplier_parts.parts
  WHERE part_description LIKE '%valve%'
)
SELECT * FROM ValveParts;
```

## Using Multiple CTEs
```sql
-- 1. CTE1 parts >10, CTE2 join to suppliers.
WITH ExpParts AS (
  SELECT part_id, supplier_id, unit_price
  FROM supplier_parts.parts
  WHERE unit_price > 10
), SupInfo AS (
  SELECT supplier_id, supplier_name
  FROM supplier_parts.suppliers
)
SELECT e.part_id, s.supplier_name, e.unit_price
FROM ExpParts e
JOIN SupInfo s ON e.supplier_id = s.supplier_id;

-- 2. CTE1 avg price, CTE2 count parts, then join.
WITH AvgP AS (
  SELECT supplier_id, AVG(unit_price) AS avg_price
  FROM supplier_parts.parts
  GROUP BY supplier_id
), CountP AS (
  SELECT supplier_id, COUNT(*) AS cnt
  FROM supplier_parts.parts
  GROUP BY supplier_id
)
SELECT a.supplier_id, a.avg_price, c.cnt
FROM AvgP a
JOIN CountP c ON a.supplier_id = c.supplier_id;

-- 3. CTE parts with 'G', CTE suppliers in Anytown, then cross join.
WITH GParts AS (
  SELECT part_id, part_name
  FROM supplier_parts.parts
  WHERE part_name LIKE 'G%'
), AnytownSup AS (
  SELECT supplier_id, supplier_name
  FROM supplier_parts.suppliers
  WHERE address LIKE '%Anytown%'
)
SELECT g.part_name, s.supplier_name
FROM GParts g
CROSS JOIN AnytownSup s;

-- 4. CTE of parts and CTE of markups, then union.
WITH PartsList AS (
  SELECT part_id, part_name FROM supplier_parts.parts
), MarkupList AS (
  SELECT part_id, CAST(unit_price*1.1 AS VARCHAR(10)) AS note FROM supplier_parts.parts
)
SELECT * FROM PartsList
UNION
SELECT * FROM MarkupList;

-- 5. CTE suppliers, CTE contact info, then join.
WITH Sup AS (
  SELECT supplier_id, supplier_name FROM supplier_parts.suppliers
), Contact AS (
  SELECT supplier_id, contact_email FROM supplier_parts.suppliers
)
SELECT s.supplier_name, c.contact_email
FROM Sup s
LEFT JOIN Contact c ON s.supplier_id = c.supplier_id;

-- 6. CTE for cheap parts, CTE for expensive parts.
WITH Cheap AS (
  SELECT part_id, part_name FROM supplier_parts.parts WHERE unit_price < 5
), Exp AS (
  SELECT part_id, part_name FROM supplier_parts.parts WHERE unit_price > 15
)
SELECT * FROM Cheap
UNION ALL
SELECT * FROM Exp;

-- 7. CTE for part lengths, CTE for supplier name lengths.
WITH PartLen AS (
  SELECT part_id, LEN(part_name) AS plen FROM supplier_parts.parts
), SupLen AS (
  SELECT supplier_id, LEN(supplier_name) AS slen FROM supplier_parts.suppliers
)
SELECT p.part_id, p.plen, s.slen
FROM PartLen p
JOIN SupLen s ON p.part_id = s.supplier_id;

-- 8. CTE of NULL-phone suppliers and CTE of NULL-description parts.
WITH NoPhone AS (
  SELECT supplier_id FROM supplier_parts.suppliers WHERE phone_number IS NULL
), NoDesc AS (
  SELECT part_id FROM supplier_parts.parts WHERE part_description IS NULL
)
SELECT * FROM NoPhone
EXCEPT
SELECT * FROM NoDesc;

-- 9. CTE parts by range, CTE average price, then filter.
WITH PriceRange AS (
  SELECT part_id, unit_price,
         CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END AS rng
  FROM supplier_parts.parts
), AvgAll AS (
  SELECT AVG(unit_price) AS avgp FROM supplier_parts.parts
)
SELECT p.*
FROM PriceRange p, AvgAll a
WHERE (p.rng='High' AND p.unit_price>a.avgp);

-- 10. CTE to list suppliers, CTE to list parts, then full join.
WITH S AS (
  SELECT supplier_id, supplier_name FROM supplier_parts.suppliers
), P AS (
  SELECT supplier_id, part_name FROM supplier_parts.parts
)
SELECT s.supplier_name, p.part_name
FROM S s
FULL JOIN P p ON s.supplier_id = p.supplier_id;
```

## Recursive CTEs
```sql
-- 1. Generate numbers 1 to 10.
WITH Numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM Numbers WHERE n<10
)
SELECT n FROM Numbers;

-- 2. List supplier IDs 1 to max id using Numbers.
WITH Numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n+1 FROM Numbers WHERE n< (SELECT MAX(supplier_id) FROM supplier_parts.suppliers)
)
SELECT n AS supplier_id
FROM Numbers;

-- 3. Compute running total of part prices by part_id.
WITH RunningTotal AS (
  SELECT part_id, unit_price, unit_price AS run_sum
  FROM supplier_parts.parts WHERE part_id=1
  UNION ALL
  SELECT p.part_id, p.unit_price, r.run_sum + p.unit_price
  FROM supplier_parts.parts p
  JOIN RunningTotal r ON p.part_id = r.part_id + 1
)
SELECT * FROM RunningTotal OPTION (MAXRECURSION 0);

-- 4. Generate factorial of 5.
WITH Fact AS (
  SELECT 1 AS num, 1 AS factorial
  UNION ALL
  SELECT num+1, factorial*(num+1) FROM Fact WHERE num<5
)
SELECT * FROM Fact;

-- 5. Generate price multiples 1× to 5× for part_id=1.
WITH Mult AS (
  SELECT 1 AS m, unit_price FROM supplier_parts.parts WHERE part_id=1
  UNION ALL
  SELECT m+1, unit_price FROM Mult WHERE m<5
)
SELECT m, unit_price*m AS price_mul FROM Mult;

-- 6. Build a hierarchy of suppliers by id.
WITH SupChain AS (
  SELECT supplier_id, supplier_name FROM supplier_parts.suppliers WHERE supplier_id=1
  UNION ALL
  SELECT s.supplier_id, s.supplier_name
  FROM supplier_parts.suppliers s
  JOIN SupChain sc ON s.supplier_id = sc.supplier_id + 1
)
SELECT * FROM SupChain;

-- 7. Generate date sequence for next 7 days from today.
WITH Dates AS (
  SELECT CAST(GETDATE() AS DATE) AS dt
  UNION ALL
  SELECT DATEADD(day,1,dt) FROM Dates WHERE dt<DATEADD(day,6,CAST(GETDATE() AS DATE))
)
SELECT dt FROM Dates OPTION (MAXRECURSION 0);

-- 8. Number parts sequentially.
WITH PartSeq AS (
  SELECT part_id, ROW_NUMBER() OVER (ORDER BY part_id) AS rn
  FROM supplier_parts.parts
  UNION ALL
  SELECT part_id, rn+1 FROM PartSeq WHERE rn< (SELECT COUNT(*) FROM supplier_parts.parts)
)
SELECT * FROM PartSeq OPTION (MAXRECURSION 0);

-- 9. Generate powers of 2 up to 2^5.
WITH Powers AS (
  SELECT 0 AS exp, 1 AS value
  UNION ALL
  SELECT exp+1, value*2 FROM Powers WHERE exp<5
)
SELECT * FROM Powers;

-- 10. Build a breadcrumb trail of supplier IDs.
WITH Trail AS (
  SELECT supplier_id, CAST(supplier_id AS VARCHAR(10)) AS path
  FROM supplier_parts.suppliers WHERE supplier_id=1
  UNION ALL
  SELECT s.supplier_id, t.path + '>' + CAST(s.supplier_id AS VARCHAR(10))
  FROM supplier_parts.suppliers s
  JOIN Trail t ON s.supplier_id = t.supplier_id + 1
)
SELECT * FROM Trail OPTION (MAXRECURSION 0);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
