// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: SynchronizedBlock_ATMExample.java
// Topic: Synchronized Blocks
// Demonstrates synchronized block — only the critical section (transaction) is locked.

class ATM {
    void useATM(String user) {
        System.out.println(user + " entered the ATM area.");

        synchronized (this) { // only one user can do transaction at a time
            System.out.println(user + " is using the ATM...");
            try {
                Thread.sleep(1000); // simulate time taken for transaction
            } catch (InterruptedException e) {
                System.out.println(user + " was interrupted!");
            }
            System.out.println(user + " completed the transaction.");
        }

        System.out.println(user + " left the ATM.\n");
    }
}

public class SynchronizedBlock_ATMExample {
    public static void main(String[] args) {
        ATM atm = new ATM();

        Thread user1 = new Thread(() -> atm.useATM("Alice"));
        Thread user2 = new Thread(() -> atm.useATM("Bob"));
        Thread user3 = new Thread(() -> atm.useATM("Charlie"));

        user1.start();
        user2.start();
        user3.start();
    }
}

/*
Expected Output (order of users may vary, but transactions won't overlap):

Alice entered the ATM area.
Bob entered the ATM area.
Charlie entered the ATM area.
Alice is using the ATM...
Alice completed the transaction.
Alice left the ATM.

Bob is using the ATM...
Bob completed the transaction.
Bob left the ATM.

Charlie is using the ATM...
Charlie completed the transaction.
Charlie left the ATM.
*/
