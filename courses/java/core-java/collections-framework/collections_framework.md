# Java Collections Framework
## Introduction to Collections
In real-world applications, you often need to store, process, and manage groups of objects (like a list of students, products, or employees).
While arrays can store multiple items, they have limitations — like fixed size and lack of flexibility.

To overcome these issues, Java provides the Collections Framework — a set of classes and interfaces that make it easy to store, retrieve, manipulate, and iterate over data efficiently.

#### Key Features
* Dynamic size (no fixed limit like arrays)
* Ready-to-use data structures (List, Set, Queue, Map)
* Predefined algorithms (sorting, searching, shuffling, etc.)
* Unified architecture — all collections work in a consistent way

**Example**
```java
// Demonstrates introduction to Java Collections
// Showing how ArrayList can hold different types of data (Objects)

import java.util.ArrayList;

public class IntroToCollections {
    public static void main(String[] args) {
        // Create a dynamic list using ArrayList
        ArrayList<Object> items = new ArrayList<>();

        // Add different types of elements
        items.add("Apple");          // String
        items.add(100);              // Integer (auto-boxed)
        items.add(25.75);            // Double (auto-boxed)
        items.add(true);             // Boolean
        items.add('A');              // Character

        // Display the list
        System.out.println("List elements: " + items);

        // Access elements individually
        System.out.println("First element: " + items.get(0));  // String
        System.out.println("Second element: " + items.get(1)); // Integer
        System.out.println("Third element: " + items.get(2));  // Double
    }
}

/*
Expected Output:
List elements: [Apple, 100, 25.75, true, A]
First element: Apple
Second element: 100
Third element: 25.75
*/
```

## Arrays vs Collections

| **Feature** | **Arrays** | **Collections** |
|--------------|-------------|-----------------|
| **Size** | Fixed at creation | Dynamic (can grow or shrink) |
| **Type of Data** | Same data type only | Can store objects (homogeneous or heterogeneous with generics) |
| **Memory Management** | Manual (you must define length) | Automatic resizing and memory handling |
| **Utility Methods** | Limited (`length`, `clone`, etc.) | Rich API (`add`, `remove`, `sort`, `contains`, etc.) |
| **Performance** | Slightly faster (less overhead) | Slightly slower (more flexibility) |
| **Iteration** | Basic `for` loop | Enhanced `for`, `Iterator`, `Stream API` |
| **Use Case** | Simple, fixed data | Dynamic, flexible data operations |

**Example — Arrays vs Collections**  
```java
// File: ArraysVsCollections.java
import java.util.*;

public class ArraysVsCollections {
    public static void main(String[] args) {
        // Using Array
        String[] studentsArray = new String[3];
        studentsArray[0] = "Ravi";
        studentsArray[1] = "Neha";
        studentsArray[2] = "Amit";
        // studentsArray[3] = "Sara"; ❌ Not allowed (ArrayIndexOutOfBounds)

        System.out.println("Array Output: " + Arrays.toString(studentsArray));

        // Using Collection (ArrayList)
        ArrayList<String> studentsList = new ArrayList<>();
        studentsList.add("Ravi");
        studentsList.add("Neha");
        studentsList.add("Amit");
        studentsList.add("Sara"); // ✅ Dynamic addition allowed

        System.out.println("Collection Output: " + studentsList);
    }
}

/*
Expected Output:
Array Output: [Ravi, Neha, Amit]
Collection Output: [Ravi, Neha, Amit, Sara]
*/
```
> Explanation: Arrays are static and need predefined size, whereas ArrayList automatically resizes.

<!-- ## Collection Hierarchy
The Java Collections Framework is organized in a hierarchical interface structure,
where Collection is the root interface (except Map, which has a separate branch). -->

 # Java Collections Hierarchy

- **java.lang.Iterable**
  - **java.util.Collection** → root collection interface
    - **List** → ordered, index-based, allows duplicates
      - ArrayList
      - LinkedList
      - Vector *(legacy)*
        - Stack *(legacy)*
      - CopyOnWriteArrayList *(concurrent, read-heavy)*
    - **Set** → unique elements (no duplicates)
      - HashSet *(no order)*
      - LinkedHashSet *(insertion order)*
      - **SortedSet**
        - **NavigableSet**
          - TreeSet *(sorted)*
      - CopyOnWriteArraySet *(concurrent)*
    - **Queue** → FIFO / head–tail operations
      - **Deque** *(double-ended queue)*
        - ArrayDeque
        - LinkedList
      - PriorityQueue *(priority-ordered)*
      - ConcurrentLinkedQueue *(concurrent)*

