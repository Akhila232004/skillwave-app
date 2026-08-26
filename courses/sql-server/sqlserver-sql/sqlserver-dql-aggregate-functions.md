![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions
* Aggregate functions in SQL Server are used to perform calculations on a set of values and return a single value as a result.
* They allow you to derive summary statistics or perform calculations across multiple rows in a table.
* These functions can be combined with other clauses like GROUP BY, HAVING, and DISTINCT to perform more sophisticated analysis and summarization of data in SQL Server.

## Aggregate functions in SQL Server:
### COUNT:
* Counts the number of rows in a result set.
```sql
-- Counts the number of rows in a emp table
SELECT COUNT(*) AS total_employees FROM employees.emp;

-- Count the number of employees in each department
SELECT deptno, COUNT(*) AS num_employees 
FROM employees.emp 
GROUP BY deptno;

-- Count the number of employees hired after 1985 in each department and
-- only display departments with more than 3 employees
SELECT deptno, COUNT(*) AS num_employees 
FROM employees.emp 
WHERE YEAR(hiredate) > 1985
GROUP BY deptno
HAVING COUNT(*) > 3;

-- Identify the number of employees hired each year
SELECT YEAR(hiredate) AS hire_year, COUNT(*) AS num_employees 
FROM employees.emp 
GROUP BY YEAR(hiredate);
```
### SUM:
* Calculates the sum of values in a numeric column.
```sql
-- Calculate the sum of salary of all employees
SELECT SUM(sal) AS total_salary FROM employees.emp;

-- Calculate the total salary budget for each department
SELECT deptno, SUM(sal) AS total_salary 
FROM employees.emp 
GROUP BY deptno;

-- Calculate the total salary budget for each department,
-- ordered by the total budget in descending order
SELECT deptno, SUM(sal) AS total_salary 
FROM employees.emp 
GROUP BY deptno
ORDER BY total_salary DESC;

-- Calculate the total commission earned by each department
SELECT deptno, SUM(commission) AS total_commission 
FROM employees.emp 
GROUP BY deptno;

-- Calculate the total commission earned by each department and display
-- departments with commissions exceeding 500, ordered by total commission
SELECT deptno, SUM(commission) AS total_commission 
FROM employees.emp 
GROUP BY deptno
HAVING SUM(commission) > 500
ORDER BY total_commission DESC;
```
### AVG:
* Computes the average of values in a numeric column.
```sql
-- Calculates the average value of sal column
SELECT AVG(sal) AS avg_salary FROM employees.emp;

-- Find the average salary of employees in each job position
SELECT job, AVG(sal) AS avg_salary 
FROM employees.emp 
GROUP BY job;

-- Find the average salary of employees hired after 1982
SELECT AVG(sal) AS avg_salary 
FROM employees.emp 
WHERE YEAR(hiredate) > 1985;

-- Identify the departments where the average salary is higher than $2500
SELECT deptno 
FROM employees.emp 
GROUP BY deptno 
HAVING AVG(sal) > 1500;

-- Find the job position with the highest average salary and
-- display the result along with the average salary
SELECT TOP 1 job, AVG(sal) AS avg_salary 
FROM employees.emp 
GROUP BY job
ORDER BY avg_salary DESC;
```
### MAX:
* Retrieves the maximum value in a column.
```sql
-- Retrieves the maximum value in sal column
SELECT MAX(sal) AS max_salary FROM employees.emp;

-- Find the employee(s) with the highest salary
SELECT * 
FROM employees.emp 
WHERE sal = (SELECT MAX(sal) FROM employees.emp);

-- Find the employee(s) with the highest salary in each department
SELECT e.*
FROM employees.emp e
JOIN (
    SELECT deptno, MAX(sal) AS max_salary
    FROM employees.emp
    GROUP BY deptno
) AS max_salaries ON e.deptno = max_salaries.deptno
 AND e.sal = max_salaries.max_salary;
```
### MIN:
* Retrieves the minimum value in a column.
```sql
-- Retrieves the minimum value in sal column
SELECT MIN(sal) AS min_salary FROM employees.emp;

-- Find the employee(s) with the lowest commission
SELECT *
FROM employees.emp
WHERE commission = (SELECT MIN(commission) FROM employees.emp
 WHERE commission IS NOT NULL);

-- Find the employee(s) with the lowest salary in each department
SELECT e.*
FROM employees.emp e
JOIN (
    SELECT deptno, MIN(sal) AS min_salary
    FROM employees.emp
    GROUP BY deptno
) AS min_salaries ON e.deptno = min_salaries.deptno
 AND e.sal = min_salaries.min_salary;

-- Find the department(s) with the lowest average salary
SELECT dname, avg_salary
FROM (
    SELECT d.dname, AVG(e.sal) AS avg_salary
    FROM employees.emp e
    JOIN employees.dept d ON e.deptno = d.deptno
    GROUP BY d.dname
) AS dept_avg_salary
WHERE avg_salary = (SELECT MIN(avg_salary) FROM (
                        SELECT AVG(sal) AS avg_salary FROM employees.emp
                         GROUP BY deptno
                    ) AS dept_avg);

-- Using both max and min
-- Determine the highest and lowest salary in each department
SELECT deptno, MAX(sal) AS max_salary, MIN(sal) AS min_salary 
FROM employees.emp 
GROUP BY deptno;

--Find the department(s) with the highest and lowest average salary,
-- along with their respective average salaries
SELECT dname, avg_salary
FROM (
    SELECT d.dname, AVG(e.sal) AS avg_salary
    FROM employees.emp e
    JOIN employees.dept d ON e.deptno = d.deptno
    GROUP BY d.dname
) AS dept_avg_salary
WHERE avg_salary = (SELECT MAX(avg_salary) FROM (
                        SELECT AVG(sal) AS avg_salary FROM employees.emp
                         GROUP BY deptno
                    ) AS dept_avg)
OR avg_salary = (SELECT MIN(avg_salary) FROM (
                        SELECT AVG(sal) AS avg_salary FROM employees.emp
                         GROUP BY deptno
                    ) AS dept_avg);

-- Find the employee(s) with the highest salary and
-- the employee(s) with the lowest salary in each department
SELECT e.*
FROM employees.emp e
JOIN (
    SELECT deptno, MAX(sal) AS max_salary, MIN(sal) AS min_salary
    FROM employees.emp
    GROUP BY deptno
) AS salary_extremes ON e.deptno = salary_extremes.deptno 
AND (e.sal = salary_extremes.max_salary OR e.sal = salary_extremes.min_salary);
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
