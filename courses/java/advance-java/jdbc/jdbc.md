# Java JDBC (Java Database Connectivity)

## 1. What Is JDBC?

JDBC (Java Database Connectivity) is a Java API that allows Java programs to **connect to databases**, **send SQL queries**, and **retrieve results**.
It acts as a **bridge between Java applications and database systems**.

JDBC enables a Java program to:

* Establish a connection to a database
* Execute SQL commands (SELECT, INSERT, UPDATE, DELETE)
* Read data returned by the database
* Update or modify database tables
* Handle transactions
* Call stored procedures

All JDBC classes are available inside:

```java
import java.sql.*;
```

## 2. Why Do We Need JDBC?

Before JDBC, every database required its own separate communication system.
JDBC provides **a common standard** so Java can communicate with any database (MySQL, Oracle, PostgreSQL, SQL Server, etc.) using the same API.

JDBC makes database programming:

* Consistent
* Database-independent
* Secure
* Easy to maintain

## 3. JDBC Driver

A JDBC Driver is software provided by a database vendor that allows Java to talk to their database.

Examples:

* MySQL driver → `com.mysql.cj.jdbc.Driver`
* Oracle driver → `oracle.jdbc.OracleDriver`
* PostgreSQL driver → `org.postgresql.Driver`
* SQL Server driver → `com.microsoft.sqlserver.jdbc.SQLServerDriver`

The driver translates Java JDBC calls into database-specific commands.

## 4. The JDBC Architecture

JDBC follows a **standard workflow**:

1. Load/Register the driver
2. Establish connection
3. Create a statement
4. Execute SQL
5. Process results (only for SELECT)
6. Close connection

These 6 steps are the foundation of all JDBC programs.-

## 5. JDBC API Main Interfaces

JDBC includes several important interfaces:

### 1. DriverManager

Responsible for loading the driver and giving a connection.

### 2. Connection

Represents a connection session between Java and the database.

### 3. Statement / PreparedStatement / CallableStatement

Used to send SQL to the database.

### 4. ResultSet

Represents the data returned by a SELECT query.

# 6. Step-by-Step JDBC Operations 

## Step 1: Loading/Registering the JDBC Driver

Theory:
The driver must be loaded so Java knows which database to communicate with.
Older JDBC versions required explicit loading using `Class.forName()`, but modern versions load automatically.

Syntax:

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```JdbcPreparedStatementInsertExample 
## Step 2: Establishing Database Connection

Theory:
After loading the driver, Java must open a link to the database.
DriverManager manages this and returns a `Connection` object.

Syntax:

```java
Connection con = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/testdb",
    "root",
    "password"
);
```

A successful connection means Java can now send SQL to the database.

## Step 3: Creating a Statement

Theory:
A Statement object is used to send SQL queries to the database.
There are 3 types:

### a) Statement

Used for simple static SQL (not recommended for user input).

### b) PreparedStatement

Pre-compiled SQL, faster and safer (recommended).

### c) CallableStatement

Used for stored procedures.

Syntax:

```java
Statement stmt = con.createStatement();
PreparedStatement ps = con.prepareStatement("SELECT * FROM student WHERE id=?");
CallableStatement cs = con.prepareCall("{call getData(?)}");
```

---

## Step 4: Executing SQL Queries

Theory:
SQL queries fall into two categories:

### 1. SELECT → returns ResultSet

### 2. INSERT / UPDATE / DELETE → returns number of affected rows

Syntax:

```java
ResultSet rs = stmt.executeQuery("SELECT * FROM student");
int rows = stmt.executeUpdate("DELETE FROM student WHERE id=10");
```

## Step 5: Processing Data Using ResultSet

Theory:
A ResultSet is a cursor pointing to the returned rows.
`rs.next()` moves to the next row.
Each column is accessed using get methods (`getInt`, `getString`, etc.).

Syntax:

```java
while (rs.next()) {
    int id = rs.getInt("id");
    String name = rs.getString("name");
}
```
## Step 6: Closing Resources

Theory:
Connections consume memory.
Properly close:

* ResultSet
* Statement
* Connection

Syntax:

```java
rs.close();
stmt.close();
con.close();
```
# 7. JDBC Example

(Full example combining all steps)

```java
import java.sql.*;

public class JdbcExample {
    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");  

            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/testdb",
                "root",
                "password"
            );

            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM employee");

            while (rs.next()) {
                System.out.println(rs.getInt("id") + " - " + rs.getString("name"));
            }

            rs.close();
            stmt.close();
            con.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

# 8. PreparedStatement 

PreparedStatement is:

* **Precompiled SQL**
* **Faster**
* **Prevents SQL Injection**
* **Recommended for real projects**

Used when SQL requires parameters.

## Example

```java
PreparedStatement ps = con.prepareStatement(
    "INSERT INTO employee(name, salary) VALUES(?, ?)"
);

ps.setString(1, "Ravi");
ps.setInt(2, 30000);

ps.executeUpdate();
```

# 9. CallableStatement (Stored Procedures)

CallableStatement is used to call stored procedures on the database server.
Useful for:

* Business logic inside DB
* Complex operations
* Reusable SQL blocks

## Syntax

```java
CallableStatement cs = con.prepareCall("{call getSalary(?)}");
cs.setInt(1, 101);

ResultSet rs = cs.executeQuery();
```

# 10. JDBC Transaction Management

Sometimes multiple SQL queries must run as **one unit**.
If any query fails → rollback
If all succeed → commit

Used for:

* Banking money transfer
* Booking systems
* Multi-table updates

## Syntax

```java
con.setAutoCommit(false);  // start transaction

PreparedStatement ps1 = con.prepareStatement("UPDATE accounts SET balance = balance - 500 WHERE id=1");
PreparedStatement ps2 = con.prepareStatement("UPDATE accounts SET balance = balance + 500 WHERE id=2");

ps1.executeUpdate();
ps2.executeUpdate();

con.commit();   // all successful
```

Rollback:

```java
con.rollback();
```


# 11. JDBC Exception Handling

SQLExceptions provide information about:

* What error occurred
* Database error codes
* SQL state

Syntax:

```java
catch (SQLException e) {
    System.out.println(e.getMessage());
    System.out.println(e.getErrorCode());
    System.out.println(e.getSQLState());
}
```

# 12. ResultSet Types & Concurrency 

ResultSet types define how you navigate:

### 1. TYPE_FORWARD_ONLY

Only forward movement.

### 2. TYPE_SCROLL_INSENSITIVE

Can scroll (previous, absolute) but does not reflect DB changes.

### 3. TYPE_SCROLL_SENSITIVE

Reflects database changes while cursor is open.

Concurrency modes:

* CONCUR_READ_ONLY → cannot update rows
* CONCUR_UPDATABLE → can update ResultSet

# 13. Batch Processing

Batch processing allows multiple SQL queries to be executed together.
Improves performance.

Syntax:

```java
Statement stmt = con.createStatement();
stmt.addBatch("INSERT INTO emp VALUES(1, 'A')");
stmt.addBatch("INSERT INTO emp VALUES(2, 'B')");
stmt.executeBatch();
```

# 14. JDBC Best Practices 

* Always close DB resources
* Prefer PreparedStatement
* Use transactions for critical tasks
* Avoid building SQL manually
* Use connection pooling for real applications

