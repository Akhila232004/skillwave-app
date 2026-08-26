# Java Polymorphism — MCQ Assignment
1. What is polymorphism in Java?

    A) Performing a single task in different ways  
    B) Writing multiple main methods  
    C) Using multiple classes only  
    D) Using private methods

2. What are the two main types of polymorphism?

    A) Static and Dynamic  
    B) Constant and Variable  
    C) Runtime and Compile-time  
    D) Both A and C

3. Compile-time polymorphism is achieved using:

    A) Method overriding  
    B) Method overloading  
    C) Constructors  
    D) Interfaces

4. Runtime polymorphism is achieved using:

    A) Method overloading  
    B) Method overriding  
    C) Static methods  
    D) Private methods

5. What is method overloading?

    A) Two or more methods with same name but different parameters  
    B) Same method with identical parameters  
    C) Defining same methods in parent and child  
    D) Defining private methods

6. Which of the following can differ for overloaded methods?

    A) Method name  
    B) Parameter list  
    C) Access modifier only  
    D) Return type only

7. What is method overriding?

    A) Redefining a method from parent class in child class  
    B) Having methods with same name but different parameters  
    C) Using static methods  
    D) Hiding private variables

8. What must be the same for overriding methods?

    A) Method name and parameter list  
    B) Return type only  
    C) Access modifier only  
    D) Class name

9. What is dynamic method dispatch?

    A) Selecting which method to run at runtime  
    B) Selecting variable type at runtime  
    C) Binding variables early  
    D) Using static binding

10. Which of the following enables dynamic method dispatch?

    A) Abstract classes  
    B) Method overloading  
    C) Method overriding  
    D) Private methods

11. What is the output?
    ```java
    class A { void show() { System.out.println("A"); } }
    class B extends A { void show() { System.out.println("B"); } }
    public class Main {
    public static void main(String[] args) {
        A obj = new B();
        obj.show();
    }
    }
    ```

    A) A  
    B) B  
    C) AB  
    D) Error

12. What type of binding is used in runtime polymorphism?

    A) Early binding  
    B) Static binding  
    C) Dynamic (late) binding  
    D) Compile-time binding

13. Which operator is used to test whether an object is an instance of a specific class?

    A) instanceOf    
    B) instanceof  
    C) typeOf  
    D) checktype

14. What will this code output?
    ```java
    String s = "Hello";
    if (s instanceof String)
    System.out.println("Yes");
    else
    System.out.println("No");
    ```

    A) No  
    B) Yes  
    C) Error  
    D) None

15. Which statement is true for method overloading?

    A) Performed at runtime  
    B) Requires different parameter lists  
    C) Must have same return type  
    D) Only used with inheritance

16. Which rule applies to overriding?

    A) Overridden method must not be static  
    B) Overridden method must be private  
    C) Can override constructors  
    D) Can override final methods

17. Which of the following cannot be overridden?

    A) final methods  
    B) static methods  
    C) private methods  
    D) All of the above

18. What is the return type rule for overriding?

    A) Must be exactly the same or covariant  
    B) Can be anything  
    C) Can be unrelated  
    D) Must always be void

19. What is the output?
    ```java
    class Parent { void display() { System.out.println("Parent"); } }
    class Child extends Parent { void display() { System.out.println("Child"); } }
    public class Main {
    public static void main(String[] args) {
        Parent p = new Child();
        p.display();
    }
    }
    ```

    A) Parent  
    B) Child  
    C) ParentChild  
    D) Error

20. Which of these statements best describes polymorphism?

    A) The ability of an object to take many forms  
    B) Using only static methods  
    C) The ability to execute only one method 
    D) Restricting inheritance  

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | A   | 2  | D   | 3  | B   | 4  | B   |
| 5  | A   | 6  | B   | 7  | A   | 8  | A   |
| 9  | A   | 10 | C   | 11 | B   | 12 | C   |
| 13 | B   | 14 | B   | 15 | B   | 16 | A   |
| 17 | D   | 18 | A   | 19 | B   | 20 | A   | -->
