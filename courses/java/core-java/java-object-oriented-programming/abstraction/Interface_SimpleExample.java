// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Interface Simple Example
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Interface_SimpleExample
 * -----------------------
 * An interface says WHAT to do (method name), not HOW to do it.
 * A class that implements the interface provides the actual code.
 */
public class Interface_SimpleExample {
    public static void main(String[] args) {
        Greeter g = new EnglishGreeter(); // interface reference → object of a class that implements it
        g.greet();                        // calls EnglishGreeter.greet()
    }
}

/* Contract: any Greeter must have a greet() method */
interface Greeter {
    void greet();
}

/* A simple class that fulfills the Greeter contract */
class EnglishGreeter implements Greeter {
    public void greet() {
        System.out.println("Hello");
    }
}

/*
Expected output:
Hello
*/