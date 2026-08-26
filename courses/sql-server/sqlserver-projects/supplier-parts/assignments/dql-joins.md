![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. List all parts with their supplier names.
2. Show part_name and supplier_name for parts priced > 10.
3. Show part_id, part_name, and contact_email for all parts.
4. Show part_name and supplier contact_name.
5. Show part_name, supplier_name, unit_price for suppliers in 'Anytown, USA'.
6. List part_name and supplier phone_number.
7. List part_name with supplier address.
8. Show part_name and supplier_name for parts with unit_price BETWEEN 5 AND 15.
9. Show part_name and supplier_name for suppliers with name starting 'G'.
10. Show top 5 most expensive parts with supplier_name.

## Left Join (Left Outer Join)
1. List all suppliers and any parts they supply.
2. Show supplier_name and unit_price (NULL if no parts).
3. List suppliers and the count of parts they supply.
4. List suppliers and total unit_price of their parts.
5. List suppliers and average part name length.
6. List suppliers with parts priced > 15, showing NULL if none.
7. List suppliers and any part_description containing 'valve'.
8. Show suppliers and part_id (NULL if none).
9. List suppliers and distinct unit_price values.
10. Show suppliers and parts for supplier_id <= 3.

## Right Join (Right Outer Join)
1. List all parts and their suppliers (including parts without suppliers).
2. Show part_name and contact_email (NULL if supplier missing).
3. List parts with unit_price and supplier phone_number.
4. Show parts and supplier address.
5. List parts with no matching supplier (NULL supplier_name).
6. Show parts priced < 5 with supplier_name.
7. Show part_id, part_name, and supplier_id (NULL if none).
8. List parts and supplier_name for supplier_name LIKE 'P%'.
9. List parts and supplier_name for supplier_id > 5.
10. Show top 3 cheapest parts with supplier_name.

## Full Join (Full Outer Join)
1. List all suppliers and parts, matching where possible.
2. Show all part_name and contact_email pairs.
3. List all supplier_name and unit_price.
4. Show all suppliers with no parts and parts with no suppliers.
5. List all part_id and supplier_id pairs.
6. Show all part_name and supplier_address.
7. List all parts priced > 15 and suppliers without parts.
8. Show all suppliers with part_description containing 'gear' or suppliers without parts.
9. List all part_name and supplier_phone.
10. Show all part_name and supplier_name for supplier_id <= 2 or unmatched.

## Cross Join
1. List every combination of supplier_name and part_name.
2. Count total combinations of suppliers and parts.
3. List supplier_name and unit_price for all combinations.
4. Show combinations where part_id < 5.
5. List supplier_name and part_description combinations.
6. Show combinations where supplier_id = 1.
7. List combinations where unit_price > 15.
8. Show combinations limited to top 10 by part_id.
9. List supplier_name and rightmost two digits of unit_price for all combinations.
10. Show combinations where part_name LIKE 'G%' and supplier_name LIKE 'A%'.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
