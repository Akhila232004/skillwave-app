// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Operators Expressions
//  Author       : Team Tinitiate
// ==============================================================================


public class TernaryOperator {
    public static void main(String[] args) {
        int a = 10, b = 20;

        int max = (a > b) ? a : b;
        System.out.println("Maximum number: " + max);    // 20

        int num = 7;
        String result = (num % 2 == 0) ? "Even" : "Odd";
        System.out.println(num + " is " + result);      // Odd
    }
}