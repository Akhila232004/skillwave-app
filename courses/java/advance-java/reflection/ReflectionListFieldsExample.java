import java.lang.reflect.Field;

// A simple class with different kinds of fields
class Person {
    private String name;   // private field
    public int age;        // public field
    protected double height; // protected field
}

public class ReflectionListFieldsExample {

    public static void main(String[] args) throws Exception {

        // Get Class object of Person
        Class<?> cls = Person.class;

        System.out.println("Class Name: " + cls.getName());

        // Get all declared fields (includes private, protected, and public)
        Field[] fields = cls.getDeclaredFields();

        System.out.println("\nDeclared Fields:");
        for (Field f : fields) {
            // Print field type and name
            System.out.println(f.getType().getSimpleName() + " " + f.getName());
        }
    }
}
