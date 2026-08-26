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
 * *Access modifiers* control "who can see/use" a class, field, or method.
 *
 * - public:    visible from anywhere
 * - private:   visible only inside the same class
 * - protected: visible in the same package + in subclasses (even in other packages)
 * - (default): (aka package-private) visible only inside the same package
 *
 * Below we demonstrate common patterns in one file. In real projects, classes live
 * in packages and separate files.
 */
class BankAccount {
    public String accountNumber;     // public: anyone can read (not always wise for real apps)
    private double balance;          // private: only this class can access directly
    String branchCode;               // default (package-private): same package only
    protected String accountType;    // protected: same package OR subclasses elsewhere

    // public constructor: can be called from anywhere
    public BankAccount(String accountNumber, String branchCode, String accountType) {
        this.accountNumber = accountNumber;
        this.branchCode = branchCode;
        this.accountType = accountType;
        this.balance = 0.0; // start with zero
    }

    // public method to deposit (anyone can call)
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;  // allowed: inside same class
        }
    }

    // public method to withdraw
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }

    // public "getter" lets outsiders read balance safely (but not modify)
    public double getBalance() {
        return balance; // allowed: inside same class
    }

    // protected method: visible within package + subclasses
    protected String internalCategory() {
        return (balance >= 10000) ? "PRIME" : "STANDARD";
    }
}

// Same-package helper class (no explicit modifier → default/package-private)
class BranchReport {
    // Can see 'branchCode' because it's package-private and we're in same package.
    static void printBranch(BankAccount acc) {
        System.out.println("Branch code (same package) = " + acc.branchCode);
    }
}

public class AccessModifiers_Demo {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("AC123", "HYD-01", "SAVINGS");
        acc.deposit(12000);

        // public field: accessible
        System.out.println("Account # = " + acc.accountNumber);

        // private field: NOT accessible directly (uncomment to see compile error)
        // System.out.println(acc.balance); // ❌ private

        // read via public getter (correct way)
        System.out.println("Balance = " + acc.getBalance());

        // default (package-private) field: accessible here because same package
        BranchReport.printBranch(acc);

        // protected method: accessible here because same package
        System.out.println("Category (same package) = " + acc.internalCategory());
    }
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * CROSS-PACKAGE PROTECTED EXAMPLE (put this in another file under a different package)
 * File: src/other/ExtendedAccount.java
 * ──────────────────────────────────────────────────────────────────────────────
 * package other;
 * import your.package.name.BankAccount;
 *
 * // Subclass in a different package
 * public class ExtendedAccount extends BankAccount {
 *     public ExtendedAccount(String n, String b, String t) {
 *         super(n, b, t);
 *     }
 *
 *     void demo() {
 *         // protected is accessible here because we are a SUBCLASS (even in other package)
 *         String cat = internalCategory(); // ✅ OK
 *
 *         // But default (package-private) is NOT accessible across packages:
 *         // System.out.println(branchCode); // ❌ NOT OK: different package, not visible
 *     }
 * }
 */
