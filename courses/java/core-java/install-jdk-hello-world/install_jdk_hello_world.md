# Install JDK & Hello World

Before writing Java programs, you need to install the **Java Development Kit (JDK)**, set up your environment, and run your first Java program.

---

## 📖 History & Motivation
- In early programming, developers had to rely on **platform-specific compilers**.  
- Java introduced the **JVM (Java Virtual Machine)**, which allows compiled code (`.class` files) to run on **any OS**.  
- To write Java programs, we need the **JDK**, which includes the compiler (`javac`) and runtime (`java`).  

---

## 🎯 What Problem It Solves
- Provides a **standard toolkit** (JDK) for compiling and running Java.  
- Eliminates dependency on OS-specific compilers.  
- Allows **cross-platform development** — the same `.class` file runs on Windows, Linux, or macOS.  

---

## 🔮 Next Features / Evolution
- JDK versions have improved with **performance and new language features** (lambdas, modules, records, virtual threads).  
- Modern JDKs (from **Java 11 onward**) follow a **6-month release cycle**.  
- Tools like **IDEA, Eclipse, VS Code** make writing and running programs easier, but **understanding `javac` and `java` is essential**.

---

## 🛠️ Step 1: Install JDK
### Windows
1. Download the JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://jdk.java.net/).  
2. Install by running the `.exe` file.  
3. Set Environment Variables:
   - Add `JAVA_HOME` → `C:\Program Files\Java\jdk-<version>`  
   - Update `Path` → Add `%JAVA_HOME%\bin`  

### Linux / macOS
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# On macOS (with Homebrew)
brew install openjdk@17
```

Check version:
```
java -version
javac -version
```

🛠️ Step 2: Write the First Java Program

* Open a text editor (Notepad, VS Code, IntelliJ, etc.).

* Create a file named HelloWorld.java.

* Add the following code:

🛠️ Step 3: Compile the Program

Run in terminal/command prompt:
```
javac HelloWorld.java
```

This creates a HelloWorld.class file (bytecode).

Bytecode is platform-independent and runs on the JVM.


🛠️ Step 4: Run the Program
java HelloWorld


Output:

Hello, World!

## 🔍 Understanding the main() Method
```
public static void main(String[] args)
```
- public → accessible to JVM.

- static → no need to create an object.

- void → no return value.

- main → entry point of the program.

- String[] args → command-line arguments.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
