
##  What is OOP?

Object-Oriented Programming is a way to structure programs around objects—little bundles that keep data (state) together with the actions (behavior) that work on that data.
This bundling makes programs easier to understand, change, and test.

* Class: a blueprint describing what data an object has and what it can do.

* Object: a real thing created from that blueprint at runtime.

> Analogy: A class is the architectural plan; an object is a house built from it.

## Why use OOP at all?

* Clarity: Each class has a focused job. You read less to understand more.

* Safety: Internal details are hidden, so other parts can’t break them accidentally.

* Reuse: Good classes become building blocks you use everywhere.

* Teamwork: Clear contracts (interfaces) let teams build parts independently.

* Testing: Small, well-defined classes are simple to test.

## State & Behavior (the heart of objects)

* State = the facts an object stores (e.g., balance, name, speed).

* Behavior = the operations it offers (e.g., deposit(), enroll(), accelerate()).

> Good design: behavior should protect and make sense of the state (validate inputs, keep rules).

## The Four Pillars — Object-Oriented Programming
* ###  Encapsulation  
* ###  Abstraction  
* ###  Inheritance  
* ###  Polymorphism  

## How Java supports OOP (core language pieces)

* Access modifiers: control visibility (private, default/package, protected, public).
* Helps encapsulation and modular design.

* this & super: refer to the current object and the parent part (for reuse/overrides).

* final: lock things down (fields not reassignable, methods not overridable, classes not extendable).

* Interfaces/abstract classes: give you abstraction points for swapping behavior.

* Constructors: set valid initial state; good place for validation.


##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|