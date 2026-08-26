// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Method Over loading Example
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Method Overloading
 * ------------------
 * When multiple methods have the SAME name but DIFFERENT parameters.
 * This is an example of compile-time polymorphism.
 */
public class MethodOverloading {
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        calc.add(5, 3);              // integers
        calc.add(2.5, 3.5);          // doubles
        calc.add("Hello", "World");  // strings
    }
}

/* ===== Class demonstrating method overloading ===== */
class Calculator {
    void add(int a, int b) {
        System.out.println("Adding integers: " + (a + b));
    }

    void add(double a, double b) {
        System.out.println("Adding doubles: " + (a + b));
    }

    void add(String a, String b) {
        System.out.println("Adding strings: " + (a + " " + b));
    }
}

/*
Expected output:
Adding integers: 8
Adding doubles: 6.0
Adding strings: Hello World
*/
