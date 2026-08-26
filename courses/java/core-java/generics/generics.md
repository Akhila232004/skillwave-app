# Introduction to Generics
## What are Generics?  
Generics let you parameterize types—you write a class or method once and reuse it for many data types (e.g., String, Integer, User). The compiler enforces type safety so you get errors early instead of ClassCastException at runtime.  

### Why they matter

Type safety: catches wrong types at compile time.
No casts/noisy code: String s = list.get(0); (no (String) cast).
Reusability & clarity: one algorithm, many types, cleaner APIs.
### Common letters
* T (Type), E (Element), K/V (Key/Value), R (Result).

**Examples** (raw vs generic)**
```java
// File: IntroNoGenerics.java  
// ❌ Example of raw (non-generic) code — unsafe at runtime
import java.util.ArrayList;
import java.util.List;

public class IntroNoGenerics {
    public static void main(String[] args) {
        List raw = new ArrayList();  // raw type (no <T>)
        raw.add("hello");
        raw.add(123);  // mixed types allowed — risky!

        // Need explicit cast — can cause runtime error
        String a = (String) raw.get(0);  // OK
        // String b = (String) raw.get(1); // ❌ would cause ClassCastException
        System.out.println("First element: " + a);
        System.out.println("Code ran, but unsafe if we used wrong types!");
    }
}

/*
Expected Output:
First element: hello
Code ran, but unsafe if we used wrong types!
*/

```
```java
// File: IntroWithGenerics.java  
//  Example of Generic List — type-safe and modern
import java.util.ArrayList;
import java.util.List;

public class IntroWithGenerics {
    public static void main(String[] args) {
        // List is restricted to hold only Strings
        List<String> words = new ArrayList<>();
        words.add("hello");
        // words.add(123); // ❌ compile-time error: incompatible type

        String first = words.get(0); // no cast needed
        System.out.println("First element: " + first.toUpperCase());
        System.out.println("Code is type-safe and clean!");
    }
}

/*
Expected Output:
First element: HELLO
Code is type-safe and clean!
*/

```
## Generic Classes
A generic class introduces a type parameter on the class itself: class Box<T> { ... }. Every instance “plugs in” a real type for T (e.g., Box<String>, Box<Integer>). The class works uniformly for all such types.

Syntax pattern  
```java
class Name<T> {      // one type parameter
    private T value;
    ...
}

class Pair<K,V> {    // multiple type parameters
    private K key;
    private V value;
    ...
}
```

**Example A: Box<T>**  
```java
// File: BoxDemo.java
// 🧠 Demonstrates a simple Generic Class that can store any type of value
class Box<T> {
    private T value;  // T can be String, Integer, or any other type

    public Box(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }

    public void set(T newValue) {
        this.value = newValue;
    }
}

public class BoxDemo {
    public static void main(String[] args) {
        Box<String> message = new Box<>("Hello Java Generics");
        Box<Integer> number = new Box<>(100);

        System.out.println("String Box: " + message.get());
        System.out.println("Integer Box: " + number.get());
    }
}

/*
Expected Output:
String Box: Hello Java Generics
Integer Box: 100
*/

```
**Example B: Pair<K,V>**
```java
// File: PairDemo.java
// 🧠 Demonstrates a Generic Class with TWO type parameters (K and V)
class Pair<K, V> {
    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}

public class PairDemo {
    public static void main(String[] args) {
        Pair<String, String> country = new Pair<>("India", "New Delhi");
        Pair<String, Integer> product = new Pair<>("Laptop", 65000);

        System.out.println("Country: " + country.getKey() + " - Capital: " + country.getValue());
        System.out.println("Product: " + product.getKey() + " - Price: ₹" + product.getValue());
    }
}

/*
Expected Output:
Country: India - Capital: New Delhi
Product: Laptop - Price: ₹65000
*/

```

### Notes & best practices
* Prefer interfaces in fields/params (List<T> over ArrayList<T>).
* Keep names simple and international-friendly: text, count, items.
* Avoid raw types (List); always use parameterized types (List<String>).

## Generic Methods
A generic method declares its own type parameter(s) before the return type. It’s independent of the class’s type parameters (the class may be generic or non-generic).

Syntax pattern
```java
static <T> T identity(T x) { return x; }
static <T extends Comparable<T>> T max(T a, T b) { ... } // bounded
```

**When to use**
* Utility methods that work for “any T” (e.g., swap, copy, max).
* APIs that need constraints (bounds) like T extends Number.

