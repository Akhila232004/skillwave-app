## Introduction to Multithreading
Multithreading means running multiple “paths of work” (threads) inside the same Java program (process). Each thread can progress independently, so more than one task can be in progress at once.

### Why it’s useful
* Responsiveness: Keep the UI/server responsive while slow tasks (file, network, DB) happen in background.
* Throughput: Handle many requests concurrently instead of one-by-one.
* Resource use: While one thread waits on I/O, another can use the CPU.
* Modeling: Natural fit when tasks are independent (e.g., per-request, per-connection, per-job).

## Key ideas

* **Concurrency vs Parallelism:**  Concurrency = making progress on many tasks “at the same time” (via scheduling).
Parallelism = actually running at the same instant on different CPU cores. Concurrency works on 1 core; parallelism needs ≥2 cores.

* **Main thread:**   Every Java app starts on a thread named main. The JVM also has internal threads (e.g., garbage collector).

* **Scheduling:** The OS/JVM scheduler decides which RUNNABLE thread gets CPU next. You don’t control exact timing.

* **Thread safety:** If threads share mutable data, you must coordinate access (synchronization, locks, thread-safe structures) to avoid race conditions.

### When to use
* Great for I/O-bound work (web calls, DB, files).
* For CPU-bound work, prefer task pools (Executor framework) to avoid creating too many threads.
#### Example
```java
// File: IntroMultithreading.java
// Demo: Start two threads; prints will interleave (order not guaranteed).

public class IntroMultithreading {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {          // declare + name the thread
            for (int i = 1; i <= 5; i++) {
                System.out.println("[T1] step " + i);
            }
        });

        Thread t2 = new Thread(() -> {          // declare + name the thread
            for (int i = 1; i <= 5; i++) {
                System.out.println("[T2] step " + i);
            }
        });

        t1.start();          // start both threads
        t2.start();

        t1.join();           // wait for t1 to finish
        t2.join();           // wait for t2 to finish

        System.out.println("Both tasks done!");
    }
}

/*
EXPECTED OUTPUT (sample; order may vary each run)

[T1] step 1
[T2] step 1
[T1] step 2
[T2] step 2
[T1] step 3
[T2] step 3
[T1] step 4
[T2] step 4
[T1] step 5
[T2] step 5
Both tasks done!

Note: The exact interleaving of [T1]/[T2] lines can change every run.
*/
```

## Process vs Thread

| **Aspect** | **Process** | **Thread** |
|-------------|--------------|-------------|
| **Definition** | A running program with its own memory space. | A lightweight unit of execution inside a process. |
| **Memory** | Isolated from other processes. | Shared with other threads in the same process (heap, static fields). Each thread has its own stack. |
| **Creation Cost** | Heavier (more OS overhead). | Lighter (faster to create/switch). |
| **Communication** | Via IPC (pipes, sockets, shared memory). | Simple & fast through shared objects — but requires synchronization. |
| **Failure Isolation** | A crash usually kills only that process. | An uncaught error can terminate the whole process (if not handled). |
| **Use Cases** | Run independent apps/services. | Handle many tasks inside one app (e.g., web server requests). |

#### Example
```java
// File: ProcessVsThread.java
// Demo: Two threads share and update the same counter (no synchronization).
// This illustrates shared memory with threads and the possibility of race conditions.

public class ProcessVsThread {
    public static void main(String[] args) throws Exception {
        final int[] sharedCounter = {0}; // shared between threads because it's the same process

        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) sharedCounter[0]++; // not atomic
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) sharedCounter[0]++; // not atomic
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Threads updated shared counter to: " + sharedCounter[0]);

        // Concept note:
        // If this work was done in two separate PROCESSES, they would not share memory,
        // and each process would have its own separate counter variable.
    }
}

/*
EXPECTED OUTPUT (sample)

Threads updated shared counter to: 2000

Important: Because increments are not synchronized, you MAY sometimes see a value LESS than 2000
(e.g., 1994, 1987, etc.) due to a RACE CONDITION. That’s intentional here to motivate synchronization.
*/
```

## Thread Lifecycle (Java)

Java models a thread’s life using states you can read with Thread.getState():

