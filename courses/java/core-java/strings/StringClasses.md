# Java String Class
The String class in Java provides a wide range of built-in methods to manipulate and inspect text data.
These methods allow you to measure length, extract parts, compare, or modify content.

Below are the most commonly used String methods, grouped by their purpose — each with a clear explanation, syntax, example, and expected output.


## Common String Operations
  * ### Measuring & Accessing
     * **length()** → returns the total number of characters in a string.

         **Syntax**
         ```java
         String name = "TINITIATE";
         System.out.println(name.length());  
         // Output: 9
         ```
     * **charAt(index)** → returns the character at the given position (0-based index).  

         **Syntax**
         ```java
         String word = "Java";
         System.out.println(word.charAt(0));  
         // Output: J

         System.out.println(word.charAt(3));  
         // Output: a
          ```

  * ### Extracting Substrings
     * **substring(beginIndex, endIndex)** → extracts part of a string from beginIndex (inclusive) to endIndex (exclusive).
     
         **Syntax**
         ```java
         String text = "TINITIATE";
         String part = text.substring(0, 4);
         System.out.println(part);
         // Output: TINI
         ```

     * **substring(beginIndex)** → extracts from the given index to the end.

         **Syntax**
         ```java
         String text = "Programming";
         System.out.println(text.substring(6));
         // Output: mming
         ```
  * ### Searching
     * **indexOf()** → finds the first position of a character or substring.

          **Syntax**
         ```java
         String text = "banana";

         System.out.println(text.indexOf('a'));       
         // Output: 1  (first 'a')

         System.out.println(text.indexOf("na"));      
         // Output: 2  (first "na")
         ```      
     * **lastIndexOf()** → finds the last occurrence.

         **Syntax**
         ```java
         String text = "banana";

         System.out.println(text.lastIndexOf('a'));    
         // Output: 5  (last 'a')

         System.out.println(text.lastIndexOf("na"));   
         // Output: 4  (last "na")
         ```    

  * ### Case Conversion
     * **toUpperCase()** → converts all characters to uppercase.

          **Syntax**
         ```java
         String text = "tinitiate";
         System.out.println(text.toUpperCase());
         // Output: TINITIATE
         ```    
     * **toLowerCase()** → converts all characters to lowercase.
     
          **Syntax**
         ```java
         String text = "JAVA PROGRAMMING";
         System.out.println(text.toLowerCase());
         // Output: java programming
         ```    

  * ### Cleaning & Replacing
     * **trim()** → removes leading and trailing spaces.

          **Syntax**
         ```java
         String text = "   Java Programming   ";
         System.out.println(text.trim());
         // Output: "Java Programming"
         ```    
     * **replace()** → replaces all occurrences of one substring with another.

         **Syntax**
         ```java
         String text = "Java Programming";
         System.out.println(text.replace("Java", "Python"));
         // Output: Python Programming
         ```
     * **contains()** → checks if a substring exists within the main string.

         **Syntax**
         ```java
         String text = "Java Programming";
         System.out.println(text.contains("Program"));
         // Output: true
         ```
  * ### Comparison
     * **equals()** → checks if two strings have exactly the same characters (case-sensitive).

         **Syntax**
         ```java
        String s1 = "Java";
        String s2 = "Java";
        String s3 = "java";

        System.out.println(s1.equals(s2)); // true
        System.out.println(s1.equals(s3)); // false
         ```
     * **equalsIgnoreCase()** → compares strings ignoring case differences.

         **Syntax**
        ```java
        String s1 = "Java";
        String s2 = "java";

        System.out.println(s1.equalsIgnoreCase(s2)); // true
         ```

     * **compareTo()** → compares lexicographically (dictionary order).

         **Syntax**
         ```java
        String s1 = "Apple";
        String s2 = "Banana";
        String s3 = "Apple";

        System.out.println(s1.compareTo(s2)); // negative value
        System.out.println(s2.compareTo(s1)); // positive value
        System.out.println(s1.compareTo(s3)); // 0
         ```

     * **startsWith()** → checks if a string begins with a specified prefix.

         **Syntax**
         ```java
        String s = "TINITIATE";

        System.out.println(s.startsWith("TINI")); // true
        System.out.println(s.startsWith("INIT")); // false
         ```
     * **endsWith()** → checks if a string ends with a specified suffix.

         **Syntax**
         ```java
        String s = "TINITIATE";

        System.out.println(s.endsWith("ATE")); // true
        System.out.println(s.endsWith("TIN")); // false
         ```


#### Example
```java
public class StringOperationsExample {
    public static void main(String[] args) {
        String text = "   Java Programming   ";

        // Measuring & Accessing
        System.out.println("Length: " + text.length());                // Output: 22
        System.out.println("Char at index 5: " + text.charAt(5));      // Output: P

        // Extracting
        System.out.println("Substring(3, 7): " + text.substring(3, 7)); // Output: a Pr

        // Searching
        System.out.println("Index of 'a': " + text.indexOf('a'));       // Output: 1
        System.out.println("Last index of 'a': " + text.lastIndexOf('a')); // Output: 19

        // Case Conversion
        System.out.println("Uppercase: " + text.toUpperCase());         // Output:    JAVA PROGRAMMING   
        System.out.println("Lowercase: " + text.toLowerCase());         // Output:    java programming   

        // Cleaning & Replacing
        System.out.println("Trimmed: '" + text.trim() + "'");           // Output: 'Java Programming'
        System.out.println("Replaced 'Java' → 'Python': " 
                            + text.replace("Java", "Python"));          // Output:    Python Programming   
        System.out.println("Contains 'Program': " + text.contains("Program")); // Output: true

        // Comparison
        String s1 = "Java";
        String s2 = "java";
        System.out.println("equals(): " + s1.equals(s2));                      // Output: false
        System.out.println("equalsIgnoreCase(): " + s1.equalsIgnoreCase(s2));  // Output: true
        System.out.println("compareTo(): " + s1.compareTo(s2));                // Output: -32
        System.out.println("startsWith(\"Ja\"): " + s1.startsWith("Ja"));      // Output: true
        System.out.println("endsWith(\"va\"): " + s1.endsWith("va"));          // Output: true
    }
}
```

##### [Back To Contents](./strings.md)
***
| &copy; TINITIATE.COM |
|----------------------|