// ReflectionGetClassExample.java
// Demonstrates 3 ways to get a Class object in Java.

public class ReflectionGetClassExample {

    public static void main(String[] args) throws Exception {

        // 1) Using Class.forName("fully.qualified.ClassName")
        //    Useful when you only have class name as a String (e.g., from config file).
        Class<?> cls1 = Class.forName("java.lang.String");
        System.out.println("Class 1 (Class.forName): " + cls1.getName());

        // 2) Using .class on a known type
        //    This is compile-time access to the Class object.
        Class<?> cls2 = Integer.class;
        System.out.println("Class 2 (.class): " + cls2.getName());

        // 3) Using obj.getClass() from an object instance
        //    You already have an object and want its runtime class.
        Double d = 10.5;               // an object of type Double
        Class<?> cls3 = d.getClass();
        System.out.println("Class 3 (obj.getClass): " + cls3.getName());
    }
}
