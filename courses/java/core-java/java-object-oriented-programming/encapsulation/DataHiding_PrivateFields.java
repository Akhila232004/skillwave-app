// ==============================================================================
//  Organization : TINITIATE TECHNOLOGIES PVT LTD
//  Website      : tinitiate.com
//  Script Title : Java Tutorial
//  Description  : Data Hiding Private Field
//  Author       : Team Tinitiate
// ==============================================================================



/**
 * Data Hiding = "private fields" + only expose what callers need.
 * Here, password is private; outsiders cannot read or change it directly.
 */
class UserAccount {
    private String username;
    private String passwordHash; // pretend we store a hash, not the raw password

    public UserAccount(String username, String password) {
        this.username = username;
        this.passwordHash = hash(password); // internal detail hidden from callers
    }

    // Only expose a method to check a password; do NOT reveal the actual password
    public boolean checkPassword(String attempt) {
        return passwordHash.equals(hash(attempt));
    }

    public String getUsername() {
        return username;
    }

    // Private helper — callers can't use or depend on this
    private String hash(String s) {
        // toy hash (for demo only!): reverse + length — do NOT use in real apps
        return new StringBuilder(s).reverse().toString() + ":" + s.length();
    }
}

public class DataHiding_PrivateFields {
    public static void main(String[] args) {
        UserAccount u = new UserAccount("asha", "secret123");

        System.out.println(u.getUsername());          // asha
        System.out.println(u.checkPassword("oops"));  // false
        System.out.println(u.checkPassword("secret123")); // true

        // System.out.println(u.passwordHash); // ❌ can't access (private)
    }
}
