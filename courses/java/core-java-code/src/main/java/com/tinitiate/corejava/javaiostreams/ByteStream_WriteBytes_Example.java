// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java I/O Streams ByteStream WriteBytes Example
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaiostreams;
// File: ByteStream_WriteBytes_Simple.java
// Topic: Write raw bytes to a file using FileOutputStream

import java.io.FileOutputStream;
import java.io.IOException;

public class ByteStream_WriteBytes_Example {
    public static void main(String[] args) {
        byte[] data = {72, 101, 108, 108, 111, 10}; // bytes for: H e l l o \n

        try (FileOutputStream out = new FileOutputStream("sample.bin")) {
            out.write(data);
            System.out.println("Wrote " + data.length + " bytes to sample.bin");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Wrote 6 bytes to sample.bin
*/
