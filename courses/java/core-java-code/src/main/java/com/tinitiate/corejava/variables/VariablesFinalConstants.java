// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : final keyword
//  Author       : Team Tinitiate
// ==============================================================================


// File: VariablesFinalConstants.java
package com.tinitiate.corejava.variables;

public class VariablesFinalConstants {
    static final double PI = 3.141592653589793; // class-wide constant
    final int MAX_RETRY = 3;                    // per-object constant

    public static void main(String[] args) {
        VariablesFinalConstants v = new VariablesFinalConstants();
        System.out.println("PI : " + PI);
        System.out.println("MAX_RETRY : " + v.MAX_RETRY);

        // PI = 3.14;          // ❌ cannot assign a value to final variable
        // v.MAX_RETRY = 4;    // ❌ cannot reassign final
    }
}
/*
OUTPUT:
PI : 3.141592653589793
MAX_RETRY : 3
*/
