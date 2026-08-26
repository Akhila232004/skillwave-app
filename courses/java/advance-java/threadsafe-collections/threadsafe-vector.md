# Java Vector – Thread-Safe List

Vector is a legacy List implementation in Java. It is similar to ArrayList, but all its methods are synchronized, so it is thread-safe.

Because of this, multiple threads can safely add, remove and read elements from the same Vector instance without corrupting its internal state.

### Key Characteristics

* Implements List (ordered collection of elements).
* Uses an internal array to store elements (like ArrayList).
* All public methods are synchronized → thread-safe for individual operations.
* Slower than ArrayList in single-threaded code due to synchronization overhead.
* Considered legacy; for new code, ArrayList (single-threaded) or concurrent collections are preferred.

### Common Methods

* `add(E element)` – adds an element at the end.
* g`et(int index)`– returns element at the given index.
* `remove(int index)` – removes element at the given index.
* `size()` – returns the number of elements.
* `isEmpty()` – checks if the Vector is empty.
* `clear()` – removes all elements.

### When to Use Vector

* In older/legacy applications where Vector is already used.
* When you need a simple thread-safe list and do not want to manage synchronization manually.
* When multiple threads will add or read elements, and performance is not critical.

For high-performance concurrent code, prefer concurrent collections (like CopyOnWriteArrayList or other structures in java.util.concurrent).

**Example 1**  – Basic Vector Usage (Single Thread)

This example shows simple use of Vector with a single thread: adding, reading, and removing elements.

```java
package tinitiate.java.threadsafe.collections;

import java.util.Vector;

public class SimpleVectorExample {

    public static void main(String[] args) {

        // Create a Vector of Strings
        Vector<String> students = new Vector<>();

        // Add elements to the Vector
        students.add("Alice");
        students.add("Bob");
        students.add("Charlie");

        System.out.println("Students list: " + students);

        // Get element by index
        String firstStudent = students.get(0);
        System.out.println("First student: " + firstStudent);

        // Remove element by index
        students.remove(1); // removes "Bob"

        System.out.println("Students list after removing index 1: " + students);

        // Check size
        System.out.println("Total students: " + students.size());
    }
}
```
```
Expected Output (sample)

Students list: [Alice, Bob, Charlie]
First student: Alice
Students list after removing index 1: [Alice, Charlie]
Total students: 2
```
Example 2 – Multiple Threads Adding to the Same Vector

This example shows how multiple threads can safely add elements to the same Vector.
Because Vector methods are synchronized, all add operations are thread-safe and the final size is predictable.

```java
package tinitiate.java.threadsafe.collections;

import java.util.Vector;

public class ThreadSafeVectorExample {

    public static void main(String[] args) throws InterruptedException {

        // Shared Vector used by all threads
        Vector<String> messages = new Vector<>();

        // Task for each thread:
        // Add 5 messages to the shared Vector
        Runnable writerTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 5; i++) {
                String msg = threadName + " - message " + i;

                // add() is synchronized inside Vector → thread-safe
                messages.add(msg);

                System.out.println("Added: " + msg);

                // Small delay so that we can see interleaving clearly
                try {
                    Thread.sleep((int)(Math.random() * 200));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Create three threads that share the same Vector
        Thread t1 = new Thread(writerTask, "Writer-1");
        Thread t2 = new Thread(writerTask, "Writer-2");
        Thread t3 = new Thread(writerTask, "Writer-3");

        // Start all threads
        t1.start();
        t2.start();
        t3.start();

        // Wait for all threads to finish
        t1.join();
        t2.join();
        t3.join();

        // After all threads finish, each added 5 messages → 3 * 5 = 15
        System.out.println("Final size of messages Vector: " + messages.size());

        // Print all messages
        System.out.println("All messages in Vector:");
        for (String msg : messages) {
            System.out.println(msg);
        }
    }
}
```

Expected Output (sample, order will vary)

Added: Writer-2 - message 1
Added: Writer-1 - message 1
Added: Writer-3 - message 1
Added: Writer-2 - message 2
Added: Writer-1 - message 2
Added: Writer-3 - message 2
...
Added: Writer-3 - message 5

Final size of messages Vector: 15
All messages in Vector:
Writer-2 - message 1
Writer-1 - message 1
Writer-3 - message 1
...
Writer-3 - message 5

What students should learn from Example 2

* One Vector object is shared across multiple threads.
* Each thread safely calls messages.add(...) because Vector’s methods are synchronized.
* Total elements = number of threads × elements per thread (3 × 5 = 15).
* The order of “Added:” lines changes each run because threads run in parallel, but the final size is always correct.
