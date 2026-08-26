// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework LinkedHashSet Example 
//  Author       : Team Tinitiate
// ==============================================================================

// Demonstrates LinkedHashSet preserving insertion order and ignoring duplicates
package com.tinitiate.corejava.collectionsframework;
import java.util.*;

public class LinkedHashSetExample {
    public static void main(String[] args) {
        LinkedHashSet<String> languages = new LinkedHashSet<>();

        // Add elements (insertion order preserved)
        languages.add("Java");
        languages.add("Python");
        languages.add("C++");
        languages.add("Python");  // duplicate ignored
        languages.add("JavaScript");

        // Display elements in insertion order
        System.out.println("Programming Languages: " + languages);

        // Remove an element
        languages.remove("C++");
        System.out.println("After removing 'C++': " + languages);

        // Check if an element exists
        System.out.println("Contains 'Java'? " + languages.contains("Java"));
    }
}

/*
Expected Output:
Programming Languages: [Java, Python, C++, JavaScript]
After removing 'C++': [Java, Python, JavaScript]
Contains 'Java'? true
*/
