## JavaMail (Email API)

### 1. What is JavaMail?

**JavaMail** is a Java library that allows your Java program to **send emails**.

You can think of it like this:

> When *you* send an email, you open Gmail/Outlook and type the message.
> When a **Java program** wants to send an email, it uses **JavaMail** to do the same thing automatically.

Using JavaMail, your program can:

* Send **simple text emails**
* Send **formatted (HTML) emails** with colors, links, etc.
* Send **emails with attachments** (PDF, images, etc.)

You might use JavaMail for:

* Sending an OTP or verification email when a user signs up
* Sending password reset links
* Sending daily/weekly reports from a backend application

JavaMail is **not** an email service by itself.
It is a **tool** that helps your Java code talk to a real email server.

### 2. SMTP Basics (host, port, username, password)

To send an email, JavaMail connects to an **email server** using a standard protocol called **SMTP**
(**S**imple **M**ail **T**ransfer **P**rotocol).

You can imagine:

> SMTP = the rules for how computers send emails to each other.

To use SMTP, your program needs some basic information:

1. **Host**

   * This is the **address of the email server**.
   * Examples:

     * Gmail: `smtp.gmail.com`
     * Outlook: `smtp.office365.com`
     * Company mail: `mail.yourcompany.com` or similar

2. **Port**

   * This is like the **door number** on the server.
   * Common ports for sending emails:

     * `25`  – basic SMTP (often blocked on public networks)
     * `587` – SMTP with TLS encryption (very common)
     * `465` – SMTP with SSL (older style, still used sometimes)

3. **Username**

   * The **login name** for the email account.
   * Usually your email address, for example:
     `yourname@example.com`

4. **Password**

   * The password for that email account.
   * Some providers (like Gmail) may require an **app password** instead of your normal login password.

### How this looks in JavaMail (simple view)

```java
// SMTP settings (these will be specific for each email provider)
String host = "smtp.example.com";              // mail server address
int port = 587;                                // SMTP port
String username = "your-email@example.com";    // email login
String password = "your-email-password";       // email password
```
Adding **JavaMail** to a project means telling your build tool (Maven or Gradle) to download the JavaMail library and make it available to your code.

## What does “adding JavaMail dependency” mean?

JavaMail is not part of core Java.
It lives in an external JAR file (library).

Your project needs this JAR to use classes like:

```java
import javax.mail.Session;
import javax.mail.Message;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
```

Instead of manually downloading and adding the JAR, we declare JavaMail as a **dependency** in:

* `pom.xml` (for Maven projects), or
* `build.gradle` / `build.gradle.kts` (for Gradle projects).

The build tool will:

1. Download the JavaMail JAR (from Maven Central).
2. Put it on the project classpath.
3. Keep track of the version used.

## Adding JavaMail Dependency in Maven

Maven uses a file called `pom.xml`.
Inside it, dependencies are listed in the `<dependencies>` section.

To add JavaMail, put this inside `<dependencies>`:

```xml
<dependencies>

    <!-- JavaMail (javax.mail) dependency -->
    <dependency>
        <!-- Group Id: who provides the library -->
        <groupId>com.sun.mail</groupId>

        <!-- Artifact Id: the library name -->
        <artifactId>javax.mail</artifactId>

        <!-- Version: which JavaMail version to use -->
        <version>1.6.2</version>
    </dependency>

</dependencies>
```

Explanation:

* `groupId` – identifies the provider (`com.sun.mail`)
* `artifactId` – identifies the library (`javax.mail`)
* `version` – specific release (`1.6.2` here as an example)

After saving `pom.xml`:

* In IntelliJ/Eclipse/VS Code, **reload** / **reimport** the Maven project.
* Maven will download the JavaMail JAR automatically.

Now you can use JavaMail classes in your Java code:

```java
import javax.mail.Session;
import javax.mail.Message;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
```

## Adding JavaMail Dependency in Gradle (Groovy DSL)

Gradle (Groovy DSL) uses a file called `build.gradle`.

Inside it, dependencies go inside the `dependencies {}` block.

Add JavaMail like this:

```groovy
dependencies {
    // JavaMail (javax.mail) dependency
    implementation 'com.sun.mail:javax.mail:1.6.2'
}
```

Here the format is:

```text
groupId : artifactId : version
```

So:

* `com.sun.mail` → groupId
* `javax.mail` → artifactId
* `1.6.2` → version

After saving `build.gradle`, **refresh/reload** the Gradle project.
Gradle will download JavaMail and attach it to the classpath.
 
