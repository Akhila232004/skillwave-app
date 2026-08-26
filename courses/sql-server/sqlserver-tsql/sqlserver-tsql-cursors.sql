/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Cursors
*  Author       : Team Tinitiate
*******************************************************************************/



-- Basic Cursor Usage:
-- Decrease Salaries of All Employees by 10%
DECLARE @EmpID INT;
DECLARE @Salary DECIMAL(10, 2);

-- Declare the cursor
DECLARE EmployeeCursor CURSOR FOR
SELECT empno, sal FROM employees.emp;

-- Open the cursor
OPEN EmployeeCursor;

-- Fetch the first row from the cursor
FETCH NEXT FROM EmployeeCursor INTO @EmpID, @Salary;

-- Loop through all rows
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Decrease the salary by 10%
    UPDATE employees.emp SET sal = @Salary * 0.90 WHERE empno = @EmpID;

    -- Fetch the next row from the cursor
    FETCH NEXT FROM EmployeeCursor INTO @EmpID, @Salary;
END
-- Close and deallocate the cursor
CLOSE EmployeeCursor;
DEALLOCATE EmployeeCursor;



-- Cursor with Dynamic SQL:
-- Generate Department Salary Summary
BEGIN
    -- Drop the summary table if it exists
    BEGIN TRY
        EXEC('DROP TABLE employees.dept_summary');
    END TRY
    BEGIN CATCH
    END CATCH;

    -- Create a table to hold per‐department summary
    CREATE TABLE employees.dept_summary
    (
        deptno          INT       PRIMARY KEY,
        dname           VARCHAR(14),
        employee_count  INT,
        total_salary    NUMERIC(12,2),
        avg_salary      NUMERIC(12,2)
    );

    -- Declare variables for cursor processing
    DECLARE 
        @DeptNo     INT,
        @DName      VARCHAR(14),
        @EmpCount   INT,
        @TotalSal   NUMERIC(12,2),
        @AvgSal     NUMERIC(12,2);

    -- Define cursor to iterate all departments
    DECLARE DeptCursor CURSOR FOR
        SELECT deptno, dname
        FROM employees.dept;

    OPEN DeptCursor;

    FETCH NEXT FROM DeptCursor
    INTO @DeptNo, @DName;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Compute headcount, total and average salary per department
        SELECT 
            @EmpCount = COUNT(*),
            @TotalSal = SUM(sal),
            @AvgSal   = AVG(sal)
        FROM employees.emp
        WHERE deptno = @DeptNo;

        -- Insert results into the summary table
        INSERT INTO employees.dept_summary
            (deptno, dname, employee_count, total_salary, avg_salary)
        VALUES
            (
                @DeptNo,
                @DName,
                ISNULL(@EmpCount, 0),
                ISNULL(@TotalSal, 0),
                ISNULL(@AvgSal,   0)
            );

        -- Move to the next department
        FETCH NEXT FROM DeptCursor
        INTO @DeptNo, @DName;
    END

    -- Clean up
    CLOSE DeptCursor;
    DEALLOCATE DeptCursor;
END;
-- View the summary
SELECT * 
FROM employees.dept_summary;
