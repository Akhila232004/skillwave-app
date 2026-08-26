import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

/***
//* @AUTHOR  TINITIATE.COM
//* @TOPIC   JAVA Properties File
//* @NOTES   1) .properties file in Java is used to store the application/project configuration data. 
//*          2) Each parameter is stored as key-value pair of strings, one storing 
//*             the NAME of the parameter (called the key), and the other storing the VALUE.
//*          3) Each line in a .properties file normally stores a single property. 
//*          4) Several formats are used to represent: 
//*                  FORMAT 1> key=value
//*                  FORMAT 2> key = value
//*                  FORMAT 3> key:value
//*                  FORMAT 4> key value
//*             Most commonly used FORMAT: "key=value"
//*              5) Comments in the Property File are set using # or !
//*/

public class JavaWriteToPropertiesFile {

    public static void main(String[] args) {
        
        // * Create a Properties Object 
        Properties prop = new Properties();

        try {
            // * set the properties using the Key-value in setProperty
            prop.setProperty("currentcounter", "10000");
            prop.setProperty("loadstream", "load.sales");
            prop.setProperty("threadnumber", "1");

            String config_file_location_and_name = "c:\\tinitiate\\load.properties"; 
            //save properties to project config data folder
            prop.store(new FileOutputStream(config_file_location_and_name), null);

        }
        catch (FileNotFoundException fe) {
            System.out.println("!! Tinitiate Program ERROR !!");
            System.out.println("Set the folder for .properties using in the variable: config_file_location_and_name.");
        }
        catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
