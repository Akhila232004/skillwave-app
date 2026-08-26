import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

/***
// * @AUTHOR  TINITIATE.COM
// * @TOPIC   JAVA Properties File
// * @NOTES   1) .properties file in Java is used to store the application/project configuration data. 
// *          2) Each parameter is stored as key-value pair of strings, one storing 
// *             the NAME of the parameter (called the key), and the other storing the VALUE.
// *          3) Each line in a .properties file normally stores a single property. 
// *          4) Several formats are used to represent: 
// *                  FORMAT 1> key=value
// *                  FORMAT 2> key = value
// *                  FORMAT 3> key:value
// *                  FORMAT 4> key value
// *             Most commonly used FORMAT: "key=value"
// *              5) Comments in the Property File are set using # or !
// */

public class JavaReadPropertiesFile {

    public static void main(String[] args) {
        
        // * Local Variables to hold the Properties
        String HostName;
        String databaseName;
        String schema;
        String dbpassword;
        String dbport;

        // * Create a Properties Object
        Properties prop = new Properties();

        try {
            // Load the config.properties file
            // *-------------------------------------------------
            // * Make sure the Path of the File is correctly set.
            // *-------------------------------------------------

            String config_file_location_and_name = "c:\\tinitiate\\config.properties";
            prop.load(new FileInputStream(config_file_location_and_name));

            // * Load a properties file from classpath
            // * > This not the common method of usage as the CONFIG changes from one environment to another
            // *   As the JAR File (Java Project) is moved across Development, Test and PROD environments
            // *   The more preferred way to store config.properties is in an External folder location            
            // * But in either case for Common Properties, use the following line instead of HardCoding as 
            // * Shown above in the UnCommented 
            // prop.load(JavaReadPropertiesFile.class.getClassLoader().getResourceAsStream("config.properties"));
                
            // Read the Property Value by passing the Name to getProperty
            HostName     = prop.getProperty("hostname");
            databaseName = prop.getProperty("database");
            schema       = prop.getProperty("dbuser");
            dbpassword   = prop.getProperty("dbpass");
            dbport       = prop.getProperty("port");

            // Print the OutPut
            System.out.println("HostName " + HostName);
            System.out.println("databaseName " + databaseName);
            System.out.println("schema " + schema);
            System.out.println("dbpassword " + dbpassword);

            // USE the Parameters read from the Properties file..Generate the url for a JDBC connection:
            String url = "jdbc:oracle:thin:@" + HostName + ":" + dbport + ":" + databaseName;
            System.out.println("Database Connection URL: " + url);

        } 
        catch (FileNotFoundException fe) {
            System.out.println("!! Tinitiate Program ERROR !!");
            System.out.println("Place the config.properties in c:\\tinitiate\\ folder");
            System.out.println("Or Change the value of the variable: config_file_location_and_name with correct information");
        }
        catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
