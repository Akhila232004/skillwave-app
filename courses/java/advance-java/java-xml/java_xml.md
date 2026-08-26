# XML (Extensible Markup Language)

XML stands for **Extensible Markup Language** and is used to store and transport data in a structured, human-readable, platform-independent format.

It is widely used in:

* Configuration files
* Web services (SOAP, REST input/output)
* Data exchange between systems
* Android development
* Build tools (Maven POM.xml)

# 1. What Is XML?

XML is a markup language used to represent hierarchical data using **tags**.

### Example XML File (students.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<students>
    <student id="101">
        <name>Alice</name>
        <course>Java</course>
    </student>
    <student id="102">
        <name>Ravi</name>
        <course>Python</course>
    </student>
</students>
```

# 2. Why XML?

* Platform-independent data storage
* Human-readable
* Self-describing
* Standard for enterprise systems
* Supports attributes + nested tags
* Works with all programming languages
* Extensible structure

# 3. XML Structure

XML consists of:

- **Declaration**  
- **Root element**  
- **Child elements**  
- **Attributes**  
- **Text content**  

### Example:

```xml
<employee id="2001">
    <name>John</name>
    <salary>50000</salary>
</employee>
```

# 4. XML vs JSON 

| XML                                 | JSON                    |
| ----------------------------------- | ----------------------- |
| Verbose, tag-based                  | Lightweight, key-value  |
| Hierarchy using tags                | Hierarchy using objects |
| Supports attributes                 | No attributes           |
| Used in enterprise apps             | Used in web APIs        |
| Requires parsing using DOM/SAX/StAX | Easy to parse           |

# 5. How Java Works With XML

Java provides several ways to read/write XML:

### **XML Parsing Techniques in Java**

- **DOM Parser**  
- **SAX Parser**  
- **StAX Parser**  
- **JAXB (Java Architecture for XML Binding)**


# 6. DOM Parser (Document Object Model)

DOM loads the **entire XML** into memory as a tree.

### Use When:

✔ XML is small → easy to work with  
❌ Not good for very large XML files

### **DOM Parser – Pros & Cons**

| Feature        | ✔Pros                                                                         |  Cons                                                                  |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Memory Usage   | Easy to access and modify the full document structure once loaded              | Uses **more memory** because it loads the **entire XML file** into RAM  |
| Navigation     | Allows **random access** → you can move forward, backward, or jump to any node | Not suitable for extremely large XML files                              |
| Editing        | Supports **adding, removing, or updating** nodes                               | Complex structure may lead to slower processing                         |
| Learning Curve | Easy to understand because XML becomes a **tree structure**                    | Requires more boilerplate code compared to SAX                          |
| Use Case       | Great for **configuration files, small to medium XML, and editing XML**        | Not the best choice for **streaming or large real-time XML processing** |



## Example: Reading XML Using DOM Parser

### XML File: employees.xml

```xml
<employees>
    <employee>
        <id>1</id>
        <name>Asha</name>
        <salary>45000</salary>
    </employee>

    <employee>
        <id>2</id>
        <name>Rahul</name>
        <salary>55000</salary>
    </employee>
</employees>
```

### Java Code: DOM Parser Example

```java
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.File;

