![SQLServer Tinitiate Image](sqlserver.png)


## To DOs
* Create 6 tables,
   * **No Indexes**
   * <table_small>_no_index small (100 rows)
   * <table_medium>_no_index small (100k rows)
   * <table_large>_no_index small (1m rows)
   * **Indexes only on PK/FK**
   * <table_small>_index small (100 rows)
   * <table_medium>_index small (100k rows)
   * <table_large>_index small (1m rows)
   * **Indexes on PK/FK and Filter/Aggregate columns**
   * <table_small>_index small (100 rows)
   * <table_medium>_index small (100k rows)
   * <table_large>_index small (1m rows)
   
   
# SQLServer Tutorial

&copy; TINITIATE.COM

## CONTEXT
# SQL Server Performance Tuning – Training Program

## Welcome to the **SQL Server Performance Tuning Training**!  

Performance tuning is one of the most critical skills for a database professional. Even the best-designed applications can suffer from slow queries, blocking, and inefficient resource usage if the database layer is not optimized.

In this training, we focus on:

•	Understanding how SQL Server works internally – how queries are parsed, optimized, and executed.

•	Identifying performance bottlenecks using execution plans, statistics, and monitoring tools.

•	Applying tuning techniques such as indexing strategies, query rewrites, and configuration adjustments.

•	Troubleshooting real-world issues like blocking, deadlocks, and slow-running queries.

•	Building best practices for long-term performance and scalability.

### Why Learn Performance Tuning?

•	🕒 Save time – Queries that take minutes can often be tuned to run in seconds.

•	💰 Save costs – Optimized databases require fewer hardware resources.

•	🚀 Improve scalability – Applications can handle more users and more data.

•	🔍 Gain deeper insight – Learn how SQL Server makes decisions behind the scenes.

•	🎯 Boost your career – Performance tuning is one of the most in-demand skills for DBAs and developers.

## What You’ll Get From This Training

•	Hands-on practice with real-world tuning scenarios.

•	The ability to read and understand execution plans.

•	Knowledge of when and how to use indexes effectively.

•	Skills to optimize queries and database design.

•	Confidence in using SQL Server tools (DMVs, Query Store, Profiler, Extended Events) to monitor and troubleshoot issues.

---

### [Introduction & Performance Fundamentals](Introductions.md)  
- SQL Server query processing lifecycle  
- Execution plans (estimated vs. actual)  
- Role of statistics in query performance  
- Identifying performance bottlenecks  

### [Indexing Strategies ](Indexing-Strategies.md) 
- Clustered vs. Non-clustered indexes  
- Covering and filtered indexes  
- Columnstore indexes  
- Index fragmentation & maintenance  

### [Query Optimization Techniques](Query-Optimization.md)  
- Writing SARGable queries  
- Avoiding SELECT * and implicit conversions  
- Parameter sniffing issues  
- Temp tables vs. table variables  
- Common query anti-patterns  

### [Monitoring & Troubleshooting](Monitoring-troubleshooting.md)  
- SQL Profiler & Extended Events  
- Using DMVs for performance tuning  
- Query Store basics  
- Deadlocks & blocking  
- Wait statistics  

### [Advanced Tuning & Best Practices](sqlserver-advanced-tuning.md)  
- Table partitioning  
- Parallelism (MAXDOP, cost threshold tuning)  
- TempDB optimization  
- Adaptive query processing (SQL Server 2017+)  
- Best practices for performance baselining  


***
| &copy; TINITIATE.COM |
|----------------------|
