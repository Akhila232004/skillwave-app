// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================



// File: MethodRef_ClassInstanceExample.java
// Demonstrates: Calling an instance method (like toUpperCase) on every object in a Stream using method reference

import java.util.*;

public class MethodRef_ClassInstanceExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("ravi", "anita", "kiran");

        // Using method reference to convert and print
        names.stream()
             .map(String::toUpperCase)      // instance method reference
             .forEach(System.out::println); // prints each name
    }
}

/*
Expected Output:
RAVI
ANITA
KIRAN
*/
