# Java 8+ Features — MCQ Assignment
1. What was one of the most important features introduced in Java 8?

    A) Abstract classes  
    B) Lambda expressions  
    C) Applets  
    D) Generics

2. What is the main benefit of Lambda expressions?

    A) Reduce boilerplate code 
    B) Increase memory usage  
    C) Improve multithreading  
    D) Replace constructors

3. Which syntax correctly defines a Lambda expression?

    A) (x) -> x * 2  
    B) lambda(x) = x * 2;  
    C) def (x) => x * 2  
    D) (x): x * 2

4. Lambda expressions can be used only with:

    A) Abstract classes  
    B) Functional interfaces  
    C) Anonymous objects  
    D) Constructors

5. What is a functional interface?

    A) Interface with exactly one abstract method  
    B) Interface with multiple methods  
    C) Interface with default methods only  
    D) Any interface

6. Which annotation is used to mark a functional interface?

    A) @Interface  
    B) @FunctionalInterface  
    C) @Functional  
    D) @FunctionalClass

7. Which of these is a built-in functional interface in Java 8?

    A) Predicate  
    B) Runnable  
    C) Serializable  
    D) Thread

8. What does the Predicate interface do?

    A) Takes one argument and returns boolean  
    B) Takes two arguments  
    C) Returns an integer  
    D) Has no parameters

9. What does the Function<T, R> interface represent?

    A) Takes T and returns R  
    B) Takes R and returns T  
    C) Returns boolean  
    D) Takes no arguments  

10. The Supplier interface:

    A) Takes no argument and returns a value  
    B) Takes an argument and returns nothing  
    C) Returns boolean  
    D) Is used for filtering

11. The Consumer interface:

    A) Takes a value and returns nothing 
    B) Returns a value  
    C) Throws exception  
    D) Is used in reflection  

12. Which method is used to create a stream from a collection?

    A) stream()  
    B) listToStream()  
    C) getStream()  
    D) makeStream()  

13. Which of these is a terminal operation?

    A) map()  
    B) filter()  
    C) collect()  
    D) sorted()

14. Which of these is an intermediate operation?

    A) forEach()  
    B) collect()  
    C) reduce()  
    D) map()

15. What does filter() do in streams?

    A) Filters elements based on a condition  
    B) Sorts elements  
    C) Collects into list  
    D) Reduces values

16. What does map() in Stream API do?

    A) Transforms elements  
    B) Removes duplicates  
    C) Filters nulls  
    D) Prints results

17. Which operation executes the stream pipeline?

    A) Terminal operations  
    B) Intermediate operations  
    C) Static operations  
    D) Parallel operations  
18. What does forEach() do in a stream?

    A) Performs an action on each element  
    B) Filters elements  
    C) Returns a list  
    D) Closes the stream

19. Which method combines stream elements into a single result?

    A) filter()  
    B) reduce()   
    C) map()  
    D) collect()

20. What is a method reference in Java 8?

    A) Shorter syntax to call existing methods  
    B) A lambda with more arguments  
    C) Abstract method  
    D) Thread-safe function

21. Which symbol is used in method references?

    A) ::  
    B) =>  
    C) ->  
    D) %%  

22. Which statement creates a method reference to System.out.println?

    A) System.out::println  
    B) System.out=>println  
    C) System.out->println  
    D) println(System.out)

23. What is the main purpose of the Optional class?

    A) To avoid NullPointerException  
    B) To store primitive types  
    C) To handle exceptions  
    D) To replace arrays

24. Which method creates a non-empty Optional?

    A) of()  
    B) empty()  
    C) get()  
    D) orElse()  

25. Which method returns the contained value or a default if empty?

    A) of()  
    B) get()  
    C) orElse()  
    D) empty()  

26. What does Optional.empty() return?

    A) An empty Optional instance  
    B) Null  
    C) An exception  
    D) Default value  

27. Which method retrieves the value inside Optional?

    A) get()  
    B) orElse()  
    C) ofNullable()  
    D) fetch()  

28. Which package contains the new Date and Time API?

    A) java.util  
    B) java.time  
    C) java.date  
    D) java.calendar  

29. Which class represents both date and time?

    A) LocalDate  
    B) LocalDateTime  
    C) LocalTime  
    D) Instant  

30. Which class represents a specific moment in UTC time?

    A) Instant  
    B) LocalTime  
    C) ZonedDateTime  
    D) DateTimeFormatter

<!-- ## Answer Key

| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | B   | 2  | A   | 3  | A   | 4  | B   |
| 5  | A   | 6  | B   | 7  | A   | 8  | A   |
| 9  | A   | 10 | A   | 11 | A   | 12 | A   |
| 13 | C   | 14 | D   | 15 | A   | 16 | A   |
| 17 | A   | 18 | A   | 19 | B   | 20 | A   |
| 21 | A   | 22 | A   | 23 | A   | 24 | A   |
| 25 | C   | 26 | A   | 27 | A   | 28 | B   |
| 29 | B   | 30 | A   |    |     |    |     | -->
