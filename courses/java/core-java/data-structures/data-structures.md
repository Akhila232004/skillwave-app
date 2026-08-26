# **Java Data Structures**

Data Structures are ways to **store, organize, and manage data efficiently** so operations like searching, insertion, and deletion become faster and easier.

Java provides both **built-in data structures** (Arrays, Collections) and **user-defined** structures (Linked List, Tree, Stack, Queue, etc.).

---

# 1. **Arrays** (Static Data Structure)
An Array is a collection of elements of the **same data type**, stored in **contiguous memory**, accessible using an **index**.

### Characteristics

* Fixed size
* Fast random access — O(1)
* Insert/delete in middle is slow — O(n)
* Best for static data, matrices, DP tables

### Java Example

```java
public class ArrayExample {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};

        for (int i = 0; i < arr.length; i++) {
            System.out.println("Index " + i + ": " + arr[i]);
        }
    }
}
```

**Output**

```
Index 0: 10
Index 1: 20
Index 2: 30
Index 3: 40
```

---

# 2. **Linked List** (Dynamic Linear Structure)

A Linked List is made of **nodes**, where each node contains:

```
data + pointer to next node
```

Nodes are stored **non-contiguously**.

### Characteristics

* Dynamic size
* Fast insertion/deletion at head — O(1)
* No random access (search = O(n))

### Java Implementation

```java
class Node {
    int data;
    Node next;

    Node(int data) {
        this.data = data;
    }
}

public class LinkedListExample {
    Node head;

    void insert(int data) {
        Node newNode = new Node(data);

        if (head == null) {
            head = newNode;
            return;
        }
        Node temp = head;
        while (temp.next != null)
            temp = temp.next;

        temp.next = newNode;
    }

    void display() {
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " -> ");
            temp = temp.next;
        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        LinkedListExample list = new LinkedListExample();
        list.insert(10);
        list.insert(20);
        list.insert(30);
        list.display();
    }
}
```

🟦 **Output**

```
10 -> 20 -> 30 -> null
```

---

# 3. **Stack (LIFO – Last In First Out)**

Stack follows:

```
Last In → First Out
```

### Real Use Cases

* Undo/Redo
* Browser navigation
* Parentheses matching
* DFS

### Operations

* push()
* pop()
* peek()
* isEmpty()

### Java Example (Using Array)

```java
public class StackExample {
    int top = -1;
    int[] arr = new int[5];

    void push(int x) {
        if (top == arr.length - 1) {
            System.out.println("Stack Overflow");
            return;
        }
        arr[++top] = x;
    }

    int pop() {
        if (top == -1) {
            System.out.println("Stack Underflow");
            return -1;
        }
        return arr[top--];
    }

    int peek() {
        return arr[top];
    }

    public static void main(String[] args) {
        StackExample s = new StackExample();
        s.push(10);
        s.push(20);
        System.out.println("Pop: " + s.pop());
        System.out.println("Peek: " + s.peek());
    }
}
```

**Output**

```
Pop: 20
Peek: 10
```

---

# 4. **Queue (FIFO – First In First Out)**

Queue works like a waiting line:

```
First In → First Out
```

### Applications

* CPU scheduling
* Printers
* BFS
* Task queues

### Java Example (Using Array)

```java
public class QueueExample {
    int front = 0, rear = 0;
    int[] q = new int[5];

    void enqueue(int x) {
        if (rear == q.length) {
            System.out.println("Queue Full");
            return;
        }
        q[rear++] = x;
    }

    int dequeue() {
        if (front == rear) {
            System.out.println("Queue Empty");
            return -1;
        }
        return q[front++];
    }

    public static void main(String[] args) {
        QueueExample q = new QueueExample();
        q.enqueue(10);
        q.enqueue(20);
        System.out.println("Dequeue: " + q.dequeue());
    }
}
```

**Output**

```
Dequeue: 10
```

---

# 5. **Binary Tree**

A Binary Tree is a hierarchical structure with each node having:

```
left child + right child
```

### Uses

* Expression evaluation
* Hierarchies
* Routing
* Game development

### Java Example (Inorder Traversal)

```java
class TreeNode {
    int data;
    TreeNode left, right;

    TreeNode(int data) {
        this.data = data;
    }
}

public class BinaryTreeExample {
    TreeNode root;

    void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.data + " ");
        inorder(node.right);
    }

    public static void main(String[] args) {
        BinaryTreeExample t = new BinaryTreeExample();
        t.root = new TreeNode(1);
        t.root.left = new TreeNode(2);
        t.root.right = new TreeNode(3);

        t.inorder(t.root);
    }
}
```

**Output**

```
2 1 3
```

---

# 6. **Binary Search Tree (BST)**

A BST maintains ordering:

```
Left < Root < Right
```

### Operations

* Insertion — O(log n)
* Search — O(log n)
* Delete — O(log n)

### Java Example

```java
class BSTNode {
    int data;
    BSTNode left, right;

    BSTNode(int data) { this.data = data; }
}

public class BSTExample {
    BSTNode root;

    BSTNode insert(BSTNode node, int key) {
        if (node == null) return new BSTNode(key);

        if (key < node.data)
            node.left = insert(node.left, key);
        else
            node.right = insert(node.right, key);

        return node;
    }

    void inorder(BSTNode node) {
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.data + " ");
        inorder(node.right);
    }

    public static void main(String[] args) {
        BSTExample bst = new BSTExample();
        int[] values = {50, 30, 70, 20, 40, 60, 80};

        for (int v : values) bst.root = bst.insert(bst.root, v);

        bst.inorder(bst.root);
    }
}
```

🟦 **Output**

```
20 30 40 50 60 70 80
```

---

# 7. **HashMap (Hashing)**

HashMap stores data as **key–value pairs** using a hash function.

### Characteristics

* O(1) average time
* No duplicate keys
* Allows one null key and many null values

### Java Example

```java
import java.util.HashMap;

public class HashMapExample {
    public static void main(String[] args) {
        HashMap<Integer, String> map = new HashMap<>();

        map.put(1, "Java");
        map.put(2, "Python");
        map.put(3, "C++");

        System.out.println(map.get(2));
    }
}
```

**Output**

```
Python
```

---

# **Final Summary (Best Version)**

| Data Structure  | Type         | Access Time | Insert/Delete | Looks Like   | Use Cases        |
| --------------- | ------------ | ----------- | ------------- | ------------ | ---------------- |
| **Array**       | Static       | O(1)        | O(n)          | [1,2,3]      | Fast lookup      |
| **Linked List** | Dynamic      | O(n)        | O(1) head     | 1→2→3        | Dynamic data     |
| **Stack**       | LIFO         | O(1)        | O(1)          | Top →        | Undo, DFS        |
| **Queue**       | FIFO         | O(1)        | O(1)          | Front→Rear   | Scheduling       |
| **Binary Tree** | Hierarchical | O(n)        | O(n)          | Tree         | Expression trees |
| **BST**         | Ordered tree | O(log n)    | O(log n)      | Ordered tree | Search           |
| **HashMap**     | Hashing      | O(1)        | O(1)          | {k:v}        | Lookups          |

---