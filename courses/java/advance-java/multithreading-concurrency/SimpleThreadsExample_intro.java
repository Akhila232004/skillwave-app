// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: SimpleThreadsExample.java
// 🧠 Topic: Introduction to Multithreading
// Shows how two threads run side by side.

class MyThread1 extends Thread {
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Hello from Thread 1 (" + i + ")");
        }
    }
}

class MyThread2 extends Thread {
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Hi from Thread 2 (" + i + ")");
        }
    }
}

public class SimpleThreadsExample_intro {
    public static void main(String[] args) {
        MyThread1 t1 = new MyThread1();
        MyThread2 t2 = new MyThread2();

        t1.start();  // starts thread 1
        t2.start();  // starts thread 2

        System.out.println("Main program finished starting threads!");
    }
}

/*
Expected Output (order may vary):
Main program finished starting threads!
Hello from Thread 1 (1)
Hi from Thread 2 (1)
Hello from Thread 1 (2)
Hi from Thread 2 (2)
...
*/
