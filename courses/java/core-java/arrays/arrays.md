# Introduction to Java Arrays

An array is a data structure that stores a fixed-size, ordered, index-based sequence of elements of the same type.   

**In Java:**
* Arrays are objects (they inherit from java.lang.Object).
* Every array has a public final field length (number of elements).
* Indexing starts at 0 (first element is index 0, last is length - 1).
* The array’s size can’t change after creation (but the values inside can).
```java
import java.util.Arrays;

public class Intro {
    public static void main(String[] args) {
        int[] a = {10, 20, 30};            // object on heap, length = 3
        System.out.println(a[0]);          // 10 (zero-based indexing)
        System.out.println(a.length);      // 3 (public final field)
        System.out.println(Arrays.toString(a)); // [10, 20, 30]
    }
}
// Output:
// 10
// 3
// [10, 20, 30]
```

## Why use arrays?

* Group related values under one name (e.g., 30 student scores).

* Fast random access by index (O(1) time to read/write arr[i]).

* Efficient, low-overhead representation for primitives (int, double, …).

 When you need dynamic size or rich methods (add, remove), prefer ArrayList (Collections). Arrays are great when the size is known and performance matters.

# Declaring & Initializing Arrays
 ##  Declaration

 Syntax
```java
<element-type>[] variableName;   // preferred, modern style
<element-type> variableName[];   // also valid (legacy style)
```
```java
Examples

int[] scores;        // preferred
int scoresAlt[];     // valid but less common
String[] names;      // array of references to String
double[] temps;      // array of double
```
## Initializing Arrays
### 1) Allocation (creates the backing storage)

#### Syntax
```java
variableName = new <element-type>[length];
<element-type>[] variableName = new <element-type>[length]; // declare + allocate
```
```java
Examples

int[] scores = new int[5];     // [0, 0, 0, 0, 0]
double[] temps = new double[3];// [0.0, 0.0, 0.0]
String[] names = new String[2];// [null, null]
```

#### Defaults after new:

* int, long, short, byte → 0

* double, float → 0.0

* boolean → false

* char → '\u0000' (NUL)

* Any object/reference (e.g., String) → null

> Note: Array length is fixed once created; to “resize,” create a new array and copy.

### 2) Literal (initializer list)

#### Syntax
```java
<element-type>[] variableName = { value1, value2, ... };  // declaration + init
variableName = new <element-type>[] { value1, value2, ... }; // later assignment
```
```java
Examples

int[] primes = {2, 3, 5, 7};            // declare + init
String[] colors;
colors = new String[] {"red", "green"}; // later assignment

// ❌ Not allowed:
// colors = {"red", "green"};  // Only valid at declaration time

3) Assigning values by index (after allocation)
int[] x = new int[4]; // [0,0,0,0]
x[0] = 42;
x[3] = 7;
// x now → [42, 0, 0, 7]
```

### 3) Assign by index (after allocation)
```java
int[] x = new int[4]; // [0,0,0,0]
x[0] = 42;
x[3] = 7;             // x → [42, 0, 0, 7]

```

# **Java Arrays of Various Data Types**

Arrays in Java are strongly typed, which means each array can store only one specific type of data. Java supports arrays for all primitive data types, objects, and even arrays returned from methods. Below is a detailed explanation of arrays of different types.

## **1. Arrays of Primitive Data Types**

Java allows the creation of arrays for all primitive types. Each data type has its own array form:

* **int[]** → stores integer values
* **byte[]** → stores small numeric values
* **short[]** → stores short integers
* **long[]** → stores long integer values
* **float[]** → stores decimal values (single precision)
* **double[]** → stores decimal values (double precision)
* **boolean[]** → stores true/false values
* **char[]** → stores characters

Each of these arrays can hold only the specified data type. For example, an `int[]` can store only integers, and a `char[]` can store only characters.


## **2. Array of Reference Types (Objects)**

Arrays in Java can also store **objects**.
To do this:

1. Create a class.
2. Use that class name as the data type of the array.
3. The array can then hold multiple objects of that class.

This is useful when handling collections of students, employees, products, etc., where each element in the array represents an object.

## **3. Java Methods Returning Arrays**

In Java, methods can return arrays just like they return primitive values or objects.

To return an array from a method:

1. Define a method that specifies an array as its return type.
2. Within the method, create and populate the array.
3. Return the array to the caller.
4. In the `main()` method, receive the returned array and process it.

