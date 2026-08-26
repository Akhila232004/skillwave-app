// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : FunctionalInterface
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * FunctionalInterfaces_SimpleExample
 * ----------------------------------
 * A functional interface has EXACTLY ONE abstract method.
 * You can use a lambda (→) to provide that method’s body inline.
 */
public class FunctionalInterfaces_SimpleExample {
    public static void main(String[] args) {
        // Lambdas implement the single abstract method 'apply'
        MathOp add = (a, b) -> a + b;
        MathOp mul = (a, b) -> a * b;

        // Use them directly
        System.out.println(add.apply(5, 3)); // 8
        System.out.println(mul.apply(5, 3)); // 15

        // Or pass them to a method (plug behavior)
        System.out.println(compute(10, 4, add)); // 14
        System.out.println(compute(10, 4, mul)); // 40
    }

    // Method that accepts any MathOp (functional interface)
    static int compute(int x, int y, MathOp op) {
        return op.apply(x, y);
    }
}

/* Functional interface: exactly one abstract method */
@FunctionalInterface
interface MathOp {
    int apply(int a, int b);
}

/*
Expected output:
8
15
14
40
*/
