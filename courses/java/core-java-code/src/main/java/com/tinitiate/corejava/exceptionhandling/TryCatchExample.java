// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Try Catch Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates simple try-catch block
package com.tinitiate.corejava.exceptionhandling;
public class TryCatchExample {
    public static void main(String[] args) {
        System.out.println("Starting calculation...");

        try {
            int x = 10 / 0; // risky operation
        } catch (ArithmeticException e) {
            System.out.println("Caught: Cannot divide by zero.");
        }

        System.out.println("Continuing after handling...");
    }
}

/*
Expected Output:
Starting calculation...
Caught: Cannot divide by zero.
Continuing after handling...
*/
