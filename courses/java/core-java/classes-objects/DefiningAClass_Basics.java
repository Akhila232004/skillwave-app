// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Classes Objects
//  Author       : Team Tinitiate
// ==============================================================================

/**
 * WHAT THIS CODE IS ABOUT (Beginner-friendly):
 * -------------------------------------------
 * A "class" is a blueprint. It groups related DATA (fields) and BEHAVIOR (methods).
 * Below, we define a simple class named Student with two fields and one method.
 *
 * KEY IDEAS:
 * - Fields hold data (like name, age).
 * - Methods do actions (like introduce()).
 * - The class alone is just a recipe; we'll make real "objects" from it later.
 */
class Student {
    // ---- FIELDS (data) ----
    String name; // each Student object will have its own "name"
    int age;     // each Student object will have its own "age"

    // ---- METHOD (behavior/action) ----
    void introduce() {
        // "this.name" means: use the name inside THIS object
        System.out.println("Hi, I'm " + this.name + " and I'm " + this.age + " years old.");
    }
}

public class DefiningAClass_Basics {
    public static void main(String[] args) {
        // We can create a Student object to see our class in action,
        // but the main focus here is the definition above.
        Student s = new Student();  // make an object from the Student blueprint
        s.name = "Asha";            // set data into the object's fields
        s.age = 20;
        s.introduce();              // call the object's method → prints a friendly message
    }
}
