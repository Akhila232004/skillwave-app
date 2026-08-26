// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics  IntroNoGenerics
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: IntroNoGenerics.java  
// ⚠️ Extra Example — shows ClassCastException when using raw List

import java.util.ArrayList;
import java.util.List;

public class IntroNoGenericsDemo {
    public static void main(String[] args) {
        List rawList = new ArrayList();  // raw type — not type-safe
        rawList.add("Java");
        rawList.add(100);  // mixing types!

        try {
            // Runtime crash: trying to cast Integer to String
            String language = (String) rawList.get(1);
            System.out.println(language.toUpperCase());
        } catch (ClassCastException e) {
            System.out.println("⚠️ Runtime Error: " + e);
        }
    }
}

/*
Expected Output:
⚠️ Runtime Error: java.lang.ClassCastException: class java.lang.Integer cannot be cast to class java.lang.String
*/
