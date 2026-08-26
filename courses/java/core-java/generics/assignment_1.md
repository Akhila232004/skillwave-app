Java Generics — MCQ Assignment
1. What is the main purpose of Generics in Java?

    A) To enable code reuse  
    B) To provide compile-time type safety  
    C) To improve runtime performance  
    D) To remove the need for objects

2. Which of these is a valid generic class declaration?

    A) class Box<> {}  
    B) class Box<T> {}  
    C) class Box<T,> {}  
    D) class Box(T) {}

3. What is T in class Box<T>?

    A) Type parameter  
    B) Object name  
    C) Primitive variable  
    D) Static reference

4. Which statement about Generics is true?

    A) They allow different data types with type safety  
    B) They can only store Object type  
    C) They remove compile-time checking  
    D) They work only with interfaces

5. What is the benefit of using Generics?

    A) Avoids explicit type casting  
    B) Enables runtime polymorphism  
    C) Reduces method overloading  
    D) Allows inheritance only

6. Which of these declarations is invalid?

    A) ArrayList<Integer> list = new ArrayList<>();  
    B) ArrayList<int> list = new ArrayList<>();  
    C) List<String> list = new ArrayList<String>();  
    D) Map<String, Integer> map = new HashMap<>();

7. Which of the following represents a generic method?

    A) <T> void print(T item)  
    B) void print(T item)  
    C) T void print()  
    D) void print()

8. In class Sample<T extends Number>, what does extends Number mean?

    A) T must be a subclass of Number  
    B) T must be equal to Number  
    C) T can be any object  
    D) T must be a primitive

9. What is the upper-bounded wildcard syntax?

    A) ? extends Type  
    B) ? super Type  
    C) <T super Type>  
    D) <T extends ?>

10. What is the lower-bounded wildcard syntax?

    A) ? extends T  
    B) ? super T  
    C) <T extends ?>  
    D) <T super ?>

11. What does an unbounded wildcard look like?

    A) <?>  
    B) <T>  
    C) ?  
    D) <extends>

12. Which of the following generic declarations is valid?

    A) <T extends Number>  
    B) <T super Number>  
    C) <T implements Number>  
    D) <T new Number>

13. What is type erasure in Generics?

    A) Generic type information is removed at runtime  
    B) Type parameters are stored in JVM  
    C) Type is converted into Object type at compile time 
    D) Generics are ignored completely

14. Which statement about Generics and Collections is true?

    A) Generics enforce compile-time type safety in collections  
    B) Collections ignore Generics   
    C) Generics reduce list size  
    D) Generics slow down collection iteration

15. What is the output?
    ```java
    List<String> list = new ArrayList<>();
    list.add("Hello");
    String s = list.get(0);
    System.out.println(s);
    ```

    A) Compile-time error  
    B) Runtime error  
    C) Hello  
    D) Null  

16. What happens if you use a raw type like List list = new ArrayList();?

    A) Causes compile-time warning  
    B) Causes runtime error  
    C) Does not compile  
    D) Prevents addition of elements

17. Which of these is a generic interface?

    A) interface Container<T> {}  
    B) interface Container() {}  
    C) interface Container<T>() {}  
    D) interface Container {T}

18. What is allowed inside a generic method declaration?

    A) Type parameters before return type  
    B) Type parameters after method name  
    C) Both A and B  
    D) None

19. What is the advantage of bounded type parameters?

    A) Restricts allowable types to certain kinds  
    B) Allows primitive data types  
    C) Enables automatic casting  
    D) Removes type checking

20. Which generic syntax allows multiple bounds?

    A) <T extends ClassA & InterfaceB>  
    B) <T super ClassA>  
    C) <T implements ClassA>  
    D) <T & InterfaceB>

21. What is true about wildcard usage in Generics?

    A) Wildcards are used for unknown types  
    B) Wildcards must always extend Object  
    C) Wildcards can only appear in methods  
    D) Wildcards disable type checking

22. In List<? extends Number>, which can be assigned?

    A) List<Integer>  
    B) List<Object>  
    C) List<String>  
    D) None

23. In List<? super Integer>, which can be assigned?

    A) List<Object>  
    B) List<Double>  
    C) List<String>  
    D) List<Float>

24. Which of these can store both Integer and Double?

    A) List<Number>  
    B) List<Object>  
    C) List<?>  
    D) List<int>

25. Which collection type supports Generics?

    A) Array  
    B) ArrayList  
    C) StringBuilder  
    D) int[]

26. Which of the following is not an advantage of Generics?

    A) Type safety  
    B) Code reusability  
    C) Reduced performance  
    D) No need for casting

27. Why can’t you use primitive types in Generics?

    A) Generics work only with objects  
    B) JVM restrictions  
    C) Compiles but fails at runtime  
    D) Because primitives have no inheritance

28. What will happen?
    ```java
    List<?> list = new ArrayList<String>();
    list.add(null);
    ```

    A) Compiles successfully  
    B) Compile error  
    C) Runtime error  
    D) Requires cast

29. What is PECS in Generics?

    A) Producer Extends, Consumer Super  
    B) Parameter Extends, Collection Super  
    C) Polymorphism Extends, Class Super  
    D) None

30. What is a limitation of Generics in Java?

    A) Type information is erased at runtime  
    B) They support primitive types  
    C) They allow runtime reflection  
    D) They support multiple inheritance

<!-- ## Answer Key
| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | B   | 2  | B   | 3  | A   | 4  | A   |
| 5  | A   | 6  | B   | 7  | A   | 8  | A   |
| 9  | A   | 10 | B   | 11 | A   | 12 | A   |
| 13 | A   | 14 | A   | 15 | C   | 16 | A   |
| 17 | A   | 18 | A   | 19 | A   | 20 | A   |
| 21 | A   | 22 | A   | 23 | A   | 24 | A   |
| 25 | B   | 26 | C   | 27 | A   | 28 | A   |
| 29 | A   | 30 | A   |    |     |    |     | -->
