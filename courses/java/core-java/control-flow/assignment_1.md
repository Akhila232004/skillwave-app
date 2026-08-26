# Java Conditional & Looping Statements — MCQs
1. Which keyword is used to test a condition in Java?

    A) loop  
    B) check  
    C) if  
    D) condition  

2. Which of the following is a valid if statement?

    A) if a > b then  
    B) if (a > b)  
    C) if a > b:  
    D) if {a > b}  

3. What is the output?
    ```java
    int a = 5;
    if (a > 2)
        System.out.println("Hi");
    ```

    A) Hi  
    B) Error  
    C) Nothing  
    D) 5  

4. What happens if there is no else block for an if?

    A) Compile-time error  
    B) Runtime error  
    C) Executes normally if condition true  
    D) Must have else  

5. In an if-else ladder, how many if conditions can be true?

    A) Only one
    B) All
    C) Depends on logic
    D) None

6. What will be the output?
    ```java
    int a = 10;
    if (a < 5)
        System.out.println("Low");
    else
        System.out.println("High");
    ```

    A) Low  
    B) High  
    C) Error  
    D) Nothing  

7. What does a nested if mean?

    A) Multiple if statements in one line  
    B) An if statement inside another if  
    C) Multiple conditions in one if  
    D) Only one if  

8. Which of these can replace a long if-else ladder?

    A) for loop  
    B) while loop  
    C) switch  
    D) do-while  

9. In a switch statement, each case must end with:

    A) stop  
    B) return  
    C) break  
    D) continue  

10. If no break is used in a switch, what happens?

    A) Only one case executes  
    B) All following cases execute  
    C) Compilation fails  
    D) Program exits  

11. Which data type is NOT allowed in switch (until Java 7)?

    A) int  
    B) String  
    C) char  
    D) byte  

12. What is the default case in switch used for?

    A) To handle invalid inputs  
    B) To end switch  
    C) To skip code  
    D) To throw exception

13. Which loop is used when number of iterations is known?

    A) for loop  
    B) while loop  
    C) do-while loop  
    D) infinite loop

14. Which of the following is entry-controlled?

    A) while  
    B) for  
    C) do-while  
    D) Both A and B

15. Which of these is exit-controlled?

    A) for  
    B) while  
    C) do-while  
    D) if-else

16. What is the output?
    ```java
    for (int i = 1; i <= 3; i++)
        System.out.println(i);
    ```

    A) 1  
    B) 1 2 3  
    C) 3 2 1  
    D) 0 1 2

17. What will happen if loop condition is always true?

    A) Compilation error  
    B) Infinite loop  
    C) Executes once  
    D) Skips loop

18. Which loop executes its body at least once?

    A) for  
    B) while  
    C) do-while  
    D) switch

19. What is the output?
    ```java
    int i = 1;
    while (i < 3) {
        System.out.print(i + " ");
        i++;
    }
    ```

    A) 1  
    B) 1 2  
    C) 1 2 3  
    D) 2 3  

20. What is wrong with this code?
    ```java
    for (;;) {
        System.out.println("Hello");
    }
    ```

    A) Infinite loop  
    B) Syntax error  
    C) Executes once  
    D) NullPointerException

21. What does break do inside a loop?

    A) Skips current iteration  
    B) Ends current loop  
    C) Exits program  
    D) Continues next iteration

22. What is the purpose of continue?

    A) Terminates the loop
    B) Restarts loop from beginning
    C) Skips rest of current iteration
    D) Exits method

23. Which jump statement can terminate both loops and methods?

    A) break  
    B) continue  
    C) return  
    D) switch  

24. What will be the output?
    ```java
    for (int i = 1; i <= 5; i++) {
        if (i == 3) break;
        System.out.print(i + " ");
    }
    ```


    A) 1 2 3 4 5  
    B) 1 2  
    C) 3 4 5  
    D) 1 2 3  

25. What is the output?
    ```java
    for (int i = 1; i <= 5; i++) {
        if (i == 3) continue;
        System.out.print(i + " ");
    }
    ```

    A) 1 2 3 4 5  
    B) 1 2 4 5  
    C) 3 4 5  
    D) 1 2  

26. What is the output?
    ```java
    for (int i = 1; i <= 3; i++) {
        if (i == 2)
            return;
        System.out.print(i);
    }
    ```

    A) 1  
    B) 1 2 3  
    C) 1 2  
    D) 2 3  

27. Can break be used outside a loop or switch?

    A) Yes  
    B) No  
    C) Only inside methods  
    D) Only in constructors

28. Which statement about continue is FALSE?

    A) It skips current iteration  
    B) It ends the loop  
    C) It can be used in while loops  
    D) It can be used in for loops

29. Which loop is best suited for reading unknown number of inputs?

    A) for  
    B) while  
    C) do-while  
    D) switch

30. What happens if a return statement is used in the main method?

    A) Terminates program execution  
    B) Skips one line  
    C) Exits loop only  
    D) Does nothing


<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | C   | 2  | B   | 3  | A   | 4  | C   |
| 5  | A   | 6  | B   | 7  | B   | 8  | C   |
| 9  | C   | 10 | B   | 11 | B   | 12 | A   |
| 13 | A   | 14 | D   | 15 | C   | 16 | B   |
| 17 | B   | 18 | C   | 19 | B   | 20 | A   |
| 21 | B   | 22 | C   | 23 | C   | 24 | B   |
| 25 | B   | 26 | A   | 27 | B   | 28 | B   |
| 29 | B   | 30 | A   |    |     |    |     | -->