1. **NEW**  
Thread object created but start() not called yet.
2. **RUNNABLE**
Eligible to run and/or running on the CPU. (Java lumps “ready” + “running” into this one state.)
3. **BLOCKED**
Waiting to enter a synchronized method/block because another thread currently holds that monitor (lock).
4. **WAITING**  
Waiting indefinitely for another thread’s action (e.g., Object.wait() without timeout, Thread.join() without timeout, LockSupport.park()).
5. **TIMED_WAITING**  
Waiting for a specified time (e.g., Thread.sleep(ms), wait(timeout), join(timeout)).
6. **TERMINATED (a.k.a. DEAD)  
run() finished or exited with an uncaught exception.

### What triggers state changes
* start() → NEW → RUNNABLE
* synchronized contention → RUNNABLE ↔ BLOCKED
* sleep/wait/join (no timeout) → WAITING
* sleep/wait/join (with timeout) → TIMED_WAITING
* notify/notifyAll, timeout expiry, or lock availability → back to RUNNABLE
* run() completes or throws uncaught error → TERMINATED

#### Example
```java
// File: ThreadLifecycleDemo.java
// Demo: Observe common thread states: NEW -> RUNNABLE -> TIMED_WAITING -> TERMINATED

public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            // Do a little work to stay RUNNABLE briefly
            for (int i = 0; i < 3; i++) {
                Math.sqrt(i * 12345.678); // trivial CPU work
            }
            try {
                // Move into TIMED_WAITING for ~500ms
                Thread.sleep(500);
            } catch (InterruptedException e) {
                // If interrupted, it would leave sleep early
                Thread.currentThread().interrupt();
            }
        });

        // State before start
        System.out.println("State after creation: " + worker.getState()); // NEW

        worker.start(); // NEW -> RUNNABLE
        Thread.sleep(50); // give it a moment to start
        System.out.println("State shortly after start: " + worker.getState()); // RUNNABLE (likely)

        Thread.sleep(200); // by now it should be sleeping
        System.out.println("State during sleep: " + worker.getState()); // TIMED_WAITING (likely)

        worker.join(); // wait for it to finish
        System.out.println("State after completion: " + worker.getState()); // TERMINATED
    }
}

/*
EXPECTED OUTPUT (sample; may vary slightly by timing/CPU)

State after creation: NEW
State shortly after start: RUNNABLE
State during sleep: TIMED_WAITING
State after completion: TERMINATED

Note: The exact moment you sample state can differ; you might occasionally see RUNNABLE or
another valid state depending on timing.
*/
```

## Creating Threads
In Java, there are three main ways to create and run threads:

* By extending the Thread class
* By implementing the Runnable interface
* By using the Executor Framework (Java 5+)  
  Each method helps you run tasks concurrently within the same program.

### 1. Extending the Thread Class

You can create a thread by extending Thread and overriding its run() method — which defines what the thread will do when it starts.

Syntax
```java
class MyThread extends Thread {
    public void run() {
        // task to perform in this thread
    }
}
```
#### Example
```java
// Demonstrates creating a thread by extending Thread class

class MyThread extends Thread {
    public void run() {
        // Code that runs in the new thread
        for (int i = 1; i <= 3; i++) {
            System.out.println("Child Thread: " + i);
        }
    }

    public static void main(String[] args) {
        MyThread t1 = new MyThread(); // Thread in "New" state
        t1.start(); // starts the new thread → calls run()

        // Main thread continues concurrently
        for (int i = 1; i <= 3; i++) {
            System.out.println("Main Thread: " + i);
        }
    }
}

/*
Expected Output (order may vary):
Child Thread: 1
Main Thread: 1
Child Thread: 2
Main Thread: 2
Child Thread: 3
Main Thread: 3
*/
```

### Key Points
* start() → creates a new thread and calls run().
* If you call run() directly, it executes in the same thread, not a new one.
* Threads run concurrently, so output order may differ every time.

### 2. Implementing the Runnable Interface
You can also create a thread by implementing the Runnable interface and defining the run() method.
This is the preferred modern approach, especially when your class already extends another class.

Syntax
```java
class MyRunnable implements Runnable {
    public void run() {
        // task to perform in this thread
    }
}
```

Then you create a Thread object:
```java
MyRunnable obj = new MyRunnable();
Thread t = new Thread(obj);
t.start();
```

#### Key Points
* Use this approach when you need to extend another class.
* Runnable decouples the task (run method) from the thread control (Thread class).
* It’s cleaner and used heavily in frameworks like Spring or Executors.

### 3. Using the Executor Framework (Java 5+)

The Executor Framework provides a high-level API to manage threads efficiently — without manually starting or stopping them.

**It handles:**
* Thread pooling
* Task scheduling
* Better performance for large-scale apps

