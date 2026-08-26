import java.io.FileInputStream;
import java.util.Properties;

public class ReadPropertiesExample {

    public static void main(String[] args) {
        try {
            // 1. Open the properties file for reading
            FileInputStream fis = new FileInputStream("config.properties");

            // 2. Create Properties object
            Properties props = new Properties();

            // 3. Load key–value pairs from the file into props
            props.load(fis);

            // 4. Read property values by key
            String appName = props.getProperty("app.name");
            String version = props.getProperty("app.version");
            String dbUrl   = props.getProperty("db.url");

            // 5. Print the values
            System.out.println("App Name: " + appName);
            System.out.println("Version : " + version);
            System.out.println("DB URL  : " + dbUrl);

            // 6. Close the file input stream
            fis.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
