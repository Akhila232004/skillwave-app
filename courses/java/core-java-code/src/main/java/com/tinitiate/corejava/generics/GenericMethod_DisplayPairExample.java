// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generic Methods with Multiple Type Parameters  
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: GenericMethod_DisplayPairExample.java
// 🧠 Topic: Generic Methods with Multiple Type Parameters
// Demonstrates a generic method that prints a pair of values of any types.

public class GenericMethod_DisplayPairExample {

    // ⬇️ This is a generic method definition.
    // <K, V> are "type parameters" that allow this method to work with ANY types.
    // Example: K could be String, V could be Integer — or vice versa.
    public static <K, V> void displayPair(K key, V value) {
        // Prints the key and value together
        System.out.println("Key: " + key + " | Value: " + value);
    }

    public static void main(String[] args) {
        // Here we call the generic method with different type combinations.

        // String - String pair
        displayPair("Course", "Java Full Stack");

        // String - Integer pair
        displayPair("Duration (months)", 6);

        // Integer - String pair
        displayPair(101, "Student ID");
    }
}

/*
🧾 Explanation:
1️⃣ <K, V> in the method signature declares two generic types.
2️⃣ The method can accept any combination of data types for those placeholders.
3️⃣ During each call, Java automatically infers the actual types from arguments.
   - For displayPair("Course", "Java Full Stack"), K = String, V = String
   - For displayPair("Duration (months)", 6), K = String, V = Integer
   - For displayPair(101, "Student ID"), K = Integer, V = String
4️⃣ The benefit: One method works for all data types — no need for overloads.

✅ Expected Output:
Key: Course | Value: Java Full Stack
Key: Duration (months) | Value: 6
Key: 101 | Value: Student ID
*/
