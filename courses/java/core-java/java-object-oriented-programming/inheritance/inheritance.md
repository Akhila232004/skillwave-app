# Inheritance in Java
Inheritance lets a class (the child or subclass) reuse and extend the behavior of another class (the parent or superclass).
Think “is-a” relationship: a Car is a Vehicle.

## Why use it?
* Reuse: Avoid rewriting common fields/methods.

* Specialize: Add or override behavior in child classes.

* Polymorphism: Treat different subclasses uniformly via a parent type (e.g., Vehicle v = new Car()).

Syntax (core idea):
```java
class Parent { /* common fields/methods */ }

class Child extends Parent { /* extra or overridden behavior */ }
```

#### example :
```java
class Vehicle {
    void start() { System.out.println("Vehicle starts..."); }
}

class Car extends Vehicle {
    @Override
    void start() {                      // overriding parent method
        System.out.println("Car checks systems...");
        super.start();                   // optionally call parent's version
    }
}

public class Demo {
    public static void main(String[] args) {
        Vehicle v = new Car();           // upcasting (polymorphism)
        v.start();                       // calls Car.start() at runtime (dynamic dispatch)
    }
}
// Flow:
// 1) new Car() created
// 2) v.start() resolves to Car.start() -> prints "Car checks systems..."
// 3) super.start() -> prints "Vehicle starts..."
```
## Types of Inheritance (in Java)

### Java supports:

* Single inheritance (classes): one direct parent extends.

* Multilevel inheritance: chain like A <- B <- C.

* Hierarchical inheritance: one parent, many children (A <- B, A <- C).

> Java does not support multiple inheritance of classes (a class can’t extends two classes), but it does allow multiple inheritance of type via interfaces (class X implements I1, I2).

## 1)  Single Inheritance

One child extends one parent.

When to use: You have a clear base abstraction and a specialized concrete type.

#### Syntax & example:
```java
class Account {
    protected double balance;                  // protected: visible to subclasses
    public void deposit(double amt) { balance += amt; }
    public double getBalance() { return balance; }
}

class SavingsAccount extends Account {         // single inheritance
    private double interestRate;

    public SavingsAccount(double interestRate) {
        this.interestRate = interestRate;
    }

    public void addMonthlyInterest() {
        balance += balance * (interestRate / 12.0);
    }

    @Override
    public String toString() {
        return "SavingsAccount(balance=" + balance + ")";
    }
}

public class SingleDemo {
    public static void main(String[] args) {
        SavingsAccount sa = new SavingsAccount(0.06);
        sa.deposit(1000);                       // inherited from Account
        sa.addMonthlyInterest();                // child-specific
        System.out.println(sa);                 // prints updated balance
    }
}
// Flow:
// 1) SavingsAccount inherits deposit/getBalance fields/methods.
// 2) We call deposit() from parent, then child adds interest.
// 3) toString() overridden to format output.
```

## 2) Multilevel Inheritance

A chain of inheritance. Each level can add/override behavior.

When to use: Natural layered specializations (e.g., Vehicle -> Car -> ElectricCar).

#### Syntax & example:
```java
class Vehicle {
    public void move() { System.out.println("Vehicle moves"); }
}

class Car extends Vehicle {
    @Override
    public void move() {
        System.out.println("Car rolls on wheels");
    }
    public void honk() { System.out.println("Beep!"); }
}

class ElectricCar extends Car {
    public void charge() { System.out.println("Charging battery"); }

    @Override
    public void move() {
        System.out.println("ElectricCar glides quietly");
    }
}

public class MultiLevelDemo {
    public static void main(String[] args) {
        ElectricCar ec = new ElectricCar();
        ec.charge();  // defined in ElectricCar
        ec.honk();    // inherited from Car
        ec.move();    // overridden in ElectricCar
    }
}
// Flow:
// 1) ElectricCar has Car+Vehicle behaviors.
// 2) ec.honk() comes from Car, ec.move() uses ElectricCar's override.
// 3) The most specific override wins at runtime.
```

#### Constructor call order (important):
```java
class A { A() { System.out.println("A"); } }
class B extends A { B() { System.out.println("B"); } }
class C extends B { C() { System.out.println("C"); } }

new C(); // Prints:
// A
// B
// C
// Flow: Superclass constructors run first (A -> B -> C).
```
## 3) Hierarchical Inheritance

One parent, multiple children. Each child shares base features but can differ in specifics.

When to use: Many specialized types share a common core (e.g., Shape -> Circle, Rectangle).

