# Java 8+ Features

### Why It’s Called “Java 8+ Features”  
**Background**  

Before Java 8 (released in March 2014), Java was primarily an object-oriented language:
you’d write classes, create objects, and call methods.
But modern programming was shifting toward functional programming — writing concise, expressive, and parallel-friendly code (like in Python / JavaScript).

So Java 8 introduced a major language upgrade that made Java:
* more expressive (Lambdas, Streams),
* more functional (treat functions as data),
* more concurrent (new concurrency utilities), and
* modernized its date/time API.

### In Simple Words
* “Java 8+ Features” = all the modern Java language improvements introduced from Java 8 onward.

* They make Java cleaner, faster, and easier to write — especially for parallel, functional, and stream-based processing.

## What Are Lambda Expressions?
A Lambda Expression is a short block of code that takes parameters and returns a value — similar to a method, but without a name.
It’s mainly used to simplify anonymous classes that implement functional interfaces (interfaces with only one abstract method).

Introduced in Java 8, lambdas make code cleaner and more readable — especially when working with APIs like Collections and Streams.

Syntax
```java
(parameters) -> expression
(parameters) -> { statements }
```
Key Rules:
* Parentheses () are optional for one parameter.
* Curly braces {} are optional for one simple expression.
* Lambdas can return values (automatically, if single expression).

**Examples:**
```java
() -> System.out.println("Hello World!");        // no parameters
x -> x * x;                                      // one parameter
(a, b) -> a + b;                                 // mult
```
### Why Use Lambdas?

| **Benefit** | **Description** |
|--------------|----------------|
| **Conciseness** | Reduces boilerplate code — no need for anonymous classes |
| **Readability** | Expresses business logic more clearly |
| **Functional Style** | Makes Java code closer to functional programming |
| **Reusability** | Works well with Streams API and Collections API |


Example 1 – Without Lambda
```java
// File: LambdaExample1_Without.java
// Demonstrates how we wrote code using an anonymous inner class before Java 8.

interface Greeting {
    void sayHello();
}

public class LambdaExample1_Without {
    public static void main(String[] args) {
        // Using an anonymous inner class
        Greeting greet = new Greeting() {
            public void sayHello() {
                System.out.println("Hello, welcome to Java (old way)!");
            }
        };
        greet.sayHello();
    }
}

/*
Expected Output:
Hello, welcome to Java (old way)!
*/

```
Example 2 – With Lambda
```java
// File: LambdaExample2_With.java
// Demonstrates how the same task can be done easily using a lambda expression.

interface Greeting {
    void sayHello();
}

public class LambdaExample2_With {
    public static void main(String[] args) {
        // Using lambda expression — simpler and cleaner
        Greeting greet = () -> System.out.println("Hello, welcome to Java (lambda way)!");
        greet.sayHello();
    }
}

/*
Expected Output:
Hello, welcome to Java (lambda way)!
*/
```
## Functional Programming Basics (Java 8+)
### What is Functional Programming?

Functional Programming (FP) is a style of programming that focuses on what to do,
rather than how to do it.

**In simple words:**   
* In OOP, we think in terms of objects and methods.
* In FP, we think in terms of data and functions — i.e., what transformation should happen.

### Real-world analogy:
Imagine you have a list of students’ marks.
#### 1. Old (imperative) style:
* Create an empty list, loop through every mark, check if it’s greater than 50, then add it to another list.
#### 2. Functional style:  
* Just filter the list for marks greater than 50.  

Functional programming lets you describe what outcome you want, not each step to reach it.

###  Core Concepts of Functional Programming

| **Concept** | **Meaning** | **Java Example** |
|--------------|-------------|------------------|
| **Functions as First-Class Citizens** | You can pass functions as parameters, return them, and store them in variables. | `list.forEach(System.out::println);` |
| **Pure Functions** | Output depends only on input (no hidden state or side effects). | `(x) -> x * 2` |
| **Immutability** | Data should not be changed once created. | Use new lists instead of modifying existing ones. |
| **Declarative Style** | Focus on what to do, not how. | `marks.stream().filter(m -> m > 50)` |
| **Higher-Order Functions** | Functions that take other functions as input or return them. | `filter()`, `map()`, etc. |

### Why Functional Programming in Java?

Java was object-oriented, but Java 8 added functional features like:

* Lambda Expressions
* Functional Interfaces (like Predicate, Function, Consumer)
* Streams API

