// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Interface Default And Static Methods
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.abstraction;

/**
 * Interface_DefaultAndStaticMethods
 * ---------------------------------
 * - default method: has a body in the interface; classes inherit it (can override)
 * - static  method: called on the interface type itself (InterfaceName.method())
 */
public class Interface_DefaultAndStaticMethods {
    public static void main(String[] args) {
        Greeter g1 = new CasualGreeter();  // overrides default sayHi()
        Greeter g2 = new FormalGreeter();  // uses interface default sayHi()

        g1.sayHi();                        // calls CasualGreeter.sayHi()
        g2.sayHi();                        // calls Greeter default sayHi()

        // static method on the interface itself (no object needed)
        String shout = Greeter.exclaim("hello");
        System.out.println(shout);
    }
}

/* Contract with a default + a static method */
interface Greeter {
    default void sayHi() {
        System.out.println("[Greeter.default] Hi");
    }
    static String exclaim(String msg) {
        return msg.toUpperCase() + "!";
    }
}

/* Overrides the default sayHi() */
class CasualGreeter implements Greeter {
    @Override
    public void sayHi() {
        System.out.println("[CasualGreeter] Hey!");
    }
}

/* Inherits the default sayHi() as-is */
class FormalGreeter implements Greeter {
    // no override → uses Greeter's default implementation
}

/*
Expected output:
[CasualGreeter] Hey!
[Greeter.default] Hi
HELLO!
*/
