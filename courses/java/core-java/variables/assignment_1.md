# Java Variables — Multiple Choice Assignment
1. Which of the following correctly declares and initializes an integer variable in Java?

    A) int num = 10;  
    B) integer num = 10;  
    C) num int = 10;  
    D) int = 10 num;  

2. What is the default value of an int instance variable?

    A) null  
    B) 0  
    C) undefined  
    D) NaN  

3. Which of these variable types must always be initialized before use?

    A) Instance variable  
    B) Static variable  
    C) Local variable  
    D) Global variable  

4. What is the correct syntax to declare multiple variables of the same type?

    A) int x, int y, int z;  
    B) x, y, z = int;  
    C) int x, y, z;  
    D) int (x, y, z);  

5. Which of the following is not a valid Java identifier?

    A) _value  
    B) $salary  
    C) 2number  
    D) userName   

6. What is the output of the following?
    ```java
    int a = 5;  
    a = a + 2;  
    System.out.println(a);  
    ```
    A) 5  
    B) 7  
    C) 10  
    D) Error  

7. What is a variable defined inside a method called?

    A) Instance variable  
    B) Class variable  
    C) Local variable  
    D) Static variable  

8. Which keyword is used to define a constant in Java?

    A) constant  
    B) final  
    C) static  
    D) const  
9. Which variable type belongs to the class rather than any object?

    A) Local variable  
    B) Instance variable  
    C) Static variable  
    D) Parameter variable  
10. Which of the following is true about local variables?

    A) They can have access modifiers.  
    B) They have default values.  
    C) They must be initialized before use.  
    D) They are stored in heap memory.  

11. What happens when a local variable name is the same as an instance variable name?

    A) Compile-time error  
    B) The instance variable hides the local variable  
    C) The local variable shadows the instance variable  
    D) Both cannot exist together  

12. Which statement about scope is correct?

    A) Class variables can be used in any method without an object.  
    B) Local variables are accessible across methods.  
    C) Variables declared inside a block are accessible outside it.  
    D) Static variables can only be accessed through objects.  

13. Which is a valid declaration for a long variable?

    A) long distance = 12345L;  
    B) long distance = 12345l;  
    C) Both A and B  
    D) Neither  

14. What is the default value of a boolean instance variable?

    A) true  
    B) false  
    C) 0  
    D) null  

15. Which of these statements about the final keyword is true?

    A) A final variable can be reassigned once.  
    B) A final variable must be initialized only inside a method.  
    C) A final variable cannot be changed once assigned.  
    D) Final variables are automatically static.  

16. What is printed by:
    ```java
    char c = 'A';  
    int n = c;  
    System.out.println(n);  
    ```

    A) A  
    B) 65  
    C) 97  
    D) Error  
17. Which of the following variables gets memory only once?

    A) Local variable  
    B) Instance variable  
    C) Static variable  
    D) Parameter variable  

18. Which statement correctly accesses a static variable count in class Student?

    A) Student.count;  
    B) count.Student;  
    C) new Student().count;  
    D) student.count;  

19. Which type of variable is used to store temporary data inside methods?

    A) Static variable  
    B) Instance variable  
    C) Local variable  
    D) Global variable  

20. Which variable modifier ensures the value cannot change after initialization?

    A) static  
    B) private  
    C) final  
    D) public  

21. When does a local variable get destroyed?

    A) When the program ends  
    B) When the method ends  
    C) When the JVM shuts down  
    D) Never  

22. Which of the following correctly shows variable shadowing?

    A)
    ```java
    int x = 5;
    {
    int x = 10;
    }
    ```

    B)
    ```java
    class A {
    int x = 5;
    void show() {
        int x = 10;
        System.out.println(x);
    }
    }
    ```

    C)
    ```java
    static int x = 10;
    ```

    D) None

    ### 23. What will be the output?
    ```java
    final int RATE = 100;
    RATE = 200;
    ```

    A) 200  
    B) 100  
    C) Compile-time error  
    D) Runtime exception  

24. Which of the following types are reference types?

    A) int, float, boolean  
    B) char, byte, short  
    C) String, Arrays, Classes  
    D) All of the above  

25. Which keyword is not related to variable declaration in Java?

    A) final  
    B) static   
    C) abstract  
    D) volatile  

26. What is the scope of a static variable in a class?

    A) Only inside the method  
    B) Shared among all objects  
    C) Unique per object   
    D) Limited to constructor  

27. Which statement is true for naming identifiers in Java?

    A) Identifiers can start with a number  
    B) Identifiers can contain spaces  
    C) Identifiers can use _ or $  
    D) Identifiers can use keywords  

28. What happens if a variable is declared but not initialized?

    A) Compiler gives an error  
    B) Default value is assigned for local variables  
    C) Default value is assigned for instance variables  
    D) Program crashes  

29. Which of the following is the correct way to make a constant for PI?

    A) final double PI = 3.14;  
    B) const double PI = 3.14;  
    C) double final PI = 3.14;  
    D) PI final double = 3.14;  

30. Which of the following best describes “Variable Shadowing”?

    A) Using private variables  
    B) Using the same variable name in nested scopes  
    C) Reusing variables in loops  
    D) Assigning values twice  


<!-- ## Answer Key (For Instructor Only)
| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | A   | 2  | B   | 3  | C   | 4  | C   |
| 5  | C   | 6  | B   | 7  | C   | 8  | B   |
| 9  | C   | 10 | C   | 11 | C   | 12 | A   |
| 13 | C   | 14 | B   | 15 | C   | 16 | B   |
| 17 | C   | 18 | A   | 19 | C   | 20 | C   |
| 21 | B   | 22 | B   | 23 | C   | 24 | C   |
| 25 | C   | 26 | B   | 27 | C   | 28 | C   |
| 29 | A   | 30 | B   |    |     |    |     | -->
