# Java Multithreading & Concurrency — MCQ Assignment
1. What is multithreading in Java?

    A) Running multiple programs simultaneously  
    B) Running multiple threads concurrently within a program  
    C) Running a single thread at a time  
    D) Running background processes only

2. A thread is:

    A) A lightweight subprocess  
    B) A separate program  
    C) A memory block  
    D) A process pool

3. Difference between process and thread?

    A) Threads share memory; processes don’t  
    B) Processes share memory; threads don’t  
    C) Threads have their own memory  
    D) Processes are faster than threads

4. Which of these is not a valid thread state?

    A) New  
    B) Running  
    C) Waiting  
    D) Finished

5. What is the first state of a thread when created?

    A) New  
    B) Runnable  
    C) Waiting  
    D) Terminated

6. Which method starts a thread in Java?

    A) start()  
    B) run()  
    C) execute()  
    D) begin()

7. What happens if we call run() directly instead of start()?

    A) Thread runs normally  
    B) Code executes in the current thread  
    C) Thread runs in parallel  
    D) Causes compile error

8. Which class must be extended to create a thread?

    A) Thread  
    B) Runnable  
    C) Executor  
    D) Task

9. Which interface is used for creating threads?

    A) Runnable  
    B) Callable  
    C) Threadable  
    D) Executor

10. What is the main difference between Runnable and Callable?

    A) Callable returns a result, Runnable doesn’t  
    B) Runnable can throw checked exceptions  
    C) Callable runs faster  
    D) Runnable is asynchronous

11. What does the sleep() method do?

    A) Stops a thread permanently  
    B) Pauses a thread temporarily  
    C) Ends thread execution  
    D) Starts a thread again

12. What does join() method do?

    A) Pauses current thread until another finishes  
    B) Starts another thread  
    C) Terminates a thread  
    D) Synchronizes threads

13. Which of the following releases a lock?

    A) sleep()  
    B) wait()  
    C) yield()  
    D) notify()

14. What is the use of the yield() method?

    A) Temporarily pauses a thread to give others a chance  
    B) Terminates thread execution  
    C) Creates new thread    
    D) Restarts a paused thread  

15. Which keyword is used for synchronization?

    A) synchronized  
    B) sync  
    C) threadsafe  
    D) wait

16. What does synchronization prevent?

    A) Deadlock  
    B) Race conditions  
    C) Thread creation  
    D) Thread sleeping

17. A synchronized method in Java:

    A) Can be accessed by only one thread at a time  
    B) Can be accessed by multiple threads simultaneously  
    C) Executes asynchronously  
    D) Does not require locks  

18. What is a synchronized block?

    A) Code segment locked for one thread at a time  
    B) A block executed by all threads at once  
    C) Non-synchronized method  
    D) Static code

19. Which Java class provides explicit lock objects?

    A) java.util.concurrent.locks.Lock  
    B) java.lang.Thread   
    C) java.util.Lock  
    D) java.util.concurrent.ThreadPool

20. What happens when two threads access the same synchronized method of the same object?

    A) Both run simultaneously  
    B) One runs, the other waits  
    C) Both are blocked  
    D) JVM crashes  

21. Which interface is part of the Executor framework?

    A) Executor  
    B) Runnable  
    C) Thread  
    D) Callable

22. Which class implements the ExecutorService interface?

    A) Executors  
    B) ThreadPoolExecutor  
    C) ServiceExecutor  
    D) CallableExecutor

23. Which method shuts down an ExecutorService gracefully?

    A) stop()  
    B) shutdown()  
    C) close()  
    D) end()

24. What does Future.get() do?

    A) Blocks until the Callable task completes and returns result  
    B) Returns result immediately  
    C) Cancels a thread  
    D) Creates new thread  

25. Which of these is used to synchronize threads to wait for each other?

    A) CountDownLatch  
    B) Semaphore  
    C) ThreadLocal  
    D) Barrier

26. Which utility limits concurrent thread access to a shared resource?

    A) Semaphore  
    B) CountDownLatch  
    C) ThreadGroup  
    D) Lock

27. What does Semaphore control?

    A) Number of threads that can access a resource simultaneously  
    B) Thread execution order  
    C) Thread priority  
    D) Thread termination

28. Which interface supports returning results from threads?

    A) Runnable  
    B) Callable  
    C) Executor  
    D) Future

29. What is a ConcurrentHashMap?

    A) Thread-safe map allowing concurrent access  
    B) Synchronized map with blocking  
    C) Non-thread-safe map    
    D) Slower than HashMap

30. Which package contains concurrency utilities in Java?

    A) java.concurrent  
    B) java.util.concurrent  
    C) java.thread  
    D) java.sync 

<!-- ## Answer Key
| Q  | Ans | Q  | Ans | Q  | Ans | Q  | Ans |
|----|-----|----|-----|----|-----|----|-----|
| 1  | B   | 2  | A   | 3  | A   | 4  | D   |
| 5  | A   | 6  | A   | 7  | B   | 8  | A   |
| 9  | A   | 10 | A   | 11 | B   | 12 | A   |
| 13 | B   | 14 | A   | 15 | A   | 16 | B   |
| 17 | A   | 18 | A   | 19 | A   | 20 | B   |
| 21 | A   | 22 | B   | 23 | B   | 24 | A   |
| 25 | A   | 26 | A   | 27 | A   | 28 | B   |
| 29 | A   | 30 | B   |    |     |    |     | -->
