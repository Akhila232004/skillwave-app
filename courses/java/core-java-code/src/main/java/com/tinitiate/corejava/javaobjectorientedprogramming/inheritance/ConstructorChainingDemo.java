// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Constructor Chaining Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.inheritance;

public class ConstructorChainingDemo {
    public static void main(String[] args) {
        new StudentChaining("Asha", 20);
    }
}

// Parent class
class BasePerson {
    BasePerson() {
        System.out.println("BasePerson: default constructor");
    }

    BasePerson(String name) {
        System.out.println("BasePerson: name = " + name);
    }
}

// Child class
class StudentChaining extends BasePerson {
    StudentChaining() {
        // Calls BasePerson()
        super();
        System.out.println("StudentChaining: default constructor");
    }

    StudentChaining(String name, int age) {
        // Calls StudentChaining()
        this();
        System.out.println("StudentChaining: name = " + name + ", age = " + age);
    }
}