public class DOMReadXML {
    public static void main(String[] args) {
        try {
            File file = new File("employees.xml");

            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(file);

            doc.getDocumentElement().normalize();
            NodeList list = doc.getElementsByTagName("employee");

            for (int i = 0; i < list.getLength(); i++) {
                Node node = list.item(i);

                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element e = (Element) node;

                    System.out.println("ID : " + e.getElementsByTagName("id").item(0).getTextContent());
                    System.out.println("Name : " + e.getElementsByTagName("name").item(0).getTextContent());
                    System.out.println("Salary : " + e.getElementsByTagName("salary").item(0).getTextContent());
                    System.out.println("--------------------------------------");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## 7. Writing XML Using DOM

```java
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.*;

import java.io.File;

public class DOMWriteXML {
    public static void main(String[] args) {
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = dbf.newDocumentBuilder();

            Document doc = db.newDocument();

            Element root = doc.createElement("employees");
            doc.appendChild(root);

            Element emp = doc.createElement("employee");
            root.appendChild(emp);

            Element id = doc.createElement("id");
            id.appendChild(doc.createTextNode("10"));
            emp.appendChild(id);

            Element name = doc.createElement("name");
            name.appendChild(doc.createTextNode("Sita"));
            emp.appendChild(name);

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
```

# 8. SAX Parser (Event-Based Parsing)

SAX reads XML **sequentially**, triggering events for:

* startElement
* characters
* endElement

✔ Faster  
✔ Memory-efficient  
❌ Cannot modify XML  
❌ No random access

Used in:
Large XML files, streaming applications.
### SAX Parsing Example 
### **SAX Parser – Pros & Cons**

| Feature       |  Pros                                                                         | Cons                                                                                                   |
| ------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Memory Usage  | Very **low memory usage** because it does **not load the entire XML** into RAM | Cannot access or revisit previous elements once moved forward (no random access)                         |
| Speed         | Faster than DOM for large XML documents because it processes node-by-node      | Processing logic can become harder for complex nested XML                                                |
| Parsing Style | **Event-based** parsing makes it efficient for streaming                       | Programmer must write handler methods (startElement, characters, endElement), which increases complexity |
| Modifying XML | Good for **reading large XML**, especially in streaming scenarios              | **Cannot modify** XML or insert/delete nodes                                                             |
| Use Case      | Best for **large XML files, streamed data, log files, server events**          | Not suitable when the XML structure needs to be updated or stored fully in memory                        |

### XML File (`students.xml`)

```xml
<students>
    <student>
        <name>Alice</name>
        <course>Java</course>
    </student>
    <student>
        <name>Ravi</name>
        <course>Python</course>
    </student>
</students>
```

### Simple SAX Reader 

```java
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

public class SimpleSAXBeginnersExample {

    public static void main(String[] args) throws Exception {

        // Create the SAX Parser
        SAXParserFactory factory = SAXParserFactory.newInstance();
        SAXParser parser = factory.newSAXParser();

        // Handler: tells SAX what to do when reading XML
        DefaultHandler handler = new DefaultHandler() {

            boolean isName = false;
            boolean isCourse = false;

            // Runs when a tag starts (ex: <name>, <course>)
            public void startElement(String uri, String localName, String qName, Attributes attributes) {
                if (qName.equals("name")) {
                    isName = true;
                }
                if (qName.equals("course")) {
                    isCourse = true;
                }
            }

            // Runs when there is text inside a tag
            public void characters(char[] ch, int start, int length) {
                String value = new String(ch, start, length).trim();

                if (isName && !value.isEmpty()) {
                    System.out.println("Student Name: " + value);
                    isName = false; // reset
                }

                if (isCourse && !value.isEmpty()) {
                    System.out.println("Course: " + value);
                    isCourse = false; // reset
                }
            }
        };

        // Tell SAX to read the file using the handler
        parser.parse("students.xml", handler);
    }
}
```
### Short Explanation

| Concept                              | Meaning                                    |
| ------------------------------------ | ------------------------------------------ |
| SAX reads XML **one line at a time** | It does not load full XML into memory      |
| It triggers **events**               | Example: when a tag starts or text appears |
| Good for **large XML files**         | Uses very low memory                       |
| Cannot modify the XML                | It is only for reading (streaming)         |



# 9. StAX Parser (Streaming API for XML)

StAX is like SAX but:

* Programmer controls the cursor
* Pull-based API
* Good for large XML processing

### **StAX Parser – Pros & Cons**

| Feature           | Pros                                                                                                        | Cons                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Memory Usage      | Low memory usage since it reads XML **one event at a time** (similar to SAX)                                  | Still not ideal for extremely large modification-heavy XML tasks               |
| Parsing Style     | **Pull-based model** → the program controls when to read the next event (more flexible than SAX)              | More code required compared to JAXB for object mapping                         |
| Read & Write      | Supports **both reading and writing** XML (SAX only reads)                                                    | Writing XML manually can be verbose and requires careful handling              |
| Control Over Data | Can move forward or backward selectively, making it efficient for stream-based logic                          | No automatic data binding — programmer must manually parse nodes               |
| Use Case          | Best for **large XML processing**, streaming APIs, messaging systems, and scenarios requiring partial parsing | Not ideal if you need the entire XML structure in memory (DOM better for that) |

### **Example: Reading XML Using StAX Parser**

#### **Sample XML File (`students.xml`)**

```xml
<students>
    <student>
        <name>Alice</name>
        <course>Java</course>
    </student>
    <student>
        <name>Ravi</name>
        <course>Python</course>
    </student>
</students>
```

---

### **Java Program (StAX Reader Example)**

```java
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamReader;
import java.io.FileReader;

public class StAXSimpleReader {

    public static void main(String[] args) {
        try {
            // Create StAX parser factory
            XMLInputFactory factory = XMLInputFactory.newInstance();

            // Create reader for XML file
            XMLStreamReader reader = factory.createXMLStreamReader(new FileReader("students.xml"));

            String currentTag = "";

            // Loop through events
            while (reader.hasNext()) {
                int event = reader.next();

                switch (event) {

                    // When a tag starts (like <name>, <course>, <student>)
                    case XMLStreamConstants.START_ELEMENT:
                        currentTag = reader.getLocalName();  // store tag name
                        break;

                    // When text content appears between tags
                    case XMLStreamConstants.CHARACTERS:
                        String value = reader.getText().trim();

                        // Ignore empty whitespace values
                        if (!value.isEmpty()) {
                            System.out.println(currentTag + ": " + value);
                        }
                        break;
                }
            }

            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

# 10. JAXB — Marshalling & Unmarshalling

JAXB converts:

✔ Java object → XML (**marshalling**)  
✔ XML → Java object (**unmarshalling**)  

### Example:

```java
@XmlRootElement
class Employee {
    public int id;
    public String name;
}
```

JAXB is widely used in SOAP, enterprise applications.

### **JAXB – Pros & Cons**

| Feature         |  Pros                                                                                           | Cons                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Ease of Use     | Very **easy to work with** because it converts XML ↔ Java objects automatically (Object Mapping) | Requires XML structure to match Java class structure (schema-dependent)                 |
| Read & Write    | Supports both **Marshalling (Object → XML)** and **Unmarshalling (XML → Object)**                | Changes in XML structure require modifying the Java class                               |
| Code Simplicity | Less parsing code — works like serialization → great for enterprise applications                 | Abstracts parsing details, meaning less control over low-level XML structure            |
| Performance     | Good for medium-sized XML files; faster than DOM in many cases                                   | Not suitable for extremely large XML because it still maps everything into objects      |
| Use Case        | Ideal for **SOAP services, config files, Spring/Hibernate frameworks, enterprise integration**   | Not ideal for **streaming, partial reading, or very large XML files** (StAX/SAX better) |
