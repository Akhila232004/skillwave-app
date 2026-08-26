// File: StringSplitJoinExample.java
public class StringSplitJoin {
    public static void main(String[] args) {
        // Using split() method
        String sentence = "Java is fun to learn";
        String[] words = sentence.split(" ");       // Split by space
        System.out.println("After splitting:");
        for (String w : words) {
            System.out.println(w);                  // Output: Java / is / fun / to / learn
        }

        // Split using comma
        String csv = "Apple,Banana,Cherry,Dates";
        String[] fruits = csv.split(",");
        System.out.println("Second fruit: " + fruits[1]); // Output: Banana

        // Using join() method
        String joined = String.join(" ", "Learn", "Java", "Easily");
        System.out.println("Joined String: " + joined);   // Output: Learn Java Easily

        // Join using array
        String[] langs = {"C", "C++", "Java", "Python"};
        String languages = String.join(" | ", langs);
        System.out.println("Languages: " + languages);    // Output: C | C++ | Java | Python
    }
}

/*
Expected Output:
After splitting:
Java
is
fun
to
learn
Second fruit: Banana
Joined String: Learn Java Easily
Languages: C | C++ | Java | Python
*/
