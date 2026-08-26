# Exception Handling in Java 

## Introduction to Exception Handling
In Java, exception handling is a powerful mechanism that helps programmers detect and handle runtime errors gracefully, instead of letting the program crash.

Without exception handling, even a small error (like dividing by zero or accessing a null object) can abruptly stop the entire program.

### Key Goals of Exception Handling
* Maintain normal program flow even when something unexpected happens.
* Separate error-handling logic from normal business logic.
* Provide meaningful error messages and debugging information.
* Improve program reliability and robustness.

#### Example (without exception handling)
```java
public class WithoutException {
    public static void main(String[] args) {
        int a = 10, b = 0;
        int result = a / b;   // ❌ Causes ArithmeticException (divide by zero)
        System.out.println("Result: " + result);
    }
}
```
#### Output:
```java
Exception in thread "main" java.lang.ArithmeticException: / by zero
```
> The program terminates immediately, and code after the error never executes.


## What is an Exception?

An exception is an event that disrupts the normal flow of program execution.
It occurs during runtime when something unexpected happens (invalid input, missing file, etc.).

**When an exception occurs:**
* Java creates an Exception object containing details about the error.
* That object is “thrown” to the runtime system.
* The runtime searches for a matching handler (a try-catch block).
* If no handler is found, the program terminates abnormally.

**Example**  
```java
public class ExceptionDemo {
    public static void main(String[] args) {
        System.out.println("Start");
        int[] numbers = {1, 2, 3};
        System.out.println(numbers[5]);  // ❌ ArrayIndexOutOfBoundsException
        System.out.println("End");       // never executes
    }
}
```
**Output:**  
```java
Start
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
```

## Exception Hierarchy (Throwable → Exception / Error)
All exceptions and errors in Java are part of a hierarchical class structure under the root class **Throwable** (in java.lang package).

## Java Exception Hierarchy
- **java.lang.Object**
  - **java.lang.Throwable**
    - **Exception** → represents recoverable conditions
      - IOException
      - SQLException
      - RuntimeException
        - ArithmeticException
        - NullPointerException
        - ArrayIndexOutOfBoundsException
    - **Error** → serious system-level problems
      - OutOfMemoryError
      - StackOverflowError
      - VirtualMachineError

---
### Throwable
* Superclass for all errors and exceptions.
* Has methods like:
   * getMessage() → returns the error message
   * printStackTrace() → prints detailed exception trace
### Exception
* Represents conditions a program can handle.
* Two main categories:
    * Checked Exceptions (compile-time) → e.g., `IOException`, `SQLException`
    * Unchecked Exceptions (runtime) → e.g., `NullPointerException`, `ArithmeticException`
### Error
* Represents serious problems that usually cannot be handled by applications.
* Examples: `OutOfMemoryError`, `StackOverflowError`, `VirtualMachineError`.

Example: **checked vs unchecked**
```java
import java.io.*;

public class HierarchyDemo {
    public static void main(String[] args) throws IOException {
        // Checked Exception: must be handled or declared
        FileReader fr = new FileReader("missing.txt");  // ❌ FileNotFoundException

        // Unchecked Exception: occurs at runtime
        int x = 10 / 0;  // ❌ ArithmeticException
    }
}
```
<!-- ### Exception Types in Java

| **Type** | **Occurs When** | **Checked at Compile-Time?** | **Examples** | **Can Be Handled?** |
|-----------|----------------|-------------------------------|---------------|----------------------|
| **Checked Exception** | External/resource-related errors | ✅ Yes | IOException, SQLException | Yes |
| **Unchecked Exception** | Programming logic errors | ❌ No | NullPointerException, ArithmeticException | Yes |
| **Error** | JVM-related/system failures | ❌ No | OutOfMemoryError, StackOverflowError | No | -->


## Types of Exceptions in Java
In Java, exceptions are categorized mainly into three types based on when and how they occur:
* **Checked Exceptions** – detected at compile time
* **Unchecked Exceptions** (Runtime Exceptions) – occur at runtime
* **Errors** – represent serious system-level failures that usually cannot be handled by code


### 1. Checked Exceptions
  Checked exceptions are those that the compiler checks during compilation.
  If not handled using try-catch or declared using throws, the code won’t compile.

  *  **Characteristics**
      * Usually caused by external conditions (files, databases, networks).
      * The compiler forces you to handle or declare them.
      * Prevents unexpected crashes by enforcing proper handling.

  *  **Common Examples**
      * IOException
      * SQLException
      * FileNotFoundException
      * ParseException

Syntax Example  
```java
import java.io.*;

    public class CheckedExample {
        public static void main(String[] args) {
            try {
                FileReader fr = new FileReader("missing.txt");  // FileNotFoundException
                System.out.println("File opened successfully!");
        }   
            catch (FileNotFoundException e) {
                System.out.println("File not found: " + e.getMessage()); // Output: File not found: missing.txt (if missing)
            }
    }
}
```
> Key Point:
          BChecked exceptions force developers to anticipate and handle predictable failures.

