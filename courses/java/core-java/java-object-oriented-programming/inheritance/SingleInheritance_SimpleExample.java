// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Single Inheritance Simple Example
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Single Inheritance (simple)
 * ---------------------------
 * - Animal = parent (superclass) with eat()
 * - Dog    = child  (subclass) that inherits eat() and adds bark()
 *
 * Key idea: Dog "is an" Animal → reuse + add features.
 */
public class SingleInheritance_SimpleExample {
    public static void main(String[] args) {
        Dog d = new Dog();

        d.eat();   // inherited from Animal
        d.bark();  // Dog's own method

        // Polymorphism (optional): treat Dog as Animal
        Animal a = new Dog(); // upcast to parent type
        a.eat();              // works (defined in Animal)
        // a.bark();          // ❌ not allowed via Animal reference (not in Animal)
    }
}

/* ===== Parent (superclass) ===== */
class Animal {
    void eat() {
        System.out.println("Animal eats");
    }
}

/* ===== Child (subclass) ===== */
class Dog extends Animal {
    void bark() {
        System.out.println("Dog barks");
    }
}