- **java.util.Map** *(peer of Collection; not a sub-interface of it)* → key → value
  - HashMap
  - LinkedHashMap *(insertion/access order)*
  - **SortedMap**
    - **NavigableMap**
      - TreeMap *(sorted by key)*
  - ConcurrentHashMap *(concurrent)*
  - WeakHashMap *(GC-sensitive keys)*
  - IdentityHashMap *(`==` key equality)*
  - Hashtable *(legacy)*

> Notes: Prefer `ArrayDeque` over `Stack`. Use `LinkedHash*` when you need insertion order, `Tree*` when you need sorted order, and `Hash*` for fastest average-case lookups without order.


## Interfaces in Collections

The Java Collections Framework (JCF) provides a unified architecture for storing and manipulating groups of objects.
It defines several core interfaces (List, Set, Queue, Map) that represent different data structures and usage patterns.

Each interface provides a contract (set of rules) that concrete classes (like ArrayList, HashSet, etc.) implement in their own way.

## 1. The List Interface
The List interface is part of java.util package and extends the Collection interface.
It represents an ordered collection — elements are stored by index, starting from 0.  
**Key Characteristics**
* Maintains insertion order.
* Allows duplicate elements.
* Allows null values.
* Provides index-based access to elements.
Supports positional operations like add(index, element) and remove(index).

Syntax
```java
List<Type> listName = new ArrayList<>();
```
**Example**  
```java
import java.util.*;

public class ListExample {
    public static void main(String[] args) {
        List<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Apple"); // duplicate allowed
        System.out.println("Fruits List: " + fruits);
    }
}

/*
Expected Output:
Fruits List: [Apple, Banana, Apple]
*/
```

### ArrayList  
ArrayList is a dynamic array implementation of the List interface.
It automatically resizes as elements are added or removed.

**Features**  
* Maintains insertion order
* Allows duplicates and null elements
* Fast for random access (get, set)
* Slow for insertions/removals in the middle (shifting required)
* Not synchronized (not thread-safe)  

Syntax
```
ArrayList<Type> list = new ArrayList<>();
```
**Example**
```java
import java.util.*;

public class ArrayListExample1 {
    public static void main(String[] args) {
        ArrayList<String> colors = new ArrayList<>();
        colors.add("Red");
        colors.add("Green");
        colors.add("Blue");

        System.out.println("Colors: " + colors);
        System.out.println("Second color: " + colors.get(1));
    }
}

/*
Expected Output:
Colors: [Red, Green, Blue]
Second color: Green
*/
```

###  LinkedList
LinkedList is a doubly linked list implementation of the List interface.
Each element stores references to the previous and next nodes.

**Features**
* Maintains insertion order
* Allows duplicates and nulls
* Fast for insertions/deletions
* Slow for random access (traversal needed)

Syntax
```
LinkedList<Type> list = new LinkedList<>();
```
**Example**
```java
import java.util.*;

public class LinkedListExample1 {
    public static void main(String[] args) {
        LinkedList<String> animals = new LinkedList<>();
        animals.add("Dog");
        animals.add("Cat");
        animals.add("Elephant");

        animals.remove("Cat");
        animals.addFirst("Tiger");
        animals.addLast("Lion");

        System.out.println("Animals: " + animals);
    }
}

/*
Expected Output:
Animals: [Tiger, Dog, Elephant, Lion]
*/
```
### Vector
Vector is a synchronized dynamic array — an older version of ArrayList.
It ensures thread safety but runs slightly slower.

Vector is a synchronized dynamic array — an older version of ArrayList.
It ensures thread safety but runs slightly slower.

**Features**
* Maintains insertion order
* Allows duplicates and nulls
* Thread-safe (synchronized)
* Automatically doubles capacity when full

Syntax
```java
Vector<Type> vector = new Vector<>();
```
**Example**
```java
import java.util.*;

public class VectorExample1 {
    public static void main(String[] args) {
        Vector<String> v = new Vector<>();
        v.add("A");
        v.add("B");
        v.add("C");
        System.out.println("Vector elements: " + v);
    }
}

/*
Expected Output:
Vector elements: [A, B, C]
*/
```

