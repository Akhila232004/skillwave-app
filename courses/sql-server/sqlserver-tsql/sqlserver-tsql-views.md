![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Views
A view is a virtual table that is based on the result set of a SQL query. Views contain rows and columns, just like a real table, but they do not physically store data. Instead, they act as a stored query that presents data from one or more underlying tables.

Views are used to simplify complex queries, enhance security by restricting access to sensitive data, and abstract the underlying data structure from users and applications.

<img width="570" height="92" alt="image" src="https://github.com/user-attachments/assets/ec73f67c-26aa-41c5-8f68-ad9e62fc5c0b" />

## Creating and Using Views
### Creating a Simple View
Here's how to create a basic view that filters data from a single table.

```sql

CREATE VIEW vw_EmployeeInfo
AS
SELECT empno, ename, job, deptno
FROM employees.emp
WHERE job LIKE '%Manager%';
```

### Querying a View
Once a view is created, you can query it just like you would a regular table.

```sql

SELECT * FROM vw_EmployeeInfo;
```

### Modifying and Dropping Views
 
ALTER VIEW: Use this statement to change a view's definition.

DROP VIEW: Use this statement to remove a view from the database.
 

```sql
-- Altering a view to add a filter for salaries
ALTER VIEW vw_EmployeeInfo
AS
SELECT empno, ename, job, deptno, sal
FROM employees.emp
WHERE job LIKE '%Manager%' AND sal > 2500;

-- Dropping a view
DROP VIEW vw_EmployeeInfo;
```

### Complex Views
Complex views are a common practice for encapsulating intricate queries that involve multiple joins and aggregations into a simple, reusable object.

* Scenario: You want a single view that provides comprehensive employee details, including their department name and a list of all projects they are assigned to.

```sql

CREATE VIEW vw_EmployeeDetails
AS
SELECT 
    e.empno,
    e.ename,
    d.dname,
    STRING_AGG(p.project_name, ', ') WITHIN GROUP (ORDER BY p.project_name) AS Projects
FROM 
    employees.emp e
    INNER JOIN employees.dept d ON e.deptno = d.deptno
    LEFT JOIN employees.emp_projects ep ON e.empno = ep.empno
    LEFT JOIN employees.projects p ON ep.projectno = p.projectno
GROUP BY 
    e.empno,
    e.ename,
    d.dname;
```

* Joins: The joins connect employee data with their department and project information. LEFT JOIN is used to include employees who may not be assigned to any project.

* STRING_AGG: This function aggregates all project names for a single employee into a comma-separated list.

* GROUP BY: The GROUP BY clause is required because STRING_AGG is an aggregate function.

## Advanced View Concepts

### Updateable Views and INSTEAD OF Triggers

A view is updatable only if it references a single base table and does not contain aggregates, joins, or other complex logic. For complex views, you must use an INSTEAD OF trigger to handle data modifications.

An INSTEAD OF trigger intercepts a data modification command (INSERT, UPDATE, or DELETE) on a view and executes the logic defined within the trigger instead of the original command.

* Example: Updating a Complex View with a Trigger

This example shows how an INSTEAD OF UPDATE trigger on a joined view can correctly update data in the underlying base table.

```sql

-- Creating a complex view with a join
CREATE VIEW vw_EmployeeDept AS
SELECT e.empno, e.ename, e.job, d.dname
FROM employees.emp e
JOIN employees.dept d ON e.deptno = d.deptno;
GO

-- Creating an INSTEAD OF UPDATE trigger on the view
CREATE TRIGGER trg_UpdateEmployeeDept ON vw_EmployeeDept
INSTEAD OF UPDATE
AS
BEGIN
    -- Update the emp table based on the data provided to the view
    UPDATE e
    SET 
        e.ename = i.ename,
        e.job = i.job
    FROM employees.emp e
    JOIN inserted i ON e.empno = i.empno;
END;
GO
```

## Indexed Views (Materialized Views)
For complex views that are used frequently for reporting or analytics, a standard view's performance can be a bottleneck. An indexed view, also known as a materialized view, solves this by physically storing the view's result set on disk.

* How it works: You create a view with the WITH SCHEMABINDING option, and then you create a UNIQUE CLUSTERED INDEX on it. This action forces SQL Server to persist the data.

* Benefits: Queries on the view are much faster because the data is pre-calculated. The query optimizer can also use the indexed view to speed up queries on the base tables, even if the view is not directly referenced.

* Drawbacks: There is a performance overhead on INSERT, UPDATE, and DELETE operations on the base tables, as the indexed view must be kept in sync.

* Example: Creating an Indexed View

```sql

-- Step 1: Create a view with SCHEMABINDING to bind it to the base tables
CREATE VIEW vw_ProductSales
WITH SCHEMABINDING
AS
SELECT 
    p.ProductID,
    SUM(s.SalesAmount) AS TotalSales,
    COUNT_BIG(*) AS NumberOfSales -- COUNT_BIG is required for indexed views
FROM 
    dbo.Products AS p
JOIN 
    dbo.Sales AS s ON p.ProductID = s.ProductID
GROUP BY 
    p.ProductID;
GO

-- Step 2: Create a unique clustered index to materialize the view
CREATE UNIQUE CLUSTERED INDEX idx_ProductSales_ProductID
ON vw_ProductSales (ProductID);
GO
```
 

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