These make code: 
* Shorter    
* Easier to read   
* Easier to parallelize (multi-thread friendly)

**Example** — Without Functional Programming
```java
// File: FunctionalExample1_Without.java
// Traditional Java approach (imperative style)

import java.util.*;

public class FunctionalExample1_Without {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(10, 25, 30, 45, 60);
        List<Integer> even = new ArrayList<>();

        for (int n : numbers) {
            if (n % 2 == 0) {
                even.add(n);
            }
        }

        System.out.println("Even Numbers: " + even);
    }
}

/*
Expected Output:
Even Numbers: [10, 30, 60]
*/
```

Here, we manually:
* Create a loop
* Check each number
* Add it to a new list

This works fine — but it’s more procedural and verbose.

**Example** — With Functional Programming
```java
// File: FunctionalExample2_With.java
// Modern Java approach (functional style)

import java.util.*;
import java.util.stream.Collectors;

public class FunctionalExample2_With {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(10, 25, 30, 45, 60);

        List<Integer> even = numbers.stream()
                                    .filter(n -> n % 2 == 0)
                                    .collect(Collectors.toList());

        System.out.println("Even Numbers: " + even);
    }
}

/*
Expected Output:
Even Numbers: [10, 30, 60]
*/
```
#### Here:
* .stream() turns the list into a data flow.
* .filter(n -> n % 2 == 0) uses a lambda to keep only even numbers.
* .collect() gathers results into a new list.

No loops, no temporary variables — just describe what you want.

## Functional Interfaces in Java
### What Are Functional Interfaces?

A Functional Interface is an interface that contains exactly one abstract method.
This one method represents a single, specific behavior or action.

**In simple words:**

A functional interface is a “one-job” interface — it defines only one thing to do.
### Why Do We Need Them?
Before Java 8, if we wanted to perform a small operation like printing, comparing, or adding numbers,
we had to create an entire class or an anonymous inner class — even for a single method.

With Java 8, we can use Lambda Expressions and Functional Interfaces to make our code:

*  Shorter
*  Clearer
* More reusable

### @FunctionalInterface Annotation
You can mark an interface with @FunctionalInterface to make your intent clear.
It helps the compiler ensure that your interface has only one abstract method.  
If you try to add more methods, Java will show a compile-time error.
```JAVA
@FunctionalInterface
interface Greeting {
    void sayHello();  // ✅ Only one abstract method allowed
}
```
If you add another abstract method:
```JAVA
// ❌ ERROR: Multiple abstract methods not allowed
void sayBye();
```
\
This annotation improves code safety and readability — it’s like telling Java,
“Hey, this interface is meant for Lambda Expressions!”

### Simple Example – Custom Functional Interface
```JAVA
// File: FunctionalInterfaceExample.java
// Demonstrates a simple functional interface with lambda usage

@FunctionalInterface
interface Greeting {
    void sayHello();
}

public class FunctionalInterfaceExample {
    public static void main(String[] args) {
        // Using Lambda Expression
        Greeting greet = () -> System.out.println("Hello, TINITIATE Learner!");
        greet.sayHello();
    }
}

/*
Expected Output:
Hello, TINITIATE Learner!
*/
```

**Explanation:**
* Greeting has only one method → it’s a functional interface.
* The lambda () -> System.out.println("...") defines what that single method does.

## Built-in Functional Interfaces (java.util.function)
Java 8 introduced several ready-made functional interfaces in the java.util.function package.
These make your code cleaner and avoid writing custom interfaces every time.

Let’s explore the 4 most important ones 👇

### 1. Predicate<T> — “Check something”

Purpose: Tests a condition and returns true or false.
Method: boolean test(T t)

Think of it as:

A checker that answers yes/no questions.

**Example**
```JAVA
// File: PredicateExample.java
// Checks if a number is even using Predicate

import java.util.function.Predicate;

public class PredicateExample {
    public static void main(String[] args) {
        Predicate<Integer> isEven = num -> num % 2 == 0;

        System.out.println("10 is even? " + isEven.test(10));
        System.out.println("7 is even? " + isEven.test(7));
    }
}

/*
Expected Output:
10 is even? true
7 is even? false
*/
```

**Explanation:**

* Predicate checks a condition → here, “is the number even?”
* It returns true or false based on that check.

### 2. Function<T, R> — “Transform something”

Purpose: Takes one input and produces one output.
Method: R apply(T t)

Think of it as:

A converter that turns input into something else.

