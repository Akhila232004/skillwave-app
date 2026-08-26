

import java.util.Hashtable;
import java.util.Map;

public class ThreadSafeHashtableExample {

    public static void main(String[] args) throws InterruptedException {

        // Shared Hashtable used by all threads
        // Hashtable is thread-safe: its methods are synchronized internally
        Map<String, Integer> sharedTable = new Hashtable<>();

        // This task will be run by multiple threads
        // Each thread will put 5 entries into the same shared hashtable
        Runnable writerTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 5; i++) {
                // Create a unique key for each thread and each loop
                String key = threadName + "-Key" + i;
                int value = i;

                // put() is synchronized in Hashtable → safe in multithreading
                sharedTable.put(key, value);

                System.out.println(threadName + " added: " + key + " = " + value);

                // Sleep a bit to simulate some work and allow thread interleaving
                try {
                    Thread.sleep((int)(Math.random() * 200));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Create three threads, all using the same writerTask
        Thread t1 = new Thread(writerTask, "Writer-1");
        Thread t2 = new Thread(writerTask, "Writer-2");
        Thread t3 = new Thread(writerTask, "Writer-3");

        // Start all three threads
        t1.start();
        t2.start();
        t3.start();

        // Wait for all threads to finish
        t1.join();
        t2.join();
        t3.join();

        // After all threads complete:
        // Each thread added 5 entries → total 3 * 5 = 15 entries
        System.out.println("Final size of sharedTable = " + sharedTable.size());

        // Print full content to see all key–value pairs
        System.out.println("Final content of sharedTable:");
        for (Map.Entry<String, Integer> entry : sharedTable.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}
