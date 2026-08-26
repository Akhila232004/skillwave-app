/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Loops
*  Author       : Team Tinitiate
*******************************************************************************/



-- WHILE Loop:
-- Increase salaries of employees by 10%
DECLARE @EmpID INT;

-- Get the first Employee ID
SELECT @EmpID = MIN(empno) FROM employees.emp;

WHILE @EmpID IS NOT NULL
BEGIN
    -- Increase salaries by 10%
    UPDATE employees.emp SET sal = sal * 1.10 WHERE empno = @EmpID;
    -- Get the next Part ID
    SELECT @EmpID = MIN(empno) FROM employees.emp WHERE empno > @EmpID;
END



-- FOR Loop:
-- Print Names of First 3 Projects
DECLARE @Counter INT = 1;

WHILE @Counter <= 3
BEGIN
    SELECT project_name FROM employees.projects WHERE projectno = @Counter;
    SET @Counter = @Counter + 1;
END



-- DO WHILE Loop:
-- Add New Projects Until 10 Projects Exist
DECLARE @Count INT;

SELECT @Count = COUNT(*) FROM employees.projects;

WHILE @Count < 10
BEGIN
    INSERT INTO employees.projects (projectno, project_name, budget) VALUES (@Count+1, 'New Project', 50000.00);
    SELECT @Count = COUNT(*) FROM employees.projects;
END
