![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations
* Set operations in SQL are used to combine or compare the results of two or more queries.
* These are essential for manipulating and combining data from multiple tables.
* The main set operations include UNION, INTERSECT, and EXCEPT.

## Set Operations in SQL Server:
### UNION:
* The UNION operator is used to combine the results of two or more SELECT statements into a single result set.
* It returns all distinct rows from both result sets. It removes duplicate rows by default.

<img width="166" height="117" alt="image" src="https://github.com/user-attachments/assets/7d653f1c-b0d9-45e8-9715-c5c7dfd10b29" />

```sql
-- Retrieve unique department numbers from both the employees
-- and projects tables
SELECT deptno FROM employees.emp
UNION
SELECT projectno AS deptno FROM employees.projects;

-- Retrieve unique employee names and project names from both the employees
-- and projects tables
SELECT ename AS name FROM employees.emp
UNION
SELECT 'Project: ' + CAST(projectno AS VARCHAR) AS name FROM employees.projects;

-- Combine the names of employees, departments, and projects
SELECT ename AS name FROM employees.emp
UNION
SELECT dname AS name FROM employees.dept
UNION
SELECT CAST(projectno AS VARCHAR) AS name FROM employees.projects;
```
### UNION ALL:
* This operator does same as UNION with including duplicate rows

<img width="174" height="100" alt="image" src="https://github.com/user-attachments/assets/d7fdcfec-c791-40aa-9789-88e5b7712b9a" />

```sql
-- Retrieve all department numbers from both the employees
-- and projects tables
SELECT deptno FROM employees.emp
UNION ALL
SELECT projectno AS deptno FROM employees.projects;
```
### INTERSECT:
* The INTERSECT operator is used to retrieve the common rows that appear in the result sets of two or more SELECT statements. It removes duplicate rows by default.

<img width="170" height="113" alt="image" src="https://github.com/user-attachments/assets/bc217753-bc8b-4b69-adfb-8427753b93c8" />

```sql
-- Retrieve grade number that exist in salgrade
-- and projects tables
SELECT grade FROM employees.salgrade
INTERSECT
SELECT projectno AS grade FROM employees.projects;

-- Retrieve employee numbers that exist in both the employees
-- and employee projects tables
SELECT empno FROM employees.emp
INTERSECT
SELECT empno FROM employees.emp_projects;
```
### EXCEPT:
* The EXCEPT operator is used to retrieve the rows that appear in the first result set but not in the result sets of one or more subsequent SELECT statements. It removes duplicate rows by default.

<img width="162" height="116" alt="image" src="https://github.com/user-attachments/assets/c27a2a58-00ea-44d3-98d3-00e84b466f33" />


```sql
-- Retrieve empno numbers from the employees table that
-- do not exist in the employee projects table
SELECT empno FROM employees.emp
EXCEPT
SELECT empno FROM employees.emp_projects;

-- Retrieve grade number from salgrade and do not exit in
-- projects tables
SELECT grade FROM employees.salgrade
EXCEPT
SELECT projectno AS grade FROM employees.projects;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
