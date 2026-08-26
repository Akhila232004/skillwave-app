// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Simple Exception
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates how an exception interrupts normal flow
public class SimpleException {
    public static void main(String[] args) {
        System.out.println("Opening file...");

        String fileName = null;
        // Trying to call a method on a null object → NullPointerException
        System.out.println(fileName.length());

        System.out.println("File closed."); // This line never executes
    }
}

/*
Expected Output:
Opening file...
Exception in thread "main" java.lang.NullPointerException
*/
