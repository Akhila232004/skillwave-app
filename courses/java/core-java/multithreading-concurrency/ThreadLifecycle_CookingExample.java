// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ThreadLifecycle_CookingExample.java
// 🧠 Topic: Thread Lifecycle
// Demonstrates basic thread states using a simple "Cooking Task" analogy.

public class ThreadLifecycle_CookingExample {
    public static void main(String[] args) throws InterruptedException {

        Thread cook = new Thread(() -> {
            System.out.println(" Cook started preparing ingredients...");
            try {
                Thread.sleep(500); // Simulate preparation (TIMED_WAITING)
                System.out.println(" Cooking on the stove...");
                Thread.sleep(500); // Simulate cooking
                System.out.println(" Food is ready!");
            } catch (InterruptedException e) {
                System.out.println(" Cook was interrupted!");
            }
        });

        System.out.println(" State after creation: " + cook.getState()); // NEW

        cook.start();
        System.out.println(" State just after start(): " + cook.getState()); // RUNNABLE

        Thread.sleep(200);
        System.out.println(" State while cook is working: " + cook.getState()); // RUNNABLE or TIMED_WAITING

        Thread.sleep(600);
        System.out.println(" State after a while: " + cook.getState()); // TIMED_WAITING or RUNNABLE

        cook.join(); // Wait for completion
        System.out.println(" Final State: " + cook.getState()); // TERMINATED
    }
}

/*
Expected Output (approximate):

 State after creation: NEW
 State just after start(): RUNNABLE
 Cook started preparing ingredients...
 State while cook is working: TIMED_WAITING
 Cooking on the stove...
 Food is ready!
 Final State: TERMINATED
*/
