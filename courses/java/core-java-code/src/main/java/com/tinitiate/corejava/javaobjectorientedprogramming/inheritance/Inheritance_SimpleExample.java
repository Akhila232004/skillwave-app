package com.tinitiate.corejava.javaobjectorientedprogramming.inheritance;

// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Topic        : Inheritance + Method Overriding
//  Author       : Team Tinitiate
// ==============================================================================

/**
 * Inheritance_SimpleExample
 * -------------------------
 * Simple inheritance example:
 *  - InheritanceAnimal = parent (superclass) with eat()
 *  - InheritanceDog    = child  (subclass) that OVERRIDES eat() and ADDS bark()
 *
 * Key idea: A Dog "is an" Animal → reuse + specialize.
 */
public class Inheritance_SimpleExample {
    public static void main(String[] args) {
        // Use subclass directly
        InheritanceDog d = new InheritanceDog();
        d.eat();   // Dog's overridden version
        d.bark();  // Dog-specific method

        // Polymorphism: treat Dog as Animal
        InheritanceAnimal a = new InheritanceDog(); // upcast to parent type
        a.eat();                                    // still calls InheritanceDog.eat()
        // a.bark();                                // ❌ not allowed via parent reference
    }
}

/* ===== Parent (superclass) ===== */
class InheritanceAnimal {
    void eat() {
        System.out.println("Animal eats");
    }
}

/* ===== Child (subclass) ===== */
class InheritanceDog extends InheritanceAnimal {

    @Override
    void eat() {
        System.out.println("Dog eats");
    }

    void bark() {
        System.out.println("Dog barks");
    }
}

/*
Expected output:
Dog eats
Dog barks
Dog eats
*/
