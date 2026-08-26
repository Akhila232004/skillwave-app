/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : VIEWS
*  Author       : Team Tinitiate
*******************************************************************************/



-- Creating A View:
CREATE VIEW vw_EmployeeInfo
AS
SELECT empno, ename, job, deptno
FROM employees.emp
WHERE job LIKE '%Manager%';



-- Using A View:
SELECT * FROM vw_EmployeeInfo;



-- Modifying A View:
ALTER VIEW vw_EmployeeInfo
AS
SELECT empno, ename, job, deptno, sal
FROM employees.emp
WHERE job LIKE '%Manager%' AND sal > 2500;



-- Dropping A View:
DROP VIEW vw_EmployeeInfo;



-- Creating A Complex View:
CREATE VIEW vw_EmployeeDetails
AS
SELECT 
    e.empno,
    e.ename,
    d.dname,
    STRING_AGG(p.project_name, ', ') WITHIN GROUP (ORDER BY p.project_name)
    AS Projects
FROM 
    employees.emp e
    INNER JOIN employees.dept d ON e.deptno = d.deptno
    LEFT JOIN employees.emp_projects ep ON e.empno = ep.empno
    LEFT JOIN employees.projects p ON ep.projectno = p.projectno
GROUP BY 
    e.empno,
    e.ename,
    d.dname;

-- To use the above view
SELECT * FROM vw_EmployeeDetails;



-- Updating Using Simple View
-- Creating a simple view on the employees table
CREATE VIEW vw_EmployeeBasicInfo AS
SELECT empno, ename, job
FROM employees.emp;

-- Updating data through the view
UPDATE vw_EmployeeBasicInfo
SET job = 'Developer'
WHERE empno = 7788;



-- Updating Using Complex View
-- Creating a complex view with a join
CREATE VIEW vw_EmployeeDept AS
SELECT e.empno, e.ename, e.job, d.dname
FROM employees.emp e
JOIN employees.dept d ON e.deptno = d.deptno;

-- Creating an INSTEAD OF UPDATE trigger on the view
CREATE TRIGGER trg_UpdateEmployeeDept ON vw_EmployeeDept
INSTEAD OF UPDATE
AS
BEGIN
    -- Update the emp table based on the view update
    UPDATE employees.emp
    SET ename = INSERTED.ename,
    job = INSERTED.job
    FROM INSERTED
    WHERE emp.empno = INSERTED.empno;
    -- Update logic for dept could also be included if needed
END;

-- Updating data through the view
UPDATE vw_EmployeeDept
SET job = 'analyst'
WHERE empno = 7788;
