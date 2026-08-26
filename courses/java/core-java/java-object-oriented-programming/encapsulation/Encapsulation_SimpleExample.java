// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Encapsulation Simple Example
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Simple Encapsulation Example (Beginner-friendly)
 * ------------------------------------------------
 * Idea: Keep data PRIVATE and expose a SMALL, SAFE API.
 * - 'balance' is private: outside code can't change it directly.
 * - We modify it only through 'deposit' and 'withdraw' which enforce rules.
 */
class BankAccount {
    // Hidden data (private) — cannot be touched directly from outside
    private double balance;

    // Constructor: set starting balance (negative opening becomes 0)
    public BankAccount(double openingBalance) {
        balance = (openingBalance < 0) ? 0 : openingBalance;
    }

    // Public "read-only" access to the current balance
    public double getBalance() {
        return balance;
    }

    // Public, safe way to add money (ignore invalid amounts)
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount; // only valid deposits can change internal state
        }
    }

    // Public, safe way to remove money (only if enough funds)
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;            // success
        }
        return false;               // failed (invalid or insufficient funds)
    }
}

public class Encapsulation_SimpleExample {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount(1000);           // start with ₹1000
        System.out.println("Balance: " + acc.getBalance()); // 1000.0

        acc.deposit(500);                                   // +₹500
        System.out.println("Balance: " + acc.getBalance()); // 1500.0

        boolean ok = acc.withdraw(2000);                    // try to overdraw → blocked
        System.out.println("Withdraw 2000 ok? " + ok);      // false
        System.out.println("Balance: " + acc.getBalance()); // still 1500.0

        // ❌ Not allowed: balance is private (prevents invalid states)
        // acc.balance = 999999; // <- compile error
    }
}

/*
Expected output (approx):
Balance: 1000.0
Balance: 1500.0
Withdraw 2000 ok? false
Balance: 1500.0
*/
