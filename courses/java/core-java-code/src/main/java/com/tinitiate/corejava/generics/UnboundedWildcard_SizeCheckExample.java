// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics Unbounded Wildcards (?)  
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: UnboundedWildcard_SizeCheckExample.java
// 🧠 Topic: Unbounded Wildcards (?)
// Demonstrates how methods can accept lists of any type for generic utility purposes.

import java.util.*;

public class UnboundedWildcard_SizeCheckExample {

    // Works for any list type
    static void showListInfo(List<?> list) {
        System.out.println("List size: " + list.size());
        if (list.isEmpty()) {
            System.out.println("List is empty.");
        } else {
            System.out.println("First element: " + list.get(0));
        }
    }

    public static void main(String[] args) {
        List<Double> prices = Arrays.asList(99.9, 149.5, 299.0);
        List<String> courses = Arrays.asList("Java", "Python", "AWS");

        System.out.println("Prices Info:");
        showListInfo(prices);

        System.out.println("\nCourses Info:");
        showListInfo(courses);
    }
}

/*
Expected Output:
Prices Info:
List size: 3
First element: 99.9

Courses Info:
List size: 3
First element: Java
*/
