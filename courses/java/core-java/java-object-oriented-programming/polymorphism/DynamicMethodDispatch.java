// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Dynamic Method Dispatch
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Dynamic Method Dispatch
 * -----------------------
 * The method that gets executed is decided at runtime
 * based on the object's actual type (not the reference type).
 */
public class DynamicMethodDispatch {
    public static void main(String[] args) {
        Shape s;
        s = new Circle();
        s.draw();

        s = new Square();
        s.draw();
    }
}

class Shape {
    void draw() {
        System.out.println("Drawing a shape");
    }
}

class Circle extends Shape {
    void draw() {
        System.out.println("Drawing a circle");
    }
}

class Square extends Shape {
    void draw() {
        System.out.println("Drawing a square");
    }
}

/*
Expected output:
Drawing a circle
Drawing a square
*/
