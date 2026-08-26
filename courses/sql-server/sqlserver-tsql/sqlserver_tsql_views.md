![Tinitiate SQLSERVER Training](images/sqlserver.png)
# SQL SERVER VIEWS

* In SQL SERVER, a view is a virtual table based on the result-set of an SQL statement. Views contain rows and columns, just like a real table, and the fields in a view are fields from one or more real tables in the database. You can use views to simplify complex queries, enhance security by restricting access to underlying tables, and abstract data in a way that users find natural or intuitive.

Key Characteristics of Views:
* **Simplification of Complex Queries:** Views can encapsulate complex queries with joins, filters, and calculations, presenting a simple interface to the user or application.

* **Data Abstraction:** Users can interact with data without needing to understand details about the underlying table structures.

* **Security:** Views can limit the visibility of certain data within the database, thereby providing a security mechanism to restrict access to sensitive information.

* **Updateability:**  Depending on the SQL Server version and the view’s complexity, some views are updateable, meaning you can perform INSERT, UPDATE, or DELETE operations on the view.

## Creating Views
Here is how you can create a simple view in SQL Server:

```sql
  CREATE VIEW vw_EmployeeInfo
  AS
  SELECT emp_id, emp_name, job_title, dept_id
  FROM emp
  WHERE job_title LIKE '%Manager%';
```
This view vw_EmployeeInfo shows a list of employees who are managers.

## Using Views
Once a view is created, you can use it just like you would use a table. Here’s how you can query the view:

```sql
  SELECT * FROM vw_EmployeeInfo;
```
## Modifying Views

To change a view after it has been created, you can use the ALTER VIEW statement:

```sql
  ALTER VIEW vw_EmployeeInfo
  AS
  SELECT emp_id, emp_name, job_title, dept_id, status
  FROM emp
  WHERE job_title LIKE '%Manager%' AND status = 'Active';
```

This modification adds a filter to display only active managers.

## Dropping Views
If you no longer need a view, you can remove it using the DROP VIEW statement:

```sql
  DROP VIEW vw_EmployeeInfo;
```
## Complex Views

complex views in SQL Server that involve joining multiple tables is a common practice to encapsulate complex SQL queries into a simpler form that can be reused. This is particularly useful in scenarios where you have normalized databases with data spread across multiple related tables, and you frequently need to aggregate this data for reporting or business logic purposes.

Here's an example of how to create a complex view in SQL Server that involves multiple joins across several tables. Suppose we have a typical business database with tables for employees (emp), departments (dept), projects (project), and employee assignments to projects (emp_project). We'll create a view that provides a comprehensive overview of employee details along with their department names and projects they are working on.

Scenario:
You want a view that shows the following for each employee:

Employee ID and name
Department name
List of projects they are assigned to
Database Schema:
Assuming the following simplified schema for tables:

emp (emp_id, emp_name, dept_id)
dept (dept_id, dept_name)
project (project_id, project_name)
emp_project (emp_id, project_id)
SQL Code to Create the View:
```sql
  CREATE VIEW vw_EmployeeDetails
  AS
  SELECT 
      e.emp_id,
      e.emp_name,
      d.dept_name,
      STRING_AGG(p.project_name, ', ') WITHIN GROUP (ORDER BY p.project_name) AS Projects
  FROM 
      emp e
      INNER JOIN dept d ON e.dept_id = d.dept_id
      LEFT JOIN emp_project ep ON e.emp_id = ep.emp_id
      LEFT JOIN project p ON ep.project_id = p.project_id
  GROUP BY 
      e.emp_id,
      e.emp_name,
      d.dept_name;
```
**Explanation:** 

**INNER JOIN** between emp and dept: This join ensures that we only get employees who are assigned to departments. It connects each employee with their respective department.

**LEFT JOIN** between emp and emp_project, and emp_project to project: These joins are used to gather project information for each employee. The use of LEFT JOIN ensures that employees who are not assigned to any project are also included in the results, with their project information being null.
STRING_AGG:

This function aggregates the project names into a single comma-separated string for each employee. It is a convenient way to list all projects associated with an employee in a single row of the view. The WITHIN GROUP (ORDER BY p.project_name) clause orders the projects by name within each aggregated string.
GROUP BY:

This clause is necessary because the STRING_AGG function is an aggregate function. We group by employee ID, name, and department name to ensure that our aggregate function (STRING_AGG) works across the correct grouping of data.
Usage:
To use this view to fetch employee details along with their department and projects:

```sql

SELECT * FROM vw_EmployeeDetails;

```

## Updating Simple View

* Here is an example of creating a simple updatable view and using it to update data:

```sql
-- Creating a simple view on the employees table
  CREATE VIEW vw_EmployeeBasicInfo AS
  SELECT emp_id, emp_name, job_title
  FROM emp;

-- Updating data through the view
  UPDATE vw_EmployeeBasicInfo
  SET job_title = 'Senior Developer'
  WHERE emp_id = 1;
  In this example, vw_EmployeeBasicInfo is a simple view that does not include any of the features that would disqualify it from being updatable. Therefore, you can perform an UPDATE operation directly through the view.
```

## Updating Complex View

* Here is an Example of a Complex View with an INSTEAD OF Trigger
For complex views, you can use INSTEAD OF triggers to specify custom actions to take when an insert, update, or delete operation is attempted on the view:

```sql
-- Creating a complex view with a join
  CREATE VIEW vw_EmployeeDept AS
  SELECT e.emp_id, e.emp_name, e.job_title, d.dept_name
  FROM emp e
  JOIN dept d ON e.dept_id = d.dept_id;

-- Creating an INSTEAD OF UPDATE trigger on the view
  CREATE TRIGGER trg_UpdateEmployeeDept ON vw_EmployeeDept
  INSTEAD OF UPDATE
  AS
  BEGIN
      -- Update the emp table based on the view update
      UPDATE emp
      SET emp_name = INSERTED.emp_name,
          job_title = INSERTED.job_title
      FROM INSERTED
      WHERE emp.emp_id = INSERTED.emp_id;

      -- Update logic for dept could also be included if needed
  END;

-- Updating data through the view
  UPDATE vw_EmployeeDept
  SET job_title = 'Senior Developer'
  WHERE emp_id = 1;
```
In this scenario, vw_EmployeeDept includes a join, making it complex and typically not updatable directly. The INSTEAD OF trigger, trg_UpdateEmployeeDept, intercepts update operations on the view and provides the necessary SQL commands to update the underlying emp table accordingly.