// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Method Overriding Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.inheritance;

/**
 * Method Overriding
 * -----------------
 * When a child class defines a method with the same name and parameters
 * as its parent, it REPLACES the parent's version at runtime.
 */
public class MethodOverriding {
    public static void main(String[] args) {
        AnimalOverriding a = new AnimalOverriding();
        a.sound();  // calls parent's method

        DogOverriding d = new DogOverriding();
        d.sound();  // calls child's overridden method

        // Polymorphism: parent reference pointing to child object
        AnimalOverriding pet = new DogOverriding();
        pet.sound(); // calls child's version at runtime (dynamic dispatch)
    }
}

/* ===== Parent class for overriding demo ===== */
class AnimalOverriding {
    void sound() {
        System.out.println("Parent class (AnimalOverriding): makes a sound");
    }
}

/* ===== Child class for overriding demo ===== */
class DogOverriding extends AnimalOverriding {

    @Override
    void sound() {
        System.out.println("Child class (DogOverriding): barks");
    }
}

/*
Expected output:
Parent class (AnimalOverriding): makes a sound
Child class (DogOverriding): barks
Child class (DogOverriding): barks
*/
