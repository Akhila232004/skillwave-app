// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Operators Expressions
//  Author       : Team Tinitiate
// ==============================================================================



package com.tinitiate.corejava.operatorsexpressions;

public class PrecedenceExample {
    public static void main(String[] args) {
        int result1 = 10 + 5 * 2;
        System.out.println("Result1: " + result1); // 20 → '*' has higher precedence

        int result2 = (10 + 5) * 2;
        System.out.println("Result2: " + result2); // 30 → parentheses first

        int x = 20 - 5 + 2; // Left to right (same precedence)
        System.out.println("Result3: " + x); // 17

        int y = 10;
        y += 5 * 2; // multiplication first → y = 10 + (5*2) = 20
        System.out.println("Result4: " + y); // 20
    }
}
