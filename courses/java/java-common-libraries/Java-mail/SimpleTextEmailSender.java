// // JavaMailSmtpConfigDemo.java
// //
// // Demonstrates only SMTP configuration and Session creation.
// // Useful as a teaching example for:
// //  - host, port, username, password
// //  - Properties
// //  - Session with Authenticator

// import java.util.Properties;
// import javax.mail.Authenticator;
// import javax.mail.PasswordAuthentication;
// import javax.mail.Session;

// public class JavaMailSmtpConfigDemo {

//     public static void main(String[] args) {

//         // SMTP server details
//         String host = "smtp.example.com";
//         int port = 587;
//         String username = "your-email@example.com";
//         String password = "your-email-password";

//         // Set SMTP properties
//         Properties props = new Properties();
//         props.put("mail.smtp.host", host);
//         props.put("mail.smtp.port", String.valueOf(port));
//         props.put("mail.smtp.auth", "true");
//         props.put("mail.smtp.starttls.enable", "true");

//         // Create Session with Authenticator
//         Session session = Session.getInstance(props, new Authenticator() {
//             @Override
//             protected PasswordAuthentication getPasswordAuthentication() {
//                 return new PasswordAuthentication(username, password);
//             }
//         });

//         System.out.println("SMTP configuration and JavaMail Session created successfully.");
//     }
// }
