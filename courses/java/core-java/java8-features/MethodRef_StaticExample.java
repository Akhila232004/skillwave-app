// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================



// File: MethodRef_StaticExample.java
// Demonstrates: Using a static method reference instead of a lambda

import java.util.function.Consumer;

public class MethodRef_StaticExample {

    // Static method to be referenced
    public static void printMessage(String msg) {
        System.out.println("Message: " + msg);
    }

    public static void main(String[] args) {
        // Lambda version
        Consumer<String> c1 = s -> MethodRef_StaticExample.printMessage(s);

        // Method reference version
        Consumer<String> c2 = MethodRef_StaticExample::printMessage;

        c2.accept("Welcome to TINITIATE!");
        c2.accept("Learning Java Method References");
    }
}

/*
Expected Output:
Message: Welcome to TINITIATE!
Message: Learning Java Method References
*/
