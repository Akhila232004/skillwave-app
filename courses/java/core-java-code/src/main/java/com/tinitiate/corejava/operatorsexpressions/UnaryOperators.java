// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Operators Expressions
//  Author       : Team Tinitiate
// ==============================================================================



package com.tinitiate.corejava.operatorsexpressions;

public class UnaryOperators {
    public static void main(String[] args) {
        int a = 5;

        System.out.println("Original value of a: " + a);   // 5
        System.out.println("++a (prefix increment): " + (++a)); // 6
        System.out.println("a++ (postfix increment): " + (a++)); // 6 (prints old value)
        System.out.println("--a (prefix decrement): " + (--a));  // 6
        System.out.println("a-- (postfix decrement): " + (a--)); // 6
        System.out.println("Final value of a: " + a); // 5

        boolean flag = true;
        System.out.println("!flag (NOT): " + (!flag)); // false
    }
}
