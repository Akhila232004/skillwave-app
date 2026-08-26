
# Polymorphism 
## 1) What is Polymorphism?

Polymorphism means “many forms.” In OOP, you write code that calls a method using a general type (like a superclass or an interface), and different actual objects can respond in their own way.

* Why it matters: lets you swap implementations without changing the calling code (clean, extensible design).

* Two main kinds in Java:

   * 1. Compile-time polymorphism → Method Overloading

   * 2. Runtime polymorphism → Method Overriding

## 2) Types of Polymorphism

* Compile-time (Static) Polymorphism   
The compiler chooses which method version to call based on method signature (name + parameter types/count) at compile time. Achieved via overloading.

* Runtime (Dynamic) Polymorphism  
The JVM chooses which implementation to run based on the actual object at runtime, even if the reference is of a parent/interface type. Achieved via overriding.

## 3) Compile-time Polymorphism — Method Overloading
Theory

* Same method name, different parameter lists (type, number, or order).

* Decided by the compiler.

* Return type alone does not overload a method.

* You can also overload constructors.
```java
// Syntax pattern
class MathOps {
  int   sum(int a, int b) { return a + b; }        // (int, int)
  long  sum(long a, long b) { return a + b; }      // (long, long)
  int   sum(int a, int b, int c) { return a+b+c; } // (int, int, int)
  double sum(double a, double b) { return a + b; } // (double, double)
}
```

```java
// example 
class Greeter {
  void hello() {                         // 1) no args
    System.out.println("Hello!");
  }
  void hello(String name) {              // 2) one String
    System.out.println("Hello, " + name);
  }
  void hello(String name, int times) {   // 3) two params
    for (int i = 0; i < times; i++) 
    System.out.println("Hello, " + name);
  }
}

class Demo {
  public static void main(String[] args) {
    Greeter g = new Greeter();
    g.hello();                // calls #1 (matched by signature)
    g.hello("Asha");          // calls #2
    g.hello("Asha", 2);       // calls #3
  }
}
```

> The compiler picks the correct hello based on the parameter list used.

## 4) Runtime Polymorphism — Method Overriding


* A subclass provides its own implementation of a superclass/interface method with the same signature.

* Which method runs is decided at runtime based on the object’s actual type (dynamic dispatch).

* Mark with @Override (helps the compiler catch mistakes).

#### Core rules (most useful ones)

* Signature must match (name + parameter list).

* Access level can become more accessible (e.g., protected → public), not less.

* Can throw fewer/narrower checked exceptions.

* Return type can be covariant (a more specific type than the parent’s return).

* static, final, and private methods are not overridden:

  * static is hidden, not overridden.

  * final cannot be changed.

  * private isn’t inherited.

```java
// Syntax pattern
class Parent {
  void speak() { 
    System.out.println("Parent speaking"); 
    }
}

class Child extends Parent {
  @Override
  void speak() { System.out.println("Child speaking"); }
}
```
Classic example: Shape drawing
```java
abstract class Shape {
  abstract void draw(); // contract: each shape must explain how to draw itself
}

class Circle extends Shape {
  @Override
  void draw()
   { 
    System.out.println("Drawing a circle");
   }
}

class Rectangle extends Shape {
  @Override
  void draw() 
  { 
    System.out.println("Drawing a rectangle");
  }
}

class Painter {
  static void paint(Shape s) {  // works with any Shape
    s.draw();                   // runtime decides which draw() runs
  }

  public static void main(String[] args) {
    Shape a = new Circle();     // reference type = Shape, object = Circle
    Shape b = new Rectangle();  // reference type = Shape, object = Rectangle
    paint(a); // "Drawing a circle"
    paint(b); // "Drawing a rectangle"
  }
}
```

> The same call s.draw() behaves differently depending on the actual object (Circle or Rectangle).

# Overloading vs Overriding — Quick Comparison

| Aspect                | Overloading (Compile-time)                                   | Overriding (Runtime)                                  |
|-----------------------|---------------------------------------------------------------|--------------------------------------------------------|
| **When decided**      | Compile time                                                  | Runtime (dynamic dispatch)                             |
| **Where used**        | Same class (or parent + child both can overload)              | Subclass provides new implementation of parent/interface |
| **Signature**         | Different parameters (type/count/order)                       | Same method signature                                  |
| **Return type only?** | ❌ Not sufficient                                             | ✅ May be **covariant** (more specific)                |
| **static/final/private** | Can be **overloaded**                                     | Not overridden (**static** is hidden; **final/private** no) |


## Polymorphism — Rules & Dynamic Dispatch 
### 1) Method Overloading — Rules (Compile-time Polymorphism)

Idea: Same method name, different parameter list (type/count/order). The compiler decides which one to call based on the argument types it sees at compile time.

### Core Rules

* Signature must differ by parameters (type, number, or order).
* Return type alone is not enough.

* Access modifiers can vary (no restriction for overloading).

* Exceptions do not matter for overloading.

* Resolution priority (roughly):  
Exact match → primitive widening (e.g., int → long) → boxing (int → Integer) → varargs (int...).