Syntax
```java
ExecutorService service = Executors.newFixedThreadPool(n);
service.execute(new RunnableTask());
service.shutdown();
```
**Example:** Using ExecutorService
```java
// Demonstrates creating and managing threads using Executor Framework

import java.util.concurrent.*;

class MyTask implements Runnable {
    public void run() {
        System.out.println(Thread.currentThread().getName() + " is executing the task.");
    }
}

public class ExecutorExample {
    public static void main(String[] args) {
        // Create a thread pool with 3 threads
        ExecutorService service = Executors.newFixedThreadPool(3);

        // Submit 5 tasks (some threads will be reused)
        for (int i = 1; i <= 5; i++) {
            service.execute(new MyTask());
        }

        // Shut down the executor after tasks are completed
        service.shutdown();
    }
}

/*
Expected Output (order may vary):
pool-1-thread-1 is executing the task.
pool-1-thread-2 is executing the task.
pool-1-thread-3 is executing the task.
pool-1-thread-1 is executing the task.
pool-1-thread-2 is executing the task.
*/
```
#### Key Points

* ExecutorService automatically manages thread creation and reuse.
* shutdown() stops accepting new tasks after current ones finish.
* Ideal for server applications or large-scale systems where many tasks need to run concurrently.

### Thread Methods in Java
Java’s Thread class provides several important methods to control thread execution and behavior.
The most commonly used ones are:
1. sleep() — pauses a thread temporarily
2. join() — waits for another thread to finish
3. yield() — gives other threads a chance to execute
4. interrupt() — requests a thread to stop its current activity

### 1. sleep() Method
The sleep() method pauses the current thread for a specific time (in milliseconds or nanoseconds).

During sleep:
* The thread stays in a Timed Waiting state.
* After the time elapses, it becomes Runnable again.

Syntax
```java
Thread.sleep(milliseconds);

✅ Example: Using sleep()
// Demonstrates the sleep() method

class SleepExample {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            System.out.println("Downloading file " + i);
            try {
                Thread.sleep(1000); // pauses for 1 second
            } catch (InterruptedException e) {
                System.out.println("Thread interrupted!");
            }
        }
        System.out.println("All downloads completed!");
    }
}

/*
Expected Output (1-second delay between lines):
Downloading file 1
Downloading file 2
Downloading file 3
All downloads completed!
*/
```
#### Key Points
* sleep() does not release any locks if held by the thread.
* It can throw InterruptedException — hence must be handled with try-catch.

### 2. join() Method
The join() method lets one thread wait for another to finish execution before continuing.  
It’s often used to ensure that critical threads finish before the main program ends.

Syntax
```java
threadObj.join();
```
**Example:**  Using join()
```java
// Demonstrates join() method

class JoinExample extends Thread {
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(Thread.currentThread().getName() + " - Step " + i);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                System.out.println("Interrupted!");
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        JoinExample t1 = new JoinExample();
        JoinExample t2 = new JoinExample();

        t1.start();
        t1.join(); // main waits until t1 finishes

        t2.start();
        t2.join(); // main waits until t2 finishes

        System.out.println("All threads completed!");
    }
}

/*
Expected Output:
Thread-0 - Step 1
Thread-0 - Step 2
Thread-0 - Step 3
Thread-1 - Step 1
Thread-1 - Step 2
Thread-1 - Step 3
All threads completed!
*/
```
#### Key Points
* Ensures sequential execution between threads.
* Variants:
  * join() → wait until thread finishes
  * join(milliseconds) → wait only for specified time



### 3. yield() Method
The yield() method hints to the thread scheduler that the current thread is willing to pause and let other threads of equal priority execute.

However:
It’s just a hint, not a guarantee.
Useful for cooperative multitasking or demo purposes.

Syntax
```
Thread.yield();
```
**Example:** Using yield()
```java
// Demonstrates yield() method

class YieldExample extends Thread {
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(Thread.currentThread().getName() + " running - step " + i);
            Thread.yield(); // give chance to other threads
        }
    }

    public static void main(String[] args) {
        YieldExample t1 = new YieldExample();
        YieldExample t2 = new YieldExample();

        t1.start();
        t2.start();
    }
}

/*
Expected Output (order may vary):
Thread-0 running - step 1
Thread-1 running - step 1
Thread-0 running - step 2
Thread-1 running - step 2
Thread-0 running - step 3
Thread-1 running - step 3
*/
```

