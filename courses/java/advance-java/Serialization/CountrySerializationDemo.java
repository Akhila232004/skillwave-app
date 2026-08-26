import java.io.*;

// This class represents a country and will be serialized
class WorldNation implements Serializable {
    String countryName;
    String countryCapital;

    // transient: this will NOT be serialized
    transient int population;  // just for example

    void printDetails() {
        System.out.println("Country Name   : " + countryName);
        System.out.println("Country Capital: " + countryCapital);
        System.out.println("Population     : " + population);
    }
}

public class CountrySerializationDemo {
    public static void main(String[] args) {
        try {
            // STEP 1: Create an object and set its data
            WorldNation usa = new WorldNation();
            usa.countryName = "U.S.A";
            usa.countryCapital = "Washington DC";
            usa.population = 331000000; // this field is transient

            System.out.println("Before serialization:");
            usa.printDetails();

            // STEP 2: Serialize the object to a file
            FileOutputStream fileOut = new FileOutputStream("usa.ser");
            ObjectOutputStream out = new ObjectOutputStream(fileOut);

            out.writeObject(usa);
            out.close();
            fileOut.close();

            System.out.println("\nWorldNation object serialized to usa.ser");

            // STEP 3: Deserialize the object from the file
            FileInputStream fileIn = new FileInputStream("usa.ser");
            ObjectInputStream in = new ObjectInputStream(fileIn);

            WorldNation deserializedUsa = (WorldNation) in.readObject();

            in.close();
            fileIn.close();

            System.out.println("\nAfter deserialization:");
            deserializedUsa.printDetails();  // population will be 0
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
