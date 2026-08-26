# **Java OS Commands**

### *Executing Operating System Commands from Java*

## **1. Introduction**

Java provides the ability to execute **Operating System commands** (Windows, Linux, macOS) directly from a Java program.
This is useful for:

* Running terminal/command-line tools
* Starting external applications
* Automating OS-level tasks
* Reading the output of system commands

Java provides two important classes for this:

* `Runtime`
* `Process`

---

## **2. Runtime Class**

The `Runtime` class represents the environment in which a Java application runs.

### **Important Methods**

* #### **`static Runtime getRuntime()`**
   Returns the singleton `Runtime` object for the current application.

* #### **`Process exec(String command)`**
  Executes the OS command in a **separate process**.

### **Usage Example**

```java
Runtime rt = Runtime.getRuntime();
Process p = rt.exec("ping google.com");
```
---

## **3. Process Class**

A `Process` object represents a running OS command.
You can use it to:

* Read output
* Read errors
* Send input
* Kill the process
* Get exit status

### **Key Methods**

#### ✔ **`destroy()`**

Terminates the subprocess.

#### ✔ **`exitValue()`**

Returns the exit code of the process.
(0 usually means success)

#### ✔ **`getInputStream()`**

Reads **normal output** of the command (same as terminal output).

#### ✔ **`getErrorStream()`**

Reads **error messages** produced by the command.

#### ✔ **`getOutputStream()`**

Allows sending input *to the running process*.

---