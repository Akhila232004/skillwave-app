// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : IntroWithGenerics
//  Author       : Team Tinitiate
// ==============================================================================



// File: IntroWithGenerics.java  
// ✅ Extra Example — using Generics with Integer type
import java.util.ArrayList;
import java.util.List;

public class IntroWithGenericsDemo {
    public static void main(String[] args) {
        // A list that can store only Integer values
        List<Integer> numbers = new ArrayList<>();
        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        int total = 0;
        for (int n : numbers) {   // no casting needed
            total += n;
        }

        System.out.println("Numbers: " + numbers);
        System.out.println("Sum = " + total);
    }
}

/*
Expected Output:
Numbers: [10, 20, 30]
Sum = 60
*/
