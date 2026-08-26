import java.lang.reflect.Method;

// A simple class with a no-argument method
class Greeter {

    public void printGreeting() {
        System.out.println("Hello from Greeter!");
    }
}

public class ReflectionInvokeNoArgMethodExample {

    public static void main(String[] args) throws Exception {

        // 1. Create a normal Greeter object
        Greeter greeter = new Greeter();

        // 2. Get the Class object for Greeter
        Class<?> cls = Greeter.class;

        // 3. Get the Method object for the method "printGreeting"
        //    No parameters, so we don’t pass any parameter types.
        Method method = cls.getDeclaredMethod("printGreeting");

        // 4. Invoke the method using reflection
        //    First argument: the object on which to call the method
        //    Second argument: (none here, because method has no parameters)
        method.invoke(greeter);
    }
}
