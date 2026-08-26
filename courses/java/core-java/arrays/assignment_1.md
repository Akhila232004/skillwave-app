# Java Arrays — MCQ Assignment
1. What is an array in Java?

    A) A collection of methods  
    B) A collection of variables of different types  
    C) A collection of variables of the same type  
    D) A collection of objects of any type

2. What is the correct way to declare an array of integers?

    A) int arr[];  
    B) int arr;  
    C) array int arr;  
    D) int arr() = new int[];  

3. How is memory allocated for an array in Java?

    A) At compile time  
    B) At runtime  
    C) Manually by the user  
    D) Not allocated  

4. What is the index of the first element in a Java array?

    A) 0  
    B) 1  
    C) -1  
    D) Undefined  

5. What happens if you access an array index out of bounds?

    A) Returns 0  
    B) Wraps around to the start  
    C) Throws ArrayIndexOutOfBoundsException  
    D) Compiles but skips element

6. Which of these is valid array initialization?

    A) int[] a = new int[5];
    B) int a = [5];
    C) int a = new int(5);
    D) int[5] a;

7. What is the output?
    ```java
    int[] arr = {1, 2, 3, 4};
    System.out.println(arr.length);
    ```

    A) 3  
    B) 4  
    C) 5  
    D) Error

8. Which of the following correctly creates and initializes an array?

    A) int arr[] = {10, 20, 30};   
    B) int[] arr = new int(3);  
    C) int arr(3) = {10, 20, 30};  
    D) array arr = new int[3];  

9. How many elements can the array int arr[] = new int[10]; hold?

    A) 9  
    B) 10  
    C) 11  
    D) Undefined

10. Which loop is most commonly used to traverse arrays?

    A) if  
    B) for  
    C) switch  
    D) while

11. Which of the following loops automatically iterates through all array elements?

    A) for loop  
    B) while loop  
    C) do-while loop  
    D) enhanced for loop (for-each)  

12. What is the output?
    ```java
    int[] a = {5, 10, 15};
    System.out.println(a[1]);
    ```

    A) 5  
    B) 10  
    C) 15   
    D) Error  

13. Which of the following represents a 2D array?

    A) int[][] matrix;  
    B) int[] matrix;  
    C) int matrix();  
    D) array int matrix;  

14. How to access the 2nd row and 3rd column of a 2D array a?

    A) a[3][2]  
    B) a[2][3]  
    C) a[1][2]  
    D) a[2,3]  

15. What is the correct declaration of a 3D array?

    A) int arr[][][];  
    B) int arr[][];  
    C) int arr[3];  
    D) int[3] arr;  

16. What is the default value of an int array element?

    A) 0  
    B) null  
    C) undefined  
    D) garbage value  

17. How can you find the maximum element in an array?

    A) Arrays.max(arr)  
    B) Math.max(arr)  
    C) By looping through elements and comparing  
    D) Using arr.max()

18. What is the output?   
    ```java
    int[] a = {10, 20, 30};
    a[1] = 50;
    System.out.println(a[1]);
    ```

    A) 20  
    B) 50  
    C) 10  
    D) Error

19. How can you reverse an array manually?

    A) Using Collections.reverse()  
    B) Swap elements from start and end moving inward  
    C) Using Arrays.reverse()  
    D) Not possible

20. What does Arrays.sort(arr) do?

    A) Sorts array in descending order  
    B) Sorts array in ascending order  
    C) Shuffles elements randomly  
    D) Deletes duplicate elements

21. What is the output?
    ```java
    int[] a = {3, 1, 2};
    Arrays.sort(a);
    System.out.println(Arrays.toString(a));
    ```

    A) [1, 2, 3]  
    B) [3, 2, 1]  
    C) [2, 3, 1]  
    D) Error

22. What does Arrays.toString() do?

    A) Converts an array into a String representation  
    B) Joins two arrays  
    C) Returns length of array  
    D) Compares arrays

23. What does Arrays.equals(arr1, arr2) check?

    A) If both arrays reference same object  
    B) If both arrays have same size  
    C) If both arrays have same elements in same order  
    D) If both arrays are sorted  

24. What is the result of:
    ```java
    int[] a = {1, 2, 3};
    int[] b = Arrays.copyOf(a, 5);
    System.out.println(b.length);
    ```

    A) 3  
    B) 4  
    C) 5  
    D) Error  

25. What is the value of b[3] in the previous question?

    A) 3  
    B) 0  
    C) null  
    D) Error  

26. Which method from Arrays class can compare two arrays?

    A) Arrays.same()  
    B) Arrays.match()  
    C) Arrays.equals()  
    D) Arrays.compare()  

27. Which of the following correctly prints an array?

    A) System.out.println(arr);  
    B) System.out.println(Arrays.toString(arr));  
    C) System.out.println(toString(arr));  
    D) System.out.println(arr.toString());  

28. What is one major limitation of arrays?

    A) Can store only integers  
    B) Fixed size once created  
    C) Cannot store strings  
    D) Cannot be traversed  

29. What is an advantage of using Collections over arrays?

    A) Fixed size  
    B) Slower access  
    C) Dynamic resizing and built-in methods  
    D) Less memory efficient

30. Which of these statements is true?

    A) Arrays can grow dynamically  
    B) Arrays are objects in Java  
    C) Arrays can store mixed data types  
    D) Arrays have variable size
    
## Answer Key
| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | C   | 2  | A   | 3  | B   | 4  | A   |
| 5  | C   | 6  | A   | 7  | B   | 8  | A   |
| 9  | B   | 10 | B   | 11 | D   | 12 | B   |
| 13 | A   | 14 | C   | 15 | A   | 16 | A   |
| 17 | C   | 18 | B   | 19 | B   | 20 | B   |
| 21 | A   | 22 | A   | 23 | C   | 24 | C   |
| 25 | B   | 26 | C   | 27 | B   | 28 | B   |
| 29 | C   | 30 | B   |    |     |    |     |
