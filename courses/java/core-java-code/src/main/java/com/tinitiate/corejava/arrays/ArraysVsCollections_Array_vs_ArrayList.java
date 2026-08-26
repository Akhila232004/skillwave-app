// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * WHAT THIS CODE IS ABOUT:
 * Comparing arrays with collections (ArrayList).
 *
 * BEGINNER NOTES:
 * - Array: fixed size, very fast, simple. But can't grow/shrink.
 * - ArrayList: growable list (a collection). You can add/remove items easily.
 * - Arrays.asList(...) returns a fixed-size list backed by the array (no add/remove).
 * - new ArrayList<>(...) makes a growable copy.
 */

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArraysVsCollections_Array_vs_ArrayList {
    public static void main(String[] args) {
        // Start with a simple array
        String[] colors = {"Red", "Green", "Blue"};
        System.out.println("array: " + Arrays.toString(colors)); // [Red, Green, Blue]

        // Convert to a fixed-size List backed by the array
        List<String> fixedList = Arrays.asList(colors);
        System.out.println("fixedList: " + fixedList); // [Red, Green, Blue]

        // Trying to add/remove on fixedList will throw UnsupportedOperationException:
        // fixedList.add("Yellow"); // ❌ don't do this

        // Make a growable ArrayList (safe to add/remove)
        List<String> growable = new ArrayList<>(fixedList);
        growable.add("Yellow");         // ✅ works
        growable.remove("Green");       // ✅ works
        System.out.println("growable: " + growable); // [Red, Blue, Yellow]

        // Show that original array remains the same size and unchanged
        System.out.println("array (unchanged): " + Arrays.toString(colors)); // [Red, Green, Blue]

        // Why choose ArrayList?
        // - If you need to frequently add/remove/search dynamically, use ArrayList.
        // - If you know the size and want simple, fast storage, array is fine.
    }
}
