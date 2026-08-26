// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.java8features;

// File: Stream_SortedMapExample.java
// Sorts names alphabetically and converts them to uppercase

import java.util.*;
import java.util.stream.*;

public class Stream_SortedMapExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Ravi", "Anu", "Zara", "Kiran");

        List<String> sortedUpper = names.stream()
                                        .sorted()
                                        .map(String::toUpperCase)
                                        .collect(Collectors.toList());

        System.out.println("Sorted Uppercase Names: " + sortedUpper);
    }
}

/*
Expected Output:
Sorted Uppercase Names: [ANU, KIRAN, RAVI, ZARA]
*/
