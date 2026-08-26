# Java Regular Expressions — Meta Characters & Quantifiers

This module contains **21 practical RegEx examples**, each demonstrating a different  
meta-character, special anchor, character class, quantifier, or advanced pattern-matching rule.

All examples use a common helper method that wraps:

✔ Pattern creation  
✔ Matcher creation  
✔ replaceAll execution  
✔ Output formatting  

---

# Helper Method Used in All Examples

```java
public static void RegEx(String p_RegEx, String p_TargetString,
                         String p_RegExPattern, String p_ReplaceString)
{
    System.out.println("");
    System.out.println("-------------------------------------");
    System.out.println("Example RegEx   : " + p_RegEx);
    System.out.println("Target String   : " + p_TargetString);
    System.out.println("Search for      : " + p_RegExPattern);
    System.out.println("Replace with    : " + p_ReplaceString);

    Pattern p = Pattern.compile(p_RegExPattern);
    Matcher m = p.matcher(p_TargetString);

    String result = m.replaceAll(p_ReplaceString);
    System.out.println("Replaced String : " + result);
    System.out.println("-------------------------------------");
    System.out.println("");
}
