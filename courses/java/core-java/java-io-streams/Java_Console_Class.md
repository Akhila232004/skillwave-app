# Java Console Class

The `Console` class (java.io.Console) is used to read input from the keyboard with better control than `Scanner`, especially when handling passwords because it allows hidden input (no characters shown on screen).

`System.console()` returns the Console object.

---

## Features of Console Class

* Reads text input
* Reads passwords without showing them
* Writes formatted output (`printf`, `format`)
* Works only when the program is run in an actual terminal
  (may return `null` when running inside some IDEs like Eclipse/IntelliJ)

---

## Getting Console Instance

```java
Console c = System.console();
```

If `c` is `null`, it means the program was not run from a compatible terminal.

---

## Reading Input

### readLine() – Read a line of text

```java
Console c = System.console();
String name = c.readLine("Enter your name: ");
System.out.println("Hello " + name);
```

---

## Reading Password (Hidden Input)

`readPassword()` does not show input characters on the screen.

```java
Console c = System.console();
char[] pwd = c.readPassword("Enter password: ");
System.out.println("Password length: " + pwd.length);
```

Password will NOT be printed to the terminal.

---

## Writing Output

```java
Console c = System.console();
c.printf("Welcome %s\n", "Student");
```

---

## Full Example Using Console

```java
import java.io.Console;

public class ConsoleExample {
    public static void main(String[] args) {
        Console c = System.console();

        if (c == null) {
            System.out.println("Console not available");
            return;
        }

        String username = c.readLine("Enter username: ");
        char[] password = c.readPassword("Enter password: ");

        c.printf("Login Successful for user: %s\n", username);
    }
}
```

---
