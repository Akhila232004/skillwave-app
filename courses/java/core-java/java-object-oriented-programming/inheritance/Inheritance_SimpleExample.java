// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Inheritance Simple Example
//  Author       : Team Tinitiate
// ==============================================================================
 



/**
 * Simple inheritance example:
 * - Animal = parent (superclass) with eat()
 * - Dog    = child  (subclass) that OVERRIDES eat() and ADDS bark()
 *
 * Key idea: A Dog "is an" Animal → reuse + specialize.
 */
public class Inheritance_SimpleExample {
    public static void main(String[] args) {
        // Use subclass directly
        Dog d = new Dog();
        d.eat();   // Dog's overridden version
        d.bark();  // Dog-specific method

        // Polymorphism: treat Dog as Animal
        Animal a = new Dog(); // upcast to parent type
        a.eat();              // still calls Dog.eat() (runtime dispatch)
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
