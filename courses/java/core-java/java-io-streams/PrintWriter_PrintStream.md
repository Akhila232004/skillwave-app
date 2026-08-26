# Java PrintWriter and PrintStream

Java provides two important classes for output operations:

* `PrintWriter` – for writing formatted text to files or console
* `PrintStream` – mainly for console output (`System.out` is a PrintStream)

Both support `print()`, `println()`, and `printf()` methods.

---

## PrintWriter

### Key Points

* Writes **text data**
* Supports formatted output using `printf()`
* Does not throw IOException directly (internally handled)
* Can write to files, console, and network streams

### Example: Writing Text Using PrintWriter

```java
import java.io.*;

public class PrintWriterExample {
    public static void main(String[] args) {
        try {
            PrintWriter pw = new PrintWriter("output.txt");

            pw.println("Welcome to Java PrintWriter");
            pw.printf("Name: %s, Age: %d\n", "Rohit", 25);

            pw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

## PrintStream

### Key Points

* Writes both **text** and **raw bytes**
* System.out is a PrintStream
* Useful for console output or logging
* Supports formatted output using `printf()`

### Example: Using PrintStream for Console Output

```java
public class PrintStreamConsoleExample {
    public static void main(String[] args) {
        PrintStream ps = System.out;

        ps.println("Hello from PrintStream");
        ps.printf("Value: %d\n", 100);
    }
}
```

---

### Example: Writing to File Using PrintStream

```java
import java.io.*;

public class PrintStreamFileExample {
    public static void main(String[] args) {
        try {
            PrintStream ps = new PrintStream("log.txt");

            ps.println("Log entry started");
            ps.printf("Status: %s\n", "OK");

            ps.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

## Difference Between PrintWriter and PrintStream

| Feature                    | PrintWriter                    | PrintStream               |
| -------------------------- | ------------------------------ | ------------------------- |
| Text output                | Yes                            | Yes                       |
| Byte output                | No                             | Yes                       |
| Character encoding support | Yes                            | Limited                   |
| Throws IOException         | No (must check error manually) | No                        |
| Typical use                | Text files                     | Console, logs, raw output |

---

## When to Use Them

* Use **PrintWriter** when writing clean text to files.
* Use **PrintStream** when writing logs, debugging output, or printing to the console (`System.out`).  
