import java.lang.reflect.Field;

// A simple class with a public field
class Address {
    public String city;
}

public class ReflectionAccessPublicFieldExample {

    public static void main(String[] args) throws Exception {

        // 1. Create a normal Address object
        Address address = new Address();
        address.city = "Hyderabad";  // set directly (normal Java)
        System.out.println("Before reflection, city = " + address.city);

        // 2. Get the Class object
        Class<?> cls = Address.class;

        // 3. Get the Field object for the public field "city"
        Field cityField = cls.getField("city");  // getField works for public fields

        // 4. Read the value of the public field using reflection
        Object cityValue = cityField.get(address);  // same as address.city
        System.out.println("Using reflection, city = " + cityValue);

        // 5. Change the value of the public field using reflection
        cityField.set(address, "Bangalore");  // same as address.city = "Bangalore";

        // 6. Check the updated value
        System.out.println("After reflection update, city = " + address.city);
    }
}
