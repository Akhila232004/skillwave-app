![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Variables & Operators
## Variables:
* Variables are named placeholders that store single values of a specific data type.
### Step 1: Declare Variables
* First, we declare two variables to store the department name and the minimum salary for the query.
```sql
DECLARE @DeptName VARCHAR(100);
DECLARE @MinSalary DECIMAL(10, 2);
```
* `@DeptName` is a variable of type `VARCHAR` that will hold the name of the department.
* `@MinSalary` is a variable of type `DECIMAL` that will hold the minimum salary threshold.
### Step 2: Assign Values to Variables
* Next, we assign values to these variables. These values will be used in the query to filter the results.
```sql
SET @DeptName = 'sales';
SET @MinSalary = 1500.00;
```
* We set `@DeptName` to 'sales' to filter employees who work in the Sales department.
* We set `@MinSalary` to 1500.00 to filter employees who earn more than $1,500.
### Step 3: Use Variables in a SELECT Statement
* We use a SELECT statement to retrieve employee details from the emp and dept tables, using the variables `@DeptName` and `@MinSalary` with the `WHERE` clause to apply the filters
```sql
SELECT e.ename, e.job, e.sal
FROM employees.emp e
INNER JOIN employees.dept d ON e.deptno = d.deptno
WHERE d.dname = @DeptName AND e.sal > @MinSalary;
```
* We join the emp and dept tables using an `INNER JOIN` on the deptno field to associate employees with their departments.
* We use the `WHERE` clause to filter the results based on the department name (d.dname = @DeptName) and the minimum salary (e.sal > @MinSalary).
* The > operator is used to compare the employee's salary with the minimum salary stored in the @MinSalary variable.
* This query will return a list of employees who work in the Sales department and whose salary is greater than $1500,000, displaying their names, job titles, and salaries.
### Step 4: Using SET vs. SELECT for Variable Assignment: 
* This step can focus on the difference between the two methods, especially how they handle multiple rows. This is a common point of confusion for beginners and a great topic for an advanced section.
```sql
  -- This will cause an error because the subquery returns multiple rows
   DECLARE @EmployeeCount INT;
  SET @EmployeeCount = (SELECT COUNT(*) FROM Employees.emp GROUP BY deptno);
```
-- Msg 512, Subquery returned more than 1 value. This is not permitted...
 
* SELECT with Multiple Rows (Will Assign NULL or the Last Value)
```sql
-- SELECT will work, but it will only assign the last value returned by the subquery,
-- which can lead to unexpected results.
DECLARE @LastSalary DECIMAL(10, 2);
SELECT @LastSalary = sal FROM employees.emp ORDER BY sal;

-- The result will be the salary of the last employee in the list
SELECT @LastSalary AS 'LastSalaryFromSelect';
```


### Step 5: Understanding Variable Scope: 
* This is a crucial concept to introduce after assignment. Explaining batch scope and showing an example where a variable isn't accessible after a GO command is a perfect way to demonstrate this.
  Variables in T-SQL have a batch scope. This means a variable is only available within the specific batch of code where it was declared. A batch is a group of one or more Transact-SQL statements sent to the server as a     single unit. A GO command is the most common way to separate batches.
```sql
-- Batch 1: Declare and set a variable.
-- The variable @myVariable exists and is accessible only within this batch.
DECLARE @myVariable INT;
SET @myVariable = 100;
SELECT 'Value in Batch 1:', @myVariable;
GO

-- Batch 2: Attempt to access the same variable.
-- This will fail because the variable's scope ended with the GO command.
-- The SQL Server will throw an error: "Must declare the scalar variable '@myVariable'."
SELECT 'Value in Batch 2:', @myVariable;
GO

```
This example demonstrates how a variable declared in one batch is not recognized in anothe
## Operators
### Arithmetic Operators
* **Addition**: Adds two numbers 
```sql
  SELECT 10 + 5 AS Result;  -- Result: 15
```   
* **Multiplication**: Multiplies one number times another
```sql
SELECT 10 * 5 AS Result;  -- Result: 50
```
* **Division**: Divides one number by another.
```sql
SELECT 10 / 5 AS Result;  -- Result: 2
```
* **Modulo**: Returns the remainder of one number divided by another.
```sql
SELECT 10 % 3 AS Result;  -- Result: 1
```
### Comparison Operators : 
* **Equal to**: Checks if two values are equal.
``` sql
SELECT CASE WHEN 10 = 10 THEN 'True' ELSE 'False' END AS Result;  
```  
* **Greater than**: Checks if the left value is greater than the right value.
``` sql
SELECT CASE WHEN 10 > 5 THEN 'True' ELSE 'False' END AS Result;  
``` 
* **Less than**: Checks if the left value is less than the right value.
``` sql
SELECT CASE WHEN 5 < 10 THEN 'True' ELSE 'False' END AS Result; 
```
* **Greater than or equal to**: Checks if the left value is greater than or equal to the right value.
``` sql
SELECT CASE WHEN 10 >= 10 THEN 'True' ELSE 'False' END AS Result;
``` 
* **Less than or equal to**: Checks if the left value is less than or equal to the right value.
``` sql
SELECT CASE WHEN 5 <= 10 THEN 'True' ELSE 'False' END AS Result;  
```
* **<> or != (Not equal to)**: Checks if two values are not equal.
```sql
SELECT CASE WHEN 10 != 5 THEN 'True' ELSE 'False' END AS Result; 
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
