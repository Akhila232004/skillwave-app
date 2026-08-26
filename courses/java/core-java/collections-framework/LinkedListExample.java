// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework LinkedList Example
//  Author       : Team Tinitiate
// ==============================================================================


//  Removing and Retrieving

import java.util.LinkedList;

public class LinkedListExample {
    public static void main(String[] args) {
        LinkedList<Integer> numbers = new LinkedList<>();

        // Add numbers
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        // Remove the first and last
        numbers.removeFirst();
        numbers.removeLast();

        System.out.println("After removals: " + numbers);
        System.out.println("Remaining element: " + numbers.get(0));
    }
}

/*
Expected Output:
After removals: [20]
Remaining element: 20
*/
