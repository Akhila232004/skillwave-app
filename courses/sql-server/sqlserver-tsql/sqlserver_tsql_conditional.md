![Tinitiate SQLSERVER Training](../images/sqlserver.png)

# Conditional Statements in SQL Server 

* Conditional statements in SQL Server, such as IF...ELSE, CASE, and IIF, are useful for executing different SQL statements based on specific conditions. Here's how you can use these statements with the emp, dept, and sal tables:

## IF...ELSE Statement
 The IF...ELSE statement allows you to execute a block of SQL statements if a condition is true, and another block if the condition is false.

Example: Check if a Department Exists
 ```sql
    DECLARE @DeptName VARCHAR(100) = 'IT';

    IF EXISTS (SELECT 1 FROM dept WHERE dept_name = @DeptName)
        BEGIN
            PRINT 'The department exists.';
        END
    ELSE
        BEGIN
            PRINT 'The department does not exist.';
    END
```
In this example, we check if there is a department named 'IT' in the dept table. If it exists, we print a message indicating that the department exists. Otherwise, we print a message indicating that it does not exist.

## CASE Statement
 The CASE statement is used for conditional logic within a SELECT query. It evaluates a list of conditions and returns a result for the first condition that is true.

Example: Categorize Employees Based on Salary
 ```sql
    SELECT 
        emp_name,
        CASE 
            WHEN salary < 50000 THEN 'Low'
            WHEN salary BETWEEN 50000 AND 100000 THEN 'Medium'
            ELSE 'High'
        END AS SalaryCategory
    FROM emp;
```
In this example, we categorize employees into 'Low', 'Medium', and 'High' salary groups based on their salary in the emp table.

## IIF Function
 The IIF function is a shorthand way to write a simple IF...ELSE condition. It takes three arguments: a condition, a true value, and a false value.

Example: Check if Salary is Above Average
```sql

    SELECT 
        emp_name,
        salary,
        IIF(salary > (SELECT AVG(salary) FROM emp), 'Above Average', 'Below Average') AS SalaryStatus
    FROM emp;
```
In this example, we use the IIF function to check if each employee's salary is above the average salary in the emp table. The result is a column that indicates whether each employee's salary is 'Above Average' or 'Below Average'.
