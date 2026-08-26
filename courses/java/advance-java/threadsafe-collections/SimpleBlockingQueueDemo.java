import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class SimpleBlockingQueueDemo {

    public static void main(String[] args) throws InterruptedException {

        // Create a BlockingQueue that can hold up to 2 integers at a time.
        // If it already has 2 items and producer tries to put another,
        // the producer will WAIT until the consumer takes something out.
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(2);

        // PRODUCER TASK:
        // This thread will put numbers 1 to 5 into the queue.
        Runnable producerTask = () -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    System.out.println("Producer: trying to put " + i);

                    // put() will:
                    // - add the element if there is space
                    // - WAIT (block) if the queue is full
                    queue.put(i);

                    System.out.println("Producer: put " + i);

                    // Sleep a bit to simulate "producing" time
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                // If thread is interrupted during sleep/put, exit gracefully
                Thread.currentThread().interrupt();
            }
        };

        // CONSUMER TASK:
        // This thread will take numbers from the queue and print them.
        Runnable consumerTask = () -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    System.out.println("Consumer: waiting to take...");

                    // take() will:
                    // - remove and return the next element if available
                    // - WAIT (block) if the queue is empty
                    int value = queue.take();

                    System.out.println("Consumer: took " + value);

                    // Sleep a bit to simulate "processing" time
                    Thread.sleep(300);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // Create one producer thread and one consumer thread
        Thread producer = new Thread(producerTask, "Producer");
        Thread consumer = new Thread(consumerTask, "Consumer");

        // Start both threads
        producer.start();
        consumer.start();

        // Wait until both finish
        producer.join();
        consumer.join();

        System.out.println("Main: finished.");
    }
}
