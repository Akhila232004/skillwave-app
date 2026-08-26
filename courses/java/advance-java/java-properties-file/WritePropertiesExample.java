import java.io.FileOutputStream;
import java.util.Properties;

public class WritePropertiesExample {

    public static void main(String[] args) {
        try {
            // 1. Create an empty Properties object
            Properties props = new Properties();

            // 2. Add key–value pairs (configuration data)
            props.setProperty("app.name", "Employee Portal");
            props.setProperty("app.version", "2.0");
            props.setProperty("author", "TINITIATE");

            // 3. Open an output stream to the .properties file
            FileOutputStream fos = new FileOutputStream("app.properties");

            // 4. Store the properties to the file with a comment header
            props.store(fos, "Application Configuration");

            // 5. Close the stream
            fos.close();

            System.out.println("Properties file created!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}