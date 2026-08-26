// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: SynchronizedMethod_BankDepositExample.java
// Topic: Synchronized Methods
// Demonstrates how synchronization prevents inconsistent results when multiple threads access shared data.

class BankAccount {
    private int balance = 0;

    // synchronized method ensures only one thread updates at a time
    synchronized void deposit(int amount) {
        balance += amount;
        System.out.println(Thread.currentThread().getName() + " deposited ₹" + amount + 
                           " | Current Balance: ₹" + balance);
    }

    int getBalance() {
        return balance;
    }
}

public class SynchronizedMethod_BankDepositExample {
    public static void main(String[] args) throws InterruptedException {
        BankAccount account = new BankAccount();

        // Two people depositing money simultaneously
        Thread person1 = new Thread(() -> {
            for (int i = 1; i <= 3; i++) account.deposit(1000);
        }, "Person-1");

        Thread person2 = new Thread(() -> {
            for (int i = 1; i <= 3; i++) account.deposit(1000);
        }, "Person-2");

        person1.start();
        person2.start();
        person1.join();
        person2.join();

        System.out.println("Final Account Balance: ₹" + account.getBalance());
    }
}

/*
Expected Output (order may vary):

Person-1 deposited ₹1000 | Current Balance: ₹1000
Person-2 deposited ₹1000 | Current Balance: ₹2000
Person-1 deposited ₹1000 | Current Balance: ₹3000
Person-2 deposited ₹1000 | Current Balance: ₹4000
Person-1 deposited ₹1000 | Current Balance: ₹5000
Person-2 deposited ₹1000 | Current Balance: ₹6000
Final Account Balance: ₹6000
*/
