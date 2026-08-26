// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.java8features;

// File: LocalDateExample.java
// Demonstrates using LocalDate for date operations.

import java.time.LocalDate;

public class LocalDateExample {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate yesterday = today.minusDays(1);

        System.out.println("Today: " + today);
        System.out.println("Tomorrow: " + tomorrow);
        System.out.println("Yesterday: " + yesterday);
    }
}

/*
Expected Output (sample):
Today: 2025-10-21
Tomorrow: 2025-10-22
Yesterday: 2025-10-20
*/
