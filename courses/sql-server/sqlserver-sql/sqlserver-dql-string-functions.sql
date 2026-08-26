/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - String Functions
*  Author       : Team Tinitiate
*******************************************************************************/



-- Length Function (LEN):
-- Retrieve the length of the 'ename' column in the employees table
SELECT LEN(ename) FROM employees.emp;



-- Substring Function (SUBSTRING):
-- Extract the first three characters from
-- the 'ename' column in the employees table
SELECT SUBSTRING(ename, 1, 3) FROM employees.emp;



-- Concatenation Operator (+):
-- Concatenate the 'ename' and 'job' columns in the employees table
SELECT ename + ' - ' + job FROM employees.emp;



-- Lower Function (LOWER):
-- Convert the 'dname' column in the departments table to lowercase
SELECT LOWER(dname) FROM employees.dept;



-- Upper Function (UPPER):
-- Convert the 'job' column in the employees table to uppercase
SELECT UPPER(job) FROM employees.emp;



-- Trim Function (TRIM):
-- Remove leading and trailing whitespace from the
-- 'ename' column in the employees table
SELECT TRIM(ename) FROM employees.emp;

-- It remove the whitespaces from front and back of a string text
SELECT TRIM('    tinitiate.com     ') AS trimmed_string;



-- Ltrim Function (LTRIM):
-- Remove leading whitespace from the 'ename' column in the employees table
SELECT LTRIM(ename) FROM employees.emp;

-- It remove the whitespaces from front of a string text
SELECT LTRIM('    tinitiate.com     ') AS trimmed_lstring;



-- Rtrim Function (RTRIM):
-- Remove trailing whitespace from the 'ename' column in the employees table
SELECT RTRIM(ename) FROM employees.emp;

-- It remove the whitespaces from back of a string text
SELECT RTRIM('    tinitiate.com     ') AS trimmed_rstring;



-- Charindex Function (CHARINDEX):
-- Find the position of 'e' in the 'ename' column of the employees table
SELECT CHARINDEX('e', ename) FROM employees.emp;



-- Left Function (LEFT):
-- Extract the first three characters from the
-- 'dname' column in the departments table
SELECT LEFT(dname, 3) FROM employees.dept;



-- Right Function (RIGHT):
-- Extract the last three characters from the
-- 'loc' column in the departments table
SELECT RIGHT(loc, 3) FROM employees.dept;



-- Reverse Function (REVERSE):
-- Reverse the 'ename' column in the employees table
SELECT REVERSE(ename) FROM employees.emp;



-- Replace Function (REPLACE):
-- Replace 'a' with 'X' in the 'dname' column of the departments table
SELECT REPLACE(dname, 'a', 'X') FROM employees.dept;



-- Case Statement (CASE):
-- Decode the value 'clerk' to 'Clerk', 'salesman' to 'Salesman' in the 'job' column
SELECT CASE job
           WHEN 'clerk' THEN 'Clerk'
           WHEN 'salesman' THEN 'Salesman'
           ELSE 'Unknown'
       END AS job_title
FROM employees.emp;



-- ISNULL Function (ISNULL):
-- Replace nulls in the 'commission' column with 0
SELECT ename, ISNULL(commission , 0) AS comm
FROM employees.emp;



-- Coalesce Function (COALESCE):
-- Return the first non-null value among 'comm', 'bonus', and 0
SELECT ename, COALESCE(commission , mgr, 0) AS compensation
FROM employees.emp;
