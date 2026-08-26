# String Concatenation
String concatenation means joining two or more strings together to form a single combined string.
It’s one of the most common operations when displaying messages, constructing sentences, or combining data in Java.

Java provides multiple ways to concatenate strings — each with different use cases and performance implications.

### Concatenation Methods

 *  **Using + Operator**  
    * Easiest and most readable way to join strings.  
    * Internally uses **StringBuilder** during compilation.  
    * Suitable for small, simple concatenations.

 * **Using concat() Method**  
    * Built-in **String** method that joins one string to another.  
    * **Syntax:** `str1.concat(str2)`  
    * Can only join string values, not primitives directly.

 * **Using String.join() (Java 8+)**  
    * Joins multiple strings with a delimiter (like space, comma, etc.).  
    * **Syntax:** `String.join(" ", str1, str2, str3)`  
    * Very handy for joining lists or multiple words.

 * **Using String.format()**  
    * Provides advanced formatting using placeholders (like `%s`, `%d`, etc.).  
    * Useful when combining different data types or creating structured messages.  
    * **Syntax:** `String.format("Name: %s, Age: %d", name, age)`

#### Example
```java
public class StringConcatenationExample {
    public static void main(String[] args) {
        String first = "Java";
        String second = "Programming";
        int version = 17;

        // Using + operator
        String result1 = first + " " + second;
        System.out.println(result1);                     // Output: Java Programming

        // Using concat() method
        String result2 = first.concat(" ").concat(second);
        System.out.println(result2);                     // Output: Java Programming

        // Using String.join()
        String result3 = String.join(" ", "Learn", "Java", "Easily");
        System.out.println(result3);                     // Output: Learn Java Easily

        // Using String.format()
        String result4 = String.format("%s %s %d", first, second, version);
        System.out.println(result4);                     // Output: Java Programming 17

        // Mixing text and variables
        String message = "Welcome to " + first + " " + second + " " + version;
        System.out.println(message);                     // Output: Welcome to Java Programming 17
    }
}
```
##### [Back To Contents](./strings.md)
***
| &copy; TINITIATE.COM |
|----------------------|