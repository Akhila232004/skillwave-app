![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. Find parts priced exactly 12.49.
2. Find the supplier with supplier_id = 5.
3. Find parts with part_name = 'Gizmo'.
4. Find suppliers with contact_name = 'Jane Smith'.
5. Find parts where supplier_id = 3.
6. Find suppliers whose phone_number = '345-678-9012'.
7. Find parts with part_id = 20.
8. Find suppliers with supplier_name = 'Tech Components'.
9. Find parts where part_description = 'A handy doohickey'.
10. Find suppliers with address = '101 Oak St, Anytown, USA'.

## Inequality Operator (<>)
1. List parts not supplied by supplier_id 1.
2. List suppliers whose supplier_name <> 'Acme Corporation'.
3. List parts where unit_price <> 0.55.
4. List suppliers with contact_email <> 'jane.smith@globalparts.com'.
5. List parts where part_name <> 'Widget'.
6. List suppliers where address <> 'Anytown, USA'.
7. List parts where part_description <> 'Flow control valve'.
8. List suppliers with phone_number <> '678-901-2345'.
9. List parts where part_id <> 10.
10. List suppliers where supplier_id <> 2.

## IN Operator
1. Find suppliers with supplier_id IN (1,2,3).
2. Find parts with unit_price IN (8.99, 11.99, 14.99).
3. Find parts with supplier_id IN (4,5,6).
4. Find suppliers with contact_name IN ('John Doe','Emily Davis').
5. Find parts with part_id IN (7,8,9,10).
6. Find suppliers with supplier_name IN ('Precision Parts','Hardware Hub').
7. Find parts with part_description IN ('Metal mounting bracket','Toggle switch').
8. Find suppliers with phone_number IN ('789-012-3456','012-345-6789').
9. Find parts with unit_price IN (0.10,0.05,0.07).
10. Find suppliers with address IN ('303 Cedar St, Anytown, USA','404 Birch St, Anytown, USA').

## NOT IN Operator
1. Find suppliers with supplier_id NOT IN (8,9,10).
2. Find parts with supplier_id NOT IN (1,2).
3. Find parts with unit_price NOT IN (12.00,15.80).
4. Find suppliers with contact_name NOT IN ('Jessica Jones','David Wilson').
5. Find parts with part_id NOT IN (1,2,3,4).
6. Find suppliers with address NOT IN ('123 Main St, Anytown, USA').
7. Find parts with part_description NOT IN ('A mysterious thingamajig').
8. Find suppliers with phone_number NOT IN ('234-567-8901').
9. Find parts with unit_price NOT IN (0.55,0.90).
10. Find suppliers with supplier_name NOT IN ('Acme Corporation','Global Parts Inc.').

## LIKE Operator
1. Find parts where part_name LIKE 'G%'.
2. Find suppliers where supplier_name LIKE '%Parts%'.
3. Find parts where part_description LIKE '%valve%'.
4. Find suppliers where address LIKE '%Anytown%'.
5. Find parts where part_name LIKE '%o%'.
6. Find suppliers where contact_email LIKE '%@techcomponents.com'.
7. Find parts where part_description LIKE '_oz%'.
8. Find suppliers where contact_name LIKE 'J%'.
9. Find parts where part_name LIKE '%et'.
10. Find suppliers where phone_number LIKE '%-345-%'.

## NOT LIKE Operator
1. Find parts where part_name NOT LIKE 'G%'.
2. Find suppliers where supplier_name NOT LIKE '%Inc%'.
3. Find parts where part_description NOT LIKE '%rubber%'.
4. Find suppliers where address NOT LIKE '%St,%'.
5. Find parts where part_name NOT LIKE '%a%'.
6. Find suppliers where contact_email NOT LIKE '%@%'.
7. Find parts where part_description NOT LIKE '_or%'.
8. Find suppliers where contact_name NOT LIKE 'M%'.
9. Find parts where part_name NOT LIKE '%t'.
10. Find suppliers where phone_number NOT LIKE '___-___-____'.

## BETWEEN Operator
1. Find parts with unit_price BETWEEN 5 AND 10.
2. Find parts with part_id BETWEEN 10 AND 20.
3. Find parts with unit_price BETWEEN 0.50 AND 2.00.
4. Find suppliers with supplier_id BETWEEN 3 AND 6.
5. Find parts with unit_price BETWEEN 15 AND 20.
6. Find parts with part_id BETWEEN 25 AND 30.
7. Find parts with unit_price BETWEEN 8 AND 12.
8. Find suppliers with supplier_id BETWEEN 1 AND 4.
9. Find parts with unit_price BETWEEN 0.05 AND 0.10.
10. Find parts with part_id BETWEEN 40 AND 50.

## Greater Than (>)
1. Find parts with unit_price > 10.
2. Find suppliers with supplier_id > 5.
3. Find parts with part_id > 20.
4. Find parts with unit_price > 15.
5. Find suppliers with supplier_id > 2.
6. Find parts with unit_price > 0.75.
7. Find parts with part_id > 30.
8. Find suppliers with supplier_id > 8.
9. Find parts with unit_price > 5.
10. Find parts with part_id > 45.

## Greater Than or Equal To (>=)
1. Find parts with unit_price >= 12.00.
2. Find suppliers with supplier_id >= 7.
3. Find parts with part_id >= 15.
4. Find parts with unit_price >= 0.55.
5. Find suppliers with supplier_id >= 3.
6. Find parts with unit_price >= 8.60.
7. Find parts with part_id >= 25.
8. Find suppliers with supplier_id >= 10.
9. Find parts with unit_price >= 1.25.
10. Find parts with part_id >= 5.

## Less Than (<)
1. Find parts with unit_price < 5.
2. Find suppliers with supplier_id < 4.
3. Find parts with part_id < 10.
4. Find parts with unit_price < 1.00.
5. Find suppliers with supplier_id < 6.
6. Find parts with unit_price < 15.
7. Find parts with part_id < 20.
8. Find suppliers with supplier_id < 8.
9. Find parts with unit_price < 3.
10. Find parts with part_id < 30.

## Less Than or Equal To (<=)
1. Find parts with unit_price <= 10.
2. Find suppliers with supplier_id <= 5.
3. Find parts with part_id <= 15.
4. Find parts with unit_price <= 0.90.
5. Find suppliers with supplier_id <= 3.
6. Find parts with unit_price <= 8.60.
7. Find parts with part_id <= 25.
8. Find suppliers with supplier_id <= 9.
9. Find parts with unit_price <= 2.15.
10. Find parts with part_id <= 20.

## EXISTS Operator
1. Find suppliers that have at least one part.
2. Find parts for which the supplier exists.
3. Find suppliers with a part priced > 15.
4. Find parts whose supplier has contact_email ending with '.com'.
5. Find suppliers with a part_id between 10 and 20.
6. Find parts with unit_price < 5 whose supplier exists.
7. Find suppliers with a part_name LIKE '%Gear%'.
8. Find parts whose supplier_name = 'Quality Supplies'.
9. Find suppliers with a part_id IN (1,2,3).
10. Find parts for which the supplier has address LIKE '%Maple St%'.

## NOT EXISTS Operator
1. Find suppliers with no parts.
2. Find parts whose supplier record is missing.
3. Find suppliers without parts priced > 15.
4. Find parts whose supplier_email is NULL.
5. Find suppliers with no parts having part_name LIKE '%Device%'.
6. Find parts without a valid supplier phone_number.
7. Find suppliers with no parts in the price range 5–10.
8. Find parts whose supplier_name <> 'Global Parts Inc.'.
9. Find suppliers with no parts having part_id < 5.
10. Find parts whose supplier address NOT LIKE '%Anytown%'.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