### 2.Unchecked Exceptions (Runtime Exceptions)
Unchecked exceptions occur during program execution and are not checked by the compiler.
They usually indicate logic or programming mistakes (like dividing by zero or using null references).

* **Characteristics**
   * Subclasses of RuntimeException.
   * Do not require try-catch or throws.
   * Usually caused by bad logic, not external problems.  
* **Common Examples**
   * ArithmeticException
   * NullPointerException
   * ArrayIndexOutOfBoundsException
   * NumberFormatException*

Syntax Example  
```java
public class UncheckedExample {
    public static void main(String[] args) {
        int[] nums = {10, 20, 30};
        System.out.println(nums[5]);      // ❌ ArrayIndexOutOfBoundsException
        int x = 10 / 0;                   // ❌ ArithmeticException
        String str = null;
        System.out.println(str.length()); // ❌ NullPointerException
    }
}
```
>Key Point:
Unchecked exceptions represent programmer errors that can be prevented with proper validation and checks.

### 3.Errors
Errors are serious issues that occur beyond the program’s control, typically inside the JVM.
They indicate that the system is in an unstable state (like memory exhaustion).

* **Characteristics**
   * Subclasses of java.lang.Error.
   * Cannot be recovered from (should not be caught or handled normally).
   * Often signal hardware or environment problems.

* **Common Examples**
   * OutOfMemoryError
   * StackOverflowError
   * VirtualMachineError
   * NoClassDefFoundError

Syntax Example  
```java
public class ErrorExample {
    public static void recursive() {
        recursive(); // endless recursion
    }

    public static void main(String[] args) {
        try {
            recursive(); // ❌ Causes StackOverflowError
        } catch (StackOverflowError e) {
            System.out.println("Caught: " + e);
        }
    }
}
```
> Key Point:
Errors indicate system-level failures — catching them is technically possible but rarely useful.

## Handling Exceptions
When exceptions occur, Java lets you handle them gracefully using special blocks of code.
This ensures that even if something goes wrong, your program can recover, log the issue, or clean up resources without crashing.

The three primary mechanisms are:
1. try-catch block  
2. finally block
3. try-with-resources

### 1. The try-catch Block
* Used to wrap risky code that might throw an exception.
* When an exception occurs inside the try block, it is caught and handled in the corresponding catch block.

Syntax
```JAVA
try {
    // code that may throw exception
} catch (ExceptionType e) {
    // handling code
}
```
>Notes
> * You can have multiple catch blocks for different exception types.
> * Exception can be used as a generic catch (but less specific).

**Example**
```JAVA
public class TryCatchExample {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;             // ❌ ArithmeticException
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero!"); // Output: Error: Division by zero!
        }

        System.out.println("Program continues...");         // Output: Program continues...
    }
}
```

### 2. The finally Block
* The finally block is always executed, whether or not an exception occurs.  
* Commonly used to close files, database connections, or release resources.

 Syntax
 ```Java
try {
    // risky code
} catch (Exception e) {
    // handle exception
} finally {
    // cleanup code (always runs)
}
```
**Example**
```java
public class FinallyExample {
    public static void main(String[] args) {
        try {
            int data = 50 / 0; // ❌ ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("Caught Exception: " + e);
        } finally {
            System.out.println("Finally block executed"); // Always runs
        }
        System.out.println("Rest of the code...");         // Output: Rest of the code...
    }
}
```

**Expected Output:**
```java
Caught Exception: java.lang.ArithmeticException: / by zero
Finally block executed
Rest of the code...
```

### 3. try-with-resources Statement (Java 7+)
* A special try form that automatically closes resources (like files, streams, or sockets) when done.
* Any class that implements AutoCloseable can be used inside it.
* Eliminates the need for explicit finally cleanup.
**Syntax** 
```java
try (ResourceType resource = new ResourceType()) {
    // use resource
} catch (Exception e) {
    // handle
}
```
**Example**
```java
import java.io.*;

public class TryWithResourcesExample {
    public static void main(String[] args) {
        // Automatically closes FileReader after use
        try (FileReader fr = new FileReader("sample.txt")) {
            int ch;
            while ((ch = fr.read()) != -1) {
                System.out.print((char) ch); // prints file content
            }
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage()); // Output if file missing: Error: sample.txt (No such file or directory)
        }
    }
}
```
## Throwing Exception
Java allows you to manually create and throw exceptions to indicate that an error has occurred.
This gives you control over when and how exceptions are generated, helping enforce rules, validate input, or signal abnormal situations.  

**There are two keywords used for this purpose:**
* throw → used to throw a single exception object.
* throws → used in method declaration to declare possible exceptions.

