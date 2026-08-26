![SQLServer Tinitiate Image](sqlserver.png)

# SQLServer Tutorial

&copy; TINITIATE.COM

# Introduction & Performance Fundamentals

##  SQL Server Query Processing Lifecycle

* Concept: SQL Server follows a pipeline when processing a query.

  * Parsing – SQL text is checked for syntax errors and converted into a parse tree.
  
  * Binding/Algebrization – Object names, column names, and data types are validated; relationships are resolved.
  
  * Optimization – SQL Server generates multiple query plans and picks the cheapest (lowest estimated cost).
  
  * Execution – The chosen plan is executed, operators run, data is fetched, and results are returned.

* Key Teaching Point:

* Students should understand **optimizer** vs **execution** engine.
* Query **cost** is based on estimated CPU + I/O usage, not actual runtime.

* Example:

```sql
-- SQL Server will parse, optimize, and choose a plan:
SELECT e.ename, d.dname
FROM employees.emp e
JOIN employees.dept d ON d.deptno = e.deptno
WHERE e.sal > 2000;
```

## Execution Plans (Estimated vs. Actual)

* Concept: Execution plans are SQL Server’s “blueprint” for how it will run a query.

  * Estimated Plan: Generated without executing; based on statistics only.
  
  * Actual Plan: Includes runtime data like actual row counts and warnings (spills, missing indexes, etc.).

* How to View:

  * SSMS → Query → “Display Estimated Execution Plan” (Ctrl+L)
  
  * SSMS → “Include Actual Execution Plan” (Ctrl+M, then run query)

* Key Teaching Points:

  * Learn to read operators: Index Seek, Table Scan, Nested Loop, Hash Join.
  
  * Watch for discrepancy between estimated and actual row counts → often means stale/missing statistics.

* Example:

```sql
-- Run with Actual Execution Plan enabled
SELECT e.ename, e.sal, d.dname
FROM employees.emp e
JOIN employees.dept d ON e.deptno = d.deptno
WHERE e.sal BETWEEN 1200 AND 2000;
```

* Expected: Index Seek on salary if IX_emp_sal exists.
* Actual: May fall back to Table Scan if no index.

### Role of Statistics in Query Performance

* Concept: Statistics are histograms showing data distribution in columns. The optimizer relies on them for row estimates.

* Why Important:

  * If statistics are missing or stale → wrong cardinality estimates → bad join choice.
  
  * Example: SQL may choose a Nested Loop thinking only 10 rows exist, but 1 million rows return → query crawls.

* How SQL Maintains Stats:

* **Auto Create Statistics** = ON by default.

* **Auto Update Statistics** = ON (but updates only after significant data changes).

* Key Points:

  * Statistics guide the optimizer like a map.
  * Update stats after bulk inserts/updates for accuracy.
  * Indexes always create statistics; you can create standalone stats too.

* Example:
```sql
-- Check stats for emp table
DBCC SHOW_STATISTICS ('employees.emp', 'IX_emp_deptno');

-- Update stats manually (for demo)
UPDATE STATISTICS employees.emp WITH FULLSCAN;
```

## Identifying Performance Bottlenecks

* Concept: Performance issues typically fall into 3 main areas:

  * **CPU-bound** : Query uses complex functions, poor joins, or no indexes.
  
  * **I/O-bound** : Query scans too much data (Table Scans, key lookups, missing indexes).
  
  * **Concurrency/Locking** : Blocking transactions or deadlocks.

* Ways to Identify:

  * SET STATISTICS IO, TIME ON → measure logical reads & time.
  
  * Execution Plan → look for warnings (spills, missing indexes, estimated vs actual row mismatch).
  
  * DMVs (sys.dm_exec_requests, sys.dm_os_wait_stats) → see live waits.

* Key Points:

  * Always measure before optimizing.
  
  * Look at logical reads → tells you how much data SQL had to touch.
  
  * Avoid fixing symptoms (adding random indexes); diagnose the root cause.

* Example:

```sql
-- Enable I/O and time stats
SET STATISTICS IO ON; 
SET STATISTICS TIME ON;

-- Run a query
SELECT e.empno, e.ename, g.grade
FROM employees.emp e
JOIN employees.salgrade g
  ON e.sal BETWEEN g.losal AND g.hisal;
```

  * Students compare logical reads with/without indexes.
  
  * how how adding IX_emp_sal reduces reads dramatically.
