// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework ArrayList Example
//  Author       : Team Tinitiate
// ==============================================================================

import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {
        // Create an ArrayList of Strings
        ArrayList<String> names = new ArrayList<>();

        // Add elements
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        // Insert at a specific index
        names.add(1, "David");

        // Remove element
        names.remove("Charlie");

        // Access by index
        System.out.println("First element: " + names.get(0));

        // Display list
        System.out.println("All names: " + names);
    }
}

/*
Expected Output:
First element: Alice
All names: [Alice, David, Bob]
*/
