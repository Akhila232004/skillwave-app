// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================


// File: CountDownLatch_RestaurantExample.java
// Topic: CountDownLatch
// Demonstrates how one thread waits for multiple tasks to complete before proceeding.

import java.util.concurrent.CountDownLatch;

class Chef extends Thread {
    private final String dish;
    private final CountDownLatch latch;

    Chef(String dish, CountDownLatch latch) {
        this.dish = dish;
        this.latch = latch;
    }

    public void run() {
        System.out.println(dish + " preparation started...");
        try {
            Thread.sleep(1000); // simulate cooking time
        } catch (InterruptedException e) {
            System.out.println(dish + " was interrupted!");
        }
        System.out.println(dish + " is ready!");
        latch.countDown(); // signal that one dish is done
    }
}

public class CountDownLatch_RestaurantExample {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3); // 3 dishes to prepare

        // Start chef threads
        new Chef("Pizza", latch).start();
        new Chef("Pasta", latch).start();
        new Chef("Salad", latch).start();

        System.out.println("Waiter: Waiting for all dishes to be ready...");

        // Wait until all dishes are done
        latch.await();

        System.out.println("Waiter: All dishes ready! Serving to customer ");
    }
}

/*
Expected Output (order may vary):
Pizza preparation started...
Pasta preparation started...
Salad preparation started...
Waiter: Waiting for all dishes to be ready...
Pizza is ready!
Salad is ready!
Pasta is ready!
Waiter: All dishes ready! Serving to customer 
*/
