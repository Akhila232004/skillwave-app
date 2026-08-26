// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Accessing Parent Constructors Example
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Access parent constructors using super(...)
 * Person has only a parameterized constructor.
 * Employee must call super(name) first to initialize Person.
 */
public class AccessParentConstructors {
    public static void main(String[] args) {
        Employee e1 = new Employee("Asha", 101);
        e1.show();

        System.out.println("---");

        Employee e2 = new Employee("Bala");
        e2.show();
    }
}

/* ===== Parent ===== */
class Person {
    String name;

    Person(String name) {
        System.out.println("Person() constructor: name=" + name);
        this.name = name;
    }
}

/* ===== Child ===== */
class Employee extends Person {
    int id;

    Employee(String name, int id) {
        super(name); // must be first
        System.out.println("Employee() constructor: id=" + id);
        this.id = id;
    }

    Employee(String name) {
        this(name, 0); // chain to the other constructor
    }

    void show() {
        System.out.println("Employee.show -> name=" + name + ", id=" + id);
    }
}

/*
Expected output:
Person() constructor: name=Asha
Employee() constructor: id=101
Employee.show -> name=Asha, id=101
---
Person() constructor: name=Bala
Employee() constructor: id=0
Employee.show -> name=Bala, id=0
*/
