// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * COMMON ARRAY OPERATIONS:
 * - length: how many boxes
 * - sort: reorder (changes the original array)
 * - copy: make a new array with same contents (same or smaller/larger length)
 * - search: binarySearch (only works on a SORTED array)
 * - fill: set all values to one value (good for defaults)
 * - System.arraycopy: fast partial copying between arrays
 */

import java.util.Arrays;

public class ArrayOperations_SortCopySearchFill {
    public static void main(String[] args) {
        String[] tools = {"Git", "Maven", "Gradle"};

        // length
        System.out.println("Length: " + tools.length); // 3

        // sort (alphabetical) — modifies the original array
        Arrays.sort(tools); // becomes ["Git", "Gradle", "Maven"]
        System.out.println("Sorted: " + Arrays.toString(tools));

        // copy entire array
        String[] copy = Arrays.copyOf(tools, tools.length);
        System.out.println("Copy:   " + Arrays.toString(copy));

        // copy first 2 elements only (range end is exclusive)
        String[] firstTwo = Arrays.copyOfRange(tools, 0, 2);
        System.out.println("First2: " + Arrays.toString(firstTwo)); // ["Git", "Gradle"]

        // search: array MUST be sorted for binarySearch to work correctly
        int idx = Arrays.binarySearch(tools, "Gradle"); // find index of "Gradle"
        System.out.println("\"Gradle\" index: " + idx);

        // fill: set every element in an int array to -1
        int[] slots = new int[5];
        Arrays.fill(slots, -1);                       // [-1, -1, -1, -1, -1]
        System.out.println("Filled: " + Arrays.toString(slots));

        // System.arraycopy: copy part of one array into another
        int[] a = {1, 2, 3, 4, 5};
        int[] b = new int[3];
        // Copy 3 items starting from a[1] into b[0..]
        System.arraycopy(a, 1, b, 0, 3);             // b becomes [2, 3, 4]
        System.out.println("b: " + Arrays.toString(b));
    }
}
