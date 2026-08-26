// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


import java.util.Arrays;

/**
 * WHAT THIS CODE IS ABOUT (Beginner-friendly):
 * -------------------------------------------
 * Java has a helper class called `java.util.Arrays` with many useful methods
 * to work with arrays. In this tiny demo, you’ll see the most common ones:
 * - Arrays.toString(...)  -> easy printing of a 1D array
 * - Arrays.equals(a, b)   -> value comparison of two arrays (1D)
 * - Arrays.copyOf(a, n)   -> make a copy (and optionally "resize")
 *
 * WHY THIS MATTERS:
 * Printing and comparing arrays directly is tricky. The Arrays class gives
 * you simple, reliable tools to do everyday tasks with arrays.
 */
public class ArraysUtilityClass_Overview {
    public static void main(String[] args) {
        int[] a = {10, 20, 30};

        // toString: friendly printing
        System.out.println("toString: " + Arrays.toString(a)); // [10, 20, 30]

        // equals: compares values (not just the memory address)
        int[] b = {10, 20, 30};
        System.out.println("equals(a, b): " + Arrays.equals(a, b)); // true

        // copyOf: copy entire array, possibly to a new size
        int[] copy = Arrays.copyOf(a, a.length); // exact copy
        System.out.println("copy: " + Arrays.toString(copy)); // [10, 20, 30]

        int[] expanded = Arrays.copyOf(a, 5); // larger: new slots filled with defaults (0 for int)
        System.out.println("expanded: " + Arrays.toString(expanded)); // [10, 20, 30, 0, 0]
    }
}