Example
```java
// File: FunctionExample.java
// Converts a string to uppercase using Function<T, R>

import java.util.function.Function;

public class FunctionExample {
    public static void main(String[] args) {
        Function<String, String> toUpper = name -> name.toUpperCase();

        System.out.println(toUpper.apply("tinitiate"));
        System.out.println(toUpper.apply("java training"));
    }
}

/*
Expected Output:
TINITIATE
JAVA TRAINING
*/
```

**Explanation:**
* Function receives one value (name) and returns a modified version of it.
* Perfect for mapping, transformations, or conversions.

### 3. Supplier<T> — “Provide something”

Purpose: Takes no input but returns a value.
Method: T get()

Think of it as:

A provider that gives you something when you ask.

**Example**
```java
// File: SupplierExample.java
// Demonstrates Supplier<T> returning random numbers

import java.util.function.Supplier;

public class SupplierExample {
    public static void main(String[] args) {
        Supplier<Double> randomNumber = () -> Math.random();

        System.out.println("Random value 1: " + randomNumber.get());
        System.out.println("Random value 2: " + randomNumber.get());
    }
}

/*
Expected Output (varies each run):
Random value 1: 0.5276345
Random value 2: 0.9281207
*/
```

**Explanation:**

* Supplier doesn’t take input — it simply supplies data (like random numbers, date, etc.).

* Think of it as a “value generator.”

### 4. Consumer<T> — “Use something”

Purpose: Takes one input and performs an action (no return value).
Method: void accept(T t)

Think of it as:

An action performer — it consumes data but doesn’t return anything.

**Example**
```java
// File: ConsumerExample.java
// Demonstrates Consumer<T> for printing messages

import java.util.function.Consumer;

public class ConsumerExample {
    public static void main(String[] args) {
        Consumer<String> greet = name -> System.out.println("Welcome, " + name + "!");

        greet.accept("TINITIATE");
        greet.accept("Java Learner");
    }
}

/*
Expected Output:
Welcome, TINITIATE!
Welcome, Java Learner!
*/
```
**Explanation:**
* Consumer takes a value (name) and performs an operation (printing).
* No value is returned — it just “consumes” the input.


## What is the Streams API?

The Streams API was introduced in Java 8 to make data processing easier, faster, and more readable.

It allows you to process collections (Lists, Sets, Maps) in a functional style —
using operations like filtering, mapping, sorting, reducing, or collecting — without writing loops manually.

### Why Streams?

Before Streams, we wrote long for loops for tasks like:
* Filtering elements (e.g., only even numbers)
* Transforming data (e.g., converting to uppercase)
* Summing numbers or joining strings

With Streams, you can do all of this in one line, using a pipeline of operations.

Stream Pipeline = Source → Intermediate Operations → Terminal Operation
### 🔹 Stream Stages

| **Stage** | **Description** | **Example** |
|-----------|-----------------|-------------|
| **Source** | Where data comes from (Collection, Array, etc.) | `list.stream()` |
| **Intermediate** | Transform or filter data | `.filter()`, `.map()`, `.sorted()` |
| **Terminal** | Produces the final result | `.collect()`, `.forEach()`, `.reduce()` |

### 1. Creating Streams

You can create a Stream from different sources such as collections, arrays, or direct values.

### Ways to create streams:
* From a Collection → list.stream()
* From an Array → Arrays.stream(array)
* From Values directly → Stream.of(1, 2, 3)
* From Files or I/O → Files.lines(path)

**Example** — Creating a Stream from a List
```java
// File: Stream_CreateFromList.java
// Demonstrates creating a stream from a list

import java.util.*;
import java.util.stream.*;

public class Stream_CreateFromList {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Java", "Python", "C++");

        Stream<String> nameStream = names.stream();
        nameStream.forEach(System.out::println);
    }
}

/*
Expected Output:
Java
Python
C++
*/
```
### 2. Intermediate Operations
(These are lazy — they don’t run until a terminal operation is called.)  

Intermediate operations transform or filter data inside the stream.  
They return another stream, allowing you to chain multiple steps.

#### Common intermediate operations:
| **Method** | **Description** |
|------------|-----------------|
| **.filter()** | Selects elements that match a condition |
| **.map()** | Transforms each element |
| **.sorted()** | Sorts elements |

