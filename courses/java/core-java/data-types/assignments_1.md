## Java Data Types — Multiple Choice Assignment
1. How many primitive data types does Java have?  

    A) 6  
    B) 7  
    C) 8  
    D) 9  
 
2. Which of the following is not a primitive data type in Java?  

    A) char  
    B) boolean  
    C) String  
    D) double  

3. Which primitive data type can store the value 'A'?  

    A) byte  
    B) char  
    C) String  
    D) boolean  

4. What is the size (in bits) of an int in Java?  

    A) 8  
    B) 16  
    C) 32  
    D) 64  

5. Which of the following can store decimal values?  

    A) int and long  
    B) float and double  
    C) byte and short  
    D) char and boolean 

6. The default value of a boolean instance variable is:

    A) true  
    B) false  
    C) null  
    D) 0  

7. Which type can store a larger range of numbers?  

    A) float  
    B) double  
    C) int  
    D) short  

8. Which of the following statements is valid?  

    A) int a = 10.5;  
    B) float f = 10.5;  
    C) float f = 10.5f;  
    D) double d = 10.5f;  

9. Which data type can store the number 2147483648?

    A) int  
    B) long  
    C) short  
    D) float  

10. What is the correct way to declare a character variable?

    A) char c = 'A';  
    B) char c = "A";  
    C) String c = 'A';  
    D) char c = A;  

11. Which of the following represents non-primitive data types?

    A) int, float, char  
    B) String, Array, Class  
    C) boolean, byte, short 
    D) All of the above  

12. Non-primitive types are also called:

    A) Reference types  
    B) Static types  
    C) Basic types  
    D) Derived types  

13. Which of the following is a reference type?

    A) int  
    B) char  
    C) String  
    D) double  

14. Which of the following is not true about arrays?

    A) They are objects in Java.    
    B) They can store multiple data items.    
    C) They can store different data types together.  
    D) Their length is fixed after creation.  

15. What is the default value of an uninitialized String field in a class?

    A) null  
    B) ""  
    C) "null"  
    D) undefined  

16. Which of the following conversions is an example of widening (implicit) casting?

    A) int → byte  
    B) byte → int  
    C) double → float  
    D) float → short  

17. Which of these conversions requires explicit casting?

    A) int → long
    B) byte → int
    C) double → float
    D) float → double

18. What is the output of:
    ```java
    int x = 10;
    double y = x;
    ```

    A) Compile-time error  
    B) Runtime error  
    C) Implicit widening  
    D) Explicit narrowing  

19. What is the correct way to perform explicit type casting?

    A) float f = (float)10.5;  
    B) int a = (int) 5.9;  
    C) Both A and B  
    D) Neither A nor B  

20. What will be the result of:
    ```java
    double d = 9.7;
    int i = (int) d;
    System.out.println(i);
    ```

    A) 9.7  
    B) 9  
    C) 10  
    D) Compile error  

21. Wrapper classes are used to:

    A) Convert primitives into objects  
    B) Convert objects into primitives  
    C) Store only strings  
    D) Handle exceptions  

22. Which of the following is not a wrapper class?

    A) Integer  
    B) Float  
    C) Character  
    D) String  

23. What does Autoboxing mean?

    A) Converting object to primitive  
    B) Converting primitive to object automatically  
    C) Manual casting    
    D) Boxing arrays into strings  

24. What is Unboxing in Java?

    A) Converting object to primitive automatically  
    B) Converting primitive to object  
    C) Manual type conversion  
    D) Converting arrays to collections  

25. What is the output?
    ```java
    Integer a = 5;
    int b = a;
    System.out.println(b);
    ```

    A) 5  
    B) Compilation error  
    C) NullPointerException  
    D) Garbage value  

26. What is the output?
    ```java
    Integer num = null;
    int val = num;
    System.out.println(val);
    ```

    A) 0  
    B) null  
    C) NullPointerException  
    D) Compile-time error  

27. Which of the following wrapper classes corresponds to the primitive boolean?

    A) Boolean  
    B) Bool  
    C) logical  
    D) Flag  

28. What is the output?
    ```java
    int a = 5;
    float b = 2.5f;
    System.out.println(a + b);
    ```

    A) 7.5  
    B) 7.5f  
    C) 7.0  
    D) Compile error  

29. What happens if you assign null to a primitive variable?

    A) It becomes zero  
    B) It becomes undefined  
    C) Compile-time error  
    D) Runtime exception  

30. What is the default value of a double instance variable?

    A) 0  
    B) 0.0  
    C) null  
    D) undefined  
<!-- 
## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | C   | 2  | C   | 3  | B   | 4  | C   |
| 5  | B   | 6  | B   | 7  | B   | 8  | C   |
| 9  | B   | 10 | A   | 11 | B   | 12 | A   |
| 13 | C   | 14 | C   | 15 | A   | 16 | B   |
| 17 | C   | 18 | C   | 19 | C   | 20 | B   |
| 21 | A   | 22 | D   | 23 | B   | 24 | A   |
| 25 | A   | 26 | C   | 27 | A   | 28 | A   |
| 29 | C   | 30 | B   |    |     |    |     | -->