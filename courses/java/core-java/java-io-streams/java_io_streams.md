## Java I/O (Input/Output)  
Java I/O (Input/Output) is a set of classes and interfaces that allow Java programs to read data from and write data to sources such as:

* Files
* Keyboard / Console
* Network sockets
* Memory arrays

All I/O classes are part of the java.io package.

###  Byte Streams vs Character Streams

| **Type** | **Class Hierarchy** | **Handles** | **Example Classes** | **Use Case** |
|-----------|---------------------|--------------|----------------------|---------------|
| **Byte Streams** | InputStream / OutputStream | Binary data (8-bit bytes) | FileInputStream, FileOutputStream | Images, audio, PDF |
| **Character Streams** | Reader / Writer | Text data (16-bit chars) | FileReader, FileWriter | Reading/writing text files |

**Summary:**
* Byte Streams: work with raw binary data.
* Character Streams: automatically handle character encoding (e.g., UTF-8).


### InputStream & OutputStream

These are abstract classes that form the foundation of all byte-based I/O.
* InputStream → for reading data (input)
* OutputStream → for writing data (output)

**Example:** Reading and Writing Bytes
```java
// Demonstrates basic byte stream I/O
import java.io.*;

public class ByteStreamExample {
    public static void main(String[] args) {
        try {
            // Writing data to a file
            FileOutputStream fout = new FileOutputStream("data.txt");
            String text = "Hello Java I/O!";
            fout.write(text.getBytes());
            fout.close();

            // Reading data from file
            FileInputStream fin = new FileInputStream("data.txt");
            int i;
            while ((i = fin.read()) != -1) {
                System.out.print((char) i);
            }
            fin.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Hello Java I/O!
*/
```

### Reader & Writer Classes
Reader and Writer are abstract classes for character-based I/O.
They read and write Unicode characters (not bytes).

| **Abstract Class** | **Direction** | **Example** |
|---------------------|----------------|--------------|
| **Reader** | Input (read) | FileReader, BufferedReader |
| **Writer** | Output (write) | FileWriter, BufferedWriter |
 
**Example:** Using FileReader & FileWriter
```java
import java.io.*;

public class CharStreamExample {
    public static void main(String[] args) {
        try {
            // Writing characters to a file
            FileWriter fw = new FileWriter("message.txt");
            fw.write("Learning Java File Handling!");
            fw.close();

            // Reading characters from file
            FileReader fr = new FileReader("message.txt");
            int ch;
            while ((ch = fr.read()) != -1) {
                System.out.print((char) ch);
            }
            fr.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Learning Java File Handling!
*/
```

## Introduction to File Handling

File handling in Java allows programs to store, read, and modify data in files permanently on disk.
While variables and objects store data temporarily (in memory), files store data persistently — even after the program ends.

The core classes for file handling are part of the java.io package.

### Common Operations
* Create new files
* Write data to files
* Read data from files
* Append data to existing files
* Copy, delete, or modify files

## 1. FileReader and FileWriter (Character Streams)
#### Purpose
FileReader and FileWriter are used to read and write text files (character data).
They work with 16-bit Unicode characters, making them ideal for plain text (e.g., .txt, .csv, .xml).

#### Key Points

| **Feature** | **FileReader** | **FileWriter** |
|--------------|----------------|----------------|
| **Purpose** | Reads characters from file | Writes characters to file |
| **Extends** | Reader | Writer |
| **Type** | Character Stream | Character Stream |
| **Handles Encoding** | Yes (UTF-8, etc.) | Yes |
| **Use Case** | Reading text data | Writing or appending text |

**Example: Writing to a File using FileWriter**
```java
import java.io.FileWriter;
import java.io.IOException;

public class WriteExample {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("output.txt");
            writer.write("Hello, Java FileWriter!");
            writer.close();
            System.out.println("File written successfully!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


/*
Expected Output:
Data written successfully!

File content (notes.txt):
Java FileWriter Example
Writing character data to a text file.
*/
```
Notes:  
* FileWriter overwrites existing files by default.  
To append data, use:
```java
new FileWriter("notes.txt", true);
```
* Always close the file after use (writer.close() / reader.close()).

## 2. BufferedReader and BufferedWriter (Buffered Character Streams)
#### Purpose

BufferedReader and BufferedWriter are wrapper classes that make file reading/writing faster by storing data in a temporary memory buffer.

