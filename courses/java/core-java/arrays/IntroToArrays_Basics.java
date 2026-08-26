// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


import java.util.Arrays;

/**
 * INTRO: What is an array?
 * - An array is a fixed row of boxes that hold items of the SAME TYPE.
 * - The number of boxes (length) is fixed when you create it.
 * - Index starts at 0 (first box is index 0).
 */
public class IntroToArrays_Basics { 
    public static void main(String[] args) {
        // Create an int array with 3 boxes. All boxes start with value 0 by default.
        int[] numbers = new int[3];    // [0, 0, 0]

        // Put values into each box (by index).
        numbers[0] = 10;               // first box
        numbers[1] = 20;               // second box
        numbers[2] = 30;               // third box

        // Read values from boxes.
        System.out.println(numbers[0]);     // prints 10
        System.out.println(numbers.length); // prints 3 (how many boxes the array has)

        // Arrays.toString prints a friendly view of a 1D array.
        System.out.println(Arrays.toString(numbers)); // [10, 20, 30]

        /*
         * Expected output:
         * 10
         * 3
         * [10, 20, 30]
         */
    }
}
