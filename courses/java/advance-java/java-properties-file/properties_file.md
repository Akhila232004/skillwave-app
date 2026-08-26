# Java Properties File Handling

A **Properties file** in Java is a simple text file used to store configuration data in the form of **key–value pairs**.
It is commonly used for:

* Application configuration
* Database connection settings
* Environment values
* Internationalization (resource bundles)
* Logging configuration

Properties files use the `.properties` extension.

## 1. What Is a Properties File?

A `.properties` file stores data as:

```
key = value
```

Example:

```
app.name=Student Management System
app.version=1.0
db.url=jdbc:mysql://localhost:3306/testdb
db.user=root
db.password=admin
```

It is plain text, easy to read and edit, and platform-independent.

## 2. Why Use Properties Files?

* Separate configuration from code
* Modify settings **without recompiling Java program**
* Standard Java support using `java.util.Properties`
* Lightweight and easy to maintain

## 3. `Properties` Class

Java provides the `java.util.Properties` class to:

* Load properties from a file
* Read key–value pairs
* Modify properties
* Store properties back to a file

You must import:

```java
import java.util.Properties;
import java.io.*;
```

## 4. Loading a Properties File

### Example: Reading values

```java
import java.io.FileInputStream;
import java.util.Properties;

public class ReadPropertiesExample {
    public static void main(String[] args) {
        try {
            FileInputStream fis = new FileInputStream("config.properties");

            Properties props = new Properties();
            props.load(fis);

            System.out.println("App Name: " + props.getProperty("app.name"));
            System.out.println("Version : " + props.getProperty("app.version"));
            System.out.println("DB URL  : " + props.getProperty("db.url"));

            fis.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Output (based on file):

```
App Name: Student Management System
Version : 1.0
DB URL  : jdbc:mysql://localhost:3306/testdb
```

## 5. Writing to a Properties File

You can also **create** or **update** properties.

```java
import java.io.FileOutputStream;
import java.util.Properties;

public class WritePropertiesExample {
    public static void main(String[] args) {
        try {
            Properties props = new Properties();

            props.setProperty("app.name", "Employee Portal");
            props.setProperty("app.version", "2.0");
            props.setProperty("author", "TINITIATE");

            FileOutputStream fos = new FileOutputStream("app.properties");

            props.store(fos, "Application Configuration");

            fos.close();

            System.out.println("Properties file created!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Generated file:

```
#Application Configuration
#Wed Nov 27 10:25:12 IST 2025
app.name=Employee Portal
app.version=2.0
author=TINITIATE
```

## 6. Updating Properties (Read → Modify → Write)

```java
import java.io.*;
import java.util.Properties;

public class UpdatePropertiesExample {
    public static void main(String[] args) {
        try {
            FileInputStream fis = new FileInputStream("config.properties");
            Properties props = new Properties();
            props.load(fis);
            fis.close();

            // Modify a value
            props.setProperty("app.version", "1.1");

            // Save back to file
            FileOutputStream fos = new FileOutputStream("config.properties");
            props.store(fos, "Updated Version");
            fos.close();

            System.out.println("Properties updated!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 7. Default Values

When the key does not exist, you can return a default:

```java
String value = props.getProperty("non.existing.key", "defaultValue");
```

## 8. Reading Properties From Classpath

If the file is inside `resources/`:

```java
InputStream in = ClassLoader.getSystemResourceAsStream("config.properties");
Properties props = new Properties();
props.load(in);
```

## 9. Using Properties for Database Connections

**config.properties**

```
db.url=jdbc:mysql://localhost:3306/testdb
db.user=root
db.password=admin
```

**Java Code:**

```java
FileInputStream fis = new FileInputStream("config.properties");
Properties props = new Properties();
props.load(fis);

Connection con = DriverManager.getConnection(
    props.getProperty("db.url"),
    props.getProperty("db.user"),
    props.getProperty("db.password")
);
```

## 10. Advantages of Using Properties

* Keeps configuration outside code
* Easy to change without recompiling
* Secure (passwords can be externalized)
* Standard Java API support
* Works well with frameworks (Spring, Hibernate)