Instead of reading/writing one character at a time, they handle larger chunks internally — improving performance.

#### Key Points

| **Feature** | **BufferedReader** | **BufferedWriter** |
|--------------|--------------------|--------------------|
| **Extends** | Reader | Writer |
| **Efficiency** | High-speed reading | High-speed writing |
| **Extra Methods** | readLine() | newLine() |
| **Use Case** | Reading text files line-by-line | Writing large text files efficiently |

**Example**: Writing using BufferedWriter
```java
import java.io.*;

public class BufferedWriterExample {
    public static void main(String[] args) {
        try {
            BufferedWriter bw = new BufferedWriter(new FileWriter("buffered.txt"));
            bw.write("BufferedWriter makes writing faster!");
            bw.newLine();
            bw.write("It uses an internal character buffer.");
            bw.close();

            System.out.println("Data written using BufferedWriter!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Data written using BufferedWriter!

File content (buffered.txt):
BufferedWriter makes writing faster!
It uses an internal character buffer.
*/
```
**Example**: Reading using BufferedReader
```java
import java.io.*;

public class BufferedReaderExample {
    public static void main(String[] args) {
        try {
            BufferedReader br = new BufferedReader(new FileReader("buffered.txt"));
            String line;

            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
BufferedWriter makes writing faster!
It uses an internal character buffer.
*/
```
Notes:
* BufferedReader reads line by line, which makes it ideal for text file parsing.
* BufferedWriter.newLine() adds a system-dependent line break (\n or \r\n).
* Always close streams after use to release system resources.

## FileInputStream and FileOutputStream (Byte Streams)
These are used for reading and writing binary files (non-text data) — such as images, audio, PDFs, or serialized objects.

They work with bytes (8-bit), not characters

### Key Points

| **Feature** | **FileInputStream** | **FileOutputStream** |
|--------------|--------------------|----------------------|
| **Purpose** | Read binary data | Write binary data |
| **Extends** | InputStream | OutputStream |
| **Use Case** | Reading images, media files | Copying files, writing binary content |
| **Reads/Writes** | Bytes (int values 0–255) | Bytes |

**Example:** Writing to File using FileOutputStream
```java
import java.io.*;

public class FileOutputStreamExample {
    public static void main(String[] args) {
        try {
            FileOutputStream fout = new FileOutputStream("binary.dat");
            String text = "FileOutputStream writes bytes.";
            fout.write(text.getBytes());
            fout.close();

            System.out.println("Data written in binary form!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Data written in binary form!
*/
```
Notes:
* FileInputStream / FileOutputStream handle data as bytes, not text.
* Suitable for binary content — e.g., images, ZIP files, documents.
* Always close both input and output streams to prevent file corruption.

## Object Serialization in Java
Introduction

Serialization in Java is the process of converting an object into a byte stream so it can be:  
* Saved to a file 💾
* Sent over a network 🌐
* Stored in memory or a database for later retrieval  

The reverse process — converting a byte stream back into an object — is called Deserialization.

### In simple terms:

Serialization = Object → Bytes  
Deserialization = Bytes → Object

All classes that need to be serialized must implement the java.io.Serializable interface.

### How Serialization Works
**when an object is serialized:**
* Its state (values of fields) is saved.
* Its class definition is not saved (JVM uses class metadata).
* Only non-static and non-transient fields are serialized.

**Serialization is handled using the classes:**
* ObjectOutputStream → for writing (serialization)
* ObjectInputStream → for reading (deserialization)

## Serializable Interface
Serializable is a marker interface (contains no methods).
It tells the JVM that this class is allowed to be serialized.
```java
public class Student implements Serializable {
    // no extra code needed
}
```
If a class does not implement Serializable, and you try to serialize it —
a NotSerializableException will be thrown.

**Example :** Basic Serialization and Deserialization
```java
// This example demonstrates how to save an object to a file and then read it back using serialization.

import java.io.*;

// Class must implement Serializable
class Student implements Serializable {
    String name;
    int age;
    String course;

    Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }
}

public class SerializationExample {
    public static void main(String[] args) {
        try {
            // Create an object
            Student s1 = new Student("Alice", 21, "Computer Science");

            // Serialize (write object to file)
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("student.ser"));
            out.writeObject(s1);
            out.close();
            System.out.println("Object serialized successfully!");

            // Deserialize (read object back)
            ObjectInputStream in = new ObjectInputStream(new FileInputStream("student.ser"));
            Student s2 = (Student) in.readObject();
            in.close();

            System.out.println("Deserialized Object Data:");
            System.out.println("Name: " + s2.name);
            System.out.println("Age: " + s2.age);
            System.out.println("Course: " + s2.course);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

/*
Expected Output:
Object serialized successfully!
Deserialized Object Data:
Name: Alice
Age: 21
Course: Computer Science
*/
```
Important Points
* writeObject() → converts object → byte stream and writes it to the file.
* readObject() → reads bytes → reconstructs the original object.
* student.ser file stores the serialized data.

