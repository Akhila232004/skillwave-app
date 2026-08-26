// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics  Lower Bounded Wildcards (? super)
//  Author       : Team Tinitiate
// ==============================================================================



// File: LowerBound_EmployeesExample.java
// 🧠 Topic: Lower Bounded Wildcards (? super)
// Demonstrates adding subclass objects (Employees) into a supertype list safely.

import java.util.*;

class Person {
    String name;
    Person(String name) { this.name = name; }
    public String toString() { return name; }
}

class Employee extends Person {
    Employee(String name) { super(name); }
}

public class LowerBound_EmployeesExample {

    // Can add Employees to any list of Person or its supertype
    static void addEmployees(List<? super Employee> list) {
        list.add(new Employee("Alice"));
        list.add(new Employee("Bob"));
        list.add(new Employee("Charlie"));
    }

    public static void main(String[] args) {
        List<Person> people = new ArrayList<>();
        List<Object> objects = new ArrayList<>();

        addEmployees(people);  // OK — List<Person>
        addEmployees(objects); // OK — List<Object>

        System.out.println("People List: " + people);
        System.out.println("Objects List: " + objects);
    }
}

/*
Expected Output:
People List: [Alice, Bob, Charlie]
Objects List: [Alice, Bob, Charlie]
*/
