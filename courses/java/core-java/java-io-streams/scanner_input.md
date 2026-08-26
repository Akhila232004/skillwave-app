# Java Scanner Class (Keyboard & File Input)

The **Scanner** class (from `java.util` package) is one of the easiest ways to read input in Java.
It is commonly used to read:

* **Keyboard input** (from the user)
* **Data from files**
* **Data from strings**

Scanner supports many built-in methods for reading **numbers**, **strings**, and **tokens**.

---

## Importing Scanner

```java
import java.util.Scanner;
```

---

# Reading Input from Keyboard

Scanner reads from standard input (**System.in**) using:

```java
Scanner sc = new Scanner(System.in);
```

### Example: Reading String, Int, Double

```java
import java.util.Scanner;

public class ScannerKeyboardExample {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter your name: ");
        String name = sc.nextLine();    // Reads full line

        System.out.print("Enter your age: ");
        int age = sc.nextInt();         // Reads integer

        System.out.print("Enter your salary: ");
        double salary = sc.nextDouble(); // Reads decimal

        System.out.println("\n--- User Details ---");
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Salary: " + salary);

        sc.close();
    }
}
```

### Expected Output

```
Enter your name: Rohit
Enter your age: 25
Enter your salary: 55000.50

--- User Details ---
Name: Rohit
Age: 25
Salary: 55000.5
```

---

# Scanner Methods (Most Common)

| Method          | Description                          |
| --------------- | ------------------------------------ |
| `next()`        | Reads a single word (stops at space) |
| `nextLine()`    | Reads the full line including spaces |
| `nextInt()`     | Reads an integer                     |
| `nextDouble()`  | Reads a double                       |
| `nextBoolean()` | Reads true/false                     |
| `nextFloat()`   | Reads float                          |
| `nextLong()`    | Reads long                           |
| `hasNext()`     | Checks if another token exists       |
| `hasNextInt()`  | Checks if next token is int          |

### Tip

When mixing `nextInt()` and `nextLine()`, always clear the leftover newline:

```java
sc.nextLine(); // clear buffer
```

---

# Reading Data from a File using Scanner

You can also use Scanner to read files.

### Example: Read File Line by Line

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class ScannerFileExample {
    public static void main(String[] args) {
        try {
            File file = new File("data.txt");
            Scanner sc = new Scanner(file);

            while (sc.hasNextLine()) {
                String line = sc.nextLine();
                System.out.println(line);
            }

            sc.close();
        }
        catch (FileNotFoundException e) {
            System.out.println("File not found!");
        }
    }
}
```

### Input File: `data.txt`

```
Java
Python
C++
```

### Output

```
Java
Python
C++
```

---

# Reading Numbers from a File

```java
import java.io.File;
import java.util.Scanner;

public class ScannerNumberFile {
    public static void main(String[] args) {
        try {
            Scanner sc = new Scanner(new File("numbers.txt"));

            while (sc.hasNextInt()) {
                int num = sc.nextInt();
                System.out.println("Number: " + num);
            }

            sc.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

---

# Scanner with Custom Delimiter

By default Scanner splits input using **spaces**.

You can change this using:

```java
sc.useDelimiter(",");
```

### Example: Reading CSV String

```java
import java.util.Scanner;

public class ScannerDelimiterExample {
    public static void main(String[] args) {
        String data = "Apple,Banana,Mango";
        Scanner sc = new Scanner(data);

        sc.useDelimiter(",");

        while (sc.hasNext()) {
            System.out.println(sc.next());
        }

        sc.close();
    }
}
```

### Output

```
Apple
Banana
Mango
```

---

# Scanner – Advantages & Limitations

### Advantages

* Easy to use
* Supports many data types
* Works with keyboard, strings, and files
* Built-in checks (`hasNextInt()`, `hasNextDouble()`)

### Limitations

* Slower compared to BufferedReader
* Not suitable for very large files
* Must handle newline issues when mixing `nextInt()` + `nextLine()`

---

