// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Primitive Data Types
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.datatypes;

public class PrimitiveDataTypes {
    public static void main(String[] args) {
        demoByte();
        demoShort();
        demoInt();
        demoLong();
        demoFloat();
        demoDouble();
        demoBoolean();
        demoChar();
        demoOverflowAndCasting();
    }

    static void demoByte() {
        System.out.println("=== byte ===");
        byte b = 120;
        byte neg = -5;
        System.out.println("b = " + b + ", neg = " + neg);
        System.out.println();
    }

    static void demoShort() {
        System.out.println("=== short ===");
        short s = 12_000;
        short yearOffset = -25;
        int sum = s + yearOffset;
        System.out.println("s = " + s + ", yearOffset = " + yearOffset + ", s + yearOffset = " + sum);
        System.out.println();
    }

    static void demoInt() {
        System.out.println("=== int ===");
        int count = 1_000_000;
        int index = 3;
        int remaining = count - index;
        System.out.println("count = " + count + ", index = " + index + ", remaining = " + remaining);
        System.out.println();
    }

    static void demoLong() {
        System.out.println("=== long ===");
        long big = 9_223_372_000L;
        long doubled = big * 2;
        System.out.println("big = " + big + ", doubled = " + doubled);
        System.out.println();
    }

    static void demoFloat() {
        System.out.println("=== float ===");
        float ratio = 0.75f;
        float piApprox = 3.1415927f;
        float areaFactor = ratio * piApprox;
        System.out.printf("ratio = %.7f, piApprox = %.7f, ratio * piApprox = %.7f%n",
                ratio, piApprox, areaFactor);
        System.out.println();
    }

    static void demoDouble() {
        System.out.println("=== double ===");
        double price = 199.99;
        double taxRate = 0.18;
        double tax = price * taxRate;
        double total = price + tax;
        System.out.printf("price = %.2f, taxRate = %.2f, tax = %.4f, total = %.4f%n",
                price, taxRate, tax, total);
        System.out.println();
    }

    static void demoBoolean() {
        System.out.println("=== boolean ===");
        int age = 19;
        boolean isAdult = age >= 18;
        boolean eligibleForStudentDiscount = age <= 16;
        System.out.println("age = " + age +
                ", isAdult = " + isAdult +
                ", eligibleForStudentDiscount = " + eligibleForStudentDiscount);
        System.out.println();
    }

    static void demoChar() {
        System.out.println("=== char ===");
        char grade = 'A';
        char rupee = '\u20B9'; // ₹
        int gradeCode = grade;
        System.out.println("grade = " + grade + " (code " + gradeCode + "), rupee = " + rupee);
        System.out.println();
    }

    static void demoOverflowAndCasting() {
        System.out.println("=== overflow & casting quick demo ===");
        int max = Integer.MAX_VALUE;
        int wrap = max + 1;
        double d = 123.987;
        int narrowed = (int) d;
        long widened = 42; // int -> long (implicit)
        System.out.println("Integer.MAX_VALUE = " + max + ", max + 1 = " + wrap);
        System.out.println("double 123.987 cast to int = " + narrowed);
        System.out.println("int 42 widened to long = " + widened);
        System.out.println();
    }
}