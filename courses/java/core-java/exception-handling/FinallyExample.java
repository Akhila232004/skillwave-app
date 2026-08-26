// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Finally Example
//  Author       : Team Tinitiate
// ==============================================================================


// Demonstrates finally block usage
public class FinallyExample {
    public static void main(String[] args) {
        try {
            String text = null;
            System.out.println(text.length()); // ❌ NullPointerException
        } catch (NullPointerException e) {
            System.out.println("Caught NullPointerException");
        } finally {
            System.out.println("Finally block executed (cleanup tasks here)");
        }
        System.out.println("End of program.");
    }
}

/*
Expected Output:
Caught NullPointerException
Finally block executed (cleanup tasks here)
End of program.
*/
