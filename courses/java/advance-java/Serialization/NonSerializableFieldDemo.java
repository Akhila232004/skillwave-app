import java.io.*;

// This class does NOT implement Serializable
// We will use it as a field inside another class.
class Address {
    String city;

    Address(String city) {
        this.city = city;
    }
}

// Customer implements Serializable,
// but it has a field "address" of type Address which is NOT Serializable.
// This will cause an error when we try to serialize.
class Customer implements Serializable {
    String name;
    Address address;  // Problem: Address is not Serializable!

    Customer(String name, Address address) {
        this.name = name;
        this.address = address;
    }
}

public class NonSerializableFieldDemo {
    public static void main(String[] args) {
        try {
            // STEP 1: Create a customer with an Address
            Address addr = new Address("Mumbai");
            Customer c1 = new Customer("Rahul", addr);

            // STEP 2: Try to serialize the customer
            FileOutputStream fileOut = new FileOutputStream("customer.ser");
            ObjectOutputStream out = new ObjectOutputStream(fileOut);

            System.out.println("Trying to serialize customer...");

            // This line will throw NotSerializableException because Address is not Serializable
            out.writeObject(c1);

            out.close();
            fileOut.close();

            System.out.println("Customer object serialized successfully.");
        } catch (Exception e) {
            // We expect a NotSerializableException here
            System.out.println("Exception occurred: " + e);
        }
    }
}
