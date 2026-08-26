// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Custom Exception Example
//  Author       : Team Tinitiate
// ==============================================================================

// Step 1: Define a custom checked exception class
class InvalidScoreException extends Exception {
    public InvalidScoreException(String message) {
        super(message);
    }
}

public class CustomExceptionExample {
    // Step 2: Create a method that throws the custom exception
    static void checkScore(int score) throws InvalidScoreException {
        if (score < 0 || score > 100) {
            throw new InvalidScoreException("Score must be between 0 and 100.");
        } else {
            System.out.println("Valid Score: " + score);
        }
    }

    public static void main(String[] args) {
        try {
            checkScore(120); // invalid → triggers custom exception
        } catch (InvalidScoreException e) {
            System.out.println("Caught Custom Exception: " + e.getMessage());
        }
        System.out.println("Program completed successfully.");
    }
}

/*
Expected Output:
Caught Custom Exception: Score must be between 0 and 100.
Program completed successfully.
*/
