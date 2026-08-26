/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Conditional Statements
*  Author       : Team Tinitiate
*******************************************************************************/



-- IF...ELSE Statement:
-- Check if a Department Exists
DECLARE @DeptName VARCHAR(100) = 'accounting';

IF EXISTS (SELECT 1 FROM employees.dept WHERE dname = @DeptName)
    BEGIN
        PRINT 'The department exists.';
    END
ELSE
    BEGIN
        PRINT 'The department does not exist.';
    END



-- CASE Statement:
-- Categorize Employees Based on Salary
SELECT 
    ename,
    CASE 
        WHEN sal < 1500 THEN 'Low'
        WHEN sal BETWEEN 1500 AND 3000 THEN 'Medium'
        ELSE 'High'
    END AS SalaryCategory
FROM employees.emp;



-- IIF Function:
-- Check if Salary is Above Average
SELECT 
    ename,
    sal,
    IIF(sal > (SELECT AVG(sal) FROM employees.emp), 'Above Average', 'Below Average') AS SalaryStatus
FROM employees.emp;
