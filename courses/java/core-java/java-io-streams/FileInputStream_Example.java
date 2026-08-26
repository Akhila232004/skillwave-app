// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Java I/O Streams FileInput Stream Example
//  Author       : Team Tinitiate
// ==============================================================================




// File: FileInputStream_Example.java
// Topic: Read raw bytes from a file using FileInputStream (working directory)

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileInputStream_Example {
    public static void main(String[] args) {
        // ❗ Use the SAME filename your FileOutputStream wrote.
        // If your writer used "binary.dat", keep that here too.
        String fileName = "sample.bin"; // or "sample.bin" — match your writer!
        Path inFile = Path.of(fileName);

        if (!Files.exists(inFile)) {
            System.out.println(fileName + " not found in working folder: " 
                               + Path.of("").toAbsolutePath());
            System.out.println("Create it first (run your FileOutputStream example).");
            return;
        }

        // Read and print byte values (0–255)
        try (FileInputStream in = new FileInputStream(inFile.toFile())) {
            int b;
            while ((b = in.read()) != -1) {
                System.out.print(b + " ");
            }
            System.out.println();
        } catch (IOException e) {
            e.printStackTrace();
        }

        System.out.println("Read from: " + inFile.toAbsolutePath());
    }
}

/*
If the file contains "Hello\n", Expected Output:
72 101 108 108 111 10
Read from: /.../your-project/binary.dat
*/
