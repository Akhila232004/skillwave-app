/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : BEGIN...END
*  Author       : Team Tinitiate
*******************************************************************************/



-- Adding two variables:
BEGIN
    DECLARE @num1 INT = 1;  -- Variable = container
    DECLARE @num2 INT;
    DECLARE @res INT;
    
    SET @num2 = 20;

    SET @res = @num1 + @num2;
    PRINT 'Sum of Num1 and Num2';
    PRINT  'Sum: ' + CAST(@res AS VARCHAR);
    PRINT  @res;
    SELECT @res;
END;



-- Reassigning a variable and performing arithmetic:
BEGIN
    DECLARE @data1 INT = 1; -- variable declare and initialize
    DECLARE @data2 INT;     -- variable declare
    
    SET @data2 = 10;  -- variable initialize
    PRINT @data2;  -- 10

    SET @data2 = 20;  -- variable re-assign
    PRINT @data2;  -- 20

    PRINT @data2+10; -- 30
    PRINT @data2;    -- 20
END;
