Java I/O & Streams — MCQ Assignment
1. What is the main purpose of Java I/O classes?

    A) To handle file and data input/output operations  
    B) To manage GUI events  
    C) To connect to databases  
    D) To compile Java programs

2. Which package contains Java I/O classes?

    A) java.io  
    B) java.file  
    C) java.streams  
    D) java.nio

3. What is the difference between byte streams and character streams?

    A) Byte streams handle binary data; character streams handle text data  
    B) Byte streams are faster  
    C) Character streams are used for images  
    D) Both are same

4. Which of the following is a byte stream class?

    A) FileReader  
    B) FileWriter  
    C) FileInputStream  
    D) BufferedWriter

5. Which class reads character data from files?

    A) FileInputStream  
    B) FileReader  
    C) BufferedOutputStream  
    D) DataInputStream

6. What is the superclass of all byte stream classes?

    A) InputStream and OutputStream  
    B) Reader and Writer  
    C) Stream and Channel  
    D) None

7. Which of the following is a character stream class?

    A) BufferedReader  
    B) DataInputStream  
    C) FileInputStream  
    D) ObjectInputStream

8. Which method is used to read a single byte from InputStream?

    A) read()  
    B) readLine()  
    C) next()  
    D) readByte()

9. Which method closes a stream?

    A) stop()  
    B) close()  
    C) end()  
    D) exit()

10. Which stream is used to read text line by line efficiently?

    A) BufferedReader  
    B) FileReader  
    C) FileInputStream  
    D) InputStreamReader

11. What is the purpose of BufferedWriter?

    A) To write text efficiently to files  
    B) To read binary data  
    C) To compress data  
    D) To copy streams

12. Which of these is the superclass of all Reader classes?

    A) InputStream  
    B) Reader  
    C) FileReader  
    D) BufferedReader

13. What is the difference between FileReader and FileInputStream?

    A) FileReader reads characters; FileInputStream reads bytes  
    B) FileInputStream reads characters; FileReader reads bytes  
    C) Both read binary data  
    D) Both read text data only

14. Which of these is used for writing primitive data types?

    A) PrintWriter  
    B) DataOutputStream  
    C) FileWriter  
    D) BufferedWriter  

15. What happens if you write to a file that does not exist?

    A) FileNotFoundException  
    B) File is automatically created  
    C) IOException  
    D) FileFormatException  

16. What is Object Serialization?

    A) Converting an object into a byte stream  
    B) Reading a file  
    C) Converting a byte stream into an object  
    D) Copying data between files  

17. Which interface must be implemented for serialization?

    A) Serializable  
    B) Cloneable  
    C) Readable  
    D) Externalizable

18. What is the purpose of the transient keyword?

    A) To skip a field during serialization  
    B) To make a variable constant  
    C) To allow concurrent access   
    D) To make a variable synchronized  

19. Which classes are used for serialization and deserialization?

    A) ObjectOutputStream and ObjectInputStream  
    B) DataOutputStream and DataInputStream  
    C) FileReader and FileWriter  
    D) BufferedReader and BufferedWriter

20. Which exception is thrown during serialization if a class does not implement Serializable?

    A) IOException  
    B) ClassCastException  
    C) NotSerializableException  
    D) FileNotFoundException

21. Which package contains Java NIO classes?

    A) java.io   
    B) java.nio  
    C) java.util  
    D) java.net

22. What does NIO stand for?

    A) New Input Output  
    B) Network I/O  
    C) Native I/O  
    D) Non-Indexed Output  

23. What is the main difference between Java I/O and Java NIO?

    A) NIO is buffer-oriented, I/O is stream-oriented  
    B) I/O is faster  
    C) NIO cannot handle files 
    D) I/O supports channels  

24. What is a Buffer in Java NIO?

    A) A container that holds data for read/write operations  
    B) A data stream  
    C) A file path object 
    D) A thread-safe structure  

25. Which class represents a file path in Java NIO?

    A) FilePath  
    B) File  
    C) Path  
    D) FileReader

26. Which method in Files class is used to check if a file exists?

    A) exists(Path p)  
    B) checkFile(Path p)  
    C) find(Path p)  
    D) fileExists(p)

27. Which method is used to read all lines from a file in NIO?

    A) Files.readAllLines()  
    B) Files.read()  
    C) Files.lines()  
    D) FileReader.read()

28. What is a Channel in Java NIO?

    A) A connection between a data source and destination  
    B) A stream handler  
    C) A file reader  
    D) A byte converter

29. Which of these is a NIO channel class?

    A) FileChannel  
    B) StreamChannel  
    C) BufferChannel  
    D) PathChannel

30. Which NIO method copies a file from one location to another?

    A) Files.copy()  
    B) FileReader.copy()  
    C) Path.copy()  
    D) FileInputStream.transfer()


<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | A   | 2  | A   | 3  | A   | 4  | C   |
| 5  | B   | 6  | A   | 7  | A   | 8  | A   |
| 9  | B   | 10 | A   | 11 | A   | 12 | B   |
| 13 | A   | 14 | B   | 15 | B   | 16 | A   |
| 17 | A   | 18 | A   | 19 | A   | 20 | C   |
| 21 | B   | 22 | A   | 23 | A   | 24 | A   |
| 25 | C   | 26 | A   | 27 | A   | 28 | A   |
| 29 | A   | 30 | A   |    |     |    |     | -->
