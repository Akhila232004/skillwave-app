// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Polymorphism Example
//  Author       : Team Tinitiate
// ==============================================================================





/**
 * Polymorphism
 * -------------
 * "Polymorphism" means "many forms."
 * One method behaves differently depending on:
 *   - the number/type of inputs (Compile-time)
 *   - the object that calls it (Runtime)
 *
 * Types:
 * 1) Compile-time Polymorphism → Method Overloading
 * 2) Runtime Polymorphism → Method Overriding
 */
public class Polymorphism {
    public static void main(String[] args) {
        System.out.println("Compile-time polymorphism:");
        Calculator calc = new Calculator();
        calc.addNumbers(5, 10);
        calc.addNumbers(2, 3, 4);

        System.out.println("\nRuntime polymorphism:");
        Animal pet = new Dog(); // parent reference → child object
        pet.makeSound();        // calls Dog's overridden version
    }
}

/* ===== Compile-time Polymorphism (Method Overloading) ===== */
class Calculator {
    void addNumbers(int a, int b) {
        System.out.println("Sum of two numbers: " + (a + b));
    }

    void addNumbers(int a, int b, int c) {
        System.out.println("Sum of three numbers: " + (a + b + c));
    }
}

/* ===== Runtime Polymorphism (Method Overriding) ===== */
class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks");
    }
}

/*
Expected output:
Compile-time polymorphism:
Sum of two numbers: 15
Sum of three numbers: 9

Runtime polymorphism:
Dog barks
*/
