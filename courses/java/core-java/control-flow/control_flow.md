
# Control Flow

Control flow in Java means the order in which your program’s statements are executed.
By default, Java runs code from top to bottom, line by line — but with control flow statements, you can change that order:

* Decide what to do (conditions)
* Repeat actions (loops)
* Jump to different parts of the code


##  Conditional Statements

Conditional statements help the program make decisions — like “If it’s raining, take an umbrella.”
if StatementJava Control Flow — Notes

### if Statement

* Used to execute a block of code only when a condition is true.

* If the condition is false, the block is skipped.
```java
Syntax:

if (condition) {
    // statements
}
```
```java
Example:

int age = 20;
if (age >= 18) {
    System.out.println("Eligible to vote");
}
```
###  if–else Statement

  Used to execute one block if condition is true
and another block if condition is false.

```java
Syntax:

if (condition) {
    // statements when true
} else {
    // statements when false
}
```
```java
Example:

int number = 5;
if (number % 2 == 0) {
    System.out.println("Even number");
} else {
    System.out.println("Odd number");
}
```
###  Nested if Statement

* Used when there are multiple conditions to check.

* An if statement inside another if.
```java
Syntax:

if (condition1) {
    if (condition2) {
        // statements
    }
}
```
```java
Example:

int marks = 85;
if (marks >= 40) {
    if (marks >= 75) {
        System.out.println("Distinction");
    } else {
        System.out.println("Pass");
    }
} else {
    System.out.println("Fail");
}
```

### switch–case Statement

* Used to execute one block of code from many options.

* Compares a variable with multiple values (cases).

* break is used to stop checking further cases.

* default runs if no case matches.

```java
Syntax:

switch (variable) {
    case value1:
        // statements
        break;
    case value2:
        // statements
        break;
    default:
        // statements
}
```
```java
Example:

int day = 2;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Invalid day");
}
```
## 2. Looping Constructs

Loops are used to execute a block of code repeatedly
until a certain condition is satisfied.

### for Loop

* Used when the number of iterations is known.

* Executes a block of code repeatedly while the condition is true.
```java
Syntax:

for (initialization; condition; update) {
    // statements
}
```
```java
Example:

for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

###  while Loop

* Used when the number of iterations is not known.

* Condition is checked before executing the loop body.
```java
Syntax:

while (condition) {
    // statements
}
```
```java
Example:

int i = 1;
while (i <= 5) {
    System.out.println(i);
    i++;
}
```

###  do–while Loop

* Used when the loop body must be executed at least once.

* Condition is checked after executing the block.

```java
Syntax:

do {
    // statements
} while (condition);

```
```java
Example:

int i = 1;
do {
    System.out.println(i);
    i++;
} while (i <= 5);
```
## Jump Statements

Jump statements are used to control the flow of loops and methods.
They help to terminate, skip, or return from loops and methods.

### break Statement

* Used to terminate the loop or switch statement immediately.

* Control moves to the statement after the loop or switch.
```java
Syntax:

break;
```
```java

Example:

for (int i = 1; i <= 10; i++) {
    if (i == 5)
        break;
    System.out.println(i);
}


// Output:

// 1
// 2
// 3
// 4
```


###  continue Statement

* Used to skip the current iteration of the loop.
* Control moves to the next iteration.
```java
Syntax:

continue;
```

```java

Example:

for (int i = 1; i <= 5; i++) {
    if (i == 3)
        continue;
    System.out.println(i);
}


// Output:

// 1
// 2
// 4
// 5
```


### return Statement

* Used to exit from a method.
* Can also return a value to the caller.

```java
Syntax:

return value;
```
```java
Example:

public static int add(int a, int b) {
    return a + b;
}

public static void main(String[] args) {
    int result = add(5, 10);
    System.out.println("Sum: " + result);
}


// Output:

// Sum: 15
```

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|