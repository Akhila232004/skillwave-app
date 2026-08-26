# What is Log4j?

Log4j is a **logging framework** for Java provided by the Apache Software Foundation.
It is used to record information about what a program is doing while it runs.

Instead of printing messages using `System.out.println`, applications use Log4j to:

* Write **logs** with different importance levels (INFO, DEBUG, ERROR, etc.)
* Send logs to different destinations:

  * Console (terminal)
  * Log files
  * Rolling log files (new file every day/size)
  * Remote logging servers
* Control what gets logged using configuration (no code change needed)

Key points about Log4j:

* It is a **library** that must be added as a dependency (`log4j-api` and `log4j-core` for Log4j 2).
* It works in both **small** programs and **large** enterprise applications.
* It is widely used in **production systems** to track errors and monitor behavior.
* Log4j 2 is the recommended modern version (Log4j 1.x is old and should not be used in new projects).

Typical use cases:

* Debugging issues in development (using `DEBUG` logs).
* Tracking important business events (using `INFO` logs).
* Recording errors and exceptions in production (using `ERROR` logs).
* Auditing and monitoring application behavior over time.

Basic usage idea (will be detailed later):

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Example {
    private static final Logger logger = LogManager.getLogger(Example.class);

    public static void main(String[] args) {
        logger.info("Application started");
        logger.error("Something went wrong");
    }
}
```

Logs are then formatted and routed based on Log4j configuration (e.g., to console or file).


## Need for logging vs `System.out.println`

Beginners often use `System.out.println()` to see what their program is doing.
This is fine for very small programs, but it becomes a problem in **real projects**.

Log4j (and other logging frameworks) solve these problems.

### 1. Control and Filtering

**`System.out.println`**

* Prints everything to the console.
* You cannot easily **turn off** or **filter** messages without changing the code.
* In production, this creates a lot of noise.

**Logging (Log4j)**

* Every message has a **level** (ERROR, WARN, INFO, DEBUG, TRACE).
* You can configure:

  * “Show only ERROR and WARN in production”
  * “Show DEBUG only in development”
* No need to change code; just change the configuration file.

Example idea:

```java
logger.info("User created");
logger.debug("SQL query: SELECT * FROM users WHERE id=1");
```

In production, you can hide `DEBUG` logs but keep `INFO` and `ERROR`.

### 2. Output Destination (Console vs Files vs Others)

**`System.out.println`**

* Always prints to the **console**.
* If the console is closed or not captured, logs are lost.
* Hard to keep a **history** of logs.

**Logging (Log4j)**

* Can write logs to:

  * Console
  * Log files (`app.log`)
  * Rolling log files (new file per day / file size)
  * Remote logging systems (ELK, Splunk, etc.)
* Configuration decides **where** logs go.

### 3. Formatting and Context

**`System.out.println`**

* Just prints a string.
* No automatic timestamp, thread name, class name, etc.

**Logging (Log4j)**

* Each log line can automatically include:

  * Timestamp
  * Log level
  * Thread name
  * Class / logger name
* Makes it easier to track when and where something happened.

Example log format (concept):

```text
2025-12-17 10:30:21 INFO  [main] com.tinitiate.App - Application started
```
### 4. Performance and Maintainability

**`System.out.println`**

* Scattered `println` calls everywhere make code messy.
* To remove them, you must edit code in many places.
* Printing too much to console can also slow down the application.

**Logging (Log4j)**

* Centralized logger usage (e.g., `private static final Logger logger = ...`).
* You can keep logging in code but control volume via config.
* Some logging frameworks support async logging (better performance).

### 5. Production-Ready vs Learning-Only

* `System.out.println` is good for **learning** and **quick debugging** in small programs.
* Logging frameworks like **Log4j** are essential for:

  * **Real-world applications**
  * **Servers**, **web apps**, **microservices**
  * Anything that runs in production and needs monitoring.

## Log Levels: ERROR, WARN, INFO, DEBUG, TRACE

Logging frameworks like Log4j use **levels** to represent the **importance** and **detail** of each log message.

From **most severe** to **most detailed**, the common levels are:

> **ERROR → WARN → INFO → DEBUG → TRACE**

These levels help you control **what gets logged** in different environments (development, testing, production).

### 1. ERROR

* Indicates a **serious problem** in the application.
* Something failed and could not be handled properly.
* Usually means:

  * An exception that stops a specific operation
  * A critical failure in a business process

Examples:

* Database connection failed
* Payment transaction could not be completed
* File not found when it is mandatory

Typical usage:

```java
logger.error("Failed to process payment for orderId={}", orderId, exception);
```

In production, **ERROR** logs are almost always enabled.

### 2. WARN

* Indicates something **unexpected** happened, but the application can still continue.
* Not a full error, but a **warning sign**.
* Useful to highlight:

  * Deprecated usage
  * Temporary issues
  * Suspicious data

Examples:

* Config value is missing, using default
* External service is slow but still responding

Typical usage:

```java
logger.warn("User {} provided an invalid optional parameter, using default value.", userId);
```

In production, you usually keep **WARN** (and ERROR) enabled.

### 3. INFO

* Used for **general information** about normal application flow.
* Good for high-level events:

  * Application start/stop
  * User logged in
  * Order placed
  * Batch job started/finished

Examples:

```java
logger.info("Application started");
logger.info("New user registered with email={}", email);
logger.info("Daily report job finished successfully.");
```

In production, **INFO** is often enabled to see the main business events without too much noise.

### 4. DEBUG

* Used for **detailed debugging information**.
* Helpful when developers are trying to understand what the code is doing step-by-step.
* Can include:

  * Variable values
  * SQL queries
  * Branch decisions

Examples:

```java
logger.debug("Fetching user details for userId={}", userId);
logger.debug("Generated SQL query: {}", sqlQuery);
```

In **development**, DEBUG is usually enabled.
In **production**, DEBUG is often disabled to reduce log size and improve performance.

### 5. TRACE

* The **most detailed** level.
* Used for very fine-grained information, often more detailed than DEBUG.
* Can trace:

  * Every method entry/exit
  * Internal loop steps
  * Deep low-level details

Example:

```java
logger.trace("Entering calculateDiscount() with amount={} and customerType={}", amount, customerType);
```

TRACE is rarely enabled except when investigating very specific problems because it can produce a huge amount of log data.

### How log levels work together

* Each logger is configured with a **minimum level**, e.g. `INFO`.
* If the level is `INFO`, it will log:

  * `INFO`, `WARN`, `ERROR`
* It will **not** log:

  * `DEBUG`, `TRACE`

Example configuration ideas (not full config, just concept):

* **Development:**

  * Level: `DEBUG`
  * Logs: DEBUG, INFO, WARN, ERROR

* **Production:**

  * Level: `INFO`
  * Logs: INFO, WARN, ERROR
  * Optional: sometimes `WARN` and `ERROR` only for very busy systems.

### Small example using all levels

```java
logger.error("Database connection failed, cannot continue.");
logger.warn("Disk space is low. Remaining: {} MB.", remainingMb);
logger.info("User {} logged in.", username);
logger.debug("Loading user profile from cache: key={}", cacheKey);
logger.trace("Entering method getUserById() with id={}", userId);
```

This allows you to decide **later**, via configuration, which of these messages actually get written to console/log files, without changing the code.

## Adding Log4j dependency

Adding the Log4j dependency means telling **Maven or Gradle** to download the Log4j libraries and make them available to your Java project.

You typically use **Log4j 2** in new projects, with at least these two modules:

* `log4j-api` – the public logging API
* `log4j-core` – the actual implementation that writes logs


### 1) Adding Log4j Dependency in Maven

In a Maven project, dependencies are declared in `pom.xml` inside the `<dependencies>` section.

You add Log4j 2 like this:

```xml
<dependencies>

    <!-- Log4j 2 API (logging interface) -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.23.1</version>
    </dependency>

    <!-- Log4j 2 Core (implementation that actually writes logs) -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.23.1</version>
    </dependency>

