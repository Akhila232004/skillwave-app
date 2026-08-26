import java.lang.reflect.Method;

// A simple class with different kinds of methods
class Calculator {

    // Public method with two int parameters and an int return type
    public int add(int a, int b) {
        return a + b;
    }

    // Public method with double parameters and double return type
    public double multiply(double x, double y) {
        return x * y;
    }

    // Private method with no parameters and no return value (void)
    private void reset() {
        System.out.println("Resetting calculator...");
    }
}

public class ReflectionListMethodsExample {

    public static void main(String[] args) throws Exception {

        // Get the Class object for Calculator
        // This is the starting point for using reflection on a class.
        Class<?> cls = Calculator.class;

        // Print the full class name (with package if any)
        System.out.println("Class Name: " + cls.getName());

        // Get all methods declared in the Calculator class
        // getDeclaredMethods() returns public, protected, default, and private methods
        // (but not inherited methods from Object, etc.).
        Method[] methods = cls.getDeclaredMethods();

        System.out.println("\nDeclared Methods:");

        // Loop through each Method object and print details
        for (Method m : methods) {

            // Method name, e.g., "add", "multiply", "reset"
            String methodName = m.getName();

            // Return type, e.g., "int", "double", "void"
            String returnType = m.getReturnType().getSimpleName();

            // Parameter types, e.g., (int, int) or (double, double) or ()
            Class<?>[] paramTypes = m.getParameterTypes();

            // Start printing the method signature
            System.out.print(returnType + " " + methodName + "(");

            // Print parameter list (type1, type2, ...)
            for (int i = 0; i < paramTypes.length; i++) {
                System.out.print(paramTypes[i].getSimpleName());
                if (i < paramTypes.length - 1) {
                    System.out.print(", ");
                }
            }

            System.out.println(")");
        }
    }
}
