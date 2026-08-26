// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * WHAT THIS CODE IS ABOUT:
 * ------------------------
 * How to CREATE OBJECTS from a class and how each object has its OWN data.
 *
 * KEY IDEAS:
 * - Use "new ClassName()" to make an object.
 * - Each object stores its own copy of the fields (independent state).
 */
class Car {
    String model;
    int speed;

    void show() {
        System.out.println("Car(model=" + model + ", speed=" + speed + ")");
    }
}

public class CreatingObjects_Basics {
    public static void main(String[] args) {
        // Create two independent Car objects from the same Car class
        Car c1 = new Car(); // c1 is a reference pointing to a Car object
        c1.model = "Sedan";
        c1.speed = 60;

        Car c2 = new Car(); // c2 points to a DIFFERENT Car object
        c2.model = "SUV";
        c2.speed = 40;

        // Each object keeps its own data
        c1.show(); // Car(model=Sedan, speed=60)
        c2.show(); // Car(model=SUV,   speed=40)

        // Changing one does not change the other
        c1.speed = 80;
        c1.show(); // Car(model=Sedan, speed=80)
        c2.show(); // Car(model=SUV,   speed=40) ← unchanged
    }
}
