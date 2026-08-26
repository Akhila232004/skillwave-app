import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class DbConnectionUsingPropertiesExample {

    public static void main(String[] args) {
        Connection con = null;

        try {
            // 1. Load database settings from properties file
            FileInputStream fis = new FileInputStream("config.properties");
            Properties props = new Properties();
            props.load(fis);
            fis.close();

            // 2. Read DB connection details
            String url      = props.getProperty("db.url");
            String user     = props.getProperty("db.user");
            String password = props.getProperty("db.password");

            // 3. Get connection (JDBC driver must be available)
            con = DriverManager.getConnection(url, user, password);

            System.out.println("Database connection successful!");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 4. Close connection if opened
            try {
                if (con != null) {
                    con.close();
                    System.out.println("Connection closed.");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
