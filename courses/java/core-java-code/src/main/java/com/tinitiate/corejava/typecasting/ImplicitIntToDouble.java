// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Implicit Int To Double
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.typecasting;

public class ImplicitIntToDouble {
    public static void main(String[] args) {
        int wholeNumber = 15;
        double convertedDouble = wholeNumber; // Implicit widening

        System.out.println("Int value: " + wholeNumber);
        System.out.println("Implicitly converted to double: " + convertedDouble);
    }
}
