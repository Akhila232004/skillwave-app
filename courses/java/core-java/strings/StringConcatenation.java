// File: StringConcatenationExample.java
// 🧠 Topic: String Concatenation in Java
// Demonstrates different ways to combine strings and variables in Java.

public class StringConcatenation {
    public static void main(String[] args) {
        String language = "Python";
        String topic = "Basics";
        int duration = 30;

        // 1️⃣ Using '+' operator (most common)
        String msg1 = language + " " + topic;
        System.out.println(msg1);  // Output: Python Basics

        // 2️⃣ Using concat() method
        String msg2 = language.concat(" ").concat("Programming");
        System.out.println(msg2);  // Output: Python Programming

        // 3️⃣ Using String.join() to join multiple strings
        String msg3 = String.join(" - ", "HTML", "CSS", "JavaScript");
        System.out.println(msg3);  // Output: HTML - CSS - JavaScript

        // 4️⃣ Using String.format() for cleaner formatting
        String msg4 = String.format("Course: %s | Duration: %d days", language, duration);
        System.out.println(msg4);  // Output: Course: Python | Duration: 30 days

        // 5️⃣ Combining text + variables directly
        String msg5 = "Learn " + language + " " + topic + " in " + duration + " days!";
        System.out.println(msg5);  // Output: Learn Python Basics in 30 days!
    }
}

/*
Expected Output:
Python Basics
Python Programming
HTML - CSS - JavaScript
Course: Python | Duration: 30 days
Learn Python Basics in 30 days!
*/
