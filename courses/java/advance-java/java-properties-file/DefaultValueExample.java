import java.io.FileInputStream;
import java.util.Properties;

public class DefaultValueExample {

    public static void main(String[] args) {
        try {
            FileInputStream fis = new FileInputStream("config.properties");
            Properties props = new Properties();
            props.load(fis);
            fis.close();

            // Existing key
            String appName = props.getProperty("app.name");

            // Non-existing key, but with a default
            String theme = props.getProperty("app.theme", "light");

            System.out.println("App Name : " + appName);
            System.out.println("App Theme: " + theme); // "light" if key not found

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}