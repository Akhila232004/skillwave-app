// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


// File: Stream_ReduceExample.java
// Demonstrates reduce() to calculate sum of numbers

import java.util.*;

public class Stream_ReduceExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(5, 10, 15);

        int total = numbers.stream()
                           .reduce(0, (sum, n) -> sum + n); // accumulator

        System.out.println("Total Sum: " + total);
    }
}

/*
Expected Output:
Total Sum: 30
*/
