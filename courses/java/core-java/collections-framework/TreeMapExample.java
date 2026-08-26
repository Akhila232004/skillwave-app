// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework TreeMap Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates TreeMap with custom Comparator (reverse order) and navigation methods

import java.util.*;

public class TreeMapExample {
    public static void main(String[] args) {
        // TreeMap with custom Comparator for descending order
        TreeMap<String, Integer> marks = new TreeMap<>(Comparator.reverseOrder());

        // Add elements
        marks.put("Ravi", 88);
        marks.put("Anu", 92);
        marks.put("Kiran", 79);
        marks.put("Deepa", 85);

        // Display TreeMap (sorted in reverse order)
        System.out.println("Student Marks (Descending Order): " + marks);

        // Navigation methods
        System.out.println("First Key: " + marks.firstKey());
        System.out.println("Last Key: " + marks.lastKey());
        System.out.println("Higher Key than 'Deepa': " + marks.higherKey("Deepa"));
        System.out.println("Lower Key than 'Deepa': " + marks.lowerKey("Deepa"));
    }
}

/*
Expected Output:
Student Marks (Descending Order): {Ravi=88, Kiran=79, Deepa=85, Anu=92}
First Key: Ravi
Last Key: Anu
Higher Key than 'Deepa': Kiran
Lower Key than 'Deepa': Ravi
*/
