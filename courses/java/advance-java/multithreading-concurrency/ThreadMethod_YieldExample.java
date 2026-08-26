// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ThreadMethod_YieldExample.java
// Topic: Thread.yield()
// Demonstrates how yield() gives other threads a chance to run.

class PrintTask extends Thread {
    private String name;

    public PrintTask(String name) {
        this.name = name;
    }

    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(name + " printing step " + i);
            Thread.yield(); // suggest scheduler to switch to another thread
        }
    }
}

public class ThreadMethod_YieldExample {
    public static void main(String[] args) {
        PrintTask t1 = new PrintTask("Thread-A");
        PrintTask t2 = new PrintTask("Thread-B");

        t1.start();
        t2.start();
    }
}

/*
Expected Output (order may vary):
Thread-A printing step 1
Thread-B printing step 1
Thread-A printing step 2
Thread-B printing step 2
Thread-A printing step 3
Thread-B printing step 3
*/
