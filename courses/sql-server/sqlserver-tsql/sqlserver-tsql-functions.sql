/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Functions
*  Author       : Team Tinitiate
*******************************************************************************/



-- Function with Input Parameter:
-- Function to Get Employee Details by Department Number
CREATE FUNCTION GetEmployeesByDepartment (@DeptID INT)
RETURNS TABLE
AS
RETURN
    SELECT empno, ename, job
    FROM employees.emp
    WHERE deptno = @DeptID;

-- Use the function to get employee details for department id 30
SELECT * FROM GetEmployeesByDepartment(30);



-- Function with Default Parameter Value:
-- Function to Get Employee Details by Department Number with default parameter
CREATE FUNCTION employees.GetEmployeesByDepartmentDefault (@DeptID INT = NULL)
RETURNS TABLE
AS
RETURN
    SELECT empno, ename, job
    FROM employees.emp
    WHERE deptno = ISNULL(@DeptID, deptno);


-- Use the function without specifying a department ID
SELECT * FROM employees.GetEmployeesByDepartmentDefault(DEFAULT);
-- Use the function with a specific department ID
SELECT * FROM employees.GetEmployeesByDepartmentDefault(10);



-- Return Statement:
-- Scalar Functions
CREATE FUNCTION employees.GetEmployeeCount()
RETURNS INT
AS
BEGIN
    DECLARE @Count INT;

    -- Count the number of employees
    SELECT @Count = COUNT(*) FROM employees.emp;

    -- Return the count
    RETURN @Count;
END
-- Use the function
SELECT employees.GetEmployeeCount() AS EmployeeCount;

-- Table-Valued Functions
CREATE FUNCTION employees.GetEmployeesByDepartment(@DeptID INT)
RETURNS TABLE
AS
RETURN (
    SELECT ename, job FROM employees.emp WHERE deptno = @DeptID
)
-- Use the function
SELECT * FROM employees.GetEmployeesByDepartment(20);

-- Multi-statement table-valued function
CREATE FUNCTION employees.GetAllEmployees()
RETURNS @EmployeeTable TABLE (ename VARCHAR(100), job VARCHAR(100))
AS
BEGIN
    -- Insert data into the table variable
    INSERT INTO @EmployeeTable (ename, job)
    SELECT ename, job FROM emp;
    
    -- Return the table variable
    RETURN;
END
-- Use the function
SELECT * FROM employees.GetAllEmployees();



-- Execute the Function with Begin and End:
BEGIN
    -- Execute a scalar function and store the result in a variable
    DECLARE @TotalEmployees INT;
    SET @TotalEmployees = employees.GetEmployeeCount();
    PRINT 'Total number of employees: ' + CAST(@TotalEmployees AS VARCHAR);
END

-- Executing a Table-Valued Function with Begin and End
BEGIN
    -- Execute a table-valued function and use the result set directly
    SELECT * FROM employees.GetEmployeesByDepartment(10);

    -- Alternatively, store the result set in a table variable for further processing
    DECLARE @EmployeeDetails TABLE (emp_name VARCHAR(100), job_title VARCHAR(100));
    INSERT INTO @EmployeeDetails
    SELECT * FROM employees.GetEmployeesByDepartment(10);

    SELECT * FROM @EmployeeDetails;
END
