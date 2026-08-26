// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics  Bounded Type Parameters (Single Bound)
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: BoundedType_SingleBoundAverageExample.java
// 🧠 Topic: Bounded Type Parameters (Single Bound)
// Demonstrates a generic class that calculates the average of two numbers.
// Only numeric types are allowed because of T extends Number.

class AverageCalculator<T extends Number> {
    private T num1;
    private T num2;

    public AverageCalculator(T num1, T num2) {
        this.num1 = num1;
        this.num2 = num2;
    }

    public double average() {
        return (num1.doubleValue() + num2.doubleValue()) / 2.0;
    }
}

public class BoundedType_SingleBoundAverageExample {
    public static void main(String[] args) {
        AverageCalculator<Integer> intAvg = new AverageCalculator<>(10, 20);
        AverageCalculator<Double> dblAvg = new AverageCalculator<>(2.5, 3.7);
        AverageCalculator<Long> longAvg = new AverageCalculator<>(100L, 200L);

        System.out.println("Average of Integers: " + intAvg.average());
        System.out.println("Average of Doubles: " + dblAvg.average());
        System.out.println("Average of Longs: " + longAvg.average());
        // AverageCalculator<String> strAvg = new AverageCalculator<>("A", "B"); // ❌ compile-time error
    }
}

/*
Expected Output:
Average of Integers: 15.0
Average of Doubles: 3.1
Average of Longs: 150.0
*/
