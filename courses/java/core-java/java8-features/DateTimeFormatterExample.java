// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================



// File: DateTimeFormatterExample.java
// Demonstrates formatting and parsing using DateTimeFormatter.

import java.time.*;
import java.time.format.DateTimeFormatter;

public class DateTimeFormatterExample {
    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formatted = now.format(fmt);
        System.out.println("Formatted: " + formatted);

        LocalDate date = LocalDate.parse("21-10-2025", DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        System.out.println("Parsed: " + date);
    }
}

/*
Expected Output:
Formatted: 21-10-2025 15:55:10
Parsed: 2025-10-21
*/
