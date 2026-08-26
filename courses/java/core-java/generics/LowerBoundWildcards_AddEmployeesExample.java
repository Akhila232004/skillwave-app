// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics  Lower Bounded Wildcards (? super T)
//  Author       : Team Tinitiate
// ==============================================================================




// File: LowerBoundWildcards_AddEmployeesExample.java
// 🧠 Topic: Lower Bounded Wildcards (? super T)
// Demonstrates safely adding subclass objects (Employees) into a list of any supertype (Person or Object).

import java.util.*;

// Base class
class Person {
    String name;
    Person(String name) { this.name = name; }

    public String toString() {
        return "Person: " + name;
    }
}

// Subclass
class Employee extends Person {
    Employee(String name) { super(name); }

    public String toString() {
        return "Employee: " + name;
    }
}

public class LowerBoundWildcards_AddEmployeesExample {

    // Method that accepts a list of Person or its supertype
    static void addEmployees(List<? super Employee> people) {
        people.add(new Employee("Alice"));
        people.add(new Employee("Bob"));
        // people.add(new Person("Charlie")); // ❌ Not allowed – must be Employee or subclass
    }

    public static void main(String[] args) {
        List<Person> personList = new ArrayList<>();
        List<Object> objectList = new ArrayList<>();

        // Both are valid because Person and Object are supertypes of Employee
        addEmployees(personList);
        addEmployees(objectList);

        System.out.println("Person List: " + personList);
        System.out.println("Object List: " + objectList);

        // Reading only gives Object (type unknown)
        Object first = personList.get(0);
        System.out.println("First element (as Object): " + first);
    }
}

/*
Expected Output:
Person List: [Employee: Alice, Employee: Bob]
Object List: [Employee: Alice, Employee: Bob]
First element (as Object): Employee: Alice
*/