This is commonly used when a method needs to provide multiple values at once.

## Multidimensional Arrays (2D, 3D)

Key idea: In Java, multi-dimensional arrays are arrays of arrays. They can be rectangular or jagged (rows of different lengths).

2D Arrays

### Declaration
```java
int[][] grid;          // declares a variable that will reference an int[][] 
```

### Allocation (rectangular)
```java
grid = new int[3][4];  // 3 rows, 4 cols; all elements 0
```

### Declaration + Allocation
```java
int[][] mat = new int[2][3];  // [ [0,0,0], [0,0,0] ]
```

### Literal (initializer list)
```java
int[][] board = {
    {1, 2, 3},
    {4, 5, 6}
}; // 2x3
```

### Jagged (rows can have different lengths)
```java
int[][] jag = new int[3][];
jag[0] = new int[1];       // row 0 length 1
jag[1] = new int[3];       // row 1 length 3
jag[2] = new int[2];       // row 2 length 2
```

# Array Operations

## Accessing Elements
* You can access an array element by referring to the index number.
* Read by index: arr[i] (valid indices: 0 .. arr.length - 1)
* Write/update by index: arr[i] = newValue;
* Length is a field: arr.length (not a method).
```java
int[] a = {10, 20, 30};
int first = a[0];          // 10
a[2] = 99;                 // a -> [10, 20, 99]
System.out.println(a.length); // 3
```
> Out-of-range access throws ArrayIndexOutOfBoundsException.

## Traversing Arrays
Traversing an array means systematically visiting each element of the array, one after another, typically starting from the first element and moving sequentially to the last.

### 1) for loop (use when you need the index or to modify elements)
```java
int[] a = {3, 6, 9, 12};
for (int i = 0; i < a.length; i++) {
    System.out.println("a[" + i + "] = " + a[i]);
}
```
### 2) Enhanced for (for-each) loop (clean reading; does not let you reassign elements)
```java
for (int value : a) {
    System.out.println(value);
}
```
### 3) while loop (use when the stop condition isn’t a simple counter)
``` java
int i = 0;
while (i < a.length) {
    System.out.println(a[i]);
    i++;
}
```

## Updating Elements
Update with index (preferred for mutations)
```java
int[] a = {1, 2, 3, 4};

// add 10 to each element
for (int i = 0; i < a.length; i++) {
    a[i] += 10;          // a -> [11, 12, 13, 14]
}
```

## Why not for-each for mutations?
```java
int[] b = {1, 2, 3};
for (int x : b) {
    x += 100;            // changes only the local copy, NOT b
}
// b is still [1, 2, 3]
```
### Replacing elements in an object array
```java
String[] names = {"Ada", "Grace", "Linus"};
for (int i = 0; i < names.length; i++) {
    if (names[i].startsWith("G")) names[i] = names[i].toUpperCase();
}
// names -> ["Ada", "GRACE", "Linus"]
```


# Arrays Utility Class — Essentials
A utility class is a class that provides helper methods (utility methods) which perform common, reusable operations.
## 1) Arrays.toString(...)

