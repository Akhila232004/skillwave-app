import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Properties;

public class UpdatePropertiesExample {

    public static void main(String[] args) {
        try {
            // 1. Load existing properties from file
            FileInputStream fis = new FileInputStream("config.properties");
            Properties props = new Properties();
            props.load(fis);
            fis.close();

            // 2. Modify or add a property
            //    For example, update the app.version
            props.setProperty("app.version", "1.1");

            // 3. Save the updated properties back to the same file
            FileOutputStream fos = new FileOutputStream("config.properties");
            props.store(fos, "Updated Version");
            fos.close();

            System.out.println("Properties updated!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}