# Java Properties – Thread-Safe Configuration Store

The java.util.Properties class is a convenient way to store configuration as key–value pairs, where both key and value are usually Strings.
Properties extends Hashtable, so:

* It is thread-safe (its methods are synchronized).
* Multiple threads can safely read and write configuration values using the same Properties object.

It is commonly used to store:

* Application settings
* Database connection details
* Messages and labels
* Environment-specific configuration

## Key Characteristics

* Extends Hashtable<Object, Object>, but typically used with String keys and values.
* Thread-safe: methods like getProperty, setProperty, load, store are synchronized.
* Can load properties from a file or InputStream.
* Can save properties back to a file or OutputStream.
* Supports default Properties for fallback values.

## Common Methods
* setProperty(String key, String value)
  Store or update a property.

* getProperty(String key)
  Retrieve the value for a key, or null if not found.

* getProperty(String key, String defaultValue)
  Retrieve value; return defaultValue if the key is missing.

* load(InputStream inStream)
  Load properties from a file or stream.

* store(OutputStream out, String comments)
  Write properties to a file or stream.

When to Use Properties

* To store configuration as key=value text pairs.
* When multiple threads need to read (and maybe update) the same configuration.
* When you want a simple, file-based configuration mechanism.

Because Properties is synchronized, it is safe for multiple threads to access it. In most apps, properties are loaded once and then mainly read, so contention is usually low.

**Simple Properties Example (Single Thread)**
```java
import java.util.Properties;

public class SimplePropertiesExample {

public static void main(String[] args) {

    // Create a Properties object
    Properties appConfig = new Properties();

    // Store some configuration values
    appConfig.setProperty("app.name", "Tinitiate School App");
    appConfig.setProperty("app.version", "1.0.0");
    appConfig.setProperty("db.url", "jdbc:mysql://localhost:3306/school");
    appConfig.setProperty("db.user", "root");
    appConfig.setProperty("db.password", "root@123");

    // Read values from Properties
    String appName = appConfig.getProperty("app.name");
    String appVersion = appConfig.getProperty("app.version");

    System.out.println("Application Name: " + appName);
    System.out.println("Application Version: " + appVersion);

    // getProperty with default value
    String logLevel = appConfig.getProperty("log.level", "INFO");
    System.out.println("Log Level: " + logLevel);
}
}
```
```
Expected Output (sample)

Application Name: Tinitiate School App
Application Version: 1.0.0
Log Level: INFO
```
This example teaches:

* How to create a Properties object.
* How to set and get configuration values.
* How to use a default value when a key is missing.

**Multithreading Example – Shared Properties Across Threads**  
In this example, multiple threads share one `Properties` object.
The main thread sets some configuration values once, and several reader threads repeatedly read and print those values in parallel.
```java
import java.util.Properties;

public class ThreadSafePropertiesSimpleExample {

    public static void main(String[] args) throws InterruptedException {

        // Shared Properties object (thread-safe because it extends Hashtable)
        Properties sharedConfig = new Properties();

        // Set some configuration values (done once in main thread)
        sharedConfig.setProperty("app.name", "Tinitiate School App");
        sharedConfig.setProperty("app.mode", "DEV");

        // Task: each thread will read and print the same properties
        Runnable readerTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 3; i++) {
                // getProperty() is synchronized inside Properties
                String name = sharedConfig.getProperty("app.name");
                String mode = sharedConfig.getProperty("app.mode");

                System.out.println(threadName + " -> app.name = " + name
                        + ", app.mode = " + mode);

                try {
                    Thread.sleep(200); // small delay so we see interleaving
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Three reader threads using the same Properties object
        Thread t1 = new Thread(readerTask, "Reader-1");
        Thread t2 = new Thread(readerTask, "Reader-2");
        Thread t3 = new Thread(readerTask, "Reader-3");

        t1.start();
        t2.start();
        t3.start();

        t1.join();
        t2.join();
        t3.join();

        System.out.println("All readers finished.");
    }
}
```
```
Expected Output (sample)

Order will vary, but you will see lines like:

Reader-1 -> app.name = Tinitiate School App, app.mode = DEV
Reader-2 -> app.name = Tinitiate School App, app.mode = DEV
Reader-3 -> app.name = Tinitiate School App, app.mode = DEV
Reader-1 -> app.name = Tinitiate School App, app.mode = DEV
Reader-2 -> app.name = Tinitiate School App, app.mode = DEV
Reader-3 -> app.name = Tinitiate School App, app.mode = DEV
Reader-1 -> app.name = Tinitiate School App, app.mode = DEV
Reader-2 -> app.name = Tinitiate School App, app.mode = DEV
Reader-3 -> app.name = Tinitiate School App, app.mode = DEV
All readers finished.
```
## Explanation

* The main thread creates one shared `Properties` object and sets keys like `app.name` and `app.mode`.
* Three reader threads (`Reader-1`, `Reader-2`, `Reader-3`) all read from the **same** `Properties` object.
* Each reader thread reads and prints the values a few times inside a loop.
* The lines from different readers appear in mixed order because the threads run in parallel.
* `Properties` is thread-safe (it extends `Hashtable`), so multiple threads can safely call `getProperty()` at the same time without corrupting data.