*** Example — filter() and map()
```java
// File: Stream_FilterMapExample.java
// Filters even numbers and doubles them

import java.util.*;
import java.util.stream.*;

public class Stream_FilterMapExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

        List<Integer> result = numbers.stream()
                                      .filter(n -> n % 2 == 0)  // keep even numbers
                                      .map(n -> n * 2)          // double each
                                      .collect(Collectors.toList());

        System.out.println("Processed Numbers: " + result);
    }
}

/*
Expected Output:
Processed Numbers: [4, 8, 12]
*/
```
### 3. Terminal Operations

These are final steps that actually trigger stream execution.

#### Common terminal operations include:
| **Method** | **Purpose** | **Example Output** |
|------------|-------------|------------------|
| **.forEach()** | Performs an action for each element | Prints values |
| **.collect()** | Gathers results into a `List`, `Set`, or `Map` | Collects to `List` |
| **.reduce()** | Combines elements into a single result | Sum, max, join | 

**Example** — collect() and forEach()
```java
// File: Stream_CollectForEachExample.java
// Collects filtered data into a list and prints it

import java.util.*;
import java.util.stream.*;

public class Stream_CollectForEachExample {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "bat", "ant", "ball");

        List<String> aWords = words.stream()
                                   .filter(w -> w.startsWith("a"))
                                   .collect(Collectors.toList());

        aWords.forEach(System.out::println);
    }
}

/*
Expected Output:
apple
ant
*/
```

## Java Method References
A method reference in Java is a shortcut to call a method by referring to it directly by name instead of using a lambda expression.
It’s part of Java 8’s functional programming features, primarily used with functional interfaces (interfaces with a single abstract method).

**Purpose:**
* Make code cleaner and more readable
* Avoid boilerplate lambda expressions
* Can be used wherever a functional interface is expected

Syntax
```java
ClassName::methodName
```
### 🔹 4 Main Types of Method References

| **Type** | **Example** | **Description** |
|----------|-------------|-----------------|
| **1. Static Method** | `ClassName::staticMethod` | Calls a static method |
| **2. Instance Method (specific object)** | `object::instanceMethod` | Calls an instance method of a particular object |
| **3. Instance Method (of any object of a class)** | `ClassName::instanceMethod` | Used when the object comes from a stream or collection |
| **4. Constructor Reference** | `ClassName::new` | Used to create new objects |

### 1. Static Method Reference
Used when you want to refer to a static method of a class.

**Example Use**

If you already have a static method that prints a message,
instead of calling it through a lambda, you can directly point to it using:
```java
ClassName::methodName
```

**Typical usage:**
* When you pass behavior like System.out::println to forEach().
* Or when a static helper method already does what you need.

### 2. Instance Method Reference (specific object)

Used when you have an object instance and want to call one of its methods.

**Example Use**  

You already have an object printer with a method show(String msg).

Instead of:
```
s -> printer.show(s)
```

You can simply write:
```
printer::show
```

Typical usage:

* When working with classes that have instance methods you need to pass as parameters (e.g., printing, saving, etc.).

### 3. Instance Method Reference (of any object of a class)

Used when you want to call a method on each element of a stream or collection.

**Example:**
```
names.stream()
     .map(String::toUpperCase)
     .forEach(System.out::println);
```
Here, String::toUpperCase calls toUpperCase() on each String in the list.

**Typical usage:**

* Inside Streams (map, filter, forEach) when each element performs the same action.

### 4. Constructor Reference

Used when you want to create new objects using a reference to a constructor.

**Example:**
```
Supplier<Student> s = Student::new;
```

This is equivalent to:
```
Supplier<Student> s = () -> new Student();
```
Typical usage:

* When you need to create new objects dynamically inside Streams or functional code.


## What Is the Optional Class
The Optional<T> class (in java.util) was introduced in Java 8 to help developers handle values that might be null, without running into the dreaded NullPointerException.

It acts as a container that may or may not hold a value.  
Instead of checking manually like this:
```java
if (name != null)
    System.out.println(name.toUpperCase());
```
### Avoiding NullPointerException
In normal Java, a NullPointerException happens when you try to use a variable that is null.
For example:**
```java
String name = null;
System.out.println(name.length()); // ❌ NullPointerException
```

Using Optional, we can wrap the value safely:
```java
Optional<String> name = Optional.ofNullable(null);
System.out.println(name.orElse("Guest")); // ✅ prints "Guest"
```
So, Optional helps us write code that never crashes because of null values.

### Important Methods in `Optional`

