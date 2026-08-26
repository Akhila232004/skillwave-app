// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java Array Declaration
//  Author       : Team Tinitiate
// ==============================================================================


// # Java Array Declaration
//
// - Arrays in Java are declared using **square brackets `[ ]`**.
// - Array elements are accessed using **square brackets `[ ]` for indexing**.
// - **Creating an Array:** Use the data type followed by square brackets `[]` to declare an array.
// - **Initializing an Array:** Assigning values to the array elements.
// - Java supports both **declaration** and **initialization** of arrays.
//
// ---
//
// ## Java Array Null Reference
//
// - By default, Java initializes array elements based on the data type.
// - For **numeric types** (int, byte, short, long, float, double), elements default to **0** or **0.0**.
// - For **boolean**, elements default to **false**.
// - For **reference types** (String, objects), elements default to **null**.
//

public class ArrayDeclaration_1 {

    public static void main(String[] args) {

        // Creating an array (Uninitialized reference)
        // ==========================================
        int[] intArray = null;
        // intArray is only declared, not created in memory.


        // Correct way: Create the array before using indexes
        // ================================================
        intArray = new int[2];  // Allocate memory for 2 elements
        intArray[0] = 100;
        intArray[1] = 200;


        // Declaration and Initialization together
        // =======================================
        int[] intArray_DI = {100, 200, 300};


        // Null Reference Example
        // =======================
        int[] intArray_NR = new int[3];
        // This means values are {0, 0, 0} because int defaults to 0

    }
}
