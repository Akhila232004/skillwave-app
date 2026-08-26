// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Generic Class  
//  Author       : Team Tinitiate
// ==============================================================================


// File: GenericClass_StoreExample.java
// 🧠 Topic: Generic Classes
// Demonstrates a simple Generic Class that can store and retrieve any type of item (String, Integer, etc.)

class Store<T> {
    private T item;

    public void setItem(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }
}

public class GenericClass_StoreExample {
    public static void main(String[] args) {
        Store<String> bookStore = new Store<>();
        bookStore.setItem("Java Programming Guide");
        System.out.println("Book: " + bookStore.getItem());

        Store<Integer> numberStore = new Store<>();
        numberStore.setItem(101);
        System.out.println("Store ID: " + numberStore.getItem());
    }
}

/*
Expected Output:
Book: Java Programming Guide
Store ID: 101
*/
