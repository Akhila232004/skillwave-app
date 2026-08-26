// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Collections Framework ListIterator Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.collectionsframework;

public class ListIteratorExample {
    
    public static void main(String[] args) {
        java.util.List<String> items = new java.util.ArrayList<>();
        items.add("apple");
        items.add("banana");
        items.add("carrot");

        java.util.ListIterator<String> it = items.listIterator();
        while (it.hasNext()) {
            String v = it.next();
            if (v.startsWith("b")) {
                it.set(v.toUpperCase()); // replace current element
                it.add("bonus");         // insert right after current position
            }
        }
        System.out.println(items);
    }
}
/*
Expected output:
[apple, BANANA, bonus, carrot]
*/
