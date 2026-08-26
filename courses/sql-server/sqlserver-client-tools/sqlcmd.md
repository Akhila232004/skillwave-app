![SQLServer Tinitiate Image](sqlserver.png)

# SQLServer Tutorial

&copy; TINITIATE.COM

* What is SQLCMD?

* Command-line tool to connect to SQL Server and run queries.

* Supports:

  * Running queries directly.
  
  * Running scripts (.sql files).
  
  * Running stored procedures.

* Capturing output into files (good for auditing).

**Lab 1: Run a SQL Script**
```sql
sqlcmd -S localhost -U sa -P tinitiate_01 -d tinitiate ^
-i E:\TinitiateContent\tinitiate-sqlserver\sqlserver-client-tools\sqlcmd_source.sql ^
-o E:\TinitiateContent\tinitiate-sqlserver\sqlserver-client-tools\productsmar30_src_file.txt


-i = input SQL file.

-o = write output to file.
```

**Lab 2: Run a Query Directly**
```sql
sqlcmd -S localhost -U sa -P tinitiate_01 -d tinitiate ^
-Q "SELECT * FROM invoicing.products" ^
-o E:\TinitiateContent\tinitiate-sqlserver\sqlserver-client-tools\productsmar30.txt


-Q = run query and exit.

Captures results into a text file.
```

**Lab 3: Run a Stored Procedure**

```sql

-- Create procedure

CREATE PROCEDURE dbo.add2nums @num1 INT, @num2 INT
AS
BEGIN
    DECLARE @res INT;
    SET @res = @num1 + @num2;
    PRINT 'Result is ' + CAST(@res AS VARCHAR(100));
END;
```
**:: Run stored procedure**
```sql
sqlcmd -S localhost -U sa -P tinitiate_01 -d tinitiate ^
-Q "EXEC dbo.add2nums 10,20" ^
-o E:\TinitiateContent\tinitiate-sqlserver\sqlserver-client-tools\proc_res.txt
```
