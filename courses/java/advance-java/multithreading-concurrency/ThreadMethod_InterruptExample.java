// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Multithreading Concurrency
//  Author       : Team Tinitiate
// ==============================================================================



// File: ThreadMethod_InterruptExample.java
// Topic: Thread.interrupt()
// Demonstrates stopping a thread gracefully when requested.

class DownloadTask extends Thread {
    public void run() {
        try {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Downloading file " + i);
                Thread.sleep(1000); // simulate download time
            }
        } catch (InterruptedException e) {
            System.out.println("Download was interrupted. Stopping...");
        }
    }
}

public class ThreadMethod_InterruptExample {
    public static void main(String[] args) {
        DownloadTask download = new DownloadTask();
        download.start();

        try {
            Thread.sleep(2500); // Let the download run for a while
        } catch (InterruptedException e) {}

        download.interrupt(); // Interrupt the download thread
    }
}

/*
Expected Output:
Downloading file 1
Downloading file 2
Downloading file 3
Download was interrupted. Stopping...
*/
