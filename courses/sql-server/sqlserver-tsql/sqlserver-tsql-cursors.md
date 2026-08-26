![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Cursors
A cursor is a database object used to process the rows of a result set one at a time. While cursors are a powerful tool for row-by-row operations, they're generally considered an anti-pattern in T-SQL due to significant performance drawbacks.

## When to Avoid Cursors 🚫
The primary reason to avoid cursors is performance. A cursor-based operation is a procedural approach in a set-based language. It's often many times slower than its set-based alternative because cursors require more memory and CPU overhead, cause excessive logging, and prevent the query optimizer from creating efficient plans. The following examples demonstrate how to replace a cursor with an efficient, set-based query.

## Set-Based Alternatives (Recommended Approach)
Example 1: Set-Based Salary Update

Instead of using a cursor to update each employee's salary one by one, a single UPDATE statement can perform the same action for all employees at once, which is the correct and highly performant way to manipulate large datasets.

```sql
UPDATE employees.emp
SET sal = sal * 0.90;
```

Example 2: Set-Based Department Summary

Similarly, a department salary summary can be generated using a single SELECT statement with a GROUP BY clause and then directly inserted into a summary table. This is far more efficient than looping through each department with a cursor.

```sql

-- Drop the summary table to start fresh
DROP TABLE IF EXISTS employees.dept_summary;

-- Create the summary table
CREATE TABLE employees.dept_summary
(
    deptno INT PRIMARY KEY,
    dname VARCHAR(14),
    employee_count INT,
    total_salary NUMERIC(12,2),
    avg_salary NUMERIC(12,2)
);

-- Insert data from a single, set-based query
INSERT INTO employees.dept_summary
    (deptno, dname, employee_count, total_salary, avg_salary)
SELECT
    d.deptno,
    d.dname,
    COUNT(e.empno),
    SUM(e.sal),
    AVG(e.sal)
FROM
    employees.dept AS d
LEFT JOIN
    employees.emp AS e ON d.deptno = e.deptno
GROUP BY
    d.deptno, d.dname;
```

## When to Use Cursors
Cursors should be used only when a task cannot be performed in a single, efficient, set-based operation. Common use cases include:

* Hierarchical Traversal: Navigating a tree-like structure, such as a management hierarchy, where each step depends on the previous one.

* Administrative Tasks: Performing maintenance actions on a series of database objects, like dropping tables with a specific prefix.

* Dynamic SQL: Executing a unique, dynamically generated SQL command for each row in a result set.

## Cursor Options and Performance
Understanding the different cursor options is critical for working with existing codebases and for the few scenarios where they're necessary. These options can significantly impact performance, concurrency, and memory usage.

### Cursor Types
* FORWARD_ONLY (Default): The most efficient cursor type. It can only move forward through the result set, one row at a time, and is read-only. This is the preferred cursor type when you have no other choice.

* STATIC: Creates a full, temporary copy of the result set in tempdb. This makes it slow to open but guarantees that the data won't change while the cursor is open.

* KEYSET: Creates a copy of the keys for the rows. It allows you to move forward and backward. Changes to non-key data are visible, but new rows inserted into the table are not.

* DYNAMIC: The least performant and most resource-intensive. It reflects all data changes (inserts, updates, and deletes) as you move through the result set, providing the most up-to-date view of the data.

### Cursors and Concurrency
The READ_ONLY and SCROLL options control how cursors interact with the underlying data and can lead to concurrency issues and deadlocks.

* READ_ONLY: Prevents updates through the cursor and is a good practice for performance. It signals that no locks are needed for updating data.

* SCROLL: Allows the cursor to move both forward and backward. This option is required for STATIC, KEYSET, and DYNAMIC cursors, which are generally less efficient.

```
##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
