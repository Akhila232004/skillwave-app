/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DML - Data Manipulation Language
*  Author       : Team Tinitiate
*******************************************************************************/



-- INSERT:
-- Insert with column created order
INSERT INTO employees.dept (deptno, dname) VALUES (1000, 'PRODUCTION');
INSERT INTO employees.emp (empno, ename, sal, deptno)
 VALUES (101, 'John Doe', 5000.00, 1000);

-- Insert with using positional values
INSERT INTO employees.dept VALUES (2000, 'FOUNDRY');

-- Insert with column names, different order
INSERT INTO employees.dept (dname, deptno) VALUES ('STORES', 3000);

-- Insert all, Insert more data in single insert
INSERT INTO employees.dept (deptno, dname)
VALUES 
    (111, 'TECHNOLOGY'),
    (211, 'FACTORY'),
    (311, 'RETAIL');

-- Insert with select statement (Copy data from another table)
-- Create table dept1
CREATE TABLE employees.dept1 (
    deptno INT,
    dname VARCHAR(100)
);
-- Insert data from dept into dept1
INSERT INTO employees.dept1 (deptno, dname)
SELECT deptno, dname
FROM employees.dept;

-- Incorrect data violations
-- Primary Key violation
INSERT INTO employees.dept (deptno, dname) VALUES (3000, 'MARKETING');

-- DataType Size violation
INSERT INTO employees.dept (deptno, dname) 
VALUES (6, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

-- Foreign Key violation
INSERT INTO employees.emp (empno, ename, sal, deptno)
 VALUES (15, '4F', 12000.00, 5000);
 
 
 
-- UPDATE:
-- Update salary of an employee
UPDATE employees.emp SET sal = 6200.00 WHERE empno = 101;

-- Update project end date
UPDATE employees.Emp_Projects SET End_Date = '2024-06-01'
 WHERE emp_projectno  = 1 AND empno = 101;
 


-- DELETE:
-- Delete a dept
DELETE FROM employees.dept WHERE deptno = 3000;

-- Remove an employee
DELETE FROM employees.emp WHERE empno = 101;
