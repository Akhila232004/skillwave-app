![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments

## Select
1. Retrieve all columns from the parts table.
2. Retrieve part_id and part_name from the parts table.
3. Retrieve supplier_name and contact_email from the suppliers table.
4. Retrieve part_name, unit_price, and supplier_id for all parts.
5. Retrieve distinct supplier_id values from the parts table.
6. Retrieve part_name and the length of part_name as name_length.
7. Retrieve supplier_name in uppercase.
8. Retrieve part_name and calculate unit_price with 10% markup as price_markup.
9. Retrieve supplier_name concatenated with contact_name as contact_info.
10. Retrieve part_name and current date for each part.

## WHERE
1. List parts with unit_price > 10.
2. List parts with unit_price BETWEEN 5 AND 15.
3. List parts with part_name containing the letter 'a'.
4. List suppliers located in 'Anytown, USA'.
5. List suppliers whose name starts with 'A'.
6. List parts with unit_price IN specific values (8.99, 11.99, 12.49).
7. List parts where supplier_id IS NOT NULL.
8. List suppliers with a missing contact_email.
9. List parts where part_description contains 'useful'.
10. List suppliers with phone_number starting with '234-'.

## GROUP BY
1. Count parts per supplier.
2. Average unit_price per supplier.
3. Sum of unit_price per supplier.
4. Maximum unit_price per supplier.
5. Minimum unit_price per supplier.
6. Count distinct unit_price per supplier.
7. Total number of suppliers per address.
8. Average name_length of parts per supplier.
9. Sum of unit_price for parts costing more than 10 per supplier.
10. Count parts per supplier ordered by count.

## HAVING
1. Suppliers with more than 3 parts.
2. Suppliers with average unit_price greater than 15.
3. Suppliers with minimum unit_price less than 5.
4. Suppliers with distinct unit_price count greater than 5.
5. Suppliers whose total value of parts exceeds 100.
6. Suppliers where average part_name length is greater than 7.
7. Suppliers with part count between 2 and 5.
8. Suppliers with a maximum unit_price equal to 19.99.
9. Suppliers where count of parts priced over 10 is more than 3.
10. Addresses with more than one supplier.

## ORDER BY
1. List all parts ordered by unit_price ascending.
2. List all suppliers ordered by supplier_name descending.
3. List part_name and unit_price ordered by unit_price descending.
4. List parts with unit_price > 10 ordered by unit_price ascending.
5. List suppliers ordered by the length of their names.
6. List part_name and markup (10% over unit_price) ordered by markup descending.
7. List suppliers ordered by address then supplier_name.
8. List parts ordered by name length then unit_price.
9. List parts for supplier_id = 2 ordered by unit_price descending.
10. List top 5 most expensive parts (using ORDER BY without TOP clause).

## TOP
1. Retrieve top 5 most expensive parts.
2. Retrieve top 3 cheapest parts.
3. Retrieve top 5 suppliers by name ascending.
4. Retrieve top 10 parts for supplier_id = 1 ordered by unit_price descending.
5. Retrieve top 5 parts by highest 20% markup potential.
6. Retrieve top 5 parts by descending part_name length.
7. Retrieve top 5 suppliers with the longest names.
8. Retrieve top 3 suppliers by number of parts provided.
9. Retrieve top 3 addresses by supplier count.
10. Retrieve top 5 parts with highest fractional cents (rightmost two digits).

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
