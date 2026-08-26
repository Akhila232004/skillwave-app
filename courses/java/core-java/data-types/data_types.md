# What Are Data Types?

* A data type tells Java what kind of value you’re storing (number, text, true/false, etc.) and how much memory it needs.
Java has two big families:

  * Primitive types: built-in, very fast, store simple values directly.

  * Reference types (non-primitive): objects (e.g., String, arrays, your own classes).

##  Primitive Data Types
  Use primitives for speed and memory efficiency. There are 8 primitives.

 Type      | Size          | Range / Notes                                | Example                     |
| --------- | ------------- | -------------------------------------------- | --------------------------- |
| `byte`    | 8-bit         | −128 to 127                                  | `byte b = 120;`             |
| `short`   | 16-bit        | −32,768 to 32,767                            | `short s = 32000;`          |
| `int`     | 32-bit        | −2,147,483,648 to 2,147,483,647              | `int n = 100;`              |
| `long`    | 64-bit        | Very large integers (**suffix** `L`)         | `long id = 5_000_000_000L;` |
| `float`   | 32-bit        | ~6–7 decimal digits (**suffix** `f`)         | `float f = 3.14f;`          |
| `double`  | 64-bit        | ~15–16 decimal digits (default for decimals) | `double d = 3.14159;`       |
| `char`    | 16-bit        | Unicode code unit (`'\u0000'` to `'\uFFFF'`) | `char c = 'A';`             |
| `boolean` | JVM-dependent | `true` or `false`                            | `boolean ok = true;`        |


## byte

A small whole-number type for values from −128 to 127. Handy for raw bytes (files, streams) and saving memory.
```java
byte b = 120;
byte neg = -5;
System.out.println(b + ", " + neg); 

// Output: 120, -5

```
## short

A whole-number type that fits values from −32,768 to 32,767. Use when numbers fit and you want smaller storage than int.
```java
short s = 12000;
short yearOffset = -25;
System.out.println(s + yearOffset); 

// Output: 11975

```
## int

The everyday whole-number type for counting, indexing, and IDs (−2,147,483,648 to 2,147,483,647).
```java
int count = 1000000;
int index = 3;
System.out.println(count - index); 

// Output: 999997
```

## long

A large whole-number type for very big counts and timestamps (requires L suffix for literals like 10L).
```java
long population = 9223372000L;
long nowMs = System.currentTimeMillis();
System.out.println(population + ", " + nowMs);

// Output: 9223372000, 18446744000
```

## float

A decimal type for approximate values with about 6–7 digits of precision (use f suffix).
```java
float ratio = 0.75f;
float piApprox = 3.1415927f;
System.out.println(ratio * piApprox);

// Output: 2.3561945
```

## double

The default decimal type with about 15–16 digits of precision. Use for most numeric calculations.
```java
double price = 199.99;
double tax = price * 0.18;
double total = price + tax;
System.out.println(total);

// Output: 235.9882

```
## boolean

A logical flag that holds only true or false. Used for conditions and decisions.
```java
int age = 19;
boolean isAdult = age >= 18;
System.out.println(isAdult); 

// Output: true
```
## char

A single UTF-16 character (not just ASCII). Use single quotes; can also use Unicode escapes.
```java
char grade = 'A';
char rupee = '\u20B9'; // ₹
System.out.println(grade + " " + rupee);

// Output: A ₹
```


## What are Non-Primitive (Reference) Data Types?

* They store references (pointers) to objects on the heap, not raw values.

* The default value for fields of reference types is null (locals must be initialized).

* Equality: use .equals() for content, == checks same object reference.

* They can have methods, inheritance, polymorphism, and work with generics.

* Passing them to methods still uses pass-by-value, but the “value” is a reference (so methods can mutate the object’s internal state).

* Common reference types: String, arrays, classes/objects, interfaces, wrapper types (Integer, Double, …), enums, records, StringBuilder, collections (List, Map, …).



## 1) String

A String is an immutable sequence of characters.

* Immutable: any “change” (concat, replace, substring, etc.) returns a new String; the original stays the same.

