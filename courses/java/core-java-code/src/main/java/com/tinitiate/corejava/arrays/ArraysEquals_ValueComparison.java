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
 * How to compare arrays correctly.
 *
 * BEGINNER NOTES:
 * - `==` checks if two variables point to the exact SAME array object in memory.
 * - `Arrays.equals(a, b)` checks if two 1D arrays have the same values in order.
 * - For nested arrays, use `Arrays.deepEquals(...)`.
 */

import java.util.Arrays;

public class ArraysEquals_ValueComparison {
    public static void main(String[] args) {
        int[] x = {1, 2, 3};
        int[] y = {1, 2, 3};
        int[] z = x; // z points to the SAME array as x

        // Reference check (==): are they the same object?
        System.out.println("x == y ? " + (x == y)); // false (two different objects with same values)
        System.out.println("x == z ? " + (x == z)); // true  (both point to same object)

        // Value check: Arrays.equals
        System.out.println("Arrays.equals(x, y) ? " + Arrays.equals(x, y)); // true (same values)

        // For multi-dimensional arrays, use deepEquals:
        int[][] m1 = {{1, 2}, {3, 4}};
        int[][] m2 = {{1, 2}, {3, 4}};
        System.out.println("deepEquals(m1, m2) ? " + Arrays.deepEquals(m1, m2)); // true
    }
}
