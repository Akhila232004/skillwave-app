## String Splitting & Joining
String splitting and joining are two essential operations in Java used for breaking a string into parts and combining multiple strings into one.
  * Splitting allows you to divide a string into smaller pieces based on a delimiter (like space, comma, or symbol).
  * Joining lets you combine multiple words, phrases, or array elements into a single string.  

Both are extremely useful in data processing, file reading, and text formatting tasks.

* ### Splitting a String — split()
    
  * The split() method divides a string into an array of substrings.
  * It uses a delimiter (regular expression) to decide where to split.
  * Returns a String array.

   Syntax  
    ```java
     String[] parts = str.split("delimiter");
    ```

> #### Notes  
> * Common delimiters: " ", ",", "\\n", "-", "\\|"  
> * Use double backslash (\\) for special characters in regex.

  * ### Joining Strings — String.join()
    * The String.join() method joins multiple strings using a given delimiter.
    * Works with individual strings or an array/collection of strings.
    * Introduced in Java 8.

    Syntax   
    ```java
      String result = String.join("delimiter", str1, str2, str3);
      String result = String.join("delimiter", stringArray);
    ```
#### Example
```java
public class StringSplitJoinExample {
    public static void main(String[] args) {
        // SPLIT EXAMPLES
        String sentence = "Java is fun to learn";
        String[] words = sentence.split(" ");        // split by space

        System.out.println("After splitting:");
        for (String w : words) {
            System.out.println(w);                   // Output: Java / is / fun / to / learn
        }

        // Split using comma
        String csv = "Apple,Banana,Cherry,Dates";
        String[] fruits = csv.split(",");
        System.out.println("Second fruit: " + fruits[1]); // Output: Banana

        // JOIN EXAMPLES
        String joined = String.join(" ", "Learn", "Java", "Easily");
        System.out.println("Joined String: " + joined);   // Output: Learn Java Easily

        // Join using array
        String[] langs = {"C", "C++", "Java", "Python"};
        String languages = String.join(" | ", langs);
        System.out.println("Languages: " + languages);    // Output: C | C++ | Java | Python
    }
}
```