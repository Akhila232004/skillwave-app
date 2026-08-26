// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.classesobjects;

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