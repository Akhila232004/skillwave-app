# Java Stack – Thread-Safe LIFO Collection

Stack is a legacy class in Java that implements a Last-In-First-Out (LIFO) data structure. It extends Vector, which means all its methods are synchronized and therefore thread-safe.

Because of this, multiple threads can safely push and pop elements from the same Stack instance without corrupting its internal state.

## Key Characteristics

* Stack is a LIFO (Last-In-First-Out) structure.
* It extends Vector, so all methods like push, pop, peek, empty are synchronized.
* It is thread-safe for individual operations.
* It is considered legacy; for new code, Deque (like ArrayDeque) is usually preferred, but Stack is still common in older code and interviews.

## Common Operations

* push(E item): Pushes an element to the top of the stack.
* pop(): Removes and returns the top element.
* peek(): Returns the top element without removing it.
* empty(): Returns true if the stack is empty.

## When to Use Stack

* When you need a simple LIFO structure in older or legacy code.
* When individual operations (push/pop) from multiple threads must be safe.
* When you don’t need very high concurrency performance.

For high-performance concurrent LIFO behavior, consider more modern concurrent structures or manage your own synchronization around a Deque.

### Example with Stack

This example shows multiple threads pushing elements onto the same shared Stack. Because Stack is synchronized, all push operations are thread-safe and the final size of the stack is predictable.

```java
package tinitiate.java.threadsafe.collections;

import java.util.Stack;

public class ThreadSafeStackDemo {

    public static void main(String[] args) throws InterruptedException {

        Stack<String> stack = new Stack<>();

        Runnable pushTask = () -> {
            String threadName = Thread.currentThread().getName();
            for (int i = 1; i <= 5; i++) {
                String value = threadName + " - item " + i;
                stack.push(value);
                System.out.println("Pushed: " + value);

                try {
                    Thread.sleep((int) (Math.random() * 200));
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        Thread t1 = new Thread(pushTask, "Pusher-1");
        Thread t2 = new Thread(pushTask, "Pusher-2");
        Thread t3 = new Thread(pushTask, "Pusher-3");

        t1.start();
        t2.start();
        t3.start();

        t1.join();
        t2.join();
        t3.join();

        System.out.println("Final stack size: " + stack.size());

        while (!stack.empty()) {
            System.out.println("Popped: " + stack.pop());
        }
    }
}
```
```
Expected Output (example, order will vary)

Pushed: Pusher-2 - item 1
Pushed: Pusher-1 - item 1
Pushed: Pusher-3 - item 1
Pushed: Pusher-2 - item 2
Pushed: Pusher-1 - item 2
Pushed: Pusher-3 - item 2
...
Pushed: Pusher-3 - item 5

Final stack size: 15
Popped: Pusher-3 - item 5
Popped: Pusher-1 - item 5
Popped: Pusher-2 - item 5
...
Popped: Pusher-2 - item 1
```
## Key Points from the Example

* Three threads (Pusher-1, Pusher-2, Pusher-3) all push onto the same Stack.
* The push operation is thread-safe because Stack methods are synchronized.
* Final stack size is always 15 (3 threads × 5 items each).
* The order of “Pushed” and “Popped” messages will change from run to run, which demonstrates concurrent execution.

## Important Concurrency Note

Stack guarantees that each individual operation (push or pop) is atomic and synchronized, but compound checks still need extra care. For example:

```java
synchronized (stack) {
    if (!stack.empty()) {
        String value = stack.pop();
        System.out.println("Safely popped: " + value);
    }
}
```

This ensures that the check (empty) and the pop happen together without another thread modifying the stack in between.
