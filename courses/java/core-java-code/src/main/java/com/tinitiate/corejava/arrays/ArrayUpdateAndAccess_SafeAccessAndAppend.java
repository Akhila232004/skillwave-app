// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java arrays
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.arrays;

/**
 * UPDATING & ACCESSING ELEMENTS:
 * - Access (read) by index: arr[index]
 * - Update (write) by index: arr[index] = newValue
 * - Safety: avoid crashes with a "safe read" method
 * - Arrays are fixed size; to "add" items, create a new bigger array and copy
 */

import java.util.Arrays;

public class ArrayUpdateAndAccess_SafeAccessAndAppend {
    public static void main(String[] args) {
        int[] ports = {8080, 8081, 8082};         // 3 port numbers

        // Read first and last elements
        int first = ports[0];                      // 8080
        int last  = ports[ports.length - 1];       // 8082
        System.out.println("first=" + first + ", last=" + last);

        // Update the second element (index 1)
        ports[1] = 3000;                           // change 8081 -> 3000
        System.out.println("after update: " + Arrays.toString(ports)); // [8080, 3000, 8082]

        // Safe read: if index is out of bounds, return a fallback value instead of crashing
        System.out.println("safe read idx=5: " + getOrDefault(ports, 5, -1)); // -1 because index 5 doesn't exist

        // Append a new element: make a new array of size+1, copy old items, put new item at the end
        ports = append(ports, 9090);
        System.out.println("after append: " + Arrays.toString(ports)); // [8080, 3000, 8082, 9090]
    }

    /**
     * Return arr[index] if index is valid; otherwise return fallback.
     * This avoids ArrayIndexOutOfBoundsException.
     */
    static int getOrDefault(int[] arr, int index, int fallback) {
        if (index < 0 || index >= arr.length) {
            return fallback;
        }
        return arr[index];
    }

    /**
     * "Append" by creating a new array with +1 capacity and copying old values.
     * Arrays are fixed-size; this is the standard approach.
     */
    static int[] append(int[] arr, int value) {
        int[] bigger = new int[arr.length + 1];             // new array with one extra slot
        System.arraycopy(arr, 0, bigger, 0, arr.length);    // copy old contents into new array
        bigger[bigger.length - 1] = value;                  // place new item at the last index
        return bigger;                                      // return the new array
    }
}
