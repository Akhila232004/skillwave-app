// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Variables Types Demo
//  Author       : Team Tinitiate
// ==============================================================================


// File: VariablesTypesDemo.java
package com.tinitiate.corejava.variables;

public class VariablesTypesDemo {
    static String course = "Java Full Stack"; // static (class) variable
    String student;                            // instance variable

    public static void main(String[] args) {
        int batch = 2025;                      // local variable
        VariablesTypesDemo a = new VariablesTypesDemo();
        a.student = "Aarav";

        System.out.println("course : " + course);
        System.out.println("student : " + a.student);
        System.out.println("batch : " + batch);
    }
}
/*
OUTPUT:
course : Java Full Stack
student : Aarav
batch : 2025
*/
