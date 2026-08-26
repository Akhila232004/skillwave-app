/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DDL - Constraints
*  Author       : Team Tinitiate
*******************************************************************************/



-- NOT NULL Constraint:
-- NOT NULL Constraint on empno column in the emp table
ALTER TABLE employees.emp
ALTER COLUMN empno INT NOT NULL;
-- NOT NULL Constraint on emp_projectno column in the EmpProjects table
ALTER TABLE employees.emp_projects
ALTER COLUMN emp_projectno INT NOT NULL;
-- NOT NULL Constraint on deptno column in the dept table
ALTER TABLE employees.dept
ALTER COLUMN deptno INT NOT NULL;
-- NOT NULL Constraint on projectno column in the projects table
ALTER TABLE employees.projects
ALTER COLUMN projectno INT NOT NULL;

-- We can also specify this constraint while table creation; for example
CREATE TABLE staff (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT
);



-- UNIQUE Constraint:
-- UNIQUE Constraint to the empno column in the emp table
ALTER TABLE employees.emp
ADD CONSTRAINT unique_empno UNIQUE (empno);

-- We can also specify this constraint while table creation; for example
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    name VARCHAR(100)
);
-- We can also add unique constraint across group of columns
ALTER TABLE students
ADD CONSTRAINT unique_ename UNIQUE (email, name);



-- CHECK Constraint:
-- CHECK Constraint on budget column in the projects table
ALTER TABLE employees.projects
ADD CONSTRAINT chk_budget CHECK (budget > 0);

-- We can also specify this constraint while table creation; for example
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(255),
    price DECIMAL,
    quantity INT,
    CONSTRAINT chk_price_quantity CHECK (price > 0 AND quantity >= 0)
);



-- PRIMARY KEY Constraint:
-- PRIMARY KEY Constraint on deptno column in the dept table
ALTER TABLE employees.dept
ADD CONSTRAINT pk_dept PRIMARY KEY (deptno);

-- PRIMARY KEY Constraint on empno column in the emp table
ALTER TABLE employees.emp 
ADD CONSTRAINT pk_emp PRIMARY KEY (empno);

-- PRIMARY KEY Constraint on projectno column in the projects table
ALTER TABLE employees.projects 
ADD CONSTRAINT pk_projects PRIMARY KEY (projectno);

-- PRIMARY KEY Constraint on emp_projectno column in the EmpProjects table
ALTER TABLE employees.emp_projects
ADD CONSTRAINT pk_empprojects PRIMARY KEY (emp_projectno);

-- We can also specify this constraint while table creation; for example
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    order_date DATE
);



-- FOREIGN KEY Constraint:
-- FOREIGN KEY Constraint on deptno column in the emp table referencing the
-- deptno column in the dept table
ALTER TABLE employees.emp
ADD CONSTRAINT fk_deptno FOREIGN KEY (deptno) REFERENCES employees.dept(deptno);

-- FOREIGN KEY Constraints on empno and projectno columns in the
-- emp_projects table referencing the respective columns in the
-- emp and projects tables
ALTER TABLE employees.emp_projects
ADD CONSTRAINT fk_emp_no FOREIGN KEY (empno) REFERENCES employees.emp(empno);
ALTER TABLE employees.emp_projects
ADD CONSTRAINT fk_project_no FOREIGN KEY (projectno)
 REFERENCES employees.projects(projectno);

-- We can also specify this constraint while table creation; for example
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date DATE
);
