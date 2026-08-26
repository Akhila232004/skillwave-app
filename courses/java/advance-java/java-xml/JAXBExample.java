import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.File;

@XmlRootElement
class Employee {
    public int id;
    public String name;

    // No-arg constructor required for JAXB
    public Employee() {}

    public Employee(int id, String name) {
        this.id = id;
        this.name = name;
    }
}

public class JAXBExample {

    public static void main(String[] args) {
        try {
            // 1. Create a Java object
            Employee emp = new Employee(101, "Asha");

            // 2. Create JAXBContext for Employee class
            JAXBContext context = JAXBContext.newInstance(Employee.class);

            // 3. Marshalling: Object -> XML
            Marshaller marshaller = context.createMarshaller();
            marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            File file = new File("employee.xml");
            marshaller.marshal(emp, file);         // write to file
            marshaller.marshal(emp, System.out);   // also print to console

            // 4. Unmarshalling: XML -> Object
            Unmarshaller unmarshaller = context.createUnmarshaller();
            Employee loaded = (Employee) unmarshaller.unmarshal(file);

            System.out.println("\nLoaded from XML: id=" + loaded.id + ", name=" + loaded.name);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
