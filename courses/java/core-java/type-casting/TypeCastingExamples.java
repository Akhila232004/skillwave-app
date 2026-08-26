// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Type Casting Examples
//  Author       : Team Tinitiate
// ==============================================================================


// File: TypeCastingExamples.java
import java.math.BigDecimal;

public class TypeCastingExamples {

    public static void main(String[] args) {
        System.out.println("=== 1) Widening (automatic) ===");
        widening();

        System.out.println("\n=== 2) Narrowing (explicit) ===");
        narrowing();

        System.out.println("\n=== 3) Truncation vs Rounding ===");
        truncationVsRounding();

        System.out.println("\n=== 4) Numeric Promotion in Expressions ===");
        numericPromotion();

        System.out.println("\n=== 5) Mixed Types in Expressions ===");
        mixedTypes();

        System.out.println("\n=== 6) char ↔ int casting ===");
        charIntCasting();

        System.out.println("\n=== 7) Method Overloading & Casting ===");
        overloadingAndCasting();

        System.out.println("\n=== 8) Object Upcasting & Downcasting ===");
        objectCasting();

        System.out.println("\n=== 9) Edge Cases: byte/short wrap-around ===");
        wrapAround();

        System.out.println("\n=== 10) Money Note: BigDecimal (no casting, for precision) ===");
        moneyNote();
    }

    // 1) Implicit widening: smaller → larger compatible type
    private static void widening() {
        byte b = 42;
        short s = b;             // byte -> short
        int i = s;               // short -> int
        long L = i;              // int -> long
        float f = L;             // long -> float (allowed; may lose fractional precision if it existed)
        double d = f;            // float -> double

        char c = 'A';
        int code = c;            // char -> int (65)

        System.out.println("byte b = 42 → short s = " + s);
        System.out.println("int i = " + i + ", long L = " + L);
        System.out.println("float f = " + f + ", double d = " + d);
        System.out.println("char 'A' → int code = " + code);
    }

    // 2) Explicit narrowing: larger → smaller (may lose info)
    private static void narrowing() {
        double d = 123.987;
        int i = (int) d;         // 123 (fraction truncated)
        long big = 3_000_000_000L;
        int overflowed = (int) big; // overflow into int range
        int big2 = 260;
        byte by = (byte) big2;   // 260 mod 256 = 4 (wrap-around to 4)

        System.out.println("double 123.987 → (int) = " + i);
        System.out.println("long 3_000_000_000 → (int) = " + overflowed);
        System.out.println("int 260 → (byte) = " + by);
    }

    // 3) Truncation (casts) vs rounding (Math.*)
    private static void truncationVsRounding() {
        double x = 9.99;
        double y = -2.7;

        int truncX = (int) x;           // 9
        long truncY = (long) y;         // -2 (toward zero)

        long roundX = Math.round(x);    // 10
        long roundY = Math.round(y);    // -3

        double floorX = Math.floor(x);  // 9.0
        double ceilX  = Math.ceil(x);   // 10.0

        System.out.println("(int) 9.99 → " + truncX + " | Math.round(9.99) → " + roundX);
        System.out.println("(long) -2.7 → " + truncY + " | Math.round(-2.7) → " + roundY);
        System.out.println("floor(9.99) → " + floorX + " | ceil(9.99) → " + ceilX);
    }

    // 4) Numeric promotion: byte/short → int during arithmetic
    private static void numericPromotion() {
        byte a = 100, b = 27;
        // byte sum = a + b; // compile error: a+b becomes int
        byte sum = (byte) (a + b);      // 127
        byte sumOverflow = (byte) (a + 50); // 150 → wraps to -106 in byte

        short s1 = 1200, s2 = 400;
        // short sSum = s1 + s2; // compile error: int
        short sSum = (short) (s1 + s2); // 1600

        System.out.println("byte 100 + 27 → (byte)(a+b) = " + sum);
        System.out.println("byte 100 + 50 → overflow to " + sumOverflow);
        System.out.println("short 1200 + 400 → (short) = " + sSum);
    }

    // 5) Mixed types: results widen to the largest type involved
    private static void mixedTypes() {
        int i = 5;
        double d = 2.5;
        double r1 = i + d; // int → double
        long L = 1_000_000_000L;
        float f = 3.14f;
        float r2 = L + f;  // long → float
        double r3 = 1.0f + 1L + 1; // becomes double at the end

        System.out.println("int + double → " + r1);
        System.out.println("long + float → " + r2);
        System.out.println("float + long + int → " + r3);
    }

    // 6) char ↔ int casting
    private static void charIntCasting() {
        char c1 = 'B';
        int code1 = c1;              // widening
        int code2 = 8364;            // €
        char c2 = (char) code2;      // explicit; may or may not display depending on font
        int code3 = '₹';
        char c3 = (char) 9733;       // '★' (black star)

        System.out.println("char 'B' → int = " + code1);
        System.out.println("int 8364 → char = " + c2);
        System.out.println("char '₹' → int = " + code3);
        System.out.println("int 9733 → char = " + c3);
    }

    // 7) Overloading: which method is chosen depends on types (and casts)
    private static void overloadingAndCasting() {
        f(5);         // exact int → prints "int"
        f(5L);        // long literal → prints "long"
        f((short) 5); // short widens to int (no short overload) → "int"
        f((double)5); // explicit → "double"

        // Ambiguity can happen with some combos; be explicit if needed.
    }
    private static void f(int x)    { System.out.println("f(int): " + x); }
    private static void f(long x)   { System.out.println("f(long): " + x); }
    private static void f(double x) { System.out.println("f(double): " + x); }

    // 8) Object upcasting & downcasting
    private static void objectCasting() {
        Animal a = new Dog();   // upcast (automatic, safe)
        a.speak();

        if (a instanceof Dog d) { // pattern matching since Java 16+
            d.bark();
        }

        Animal x = new Animal();
        try {
            Dog wrong = (Dog) x; // compiles, but runtime ClassCastException
            wrong.bark();
        } catch (ClassCastException e) {
            System.out.println("Downcast failed: " + e.getClass().getSimpleName());
        }
    }
    static class Animal { void speak() { System.out.println("Animal..."); } }
    static class Dog extends Animal { void bark() { System.out.println("Woof!"); } }

    // 9) Wrap-around examples (byte/short)
    private static void wrapAround() {
        int n1 = 128;
        byte b1 = (byte) n1;   // 128 → -128
        int n2 = 255;
        byte b2 = (byte) n2;   // 255 → -1
        int n3 = 65_535;       // 0xFFFF
        short s1 = (short) n3; // 65535 → -1

        System.out.println("int 128 → (byte) = " + b1);
        System.out.println("int 255 → (byte) = " + b2);
        System.out.println("int 65535 → (short) = " + s1);
    }

    // 10) Money precision note (no casting here, just best practice)
    private static void moneyNote() {
        double price = 0.1 + 0.2; // floating point surprise
        System.out.println("double 0.1 + 0.2 = " + price + " (floating point)");

        BigDecimal p = new BigDecimal("0.10").add(new BigDecimal("0.20"));
        System.out.println("BigDecimal 0.10 + 0.20 = " + p);
    }
}
