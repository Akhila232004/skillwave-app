/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - Basic Operators
*  Author       : Team Tinitiate
*******************************************************************************/



-- Equality Operator (=):
-- Retrieve employees with a specific job title
SELECT *
FROM employees.emp
WHERE job = 'manager';



-- Inequality Operator (<>):
-- Retrieve employees with a job title other than 'manager'
SELECT *
FROM employees.emp
WHERE job <> 'manager';



-- IN Operator:
-- Retrieve employees from departments 10 and 20
SELECT *
FROM employees.emp
WHERE deptno IN (10, 20, 30);



-- NOT IN Operator:
-- Retrieve employees not from departments 10 and 20
SELECT *
FROM employees.emp
WHERE deptno NOT IN (10, 20, 30);



-- LIKE Operator:
-- Retrieve employees whose names start with 's'
SELECT *
FROM employees.emp
WHERE ename LIKE 's%';

-- Retrieve employees whose names start with 'S'
-- and are followed by exactly four characters
SELECT *
FROM employees.emp
WHERE ename LIKE 's____';

-- Retrieve employees whose names have 'e' as the second character
SELECT *
FROM employees.emp
WHERE ename LIKE '_e%';

-- Retrieve employees whose names end with 'd'
-- and are preceded by exactly three characters
SELECT *
FROM employees.emp
WHERE ename LIKE '___d';

-- Retrieve employees whose names contain 'a' anywhere in the name
SELECT *
FROM employees.emp
WHERE ename LIKE '%a%';

-- Retrieve employees whose names have 'a' as the second character
-- and 'es' as the fourth, fifth character
SELECT *
FROM employees.emp
WHERE ename LIKE '_a_es';



-- NOT LIKE Operator:
-- Retrieve employees whose names do not start with 's'
SELECT *
FROM employees.emp
WHERE ename NOT LIKE 's%';



-- BETWEEN Operator:
-- Retrieve employees hired between '1982-01-01' and '1983-01-01'
SELECT *
FROM employees.emp
WHERE hiredate BETWEEN '1982-01-01' AND '1983-01-01';



-- Greater Than (>):
-- Retrieve employees with salaries greater than 2500
SELECT *
FROM employees.emp
WHERE sal > 2500;



-- Greater Than or Equal To (>=):
-- Retrieve employees hired on or after '1982-01-01'
SELECT *
FROM employees.emp
WHERE hiredate >= '1982-01-01';



-- Less Than (<):
-- Retrieve employees with salaries less than 1500
SELECT *
FROM employees.emp
WHERE sal < 1500;



-- Less Than or Equal To (<=):
-- Retrieve employees hired on or before '1982-01-01'
SELECT *
FROM employees.emp
WHERE hiredate <= '1982-01-01';



-- EXISTS Operator:
-- Retrieve employees who have worked on a project
SELECT *
FROM employees.emp e
WHERE EXISTS (
    SELECT 1
    FROM employees.emp_projects ep
    WHERE e.empno = ep.empno
);



-- NOT EXISTS Operator:
-- Retrieve employees who have not worked on any project
SELECT *
FROM employees.emp e
WHERE NOT EXISTS (
    SELECT 1
    FROM employees.emp_projects ep
    WHERE e.empno = ep.empno
);
