# **Java Annotations**

## 1. What Are Annotations?

Annotations in Java are **metadata**—extra information added to classes, methods, fields, parameters, and packages.

Annotations:

* **Do NOT affect code execution directly**
* Provide **instructions** to the compiler / JVM / frameworks
* Improve **readability** and **reduce boilerplate**
* Are heavily used in frameworks like **Spring, Hibernate, JPA, JUnit**

Annotations were introduced in **Java 5**.

## 2. Why Use Annotations?

Annotations are used for:

### 1. Compiler Instructions

Tell the compiler to check something
(e.g., `@Override`, `@SuppressWarnings`)

### 2. Runtime Processing (Reflection)

Frameworks use annotations to read metadata at runtime:

* Spring DI → `@Autowired`
* JPA → `@Entity`, `@Table`
* JUnit → `@Test`

### 3. Code Generation

Tools generate code from annotations:

* Lombok → `@Getter`, `@Setter`
* Java Records use implicit annotations

## 3. Where Can You Apply Annotations?

Annotations can be applied on:

* Classes
* Methods
* Fields
* Constructors
* Method parameters
* Local variables
* Packages
* Modules

Example:

```java
@Override
public String toString() { ... }
```
# 4. Built-In Java Annotations

Java provides several built-in annotations.

## @Override

Indicates a method overrides a superclass method.

```java
class Parent {
    void show() {}
}

class Child extends Parent {
    @Override
    void show() { }
}
```

Compiler checks if method really overrides a parent method.

<!-- ## @Deprecated

Marks a method/class as "not recommended for use".

```java
@Deprecated
void oldMethod() { }
``` -->
## Java `@Deprecated` Annotation

The `@Deprecated` annotation indicates that a **method, class, or field** should **no longer be used**.
It gives a **warning** to developers because it may be removed in a future release.

#### Example

```java
class Demo {

    @Deprecated
    public void oldMethod() {
        System.out.println("This method is deprecated.");
    }

    public void newMethod() {
        System.out.println("Use this method instead.");
    }

    public static void main(String[] args) {
        Demo d = new Demo();
        d.oldMethod(); // IDE/compiler will show a warning
    }
}
```

## Java `@SuppressWarnings` Annotation

`@SuppressWarnings` is used to **hide specific compiler warnings** when you know the code is safe.

#### Example

```java
import java.util.ArrayList;

class Demo {

    @SuppressWarnings("unchecked")
    public void test() {
        ArrayList list = new ArrayList();   // raw type warning normally
        list.add("Java");
    }
}
```

## Java `@FunctionalInterface` Annotation

`@FunctionalInterface` is used on an interface to ensure it has **exactly one abstract method**.
This makes it usable with **lambda expressions**.

#### Example

```java
@FunctionalInterface
interface Printer {
    void print();   // only one abstract method allowed
}

class Demo {
    public static void main(String[] args) {

        Printer p = () -> System.out.println("Printing...");
        p.print();
    }
}
```

## Java `@SafeVarargs` Annotation

`@SafeVarargs` is used to **suppress warnings** that come when you use **var-args (`...`) with generics**.
It tells the compiler: *“This method does not do unsafe operations with the var-args parameter.”*

Can be used only on **`final`**, **`static`**, or **`private`** methods/constructors.

#### Example

```java
class Demo {

    @SafeVarargs
    private static <T> void printAll(T... values) {
        for (T v : values) {
            System.out.println(v);
        }
    }

    public static void main(String[] args) {
        printAll("Java", "Spring", "Hibernate");
        printAll(10, 20, 30);
    }
}
```

## @Retention

Specifies **how long** the annotation is available.

```java
@Retention(RetentionPolicy.RUNTIME)
```

Policies:

| RetentionPolicy | Meaning                                   |
| --------------- | ----------------------------------------- |
| SOURCE          | removed at compile time                   |
| CLASS           | in class file, not available at runtime   |
| RUNTIME         | available at runtime (used by frameworks) |