**Example A:** swap (any array type)
```java
// File: GenericMethod_SwapExample.java
// 🧠 Topic: Generic Methods
// Demonstrates a Generic Method that swaps two elements in any array type
import java.util.Arrays;

public class GenericMethod_SwapExample {

    // Generic method that swaps any type of array elements
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];   // store one element temporarily
        arr[i] = arr[j];   // swap positions
        arr[j] = temp;     // put temp back
    }

    public static void main(String[] args) {
        String[] colors = {"Red", "Blue", "Green"};
        System.out.println("Before swap: " + Arrays.toString(colors));

        swap(colors, 0, 2); // swap first and last
        System.out.println("After swap:  " + Arrays.toString(colors));

        Integer[] numbers = {1, 2, 3};
        swap(numbers, 0, 1);
        System.out.println("Numbers after swap: " + Arrays.toString(numbers));
    }
}

/*
Expected Output:
Before swap: [Red, Blue, Green]
After swap:  [Green, Blue, Red]
Numbers after swap: [2, 1, 3]
*/
```

**Example B:** max with an upper bound
```java
// File: GenericMethodMax.java
public class GenericMethodMax {

    // T must be Comparable<T>, so we can call compareTo
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(max(10, 7));          // Integer
        System.out.println(max("mango", "apple"));// String (lexicographic)
    }
}


// Expected output

// 10
// mango
```
#### Notes & best practices

* Put <T> before the return type: public static <T> T ....
* Use bounds to require capabilities:
<T extends Number>, <T extends Number & Comparable<T>>.
* Let the compiler infer types (type inference). Usually you don’t need explicit <String> at the call site.
* For static utilities, make the method generic; class type params aren’t visible to static members.

## Bounded Type Parameters

####  (what & why)

* A bounded type parameter restricts what types can be used for a generic type variable.
* Upper bound with extends: T extends Number means T must be Number or a subclass (also used for interfaces; read it as “T is a subtype of …”).
* Multiple bounds: T extends ClassA & InterfaceB & InterfaceC.
(At most one class, and it must appear first; any number of interfaces may follow.)

**Example** — average of numbers + min/max + a multi-bound method
```java
// File: BoundedType_SingleBoundExample.java
// 🧠 Topic: Bounded Type Parameters (Single Bound)
// Demonstrates restricting a generic class to accept only numeric types.

class Calculator<T extends Number> {
    private T num1;
    private T num2;

    public Calculator(T num1, T num2) {
        this.num1 = num1;
        this.num2 = num2;
    }

    public double sum() {
        return num1.doubleValue() + num2.doubleValue();
    }
}

public class BoundedType_SingleBoundExample {
    public static void main(String[] args) {
        Calculator<Integer> intCalc = new Calculator<>(10, 20);
        Calculator<Double> dblCalc = new Calculator<>(2.5, 4.5);

        System.out.println("Integer sum: " + intCalc.sum());
        System.out.println("Double sum: " + dblCalc.sum());
        // Calculator<String> strCalc = new Calculator<>("A", "B"); // ❌ compile-time error
    }
}

/*
Expected Output:
Integer sum: 30.0
Double sum: 7.0
*/

```

### Key points
* Bounds let you call specific APIs (e.g., doubleValue(), compareTo).
* Use multiple bounds when you need more than one capability.
* Bounds apply to type parameters on classes or methods (not to wildcards here).

## Upper Bound (extends)
#### Theory

“Upper bound” appears in **two places:**  
* 1. Type parameters: `class Box<T extends Number> { ... }` (covered above).
* 2. Wildcards: `List<? extends Number>` — a list of some unknown subtype of Number.
With ? extends wildcards, you typically read safely but cannot add elements (except null) because the exact subtype is unknown.

**Example** — sum numbers using an upper-bounded wildcard
```java

import java.util.Arrays;
import java.util.List;

public class UpperBoundExtendsDemo {
    // Producer: can read as Number safely
    static double sumNumbers(List<? extends Number> nums) {
        double sum = 0.0;
        for (Number n : nums) sum += n.doubleValue();
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(sumNumbers(Arrays.asList(1, 2, 3)));   // List<Integer>
        System.out.println(sumNumbers(Arrays.asList(1.5, 2.0)));  // List<Double>

        // nums.add(5);          // ❌ not allowed: exact subtype is unknown
        // Only reading is safe with ? extends
    }
}


// Expected output

// 6.0
// 3.5
```

#### Key points
* ? extends T = producer (PECS rule: Producer Extends).
* Use when your method consumes the list as a source (read-only view).

