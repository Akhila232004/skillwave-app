// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Null And Default Values Example
//  Author       : Team Tinitiate
// ==============================================================================


// File: NullAndDefaultValuesExample.java
package com.tinitiate.corejava.datatypes;

public class NullAndDefaultValues {

    // Instance variables (automatically get default values)
    int number;           // default 0
    double marks;         // default 0.0
    boolean isActive;     // default false
    char grade;           // default '\u0000' (blank)
    String name;          // default null

    public static void main(String[] args) {

        // Create an object to access instance variables
        NullAndDefaultValues obj = new NullAndDefaultValues();

        // Display default values
        System.out.println("Default int value: " + obj.number);
        System.out.println("Default double value: " + obj.marks);
        System.out.println("Default boolean value: " + obj.isActive);
        System.out.println("Default char value: '" + obj.grade + "'");
        System.out.println("Default String value: " + obj.name);

        // Example of null reference
        String city = null;                     // no object assigned
        System.out.println("City: " + city);    // Output: null

        // Check for null before using
        if (city != null) {
            System.out.println(city.length());
        } else {
            System.out.println("City is null, cannot find length");
        }

        // Local variables must be initialized before use
        int age;
        // System.out.println(age); // ❌ Error: variable age might not have been initialized

        // Once initialized
        age = 25;
        System.out.println("Local variable age: " + age);
    }
}

/*
Expected Output:
Default int value: 0
Default double value: 0.0
Default boolean value: false
Default char value: ' '
Default String value: null
City: null
City is null, cannot find length
Local variable age: 25
*/
