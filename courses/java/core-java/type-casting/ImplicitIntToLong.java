// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Implicit Int To Long
//  Author       : Team Tinitiate
// ==============================================================================


public class ImplicitIntToLong {
    public static void main(String[] args) {
        int sourceInt = 500;
        long convertedLong = sourceInt; // Implicit widening

        System.out.println("Int value: " + sourceInt);
        System.out.println("Implicitly converted to long: " + convertedLong);
    }
}
