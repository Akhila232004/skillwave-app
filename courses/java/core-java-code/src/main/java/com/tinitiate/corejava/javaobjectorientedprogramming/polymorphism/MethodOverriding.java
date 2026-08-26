// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Method Overriding Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.polymorphism;

/**
 * Method Overriding
 * -----------------
 * When a child class defines a method with the SAME name and SAME parameters
 * as the parent class, it REPLACES (overrides) the parent's version at runtime.
 *
 * This is an example of runtime polymorphism (dynamic method dispatch).
 */
public class MethodOverriding {
    public static void main(String[] args) {

        // Parent reference → parent object
        Animal_Polymorphism animal = new Animal_Polymorphism();
        animal.makeSound(); // calls parent's version

        // Parent reference → child object (polymorphism)
        Animal_Polymorphism dog = new Dog_Polymorphism();
        dog.makeSound(); // calls child's overridden version at runtime
    }
}

/* ===== Parent class for polymorphism demo ===== */
class Animal_Polymorphism {
    void makeSound() {
        System.out.println("Parent class (Animal_Polymorphism): makes a sound");
    }
}

/* ===== Child class for polymorphism demo ===== */
class Dog_Polymorphism extends Animal_Polymorphism {
    @Override
    void makeSound() {
        System.out.println("Child class (Dog_Polymorphism): barks");
    }
}

/*
Expected output:
Parent class (Animal_Polymorphism): makes a sound
Child class (Dog_Polymorphism): barks
*/
