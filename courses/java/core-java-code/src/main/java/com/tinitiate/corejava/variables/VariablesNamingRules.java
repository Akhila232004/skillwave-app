// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Variable Naming Rules
//  Author       : Team Tinitiate
// ==============================================================================


// File: VariablesNamingRules.java
package com.tinitiate.corejava.variables;

public class VariablesNamingRules {
    public static void main(String[] args) {
        int total_marks = 90;     // valid (underscore OK)
        int totalMarks2025 = 95;  // valid
        String _internalId = "T-1"; // valid but avoid leading underscore unless intentional

        System.out.println("total_marks : " + total_marks);
        System.out.println("totalMarks2025 : " + totalMarks2025);
        System.out.println("_internalId : " + _internalId);

        // ❌ invalid examples (do not compile if uncommented):
        // int 1stScore = 10;   // cannot start with digit
        // int class = 1;       // 'class' is a Java keyword
        // int total-marks = 1; // hyphen not allowed
        // int total marks = 1; // space not allowed
    }
}
/*
OUTPUT:
total_marks : 90
totalMarks2025 : 95
_internalId : T-1
*/
