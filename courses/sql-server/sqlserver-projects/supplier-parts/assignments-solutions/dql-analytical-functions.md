![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Show part count per supplier alongside each part.
SELECT part_id, part_name,
       COUNT(*) OVER (PARTITION BY supplier_id) AS part_count_per_supplier
FROM supplier_parts.parts;
-- 2. Show average unit_price across all parts.
SELECT part_id, part_name, unit_price,
       AVG(unit_price) OVER () AS avg_price_all
FROM supplier_parts.parts;
-- 3. Show total value of parts per supplier.
SELECT part_id, supplier_id, unit_price,
       SUM(unit_price) OVER (PARTITION BY supplier_id) AS total_value_per_supplier
FROM supplier_parts.parts;
-- 4. Show min and max price across all parts.
SELECT part_id, part_name,
       MIN(unit_price) OVER () AS min_price_all,
       MAX(unit_price) OVER () AS max_price_all
FROM supplier_parts.parts;
-- 5. Show running total of prices ordered by part_id.
SELECT part_id, unit_price,
       SUM(unit_price) OVER (ORDER BY part_id) AS running_total
FROM supplier_parts.parts;
-- 6. Show cumulative average price ordered by part_id.
SELECT part_id, unit_price,
       AVG(unit_price) OVER (ORDER BY part_id ROWS UNBOUNDED PRECEDING) AS cum_avg
FROM supplier_parts.parts;
-- 7. Show each part’s percentage of total inventory value.
SELECT part_id, unit_price,
       100.0 * unit_price / SUM(unit_price) OVER () AS pct_of_total
FROM supplier_parts.parts;
-- 8. Show difference between each part’s price and its supplier’s average price.
SELECT part_id, supplier_id, unit_price,
       unit_price - AVG(unit_price) OVER (PARTITION BY supplier_id) AS diff_from_supplier_avg
FROM supplier_parts.parts;
-- 9. Show for each part the max price within its supplier.
SELECT part_id, supplier_id, unit_price,
       MAX(unit_price) OVER (PARTITION BY supplier_id) AS max_price_supplier
FROM supplier_parts.parts;
-- 10. Show for each part the count of parts priced above it.
SELECT part_id, unit_price,
       COUNT(*) OVER (ORDER BY unit_price DESC ROWS BETWEEN 1 FOLLOWING AND UNBOUNDED FOLLOWING) AS cheaper_count
FROM supplier_parts.parts;
```

## ROW_NUMBER()
```sql
-- 1. Assign a global row number to parts by price ascending.
SELECT part_id, part_name,
       ROW_NUMBER() OVER (ORDER BY unit_price) AS rn_price_asc
FROM supplier_parts.parts;
-- 2. Assign row numbers per supplier by descending price.
SELECT supplier_id, part_name,
       ROW_NUMBER() OVER (PARTITION BY supplier_id ORDER BY unit_price DESC) AS rn_sup_price_desc
FROM supplier_parts.parts;
-- 3. Assign row numbers to suppliers by name.
SELECT supplier_id, supplier_name,
       ROW_NUMBER() OVER (ORDER BY supplier_name) AS rn_sup_name
FROM supplier_parts.suppliers;
-- 4. Assign row numbers per first-letter-of-part partition.
SELECT part_id, part_name,
       ROW_NUMBER() OVER (PARTITION BY LEFT(part_name,1) ORDER BY part_name) AS rn_by_letter
FROM supplier_parts.parts;
-- 5. Assign row numbers per price range partition.
SELECT part_id, unit_price,
       ROW_NUMBER() OVER (PARTITION BY CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END ORDER BY unit_price) AS rn_by_range
FROM supplier_parts.parts;
-- 6. Assign row numbers per supplier ordered by part_id.
SELECT part_id, supplier_id,
       ROW_NUMBER() OVER (PARTITION BY supplier_id ORDER BY part_id) AS rn_by_id
FROM supplier_parts.parts;
-- 7. Assign row numbers to suppliers with email sorted by email.
SELECT supplier_id, contact_email,
       ROW_NUMBER() OVER (ORDER BY contact_email) AS rn_email
FROM supplier_parts.suppliers;
-- 8. Assign row numbers per city extracted from address.
SELECT supplier_id, address,
       ROW_NUMBER() OVER (PARTITION BY
         SUBSTRING(address,CHARINDEX(',',address)+2,
                   CHARINDEX(',',address,CHARINDEX(',',address)+1)-CHARINDEX(',',address)-2)
         ORDER BY supplier_id) AS rn_city
FROM supplier_parts.suppliers;
-- 9. Assign row numbers per descending description length.
SELECT part_id,
       ROW_NUMBER() OVER (ORDER BY LEN(part_description) DESC) AS rn_desc_len_desc
FROM supplier_parts.parts;
-- 10. Assign row numbers to parts by part_name ascending.
SELECT part_id, part_name,
       ROW_NUMBER() OVER (ORDER BY part_name) AS rn_name
FROM supplier_parts.parts;
```

## RANK()
```sql
-- 1. Rank parts by price descending.
SELECT part_id, unit_price,
       RANK() OVER (ORDER BY unit_price DESC) AS rank_price_desc
FROM supplier_parts.parts;
-- 2. Rank parts per supplier by price.
SELECT part_id, supplier_id, unit_price,
       RANK() OVER (PARTITION BY supplier_id ORDER BY unit_price DESC) AS rank_sup_price
FROM supplier_parts.parts;
-- 3. Rank suppliers by name.
SELECT supplier_id, supplier_name,
       RANK() OVER (ORDER BY supplier_name) AS rank_sup_name
FROM supplier_parts.suppliers;
-- 4. Rank parts by description length ascending.
SELECT part_id,
       RANK() OVER (ORDER BY LEN(part_description)) AS rank_desc_len
FROM supplier_parts.parts;
-- 5. Rank parts by unit_price, with ties.
SELECT part_id, unit_price,
       RANK() OVER (ORDER BY unit_price) AS rank_price
FROM supplier_parts.parts;
-- 6. Rank suppliers by number of parts.
SELECT supplier_id,
       RANK() OVER (ORDER BY COUNT(part_id) OVER (PARTITION BY supplier_id) DESC) AS rank_by_partcount
FROM supplier_parts.parts;
-- 7. Rank parts per price range partition.
SELECT part_id, unit_price,
       RANK() OVER (PARTITION BY CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END ORDER BY unit_price) AS rank_range
FROM supplier_parts.parts;
-- 8. Rank suppliers by address alphabetically.
SELECT supplier_id, address,
       RANK() OVER (ORDER BY address) AS rank_address
FROM supplier_parts.suppliers;
-- 9. Rank parts per first-letter-of-name.
SELECT part_id, part_name,
       RANK() OVER (PARTITION BY LEFT(part_name,1) ORDER BY part_name) AS rank_letter
FROM supplier_parts.parts;
-- 10. Rank parts by unit_price descending showing gaps.
SELECT part_id, unit_price,
       RANK() OVER (ORDER BY unit_price DESC) AS rank_gap
FROM supplier_parts.parts;
```

## DENSE_RANK()
```sql
-- 1. Dense rank parts by price descending.
SELECT part_id, unit_price,
       DENSE_RANK() OVER (ORDER BY unit_price DESC) AS dr_price_desc
FROM supplier_parts.parts;
-- 2. Dense rank per supplier by price.
SELECT part_id, supplier_id, unit_price,
       DENSE_RANK() OVER (PARTITION BY supplier_id ORDER BY unit_price) AS dr_sup_price
FROM supplier_parts.parts;
-- 3. Dense rank suppliers by name.
SELECT supplier_id, supplier_name,
       DENSE_RANK() OVER (ORDER BY supplier_name) AS dr_sup_name
FROM supplier_parts.suppliers;
-- 4. Dense rank parts by description length.
SELECT part_id,
       DENSE_RANK() OVER (ORDER BY LEN(part_description)) AS dr_desc_len
FROM supplier_parts.parts;
-- 5. Dense rank parts by price with no gaps.
SELECT part_id, unit_price,
       DENSE_RANK() OVER (ORDER BY unit_price) AS dr_price
FROM supplier_parts.parts;
-- 6. Dense rank parts per price range.
SELECT part_id, unit_price,
       DENSE_RANK() OVER (PARTITION BY CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END ORDER BY unit_price) AS dr_range
FROM supplier_parts.parts;
-- 7. Dense rank suppliers by contact_name.
SELECT supplier_id, contact_name,
       DENSE_RANK() OVER (ORDER BY contact_name) AS dr_contact
FROM supplier_parts.suppliers;
-- 8. Dense rank parts per first-letter partition.
SELECT part_id, part_name,
       DENSE_RANK() OVER (PARTITION BY LEFT(part_name,1) ORDER BY part_name) AS dr_letter
FROM supplier_parts.parts;
-- 9. Dense rank parts by unit_price descending.
SELECT part_id, unit_price,
       DENSE_RANK() OVER (ORDER BY unit_price DESC) AS dr_price_desc2
FROM supplier_parts.parts;
-- 10. Dense rank suppliers by phone_number.
SELECT supplier_id, phone_number,
       DENSE_RANK() OVER (ORDER BY phone_number) AS dr_phone
FROM supplier_parts.suppliers;
```

## NTILE(n)
```sql
-- 1. Divide parts into 4 quartiles by price.
SELECT part_id, unit_price,
       NTILE(4) OVER (ORDER BY unit_price) AS quartile
FROM supplier_parts.parts;
-- 2. Divide parts into 3 groups by price.
SELECT part_id, unit_price,
       NTILE(3) OVER (ORDER BY unit_price) AS tertile
FROM supplier_parts.parts;
-- 3. Divide parts per supplier into 2 halves by price.
SELECT part_id, supplier_id, unit_price,
       NTILE(2) OVER (PARTITION BY supplier_id ORDER BY unit_price) AS half_group
FROM supplier_parts.parts;
-- 4. Divide suppliers into 4 groups by name.
SELECT supplier_id, supplier_name,
       NTILE(4) OVER (ORDER BY supplier_name) AS name_quartile
FROM supplier_parts.suppliers;
-- 5. Divide parts into 5 groups by description length.
SELECT part_id, LEN(part_description) AS desc_len,
       NTILE(5) OVER (ORDER BY LEN(part_description)) AS desc_bucket
FROM supplier_parts.parts;
-- 6. Divide parts into 10 groups by part_id.
SELECT part_id,
       NTILE(10) OVER (ORDER BY part_id) AS id_decile
FROM supplier_parts.parts;
-- 7. Divide parts per price range into 4 tiles.
SELECT part_id, unit_price,
       NTILE(4) OVER (PARTITION BY CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END ORDER BY unit_price) AS range_tile
FROM supplier_parts.parts;
-- 8. Divide suppliers into 2 groups by email presence.
SELECT supplier_id, contact_email,
       NTILE(2) OVER (ORDER BY CASE WHEN contact_email IS NULL THEN 0 ELSE 1 END) AS email_tile
FROM supplier_parts.suppliers;
-- 9. Divide parts into 3 groups by supplier count size.
SELECT part_id, supplier_id,
       NTILE(3) OVER (ORDER BY COUNT(*) OVER (PARTITION BY supplier_id)) AS sup_count_tile
FROM supplier_parts.parts;
-- 10. Divide parts into 4 groups by unit_price descending.
SELECT part_id, unit_price,
       NTILE(4) OVER (ORDER BY unit_price DESC) AS quartile_desc
FROM supplier_parts.parts;
```

## LAG()
```sql
-- 1. Show previous part’s price ordered by part_id.
SELECT part_id, unit_price,
       LAG(unit_price) OVER (ORDER BY part_id) AS prev_price
FROM supplier_parts.parts;
-- 2. Show previous part name and price.
SELECT part_id, part_name,
       LAG(part_name) OVER (ORDER BY part_id) AS prev_name
FROM supplier_parts.parts;
-- 3. Show previous price within each supplier.
SELECT part_id, supplier_id, unit_price,
       LAG(unit_price) OVER (PARTITION BY supplier_id ORDER BY unit_price) AS prev_sup_price
FROM supplier_parts.parts;
-- 4. Show two rows back price.
SELECT part_id, unit_price,
       LAG(unit_price,2) OVER (ORDER BY part_id) AS prev2_price
FROM supplier_parts.parts;
-- 5. Show previous part_id within supplier.
SELECT part_id, supplier_id,
       LAG(part_id) OVER (PARTITION BY supplier_id ORDER BY part_id) AS prev_sup_id
FROM supplier_parts.parts;
-- 6. Show previous supplier’s name ordered by supplier_id.
SELECT supplier_id, supplier_name,
       LAG(supplier_name) OVER (ORDER BY supplier_id) AS prev_sup_name
FROM supplier_parts.suppliers;
-- 7. Show previous description within each supplier.
SELECT part_id, part_description,
       LAG(part_description) OVER (PARTITION BY supplier_id ORDER BY part_id) AS prev_desc
FROM supplier_parts.parts;
-- 8. Show previous unit_price, default 0 if none.
SELECT part_id, unit_price,
       LAG(unit_price,1,0) OVER (ORDER BY part_id) AS prev_price_or_zero
FROM supplier_parts.parts;
-- 9. Show previous contact_email for suppliers.
SELECT supplier_id, contact_email,
       LAG(contact_email) OVER (ORDER BY supplier_id) AS prev_email
FROM supplier_parts.suppliers;
-- 10. Show previous price when price >5.
SELECT part_id, unit_price,
       LAG(unit_price) OVER (ORDER BY CASE WHEN unit_price>5 THEN part_id ELSE NULL END) AS prev_high_price
FROM supplier_parts.parts;
```

## LEAD()
```sql
-- 1. Show next part’s price ordered by part_id.
SELECT part_id, unit_price,
       LEAD(unit_price) OVER (ORDER BY part_id) AS next_price
FROM supplier_parts.parts;
-- 2. Show next part name.
SELECT part_id, part_name,
       LEAD(part_name) OVER (ORDER BY part_id) AS next_name
FROM supplier_parts.parts;
-- 3. Show next price within each supplier.
SELECT part_id, supplier_id, unit_price,
       LEAD(unit_price) OVER (PARTITION BY supplier_id ORDER BY unit_price) AS next_sup_price
FROM supplier_parts.parts;
-- 4. Show two rows ahead part_name.
SELECT part_id, part_name,
       LEAD(part_name,2) OVER (ORDER BY part_id) AS next2_name
FROM supplier_parts.parts;
-- 5. Show next part_id within supplier.
SELECT part_id, supplier_id,
       LEAD(part_id) OVER (PARTITION BY supplier_id ORDER BY part_id) AS next_sup_id
FROM supplier_parts.parts;
-- 6. Show next supplier_name.
SELECT supplier_id, supplier_name,
       LEAD(supplier_name) OVER (ORDER BY supplier_id) AS next_sup_name
FROM supplier_parts.suppliers;
-- 7. Show next description per supplier.
SELECT part_id, part_description,
       LEAD(part_description) OVER (PARTITION BY supplier_id ORDER BY part_id) AS next_desc
FROM supplier_parts.parts;
-- 8. Show next unit_price, default NULL.
SELECT part_id, unit_price,
       LEAD(unit_price,1,NULL) OVER (ORDER BY part_id) AS next_price_or_null
FROM supplier_parts.parts;
-- 9. Show next contact_email.
SELECT supplier_id, contact_email,
       LEAD(contact_email) OVER (ORDER BY supplier_id) AS next_email
FROM supplier_parts.suppliers;
-- 10. Show next high-priced part’s price.
SELECT part_id, unit_price,
       LEAD(unit_price) OVER (ORDER BY CASE WHEN unit_price>15 THEN part_id ELSE NULL END) AS next_high_price
FROM supplier_parts.parts;
```

## FIRST_VALUE()
```sql
-- 1. Show first part price overall.
SELECT part_id, unit_price,
       FIRST_VALUE(unit_price) OVER (ORDER BY part_id) AS first_price
FROM supplier_parts.parts;
-- 2. Show first part_name per supplier.
SELECT part_id, supplier_id,
       FIRST_VALUE(part_name) OVER (PARTITION BY supplier_id ORDER BY part_id) AS first_part_name
FROM supplier_parts.parts;
-- 3. Show first supplier_name overall.
SELECT supplier_id, supplier_name,
       FIRST_VALUE(supplier_name) OVER (ORDER BY supplier_id) AS first_sup_name
FROM supplier_parts.suppliers;
-- 4. Show first price in each price range.
SELECT part_id, unit_price,
       FIRST_VALUE(unit_price) OVER (
         PARTITION BY CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END
         ORDER BY unit_price) AS first_range_price
FROM supplier_parts.parts;
-- 5. Show first contact_email ordered by supplier_name.
SELECT supplier_id, contact_email,
       FIRST_VALUE(contact_email) OVER (ORDER BY supplier_name) AS first_email
FROM supplier_parts.suppliers;
-- 6. Show first part_description per supplier.
SELECT part_id, supplier_id,
       FIRST_VALUE(part_description) OVER (PARTITION BY supplier_id ORDER BY part_id) AS first_desc
FROM supplier_parts.parts;
-- 7. Show first high-priced part overall.
SELECT part_id, unit_price,
       FIRST_VALUE(unit_price) OVER (ORDER BY CASE WHEN unit_price>15 THEN part_id ELSE NULL END) AS first_high_price
FROM supplier_parts.parts;
-- 8. Show first supplier_address overall.
SELECT supplier_id, address,
       FIRST_VALUE(address) OVER (ORDER BY supplier_id) AS first_address
FROM supplier_parts.suppliers;
-- 9. Show first part_id per supplier.
SELECT part_id, supplier_id,
       FIRST_VALUE(part_id) OVER (PARTITION BY supplier_id ORDER BY part_id) AS first_id
FROM supplier_parts.parts;
-- 10. Show first unit_price per description length group.
SELECT part_id, LEN(part_description) AS desc_len,
       FIRST_VALUE(unit_price) OVER (PARTITION BY LEN(part_description) ORDER BY unit_price) AS first_by_len
FROM supplier_parts.parts;
```

## LAST_VALUE()
```sql
-- 1. Show last part price overall.
SELECT part_id, unit_price,
       LAST_VALUE(unit_price) OVER (ORDER BY part_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_price
FROM supplier_parts.parts;
-- 2. Show last part_name per supplier.
SELECT part_id, supplier_id,
       LAST_VALUE(part_name) OVER (
         PARTITION BY supplier_id ORDER BY part_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_part_name
FROM supplier_parts.parts;
-- 3. Show last supplier_name overall.
SELECT supplier_id, supplier_name,
       LAST_VALUE(supplier_name) OVER (
         ORDER BY supplier_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_sup_name
FROM supplier_parts.suppliers;
-- 4. Show last price in each price range.
SELECT part_id, unit_price,
       LAST_VALUE(unit_price) OVER (
         PARTITION BY CASE WHEN unit_price<10 THEN 'Low' ELSE 'High' END
         ORDER BY unit_price
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_range_price
FROM supplier_parts.parts;
-- 5. Show last contact_email ordered by supplier_name.
SELECT supplier_id, contact_email,
       LAST_VALUE(contact_email) OVER (
         ORDER BY supplier_name
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_email
FROM supplier_parts.suppliers;
-- 6. Show last part_description per supplier.
SELECT part_id, supplier_id,
       LAST_VALUE(part_description) OVER (
         PARTITION BY supplier_id ORDER BY part_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_desc
FROM supplier_parts.parts;
-- 7. Show last high-priced part overall.
SELECT part_id, unit_price,
       LAST_VALUE(unit_price) OVER (
         ORDER BY CASE WHEN unit_price>15 THEN part_id ELSE NULL END
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_high_price
FROM supplier_parts.parts;
-- 8. Show last supplier_address overall.
SELECT supplier_id, address,
       LAST_VALUE(address) OVER (
         ORDER BY supplier_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_address
FROM supplier_parts.suppliers;
-- 9. Show last part_id per supplier.
SELECT part_id, supplier_id,
       LAST_VALUE(part_id) OVER (
         PARTITION BY supplier_id ORDER BY part_id
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_id
FROM supplier_parts.parts;
-- 10. Show last unit_price per description length group.
SELECT part_id, LEN(part_description) AS desc_len,
       LAST_VALUE(unit_price) OVER (
         PARTITION BY LEN(part_description) ORDER BY unit_price
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_by_len
FROM supplier_parts.parts;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
