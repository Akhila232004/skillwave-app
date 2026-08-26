// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * DECLARE & INITIALIZE:
 * Two common ways to create arrays:
 * 1) Make empty boxes first, fill later.
 * 2) Fill boxes immediately with known values.
 */

import java.util.Arrays;

public class DeclaringAndInitializingArrays_TwoWays {
    public static void main(String[] args) {
        // Way 1: declare with size, fill later (defaults are null for objects, 0 for numbers)
        String[] fruits = new String[3]; // [null, null, null]
        fruits[0] = "Apple";
        fruits[1] = "Banana";
        fruits[2] = "Mango";

        // Way 2: literal initialization (values known now)
        String[] colors = {"Red", "Green", "Blue"};

        // Print both arrays
        System.out.println(Arrays.toString(fruits)); // [Apple, Banana, Mango]
        System.out.println(Arrays.toString(colors)); // [Red, Green, Blue]
    }
}
