// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Interface Simple Example
//  Author       : Team Tinitiate
// ==============================================================================

package com.tinitiate.corejava.javaobjectorientedprogramming.abstraction;

/**
 * Interface_SimpleExample
 * -----------------------
 * An interface says WHAT to do (method name), not HOW to do it.
 * A class that implements the interface provides the actual code.
 */
public class Interface_SimpleExample {
    public static void main(String[] args) {
        SimpleGreeter g = new EnglishSimpleGreeter(); // interface reference → implementing class object
        g.greet();                                    // calls EnglishSimpleGreeter.greet()
    }
}

/* Contract: any SimpleGreeter must have a greet() method */
interface SimpleGreeter {
    void greet();
}

/* A simple class that fulfills the SimpleGreeter contract */
class EnglishSimpleGreeter implements SimpleGreeter {
    @Override
    public void greet() {
        System.out.println("Hello");
    }
}

/*
Expected output:
Hello
*/
