import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentCollectionExample {
    public static void main(String[] args) throws InterruptedException {

        // Create a thread-safe Map implementation: ConcurrentHashMap
        // Multiple threads can safely put/get values from this map at the same time
        ConcurrentHashMap<String, Integer> data = new ConcurrentHashMap<>();

        // Task that each thread will run
        // It will insert 3 key-value pairs into the shared 'data' map
        Runnable task = () -> {
            for (int i = 1; i <= 3; i++) {
                // Build a unique key using the thread's name and i
                String key = Thread.currentThread().getName() + "-Key" + i;

                // Store key -> value in the ConcurrentHashMap
                data.put(key, i);

                // Print which thread stored which key
                System.out.println(Thread.currentThread().getName() + " storing " + key);
            }
        };

        // Create two threads that will run the same task
        Thread t1 = new Thread(task, "Thread-A");
        Thread t2 = new Thread(task, "Thread-B");

        // Start both threads (they execute in parallel)
        t1.start();
        t2.start();

        // Wait for both threads to finish before printing final data
        t1.join();  // main thread waits until t1 is done
        t2.join();  // main thread waits until t2 is done

        // Print the final contents of the ConcurrentHashMap
        // Expected: 6 entries (3 from Thread-A, 3 from Thread-B)
        System.out.println("Final Data: " + data);
    }
}
