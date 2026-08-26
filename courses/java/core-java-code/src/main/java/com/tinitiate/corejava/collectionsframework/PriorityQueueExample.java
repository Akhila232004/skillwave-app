// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework PriorityQueue Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates PriorityQueue with a custom Comparator (Max-Heap)
package com.tinitiate.corejava.collectionsframework;
import java.util.*;

public class PriorityQueueExample {
    public static void main(String[] args) {
        // Create a PriorityQueue that gives higher priority to larger numbers
        PriorityQueue<Integer> pq = new PriorityQueue<>(Comparator.reverseOrder());

        // Add elements
        pq.add(5);
        pq.add(15);
        pq.add(10);

        System.out.println("PriorityQueue (Max-Heap): " + pq);
        System.out.println("Highest priority element: " + pq.peek());

        pq.poll(); // removes the highest priority (largest element)
        System.out.println("After poll: " + pq);
    }
}

/*
Expected Output:
PriorityQueue (Max-Heap): [15, 5, 10]
Highest priority element: 15
After poll: [10, 5]
*/
