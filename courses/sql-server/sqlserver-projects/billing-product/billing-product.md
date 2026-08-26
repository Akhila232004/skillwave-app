![SQL Server Tinitiate Image](../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](../README.md)

# Billing Product Data Model
The `products` table stores information about the products that can be billed. The `customers` table stores information about the customers who receive the bills. The `bill` table stores information about the bills, including which customer the bill is for and the total amount of the bill. The `billdetails` table stores detailed information about each line item in a bill, including which product is being billed, the quantity, and the total amount for that line item. The relationships between these tables are established through foreign keys, allowing for easy retrieval of related information across the tables.

![Billing Product ER Diagram DBeaver](billing-product-er-diagram-dbeaver.png)

## Products Table
* **product_id**: A unique identifier for each product. It is the primary key of the table.
* **product_name**: The name of the product.
* **price**: The price of the product.
## Customers Table
* **customer_id**: A unique identifier for each customer. It is the primary key of the table.
* **customer_name**: The name of the customer.
* **contact_info**: Contact information for the customer, such as phone number or email address.
## Bill Table
* **bill_id**: A unique identifier for each bill. It is the primary key of the table.
* **customer_id**: A foreign key that references the customer_id in the customers table. It indicates which customer the bill is for.
* **bill_date**: The date when the bill was generated.
* **total_amount**: The total amount of the bill.
## Bill Details Table
* **billdetail_id**: A unique identifier for each bill detail entry. It is the primary key of the table.
* **bill_id**: A foreign key that references the bill_id in the bill table. It indicates which bill this detail belongs to.
* **product_id**: A foreign key that references the product_id in the products table. It indicates which product is included in the bill.
* **quantity**: The quantity of the product in the bill.
* **line_total**: The total amount for this line item (usually calculated as quantity * price of the product).

## DDL Syntax
```sql
-- Create 'billing_product' schema 
CREATE SCHEMA billing_product;

-- Create 'products' table
CREATE TABLE billing_product.products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create 'customers' table
CREATE TABLE billing_product.customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    contact_info VARCHAR(200)
);

-- Create 'bill' table
CREATE TABLE billing_product.bill (
    bill_id INT PRIMARY KEY,
    customer_id INT,
    bill_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES billing_product.customers(customer_id)
);

-- Create 'billdetails' table
CREATE TABLE billing_product.billdetails (
    billdetail_id INT PRIMARY KEY,
    bill_id INT,
    product_id INT,
    quantity INT NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES billing_product.bill(bill_id),
    FOREIGN KEY (product_id) REFERENCES billing_product.products(product_id)
);
```