## Adding JavaMail Dependency in Gradle (Kotlin DSL)

If the project uses the Kotlin DSL, the file is `build.gradle.kts`.

Add JavaMail like this:

```kotlin
dependencies {
    // JavaMail (javax.mail) dependency
    implementation("com.sun.mail:javax.mail:1.6.2")
}
```

The meaning is identical to the Groovy example.

## How to confirm JavaMail is added correctly

After adding the dependency and refreshing the project:

1. Create a simple Java class.
2. Try importing JavaMail classes:

```java
import javax.mail.Session;
import javax.mail.Message;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;

public class JavaMailCheck {
    public static void main(String[] args) {
        System.out.println("JavaMail is available!");
    }
}
```

>If there are **no import errors**, the dependency is correctly added 
## Sending a Simple Text Email

Sending a simple text email with JavaMail involves a few clear steps:

1. Configure SMTP properties (server details)
2. Create an authenticated `Session`
3. Create a `Message` (email) object
4. Send the message using `Transport.send()`

This uses the JavaMail classes from the `javax.mail` and `javax.mail.internet` packages.


#### 1. Configure SMTP Properties

The SMTP server details (host, port, authentication, security) are stored in a `Properties` object.

```java
import java.util.Properties;

Properties props = new Properties();
props.put("mail.smtp.host", "smtp.example.com");   // SMTP server address
props.put("mail.smtp.port", "587");                // SMTP port (e.g. 587 for TLS)
props.put("mail.smtp.auth", "true");               // enable username/password
props.put("mail.smtp.starttls.enable", "true");    // enable TLS encryption
```

Replace `smtp.example.com` and the port with the correct values for the mail provider.

---

#### 2. Create an Authenticated Session

A `Session` represents a mail session with the server.
To send mail through an authenticated SMTP server, an `Authenticator` is used.

```java
import javax.mail.Session;
import javax.mail.PasswordAuthentication;
import javax.mail.Authenticator;

// SMTP login credentials
final String username = "your-email@example.com";
final String password = "your-email-password";

// Create mail session with authentication
Session session = Session.getInstance(props, new Authenticator() {
    @Override
    protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(username, password);
    }
});
```

The `Session` uses the properties and the authenticator to log in to the mail server when sending.

#### 3. Create the Email Message

A simple text email is represented by a `MimeMessage` object.

Steps:

* Set the **from** address
* Set the **recipient(s)**
* Set the **subject**
* Set the **text content**

```java
import javax.mail.Message;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.InternetAddress;

// Create a new email message
Message message = new MimeMessage(session);

// Set the sender address
message.setFrom(new InternetAddress(username));

// Set the recipient address (To)
message.setRecipients(
        Message.RecipientType.TO,
        InternetAddress.parse("receiver@example.com")
);

// Set email subject
message.setSubject("Test Email from Java");

// Set plain text body
message.setText("Hello,\n\nThis is a simple text email sent using JavaMail.\n\nRegards,\nJava Application");
```

For a basic text email, `setText()` is sufficient.

#### 4. Send the Email

`Transport.send(message)` handles the actual sending using the SMTP configuration and session.

```java
import javax.mail.Transport;
import javax.mail.MessagingException;

try {
    Transport.send(message);
    System.out.println("Email sent successfully.");
} catch (MessagingException e) {
    e.printStackTrace();
}
```

### Complete Example: Simple Text Email Sender

```java
import java.util.Properties;
import javax.mail.Session;
import javax.mail.PasswordAuthentication;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Transport;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.InternetAddress;

public class SimpleTextEmailExample {

    public static void main(String[] args) {

        // SMTP server details (replace with actual values)
        final String host = "smtp.example.com";
        final String port = "587";
        final String username = "your-email@example.com";
        final String password = "your-email-password";

        // 1. Set SMTP properties
        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        // 2. Create mail Session with authentication
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // 3. Create the email message
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse("receiver@example.com")
            );
            message.setSubject("Simple Text Email Example");
            message.setText("Hello,\n\nThis is a plain text email sent using JavaMail.\n\nRegards,\nJava Application");

            // 4. Send the email
            Transport.send(message);

            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
```

**Expected output (console):**

```text
Email sent successfully.
```

If SMTP settings or credentials are wrong, a `MessagingException` will be thrown with an error message explaining the problem (authentication failed, connection error, etc.).

### Overview: HTML Emails & Attachments (JavaMail)

When sending emails from Java, plain text is enough for simple notifications.
For real-world applications, it is common to:

* Send **HTML emails** with formatting, colors, links, buttons, etc.
* Add **attachments** such as PDFs, images, reports, or documents.

JavaMail supports both using **MIME** (Multipurpose Internet Mail Extensions).
A single email can contain multiple parts: text, HTML, attachments, inline images, etc.

## 1. HTML Emails

A **plain text** email uses simple text:

```java
message.setText("This is a plain text email.");
```

An **HTML email** uses HTML tags and must be marked with the correct content type (MIME type), usually `"text/html"`.

Example HTML body:

```html
<h1>Welcome!</h1>
<p>Hello <b>User</b>,</p>
<p>Thank you for registering. Click the link below to activate your account:</p>
<a href="https://example.com/activate">Activate Account</a>
```

In JavaMail, you can set this HTML body like this:

```java
String htmlBody =
        "<h1>Welcome!</h1>" +
        "<p>Hello <b>User</b>,</p>" +
        "<p>Thank you for registering. Click the link below to activate your account:</p>" +
        "<a href=\"https://example.com/activate\">Activate Account</a>";

message.setContent(htmlBody, "text/html; charset=utf-8");
```

Key points:

* Use `setContent()` for HTML and specify `"text/html"` as the content type.
* Email clients (Gmail, Outlook, etc.) will render the HTML instead of showing raw tags.
* HTML emails can include:

  * Headings (`<h1>`)
  * Lists (`<ul>`, `<li>`)
  * Tables (`<table>`)
  * Buttons and links (`<a>`)
  * Basic CSS styling (often inline styles)

## 2. Multipart Messages (Body + Attachments)

When you only send plain text or only HTML, you can call `setText()` or `setContent()` directly on the `Message`.

When you want to send:

* HTML content **and**
* One or more **attachments**

you usually create a **multipart** message. A multipart message is a container that holds multiple **body parts**.

Common structure:

* Part 1: Email body (plain text or HTML)
* Part 2, 3, ...: Attachments (files)

In JavaMail:

* Use `MimeBodyPart` for each part (body or attachment)
* Use `MimeMultipart` to combine them

## 3. Adding Attachments

An attachment is typically represented as a `MimeBodyPart` containing a file.

Basic steps:

1. Create a `MimeBodyPart` for the **text or HTML body**
2. Create another `MimeBodyPart` for each **attachment**
3. Add these parts to a `MimeMultipart`
4. Set the `MimeMultipart` as the content of the `Message`

## 4. Example: HTML Email with a PDF Attachment

Below is an example that:

* Sends an **HTML email**
* Attaches a file: `report.pdf`

```java
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.DataHandler;
import javax.activation.FileDataSource;

public class HtmlEmailWithAttachmentExample {

    public static void main(String[] args) {

        final String host = "smtp.example.com";
        final String port = "587";
        final String username = "your-email@example.com";
        final String password = "your-email-password";

        // 1. SMTP properties
        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        // 2. Create session with authentication
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // 3. Create base message
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse("receiver@example.com")
            );
            message.setSubject("Monthly Report");

            // --------- Part 1: HTML Body ---------
            MimeBodyPart htmlBodyPart = new MimeBodyPart();
            String htmlContent =
                    "<h2>Monthly Report</h2>" +
                    "<p>Hello,</p>" +
                    "<p>Please find the attached <b>PDF report</b> for this month.</p>" +
                    "<p>Regards,<br>Java Application</p>";
            htmlBodyPart.setContent(htmlContent, "text/html; charset=utf-8");

            // --------- Part 2: Attachment ---------
            MimeBodyPart attachmentPart = new MimeBodyPart();
            String filePath = "C:/reports/monthly-report.pdf";  // path to file

            FileDataSource source = new FileDataSource(filePath);
            attachmentPart.setDataHandler(new DataHandler(source));
            attachmentPart.setFileName("monthly-report.pdf");  // name shown in email

            // --------- Combine parts into Multipart ---------
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(htmlBodyPart);      // body
            multipart.addBodyPart(attachmentPart);    // attachment

            // Set the multipart content to the message
            message.setContent(multipart);

            // 4. Send message
            Transport.send(message);

            System.out.println("HTML email with attachment sent successfully.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Important points from the example:

* `MimeBodyPart htmlBodyPart` → holds the HTML content.
* `MimeBodyPart attachmentPart` → holds the file attachment.
* `MimeMultipart multipart` → holds both parts.
* `message.setContent(multipart)` → sets the combined content on the message.
