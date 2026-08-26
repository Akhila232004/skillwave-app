// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework HashMap Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates iterating and removing elements in a HashMap
package com.tinitiate.corejava.collectionsframework;
import java.util.*;

public class HashMapExample {
    public static void main(String[] args) {
        // Create a HashMap of employee IDs and names
        HashMap<Integer, String> employees = new HashMap<>();
        employees.put(101, "Alice");
        employees.put(102, "Bob");
        employees.put(103, "Charlie");
        employees.put(104, "David");

        // Display map
        System.out.println("Employees: " + employees);

        // Iterate using for-each over entrySet
        System.out.println("\nEmployee List:");
        for (Map.Entry<Integer, String> entry : employees.entrySet()) {
            System.out.println("ID: " + entry.getKey() + ", Name: " + entry.getValue());
        }

        // Remove an employee by key
        employees.remove(102);

        // Check if a key exists
        System.out.println("\nContains key 103? " + employees.containsKey(103));

        // Display after removal
        System.out.println("After removing key 102: " + employees);
    }
}

/*
Expected Output:
Employees: {101=Alice, 102=Bob, 103=Charlie, 104=David}

Employee List:
ID: 101, Name: Alice
ID: 102, Name: Bob
ID: 103, Name: Charlie
ID: 104, Name: David

Contains key 103? true
After removing key 102: {101=Alice, 103=Charlie, 104=David}
*/
