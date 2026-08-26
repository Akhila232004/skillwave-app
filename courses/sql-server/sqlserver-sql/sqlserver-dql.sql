/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - Data Query Language
*  Author       : Team Tinitiate
*******************************************************************************/



-- SELECT Statement:
-- Retrieve all columns from the emp table
SELECT * FROM employees.emp;

-- Retrieve empno, ename and job columns from the emp table
SELECT empno, ename, job FROM employees.emp;

-- DISTINCT can be used to retrieve unique titles from the column
SELECT DISTINCT job FROM employees.emp;

-- Using alias to display column name as per requirement
SELECT DISTINCT job AS employeejob FROM employees.emp;



-- WHERE Clause:
-- Retrieve employees with a specific job title
SELECT * FROM employees.emp WHERE job = 'manager';

-- Retrieve employees hired after a specific date
SELECT * FROM employees.emp WHERE hiredate > '1982-01-01';

-- Retrieve employees with a salary higher than a certain amount
SELECT * FROM employees.emp WHERE sal > 2000;



-- GROUP BY Clause:
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



-- HAVING Clause:
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



-- ORDER BY Clause:
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



-- TOP Clause:
-- Retrieve the first 5 employees
SELECT TOP 5 *
FROM employees.emp;

-- Retrieve the employees with the top 10 highest salaries
SELECT TOP 10 *
FROM employees.emp
ORDER BY sal DESC;
