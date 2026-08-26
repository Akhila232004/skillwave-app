// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Strings
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Reverse a String
 * ----------------
 * Reads a word and prints it in reverse order.
 */
public class ReverseString {
    public static void main(String[] args) {
        String text = "HELLO";
        String reversed = "";

        // Go from last character to first
        for (int i = text.length() - 1; i >= 0; i--) {
            reversed += text.charAt(i);
        }

        System.out.println("Original: " + text);
        System.out.println("Reversed: " + reversed);
    }
}

/*
Expected output:
Original: HELLO
Reversed: OLLEO
*/
