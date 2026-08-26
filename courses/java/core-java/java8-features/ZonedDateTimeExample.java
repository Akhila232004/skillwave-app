// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================


// File: ZonedDateTimeExample.java
// Demonstrates timezone conversion with ZonedDateTime.

import java.time.*;

public class ZonedDateTimeExample {
    public static void main(String[] args) {
        ZonedDateTime india = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        ZonedDateTime usa = india.withZoneSameInstant(ZoneId.of("America/New_York"));

        System.out.println("India Time: " + india);
        System.out.println("New York Time: " + usa);
    }
}

/*
Expected Output (sample):
India Time: 2025-10-21T15:30+05:30[Asia/Kolkata]
New York Time: 2025-10-21T06:00-04:00[America/New_York]
*/
