// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework Vector Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates common operations on Vector:
// updating, removing, iterating elements
package com.tinitiate.corejava.collectionsframework;
import java.util.*;

public class VectorExample {
    public static void main(String[] args) {
        // Create a Vector of Integers
        Vector<Integer> numbers = new Vector<>();

        // Add elements
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);

        // Update an element at index 2 (zero-based)
        numbers.set(2, 35);  // replaces 30 with 35

        // Remove an element by value
        numbers.remove(Integer.valueOf(20));

        // Display current Vector
        System.out.println("Vector after update and removal: " + numbers);

        // Iterate using for-each loop
        System.out.println("Iterating through Vector elements:");
        for (int num : numbers) {
            System.out.println(num);
        }
    }
}

/*
Expected Output:
Vector after update and removal: [10, 35, 40]
Iterating through Vector elements:
10
35
40
*/