</dependencies>
```

Explanation:

* `groupId` → `org.apache.logging.log4j` (Apache Log4j project)
* `artifactId` → `log4j-api` and `log4j-core` (two parts of Log4j 2)
* `version` → choose a stable version (here `2.23.1` as an example)

After saving `pom.xml` and reloading the Maven project:

* Maven downloads the Log4j JARs.
* You can now import and use Log4j in your Java classes:

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
```

### 2) Adding Log4j Dependency in Gradle (Groovy DSL)

In a Gradle project using `build.gradle` (Groovy syntax), dependencies go inside the `dependencies {}` block.

Add Log4j 2 like this:

```groovy
dependencies {
    // Log4j 2 API and Core
    implementation 'org.apache.logging.log4j:log4j-api:2.23.1'
    implementation 'org.apache.logging.log4j:log4j-core:2.23.1'
}
```

Format: `groupId : artifactId : version`

After saving `build.gradle` and refreshing the Gradle project:

* Gradle downloads the Log4j JARs.
* Log4j classes become available on the classpath.

### 3) Adding Log4j Dependency in Gradle (Kotlin DSL)

If you use `build.gradle.kts` (Kotlin DSL), the syntax is:

```kotlin
dependencies {
    // Log4j 2 API and Core
    implementation("org.apache.logging.log4j:log4j-api:2.23.1")
    implementation("org.apache.logging.log4j:log4j-core:2.23.1")
}
```

