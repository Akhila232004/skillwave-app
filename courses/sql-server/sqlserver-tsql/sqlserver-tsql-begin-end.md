![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# BEGIN...END
* In T-SQL, `BEGIN` and `END` are used to define a block of one or more statements as a single unit.
* This is essential when you need to group multiple operations under control-of-flow constructs, transactions, or within stored routines.

## Adding two variables
We are declaring and initializing variables, performing a simple addition operation, and then printing and selecting the result. 
### Declaration
* @num1 is declared as an integer and initialized to 1.
* @num2 is declared as an integer without an initial value.
* @res is declared as an integer to store the result of the addition.
### Setting Variable Values:
* @num2 is set to 20 using the SET statement.
### Performing Addition:
* The sum of @num1 and @num2 is calculated and stored in @res.
### Printing Results:
* The script prints the string 'Sum of Num1 and Num2'.
* It then prints 'Sum: ' followed by the sum, which is cast to a varchar for concatenation with the string.
* The sum is also printed directly as an integer.
* Finally, the SELECT statement is used to display the result in the query result window.
```sql
BEGIN
    DECLARE @num1 INT = 1;  -- Variable = container
    DECLARE @num2 INT;
    DECLARE @res INT;
    
    SET @num2 = 20;

    SET @res = @num1 + @num2;
    PRINT 'Sum of Num1 and Num2';
    PRINT  'Sum: ' + CAST(@res AS VARCHAR);
    PRINT  @res;
    SELECT @res;
END;
```

## Reassigning a variable and performing arithmetic
We are declaring and initializing variables, reassigning, performing a simple addition operation, and then printing the result. 
### Declaration
* @data1 is declared as an integer and initialized to 1.
* @data2 is declared as an integer without an initial value.
### Setting Variable Values:
* @data2 is set to 10 using the SET statement, and its value is printed, which will be 10.
### Reassigning Variable Values:
* @data2 is then reassigned to 20, and its new value is printed, which will be 20.
### Performing Arithmetic and Printing Results:
* The script prints the result of adding 10 to @data2, which will be 30.
* It then prints the value of @data2 again, which remains 20, demonstrating that the addition in the previous step did not change the value of @data2.
```sql 
BEGIN
    DECLARE @data1 INT = 1; -- variable declare and initialize
    DECLARE @data2 INT;     -- variable declare
    
    SET @data2 = 10;  -- variable initialize
    PRINT @data2;  -- 10

    SET @data2 = 20;  -- variable re-assign
    PRINT @data2;  -- 20

    PRINT @data2+10; -- 30
    PRINT @data2;    -- 20
END;
```
### BEGIN...END with IF...ELSE Statements
This is a fundamental use case. The BEGIN...END block allows you to execute more than one statement within the IF or ELSE clauses.

Example: Conditional Logic with Multiple Actions

This code checks if a specific department name exists. If it does, it updates employee salaries and prints a success message. If not, it prints an error message.

```sql
DECLARE @DeptName NVARCHAR(100) = 'Sales';
DECLARE @SalaryIncrease DECIMAL(10, 2) = 1.05; -- 5% increase

IF EXISTS (SELECT 1 FROM employees.dept WHERE dname = @DeptName)
BEGIN
    -- This block executes if the condition is TRUE
    PRINT 'Updating salaries for the ' + @DeptName + ' department...';
    
    UPDATE e
    SET e.sal = e.sal * @SalaryIncrease
    FROM employees.emp AS e
    JOIN employees.dept AS d ON e.deptno = d.deptno
    WHERE d.dname = @DeptName;
    
    PRINT 'Salaries updated successfully.';
END
ELSE
BEGIN
    -- This block executes if the condition is FALSE
    PRINT 'Error: Department ' + @DeptName + ' does not exist.';
    PRINT 'No updates were made.';
END;
GO

```

###  BEGIN...END with TRY...CATCH Blocks
This is the standard for modern T-SQL error handling. The BEGIN...END block is used to define the section of code that you want to monitor for errors.

Example: Error Handling During a DIVIDE BY ZERO Operation

This code attempts a division that will cause an error. The TRY...CATCH block, defined by BEGIN...END, catches the error and executes the statements in the CATCH block to handle it gracefully.

```sql
BEGIN TRY
    -- The BEGIN block encapsulates the code to be monitored for errors.
    DECLARE @numerator INT = 100;
    DECLARE @denominator INT = 0;
    
    PRINT 'Attempting division...';
    
    DECLARE @result INT = @numerator / @denominator; -- This will cause a divide-by-zero error.
    
    PRINT 'Division successful. Result: ' + CAST(@result AS VARCHAR);
END TRY
BEGIN CATCH
    -- The CATCH block executes only if an error occurs in the TRY block.
    -- BEGIN...END allows us to run multiple statements to handle the error.
    PRINT 'An error occurred during the division.';
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR);
    PRINT 'Error Message: ' + ERROR_MESSAGE();
END CATCH;
GO
```
## Common Use Cases
* **Control-of-Flow** - Group statements under IF…ELSE or WHILE so they execute together.
* **Transactions** - Mark the start and end of an explicit transaction.
* **Stored Procedures & Triggers** - Enclose the body of a stored procedure, trigger, or script section.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
