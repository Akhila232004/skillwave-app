// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java I/O Streams ByteStream ReadBytes Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaiostreams;
// File: ByteStream_ReadBytes_Simple.java
// Topic: Read raw bytes from a file using FileInputStream

import java.io.FileInputStream;
import java.io.IOException;

public class ByteStream_ReadBytes_Example {
    public static void main(String[] args) {
        try (FileInputStream in = new FileInputStream("sample.bin")) {
            int b;
            while ((b = in.read()) != -1) {     // read() returns one byte as an int 0..255, or -1 at EOF
                System.out.print(b + " ");
            }
            System.out.println();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Run after ByteStream_WriteBytes_Simple.java creates sample.bin

Expected Output:
72 101 108 108 111 10
*/
