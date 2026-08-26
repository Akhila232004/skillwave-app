# Encapsulation
Encapsulation means keeping an object’s data (fields) and the operations that work on that data (methods) together, and controlling how the data is accessed or changed.
It lets the class enforce rules/invariants so objects never slip into an invalid state.

#### Why it matters

* Safety: Prevents accidental misuse (invalid values, broken states).

* Flexibility: You can change internals later without breaking other code.

* Clarity: A small, well-designed API (public methods) makes classes easy to use/test.

* Reusability: Encapsulated classes become reliable building blocks.

#### Example

```java
// Fields are private; class enforces rules via methods (encapsulation).
public class Encapsulation {
    public static void main(String[] args) {
        Student s = new Student();
        s.setId(101);                     // set data safely
        System.out.println("Student ID: " + s.getId());
    }
}

class Student {
    private int id;    // private = hidden data

    public void setId(int value) {   // method to set value
        id = value;
    }

    public int getId() {             // method to get value
        return id;
    }
}
```

## Data Hiding

Data hiding is how we implement encapsulation: we hide fields using access modifiers and expose only a minimal, safe API.

* Access modifiers (quick memory)

* private → only inside the class (best default for fields)

* (default/package) → same package

* protected → package + subclasses

* public → everywhere (keep this surface small)


#### Example

```java
// File: device/Sensor.java (assume this class is in package 'device')
package device;

public class Sensor {
    private double reading;          // private: only inside this class

    // package-private: visible to classes in 'device' package
    double raw() {
        return reading;
    }

    // protected: visible in same package + subclasses (even in other packages)
    protected void calibrate(double offset) {
        reading += offset;
    }

    // public: small, safe API surface
    public double value() {
        // simple rounding without any imports
        return ((int) (reading * 10 + 0.5)) / 10.0;
    }
}

// Usage sketch (also in package device):
// Sensor s = new Sensor();
// s.calibrate(2.3);          // allowed (same package → protected ok)
// System.out.println(s.value()); // public API
// s.reading = 123;          // ❌ not allowed (private)

```

## Getters & Setters
Getters and setters are small methods that read and update an object’s private fields. They’re the most common way to enforce encapsulation in Java and to give frameworks (Spring, Jackson, JPA/Hibernate) a stable way to access data.

* #### Getter : returns a field’s value.  
     Naming: getXyz(); for booleans often isXyz().

* #### Setter: validates/transforms input and updates the field.  
    Naming: setXyz(T value).

### Why they matter

* Control & validation: keep the object in a valid state (e.g., age ≥ 0).

* Abstraction: you can change internals later without breaking callers.

* Framework compatibility: many libraries rely on JavaBean conventions.

* Read-only or write-controlled access: expose a getter but no setter.

```java
// example
public class User {
    private String email;          // hidden state
    private int age;

    public String getEmail() {     // getter
        return email;
    }
    public void setEmail(String email) {  // setter with simple guard
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email");
        }
        this.email = email;
    }

    public int getAge() {          // read-only outside? Then omit setter.
        return age;
    }
    public void setAge(int age) {
        if (age < 0) throw new IllegalArgumentException("Age cannot be negative");
        this.age = age;
    }
}
```

## Access modifiers 

Access modifiers control a contract of visibility—who is allowed to see and use a type or member. By restricting visibility, you:

* keep invariants safe (fewer places can mutate state),

* reduce coupling (only intended APIs are exposed),

* make refactoring easier (internals can change without breaking users).



Modifier	| Same class	| Same package	| Subclass (diff pkg) 	| Everywhere |
|------------|--------------|---------------|-----------------------|------------|
| private    | ✅	| ❌	  | ❌    |❌  |
|(package-private)  (no keyword)	 | ✅	| ✅	 |❌  |	❌ |
| protected	 | ✅ 	| ✅	  | ✅ (via inheritance)	     |   ❌
| public	 | ✅	| ✅	  | ✅	                     | ✅ |


## Best Practices — points

* Default to least visibility: make fields private, helpers package-private, and expose a minimal public API.

* Prefer intention-revealing methods over raw setters: e.g., deposit(), withdraw() instead of setBalance().

* Validate at boundaries: enforce invariants in constructors/factories/setters; reject invalid input early.

* Do not leak mutability: never return internal collections/arrays; use List.copyOf(...), unmodifiable views, or return clone() for arrays.

* Use final for invariants: mark IDs, creation timestamps, and other never-changing fields as final.

* Minimize setters on domain objects: model state changes through behavior; consider immutability or “withX(..)” methods.

* Separate DTOs from domain models: DTOs can have simple getters/setters for JPA/Jackson; keep domain rules in domain classes.

* Be careful with protected: it’s visible to the whole package and subclasses; prefer private + explicit extension points.

* Avoid exposing collections directly: no public List<> field and avoid setItems(List) that bypasses rules.

* Fail fast with clear exceptions: IllegalArgumentException / IllegalStateException with helpful messages.

* Document contracts: note nullability, valid ranges, units, side effects, and (if relevant) thread-safety.

* Use value types for precise domains: BigDecimal for money, dedicated types like Email, PhoneNumber for validation/clarity.

* Mind thread-safety: prefer immutable objects; avoid shared mutable state or guard it properly.

* Keep packages as module boundaries: hide implementation with package-private classes; expose only stable facades/interfaces.

##### [Back To Contents](../../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|