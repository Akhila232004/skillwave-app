![SQL Server Tinitiate Image](sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# SQL Server Data Types
* SQL Server provides a variety of data types, each with unique strengths and limitations.

## Commonly used data types in SQL Server:
* **Numeric** data types are used to store numbers. There are several different numeric data types available, each with its own range and precision. The most common numeric data types are:

    * **INT** - Stores whole numbers from -2147483648 to 2147483647. 
        * **Example:** `quantity INT`.

    * **BIGINT** - Stores whole numbers from -9223372036854775808 to 9223372036854775807. 
        * **Example:** `employee_id BIGINT`.
    * **DECIMAL** - Stores numbers with a fixed number of decimal places. For example, DECIMAL(5,2) can store numbers from -9999.99 to 9999.99. 
        * **Example:** `price DECIMAL(10,2)`.
    * **NUMERIC** - Stores numbers with a variable number of decimal places. 
        * **Example:** `quantity NUMERIC(7,2)`.
    * **FLOAT** - Stores floating-point numbers.
        * **Example:** `temperature FLOAT`.

* **Date and Time** data types are used to store dates and times. The most common date and time data types are:
    * **DATE** - Stores a date in the format YYYY-MM-DD. 
        * **Example:** `birthdate DATE`.

    * **DATETIME** - Stores a date and time without timezone in the format YYYY-MM-DD HH:MM:SS. 
        * **Example:** `created_at DATETIME`.
    * **SMALLDATETIME** - Stores a date and time in the format YYYY-MM-DD HH:MM.
        * **Example:** `order_date SMALLDATETIME`.
    * **DATETIMEOFFSET** - Stores a date and time with timezone in the format YYYY-MM-DD HH:MM:SS+TZ. 
        * **Example:** `updated_at DATETIMEOFFSET`.
    * **TIME** - Stores a time of day. 
        * **Example:** `appointment_time TIME`.
    * **DATETIME2** - Stores a date and time with more precision than DATETIME.
        * **Example:** `timestamp DATETIME2`.
* **String** data types are used to store text. The most common string data types are:
    * **CHAR(n)** - Stores a fixed-length string of length n. 
        * **Example:** `country_code CHAR(2)`.

    * **VARCHAR(n)** - Stores a variable-length string with a maximum length of n. 
        * **Example:** `name VARCHAR(50)`.
    * **TEXT** - Stores variable-length strings without any length limit. 
        * **Example:** `description TEXT`.
* **Binary** data types are used to store binary data, such as images or files.
    * **BINARY** - Stores a fixed-length binary string.
        * **Example:** `binary_data BINARY(10)`.
    * **VARBINARY** - Stores binary data in variable-length format. 
        * **Example:** `image VARBINARY(MAX)`.
* **Additional Data types** include:
    * **XML** - Stores XML data. 
        * **Example:** `document XML`.
    
    * **UNIQUEIDENTIFIER** - Stores a globally unique identifier. 
        * **Example:** `session_id UNIQUEIDENTIFIER`.
    * **BIT** - Stores true or false values(Boolean - 0 or 1). 
        * **Example:** `is_active BIT`.
    * **MONEY** - Stores monetary values. 
        * **Example:** `salary MONEY`.
    * **SMALLMONEY** - Stores monetary values with less precision than MONEY.
        * **Example:** `total SMALLMONEY`.
    * **GEOGRAPHY** - Stores geographic data.
        * **Example:** `location GEOGRAPHY`.
    * **GEOMETRY** - Stores geometric data.
        * **Example:** `shape GEOMETRY`.
    * **HIERARCHYID** - Stores a hierarchical data, like organization structures.
        * **Example:** `node_hierarchy HIERARCHYID`.
    * **ROWVERSION** - Stores a unique binary number for versioning rows.
        * **Example:** `row_version ROWVERSION`.
    * **CURSOR** - Stores a cursor which is used to reference a cursor object for row-by-row operations.
        * **Example:** `cursor_data CURSOR`.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
