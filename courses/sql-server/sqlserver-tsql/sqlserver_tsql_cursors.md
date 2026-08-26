![Tinitiate SQLSERVER Training](../images/sqlserver.png)
# SQLSERVER Cursors
 In SQL Server, cursors are used to fetch and process rows from a result set one at a time. They are particularly useful when you need to perform row-by-row operations. Here are examples of how to use cursors with the billing and product tables:

## Basic Cursor Usage
 Example: Increase Prices of All Products by 10%
```sql
    DECLARE @ProductID INT;
    DECLARE @Price DECIMAL(10, 2);

    -- Declare the cursor
    DECLARE ProductCursor CURSOR FOR
    SELECT product_id, price FROM products;

    -- Open the cursor
    OPEN ProductCursor;

    -- Fetch the first row from the cursor
    FETCH NEXT FROM ProductCursor INTO @ProductID, @Price;

    -- Loop through all rows
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Increase the price by 10%
        UPDATE products SET price = @Price * 1.10 WHERE product_id = @ProductID;

        -- Fetch the next row from the cursor
        FETCH NEXT FROM ProductCursor INTO @ProductID, @Price;
    END
-- Close and deallocate the cursor
CLOSE ProductCursor;
DEALLOCATE ProductCursor;
```
 In this example, we use a cursor to iterate through all rows in the products table and increase the price of each product by 10%. The cursor fetches each row into   variables @ProductID and @Price, which are then used in an UPDATE statement to modify the price.

## Cursor with Dynamic SQL
 Example: Generate Billing Statements for All Customers
```sql
    DECLARE @CustomerID INT;
    DECLARE @BillID INT;
    DECLARE @TotalAmount DECIMAL(10, 2);

    -- Declare the cursor
    DECLARE CustomerCursor CURSOR FOR
    SELECT customer_id FROM customers;

    -- Open the cursor
    OPEN CustomerCursor;

    -- Fetch the first row from the cursor
    FETCH NEXT FROM CustomerCursor INTO @CustomerID;

    -- Loop through all rows
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate the total amount for the customer's bill
        SELECT @TotalAmount = SUM(line_total) FROM billdetails WHERE bill_id IN (SELECT bill_id FROM bill WHERE customer_id = @CustomerID);

        -- Insert a new bill for the customer
        INSERT INTO bill (customer_id, bill_date, total_amount) VALUES (@CustomerID, GETDATE(), @TotalAmount);
        SELECT @BillID = SCOPE_IDENTITY();

        -- Update billdetails with the new bill_id
        UPDATE billdetails SET bill_id = @BillID WHERE bill_id IN (SELECT bill_id FROM bill WHERE customer_id = @CustomerID);

        -- Fetch the next row from the cursor
        FETCH NEXT FROM CustomerCursor INTO @CustomerID;
    END

    -- Close and deallocate the cursor
    CLOSE CustomerCursor;
    DEALLOCATE CustomerCursor;
 ```
 In this example, we use a cursor to iterate through all customers in the customers table and generate billing statements for each customer. The cursor fetches the customer_id into the variable @CustomerID, which is then used to calculate the total amount for the customer's bill and insert a new record into the bill table. The billdetails table is then updated with the new bill_id.