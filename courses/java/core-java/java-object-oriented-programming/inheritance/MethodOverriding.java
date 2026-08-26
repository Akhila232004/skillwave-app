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
 * When a child class defines a method with the same name and parameters
 * as its parent, it REPLACES the parent's version at runtime.
 */
public class MethodOverriding {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.sound();  // calls parent's method

        Dog d = new Dog();
        d.sound();  // calls child's overridden method

        // Polymorphism: parent reference pointing to child object
        Animal pet = new Dog();
        pet.sound(); // calls child's version at runtime
    }
}

class Animal {
    void sound() {
        System.out.println("Parent class (Animal): makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Child class (Dog): barks");
    }
}

/*
Expected output:
Parent class (Animal): makes a sound
Child class (Dog): barks
Child class (Dog): barks
*/
