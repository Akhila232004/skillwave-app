![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. List each billdetail with its bill date.
2. Show each billdetail alongside product name and price.
3. List all bills with customer name and total amount.
4. Find customers who have at least one bill.
5. Show sold products (product_name) and the billdetail IDs.
6. Combine billdetails, bills, customers, and products.
7. Billdetails for March 2023 with product names.
8. Count line items per bill.
9. Unique customer–product pairs they purchased.
10. Total quantity purchased by each customer.

## Left Join (Left Outer Join)
1. All customers and their bills (NULL if no bills).
2. All products and their billdetails (NULL if unsold).
3. All bills with customer info (NULL if no customer).
4. All billdetails with product info (NULL if product missing).
5. Bills, details, and product names (NULLs where no match).
6. Customers and every product (NULL if not purchased).
7. Bills and number of line items (zero shows as NULL).
8. Products and total quantity sold (NULL if none).
9. Customers with their last bill date (NULL if none).
10. Bills in July 2023 with product names (NULL if no details).

## Right Join (Right Outer Join)
1. All customers and their bill IDs (via RIGHT JOIN).
2. All bills and their line items (NULL if none).
3. All products with sales details (NULL if none).
4. All customers with total billed (NULL if none).
5. All bills with customer contact info (NULL if no customer).
6. Product names and billdetail IDs (ensure all products).
7. Count of bills per customer (zero for none).
8. Bills in July 2023 with or without line items.
9. Products priced ≥200 with or without sales.
10. Customers and sum of quantities (NULL if none).

## Full Join (Full Outer Join)
1. All customers and bills, matching where possible.
2. All products and billdetails, matching where possible.
3. All bills and details, matching where possible.
4. All bills and customers, matching where possible.
5. Customers linked to details via bills (NULLs if no match).
6. Products linked to bills via details (NULLs if no match).
7. Full chain: customers → bills → details → products.
8. All total_amount vs. line_total values, matching on equality.
9. Aggregate totals per customer vs. per product.
10. All customers and all products, whether purchased or not.

## Cross Join
1. All possible customer–product pairs.
2. Every bill paired with every product.
3. Every customer paired with every bill.
4. Every bill paired with every billdetail.
5. Every product paired with every billdetail.
6. All customer–bill–product triples (two cross joins).
7. All customer–product combinations they haven’t purchased.
8. All month–year combinations present in bills.
9. All product_name–customer_name pairs for a promo list.
10. Cartesian product of bill IDs and line totals.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
