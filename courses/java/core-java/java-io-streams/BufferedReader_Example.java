// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java I/O Streams Buffered Reader Example
//  Author       : Team Tinitiate
// ==============================================================================




// File: BufferedReader_Example.java
// Topic: Fast character reading using BufferedReader (character stream with buffer)

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class BufferedReader_Example {
    public static void main(String[] args) {
        String file = "buffered.txt"; // Run after BufferedWriter_Example creates this file

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) { // reads one line at a time
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output (console):
BufferedWriter makes writing faster!
It uses an internal character buffer.
*/