### Stack
Stack extends Vector and implements a LIFO (Last-In-First-Out) structure.
It is used for problems like undo operations or expression evaluation.

**Features**
* Thread-safe (inherits from Vector)
* Operates on LIFO principle
* Common methods:
* push(element)
* pop()
* peek()
* isEmpty()  

Syntax
```java
Stack<Type> stack = new Stack<>();
```
**Example**
```java
import java.util.*;

public class StackExample1 {
    public static void main(String[] args) {
        Stack<String> books = new Stack<>();
        books.push("Java");
        books.push("Python");
        books.push("C++");

        System.out.println("Top: " + books.peek());
        books.pop();
        System.out.println("After pop: " + books);
    }
}

/*
Expected Output:
Top: C++
After pop: [Java, Python]
*/
```
## The Set Interface
### Set Interface
The Set interface represents a collection of unique elements —
duplicates are not allowed, and it may contain only one null.

**Key Characteristics**
* Unordered (except LinkedHashSet and TreeSet)
* Automatically removes duplicates
* Used when uniqueness is required
Syntax
```
Set<Type> setName = new HashSet<>();
```
### HashSet  
HashSet stores unique elements using a hash table.
It provides constant-time performance for basic operations like add, remove, and contains.

**Features**
* Unordered (no guaranteed position)
* No duplicates
* One null allowed
* Uses hashCode() and equals() for uniqueness check

Syntax
```
HashSet<Type> setName = new HashSet<>();
```
**Example**
```java
import java.util.*;

public class HashSetExample1 {
    public static void main(String[] args) {
        HashSet<String> fruits = new HashSet<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Apple"); // duplicate ignored

        System.out.println("Fruits: " + fruits);
    }
}

/*
Expected Output:
Fruits: [Banana, Apple]   // order may vary
*/
```

### LinkedHashSet
LinkedHashSet maintains a linked list internally to preserve insertion order.

**Features**
* Maintains insertion order
* No duplicates
* Slightly slower than HashSet due to order maintenance
* Allows one null

Syntax
```java
LinkedHashSet<Type> setName = new LinkedHashSet<>();
```
**Example**
```java
import java.util.*;

public class LinkedHashSetExample1 {
    public static void main(String[] args) {
        LinkedHashSet<String> cities = new LinkedHashSet<>();
        cities.add("Delhi");
        cities.add("Mumbai");
        cities.add("Hyderabad");
        System.out.println("Cities: " + cities);
    }
}

/*
Expected Output:
Cities: [Delhi, Mumbai, Hyderabad]
*/
```


### TreeSet
TreeSet stores elements in sorted (ascending) order using a Red-Black Tree.

**Features**
* Automatically sorted
* No duplicates, no nulls
* Slower than HashSet (tree operations)

Syntax
```java
TreeSet<Type> setName = new TreeSet<>();
```
**Example**
```java
import java.util.*;

public class TreeSetExample1 {
    public static void main(String[] args) {
        TreeSet<Integer> numbers = new TreeSet<>();
        numbers.add(40);
        numbers.add(10);
        numbers.add(30);
        System.out.println("Sorted Numbers: " + numbers);
    }
}

/*
Expected Output:
Sorted Numbers: [10, 30, 40]
*/
```

### ✅ Summary Table

| **Interface** | **Implementation** | **Ordered** | **Duplicates** | **Null** | **Sorted** | **Thread-Safe** |
|----------------|--------------------|--------------|----------------|-----------|-------------|------------------|
| **List** | ArrayList | ✅ | ✅ | ✅ | ❌ | ❌ |
| **List** | LinkedList | ✅ | ✅ | ✅ | ❌ | ❌ |
| **List** | Vector | ✅ | ✅ | ✅ | ❌ | ✅ |
| **List** | Stack | ✅ (LIFO) | ✅ | ✅ | ❌ | ✅ |
| **Set** | HashSet | ❌ | ❌ | ✅ (one) | ❌ | ❌ |
| **Set** | LinkedHashSet | ✅ (insertion) | ❌ | ✅ (one) | ❌ | ❌ |
| **Set** | TreeSet | ✅ (sorted) | ❌ | ❌ | ✅ | ❌ |


