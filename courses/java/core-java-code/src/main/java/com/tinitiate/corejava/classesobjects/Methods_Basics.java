// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.classesobjects;

/**
 * WHAT THIS CODE IS ABOUT:
 * ------------------------
 * Understanding METHODS: small reusable actions that a class can do.
 *
 * KEY IDEAS:
 * - "void" methods do an action but don't return a value.
 * - Non-void methods RETURN a value (using the "return" keyword).
 */
class Greeter {
    // A "void" method: it performs an action (printing) and returns nothing.
    void sayHello() {
        System.out.println("Hello!");
    }

    // A method that RETURNS a String value
    String helloTo(String name) {
        // Build a message and give it back to the caller
        return "Hello, " + name + "!";
    }
}

public class Methods_Basics {
    public static void main(String[] args) {
        Greeter g = new Greeter();

        // Call a void method: it just does something (prints)
        g.sayHello(); // prints: Hello!

        // Call a method that returns something: capture the result
        String msg = g.helloTo("Asha");
        System.out.println(msg); // prints: Hello, Asha!
    }
}
