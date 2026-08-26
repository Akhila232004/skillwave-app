1. What is an Exception in Java?

    A) A syntax error  
    B) A logical error  
    C) An event that disrupts program execution  
    D) A warning message

2. Which class is the root of the exception hierarchy?

    A) Exception  
    B) Error   
    C) Throwable  
    D) RuntimeException

3. Which of these is a subclass of Throwable?

    A) String  
    B) Error  
    C) Object  
    D) System

4. Which of the following is a checked exception?

    A) NullPointerException  
    B) ArrayIndexOutOfBoundsException  
    C) IOException  
    D) ArithmeticException  

5. Which of the following is an unchecked exception?

    A) IOException  
    B) SQLException  
    C) NullPointerException  
    D) FileNotFoundException

6. Which of these represents an Error in Java?

    A) OutOfMemoryError  
    B) ClassNotFoundException  
    C) IOException  
    D) RuntimeException  

7. Which keyword is used to handle exceptions?

    A) try  
    B) catch  
    C) throw  
    D) Both A and B

8. What will happen if an exception is not caught?

    A) Program continues  
    B) Program terminates abruptly  
    C) JVM ignores it  
    D) Error message but continues

9. Which block must always be followed by a catch or finally block?

    A) try  
    B) throw  
    C) throws  
    D) error

10. What is the output?
    ```java
    try {
        int x = 5 / 0;
    } catch (ArithmeticException e) {
        System.out.println("Error");
    }
    ```

    A) Error  
    B) 0  
    C) 5  
    D) Exception ignored  

11. Which block always executes regardless of exception occurrence?

    A) try  
    B) catch  
    C) finally  
    D) throw  

12. What is the output?
    ```java
    try {
    System.out.println("try");
    } finally {
    System.out.println("finally");
    }
    ```

    A) try  
    B) finally  
    C) try finally  
    D) Error  

13. Can a finally block execute without a catch?

    A) Yes  
    B) No  
    C) Only if no exception  
    D) Only in Java 8+  

14. What does the throw keyword do?

    A) Declares an exception    
    B) Catches an exception  
    C) Manually throws an exception  
    D) Defines exception class  

15. What is the use of throws keyword?

    A) To handle exception  
    B) To declare possible exceptions  
    C) To rethrow exception  
    D) To ignore exception

16. Which is valid syntax for throws keyword?

    A) void read() throw IOException { }  
    B) void read() throws IOException { }  
    C) throw IOException in read();  
    D) throws IOException { }  

17. What will happen if throw is used without an exception object?

    A) Compile-time error  
    B) Runtime error  
    C) No effect  
    D) Warning only  

18. What is the output?
    ```java
    try {
        throw new Exception("Test");
    } catch (Exception e) {
        System.out.println(e.getMessage());
    }
    ```


    A) Test  
    B) Exception  
    C) Compile error  
    D) null  

19. Which exception is thrown when dividing by zero?

    A) ArithmeticException  
    B) NumberFormatException  
    C) IOException  
    D) NullPointerException  

20. Which exception is thrown when accessing an invalid array index?

    A) IndexOutOfBoundsException  
    B) ArithmeticException  
    C) IOException  
    D) Error  

21. What is true about multiple catch blocks?

    A) Only one catch executes per try  
    B) All catch blocks execute  
    C) Catch order doesn’t matter  
    D) Must have same parameter type  

22. What is the output?  
    ```java
    try {
    int[] a = new int[3];
    a[5] = 10;
    } catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Out of bounds");
    }
    ```


    A) 10  
    B) Error  
    C) Out of bounds  
    D) Compile error

23. What is true about nested try blocks?

    A) Not allowed  
    B) Allowed inside another try or catch  
    C) Must be in same class  
    D) Allowed only once

24. What does try-with-resources do?

    A) Manages threads  
    B) Closes resources automatically  
    C) Compiles faster  
    D) Avoids using finally

25. Which interface must a resource implement for try-with-resources?

    A) AutoClosable  
    B) Serializable  
    C) Runnable  
    D) Readable

26. What is a custom exception?

    A) A subclass of Exception created by user  
    B) A JVM exception  
    C) A runtime warning  
    D) Not allowed in Java

27. Which constructor call is correct for custom exception?

    A) super(message);  
    B) Exception.super();  
    C) this(message);  
    D) throw(message);

28. What does this code do?
    ```java
    public class MyException extends Exception { }
    ```

    A) Creates a custom checked exception  
    B) Creates an unchecked exception  
    C) Throws exception automatically  
    D) Syntax error

29. Which of these are unchecked exceptions?

    A) RuntimeException and subclasses  
    B) IOException and subclasses  
    C) SQLException  
    D) ClassNotFoundException  

30. Which is true about Errors?

    A) Can be recovered using try-catch     
    B) Represent serious problems not handled by program    
    C) Subclass of Exception   
    D) Caused by bad input  

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | C   | 2  | C   | 3  | B   | 4  | C   |
| 5  | C   | 6  | A   | 7  | D   | 8  | B   |
| 9  | A   | 10 | A   | 11 | C   | 12 | C   |
| 13 | A   | 14 | C   | 15 | B   | 16 | B   |
| 17 | A   | 18 | A   | 19 | A   | 20 | A   |
| 21 | A   | 22 | C   | 23 | B   | 24 | B   |
| 25 | A   | 26 | A   | 27 | A   | 28 | A   |
| 29 | A   | 30 | B   |    |     |    |     | -->