## Queue Interface
### Queue
The Queue interface (in java.util) represents a First-In-First-Out (FIFO) data structure.
It is used to hold elements before processing, such as in task scheduling or buffering systems.

**Key Characteristics**
* Elements are processed in the order they are inserted.
* Provides methods like:
    * add() / offer() → insert element
    * remove() / poll() → remove element
    * peek() / element() → view head element
* Queue is typically not thread-safe unless wrapped using concurrent implementations (e.g., ConcurrentLinkedQueue).

### 🔹 Common Implementations

| **Class** | **Description** | **Use Case** |
|------------|------------------|---------------|
| **PriorityQueue** | Orders elements based on priority (natural or custom order) | Task priority, scheduling |
| **Deque (Double-Ended Queue)** | Allows insertion/removal at both ends | Stack + Queue behavior |


### PriorityQueue
PriorityQueue is a queue where elements are ordered based on priority instead of insertion order.
By default, it uses natural ordering (ascending) but can take a custom Comparator.

**Features**
* Elements are not stored in FIFO order, but by priority.
* null values not allowed.
* Uses a binary heap internally.
* Automatically sorts elements when added.

Syntax
```java
PriorityQueue<Type> pq = new PriorityQueue<>();
PriorityQueue<Type> pq = new PriorityQueue<>(Comparator.reverseOrder());
```
**Example**
```java
import java.util.*;

public class PriorityQueueExample1 {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();

        pq.add(30);
        pq.add(10);
        pq.add(20);

        System.out.println("PriorityQueue: " + pq);
        System.out.println("Head element: " + pq.peek());

        pq.poll(); // remove the smallest
        System.out.println("After poll: " + pq);
    }
}

/*
Expected Output:
PriorityQueue: [10, 30, 20]
Head element: 10
After poll: [20, 30]
*/
```

### Deque (Double-Ended Queue)  
Deque stands for Double-Ended Queue, which allows adding and removing elements from both ends.
It combines features of Stack and Queue.

**Features**
* Can act as both FIFO (queue) and LIFO (stack).
* Supports methods:
    * addFirst(), addLast()
    * removeFirst(), removeLast()
    * peekFirst(), peekLast()

* ArrayDeque is the most commonly used implementation.

**Syntax**
```java
Deque<Type> dq = new ArrayDeque<>();
```
**Example**
```java
import java.util.*;

public class DequeExample1 {
    public static void main(String[] args) {
        Deque<String> dq = new ArrayDeque<>();

        dq.addLast("Task1");
        dq.addLast("Task2");
        dq.addLast("Task3");

        System.out.println("Deque: " + dq);
        dq.removeFirst();
        System.out.println("After removeFirst(): " + dq);
    }
}

/*
Expected Output:
Deque: [Task1, Task2, Task3]
After removeFirst(): [Task2, Task3]
*/
```

## MAP Interface
### The Map Interface  
The Map interface in Java stores data in key-value pairs.
Each key is unique, and each key maps to exactly one value.

**Key Characteristics**
* Keys are unique, but values can repeat.
* A Map is not a subtype of Collection.
* Provides methods:
    * put(key, value) → insert or update
    * get(key) → retrieve
    * remove(key) → delete
    * containsKey() / containsValue()

### HashMap
HashMap stores key-value pairs using hashing for fast lookups.
It allows one null key and multiple null values.

Syntax  
```java
HashMap<KeyType, ValueType> map = new HashMap<>();
```

**Example:**
```java
import java.util.*;

public class HashMapExample {
    public static void main(String[] args) {
        HashMap<Integer, String> map = new HashMap<>();
        map.put(1, "Java");
        map.put(2, "Python");
        map.put(3, "C++");

        System.out.println("Languages: " + map);
        System.out.println("Value of key 2: " + map.get(2));
    }
}

/*
Expected Output:
Languages: {1=Java, 2=Python, 3=C++}
Value of key 2: Python
*/
```

### LinkedHashMap
LinkedHashMap extends HashMap but maintains insertion order using a doubly linked list internally.

