/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : DQL - Analytical Functions
*  Author       : Team Tinitiate
*******************************************************************************/



-- Aggregate Functions:
-- All aggregation functions for each department
SELECT  deptno
        ,count(sal) AS count_dept_sal
        ,max(sal) AS max_dept_sal
        ,min(sal) AS min_dept_sal
        ,sum(sal) AS tot_dept_sal
        ,avg(sal) AS avg_dept_sal
FROM  employees.emp e
GROUP BY deptno;

-- All aggregation functions on emp table with respect to every dept 
SELECT  e.*
       ,max(sal) OVER () AS max_sal
       ,max(sal) OVER (PARTITION BY deptno) AS max_dept_sal
       ,min(sal) OVER (PARTITION BY deptno) AS min_dept_sal
       ,sum(sal) OVER (PARTITION BY deptno) AS tot_dept_sal
       ,avg(sal) OVER (PARTITION BY deptno) AS avg_dept_sal
       ,count(1) OVER (PARTITION BY deptno) AS emp_count_by_dept
FROM   employees.emp e;



-- ROW_NUMBER():
-- Assigns a unique integer to each row to establish the row's position within
-- the partition of a result set.
SELECT empno, ename, ROW_NUMBER() OVER (ORDER BY empno) AS row_num
FROM employees.emp;

-- Assigns a unique integer to each row within the partition.
SELECT empno, ename, deptno, ROW_NUMBER() OVER
 (PARTITION BY deptno ORDER BY empno) AS row_num FROM employees.emp;

-- Assigns a unique integer to each row within a partition, based on salary,
-- for each department.
SELECT deptno, ename, sal,
       ROW_NUMBER() OVER (PARTITION BY deptno ORDER BY sal DESC) AS row_num
FROM employees.emp;

-- Find the employee with the highest salary in each department
SELECT deptno, ename, sal
FROM (
    SELECT deptno, ename, sal,
           ROW_NUMBER() OVER (PARTITION BY deptno ORDER BY sal DESC) AS row_num
    FROM employees.emp
) AS ranked
WHERE row_num = 1;

-- Multi-Ordered Row Numbering
SELECT  row_number() OVER (ORDER BY sal)      AS sal_rn_asc,
        row_number() OVER (ORDER BY sal DESC) AS sal_rn_desc,
        row_number() OVER (ORDER BY empno)    AS empno_rn,
        e.*
FROM    employees.emp e
ORDER BY deptno;

-- Multi-Partitioned Row Numbering
SELECT  row_number() OVER (PARTITION BY deptno ORDER BY sal)
         AS sal_rn_asc,
        row_number() OVER (PARTITION BY deptno ORDER BY sal DESC)
         AS sal_rn_desc,
        row_number() OVER (PARTITION BY deptno ORDER BY empno)
         AS empno_rn,
        e.*
FROM    employees.emp e
ORDER BY deptno;



-- RANK():
-- Assigns a unique integer to each distinct row within the partition of a
-- result set, leaving gaps between the ranks if there are ties.
SELECT ename, sal, RANK() OVER (ORDER BY sal DESC) AS rank
FROM employees.emp;

-- Assigns a rank to each employee within their department based on their salary
SELECT deptno, ename, sal,
       RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rank
FROM employees.emp;



-- DENSE_RANK():
-- Assigns a unique integer to each distinct row within the partition of a
-- result set, without gaps in the ranking sequence.
SELECT ename, sal, DENSE_RANK() OVER (ORDER BY sal DESC) AS dense_rank
FROM employees.emp;

-- Assigns a dense rank to each employee within their department based
-- on their salary.
SELECT deptno, ename, sal,
       DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS dense_rank
FROM employees.emp;

-- Multi-functions with Multi-orders example
SELECT  e.*,
        RANK() OVER (ORDER BY sal DESC)       AS rank,
        DENSE_RANK() OVER (ORDER BY sal DESC) AS dense_rank,
        ROW_NUMBER() OVER (ORDER BY sal DESC) AS rn
