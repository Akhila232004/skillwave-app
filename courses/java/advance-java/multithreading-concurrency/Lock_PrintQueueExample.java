// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================




// File: Lock_PrintQueueExample.java
// Topic: ReentrantLock
// Demonstrates how Lock ensures only one user can print at a time.

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class PrintQueue {
    // You can pass 'true' for a fair lock: new ReentrantLock(true)
    private final Lock lock = new ReentrantLock();

    void printDocument(String user, String document) {
        System.out.println(user + " wants to print " + document);
        lock.lock();                    // acquire the lock (waits if another thread holds it)
        try {
            System.out.println("▶ " + user + " is printing: " + document + " ...");
            // Simulate printing time
            try { Thread.sleep(1200); } catch (InterruptedException ignored) {}
            System.out.println("✅ " + user + " finished printing: " + document);
        } finally {
            lock.unlock();              // always release the lock in finally
        }
    }
}

public class Lock_PrintQueueExample {
    public static void main(String[] args) {
        PrintQueue queue = new PrintQueue();

        // Three users trying to print different documents concurrently
        Thread t1 = new Thread(() -> queue.printDocument("Alice", "Report.pdf"));
        Thread t2 = new Thread(() -> queue.printDocument("Bob", "Invoice.docx"));
        Thread t3 = new Thread(() -> queue.printDocument("Charlie", "Poster.png"));

        t1.start();
        t2.start();
        t3.start();

        // Wait for all to finish (so program doesn't exit early)
        try {
            t1.join();
            t2.join();
            t3.join();
        } catch (InterruptedException ignored) {}
    }
}
