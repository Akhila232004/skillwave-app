// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Operators Expressions
//  Author       : Team Tinitiate
// ==============================================================================



package com.tinitiate.corejava.operatorsexpressions;

public class MixedOperators {
    public static void main(String[] args) {
        int a = 5, b = 2;
        int result = ++a * b-- + a / b;

        System.out.println("Result: " + result);
        // Step-by-step:
        // ++a → 6
        // b-- → 2 (then b becomes 1)
        // a / b → 6 / 1 = 6
        // 6 * 2 + 6 = 18
    }
}
