![Tinitiate SQLSERVER Training](../images/sqlserver.png)

# Loops in SQL Server
In SQL Server, loops are used to execute a block of code repeatedly based on a condition. 

## FOR Loop
SQL Server does not have a traditional FOR loop like some other programming languages. However, you can achieve similar functionality using a WHILE loop with a counter variable.

Example: Print Names of First 5 Suppliers
``` sql
    DECLARE @Counter INT = 1;

    WHILE @Counter <= 5
    BEGIN
        SELECT supplier_name FROM suppliers WHERE supplier_id = @Counter;
        SET @Counter = @Counter + 1;
    END

```
In this example, we use a WHILE loop to print the names of the first 5 suppliers from the suppliers table. The loop runs as long as the @Counter variable is less than or equal to 5.

## WHILE Loop
 The WHILE loop executes a block of code repeatedly as long as a specified condition is true.

Example: Decrease Prices of All Parts by 10%
```sql
    DECLARE @PartID INT;

    -- Get the first Part ID
    SELECT @PartID = MIN(part_id) FROM parts;

    WHILE @PartID IS NOT NULL
    BEGIN
        -- Decrease the price by 10%
        UPDATE parts SET price = price * 0.90 WHERE part_id = @PartID;

        -- Get the next Part ID
        SELECT @PartID = MIN(part_id) FROM parts WHERE part_id > @PartID;
    END
```    
In this example, we use a WHILE loop to decrease the prices of all parts in the parts table by 10%. The loop continues until there are no more parts to update.

## DO WHILE Loop
 SQL Server does not have a built-in DO WHILE loop, but you can simulate it using a WHILE loop with a BEGIN...END block.

Example: Add New Parts Until 20 Parts Exist
```sql
    DECLARE @PartCount INT;

    SELECT @PartCount = COUNT(*) FROM parts;

    WHILE @PartCount < 20
    BEGIN
        INSERT INTO parts (part_name, price) VALUES ('New Part', 50.00);
        SELECT @PartCount = COUNT(*) FROM parts;
    END
```    
In this example, we use a WHILE loop to simulate a DO WHILE loop by continuously adding new parts to the parts table until there are 20 parts. The loop checks the condition at the end of each iteration, ensuring that the code inside the loop is executed at least once.