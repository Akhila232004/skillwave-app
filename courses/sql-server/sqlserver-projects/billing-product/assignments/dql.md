![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments

## Select
1. List all products.
2. Retrieve only product_name and price for every product.
3. Show customer_id and customer_name for all customers.
4. Display bill_id, bill_date and total_amount from all bills.
5. Show every column from billdetails.
6. List each line item’s billdetail_id, product_name and line_total.
7. Show customer_name with each bill_date.
8. List distinct customer_id values from the bill table.
9. Concatenate customer_name and contact_info into one column called contact_card.
10. Show product_name, price, and (price * 2) as double_price.

## WHERE
1. List products priced above 500.
2. List products with price between 100 and 500.
3. Find customers whose names start with 'J'.
4. Show bills issued after June 1, 2023.
5. List bills where total_amount is at least 1000.
6. Show billdetails having quantity greater than 2.
7. List billdetails where line_total is less than the product’s price.
8. Show all bills for customer_id = 3.
9. Find products whose name contains 'phone'.
10. List billdetails for bills in March 2023.

## GROUP BY
1. Count total number of products.
2. Count how many bills each customer has.
3. Sum total_amount per customer.
4. Sum of line_total by product (show product_name).
5. Count line items per bill.
6. Total quantity sold per product_id.
7. Average line_total per bill.
8. Count distinct products per bill.
9. Sum of total_amount per month.
10. Count of customers.

## HAVING
1. Customers having more than 2 bills.
2. Products billed more than 5 times.
3. Bills where sum of line_total > 1000.
4. Customers whose total billed amount > 5000.
5. Products with average line_total > 300.
6. Months with more than 3 bills.
7. Bills containing more than 3 distinct products.
8. Customers with any single bill > 2000.
9. Products whose total quantity sold > 10.
10. Customers with between 2 and 5 bills.

## ORDER BY
1. Products ordered by price ascending.
2. Products ordered by price descending.
3. Customers sorted alphabetically by name.
4. Bills sorted by bill_date newest first.
5. Bills sorted by total_amount lowest first.
6. Billdetails sorted by line_total descending.
7. Products sorted by price ASC, then product_name DESC.
8. Bills ordered by customer_id, then bill_date.
9. Billdetails ordered by bill_id ASC, quantity DESC.
10. Customers ordered by LEN(customer_name) descending.

## TOP
1. Top 5 most expensive products.
2. Top 3 customers by number of bills.
3. Top 5 bills by total_amount.
4. Top 10 billdetails by line_total.
5. The single product with the highest price.
6. Top 5 products by total quantity sold.
7. Top 3 customers by total billed amount.
8. Top 5 most recent bills.
9. Top 5 customers alphabetically.
10. Top 2 bills for customer_id = 1 by bill_date.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
