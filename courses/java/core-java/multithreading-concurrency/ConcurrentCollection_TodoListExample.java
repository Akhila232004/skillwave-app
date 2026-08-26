// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ConcurrentCollection_TodoListExample.java
// Topic: Concurrent Collections
// Demonstrates thread-safe list operations using CopyOnWriteArrayList.

import java.util.concurrent.CopyOnWriteArrayList;

public class ConcurrentCollection_TodoListExample {
    public static void main(String[] args) throws InterruptedException {
        CopyOnWriteArrayList<String> todoList = new CopyOnWriteArrayList<>();

        // Writer thread adds tasks
        Thread writer = new Thread(() -> {
            String[] tasks = {"Buy milk", "Send email", "Clean desk"};
            for (String task : tasks) {
                todoList.add(task);
                System.out.println("Added task: " + task);
                try {
                    Thread.sleep(400); // simulate delay
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        // Reader thread reads tasks periodically
        Thread reader = new Thread(() -> {
            for (int i = 0; i < 4; i++) {
                System.out.println("Current To-Do List: " + todoList);
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        writer.start();
        reader.start();

        writer.join();
        reader.join();

        System.out.println("Final To-Do List: " + todoList);
    }
}

/*
Expected Output (order may vary):
Current To-Do List: []
Added task: Buy milk
Current To-Do List: [Buy milk]
Added task: Send email
Added task: Clean desk
Current To-Do List: [Buy milk, Send email, Clean desk]
Final To-Do List: [Buy milk, Send email, Clean desk]
*/
