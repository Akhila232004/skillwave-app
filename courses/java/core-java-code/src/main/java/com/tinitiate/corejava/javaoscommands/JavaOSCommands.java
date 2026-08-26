
package com.tinitiate.corejava.javaoscommands;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class JavaOSCommands
{
    public static void main(String[] args) 
            throws java.io.IOException, java.lang.InterruptedException 
    {
        // Create a new Runtime instance
        Runtime rtObj = Runtime.getRuntime();

        // ------------------------------
        // Example Windows OS Command
        // ------------------------------
        String windowsOS_Command = "dir c:\\windows";

        // Execute the command using CMD
        Process pObj = rtObj.exec("cmd /c " + windowsOS_Command);

        // ------------------------------
        // Read the OUTPUT of the command
        // ------------------------------
        InputStream is = pObj.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        String line = null;
        while ((line = reader.readLine()) != null)
        {
            System.out.println(line);
        }
        is.close();

        // ------------------------------
        // Read exit value (0 = success)
        // ------------------------------
        System.out.println("OS Process Exit Code: " + pObj.exitValue());

        // Kill the subprocess
        pObj.destroy();
    }
}
