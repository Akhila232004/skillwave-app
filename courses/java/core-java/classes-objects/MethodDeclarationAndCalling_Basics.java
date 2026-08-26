// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================

/**
 * WHAT THIS CODE IS ABOUT:
 * ------------------------
 * How to DECLARE a method (its "signature") and how to CALL it.
 *
 * METHOD DECLARATION PARTS:
 *   [access] [returnType] methodName([parameters]) { ...body... }
 * Example below shows:
 *   - public int add(int a, int b) { ... }
 *   - public void printSum(int a, int b) { ... }
 */
class Calculator {
    // "public"  -> visible to other classes
    // "int"     -> return type (method will give back an int number)
    // "add"     -> method name
    // "(int a, int b)" -> parameters (inputs to the method)
    public int add(int a, int b) {
        int result = a + b; // add the two inputs
        return result;      // send the result back to the caller
    }

    // A void method: it does something (prints) but returns nothing.
    public void printSum(int a, int b) {
        int sum = a + b;
        System.out.println("Sum is: " + sum);
        // no "return value" because return type is void
    }
}

public class MethodDeclarationAndCalling_Basics {
    public static void main(String[] args) {
        Calculator c = new Calculator();   // create an object to use its methods

        // ---- CALLING a method that RETURNS a value ----
        int result = c.add(5, 7);          // pass arguments (5 and 7) to parameters (a and b)
        System.out.println("add returned: " + result); // 12

        // ---- CALLING a void method (no return) ----
        c.printSum(10, 20);                // prints "Sum is: 30"
    }
}
