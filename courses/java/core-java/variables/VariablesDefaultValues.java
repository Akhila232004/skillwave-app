// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Variable Default values
//  Author       : Team Tinitiate
// ==============================================================================


// File: VariablesDefaultValues.java
public class VariablesDefaultValues {
    int i;            // default 0
    boolean ok;       // default false
    String s;         // default null
    static double d;  // default 0.0 for static too

    public static void main(String[] args) {
        VariablesDefaultValues v = new VariablesDefaultValues();
        System.out.println("i : " + v.i);
        System.out.println("ok : " + v.ok);
        System.out.println("s : " + v.s);
        System.out.println("d : " + d);

        // Local variables must be initialized:
        // int local; System.out.println(local); // ❌ compile error if uncommented
    }
}
/*
OUTPUT:
i : 0
ok : false
s : null
d : 0.0
*/
