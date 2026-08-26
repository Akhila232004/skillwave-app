import java.util.Properties;

public class ThreadSafePropertiesWriterReaderExample {

    public static void main(String[] args) throws InterruptedException {

        // One shared Properties object for the whole program.
        Properties sharedConfig = new Properties();

        // Initial configuration.
        sharedConfig.setProperty("app.name", "Tinitiate School App");
        sharedConfig.setProperty("app.mode", "DEV");

        // WRITER TASK:
        // This thread will change the app.mode value a few times.
        Runnable writerTask = () -> {
            String[] modes = {"DEV", "TEST", "PROD"};
            String threadName = Thread.currentThread().getName();

            for (String mode : modes) {
                // We group read + write inside synchronized block
                // to keep them as one atomic (safe) operation.
                synchronized (sharedConfig) {
                    sharedConfig.setProperty("app.mode", mode);
                    System.out.println(threadName + " changed app.mode to: " + mode);
                }

                // Pause so readers get a chance to see each mode.
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // READER TASK:
        // This thread will read and print app.name and app.mode.
        Runnable readerTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 5; i++) {

                // Reading a single property is already synchronized internally.
                String name;
                String mode;

                // Here we also group the two reads, so they are consistent together.
                synchronized (sharedConfig) {
                    name = sharedConfig.getProperty("app.name");
                    mode = sharedConfig.getProperty("app.mode");
                }

                System.out.println(threadName + " sees: app.name = " + name
                        + ", app.mode = " + mode);

                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Create one writer and two readers.
        Thread writer = new Thread(writerTask, "Writer");
        Thread reader1 = new Thread(readerTask, "Reader-1");
        Thread reader2 = new Thread(readerTask, "Reader-2");

        // Start all threads.
        writer.start();
        reader1.start();
        reader2.start();

        // Wait for them to finish.
        writer.join();
        reader1.join();
        reader2.join();

        // Final mode after writer is done
        String finalMode = sharedConfig.getProperty("app.mode");
        System.out.println("Final app.mode = " + finalMode);
    }
}
