// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Hierarchical Inheritance
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Hierarchical Inheritance (simple)
 * ---------------------------------
 * One parent class (Animal) with multiple child classes (Dog, Cat).
 * - Both Dog and Cat inherit eat() from Animal.
 * - Each child provides its own makeSound() behavior (override).
 */
public class Hierarchical_Inheritance {
    public static void main(String[] args) {
        // Use each subclass directly
        Dog d = new Dog();
        d.eat();         // inherited from Animal
        d.makeSound();   // Dog's override

        Cat c = new Cat();
        c.eat();         // inherited from Animal
        c.makeSound();   // Cat's override

       //  parent references pointing to child objects
        Animal a1 = new Dog();
        Animal a2 = new Cat();
        a1.makeSound();  // calls Dog's version at runtime
        a2.makeSound();  // calls Cat's version at runtime
    }
}

/* ===== Parent (superclass) ===== */
class Animal {
    void eat() {
        System.out.println("Animal eats");
    }
    void makeSound() {
        System.out.println("Animal makes a sound"); // default (will be overridden)
    }
}

/* ===== Child 1 (subclass) ===== */
class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks");
    }
}

/* ===== Child 2 (subclass) ===== */
class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Cat meows");
    }
}


