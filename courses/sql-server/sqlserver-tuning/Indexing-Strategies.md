![SQLServer Tinitiate Image](sqlserver.png)

# SQLServer Tutorial

&copy; TINITIATE.COM

# Indexing Strategies

Indexes are the backbone of performance tuning in SQL Server. The right index can change a query from minutes to milliseconds; the wrong index (or missing one) can cripple a workload.

## What is an Index?

* **Concept**:

  * Think of an index like the index in a book → instead of scanning every page, you jump straight to the right section.
  
  * In SQL Server, indexes are stored in B-tree (balanced tree) structures:

    * Root Node → points to intermediate pages.
    
    * Leaf Nodes → contain actual row pointers (nonclustered) or the full data row (clustered).

* **Types**:

* **Clustered Index** → sorts the entire table by one key (only one allowed).

* **Nonclustered Index** → separate structure pointing to data rows.

* **Covering Index** → includes extra columns so SQL doesn’t go back to the base table.

* **Filtered Index** → covers a subset of rows (saves space, speeds up queries).

* Create three versions of the tables:

tables without indexes,

tables with primary and foreign key indexes, and

tables fully optimized with all recommended indexing and performance enhancements.

* **Table with No Index**
```sql
CREATE TABLE table_small_no_index (
    emp_id INT,
    dept_id INT,
    emp_name VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BIT
);
```

```sql
CREATE TABLE table_medium_no_index (
    emp_id INT,
    dept_id INT,
    emp_name VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BIT
);

```

```sql
CREATE TABLE table_large_no_index (
    emp_id INT,
    dept_id INT,
    emp_name VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE,
    is_active BIT
);

```

## Clustered Index

* Every table should ideally have a clustered index (usually the primary key).

* Data is physically ordered by the clustered index key.

* Lookups by this key are very fast.

* **Example**:

```sql
-- Add clustered index on empno (if not already PK)
CREATE CLUSTERED INDEX CIX_emp_empno ON employees.emp(empno);

-- Fast lookup by clustered key
SELECT * FROM employees.emp WHERE empno = 7839;
```

* Without a clustered index, SQL uses a heap (unordered rows), which causes scans and higher maintenance costs.

## Nonclustered Index

* Best for frequently searched non-unique columns (e.g., deptno, job).

* Leaf node contains row pointers → SQL fetches data by “bookmark lookup” to clustered index/heap.

* **Example**:

```sql
-- Create nonclustered index on deptno
CREATE NONCLUSTERED INDEX IX_emp_deptno ON employees.emp(deptno);

-- Query benefits
SELECT ename, sal FROM employees.emp WHERE deptno = 30;

```

* Execution plan shows Index Seek + Key Lookup.
* Lookup happens when needed columns aren’t in the index.

## **Covering Index**

* If many key lookups occur, INCLUDE the needed columns.

* This makes the index “cover” the query, eliminating base table lookups.

* **Example:**

```sql
-- Covering index: deptno search + ename/sal as included columns
CREATE NONCLUSTERED INDEX IX_emp_deptno_cover
ON employees.emp(deptno) INCLUDE (ename, sal);

-- Query now covered
SELECT ename, sal FROM employees.emp WHERE deptno = 30;
```

* Check execution plan: no Key Lookup operator anymore.

* Saves I/O, especially on large tables.

## Filtered Index

* Targets specific subsets (e.g., only active rows).

* Saves storage and improves performance on selective queries.

* **Example**:

```sql
-- Only index employees with commission > 0
CREATE NONCLUSTERED INDEX IX_emp_commission
ON employees.emp(commission) WHERE commission > 0;

-- Query uses filtered index
SELECT ename, commission
FROM employees.emp
WHERE commission > 0;
```

* Filtered indexes shine when queries target a small fraction of rows.

##  Index Maintenance (Fragmentation & Statistics)

* Indexes get fragmented (pages out of order) after many inserts/updates/deletes.

* Fragmentation slows down range scans.

* Use ALTER INDEX to rebuild/reorganize.

* **Example**:

```sql
-- Check fragmentation
SELECT db_name(database_id) AS DBName, object_name(object_id) AS TableName,
       index_id, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('employees.emp'), NULL, NULL, 'LIMITED');

-- Rebuild index
ALTER INDEX IX_emp_deptno ON employees.emp REBUILD;
```

* Reorganize (light defrag) if 10–30% fragmented.

* Rebuild (full restructure) if >30%.

## Indexing Pitfalls

* Too many indexes = slower writes (insert/update/delete must update all indexes).

* Wide indexes (many included columns) = big storage cost.

* Duplicate/overlapping indexes waste resources.

## Rule of Thumb for Students:

* Index to support WHERE, JOIN, ORDER BY, GROUP BY columns.

* Include only frequently queried columns.

* Drop unused or duplicate indexes.

## Before vs After Index

```sql
-- Show students how performance changes.

SET STATISTICS IO, TIME ON;

-- Without index: table scan
SELECT ename, sal FROM employees.emp WHERE deptno = 30;

-- With IX_emp_deptno_cover: index seek
SELECT ename, sal FROM employees.emp WHERE deptno = 30;
```
* Compare logical reads in STATISTICS IO. Students see the drop in reads.