## Lower Bound (super)
#### Theory (important nuance)
Java does not allow `super` on type parameters (you can’t write `<T super X>`).
`super` appears only with wildcards: `? super X`.
`? super X ` means some unknown supertype of X.
It’s great when you want to add/put elements of type `X` into a collection, because any supertype list can accept an `X`.

This is the other half of PECS:
* Producer Extends (`? extends`) for reading.
Consumer Super (`? super`) for writing.

**Example A** — write integers into any suitable supertype list
```java
// File: LowerBound_AddNumbersExample.java
// 🧠 Topic: Lower Bounded Wildcards (? super)
// Demonstrates adding integer values safely to a list of any supertype (Number, Object).

import java.util.*;

public class LowerBound_AddNumbersExample {

    // Consumer: list can accept Integers because it's a List<? super Integer>
    static void addNumbers(List<? super Integer> list) {
        list.add(10);
        list.add(20);
        list.add(30);
    }

    public static void main(String[] args) {
        List<Number> numbers = new ArrayList<>();
        List<Object> objects = new ArrayList<>();

        addNumbers(numbers); // OK — Number is a supertype of Integer
        addNumbers(objects); // OK — Object is also a supertype of Integer

        System.out.println("Numbers List: " + numbers);
        System.out.println("Objects List: " + objects);
    }
}

/*
Expected Output:
Numbers List: [10, 20, 30]
Objects List: [10, 20, 30]
*/
```

#### Key points
* ? super X = consumer (you can safely add X).
* You can still read only as Object from a ? super X list (the exact type is unknown).
* You cannot write <T super X> on a type parameter—super is only for wildcards.

## Wildcards
### Why do wildcards exist?

* Goal: Let APIs accept collections whose element types vary without rewriting code for every type.
* Background: Java generics are invariant. That means List<Integer> is not a subtype of List<Number>.
Wildcards (like List<? extends Number> or List<? super Integer>) give us controlled flexibility.

### Three kinds of wildcards
* Unbounded: ? → “I don’t care what the element type is.”
* Upper-bounded: ? extends T → “Some unknown subtype of T (a producer of T values).”
* Lower-bounded: ? super T → “Some unknown supertype of T (a consumer that accepts T values).”

**PECS rule (easy memory):**  
Producer → Extends, Consumer → Super.
### 1. Unbounded ?
* Type: List<?>
* Meaning: A list of unknown element type. We only know elements are Object at best.
* You can safely:
  * Read elements as type Object.
  * Iterate, print, count, check emptiness.
* You cannot:
  * Add elements (except null). The compiler can’t verify the element type.  

**Typical use cases**
* Logging or printing a list, regardless of its element type.
* Utility methods that don’t modify the list and don’t need element-specific methods.


example (runnable)
```java
// File: UnboundedWildcard_PrintExample.java
// 🧠 Topic: Unbounded Wildcards (List<?>)
// Demonstrates printing elements of any type safely using an unbounded wildcard.

import java.util.*;

public class UnboundedWildcard_PrintExample {

    // Can accept a list of any type (Integer, String, etc.)
    static void printItems(List<?> items) {
        for (Object item : items) {
            System.out.print(item + " ");
        }
        System.out.println();
        // items.add("New Item"); // ❌ Not allowed — type unknown
    }

    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(10, 20, 30);
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

        System.out.println("Printing Numbers:");
        printItems(numbers);

        System.out.println("Printing Names:");
        printItems(names);
    }
}

/*
Expected Output:
Printing Numbers:
10 20 30 
Printing Names:
Alice Bob Charlie 
*/

```

### 2. Upper-Bounded ? extends T

Type: `List<? extends T>`

Meaning: A list whose element type is some unknown subtype of `T `(could be exactly `T` too).

* You can safely:
   * Read elements as type `T` (or supertypes of `T`), because every element is at least a T.
* You cannot:
  * Add any specific non-null element (the exact subtype is unknown). Only null is permitted, which we avoid.
* Think of it as: a producer of `T` values → read-only view.

**Typical use cases**

* Aggregations like `sum(List<? extends Number>)`, `max(List<? extends Comparable<? super T>>)`.
* Methods that consume the list as an input source without modifying it.


