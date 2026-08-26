![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. Combine all product_ids and customer_ids into one list of IDs.
2. Combine all bill_ids and billdetail_ids into one list of IDs.
3. List all distinct names from products and customers.
4. List all IDs from products and billdetails (product_id union billdetail_id).
5. All (year, month) combinations from bills and billdetails.
6. Combine product_ids priced over 200 and product_ids with line_total over 200.
7. List of customers with customer_id<6 together with customers having bills.
8. All unique total_amount values from bill and line_total from billdetails.
9. Years with bills vs years with billdetails.
10. Union of product_ids priced <=100 and those priced >=500.

## Intersect
1. IDs present both as product_id and customer_id.
2. bill_ids that have corresponding details.
3. Names present in both products and customers.
4. Months in which both bills and billdetails exist.
5. product_ids priced above avg(price) and with line_total above avg(line_total).
6. customer_ids billed in Q1 and also in Q2 of 2023.
7. product_ids sold in both bill 1 and bill 2.
8. customers with id≤5 who also have at least one bill.
9. total_amount values appearing in both bill and line_total.
10. Years in both bills and billdetails.

## Except
1. product_ids of products never sold.
2. customer_ids of customers with no bills.
3. bill_ids that have no details.
4. billdetail_ids that do not match any bill.
5. product_ids priced ≤100 that have no line_total ≤100.
6. customers ≤id 5 with no bills in H1-2023.
7. total_amount values in bills never seen as line_total.
8. months with bills but no billdetails.
9. product_ids ≥200 that have not been sold.
10. customers with bills but none in Q3-2023.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