FROM    employees.emp e;

-- Multi-functions with Multi-Partitions example
SELECT  e.*,
        RANK()       OVER (PARTITION BY deptno ORDER BY sal DESC)       AS rank,
        DENSE_RANK() OVER (PARTITION BY deptno ORDER BY sal DESC) AS dense_rank,
        ROW_NUMBER() OVER (PARTITION BY deptno ORDER BY sal DESC) AS rn
FROM    employees.emp e;



-- NTILE(n):
-- Divides the result set into a specified number of roughly equal
-- groups or "tiles".
SELECT ename, sal, NTILE(4) OVER (ORDER BY sal DESC) AS quartile
FROM employees.emp;

-- Divides employees into quartiles based on their salary within each department
SELECT deptno, ename, sal,
       NTILE(4) OVER (PARTITION BY deptno ORDER BY sal DESC) AS quartile
FROM employees.emp;



-- LAG():
-- Retrieves employee names and salaries, along with the
-- previous salary for each employee.
SELECT ename, sal,
       LAG(sal) OVER (ORDER BY sal) AS prev_sal
FROM employees.emp;

-- Retrieves the previous salary for each employee, ordered by their hire date.
SELECT empno, ename, hiredate, sal,
       LAG(sal) OVER (ORDER BY hiredate) AS prev_sal
FROM employees.emp;



-- LEAD():
-- Retrieves employee names and salaries, along with
-- the next salary for each employee.
SELECT ename, sal,
       LEAD(sal) OVER (ORDER BY sal) AS next_sal
FROM employees.emp;

-- Retrieves the next salary for each employee, ordered by their hire date.
SELECT empno, ename, hiredate, sal,
       LEAD(sal) OVER (ORDER BY hiredate) AS next_sal
FROM employees.emp;

-- Lag and Lead example
SELECT empno, sal,
       LEAD(sal) OVER (ORDER BY sal) AS next_salary,
       LAG(sal) OVER (ORDER BY sal) AS previous_salary
FROM employees.emp;

-- Calculates the difference in salary between an employee and
-- the next and previous employee within each department.
SELECT deptno, ename, sal,
       sal - LAG(sal) OVER (PARTITION BY deptno ORDER BY sal)
        AS sal_diff_with_prev,
       LEAD(sal) OVER (PARTITION BY deptno ORDER BY sal) - sal
        AS sal_diff_with_next
FROM employees.emp;



-- FIRST_VALUE():
-- Retrieves employee names and salaries, along with
-- the first salary in the sorted order.
SELECT ename, sal,
       FIRST_VALUE(sal) OVER (ORDER BY sal) AS first_sal
FROM employees.emp
WHERE sal IS NOT NULL;

-- Finds the first salary for each department and
-- compares it with each employee's salary.
SELECT empno, ename, deptno, sal,
       sal - FIRST_VALUE(sal) OVER (PARTITION BY deptno ORDER BY hiredate)
        AS sal_diff_with_first
FROM employees.emp;



-- LAST_VALUE():
-- Retrieves employee names and salaries,
-- along with the last salary in the sorted order.
SELECT ename, sal,
       LAST_VALUE(sal) OVER (ORDER BY sal
       ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
       AS last_sal
FROM employees.emp;

-- Finds the last salary for each department and
-- compares it with each employee's salary.
SELECT empno, ename, deptno, sal,
       sal - LAST_VALUE(sal) OVER (PARTITION BY deptno ORDER BY
        hiredate ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
         AS sal_diff_with_last
FROM employees.emp;

-- Finds the difference between each employee's salary and
-- the first and last salary within their department.
SELECT deptno, ename, sal,
       sal - FIRST_VALUE(sal) OVER (PARTITION BY deptno ORDER BY sal)
        AS sal_diff_with_first,
       LAST_VALUE(sal) OVER (PARTITION BY deptno ORDER BY
        sal ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) - sal
         AS sal_diff_with_last
FROM employees.emp;
