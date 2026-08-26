# Abstraction — Definition & Importance

Abstraction is the practice of exposing only what a user needs (the what) and hiding how it’s done (the how). In Java you achieve this using interfaces and abstract classes (and, at a higher level, well-named methods/APIs).

## Why it matters (Importance):

* Simplifies usage: Consumers focus on what to call, not how it works.

* Reduces coupling: Implementation can change without breaking callers.

* Improves testability: You can swap real implementations with fakes/mocks.

* Encourages good design: Clear contracts (interfaces) → cleaner architecture.

## Two Core Tools
 ### 1) Interfaces (pure contracts)

* Say what methods exist; no state.

* Can include default and static methods (Java 8+) for reusable behavior.
```java
// WHAT a payment service can do (no details of HOW)
public interface PaymentService {
    boolean pay(String userId, double amount);   // contract
    default void audit(String msg) {             // optional reusable behavior
        System.out.println("[AUDIT] " + msg);
    }
}
```

> Where to use: When multiple unrelated classes need to promise the same behavior (e.g., StripePaymentService, PaypalPaymentService).

### 2) Abstract Classes (shared skeleton + partial behavior)

* Can hold state, constructors, non-abstract methods, and abstract methods.

* Good for template/skeleton designs where children fill in specific steps.
```java
// Partial HOW + abstract steps subclasses must implement
public abstract class ReportGenerator {
    // Template method: defines the overall algorithm
    public final void generate() {
        loadData();              // subclass decides HOW
        String content = build(); // subclass decides HOW
        export(content);          // shared or overridable
    }

    // Abstract steps: subclasses must provide details
    protected abstract void loadData();
    protected abstract String build();

    // Shared behavior (can be overridden)
    protected void export(String content) {
        System.out.println("Exporting: " + content);
    }
}
```

> Where to use: When multiple related classes share common flow/fields but differ in certain steps.


## Abstract Classes 

An abstract class is a special class that you cannot create objects from directly.
You use it only as a parent class, and other classes extend it and use its code. It may include:

* Abstract methods (no body; subclasses must implement)
* If a class declares at least one `abstract` method, the class itself **must** be declared `abstract`.
* Concrete methods (with body; shared behavior)

* Fields, constructors, static/final methods (like normal classes)

### Use case

* When related subclasses share state and some behavior, but must customize specific steps.

* When you need common fields/constructors/utilities plus abstract “hooks” to be filled by subclasses.

* When applying a template method pattern (fixed high-level flow with variable steps).

* When implementations are closely related and should share code (if you only need a contract, prefer an interface).


#### example
```java
public abstract class BaseName {
    // fields / constructors allowed
    public abstract void mustImplement(); // abstract method (no body)
    public void helper() {}               // concrete method (has body)
}
```

## Abstract Methods

An **abstract method** is a method declared with the `abstract` keyword and **no body**.  
It defines a contract that must eventually be implemented by a concrete subclass (or by a class implementing an interface).

* If a class declares at least one abstract method, that class **must** be declared `abstract`.
* Any **non-abstract** subclass must implement **all** inherited abstract methods;  
  otherwise, that subclass must also be declared `abstract`.
* If no concrete class ever provides implementations for the abstract methods, the abstract base class is never truly usable in real code.



### example 
```java
public abstract class Shape {
    public abstract double area(); // no body here
}
```

### example: Abstract Method Implemented in a Concrete Class
```java
abstract class Animal {
    abstract void sound();          // abstract method (no body here)
}

class Dog extends Animal {          // non-abstract class implements it
    @Override
    void sound() { System.out.println("Woof"); } // body provided here
}

class Demo {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.sound(); // Woof
    }
}
```

## Concrete vs Abstract Methods

Abstract method: Declared with abstract, no body. It’s a contract—subclasses must implement it.

Concrete method: Has a body (implementation). Ready to call or inherit.

```java
// In an abstract class
public abstract class Shape {
    public abstract double area();        // abstract (no body)
    public String label() {               // concrete (has body)
        return "Generic shape";
    }
}
```

```java
// Concrete subclass must implement all inherited abstract methods
public class Circle extends Shape {
    private final double r;
    public Circle(double r) { this.r = r; }

    @Override
    public double area() {                 // concrete implementation
        return Math.PI * r * r;
    }

    // label() inherited as-is (still concrete, optional to override)
}

```



