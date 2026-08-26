![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Data Query Language
* In SQL Server, DQL (Data Query Language) refers to the subset of SQL (Structured Query Language) specifically designed for querying and retrieving data from a SQL Server database.
* DQL primarily involves the use of SELECT statements to extract information from one or more tables within the database.

## SELECT Statement
* The fundamental component of DQL is the SELECT statement, which is used to retrieve data from one or more tables in the database.
* It allows users to specify the columns they want to retrieve from one or more tables in the database.
* SELECT statements can also include various clauses for filtering, sorting, and grouping the data.
```sql
-- Retrieve all columns from the emp table
SELECT * FROM employees.emp;

-- Retrieve empno, ename and job columns from the emp table
SELECT empno, ename, job FROM employees.emp;

-- DISTINCT can be used to retrieve unique titles from the column
SELECT DISTINCT job FROM employees.emp;

-- Using alias to display column name as per requirement
SELECT DISTINCT job AS employeejob FROM employees.emp;
```

## Commonly used clauses in SQL Server:
* In SQL Server DQL, clauses are components of SQL statements that provide additional instructions or conditions to control the behavior of the query.
* Clauses can be used in various SQL statements such as SELECT, INSERT, UPDATE, DELETE, and more.
* These clauses allow users to filter, manipulate, and organize data according to specific requirements.
### WHERE Clause:
* The WHERE clause is used to filter rows based on specified conditions.
```sql
-- Retrieve employees with a specific job title
SELECT * FROM employees.emp WHERE job = 'manager';

-- Retrieve employees hired after a specific date
SELECT * FROM employees.emp WHERE hiredate > '1982-01-01';

-- Retrieve employees with a salary higher than a certain amount
SELECT * FROM employees.emp WHERE sal > 2000;
```
### GROUP BY Clause:
* The GROUP BY clause is used to group rows that have the same values into summary rows.
```sql
-- Calculate the total salary expense for each dept
SELECT deptno, SUM(sal) AS total_salary
FROM employees.emp
GROUP BY deptno;

-- Count the number of employees in each job title
SELECT job, COUNT(*) AS num_employees
FROM employees.emp
GROUP BY job;

-- Calculate the average commission for each dept
SELECT deptno, AVG(commission) AS avg_commission
FROM employees.emp
GROUP BY deptno;
```
### HAVING Clause:
* The HAVING clause is used to filter groups of rows returned by a GROUP BY clause.
```sql
-- Retrieve departments with more than two employees
SELECT deptno, COUNT(*) AS num_employees
FROM employees.emp
GROUP BY deptno
HAVING COUNT(*) > 2;

-- Retrieve job titles with an average salary greater than 2500
SELECT job, AVG(sal) AS avg_salary
FROM employees.emp
GROUP BY job
HAVING AVG(sal) > 2500;

-- Retrieve departments where the total salary expense exceeds 10000
SELECT deptno, SUM(sal) AS total_salary
FROM employees.emp
GROUP BY deptno
HAVING SUM(sal) > 10000;
```
### ORDER BY Clause:
* The ORDER BY clause is used to sort the result set based on specified columns.
```sql
-- Retrieve employees sorted by salary in descending order
SELECT *
FROM employees.emp
ORDER BY sal DESC;

-- Retrieve employees sorted by hire date in ascending order
SELECT *
FROM employees.emp
ORDER BY hiredate ASC;

-- Retrieve employees sorted by department number in ascending
-- and salary in descending order
SELECT *
FROM employees.emp
ORDER BY deptno ASC, sal DESC;
```
### TOP Clause:
* The TOP clause is used to limit the number of rows returned by a query.
```sql
-- Retrieve the first 5 employees
SELECT TOP 5 *
FROM employees.emp;

-- Retrieve the employees with the top 10 highest salaries
SELECT TOP 10 *
FROM employees.emp
ORDER BY sal DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
