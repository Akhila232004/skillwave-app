# Java StringBuffer Class

* **StringBuffer** class is similar to the `String` class.  
  It is used to create and handle strings.
* The main difference between `String` and `StringBuffer` is:
  - `String` holds a **fixed-length**, **immutable** sequence of characters.
  - `StringBuffer` holds a **variable-length**, **modifiable** sequence of characters.
* **StringBuffer is synchronized and thread-safe.**

### Example
```java
// StringBuffer
StringBuffer sb = new StringBuffer("TINITIATE.COM");
System.out.println(sb);  
// Output: TINITIATE.COM
````

---

## StringBuffer append(text) Method

* **append()** adds text to the end of the existing `StringBuffer`.

```java
StringBuffer sb1 = new StringBuffer("TINITIATE.COM");
sb1.append(" tutorials website.");
System.out.println(sb1);
// Output: TINITIATE.COM tutorials website.
```

---

## StringBuffer insert(index, text) Method

* **insert()** inserts text at the specified index position.
  Index starts from **0**.

```java
StringBuffer sb2 = new StringBuffer("TINITIATE.COM");
sb2.insert(0, "WWW.");
System.out.println(sb2);
// Output: WWW.TINITIATE.COM
```

---

## StringBuffer replace(startIndex, endIndex, text) Method

* **replace()** replaces characters in the string between the given
  `startIndex` and `endIndex` *(end index is NOT included)*.

```java
StringBuffer sb3 = new StringBuffer("TINITIATE.COM");
sb3.replace(9, 11, " <> ");
System.out.println(sb3);
// Output: TINITIATE <> OM
```

---

## StringBuffer delete(startIndex, endIndex) Method

* **delete()** removes characters between `startIndex` and `endIndex`
  *(end index NOT included)*.

```java
StringBuffer sb4 = new StringBuffer("TINITIATE.COM");
sb4.delete(9, 14);
System.out.println(sb4);
// Output: TINITIATE
```

---

## StringBuffer deleteCharAt(index) Method

* **deleteCharAt()** removes the character at the given index.

```java
sb4.deleteCharAt(7);
System.out.println(sb4);
// Output: TINITIAE
```

---

## StringBuffer reverse() Method

* **reverse()** reverses the entire sequence of characters.

```java
StringBuffer sb5 = new StringBuffer("TINITIATE.COM");
sb5.reverse();
System.out.println(sb5);
// Output: MOC.ETAITINIT
```
##### [Back To Contents](./strings.md)
***
| &copy; TINITIATE.COM |
|----------------------|