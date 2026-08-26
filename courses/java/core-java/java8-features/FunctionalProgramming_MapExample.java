// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================



// File: FunctionalProgramming_MapExample.java
// Topic: Functional Programming - Demonstrating the use of map() for transformation
// Concept: map() applies a given function to each element of a collection (transformation)
// Here, we convert all strings in a list to uppercase using a functional approach.

import java.util.*;
import java.util.stream.Collectors;

public class FunctionalProgramming_MapExample {
    public static void main(String[] args) {

        // Original list of words
        List<String> names = Arrays.asList("tinitiate", "java", "training");

        // Functional programming: map() transforms each element
        List<String> upperNames = names.stream()
                                       .map(name -> name.toUpperCase()) // transformation logic
                                       .collect(Collectors.toList());   // collect results

        System.out.println("Original Names: " + names);
        System.out.println("Uppercase Names: " + upperNames);
    }
}

/*
Expected Output:
Original Names: [tinitiate, java, training]
Uppercase Names: [TINITIATE, JAVA, TRAINING]
*/
