# **Java Regular Expressions – Introduction**

## **Regular Expressions**

### **Target string**

This is the text we search inside for a matching pattern.

### **Pattern / Search Expression**

The expression we search for inside the target string.
It is made up of:

#### **1. Literal**

Text to be matched exactly.
*No pattern — only exact characters or strings.*

#### **2. Meta-character**

Special characters with meaning in RegEx.
They are understood by the compiler and behave differently from normal text.

#### **3. Escape sequence**

Used to convert meta-characters into literals.  

## **Java RegEx API – `java.util.regex`**

The `java.util.regex` package primarily consists of **three classes**:

### **1. Pattern Class**

* Represents a compiled regular expression.
* **Has no public constructors.**
* Created using:

```java
Pattern p = Pattern.compile("your-regex");
```

### **2. Matcher Class**

* Engine that applies the pattern on the target string.
* Performs match operations.
* **Has no public constructor.**
* Created using:

```java
Matcher m = p.matcher(targetString);
```
### **3. PatternSyntaxException**

* Indicates a **syntax error** inside a regex pattern.
* Thrown when an invalid/unrecognized regex is used.
---

### Example
```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExIntro
{
    public static void main( String args[] )
    {
        // String to be scanned to find the pattern.
        String TargetString = "Find me in me this string me, test me";
        String SearchExpression_literal = "me";  // Default Pattern (RegEx ) group

        // Create a Pattern object
        Pattern r = Pattern.compile(SearchExpression_literal);

        // Now create matcher object.
        Matcher m = r.matcher(TargetString);

        int SearchFindCounter = 0;
        /**
         *  Matcher.find() Returns Boolean for every occurrence found
         */
        while (m.find())
        { 
        	System.out.println(" -- -- -- -- ");
        	System.out.println("TargetString: " + TargetString);
        	System.out.println("SearchExpression '"+ SearchExpression_literal +"' occurrence#: "+(SearchFindCounter+1));

        	/** 
    	     *  group() method prints the exact string found.
    	     */
    	    System.out.println("SearchExpression: " + m.group());

    	    /**
    	     *  start()  method, Returns the start index of the pattern
    	     *  end()    method, Returns the end index of the pattern
    	     */
    	    System.out.println("SearchExpression Start Index m.start: " + m.start());
    	    System.out.println("SearchExpression End Index m.end: " + m.end());

    	    SearchFindCounter++;
        }
        System.out.println("Total occurrences of SearchExpression 'is' :"+SearchFindCounter);
    }
}
```