Meaning is the same as the Groovy example.

### 4) Quick Check After Adding Dependency

Once the dependency is added and the project is refreshed, create a simple class to verify imports:

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Log4jCheck {
    private static final Logger logger = LogManager.getLogger(Log4jCheck.class);

    public static void main(String[] args) {
        logger.info("Log4j is working!");
    }
}
```

## Creating and using a Logger
If the imports resolve and the code compiles, Log4j has been added successfully 

Creating and using a Logger in Log4j basically means:

1. Getting a `Logger` object for your class
2. Calling methods like `info()`, `debug()`, `error()` instead of `System.out.println()`

### 1. What is a Logger?

A **Logger** is an object provided by Log4j that you use to write log messages.

* Each class in your project usually has its **own logger**
* The logger has methods like:

  * `logger.error("...")`
  * `logger.warn("...")`
  * `logger.info("...")`
  * `logger.debug("...")`
  * `logger.trace("...")`

These methods write messages at different **log levels**.

### 2. Creating a Logger (standard pattern)

Typical pattern in a Java class:

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class SimpleLogExample {

    // Create a Logger for this class
    private static final Logger logger = LogManager.getLogger(SimpleLogExample.class);

    public static void main(String[] args) {
        logger.info("Application started");
    }
}
```

Explanation:

* `LogManager.getLogger(SimpleLogExample.class)`

  * Creates (or returns) a logger associated with this class.
  * The logger name is usually the class name (`com.yourpackage.SimpleLogExample`).
* `private static final`

  * `static` → one logger shared by all instances of this class.
  * `final` → reference does not change.
  * This pattern is used in almost all real Java projects.

### 3. Logging Messages with Different Levels

Once you have a `Logger`, you use it like this:

```java
logger.error("This is an ERROR message");
logger.warn("This is a WARN message");
logger.info("This is an INFO message");
logger.debug("This is a DEBUG message");
logger.trace("This is a TRACE message");
```

You can also include variables:

```java
String user = "dilip";
int age = 25;

logger.info("User {} has age {}", user, age);
```

Log4j replaces `{}` with the variable values.
This is preferred over string concatenation because it is more efficient and cleaner.

Example:

```java
logger.info("User {} logged in from IP {}", username, ipAddress);
```
### 4. Simple Complete Example

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class CreatingUsingLoggerExample {

    // Step 1: Create a logger for this class
    private static final Logger logger = LogManager.getLogger(CreatingUsingLoggerExample.class);

    public static void main(String[] args) {
        // Step 2: Use logger instead of System.out.println

        logger.info("Application starting...");

        int a = 10;
        int b = 0;

        logger.debug("Values before division: a = {}, b = {}", a, b);

        try {
            int result = a / b;  // This will cause an exception
            logger.info("Result = {}", result);
        } catch (Exception e) {
            // Log error with stack trace
            logger.error("Error while dividing {} by {}", a, b, e);
        }

        logger.info("Application finished.");
    }
}
```

What this shows:

* `logger.info(...)` for normal messages.
* `logger.debug(...)` for detailed debugging info.
* `logger.error(..., e)` logs a message **and** the exception stack trace.

### 5. Where do these logs go?

* By default (if no config), Log4j usually logs to the **console**.
* With proper configuration (next topic: *Basic configuration*), you can:

  * Write logs to a **file**
  * Control the **format** of the logs
  * Control which **levels** are enabled (INFO only, or DEBUG, etc.)

So for this topic (“Creating and using a Logger”), the core is:

1. Add Log4j dependency (already covered)

2. In each class:

   ```java
   private static final Logger logger = LogManager.getLogger(YourClassName.class);
   ```

3. Use `logger.info/debug/error/...` instead of `System.out.println()`.

## Basic configuration (console/file logging)

Log4j 2 is configured using an external configuration file.
The most common format is **XML**, usually named:

* `log4j2.xml`

This file is placed on the **classpath** (for example: `src/main/resources` in a Maven/Gradle project).

The configuration decides:

* Where to write logs (console, file, both)
* Minimum log level (e.g. INFO, DEBUG)
* Log format (timestamp, level, message, etc.)

Key concepts:

* **Logger** – used in your Java code (`logger.info(...)`)
* **Appender** – destination of logs (console, file, etc.)
* **Layout** – how each log line looks (pattern)

### 1. Console logging configuration

A basic `log4j2.xml` with logs going to the **console**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">

    <!-- Define where logs are written: here, the console -->
    <Appenders>
        <Console name="ConsoleAppender" target="SYSTEM_OUT">
            <!-- Layout defines the log line format -->
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %c - %msg%n"/>
        </Console>
    </Appenders>

    <!-- Root logger configuration -->
    <Loggers>
        <!-- Root logger with level INFO, using ConsoleAppender -->
        <Root level="INFO">
            <AppenderRef ref="ConsoleAppender"/>
        </Root>
    </Loggers>

</Configuration>
```

Explanation:

* `<Appenders>`

  * Defines a `Console` appender named `ConsoleAppender`
  * `target="SYSTEM_OUT"` sends logs to standard output
  * `PatternLayout` controls log format, e.g.:

    `2025-12-17 11:20:10 [main] INFO  com.example.App - Application started`

* `<Root level="INFO">`

  * Minimum level is `INFO`
  * Logs at level INFO, WARN, ERROR are shown
  * DEBUG and TRACE messages are ignored

### 2. File logging configuration

To write logs into a **file**, use a `File` or `RollingFile` appender.

Basic file logging example (single log file):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">

    <Appenders>
        <!-- Console appender -->
        <Console name="ConsoleAppender" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %c - %msg%n"/>
        </Console>

        <!-- File appender: writes logs to a specific file -->
        <File name="FileAppender" fileName="logs/app.log" append="true">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %c - %msg%n"/>
        </File>
    </Appenders>

    <Loggers>
        <!-- Root logger with INFO level, logs to console and file -->
        <Root level="INFO">
            <AppenderRef ref="ConsoleAppender"/>
            <AppenderRef ref="FileAppender"/>
        </Root>
    </Loggers>

</Configuration>
```

Notes:

* `fileName="logs/app.log"`

  * Log file will be created under a `logs` folder as `app.log`
* `append="true"`

  * New logs are appended to the same file instead of overwriting

With this config:

* All INFO/WARN/ERROR logs go to both:

  * Console
  * `logs/app.log`


### 3. Rolling file logging (optional overview)

In real applications, log files are often **rotated** (new file per day or when the file is too large).
For this, `RollingFile` appender is used.

Very simple overview example (by size):

```xml
<RollingFile name="RollingFileAppender"
             fileName="logs/app.log"
             filePattern="logs/app-%d{yyyy-MM-dd}-%i.log.gz">
    <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss} [%t] %-5level %c - %msg%n"/>
    <Policies>
        <!-- Roll over when file reaches 10 MB -->
        <SizeBasedTriggeringPolicy size="10MB"/>
    </Policies>
</RollingFile>
```

This is just for concept introduction; basic teaching can stick with simple `File` or `Console` appenders.

### 4. Using the configuration in code

Once `log4j2.xml` is placed correctly on the classpath, the same logger code will use this configuration automatically:

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Log4jConfigDemo {

    private static final Logger logger = LogManager.getLogger(Log4jConfigDemo.class);

    public static void main(String[] args) {
        logger.info("Application started");
        logger.debug("This is a debug message");
        logger.error("Simulated error");
    }
}
```

With the previous root level set to `INFO`:

* `INFO` and `ERROR` will appear in console and file
* `DEBUG` will be ignored unless the level is changed to `DEBUG` in `log4j2.xml`

