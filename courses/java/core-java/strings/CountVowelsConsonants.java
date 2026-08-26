// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Strings
//  Author       : Team Tinitiate
// ==============================================================================


/**
 * Count Vowels and Consonants
 * ---------------------------
 * Counts how many vowels and consonants are in a given word.
 */
public class CountVowelsConsonants {
    public static void main(String[] args) {
        String text = "Programming";
        text = text.toLowerCase(); // make it lowercase for easy comparison
        int vowels = 0, consonants = 0;

        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);

            if (ch >= 'a' && ch <= 'z') { // only letters
                if ("aeiou".indexOf(ch) != -1)
                    vowels++;
                else
                    consonants++;
            }
        }

        System.out.println("Vowels: " + vowels);
        System.out.println("Consonants: " + consonants);
    }
}

/*
Expected output:
Vowels: 3
Consonants: 8
*/
