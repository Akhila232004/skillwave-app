# Java ConcurrentMap and ConcurrentHashMap

ConcurrentMap is an interface in java.util.concurrent that represents a Map designed for use in multithreaded environments.
The most commonly used implementation is ConcurrentHashMap.

ConcurrentHashMap allows multiple threads to read and write at the same time without corrupting the map.
It is more scalable and faster than Hashtable or Collections.synchronizedMap(...) under high concurrency.

### Key characteristics

* Thread-safe: multiple threads can safely put, get, and remove entries.
* Non-blocking reads: most read operations do not block.
* Fine-grained locking or lock-free internally (better performance than Hashtable).
* Does not allow null keys or null values.
* Iterators are weakly consistent:

  * They do not throw ConcurrentModificationException.
  * They may not reflect all updates that happen after the iterator is created.

### Common methods in ConcurrentHashMap

* `put(K key, V value)` – insert or update a value for a key.
* `get(Object key)` – get the value for a key (or null if not present).
* `remove(Object key)` – remove a mapping by key.
* `putIfAbsent(K key, V value)` – only put value if key is not already present.
* `replace(K key, V value)` – replace value only if key is already present.
* `containsKey(Object key)`– check if a key exists.
* `size()` – number of key–value pairs.

### When to use ConcurrentHashMap

* When many threads need to read and update the same map.
* When Hashtable or synchronizedMap(...) becomes a performance bottleneck.
* For caches, counters, registries, and shared state in server applications.

**Example 1** – Basic ConcurrentHashMap usage (single thread)

This example shows simple usage of ConcurrentHashMap just like a normal HashMap, but it is safe to later share across threads.
```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class SimpleConcurrentHashMapExample {

public static void main(String[] args) {

    // Create a ConcurrentHashMap
    Map<String, Integer> scores = new ConcurrentHashMap<>();

    // Add some key–value pairs
    scores.put("Alice", 85);
    scores.put("Bob", 90);
    scores.put("Charlie", 78);

    System.out.println("Initial scores: " + scores);

    // Get a value by key
    int bobScore = scores.get("Bob");
    System.out.println("Bob's score: " + bobScore);

    // Update a value
    scores.put("Alice", 88);  // overwrites old value

    System.out.println("Scores after updating Alice: " + scores);

    // Remove an entry
    scores.remove("Charlie");

    System.out.println("Scores after removing Charlie: " + scores);
    System.out.println("Total students: " + scores.size());
}
}
```
```
Expected Output (sample)

Initial scores: {Alice=85, Bob=90, Charlie=78}  
Bob's score: 90
Scores after updating Alice: {Alice=88, Bob=90, Charlie=78}
Scores after removing Charlie: {Alice=88, Bob=90}
Total students: 2
```
**Example 2** – Multiple threads updating the same ConcurrentHashMap

This example shows several threads adding entries into the same shared ConcurrentHashMap.
All operations are thread-safe; no extra synchronized block is needed.
```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class ThreadSafeConcurrentMapExample {

public static void main(String[] args) throws InterruptedException {

    // Shared ConcurrentHashMap used by all threads
    Map<String, Integer> sharedMap = new ConcurrentHashMap<>();

    // Task for each thread:
    // Add 3 key–value pairs into the shared map
    Runnable writerTask = () -> {
        String threadName = Thread.currentThread().getName();

        for (int i = 1; i <= 3; i++) {
            String key = threadName + "-Key" + i;
            int value = i;

            // put() is thread-safe in ConcurrentHashMap
            sharedMap.put(key, value);

            System.out.println(threadName + " put: " + key + " = " + value);

            try {
                Thread.sleep(100);  // small delay to show interleaving
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    };

    // Create three threads that share the same ConcurrentHashMap
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

    // Each thread added 3 entries → total expected = 3 * 3 = 9
    System.out.println("Final size of sharedMap = " + sharedMap.size());

    System.out.println("Final content of sharedMap:");
    for (Map.Entry<String, Integer> entry : sharedMap.entrySet()) {
        System.out.println(entry.getKey() + " -> " + entry.getValue());
    }
}
}
```
```
Expected Output (sample, order will vary)

Writer-1 put: Writer-1-Key1 = 1
Writer-2 put: Writer-2-Key1 = 1
Writer-3 put: Writer-3-Key1 = 1
Writer-1 put: Writer-1-Key2 = 2
Writer-2 put: Writer-2-Key2 = 2
Writer-3 put: Writer-3-Key2 = 2
Writer-1 put: Writer-1-Key3 = 3
Writer-2 put: Writer-2-Key3 = 3
Writer-3 put: Writer-3-Key3 = 3

Final size of sharedMap = 9
Final content of sharedMap:
Writer-1-Key1 -> 1
Writer-1-Key2 -> 2
Writer-1-Key3 -> 3
Writer-2-Key1 -> 1
Writer-2-Key2 -> 2
Writer-2-Key3 -> 3
Writer-3-Key1 -> 1
Writer-3-Key2 -> 2
Writer-3-Key3 -> 3
```
Explanation

* One ConcurrentHashMap object is shared by multiple threads.
* All threads safely call sharedMap.put(...) at the same time.
* No synchronized block is needed for basic puts and gets.
* The final number of entries is predictable (9 entries for 3 threads × 3 keys each), even with concurrent access.