**example (runnable)**
```java
// File: UpperBound_ReadOnlyExample.java
// 🧠 Topic: Upper Bounded Wildcards (? extends T)
// Demonstrates that we can READ safely from a list of any subtype of Number,
// but we CANNOT add new elements because the exact subtype is unknown.

import java.util.*;

public class UpperBound_ReadOnlyExample {

    // Method works with any list of Number or its subclass (Integer, Double, etc.)
    static double calculateTotal(List<? extends Number> list) {
        double total = 0;
        for (Number n : list) {
            total += n.doubleValue();  // safe: all elements are Numbers
        }
        // list.add(5); // ❌ Not allowed – compiler doesn’t know if list is Integer, Double, etc.
        return total;
    }

    public static void main(String[] args) {
        List<Integer> integers = Arrays.asList(10, 20, 30);
        List<Double> doubles = Arrays.asList(1.5, 2.5, 3.0);

        System.out.println("Integer Total: " + calculateTotal(integers));
        System.out.println("Double Total: " + calculateTotal(doubles));
    }
}

/*
Expected Output:
Integer Total: 60.0
Double Total: 7.0
*/
```

### 3. Lower-Bounded ? super T
* Type: `List<? super T>`
* Meaning: A list whose element type is some unknown supertype of `T` (could be `T`, Object, or any supertype).
* You can safely:
   * Add elements of type `T`(or any subtype of `T`), because the list accepts `T `(it’s a supertype list).
* When you read:
   * You only get `Object, because the compiler can’t know which supertype it truly is at runtime.
* Think of it as: a consumer of `T` values → write-friendly.
**Typical use cases**
* Methods that fill or append items into a destination list.
* Many JDK APIs use this shape, e.g., `Comparator<? super T>`, `Collection.addAll.`

#### example (runnable)
```java
import java.util.ArrayList;
import java.util.List;

public class LowerBoundDemo {
    static void addOneToThree(List<? super Integer> out) {
        // Safe to add Integers: the list is some supertype (Integer, Number, or Object)
        out.add(1);
        out.add(2);
        out.add(3);
    }

    public static void main(String[] args) {
        List<Number> numbers = new ArrayList<>();
        List<Object> objects = new ArrayList<>();

        addOneToThree(numbers); // OK
        addOneToThree(objects); // OK

        System.out.println(numbers); // [1, 2, 3]
        System.out.println(objects); // [1, 2, 3]

        Object first = numbers.get(0); // reading gives Object
        System.out.println("First (as Object): " + first);
    }
}


// Expected output

// [1, 2, 3]
// [1, 2, 3]
// First (as Object): 1
```

## Generics with Collections
### Why use generics with collections?

* Type safety: List<String> guarantees only strings go in; mistakes are caught at compile time.
* No casts: String s = list.get(0); (no (String)).
* Clear APIs: Signatures tell you what element types to pass and expect.  
* Reusability: Generic helpers like <T> Set<T> toSet(Collection<? extends T>) work for many types.

### Key ideas
* Collections are invariant: List<Integer> is not a List<Number>. Wildcards give controlled flexibility.
* Prefer interfaces in variables/params/returns: List<T>, Set<T>, Map<K,V>, Queue<T>.
* Avoid raw types (List); use parameterized types (List<String>).
* Remember PECS when using wildcards: Producer→Extends, Consumer→Super.

#### Example
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ListsDemo {
    public static void main(String[] args) {
        // A typed list: only Strings allowed
        List<String> words = new ArrayList<>();
        words.add("java");
        words.add("generics");
        // words.add(10); // ❌ compile error (wrong type)

        for (String w : words) {
            System.out.print(w.toUpperCase() + " ");
        }
        System.out.println();

        // Convert array to List (fixed size!): Arrays.asList
        List<Integer> nums = Arrays.asList(1, 2, 3);
        System.out.println(nums.get(0)); // safe: Integer
        // nums.add(4); // ❌ UnsupportedOperationException (fixed-size view)
    }
}


// Expected output

// JAVA GENERICS 
// 1
```

## Advantages of Generics
### Why generics help

* Type safety (compile-time checks): wrong types are caught early instead of at runtime.
* No noisy casts: you get the right type directly from collections/methods.
* Reusable code: one generic class/method works for many types.
* Clear APIs: method signatures document intent (List<String> vs List<?>).
* (Usually) zero runtime overhead: implemented via type erasure; checks happen at compile time.

### Limitations of Generics
* No super on type parameters: you can write <T extends X> but not <T super X>. (super is only for wildcards: ? super X.)
* No runtime generic type info: can’t do T.class, new T(), or instanceof List<String>.
* No primitives as type args: use wrappers (Integer, Double).
* No arrays of parameterized types: new List<String>[10] is illegal.
* Static context: class type params aren’t visible in static members; make static methods generic themselves.
* Overloads that erase to the same signature are illegal: process(List<String>) and process(List<Integer>) can’t coexist.
* Checked exceptions can’t be generic types (you can’t catch E where E is a type param).
* Varargs with generics can cause “heap pollution” warnings; use @SafeVarargs carefully.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|