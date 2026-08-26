// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================


// File: Executor_EmailTaskExample.java
// Topic: Using Executor Framework
// Demonstrates a simple real-world example — sending multiple emails using a thread pool.

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class EmailTask implements Runnable {
    private String email;

    public EmailTask(String email) {
        this.email = email;
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is sending email to: " + email);
    }
}

public class Executor_EmailTaskExample {
    public static void main(String[] args) {
        // Create a thread pool with 2 threads
        ExecutorService executor = Executors.newFixedThreadPool(2);

        // Submit multiple email sending tasks
        executor.execute(new EmailTask("student1@example.com"));
        executor.execute(new EmailTask("student2@example.com"));
        executor.execute(new EmailTask("student3@example.com"));
        executor.execute(new EmailTask("student4@example.com"));

        // Shutdown the executor after tasks are completed
        executor.shutdown();
    }
}

/*
Expected Output (order may vary):

pool-1-thread-1 is sending email to: student1@example.com
pool-1-thread-2 is sending email to: student2@example.com
pool-1-thread-1 is sending email to: student3@example.com
pool-1-thread-2 is sending email to: student4@example.com
*/
