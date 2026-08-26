# **Java Packages – Complete Theory**

## **1. What Is a Package in Java?**

A **package** in Java is a **container** that groups related classes, interfaces, enums, and sub-packages.

It works like a **folder** inside your computer that organizes files.

### Purpose of Packages:

1. **Organize Classes Logically**
   Example:

   * `java.util` → utility classes
   * `java.io` → input/output classes
2. **Avoid Name Conflicts**
   Two classes with the same name can exist in different packages.
   Example:

   * `java.util.Date`
   * `java.sql.Date`
3. **Enhanced Access Control**
   Packages support access levels (`public`, `protected`, default).
4. **Reusable Code Structure**
   Libraries and large applications use packages to manage huge codebases.

---

## **2. Types of Packages**

### **1. Built-in (Standard) Packages**

Provided by Java.
Examples:

* `java.lang` (String, Math, System) → auto imported
* `java.util` (Collections, Scanner, Date)
* `java.io` (File, InputStream, OutputStream)
* `java.net` (Networking classes)

### **2. User-Defined Packages**

Created by developers for project structure.

Example:

```
package com.tinitiate.corejava;
```

---

## **3. How to Create a Package**

Every Java file can optionally start with:

```java
package packageName;
```

### Example:

File: `Student.java`

```java
package school.students;

public class Student {
    public void display() {
        System.out.println("Student Class");
    }
}
```

### Directory Structure:

```
src/
 └── school/
      └── students/
            └── Student.java
```

**The folder name must match the package name.**

---

## **4. Using `import` to Access Other Packages**

### Syntax:

```java
import packageName.ClassName;
```

or

```java
import packageName.*;
```

### Example:

```java
import java.util.Scanner;
```

### Why `import` is needed?

Because classes are in different packages. Without import, that class is not visible.

---

## **5. Default Package**

If no package is declared, the class belongs to the **default package** (unnamed package).

Example:

```java
public class Test { }
```

> ⚠ **Default package classes cannot be imported into other packaged classes.**
Avoid using default package in real projects.

---

## **6. Access Modifiers and Packages**

Access level when using packages:

| Access Modifier          | Same Class | Same Package | Subclass (Different Package) | Different Package |
| ------------------------ | ---------- | ------------ | ---------------------------- | ----------------- |
| **public**               | ✔          | ✔            | ✔                            | ✔                 |
| **protected**            | ✔          | ✔            | ✔                            | ❌                 |
| **default (no keyword)** | ✔          | ✔            | ❌                            | ❌                 |
| **private**              | ✔          | ❌            | ❌                            | ❌                 |

### Important Points:

* **default** members are package-private.
* **protected** works in subclasses even across packages.
* **private** is only inside class.

---

## **7. Sub-Packages**

A sub-package is simply a package inside another package.
Java does NOT treat them as parent-child relationship; each package is independent.

Example:

```java
com.tinitiate
com.tinitiate.corejava
```
They require separate folder structures.

---
## **8. Compiling and Running Packages**

### Compile:

```java
javac -d . Student.java
```

`-d .` creates directories automatically based on package name.

### Run:

```java
java school.students.Student
```
---
## **9. Why Use Packages in Real Projects?**

✔ Makes code modular and maintainable   
✔ Helps large teams work without class name conflicts  
✔ Ensures clear project structure  
✔ Supports access control (security)  
✔ Essential for creating libraries (.jar files)  

---