#### Key Points
* Suggests the thread scheduler to switch context.
* Execution order is non-deterministic (depends on OS and JVM).
* Rarely used in production code; mainly for learning or thread demos.

### 4.interrupt() Method
The interrupt() method requests a thread to stop its work —
especially useful when a thread is sleeping or waiting.
It doesn’t forcefully stop the thread but sets an interrupted flag.

Syntax
```java
threadObj.interrupt();
```
**Example:** Using interrupt()
```java
// Demonstrates interrupt() to stop a sleeping thread gracefully

class InterruptExample extends Thread {
    public void run() {
        try {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Working on task " + i);
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            System.out.println("Thread was interrupted! Exiting safely...");
        }
    }

    public static void main(String[] args) {
        InterruptExample t1 = new InterruptExample();
        t1.start();

        try {
            Thread.sleep(2500); // let it run for a while
        } catch (InterruptedException e) {}

        t1.interrupt(); // interrupt the thread
    }
}

/*
Expected Output:
Working on task 1
Working on task 2
Working on task 3
Thread was interrupted! Exiting safely...
*/
```
#### Key Points
* Best used for graceful thread termination.
* `interrupt()` sets an interrupted flag;  
  if the thread is sleeping/waiting, it throws InterruptedException.     
* Always use inside a try-catch for safe exits.

## Synchronization in Java
* When multiple threads access shared data, race conditions can occur — meaning results become inconsistent or unpredictable.  
* Synchronization ensures that only one thread can access a shared resource (like a variable or method) at a time.  
* It provides mutual exclusion (mutex).

### 1. Synchronized Methods
When a method is declared with the synchronized keyword, only one thread can execute that method on a given object at a time.

Other threads calling the same synchronized method will wait until the first one finishes.

Syntax
```java
synchronized returnType methodName(parameters) {
    // critical section
}
```
**Example:** Using a Synchronized Method
```java
// Demonstrates synchronized method to avoid race conditions

class Counter {
    private int count = 0;

    // synchronized method
    synchronized void increment() {
        count++;
    }

    int getCount() {
        return count;
    }
}

public class SynchronizedMethodExample {
    public static void main(String[] args) throws InterruptedException {
        Counter counter = new Counter();

        // Thread 1 increments counter 1000 times
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        });

        // Thread 2 increments counter 1000 times
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Final Count: " + counter.getCount());
    }
}

/*
Expected Output:
Final Count: 2000
*/
```
> Without synchronization, the result might be less than 2000 because both threads could modify count simultaneously.


### 2.Synchronized Blocks  
A synchronized block lets you synchronize only a specific part of code, instead of the entire method.
This improves performance when only a small section needs protection.

Syntax
```java
synchronized(objectReference) {
    // critical section
}
```

The objectReference acts as a lock.
Only one thread can hold the lock on that object at a time.

**Example:**  Using a Synchronized Block
```java
// Demonstrates synchronized block for fine-grained locking

class Printer {
    void printMessage(String msg) {
        synchronized(this) {  // lock only this section
            System.out.print("[" + msg);
            try {
                Thread.sleep(500);  // simulate delay
            } catch (InterruptedException e) {}
            System.out.println("]");
        }
    }
}

public class SynchronizedBlockExample {
    public static void main(String[] args) {
        Printer p = new Printer();

        Thread t1 = new Thread(() -> p.printMessage("Hello"));
        Thread t2 = new Thread(() -> p.printMessage("World"));
        Thread t3 = new Thread(() -> p.printMessage("Java"));

        t1.start();
        t2.start();
        t3.start();
    }
}

/*
Expected Output (in any order, but without overlap):
[Hello]
[World]
[Java]
*/
```
#### Key Idea
Only the block inside synchronized(this) is locked —
allowing other parts of the method to run freely, improving performance.

### 3. Locks (java.util.concurrent.locks.Lock)
From Java 5 onward, the Lock interface (in java.util.concurrent.locks) provides more flexible synchronization than synchronized blocks.  

It allows:
* Try locking without waiting.
* Interruptible locking.
* Multiple lock conditions.

Syntax
```java
Lock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

Example: Using ReentrantLock
```java
// Demonstrates using ReentrantLock for synchronization

import java.util.concurrent.locks.*;

class SharedResource {
    private int data = 0;
    private final Lock lock = new ReentrantLock();

    void increment() {
        lock.lock(); // acquire lock
        try {
            data++;
        } finally {
            lock.unlock(); // always release lock
        }
    }

