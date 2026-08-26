package com.tinitiate.corejava.javaoscommands;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author TINITIATE.COM
 *
 * > TOPIC : Java OSCommands, With Java.IO
 *
 * > NOTES : 1) Executing Operating System commands / Processes from Java
 */

public class ExecuteDocCommand
{
    public static void main(String[] args)
    {
        String dosCommand = "cmd /c dir ";
        String dirLocation = "C:\\WINDOWS";
        try
        {
            Runtime rt = Runtime.getRuntime();

            Process process =rt.exec(dosCommand + dirLocation);
            InputStream in = process.getInputStream();

            int ch;
            while((ch = in.read()) != -1)
            {
                System.out.print((char)ch);
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}
