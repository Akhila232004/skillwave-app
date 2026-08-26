# Auto Configuration 

**What it is:**
Spring Boot scans the **classpath** and your **`application.*` properties**, then **conditionally creates beans** for common features (web server, JSON, data source, metrics, security, etc.) so you don’t write boilerplate config.

**How it decides (mental model):**

* **Classpath conditions**: “If `spring-web` is present → configure MVC & an embedded server.”
* **Property conditions**: “If `spring.datasource.url` is set → configure a `DataSource`.”
* **Missing-bean conditions**: “Only create bean X if you didn’t define your own.”
* **Ordering**: Auto-configs run after your `@Configuration` so **your beans win**.

**How to see what happened (two easy ways):**

1. **Quick report in logs**

   * Add in `application.properties`:

     ```properties
     debug=true
     ```
   * Or run with:

     ```bash
     ./mvnw spring-boot:run -Dspring-boot.run.arguments=--debug
     # or
     ./gradlew bootRun --args='--debug'
     ```

   **Expected output:**
   Startup logs include a “**Condition evaluation report**” listing **Positive matches** (applied configs) and **Negative matches** (skipped) with reasons.

2. **Actuator → conditions endpoint**

   * Add dependency: `spring-boot-starter-actuator`
   * In `application.properties`:

     ```properties
     management.endpoints.web.exposure.include=health,info,conditions
     ```
   * Hit: `GET /actuator/conditions`
     **Expected output:**
     JSON showing each auto-configuration class and **why** it was applied or skipped.

**Common examples you’ll notice:**

* Add **Web** starter ⇒ creates **Tomcat server**, **DispatcherServlet**, **JSON message converters**.
* Set **`spring.datasource.*`** + JDBC driver on classpath ⇒ configures **`DataSource`**, **`JdbcTemplate`**, **JPA** (if present).

**How to turn a specific auto-config off:**

* **Annotation way** (compile-time):

  ```java
  @SpringBootApplication(exclude = {
      org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class
  })
  public class App {}
  ```
* **Property way** (runtime):

  ```properties
  spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
  ```

**Expected output:**
No `DataSource` bean created; logs show DataSource auto-config **skipped by exclude**.


## `@SpringBootApplication`

**What it really is:** a **meta-annotation** that bundles:

* `@Configuration` – marks this class as a Java config source
* `@EnableAutoConfiguration` – turns auto-config on
* `@ComponentScan` – scans the **current package and subpackages**

**Placement rule:** put your main class **at the root package** (e.g., `com.example.app`) so scanning sees your controllers/services/repos.

**Minimal app (with a tiny endpoint):**

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}

@RestController
class PingController {
  @GetMapping("/ping")
  String ping() { return "ok"; }
}
```

**Run (wrapper recommended):**

```bash
./mvnw spring-boot:run
# or
./gradlew bootRun
```

> **Expected output:**
Logs show **“Tomcat started on port(s): 8080”** and **“Started DemoApplication …”**.
`GET http://localhost:8080/ping` → response body **`ok`**.

**Useful tweaks on the annotation:**

```java
@SpringBootApplication(
  scanBasePackages = {"com.example.demo","com.tinitiate.shared"},
  exclude = { org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class }
)
```

>**Expected output:**
Beans from both packages are discovered; DataSource auto-config is **excluded**.


## `@EnableAutoConfiguration`

**What it does (alone):**
Activates Boot’s auto-configuration **without** applying `@ComponentScan` or `@Configuration` for you.

**When to use it directly:**

* Very rare in an application (use `@SpringBootApplication`).
* Useful in **library/test slices** or when you’re **building a custom bootstrapping** class.

**Example (manual composition):**

```java
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = "com.example.feature")
public class FeatureOnlyConfig {}
```

> **Expected output:**
Only components under `com.example.feature` are scanned; auto-config runs. No global app scan occurs unless you add it.

**Selective disable (class name form):**

```java
@EnableAutoConfiguration(excludeName = {
  "org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
})
```

>**Expected output:**
Security auto-config is **not applied**; logs show it as **excluded**.



##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|