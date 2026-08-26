import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.*;

import java.io.File;

public class DOMWriteXML {

    public static void main(String[] args) {
        try {
            // 1. Create DocumentBuilder
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();

            // 2. Create new empty Document
            Document doc = db.newDocument();

            // <employees>
            Element root = doc.createElement("employees");
            doc.appendChild(root);

            // <employee>
            Element emp = doc.createElement("employee");
            root.appendChild(emp);

            // <id>10</id>
            Element id = doc.createElement("id");
            id.appendChild(doc.createTextNode("10"));
            emp.appendChild(id);

            // <name>Sita</name>
            Element name = doc.createElement("name");
            name.appendChild(doc.createTextNode("Sita"));
            emp.appendChild(name);

            // 3. Write to output.xml using Transformer
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");

            DOMSource source = new DOMSource(doc);
            StreamResult result = new StreamResult(new File("output.xml"));

            transformer.transform(source, result);

            System.out.println("XML File Created Successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
