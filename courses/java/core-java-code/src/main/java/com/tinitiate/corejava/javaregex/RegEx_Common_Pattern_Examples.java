package com.tinitiate.corejava.javaregex;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * ******************************************
 * Common Regular Expression Pattern Examples
 * Wrapped inside a reusable RegEx method
 * ******************************************
 *
 * 1)  Matches any single character using '.'
 * 2)  Matches start of line '^'
 * 3)  Matches END of line '$'
 * 4)  Matches any single character in brackets [...]
 * 5)  Matches any single character NOT in brackets [^...]
 * 6)  Matches beginning of entire string '\\A'
 * 7)  Matches end of entire string '\\z'
 * 8)  Matches end of string except final terminator '\\Z'
 * 9)  Matches 0 or more occurrences of preceding expression '*'
 * 10) Matches 1 or more occurrences '+'
 * 11) Matches 0 or 1 occurrence '?'
 * 12) Matches exactly n occurrences 'exp{n}'
 * 13) Matches n or more occurrences 'exp{n,}'
 * 14) Matches between n and m occurrences 'exp{n,m}'
 * 15) Matches X OR Y using 'X|Y'
 * 16) Matches word characters '\\w'
 * 17) Matches NON word characters '\\W'
 * 18) Matches whitespace '\\s'
 * 19) Matches NON whitespace '\\S'
 * 20) Matches digits '\\d'
 * 21) Matches NON digits '\\D'
 */
public class RegEx_Common_Pattern_Examples {

    // Reusable static method to run a regular expression example
    public static void RegEx(String p_RegEx, String p_TargetString,
                             String p_RegExPattern, String p_ReplaceString) {

        System.out.println("");
        System.out.println("-------------------------------------");
        System.out.println("Example RegEx   : " + p_RegEx);
        System.out.println("Target String   : " + p_TargetString);
        System.out.println("Search for      : " + p_RegExPattern);
        System.out.println("Replace with    : " + p_ReplaceString);

        // Create a Pattern object
        Pattern p = Pattern.compile(p_RegExPattern);

        // Create matcher object
        Matcher m = p.matcher(p_TargetString);

        // Replace using replaceAll
        String updated = m.replaceAll(p_ReplaceString);

        System.out.println("Replaced String : " + updated);
        System.out.println("-------------------------------------");
        System.out.println("");
    }

    public static void main(String[] args) {

        String RegEx;
        String TargetString;
        String RegExPattern;
        String ReplaceString;

        // 1) Matches any single character using '.'
        RegEx = "1) Matches any single character using '.'";
        TargetString  = "ABCDEFG";
        RegExPattern  = "B(.)D";
        ReplaceString = "BXD";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 2) Matches start of line '^'
        RegEx = "2) Matches START of line '^'";
        TargetString  = " is a line.";
        RegExPattern  = "^";
        ReplaceString = "Here";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 3) Matches END of line '$'
        RegEx = "3) Matches END of line '$'";
        TargetString  = "This is a ";
        RegExPattern  = "$";
        ReplaceString = "line";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 4) Matches any character in brackets
        RegEx = "4) Matches any character in brackets [...]";
        TargetString  = "SAT SIT SET";
        RegExPattern  = "S[AI]T";
        ReplaceString = "SXT";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 5) Matches any character NOT in brackets
        RegEx = "5) Matches any character NOT in brackets [^...]";
        TargetString  = "SAT SIT SET";
        RegExPattern  = "S[^AI]T";
        ReplaceString = "SXT";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 6) Beginning of entire string \A
        RegEx = "6) Matches Beginning of entire string '\\A'";
        TargetString  = "there was PASCAL";
        RegExPattern  = "\\A";
        ReplaceString = "Once upon a time ";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 7) End of entire string \z
        RegEx = "7) Matches End of entire string '\\z'";
        TargetString  = "there was ";
        RegExPattern  = "\\z";
        ReplaceString = "PASCAL.";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 8) End of entire string except line terminator \Z
        RegEx = "8) Matches end except final terminator '\\Z'";
        TargetString  = "there was \n";
        RegExPattern  = "\\Z";
        ReplaceString = "PASCAL.";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 9) '*' example
        RegEx = "9) Matches 0 or more occurrences of preceding expression '*'";
        TargetString  = "JA is Cool, JAJA is Cool";
        RegExPattern  = "J*";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 10) '+' example
        RegEx = "10) Matches 1 or more '+'";
        TargetString  = "JA is Cool, JAJA is Cool";
        RegExPattern  = "J+";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 11) '?' example
        RegEx = "11) Matches 0 or 1 '?'";
        TargetString  = "JA is Cool, JAJA is Cool";
        RegExPattern  = "J?";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 12) exp{n}
        RegEx = "12) Matches exactly n occurrences 'exp{n}'";
        TargetString  = "avav av avavav avavavavavav";
        RegExPattern  = "(av){2}";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 13) exp{n,}
        RegEx = "13) Matches n or more occurrences 'exp{n,}'";
        TargetString  = "avav av avavav avavavavavav";
        RegExPattern  = "(av){2,}";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 14) exp{n,m}
        RegEx = "14) Matches between n and m occurrences 'exp{n,m}'";
        TargetString  = "avav av avavav avavavavavav";
        RegExPattern  = "(av){2,2}";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 15) X|Y
        RegEx = "15) Matches X OR Y using '|'";
        TargetString  = "ERLANG is great";
        RegExPattern  = "(ERLANG|SCALA)";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 16) \w
        RegEx = "16) Matches word characters '\\w'";
        TargetString  = "Java is great";
        RegExPattern  = "(\\w)";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 17) \W
        RegEx = "17) Matches NON word characters '\\W'";
        TargetString  = "Java is great";
        RegExPattern  = "(\\W)";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 18) \s
        RegEx = "18) Matches whitespace '\\s'";
        TargetString  = "Java is\tgreat";
        RegExPattern  = "(\\s)";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 19) \S
        RegEx = "19) Matches NON whitespace '\\S'";
        TargetString  = "Java is\tgreat";
        RegExPattern  = "(\\S)";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 20) \d
        RegEx = "20) Matches digits '\\d'";
        TargetString  = "Java is Number 1 !!";
        RegExPattern  = "(\\d)";
        ReplaceString = "one";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);

        // 21) \D
        RegEx = "21) Matches NON digits '\\D'";
        TargetString  = "1a2b3";
        RegExPattern  = "(\\D)";
        ReplaceString = "JAVA";
        RegEx(RegEx, TargetString, RegExPattern, ReplaceString);
    }
}
