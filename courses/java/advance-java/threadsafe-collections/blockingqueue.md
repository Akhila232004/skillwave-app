# Java BlockingQueue – Thread-Safe Producer–Consumer Queue

BlockingQueue is a thread-safe queue from the java.util.concurrent package.
It is designed for communication between threads, especially in producer–consumer scenarios.

Key points:

* One or more threads put elements into the queue (producers).
* One or more threads take elements from the queue (consumers).
* If the queue is full, put() will block (wait) until space is available.
* If the queue is empty, take() will block (wait) until an element is available.
* All operations are already thread-safe; no extra synchronized is needed.

Common Implementations

* ArrayBlockingQueue – fixed-capacity, backed by an array.
* LinkedBlockingQueue – optionally bounded, backed by linked nodes.
* PriorityBlockingQueue – elements ordered by priority.

Main Methods

* put(E e): add an element, waiting if needed for space.
* take(): remove and return an element, waiting if needed for an element.
* offer(E e): try to add, returns false if full (no waiting).
* poll(): try to remove, returns null if empty (no waiting).

When to Use BlockingQueue

* When you have a producer–consumer pattern.
* When you want one thread to send work to another thread safely.
* When you don’t want to handle wait/notify manually.

Example 1 – Simple Producer and Consumer Using ArrayBlockingQueue

This example shows:

* One producer thread puts numbers 1 to 5 into the queue.
* One consumer thread takes numbers from the same queue and prints them.
* BlockingQueue handles all waiting logic for us.

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class SimpleBlockingQueueExample {

    public static void main(String[] args) throws InterruptedException {

        // Create a BlockingQueue with capacity 2
        // Only 2 elements can be inside at a time
        BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(2);

        // PRODUCER TASK:
        // Puts numbers 1 to 5 into the queue
        Runnable producerTask = () -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    System.out.println("Producer: trying to put " + i);
                    queue.put(i);  // will wait if queue is full
                    System.out.println("Producer: put " + i);
                    Thread.sleep(200); // simulate time to produce
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // CONSUMER TASK:
        // Takes 5 numbers from the queue
        Runnable consumerTask = () -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    System.out.println("Consumer: waiting to take...");
                    int value = queue.take();  // will wait if queue is empty
                    System.out.println("Consumer: took " + value);
                    Thread.sleep(300); // simulate time to process
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        Thread producer = new Thread(producerTask, "Producer-Thread");
        Thread consumer = new Thread(consumerTask, "Consumer-Thread");

        producer.start();
        consumer.start();

        producer.join();
        consumer.join();

        System.out.println("Main: Producer and Consumer finished.");
    }
}
```

Expected Output (sample, timing may vary)

Producer: trying to put 1
Producer: put 1
Consumer: waiting to take...
Consumer: took 1
Producer: trying to put 2
Producer: put 2
Producer: trying to put 3
Producer: put 3   (queue may become full here until consumer takes)
Consumer: waiting to take...
Consumer: took 2
Consumer: waiting to take...
Consumer: took 3
Producer: trying to put 4
Producer: put 4
Producer: trying to put 5
Producer: put 5
Consumer: waiting to take...
Consumer: took 4
Consumer: waiting to take...
Consumer: took 5
Main: Producer and Consumer finished.

What students should understand

* queue.put(i) will block (wait) automatically when the queue is full.
* queue.take() will block (wait) automatically when the queue is empty.
* No need for synchronized, wait(), or notify(); BlockingQueue does this internally.
* This is a classic way to connect producer and consumer threads.

Example 2 – BlockingQueue as a Simple Task Queue

This example simulates:

* One producer that creates “tasks” (simple Strings).
* Two worker threads that take tasks from the queue and “process” them.

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueTaskExample {

    public static void main(String[] args) throws InterruptedException {

        // Shared task queue with capacity 3
        BlockingQueue<String> taskQueue = new ArrayBlockingQueue<>(3);

        // PRODUCER: creates 5 tasks and puts them in the queue
        Runnable taskProducer = () -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    String task = "Task-" + i;
                    System.out.println("Producer: adding " + task);
                    taskQueue.put(task); // waits if queue is full
                    System.out.println("Producer: added " + task);
                    Thread.sleep(200); // simulate time to create next task
                }

                // After all tasks, put special "END" markers for each worker
                taskQueue.put("END");
                taskQueue.put("END");

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // CONSUMER (WORKER): keeps taking tasks until it sees "END"
        Runnable taskWorker = () -> {
            String workerName = Thread.currentThread().getName();

            try {
                while (true) {
                    String task = taskQueue.take(); // waits if queue is empty

                    if ("END".equals(task)) {
                        System.out.println(workerName + " received END, stopping.");
                        break;
                    }

                    System.out.println(workerName + " processing " + task);

                    // Simulate doing work
                    Thread.sleep(300);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        Thread producer = new Thread(taskProducer, "Producer");
        Thread worker1 = new Thread(taskWorker, "Worker-1");
        Thread worker2 = new Thread(taskWorker, "Worker-2");

        producer.start();
        worker1.start();
        worker2.start();

        producer.join();
        worker1.join();
        worker2.join();

        System.out.println("Main: All tasks processed.");
    }
}
```

Expected Output (sample, order will vary)

Producer: adding Task-1  
Producer: added Task-1  
Producer: adding Task-2  
Producer: added Task-2  
Worker-1 processing Task-1  
Producer: adding Task-3 
Producer: added Task-3
Worker-2 processing Task-2
Producer: adding Task-4  
Producer: added Task-4  
Worker-1 processing Task-3  
Producer: adding Task-5   
Producer: added Task-5    
Worker-2 processing Task-4  
Worker-1 processing Task-5  
Worker-2 received END, stopping.  
Worker-1 received END, stopping.  
Main: All tasks processed.

What students should understand

* BlockingQueue is perfect for a “task queue” between producer and workers.
* Producer puts tasks in the queue: taskQueue.put(task).
* Workers block on taskQueue.take() until a task is available.
* Using a special value like "END" is a simple way to signal workers to stop.
* No explicit synchronized, wait, or notify are needed; BlockingQueue manages the coordination.
