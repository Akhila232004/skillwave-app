// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * ONE-DIMENSIONAL ARRAY:
 * Example: calculate total and average of 3 marks.
 */

import java.util.Arrays;

public class OneDimensionalArray_SumAndAverage {
    public static void main(String[] args) {
        // We already know these 3 marks, so we use literal initialization.
        int[] marks = {80, 90, 100};  // 3 items

        // Calculate sum by adding each box.
        int sum = 0;                  // start from 0
        sum += marks[0];              // add first
        sum += marks[1];              // add second
        sum += marks[2];              // add third

        // Average = sum / how many items
        double avg = sum / 3.0;       // use 3.0 (double) so the result is decimal

        // Show what we have
        System.out.println(Arrays.toString(marks)); // [80, 90, 100]
        System.out.println("Sum = " + sum);         // 270
        System.out.println("Average = " + avg);     // 90.0
    }
}
