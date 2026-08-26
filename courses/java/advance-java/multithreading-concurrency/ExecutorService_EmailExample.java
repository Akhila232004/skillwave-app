// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ExecutorService_EmailExample.java
// Topic: ExecutorService (Thread Pool)
// Demonstrates how a thread pool can run multiple tasks (like sending emails) concurrently.

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class EmailTask implements Runnable {
    private final String recipient;

    EmailTask(String recipient) {
        this.recipient = recipient;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() +
                " → Sending email to: " + recipient);
        try {
            Thread.sleep(1000); // simulate time taken to send email
        } catch (InterruptedException e) {
            System.out.println("Email sending interrupted for: " + recipient);
        }
        System.out.println(Thread.currentThread().getName() +
                " → Email sent successfully to: " + recipient);
    }
}

public class ExecutorService_EmailExample {
    public static void main(String[] args) {
        // Create a thread pool with 2 threads
        ExecutorService emailService = Executors.newFixedThreadPool(2);

        // Submit multiple email tasks
        emailService.execute(new EmailTask("alice@example.com"));
        emailService.execute(new EmailTask("bob@example.com"));
        emailService.execute(new EmailTask("charlie@example.com"));
        emailService.execute(new EmailTask("diana@example.com"));

        // Shutdown after all tasks complete
        emailService.shutdown();

        System.out.println("All email tasks submitted.");
    }
}

/*
Expected Output (order may vary):
All email tasks submitted.
pool-1-thread-1 → Sending email to: alice@example.com
pool-1-thread-2 → Sending email to: bob@example.com
pool-1-thread-1 → Email sent successfully to: alice@example.com
pool-1-thread-2 → Email sent successfully to: bob@example.com
pool-1-thread-1 → Sending email to: charlie@example.com
pool-1-thread-2 → Sending email to: diana@example.com
pool-1-thread-1 → Email sent successfully to: charlie@example.com
pool-1-thread-2 → Email sent successfully to: diana@example.com
*/
