// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * MULTIDIMENSIONAL ARRAYS:
 * - 2D array = a grid (rows x columns). Think seating chart.
 * - 3D array = layers of 2D grids (less common; shown briefly).
 */

import java.util.Arrays;

public class MultidimensionalArrays_2DSeatMap_and_Tiny3D {
    public static void main(String[] args) {
        // 2D boolean grid: false = seat free, true = seat booked
        boolean[][] seats = new boolean[2][3]; // 2 rows, 3 columns
        // All start as false; let's book row 0, col 1:
        seats[0][1] = true;

        // Print the 2D array nicely
        System.out.println(Arrays.deepToString(seats));
        // Example output: [[false, true, false], [false, false, false]]

        // Tiny 3D example: 1 layer, 1 row, 2 cols
        int[][][] tiny = new int[1][1][2]; // [[[0, 0]]]
        tiny[0][0][1] = 7;                 // put value 7 at layer 0, row 0, col 1
        System.out.println(tiny[0][0][1]); // prints 7
    }
}
