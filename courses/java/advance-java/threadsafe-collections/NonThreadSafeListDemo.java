import java.util.ArrayList;
import java.util.List;

public class NonThreadSafeListDemo {

    public static void main(String[] args) throws InterruptedException {

        // Create a normal (non-thread-safe) ArrayList
        List<String> messages = new ArrayList<>();

        // Task to be executed by each thread
        Runnable writerTask = () -> {
            String threadName = Thread.currentThread().getName(); // get current thread name
            for (int i = 1; i <= 15; i++) {
                String msg = threadName + " - message " + i; // build message text
                messages.add(msg);  // add message to shared list (not thread-safe)
                System.out.println("Added: " + msg); // print added message

                try {
                    Thread.sleep((int)(Math.random() * 200)); // random delay
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt(); // restore interrupt status
                }
            }
        };

        // Create three threads using the same task
        Thread t1 = new Thread(writerTask, "Writer-1");
        Thread t2 = new Thread(writerTask, "Writer-2");
        Thread t3 = new Thread(writerTask, "Writer-3");

        t1.start(); // start first thread
        t2.start(); // start second thread
        t3.start(); // start third thread

        t1.join();  // wait for first thread to finish
        t2.join();  // wait for second thread to finish
        t3.join();  // wait for third thread to finish

        // Print total number of messages added to the list
        System.out.println("Final messages size: " + messages.size());
    }
}