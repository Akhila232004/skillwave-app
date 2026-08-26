import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.*;
import java.io.File;

public class DOMReadXML {

    public static void main(String[] args) {

        try {
            // 1. Load the XML file
            File file = new File("employees.xml");

            // 2. Create a DocumentBuilderFactory
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();

            // 3. Use the factory to create a DocumentBuilder
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

            // 4. Parse the XML file into a Document (DOM tree in memory)
            Document doc = dBuilder.parse(file);

            // 5. Normalize the XML structure (optional, but good practice)
            doc.getDocumentElement().normalize();

            // Print the root element name: should be "employees"
            System.out.println("Root element: " + doc.getDocumentElement().getNodeName());

            // 6. Get a list of all <employee> elements
            NodeList list = doc.getElementsByTagName("employee");

            System.out.println("\nTotal employees: " + list.getLength());
            System.out.println("--------------------------------------");

            // 7. Loop through each <employee> node
            for (int i = 0; i < list.getLength(); i++) {

                // Get a single node from the list
                Node node = list.item(i);

                // Check if the node is an element node
                if (node.getNodeType() == Node.ELEMENT_NODE) {

                    // Cast Node to Element
                    Element e = (Element) node;

                    // Read text inside <id>, <name>, <salary>
                    String id = e.getElementsByTagName("id").item(0).getTextContent();
                    String name = e.getElementsByTagName("name").item(0).getTextContent();
                    String salary = e.getElementsByTagName("salary").item(0).getTextContent();

                    // Print employee info
                    System.out.println("ID     : " + id);
                    System.out.println("Name   : " + name);
                    System.out.println("Salary : " + salary);
                    System.out.println("--------------------------------------");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
