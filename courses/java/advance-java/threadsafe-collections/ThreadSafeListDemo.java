import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ThreadSafeListDemo {

    public static void main(String[] args) throws InterruptedException {

        // Create a normal ArrayList and wrap it using Collections.synchronizedList
        // This makes the list "thread-safe" for basic operations (add, remove, etc.).
        // Multiple threads can safely add to this list.
        List<String> messages = Collections.synchronizedList(new ArrayList<>());

        // This is the task that each thread will run.
        // It will add 15 messages to the shared 'messages' list.
        Runnable writerTask = () -> {
            // Get the name of the current thread (e.g., "Writer-1")
            String threadName = Thread.currentThread().getName();

            // Loop 15 times and add messages to the list
            for (int i = 1; i <= 15; i++) {
                String msg = threadName + " - message " + i;

                // Add message to the shared list
                // Because 'messages' is a synchronizedList, this add() is thread-safe.
                messages.add(msg);

                // Print what we just added
                System.out.println("Added: " + msg);

                // Sleep for a random short time to simulate work
                // and to mix up the order of execution between threads
                try {
                    Thread.sleep((int)(Math.random() * 200)); // 0–199 ms random delay
                } catch (InterruptedException e) {
                    // If the thread is interrupted, set its interrupted status again
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Create three threads that all run the same writerTask
        Thread t1 = new Thread(writerTask, "Writer-1");
        Thread t2 = new Thread(writerTask, "Writer-2");
        Thread t3 = new Thread(writerTask, "Writer-3");

        // Start all three threads (they run in parallel)
        t1.start();
        t2.start();
        t3.start();

        // Wait for all three threads to finish before continuing
        // join() makes the main thread wait for t1, t2, t3 to complete.
        t1.join();
        t2.join();
        t3.join();

        // When iterating or doing multi-step operations on a synchronizedList,
        // we must synchronize on the list object to avoid concurrent modification issues.
        synchronized (messages) {
            // Now safely read the final size of the list
            System.out.println("Final messages size: " + messages.size());
        }
    }
}