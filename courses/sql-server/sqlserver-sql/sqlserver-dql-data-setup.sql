/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL Data Setup
*  Author       : Team Tinitiate
*******************************************************************************/



-- CREATE TABLES:
-- Create dataset under 'EMPLOYEES' schema
-- Switch to the tinitiate database
USE tinitiate;

-- Set the default schema for your user to employees
ALTER USER tiuser WITH DEFAULT_SCHEMA = employees;

-- Drop tables from the "employees" schema if any exists
DROP TABLE employees.emp_projects;
DROP TABLE employees.projects;
DROP TABLE employees.salgrade;
DROP TABLE employees.emp;
DROP TABLE employees.dept;

-- Create table employees.dept
CREATE TABLE employees.dept
( 
  deptno INT NOT NULL,
  dname VARCHAR(14),
  loc VARCHAR(13),

  -- Primary Key constraint for employees.dept on deptno
  CONSTRAINT pk_dept PRIMARY KEY (deptno)
);

-- Create table employees.emp
CREATE TABLE employees.emp
( 
  empno      INT NOT NULL,
  ename      VARCHAR(10),
  job        VARCHAR(9),
  mgr        NUMERIC(4),
  hiredate   DATE,
  sal        NUMERIC(7,2),
  commission NUMERIC(7,2),
  deptno     INT,
  
  -- Primary Key constraint for employees.emp on empno
  CONSTRAINT pk_empno PRIMARY KEY (empno),
  
  -- Foreign key constraint for
  -- employees.emp.deptno referring employees.dept.deptno
  CONSTRAINT fk_deptno FOREIGN KEY (deptno) REFERENCES employees.dept (deptno)
);

-- Create table employees.salgrade
CREATE TABLE employees.salgrade
( 
  grade INT NOT NULL,
  losal INT,
  hisal INT,
  
  -- Primary Key constraint for employees.salgrade on grade
  CONSTRAINT pk_grade PRIMARY KEY (grade)
);

-- Create table employees.projects
CREATE TABLE employees.projects
( 
  projectno           INT NOT NULL,
  project_name         VARCHAR(100),
  budget              NUMERIC(7,2),
  monthly_commission  NUMERIC(7,2),
  
  -- Primary Key constraint for employees.projects on projectno
  CONSTRAINT pk_projectno PRIMARY KEY (projectno)
);

-- Create table employees.emp_projects
CREATE TABLE employees.emp_projects
( 
  emp_projectno  INT NOT NULL,
  empno          INT NOT NULL,
  projectno      INT NOT NULL,
  start_date     DATE,
  end_date       DATE,
  
  -- Primary Key constraint for employees.emp_projects on emp_projectno
  CONSTRAINT pk_emp_projectno PRIMARY KEY (emp_projectno),
  
  -- Foreign key constraint for
  -- employees.emp_projects.empno referring employees.emp.empno
  CONSTRAINT fk_empno FOREIGN KEY (empno) REFERENCES employees.emp (empno),
  
  -- Foreign key constraint for
  -- employees.emp_projects.projectno referring employees.projects.projectno
  CONSTRAINT fk_projectno FOREIGN KEY (projectno)
   REFERENCES employees.projects (projectno)
);



-- INSERT DATA INTO THE TABLES:
-- Insert data into employees.dept
INSERT INTO employees.dept (deptno, dname, loc)
VALUES 
    (10, 'accounting', 'new york'),
    (20, 'research', 'dallas'),
    (30, 'sales', 'chicago'),
    (40, 'operations', 'boston'),
    (50, 'techsupport', 'seattle'),
    (60, 'PRODUCTION', 'dover');

-- Insert data into employees.salgrade
INSERT INTO employees.salgrade (grade, losal, hisal)
VALUES 
    (1, 700, 1200),
    (2, 1201, 1400),
    (3, 1401, 2000),
    (4, 2001, 3000),
    (5, 3001, 9999),
    (6, 10000, 20000);

-- Insert data into employees.emp
INSERT INTO employees.emp (
    empno, ename, job, mgr, hiredate, sal, commission, deptno)
