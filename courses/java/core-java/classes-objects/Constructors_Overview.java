// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * WHAT THIS CODE IS ABOUT (beginner-friendly)
 * -------------------------------------------
 * A *constructor* is a special method that runs when you create an object.
 * - It sets up the initial state (field values).
 * - Name is exactly the same as the class name.
 * - No return type (not even void).
 *
 * Notes:
 * - If you DON'T write any constructor, Java gives you a no-arg one automatically
 *   (called the *default* or *implicit no-arg* constructor).
 * - If you DO write any constructor, Java stops giving the automatic one.
 */
class Account {
    String holderName;
    double balance;

    // No-arg constructor (we wrote it explicitly here)
    Account() {
        // set friendly defaults
        this.holderName = "Unknown";
        this.balance = 0.0;
    }

    // Parameterized constructor (we can pass values during creation)
    Account(String holderName, double openingBalance) {
        // 'this.holderName' means the field; 'holderName' (right side) is the parameter
        this.holderName = holderName;
        this.balance = openingBalance;
    }

    void show() {
        System.out.println("Account(holder=" + holderName + ", balance=" + balance + ")");
    }
}

public class Constructors_Overview {
    public static void main(String[] args) {
        // Uses our explicit no-arg constructor
        Account a1 = new Account();                 // holder="Unknown", balance=0.0
        a1.show();

        // Uses our parameterized constructor
        Account a2 = new Account("Asha", 5000.0);   // holder="Asha", balance=5000.0
        a2.show();
    }
}
