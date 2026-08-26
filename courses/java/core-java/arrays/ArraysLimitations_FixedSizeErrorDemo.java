// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java Arrays - Fixed Size Error Demonstration
//  Author       : Team Tinitiate
// ==============================================================================

/**
 * WHAT THIS CODE TEACHES:
 * -----------------------
 * Arrays in Java have a FIXED SIZE. Once an array is created,
 * you cannot increase or decrease its length.
 *
 * HOW THE FIXED SIZE LIMITATION APPEARS:
 * --------------------------------------
 * Java does NOT give a direct compile-time message saying
 * "array is fixed size". Instead, the limitation appears
 * as a RUNTIME ERROR when you try to access indexes outside
 * the allocated size.
 *
 * COMMON ERROR SHOWN:
 * -------------------
 * java.lang.ArrayIndexOutOfBoundsException
 *
 * This error occurs when you try to read or write a position
 * that does not exist in the array.
 */

public class ArraysLimitations_FixedSizeErrorDemo {

    public static void main(String[] args) {

        // Create an array of size 3
        int[] numbers = new int[3];

        // Valid indexes: 0, 1, 2
        numbers[0] = 10;
        numbers[1] = 20;
        numbers[2] = 30;

        System.out.println("Array created with size 3.");

        System.out.println("Trying to access index 3...");
        System.out.println("----------------------------------");

        // ❌ FIXED SIZE ERROR DEMO
        // This line will trigger ArrayIndexOutOfBoundsException
        numbers[3] = 40;   // ERROR: index 3 does not exist

        // This line will never execute because error occurs above
        System.out.println("Finished.");
    }
}