## DML Syntax
```sql
-- Insert records into 'products'
INSERT INTO billing_product.products (product_id, product_name, price)
VALUES
    (1, 'Laptop', 1000.00),
    (2, 'Smartphone', 700.00),
    (3, 'Tablet', 500.00),
    (4, 'Headphones', 150.00),
    (5, 'Keyboard', 50.00),
    (6, 'Mouse', 30.00),
    (7, 'Monitor', 200.00),
    (8, 'Printer', 250.00),
    (9, 'Camera', 400.00),
    (10, 'External Hard Drive', 100.00);

-- Insert records into 'customers'
INSERT INTO billing_product.customers (customer_id, customer_name, contact_info) VALUES
    (1, 'John Doe', 'john.doe@example.com'),
    (2, 'Jane Smith', 'jane.smith@example.com'),
    (3, 'Michael Johnson', 'michael.johnson@example.com'),
    (4, 'Emily Davis', 'emily.davis@example.com'),
    (5, 'David Wilson', 'david.wilson@example.com'),
    (6, 'Sarah Taylor', 'sarah.taylor@example.com'),
    (7, 'James Brown', 'james.brown@example.com'),
    (8, 'Jessica Jones', 'jessica.jones@example.com'),
    (9, 'Chris Miller', 'chris.miller@example.com'),
    (10, 'Amanda Martinez', 'amanda.martinez@example.com'),
    (11, 'Brian Scott', 'brian.scott@example.com'),
    (12, 'Laura Green', 'laura.green@example.com'),
    (13, 'Daniel White', 'daniel.white@example.com'),
    (14, 'Nancy Moore', 'nancy.moore@example.com'),
    (15, 'Steven Harris', 'steven.harris@example.com');

-- Insert records into 'bill' and 'billdetails' tables
-- Note: This is just an example, you will need to adjust the bill_id, customer_id, product_id, quantity, and line_total based on your actual data and billing logic.
INSERT INTO billing_product.bill (bill_id, customer_id, bill_date, total_amount)
VALUES
    (1, 1, '2023-01-15', 2150.00),
    (2, 2, '2023-01-20', 1200.00),
    ( 3,  3, '2023-02-05', 2850.00),
    ( 4,  4, '2023-03-10',  800.00),
    ( 5,  5, '2023-04-15', 1300.00),
    ( 6,  6, '2023-05-20', 2700.00),
    ( 7,  7, '2023-06-25',  550.00),
    ( 8,  8, '2023-07-30', 1100.00),
    ( 9,  9, '2023-08-15', 1200.00),
    (10, 10, '2023-09-01', 2250.00),
    (11, 11, '2023-10-05',  770.00),
    (12, 12, '2023-11-10', 1350.00);

INSERT INTO billing_product.billdetails (
    billdetail_id, bill_id, product_id, quantity, line_total)
    VALUES
        (1, 1, 1, 1, 1000.00),
        (2, 1, 4, 2, 300.00),
        (3, 1, 5, 1, 50.00),
        (4, 1, 6, 1, 30.00),
        (5, 1, 7, 1, 200.00),
        (6, 1, 8, 1, 250.00),
        (7, 1, 10, 1, 100.00),
        (8, 2, 2, 1, 700.00),
        (9, 2, 3, 1, 500.00),
        (10,  3,  2, 1,   700.00),
        (11,  3,  6, 5,   150.00),
        (12,  3,  1, 2,  2000.00),
        (13,  4,  8, 2,   500.00),
        (14,  4,  5, 4,   200.00),
        (15,  4, 10, 1,   100.00),
        (16,  5,  9, 1,   400.00),
        (17,  5,  7, 3,   600.00),
        (18,  5,  4, 2,   300.00),
        (19,  6,  3, 2,  1000.00),
        (20,  6,  2, 1,   700.00),
        (21,  6,  1, 1,  1000.00),
        (22,  7,  6,10,   300.00),
        (23,  7,  5, 2,   100.00),
        (24,  7,  4, 1,   150.00),
        (25,  8,  7, 1,   200.00),
        (26,  8,  8, 2,   500.00),
        (27,  8,  9, 1,   400.00),
        (28,  9, 10, 5,   500.00),
        (29,  9,  2, 1,   700.00),
        (30, 10,  1, 1,  1000.00),
        (31, 10,  3, 2,  1000.00),
        (32, 10,  5, 5,   250.00),
        (33, 11,  4, 3,   450.00),
        (34, 11,  6, 4,   120.00),
        (35, 11,  7, 1,   200.00),
        (36, 12,  8, 1,   250.00),
        (37, 12,  9, 2,   800.00),
        (38, 12, 10, 3,   300.00);
```
**Bulk load**
* To insert bulk records in these tables
```sql

-- 1) Insert sample products
WITH N AS (
    SELECT TOP (10000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.objects a CROSS JOIN sys.objects b
)
INSERT INTO billing_product.products (product_id, product_name, price)
SELECT n, CONCAT('Product-', n), CAST(RAND(CHECKSUM(NEWID())) * 500 + 10 AS DECIMAL(10,2))
FROM N;

-- 2) Insert sample customers
;WITH N AS (
    SELECT TOP (100000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.objects a CROSS JOIN sys.objects b
)
INSERT INTO billing_product.customers (customer_id, customer_name, contact_info)
SELECT n, CONCAT('Customer-', n), CONCAT('customer', n, '@email.com')
FROM N;

-- 3) Insert bills (100k bills, random customer)
;WITH N AS (
    SELECT TOP (100000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.objects a CROSS JOIN sys.objects b
)
INSERT INTO billing_product.bill (bill_id, customer_id, bill_date, total_amount)
SELECT n,
       CAST(RAND(CHECKSUM(NEWID())) * 100000 AS INT) + 1,  -- random customer_id
       DATEADD(DAY, -ABS(CHECKSUM(NEWID())) % 365, GETDATE()), -- random past 1 year
       0.00
FROM N;

-- 4) Insert billdetails (~1M rows, 10 per bill)
;WITH B AS (
    SELECT bill_id
    FROM billing_product.bill
),
N AS (
    SELECT TOP (10) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM sys.objects
)
INSERT INTO billing_product.billdetails (billdetail_id, bill_id, product_id, quantity, line_total)
SELECT 
    ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS billdetail_id,
    b.bill_id,
    CAST(RAND(CHECKSUM(NEWID())) * 10000 AS INT) + 1, -- random product
    CAST(RAND(CHECKSUM(NEWID())) * 5 + 1 AS INT),     -- qty 1-5
    CAST(RAND(CHECKSUM(NEWID())) * 200 + 20 AS DECIMAL(10,2)) -- line_total
FROM B
CROSS JOIN N;

-- 5) (Optional) Update total_amount in bills
UPDATE b
SET b.total_amount = d.sum_total
FROM billing_product.bill b
JOIN (
    SELECT bill_id, SUM(line_total) AS sum_total
    FROM billing_product.billdetails
    GROUP BY bill_id
) d ON b.bill_id = d.bill_id;



```
***
### [Assignments](assignments/README.md)
### [Assignments - Solutions](assignments-solutions/README.md)

##### [Back To Contents](../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
