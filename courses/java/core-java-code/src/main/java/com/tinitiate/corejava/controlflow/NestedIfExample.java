// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Control Flow Nested If Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.controlflow;

public class NestedIfExample {
    public static void main(String[] args) {
        int marks = 85;

        if (marks >= 40) {
            if (marks >= 75) {
                System.out.println("Distinction");
            } else {
                System.out.println("Pass");
            }
        } else {
            System.out.println("Fail");
        }
    }
}

// Output:
// Distinction