#### Syntax & example:
```java
abstract class Shape {                     // abstract: cannot instantiate directly
    abstract double area();                // contract for children
    public void describe() { System.out.println("I am a shape"); }
}

class Circle extends Shape {
    private final double r;
    Circle(double r) { this.r = r; }

    @Override
    double area() { return Math.PI * r * r; }
}

class Rectangle extends Shape {
    private final double w, h;
    Rectangle(double w, double h) { this.w = w; this.h = h; }

    @Override
    double area() { return w * h; }
}

public class HierDemo {
    public static void main(String[] args) {
        Shape s1 = new Circle(2.0);        // parent reference -> child object
        Shape s2 = new Rectangle(3.0, 4.0);

        s1.describe();                      // common parent method
        System.out.println(s1.area());      // calls Circle.area()

        s2.describe();                      // common parent method
        System.out.println(s2.area());      // calls Rectangle.area()
    }
}
// Flow:
// 1) Both Circle and Rectangle share describe() but implement area() differently.
// 2) Polymorphism picks the right area() at runtime based on the actual object.

```


## What is super?

super is a keyword that lets a subclass talk to its parent (superclass):

* call a parent constructor → super(...)

* call a parent method → super.method(...)

* access a parent field → super.field

>Think: “from the child, reach up to the parent”.

### Rules to remember

* You can only use super inside instance context (not in static methods/blocks).

* super(...) (constructor call) must be the first statement in a constructor.

* If you don’t write any super(...), Java inserts super() (no-arg).  
If the parent doesn’t have a no-arg constructor, you must call some super(args) yourself.

* There is no super.super. You can only reach the direct parent. (But parent methods can reach their parent.)

## Access Parent Constructors with super(...)
   ### Default case (implicit super())
   ```java
class Animal {
    Animal() {                          // parent no-arg constructor
        System.out.println("Animal()");
    }
}

class Dog extends Animal {
    Dog() {                             // Java inserts: super();
        System.out.println("Dog()");
    }
}

public class Demo1 {
    public static void main(String[] args) {
        new Dog();
    }
}
// Flow / Output:
// Animal()   <-- implicit super() runs first
// Dog()
```
###  Parent has only a parameterized constructor → you must call super(args)
```java
class Animal {
    Animal(String species) {
        System.out.println("Animal(" + species + ")");
    }
}

class Dog extends Animal {
    Dog() {
        super("Canine");                // MUST be first line
        System.out.println("Dog()");
    }
}

public class Demo2 {
    public static void main(String[] args) {
        new Dog();
    }
}
// Flow / Output:
// Animal(Canine)  <-- explicit parent constructor
// Dog()
```

### Choose which parent constructor to call
```java
class Animal {
    Animal() { System.out.println("Animal()"); }
    Animal(String s) { System.out.println("Animal(" + s + ")"); }
}

class Dog extends Animal {
    Dog() {              // picks no-arg parent
        super();         // same as omitting it here
        System.out.println("Dog()");
    }
    Dog(String name) {   // picks param parent
        super("Canine");
        System.out.println("Dog(" + name + ")");
    }
}

public class Demo3 {
    public static void main(String[] args) {
        new Dog();
        new Dog("Buddy");
    }
}
// Output:
// Animal()
// Dog()
// Animal(Canine)
// Dog(Buddy)

```
>❗ Only one of this(...) or super(...) may appear, and it must be the first statement in the constructor.

### 3) Access Parent Methods with super.method(...)

Use this when you override a method but still want to reuse the parent’s version.
```java
class Logger {
    void log(String msg) {
        System.out.println("[BASE] " + msg);
    }
}

class FileLogger extends Logger {
    @Override
    void log(String msg) {                     // override parent method
        System.out.println("Opening file...");
        super.log(msg);                        // call parent implementation
        System.out.println("Closing file...");
    }
}

public class Demo4 {
    public static void main(String[] args) {
        Logger l = new FileLogger();           // polymorphism
        l.log("Hello");
    }
}
// Flow / Output:
// Opening file...
// [BASE] Hello        <-- parent code via super.log(msg)
// Closing file...
```

> Tip: Always use @Override to catch signature mistakes at compile time.

## 4) Access Parent Variables with super.field

If a child shadows (hides) a field from the parent, super.field reads the parent’s one.
```java
class Animal {
    int age = 5;                     // parent field
}

class Dog extends Animal {
    int age = 1;                     // child shadows the field (not override)
    void showAges() {
        System.out.println(age);         // 1  (child’s field)
        System.out.println(super.age);   // 5  (parent’s field)
    }
}

public class Demo5 {
    public static void main(String[] args) {
        new Dog().showAges();
    }
}
// Output:
// 1
// 5
```

> ### Access control still applies:

> private parent members are not directly accessible (even via super).

> protected and public can be accessed from subclasses (respecting package rules).

## 5) Putting it all together (constructor + method + field)
```java
class Vehicle {
    protected String name;                           // visible to subclasses

    Vehicle(String name) {
        this.name = name;
        System.out.println("Vehicle(" + name + ")");
    }

    void start() { System.out.println("Vehicle starting"); }
}

class Car extends Vehicle {
    protected String name = "ChildName";             // shadows parent field

    Car(String name) {
        super(name);                                 // call parent constructor first
        System.out.println("Car(" + name + ")");
    }

    @Override
    void start() {
        System.out.println("Car pre-checks");
        super.start();                               // call parent method
        System.out.println("Parent name = " + super.name);  // parent field
        System.out.println("Child  name = " + this.name);   // child field
    }
}

public class Demo6 {
    public static void main(String[] args) {
        Car c = new Car("Sedan");
        c.start();
    }
}
// Flow / Output:
// Vehicle(Sedan)            <-- parent constructor first
// Car(Sedan)
// Car pre-checks
// Vehicle starting          <-- parent method via super.start()
// Parent name = Sedan       <-- parent field
// Child  name = ChildName   <-- child field
```


