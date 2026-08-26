![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Dynamic SQL
Dynamic SQL is a powerful programming technique in which you build and execute a SQL statement as a string at runtime. This is a crucial skill for scenarios where elements of a query, such as table names, column lists, or WHERE clause filters, are not known until the code is executed. While dynamic SQL offers great flexibility, it requires careful implementation to avoid performance and security issues.

## Key Advantages
* Flexibility: Enables highly adaptable queries that can respond to user input or changes in the database schema.

* Adaptable Logic: Allows for conditional logic to alter the structure of a query, such as adding or removing JOINs or WHERE clauses.

## Key Disadvantages
* Security Risks: It is highly susceptible to SQL injection attacks if not implemented with proper parameterization.

* Debugging: Debugging and troubleshooting can be difficult because syntax errors are not caught until the query is executed.

* Performance: Can lead to poor performance and constant query recompilations if not handled correctly.

* Permissions: Requires the executing user to have direct permissions on the underlying database objects.

## Core Concepts and Methods
### Setup: Test Table for Dynamic SQL
All the following examples use this table.

```sql
-- Create table 'dynsql_test'
CREATE TABLE dynsql_test (
     test_id       INT
    ,test_date     DATE
    ,test_string   VARCHAR(1000)
    ,test_decimal  DECIMAL(10,2)
);
```
### Executing with EXEC()
The EXEC() command runs a string literal or a string variable containing a SQL statement. It is the simplest method for dynamic SQL but is also the most dangerous.

How it works: EXEC() uses string concatenation to build the final query string. All values, including user input, are embedded directly into the executable statement.

The Danger: This method is vulnerable to SQL Injection, where a malicious user can inject code that alters the query's intent. For this reason, EXEC() is not recommended for production code that handles user input.

```sql
-- EXEC Demo Block (for demonstration only)
DECLARE  @test_id      INT
        ,@test_date    VARCHAR(1000)
        ,@test_string  VARCHAR(1000)
        ,@test_decimal DECIMAL(10,2)
        ,@sql          VARCHAR(3000);

-- Assign values
SET @test_id      = 1;
SET @test_date    = 'GETDATE()';
SET @test_string  = 'TEST';
SET @test_decimal = 10.2;

-- Build dynamic statement using concatenation
SET @sql = 'INSERT INTO dynsql_test VALUES( ' +
           CAST(@test_id AS VARCHAR) +' , '+
           CAST(@test_date AS VARCHAR) +' , '+
           ''''+CAST(@test_string AS VARCHAR)+''''+' , '+
           CAST(@test_decimal AS VARCHAR) + ');';
           
-- Print the @sql statement to see the final output
PRINT @sql;

-- Execute dynamic statement
EXEC(@sql);
PRINT 'Rows Affected ' + CAST(@@rowcount AS VARCHAR);
```

### Executing with sp_executesql
sp_executesql is a system stored procedure that provides a secure and efficient way to execute dynamic SQL. It is the recommended method for all dynamic SQL in production environments.

How it works: sp_executesql allows for parameterization. The query string and the parameter values are passed as separate arguments. The database engine treats the parameters as data, not as executable code, which completely mitigates the risk of SQL injection.

The Benefit: This method allows the SQL Server query optimizer to reuse execution plans. Since the query string remains the same and only the parameter values change, the optimizer can save and reuse the compiled plan, which significantly reduces overhead and improves performance.

```sql
-- sp_executesql Demo Block (BEST PRACTICE)
DECLARE  @test_id      INT = 1;
DECLARE  @test_date    DATE = GETDATE();
DECLARE  @test_string  NVARCHAR(1000) = 'TEST';
DECLARE  @test_decimal DECIMAL(10,2) = 10.2;
DECLARE  @sql          NVARCHAR(3000);
DECLARE  @params       NVARCHAR(500);

-- Define the parameterized SQL statement with placeholders
SET @sql = N'INSERT INTO dynsql_test (test_id, test_date, test_string, test_decimal) 
               VALUES (@p_test_id, @p_test_date, @p_test_string, @p_test_decimal);';

-- Define the parameter declarations for sp_executesql
SET @params = N'@p_test_id INT, @p_test_date DATE, @p_test_string NVARCHAR(1000), @p_test_decimal DECIMAL(10,2)';

-- Execute with parameters
EXECUTE sp_executesql @sql, @params,
                      @p_test_id      = @test_id,
                      @p_test_date    = @test_date,
                      @p_test_string  = @test_string,
                      @p_test_decimal = @test_decimal;

PRINT 'Rows Affected ' + CAST(@@rowcount AS VARCHAR);
```

### Dynamic SELECT with sp_executesql
This is a common and secure use case where you need to build a dynamic WHERE clause.

```sql

-- Dynamic SELECT with Parameterization
DECLARE @sql        NVARCHAR(MAX);
DECLARE @params     NVARCHAR(500);
DECLARE @deptName   VARCHAR(100) = 'ACCOUNTING';
DECLARE @minSal     DECIMAL(10,2) = 2000.00;

-- SQL with placeholders for the WHERE clause
SET @sql = N'SELECT e.ename, e.job, e.sal, d.dname
             FROM employees.emp e
             JOIN employees.dept d ON e.deptno = d.deptno
             WHERE d.dname = @p_deptName AND e.sal > @p_minSal;';

-- Parameter definitions
SET @params = N'@p_deptName VARCHAR(100), @p_minSal DECIMAL(10,2)';

-- Execute the dynamic SELECT statement
EXEC sp_executesql @sql, @params,
                   @p_deptName = @deptName,
                   @p_minSal   = @minSal;
```
##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
