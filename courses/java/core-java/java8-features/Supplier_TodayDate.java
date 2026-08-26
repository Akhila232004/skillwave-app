// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : java 8 Features
//  Author       : Team Tinitiate
// ==============================================================================



// File: Supplier_TodayDate.java
// Demonstrates Supplier<T> that supplies the current date

import java.time.LocalDate;
import java.util.function.Supplier;

public class Supplier_TodayDate {
    public static void main(String[] args) {
        Supplier<LocalDate> today = () -> LocalDate.now();

        System.out.println("Today's Date: " + today.get());
    }
}

/*
Expected Output:
Today's Date: 2025-10-21   // (varies based on current date)
*/
