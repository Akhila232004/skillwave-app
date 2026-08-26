# Comparison Methods

  *  **Using == Operator**
     * Compares object references, not actual string content.
     * Returns true only if both variables point to the same memory location.
     * Not reliable for checking text equality unless you are sure they refer to the same literal in the String pool.

     Syntax:
     ```
      string1 == string2
      ```

  * **Using equals() Method**  
    * Compares the contents (characters) of two strings.
    * Returns true if both strings have identical sequences of characters.
    * Case-sensitive comparison.

    Syntax:
      ```
      string1.equals(string2)
      ```
  * **Using compareTo() Method**
    * Compares two strings lexicographically (dictionary order).
    * **Returns:**

      * ` 0 → `   if both strings are equal
      * ` < 0 ` → if string1 comes before string2
      * ` > 0 ` → if string1 comes after string2

    * Comparison is case-sensitive (use compareToIgnoreCase() to ignore case).

    Syntax:
    ```
    string1.compareTo(string2)
    ```
#### Example
 ```java
 public class StringComparisonExample {
    public static void main(String[] args) {
        String s1 = "Java";
        String s2 = "Java";
        String s3 = new String("Java");
        String s4 = "Python";

        // == operator (checks reference)
        System.out.println(s1 == s2);       // true  → both refer to same literal in String pool
        System.out.println(s1 == s3);       // false → different memory locations

        // equals() (checks content)
        System.out.println(s1.equals(s2));  // true  → same content
        System.out.println(s1.equals(s4));  // false → different content

        // compareTo() (lexicographical comparison)
        System.out.println(s1.compareTo(s2)); // 0  → equal
        System.out.println(s1.compareTo(s4)); // -6 → "J" comes before "P"
        System.out.println(s4.compareTo(s1)); // 6  → "P" comes after "J"
    }
}
```

##### [Back To Contents](./strings.md)
***
| &copy; TINITIATE.COM |
|----------------------|