// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


// File: Predicate_CheckStartsWith.java
// Demonstrates Predicate<T> to check if a string starts with 'J'

import java.util.function.Predicate;

public class Predicate_CheckStartsWith {
    public static void main(String[] args) {
        Predicate<String> startsWithJ = word -> word.startsWith("J");

        System.out.println("Java starts with J? " + startsWithJ.test("Java"));
        System.out.println("Python starts with J? " + startsWithJ.test("Python"));
    }
}

/*
Expected Output:
Java starts with J? true
Python starts with J? false
*/
