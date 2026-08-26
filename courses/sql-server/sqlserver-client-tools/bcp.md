![SQLServer Tinitiate Image](sqlserver.png)

# SQLServer Tutorial

&copy; TINITIATE.COM

## What is BCP?

* A command-line utility for loading data into SQL Server tables and extracting data out.

* Handles large datasets efficiently (faster than row-by-row inserts).

* Useful for ETL pipelines, staging tables, migrations.

**Example 1: Create Staging Schema & Tables**

```sql
-- Create schema
CREATE SCHEMA sqltuning AUTHORIZATION dbo;

-- Drop if exists
DROP TABLE IF EXISTS sqltuning.stg_invoice_details;
DROP TABLE IF EXISTS sqltuning.stg_invoice;
DROP TABLE IF EXISTS sqltuning.stg_products;

-- Create staging tables
CREATE TABLE sqltuning.stg_products
(
    product_id       INT,
    product_category VARCHAR(100),
    product_name     VARCHAR(100),
    unit_price       DECIMAL(10,2)
);

CREATE TABLE sqltuning.stg_invoice
(
    customer_id      INT,
    customer_name    VARCHAR(100),
    invoice_date     VARCHAR(100),
    invoice_id       INT,
    discount_percent DECIMAL(10,2)
);

CREATE TABLE sqltuning.stg_invoice_details
(
    invoice_item_id  INT,
    invoice_id       INT,
    product_id       INT,
    quantity         INT
);
```

**Example 2: Import Data with BCP**
```sql
:: Import products
bcp tinitiate.sqltuning.stg_products in ./bcp_data/products.csv -S localhost -U sa -P tinitiate_01 -t"," -r\n -c

:: Import invoices (skip header row with -F 2)
bcp tinitiate.sqltuning.stg_invoice in ./bcp_data/invoice_data.csv -S localhost -U sa -P tinitiate_01 -F 2 -t"," -r\n -c

:: Import invoice details
bcp tinitiate.sqltuning.stg_invoice_details in ./bcp_data/invoice_details_data.csv -S localhost -U sa -P tinitiate_01 -t"," -r\n -c
```

Flags explained:

in = load data into table.

-S = server name.

-U / -P = username/password.

-t"," = field terminator is comma.

-r\n = row terminator is newline.

-c = character mode (reads text).

-F 2 = start from row 2 (skip header).

**Lab 3: Validate Data**

```sql
-- Row counts
SELECT COUNT(1) AS Products FROM sqltuning.stg_products;
SELECT COUNT(1) AS Invoices FROM sqltuning.stg_invoice;
SELECT COUNT(1) AS InvoiceDetails FROM sqltuning.stg_invoice_details;

-- Business validation: invoices with no details
SELECT *
FROM sqltuning.stg_invoice i
WHERE NOT EXISTS (
    SELECT 1
    FROM sqltuning.stg_invoice_details id
    WHERE id.invoice_id = i.invoice_id
);
```
