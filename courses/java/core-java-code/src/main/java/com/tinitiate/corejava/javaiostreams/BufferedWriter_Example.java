// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java I/O Streams Buffered Writer Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaiostreams;

// File: BufferedWriter_Example.java
// Topic: Fast character writing using BufferedWriter (character stream with buffer)

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BufferedWriter_Example {
    public static void main(String[] args) {
        String file = "buffered.txt";

        // try-with-resources auto-closes and flushes the writer
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(file))) {
            bw.write("BufferedWriter makes writing faster!");
            bw.newLine(); // OS-friendly newline
            bw.write("It uses an internal character buffer.");
            System.out.println("Wrote " + file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output (console):
Wrote buffered.txt

File content (buffered.txt):
BufferedWriter makes writing faster!
It uses an internal character buffer.
*/
