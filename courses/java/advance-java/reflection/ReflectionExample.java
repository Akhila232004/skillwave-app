// File: ReflectionExample.java
// Package (optional): package reflectiondemo;

import java.lang.reflect.*;

// A sample class on which reflection will be applied
class Employee {
    private String name;
    private double salary;

    public Employee() {
        this.name = "Default";
        this.salary = 0.0;
    }

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    private void secretMethod() {
        System.out.println("This is a private method!");
    }

    public void showDetails() {
        System.out.println("Name: " + name + ", Salary: " + salary);
    }
}

public class ReflectionExample {

    public static void main(String[] args) throws Exception {

        // Obtain Class object
        Class<?> cls = Employee.class;

        System.out.println("=== Class Name ===");
        System.out.println(cls.getName());

        // -------------------------------
        // 1. LIST METHODS
        // -------------------------------
        System.out.println("\n=== Methods ===");
        Method[] methods = cls.getDeclaredMethods();
        for (Method m : methods) {
            System.out.println(m.getName());
        }

        // -------------------------------
        // 2. LIST FIELDS
        // -------------------------------
        System.out.println("\n=== Fields ===");
        Field[] fields = cls.getDeclaredFields();
        for (Field f : fields) {
            System.out.println(f.getName());
        }

        // -------------------------------
        // 3. CREATE OBJECT USING REFLECTION
        // -------------------------------
        System.out.println("\n=== Creating Object Dynamically ===");
        Object obj = cls.getDeclaredConstructor().newInstance();

        // -------------------------------
        // 4. ACCESS PRIVATE FIELD
        // -------------------------------
        System.out.println("\n=== Accessing Private Field ===");
        Field nameField = cls.getDeclaredField("name");
        nameField.setAccessible(true);       // allow private access
        nameField.set(obj, "Amit");

        Field salaryField = cls.getDeclaredField("salary");
        salaryField.setAccessible(true);
        salaryField.set(obj, 50000);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        // -------------------------------
        // 5. INVOKE PUBLIC METHOD
        // -------------------------------
        System.out.println("\n=== Invoking Public Method ===");
        Method showMethod = cls.getDeclaredMethod("showDetails");
        showMethod.invoke(obj);

        // -------------------------------
        // 6. INVOKE PRIVATE METHOD
        // -------------------------------
        System.out.println("\n=== Invoking Private Method ===");
        Method secret = cls.getDeclaredMethod("secretMethod");
        secret.setAccessible(true);
        secret.invoke(obj);
    }
}