| **Method** | **Description** | **Purpose / Why It Exists** |
|-------------|------------------|------------------------------|
| **of(value)** | Creates an `Optional` with a non-null value. Throws exception if `null` is passed. | Used when you are sure the value is **not null**. |
| **ofNullable(value)** | Creates an `Optional` that may contain a null or non-null value. | Used when the value **might be null**. |
| **empty()** | Creates an empty `Optional` with no value. | Represents **“no result”** or **“no data found.”** |
| **get()** | Returns the value if present, else throws `NoSuchElementException`. | Use only when you're **sure the value exists** (⚠ risky if empty). |
| **orElse(defaultValue)** | Returns the value if present; otherwise returns the given default. | Provides a **safe fallback value**, avoiding `NullPointerException`. |

**Example** Simple Usage
```java
// Demonstrates how Optional prevents NullPointerException

import java.util.Optional;

public class OptionalExample {
    public static void main(String[] args) {
        String name = null;

        Optional<String> safeName = Optional.ofNullable(name);

        System.out.println("Name: " + safeName.orElse("Guest")); // uses default value
    }
}

/*
Expected Output:
Name: Guest
*/
```
**In short:**
* Optional = a safer container for possibly null values.
* Eliminates repetitive null checks.
* Makes code cleaner, safer, and more readable.


## New Date and Time API?
Before Java 8, developers used the old classes — Date, Calendar, and SimpleDateFormat.
These were error-prone, mutable, and hard to format or use in multi-threaded programs.

So in Java 8, the java.time package was introduced to provide:

* Easier and more readable API
* Immutable (safe for threads)
* Clear separation between date, time, and timezone
* Built-in formatting and parsing support

### 1. LocalDate — Date Without Time

Represents only the date (year, month, day) without time or timezone.
It is immutable — once created, its value cannot change.

Syntax
```java
LocalDate date = LocalDate.now();               // current system date
LocalDate specific = LocalDate.of(2025, 10, 21); // specific date (YYYY, MM, DD)
LocalDate parsed = LocalDate.parse("2025-10-21"); // from String in ISO format
```

**Used For**

* Storing or displaying calendar dates such as birthdays, joining dates, invoice dates.
* Date calculations like adding or subtracting days/months/years.


### 2. LocalTime — Time Without Date

Represents only the time (hours, minutes, seconds, nanoseconds).
No date or timezone component is stored.

Syntax
```java
LocalTime time = LocalTime.now();               // current system time
LocalTime specific = LocalTime.of(10, 30, 0);   // specific time (HH, MM, SS)
LocalTime parsed = LocalTime.parse("15:45");    // from String (24-hour format)
```

**Used For**

* Representing schedules, opening/closing times, alarm times.
* Performing operations like adding hours or minutes.

### 3. LocalDateTime — Date + Time (No Timezone)

Combines both date and time into a single object but without timezone.

Syntax
```java
LocalDateTime dateTime = LocalDateTime.now();               // current date and time
LocalDateTime specific = LocalDateTime.of(2025, 10, 21, 15, 30); // YYYY,MM,DD,HH,MM
```
**Used For**

* Storing timestamps for logs, events, database records.
* Adding/subtracting days, hours, minutes, etc.

### 4. ZonedDateTime — Date + Time + Timezone

Represents date and time along with a specific time zone (like India, USA, etc.).

Syntax
```java
ZonedDateTime zoned = ZonedDateTime.now(ZoneId.of("Asia/Kolkata")); // with zone
ZonedDateTime converted = zoned.withZoneSameInstant(ZoneId.of("Europe/London"));
```

**Used For**
* Applications handling global users or servers in different regions.
* Converting time between zones.

### 5. Instant — Machine-Readable Timestamp

Represents a precise instant in UTC time, independent of timezone.
Useful for logging, measuring durations, or backend timestamps.

Syntax
```java
Instant now = Instant.now();                // current timestamp
Instant later = now.plusSeconds(60);        // add seconds
```
**Used For**
* System timestamps, logging, or audit trails.
* Representing time for data exchange across systems.

### 6. DateTimeFormatter — Formatting & Parsing

Used to format date/time into readable text or parse text back into date/time objects.

Syntax
```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
String formatted = LocalDateTime.now().format(fmt); // formatting
LocalDate parsed = LocalDate.parse("25-12-2025", DateTimeFormatter.ofPattern("dd-MM-yyyy")); // parsing
```

**Used For**
* Converting date/time to specific display formats.
* Parsing user-input date strings.
##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|