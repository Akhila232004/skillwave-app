![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Temp Tables
Temporary tables are a form of temporary storage in SQL Server. They are session-specific tables used to store intermediate results, which are automatically dropped at the end of a session or when the last referencing statement finishes.

# Local Temp Tables (#)
Local temporary tables are physical tables created in the tempdb system database. Their names are prefixed with a single hash (#) and their scope is limited to the session in which they were created. They are fully logged to the tempdb transaction log, which can cause performance bottlenecks and contention in high-volume environments. However, a major advantage is that SQL Server's query optimizer treats them like a regular table and creates statistics on them. This allows the optimizer to build efficient query plans, making them the preferred choice for handling large datasets and complex queries with multiple joins.

```sql
BEGIN
  -- Create a local temp table
  CREATE TABLE #temp_employees (
      emp_id INT, 
      employee_name VARCHAR(102)
  );

  INSERT INTO #temp_employees (emp_id, employee_name) 
  SELECT empno, ename FROM employees.emp;

  -- The optimizer will use statistics on #temp_employees
  SELECT t.employee_name, d.dname
  FROM #temp_employees AS t
  JOIN employees.dept AS d ON t.emp_id = d.deptno;
END
```

# Global Temp Tables (##)
Global temporary tables are also physical tables in tempdb, but they are accessible across all sessions. Their names are prefixed with a double hash (##). They persist until the last session referencing them disconnects, making them useful for sharing data between different sessions. However, due to their global scope, they are highly susceptible to naming conflicts and concurrency issues, which is why they are generally discouraged in favor of other, more controlled methods.

```sql
-- Create a global temp table
CREATE TABLE ##global_report (
    report_id INT, 
    report_data VARCHAR(255)
);

-- This table can be accessed by any active session until all sessions have disconnected.
INSERT INTO ##global_report (report_id, report_data) VALUES (1, 'Initial data');
SELECT * FROM ##global_report;
```

# Table Variables (@)
Table variables are distinct from temporary tables. They are variables that store a result set in memory (if small enough) rather than on disk in tempdb. Their scope is the most limited, as they are only visible within the BEGIN...END block, stored procedure, or batch where they were declared. A key advantage is that operations on them are minimally logged, making them extremely fast for data manipulation. However, their primary drawback lies in query optimization: the optimizer assumes a table variable contains only one row and does not create statistics. This can lead to inefficient query plans and poor performance when they contain a large number of rows. They are best suited for small datasets or situations where minimal logging is critical.

```sql
BEGIN
  -- Declare a table variable
  DECLARE @employee_list TABLE (
      emp_id INT,
      employee_name VARCHAR(100)
  );

  INSERT INTO @employee_list (emp_id, employee_name) 
  SELECT empno, ename FROM employees.emp WHERE deptno = 10;
  
  -- The optimizer will assume @employee_list has one row,
  -- which could lead to a suboptimal plan if it has many rows.
  SELECT * FROM @employee_list;
END
```
<img width="773" height="104" alt="image" src="https://github.com/user-attachments/assets/486b42cc-04d5-4844-a6e9-1611fce7a00c" />


##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
