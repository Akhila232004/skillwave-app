package tinitiate.java.threadsafe.collections;

import java.util.Stack;

public class SafeStackPopExample {

    public static void main(String[] args) throws InterruptedException {

        // Create a shared Stack that will be used by multiple threads
        Stack<Integer> stack = new Stack<>();

        // Push 10 numbers (1 to 10) onto the stack
        // Stack is LIFO, so 10 will be popped first
        for (int i = 1; i <= 10; i++) {
            stack.push(i);
        }

        // This Runnable represents a "worker thread" that keeps popping numbers
        // from the shared stack until it becomes empty.
        Runnable popTask = () -> {
            String threadName = Thread.currentThread().getName();

            while (true) {
                int value;

                // IMPORTANT:
                // We synchronize on the shared stack object so that:
                // 1. The empty() check
                // 2. The pop() operation
                // happen together as one atomic step.
                //
                // Without this synchronized block, two threads could:
                // - Both see stack as "not empty"
                // - Both try to pop()
                // - Causing incorrect behavior or exceptions.
                synchronized (stack) {
                    if (stack.empty()) {
                        // If the stack is empty, exit the loop and finish the thread
                        break;
                    }

                    // Pop one element from the stack
                    value = stack.pop();
                }

                // Print which thread popped which value
                System.out.println(threadName + " popped: " + value);

                // Sleep for a short random time to simulate work
                // and to increase the chance of interleaving between threads
                try {
                    Thread.sleep((int)(Math.random() * 200));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }

            System.out.println(threadName + " finished.");
        };

        // Create three threads that will all run the same popTask
        Thread t1 = new Thread(popTask, "Popper-1");
        Thread t2 = new Thread(popTask, "Popper-2");
        Thread t3 = new Thread(popTask, "Popper-3");

        // Start all three threads
        t1.start();
        t2.start();
        t3.start();

        // Wait for all threads to finish their work
        t1.join();
        t2.join();
        t3.join();

        // After all threads have finished, the stack should be empty
        System.out.println("All elements popped. Final stack empty = " + stack.empty());
    }
}