    int getData() {
        return data;
    }
}

public class LockExample {
    public static void main(String[] args) throws InterruptedException {
        SharedResource s = new SharedResource();

        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 500; i++) s.increment();
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 500; i++) s.increment();
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Final Data: " + s.getData());
    }
}

/*
Expected Output:
Final Data: 1000
*/
```

#### Key Points
* Always use unlock() inside a finally block to prevent deadlocks.
* Lock gives you more control than synchronized.
* Best used in complex concurrency scenarios.

## Concurrency Utilities (java.util.concurrent)
The java.util.concurrent package provides high-level concurrency utilities introduced in Java 5 to simplify thread management and coordination.

These classes make multithreading safer, faster, and easier to control, compared to manual thread creation and synchronization.

### 1. ExecutorService
ExecutorService is part of the Executor Framework — it manages a pool of threads and executes tasks (Runnable or Callable) asynchronously.
Instead of manually creating and starting threads, you submit tasks to the executor.

Syntax
```java
ExecutorService service = Executors.newFixedThreadPool(n);
service.execute(new Task());
service.shutdown();
```
**Example:**  Using ExecutorService   
```java
// Demonstrates ExecutorService executing multiple tasks concurrently

import java.util.concurrent.*;

class MyTask implements Runnable {
    private String name;
    MyTask(String name) { this.name = name; }

    public void run() {
        System.out.println(Thread.currentThread().getName() + " is executing " + name);
    }
}

public class ExecutorServiceExample {
    public static void main(String[] args) {
        ExecutorService service = Executors.newFixedThreadPool(3);

        for (int i = 1; i <= 5; i++) {
            service.execute(new MyTask("Task-" + i));
        }

        service.shutdown();
    }
}

/*
Expected Output (order may vary):
pool-1-thread-1 is executing Task-1
pool-1-thread-2 is executing Task-2
pool-1-thread-3 is executing Task-3
pool-1-thread-1 is executing Task-4
pool-1-thread-2 is executing Task-5
*/
```
#### Key Points
* Manages threads automatically.
* Prevents overhead of creating too many threads.
* Use shutdown() to stop accepting new tasks.
### 2. Callable & Future
Unlike Runnable, which cannot return results,
Callable allows a task to return a value and throw exceptions.

A Future represents the result of an asynchronous computation.

Syntax
```java
Future<T> future = executor.submit(new CallableTask());
T result = future.get(); // waits for completion
```

**Example:** Using Callable and Future
```java
// Demonstrates Callable and Future for returning results from threads

import java.util.concurrent.*;

class SquareCalculator implements Callable<Integer> {
    private int number;
    SquareCalculator(int number) { this.number = number; }

    public Integer call() throws Exception {
        System.out.println("Calculating square of " + number + "...");
        Thread.sleep(1000); // simulate delay
        return number * number;
    }
}

public class CallableFutureExample {
    public static void main(String[] args) throws Exception {
        ExecutorService service = Executors.newFixedThreadPool(2);

        Future<Integer> f1 = service.submit(new SquareCalculator(5));
        Future<Integer> f2 = service.submit(new SquareCalculator(10));

        System.out.println("Result of 5²: " + f1.get());
        System.out.println("Result of 10²: " + f2.get());

        service.shutdown();
    }
}

/*
Expected Output:
Calculating square of 5...
Calculating square of 10...
Result of 5²: 25
Result of 10²: 100
*/
```
#### Key Points
1. Callable<T> → returns a result of type T.
2. Future.get() → waits for and retrieves the result.
3. Commonly used for background computations like I/O or database calls.

### 3. CountDownLatch
CountDownLatch allows one or more threads to wait until a set of tasks complete.
It’s initialized with a count, and each completed task decrements that count.

Once the count reaches zero, waiting threads are released.

Syntax
```java
CountDownLatch latch = new CountDownLatch(count);
latch.countDown();
latch.await(); // waits until count reaches zero
```
**Example:** Using CountDownLatch
```java
// Demonstrates CountDownLatch to wait for multiple threads to complete

import java.util.concurrent.*;

class Worker extends Thread {
    private CountDownLatch latch;
    Worker(CountDownLatch latch, String name) {
        super(name);
        this.latch = latch;
    }
    public void run() {
        System.out.println(getName() + " is working...");
        try { Thread.sleep(1000); } catch (InterruptedException e) {}
        latch.countDown(); // signal completion
        System.out.println(getName() + " finished!");
    }
}

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(3);

        new Worker(latch, "Worker-1").start();
        new Worker(latch, "Worker-2").start();
        new Worker(latch, "Worker-3").start();

        latch.await(); // main waits until all workers finish
        System.out.println("All workers completed. Proceeding...");
    }
}

