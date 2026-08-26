## Introduction to Strings  
A String in Java is a sequence of characters — for example, "Hello" or "Java123".  
Strings are non-primitive (reference) data types and belong to the java.lang package.  
They are widely used to represent text, messages, or any character data.

In Java, a String is an object of the String class.  
Each String object stores its sequence of characters internally using a char[] (character array).

### Key Points
* Strings are immutable — once created, they cannot be changed.
* They are objects, not primitive types.

* Java optimizes memory by maintaining a String pool, where identical string literals share a single instance.

#### Example:
```java
public class IntroToStrings {
    public static void main(String[] args) {
        String greeting = "Hello, Java!";
        System.out.println(greeting);
    }
}

// Expected Output: Hello, Java!
```
##  Declaring & Initializing Strings

There are two main ways to create a string in Java:

### (a) Using String Literals

When you create a string using double quotes ("..."), Java checks if the same literal already exists in the String pool.  
If it does, the existing object is reused — saving memory.
```java
String s1 = "Java";   // created in String pool
String s2 = "Java";   // refers to same object as s1
System.out.println(s1 == s2); // true (same reference)


// Expected Output: true
```
### (b) Using the new Keyword

When you use new String("text"), a new object is created in heap memory, even if the same string already exists in the pool.
```java
String s3 = new String("Java");  // new object created
String s4 = new String("Java");  // another new object
System.out.println(s3 == s4);    // false (different objects)
System.out.println(s3.equals(s4)); // true (same content)


// Expected Output:

// false
// true
```

### Key Differences: String Literal vs new String()

| **Aspect** | **String Literal** | **new String()** |
|-------------|--------------------|------------------|
| **Memory Location** | String Pool | Heap Memory |
| **Object Reuse** | ✅ Yes (if same literal) | ❌ No (always new object) |
| **Example** | `String s = "Java";` | `String s = new String("Java");` |

## String Immutability

A String is immutable, meaning that once created, its value cannot be changed.
When you modify a String, Java actually creates a new String object, and the old one remains unchanged.

#### Example:
```java
public class StringImmutability {
    public static void main(String[] args) {
        String text = "Hello";
        text.concat(" World");  // this does not change 'text'
        System.out.println(text);  // still prints "Hello"

        text = text.concat(" World");  // assigns new String
        System.out.println(text);  // now prints "Hello World"
    }
}

// Expected Output:

// Hello
// Hello World
```
### Why Immutability Matters

* Security: Prevents accidental or malicious changes (e.g., in network parameters, file paths).
* Performance: Enables String pooling — reuse of identical strings.
* Thread Safety: Immutable objects can be shared safely among multiple threads.

## String Operations 
The String class in Java provides a wide range of built-in methods to manipulate and inspect text data. 
Includes:  
- `length()`, `charAt()`, `substring()`, `indexOf()`  
- `toUpperCase()`, `toLowerCase()`, `trim()`, `replace()`  
- `equals()`, `equalsIgnoreCase()`, `compareTo()

➡️ [Read More](./StringClasses.md)  

## String Concatenation
 Multiple ways to join strings:  
- `+` operator  
- `concat()`  
- `String.join()` and `String.format()`

➡️ [Read More](./StringConcatenation.md)
## String Comparison
String comparison in Java is used to check whether two strings are the same or to determine their order alphabetically (lexicographically).  
Since String is an object, comparisons can be done in two main ways:  

 * By reference (==)
 * By content (equals() / compareTo())

➡️ [Read More](./StringComparison.md) 
 
## StringBuilder and StringBuffer
Unlike the String class (which is immutable),  
StringBuilder and StringBuffer are mutable classes — meaning their contents can be changed after creation.  
They are ideal for situations where you need to modify, append, or manipulate strings frequently (e.g., loops, dynamic content).

### Mutable Alternatives to String

| **Feature** | **String** | **StringBuilder** | **StringBuffer** |
|--------------|-------------|-------------------|------------------|
| **Mutability** | Immutable | Mutable | Mutable |
| **Thread Safety** | Safe (immutable) | Not Thread-Safe | Thread-Safe |
| **Speed** | Slower for modifications | Faster (no synchronization) | Slower (uses synchronization) |
| **Use Case** | Fixed text | Single-threaded performance | Multi-threaded programs |

### Key Methods

| **Method** | **Description** |
|-------------|-----------------|
| **append(String s)** | Adds text to the end |
| **insert(int index, String s)** | Inserts text at the given position |
| **delete(int start, int end)** | Removes characters from the specified range |
| **reverse()** | Reverses the character sequence |
| **toString()** | Converts the builder back to a regular String |

#### Syntax
```java
StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");
sb.insert(5, ",");
sb.delete(0, 1);
sb.reverse();
String result = sb.toString();
```
<!-- #### Example
```java
public class StringBuilderBufferExample {
    public static void main(String[] args) {
        // Using StringBuilder (faster, not synchronized)
        StringBuilder sb = new StringBuilder("Java");
        sb.append(" Programming");                  // add text → "Java Programming"
        sb.insert(4, " Language");                  // insert text → "Java Language Programming"
        sb.delete(4, 13);                           // delete " Language" → "Java Programming"
        sb.reverse();                               // reverse string → "gnimmargorP avaJ"
        System.out.println(sb.toString());          // Output: gnimmargorP avaJ

        // Convert back to normal String
        String normal = sb.toString();
        System.out.println("As String: " + normal); // Output: As String: gnimmargorP avaJ

        // Using StringBuffer (thread-safe)
        StringBuffer sbf = new StringBuffer("Fast");
        sbf.append(" and Safe");                    // add text → "Fast and Safe"
        System.out.println(sbf.toString());         // Output: Fast and Safe
    }
}
``` -->

➡️ [Read More: StringBuffer](./StringBuffer.md)  
➡️ [Read More: StringBuilder](./StringBuilder.md)

---
## [String Conversion](./StringConversion.md)
## [String SplittingAnd Joining](./StringSplittingAndJoining.md)
## [String Utility Methods](./StringUtilityMethods.md)
## [Limitations of Strings](./LimitationsofStrings.md)
<!-- 

## Limitations of Strings
In Java, objects of the String class are immutable, meaning once a string is created, it cannot be changed.
While immutability provides safety and efficiency in some cases, it can also cause performance overhead when strings are frequently modified.


  * ### Immutability Overhead
    * Each modification (like concatenation, replacement, etc.) creates a new String object in memory instead of changing the original one.

    * This leads to:
       * Extra memory usage (multiple copies created).
       * Slower performance in loops or repeated operations.
       * Increased garbage collection, since many intermediate objects are discarded.

#### Example
```java
public class StringLimitationExample {
    public static void main(String[] args) {
        String text = "Java";
        text = text + " Programming";   // new object created
        text = text + " Language";      // another new object
        System.out.println(text);       // Output: Java Programming Language
    }
}
```
>Each + operation above creates a new String object, even though we’re just adding text.

  * ### Prefer StringBuilder for Modifications
     * Unlike String, StringBuilder is mutable — it allows changes to the same object.
     * It avoids repeated object creation, making it much faster and memory-efficient  for concatenations inside loops or large text construction.

#### Example
```java
public class StringBuilderBetterExample {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Java");
        sb.append(" Programming");
        sb.append(" Language");
        System.out.println(sb.toString());   // Output: Java Programming Language
    }
}
```
> Only one object is created and modified in place.
 -->
---

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|