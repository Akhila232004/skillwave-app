// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ThreadMethod_SleepExample.java
// Topic: Thread.sleep()
// Demonstrates pausing a thread to simulate time delay (like steps in a process).

class ThreadMethod_SleepExample {
    public static void main(String[] args) {
        System.out.println("Starting countdown...");

        for (int i = 3; i >= 1; i--) {
            System.out.println("Countdown: " + i);
            try {
                Thread.sleep(1000); // wait for 1 second between numbers
            } catch (InterruptedException e) {
                System.out.println("Countdown interrupted!");
            }
        }

        System.out.println("Go!");
    }
}

/*
Expected Output (1-second delay between each line):

Starting countdown...
Countdown: 3
Countdown: 2
Countdown: 1
Go!
*/