Syntax
```java
LinkedHashMap<KeyType, ValueType> map = new LinkedHashMap<>();
```
**Example**
```java
import java.util.*;

public class LinkedHashMapExample {
    public static void main(String[] args) {
        LinkedHashMap<Integer, String> map = new LinkedHashMap<>();
        map.put(101, "Alice");
        map.put(102, "Bob");
        map.put(103, "Charlie");

        System.out.println("Employees: " + map);
    }
}

/*
Expected Output:
Employees: {101=Alice, 102=Bob, 103=Charlie}
*/
```
### TreeMap
TreeMap stores key-value pairs in sorted (ascending key) order.
It is based on a Red-Black Tree.

Syntax
```java
TreeMap<KeyType, ValueType> map = new TreeMap<>();
TreeMap<KeyType, ValueType> map = new TreeMap<>(Comparator.reverseOrder());
```
**Example**
```java
import java.util.*;

public class TreeMapExample {
    public static void main(String[] args) {
        TreeMap<String, Integer> scores = new TreeMap<>();
        scores.put("Ram", 85);
        scores.put("Arun", 95);
        scores.put("Kiran", 75);

        System.out.println("Sorted Scores: " + scores);
    }
}

/*
Expected Output:
Sorted Scores: {Arun=95, Kiran=75, Ram=85}
*/
```
### Hashtable
Hashtable is a legacy synchronized implementation of Map.
It does not allow null keys or values.

**Features**
* Thread-safe (synchronized).
* No null keys or values.
* Slightly slower than HashMap.

Syntax
```java
Hashtable<KeyType, ValueType> table = new Hashtable<>();
```
**Example**
```java
import java.util.*;

public class HashtableExample {
    public static void main(String[] args) {
        Hashtable<String, Integer> marks = new Hashtable<>();
        marks.put("Math", 90);
        marks.put("Science", 80);
        marks.put("English", 85);

        System.out.println("Marks: " + marks);
    }
}

/*
Expected Output:
Marks: {Science=80, English=85, Math=90}   // order not guaranteed
*/
```
# Iteration Technique
Iteration means visiting items one-by-one to do some work on each (read, compute, transform, insert, remove).   
In Java, you iterate over arrays and collections (e.g., List, Set, Map) using:

* for-each loop → simplest, read-only traversal.
* Iterator → forward cursor; can safely remove current element.
* ListIterator → bidirectional for lists; can add/set/remove while walking.
* forEach (lambda) → concise, functional-style per-element action.

### 1) for-each loop (enhanced for)
**When to use:**   
Quick, readable traversal over arrays or anything implementing Iterable. You don’t get the index directly, and you shouldn’t structurally modify the collection inside this loop.

Syntax:
```java
for (ElementType item : iterableOrArray) {
    // use item
}
```
**Example** — Sum an int array
```java
public class MainForEach1 {
    public static void main(String[] args) {
        int[] numbers = {2, 4, 6};
        int sum = 0;
        for (int n : numbers) {      // iterate over array elements
            sum += n;
        }
        System.out.println("Sum = " + sum);
    }
}
/*
Expected output:
Sum = 12
*/
```

### 2. Iterator
**When to use:**  
Forward-only cursor; ideal when you need to safely remove the current element during traversal (using iterator.remove()).

Syntax
```java
java.util.Iterator<T> it = collection.iterator();
while (it.hasNext()) {
    T item = it.next();
    // optionally it.remove();
}
```

**Example** — Safely remove odd numbers while iterating
```java
public class MainIterator1 {
    public static void main(String[] args) {
        java.util.List<Integer> numbers = new java.util.ArrayList<>();
        numbers.add(1); numbers.add(2); numbers.add(3); numbers.add(4);

        java.util.Iterator<Integer> it = numbers.iterator();
        while (it.hasNext()) {
            int n = it.next();
            if (n % 2 != 0) {  // remove odd numbers
                it.remove();   // safe removal during iteration
            }
        }
        System.out.println(numbers);
    }
}
/*
Expected output:
[2, 4]
*/
```

### 3. ListIterator
**When to use:**  
Bidirectional traversal for lists, with the ability to get indices and modify in place (set), insert (add), and remove safely.

Syntax
```java
java.util.ListIterator<T> it = list.listIterator();   // or list.listIterator(startIndex)
while (it.hasNext()) { T x = it.next(); /* ... */ }
while (it.hasPrevious()) { T y = it.previous(); /* ... */ }
```

