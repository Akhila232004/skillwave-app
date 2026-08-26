// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Date & Time (Legacy API)
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javadatetime;
import java.text.*;
import java.util.Date;

/**
 * TOPIC : Date & Time (Legacy API)
 * Demonstrates:
 *  1) Date using printf()
 *  2) Date format codes
 *  3) SimpleDateFormat formatting
 *  4) Parsing custom date strings
 *  5) SimpleDateFormat pattern codes
 */
public class DateTime {
    public static void main(String[] args) {

        // ---------------------------------------------------------
        // 1) java.util.Date & printf() formatting
        // ---------------------------------------------------------
        Date date1 = new Date();
        System.out.println("System Date using toString(): " + date1);

        System.out.println("\nUsing printf() Format Codes:");
        System.out.printf("%1$s %2$tc %n", "Complete date/time:", date1);
        System.out.printf("%1$s %2$tF %n", "ISO Date:", date1);
        System.out.printf("%1$s %2$tD %n", "US Date:", date1);
        System.out.printf("%1$s %2$tT %n", "24-hour time:", date1);
        System.out.printf("%1$s %2$tr %n", "12-hour time:", date1);
        System.out.printf("%1$s %2$tR %n", "HH:mm (no seconds):", date1);
        System.out.printf("%1$s %2$tY %n", "4-digit Year:", date1);
        System.out.printf("%1$s %2$ty %n", "2-digit Year:", date1);
        System.out.printf("%1$s %2$tB %n", "Month Name:", date1);
        System.out.printf("%1$s %2$ta %n", "Weekday Short:", date1);
        System.out.printf("%1$s %2$tH %n", "Hour (0-23):", date1);
        System.out.printf("%1$s %2$tS %n", "Seconds:", date1);
        System.out.printf("%1$s %2$tL %n", "Milliseconds:", date1);
        System.out.printf("%1$s %2$tz %n", "Timezone Offset:", date1);
        System.out.printf("%1$s %2$tZ %n", "Timezone Name:", date1);

        // ---------------------------------------------------------
        // 2) Using SimpleDateFormat
        // ---------------------------------------------------------
        Date date2 = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd hh:mm:ss a zzz");
        System.out.println("\nFormatted (SimpleDateFormat): " + sdf.format(date2));

        // ---------------------------------------------------------
        // 3) Parsing a string into Date
        // ---------------------------------------------------------
        DateFormat formatter = new SimpleDateFormat("MM/dd/yy");
        try {
            Date parsedDate = formatter.parse("01/29/02");
            System.out.println("Parsed Date: " + parsedDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        // ---------------------------------------------------------
        // 4) SimpleDateFormat Pattern Codes
        // ---------------------------------------------------------
        Date systemDate = new Date();
        System.out.println("\nPattern Code Examples:");

        printPattern(systemDate, "G", "Era");
        printPattern(systemDate, "y", "Year");
        printPattern(systemDate, "M", "Month");
        printPattern(systemDate, "d", "Day in month");
        printPattern(systemDate, "H", "Hour (0-23)");
        printPattern(systemDate, "h", "Hour (1-12)");
        printPattern(systemDate, "m", "Minutes");
        printPattern(systemDate, "s", "Seconds");
        printPattern(systemDate, "S", "Milliseconds");
        printPattern(systemDate, "E", "Weekday");
        printPattern(systemDate, "D", "Day of year");
        printPattern(systemDate, "F", "Weekday in month");
        printPattern(systemDate, "w", "Week in year");
        printPattern(systemDate, "W", "Week in month");
        printPattern(systemDate, "a", "AM/PM Marker");
        printPattern(systemDate, "k", "Hour (1-24)");
        printPattern(systemDate, "K", "Hour (0-11)");
        printPattern(systemDate, "z", "Time Zone");
    }

    // Helper Method to reduce repeated code
    public static void printPattern(Date date, String pattern, String label) {
        String result = new SimpleDateFormat(pattern).format(date);
        System.out.println(label + " (" + pattern + "): " + result);
    }
}
