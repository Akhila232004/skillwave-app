![Tinitiate SQLSERVER Training](../images/sqlserver.png)

We are declaring and initializing variables, performing a simple addition operation, and then printing and selecting the result. Here's a breakdown of the script

Variable Declaration and Initialization:

@num1 is declared as an integer and initialized to 1.
@num2 is declared as an integer without an initial value.
@res is declared as an integer to store the result of the addition.
Setting Variable Values:

@num2 is set to 20 using the SET statement.
Performing Addition:

The sum of @num1 and @num2 is calculated and stored in @res.
Printing Results:

The script prints the string 'Sum of Num1 and Num2'.
It then prints 'Sum: ' followed by the sum, which is cast to a varchar for concatenation with the string.
The sum is also printed directly as an integer.
Finally, the SELECT statement is used to display the result in the query result window.

```sql

-- T-SQL
-- -----------------------

-- Code blocks
-- -------------------------
begin
    declare @num1 int = 1;  -- Variable = container
    declare @num2 int;
    declare @res int;
    
    -- set @num1 = 10; 
    set @num2 = 20;

    set @res = @num1 + @num2;
    print 'Sum of Num1 and Num2';
    print  'Sum: ' + cast(@res as varchar);
    print  @res;
    select @res;

end;
```

* Below script demonstrates variable declaration, initialization, reassignment, and basic arithmetic operations. Here``s a step-by-step explanation:

**Variable Declaration and Initialization:**

@data1 is declared as an integer and initialized to 1.
@data2 is declared as an integer without an initial value.
Setting Variable Values:

@data2 is set to 10 using the SET statement, and its value is printed, which will be 10.
Reassigning Variable Values:

@data2 is then reassigned to 20, and its new value is printed, which will be 20.
Performing Arithmetic and Printing Results:

The script prints the result of adding 10 to @data2, which will be 30.
It then prints the value of @data2 again, which remains 20, demonstrating that the addition in the previous step did not change the value of @data2.

```sql 
-- Variables Code blocks
-- -------------------------
begin
    declare @data1 int = 1; -- variable declare and initialize
    declare @data2 int;     -- variable declare
    
    set @data2 = 10;  -- variable initialize
    print @data2;  -- 10

    set @data2 = 20;  -- variable re-assign
    print @data2;  -- 20

    print @data2+10; -- 30
    print @data2;    -- 20
end;

```
