// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.classesobjects;

/**
 * WHAT THIS CODE IS ABOUT
 * -----------------------
 * *Parameterized constructors* let you pass values while creating objects.
 * You can also have multiple constructors (overloading) for flexible creation.
 */
class Person {
    String name;
    int age;

    // 1) constructor with just name (age will be 0)
    Person(String name) {
        // call the other constructor in the SAME class (constructor chaining)
        this(name, 0);    // 'this(...)' must be the FIRST statement inside a constructor
    }

    // 2) constructor with name AND age
    Person(String name, int age) {
        this.name = name; // 'this.name' refers to the field
        this.age = age;   // 'age' on the right is the parameter
    }

    void show() {
        System.out.println("Person(name=" + name + ", age=" + age + ")");
    }
}

public class ParameterizedConstructor_Basics {
    public static void main(String[] args) {
        Person p1 = new Person("Ravi");        // uses constructor #1; age becomes 0
        Person p2 = new Person("Priya", 28);   // uses constructor #2

        p1.show();
        p2.show();
    }
}
