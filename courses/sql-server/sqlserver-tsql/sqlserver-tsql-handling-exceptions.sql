/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Handling Exceptions
*  Author       : Team Tinitiate
*******************************************************************************/



-- Preventing Insertion of Duplicate Employee IDs
BEGIN TRY
    -- Attempt to insert a new employee with an existing emp_id
    INSERT INTO employees.emp (empno, ename, job, deptno)
    VALUES (7369, 'John Doe', 'Engineer', 10);
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 2627  -- Error number for a duplicate key violation
        BEGIN
            PRINT 'Error: Cannot insert duplicate employee ID.';
        END
    ELSE
        BEGIN
            PRINT 'An unexpected error occurred. Error number: ' + CAST(ERROR_NUMBER() AS VARCHAR);
        END
END CATCH;
