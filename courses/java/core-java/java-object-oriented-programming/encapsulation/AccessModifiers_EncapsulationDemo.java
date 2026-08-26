// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Access Modifiers Encapsulation Demo
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Access Modifiers:
 * - public:    everywhere
 * - private:   inside this class only
 * - protected: same package + subclasses (even in other packages)
 * - (default): package-private (no keyword) — same package only
 *
 * NOTE: In real projects, package boundaries matter. Here we show patterns in one file.
 */
class LibraryBook {
    public String title;        // visible anywhere (often you'd keep fields private)
    String shelfCode;           // default/package-private: visible only in same package
    protected String condition; // visible in package + subclasses
    private boolean available;  // hidden — only this class can toggle it

    public LibraryBook(String title, String shelfCode) {
        this.title = title;
        this.shelfCode = shelfCode;
        this.condition = "GOOD";
        this.available = true;
    }

    // Public API controls access to the private 'available'
    public boolean isAvailable() { return available; }

    public void borrow() {
        if (available) available = false;
    }

    public void giveBack(String newCondition) {
        this.condition = newCondition;
        this.available = true;
    }

    // Protected helper — intended for internal use/subclasses
    protected String internalNote() {
        return "COND=" + condition + ", CODE=" + shelfCode;
    }
}

// Same-package helper can see package-private 'shelfCode'
class SamePackageHelper {
    static void printShelf(LibraryBook b) {
        System.out.println("Shelf: " + b.shelfCode); // OK: same package
    }
}

public class AccessModifiers_EncapsulationDemo {
    public static void main(String[] args) {
        LibraryBook b = new LibraryBook("Clean Code", "A1-23");
        System.out.println(b.title);            // public → OK
        // System.out.println(b.available);     // ❌ private → not allowed

        System.out.println("Available? " + b.isAvailable()); // true
        b.borrow();
        System.out.println("Available? " + b.isAvailable()); // false

        // default/package-private: accessible here (same file = same package)
        SamePackageHelper.printShelf(b);        // prints shelf code

        // protected method: accessible here because same package
        System.out.println("Note: " + b.internalNote());
    }
}
