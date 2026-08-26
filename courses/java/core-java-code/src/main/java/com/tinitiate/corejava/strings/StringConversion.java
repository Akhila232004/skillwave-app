package com.tinitiate.corejava.strings;

// File: StringConversionExample.java
// 🧠 Topic: String Conversion in Java
// Demonstrates converting between String, primitive types, and character arrays.

public class StringConversion {
    public static void main(String[] args) {

        // 🔹 String → Primitive conversions
        String numStr = "150";
        int num = Integer.parseInt(numStr);               // String to int
        double val = Double.parseDouble("45.67");         // String to double
        boolean boolVal = Boolean.parseBoolean("true");   // String to boolean

        System.out.println("int: " + num);          // Output: int: 150
        System.out.println("double: " + val);       // Output: double: 45.67
        System.out.println("boolean: " + boolVal);  // Output: boolean: true

        // 🔹 Primitive → String conversions
        int age = 25;
        double price = 99.99;
        boolean isJavaFun = true;

        String s1 = String.valueOf(age);    // int to String
        String s2 = String.valueOf(price);  // double to String
        String s3 = String.valueOf(isJavaFun); // boolean to String

        System.out.println("String from int: " + s1);     // Output: String from int: 25
        System.out.println("String from double: " + s2);  // Output: String from double: 99.99
        System.out.println("String from boolean: " + s3); // Output: String from boolean: true

        // 🔹 String → Char Array conversion
        String word = "TINITIATE";
        char[] letters = word.toCharArray();               // Each letter becomes an element
        System.out.println("First char: " + letters[0]);  // Output: First char: T

        // 🔹 Char Array → String conversion
        String rebuilt = new String(letters);              // Builds back a string
        System.out.println("Rebuilt String: " + rebuilt);  // Output: Rebuilt String: TINITIATE
    }
}

/*
Expected Output:
int: 150
double: 45.67
boolean: true
String from int: 25
String from double: 99.99
String from boolean: true
First char: T
Rebuilt String: TINITIATE
*/
