# Java Variables

* Variables are named storage for data with a fixed type in Java.

* They improve code readability and enable reuse of values.

* Each variable has a data type, name, scope, and lifetime.

## Variable Declaration and Initialization

* Declaration tells Java the type and name.

* Initialization gives the first value.

* You can combine both in one statement.

### Simple Creation
```java
public class VarsDemo {
    public static void main(String[] args) {
        int count;                 // declaration only
        count = 3;                 // initialization

        String title = "Tinitiate"; // declaration + initialization
        double price = 99.50;

        System.out.println("count: " + count);
        System.out.println("title: " + title);
        System.out.println("price: " + price);

        // OUTPUT:
        // count: 3
        // title: Tinitiate
        // price: 99.5
    }
}
```
### Syntax

- General form: DataType variableName = value;

- Java is statically typed—the type is required (except var for local inference, Java 10+).
```java
int age = 25;               // int literal
boolean isActive = true;    // boolean literal
char grade = 'A';           // single char in single quotes
long users = 1_000_000L;    // long with suffix L
float ratio = 3.14f;        // float with suffix f
double pi = 3.14159;        // double (default for decimals)
```

> Tip: Java 10+ supports var for local variables where the compiler infers the type. Not for fields/parameters.
```java
var message = "Hello";  // inferred as String
var n = 42;             // inferred as int
```
### Multiple Declarations

- You can declare multiple variables of the same type in one line.

- Avoid overly dense declarations for readability.
```java
int x = 5, y = 10, z = 15;  // multiple declarations
System.out.println(x + ", " + y + ", " + z);

// OUTPUT:
// 5, 10, 15
```

> Note: Java does not allow chained assignment across undeclared identifiers like int a = b = 0; (invalid because b isn’t declared yet). Declare each first.

### Default Values

* Local variables (inside methods): no default value. You must initialize before use.

* Instance & static fields: get default values if not explicitly set.

```java
public class Defaults {
    int num;           // 0
    boolean flag;      // false
    String text;       // null (reference types default to null)
    double value;      // 0.0
    static int code;   // 0 (static also gets defaults)

    void show() {
        int local; 
        // System.out.println(local);  // ❌ ERROR: local variable might not be initialized

        System.out.println(num + ", " + flag + ", " + text + ", " + value + ", " + code);
        // OUTPUT (default-initialized fields):
        // 0, false, null, 0.0, 0
    }
}
```

## Variable Types

- Java classifies variables by where they are declared and how long they live.

### Local Variables

* Declared inside a method/constructor/block.
* Exist only within that block; no default values.

```java
void compute() {
    int temp = 10;        // local
    if (temp > 5) {
        int blockVar = 99; // block-scoped local
        System.out.println(blockVar); // OK here
    }
    // System.out.println(blockVar); // ❌ not visible here
}
```
### Instance (Member) Variables

* Declared inside a class, outside any method.

* Each object has its own copy.

```java
class Student {
    String name;      // instance variable
    int rollNo;

    Student(String name, int rollNo) {
        this.name = name;
        this.rollNo = rollNo;
    }
}
```
### Static Variables

* Declared with static in a class.

* Shared across all instances; one copy per class.

```java
class Student {
    static String school = "ABC Public"; // shared across all students
    String name;

    Student(String name) { this.name = name; }
}
```
## Reassigning & Scope
### Variable Reassignment

* You can change a variable’s value as long as it’s not final.
```java
int num = 10;
num = 20;  // reassigned
System.out.println(num); // 20
```
### Variable Shadowing

* A local variable with the same name as a field “shadows” the field inside its scope.

* Use this. to access the instance field.
```java
class Shadowing {
    int x = 10;             // field

    void show() {
        int x = 20;         // shadows field x
        System.out.println(x);       // 20 (local)
        System.out.println(this.x);  // 10 (instance field)
    }
}
```
### Scope (block, method, class, “global”)

* Block scope: { ... } inside if/for/while—variable exists only inside.

* Method scope: parameters and locals exist only in that method.

* Class scope: fields (instance/static) accessible to all methods in the class (respecting access modifiers).

* No true global in Java—use public static fields/methods if needed (sparingly).

```java
public class ScopeDemo {
    static int appVersion = 1; // class (static) scope
    int counter = 0;           // instance (class) scope

    void work() {              // method scope begins
        int step = 5;          // local
        for (int i = 0; i < 3; i++) { // i is block-scoped to the loop
            int tmp = i * step;       // block-scoped
            System.out.println(tmp);
        }
        // System.out.println(i);    // ❌ i not visible here
        // System.out.println(tmp);  // ❌ tmp not visible here
    }
}
```
## Constants
### final keyword

- final prevents reassignment.

- Use static final for compile-time constants shared across the class.
```java
class MathConsts {
    static final double PI = 3.141592653589793; // constant
    final int maxTries = 3;                     // per-object constant

    void demo() {
        // PI = 3.14;     // ❌ cannot assign a value to final variable
        // maxTries = 4;  // ❌ cannot reassign final
    }
}
```
## Naming Rules

* Allowed: letters (a–z, A–Z), digits (0–9), underscore (_), dollar ($)
(avoid $ in practice; it’s reserved by some tools).

* Cannot start with a digit.

* Case-sensitive: total ≠ Total.

* Cannot be a Java keyword: e.g., class, int, static, package, etc.

```java
// ✅ valid
int total_marks; 
double totalMarks2025;
String _internalId;

// ❌ invalid
// int 1stScore;     // starts with digit
// int class;        // 'class' is a keyword
```