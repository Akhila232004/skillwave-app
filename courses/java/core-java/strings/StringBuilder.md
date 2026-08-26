# Java StringBuilder Class

* **StringBuilder** class is similar to the `String` class.  
  It is used to create and manipulate strings.
* The main difference between `String` and `StringBuilder` is:
  - `String` holds a **fixed-length** and **immutable** character sequence.
  - `StringBuilder` holds a **variable-length**, **modifiable** character sequence.
* **StringBuilder is non-synchronized** (NOT thread-safe), making it faster than StringBuffer in single-threaded applications.

### Example
```java
// StringBuilder
StringBuilder sb = new StringBuilder("TINITIATE.COM");
System.out.println(sb);  
// Output: TINITIATE.COM
````

---

## StringBuilder append(text) Method

* **append()** adds (appends) text at the end of the existing StringBuilder.

```java
StringBuilder sb1 = new StringBuilder("TINITIATE.COM");
sb1.append(" tutorials website.");
System.out.println(sb1);
// Output: TINITIATE.COM tutorials website.
```

---

## StringBuilder insert(index, text) Method

* **insert()** inserts text at the specified index.
  Index starts from **0**.

```java
StringBuilder sb2 = new StringBuilder("TINITIATE.COM");
sb2.insert(0, "WWW.");
System.out.println(sb2);
// Output: WWW.TINITIATE.COM
```

---

## StringBuilder replace(startIndex, endIndex, text) Method

* **replace()** replaces the characters between `startIndex` and `endIndex`
  *(end index NOT included)*.

```java
StringBuilder sb3 = new StringBuilder("TINITIATE.COM");
sb3.replace(9, 11, " <> ");
System.out.println(sb3);
// Output: TINITIATE <> OM
```

---

## StringBuilder delete(startIndex, endIndex) Method

* **delete()** removes characters between `startIndex` and `endIndex`
  *(end index NOT included)*.

```java
StringBuilder sb4 = new StringBuilder("TINITIATE.COM");
sb4.delete(9, 14);
System.out.println(sb4);
// Output: TINITIATE
```

---

## StringBuilder deleteCharAt(index) Method

* **deleteCharAt()** deletes the character at the specified index.

```java
sb4.deleteCharAt(7);
System.out.println(sb4);
// Output: TINITIAE
```

---

## StringBuilder reverse() Method

* **reverse()** reverses the sequence of characters in the StringBuilder.

```java
StringBuilder sb5 = new StringBuilder("TINITIATE.COM");
sb5.reverse();
System.out.println(sb5);
// Output: MOC.ETAITINIT
```
##### [Back To Contents](./strings.md)
***
| &copy; TINITIATE.COM |
|----------------------|