## Method Overriding
Overriding lets a subclass provide its own implementation for a method already defined in its superclass.

### Why it matters

* Enables polymorphism (same call → different behavior at runtime).

* Lets subclasses specialize base behavior without changing the base class.

#### Syntax & rules (memorize)

* Same name, parameter list, and compatible return type (covariant return allowed).

* Access level cannot be more restrictive than the parent’s.

* Overriding method may throw fewer/narrower checked exceptions, not broader.

* Mark with @Override to catch mistakes.

> Not applicable to constructors, static, or private methods (static methods are hidden, not overridden; private aren’t inherited; final cannot be overridden).

example (with flow)
```JAVA
class Animal {
    public String sound() {                // base behavior
        return "generic sound";
    }
}

class Dog extends Animal {
    @Override
    public String sound() {                // override
        return "woof";
    }
}

public class OverridingDemo {
    public static void main(String[] args) {
        Animal a1 = new Animal();
        Animal a2 = new Dog();             // upcast to parent type

        System.out.println(a1.sound());    // "generic sound"
        System.out.println(a2.sound());    // "woof" (runtime dispatch chooses Dog)
    }
}
// Flow:
// 1) a2 references a Dog object.
// 2) a2.sound() calls Dog.sound() because dispatch happens at runtime by actual object.
```
### Overloading vs Overriding (quick contrast)
```Java
class Example {
    void f(int x) {}           // overload #1 (different params)
    void f(String s) {}        // overload #2
    // void f(int x) {}        // NOT allowed: same signature
}

class Parent { Number n() { return 0; } }
class Child extends Parent {
    @Override
    Integer n() { return 1; }  // OK: covariant return (Integer ⊂ Number)
}

Calling the parent version inside an override
class Base {
    void log(String m) { System.out.println("[BASE] " + m); }
}
class ChildBase extends Base {
    @Override
    void log(String m) {
        System.out.println("before");
        super.log(m);          // parent behavior
        System.out.println("after");
    }
}
```
## Constructor Chaining

* Within the same class: one constructor calls another using this(...).

* Across the hierarchy: child constructor calls a parent constructor using super(...).

### Why it matters

* Ensures proper initialization from the top (parent) to the bottom (child).

* Avoids duplicate init code by funneling through a single canonical constructor.

### Rules you can’t break

* this(...) or super(...) must be the first statement in a constructor (and you can use only one of them).

* If you don’t write any super(...), Java inserts super() (no-arg). If the parent has no no-arg constructor, you must call one explicitly.

* Initialization order on new Child():

   * Parent instance fields/initializers

   * Parent constructor

   * Child instance fields/initializers

   * Child constructor

### example: this(...) (same class)
```java
class Box {
    int w, h, d;

    Box() {
        this(1, 1, 1);                 // default → delegates to 3-arg ctor
        System.out.println("Box()");
    }
    Box(int size) {
        this(size, size, size);        // square → delegates to 3-arg ctor
        System.out.println("Box(int)");
    }
    Box(int w, int h, int d) {         // canonical constructor
        this.w = w; this.h = h; this.d = d;
        System.out.println("Box(int,int,int)");
    }
}

public class ThisChainDemo {
    public static void main(String[] args) {
        new Box();          // calls 0-arg → 3-arg
        new Box(5);         // calls 1-arg → 3-arg
    }
}
/*
Flow / Output:
Box(int,int,int)
Box()
Box(int,int,int)
Box(int)
*/
```
### example: super(...) (parent → child)
```java
class A {
    A() { System.out.println("A()"); }
    A(String x) { System.out.println("A(" + x + ")"); }
}

class B extends A {
    B() {
        super();                       // implicit even if omitted
        System.out.println("B()");
    }
    B(String y) {
        super("from B");               // pick a specific parent ctor
        System.out.println("B(" + y + ")");
    }
}

public class SuperChainDemo {
    public static void main(String[] args) {
        new B();
        new B("hello");
    }
}
/*
Flow / Output:
A()
B()
A(from B)
B(hello)
*/
```


### Multi-level chain (constructor order)
```java
class Top    { Top()    { System.out.println("Top");    } }
class Middle extends Top { Middle() { System.out.println("Middle"); } }
class Bottom extends Middle { Bottom() { System.out.println("Bottom"); } }

new Bottom();
// Output:
// Top
// Middle
// Bottom
// Flow: parent ctors always run before child ctors.

```

##### [Back To Contents](../../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|