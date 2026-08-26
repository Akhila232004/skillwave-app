![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Date Functions
* Date functions in SQL Server are used to perform various operations on date and timestamp data stored in the database.
* They allow for manipulation, extraction, formatting, and calculation of dates and times.

## Date functions in SQL Server:
### Current Date and time (GETDATE):
* Returns the current date and time.
```sql
-- Retrieve the current date and time
SELECT GETDATE();
```
### Date Part Function (DATEPART):
* Returns a specific component (such as year, month, day) from a date or timestamp.
```sql
-- Retrieve the day of the month from the 'hiredate' column
SELECT DATEPART(DAY, hiredate) FROM employees.emp;
```
### Date Difference Function (DATEDIFF):
* Calculates the difference between a date or timestamp and the current date or timestamp, returning the result as an interval.
```sql
-- Calculate the age of each employee based on their 'hiredate'
SELECT DATEDIFF(YEAR, hiredate, GETDATE()) FROM employees.emp;
```
### Date Addition/Subtraction:
* Adds or subtracts a specified interval (such as days, months) from a date or timestamp.
```sql
-- Add a specific number of days from a date
SELECT DATEADD(DAY, 7, hiredate) FROM employees.emp;

-- Subtract 6 months from the 'hiredate' column in the employees table
SELECT DATEADD(MONTH, -6, hiredate) FROM employees.emp;
```
### Date Formatting (FORMAT):
* Formats a date or timestamp according to a specified format.
```sql
-- Format the 'hiredate' column in a specific date format
SELECT FORMAT(hiredate, 'yyyy-MM-dd') FROM employees.emp;
SELECT FORMAT(hiredate, 'yyyy-dd-MM') FROM employees.emp;
SELECT FORMAT(hiredate, 'dd-MM-yyyy') FROM employees.emp;
SELECT FORMAT(hiredate, 'MM-dd-yyyy') FROM employees.emp;
SELECT FORMAT(hiredate, 'MM-yyyy-dd') FROM employees.emp;
SELECT FORMAT(hiredate, 'dd-yyyy-MM') FROM employees.emp;
```
### Weekday Function (DATEPART):
* Returns the day of the week (0 for Sunday, 1 for Monday, etc.) from a date or timestamp.
```sql
-- Retrieve the day of the week (1 for Sunday, 2 for Monday, etc.) from
-- the 'hiredate' column
SELECT DATEPART(WEEKDAY, hiredate) FROM employees.emp;
```
### Date to String (Various formats):
* You can convert a date to a string in various formats using the `CONVERT(arg1, arg2, arg3)` function.
* You can replace the first argument with datatype, second argument(arg2) with date column name or a specific date value you want to convert and the third argument(arg3) specifies the format code.
```sql
-- YYYY-MM-DD:
SELECT empno, ename, CONVERT(varchar, hiredate, 23) AS hiredate
FROM employees.emp;

-- MM/DD/YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 101) AS hiredate
FROM employees.emp;

-- DD/MM/YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 103) AS hiredate
FROM employees.emp;

-- Mon DD, YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 107) AS hiredate
FROM employees.emp;

-- YYYYMMDD:
SELECT empno, ename, CONVERT(varchar, hiredate, 112) AS hiredate
FROM employees.emp;

-- DD-MM-YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 105) AS hiredate
FROM employees.emp;

-- YYYY/MM/DD:
SELECT empno, ename, CONVERT(varchar, hiredate, 111) AS hiredate
FROM employees.emp;

-- DD MMM YYYY:
SELECT empno, ename, CONVERT(varchar, hiredate, 106) AS hiredate
FROM employees.emp;
```
### DateTime to String (Various formats):
* To convert a datetime to a string in various formats in SQL Server, you can use the `CONVERT(arg1, arg2, arg3)` function, same like date to a string but with different format codes.
```sql
-- YYYY-MM-DD HH:MI:SS:
SELECT empno, ename, CONVERT(varchar, hiredate, 120) AS hiredate
FROM employees.emp;
-- hiredata doesn't have time inserts, so time won't show up
-- Using GETDATE()
SELECT CONVERT(varchar, GETDATE(), 120) AS datetimetostring;

-- YYYY-MM-DD HH:MI:SS:MMM:
SELECT CONVERT(varchar, GETDATE(), 121) AS datetimetostring;

-- DD Mon YYYY HH:MI:SS:MMM:
SELECT CONVERT(varchar, GETDATE(), 113) AS datetimetostring;

-- Mon DD YYYY HH:MI:SS:MMMAM (or PM):
SELECT CONVERT(varchar, GETDATE(), 109) AS datetimetostring;
```
### String to Date (Various formats):
* You can convert a string in various formats to a date using the `CONVERT(date, arg2, arg3)` function.
* Replace the second argument(arg2) in the CONVERT function with the string you want to convert and the third argument with the format code that matches the format of your string.
```sql
-- YYYY-MM-DD:
SELECT CONVERT(date, '2023-04-15', 23) AS date;

-- MM/DD/YYYY:
SELECT CONVERT(date, '04/15/2023', 101) AS date;

-- DD.MM.YYYY:
SELECT CONVERT(date, '15.04.2023', 104) AS date;

-- Mon DD, YYYY:
SELECT CONVERT(date, 'Apr 15, 2023', 107) AS date;

-- YYYYMMDD:
SELECT CONVERT(date, '20230415', 112) AS date;
```
### String to DateTime (Various formats):
* You can convert a string in various formats to a datetime using the `CONVERT(datetime, arg2, arg3)` function, same like string to date but with different format codes.
```sql
-- YYYY-MM-DD HH:MI:SS:
SELECT CONVERT(datetime, '2023-04-15 13:30:45', 120) AS datetime;

-- MM/DD/YYYY HH:MI:SS:
SELECT CONVERT(datetime, '04/15/2023 13:30:45', 101) AS datetime;

-- DD.MM.YYYY HH:MI:SS:
SELECT CONVERT(datetime, '15.04.2023 13:30:45', 104) AS datetime;

-- Mon DD YYYY HH:MI:SS:MMM:
SELECT CONVERT(datetime, 'Apr 15 2023 01:30:45:375', 109) AS datetime;

-- YYYYMMDD HH:MI:SS:
SELECT CONVERT(datetime, '20230415 13:30:45', 112) AS datetime;
```
### DateTime and TimeZone:
#### Date, Timezones, UTC, and Offsets:
* **Date and Time**: In computing, dates and times are represented using various data types. A common approach is to use a datetime data type that includes both date and time information.
* **Timezones**: Timezones are regions of the Earth that have the same standard time. Each timezone is usually offset from Coordinated Universal Time (UTC) by a certain number of hours and minutes. For example, Eastern Standard Time (EST) is UTC-5, meaning it is 5 hours behind UTC.
* **UTC**: Coordinated Universal Time (UTC) is the primary time standard by which the world regulates clocks and time. It is not adjusted for daylight saving time. UTC is often used as a reference point for converting between different timezones.
* **Offsets**: An offset is the difference in time between a specific timezone and UTC. It is usually expressed as a positive or negative number of hours and minutes. For example, UTC+2 means the timezone is 2 hours ahead of UTC, while UTC-8 means the timezone is 8 hours behind UTC.
* **Applying an Offset to a Date Datatype Column**: To apply an offset to a date datatype column in SQL Server, you can use the DATEADD function to add or subtract a specific number of hours to/from the column value. For example, to add 5 hours to a datetime column named my_datetime_column or for GETDATE() function, you can use the following query:
```sql
-- This query will return the value of GETDATE() time adjusted by 5 hours. 
SELECT DATEADD(HOUR, 5, CAST(GETDATE() AS DATETIME)) AS adjusted_datetime;
```

#### Cast a DateTime to DateTime with Timezone (in UTC, EST and IST TimeZones):
* Create a date time variable and cast it as a DateTime with TimeZone data type
* Here we cast it at different TimeZones (UTC, EST and IST)
```sql
SELECT 
    '2024-04-17 15:30:00' AS OriginalDateTime,
    (CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC') AS UTCDateTime,
    SWITCHOFFSET(CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC', DATEPART(TZOFFSET, SYSDATETIMEOFFSET() AT TIME ZONE 'Eastern Standard Time')) AS ESTDateTime,
    SWITCHOFFSET(CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC', DATEPART(TZOFFSET, SYSDATETIMEOFFSET() AT TIME ZONE 'India Standard Time')) AS ISTDateTime;
```
#### Cast a DateTime Timezone to another TimeZone:
```sql
SELECT 
    'UTCDateTime: ' + CONVERT(VARCHAR, '2024-04-17 15:30:00', 120) AS UTCDateTime,
    'ESTDateTime: ' + CONVERT(VARCHAR, 
        CAST(CAST('2024-04-17 15:30:00' AS DATETIME) AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time' AS DATETIME), 
        120) AS ESTDateTime;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
