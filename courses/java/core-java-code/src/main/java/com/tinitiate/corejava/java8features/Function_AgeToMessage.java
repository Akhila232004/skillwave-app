// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.java8features;

// File: Function_AgeToMessage.java
// Demonstrates Function<T,R> that converts a number into a sentence

import java.util.function.Function;

public class Function_AgeToMessage {
    public static void main(String[] args) {
        Function<Integer, String> ageMessage = age -> "You are " + age + " years old.";

        System.out.println(ageMessage.apply(18));
        System.out.println(ageMessage.apply(25));
    }
}

/*
Expected Output:
You are 18 years old.
You are 25 years old.
*/
