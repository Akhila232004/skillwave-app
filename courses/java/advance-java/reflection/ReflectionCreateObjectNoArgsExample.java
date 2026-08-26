// ReflectionCreateObjectNoArgsExample.java

// A simple class with a no-argument constructor
class Student {

    private String name;
    private int age;

    // No-arg constructor
    public Student() {
        this.name = "Default Student";
        this.age = 18;
    }

    // A simple method to print details
    public void showDetails() {
        System.out.println("Student Name: " + name + ", Age: " + age);
    }
}

public class ReflectionCreateObjectNoArgsExample {

    public static void main(String[] args) throws Exception {

        // 1. Get the Class object for Student
        //    This is the entry point to use reflection on Student.
        Class<?> cls = Student.class;

        // 2. Create a new instance using the no-argument constructor
        //    newInstance() is called on the Constructor obtained via getDeclaredConstructor()
        Object obj = cls.getDeclaredConstructor().newInstance();

        // 3. Call a normal method on the created object
        //    We know the object is actually a Student, so we can cast it.
        Student s = (Student) obj;
        s.showDetails();   // normal method call (not reflection)

        // (Optional) 4. You could also invoke the method via reflection:
        // Method m = cls.getDeclaredMethod("showDetails");
        // m.invoke(obj);
    }
}
