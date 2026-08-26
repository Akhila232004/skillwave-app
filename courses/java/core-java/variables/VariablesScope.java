// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Variables Scope
//  Author       : Team Tinitiate
// ==============================================================================


// File: VariablesScope.java
public class VariablesScope {
    static int version = 1; // class scope

    public static void main(String[] args) {
        int count = 3; // method scope
        for (int i = 0; i < count; i++) { // i is block-scoped
            int step = i * 10;            // block-scoped
            System.out.println("i : " + i + ", step : " + step);
        }
        System.out.println("version : " + version);
        System.out.println("count : " + count);
        // System.out.println(step); // ❌ not visible here
        // System.out.println(i);    // ❌ not visible here
    }
}
/*
OUTPUT:
i : 0, step : 0
i : 1, step : 10
i : 2, step : 20
version : 1
count : 3
*/
