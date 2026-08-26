## String Conversion
String conversion in Java means converting Strings to other data types or other data types back to Strings.
This is extremely common when handling user input, performing calculations, or displaying results.

### Java provides simple built-in methods for:
 * Converting between Strings and primitives (like int, double, etc.)
 * Converting between Strings and character arrays (char[])

 ## String ↔ Primitive Conversion
   * ### Converting String → Primitive
      Use wrapper class methods like Integer.parseInt(), Double.parseDouble(), etc.  
     These convert numeric strings into their respective primitive values.  

     Syntax:
     ```java
      int num = Integer.parseInt("100");
      double price = Double.parseDouble("99.5");
      boolean flag = Boolean.parseBoolean("true");
      ```
   * #### Converting Primitive → String
     Use String.valueOf() or concatenation (+ "") to convert primitives into Strings.

     Syntax:
     ```java
      String str1 = String.valueOf(123);
      String str2 = String.valueOf(45.6);
      String str3 = 99 + "";   // implicit conversion using +
      ```
 ### String ↔ Char Array Conversion
   * #### String → Char Array
     Use toCharArray() to break a string into its individual characters.

     Syntax:
     ```java
      char[] letters = str.toCharArray();
     ```

   * #### Char Array → String
     Use the String constructor or String.valueOf(char[]) to rebuild a String.

     Syntax:
     ```java
      String newStr = new String(letters);
     ```
#### Example
```java
    public class StringConversionExample {
    public static void main(String[] args) {

        // String → Primitive
        String numStr = "150";
        int num = Integer.parseInt(numStr);
        double val = Double.parseDouble("45.67");
        boolean boolVal = Boolean.parseBoolean("true");
        System.out.println("int: " + num);          // Output: int: 150
        System.out.println("double: " + val);       // Output: double: 45.67
        System.out.println("boolean: " + boolVal);  // Output: boolean: true

        // Primitive → String
        String s1 = String.valueOf(200);
        String s2 = String.valueOf(55.8);
        System.out.println("String 1: " + s1);      // Output: String 1: 200
        System.out.println("String 2: " + s2);      // Output: String 2: 55.8

        // String → Char Array
        String word = "Java";
        char[] letters = word.toCharArray();
        System.out.println("First char: " + letters[0]); // Output: First char: J

        // Char Array → String
        String rebuilt = new String(letters);
        System.out.println("Rebuilt String: " + rebuilt); // Output: Rebuilt String: Java
    }
}
```

##### [Back To Contents](./strings.md)
***
| &copy; TINITIATE.COM |
|----------------------|