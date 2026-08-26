// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Control Flow Return Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.controlflow;

public class ReturnExample {
    public static int add(int a, int b) {
        return a + b; // exit method and return value
    }

    public static void main(String[] args) {
        int result = add(5, 10);
        System.out.println("Sum: " + result);
    }
}

// Output:
// Sum: 15