* Literals are interned: identical string literals may point to the same pooled object.

* Compare by content with .equals(...), not == (which checks reference).

* Performance: repeated concatenation in loops → use StringBuilder.

```java
Example

String s1 = "Hello";
String s2 = s1 + " World";           // creates a NEW String
System.out.println(s1);
System.out.println(s2);
System.out.println(s2.toUpperCase());
System.out.println(s2.contains("World"));


// Output:

// Hello
// Hello World
// HELLO WORLD
// true
```


## 2) Array 

* An array is a fixed-size, ordered collection of elements of the same type.

* Fixed length: size is set at creation and cannot grow/shrink.

* Zero-indexed: first element at index 0.

* Reference type: variables hold a reference to the array object on the heap.

* Bounds checked: accessing invalid indices throws ArrayIndexOutOfBoundsException.

* Can be multi-dimensional: e.g., int[][] grid.

```java
Example

int[] nums = {10, 20, 30};  // length = 3
nums[1] = 25;               // update index 1
System.out.println(nums[0] + " " + nums[1] + " " + nums[2]);
System.out.println(nums.length);


// Output:

// 10 25 30
// 3
```


## 3) Class (and Object)

* A class is a blueprint that defines an object’s data (fields) and behavior (methods).

* Encapsulation: keep fields private, expose behavior via methods.

* Constructors: initialize objects (new ClassName(...)).

* Methods: implement behavior; can override toString(), equals(), etc.

* Objects: concrete instances created from the class.
```java
Example

class Person {
    String name;
    int age;
    Person(String name, int age) { this.name = name; this.age = age; }
    void haveBirthday() { age++; }
    @Override public String toString() { return name + " (" + age + ")"; }
}

// Usage:
Person p = new Person("Alex", 29);
p.haveBirthday();
System.out.println(p);


// Output:

// Alex (30)

```


## 4) Interface — Definition

An interface is a contract listing methods a class must implement.

* No state by default: defines what must be done, not how.

* Default/static methods: can include reusable method bodies (default) and utility (static).

* Multiple inheritance of type: a class can implement many interfaces.

* Polymorphism: code can depend on the interface, not the concrete class.

```java 
Example

interface Drivable {
    int maxSpeed();
    default void honk() { System.out.println("beep!"); }
}

class Car implements Drivable {
    @Override public int maxSpeed() { return 180; }
}

// Usage:
Drivable d = new Car();
d.honk();
System.out.println(d.maxSpeed());


// Output:

// beep!
// 180
```

## Null and Default Values

In Java, variables must be initialized before they are used.
However, when you declare a variable as a class field (instance or static variable) and don’t assign a value to it, Java automatically gives it a default value depending on its data type.

When you declare a local variable (inside a method), it does not get a default value — you must assign one before using it.


### Default Values for Each Data Type

| **Data Type** | **Default Value** | **Description** |
|----------------|-------------------|------------------|
| **byte** | `0` | Represents small integers |
| **short** | `0` | Slightly larger integer type |
| **int** | `0` | Default integer value |
| **long** | `0L` | Ends with `L` to mark long type |
| **float** | `0.0f` | Floating-point default |
| **double** | `0.0d` | Double precision floating-point |
| **char** | `'\u0000'` | Unicode null character (looks blank) |
| **boolean** | `false` | Logical false |
| **Reference types (e.g., String, arrays, objects)** | `null` | Means “no object assigned” |

### What Is null?

* null means no object reference — the variable does not point to any real object in memory.
* You can assign null only to non-primitive (reference) types.
* Trying to use a variable that holds null (for example, calling a method on it) will cause a NullPointerException.

**Example:**
```java
String name = null;
System.out.println(name.length()); // ❌ Throws NullPointerException
```

To avoid errors, always check for null before using:
```java
if (name != null) {
    System.out.println(name.length());
}
```

### Key Points to Remember
* Primitive types (like int, double, boolean) never hold null.
* Reference types (like String, arrays, objects) can be null.
* Default values apply only to fields, not local variables inside methods.
* Always initialize local variables before using them.
* Using uninitialized or null variables leads to runtime errors.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|