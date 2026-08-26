![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Database, Schema, and User
* In SQL Server, a **database** represents a structured and organized collection of data.
* A **schema** acts as a logical container used to group related database objects such as tables, views, and stored procedures.
* A **user** refers to an identity that holds permission to interact with databases and access objects based on assigned roles.

* To summarize:
    * The SQL Server application instance is referred to as the **instance**.
    * An instance can host **multiple databases**.
    * Each database contains **schemas**, which are logical groupings of related objects.
    * **Users** can be created to access these schemas and their contents.

## Database:
* A database in SQL Server organizes and stores data for efficient access, management, and retrieval.
* It contains core objects like tables, views, and stored procedures that define how the data is structured.
* You can create multiple databases under a single SQL Server instance to manage separate data environments.
```sql
-- Create database tinitiate
CREATE DATABASE tinitiate;
-- SQL Server commands are generally case-insensitive
-- We can use uppercase or lowercase or mix of both for commands
-- But for best practice stick to any one format
```
## User:
* Users in SQL Server are login identities with permissions to interact with database objects.
* Each user can be granted specific rights within a schema to access, modify, or manage data based on security roles.
```sql
-- Step 1:
-- Use the Database where you want to create the USER
USE tinitiate;

-- Step 2:
-- Enable contained database authentication
EXEC sp_configure 'contained database authentication', 1;

-- Step 3:
-- Reconfigure the database to apply the configuration change
RECONFIGURE;

-- Step 4:
-- Set the database containment to partial to allow contained database users
ALTER DATABASE [tinitiate] SET CONTAINMENT = PARTIAL;
-- Allows the use of contained database users, which do not require server logins

-- Step 5:
-- Create a user named 'tiuser' with the password 'Tinitiate!23'
CREATE USER tiuser WITH PASSWORD = 'Tinitiate!23';
-- Create a user named 'developer' with the password 'Tinitiate!23'
CREATE USER developer WITH PASSWORD = 'Tinitiate!23';
```
## Schema:
* A schema in SQL Server is a logical namespace within a database to help organize objects efficiently.
* Schemas make it easier to manage permissions, object naming, and grouping.
```sql
-- Use the Database where you want to create the SCHEMA
USE tinitiate;

-- Create the schema
CREATE SCHEMA employees AUTHORIZATION dbo;
-- Here schema is created with the authorization set to database owner(dbo).
-- We can create schema without authorization also, 'CREATE SCHEMA employees;'

-- Change the authorization of the schema to tiuser
ALTER AUTHORIZATION ON SCHEMA::employees TO tiuser;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
