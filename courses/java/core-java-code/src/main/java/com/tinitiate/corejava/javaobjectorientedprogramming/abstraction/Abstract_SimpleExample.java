// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Abstract Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.abstraction;
/**
 * Abstract class (super simple)
 * -----------------------------
 * - An abstract class can have:
 *     • abstract methods (no body) → must be implemented by child classes
 *     • normal (concrete) methods with a body
 * - You CANNOT create objects of an abstract class.
 */
public class Abstract_SimpleExample {
    public static void main(String[] args) {
        // Animal a = new Animal(); // ❌ compile error: cannot instantiate abstract class

        // Use child classes that implement the abstract method:
        Animal d = new Dog(); // upcasting to the abstract type is fine
        d.sound();            // calls Dog's implementation
        d.sleep();            // concrete method from Animal

        Animal c = new Cat();
        c.sound();            // calls Cat's implementation
        c.sleep();            // concrete method from Animal
    }
}

/* ===== Abstract parent ===== */
abstract class Animal {
    // abstract method: no body; subclasses MUST provide the body
    abstract void sound();

    // concrete method: shared behavior for all animals
    void sleep() {
        System.out.println("[Animal.sleep] zzz...");
    }
}

/* ===== Child 1 ===== */
class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("[Dog.sound] bark");
    }
}

/* ===== Child 2 ===== */
class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("[Cat.sound] meow");
    }
}


// [Dog.sound] bark
// [Animal.sleep] zzz...
// [Cat.sound] meow
// [Animal.sleep] zzz...
