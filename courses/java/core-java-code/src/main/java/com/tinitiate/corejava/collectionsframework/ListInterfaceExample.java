// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework ListInterface Example
//  Author       : Team Tinitiate
// ==============================================================================
  

package com.tinitiate.corejava.collectionsframework;
import java.util.*;

public class ListInterfaceExample {
    public static void main(String[] args) {
        // ---------- ArrayList ----------
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Apple");
        arrayList.add("Banana");
        arrayList.add("Cherry");
        System.out.println("ArrayList: " + arrayList); // Maintains insertion order

        // ---------- LinkedList ----------
        List<String> linkedList = new LinkedList<>();
        linkedList.add("Dog");
        linkedList.add("Cat");
        linkedList.add("Elephant");
        linkedList.remove("Cat"); // removes specific element
        System.out.println("LinkedList: " + linkedList); // Allows quick insert/delete

        // ---------- Vector ----------
        Vector<Integer> vector = new Vector<>();
        vector.add(10);
        vector.add(20);
        vector.add(30);
        System.out.println("Vector: " + vector); // Thread-safe version of ArrayList

        // ---------- Stack ----------
        Stack<String> stack = new Stack<>();
        stack.push("Red");
        stack.push("Green");
        stack.push("Blue");
        System.out.println("Stack (LIFO): " + stack);
        System.out.println("Top element (peek): " + stack.peek());
        stack.pop(); // remove top element
        System.out.println("After pop: " + stack);
    }
}

/*
Expected Output:
ArrayList: [Apple, Banana, Cherry]
LinkedList: [Dog, Elephant]
Vector: [10, 20, 30]
Stack (LIFO): [Red, Green, Blue]
Top element (peek): Blue
After pop: [Red, Green]
*/
