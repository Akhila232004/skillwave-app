/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - Set Operations
*  Author       : Team Tinitiate
*******************************************************************************/



-- UNION:
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

-- UNION ALL: This operator does same as UNION with including duplicate rows
-- Retrieve all department numbers from both the employees
-- and projects tables
SELECT deptno FROM employees.emp
UNION ALL
SELECT projectno AS deptno FROM employees.projects;



-- INTERSECT:
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



-- EXCEPT:
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
