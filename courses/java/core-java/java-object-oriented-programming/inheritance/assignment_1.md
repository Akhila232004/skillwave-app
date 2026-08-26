# Java Inheritance — MCQ Assignment
1. What is inheritance in Java?

    A) Mechanism of deriving new classes from existing ones  
    B) Copying code manually from one class to another  
    C) Reusing methods from unrelated classes  
    D) A type of loop structure  

2. Which keyword is used for inheritance in Java?

    A) implements  
    B) extends  
    C) inherit  
    D) super

3. What is single inheritance?

    A) One class inherits from another  
    B) One class inherits multiple classes  
    C) Multiple classes inherit one interface  
    D) Multiple inheritance of classes

4. What is multilevel inheritance?

    A) Class A → Class B → Class C  
    B) One parent and many children   
    C) Two classes extending the same parent  
    D) Multiple classes implementing one interface

5. What is hierarchical inheritance?

    A) One class inherited by multiple subclasses  
    B) One subclass inheriting multiple classes  
    C) Many interfaces extending one class  
    D) Two unrelated classes with same parent

6. Which inheritance type is not supported directly in Java classes?

    A) Single  
    B) Multilevel  
    C) Multiple  
    D) Hierarchical

7. Which keyword refers to the parent class object?

    A) this  
    B) base  
    C) super  
    D) extends

8. What is the purpose of the super() call in constructors?

    A) To call subclass constructor  
    B) To call parent class constructor  
    C) To create a new object  
    D) To define abstract class

9. Which is true about constructor execution in inheritance?

    A) Parent constructor executes before child constructor  
    B) Child constructor executes first  
    C) Constructors are inherited  
    D) Constructors execute randomly

10. What is the output?
    ```java
    class A {
    A() { System.out.println("A"); }
    }
    class B extends A {
    B() { System.out.println("B"); }
    }
    public class Main {
    public static void main(String[] args) {
        new B();
    }
    }
    ```

    A) A B  
    B) B A  
    C) B only  
    D) A only  

11. What is method overriding?

    A) Defining same method name and parameters in subclass  
    B) Defining method with same name but different parameters  
    C) Overloading methods  
    D) Using static methods

12. Which of these cannot be overridden?

    A) final methods  
    B) static methods  
    C) private methods  
    D) All of the above

13. Which access modifier allows a method to be overridden in subclass?

    A) private  
    B) public  
    C) final  
    D) static

14. What happens when we use super.methodName() in subclass?

    A) Calls the subclass method  
    B) Calls the parent class method  
    C) Throws an error  
    D) Redefines the method

15. What is constructor chaining?

    A) Calling one constructor from another using this() or super()  
    B) Calling multiple methods  
    C) Defining overloaded constructors only  
    D) Creating multiple objects

16. Which is true about method overriding rules?

    A) Method name and parameters must be identical  
    B) Return type must be unrelated  
    C) Method must be private  
    D) Static methods can override instance methods

17. What is the main advantage of inheritance?

    A) Code reusability  
    B) Code duplication  
    C) Memory optimization  
    D) Faster compilation

18. Which of these inheritance types can be achieved through interfaces?

    A) Single  
    B) Multiple  
    C) Multilevel  
    D) None

19. What is a limitation of inheritance?

    A) Increases coupling between classes  
    B) Reduces code reuse  
    C) Slows runtime performance drastically  
    D) Prevents polymorphism

20. Which keyword allows subclass access to parent’s constructor and variables?

    A) this  
    B) super  
    C) extends  
    D) inherit

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | A   | 2  | B   | 3  | A   | 4  | A   |
| 5  | A   | 6  | C   | 7  | C   | 8  | B   |
| 9  | A   | 10 | A   | 11 | A   | 12 | D   |
| 13 | B   | 14 | B   | 15 | A   | 16 | A   |
| 17 | A   | 18 | B   | 19 | A   | 20 | B   | -->
