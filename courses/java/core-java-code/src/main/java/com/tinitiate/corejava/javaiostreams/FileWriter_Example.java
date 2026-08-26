package com.tinitiate.corejava.javaiostreams;

// File: FileWriter_Example.java
// Topic: Write text to a file using FileWriter (character stream)

import java.io.FileWriter;
import java.io.IOException;

public class FileWriter_Example {
    public static void main(String[] args) {
        String text = "Hello Character Streams!\n";
        try (FileWriter fw = new FileWriter("message.txt")) {
            fw.write(text);
            System.out.println("Wrote message.txt");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Wrote message.txt
*/
