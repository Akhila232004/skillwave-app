![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Functions
Functions are powerful, reusable database objects that encapsulate business logic and data processing. They are designed to compute a value or return a result set, and they are a key component of modular, efficient database design. Unlike stored procedures, which are executed as standalone statements, functions are typically called from within a query, allowing them to be seamlessly integrated into SELECT, WHERE, JOIN, and other clauses.

## Key Characteristics and Types
Scalar Functions: These functions return a single data value, such as an integer, string, or date. They are commonly used to perform calculations, data conversions, or complex logical operations on a single value. Scalar functions can be used in almost any place where an expression is allowed within a query.

### Table-Valued Functions (TVFs): 
These functions return a result set (a virtual table). TVFs are highly flexible and can be used in the FROM clause of a query, much like a regular table or view. They are particularly useful for encapsulating complex joins or data filtering logic that can then be reused in multiple queries.

### Inline TVFs (ITVFs): 
These are the most performant type of TVF. They consist of a single SELECT statement, and the query optimizer can "inline" their logic directly into the calling query. This allows for efficient, cost-based optimization and is the preferred method for creating TVFs.

### Multi-Statement TVFs (MTVF): 
These functions can contain multiple T-SQL statements, including BEGIN...END blocks and other procedural logic. However, they are less performant than ITVFs because the query optimizer cannot see the logic inside the function, treating it as a "black box" with a fixed row count. They should be used only when the logic cannot be expressed in a single SELECT statement.

## Advantages and Best Practices
* Reusability: Functions centralize complex logic, allowing developers to call a single function instead of rewriting code, which improves code consistency and reduces errors.

* Modularity: They break down complex problems into smaller, manageable, and reusable components.

* Query Integration: Functions can be used directly within a query, making the SQL code more expressive and easier to read.

* Determinism: Understanding whether a function is deterministic (always returns the same result for the same input) is crucial for performance. Only deterministic functions can be used in indexed computed columns, which can dramatically speed up query performance.

* Performance: A key best practice is to prioritize ITVFs over MTVFs whenever possible due to the significant performance difference. The APPLY operator is an advanced tool that can be used with TVFs to achieve powerful, dynamic joins that might be cumbersome with standard JOIN syntax.

## Function with Input Parameter
* In SQL Server, you can create functions that accept input parameters, allowing you to pass values to the function and perform operations based on those values.
```sql
-- Function to Get Employee Details by Department Number
CREATE FUNCTION GetEmployeesByDepartment (@DeptID INT)
RETURNS TABLE
AS
RETURN
    SELECT empno, ename, job
    FROM employees.emp
    WHERE deptno = @DeptID;
```
* Execute the function
```sql
-- Use the function to get employee details for department id 30
SELECT * FROM GetEmployeesByDepartment(30);
```
* We create a table-valued function named `GetEmployeesByDepartment` that takes an integer parameter` @DeptID`, representing the department ID.
* The function returns a table that contains the employee ID, employee name, and job title for all employees who work in the department specified by` @DeptID`.
* The `WHERE` clause in the `SELECT` statement filters the employees based on the department ID.
* To use the function, we call it in a `SELECT` statement, passing the desired department ID as an argument.
* In this case, we pass '10' to get the details of employees in department 10.

## Function with Default Parameter Value
* We can assign default values to parameters in stored procedures and functions.
* When a default value is specified for a parameter, you can omit that parameter when calling the procedure or function, and the default value will be used instead.
``` sql
-- Function to Get Employee Details by Department Number with default parameter
CREATE FUNCTION employees.GetEmployeesByDepartmentDefault (@DeptID INT = NULL)
RETURNS TABLE
AS
RETURN
    SELECT empno, ename, job
    FROM employees.emp
    WHERE deptno = ISNULL(@DeptID, deptno);
```
* Execute the function
``` sql
-- Use the function without specifying a department ID
SELECT * FROM employees.GetEmployeesByDepartmentDefault(DEFAULT);
-- Use the function with a specific department ID
SELECT * FROM employees.GetEmployeesByDepartmentDefault(10);
```
* We create a table-valued function named `GetEmployeesByDepartmentDefault` with an  integer parameter `@DeptID`. We assign a default value of `NULL` to `@DeptID`.
* The function returns a table containing the employee ID, employee name, and  job title.
* The `WHERE` clause uses the `ISNULL` function to check if `@DeptID` is `NULL`. If it  is, the condition `dept_id = dept_id` is effectively ignored, and employees  from all departments are returned. If `@DeptID` is not NULL, only employees  from the specified department are returned.
* When calling the function, you can either omit the parameter to get  employees from all departments or provide a specific department ID to get  employees from that department. 

## Return Statement
* In SQL Server, the `RETURN` statement is used in functions to exit the function and return a value to the caller.
* The value returned by the function can be a scalar value or a table, depending on the type of function.
### Scalar Functions
* A scalar function returns a single value (e.g., an integer, a decimal, or a string). In a scalar function, the `RETURN` statement is used to specify the value that should be returned.
```sql
CREATE FUNCTION employees.GetEmployeeCount()
RETURNS INT
AS
BEGIN
    DECLARE @Count INT;

    -- Count the number of employees
    SELECT @Count = COUNT(*) FROM employees.emp;

    -- Return the count
    RETURN @Count;
END
-- Use the function
SELECT employees.GetEmployeeCount() AS EmployeeCount;
```
### Table-Valued Functions
* A table-valued function returns a table. In a table-valued function, the `RETURN` statement is used to return a table variable or to conclude a `RETURN` clause that contains a `SELECT` statement.
* Inline Table-Valued Function, the `RETURN` statement directly contains a `SELECT` statement that produces the result set.
```sql
CREATE FUNCTION employees.GetEmployeesByDepartment(@DeptID INT)
RETURNS TABLE
AS
RETURN (
    SELECT ename, job FROM employees.emp WHERE deptno = @DeptID
)
-- Use the function
SELECT * FROM employees.GetEmployeesByDepartment(20);
```
* In this example, the `GetEmployeesByDepartment` function returns a table containing the names and job titles of employees in a specified department.
* In a multi-statement table-valued function, the `RETURN` statement is used to return a declared table variable.
```sql
CREATE FUNCTION employees.GetAllEmployees()
RETURNS @EmployeeTable TABLE (ename VARCHAR(100), job VARCHAR(100))
AS
BEGIN
    -- Insert data into the table variable
    INSERT INTO @EmployeeTable (ename, job)
    SELECT ename, job FROM emp;
    
    -- Return the table variable
    RETURN;
END
-- Use the function
SELECT * FROM employees.GetAllEmployees();
```
### Multi-Statement Table-Valued Functions (MTVF)::
MIVF are less performant because they are treated as black boxes. The query optimizer cannot see the logic inside the function and therefore cannot generate an efficient plan. It assumes a fixed number of rows will be returned, which can lead to poor performance on large datasets. They are useful only when the logic requires multiple steps that cannot be expressed in a single SELECT statement.

* Example: The Performance Cost of an MTVF

```sql
-- Create a multi-statement TVF (MTVF)
CREATE FUNCTION employees.GetEmployeeByDept_MTVF (@DeptID INT)
RETURNS @EmpTable TABLE (ename VARCHAR(10), job VARCHAR(9))
AS
BEGIN
    INSERT INTO @EmpTable
    SELECT ename, job
    FROM employees.emp
    WHERE deptno = @DeptID;
    
    RETURN;
END;
GO
-- Create an inline TVF (ITVF)
CREATE FUNCTION employees.GetEmployeeByDept_ITVF (@DeptID INT)
RETURNS TABLE
AS
RETURN (
    SELECT ename, job
    FROM employees.emp
    WHERE deptno = @DeptID
);
GO
-- The ITVF will have a much more efficient query plan than the MTVF,
-- especially when joined with other tables.
-- The query optimizer can 'see' the ITVF logic and optimize it.
SELECT T1.ename, T2.dname
FROM employees.GetEmployeeByDept_ITVF(20) AS T1
JOIN employees.dept AS T2 ON T1.deptno = T2.deptno; -- This is just a hypothetical example
-- The MTVF will be treated as a fixed-row-count object, leading to a
-- less optimal plan when joined.
```

### Combining Scalar Functions with APPLY
The APPLY operator is a more advanced way to use functions. It is similar to a join but allows you to invoke a table-valued function for each row of an outer table expression. This is a common and powerful pattern.

* Example: Using CROSS APPLY

Suppose you have a function that returns the employees for a given department. You can use CROSS APPLY to dynamically join the dept and emp tables using the function, which is useful for complex scenarios.

```sql
-- This assumes GetEmployeesByDepartment is an inline TVF.
SELECT d.dname, e.ename, e.job
FROM employees.dept AS d
CROSS APPLY employees.GetEmployeesByDepartment(d.deptno) AS e;
```

### Key Points
* In scalar functions, the `RETURN` statement specifies the single value to be returned.
* In table-valued functions, the `RETURN` statement is used to return a result set or a table variable.
* The `RETURN` statement immediately exits the function and returns control to the caller.

## Execute the Function with Begin and End
```sql
-- Execute the Function with Begin and End:
BEGIN
    -- Execute a scalar function and store the result in a variable
    DECLARE @TotalEmployees INT;
    SET @TotalEmployees = employees.GetEmployeeCount();
    PRINT 'Total number of employees: ' + CAST(@TotalEmployees AS VARCHAR);
END

-- Executing a Table-Valued Function with Begin and End
BEGIN
    -- Execute a table-valued function and use the result set directly
    SELECT * FROM employees.GetEmployeesByDepartment(10);

    -- Alternatively, store the result set in a table variable for further processing
    DECLARE @EmployeeDetails TABLE (emp_name VARCHAR(100), job_title VARCHAR(100));
    INSERT INTO @EmployeeDetails
    SELECT * FROM employees.GetEmployeesByDepartment(10);

    SELECT * FROM @EmployeeDetails;
END
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
