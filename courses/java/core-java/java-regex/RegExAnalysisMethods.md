# **Java RegEx – `matches()` vs `lookingAt()`**

## **RegEx Matching Methods Overview**

### 🔹 **`matches()` Method**

* Always starts matching **from the beginning** of the target string.
* Tries to match the **entire** target string with the regex pattern.
* **Returns `true`** ➝ only if the **whole string** matches the pattern.
* **Returns `false`** ➝ if even a single character does not match.

---

### 🔹 **`lookingAt()` Method**

* Also starts matching **from the beginning** of the target string.
* But it **does NOT require the entire string** to match.
* **Returns `true`** ➝ if the **beginning** of the string matches the pattern.
* **Returns `false`** ➝ if the starting characters do not match.

---

### Exanple
```java
import java.util.regex.*;

public class RegExAnalysisMethods
{
    public static void main( String args[] )
    {
       // String to be scanned to find the pattern.
       String TargetString = "Find me in me this string me, test me";
       String SearchExpression_literal = "Find";  // Default Pattern (RegEx ) group

       // Create a Pattern object
       Pattern r = Pattern.compile(SearchExpression_literal);
       // Now create matcher object.
       Matcher m = r.matcher(TargetString);
       
       System.out.println("Current TargetString string is: " + TargetString);
       System.out.println("Current Pattern / RegEx is: " + SearchExpression_literal);

       System.out.println("lookingAt(): " + m.lookingAt());
       System.out.println("matches(): " + m.matches());

       System.out.println("");

       // String to be scanned to find the pattern.
       TargetString = "Find me in me this string me";
       SearchExpression_literal = "Find me in me this string me";  // Default Pattern (RegEx ) group

       // Create a Pattern object
       r = Pattern.compile(SearchExpression_literal);
       // Now create matcher object.
       m = r.matcher(TargetString);

       System.out.println("Current TargetString string is: " + TargetString);
       System.out.println("Current Pattern / RegEx is: " + SearchExpression_literal);

       /**
        *  Matcher.lookingAt Returns TRUE if the starting of the target string matches
        *  else returns FALSE.
        */
       System.out.println("lookingAt(): " + m.lookingAt());

       /**
        *  Matcher.matches Returns TRUE if the entire target string is matched
        *  else returns FALSE.
        */
       System.out.println("matches(): " + m.matches());

       // String to be scanned to find the pattern.
       TargetString = "Find me in me this string me";
       SearchExpression_literal = "me";  // Default Pattern (RegEx ) group

       // Create a Pattern object
       r = Pattern.compile(SearchExpression_literal);
       // Now create matcher object.
       m = r.matcher(TargetString);

       System.out.println("Current TargetString string is: " + TargetString);
       System.out.println("Current Pattern / RegEx is: " + SearchExpression_literal);
    }
}
```