* Overloading works within the same class; a subclass can also add more overloads.

Minimal Example (notes in comments)
```java
class Printer {
  void print(int x)        { System.out.println("int"); }
  void print(long x)       { System.out.println("long"); }
  void print(Integer x)    { System.out.println("Integer"); }
  void print(Object x)     { System.out.println("Object"); }
  void print(int... xs)    { System.out.println("varargs"); }

  static void demo() {
    Printer p = new Printer();
    p.print(5);            // exact int -> calls print(int)               => "int"
    p.print(5L);           // exact long -> calls print(long)             => "long"
    p.print((Integer)5);   // exact Integer -> calls print(Integer)       => "Integer"
    p.print('A');          // char widens to int -> calls print(int)      => "int"
    p.print(5.0);          // double -> no exact; matches Object best     => "Object"
    p.print();             // no args -> matches varargs                   => "varargs"
  }
}
```
### Ambiguity with null
```java
class Ambiguity {
  void f(String s) {}
  void f(StringBuilder sb) {}

  static void demo() {
    Ambiguity a = new Ambiguity();
    // a.f(null); // ❌ Compile error: ambiguous (both are equally specific)
    a.f((String) null);       // ✅ choose explicitly with a cast
  }
}
```
### 2) Method Overriding — Rules (Runtime Polymorphism)

Idea: A subclass provides its own implementation of a method defined in a superclass or interface. The JVM decides which implementation to run at runtime, based on the actual object.

#### Core Rules

* Same signature (name + parameter list). Use @Override to catch mistakes.

* Access cannot be reduced (e.g., parent public → child must stay public).

* Checked exceptions: child can throw fewer/narrower checked exceptions than the parent declaration (or none).

* Covariant returns: child may return a more specific type.

* Not overridable: static, final, and private methods.

   * static methods are hidden (chosen by reference type), not overridden.

Example (covariant return + narrower exception)
```java
class Animal {
  Animal copy() /* throws Exception (imagine) */ { return new Animal(); }
  void speak() { System.out.println("Animal"); }
}

class Dog extends Animal {
  @Override
  Dog copy() { return new Dog(); }  // covariant return (Dog ⊂ Animal)
  @Override
  void speak() { System.out.println("Dog"); } // runtime behavior changes
}
```
### 3) Dynamic Method Dispatch (Runtime Binding)

Idea: When you call an overridden method through a base type reference, the JVM picks the method of the actual object at runtime.

* Works for instance methods (virtual by default in Java).

* Does not apply to fields or static methods.

* Overloading resolution happens first at compile time, then overriding decides which body runs at runtime.

Classic Example — dispatch vs overloading
```java
abstract class Shape { abstract void draw(); }

class Circle extends Shape {
  @Override void draw() { System.out.println("Draw Circle"); }
}
class Rectangle extends Shape {
  @Override void draw() { System.out.println("Draw Rectangle"); }
}

class Painter {
  // Overloaded methods (compile-time choice):
  void paint(Shape s)    { System.out.print("paint(Shape): ");    s.draw(); }
  void paint(Circle c)   { System.out.print("paint(Circle): ");   c.draw(); }
  void paint(Rectangle r){ System.out.print("paint(Rectangle): ");r.draw(); }

  static void demo() {
    Painter p = new Painter();

    Shape a = new Circle();       // reference type Shape, object Circle
    Shape b = new Rectangle();    // reference type Shape, object Rectangle

    p.paint(a); // ➜ Overloading chooses paint(Shape) (because 'a' is Shape at compile time).
                // Inside, overriding calls Circle.draw() at runtime:
                // Output: "paint(Shape): Draw Circle"

    p.paint(b); // ➜ "paint(Shape): Draw Rectangle"

    Circle c = new Circle();
    p.paint(c); // ➜ Overloading chooses paint(Circle) (compile time knows it's Circle)
                // Inside, overriding still calls Circle.draw():
                // Output: "paint(Circle): Draw Circle"
  }
}
```

Key lesson:

* Which overload is called is decided by the reference’s compile-time type.

* Which override runs is decided by the object’s runtime type.

Fields & static methods are NOT polymorphic
```java
class Parent {
  static void s() { System.out.println("Parent.s"); }
  int x = 10;
  void who() { System.out.println("Parent"); }
}
class Child extends Parent {
  static void s() { System.out.println("Child.s"); } // hides, not overrides
  int x = 20;                                       // hides field
  @Override void who() { System.out.println("Child"); }
}

class Demo {
  public static void main(String[] args) {
    Parent ref = new Child();

    ref.who();   // ✅ overridden instance method -> "Child" (runtime type wins)
    ref.s();     // ⚠️ static method -> "Parent.s" (reference type wins)
    System.out.println(ref.x); // ⚠️ field -> 10 (reference type's field)
  }
}
```
### Constructor caution

Don’t call overridable methods from constructors—dynamic dispatch may hit a child method before the child’s fields are initialized, leading to NPEs or partial state.


##### [Back To Contents](../../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|