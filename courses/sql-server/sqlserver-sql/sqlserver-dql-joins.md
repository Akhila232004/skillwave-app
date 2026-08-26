![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins
* A join in SQL is used to combine rows from two or more tables based on a related column between them.
* The related column is typically a foreign key in one table that references the primary key in another table.
* Joins allow you to retrieve data from multiple tables in a single query, enabling you to correlate data from different sources.

## Joins in SQL Server:
### INNER JOIN:

* An INNER JOIN returns rows from both tables where there is a match based on the join condition.
* If there is no match between the tables, the rows are not included in the result set.
  
<img width="174" height="161" alt="image" src="https://github.com/user-attachments/assets/290d2989-0ec4-4997-9702-ec2e36146b71" />

```sql
-- Retrieve employee information along with their department names
SELECT e.*, d.dname
FROM employees.emp e
INNER JOIN employees.dept d ON e.deptno = d.deptno;
```
<img width="424" height="90" alt="image" src="https://github.com/user-attachments/assets/086d05ce-12fd-4fbf-a1ae-b32008755562" />


### LEFT JOIN (or LEFT OUTER JOIN):

* A LEFT JOIN returns all rows from the left table (the first table in the JOIN clause) and the matched rows from the right table.
* If there is no match for a row in the left table, NULL values are filled in for the columns of the right table.

<img width="171" height="175" alt="image" src="https://github.com/user-attachments/assets/b45edb73-874b-4749-9480-5a401402ea10" />

```sql
-- Retrieve all employees along with their department names,
-- including employees without a department
SELECT e.*, d.dname
FROM employees.emp e
LEFT JOIN employees.dept d ON e.deptno = d.deptno;
```

<img width="425" height="101" alt="image" src="https://github.com/user-attachments/assets/ef1e2924-cf65-4032-a87b-4a9773eaf172" />


### RIGHT JOIN (or RIGHT OUTER JOIN):

* A RIGHT JOIN returns all rows from the right table (the second table in the JOIN clause) and the matched rows from the left table.
* If there is no match for a row in the right table, NULL values are filled in for the columns of the left table.
<img width="171" height="183" alt="image" src="https://github.com/user-attachments/assets/e646dbd4-b848-4a49-b347-5eeeea5fc842" />

```sql
-- Retrieve all departments along with their employees,
-- including departments without employees
SELECT e.*, d.dname
FROM employees.emp e
RIGHT JOIN employees.dept d ON e.deptno = d.deptno;
```
<img width="420" height="103" alt="image" src="https://github.com/user-attachments/assets/2dfdeaaa-bbca-4429-aac8-92a1b607df2a" />


### FULL JOIN (or FULL OUTER JOIN):

* A FULL JOIN returns all rows from both tables, including rows where there is no match based on the join condition.
* If a row in one table has no matching row in the other table, NULL values are filled in for the columns of the table without a match.

<img width="173" height="169" alt="image" src="https://github.com/user-attachments/assets/e2e7c25e-653f-4977-9ac9-ce5339da0363" />

```sql
-- Retrieve all employees and departments,
-- including those without a match in the other table
SELECT e.*, d.dname
FROM employees.emp e
FULL JOIN employees.dept d ON e.deptno = d.deptno;
```

<img width="416" height="113" alt="image" src="https://github.com/user-attachments/assets/bfab16a3-7127-40ce-9494-a59407e17fe3" />


### CROSS JOIN:
* A CROSS JOIN, also known as a Cartesian join, is a join operation that returns the Cartesian product of the two tables involved.
* In other words, it generates all possible combinations of rows from the tables without any condition or predicate.
* Each row from the first table is combined with every row from the second table

<img width="227" height="152" alt="image" src="https://github.com/user-attachments/assets/c8b1b46e-0bb2-48ef-a46a-d0aa8497c840" />

```sql
-- Retrieve all possible combinations of emp and dept tables
SELECT e.*, d.*
FROM employees.emp e
CROSS JOIN employees.dept d;
```



##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
