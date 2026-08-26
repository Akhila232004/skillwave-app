# Java Reflection
##  What Is Reflection?

Reflection in Java is a powerful feature that allows a program to **inspect**, **analyze**, and **modify** classes, methods, fields, and constructors at **runtime**—even if you do not know their names at compile time.

Reflection is part of the package:

```java
import java.lang.reflect.*;
```

Reflection is mainly used for:

* Frameworks (Spring, Hibernate)
* Dependency Injection (DI) containers
* JSON/XML serializers
* Writing IDE tools and debuggers
* Class analyzers (IntelliJ, Eclipse internals)
* Unit testing frameworks (JUnit)

## Why Use Reflection?

Reflection enables:

1. **Inspecting a class at runtime**

   * List methods, fields, constructors
2. **Invoking methods dynamically**
3. **Accessing private fields or methods**
4. **Creating objects without using `new`**
5. **Building reusable frameworks**

##  Limitations of Reflection

Reflection:

* Is **slower** (bypasses normal JVM optimizations)
* Can **break encapsulation** (access private data)
* Should be used only when necessary (framework/library code)

# 1. Getting Class Information

Everything begins with a `Class` object.

### Ways to obtain a Class object:

```java
Class<?> c1 = Class.forName("mypackage.Employee");   // using class name
Class<?> c2 = Employee.class;                        // using .class
Employee e = new Employee();
Class<?> c3 = e.getClass();                          // using object
```

# 2. Getting Class Details

### ✔ Get class name

```java
System.out.println(c1.getName());         // fully-qualified name
System.out.println(c1.getSimpleName());   // only class name
```

### ✔ Get fields

```java
Field[] fields = c1.getDeclaredFields();
```

### ✔ Get methods

```java
Method[] methods = c1.getDeclaredMethods();
```

### ✔ Get constructors

```java
Constructor<?>[] cons = c1.getDeclaredConstructors();
```

# Example: Listing All Methods of a Class

```java
import java.lang.reflect.*;

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {

        Class<?> cls = Class.forName("mypackage.Employee");

        Method[] methods = cls.getDeclaredMethods();

        System.out.println("Methods:");
        for (Method m : methods) {
            System.out.println(m.getName());
        }
    }
}
```

# 3. Creating Objects Using Reflection

You can create objects without using `new`.

```java
Class<?> cls = Class.forName("mypackage.Employee");

Object obj = cls.getDeclaredConstructor().newInstance();
```

# 4. Accessing Fields Dynamically

```java
Field f = cls.getDeclaredField("salary");
f.setAccessible(true);    // allow access to private field
f.set(obj, 50000);        // update value

System.out.println(f.get(obj)); // read value
```

# 5. Invoking Methods Dynamically

```java
Method m = cls.getDeclaredMethod("setName", String.class);
m.invoke(obj, "Amit");   // pass argument
```

To call a method without parameters:

```java
Method m2 = cls.getDeclaredMethod("getName");
Object result = m2.invoke(obj);
```

# Full Mini Example: Reflecting a Class

```java
class Person {
    private String name = "John";
    public int age = 30;

    public void sayHello() {
        System.out.println("Hello!");
    }
}

public class ReflectionExample {
    public static void main(String[] args) throws Exception {

        Class<?> cls = Person.class;

        Object obj = cls.getDeclaredConstructor().newInstance();

        // Access private field
        Field nameField = cls.getDeclaredField("name");
        nameField.setAccessible(true);
        nameField.set(obj, "Ravi");

        // Invoke method
        Method m = cls.getDeclaredMethod("sayHello");
        m.invoke(obj);

        // Print field value
        System.out.println("Name: " + nameField.get(obj));
    }
}
```

**Output:**

```
Hello!
Name: Ravi
```
