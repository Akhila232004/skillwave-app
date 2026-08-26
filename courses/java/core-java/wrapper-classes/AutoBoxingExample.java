// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Auto Boxing Example
//  Author       : Team Tinitiate
// ==============================================================================


public class AutoBoxingExample {
    public static void main(String[] args) {
        double price = 99.99;
        Double boxedPrice = price;  // Auto-boxing

        System.out.println("Primitive double: " + price);
        System.out.println("Auto-boxed Double: " + boxedPrice);
    }
}
