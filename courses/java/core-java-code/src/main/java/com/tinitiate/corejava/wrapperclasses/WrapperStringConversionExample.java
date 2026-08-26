// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Wrapper String Conversion Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.wrapperclasses;

public class WrapperStringConversionExample {
    public static void main(String[] args) {
        String numberText = "123";
        int number = Integer.parseInt(numberText);

        System.out.println("String value: " + numberText);
        System.out.println("Converted int value: " + number);
    }
}
