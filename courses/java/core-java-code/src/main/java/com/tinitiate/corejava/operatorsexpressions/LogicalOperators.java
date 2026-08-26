// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Operators Expressions
//  Author       : Team Tinitiate
// ==============================================================================



package com.tinitiate.corejava.operatorsexpressions;

public class LogicalOperators {
    public static void main(String[] args) {
        int a = 10, b = 5, c = 20;

        System.out.println("(a > b) && (a < c): " + ((a > b) && (a < c))); // true
        System.out.println("(a > b) || (a > c): " + ((a > b) || (a > c))); // true
        System.out.println("!(a > b): " + (!(a > b)));                     // false
    }
}
