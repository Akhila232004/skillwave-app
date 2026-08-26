// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics Upper Bounded Wildcards (? extends)
//  Author       : Team Tinitiate
// ==============================================================================


// File: UpperBound_SumExample.java
// 🧠 Topic: Upper Bounded Wildcards (? extends)
// Demonstrates reading numeric values safely using ? extends Number

import java.util.Arrays;
import java.util.List;

public class UpperBound_SumExample {

    // Generic method using upper bound: works with any subtype of Number
    public static double calculateTotal(List<? extends Number> values) {
        double total = 0;
        for (Number num : values) {
            total += num.doubleValue();  // safe read
        }
        return total;
    }

    public static void main(String[] args) {
        List<Integer> monthlySalaries = Arrays.asList(30000, 35000, 40000);
        List<Double> bonuses = Arrays.asList(2500.5, 3000.75, 1800.25);

        System.out.println("Total Monthly Salary: " + calculateTotal(monthlySalaries));
        System.out.println("Total Bonuses: " + calculateTotal(bonuses));

        // monthlySalaries.add(45000); // ❌ not allowed — cannot modify a ? extends list
        // Safe only for reading elements
    }
}

/*
Expected Output:
Total Monthly Salary: 105000.0
Total Bonuses: 7301.5
*/
