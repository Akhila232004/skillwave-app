/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Triggers
*  Author       : Team Tinitiate
*******************************************************************************/



-- Create Tables For Trigger Demonstration:
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



-- DML `FOR` Triggers:
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



-- Trigger to change values:
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



-- DML `AFTER` Triggers:
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



-- DML `INSTEAD OF` Triggers:
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



-- `INSTEAD OF` on table:
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



-- DDL Triggers:
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



-- Enable / Disable Trigger:
ENABLE TRIGGER dbo.trg_instead_trigger_test ON dbo.vw_trigger_test;
DISABLE TRIGGER dbo.trg_instead_trigger_test ON dbo.vw_trigger_test;

ENABLE TRIGGER ALL ON dbo.trigger_test;
DISABLE TRIGGER ALL ON dbo.trigger_test;

-- Drop DB triggers
DROP TRIGGER trg_tinitiate_ddl ON DATABASE; 
