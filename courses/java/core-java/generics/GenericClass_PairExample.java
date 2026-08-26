// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generic Classes with Multiple Type Parameters
//  Author       : Team Tinitiate
// ==============================================================================


// File: GenericClass_PairExample.java
// 🧠 Topic: Generic Classes with Multiple Type Parameters
// Demonstrates how a Generic Class can hold two related values (like key–value or name–value pairs)

class Pair<A, B> {
    private A first;
    private B second;

    public Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    public A getFirst() {
        return first;
    }

    public B getSecond() {
        return second;
    }
}

public class GenericClass_PairExample {
    public static void main(String[] args) {
        Pair<String, Integer> product = new Pair<>("Mobile", 25000);
        System.out.println("Product: " + product.getFirst() + " | Price: ₹" + product.getSecond());

        Pair<String, String> city = new Pair<>("Hyderabad", "India");
        System.out.println("City: " + city.getFirst() + " | Country: " + city.getSecond());
    }
}

/*
Expected Output:
Product: Mobile | Price: ₹25000
City: Hyderabad | Country: India
*/
