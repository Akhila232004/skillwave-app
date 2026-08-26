import java.io.*;

// 1. This class will be serialized
//    It MUST implement Serializable
class Student implements Serializable {
    // Simple fields (all are serializable types)
    String name;
    int age;
    String course;

    // Constructor to set data
    Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }
}

public class SimpleSerializationDemo {
    public static void main(String[] args) {
        try {
            // ============================================
            // STEP 1: Create an object
            // ============================================
            Student s1 = new Student("Alice", 21, "Computer Science");

            // ============================================
            // STEP 2: Serialize the object (write to file)
            // ============================================

            // FileOutputStream: points to a file where we save bytes
            FileOutputStream fileOut = new FileOutputStream("student.ser");

            // ObjectOutputStream: converts object -> bytes and writes to the file stream
            ObjectOutputStream out = new ObjectOutputStream(fileOut);

            // Actually write the object
            out.writeObject(s1);

            // Always close streams
            out.close();
            fileOut.close();

            System.out.println("Student object serialized and saved to student.ser");

            // ============================================
            // STEP 3: Deserialize the object (read from file)
            // ============================================

            // FileInputStream: opens the same file
            FileInputStream fileIn = new FileInputStream("student.ser");

            // ObjectInputStream: reads bytes and converts back to object
            ObjectInputStream in = new ObjectInputStream(fileIn);

            // readObject() returns Object, so we cast to Student
            Student s2 = (Student) in.readObject();

            in.close();
            fileIn.close();

            // ============================================
            // STEP 4: Use the deserialized object
            // ============================================

            System.out.println("Deserialized Student object:");
            System.out.println("Name  : " + s2.name);
            System.out.println("Age   : " + s2.age);
            System.out.println("Course: " + s2.course);
        } catch (Exception e) {
            // If anything goes wrong, print the error
            e.printStackTrace();
        }
    }
}