What it does: Returns a readable string for 1-D arrays.
Use it for: Debugging/logging instead of the unreadable [I@6d06d69c.
```java
Syntax & examples

int[] a = {3, 1, 4};
System.out.println(Arrays.toString(a)); // [3, 1, 4]

String[] s = {"aa", "Bb", "ccc"};
System.out.println(Arrays.toString(s)); // [aa, Bb, ccc]

// Null-safe
int[] n = null;
System.out.println(Arrays.toString(n)); // null
```

Nested arrays? Use Arrays.deepToString(Object[] arr):
```java
int[][] grid = {{1,2},{3,4}};
System.out.println(Arrays.toString(grid));     // [[I@..., [I@...]  (not helpful)
System.out.println(Arrays.deepToString(grid)); // [[1, 2], [3, 4]]
```

Complexity: O(n) for 1-D; deepToString visits all nested elements.
Gotchas: toString on arrays of arrays is not deep—use deepToString.

## 2) Arrays.equals(...)

What it does: Element-wise equality for 1-D arrays (same length and all elements equal).

Primitives: uses == per element.

Objects: uses Objects.equals per element (i.e., calls .equals), not deep for nested arrays.
```java
Syntax & examples

int[] a = {1,2,3};
int[] b = {1,2,3};
System.out.println(Arrays.equals(a, b)); // true

String[] x = {"A","B"};
String[] y = {"A","B"};
System.out.println(Arrays.equals(x, y)); // true (uses String.equals)

// Null rules
System.out.println(Arrays.equals(null, null)); // true
System.out.println(Arrays.equals(a, null));    // false
```

Nested arrays? Use Arrays.deepEquals(Object[] a1, Object[] a2):
```java
String[][] m1 = { {"a","b"}, {"c"} };
String[][] m2 = { {"a","b"}, {"c"} };
System.out.println(Arrays.equals(m1, m2));     // false (compares inner array refs)
System.out.println(Arrays.deepEquals(m1, m2)); // true
```

Complexity: O(n) (short-circuits on first mismatch).
### Gotchas:

* For multidimensional arrays, use deepEquals.

* For object arrays, this is shallow wrt references: it compares elements by .equals, but won’t descend into inner arrays unless deepEquals.

## 3) Arrays.copyOf(...)

What it does: Returns a new array (same runtime type) of newLength, copying elements from the original; truncates if smaller, pads with defaults if larger.
```java
Syntax & examples (primitives & objects)

int[] a = {1,2,3,4,5};

// Same or different length
int[] first3  = Arrays.copyOf(a, 3);  // [1,2,3]
int[] bigger  = Arrays.copyOf(a, 8);  // [1,2,3,4,5,0,0,0] (padded with 0)

// Object array: shallow copy (references are copied)
Person[] p = { new Person("Ada"), new Person("Lin") };
Person[] p2 = Arrays.copyOf(p, p.length); // same Person objects inside
```

Specify type explicitly (less common):
```java
Number[] nums = {1, 2.5};
Integer[] ints = Arrays.copyOf(nums, 1, Integer[].class); // ClassCastException if incompatible
```

Copy a slice? Use Arrays.copyOfRange(original, from, to) (half-open [from, to)):
```java
int[] mid = Arrays.copyOfRange(a, 1, 4); // elements at 1,2,3 -> [2,3,4]
```

Defaults when expanding:

numeric → 0, 0.0 …; boolean → false; char → '\u0000'; objects → null.

Complexity: O(n) (copies up to newLength or original.length).
### Gotchas:

* Shallow copy for object arrays (elements are the same references).

* For fastest bulk copy between existing arrays, use System.arraycopy(src, srcPos, dest, destPos, len); copyOf uses it under the hood but also allocates the destination.

## Quick “When to Use What”

* Pretty-print 1-D array: Arrays.toString(a)

* Pretty-print nested array: Arrays.deepToString(a)

* Compare 1-D arrays: Arrays.equals(a,b)

* nested arrays: Arrays.deepEquals(a,b)

* Resize/clone array: Arrays.copyOf(a, newLen) (resize) or a.clone() (same length)

* Copy a slice: Arrays.copyOfRange(a, from, to)

* High-performance block copy: System.arraycopy(...)




# Limitations of Arrays in Java

### **1. Fixed Size**

Arrays have a *constant size*.
Once created, the length cannot be increased or decreased.
This makes arrays unsuitable when the number of elements is not known beforehand.

---

### **2. Store Only One Data Type**

An array can store only one type of data.
For example, an integer array can store only integers.
Arrays do not support mixing different data types in the same structure.

### **3. Limited Built-In Functionality**

Arrays do not provide built-in methods for common operations like:

* inserting elements,
* deleting elements,
* searching,
* sorting,
* resizing.

Most operations must be handled manually by the programmer.

### **4. Insertion and Deletion Are Difficult**

Inserting or deleting elements in the middle of an array requires shifting multiple elements.
This makes such operations slow and harder to implement.

### **5. Potential Memory Waste**

Because arrays have a fixed size:

* If the size is too large → memory gets wasted.
* If the size is too small → there may not be enough space, requiring a new array.

### **6. No Automatic Resizing**

Unlike dynamic data structures (like ArrayList), arrays cannot grow automatically.
The programmer must manage resizing manually, which is inefficient.

### **7. Difficult to Handle Complex Data Structures**

Multi-dimensional arrays become complex to read, write, and maintain.
As the number of dimensions increases, understanding and debugging becomes harder.

### **8. Data Only, No Behavior**

Arrays are simple containers.
They store values but do not provide advanced behaviors like:

* dynamic expansion,
* element shifting,
* built-in validation,
* auto-management.

These capabilities must be implemented through additional logic.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
