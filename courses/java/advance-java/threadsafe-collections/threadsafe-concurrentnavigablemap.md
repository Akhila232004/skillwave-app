# Java ConcurrentNavigableMap and ConcurrentSkipListMap

ConcurrentNavigableMap is an interface in java.util.concurrent that combines two ideas:

1. A Map that is thread-safe (can be used by multiple threads safely).
2. A NavigableMap (like TreeMap) that keeps keys in sorted order and supports navigation operations (like getting first key, last key, etc.).

The most common implementation is ConcurrentSkipListMap.

### ConcurrentSkipListMap is:

* A sorted map (keys are stored in ascending order).
* Thread-safe for concurrent access.
* Non-blocking for most reads (good performance in multithreaded programs).

### Key Characteristics

* Thread-safe: multiple threads can safely put, get, and remove entries.
* Sorted: keys are always stored in natural order (or by a custom Comparator).
* Iterators are weakly consistent:

  * They do NOT throw ConcurrentModificationException.
  * They may not show every change done after the iterator was created.
* Does not allow null keys or null values.

### Common Methods (from NavigableMap)

* `put(K key, V value)` – insert or update a value.
*`get(Object key)` – get value for a key.
* `firstKey()` – smallest key.
* `lastKey()` – largest key.
* `headMap(K toKey)` – view of keys less than toKey.
* `tailMap(K fromKey)` – view of keys greater than or equal to fromKey.
* `subMap(K fromKey, K toKey)` – keys in a given range.

### When to Use ConcurrentSkipListMap

* When you need a sorted map in a multithreaded program.
* When many threads will read and write data using keys that must stay ordered.
* For things like:

  * time-ordered events
  * range queries (e.g., between two IDs)
  * leaderboards or rankings where order matters

Simple Example – Multiple Threads Adding to a ConcurrentSkipListMap

```java
import java.util.Map;
import java.util.concurrent.ConcurrentNavigableMap;
import java.util.concurrent.ConcurrentSkipListMap;

public class SimpleConcurrentNavigableMapDemo {

public static void main(String[] args) throws InterruptedException {

    // Create a ConcurrentSkipListMap
    // This is a thread-safe, sorted map
    ConcurrentNavigableMap<Integer, String> studentMap = new ConcurrentSkipListMap<>();

    // Task: each thread will put 3 entries into the shared map
    Runnable writerTask1 = () -> {
        // This thread will add keys 1, 3, 5
        studentMap.put(1, "Alice");
        System.out.println("Writer-1 put: 1 -> Alice");

        sleep(100);

        studentMap.put(3, "Charlie");
        System.out.println("Writer-1 put: 3 -> Charlie");

        sleep(100);

        studentMap.put(5, "Eve");
        System.out.println("Writer-1 put: 5 -> Eve");
    };

    Runnable writerTask2 = () -> {
        // This thread will add keys 2, 4, 6
        studentMap.put(2, "Bob");
        System.out.println("Writer-2 put: 2 -> Bob");

        sleep(100);

        studentMap.put(4, "David");
        System.out.println("Writer-2 put: 4 -> David");

        sleep(100);

        studentMap.put(6, "Frank");
        System.out.println("Writer-2 put: 6 -> Frank");
    };

    Thread t1 = new Thread(writerTask1, "Writer-1");
    Thread t2 = new Thread(writerTask2, "Writer-2");

    t1.start();
    t2.start();

    t1.join();
    t2.join();

    // Print the whole map
    System.out.println("\nFinal studentMap (sorted by key):");
    for (Map.Entry<Integer, String> entry : studentMap.entrySet()) {
        System.out.println(entry.getKey() + " -> " + entry.getValue());
    }

    // Show some NavigableMap features
    System.out.println("\nFirst key: " + studentMap.firstKey());
    System.out.println("Last key: " + studentMap.lastKey());
    System.out.println("HeadMap(<4): " + studentMap.headMap(4));   // keys < 4
    System.out.println("TailMap(4): " + studentMap.tailMap(4));     // keys >= 4
}

// Helper method to handle InterruptedException inside lambdas
private static void sleep(long millis) {
    try {
        Thread.sleep(millis);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}
}

```
```
Expected Output (sample, order of “put” lines may vary):

Writer-1 put: 1 -> Alice
Writer-2 put: 2 -> Bob
Writer-1 put: 3 -> Charlie
Writer-2 put: 4 -> David
Writer-1 put: 5 -> Eve
Writer-2 put: 6 -> Frank

Final studentMap (sorted by key):
1 -> Alice
2 -> Bob
3 -> Charlie
4 -> David
5 -> Eve
6 -> Frank

First key: 1
Last key: 6
HeadMap(<4): {1=Alice, 2=Bob, 3=Charlie}
TailMap(4): {4=David, 5=Eve, 6=Frank}
```

**Explanation**

* ConcurrentSkipListMap is a thread-safe, sorted map.
* Two threads can safely add entries at the same time.
* The final map is automatically sorted by key (1 to 6).
* Navigable methods like firstKey(), lastKey(), headMap(), tailMap() are available and work in a concurrent context.
