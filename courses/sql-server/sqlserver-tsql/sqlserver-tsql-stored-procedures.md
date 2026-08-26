![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Stored Procedures
Stored procedures are powerful, precompiled T-SQL code units that are stored within the database. They serve as a central and secure way to execute complex business logic, perform data validation, and manage data access. Unlike regular SQL scripts, SPs are executed as a single, compiled unit, offering several key advantages.

## Key Characteristics and Advanced Concepts
* Precompiled Execution: When a stored procedure is first run, SQL Server compiles its query plan and caches it. This significantly reduces execution time on subsequent runs compared to ad hoc SQL queries, which must be compiled every time they are executed.

* Encapsulation and Reusability: SPs encapsulate complex business logic into a single, reusable object. Instead of writing the same SQL code repeatedly in different applications, you can simply call the stored procedure. This reduces code duplication, simplifies application development, and makes code easier to maintain.

* Security: Stored procedures are a critical component of database security. They allow you to grant users permission to execute the procedure without giving them direct permissions on the underlying tables. This concept, known as "granting permissions through the stored procedure," enforces the principle of least privilege.

* Reduced Network Traffic: When a stored procedure is executed, only the procedure's name and its parameters are sent over the network, not the entire SQL script. This can lead to a significant reduction in network traffic, especially for applications that perform many data operations.

* Transaction Management: Stored procedures are ideal for managing transactions. You can wrap a series of INSERT, UPDATE, and DELETE statements within a single stored procedure and use BEGIN TRANSACTION, COMMIT, and ROLLBACK to ensure all operations succeed or fail as a single, atomic unit. This is crucial for maintaining data integrity.

## Procedure with no parameters
* Create a stored procedure without any parameters if you want to perform a specific operation that does not require any input.
``` sql
-- Create a stored procedure without parameters
CREATE PROCEDURE employees.GetAllEmployees
AS
BEGIN
    SELECT empno, ename, job
    FROM employees.emp;
END

-- Execute the stored procedure
EXEC employees.GetAllEmployees;
```
* We create a stored procedure named `GetAllEmployees` without any parameters.
* The procedure contains a simple `SELECT` statement that retrieves the employee ID, employee name, and job title from the emp table.
* To execute the stored procedure, we use the `EXEC` statement followed by the name of the procedure.

## Procedure with Input Parameter
* Create stored procedures with input parameters to pass values to the procedure when it is executed.
```sql
-- Create a stored procedure with an input parameter for the department name
CREATE PROCEDURE employees.GetEmployeesByDepartmentName
    @DeptName VARCHAR(100)
AS
BEGIN
    SELECT e.empno, e.ename, e.job, d.dname
    FROM employees.emp e
    JOIN employees.dept d ON e.deptno = d.deptno
    WHERE d.dname = @DeptName;
END

-- Execute the stored procedure with the department name 'accounting'
EXEC employees.GetEmployeesByDepartmentName @DeptName = 'accounting';
```

## Procedure with Output param
* Create stored procedures with output parameters that allow you to return a value back to the caller. Output parameters can be particularly useful for returning status information, counts, or values calculated within the procedure.
```sql
-- Create a stored procedure that counts the number of employees in a specified
-- department(input) and returns this count as an output parameter.
CREATE PROCEDURE employees.GetEmployeeCountByDepartment
    @DeptID INT,                     -- Input parameter for department ID
    @EmployeeCount INT OUTPUT        -- Output parameter to hold the count
AS
BEGIN
    SELECT @EmployeeCount = COUNT(*)
    FROM employees.emp
    WHERE deptno = @DeptID;
END

-- Declare a variable to hold the output value
DECLARE @Count INT;
-- Execute the stored procedure
EXEC employees.GetEmployeeCountByDepartment @DeptID = 20, @EmployeeCount = @Count OUTPUT;
-- Display the result
PRINT 'Number of employees in department: ' + CAST(@Count AS VARCHAR);
```    
* We create a stored procedure named `employees.GetEmployeeCountByDepartment` with two parameters:
    * `@DeptID`: An input parameter of type INT that specifies which department to count employees in.
    * `@EmployeeCount`: An output parameter of type INT that will hold the count of employees.
* Inside the procedure, a `SELECT` statement calculates the number of employees in the specified department (`@DeptID`) and assigns this count to the output parameter (`@EmployeeCount`).
* To execute the procedure, you must declare a variable (@Count) to hold the output value.
* The stored procedure is then called using `EXEC`, specifying the input parameter and passing the variable as the output parameter with the `OUTPUT` keyword.
* After execution, the value of the output parameter is stored in the variable `@Count`, which can then be used in the calling environment, such as displaying the result.

## Multiple ways to execute procs
* The stored procedure `employees.GetEmployeeCountByDepartment` which includes both an input parameter and an output parameter, there are several methods you can use depending on your environment and specific requirements. Below are multiple ways to execute this procedure in SQL Server:
### Using T-SQL in SQL Server Management Studio (SSMS)
* To execute this procedure from SSMS or any other T-SQL interface, you can use the following approach
```sql
DECLARE @EmployeeCountResult INT;
EXEC employees.GetEmployeeCountByDepartment @DeptID = 10, @EmployeeCount = @EmployeeCountResult OUTPUT;

-- To see the result
SELECT @EmployeeCountResult AS EmployeeCount;
```
* This code declares a variable to hold the output, executes the procedure with a specific department ID, and retrieves the count of employees in that department.
### Using a SQL Script or Batch
* You can execute the procedure within a SQL script or batch. This is useful when you need to run this as part of larger database operations
```sql
BEGIN
    DECLARE @Result INT;
    EXEC employees.GetEmployeeCountByDepartment @DeptID = 30, @EmployeeCount = @Result OUTPUT;
    PRINT 'Number of employees in department 2: ' + CAST(@Result AS VARCHAR(10));
END
```    
### From Another Stored Procedure
* You can call this procedure from another stored procedure. This is useful for modular programming in SQL Server
```sql
CREATE PROCEDURE employees.CheckDepartmentSize
AS
BEGIN
    DECLARE @EmployeeCount INT;
    EXEC employees.GetEmployeeCountByDepartment @DeptID = 30, @EmployeeCount = @EmployeeCount OUTPUT;
    
    IF @EmployeeCount > 10
        PRINT 'Large Department';
    ELSE
        PRINT 'Small or Medium Department';
END
```
### Scheduling with SQL Server Agent
You might want to schedule this procedure to run at specific intervals using SQL Server Agent. This is useful for regular audits or reports:
* Create a new Job in SQL Server Agent.
* Add a step with type "Transact-SQL script (T-SQL)".
* Enter the script to execute the procedure similarly to the T-SQL examples  
  above.
* Define the schedule according to your needs (daily, weekly, etc.).

## Default values for params
* You can specify default values for the parameters of stored procedures and user-defined functions. This feature allows you to make the parameters optional, meaning that if a value for a parameter is not provided when the procedure or function is called, the default value will be used instead. This can simplify the calling code and provide flexibility.
### Setting Default Values for Parameters
Here's how to define default values for parameters in SQL Server
```sql
-- Create a stored procedure with default parameters
CREATE PROCEDURE employees.GetEmployees
    @DeptID INT = NULL,            -- Default value is NULL
    @Commission INT = NULL
AS
BEGIN
    SELECT ename, empno, deptno, commission
    FROM employees.emp
    WHERE (deptno = @DeptID OR @DeptID IS NULL)
    AND (commission = @Commission OR @Commission IS NULL);
END
```
* The `@DeptID` parameter has a default value of NULL. If `@DeptID` is not provided when the procedure is called, the query will ignore the department filter.
### Calling the Stored Procedure with Default Parameters
You can call this stored procedure in various ways depending on whether you want to use the default values or provide specific values:
* Using Default Values for Both Parameters:
```sql
EXEC employees.GetEmployees;
```
* Providing a Value for @DeptID Only:
```sql
EXEC employees.GetEmployees @DeptID = 10;
```
* Providing a Value for @Commission Only:
```sql
EXEC employees.GetEmployees @Commission = 150;
```
* Providing Values for Both Parameters:
```sql
EXEC employees.GetEmployees @DeptID = 30, @Commission = 500;
```
* Providing Values Using Named Parameters (Out of Order):
```sql
EXEC employees.GetEmployees @Commission = 200, @DeptID = 30;
```

### Procedure with RETURN Statement
The RETURN statement is used to exit a procedure immediately and return an integer value back to the caller. This is often used to signal success, failure, or a specific status code. It is different from an OUTPUT parameter, which returns a data value. The return value is typically a status code and can be used for error checking.

* Example: Procedure with a Status Code RETURN

This procedure checks if a department exists. It returns 1 if the department is found and 0 if it is not.

```sql

CREATE PROCEDURE employees.CheckDepartmentExists
    @DeptName VARCHAR(100)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM employees.dept WHERE dname = @DeptName)
        RETURN 1; -- Return 1 for "exists"
    ELSE
        RETURN 0; -- Return 0 for "does not exist"
END
GO

-- How to execute and capture the return value
DECLARE @Result INT;
EXEC @Result = employees.CheckDepartmentExists @DeptName = 'ACCOUNTING';

IF @Result = 1
    PRINT 'Department exists.';
ELSE
    PRINT 'Department does not exist.';
GO
```

###  EXECUTE AS Clause for Security
This is an advanced security feature. The EXECUTE AS clause allows a stored procedure to run under the security context of a different user. This is useful for enforcing the principle of least privilege, as it allows a user to run a procedure without having direct permissions on the underlying tables.

Example: Granting a User Permission to Run an SP but not Access the Data Directly

Create a user without permissions on the emp table.

Create a stored procedure with the EXECUTE AS OWNER clause. The owner of the procedure (e.g., dbo) has permissions on the emp table.

Grant the user permission to execute the procedure.

```sql

-- Create a new user (for demonstration)
CREATE USER GuestUser WITHOUT LOGIN;
GO
-- The user does NOT have SELECT permissions on the emp table
-- REVOKE SELECT ON employees.emp FROM GuestUser;

-- Create a procedure that executes as its owner (dbo), who has permissions
CREATE PROCEDURE employees.GetEmployeeCount_Secured
WITH EXECUTE AS OWNER
AS
BEGIN
    SELECT COUNT(*) FROM employees.emp;
END
GO
-- Grant the user permission to execute the procedure
GRANT EXECUTE ON employees.GetEmployeeCount_Secured TO GuestUser;
```
-- Now, when GuestUser executes the procedure, it runs with dbo's permissions
-- EXECUTE AS USER = 'GuestUser';
-- EXEC employees.GetEmployeeCount_Secured;
-- REVERT;
This is a critical topic for production environments to ensure database security.

### Recompiling Stored Procedures
Over time, the query plans for stored procedures can become outdated as data changes. This can lead to poor performance. You can force SQL Server to recompile a stored procedure to get a fresh, optimized query plan.

* Methods for Recompilation:

* WITH RECOMPILE: This forces a single-use recompilation. The query plan is not saved to the plan cache. This is useful for procedures where the input parameters vary widely.

```sql
EXEC employees.GetEmployeesByDepartmentName @DeptName = 'Sales' WITH RECOMPILE;
```
* sp_recompile: This marks a stored procedure for recompilation the next time it runs.

```sql
EXEC sp_recompile 'employees.GetEmployeesByDepartmentName';
```

### Benefits of Default Parameters
* **Simplicity:** Reduces the number of overloaded procedures/functions needed to handle different scenarios.
* **Flexibility:** Allows the caller to specify only the parameters they are interested in, using defaults for others.
* **Maintainability:** Makes the code easier to maintain and update since changes to default logic can be centralized in the procedure/function definition.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
