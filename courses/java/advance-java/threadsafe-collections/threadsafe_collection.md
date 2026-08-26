# Java Thread-Safe Collections

Thread-safe collections are designed to work safely when accessed by multiple threads simultaneously. Without thread safety, shared collections can lead to inconsistent state, race conditions, or exceptions. Java provides multiple thread-safe collection implementations including legacy synchronized collections and modern concurrent collections optimized for high performance.

## Why Thread Safety Is Needed

When multiple threads read and write to the same collection, normal collections such as ArrayList, HashMap, or LinkedList are not safe and may cause:

* Unpredictable behavior
* ConcurrentModificationException
* Lost updates or corrupted data

Thread-safe collections ensure controlled access to shared data and guarantee consistency.

## Types of Thread-Safe Collections in Java

**There are three main categories of thread-safe collections:**

1. Legacy Synchronized Collections
2. Collections Made Thread-Safe Using Collections.synchronizedX()
3. Modern Concurrent Collections (java.util.concurrent)


## Legacy Synchronized Collections

These implementations are synchronized internally. All methods are synchronized, meaning only one thread can access the structure at a time.

Examples:

* Vector (thread-safe alternative to ArrayList)
* Hashtable (thread-safe alternative to HashMap)
* Stack (thread-safe LIFO structure)
* Properties (thread-safe key-value storage)

Use when maintaining legacy systems or when thread contention is minimal.

## Thread-Safe Wrappers Using Collections Utility

Java provides wrapper methods that convert a normal collection into a synchronized one:

Examples:

* Collections.synchronizedList(list)
* Collections.synchronizedMap(map)
* Collections.synchronizedSet(set)

These are useful when retrofitting thread safety into an existing application. However, iteration still requires manual synchronization.

Example:

```java
List<String> list = Collections.synchronizedList(new ArrayList<>());
synchronized(list) {
    for(String item : list) {
        System.out.println(item);
    }
}
```
## Modern Concurrent Collections

These are optimized for multi-threaded environments. They allow higher concurrency by reducing locking or using lock-free algorithms.

Key concurrent collection types:

* ConcurrentHashMap
* CopyOnWriteArrayList
* ConcurrentLinkedQueue
* BlockingQueue (ArrayBlockingQueue, LinkedBlockingQueue)
* ConcurrentSkipListMap (sorted concurrent map)
* ConcurrentSkipListSet

These are preferred in modern high-performance applications because they scale better than synchronized collections.

When to Use Each Type

| Collection Type                   | Best Scenario                                                 |
| --------------------------------- | ------------------------------------------------------------- |
| Vector / Hashtable                | Legacy systems requiring backward compatibility               |
| Collections.synchronized wrappers | When converting existing non-thread-safe logic to thread-safe |
| Concurrent Collections            | High-performance, modern concurrent applications              |

---

Example: ConcurrentHashMap in Multithreading

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentCollectionExample {
    public static void main(String[] args) throws InterruptedException {

        ConcurrentHashMap<String, Integer> data = new ConcurrentHashMap<>();

        Runnable task = () -> {
            for(int i=1; i<=3; i++) {
                data.put(Thread.currentThread().getName() + "-Key" + i, i);
                System.out.println(Thread.currentThread().getName() + " storing Key" + i);
            }
        };

        Thread t1 = new Thread(task, "Thread-A");
        Thread t2 = new Thread(task, "Thread-B");

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("Final Data: " + data);
    }
}
```

Key Advantages of Modern Concurrent Collections

* Reduce lock contention
* Better scalability and CPU utilization
* Avoid frequent blocking
* Prevent common concurrency exceptions
