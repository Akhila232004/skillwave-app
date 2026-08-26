// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multiple Inheritance Via Interfaces
//  Author       : Team Tinitiate
// ==============================================================================


package com.tinitiate.corejava.javaobjectorientedprogramming.abstraction;

/**
 * MultipleInheritance_Via_Interfaces
 * ----------------------------------
 * Java does NOT allow multiple inheritance of classes,
 * but a class CAN implement multiple INTERFACES (multiple "types").
 *
 * Here: SmartCar implements BOTH Drivable and MusicPlayer.
 */
public class MultipleInheritance_Via_Interfaces {
    public static void main(String[] args) {
        SmartCar car = new SmartCar();
        car.drive();       // from Drivable
        car.playMusic();   // from MusicPlayer

        // Polymorphism: same object viewed through each interface type
        Drivable d = car;   // upcast to Drivable
        d.drive();          // allowed (Drivable has drive)

        MusicPlayer m = car; // upcast to MusicPlayer
        m.playMusic();       // allowed (MusicPlayer has playMusic)

        // d.playMusic();    // ❌ not allowed via Drivable reference
        // m.drive();        // ❌ not allowed via MusicPlayer reference
    }
}

/* Interface 1 */
interface Drivable {
    void drive();
}

/* Interface 2 */
interface MusicPlayer {
    void playMusic();
}

/* One class implements BOTH interfaces (multiple inheritance via interfaces) */
class SmartCar implements Drivable, MusicPlayer {
    public void drive()     { System.out.println("[SmartCar] driving"); }
    public void playMusic() { System.out.println("[SmartCar] playing music"); }
}

/*
Expected output:
[SmartCar] driving
[SmartCar] playing music
[SmartCar] driving
[SmartCar] playing music
*/
