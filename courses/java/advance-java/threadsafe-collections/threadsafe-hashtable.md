# Java Hashtable – Thread-Safe Map

Hashtable is a legacy key–value collection in Java that stores data using a hash table internally.
It is similar to HashMap, but with one important difference: all its methods are synchronized, so it is thread-safe.

Because of this, multiple threads can safely read and write to the same Hashtable at the same time, without corrupting the internal data structure.

## Key Characteristics

* Stores key–value pairs (like a dictionary).
* Does not allow null keys or null values.
* All public methods are synchronized → thread-safe for individual operations.
* Older (legacy) class; exists since early Java versions.
* Slower than modern concurrent collections (like ConcurrentHashMap) under heavy multithreaded load.

## Typical Methods

* put(K key, V value): Insert or update a value for the given key.
* get(Object key): Get the value for the given key (or null if not found).
* containsKey(Object key): Check if a key exists.
* remove(Object key): Remove an entry by key.
* size(): Number of key–value pairs currently stored.

## When Should You Use Hashtable

* When working on legacy code that already uses Hashtable.
* When you need a simple thread-safe map and performance is not a big concern.
* When individual operations (put/get/remove) must be thread-safe without writing your own synchronized blocks.

For new high-performance code, prefer ConcurrentHashMap instead of Hashtable.

Example Using Hashtable

This example shows multiple threads writing into the same shared Hashtable.
Because the methods of Hashtable are synchronized, the updates are thread-safe and the final size of the map is predictable.

```java
package tinitiate.java.threadsafe.collections;

import java.util.Hashtable;
import java.util.Map;

public class ThreadSafeHashtableExample {

    public static void main(String[] args) throws InterruptedException {

        // Shared thread-safe map
        Map<String, Integer> sharedTable = new Hashtable<>();

        // Task to add 5 entries into the shared hashtable
        Runnable writerTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 5; i++) {
                String key = threadName + "-Key" + i;
                int value = i;

                // put() is synchronized inside Hashtable
                sharedTable.put(key, value);

                System.out.println(threadName + " added: " + key + " = " + value);

                try {
                    Thread.sleep((int)(Math.random() * 200));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Create three writer threads sharing the same Hashtable
        Thread t1 = new Thread(writerTask, "Writer-1");
        Thread t2 = new Thread(writerTask, "Writer-2");
        Thread t3 = new Thread(writerTask, "Writer-3");

        // Start all threads
        t1.start();
        t2.start();
        t3.start();

        // Wait for all threads to complete
        t1.join();
        t2.join();
        t3.join();

        // After all threads finish, Hashtable should contain 15 entries
        System.out.println("Final size of sharedTable = " + sharedTable.size());
        System.out.println("Final content of sharedTable = " + sharedTable);
    }
}
```

**Expected Output**

* You will see “added” messages from Writer-1, Writer-2 and Writer-3 in a mixed (interleaved) order.

* The exact order will change every time you run the program, because threads run concurrently.

* The final line will always show:

* Final size of sharedTable = 15

Because:

* 3 threads × 5 entries each = 15 total key–value entries
* No entries are lost, even though all threads write to the same Hashtable.

## Important Notes

* Hashtable is synchronized at the method level. Each put(), get(), remove(), etc. is thread-safe.
* Method-level synchronization can become a bottleneck under heavy concurrency.
* Hashtable does not allow null keys or null values. Using null with put() or get() will throw NullPointerException.
* For new applications, prefer:

  * ConcurrentHashMap for high-performance concurrent access.
  * Collections.synchronizedMap(new HashMap<>()) when you just need a simple synchronized wrapper.
