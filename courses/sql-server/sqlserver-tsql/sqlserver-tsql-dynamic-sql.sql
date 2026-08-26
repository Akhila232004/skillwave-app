/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Dynamic SQL
*  Author       : Team Tinitiate
*******************************************************************************/



-- Create a test table for Dynamic SQL:
-- Create table 'dynsql_test'
CREATE TABLE dynsql_test (
     test_id       INT
    ,test_date     DATE
    ,test_string   VARCHAR(1000)
    ,test_decimal  DECIMAL(10,2)
);



-- Dynamic SQL using EXEC:
-- EXEC Demo Block
DECLARE  @test_id      INT
        ,@test_date    VARCHAR(1000)
        ,@test_string  VARCHAR(1000)
        ,@test_decimal DECIMAL(10,2)
        ,@sql          VARCHAR(3000)

-- Assign values
SET @test_id      = 1
SET @test_date    = 'GETDATE()'
SET @test_string  = 'TEST'
SET @test_decimal = 10.2

-- Build dynamic statement
SET @sql = 'INSERT INTO dynsql_test VALUES( ' +
           CAST(@test_id AS VARCHAR) +' , '+
           CAST(@test_date AS VARCHAR) +' , '+
           ''''+CAST(@test_string AS VARCHAR)+''''+' , '+
           CAST(@test_decimal AS VARCHAR) + ');'
           
-- Print the @sql statement
PRINT @sql

-- Execute dynamic statement
EXEC(@sql)
PRINT 'Rows Affected ' + CAST(@@rowcount AS VARCHAR)



-- Dynamic SQL using sp_executesql:
-- EXEC Demo Block
DECLARE  @test_id      INT
        ,@test_date    VARCHAR(1000)
        ,@test_string  VARCHAR(1000)
        ,@test_decimal DECIMAL(10,2)
        ,@sql          NVARCHAR(3000)

-- Assign values
SET @test_id      = 1
SET @test_date    = 'GETDATE()'
SET @test_string  = 'TEST'
SET @test_decimal = 10.2

-- Build dynamic statement
SET @sql = 'INSERT INTO dynsql_test VALUES( ' +
           CAST(@test_id AS VARCHAR) +' , '+
           CAST(@test_date AS VARCHAR) +' , '+
           ''''+CAST(@test_string AS VARCHAR)+''''+' , '+
           CAST(@test_decimal AS VARCHAR) + ');'
           
-- Print the @sql statement
PRINT @sql

-- Execute dynamic statement
EXECUTE sp_executesql @sql;
PRINT 'Rows Affected ' + CAST(@@rowcount AS VARCHAR)



-- Dynamic SQL with SELECT Statement:
BEGIN
  DECLARE @sql          NVARCHAR(3000)  
  SET @sql = 'SELECT * FROM dynsql_test
  WHERE test_id = ' + CAST(1 AS VARCHAR)
  + ' AND test_date >= GETDATE()-2';
  
  EXEC(@sql)
  PRINT 'Rows Affected ' + CAST(@@rowcount AS VARCHAR)
END;
