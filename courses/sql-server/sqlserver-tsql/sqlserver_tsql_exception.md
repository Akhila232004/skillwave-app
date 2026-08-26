# Handling Exceptions 
 In SQL Server, exceptions (also known as errors) can occur during the execution of SQL statements. To handle these exceptions, you can use the TRY...CATCH block. Here's how you can use this construct with the emp and dept tables:

Example: Preventing Insertion of Duplicate Employee IDs
Suppose you have an emp table with a primary key on the emp_id column. You want to insert a new employee, but you need to ensure that the employee ID does not already exist in the table.

```sql
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

 * We use a TRY...CATCH block to handle exceptions.
 * Inside the TRY block, we attempt to insert a new employee into the emp table.
 * If an error occurs (such as a duplicate key violation), the execution is transferred to the CATCH block.
 * Inside the CATCH block, we check the error number using the ERROR_NUMBER() function.
 * If the error number is 2627 (which corresponds to a duplicate key violation), we print a message indicating that a duplicate employee ID cannot be inserted.
 * If a different error occurs, we print a generic message along with the error number.
 
    By using the TRY...CATCH block, we can gracefully handle errors and provide meaningful feedback to the user or the application. This approach is useful for maintaining  data integrity and ensuring that the database operations are performed correctly.

## Error functions
 Error functions are used within a CATCH block to retrieve information about the error that caused the TRY block to transfer control to the CATCH block. These functions  provide details such as the error number, message, severity, state, procedure name, and line number where the error occurred. Here are the most commonly used error 
* functions:

**ERROR_NUMBER()**

 Returns the error number of the error that caused the CATCH block to be  executed.
```sql
SELECT ERROR_NUMBER() AS ErrorNumber;
```

**ERROR_MESSAGE()**

Returns the error message text of the error that caused the CATCH block to be executed.
``` sql
SELECT ERROR_MESSAGE() AS ErrorMessage;
```

**ERROR_SEVERITY()**

Returns the severity level of the error that caused the CATCH block to be executed.
```sql
SELECT ERROR_SEVERITY() AS ErrorSeverity;
```

**ERROR_STATE()**
Returns the state number of the error that caused the CATCH block to be executed.
```sql
SELECT ERROR_STATE() AS ErrorState;
```
**ERROR_PROCEDURE()**

Returns the name of the stored procedure or trigger where the error occurred.
```sql
SELECT ERROR_PROCEDURE() AS ErrorProcedure;
```

**ERROR_LINE()**
Returns the line number within the routine that caused the error.

```sql
SELECT ERROR_LINE() AS ErrorLine;
```
These error functions can only be used within a CATCH block and are very useful for diagnosing and handling errors in SQL Server. They provide detailed information about the error, which can be logged or used to take corrective action.