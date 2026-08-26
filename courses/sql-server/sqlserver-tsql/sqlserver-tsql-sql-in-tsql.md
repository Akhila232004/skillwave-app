![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# SQL In TSQL
### Embedding SQL in T-SQL
Embedding SQL within a T-SQL batch or a programming construct like a stored procedure is a fundamental skill. It allows you to use declarative SQL statements for data manipulation and querying alongside the procedural elements of T-SQL. This combination enables you to build dynamic, flexible, and powerful database applications.

#### Key Concepts and Best Practices
* DML (Data Manipulation Language): Commands like INSERT, UPDATE, and DELETE are used to modify data. When embedded in T-SQL, these commands often use variables for dynamic values and are contained within conditional logic (IF...ELSE) or loops.

* DQL (Data Query Language): The SELECT statement is the most common DQL command. Within T-SQL, SELECT is not just for retrieving data; it's also a powerful tool for assigning values to variables. You can assign the result of an aggregate function (e.g., COUNT, SUM) or a single row/column value directly to a T-SQL variable.

* Procedural Control Flow: T-SQL's procedural elements—BEGIN...END blocks, IF...ELSE, and WHILE loops—provide the structure to control how and when your SQL statements are executed. This allows you to create complex business logic that is not possible with a single SQL statement.

#### Advanced Techniques
* Set-Based vs. Procedural: A key concept in advanced T-SQL is moving from row-by-row procedural logic to set-based operations. For example, instead of using a WHILE loop with UPDATE to process records one at a time, you should use a single, efficient UPDATE statement with a WHERE clause. This is the most important performance best practice in T-SQL.

* MERGE Statement: The MERGE statement is a powerful, set-based command that combines INSERT, UPDATE, and DELETE actions into a single atomic operation. This is ideal for synchronizing data between tables and is the modern, highly efficient alternative to the old IF EXISTS...BEGIN UPDATE...ELSE BEGIN INSERT pattern.

* Dynamic SQL: This technique involves building a SQL statement as a string within T-SQL and then executing it. It is used when the table name, column names, or other parts of the query are not known until runtime. While powerful, it should be used with caution to prevent SQL injection vulnerabilities.
  
```sql
BEGIN
    -- Data Input Variables
    -- -------------------------------------------------
    DECLARE @l_in_product_id INT = 6;
    DECLARE @l_in_product_category VARCHAR(100) = 'kitchen';
    DECLARE @l_in_product_name VARCHAR(25) = 'Milk';
    DECLARE @l_in_product_unit_price DECIMAL = 1.17;

    -- Code Variables
    -- -------------------------------------------------
    DECLARE @l_product_id INT
    DECLARE @product_count INT

    -- -------------------------------------------------
    -- DQL
    -- -------------------------------------------------
    -- 1. SQL Select: Get product count and print it
    -- -------------------------------------------------
    SELECT @product_count = COUNT(*) 
    FROM  tinitiate.invoicing.products;

    PRINT CONCAT('Number of Products: ',@product_count)

    -- -------------------------------------------------
    -- DML
    -- -------------------------------------------------
    -- 1. Insert product data if that product is missing
    -- 2. Update the Column values if supplied input PK exists
    -- -------------------------------------------------
    SELECT @l_product_id = product_id
    FROM   tinitiate.invoicing.products
    WHERE   product_id = @l_in_product_id;

    SELECT @product_count = COUNT(*)
    FROM   tinitiate.invoicing.products
    WHERE   product_id = @l_in_product_id;

    IF @l_product_id IS NULL
        BEGIN
            PRINT CONCAT('Product: ',@l_in_product_id,' doesnt exists, Adding it NOW!')

            INSERT INTO tinitiate.invoicing.products
            VALUES ( @l_in_product_id
                    ,@l_in_product_category
                    ,@l_in_product_name
                    ,@l_in_product_unit_price);

            PRINT CONCAT('Rows Inserted ',@@rowcount)                         
        END
    ELSE
        BEGIN
            PRINT CONCAT('Product: ',@l_in_product_id,' exists!, Updating the new values')
    
            UPDATE tinitiate.invoicing.products
            SET    product_category   = @l_in_product_category
                  ,product_name       = @l_in_product_name
                  ,product_unit_price = @l_in_product_unit_price
            WHERE  product_id = @l_in_product_id;
        END
END;

-- Test Query
SELECT * FROM tinitiate.invoicing.products;
```

## To move from the procedural, row-by-row thinking of a BEGIN...END block to the set-based logic that SQL Server is optimized for.

### The MERGE Statement
Your IF...ELSE block, which checks for an existing record and either INSERTs or UPDATEs it, is a very common pattern known as an upsert (a combination of UPDATE and INSERT). The MERGE statement was specifically designed to handle this scenario in a single, atomic, and highly efficient operation.

Example using MERGE:

```sql
DECLARE @l_in_product_id INT = 6;
DECLARE @l_in_product_category VARCHAR(100) = 'kitchen';
DECLARE @l_in_product_name VARCHAR(25) = 'Milk';
DECLARE @l_in_product_unit_price DECIMAL(10, 2) = 1.17;

MERGE tinitiate.invoicing.products AS target
USING (SELECT @l_in_product_id AS product_id,
              @l_in_product_category AS product_category,
              @l_in_product_name AS product_name,
              @l_in_product_unit_price AS product_unit_price) AS source
ON (target.product_id = source.product_id)
WHEN MATCHED THEN
    -- Update if the record exists
    UPDATE SET target.product_category = source.product_category,
               target.product_name = source.product_name,
               target.product_unit_price = source.product_unit_price
WHEN NOT MATCHED BY TARGET THEN
    -- Insert if the record does not exist
    INSERT (product_id, product_category, product_name, product_unit_price)
    VALUES (source.product_id, source.product_category, source.product_name, source.product_unit_price)
OUTPUT $action, inserted.*, deleted.*;
GO
```

The MERGE statement simplifies the code, improves readability, and is more efficient as it performs the lookup and the conditional action in one step. The OUTPUT clause is an advanced feature that shows what action was taken (INSERT or UPDATE) and the state of the rows before and after the change.


##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
