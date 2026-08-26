/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Variables & Operators
*  Author       : Team Tinitiate
*******************************************************************************/



-- Variables:
-- Declare Variables
DECLARE @DeptName VARCHAR(100);
DECLARE @MinSalary DECIMAL(10, 2);

-- Assign Values to Variables
SET @DeptName = 'sales';
SET @MinSalary = 1500.00;

-- Use Variables in a SELECT Statement
SELECT e.ename, e.job, e.sal
FROM employees.emp e
INNER JOIN employees.dept d ON e.deptno = d.deptno
WHERE d.dname = @DeptName AND e.sal > @MinSalary;



-- Operators:
-- Arithmetic Operators
-- Adds two numbers - Addition
SELECT 10 + 5 AS Result;  -- Result: 15
-- Multiplies one number times another - Multiplication
SELECT 10 * 5 AS Result;  -- Result: 50
-- Divides one number by another - Division
SELECT 10 / 5 AS Result;  -- Result: 2
-- Returns the remainder of one number divided by another - Modulo
SELECT 10 % 3 AS Result;  -- Result: 1

-- Comparison Operators
-- Checks if two values are equal - Equal to
SELECT CASE WHEN 10 = 10 THEN 'True' ELSE 'False' END AS Result;  
-- Checks if the left value is greater than the right value - Greater than
SELECT CASE WHEN 10 > 5 THEN 'True' ELSE 'False' END AS Result;  
-- Checks if the left value is less than the right value - Less than
SELECT CASE WHEN 5 < 10 THEN 'True' ELSE 'False' END AS Result; 
-- Checks if the left value is greater than or equal to the right value - 
-- Greater than or equal to
SELECT CASE WHEN 10 >= 10 THEN 'True' ELSE 'False' END AS Result;
-- Checks if the left value is less than or equal to the right value - 
-- Less than or equal to
SELECT CASE WHEN 5 <= 10 THEN 'True' ELSE 'False' END AS Result;  
-- Checks if two values are not equal - Not equal to
SELECT CASE WHEN 10 != 5 THEN 'True' ELSE 'False' END AS Result;
