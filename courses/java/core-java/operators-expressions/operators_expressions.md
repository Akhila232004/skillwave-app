# Java Expressions and Operators

## Expression:
An expression is a combination of variables, constants, and operators that produces a result.
```java
Example:

int sum = a + b * c;
```

Here, a + b * c is an expression.

## Operator:
An operator is a symbol that performs an operation on one or more operands.
```
Example: +, -, *, /, >, <, &&, =, etc.
```
##  Arithmetic Operators
Arithmetic operators are used to perform basic mathematical operations.

| Operator	|Description	|Example	|Result |
|-----------|---------------|-----------|-------|
| + |	Addition     |  10 + 5    | 15 |
| - | Subtraction    |  10 - 5	  | 5  |
| *	| Multiplication |	10 * 5    |	50 |
| /	| Division	     |  10 / 5	  | 2  |
| % | Modulus (Remainder) |	10 % 3 | 1 |

```java
Example Program:

int a = 10, b = 3;

System.out.println("Addition: " + (a + b));        // Addition: 13
System.out.println("Subtraction: " + (a - b));     // Subtraction: 7
System.out.println("Multiplication: " + (a * b));  // Multiplication: 30
System.out.println("Division: " + (a / b));        // Division: 3
System.out.println("Remainder: " + (a % b));       // Remainder: 1
```
## Relational (Comparison) Operators

Relational operators are used to compare two values.
The result is always true or false.

Operator	| Meaning	   |    Example	  |  Result |
|-----------|--------------|--------------|---------|
| ==	    | Equal to	   |    5 == 5	  |  true   |
| !=        | Not equal to |	5 != 3	  |  true   |
| >	        | Greater than |	10 > 5	  |  true   |
| <	        | Less than	   |    2 < 8	  |  true   |
| >=	    | Greater than  or equal to  |	10 >= 10| true   | 
| <=	    |Less than or equal to |	4 <= 6	| true  |

``` java
Example Program:

int x = 10, y = 20;
System.out.println(x > y);   // false
System.out.println(x < y);   // true
System.out.println(x == y);  // false
System.out.println(x != y);  // true
```
## Logical Operators

Logical operators are used to combine two or more conditions.
They are mostly used with relational operators.

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| &&       | Logical AND — true only if both conditions are true | (a > b) && (a > c) | true if both are true |
| \|\|     | Logical OR — true if any one condition is true | (a > b) \|\| (a > c) | true if at least one is true |
| !        | Logical NOT — reverses the result | !(a > b) | true if (a > b) is false |


```java
Example Program:

int a = 10, b = 5, c = 20;

System.out.println((a > b) && (a < c)); // true
System.out.println((a > b) || (a > c)); // true
System.out.println(!(a > b));           // false
```
## Assignment Operators

Assignment operators are used to assign values to variables.
They can also perform arithmetic operations and assignment together.

Operator	| Example	| Equivalent To |	Meaning  |
|-----------|-----------|---------------|------------|
| =         |	a = b	|               |  Assign value of b to a |
| +=	    |   a += b	|  a = a + b	|  Add and assign         |
| -=	    |   a -= b	|  a = a - b	|  Subtract and assign    |
| *=        |   a *= b	|  a = a * b	|  Multiply and assign    |
| /=	    |   a /= b	|  a = a / b    |  Divide and assign      |
| %=	    |   a %= b  |  a = a % b	|  Modulus and assign     |

```java
Example Program:

int a = 10;
a += 5;   // a = 15
a *= 2;   // a = 30
System.out.println("Final Value of a: " + a);
```
## Unary Operators

Unary operators are used to perform operations on a single operand.

| Operator | Description                     | Example        | Result              |
|----------|---------------------------------|----------------|---------------------|
| +        | Unary plus (positive value)     | +a             | Positive value of a |
| -        | Unary minus (negation)          | -a             | Negative of a       |
| ++       | Increment (adds 1)              | a++ or ++a     | Increase by 1       |
| --       | Decrement (subtracts 1)         | a-- or --a     | Decrease by 1       |
| !        | Logical NOT                     | !true          | false               |

Increment / Decrement Types:

* Prefix (++a, --a) → value is changed before use.

* Postfix (a++, a--) → value is changed after use.

```java
Example Program:

int a = 5;
System.out.println(++a);  // 6 (prefix increment)
System.out.println(a++);  // 6 (prints old value, then becomes 7)
System.out.println(--a);  // 6 (prefix decrement)
```
## Ternary Operator

* Also known as Conditional Operator (?:).

* It is a shortcut for if–else.

```
Syntax:

variable = (condition) ? value_if_true : value_if_false;
```
```java
Example:

int a = 10, b = 20;
int max = (a > b) ? a : b;
System.out.println("Maximum: " + max);
```

Explanation:
* If the condition (a > b) is true, max = a; otherwise, max = b.

# Precedence and Associativity

When multiple operators appear in an expression, operator precedence decides which operator is executed first.
If operators have the same precedence, associativity decides the direction of execution.

## Precedence Order (Highest → Lowest)
| Precedence | Operators       | Description                     | Associativity   |
|------------|-----------------|---------------------------------|-----------------|
| 1          | ++, --          | Increment / Decrement           | Right to Left   |
| 2          | *, /, %         | Multiplication, Division, Modulus | Left to Right |
| 3          | +, -            | Addition, Subtraction           | Left to Right   |
| 4          | <, >, <=, >=    | Relational                      | Left to Right   |
| 5          | ==, !=          | Equality                        | Left to Right   |
| 6          | &&              | Logical AND                     | Left to Right   |
| 7          | \|\|            | Logical OR                      | Left to Right   |
| 8          | ?:              | Ternary                         | Right to Left   |
| 9          | =, +=, -=       | Assignment                      | Right to Left   |

```java
Example:

int result = 10 + 5 * 2;
System.out.println(result); // 20
```
Explanation:
* has higher precedence than +, so 5 * 2 is done first → 10 + 10 = 20.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|