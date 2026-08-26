package com.tinitiate.corejava.strings;

// File: StringUtilityExample.java
public class StringUtility {
    public static void main(String[] args) {
        // format()
        String product = "Laptop";
        int qty = 3;
        double price = 45999.75;
        String bill = String.format("Item: %s, Quantity: %d, Price: ₹%.2f", product, qty, price);
        System.out.println(bill);  // Output: Item: Laptop, Quantity: 3, Price: ₹45999.75

        // valueOf()
        double pi = 3.14159;
        char grade = 'A';
        String piStr = String.valueOf(pi);
        String gradeStr = String.valueOf(grade);
        System.out.println(piStr);     // Output: 3.14159
        System.out.println(gradeStr);  // Output: A

        // replaceAll()
        String email = "contact@tinitiate[dot]com";
        String fixedEmail = email.replaceAll("\\[dot\\]", ".");
        System.out.println(fixedEmail);  // Output: contact@tinitiate.com

        // isEmpty() and isBlank()
        String str1 = "";
        String str2 = "   ";
        String str3 = "Java";
        System.out.println(str1.isEmpty());  // Output: true
        System.out.println(str2.isEmpty());  // Output: false
        System.out.println(str1.isBlank());  // Output: true
        System.out.println(str2.isBlank());  // Output: true
        System.out.println(str3.isBlank());  // Output: false
    }
}

/*
Expected Output:
Item: Laptop, Quantity: 3, Price: ₹45999.75
3.14159
A
contact@tinitiate.com
true
false
true
true
false
*/
