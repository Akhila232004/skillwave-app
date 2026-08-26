# Classes & Objects
## Defining a Class

* A class is a blueprint that groups data (fields) and behavior (methods) under one name. 

* A class is a user-defined type that groups:

* Fields (also called members/attributes) → hold state (data).

* Methods → define behavior (what objects can do).
All objects created from the class share the same behavior (methods) but each object keeps its own state (its own field values).
```java
Example

// A simple class blueprint named Car
public class Car {
    // fields (state)
    private String model;   // holds the model name
    private int speed;      // holds current speed

    // method (behavior)
    public void honk() {             // no return value (void)
        System.out.println("Beep!"); // action performed by objects of Car
    }
}
```
## Creating Objects

An object is a real instance created from a class using new. Each object has its own copy of fields.
```java
Example

public class Main {
    public static void main(String[] args) {
        Car c1 = new Car();   // creates a new Car object; c1 refers to it
        Car c2 = new Car();   // another independent Car object

        c1.honk();            // calls honk on c1
        c2.honk();            // calls honk on c2 (separate object)
    }
}
```
Methods

Methods define actions a class’s objects can perform or computations they can return.
```java
Example

public class MathBox {
    // method with a return type (int) and a parameter (x)
    public int square(int x) {
        // computes and returns x*x to the caller
        return x * x;
    }

    // method with no return value
    public void printHello() {
        System.out.println("Hello");
    }
}
```
## Declaration & Calling

Declare a method inside a class, then call it using an object reference and dot (.).
```java
Syntax

// Declaration: <access> <returnType> <name>(<params>) { ... }
public String greet(String name) {
    return "Hi, " + name;
}
```

## Calling
```java
public class Main {
    public static void main(String[] args) {
        MathBox mb = new MathBox();        // create an object
        int s = mb.square(5);              // call: object.method(args)
        System.out.println(s);             // prints 25

        String msg = mb.greet("Ravi");     // call another method
        System.out.println(msg);           // prints "Hi, Ravi"
    }
}
```
### Parameters & Return Types

Methods can accept parameters (inputs) and optionally return a value.
```java
Example

public class BankAccount {
    private int balance = 0;

    // parameter: amount; return type: void (no value returned)
    public void deposit(int amount) {
        // add amount to balance
        balance = balance + amount;
    }

    // no parameters; returns current balance as an int
    public int getBalance() {
        return balance; // handed back to the caller
    }
}

class Main {
    public static void main(String[] args) {
        BankAccount a = new BankAccount();
        a.deposit(500);                    // pass 500 as parameter
        int b = a.getBalance();            // receive returned int
        System.out.println(b);             // prints 500
    }
}
```
## Constructors

A constructor sets up a new object. Its name matches the class name and it has no return type.
```java
Example

public class Point {
    private int x;
    private int y;

    // constructor runs automatically when 'new Point(...)' is used
    public Point(int xValue, int yValue) {
        x = xValue;   // initialize field x
        y = yValue;   // initialize field y
    }
}
```
## Default Constructor

If you don’t write any constructor, Java provides a no-argument default constructor that does nothing special. You can also write your own no-arg constructor.
```java
Example

public class User {
    String name;

    // explicit no-arg (default) constructor
    public User() {
        name = "Guest"; // set a default value
    }
}

class Main {
    public static void main(String[] args) {
        User u = new User();                 // calls the no-arg constructor
        System.out.println(u.name);          // prints "Guest"
    }
}
```
## Parameterized Constructor

A constructor with parameters lets you create initialized objects in one step.
```java
Example

public class Rectangle {
    int width;
    int height;

    // parameterized constructor
    public Rectangle(int w, int h) {
        width  = w;   // initialize width with argument w
        height = h;   // initialize height with argument h
    }
}

class Main {
    public static void main(String[] args) {
        Rectangle r = new Rectangle(10, 5);  // set fields via parameters
        System.out.println(r.width * r.height); // prints 50
    }
}
```
## Access Modifiers (public, private, protected, default)

- Access modifiers control visibility of classes/members.

- public: accessible from anywhere.

- private: accessible only inside the same class.

- protected: accessible in the same package and in subclasses.

- default (no modifier): accessible in the same package.

```java
Example

public class Person {
    public String name;        // can be accessed from any class
    private int age;           // only inside Person
    protected String city;     // same package + subclasses
    String note;               // default (package-private)

    public void setAge(int a) {
        age = a;               // allowed: same class
    }

    public int getAge() {
        return age;            // allowed: same class
    }
}

class Demo {
    public static void main(String[] args) {
        Person p = new Person();
        p.name = "Asha";       // OK: public
        // p.age = 25;         // NOT OK: private (uncommenting causes error)
        p.setAge(25);          // OK via public method
        p.city = "Hyderabad";  // OK if Demo is in same package or subclass
        p.note = "Student";    // OK if Demo is in same package (default)
    }
}
```
## this keyword

this refers to the current object. Use it to access the current object’s fields/methods, especially when parameter names shadow field names.
```java
Example

public class Laptop {
    private String brand;
    private int ramGB;

    // parameter names intentionally match field names (brand, ramGB)
    public Laptop(String brand, int ramGB) {
        this.brand = brand;  // 'this.brand' = field; 'brand' = parameter
        this.ramGB = ramGB;  // assigns parameter to the field
    }

    public void show() {
        // 'this' calls the current object's method/fields
        System.out.println(this.brand + " - " + this.ramGB + " GB");
    }
}

class Main {
    public static void main(String[] args) {
        Laptop l = new Laptop("Lenovo", 16); // calls parameterized constructor
        l.show();                            // prints "Lenovo - 16 GB"
    }
}
```

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|