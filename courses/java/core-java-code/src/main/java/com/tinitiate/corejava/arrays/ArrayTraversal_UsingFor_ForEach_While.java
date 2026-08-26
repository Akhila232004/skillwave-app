// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * TRAVERSING ARRAYS:
 * - for loop (index-based): you get the index; good for reading & updating.
 * - for-each loop (enhanced for): simpler reading; no index, read-only style.
 * - while loop: flexible but you must move the index manually.
 */
public class ArrayTraversal_UsingFor_ForEach_While {
    public static void main(String[] args) {
        String[] names = {"Ali", "Bea", "Chen"};

        // 1) for loop with index
        for (int i = 0; i < names.length; i++) {
            // i goes from 0 to length-1
            System.out.println("for: index=" + i + ", value=" + names[i]);
        }

        // 2) for-each (enhanced for): read elements directly; index not available
        for (String n : names) {
            System.out.println("for-each: value=" + n);
        }

        // 3) while loop: manually control index; don't forget to increment!
        int i = 0;
        while (i < names.length) {
            System.out.println("while: index=" + i + ", value=" + names[i]);
            i++; // move forward; otherwise infinite loop
        }
    }
}
