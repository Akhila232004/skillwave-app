![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Handling Exceptions
The core of T-SQL exception handling revolves around the TRY...CATCH block. This structure allows you to gracefully manage errors that occur during query execution, preventing the entire batch from failing and enabling you to take corrective action.

Error Functions
When an error occurs in the TRY block, control immediately transfers to the CATCH block. Within this block, a set of system functions can be used to retrieve detailed information about the error. These are crucial for building robust error-handling routines.

* ERROR_NUMBER(): Returns the error number (e.g., 2627 for a duplicate key violation).

* ERROR_MESSAGE(): Returns the full text of the error message.

* ERROR_SEVERITY(): Indicates the seriousness of the error.

* ERROR_LINE(): Returns the line number within the code where the error occurred.

* ERROR_PROCEDURE(): Returns the name of the stored procedure or function where the error occurred.
  
  
### TRY...CATCH Example:
Suppose you have an `emp` table with a primary key on the `empno` column. You want to insert a new employee, but you need to ensure that the employee ID does not already exist in the table.
```sql
-- Preventing Insertion of Duplicate Employee IDs
BEGIN TRY
    -- Attempt to insert a new employee with an existing emp_id
    INSERT INTO emp (emp_id, emp_name, job_title, dept_id)
    VALUES (1, 'John Doe', 'Software Engineer', 1);
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 2627  -- Error number for a duplicate key violation
        BEGIN
            PRINT 'Error: Cannot insert duplicate employee ID.';
        END
    ELSE
        BEGIN
            PRINT 'An unexpected error occurred. Error number: ' + CAST(ERROR_NUMBER() AS VARCHAR);
        END
END CATCH
```
* We use a `TRY...CATCH` block to handle exceptions.
* Inside the TRY block, we attempt to insert a new employee into the emp table.
* If an error occurs (such as a duplicate key violation), the execution is transferred to the CATCH block.
* Inside the CATCH block, we check the error number using the ERROR_NUMBER() function.
* If the error number is 2627 (which corresponds to a duplicate key violation), we print a message indicating that a duplicate employee ID cannot be inserted.
* If a different error occurs, we print a generic message along with the error number.
* By using the `TRY...CATCH` block, we can gracefully handle errors and provide meaningful feedback to the user or the application. This approach is useful for maintaining  data integrity and ensuring that the database operations are performed correctly.

## Error functions
* Error functions are used within a `CATCH` block to retrieve information about the error that caused the TRY block to transfer control to the `CATCH` block.
* These functions  provide details such as the error number, message, severity, state, procedure name, and line number where the error occurred.
### Here are the most commonly used error:
**ERROR_NUMBER()**
* Returns the error number of the error that caused the CATCH block to be  executed.
```sql
SELECT ERROR_NUMBER() AS ErrorNumber;
```
**ERROR_MESSAGE()**
* Returns the error message text of the error that caused the CATCH block to be executed.
``` sql
SELECT ERROR_MESSAGE() AS ErrorMessage;
```
**ERROR_SEVERITY()**
* Returns the severity level of the error that caused the CATCH block to be executed.
```sql
SELECT ERROR_SEVERITY() AS ErrorSeverity;
```
**ERROR_STATE()**
* Returns the state number of the error that caused the CATCH block to be executed.
```sql
SELECT ERROR_STATE() AS ErrorState;
```
**ERROR_PROCEDURE()**
* Returns the name of the stored procedure or trigger where the error occurred.
```sql
SELECT ERROR_PROCEDURE() AS ErrorProcedure;
```
**ERROR_LINE()**
* Returns the line number within the routine that caused the error.
```sql
SELECT ERROR_LINE() AS ErrorLine;
```
These error functions can only be used within a `CATCH` block and are very useful for diagnosing and handling errors in SQL Server. They provide detailed information about the error, which can be logged or used to take corrective action.

##  Error Handling with Transactions
Using TRY...CATCH with transactions is essential for maintaining data integrity. If an error occurs within a transaction, you must check for an active transaction and roll it back to prevent a partial or corrupted commit.

### Example: Transaction Control with TRY...CATCH

This example demonstrates how to perform a series of operations in a transaction. If any operation fails, the CATCH block ensures the entire transaction is rolled back, and a meaningful error message is returned.

```sql
BEGIN TRY
    -- Start a transaction
    BEGIN TRANSACTION;

    -- Attempt to insert a new employee
    INSERT INTO employees.emp (empno, ename, job, hiredate, sal, deptno)
    VALUES (9999, 'JANE DOE', 'CLERK', GETDATE(), 1000, 10);

    -- This will cause a foreign key violation, triggering the CATCH block
    INSERT INTO employees.emp (empno, ename, job, hiredate, sal, deptno)
    VALUES (9998, 'JOHN SMITH', 'CLERK', GETDATE(), 1000, 99);

    -- If no error occurred, commit the transaction
    COMMIT TRANSACTION;
    PRINT 'Transaction committed successfully.';
END TRY
BEGIN CATCH
    -- Check if a transaction is active and needs to be rolled back
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRANSACTION;
    END;

    -- Log the error details
    DECLARE @ErrorMsg NVARCHAR(2048) = ERROR_MESSAGE();
    DECLARE @ErrorNum INT = ERROR_NUMBER();
    
    PRINT 'Transaction rolled back due to an error.';
    PRINT 'Error Number: ' + CAST(@ErrorNum AS VARCHAR);
    PRINT 'Error Message: ' + @ErrorMsg;
    
    -- Optional: Re-raise the error for the calling application
    THROW;
END CATCH;
```
### Raise Error
.....

### Re-throwing Errors with THROW
The THROW statement is the modern and preferred way to re-raise an exception in a CATCH block. It maintains the original error information (like line number and severity) and returns it to the calling application or a higher-level CATCH block. This is a significant improvement over the older RAISERROR statement.

```sql

THROW [ { error_number | @local_variable } , { message | @local_variable } , { state | @local_variable } ];
```

### Example: Using THROW

The CATCH block above already uses THROW to demonstrate this. The THROW statement, when used without parameters inside a CATCH block, re-throws the original exception.

```sql
BEGIN TRY
    -- A statement that will cause an error
    SELECT 1 / 0;
END TRY
BEGIN CATCH
    -- The THROW command will re-raise the original error
    -- preserving its error number, severity, state, etc.
    THROW;
END CATCH;
```
### XACT_STATE() Function
The XACT_STATE() function provides valuable information about the state of the current transaction. It can be used in a CATCH block to determine if a transaction is committable, uncommittable, or if there is no active transaction. This is a more robust alternative to just checking @@TRANCOUNT.

* 1: The transaction is active and committable.

* -1: The transaction is active but uncommittable. An error has occurred, but it has not been rolled back yet.

* 0: There is no active transaction.

Example: Using XACT_STATE() in a CATCH block

```sql

BEGIN TRY
    BEGIN TRANSACTION;

    -- This statement will cause an uncommittable transaction
    SELECT 1 / 0; 
    
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    -- Check the state of the transaction
    IF XACT_STATE() <> 0
    BEGIN
        ROLLBACK TRANSACTION;
        PRINT 'Transaction rolled back.';
    END;
    
    -- Re-throw the original error
    THROW;
END CATCH;
```

```sql

-- Assume you have an 'errors_log' table for logging
CREATE TABLE errors_log (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    error_number INT,
    error_message NVARCHAR(4000),
    error_time DATETIME DEFAULT GETDATE()
);

BEGIN TRY
    -- This statement will cause an error
    INSERT INTO employees.emp (empno) VALUES (NULL); 
END TRY
BEGIN CATCH
    -- Use the error functions to capture details and log them
    INSERT INTO errors_log (error_number, error_message)
    VALUES (ERROR_NUMBER(), ERROR_MESSAGE());

    -- Display a custom, user-friendly message
    PRINT 'An error occurred. The details have been logged for review.';

    -- Optional: Re-throw the original error with THROW
    THROW;
END CATCH;

```
##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
