// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Exception Handling Throws Keyword Example
//  Author       : Team Tinitiate
// ==============================================================================



// Demonstrates declaring exceptions with 'throws'
import java.io.*;

public class ThrowsKeywordExample {
    static void openFile() 
    
    throws IOException {
        // FileReader may throw IOException
        FileReader fr = new FileReader("data.txt");
        System.out.println("File opened successfully!");
        fr.close();
    }

    public static void main(String[] args) {
        try {
            openFile(); // must handle IOException here
        } catch (IOException e) {
            System.out.println("Handled: " + e.getMessage());
        }
        System.out.println("Program finished normally.");
    }
}

/*
Expected Output (if file missing):
Handled: data.txt (No such file or directory)
Program finished normally.
*/
