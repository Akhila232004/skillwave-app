// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generics  Upper Bounded Wildcards (? extends T)
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.generics;

// File: UpperBoundWildcards_PrintAnimalsExample.java
// 🧠 Topic: Upper Bounded Wildcards (? extends T)
// Demonstrates reading elements from subclasses using a common base class.

import java.util.*;

class Animal {
    void speak() { System.out.println("Some animal sound"); }
}

class Dog extends Animal {
    void speak() { System.out.print("Bark "); }
}

class Cat extends Animal {
    void speak() { System.out.print("Meow "); }
}

public class UpperBoundWildcards_PrintAnimalsExample {

    // Accepts a list of any subtype of Animal
    static void makeAllSpeak(List<? extends Animal> animals) {
        for (Animal a : animals) {
            a.speak(); // safe: all are Animals
        }
        // animals.add(new Dog()); // ❌ Not allowed
    }

    public static void main(String[] args) {
        List<Dog> dogs = Arrays.asList(new Dog(), new Dog());
        List<Cat> cats = Arrays.asList(new Cat(), new Cat());

        System.out.print("Dogs:");
        makeAllSpeak(dogs);

        System.out.print("Cats:");
        makeAllSpeak(cats);
    }
}

/*
Expected Output:
Dogs:Bark Bark Cats:Meow Meow 
*/
