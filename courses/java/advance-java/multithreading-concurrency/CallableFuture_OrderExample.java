// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: CallableFuture_OrderExample.java
// Topic: Callable & Future
// Demonstrates getting results from background order-processing tasks.

import java.util.concurrent.*;

class OrderProcessor implements Callable<String> {
    private final String orderId;

    OrderProcessor(String orderId) {
        this.orderId = orderId;
    }

    @Override
    public String call() throws Exception {
        System.out.println("Processing order: " + orderId);
        Thread.sleep(1000); // simulate time-consuming processing
        return "Order " + orderId + " processed successfully!";
    }
}

public class CallableFuture_OrderExample {
    public static void main(String[] args) throws Exception {
        ExecutorService orderService = Executors.newFixedThreadPool(2);

        // Submit multiple order-processing tasks
        Future<String> f1 = orderService.submit(new OrderProcessor("ORD101"));
        Future<String> f2 = orderService.submit(new OrderProcessor("ORD102"));
        Future<String> f3 = orderService.submit(new OrderProcessor("ORD103"));

        System.out.println("All orders submitted for processing...");

        // Get results once completed
        System.out.println(f1.get());
        System.out.println(f2.get());
        System.out.println(f3.get());

        orderService.shutdown();
        System.out.println("All orders processed!");
    }
}

/*
Expected Output (order may vary):
Processing order: ORD101
Processing order: ORD102
Processing order: ORD103
All orders submitted for processing...
Order ORD101 processed successfully!
Order ORD102 processed successfully!
Order ORD103 processed successfully!
All orders processed!
*/
