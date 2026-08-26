![SQLServer Tinitiate Image](sqlserver.png)


# SQLServer Tutorial

&copy; TINITIATE.COM

# Query Optimization Techniques

## What is SARGability?

* SARGable = Search ARGument ABLE.

* A query is SARGable if the optimizer can use an index seek instead of a scan.

* Non-SARGable queries force SQL Server to evaluate every row → bad performance on large tables.

* **Rule of Thumb**:

* Keep the column on the left side of the predicate.

* Avoid wrapping columns in functions.

* Use ranges (>=, <, BETWEEN) instead of applying operations inside the WHERE.

## Common Non-SARGable Patterns (and Fixes)

* Functions on Columns
```sql
-- BAD: Function prevents index usage
SELECT * FROM employees.emp
WHERE YEAR(hiredate) = 2024; -- (Assume hiredate column exists)
```

* SQL must compute YEAR(hiredate) for every row.
* Index on hiredate is useless.

```sql 
-- GOOD: Range condition
SELECT * FROM employees.emp
WHERE hiredate >= '2024-01-01' AND hiredate < '2025-01-01';
```

* Wildcards at Start
```sql  
-- BAD: Leading wildcard forces scan
SELECT * FROM employees.emp WHERE ename LIKE '%SMI%';

-- GOOD: Trailing-only wildcard allows seek
SELECT * FROM employees.emp WHERE ename LIKE 'SMI%';
```

* Implicit Conversions
```sql
-- BAD: Converts sal to string before compare
SELECT * FROM employees.emp WHERE sal = '2000';

-- GOOD: Match datatypes (NUMERIC)
SELECT * FROM employees.emp WHERE sal = 2000;
```

* OR Across Columns
```sql
-- BAD: OR across different columns often disables index use
SELECT * FROM employees.emp WHERE deptno = 10 OR sal > 3000;

-- GOOD: Split into UNION ALL (optimizer can use indexes separately)
SELECT * FROM employees.emp WHERE deptno = 10
UNION ALL
SELECT * FROM employees.emp WHERE sal > 3000;
```

## Practical Demo with Your Tables
* Salary Ranges
```sql

-- Non-SARGable
SELECT * FROM employees.emp WHERE sal*1.1 > 2000;

-- SARGable rewrite
SELECT * FROM employees.emp WHERE sal > 2000/1.1;
```

* Projects with Active Dates
```sql
-- Non-SARGable
SELECT * FROM employees.emp_projects WHERE ISNULL(end_date, GETDATE()) > GETDATE();

-- SARGable rewrite
SELECT * FROM employees.emp_projects WHERE end_date IS NULL OR end_date > GETDATE();
```

## Why SARGability Matters

* SARGable queries allow index seeks, which reduce logical reads.

* Non-SARGable queries = Table Scans → huge cost on large datasets.

* Writing “clean SQL” matters more than just creating indexes.

```sql
SET STATISTICS IO, TIME ON;

-- Non-SARGable
SELECT * FROM employees.emp WHERE LEFT(ename, 3) = 'SCO';

-- SARGable
SELECT * FROM employees.emp WHERE ename >= 'SCO' AND ename < 'SCP';
```

* **Output ::**

* Logical reads drop.

* Execution plan changes from Index Scan → Index Seek.

## Query Rewrite Best Practices

* Avoid functions on indexed columns (UPPER, LEFT, YEAR).

* Use proper data types (avoid implicit conversions).

* Replace OR with UNION ALL when it helps index usage.

* Write range-based conditions for dates & numbers.

* Avoid NOT IN with NULLs → use NOT EXISTS.

* Select only necessary columns (avoid SELECT *).

## Teaching Exercise (For Students)

* **Commission Employees**
```sql
-- Rewrite to SARGable
SELECT * FROM employees.emp WHERE commission + sal > 2000;
```

* **Employees in Multiple Conditions**
```sql
-- Rewrite to avoid OR
SELECT * FROM employees.emp WHERE deptno = 30 OR job = 'SALESMAN';
```

* Active Projects
```sql
-- Rewrite to SARGable
SELECT * FROM employees.emp_projects WHERE YEAR(start_date) = 2024;
```
