![SQL Server Tinitiate Image](../sqlserver-sql/sqlserver.png)

# SQL Server - TSQL Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# Triggers
* A trigger is a special kind of stored procedure that automatically runs (fires) in response to specific database events such as INSERT, UPDATE, or DELETE on a table or view.
* Triggers can be used to enforce business rules, validate data, and perform other actions when data is inserted, updated, or deleted from a table.

### There are two types of triggers in SQL Server:
* **DML triggers** - DML triggers fire in response to changes to data in a table, such as an insert, update, or delete operation. They can be defined to execute either before or after the data modification operation.
* **DDL triggers** - DDL triggers fire in response to changes to the database schema, such as creating or altering tables, views, or stored procedures.

## Create Tables For Trigger Demonstration
```sql
-- Create 'trigger_test' table
CREATE TABLE trigger_test (
     test_id       INT
    ,test_date     DATE
    ,test_string   VARCHAR(1000)
    ,test_decimal  DECIMAL(10,2)
);

-- Create 'trigger_test_mirror' table
CREATE TABLE trigger_test_mirror (
     test_id       INT
    ,test_date     DATE
    ,test_string   VARCHAR(1000)
    ,test_decimal  DECIMAL(10,2)
    ,action_type   VARCHAR(100)
);

-- Create 'trigger_test_log' table
CREATE TABLE trigger_test_log (
     log_id        INT
    ,log_date      DATE
    ,log_message   VARCHAR(1000)
    ,eventval      XML
);
```
## Handling Multiple Rows (Crucial Concept)
Triggers in SQL Server operate on an entire set of rows, not just one at a time. The inserted and deleted virtual tables can contain multiple rows if the triggering statement (e.g., INSERT, UPDATE, or DELETE) affected more than one record. Failing to account for multi-row operations will lead to bugs.

Your examples like UPDATE ... SET test_string = (SELECT UPPER(test_string) FROM inserted) are vulnerable to this. If an INSERT statement adds multiple rows, this code will fail because the subquery (SELECT ... FROM inserted) returns more than one value.

### Example of Multi-Row Safe Code:

The correct way to handle multi-row operations is with a set-based join.

```sql
-- Multi-row safe UPDATE trigger
CREATE OR ALTER TRIGGER trg_multi_row_safe
ON trigger_test
FOR INSERT, UPDATE
AS
BEGIN
  -- Use a set-based UPDATE with a JOIN to handle multiple rows
  UPDATE T
  SET    T.test_string = I.test_string
  FROM   trigger_test AS T
  JOIN   inserted AS I ON T.test_id = I.test_id;
END;
```
-- This will now work correctly

