// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multilevel Inheritance Simple Example
//  Author       : Team Tinitiate
// ==============================================================================




/**
 * Multilevel Inheritance (simple)
 * -------------------------------
 * Vehicle  -> Car -> ElectricCar
 *  ^base     ^adds honk()  ^adds charge() and overrides start()
 *
 * Key idea: ElectricCar inherits everything from Car AND (indirectly) Vehicle.
 */
public class MultilevelInheritance_SimpleExample {
    public static void main(String[] args) {
        ElectricCar ec = new ElectricCar();

        // Has all behaviors from the chain:
        ec.start();   // ElectricCar's overridden start()
        ec.honk();    // from Car
        ec.charge();  // from ElectricCar
        ec.stop();    // from Vehicle

        // Polymorphism across the chain
        Car carRef = new ElectricCar();
        carRef.honk();   // Car method
        carRef.start();  // calls ElectricCar.start() (runtime dispatch)

        Vehicle vRef = ec; 
        vRef.start();    // still ElectricCar.start()
    }
}

/* Level A (base) */
class Vehicle {
    void start() {
        System.out.println("Vehicle: engine started");
    }
    void stop() {
        System.out.println("Vehicle: engine stopped");
    }
}

/* Level B (inherits Vehicle) */
class Car extends Vehicle {
    void honk() {
        System.out.println("Car: honk!");
    }
}

/* Level C (inherits Car) */
class ElectricCar extends Car {
    @Override
    void start() {
        System.out.println("ElectricCar: silent start");
    }
    void charge() {
        System.out.println("ElectricCar: charging battery");
    }
}
