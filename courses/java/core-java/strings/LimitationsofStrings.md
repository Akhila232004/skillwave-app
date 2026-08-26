# **Limitations of Strings**

Strings in Java are **immutable**, meaning their value cannot be changed once created.
While immutability has advantages (security, thread-safety, caching), it also creates some limitations:

### **1) Performance Overhead for Modifications**

Every time you modify a string (append, concatenate, replace), Java creates a **new String object**, which is slower and uses more memory.

### **2) Not Suitable for Frequent Updates**

Tasks like building large text, loops that modify text, logs, or dynamic content become **inefficient** with Strings.

### **3) More Garbage Objects Created**

Repeated string operations result in many temporary objects, increasing **GC (Garbage Collection)** work.

### **4) Prefer StringBuilder / StringBuffer for Modifications**

Because Strings cannot change, Java developers use **StringBuilder** or **StringBuffer** for tasks that require frequent edits.

---