import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamReader;
import java.io.FileReader;

public class StAXSimpleReader {

    public static void main(String[] args) {
        try {
            // Create a StAX XMLInputFactory
            XMLInputFactory factory = XMLInputFactory.newInstance();

            // Create an XMLStreamReader for the file "students.xml"
            XMLStreamReader reader =
                    factory.createXMLStreamReader(new FileReader("students.xml"));

            // Holds the name of the current XML tag
            String currentTag = "";

            // Loop through all XML events
            while (reader.hasNext()) {
                int event = reader.next();  // move to next event

                switch (event) {
                    case XMLStreamConstants.START_ELEMENT:
                        // Start of an element: store the tag name
                        currentTag = reader.getLocalName();
                        break;

                    case XMLStreamConstants.CHARACTERS:
                        // Text content inside a tag
                        String value = reader.getText().trim();
                        if (!value.isEmpty()) {
                            // Print tag name and its text value
                            System.out.println(currentTag + ": " + value);
                        }
                        break;
                }
            }

            reader.close();  // close the reader
        } catch (Exception e) {
            e.printStackTrace();  // print any exception
        }
    }
}