## Transient Keyword

The transient keyword prevents a field from being serialized.
When deserialized, these fields return their default values (null, 0, false, etc.).

Use Case Examples:
* Hiding passwords or sensitive information
* Ignoring temporary or derived values (like cache or timestamps)

**Example:** Using transient to Hide Sensitive Data
```java
// This example shows how the transient keyword prevents certain fields (like passwords) from being saved during serialization.

import java.io.*;

// Class with transient field
class User implements Serializable {
    String username;
    transient String password;  // not serialized

    User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}

public class TransientExample {
    public static void main(String[] args) {
        try {
            User user1 = new User("admin", "secret123");

            // Serialize object
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("user.ser"));
            out.writeObject(user1);
            out.close();
            System.out.println("User object serialized.");

            // Deserialize object
            ObjectInputStream in = new ObjectInputStream(new FileInputStream("user.ser"));
            User user2 = (User) in.readObject();
            in.close();

            System.out.println("After Deserialization:");
            System.out.println("Username: " + user2.username);
            System.out.println("Password: " + user2.password); // null, not serialized
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

/*
```
Expected Output:
User object serialized.
After Deserialization:
Username: admin
Password: null
*/

Important Points
* password field is marked transient, so it’s skipped during serialization.
* When deserialized, it becomes null.
* Ideal for security-sensitive fields.

## Java NIO (New Input/Output)
Java NIO (New I/O), introduced in Java 1.4, is an advanced and faster alternative to the old java.io system.
It provides better file handling, data transfer, and scalability — especially for large files or high-speed applications.

Unlike traditional streams, which move data byte by byte, NIO works with blocks of data using:
* Buffers → store data temporarily in memory
* Channels → connect files or other data sources to buffers

NIO was further improved in Java 7 (called NIO.2) with Paths and Files classes for easier file operations.

### Difference Between I/O and NIO

| **Feature** | **Old I/O (java.io)** | **New I/O (java.nio)** |
|--------------|----------------------|------------------------|
| **Data Handling** | Stream-based | Buffer-based |
| **Direction** | One-way (read or write) | Two-way (via Channels) |
| **Performance** | Slower | Faster |
| **Introduced In** | Java 1.0 | Java 1.4 |
| **Suitable For** | Simple programs | Large-scale applications |

### Channels and Buffers
What is a Channel?

A Channel is like a two-way road between your file and program —
you can both read from and write to it.
It replaces InputStream and OutputStream for faster performance.

Common Channel classes:
* FileChannel – For files
* SocketChannel – For network data
* DatagramChannel – For UDP connections

What is a Buffer?

A Buffer is a temporary memory area where data is stored before being read or written.

Common buffer types:
* ByteBuffer — for bytes (most used)
* CharBuffer — for characters
* IntBuffer, FloatBuffer, etc.

#### How Channels and Buffers Work Together
```
File → Channel → Buffer → Application
or
Application → Buffer → Channel → File
```
* Data moves through the buffer.
* Channel connects the program to the file.
* You can control when to read or write using buffer methods.

### 🧩 Common Buffer Methods

| **Method** | **Description** |
|-------------|----------------|
| **allocate(size)** | Creates a new buffer with the given capacity |
| **put()** | Adds data into the buffer |
| **get()** | Reads data from the buffer |
| **flip()** | Switches the buffer from writing to reading mode |
| **clear()** | Clears data for the next use |
| **hasRemaining()** | Checks if data is left to read |


## Paths and Files (Java NIO.2)
What is Path?

A Path represents the location of a file or directory in the system.
It is part of java.nio.file package and replaces the older File class for better handling.

**Example:** path creation:
```java
Path path = Paths.get("C:/data/file.txt");
```
📗 What is Files?

The Files class provides many easy static methods to:
* Create files and directories
* Write and read data
* Copy, move, or delete files
* Check file properties

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|