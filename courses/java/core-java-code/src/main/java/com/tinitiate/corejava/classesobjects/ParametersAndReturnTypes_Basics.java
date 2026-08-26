// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.classesobjects;

/**
 * WHAT THIS CODE IS ABOUT:
 * ------------------------
 * How PARAMETERS (inputs) and RETURN TYPES (outputs) work in methods.
 *
 * KEY IDEAS:
 * - Parameters let you give data to a method.
 * - The RETURN TYPE tells you what kind of value comes back (or "void" for none).
 * - We'll show common return types: void, int, double, boolean, String.
 */
class OrderUtils {
    // void: does something (prints) but does NOT return a value
    void printOrderId(String orderId) {
        System.out.println("Order ID = " + orderId);
    }

    // int: returns an int (e.g., quantity * unitPrice rounded down)
    int totalItems(int[] quantities) {
        int sum = 0;
        for (int q : quantities) {
            sum += q; // add each element in the array
        }
        return sum;   // give the sum back
    }

    // double: returns a decimal number (e.g., total price after discount)
    double applyDiscount(double price, double discountPercent) {
        // discountPercent like 10.0 means 10%
        double discount = price * (discountPercent / 100.0);
        double finalPrice = price - discount;
        return finalPrice;
    }

    // boolean: returns true/false (e.g., for validation)
    boolean isAdult(int age) {
        return age >= 18; // true if 18 or older, otherwise false
    }

    // String: returns text (e.g., formatted label)
    String formatLabel(String name, int qty) {
        return name + " x " + qty;
    }
}

public class ParametersAndReturnTypes_Basics {
    public static void main(String[] args) {
        OrderUtils u = new OrderUtils();

        // ---- void example ----
        u.printOrderId("ORD-1001"); // prints a message; no value returned

        // ---- int example (sum items) ----
        int total = u.totalItems(new int[]{2, 3, 5}); // 2+3+5 = 10
        System.out.println("Total items = " + total);

        // ---- double example (apply discount) ----
        double finalPrice = u.applyDiscount(1000.0, 15.0); // 15% off -> 850.0
        System.out.println("Final price = " + finalPrice);

        // ---- boolean example (validation) ----
        boolean ok = u.isAdult(20); // true
        System.out.println("Is adult? " + ok);

        // ---- String example (formatted text) ----
        String label = u.formatLabel("Notebook", 3);
        System.out.println("Label: " + label); // "Notebook x 3"
    }
}