/*
Expected Output (order may vary):
Worker-1 is working...
Worker-2 is working...
Worker-3 is working...
Worker-1 finished!
Worker-2 finished!
Worker-3 finished!
All workers completed. Proceeding...
*/
```
#### Key Points
* Used for task coordination.
* Useful in test setups, batch jobs, or waiting for multiple parallel tasks.

### Semaphore
A Semaphore controls access to a shared resource by allowing only a fixed number of threads to use it simultaneously.

Think of it as a permit counter — a thread must acquire a permit before entering and release it afterward.

Syntax
```java
Semaphore sem = new Semaphore(permits);
sem.acquire();  // get a permit
sem.release();  // release a permit
```
**Example:** Using Semaphore
```java
// Demonstrates Semaphore controlling access to limited resources

import java.util.concurrent.*;

class SharedPrinter implements Runnable {
    private Semaphore sem;
    private String name;

    SharedPrinter(Semaphore sem, String name) {
        this.sem = sem;
        this.name = name;
    }

    public void run() {
        try {
            sem.acquire(); // acquire permit
            System.out.println(name + " got access to the printer.");
            Thread.sleep(1000); // simulate printing
            System.out.println(name + " finished printing.");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            sem.release(); // release permit
        }
    }
}

public class SemaphoreExample {
    public static void main(String[] args) {
        Semaphore sem = new Semaphore(2); // only 2 threads at a time

        for (int i = 1; i <= 5; i++) {
            new Thread(new SharedPrinter(sem, "User-" + i)).start();
        }
    }
}

/*
Expected Output (order may vary):
User-1 got access to the printer.
User-2 got access to the printer.
User-1 finished printing.
User-3 got access to the printer.
User-2 finished printing.
User-4 got access to the printer.
User-3 finished printing.
User-5 got access to the printer.
User-4 finished printing.
User-5 finished printing.
*/
```
#### Key Points
* Limits concurrent access.
* Useful for resource pooling (e.g., connection pools, printer queues).

### 5.Concurrent Collections
java.util.concurrent also provides thread-safe collection classes that can be accessed by multiple threads without explicit synchronization.

### Common Concurrent Collections

| **Class** | **Description** |
|------------|----------------|
| **ConcurrentHashMap** | Thread-safe alternative to `HashMap`. |
| **CopyOnWriteArrayList** | Thread-safe version of `ArrayList` (creates a new copy on every write operation). |
| **ConcurrentLinkedQueue** | Lock-free queue for concurrent operations. |
| **BlockingQueue** | Used for producer-consumer scenarios. |


**Example:** Using ConcurrentHashMap
```java
// Demonstrates ConcurrentHashMap for thread-safe operations

import java.util.concurrent.*;

public class ConcurrentHashMapExample {
    public static void main(String[] args) throws InterruptedException {
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

        Thread writer = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                map.put("Task-" + i, i);
                System.out.println("Added Task-" + i);
                try { Thread.sleep(500); } catch (InterruptedException e) {}
            }
        });

        Thread reader = new Thread(() -> {
            for (int i = 0; i < 3; i++) {
                System.out.println("Current Map: " + map);
                try { Thread.sleep(700); } catch (InterruptedException e) {}
            }
        });

        writer.start();
        reader.start();

        writer.join();
        reader.join();
    }
}

/*
Expected Output (order may vary):
Added Task-1
Current Map: {Task-1=1}
Added Task-2
Current Map: {Task-1=1, Task-2=2}
Added Task-3
Current Map: {Task-1=1, Task-2=2, Task-3=3}
*/
```
#### Key Points
* No need for explicit synchronized or locks.
* Highly optimized for multi-core performance.
* Prevents ConcurrentModificationException.

##  Summary Table

| **Utility** | **Purpose** | **Example Use** |
|--------------|-------------|----------------|
| **ExecutorService** | Manages a pool of worker threads | Background tasks |
| **Callable & Future** | Run tasks that return values | Asynchronous computation |
| **CountDownLatch** | Wait for multiple threads to finish | Task coordination |
| **Semaphore** | Limit concurrent access | Resource pools |
| **Concurrent Collections** | Thread-safe data structures | Shared maps, queues, lists |

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|