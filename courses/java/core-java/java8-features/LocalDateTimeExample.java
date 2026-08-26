// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ============================================================================== 



// File: LocalDateTimeExample.java
// Demonstrates LocalDateTime combining date and time.

import java.time.LocalDateTime;

public class LocalDateTimeExample {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime after = now.plusDays(1).plusHours(3);

        System.out.println("Now: " + now);
        System.out.println("After 1 day and 3 hours: " + after);
    }
}

/*
Expected Output:
Now: 2025-10-21T15:50:22.456789
After 1 day and 3 hours: 2025-10-22T18:50:22.456789
*/
