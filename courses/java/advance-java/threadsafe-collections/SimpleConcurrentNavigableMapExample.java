import java.util.Map;
import java.util.concurrent.ConcurrentNavigableMap;
import java.util.concurrent.ConcurrentSkipListMap;

public class SimpleConcurrentNavigableMapExample {

    public static void main(String[] args) throws InterruptedException {

        // Thread-safe, sorted map: keys will always be in ascending order
        ConcurrentNavigableMap<Integer, String> students =
                new ConcurrentSkipListMap<>();

        // Thread 1 adds some students with roll numbers 1, 3, 5
        Runnable writerTask1 = () -> {
            students.put(1, "Alice");
            System.out.println("Writer-1 put: 1 -> Alice");

            sleep(100);

            students.put(3, "Charlie");
            System.out.println("Writer-1 put: 3 -> Charlie");

            sleep(100);

            students.put(5, "Eve");
            System.out.println("Writer-1 put: 5 -> Eve");
        };

        // Thread 2 adds students with roll numbers 2, 4, 6
        Runnable writerTask2 = () -> {
            students.put(2, "Bob");
            System.out.println("Writer-2 put: 2 -> Bob");

            sleep(100);

            students.put(4, "David");
            System.out.println("Writer-2 put: 4 -> David");

            sleep(100);

            students.put(6, "Frank");
            System.out.println("Writer-2 put: 6 -> Frank");
        };

        Thread t1 = new Thread(writerTask1, "Writer-1");
        Thread t2 = new Thread(writerTask2, "Writer-2");

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        // Print final map – keys will be sorted: 1,2,3,4,5,6
        System.out.println("\nFinal students map (sorted by roll number):");
        for (Map.Entry<Integer, String> entry : students.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }

        System.out.println("\nFirst roll number: " + students.firstKey());
        System.out.println("Last roll number: " + students.lastKey());
    }

    // Helper method for small delay
    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}