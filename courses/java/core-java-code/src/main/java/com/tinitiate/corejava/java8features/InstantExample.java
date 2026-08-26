// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.java8features;

// File: InstantExample.java
// Demonstrates using Instant for UTC timestamps.

import java.time.Instant;

public class InstantExample {
    public static void main(String[] args) {
        Instant now = Instant.now();
        Instant afterOneMinute = now.plusSeconds(60);

        System.out.println("Current Instant: " + now);
        System.out.println("After One Minute: " + afterOneMinute);
    }
}

/*
Expected Output:
Current Instant: 2025-10-21T09:30:00Z
After One Minute: 2025-10-21T09:31:00Z
*/