## @Target

Specifies where the annotation can be placed.

```java
@Target(ElementType.METHOD)
```

Common targets:

* TYPE (class/interface)
* METHOD
* FIELD
* CONSTRUCTOR
* PARAMETER
* PACKAGE

## @Documented

`@Documented` is a **meta-annotation** (an annotation used on another annotation).
It controls whether your **custom annotation** will be included in the **generated Javadoc**.

* If an annotation is marked with `@Documented`, then whenever you generate Javadoc for a class/method/field using that annotation, the annotation details will also appear in the documentation.
* If `@Documented` is not used, the annotation will still work normally in code, but it **won’t be shown in Javadoc output**.

**Purpose**: Helps API users and developers clearly see important annotations in official documentation (like `@Deprecated`, `@Override` style visibility in docs).
annotation appear in Javadoc.

## @Inherited 
`@Inherited` is a **meta-annotation** used on a **custom annotation** to allow it to be **inherited by child classes**.

That means:

* If a **parent class** has an annotation,
* and that annotation type is marked with `@Inherited`,
* then the **child class automatically gets the same annotation** (when you read it using reflection).

#### Important points 

* Works only for **class-level annotations** (`ElementType.TYPE`)
*  Does **not** apply to **methods, fields, constructors**, etc.
* Works only through **class inheritance** (`extends`)
* Does not work for annotations on interfaces in the same way

 Purpose: Useful when you want a common annotation on a base class to automatically apply to all subclasses (example: framework base configuration, security roles, etc.).

# 5. Creating Your Own (Custom) Annotation

## Step 1: Define annotation using @interface

```java
@interface MyAnnotation {
    String author();
    int version() default 1;
}
```

## Step 2: Apply annotation

```java
@MyAnnotation(author="Tinitiate", version=2)
class Demo {
    @MyAnnotation(author="Admin", version=1)
    public void display() { }
}
```

# 6. Processing Annotations Using Reflection

(How frameworks like Spring & Hibernate work)

```java
public class AnnotationReader {

    public static void main(String[] args) throws Exception {

        Class<?> cls = Class.forName("Demo");

        // Read class annotation
        MyAnnotation ann = cls.getAnnotation(MyAnnotation.class);
        System.out.println(ann.author());
        System.out.println(ann.version());

        // Read method annotations
        Method m = cls.getMethod("display");
        MyAnnotation mAnn = m.getAnnotation(MyAnnotation.class);

        System.out.println(mAnn.author());
    }
}
```

# 7. Meta-Annotations

(Annotations used on other annotations)

| Meta-Annotation | Purpose                                  |
| --------------- | ---------------------------------------- |
| @Target         | Where annotation can be used             |
| @Retention      | How long it is retained                  |
| @Documented     | Include in Javadoc                       |
| @Inherited      | Subclass inherits annotation             |
| @Repeatable     | Allows multiple annotations of same type |

# 8. Example: Complete Custom Annotation with Meta-Annotations

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@interface Info {
    String createdBy();
    String purpose() default "General";
}

@Info(createdBy="Tinitiate", purpose="Learning Custom Annotations")
class Test {

    @Info(createdBy="Admin", purpose="Demo Method")
    public void show() { }
}
```

# 9. Real-World Use Cases of Annotations

###  Spring Framework

```java
@Component
@Autowired
@RequestMapping
```

###  JPA/Hibernate

```java
@Entity
@Table(name="employees")
@Id
@Column
```

###  JUnit

```java
@Test
@BeforeEach
```

###  Lombok

```java
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
```

###  Android

```java
@NonNull
@UiThread
```

# 10. Advantages & Disadvantages of Annotations

###  Advantages

* Reduce boilerplate code
* Cleaner configuration
* Framework-friendly
* Compiler-level checking
* Metadata available at runtime

###  Disadvantages

* Excessive use makes code harder to read
* Too much magic → debugging is harder
* Runtime processing may cause overhead
* Not always intuitive for beginners