INSERT INTO trigger_test (test_id, test_string) VALUES (10, 'abc'), (11, 'def');
## DML `FOR` Triggers
* A "FOR" trigger is executed before the data modification operation (INSERT, UPDATE, DELETE) takes place.
* It can be used to modify the data to be inserted, updated, or deleted before the operation is carried out. 
* "FOR" triggers are commonly used with views, where the underlying table may not be directly modifiable.
```sql
-- A 'FOR' trigger that modifies data before an 'INSERT' operation is carried out
CREATE TRIGGER trg_for_trigger_test
ON trigger_test
FOR INSERT, UPDATE, DELETE
AS
BEGIN
    -- First check for INSERT
    IF EXISTS (SELECT 1 FROM inserted) AND NOT EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
        SELECT test_id, test_date, test_string, test_decimal, 'INSERT'
        FROM inserted;
    END
    -- Then check for DELETE
    ELSE IF EXISTS (SELECT 1 FROM deleted) AND NOT EXISTS (SELECT 1 FROM inserted)
    BEGIN
        INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
        SELECT test_id, test_date, test_string, test_decimal, 'DELETE'
        FROM deleted;
    END
    -- Finally, UPDATE
    ELSE IF UPDATE(test_date) OR UPDATE(test_string) OR UPDATE(test_decimal)
    BEGIN
        INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
        SELECT test_id, test_date, test_string, test_decimal, 'UPDATE'
        FROM inserted;
    END
END;

-- INSERT TEST
-- --------------------------------------------------------
INSERT INTO trigger_test (test_id, test_date, test_string, test_decimal)
VALUES (1, GETDATE(), 'TEST', 100.2)

SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;

-- UPDATE TEST
-- --------------------------------------------------------
UPDATE trigger_test 
SET    test_date    = GETDATE()+10
WHERE  test_id = 1;

UPDATE trigger_test 
SET    test_decimal = 88.88
WHERE  test_id = 1;

UPDATE trigger_test 
SET    test_string = 'TEST1'
WHERE  test_id = 1;

-- Test Query
SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;

-- DELETE TEST
-- --------------------------------------------------------
DELETE FROM trigger_test where test_id = 1;

-- Test Query
SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;
```
### Trigger to change values
```sql
-- Create TRIGGER with ONLY INSERT handler 
-- --------------------------------------------------------
CREATE OR ALTER trigger trg_for_trigger_test_upper
ON trigger_test
FOR INSERT
AS
BEGIN
  IF (SELECT COUNT(*) FROM inserted) != 0
  BEGIN
    UPDATE trigger_test
    SET    test_string = (SELECT UPPER(test_string) FROM inserted)
    WHERE  test_id     = (SELECT test_id FROM inserted);
  END
END;

-- TEST --
INSERT INTO trigger_test (test_id, test_date, test_string, test_decimal)
VALUES (2, GETDATE(), 'lower', 100.2);

UPDATE trigger_test
SET    test_string = 'abc'
WHERE  test_id = 2;
-- See lower case 'abc' (as trigger doesnt handle updates)
SELECT * FROM trigger_test;

-- Add UPDATE handler to TRIGGER
-- ---------------------------------------------------------
CREATE OR ALTER TRIGGER trg_for_trigger_test_upper
ON trigger_test
FOR INSERT, UPDATE
AS
BEGIN
  IF ((SELECT COUNT(*) FROM inserted) != 0) OR UPDATE(test_string)
  BEGIN
    UPDATE trigger_test
    SET    test_string = (SELECT UPPER(test_string) FROM inserted)
    WHERE  test_id     = (SELECT test_id FROM inserted);
  END
END;

-- TEST --
UPDATE trigger_test
SET    test_string = 'abc'
WHERE  test_id = 2;
-- See upper case 'abc'
SELECT * FROM trigger_test;
```

## DML `AFTER` Triggers
* An `AFTER` trigger, as the name suggests, is executed after the data modification operation is carried out. It can be used to perform additional actions based on the changes made to the table.
* `FOR` or `AFTER`: `AFTER` specifies that the DML trigger is fired only when all operations specified in the triggering SQL statement have executed successfully.
* All referential cascade actions and constraint checks also must succeed before `AFTER` trigger fires.
* AFTER is the default when FOR is the only keyword specified.
* AFTER triggers cannot be defined on views.
```sql
-- Create AFTER trigger
CREATE TRIGGER trg_after_trigger_test
ON trigger_test
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
  IF (SELECT COUNT(*) FROM deleted) = 0
  BEGIN
    INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
    SELECT test_id, test_date, test_string, test_decimal, 'INSERT'
    FROM   inserted;
  END
  ELSE IF (SELECT COUNT(*) FROM inserted) = 0
  BEGIN
    INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
    SELECT test_id, test_date, test_string, test_decimal, 'DELETE'
    FROM   deleted;
  END
  ELSE IF (UPDATE (test_date) OR UPDATE (test_string) OR UPDATE (test_decimal))
  BEGIN
    INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
    SELECT test_id, test_date, test_string, test_decimal, 'UPDATE'
    FROM   inserted;
  END 
END;

-- INSERT TEST
-- --------------------------------------------------------
INSERT INTO trigger_test (test_id, test_date, test_string, test_decimal)
VALUES (1, GETDATE(), 'TEST', 100.2);

-- Test Query
SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;

-- UPDATE TEST
-- --------------------------------------------------------
UPDATE trigger_test 
SET    test_date    = GETDATE()+10
WHERE  test_id = 1;

UPDATE trigger_test 
SET    test_decimal = 88.88
WHERE  test_id = 1;

UPDATE trigger_test 
SET    test_string = 'TEST1'
WHERE  test_id = 1;

-- Test Query
SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;

-- DELETE TEST
-- --------------------------------------------------------
DELETE FROM trigger_test WHERE test_id = 1;

-- Test Query
SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;
```

