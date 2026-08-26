// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Constructor Chaining Example
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Constructor Chaining
 * --------------------
 * One constructor calling another — inside same class (this(...))
 * or in parent class (super(...)).
 */
public class ConstructorChaining {
    public static void main(String[] args) {
        new Student("Asha", 20);
    }
}

class Person {
    Person() {
        System.out.println("Person: default constructor");
    }
    Person(String name) {
        System.out.println("Person: name = " + name);
    }
}

class Student extends Person {
    Student() {
        super(); // optional: calls Person()
        System.out.println("Student: default constructor");
    }
    Student(String name, int age) {
        this();  // call Student()
        System.out.println("Student: name = " + name + ", age = " + age);
    }
}

/*
Expected output:
Person: default constructor
Student: default constructor
Student: name = Asha, age = 20
*/
