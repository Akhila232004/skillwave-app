// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.java8features;

// File: LocalTimeExample.java
// Demonstrates using LocalTime to represent time of day.

import java.time.LocalTime;

public class LocalTimeExample {
    public static void main(String[] args) {
        LocalTime current = LocalTime.now();
        LocalTime meeting = LocalTime.of(9, 30);
        LocalTime later = meeting.plusHours(2);

        System.out.println("Current Time: " + current);
        System.out.println("Meeting Time: " + meeting);
        System.out.println("After 2 Hours: " + later);
    }
}

/*
Expected Output (sample):
Current Time: 15:42:05.789123400
Meeting Time: 09:30
After 2 Hours: 11:30
*/
