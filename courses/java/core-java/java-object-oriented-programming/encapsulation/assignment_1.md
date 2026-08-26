# Java Encapsulation — MCQ Assignment
1. What is encapsulation in Java?

    A) Hiding internal data and exposing only necessary methods  
    B) Combining multiple classes into one  
    C) Converting data types  
    D) Using only private methods

2. Encapsulation is also known as:

    A) Inheritance  
    B) Data hiding  
    C) Method overriding  
    D) Method overloading

3. Which access modifier is most commonly used for encapsulation?

    A) public  
    B) private  
    C) protected  
    D) static

4. Which of the following helps achieve encapsulation?

    A) Using final keyword  
    B) Using private variables and public getters/setters  
    C) Using inheritance  
    D) Using static methods

5. Which statement is true about encapsulation?

    A) It exposes class data directly  
    B) It hides implementation details from the user  
    C) It increases direct field access  
    D) It removes the need for methods

6. How can private variables be accessed outside a class?

    A) Using constructors  
    B) Using getters and setters  
    C) Using inheritance  
    D) Cannot be accessed

7. What is the output?
    ```java
    class Student {
    private int age = 20;
    public int getAge() { return age; }
    }
    public class Main {
    public static void main(String[] args) {
        Student s = new Student();
        System.out.println(s.getAge());
    }
    }
    ```

    A) 0  
    B) 20  
    C) Error  
    D) Null

8. What is a getter method?

    A) A method used to update a value  
    B) A method used to retrieve a value  
    C) A method that initializes an object  
    D) A static method

9. What is a setter method?

    A) A method that retrieves values  
    B) A method that sets or updates variable values  
    C) A method that returns null  
    D) A method that deletes variables

10. What is the advantage of using getters and setters?

    A) Makes variables accessible globally  
    B) Provides control over how data is read or modified  
    C) Makes variables public  
    D) Improves performance

11. Which is true about private members?

    A) Accessible everywhere  
    B) Accessible within same package  
    C) Accessible only within same class  
    D) Accessible from subclasses

12. Which access modifier allows access within package but not outside it?

    A) protected  
    B) public  
    C) private  
    D) default

13. Which modifier allows subclass access even in different packages?

    A) private  
    B) protected  
    C) default  
    D) public

14. In encapsulation, data members should generally be:

    A) public  
    B) protected  
    C) private  
    D) static

15. Which of these is an example of encapsulation?

    A) Bank account with private balance and public deposit/withdraw methods  
    B) Accessing all data directly  
    C) Exposing fields publicly  
    D) Using static variables

16. Which OOP concept does encapsulation directly support?

    A) Abstraction  
    B) Polymorphism  
    C) Inheritance  
    D) Overriding

17. What will happen if a class variable is declared public?

    A) Anyone can modify it directly  
    B) It becomes read-only  
    C) It becomes private automatically  
    D) Throws compile error

18. Why is encapsulation considered secure?

    A) Prevents direct data modification  
    B) Restricts code reuse  
    C) Forces class inheritance  
    D) Avoids runtime errors

19. What does encapsulation promote in OOP?

    A) Data security and maintainability  
    B) Code duplication  
    C) Tight coupling  
    D) Performance loss

20. Which of the following violates encapsulation?

    A) Using getters and setters  
    B) Declaring all variables public  
    C) Using private fields  
    D) Hiding implementation details

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | A   | 2  | B   | 3  | B   | 4  | B   |
| 5  | B   | 6  | B   | 7  | B   | 8  | B   |
| 9  | B   | 10 | B   | 11 | C   | 12 | D   |
| 13 | B   | 14 | C   | 15 | A   | 16 | A   |
| 17 | A   | 18 | A   | 19 | A   | 20 | B   | -->
