// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics  
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: GenericMethod_PrintArrayExample.java
// 🧠 Topic: Generic Methods (Arrays)
// Demonstrates a generic method that prints elements of any array type.

public class GenericMethod_PrintArrayExample {

    // Generic method that prints all elements in an array
    public static <T> void printArray(T[] items) {
        for (T item : items) {
            System.out.print(item + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        String[] languages = {"Java", "Python", "C++"};
        Integer[] numbers = {10, 20, 30};

        System.out.print("Languages: ");
        printArray(languages);

        System.out.print("Numbers: ");
        printArray(numbers);
    }
}

/*
Expected Output:
Languages: Java Python C++
Numbers: 10 20 30
*/
