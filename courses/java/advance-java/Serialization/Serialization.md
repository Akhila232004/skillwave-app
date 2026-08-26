# Object Serialization in Java

## Introduction

**Serialization** in Java is the process of converting an object into a **byte stream** so it can be:

* Saved to a file
* Sent over a network
* Stored and later reconstructed in memory or from storage

The reverse process — converting a byte stream back into an object — is called **Deserialization**.

In simple terms:

* **Serialization**: `Object → Bytes`
* **Deserialization**: `Bytes → Object`

All classes that need to be serialized must implement the `java.io.Serializable` interface.

## How Serialization Works

When an object is serialized:

* Its **state** (values of non-static, non-transient fields) is saved.
* Sufficient **type information** is captured so the JVM knows which class to reconstruct.
* The **class definition itself is not saved**; the target JVM must already have the class.

When deserializing:

* The JVM reads the bytes.
* Reconstructs an instance of the original class.
* Restores the field values from the stream.

**Important rules:**

* Only **non-static** and **non-transient** fields are serialized.
* If a field refers to another object, that object’s class must also implement `Serializable`, or the field must be marked `transient`.
* Entire **object graphs** can be serialized (objects and the objects they reference, and so on), as long as all are serializable.

## Platform Independence

Serialization in Java is **platform independent**:

* An object serialized on **one machine / OS / JVM** (e.g., Windows)
* Can be read and deserialized on **another machine / OS / JVM** (e.g., Linux)
* As long as the receiving JVM has a compatible version of the class.

This is why serialization is useful for distributed systems and networked applications.

## Where Is Serialization Used?

Some practical usage scenarios:

* **Sending objects over the network**

  * Remote Method Invocation (RMI)
  * HTTP-based remoting (e.g., some Spring remoting mechanisms)
* **Session replication** between clustered JVMs

  * User session objects are serialized and shared across servers.
* **Caching objects** to disk or in distributed caches.
* **Temporary persistence** of application state

  * Store objects in files and restore them later.

## The `Serializable` Interface

`Serializable` is a **marker interface** (it has no methods).
By implementing it, a class **declares** that its instances are allowed to be serialized.

```java
import java.io.Serializable;

public class Student implements Serializable {
    String name;
    int age;
    String course;
}
```

### What if a class is not Serializable?

If a class does **not** implement `Serializable`, and you try to serialize its object using `ObjectOutputStream.writeObject()`, the JVM will throw a `java.io.NotSerializableException`.

## Basic Serialization and Deserialization Example

This example shows how to:

1. Create a `Student` object
2. Serialize it to a file
3. Deserialize it from the file and print its data

```java
import java.io.*;

// Class must implement Serializable
class Student implements Serializable {
    String name;
    int age;
    String course;

    Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }
}

public class SerializationExample {
    public static void main(String[] args) {
        try {
            // 1. Create an object
            Student s1 = new Student("Alice", 21, "Computer Science");

            // 2. Serialize (write object to file)
            ObjectOutputStream out =
                    new ObjectOutputStream(new FileOutputStream("student.ser"));
            out.writeObject(s1);
            out.close();
            System.out.println("Object serialized successfully!");

            // 3. Deserialize (read object back)
            ObjectInputStream in =
                    new ObjectInputStream(new FileInputStream("student.ser"));
            Student s2 = (Student) in.readObject();
            in.close();

            System.out.println("Deserialized Object Data:");
            System.out.println("Name: " + s2.name);
            System.out.println("Age: " + s2.age);
            System.out.println("Course: " + s2.course);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

**Expected output:**

```text
Object serialized successfully!
Deserialized Object Data:
Name: Alice
Age: 21
Course: Computer Science
```

**Key points from this example:**

* `writeObject()` converts the object → byte stream and writes it to `student.ser`.
* `readObject()` reads bytes → reconstructs the original `Student` object.
* The file `student.ser` contains the serialized binary data.

## The `transient` Keyword

Sometimes, you don't want a particular field to be saved during serialization.
For example:

* Passwords or other sensitive data
* Temporary / calculated values (caches, timestamps, etc.)

Use the **`transient`** keyword to tell Java:

> “Skip this field when serializing.”

### Example: Using `transient` to Hide Sensitive Data

```java
import java.io.*;

