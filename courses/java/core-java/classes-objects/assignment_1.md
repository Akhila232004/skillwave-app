# Java Classes & Objects — MCQ Assignment
1. What is a class in Java?

    A) A variable  
    B) A blueprint for creating objects  
    C) A data type  
    D) A reserved keyword  

2. What is an object in Java?

    A) An instance of a class  
    B) A method inside a class  
    C) A constructor  
    D) A primitive variable  

3. How is a class defined in Java?

    A) define class Car { }  
    B) class Car { }  
    C) object Car { }  
    D) create class Car { }  

4. Which of the following correctly creates an object?

    A) Car c = new Car();  
    B) new Car = c();  
    C) Car() = new c;  
    D) object c = Car();  

5. How many objects can be created from one class?

    A) Only one  
    B) As many as needed  
    C) Depends on JVM  
    D) None  

6. What is the output of:
    ```java
    class Test {
        int x = 5;
    }
    public class Main {
        public static void main(String[] args) {
            Test t = new Test();
            System.out.println(t.x);
        }
    }
    ```

    A) 0  
    B) 5  
    C) null  
    D) Error  

7. Which of these can be members of a class?

    A) Variables only  
    B) Methods only  
    C) Variables, methods, and constructors  
    D) Only constructors  

8. What is a method in Java?

    A) A variable  
    B) A function defined inside a class  
    C) A constructor  
    D) A keyword  

9. Which of the following defines a valid method?

    A) void show() { }  
    B) function show() { } 
    C) method show() { }  
    D) public void = show();  

10. How do you call a method named display() of object obj?

    A) obj.display();  
    B) display.obj();  
    C) object.display;  
    D) display();  

11. What is the output?
    ```java
    class A {
        void greet() {
            System.out.println("Hello!");
        }
    }
    public class B {
        public static void main(String[] args) {
            A a = new A();
            a.greet();
        }
    }
    ```

    A) No output  
    B) Hello!  
    C) Compile error  
    D) Runtime error  

12. Which of the following is true about methods?

    A) Methods must always return a value    
    B) Methods can have parameters  
    C) Methods cannot be called from other methods  
    D) Methods must be static  

13. What is the return type of a method that doesn’t return anything?

    A) null   
    B) void  
    C) int  
    D) None  

14. What is printed by this code?
    ```java
    class Test {
        int add(int a, int b) {
            return a + b;
        }
    }

    public class Demo {
        public static void main(String[] args) {
            Test t = new Test();
            System.out.println(t.add(2, 3));
        }
    }
    ```

    A) 2  
    B) 3  
    C) 5  
    D) Error  

15. Which of the following statements about constructors is true?

    A) Constructors must have a return type  
    B) Constructors initialize objects  
    C) Constructors can be called manually like methods  
    D) Constructors must be static  

16. When is a constructor called?

    A) When class is loaded  
    B) When object is created  
    C) When method is called  
    D) When program ends  

17. What is the output?
    ```java
    class Demo {
        Demo() {
            System.out.println("Constructor called");
        }
    }
    public class Main {
        public static void main(String[] args) {
            Demo d = new Demo();
        }
    }
    ```

    A) No output  
    B) Constructor called  
    C) Error  
    D) null  

18. What is a default constructor?

    A) Constructor with parameters  
    B) Constructor with no parameters  
    C) Static constructor  
    D) Abstract constructor  

19. Which statement is true about parameterized constructors?

    A) They can have parameters  
    B) They can’t have parameters  
    C) They return void  
    D) They can’t initialize data  

20. Can a class have multiple constructors?

    A) No   
    B) Yes, using overloading  
    C) Only one  
    D) Only if private  

21. Which modifier allows a member to be accessed from anywhere?

    A) private  
    B) public  
    C) protected  
    D) default

22. Which access modifier makes a member accessible only inside the same class?

    A) private  
    B) protected  
    C) public  
    D) default  

23. Which modifier allows subclass access in different packages?

    A) default  
    B) public  
    C) protected  
    D) private  

24. What is the default access modifier if none is specified?

    A) private  
    B) protected  
    C) default (package-private)  
    D) public  

25. What does the this keyword refer to?

    A) Current class  
    B) Current method  
    C) Current object  
    D) Parent object  

26. What is printed by this code?
    ```java
    class Demo {
        int x;
        Demo(int x) {
            this.x = x;
        }
        void show() {
            System.out.println(x);
        }
    }
    public class Main {
        public static void main(String[] args) {
            Demo d = new Demo(10);
            d.show();
        }
    }
    ```

    A) 0  
    B) 10  
    C) null  
    D) Error  

27. What happens if you do not define any constructor in a class?

    A) Compile-time error  
    B) Java provides a default constructor  
    C) Object cannot be created  
    D) Needs explicit initialization  

28. Can a constructor call another constructor in the same class?

    A) Yes, using this()  
    B) No   
    C) Only from static method  
    D) Only using super()  

29. Which of the following is not a valid access modifier in Java?

    A) private  
    B) protected  
    C) default  
    D) internal  

30. Which keyword is used to invoke parent class constructor?

    A) this  
    B) super  
    C) parent  
    D) base  

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | B   | 2  | A   | 3  | B   | 4  | A   |
| 5  | B   | 6  | B   | 7  | C   | 8  | B   |
| 9  | A   | 10 | A   | 11 | B   | 12 | B   |
| 13 | B   | 14 | C   | 15 | B   | 16 | B   |
| 17 | B   | 18 | B   | 19 | A   | 20 | B   |
| 21 | B   | 22 | A   | 23 | C   | 24 | C   |
| 25 | C   | 26 | B   | 27 | B   | 28 | A   |
| 29 | D   | 30 | B   |    |     |    |     | -->
