// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Unboxing Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.wrapperclasses;

public class UnboxingExample {
    public static void main(String[] args) {
        Integer wrappedAge = 25;
        int age = wrappedAge.intValue();  // Unboxing

        System.out.println("Wrapped Integer: " + wrappedAge);
        System.out.println("Unboxed int: " + age);
    }
}
