# 3 examples:

1️⃣ Basic user-defined package  
2️⃣ Importing classes from other packages  
3️⃣ Package + Access modifiers example  


## **Example 1: Creating a Simple Package**

### **File 1: `school/students/Student.java`**

```java
package school.students;   // package declaration

public class Student {
    public void display() {
        System.out.println("I am a Student");
    }
}
```

### **Compile**

```
javac -d . Student.java
```

### **Folder Structure Generated**

```
school/
   students/
      Student.class
```

---

## **Example 2: Importing a Class From Another Package**

### **File 2: `school/main/MainApp.java`**

```java
package school.main;

import school.students.Student;  // importing class from package

public class MainApp {
    public static void main(String[] args) {
        Student s = new Student();
        s.display();
    }
}
```

### **Compile**

```
javac -d . school/students/Student.java
javac -d . school/main/MainApp.java
```

### **Run**

```
java school.main.MainApp
```

### **Output**

```java
I am a Student
```

---

## **Example 3: Access Modifiers With Packages**

### **File 1: `pack1/Person.java`**

```java
package pack1;

public class Person {
    public String name = "John";
    protected int age = 30;
    String city = "Hyderabad";      // default access
    private String secret = "Hidden";

    public void showInfo() {
        System.out.println("Name: " + name);
        System.out.println("Age: "  + age);
        System.out.println("City: " + city);
        System.out.println("Secret: " + secret);
    }
}
```

---

### **File 2: `pack2/Employee.java`**

```java
package pack2;

import pack1.Person;

public class Employee extends Person {
    public void display() {
        System.out.println("Name: " + name);  // ✔ public
        System.out.println("Age: " + age);    // ✔ protected
        // System.out.println(city);          // ❌ default → NOT accessible
        // System.out.println(secret);        // ❌ private → NOT accessible
    }
}
```

---

### **File 3: `pack2/TestAccess.java`**

```java
package pack2;

public class TestAccess {
    public static void main(String[] args) {
        Employee e = new Employee();
        e.display();
    }
}
```

### **Output**

```java
Name: John
Age: 30
```

---

# **What These Examples Teach**

| Example   | Concept                                                                |
| --------- | ---------------------------------------------------------------------- |
| Example 1 | Creating your own package                                              |
| Example 2 | Importing and using classes from another package                       |
| Example 3 | Access modifiers across packages (public, protected, private, default) |

---

