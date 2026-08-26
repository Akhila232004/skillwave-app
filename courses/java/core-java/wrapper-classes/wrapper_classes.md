# Wrapper Classes, Autoboxing, and Unboxing

### What Are Wrapper Classes?
In Java, primitive types (like int, char, boolean, etc.) are not objects.
But sometimes, we need to treat them as objects — for example, when working with Collections (like ArrayList) or Generics, which can only hold objects, not primitives.

To solve this, Java provides Wrapper Classes — one for each primitive type.

### Primitive Types and Their Wrapper Classes

| **Primitive Type** | **Wrapper Class** |
|--------------------|------------------|
| **byte** | **Byte** |
| **short** | **Short** |
| **int** | **Integer** |
| **long** | **Long** |
| **float** | **Float** |
| **double** | **Double** |
| **char** | **Character** |
| **boolean** | **Boolean** |

These wrapper classes **encapsulate primitive values inside objects**, enabling their use in collections and providing utility methods for conversion and manipulation.


**Example:** Using Wrapper Classes
```java
// File: WrapperClassExample.java
// Demonstrates how primitive data can be stored using Wrapper Classes.

public class WrapperClassExample {
    public static void main(String[] args) {
        int primitiveNum = 10;                     // primitive
        Integer wrappedNum = Integer.valueOf(primitiveNum); // wrapping manually

        System.out.println("Primitive value: " + primitiveNum);
        System.out.println("Wrapped value (Integer object): " + wrappedNum);
    }
}

/*
Expected Output:
Primitive value: 10
Wrapped value (Integer object): 10
*/
```
## Autoboxing
Autoboxing is the automatic conversion of a primitive type into its corresponding wrapper class object.
It happens automatically when you assign a primitive value to a wrapper variable.

Syntax
```java
Integer num = 10;  // primitive int automatically converted to Integer object
```
### Example
```java
// File: AutoboxingExample.java
// Demonstrates automatic conversion (autoboxing) from primitive to wrapper object.

import java.util.ArrayList;

public class AutoboxingExample {
    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>();

        // Autoboxing: int → Integer
        list.add(5);
        list.add(10);
        list.add(15);

        System.out.println("ArrayList with Autoboxed Integers: " + list);
    }
}

/*
Expected Output:
ArrayList with Autoboxed Integers: [5, 10, 15]
*/
```
## Unboxin
Unboxing is the reverse process — automatically converting a wrapper class object back into its primitive type.

Syntax
```java
Integer obj = 25;
int num = obj;  // unboxing: Integer → int
```
**Example**
```java
// File: UnboxingExample.java
// Demonstrates automatic conversion (unboxing) from wrapper object to primitive.

public class UnboxingExample {
    public static void main(String[] args) {
        Integer wrapped = 50;     // autoboxing
        int primitive = wrapped;  // unboxing

        System.out.println("Wrapped Integer object: " + wrapped);
        System.out.println("Primitive int value: " + primitive);
    }
}

/*
Expected Output:
Wrapped Integer object: 50
Primitive int value: 50
*/
```

### Why Wrapper Classes Are Important

* Used in Collections  
Example: ArrayList<Integer> cannot store int directly, only Integer.

* Provide Utility Methods   
e.g. Integer.parseInt("123"), Double.valueOf("4.56")

* Enable Generics and Streams  
Primitive types cannot be used with generics — wrappers make it possible.

* Help in Null Handling   
Wrapper classes can store null, primitives cannot.