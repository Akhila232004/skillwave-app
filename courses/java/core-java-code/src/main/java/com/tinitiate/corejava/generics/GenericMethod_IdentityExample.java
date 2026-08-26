// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generic Methods  
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: GenericMethod_IdentityExample.java
// 🧠 Topic: Generic Methods (Basic)
// Demonstrates a simple generic method that returns the same value it receives.

public class GenericMethod_IdentityExample {

    // Generic method: accepts any type T and returns it unchanged
    public static <T> T identity(T value) {
        return value;
    }

    public static void main(String[] args) {
        String name = identity("Tinitiate");
        Integer number = identity(101);
        Double price = identity(49.99);

        System.out.println("Name: " + name);
        System.out.println("Number: " + number);
        System.out.println("Price: " + price);
    }
}

/*
Expected Output:
Name: Tinitiate
Number: 101
Price: 49.99
*/
