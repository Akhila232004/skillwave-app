![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DML - Data Manipulation Language
* In SQL Server, Data Manipulation Language (DML) consists of SQL commands that allow users to manipulate data within database objects.
* DML commands are used to perform operations such as inserting, updating, and deleting data.

## Primary DML commands in SQL Server:
### INSERT:
* This command is used to add new rows of data into a table.
* You can specify the values to be inserted into each column of the table.
```sql
-- Insert with column created order
INSERT INTO employees.dept (deptno, dname) VALUES (1000, 'PRODUCTION');
INSERT INTO employees.emp (empno, ename, sal, deptno)
 VALUES (101, 'John Doe', 5000.00, 1000);

-- Insert with using positional values
INSERT INTO employees.dept VALUES (2000, 'FOUNDRY');

-- Insert with column names, different order
INSERT INTO employees.dept (dname, deptno) VALUES ('STORES', 3000);

-- Insert all, Insert more data in single insert
INSERT INTO employees.dept (deptno, dname)
VALUES 
    (111, 'TECHNOLOGY'),
    (211, 'FACTORY'),
    (311, 'RETAIL');

-- Insert with select statement (Copy data from another table)
-- Create table dept1
CREATE TABLE employees.dept1 (
    deptno INT,
    dname VARCHAR(100)
);
-- Insert data from dept into dept1
INSERT INTO employees.dept1 (deptno, dname)
SELECT deptno, dname
FROM employees.dept;

-- Incorrect data violations
-- Primary Key violation
INSERT INTO employees.dept (deptno, dname) VALUES (3000, 'MARKETING');

-- DataType Size violation
INSERT INTO employees.dept (deptno, dname) 
VALUES (6, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

-- Foreign Key violation
INSERT INTO employees.emp (empno, ename, sal, deptno)
 VALUES (15, '4F', 12000.00, 5000);
```

### UPDATE:
* This command is used to modify existing data in a table.
* You can update one or more columns of existing rows based on a specified condition.
```sql
-- Update salary of an employee
UPDATE employees.emp SET sal = 6200.00 WHERE empno = 101;

-- Update project end date
UPDATE employees.Emp_Projects SET End_Date = '2024-06-01'
 WHERE emp_projectno  = 1 AND empno = 101;
```

### DELETE:
* This command is used to remove one or more rows from a table based on a specified condition.
```sql
-- Delete a dept
DELETE FROM employees.dept WHERE deptno = 3000;

-- Remove an employee
DELETE FROM employees.emp WHERE empno = 101;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