**Example**  — Walk forward then backward with indices
```java
public class MainListIterator1 {
    public static void main(String[] args) {
        java.util.List<String> words = new java.util.ArrayList<>();
        words.add("red");
        words.add("green");
        words.add("blue");

        java.util.ListIterator<String> it = words.listIterator();

        System.out.println("Forward:");
        while (it.hasNext()) {
            // nextIndex() is the index of the element that will be returned by next()
            System.out.println(it.nextIndex() + " -> " + it.next());
        }

        System.out.println("Backward:");
        while (it.hasPrevious()) {
            // previousIndex() is the index of the element that will be returned by previous()
            System.out.println(it.previousIndex() + " <- " + it.previous());
        }
    }
}
/*
Expected output:
Forward:
0 -> red
1 -> green
2 -> blue
Backward:
2 <- blue
1 <- green
0 <- red
*/
```

### 4. forEach with Lambda (Java 8+)
**When to use:**  
Concise, functional-style per-element action. Iterable.forEach(Consumer) for collections; Map.forEach(BiConsumer) for key–value iteration.

Syntax:
```java
iterable.forEach(e -> { /* use e */ });
iterable.forEach(System.out::println); // method reference

map.forEach((k, v) -> { /* use k and v */ });
```
**Example** 
```java
public class MainForEachLambda1 {
    public static void main(String[] args) {
        java.util.List<String> names = new java.util.ArrayList<>();
        names.add("lee");
        names.add("maria");
        names.add("omar");

        names.forEach(n -> System.out.println(n.toUpperCase())); // concise action
    }
}
/*
Expected output:
LEE
MARIA
OMAR
*/
```

## Utility classes in the Collections

### What are “utility classes”?
Classes with only static helper methods, used for algorithms, conversions, and safe wrappers. In collections land, the big two are:

* `java.util.Collections` — algorithms & wrappers for collections (`List`, `Set`, `Map`, etc.).

* `java.util.Arrays` — algorithms & helpers for arrays (`T[]`, `int[]`, etc.).

(You’ll also often use `java.util.Comparator` and `java.util.Objects`, but your focus here is Collections and Arrays.)

#### Why use them?

* Reusable algorithms (sort, search, min/max, shuffle…).
* Safety wrappers (immutable/unmodifiable, synchronized, type-checked).
* Easy conversions (array ↔ list), copying, filling, pretty printing, equality checks, etc.

## java.util.Collections (for Collections)
### Core capabilities

* Algorithms: sort, reverse, shuffle, min, max, binarySearch, frequency, disjoint.  
* Wrappers:

    * **Unmodifiable:** `unmodifiableList/Set/Map` (read-only views).
    * Synchronized: `synchronizedList/Set/Map` (legacy thread-safety wrapper; prefer `java.util.`    concurrent for new code).
    * **Checked:** `checkedList/Set/Map` (runtime type safety for raw/legacy code).

Factories/utilities: singleton*, nCopies, empty*, fill, copy (note: copy needs a pre-sized destination).


**Example 1** — Sort, reverse, min, max
```java
import java.util.*;

public class CollectionsDemo1 {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(5, 2, 9, 2));
        System.out.println("Original: " + nums);       // [5, 2, 9, 2]

        Collections.sort(nums);                        // ascending sort
        System.out.println("Sorted:   " + nums);       // [2, 2, 5, 9]

        Collections.reverse(nums);                     // reverse order
        System.out.println("Reversed: " + nums);       // [9, 5, 2, 2]

        System.out.println("Min: " + Collections.min(nums)); // 2
        System.out.println("Max: " + Collections.max(nums)); // 9
    }
}


// Expected output

// Original: [5, 2, 9, 2]
// Sorted:   [2, 2, 5, 9]
// Reversed: [9, 5, 2, 2]
// Min: 2
// Max: 9
```

