import java.lang.reflect.Field;

// A simple class with a private field
class Account {
    private double balance;

    public Account() {
        this.balance = 0.0; // default balance
    }

    // Normal getter (for comparison)
    public double getBalance() {
        return balance;
    }
}

public class ReflectionAccessPrivateFieldExample {

    public static void main(String[] args) throws Exception {

        // 1. Create a normal Account object
        Account account = new Account();
        System.out.println("Initial balance (via getter): " + account.getBalance());

        // 2. Get the Class object for Account
        Class<?> cls = Account.class;

        // 3. Get the Field object for the private field "balance"
        //    getDeclaredField can access private, protected, and default fields.
        Field balanceField = cls.getDeclaredField("balance");

        // 4. Allow access to the private field
        //    Without this, set/get on a private field will cause IllegalAccessException.
        balanceField.setAccessible(true);

        // 5. Set the private field value using reflection
        balanceField.set(account, 5000.0);  // same as: account.balance = 5000.0 (but we can't write that directly)

        // 6. Read the private field value using reflection
        Object value = balanceField.get(account);
        System.out.println("Balance (via reflection): " + value);

        // 7. Also confirm via normal getter
        System.out.println("Balance (via getter after reflection): " + account.getBalance());
    }
}
