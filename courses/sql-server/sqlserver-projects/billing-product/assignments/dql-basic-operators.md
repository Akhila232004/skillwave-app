![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. Products priced exactly 100.00
2. Customers with customer_id = 5
3. Bills for customer_id = 3
4. Billdetails for product_id = 2
5. Products named 'Laptop'
6. Customers named 'Jane Smith'
7. Bills on '2023-04-15'
8. Billdetails where quantity = 5
9. Bills totaling 1200.00
10. Product with product_id = 10

## Inequality Operator (<>)
1. Products not priced 100.00
2. Customers except customer_id = 1
3. Bills not for customer_id = 3
4. Billdetails for products other than product_id = 2
5. Products not named 'Mouse'
6. Customers whose contact_info is not 'jane.smith@example.com'
7. Bills not totaling 2150.00
8. Billdetails where quantity <> 1
9. Bills not on '2023-06-25'
10. Products not priced 500.00

## IN Operator
1. Products with IDs in (1,2,3)
2. Customers with IDs in (1,3,5,7)
3. Bills with bill_id in (2,4,6,8)
4. Billdetails for bills 1,2,3
5. Products priced in (100.00,200.00,300.00)
6. Customers named 'John Doe' or 'Emily Davis'
7. Bills totaling 800.00, 1100.00 or 1200.00
8. Billdetails for products 4,5,6
9. Bills issued in months Jan(1), Apr(4), Jul(7)
10. Customers whose contact_info domain is example.com or gmail.com

## NOT IN Operator
1. Products with IDs not in (1,2,3)
2. Customers with IDs not in (1,5,9)
3. Bills with bill_id not in (1,3,5)
4. Billdetails with detail IDs not in (1,2,3,4)
5. Products not priced 50.00 or 150.00
6. Customers not named 'Michael Johnson' or 'Sarah Taylor'
7. Bills for customers not in (2,4,6)
8. Billdetails with quantity not 1 or 2
9. Bills not in year 2023
10. Products whose names are not 'Laptop' or 'Monitor'

## LIKE Operator
1. Products containing 'phone'
2. Customers whose name starts with 'J'
3. Bills where total_amount begins with '1'
4. Billdetails where line_total ends with '00'
5. Products ending in 'ouse' (e.g. Mouse)
6. Customers with email at example.com
7. Bills issued in July 2023
8. Billdetails with quantity two-digit
9. Products ending with 'Drive'
10. Customers whose name contains 'a'

## NOT LIKE Operator
1. Products not containing 'phone'
2. Customers whose name does not start with 'J'
3. Bills where total_amount does not begin with '2'
4. Billdetails where line_total does not end with '50'
5. Products not starting with 'M'
6. Customers without example.com email
7. Bills not in 2023
8. Billdetails where quantity is not two-digit
9. Products without letter 'a'
10. Customers whose name is not 'Smith'

## BETWEEN Operator
1. Products priced between 100 and 500
2. Bills dated between '2023-03-01' and '2023-06-30'
3. Billdetails with quantity between 2 and 5
4. Bills totaling between 1000 and 2000
5. Customers with IDs between 5 and 10
6. Products with IDs between 3 and 7
7. Billdetails with line_total between 200 and 1000
8. Bills in months April(4) to August(8)
9. Products priced between 30 and 150
10. Billdetails with quantity between 1 and 3

## Greater Than (>)
1. Products priced above 500
2. Bills totaling more than 1500
3. Billdetails with quantity > 2
4. Bills issued after '2023-05-01'
5. Products with product_id > 5
6. Customers with customer_id > 10
7. Billdetails where line_total > 300
8. Bills for customers with ID > 3
9. Products priced above the average price
10. Bills totaling above the average total_amount

## Greater Than or Equal To (>=)
1. Products priced at least 500
2. Bills totaling at least 1000
3. Billdetails with quantity >= 1
4. Bills issued on or after '2023-07-01'
5. Products with product_id >= 7
6. Customers with customer_id >= 5
7. Billdetails where line_total >= 150
8. Bills for customers with ID >= 2
9. Products priced at least 200
10. Billdetails with quantity at least 10

## Less Than (<)
1. Products priced below 500
2. Bills totaling less than 1000
3. Billdetails with quantity < 2
4. Bills issued before '2023-05-01'
5. Products with product_id < 5
6. Customers with customer_id < 5
7. Billdetails where line_total < 300
8. Bills for customers with ID < 3
9. Products priced below average price
10. Bills totaling less than the maximum total_amount

## Less Than or Equal To (<=)
1. Products priced up to 500
2. Bills totaling up to 1200
3. Billdetails with quantity <= 1
4. Bills issued on or before '2023-08-01'
5. Products with product_id <= 10
6. Customers with customer_id <= 10
7. Billdetails where line_total <= 200
8. Bills for customers with ID <= 4
9. Products priced at most 150
10. Billdetails with quantity up to 5

## EXISTS Operator
1. Customers having at least one bill
2. Products that have been sold at least once
3. Bills with at least one line item quantity > 2
4. Products sold in bill 1
5. Customers with bills in March 2023
6. Bills containing product_id = 1
7. Products with any line_total > 500
8. Customers with any bill > 2000
9. Bills having at least one item priced > 300
10. Products with quantity sold >= 5 in any bill

## NOT EXISTS Operator
1. Customers with no bills
2. Products never sold
3. Bills with no line items
4. Customers without bills after June 1, 2023
5. Products with no line_total above 200
6. Bills without any item quantity > 3
7. Products with no sales of quantity >= 2
8. Customers with no bills under 1000
9. Billdetails without a matching bill (FK test)
10. Billdetails without a matching product (FK test)

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
