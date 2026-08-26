// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics with Collections  
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: GenericsWithCollections_StudentsExample.java
// 🧠 Topic: Generics with Collections
// Demonstrates how generics ensure type safety when working with Lists in Java.

import java.util.*;

public class GenericsWithCollections_StudentsExample {

    public static void main(String[] args) {
        // ✅ Creating a typed list — only String values (student names) allowed
        List<String> students = new ArrayList<>();

        students.add("Alice");
        students.add("Bob");
        students.add("Charlie");
        // students.add(100); // ❌ Compile-time error: only Strings allowed

        // Loop through the list safely — no need for casting
        System.out.println("Student Names:");
        for (String name : students) {
            System.out.println("- " + name.toUpperCase());
        }

        // ✅ Using another generic list (Integer) for marks
        List<Integer> marks = Arrays.asList(85, 90, 78);

        // Calculate average marks safely
        double avg = 0;
        for (Integer m : marks) {
            avg += m;
        }
        avg /= marks.size();

        System.out.println("\nAverage Marks: " + avg);
    }
}

/*
Expected Output:
Student Names:
- ALICE
- BOB
- CHARLIE

Average Marks: 84.33333333333333
*/
