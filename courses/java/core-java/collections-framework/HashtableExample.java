// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework Hashtable Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates Hashtable restrictions (no nulls) and iteration

import java.util.*;

public class HashtableExample {
    public static void main(String[] args) {
        Hashtable<Integer, String> students = new Hashtable<>();

        // Adding key-value pairs
        students.put(1, "Alice");
        students.put(2, "Bob");
        students.put(3, "Charlie");

        System.out.println("Students: " + students);

        // Attempting to add a null key or value (will throw exception)
        try {
            students.put(null, "David");  // ❌ not allowed
        } catch (NullPointerException e) {
            System.out.println("Error: Hashtable does not allow null keys!");
        }

        try {
            students.put(4, null);        // ❌ not allowed
        } catch (NullPointerException e) {
            System.out.println("Error: Hashtable does not allow null values!");
        }

        // Iterating over entries
        System.out.println("\nIterating through entries:");
        for (Map.Entry<Integer, String> entry : students.entrySet()) {
            System.out.println("ID: " + entry.getKey() + ", Name: " + entry.getValue());
        }
    }
}

/*
✅ Expected Output:
Students: {3=Charlie, 2=Bob, 1=Alice}
Error: Hashtable does not allow null keys!
Error: Hashtable does not allow null values!

Iterating through entries:
ID: 3, Name: Charlie
ID: 2, Name: Bob
ID: 1, Name: Alice
*/
