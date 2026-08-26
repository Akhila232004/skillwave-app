import java.io.*;

// This class represents a user with a username and password
class User implements Serializable {
    String username;

    // Mark password as transient so it will NOT be saved in the file
    transient String password;

    User(String username, String password) {
        this.username = username;
        this.password = password;
    }
}

public class TransientDemo {
    public static void main(String[] args) {
        try {
            // STEP 1: Create a user object with username and password
            User user1 = new User("admin", "secret123");

            // Print original values before serialization
            System.out.println("Before serialization:");
            System.out.println("Username: " + user1.username);
            System.out.println("Password: " + user1.password);

            // STEP 2: Serialize the user object
            FileOutputStream fileOut = new FileOutputStream("user.ser");
            ObjectOutputStream out = new ObjectOutputStream(fileOut);

            out.writeObject(user1);
            out.close();
            fileOut.close();

            System.out.println("\nUser object serialized to user.ser");

            // STEP 3: Deserialize the user object
            FileInputStream fileIn = new FileInputStream("user.ser");
            ObjectInputStream in = new ObjectInputStream(fileIn);

            User user2 = (User) in.readObject();

            in.close();
            fileIn.close();

            // STEP 4: Print values after deserialization
            System.out.println("\nAfter deserialization:");
            System.out.println("Username: " + user2.username);
            System.out.println("Password: " + user2.password); // will be null
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
