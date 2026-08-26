# Type Casting in Java

Type casting converts a value from one data type to another. In Java, there are two kinds:

* Implicit (Widening) Conversion – safe, automatic

* Explicit (Narrowing) Casting – manual, may lose information

### 1) Implicit Casting (Widening)
conversion is the process of automatically converting a value from a smaller numeric type to a larger, compatible type so it fits without overflow.

Allowed Widening Paths (primitives)
```java
byte → short → int → long → float → double
char → int → long → float → double
```

> boolean never participates in numeric casts.
```java
Examples
public class WideningDemo {
    public static void main(String[] args) {
        byte b = 42;
        int i = b;            // byte → int (ok)
        long L = i;           // int → long (ok)
        float f = L;          // long → float (ok, may lose precision in fraction but allowed)
        double d = f;         // float → double (ok)

        char c = 'A';
        int code = c;         // char → int (65)
        double dd = code;     // int → double

        System.out.println(i);   // 42
        System.out.println(L);   // 42
        System.out.println(f);   // 42.0
        System.out.println(d);   // 42.0
        System.out.println(code);// 65
        System.out.println(dd);  // 65.0
    }
}
```
Notes

>  Happens automatically when the destination type can represent all source values (range-wise).

> Often used in expressions (numeric promotion): e.g., int + double → double.

### 2) Explicit Casting (Narrowing)
Narrowing cast is the process of manually converting a value from a larger type to a smaller type to force it to fit, which may truncate or wrap the value.

#### Needs a Cast
```
double → float → long → int → short → byte
int → char (and vice versa, both need explicit cast except char→int which widens)
```

``` java
Examples (numbers)
public class NarrowingDemo {
    public static void main(String[] args) {
        double d = 123.987;
        int i = (int) d;          // 123 (fraction truncated)
        short s = (short) 130;    // overflow in range: 130 → -126 for short? (No, short range is -32768..32767, so 130 is fine)
                                  // Let's show byte overflow instead:
        byte by = (byte) 130;     // byte range is -128..127 → wraps to -126

        long L = 3_000_000_000L;  // fits in long, not in int
        int ii = (int) L;         // overflow → wraps to a negative value

        char c = (char) 66;       // 66 → 'B'
        int code = (int) 'A';     // 65 (this one is widening, but okay)

        System.out.println(i);    // 123
        System.out.println(by);   // -126
        System.out.println(ii);   // overflowed value (e.g., -1294967296 depending on platform width—Java is consistent)
        System.out.println(c);    // B
        System.out.println(code); // 65
    }
}
```