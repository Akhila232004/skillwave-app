// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================


/**
 * WHAT THIS CODE IS ABOUT
 * -----------------------
 * 'this' refers to the *current object*.
 * Common uses:
 * 1) Distinguish fields from parameters with the same names.
 * 2) Call another constructor in the same class: this(...)
 * 3) Pass the current object to another method.
 */
class Book {
    String title;
    double price;

    // Constructor chaining: call the 2-arg constructor from the 1-arg constructor
    Book(String title) {
        this(title, 0.0);  // must be first statement
    }

    Book(String title, double price) {
        // Left side: fields (this.title/this.price); Right side: parameters
        this.title = title;     // 'this.title' is the object's field
        this.price = price;     // 'price' (right) is the parameter value
        // You can think: "put the parameter into *this* object's field"
    }

    void printMe() {
        // You can write 'this.title', but inside methods it's optional:
        System.out.println("Book: " + this.title + " @ " + this.price);
    }

    void giveTo(Printer p) {
        // Pass *this object* to some other object's method
        p.print(this);
    }
}

class Printer {
    void print(Book b) {
        System.out.println("[Printer] " + b.title + " costs " + b.price);
    }
}

public class ThisKeyword_Usage {
    public static void main(String[] args) {
        Book b1 = new Book("Clean Code");          // uses 1-arg -> chains to 2-arg with price 0.0
        Book b2 = new Book("Effective Java", 999); // uses 2-arg constructor directly

        b1.printMe();
        b2.printMe();

        Printer pr = new Printer();
        b2.giveTo(pr);   // passes 'this' (b2) into Printer.print(...)
    }
}
