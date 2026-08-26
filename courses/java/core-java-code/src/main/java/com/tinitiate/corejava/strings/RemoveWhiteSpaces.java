// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Strings
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.strings;

/**
 * Remove White Spaces
 * -------------------
 * Removes all spaces from a given string.
 */
public class RemoveWhiteSpaces {
    public static void main(String[] args) {
        String sentence = "Java is fun to learn";
        String noSpaces = sentence.replace(" ", "");

        System.out.println("Original: " + sentence);
        System.out.println("Without spaces: " + noSpaces);
    }
}

/*
Expected output:
Original: Java is fun to learn
Without spaces: Javaisfuntolearn
*/
