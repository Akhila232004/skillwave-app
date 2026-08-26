// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Strings
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Check Palindrome
 * ----------------
 * A word is a palindrome if it reads the same backward and forward.
 */
public class CheckPalindrome {
    public static void main(String[] args) {
        String word = "LEVEL";
        String reversed = "";

        for (int i = word.length() - 1; i >= 0; i--) {
            reversed += word.charAt(i);
        }

        if (word.equalsIgnoreCase(reversed)) {
            System.out.println(word + " is a palindrome");
        } else {
            System.out.println(word + " is not a palindrome");
        }
    }
}

/*
Expected output:
LEVEL is a palindrome
*/
