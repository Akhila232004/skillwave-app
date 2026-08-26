// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework HashSet Example
//  Author       : Team Tinitiate
// ==============================================================================



// Demonstrates HashSet unordered behavior and allowance of null values

import java.util.*;

public class HashSetExample {
    public static void main(String[] args) {
        HashSet<String> colors = new HashSet<>();

        // Add elements
        colors.add("Red");
        colors.add("Green");
        colors.add("Blue");
        colors.add(null);  // HashSet allows one null
        colors.add("Yellow");

        // Display HashSet
        System.out.println("Colors: " + colors);

        // Check for element presence
        System.out.println("Contains 'Green'? " + colors.contains("Green"));

        // Remove an element
        colors.remove("Red");
        System.out.println("After removing 'Red': " + colors);
    }
}

/*
Expected Output:
Colors: [null, Blue, Red, Green, Yellow]   // order may vary
Contains 'Green'? true
After removing 'Red': [null, Blue, Green, Yellow]   // order may vary
*/
