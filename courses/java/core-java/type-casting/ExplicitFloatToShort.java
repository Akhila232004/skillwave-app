// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Explicit Float To Short
//  Author       : Team Tinitiate
// ==============================================================================


public class ExplicitFloatToShort {
    public static void main(String[] args) {
        float temperature = 98.7f;
        short tempShort = (short) temperature; // Decimal lost

        System.out.println("Float value: " + temperature);
        System.out.println("Explicitly converted to short: " + tempShort);
    }
}