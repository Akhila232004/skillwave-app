// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Strings
//  Author       : Team Tinitiate
// ==============================================================================

/**
 * Find Character Frequency
 * ------------------------
 * Counts how many times each character appears in a string.
 */
public class CharacterFrequency {
    public static void main(String[] args) {
        String text = "JAVA";
        text = text.toUpperCase();

        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            int count = 0;

            // Skip counting duplicates
            if (text.indexOf(ch) != i)
                continue;

            for (int j = 0; j < text.length(); j++) {
                if (text.charAt(j) == ch)
                    count++;
            }

            System.out.println(ch + " → " + count);
        }
    }
}

/*
Expected output:
J → 1
A → 2
V → 1
*/