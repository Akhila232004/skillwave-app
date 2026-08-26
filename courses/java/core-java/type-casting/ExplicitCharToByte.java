// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Explicit Char To Byte
//  Author       : Team Tinitiate
// ==============================================================================


public class ExplicitCharToByte {
    public static void main(String[] args) {
        char grade = 'A';
        byte gradeByte = (byte) grade; // Unicode → byte

        System.out.println("Char value: " + grade);
        System.out.println("Explicitly converted to byte: " + gradeByte);
    }
}