# Abstract Method vs Concrete Method

| **Aspect** | **Abstract Method** | **Concrete Method** |
|-------------|----------------------|----------------------|
| **Has body?** | ❌ No | ✅ Yes |
| **Purpose** | Declare a contract | Provide ready behavior |
| **Where allowed** | Abstract classes & interfaces | Any class (abstract or not) |
| **Must subclass implement?** | ✅ Yes (first concrete subclass) | ❌ No (optional override) |
| **Modifiers** | Cannot be private, final, or static | Can be any (incl. final, static) |


## Interfaces 

An interface is a contract: it declares what methods a type must provide, without committing to how. Classes (or records) implement interfaces; multiple interfaces can be implemented by the same class (multiple inheritance of type).

## Use cases

* Define capabilities/roles (e.g., Comparable, Runnable).

* Enable polymorphism without forcing a class hierarchy.

* Swap implementations easily → loose coupling & testability.

#### Syntax — quickest view
```java
public interface Notifier {
    void send(String to, String message);   // abstract by default
    default void audit(String msg) {        // has body (Java 8+)
        System.out.println("[AUDIT] " + msg);
    }
    static String version() { return "1.0"; } // utility on the interface
    // (Java 9+) private methods allowed inside for sharing code between defaults
}
```
## Multiple Inheritance via Interfaces

Java classes can extend one class but implement many interfaces (multiple inheritance of type/behavior via default methods).

Example (implements 2 interfaces):
```java
interface Printable { void print(); }
interface Timestamped { default long ts() { return System.currentTimeMillis(); } }

class Report implements Printable, Timestamped {
    @Override public void print() {
        System.out.println("Printed at " + ts());
    }
}
```

## Default-method conflict rule (diamond):
If two interfaces provide the same default method, the class must override and choose.
```java
interface A { default void go() { System.out.println("A"); } }
interface B { default void go() { System.out.println("B"); } }

class C implements A, B {
    @Override public void go() { A.super.go(); } // or B.super.go(); or custom
}

Default & Static Methods (Java 8+)

default methods: method bodies inside interfaces—add behavior without breaking implementers.

static methods: utilities that live on the interface type.

Example:

public interface Logger {
    void log(String msg);                 // abstract
    default void info(String msg) { log("[INFO] " + msg); } // default
    static String version() { return "1.0"; }               // static
}

class ConsoleLogger implements Logger {
    @Override public void log(String msg) { System.out.println(msg); }
}

// Usage
Logger lg = new ConsoleLogger();
lg.info("Started");                // default method
System.out.println(Logger.version()); // static method on the interface

```
> Notes:

> * Interface fields are implicitly public static final (constants).

> * (Java 9+) Interfaces can also have private methods to share code between defaults.

## Functional Interfaces

An interface with exactly one abstract method (SAM). Perfect for lambdas and method references.

example
```java
@FunctionalInterface
interface Transformer<T, R> {
    R apply(T value); // single abstract method
}

```

#### Use with lambdas & method references:
```java
Transformer<String, Integer> len = s -> s.length(); // lambda
int n = len.apply("hello"); // 5

Transformer<String, Integer> len2 = String::length;  // method reference
```


## Difference Between Abstract Classes & Interfaces

| **Feature** | **Abstract Class** | **Interface** |
|--------------|--------------------|----------------|
| **Primary purpose** | Share code + define a common base with partial implementation | Define a contract/role across possibly unrelated types |
| **Inheritance** | Single: `extends Base` | Multiple: `implements A, B, C` |
| **State (fields)** | ✅ Any fields (mutable/immutable) | ⚠️ Constants only (`public static final`) |
| **Constructors** | ✅ Yes | ❌ No |
| **Methods without body** | ✅ Abstract methods allowed | ✅ Implicitly abstract (unless default/static) |
| **Methods with body** | ✅ Concrete methods allowed | ✅ `default`, `static` (and `private` for sharing inside interface) |
| **Access modifiers on methods** | Any valid Java modifier | Non-default/static methods are `public` by default |
| **When to pick** | Common state/logic + template flow across related subclasses | Common capability needed by many unrelated classes |
| **Instantiation** | ❌ Cannot instantiate abstract class | ❌ Cannot instantiate interface |

##### [Back To Contents](../../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|