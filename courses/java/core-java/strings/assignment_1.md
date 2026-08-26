# Java Strings — MCQ Assignment
1. What is a String in Java?

    A) A primitive data type  
    B) An array of characters  
    C) An object of class String  
    D) A collection of integers

2. Strings in Java are:

    A) Mutable  
    B) Immutable  
    C) Dynamic  
    D) Thread-safe

3. Which is the correct way to create a string?

    A) String s = "Hello";  
    B) String s = new String("Hello");  
    C) Both A and B  
    D) None 

4. What does the following code do?
    ```java
    String s1 = "Hello";
    String s2 = s1; 
    s1 = "World";
    System.out.println(s2);
    ```

    A) Hello  
    B) World  
    C) null  
    D) Error  

5. What is the output of:
    ```java
    String s = "Java";
    System.out.println(s.length());
    ```

    A) 3  
    B) 4   
    C) 5  
    D) 0  

6. Which method returns a character at a specified index?

    A) charAt()  
    B) getChar()  
    C) indexOf()  
    D) substring()

7. What is the output?
    ```java
    String s = "Hello";
    System.out.println(s.charAt(1));
    ```
 
    A) H  
    B) e  
    C) l  
    D) o

8. What does s.substring(2) return for "HELLO"?

    A) "EL"  
    B) "LLO"   
    C) "HE"  
    D) "HEL"

9. What does indexOf('a') return if the character is not found?

    A) -1  
    B) 0  
    C) null  
    D) Exception

10. What does toUpperCase() do?

    A) Converts string to uppercase  
    B) Converts string to lowercase  
    C) Removes spaces  
    D) Returns ASCII codes

11. Which of the following compares two strings case-insensitively?

    A) equals()  
    B) compareTo()  
    C) equalsIgnoreCase()  
    D) ==

12. What does compareTo() return when strings are equal?

    A) 0  
    B) 1  
    C) true  
    D) false

13. What is the output?
    ```java
    String a = "Java";
    String b = "Java";
    System.out.println(a == b);
    ```

    A) true  
    B) false  
    C) Error  
    D) Depends on JVM

14. What is the output?
    ```java
    String a = new String("Java");
    String b = new String("Java");
    System.out.println(a == b);
    ```

    A) true  
    B) false  
    C) Error  
    D) null

15. Which operator is used for string concatenation?

    A) *  
    B) +  
    C) &  
    D) append()

16. Which of these is valid?
    ```java
    String s1 = "Hello";
    String s2 = "World";
    String s3 = s1.concat(s2);
    ```

    A) Valid  
    B) Invalid  
    C) Throws Exception   
    D) Needs cast

17. What does this print?
    ```java
    String s = String.join("-", "A", "B", "C");
    System.out.println(s);
    ```

    A) A-B-C  
    B) ABC  
    C) A, B, C  
    D) Error

18. What is the result of:
    ```java
    String.format("Hello %s", "John");
    ```

    A) Hello %s  
    B) Hello John  
    C) John Hello  
    D) Compile error  

19. What does replace('a','o') do?

    A) Replaces all ‘a’ with ‘o’  
    B) Removes ‘a’  
    C) Converts to lowercase  
    D) None  

20. Which method checks if a string starts with a given prefix?

    A) startsWith()  
    B) endsWith()  
    C) prefixOf()  
    D) hasPrefix()  

21. Which class provides a mutable string?

    A) String  
    B) StringBuilder    
    C) StringImmutable  
    D) StringConst

22. Which method adds text at the end of a StringBuilder?

    A) add()  
    B) append()  
    C) join()  
    D) insert()

23. Which method reverses a StringBuilder content?

    A) reverse()  
    B) flip()  
    C) invert()  
    D) backward()

24. Which is thread-safe:

    A) String  
    B) StringBuilder  
    C) StringBuffer  
    D) Both B and C

25. Which conversion is correct?

    A) int x = Integer.parseInt("123");  
    B) String s = String.parse("123");  
    C) int x = "123".toInt();  
    D) String s = parseInt("123");

26. How do you convert an int to String?

    A) String.valueOf(10);  
    B) toString(10);  
    C) String.convert(10);  
    D) valueToString(10);

27. What is output?
    ```java
    String s = "Hello World";
    String[] parts = s.split(" ");
    System.out.println(parts[1]);
    ```

    A) Hello  
    B) World  
    C) null  
    D) Error

28. Which method removes leading and trailing spaces?

    A) trim()  
    B) replaceAll()  
    C) cut()  
    D) strip()  

29. Which of these methods checks if a string has no characters?

    A) isEmpty()  
    B) isBlank()  
    C) equals("")  
    D) Both A and C

30. Why is StringBuilder preferred over String for repeated concatenation?

    A) Faster performance (mutable)  
    B) Thread-safe  
    C) Immutable  
    D) Requires less code

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | C   | 2  | B   | 3  | C   | 4  | A   |
| 5  | B   | 6  | A   | 7  | B   | 8  | B   |
| 9  | A   | 10 | A   | 11 | C   | 12 | A   |
| 13 | A   | 14 | B   | 15 | B   | 16 | A   |
| 17 | A   | 18 | B   | 19 | A   | 20 | A   |
| 21 | B   | 22 | B   | 23 | A   | 24 | C   |
| 25 | A   | 26 | A   | 27 | B   | 28 | A   |
| 29 | D   | 30 | A   |    |     |    |     | -->