VALUES 
    (7369, 'smith', 'clerk', 7902, '1980-12-17', 800, NULL, 20),
    (7499, 'allen', 'salesman', 7698, '1981-02-20', 1600, NULL, 30),
    (7521, 'ward', 'salesman', 7698, '1981-02-22', 1250, NULL, 30),
    (7566, 'jones', 'manager', 7839, '1981-04-02', 2975, NULL, 20),
    (7654, 'martin', 'salesman', 7698, '1981-09-28', 1250, 1400, 30),
    (7698, 'blake', 'manager', 7839, '1981-05-01', 2850, NULL, 30),
    (7782, 'clark', 'manager', 7839, '1981-06-09', 2450, NULL, 10),
    (7788, 'scott', 'analyst', 7566, '1982-12-09', 3000, NULL, 20),
    (7839, 'king', 'president', NULL, '1981-11-17', 5000, NULL, 10),
    (7844, 'turner', 'salesman', 7698, '1981-09-08', 1500, 0, 30),
    (7876, 'adams', 'clerk', 7788, '1983-01-12', 1100, NULL, 20),
    (7900, 'james', 'clerk', 7698, '1981-12-03', 950, NULL, 30),
    (7902, 'ford', 'analyst', 7566, '1981-12-03', 3000, NULL, 20),
    (7934, 'miller', 'clerk', 7782, '1982-01-23', 1300, 150, 10),
    (7937, 'jimmy', 'clerk', 7782, '1990-04-23', 1000, NULL, NULL),
    (8000, 'newhire', 'clerk', 7782, '1982-01-23', 1300, 150, 10),
    (8001, 'parker', 'clerk', 7566, '1985-03-15', 900, NULL, 20),
    (8002, 'natasha', 'salesman', 7698, '1985-06-01', 1600, 300, 30),
    (8003, 'tony', 'manager', 7839, '1984-11-11', 2900, NULL, 10),
    (8004, 'steve', 'analyst', 7566, '1986-05-10', 3100, NULL, 20),
    (8005, 'bruce', 'clerk', 7782, '1986-07-25', 1000, 150, 10),
    (8006, 'wanda', 'salesman', 7698, '1984-08-13', 1450, 250, 30),
    (8007, 'bucky', 'salesman', 7698, '1984-12-01', 1500, 500, 30),
    (8008, 'vision', 'clerk', NULL, '1987-01-10', 950, NULL, 20),
    (8009, 'carol', 'analyst', 7566, '1983-09-09', 2700, NULL, 20),
    (8010, 'sam', 'salesman', 7698, '1982-11-23', 1350, 200, 30),
    (8011, 'denver', NULL, NULL, NULL, NULL, NULL, NULL),
    (8012, 'blank', 'salesman', NULL, '1988-01-01', NULL, NULL, 30),
    (8013, 'tom', 'assistant', 8001, '1986-06-15', 850, NULL, 20),
    (8014, 'jerry', 'intern', 8013, '1986-09-25', 600, NULL, 20),
    (8015, '  sIMON  ', 'salesman', 7698, '1987-01-01', 1300, 200, 30),
    (8016, 'Dr. GOOD', 'analyst', 7566, '1987-02-01', 3200, NULL, 20),
    (8017, 'mario', 'clerk', NULL, '1987-03-01', 900, 150, 10),
    (8018, 'LUIGI', 'clerk', 8017, '1987-03-02', 850, 150, 10),
    (8019, 'tintin', 'analyst', 7566, '1960-01-01', 2700, NULL, 20),
    (8020, 'futureman', 'manager', NULL, '2050-12-31', 4500, NULL, 10),
    (8021, 'rank1', 'clerk', NULL, '1989-01-01', 1500, NULL, 30),
    (8022, 'rank2', 'clerk', NULL, '1989-02-01', 1500, NULL, 30),
    (8023, 'rank3', 'clerk', NULL, '1989-03-01', 1500, NULL, 30),
    (8024, 'bob', 'operator', NULL, '1989-01-01', 1250, NULL, 40),
    (8025, 'richard', 'operator', NULL, '1989-02-01', 1300, NULL, 40),
    (8026, 'eve', 'support', NULL, '1989-03-01', 500, 50, 50),
    (8027, 'halen', 'support', NULL, '1989-04-05', 500, 50, 50),
    (8028, 'lin', 'support', NULL, '1989-04-21', 500, 50, 50);

-- Insert data into employees.projects
INSERT INTO employees.projects (projectno, project_name, budget, monthly_commission)
VALUES 
    (1, 'Pulse', 10000, 100),
    (2, 'Streamline', 20000, 200),
    (3, 'SwiftSync', 30000, 300),
    (4, 'Flux', 40000, 400),
    (5, 'RealEye', 50000, 500);

-- Insert data into employees.emp_projects
INSERT INTO employees.emp_projects (
    emp_projectno, empno, projectno, start_date, end_date)
VALUES 
    (1, 7369, 1, '1984-01-01', '1984-12-31'),
    (2, 7499, 2, '1984-01-01', '1984-12-31'),
    (3, 7521, 3, '1984-01-01', '1984-12-31'),
    (4, 7566, 1, '1984-01-01', '1984-12-31'),
    (5, 7654, 1, '1984-01-01', '1984-12-31'),
    (6, 7698, 2, '1984-01-01', '1984-12-31'),
    (7, 7782, 2, '1984-01-01', '1984-12-31'),
    (8, 7788, 2, '1984-01-01', '1984-12-31'),
    (9, 7839, 3, '1984-01-01', '1984-12-31'),
    (10, 7844, 3, '1984-01-01', '1984-12-31'),
    (11, 7876, 3, '1984-01-01', '1984-12-31'),
    (12, 7900, 2, '1984-01-01', '1984-12-31'),
    (13, 7902, 1, '1984-01-01', '1984-12-31'),
    (14, 7934, 1, '1984-01-01', '1984-12-31'),
    (15, 8001, 4, '1986-01-01', '1986-12-31'),
    (16, 8002, 4, '1986-01-01', '1986-12-31'),
    (17, 8003, 5, '1985-01-01', '1985-12-31'),
    (18, 8004, 5, '1986-06-01', NULL),
    (19, 8005, 1, '1987-02-01', NULL),
    (20, 8006, 3, '1985-04-01', '1985-12-31'),
    (21, 8007, 3, '1985-09-01', '1986-03-31'),
    (22, 8008, 2, '1987-01-15', NULL),
    (23, 8009, 5, '1983-10-01', '1984-10-01'),
    (24, 8010, 2, '1983-12-15', '1984-12-15');
