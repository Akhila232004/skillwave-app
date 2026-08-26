// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Implicit Char To Int
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.typecasting;

public class ImplicitCharToInt {
    public static void main(String[] args) {
        char letter = 'A';
        int asciiValue = letter; // Implicit widening (Unicode value)

        System.out.println("Char value: " + letter);
        System.out.println("Implicitly converted to int (ASCII): " + asciiValue);
    }
}