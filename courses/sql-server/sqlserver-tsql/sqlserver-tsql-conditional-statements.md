![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Conditional Statements
* Conditional statements in SQL Server, such as `IF...ELSE`, `CASE`, and `IIF`, are useful for executing different SQL statements based on specific conditions.

## IF...ELSE Statement
* The `IF...ELSE` statement allows you to execute a block of SQL statements if a condition is true, and another block if the condition is false.
```sql
-- Check if a Department Exists
DECLARE @DeptName VARCHAR(100) = 'accounting';

IF EXISTS (SELECT 1 FROM employees.dept WHERE dname = @DeptName)
    BEGIN
        PRINT 'The department exists.';
    END
ELSE
    BEGIN
        PRINT 'The department does not exist.';
    END
```

```sql

SELECT
    d.dname AS Department,
    COUNT(CASE WHEN e.job = 'MANAGER' THEN 1 END) AS Managers,
    COUNT(CASE WHEN e.job = 'ANALYST' THEN 1 END) AS Analysts,
    COUNT(CASE WHEN e.job = 'CLERK' THEN 1 END) AS Clerks,
    COUNT(e.empno) AS TotalEmployees
FROM
    employees.emp AS e
INNER JOIN
    employees.dept AS d ON e.deptno = d.deptno
GROUP BY
    d.dname
ORDER BY
    d.dname;

```
* In this example, we check if there is a department named 'accounting' in the dept table. If it exists, we print a message indicating that the department exists. Otherwise, we print a message indicating that it does not exist.

## CASE Statement
* The `CASE` statement is used for conditional logic within a SELECT query. It evaluates a list of conditions and returns a result for the first condition that is true.
 ```sql
SELECT 
    ename,
    CASE 
        WHEN sal < 1500 THEN 'Low'
        WHEN sal BETWEEN 1500 AND 3000 THEN 'Medium'
        ELSE 'High'
    END AS SalaryCategory
FROM employees.emp;
```

```sql
-- Update salaries based on job title
UPDATE e
SET
    sal = CASE
        WHEN e.job = 'MANAGER' THEN e.sal * 1.15 -- 15% raise for managers
        WHEN e.job = 'SALESMAN' THEN e.sal * 1.10 -- 10% raise for salesmen
        ELSE e.sal * 1.05 -- 5% raise for everyone else
    END
FROM
    employees.emp AS e;

-- Verify the changes
SELECT ename, job, sal
FROM employees.emp
WHERE job IN ('MANAGER', 'SALESMAN', 'CLERK');

```
* In this example, we categorize employees into 'Low', 'Medium', and 'High' salary groups based on their salary in the emp table.

## IIF Function
* The `IIF` function is a shorthand way to write a simple IF...ELSE condition. It takes three arguments: a condition, a true value, and a false value.
```sql
SELECT 
    ename,
    sal,
    IIF(sal > (SELECT AVG(sal) FROM employees.emp), 'Above Average', 'Below Average') AS SalaryStatus
FROM employees.emp;
```

```sql
DECLARE @DeptToModify INT = 20;
DECLARE @NewSalary INT = 3100;

-- Start the transaction
BEGIN TRANSACTION;

BEGIN TRY
    -- First check: Does the department exist?
    IF EXISTS (SELECT 1 FROM employees.dept WHERE deptno = @DeptToModify)
    BEGIN
        -- Second check: Is the new salary reasonable?
        IF @NewSalary > (SELECT MAX(sal) FROM employees.emp WHERE deptno = @DeptToModify)
        BEGIN
            -- This block executes only if both conditions are true.
            UPDATE employees.emp
            SET sal = @NewSalary
            WHERE deptno = @DeptToModify AND job = 'ANALYST';

            PRINT 'Salaries updated successfully for department ' + CAST(@DeptToModify AS VARCHAR);
            COMMIT TRANSACTION; -- All operations were successful, commit the changes.
        END
        ELSE
        BEGIN
            -- Inner ELSE block
            PRINT 'Error: New salary is not higher than the current max salary for department ' + CAST(@DeptToModify AS VARCHAR);
            ROLLBACK TRANSACTION; -- Roll back changes due to business rule violation.
        END
    END
    ELSE
    BEGIN
        -- Outer ELSE block
        PRINT 'Error: Department ' + CAST(@DeptToModify AS VARCHAR) + ' does not exist.';
        ROLLBACK TRANSACTION; -- Roll back the transaction.
    END
END TRY
BEGIN CATCH
    -- The CATCH block handles any unexpected errors and rolls back the transaction.
    PRINT 'An unexpected error occurred. Rolling back the transaction.';
    ROLLBACK TRANSACTION;
    THROW; -- Re-throw the original error.
END CATCH;

```
* In this example, we use the `IIF` function to check if each employee's salary is above the average salary in the emp table. The result is a column that indicates whether each employee's salary is 'Above Average' or 'Below Average'.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