// Class with transient field
class User implements Serializable {
    String username;
    transient String password;  // this field will NOT be serialized

    User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}

public class TransientExample {
    public static void main(String[] args) {
        try {
            User user1 = new User("admin", "secret123");

            // Serialize object
            ObjectOutputStream out =
                    new ObjectOutputStream(new FileOutputStream("user.ser"));
            out.writeObject(user1);
            out.close();
            System.out.println("User object serialized.");

            // Deserialize object
            ObjectInputStream in =
                    new ObjectInputStream(new FileInputStream("user.ser"));
            User user2 = (User) in.readObject();
            in.close();

            System.out.println("After Deserialization:");
            System.out.println("Username: " + user2.username);
            System.out.println("Password: " + user2.password); // will be null
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

**Expected output:**

```text
User object serialized.
After Deserialization:
Username: admin
Password: null
```

**Important points:**

* `password` is marked `transient`, so it is **not** saved to the file.
* After deserialization, `password` gets the **default value** for `String` → `null`.
* Great for hiding sensitive information like passwords, tokens, etc.

## Versioning and `serialVersionUID`

Over time, classes change:

* You add or remove fields
* You refactor code

If you serialize an object with an **old version** of the class and later try to deserialize it with a **new version**, you can get `InvalidClassException`.

Java uses an internal identifier called **`serialVersionUID`** to detect class version compatibility.

### Why define `serialVersionUID`?

* If you **do not** define it, the JVM generates one automatically, based on class details.
* Any small change to the class can change that generated value → making old serialized data incompatible.
* By **manually defining** `serialVersionUID`, you control compatibility across versions.

### Example: Declaring `serialVersionUID`

```java
import java.io.Serializable;

public class Employee implements Serializable {
    private static final long serialVersionUID = 1L;

    String name;
    double salary;

    // constructors, getters, setters, etc.
}
```
>No direct output. This is just a class definition with a fixed serialVersionUID.


**Key idea:**

* As long as the changes you make are compatible with old data, you can keep `serialVersionUID` the same.
* If you make breaking changes and want to **reject old serialized data**, you can change this value.

## Advantages of Java Serialization

* **Easy to use**
  Just implement `Serializable` and use `ObjectOutputStream` / `ObjectInputStream`.

* **Automatic handling of object graphs**
  If your object references other serializable objects, they are also serialized.

* **Built-in**
  No extra libraries required; fully supported by the standard JDK.

* **Works across platforms & JVMs**
  Serialize on one OS / machine, deserialize on another.

## Disadvantages / Limitations

* **Binary format is opaque**
  Serialized files are not human-readable and hard to inspect.

* **Not queryable**
  You cannot run queries (like SQL) directly on serialized data.

* **Tight coupling to Java classes**
  If you change your class structure, old serialized data might become incompatible.

* **Not ideal for long-term durable storage**
  For long-term, production-grade storage and reporting, databases (RDBMS / NoSQL) are better.

*  **Performance for large datasets**
  Serialization / deserialization can be relatively slow and memory-intensive for very large objects or collections.

## Alternatives to Java’s Native Serialization

For many real-world systems, especially those that must interact with other languages or need long-term storage, other options are preferred:

* **JSON**

  * Human-readable
  * Language-independent
  * Great for REST APIs and configs

* **XML**

  * Structured, widely supported
  * More verbose than JSON

* **Databases (RDBMS / NoSQL)**

  * Ideal for data that must be stored, queried, filtered, and reported on.

* **Other serialization formats**

  * **Protocol Buffers, Avro, Thrift**

    * Designed for efficiency and schema evolution
    * Often used in microservices and big data systems.


