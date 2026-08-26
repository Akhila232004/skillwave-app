![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Running total of bill total_amount ordered by bill_date
2. Running average of total_amount over last 2 bills
3. Sum of line_total partitioned by bill_id
4. Average line_total partitioned by product_id
5. Cumulative sum of total_amount per customer ordered by bill_date
6. Cumulative max of total_amount across all bills
7. Cumulative min line_total partitioned by product_id
8. Count of billdetails per product using window function
9. Overall sum and average price of products
10. Count of bills per month using window

## ROW_NUMBER()
1. Row number of bills ordered by bill_date
2. Row number per customer ordered by bill_date
3. Row number of products ordered by price desc
4. Row number per bill for billdetails by line_total desc
5. Sequential row numbers for billdetails
6. Row number of customers by name
7. Row number partitioned by month of bill_date
8. Row number of line items overall by line_total
9. Row number per product partition by billdetails ordered by quantity
10. Row number for bills with highest total_amount first

## RANK()
1. Rank bills by total_amount desc
2. Rank products by price desc
3. Rank customers by number of bills
4. Rank billdetails within each bill by line_total
5. Rank bills per customer by total_amount
6. Rank products by total quantity sold
7. Rank months by total sales
8. Rank line items globally by line_total
9. Rank customers by average bill amount
10. Rank products by average line_total

## DENSE_RANK()
1. Dense rank bills by total_amount desc
2. Dense rank products by price desc
3. Dense rank customers by bill count
4. Dense rank billdetails within bill
5. Dense rank products by sales quantity
6. Dense rank months by sales
7. Dense rank customers by average bill
8. Dense rank line items by value
9. Dense rank bills by date (earliest first)
10. Dense rank products by length of name

## NTILE(n)
1. Divide bills into 4 quartiles by total_amount
2. Divide customers into 3 buckets by total bills
3. Divide products into 5 buckets by price
4. Divide billdetails into 4 buckets by line_total
5. Divide bills into 2 halves by date
6. Divide customers into 4 segments by average bill
7. Divide products into 3 segments by quantity sold
8. Divide months into 4 quarters by sales
9. Divide line items into 10 deciles by quantity
10. Divide bills into buckets by customer count

## LAG()
1. Previous bill amount for each bill ordered by date
2. Previous bill date per customer
3. Previous line_total per bill
4. Previous quantity per product
5. Difference from previous bill amount
6. Previous bill_id
7. Previous product price
8. Previous customer's contact_info
9. Previous quantity in all details
10. Previous line_total per product partition

## LEAD()
1. Next bill amount for each bill ordered by date
2. Next bill date per customer
3. Next line_total per bill
4. Next quantity per product
5. Difference to next bill amount
6. Next bill_id in sequence
7. Next product price ordered by price
8. Next customer's contact_info alphabetically
9. Next quantity overall
10. Next line_total partitioned by product

## FIRST_VALUE()
1. First bill_date per customer
2. First total_amount per customer
3. First line_total per bill
4. First quantity per product
5. First product_name alphabetically
6. First billdetail_id per bill
7. First product price in ascending order
8. First customer contact_info alphabetically
9. First bill_id per month
10. First line_total overall

## LAST_VALUE()
1. Last bill_date per customer
2. Last total_amount per customer
3. Last line_total per bill
4. Last quantity per product
5. Last product_name alphabetically
6. Last billdetail_id per bill
7. Last product price in ascending order
8. Last customer contact_info alphabetically
9. Last bill_id per month
10. Last line_total overall

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
