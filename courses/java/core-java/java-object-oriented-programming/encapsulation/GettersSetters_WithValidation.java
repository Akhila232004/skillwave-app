// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Getters Setters With Validatio
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Getters/Setters expose data safely and allow VALIDATION.
 * - Keep fields private
 * - Validate in setters
 * - Read via getters
 */
class Product {
    private String name;
    private double price; // must be >= 0

    public Product(String name, double price) {
        setName(name);
        setPrice(price);
    }

    // SETTERS (validate!)
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            this.name = "Unnamed";
        } else {
            this.name = name.trim();
        }
    }

    public void setPrice(double price) {
        if (price < 0) this.price = 0.0;   // enforce rule
        else this.price = price;
    }

    // GETTERS (read-only access)
    public String getName()  { return name; }
    public double getPrice() { return price; }
}

public class GettersSetters_WithValidation {
    public static void main(String[] args) {
        Product p = new Product("", -50); // invalid inputs → corrected by setters
        System.out.println(p.getName() + " @ " + p.getPrice()); // Unnamed @ 0.0

        p.setName("  Laptop  "); // trims spaces
        p.setPrice(54999.99);    // valid
        System.out.println(p.getName() + " @ " + p.getPrice()); // Laptop @ 54999.99
    }
}
