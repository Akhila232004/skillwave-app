import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SimpleConcurrentMapDemo {

    public static void main(String[] args) throws InterruptedException {

        // Create a shared, thread-safe ConcurrentHashMap
        Map<String, Integer> sharedMap = new ConcurrentHashMap<>();

        // Task that each thread will execute
        Runnable writerTask = () -> {
            String threadName = Thread.currentThread().getName(); // get current thread name

            for (int i = 1; i <= 3; i++) {
                String key = threadName + "-Key" + i; // build key using thread name and index
                int value = i;                         // value is just the loop index

                sharedMap.put(key, value);             // store key–value pair in the map

                System.out.println(threadName + " put: " + key + " = " + value); // log action

                try {
                    Thread.sleep(100);                 // small delay to show interleaving
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // restore interrupt flag
                }
            }
        };

        // Create two threads that use the same task
        Thread t1 = new Thread(writerTask, "Writer-1");
        Thread t2 = new Thread(writerTask, "Writer-2");

        t1.start(); // start first thread
        t2.start(); // start second thread

        t1.join();  // wait for first thread to finish
        t2.join();  // wait for second thread to finish

        // Print final size of the map (expected 6 entries)
        System.out.println("Final size of sharedMap = " + sharedMap.size());

        // Print all key–value pairs in the map
        System.out.println("Final content of sharedMap:");
        for (Map.Entry<String, Integer> entry : sharedMap.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}
