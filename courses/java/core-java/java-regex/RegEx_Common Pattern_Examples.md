# **Java RegEx — Common Pattern Examples**

Below is a list of commonly used Regular Expression (RegEx) patterns in Java.
All examples are demonstrated using the **`replaceAll()`** method inside a custom helper method.

---
## **RegEx Pattern List**

### **1) Matches any single character using `.`**

The dot (`.`) matches **any one character**.

---

### **2) Matches start of line `^`**

Caret (`^`) matches the **beginning** of the input string.

---

### **3) Matches end of line `$`**

Dollar (`$`) matches the **end** of the input string.

---

### **4) Matches any single character in brackets `[ ... ]`**

Matches one character from the defined set.

---

### **5) Matches any single character NOT in brackets `[^ ... ]`**

Matches one character **not** present in the set.

---

### **6) Matches beginning of entire string `\A`**

`\A` anchors the match to the **very beginning** of the entire text.

---

### **7) Matches end of entire string `\z`**

`\z` anchors the match to the **very end** (strict end).

---

### **8) Matches end of string except final line terminator `\Z`**

`\Z` is similar to `\z`, but allows a final line break.

---

### **9) Matches 0 or more occurrences of preceding expression `*`**

`*` allows repeating the previous element **zero or more times**.

---

### **10) Matches 1 or more occurrences `+`**

`+` allows repeating the previous element **one or more times**.

---

### **11) Matches 0 or 1 occurrence `?`**

`?` makes the previous expression **optional**.

---

### **12) Matches exactly `n` occurrences `{n}`**

Example: `(ab){3}` → matches `ababab`.

---

### **13) Matches `n` or more occurrences `{n,}`**

Example: `(ab){2,}` → matches 2 or more repetitions.

---

### **14) Matches occurrences between `n` and `m` `{n,m}`**

Example: `(ab){2,4}` → matches 2 to 4 repetitions.

---

### **15) Matches X OR Y — `X|Y`**

Used for alternative patterns.

---

### **16) Matches word characters `\w`**

Equivalent to:

```java
[a-zA-Z0-9_]
```

---

### **17) Matches NON word characters `\W`**

Opposite of `\w`.

---

### **18) Matches whitespace `\s`**

Equivalent to:

```
[ \t\n\r\f ]
```

---

### **19) Matches NON whitespace `\S`**

Opposite of `\s`.

---

### **20) Matches digits `\d`**

Equivalent to:

```
[0-9]
```

---

### **21) Matches NON digits `\D`**

Opposite of `\d`.

---

