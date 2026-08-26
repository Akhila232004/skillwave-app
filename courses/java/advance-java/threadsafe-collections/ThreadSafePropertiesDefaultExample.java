import java.util.Properties;

public class ThreadSafePropertiesDefaultExample {

    public static void main(String[] args) throws InterruptedException {

        // One shared Properties object for the whole program
        Properties sharedConfig = new Properties();

        // Set only one property
        sharedConfig.setProperty("app.name", "Tinitiate School App");
        // NOTE: We are NOT setting "app.theme" here

        // Task for each thread:
        // Read app.name and app.theme (with a default value)
        Runnable readerTask = () -> {
            String threadName = Thread.currentThread().getName();

            for (int i = 1; i <= 3; i++) {
                // Read existing property
                String name = sharedConfig.getProperty("app.name");

                // Read missing property "app.theme"
                // If it is not set, default value "LIGHT" will be returned
                String theme = sharedConfig.getProperty("app.theme", "LIGHT");

                System.out.println(threadName + " -> app.name = " + name
                        + ", app.theme = " + theme);

                try {
                    Thread.sleep(200);  // small delay to see interleaving
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        // Two reader threads sharing the same Properties object
        Thread t1 = new Thread(readerTask, "Reader-1");
        Thread t2 = new Thread(readerTask, "Reader-2");

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("All readers finished.");
    }
}
