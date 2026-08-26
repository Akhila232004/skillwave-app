/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DDL - Data Definition Language
*  Author       : Team Tinitiate
*******************************************************************************/



-- CREATE:
-- Use database
USE tinitiate;

-- Schema DDL
CREATE SCHEMA employees;
CREATE USER ti WITH PASSWORD = 'Tinitiate!23';
ALTER AUTHORIZATION ON SCHEMA::employees TO ti;

-- Set the schema where you want to create the DB objects
ALTER USER ti WITH DEFAULT_SCHEMA = employees;

-- Create table employees.dept
CREATE TABLE employees.dept
( 
  deptno INT,
  dname VARCHAR(14),
  loc VARCHAR(13)
);

-- Create table employees.emp
CREATE TABLE employees.emp
( 
  empno      INT,
  ename      VARCHAR(10),
  job        VARCHAR(9),
  mgr        NUMERIC(4),
  sal        NUMERIC(7,2),
  commission NUMERIC(7,2),
  deptno     INT
);

-- Create table employees.salgrade
CREATE TABLE employees.salgrade
( 
  grade INT,
  losal INT,
  hisal INT
);

-- Create table employees.projects
CREATE TABLE employees.projects
( 
  projectno           INT,
  budget              NUMERIC(7,2),
  monthly_commission  NUMERIC(7,2)
);

-- Create table employees.emp_projects
CREATE TABLE employees.emp_projects
( 
  emp_projectno  INT,
  empno          INT,
  projectno      INT,
  start_date     DATE,
  end_date       DATE
);



-- ALTER:
-- Alter table "emp": Add a new column called "hire_date" of type DATE.
ALTER TABLE employees.emp ADD hire_date DATE;
-- To change back to previous
ALTER TABLE employees.emp DROP COLUMN hire_date;

-- Alter table "projects":
-- Change the data type of the column "budget" to DECIMAL(12,2).
ALTER TABLE employees.projects ALTER COLUMN budget DECIMAL(12,2);
-- To change back to previous
ALTER TABLE employees.projects ALTER COLUMN budget NUMERIC(12,2);

-- Alter table "emp_projects": Drop the column "end_date".
ALTER TABLE employees.emp_projects DROP COLUMN end_date;
-- To change back to previous
ALTER TABLE employees.emp_projects ADD end_date DATE;



-- DROP:
-- To drop dept table in emp schema
DROP TABLE employees.dept;

-- To again create it
CREATE TABLE employees.dept (
    deptno  INT,
    dname   VARCHAR(100)
);
