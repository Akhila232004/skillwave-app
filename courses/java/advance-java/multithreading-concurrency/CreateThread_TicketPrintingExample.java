// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: CreateThread_TicketPrintingExample.java
// Topic: Creating Threads (Extending Thread Class)
// Demonstrates how to create threads by extending the Thread class.
// Each thread simulates printing tickets for a different transport.

class TicketPrinter extends Thread {
    private String ticketType;

    public TicketPrinter(String ticketType) {
        this.ticketType = ticketType;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(ticketType + " Ticket #" + i + " printed by " + getName());
            try {
                Thread.sleep(300); // Simulate time taken to print each ticket
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

public class CreateThread_TicketPrintingExample {
    public static void main(String[] args) {
        TicketPrinter busPrinter = new TicketPrinter("Bus");
        TicketPrinter trainPrinter = new TicketPrinter("Train");

        busPrinter.start();  // starts a new thread
        trainPrinter.start(); // starts another thread

        System.out.println("Ticket printing started... (main thread continues)");
    }
}

/*
Expected Output (order may vary):

Ticket printing started... (main thread continues)
Bus Ticket #1 printed by Thread-0
Train Ticket #1 printed by Thread-1
Bus Ticket #2 printed by Thread-0
Train Ticket #2 printed by Thread-1
Bus Ticket #3 printed by Thread-0
Train Ticket #3 printed by Thread-1
*/