**Example 2** — binarySearch (requires sorted list)
```java
import java.util.*;

public class CollectionsDemo2 {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(5, 2, 9, 2));
        Collections.sort(nums); // must be sorted ascending before binarySearch
        System.out.println("Sorted: " + nums); // [2, 2, 5, 9]

        int i1 = Collections.binarySearch(nums, 5); // found at index 2
        int i2 = Collections.binarySearch(nums, 7); // not found → negative result

        System.out.println("Index of 5: " + i1);
        System.out.println("Search 7 result: " + i2 + " (means insertion point = " + (-(i2 + 1)) + ")");
    }
}

// Expected output

// Sorted: [2, 2, 5, 9]
// Index of 5: 2
// Search 7 result: -4 (means insertion point = 3)
```
**Example 3** — Unmodifiable wrapper (safe read-only view)
```java
import java.util.*;

public class CollectionsDemo3 {
    public static void main(String[] args) {
        List<String> modifiable = new ArrayList<>(List.of("A", "B", "C"));
        List<String> readOnly = Collections.unmodifiableList(modifiable);

        System.out.println("Read-only view: " + readOnly);

        modifiable.add("D"); // underlying change is visible in the view
        System.out.println("After backing change: " + readOnly);

        try {
            readOnly.add("E"); // throws UnsupportedOperationException
        } catch (UnsupportedOperationException ex) {
            System.out.println("Caught: " + ex.getClass().getSimpleName());
        }
    }
}

// Expected output

// Read-only view: [A, B, C]
// After backing change: [A, B, C, D]
// Caught: UnsupportedOperationException
```

> Full-stack note: Use unmodifiable views (or List.copyOf(...) immutables) for DTOs/API responses to avoid accidental mutation across layers.

## 3) java.util.Arrays (for Arrays)
### Core capabilities

**Algorithms:** `sort`, `parallelSort`, `binarySearch`.
**Equality & printing:** `equals`/`deepEquals` (for nested arrays), `toString`/`deepToString`.
**Copy & fill:** `copyOf`, `copyOfRange`, `fill`.
**Conversions & streams:** `asList` (array → fixed-size list), stream over arrays.

**Important gotcha:** `Arrays.asList(...)`
* Returns a fixed-size list backed by the original array.
* Structural ops like `add`/`remove` throw `UnsupportedOperationException`.
* Mutating an element reflects in both array and the list.


**Example 4** — `Arrays.asList` is fixed-size & backed by the array
```java
import java.util.*;

public class ArraysDemo1 {
    public static void main(String[] args) {
        String[] arr = {"x", "y", "z"};
        List<String> list = Arrays.asList(arr); // fixed-size, backed by arr

        list.set(0, "X");           // OK (element replace)
        System.out.println("Array after list.set: " + Arrays.toString(arr)); // [X, y, z]

        arr[1] = "Y";
        System.out.println("List after arr[1] change: " + list); // [X, Y, z]

        try {
            list.add("new");         // NOT allowed
        } catch (UnsupportedOperationException ex) {
            System.out.println("Caught: " + ex.getClass().getSimpleName());
        }
    }
}


// Expected output

// Array after list.set: [X, y, z]
// List after arr[1] change: [X, Y, z]
// Caught: UnsupportedOperationException
```
**Example 5** — `copyOf`, `copyOfRange`, `fill`
```java
import java.util.*;

public class ArraysDemo2 {
    public static void main(String[] args) {
        int[] a = {1, 2, 3};

        int[] bigger = Arrays.copyOf(a, 5);     // pads with zeros
        System.out.println("copyOf 5: " + Arrays.toString(bigger)); // [1, 2, 3, 0, 0]

        int[] mid = Arrays.copyOfRange(a, 1, 3); // [2, 3] (end-exclusive)
        System.out.println("copyOfRange(1,3): " + Arrays.toString(mid));

        int[] filled = new int[4];
        Arrays.fill(filled, -1);
        System.out.println("filled: " + Arrays.toString(filled)); // [-1, -1, -1, -1]
    }
}


// Expected output

// copyOf 5: [1, 2, 3, 0, 0]
// copyOfRange(1,3): [2, 3]
// filled: [-1, -1, -1, -1]
```

**Example 6** — `deepEquals` & `deepToString` for nested arrays
```java
import java.util.*;

public class ArraysDemo3 {
    public static void main(String[] args) {
        int[][] m1 = {{1,2},{3,4}};
        int[][] m2 = {{1,2},{3,4}};

        System.out.println("toString:     " + Arrays.toString(m1));      // shallow
        System.out.println("deepToString: " + Arrays.deepToString(m1));  // deep

        System.out.println("equals:      " + Arrays.equals(m1, m2));     // false (shallow)
        System.out.println("deepEquals:  " + Arrays.deepEquals(m1, m2)); // true
    }
}


// Expected output

// toString:     [[I@..., [I@...]
// deepToString: [[1, 2], [3, 4]]
// equals:      false
// deepEquals:  true
```

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|