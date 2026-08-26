import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

public class SimpleSAXBeginnersExample {

    public static void main(String[] args) throws Exception {

        // 1. Create SAX parser
        SAXParserFactory factory = SAXParserFactory.newInstance();
        SAXParser parser = factory.newSAXParser();

        // 2. Create handler for SAX events
        DefaultHandler handler = new DefaultHandler() {

            boolean isName = false;
            boolean isCourse = false;

            // Called when a tag starts
            public void startElement(String uri, String localName, String qName, Attributes attributes) {
                if ("name".equals(qName)) {
                    isName = true;
                } else if ("course".equals(qName)) {
                    isCourse = true;
                }
            }

            // Called when text is inside a tag
            public void characters(char[] ch, int start, int length) {
                String value = new String(ch, start, length).trim();
                if (value.isEmpty()) return;

                if (isName) {
                    System.out.println("Student Name: " + value);
                    isName = false;
                } else if (isCourse) {
                    System.out.println("Course      : " + value);
                    isCourse = false;
                }
            }
        };

        // 3. Parse students.xml with this handler
        parser.parse("students.xml", handler);
    }
}
