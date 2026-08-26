// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


// File: MethodRef_ConstructorExample.java
// Demonstrates: Creating objects using a constructor reference (ClassName::new)

import java.util.function.Supplier;

class Student {
    Student() {
        System.out.println("A new Student object is created!");
    }
}

public class MethodRef_ConstructorExample {
    public static void main(String[] args) {
        // Using constructor reference
        Supplier<Student> studentSupplier = Student::new;

        studentSupplier.get(); // creates new Student
        studentSupplier.get(); // creates another Student
    }
}

/*
Expected Output:
A new Student object is created!
A new Student object is created!
*/
