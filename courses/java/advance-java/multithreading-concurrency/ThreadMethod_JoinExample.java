// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ThreadMethod_JoinExample.java
// Topic: Thread.join()
// Demonstrates waiting for another thread to finish before continuing.

class WorkerThread extends Thread {
    public void run() {
        System.out.println("Worker thread started...");
        for (int i = 1; i <= 3; i++) {
            System.out.println("Worker processing step " + i);
        }
        System.out.println("Worker thread completed!");
    }
}

public class ThreadMethod_JoinExample {
    public static void main(String[] args) throws InterruptedException {
        WorkerThread worker = new WorkerThread();
        worker.start();

        // Wait for the worker to finish before continuing
        worker.join();

        System.out.println("Main thread: Worker has finished. Now resuming main work.");
    }
}

/*
Expected Output:
Worker thread started...
Worker processing step 1
Worker processing step 2
Worker processing step 3
Worker thread completed!
Main thread: Worker has finished. Now resuming main work.
*/