### The throw Keyword
Used to explicitly throw an exception inside a method or block.
* The object thrown must be of type Throwable (usually Exception or a subclass).
* Only one exception can be thrown at a time using throw.

Syntax  
```
throw new ExceptionType("error message");
```
**Example**  
```java
public class ThrowKeywordExample {
    public static void main(String[] args) {
        int age = 15;

        if (age < 18) {
            throw new ArithmeticException("Access denied - You must be 18 or older!");
            // program stops here after throwing the exception
        }

        System.out.println("Welcome! You are eligible.");
    }
}
```
Expected Output:
```
Exception in thread "main" java.lang.ArithmeticException: Access denied - You must be 18 or older!
```
>Key Point:
The throw keyword is used inside a method to actually cause an exception to occur.

### throws Keyword
* Used in a method declaration to indicate that the method might throw one or more exceptions.
* It passes the responsibility of handling the exception to the caller of the method.
* Often used with checked exceptions.

Syntax
```java
returnType methodName() throws ExceptionType1, ExceptionType2 {
    // method body
}
```
**Example**
```java
import java.io.*;

public class ThrowsKeywordExample {

    // Method declares it might throw IOException
    static void readFile() throws IOException {
        FileReader file = new FileReader("missing.txt"); // ❌ FileNotFoundException
        BufferedReader fileInput = new BufferedReader(file);
        System.out.println(fileInput.readLine());
        fileInput.close();
    }

    public static void main(String[] args) {
        try {
            readFile(); // caller must handle or declare
        } catch (IOException e) {
            System.out.println("Handled Exception: " + e.getMessage());
        }
        System.out.println("Program continues...");
    }
}
```
Expected Output (if file not found):
```java
Handled Exception: missing.txt (No such file or directory)
Program continues...
```

### Difference Between throw and throws

| **Feature** | **throw** | **throws** |
|--------------|------------|-------------|
| **Purpose** | Actually throws an exception | Declares possible exceptions |
| **Used Inside** | Method body | Method declaration |
| **Throws How Many** | One exception at a time | Multiple exception types |
| **Responsibility** | Generates the exception | Informs caller to handle it |
| **Example** | `throw new IOException("Error!");` | `void read() throws IOException` |

## Custom Exceptions
Sometimes, built-in exceptions (like IOException, ArithmeticException, etc.) 
aren’t enough to describe specific problems in your application.

In such cases, you can create your own custom (user-defined) exceptions to represent domain-specific errors — for example,  
`InvalidAgeException,` `InsufficientFundsException,` or `InvalidInputException.`

**Custom exceptions make your code more:**
* Readable (errors have clear names)
* Maintainable (specific handling for each type)
* Meaningful (describe real-world conditions)

### Defining a Custom Exception
A custom exception is simply a class that extends Exception (for checked exceptions)
or extends RuntimeException (for unchecked exceptions).

Syntax  
```java
class MyException extends Exception {
    public MyException(String message) {
        super(message);  // pass message to parent Exception class
    }
}
```
**Example — Checked Custom Exception**
```java
// Define a custom checked exception
class InvalidAgeException extends Exception {
    public InvalidAgeException(String message) {
        super(message);
    }
}

public class CustomCheckedExample {
    // Method declares it may throw InvalidAgeException
    static void validateAge(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be 18 or older!"); // throw custom exception
        } else {
            System.out.println("Access granted - Age valid");
        }
    }

    public static void main(String[] args) {
        try {
            validateAge(15); // ❌ triggers exception
        } catch (InvalidAgeException e) {
            System.out.println("Caught Exception: " + e.getMessage()); // Output: Caught Exception: Age must be 18 or older!
        }
        System.out.println("Program continues..."); // Output: Program continues...
    }
}
```
Expected Output:
```
Caught Exception: Age must be 18 or older!
Program continues...
```
> Here, InvalidAgeException is a checked exception —
it must be handled using try-catch or declared using throws.

### Example — Unchecked Custom Exception
If you want an exception that does not require explicit handling,
extend RuntimeException instead of Exception.
```java
// Define an unchecked custom exception
class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

public class CustomUncheckedExample {
    static void withdraw(int balance, int amount) {
        if (amount > balance) {
            throw new InsufficientBalanceException("Withdrawal amount exceeds balance!");
        } else {
            System.out.println("Withdrawal successful! Remaining: " + (balance - amount));
        }
    }

    public static void main(String[] args) {
        withdraw(1000, 2000); // ❌ triggers exception
        System.out.println("Transaction complete."); // not executed
    }
}
```
Expected Output:
```
Exception in thread "main" InsufficientBalanceException: Withdrawal amount exceeds balance!
```
>Here, InsufficientBalanceException is unchecked, so the compiler doesn’t require handling —
but it still halts the program unless caught.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|