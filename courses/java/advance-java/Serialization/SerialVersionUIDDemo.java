import java.io.*;

// This class has a serialVersionUID
// It helps control compatibility of serialized data across versions.
class Employee implements Serializable {

    // Explicit serialVersionUID (any long number you choose)
    private static final long serialVersionUID = 1L;

    String name;
    double salary;

    Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    void printDetails() {
        System.out.println("Employee Name  : " + name);
        System.out.println("Employee Salary: " + salary);
    }
}

public class SerialVersionUIDDemo {
    public static void main(String[] args) {
        try {
            // STEP 1: Create an employee
            Employee e1 = new Employee("John", 50000.0);

            // STEP 2: Serialize the employee
            FileOutputStream fileOut = new FileOutputStream("employee.ser");
            ObjectOutputStream out = new ObjectOutputStream(fileOut);

            out.writeObject(e1);
            out.close();
            fileOut.close();

            System.out.println("Employee object serialized to employee.ser\n");

            // STEP 3: Deserialize the employee
            FileInputStream fileIn = new FileInputStream("employee.ser");
            ObjectInputStream in = new ObjectInputStream(fileIn);

            Employee e2 = (Employee) in.readObject();

            in.close();
            fileIn.close();

            // STEP 4: Print the deserialized employee details
            System.out.println("Deserialized Employee:");
            e2.printDetails();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
