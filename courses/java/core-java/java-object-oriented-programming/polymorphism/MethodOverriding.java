// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Method Overriding Example
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Method Overriding
 * -----------------
 * When a child class defines a method with the SAME name and SAME parameters
 * as the parent class, it REPLACES (overrides) the parent's version at runtime.
 * 
 * This is an example of runtime polymorphism.
 */
public class MethodOverriding {
    public static void main(String[] args) {
        Animal animal = new Animal();
        animal.makeSound(); // calls parent's version

        Animal dog = new Dog(); // parent reference → child object
        dog.makeSound(); // calls child's overridden version
    }
}

/* ===== Parent class ===== */
class Animal {
    void makeSound() {
        System.out.println("Parent class (Animal): makes a sound");
    }
}

/* ===== Child class ===== */
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Child class (Dog): barks");
    }
}

/*
Expected output:
Parent class (Animal): makes a sound
Child class (Dog): barks
*/