## DML `INSTEAD OF` Triggers
* `INSTEAD OF` trigger is a type of trigger that can be used to override the default behavior of an insert, update, or delete operation on a view or a table that has an associated `INSTEAD OF` trigger.
* An `INSTEAD OF` trigger is executed instead of the original insert, update, or delete operation and can be used to modify the data being inserted, updated, or deleted, or to perform additional actions.
```sql
-- Create a view
CREATE VIEW vw_trigger_test
AS
SELECT test_id, test_date, test_string, test_decimal
FROM   trigger_test;

CREATE TRIGGER trg_instead_trigger_test
ON vw_trigger_test INSTEAD OF INSERT
AS
BEGIN
  INSERT INTO trigger_test_mirror (test_id, test_date, test_string, test_decimal, action_type)
  SELECT test_id, test_date, UPPER(test_string), test_decimal, 'INSERT'
  FROM   inserted;
END;

-- INSERT TEST
-- --------------------------------------------------------
INSERT INTO vw_trigger_test (test_id, test_date, test_string, test_decimal)
VALUES (3, GETDATE(), 'NEW LINE', 100.2)

SELECT * FROM trigger_test;
SELECT * FROM trigger_test_mirror;
```
### `INSTEAD OF` on table
```sql
CREATE OR ALTER trigger trg_instead_trigger_test_upper
ON trigger_test
INSTEAD OF INSERT
AS
BEGIN
  IF (SELECT COUNT (*) FROM inserted) != 0
  BEGIN
    INSERT INTO trigger_test
    SELECT test_id, test_date, UPPER(test_string), test_decimal
    FROM   inserted;
  END
END

-- TEST --
INSERT INTO trigger_test (test_id, test_date, test_string, test_decimal)
VALUES (2, GETDATE(), 'lower', 100.2);

UPDATE trigger_test
SET    test_string = 'abc'
WHERE  test_id = 2;
-- See lower case 'abc' (as trigger doesnt handle updates)
SELECT * FROM trigger_test;
```

## DDL Triggers
* DDL (Data Definition Language) trigger is a type of trigger that fires in response to a variety of DDL events that occur in the database.
* DDL events include events like creating or altering tables, indexes, views, stored procedures, and user-defined functions.
* DDL triggers can be useful for enforcing business rules or data integrity constraints, for auditing database changes, or for implementing custom security policies.
```sql
-- Create a trigger on the database
CREATE TRIGGER trg_tinitiate_ddl
ON DATABASE
FOR create_table, alter_table, drop_table
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO trigger_test_log (log_id, log_date, log_message, eventval)
  VALUES (1, GETDATE(), 'DDL EVENT', EVENTDATA());
END;

-- Test DDL Trigger
CREATE TABLE test1 (id INT);
DROP TABLE test1;
SELECT * FROM trigger_test_log;
```

## Enable / Disable Trigger
* To enable a disabled trigger, you can use the `ENABLE TRIGGER` statement with the same syntax as above. Once a trigger is enabled, it becomes active again and will fire when the corresponding event occurs.
* It's important to note that disabling a trigger affects all users who access the table, not just the user who issued the `DISABLE TRIGGER` statement.
* Also, if a trigger is disabled, any pending trigger actions will not be executed, even after the trigger is re-enabled. So, it's important to ensure that you re-enable the trigger as soon as possible after you've finished the maintenance operation.
```sql
ENABLE TRIGGER dbo.trg_instead_trigger_test ON dbo.vw_trigger_test;
DISABLE TRIGGER dbo.trg_instead_trigger_test ON dbo.vw_trigger_test;

ENABLE TRIGGER ALL ON dbo.trigger_test;
DISABLE TRIGGER ALL ON dbo.trigger_test;

-- Drop DB triggers
DROP TRIGGER trg_tinitiate_ddl ON DATABASE;  
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
