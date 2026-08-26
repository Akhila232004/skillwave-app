// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Single Inheritance Simple Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.inheritance;

/**
 * Single Inheritance (simple)
 * ---------------------------
 * - Animal_SingleInheritance = parent (superclass) with eat()
 * - Dog_SingleInheritance    = child  (subclass) that inherits eat() and adds bark()
 *
 * Key idea: Dog "is an" Animal → reuse + add features.
 */
public class SingleInheritance_SimpleExample {
    public static void main(String[] args) {
        Dog_SingleInheritance d = new Dog_SingleInheritance();

        d.eat();   // inherited from Animal_SingleInheritance
        d.bark();  // Dog_SingleInheritance's own method

        // Polymorphism: treat Dog as Animal
        Animal_SingleInheritance a = new Dog_SingleInheritance(); // upcast to parent type
        a.eat();              // works (defined in Animal_SingleInheritance)
        // a.bark();          // ❌ not allowed via Animal_SingleInheritance reference (not in parent)
    }
}

/* ===== Parent (superclass) ===== */
class Animal_SingleInheritance {
    void eat() {
        System.out.println("Animal_SingleInheritance eats");
    }
}

/* ===== Child (subclass) ===== */
class Dog_SingleInheritance extends Animal_SingleInheritance {
    void bark() {
        System.out.println("Dog_SingleInheritance barks");
    }
}

/*
Expected output:
Animal_SingleInheritance eats
Dog_SingleInheritance barks
Animal_SingleInheritance eats
*/
