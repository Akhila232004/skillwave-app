// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java I/O Streams FileReader Example
//  Author       : Team Tinitiate
// ==============================================================================




// File: FileReader_Example.java
// Topic: Read text from a file using FileReader (character stream)

import java.io.FileReader;
import java.io.IOException;

public class FileReader_Example {
    public static void main(String[] args) {
        try (FileReader fr = new FileReader("message.txt")) {
            int ch;
            while ((ch = fr.read()) != -1) {
                System.out.print((char) ch);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Run after FileWriter_Example.java creates message.txt

Expected Output:
Hello Character Streams!
*/
