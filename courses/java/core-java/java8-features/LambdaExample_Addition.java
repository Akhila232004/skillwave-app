// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================



// File: LambdaExample3_Addition.java
// Demonstrates a lambda expression that takes parameters and returns a result.

interface MathOperation {
    int operate(int a, int b);
}

public class LambdaExample_Addition {
    public static void main(String[] args) {

        // Using lambda to define addition
        MathOperation add = (x, y) -> x + y;

        // Using lambda to define multiplication
        MathOperation multiply = (x, y) -> x * y;

        System.out.println("Sum: " + add.operate(5, 3));
        System.out.println("Product: " + multiply.operate(5, 3));
    }
}

/*
Expected Output:
Sum: 8
Product: 15
*/
