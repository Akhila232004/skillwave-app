/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Temp Tables
*  Author       : Team Tinitiate
*******************************************************************************/



-- Local Temp Tables:
BEGIN
  BEGIN TRY
    EXEC('drop table #emp')  -- avoid error if #emp doesn’t exist
  END TRY
  
  BEGIN CATCH
    -- ignore “object not found” error
  END CATCH

  -- Create Table
  CREATE TABLE #emp(emp_id INT, employee_name VARCHAR(102));

  INSERT INTO #emp VALUES ( 1, 'AA'), ( 2, 'BB');

  SELECT * FROM #emp;
END



-- Global Temp Tables:
-- Create Global temp table
CREATE TABLE ##emp_gtt (emp_no INT,emp_name VARCHAR(102));

BEGIN
  INSERT INTO ##emp_gtt VALUES ( 1, 'CC'), ( 2, 'DD');
  SELECT * FROM ##emp_gtt;
END



-- @ Tables variable:
BEGIN
  DECLARE @emp_var TABLE
  (emp_id INT,e_name VARCHAR(10));

  INSERT INTO @emp_var VALUES ( 1, 'EE'), ( 2, 'FF');
  SELECT * FROM @emp_var;
END
