import java.lang.reflect.Method;

// A simple class with a method that has parameters and a return value
class Calculator {

    public int add(int a, int b) {
        return a + b;
    }
}

public class ReflectionInvokeMethodWithArgsExample {

    public static void main(String[] args) throws Exception {

        // 1. Create a normal Calculator object
        Calculator calc = new Calculator();

        // 2. Get the Class object for Calculator
        Class<?> cls = Calculator.class;

        // 3. Get the Method object for "add"
        //    "add" method takes two int parameters, so we pass int.class, int.class
        Method addMethod = cls.getDeclaredMethod("add", int.class, int.class);

        // 4. Invoke the method using reflection
        //    First argument: the object on which to call the method (calc)
        //    Second argument: the actual parameters (10, 20)
        Object result = addMethod.invoke(calc, 10, 20);

        // 5. The result is returned as an Object, so we cast it to int
        int sum = (int) result;

        System.out.println("Result of add(10, 20) = " + sum);
    }
}
