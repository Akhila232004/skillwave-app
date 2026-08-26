/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - Date Functions
*  Author       : Team Tinitiate
*******************************************************************************/



-- Current Date and time (GETDATE):
-- Retrieve the current date and time
SELECT GETDATE();



-- Date Part Function (DATEPART):
-- Retrieve the day of the month from the 'hiredate' column
SELECT DATEPART(DAY, hiredate) FROM employees.emp;



-- Date Difference Function (DATEDIFF):
-- Calculate the age of each employee based on their 'hiredate'
SELECT DATEDIFF(YEAR, hiredate, GETDATE()) FROM employees.emp;



-- Date Addition/Subtraction:
-- Add a specific number of days from a date
SELECT DATEADD(DAY, 7, hiredate) FROM employees.emp;

-- Subtract 6 months from the 'hiredate' column in the employees table
SELECT DATEADD(MONTH, -6, hiredate) FROM employees.emp;



-- Date Formatting (FORMAT):
-- Format the 'hiredate' column in a specific date format
SELECT FORMAT(hiredate, 'yyyy-MM-dd') FROM employees.emp;
SELECT FORMAT(hiredate, 'yyyy-dd-MM') FROM employees.emp;
SELECT FORMAT(hiredate, 'dd-MM-yyyy') FROM employees.emp;
SELECT FORMAT(hiredate, 'MM-dd-yyyy') FROM employees.emp;
SELECT FORMAT(hiredate, 'MM-yyyy-dd') FROM employees.emp;
SELECT FORMAT(hiredate, 'dd-yyyy-MM') FROM employees.emp;



-- Weekday Function (DATEPART):
-- Retrieve the day of the week (1 for Sunday, 2 for Monday, etc.) from
-- the 'hiredate' column
SELECT DATEPART(WEEKDAY, hiredate) FROM employees.emp;



-- Date to String (Various formats):
-- YYYY-MM-DD:
SELECT empno, ename, CONVERT(varchar, hiredate, 23) AS hiredate
FROM employees.emp;

-- MM/DD/YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 101) AS hiredate
FROM employees.emp;

-- DD/MM/YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 103) AS hiredate
FROM employees.emp;

-- Mon DD, YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 107) AS hiredate
FROM employees.emp;

-- YYYYMMDD:
SELECT empno, ename, CONVERT(varchar, hiredate, 112) AS hiredate
FROM employees.emp;

-- DD-MM-YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 105) AS hiredate
FROM employees.emp;

-- YYYY/MM/DD:
SELECT empno, ename, CONVERT(varchar, hiredate, 111) AS hiredate
FROM employees.emp;

-- DD MMM YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 106) AS hiredate
FROM employees.emp;



-- DateTime to String (Various formats):
-- YYYY-MM-DD HH:MI:SS:
SELECT empno, ename, CONVERT(varchar, hiredate, 120) AS hiredate
FROM employees.emp;
-- hiredata doesn't have time inserts, so time won't show up
-- Using GETDATE()
SELECT CONVERT(varchar, GETDATE(), 120) AS datetimetostring;

-- YYYY-MM-DD HH:MI:SS:MMM:
SELECT CONVERT(varchar, GETDATE(), 121) AS datetimetostring;

-- DD Mon YYYY HH:MI:SS:MMM:
SELECT CONVERT(varchar, GETDATE(), 113) AS datetimetostring;

-- Mon DD YYYY HH:MI:SS:MMMAM (or PM):
SELECT CONVERT(varchar, GETDATE(), 109) AS datetimetostring;



-- String to Date (Various formats):
-- YYYY-MM-DD:
SELECT CONVERT(date, '2023-04-15', 23) AS date;

-- MM/DD/YYYY:
SELECT CONVERT(date, '04/15/2023', 101) AS date;

-- DD.MM.YYYY:
SELECT CONVERT(date, '15.04.2023', 104) AS date;

-- Mon DD, YYYY:
SELECT CONVERT(date, 'Apr 15, 2023', 107) AS date;

-- YYYYMMDD:
SELECT CONVERT(date, '20230415', 112) AS date;



-- String to DateTime (Various formats):
-- YYYY-MM-DD HH:MI:SS:
SELECT CONVERT(datetime, '2023-04-15 13:30:45', 120) AS datetime;

-- MM/DD/YYYY HH:MI:SS:
SELECT CONVERT(datetime, '04/15/2023 13:30:45', 101) AS datetime;

-- DD.MM.YYYY HH:MI:SS:
SELECT CONVERT(datetime, '15.04.2023 13:30:45', 104) AS datetime;

-- Mon DD YYYY HH:MI:SS:MMM:
SELECT CONVERT(datetime, 'Apr 15 2023 01:30:45:375', 109) AS datetime;

-- YYYYMMDD HH:MI:SS:
SELECT CONVERT(datetime, '20230415 13:30:45', 112) AS datetime;



-- DateTime and TimeZone:
-- This query will return the value of GETDATE() time adjusted by 5 hours. 
SELECT DATEADD(HOUR, 5, CAST(GETDATE() AS DATETIME)) AS adjusted_datetime;

-- Cast a DateTime to DateTime with Timezone (in UTC, EST and IST TimeZones):
SELECT 
    '2024-04-17 15:30:00' AS OriginalDateTime,
    (CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC') AS UTCDateTime,
    SWITCHOFFSET(CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC', DATEPART(TZOFFSET, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')) AS ESTDateTime,
    SWITCHOFFSET(CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC', DATEPART(TZOFFSET, SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time')) AS ISTDateTime;

-- Cast a DateTime Timezone to another TimeZone:
SELECT 
    'UTCDateTime: ' + CONVERT(VARCHAR, '2024-04-17 15:30:00', 120) AS UTCDateTime,
    'ESTDateTime: ' + CONVERT(VARCHAR, 
        CAST(CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time' AS DATETIME), 
        120) AS ESTDateTime;
