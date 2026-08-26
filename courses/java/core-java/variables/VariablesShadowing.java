// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Variables Shadowing
//  Author       : Team Tinitiate
// ==============================================================================


// File: VariablesShadowing.java
public class VariablesShadowing {
    int value = 10; // field

    void show() {
        int value = 20; // shadows field
        System.out.println("local value : " + value);
        System.out.println("field value : " + this.value);
    }

    public static void main(String[] args) {
        new VariablesShadowing().show();
    }
}
/*
OUTPUT:
local value : 20
field value : 10
*/
