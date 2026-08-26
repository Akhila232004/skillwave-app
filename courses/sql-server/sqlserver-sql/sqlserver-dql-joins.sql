/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - Joins
*  Author       : Team Tinitiate
*******************************************************************************/



-- INNER JOIN:
-- Retrieve employee information along with their department names
SELECT e.*, d.dname
FROM employees.emp e
INNER JOIN employees.dept d ON e.deptno = d.deptno;



-- LEFT JOIN (or LEFT OUTER JOIN):
-- Retrieve all employees along with their dept,
-- including employees without dept
SELECT e.*, d.dname
FROM employees.emp e
LEFT JOIN employees.dept d ON e.deptno = d.deptno;



-- RIGHT JOIN (or RIGHT OUTER JOIN):
-- Retrieve all departments along with their employees,
-- including departments without employees
SELECT e.*, d.dname
FROM employees.emp e
RIGHT JOIN employees.dept d ON e.deptno = d.deptno;



-- FULL JOIN (or FULL OUTER JOIN):
-- Retrieve all employees and departments,
-- including those without a match in the other table
SELECT e.*, d.dname
FROM employees.emp e
FULL JOIN employees.dept d ON e.deptno = d.deptno;



-- CROSS JOIN:
-- Retrieve all possible combinations of emp and dept tables
SELECT e.*, d.*
FROM employees.emp e
CROSS JOIN employees.dept d;
