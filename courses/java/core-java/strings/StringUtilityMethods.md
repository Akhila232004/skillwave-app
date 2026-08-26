# String Utility Methods 
The String class in Java provides several utility methods that simplify text handling —
from formatting and conversion to checking for emptiness or cleaning up input.

These methods improve readability and reduce boilerplate code for everyday string manipulation tasks.


  * ### String.format()
     * Creates formatted strings using placeholders (like %s, %d, %f).
     * Similar to printf, but returns a String instead of printing it.  

    Syntax
    ```java
    String result = String.format("Name: %s, Age: %d", name, age);
    ```
> Notes   
> * %s → String   
> * %d → Integer   
> * %f → Floating-point number (use %.2f for 2 decimals) 

  * ### String.valueOf()
     * Converts any primitive or object into its string form.
     * Prevents NullPointerException by returning "null" if the argument is null.  

    Syntax  
    ```java
    String s1 = String.valueOf(123);
    String s2 = String.valueOf(true);
    ```

  * ### replaceAll()
    * Replaces all matching substrings based on a regular expression (regex).
    * Use replace() if you don’t need regex support.

    Syntax  
    ```java
    String result = text.replaceAll("regex", "replacement");
    ```
  > Notes
  > *  To remove digits: replaceAll("[0-9]", "")
  > * To remove spaces: replaceAll("\\s+", "")

 * ### isEmpty()
    * Returns true if the string’s length is 0.
    * Does not ignore spaces.  

    Syntax  
    ```java
    boolean result = str.isEmpty(); 
    ``` 
   
  * ### isBlank() (Java 11+)
    * Returns true if a string is empty or only contains whitespace.
    * Safer and more flexible than isEmpty().

    Syntax  
    ```java
    boolean result = str.isBlank();
    ```

  #### Example 
  ```java
  public class StringUtilityExample {
    public static void main(String[] args) {
        // format()
        String name = "Ravi";
        int age = 25;
        double score = 88.567;
        String formatted = String.format("Name: %s, Age: %d, Score: %.2f", name, age, score);
        System.out.println(formatted); // Output: Name: Ravi, Age: 25, Score: 88.57

        // valueOf()
        int number = 100;
        boolean flag = true;
        String numStr = String.valueOf(number);
        String boolStr = String.valueOf(flag);
        System.out.println(numStr);   // Output: 100
        System.out.println(boolStr);  // Output: true

        // replaceAll()
        String messy = "Java123Programming456";
        String cleaned = messy.replaceAll("[0-9]", "");
        System.out.println(cleaned);  // Output: JavaProgramming

        // isEmpty() and isBlank()
        String s1 = "";
        String s2 = "   ";
        System.out.println(s1.isEmpty());  // Output: true
        System.out.println(s2.isEmpty());  // Output: false
        System.out.println(s1.isBlank());  // Output: true
        System.out.println(s2.isBlank());  // Output: true
    }
}
```