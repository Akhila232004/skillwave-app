// File: StringOperations_ManipulationExample.java
// 🧠 Topic: String Operations in Java
// Demonstrates concatenation, splitting, joining, immutability, and formatting operations.

public class StringOperations {
    public static void main(String[] args) {

        // 🔹 String Creation
        String firstName = "TINITIATE";
        String lastName = "Technologies";

        // 🔹 Concatenation
        String fullName = firstName + " " + lastName; // Using '+'
        System.out.println("Full Name: " + fullName); // Output: TINITIATE Technologies

        // Using concat() method
        String title = "Java".concat(" Training");
        System.out.println("Title: " + title); // Output: Java Training

        // 🔹 Splitting a String
        String csv = "Apple,Banana,Cherry";
        String[] fruits = csv.split(",");
        System.out.println("Fruits List:");
        for (String f : fruits) {
            System.out.println("- " + f);
        }
        // Output:
        // Fruits List:
        // - Apple
        // - Banana
        // - Cherry

        // 🔹 Joining Strings
        String joined = String.join(" | ", fruits);
        System.out.println("Joined String: " + joined); // Output: Apple | Banana | Cherry

        // 🔹 Searching and Checking
        String sentence = "Learning Java is fun!";
        System.out.println("Contains 'Java': " + sentence.contains("Java"));     // true
        System.out.println("Starts with 'Learn': " + sentence.startsWith("Learn")); // true
        System.out.println("Ends with '!': " + sentence.endsWith("!"));           // true

        // 🔹 Demonstrating Immutability
        String lang = "Java";
        lang.concat(" Programming"); // creates new string but not stored
        System.out.println("After concat (unchanged): " + lang); // Output: Java

        lang = lang.concat(" Programming"); // store result in lang
        System.out.println("After concat (updated): " + lang); // Output: Java Programming

        // 🔹 Formatting Strings
        String course = "Java";
        int duration = 6;
        String formatted = String.format("%s course duration: %d months", course, duration);
        System.out.println(formatted);
        // Output: Java course duration: 6 months
    }
}

/*
Expected Output:
Full Name: TINITIATE Technologies
Title: Java Training
Fruits List:
- Apple
- Banana
- Cherry
Joined String: Apple | Banana | Cherry
Contains 'Java': true
Starts with 'Learn': true
Ends with '!': true
After concat (unchanged): Java
After concat (updated): Java Programming
Java course duration: 6 months
*/
