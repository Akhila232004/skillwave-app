// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics - Lower Bounded Wildcards (? super)
//  Author       : Team Tinitiate
// ==============================================================================

package com.tinitiate.corejava.generics;

import java.util.*;

// File: LowerBound_EmployeesExample.java
// 🧠 Topic: Lower Bounded Wildcards (? super)
// Demonstrates adding subclass objects (Employees) into a supertype list safely.

// Use unique names so they don't clash with other demos
class LBPerson {
    String name;
    LBPerson(String name) { this.name = name; }
    public String toString() { return name; }
}

class LBEmployee extends LBPerson {
    LBEmployee(String name) { super(name); }
}

public class LowerBound_EmployeesExample {

    // Can add LBEmployee to any list of LBPerson or its supertype
    static void addEmployees(List<? super LBEmployee> list) {
        list.add(new LBEmployee("Alice"));
        list.add(new LBEmployee("Bob"));
        list.add(new LBEmployee("Charlie"));
    }

    public static void main(String[] args) {
        List<LBPerson> people = new ArrayList<>();
        List<Object> objects = new ArrayList<>();

        addEmployees(people);   // OK — List<LBPerson>
        addEmployees(objects);  // OK — List<Object>

        System.out.println("People List: " + people);
        System.out.println("Objects List: " + objects);
    }
}

/*
Expected Output:
People List: [Alice, Bob, Charlie]
Objects List: [Alice, Bob, Charlie]
*/
