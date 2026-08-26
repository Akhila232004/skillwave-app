// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework LinkedHash MapExample
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates LinkedHashMap preserving insertion order and updating values

import java.util.*;

public class LinkedHashMapExample {
    public static void main(String[] args) {
        // Create LinkedHashMap (maintains insertion order)
        LinkedHashMap<String, Integer> scores = new LinkedHashMap<>();

        // Add elements
        scores.put("Alice", 85);
        scores.put("Bob", 90);
        scores.put("Charlie", 80);

        // Display initial map
        System.out.println("Initial Scores: " + scores);

        // Update value for an existing key
        scores.put("Bob", 95);  // overwrites Bob’s previous score

        // Add a new entry
        scores.put("Diana", 88);

        // Iterate through entries
        System.out.println("\nUpdated Scores:");
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }

        // Remove one entry
        scores.remove("Charlie");

        // Display after removal
        System.out.println("\nAfter removing Charlie: " + scores);
    }
}

/*
Expected Output:
Initial Scores: {Alice=85, Bob=90, Charlie=80}

Updated Scores:
Alice -> 85
Bob -> 95
Charlie -> 80
Diana -> 88

After removing Charlie: {Alice=85, Bob=95, Diana=88}
*/
