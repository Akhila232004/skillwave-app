import java.util.Vector;

public class SimpleThreadSafeVectorExample {

    public static void main(String[] args) throws InterruptedException {

        // One shared Vector for all threads
        Vector<String> names = new Vector<>();

        // Task: each thread adds 3 names into the same Vector
        Runnable addNamesTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 3; i++) {
                String value = threadName + " - Name " + i;

                // add() is synchronized inside Vector → thread-safe
                names.add(value);

                System.out.println("Added: " + value);

                try {
                    Thread.sleep(100); // small delay to see mixing of output
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Two threads sharing the same Vector
        Thread t1 = new Thread(addNamesTask, "Thread-1");
        Thread t2 = new Thread(addNamesTask, "Thread-2");

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        // After both threads finish, each added 3 names → total 6
        System.out.println("Final size of names Vector: " + names.size());

        // Print all names
        System.out.println("All names in Vector:");
        for (String n : names) {
            System.out.println(n);
        }
    }
}
