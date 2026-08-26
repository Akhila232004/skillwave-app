/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Stored Procedures
*  Author       : Team Tinitiate
*******************************************************************************/



-- Procedure with no parameters:
-- Create a stored procedure without parameters
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT empno, ename, job
    FROM employees.emp;
END

-- Execute the stored procedure
EXEC GetAllEmployees;



-- Procedure with Input Parameter:
-- Create a stored procedure with an input parameter for the department name
CREATE PROCEDURE employees.GetEmployeesByDepartmentName
    @DeptName VARCHAR(100)
AS
BEGIN
    SELECT e.empno, e.ename, e.job, d.dname
    FROM employees.emp e
    JOIN employees.dept d ON e.deptno = d.deptno
    WHERE d.dname = @DeptName;
END

-- Execute the stored procedure with the department name 'accounting'
EXEC employees.GetEmployeesByDepartmentName @DeptName = 'accounting';


-- Procedure with Output param:
-- Create a stored procedure that counts the number of employees in a specified
-- department(input) and returns this count as an output parameter.
CREATE PROCEDURE employees.GetEmployeeCountByDepartment
    @DeptID INT,                     -- Input parameter for department ID
    @EmployeeCount INT OUTPUT        -- Output parameter to hold the count
AS
BEGIN
    SELECT @EmployeeCount = COUNT(*)
    FROM employees.emp
    WHERE deptno = @DeptID;
END

-- Declare a variable to hold the output value
DECLARE @Count INT;
-- Execute the stored procedure
EXEC employees.GetEmployeeCountByDepartment @DeptID = 20, @EmployeeCount = @Count OUTPUT;
-- Display the result
PRINT 'Number of employees in department: ' + CAST(@Count AS VARCHAR);



-- Multiple ways to execute procs:
-- Using T-SQL in SQL Server Management Studio (SSMS)
DECLARE @EmployeeCountResult INT;
EXEC employees.GetEmployeeCountByDepartment @DeptID = 10, @EmployeeCount = @EmployeeCountResult OUTPUT;
-- To see the result
SELECT @EmployeeCountResult AS EmployeeCount;

-- Using a SQL Script or Batch
BEGIN
    DECLARE @Result INT;
    EXEC employees.GetEmployeeCountByDepartment @DeptID = 30, @EmployeeCount = @Result OUTPUT;
    PRINT 'Number of employees in department 2: ' + CAST(@Result AS VARCHAR(10));
END

-- From Another Stored Procedure
CREATE PROCEDURE employees.CheckDepartmentSize
AS
BEGIN
    DECLARE @EmployeeCount INT;
    EXEC employees.GetEmployeeCountByDepartment @DeptID = 30, @EmployeeCount = @EmployeeCount OUTPUT;
    
    IF @EmployeeCount > 10
        PRINT 'Large Department';
    ELSE
        PRINT 'Small or Medium Department';
END
-- Execute
EXEC employees.CheckDepartmentSize;



-- Default values for params:
-- Create a stored procedure with default parameters
CREATE PROCEDURE employees.GetEmployees
    @DeptID INT = NULL,            -- Default value is NULL
    @Commission INT = NULL
AS
BEGIN
    SELECT ename, empno, deptno, commission
    FROM employees.emp
    WHERE (deptno = @DeptID OR @DeptID IS NULL)
    AND (commission = @Commission OR @Commission IS NULL);
END

-- Calling the Stored Procedure with Default Parameters
-- Using Default Values for Both Parameters:
EXEC employees.GetEmployees;
-- Providing a Value for @DeptID Only:
EXEC employees.GetEmployees @DeptID = 10;
-- Providing a Value for @Commission Only:
EXEC employees.GetEmployees @Commission = 150;
-- Providing Values for Both Parameters:
EXEC employees.GetEmployees @DeptID = 30, @Commission = 500;
-- Providing Values Using Named Parameters (Out of Order):
EXEC employees.GetEmployees @Commission = 200, @DeptID = 30;
