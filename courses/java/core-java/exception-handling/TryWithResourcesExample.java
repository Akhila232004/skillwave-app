// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Try With Resources Example
//  Author       : Team Tinitiate
// ==============================================================================



// Demonstrates automatic resource management
import java.io.*;

public class TryWithResourcesExample {
    public static void main(String[] args) {
        // FileReader implements AutoCloseable → closed automatically
        try (BufferedReader br = new BufferedReader(new FileReader("notes.txt"))) {
            System.out.println("First line: " + br.readLine());
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
        System.out.println("File operation complete.");
    }
}

/*
Expected Output (if file missing):
Error reading file: notes.txt (No such file or directory)
File operation complete.
*/
