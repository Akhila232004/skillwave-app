# Variables & Operators

In this example, we demonstrate how to use variables and operators in SQL Server to query data from the emp (employees) and dept (departments) tables.

## Variables : 

* Step 1: Declare Variables
First, we declare two variables to store the department name and the minimum salary for the query:

```sql
DECLARE @DeptName VARCHAR(100);
DECLARE @MinSalary DECIMAL(10, 2);

```

@DeptName is a variable of type VARCHAR that will hold the name of the department.
@MinSalary is a variable of type DECIMAL that will hold the minimum salary threshold.

**Step 2:** Assign Values to Variables
Next, we assign values to these variables. These values will be used in the query to filter the results:

```sql
SET @DeptName = 'IT';
SET @MinSalary = 60000.00;

```

We set @DeptName to 'IT' to filter employees who work in the IT department.
We set @MinSalary to 60000.00 to filter employees who earn more than $60,000.

**Step 3:** Use Variables in a SELECT Statement
We use a SELECT statement to retrieve employee details from the emp and dept tables, using the variables @DeptName and @MinSalary with the WHERE clause to apply the filters:

```sql 
SELECT e.emp_name, e.job_title, e.salary
FROM emp e
INNER JOIN dept d ON e.dept_id = d.dept_id
WHERE d.dept_name = @DeptName AND e.salary > @MinSalary;

```
We join the emp and dept tables using an INNER JOIN on the dept_id field to associate employees with their departments.

We use the WHERE clause to filter the results based on the department name (d.dept_name = @DeptName) and the minimum salary (e.salary > @MinSalary).

The > operator is used to compare the employee's salary with the minimum salary stored in the @MinSalary variable.

This query will return a list of employees who work in the IT department and whose salary is greater than $60,000, displaying their names, job titles, and salaries.

## Operators
* Arithmetic Operators
* Comparison Operators
* Logical Operators
* LIKE Operator
* IN Operator
* BETWEEN Operator
 
 ### Arithmetic Operators
* Addition : Adds two numbers 
  ```sql
    SELECT 10 + 5 AS Result;  -- Result: 15
  ```   
* Substraction : Subtracts one number from another

  ```sql
    SELECT 10 * 5 AS Result;  -- Result: 50
  ```
* (Division): Divides one number by another.

  ```sql
    SELECT 10 / 5 AS Result;  -- Result: 2
  ```
* (Modulo): Returns the remainder of one number divided by another.
  ```sql
    SELECT 10 % 3 AS Result;  -- Result: 1
  ```   
 ### Comparison Operators : 
Comparison operators are used to compare two values. Here are the commonly used comparison operators in SQL Server:

 * Equal to : Checks if two values are equal.
    ``` sql
        SELECT CASE WHEN 10 = 10 THEN 'True' ELSE 'False' END AS Result;  
    ```  
 * Greater than : Checks if the left value is greater than the right value.
    ``` sql
        SELECT CASE WHEN 10 > 5 THEN 'True' ELSE 'False' END AS Result;  
    ``` 
 * Less than : Checks if the left value is less than the right value.
    ``` sql
        SELECT CASE WHEN 5 < 10 THEN 'True' ELSE 'False' END AS Result; 
    ```
 * Greater than or equal to : Checks if the left value is greater than or equal to the right value.

    ``` sql
        SELECT CASE WHEN 10 >= 10 THEN 'True' ELSE 'False' END AS Result;
    ``` 
 * Less than or equal to : Checks if the left value is less than or equal to the right value.

    ``` sql
        SELECT CASE WHEN 5 <= 10 THEN 'True' ELSE 'False' END AS Result;  
    ```
* <> or != (Not equal to) : Checks if two values are not equal.
    ```sql
        SELECT CASE WHEN 10 != 5 THEN 'True' ELSE 'False' END AS Result; 
    ```