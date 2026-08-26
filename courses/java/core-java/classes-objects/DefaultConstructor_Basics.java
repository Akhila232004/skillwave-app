// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================


/**
 * WHAT THIS CODE IS ABOUT
 * -----------------------
 * Shows the idea of a *default (no-arg) constructor*:
 * 1) When you don't write any constructor, Java gives you one automatically.
 * 2) You can also write your own no-arg constructor to set better defaults.
 */

// Case 1: we write NO constructor → Java provides an implicit no-arg constructor
class BoxImplicit {
    int width;   // default 0
    int height;  // default 0
}

// Case 2: we write our own no-arg constructor to set nicer defaults
class BoxExplicit {
    int width;
    int height;

    BoxExplicit() {          // our explicit no-arg constructor
        width = 10;          // set friendly defaults
        height = 5;
    }
}

public class DefaultConstructor_Basics {
    public static void main(String[] args) {
        // Implicit default: fields stay at type defaults (0 for int)
        BoxImplicit b1 = new BoxImplicit();
        System.out.println("Implicit Box: w=" + b1.width + ", h=" + b1.height); // 0,0

        // Explicit default: our constructor sets values
        BoxExplicit b2 = new BoxExplicit();
        System.out.println("Explicit Box: w=" + b2.width + ", h=" + b2.height); // 10,5
    }
}
