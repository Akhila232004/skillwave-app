![SQLServer Tinitiate Image](sqlserver.png)

# SQLServer Tutorial

&copy; TINITIATE.COM

# Advanced Tuning & Best Practices

## Table Partitioning

* Partitioning splits a large table into smaller chunks based on a key (often date).

* SQL still sees one logical table, but physically the data is spread across partitions.

* Benefits:

  * Query only scans relevant partitions (partition elimination).
  
  * Easier maintenance (rebuild index per partition).
  
  * Bulk load/drop at partition level.

```sql
-- Example: Partition employees.emp_projects by year of start_date

-- Step 1: Partition function (splits range)
CREATE PARTITION FUNCTION PF_ProjectYear (DATE)
AS RANGE RIGHT FOR VALUES ('2023-12-31', '2024-12-31', '2025-12-31');

-- Step 2: Partition scheme
CREATE PARTITION SCHEME PS_ProjectYear
AS PARTITION PF_ProjectYear ALL TO ([PRIMARY]);

-- Step 3: Create partitioned table (demo only)
CREATE TABLE employees.emp_projects_partitioned
(
  emp_projectno INT,
  empno INT,
  projectno INT,
  start_date DATE,
  end_date DATE
) ON PS_ProjectYear(start_date);
```

* Show how queries with WHERE start_date >= '2024-01-01' only hit one partition.

* Emphasize partitioning is about manageability, not performance (small tables don’t benefit).

## Parallelism (MAXDOP, Cost Threshold Tuning)

* SQL can split a query across multiple CPUs (parallelism).

* MAXDOP (Maximum Degree of Parallelism) controls number of CPUs per query.

* Cost Threshold for Parallelism decides at what estimated cost SQL goes parallel.

```sql
-- Force a parallel plan for demo
SELECT e.deptno, COUNT(*)
FROM employees.emp e
CROSS JOIN employees.emp e2 -- big join to increase cost artificially
GROUP BY e.deptno
OPTION (MAXDOP 4);

```

* Too much parallelism → context switching overhead (common in OLTP).

* Too little → big queries run serially (slow).

* Rule of Thumb:

  * OLTP systems → lower MAXDOP, higher cost threshold.
  
  * Reporting systems → allow more parallelism.

## TempDB Optimization

* TempDB is a shared workspace for all databases (used for temp tables, spills, sorts).

* Bottlenecks in TempDB = system-wide slowness.

**Best Practices:**

* Multiple TempDB data files (1 per logical CPU up to 8, then monitor).

* Equal size for files, with autogrowth disabled (fixed size).

* Place TempDB on fast storage (SSD).

* Use appropriate trace flags in older versions (not needed in SQL 2016+).

```sql
-- Queries spilling to TempDB
SELECT * FROM sys.dm_exec_query_memory_grants WHERE grant_time IS NOT NULL;

-- TempDB usage by sessions
SELECT session_id, user_objects_alloc_page_count, internal_objects_alloc_page_count
FROM sys.dm_db_session_space_usage;
```

* Big queries or bad indexing cause hash join spills.

* TempDB config is critical for performance baseline.

## Adaptive Query Processing (SQL Server 2017+)

* SQL Server learns from query executions and adjusts plans dynamically.

Key Features:

* Batch Mode Memory Grant Feedback → adjusts memory for sorts/joins.

* Adaptive Joins → switches join type at runtime (Nested Loop ↔ Hash Join).

* Interleaved Execution → defers plan choice until parameterized subquery executes.

```sql
-- Demo requires SQL Server 2017+
-- Adaptive Join (plan changes based on row count)
SELECT e.empno, ep.projectno
FROM employees.emp e
JOIN employees.emp_projects ep ON e.empno = ep.empno
WHERE e.sal > 1000; -- try different thresholds
```

* Plan operator labeled Adaptive Join.

* SQL Server is moving towards “self-tuning,” but good schema + indexes are still crucial.

##  Best Practices for Performance Baselining

* Performance tuning requires a baseline to measure against.

* Without a baseline, you can’t say if performance is “bad” or “normal.”

* What to Baseline:

  * Server Metrics → CPU, Memory, Disk latency.
  
  * SQL Metrics → Batch Requests/sec, Page Life Expectancy (PLE), Buffer Cache Hit Ratio.
  
  * Query Metrics → Avg. duration, logical reads, top queries by resource usage.
  
  * Wait Stats → Top waits as system health indicators.

```sql

-- Use DMVs to build baseline
SELECT TOP 10 
    qs.total_elapsed_time/qs.execution_count AS AvgDuration,
    qs.total_logical_reads/qs.execution_count AS AvgReads,
    qt.text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY AvgReads DESC;
```

* Always record baseline metrics weekly.

* Compare current performance against baseline to identify regressions.
