import java.lang.reflect.Constructor;

// A simple class with multiple constructors
class Student {

    public String name;
    public int age;

    // No-argument constructor
    public Student() {
        this.name = "Unknown";
        this.age = 0;
    }

    // Constructor with one parameter
    public Student(String name) {
        this.name = name;
        this.age = 0;
    }

    // Constructor with two parameters
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

public class ReflectionListConstructorsExample {

    public static void main(String[] args) throws Exception {

        // Get the Class object for Student
        Class<?> cls = Student.class;

        System.out.println("Class Name: " + cls.getName());

        // Get all declared constructors of the class
        // This includes public, protected, default, and private constructors.
        Constructor<?>[] constructors = cls.getDeclaredConstructors();

        System.out.println("\nDeclared Constructors:");

        // Loop through each constructor and print its parameter types
        for (Constructor<?> constructor : constructors) {

            // Constructor name (usually same as class name)
            String constructorName = constructor.getName();

            // Get parameter types of this constructor
            Class<?>[] paramTypes = constructor.getParameterTypes();

            System.out.print(constructorName + "(");

            // Print the list of parameter types
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
