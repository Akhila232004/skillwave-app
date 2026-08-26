## **Java Date & Time –(Legacy API: `java.util.Date`, `SimpleDateFormat`)**

## **Introduction**

Java provides multiple ways to work with **Date and Time**.
Before Java 8, the primary classes used were:

* `java.util.Date`
* `java.text.SimpleDateFormat`
* `java.util.Calendar` (not used in your file, but part of legacy API)

Java 8 introduced the new, better `java.time` API — but your boss’s content focuses on **legacy Date & Formatting**, so we stick to that.

---

## **1. Working with `java.util.Date`**

`Date` represents the system date & time (to the millisecond).

Example:

```java
Date d = new Date();
System.out.println(d.toString());
```

`Date.toString()` prints something like:

```
Thu Nov 21 14:52:10 IST 2025
```

---

## **2. Formatting Date Using `printf()` Format Specifiers**

Java’s `printf()` allows special **date/time format codes**:

| Format Code       | Meaning                  |
| ----------------- | ------------------------ |
| `%tc`             | Complete date & time     |
| `%tF`             | ISO date (yyyy-MM-dd)    |
| `%tD`             | US date (MM/dd/yy)       |
| `%tT`             | 24-hour time HH:mm:ss    |
| `%tr`             | 12-hour time             |
| `%tR`             | HH:mm (no seconds)       |
| `%tY`             | Year (4-digit)           |
| `%ty`             | Year (last 2 digits)     |
| `%tB`             | Full month name          |
| `%tb`             | Short month name         |
| `%td`             | Day with leading zero    |
| `%te`             | Day without leading zero |
| `%tA`             | Full weekday name        |
| `%ta`             | Short weekday name       |
| …and many others. |                          |

Example:

```java
System.out.printf("%1$s %2$tF", "ISO Format:", date1);
```

---

## **3. Formatting Using `SimpleDateFormat`**

`SimpleDateFormat` lets you define custom patterns.

Example:

```java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd hh:mm:ss a zzz");
System.out.println(sdf.format(new Date()));
```

| Pattern | Meaning       |
| ------- | ------------- |
| `yyyy`  | Year          |
| `MM`    | Month (01–12) |
| `dd`    | Day           |
| `HH`    | 24-hour       |
| `hh`    | 12-hour       |
| `mm`    | Minute        |
| `ss`    | Second        |
| `a`     | AM/PM         |
| `zzz`   | Timezone      |

---

## **4. Parsing String → Date**

We can convert any textual date into a `Date` object using `parse()`.

```java
DateFormat df = new SimpleDateFormat("MM/dd/yy");
Date d = df.parse("01/29/02");
```

If the format doesn’t match, **ParseException** occurs.

---

## **5. Additional Format Codes (SimpleDateFormat)**

| Pattern | Meaning          |
| ------- | ---------------- |
| `G`     | Era (AD/BC)      |
| `y`     | Year             |
| `M`     | Month            |
| `d`     | Day              |
| `h`     | Hour (1–12)      |
| `H`     | Hour (0–23)      |
| `m`     | Minute           |
| `s`     | Second           |
| `S`     | Millisecond      |
| `E`     | Weekday          |
| `D`     | Day in year      |
| `F`     | Weekday in month |
| `w`     | Week in year     |
| `W`     | Week in month    |
| `a`     | AM/PM            |
| `k`     | Hour (1–24)      |
| `K`     | Hour (0–11)      |
| `z`     | Timezone         |

---