
// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Throw Keyword Example
//  Author       : Team Tinitiate
// ==============================================================================



// Demonstrates manually throwing an exception
public class ThrowKeywordExample {
    public static void main(String[] args) {
        int marks = -5; // invalid input

        if (marks < 0) {
            // Throwing an exception explicitly
            throw new IllegalArgumentException("Marks cannot be negative!");
        }

        System.out.println("Marks: " + marks);
    }
}

/*
Expected Output:
Exception in thread "main" java.lang.IllegalArgumentException: Marks cannot be negative!
*/
