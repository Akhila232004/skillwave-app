# Spring Boot Profiles 

## 1) What are Profiles in Spring Boot?

**Idea:** A “profile” is a named environment (like `dev`, `test`, `prod`) that lets you:

* Load **different configuration** per environment (DB URLs, logging levels, API keys).
* **Enable/disable beans** for specific environments (mock vs real integrations).

**Key terms**

* **Active profiles:** The set of profiles currently in effect (e.g., `dev`).
* **Default profile:** Used when no profile is explicitly active. You can target it via `@Profile("default")`.

**Why profiles?**

* Clean separation of concerns.
* No accidental “prod” settings in local dev.
* Easy to switch with a single flag.

## 2) `@Profile` Annotation (bean selection)

Annotate a **@Configuration class**, **@Component/@Service**, or even a **@Bean method** so it only loads when a profile is active.

**Rules of thumb**

* `@Profile("dev")` → bean is created only when `dev` is active.
* `@Profile({"dev","test"})` → created if **either** `dev` **or** `test` is active.
* `@Profile("!prod")` → created for any profile **except** `prod`.
* Use `@Profile("default")` for the no-profile case.

**Minimal example (teaching demo)**

```java
// Common contract
public interface Notifier { String send(String msg); }

// Dev bean (console)
@org.springframework.stereotype.Service
@org.springframework.context.annotation.Profile("dev")
class ConsoleNotifier implements Notifier {
  public String send(String msg) { return "[DEV] " + msg; }
}

// Prod bean (e.g., SMTP)
@org.springframework.stereotype.Service
@org.springframework.context.annotation.Profile("prod")
class SmtpNotifier implements Notifier {
  public String send(String msg) { return "[PROD] Email: " + msg; }
}

// A REST endpoint consuming the profile-specific bean
@org.springframework.web.bind.annotation.RestController
class DemoController {
  private final Notifier notifier;
  DemoController(Notifier notifier) { this.notifier = notifier; }

  @org.springframework.web.bind.annotation.GetMapping("/ping")
  public String ping() { return notifier.send("pong"); }
}
```

**Expected output**

* Run with `dev` → `GET /ping` responds: `"[DEV] pong"`
* Run with `prod` → `GET /ping` responds: `"[PROD] Email: pong"`

**For tests**

* Use `@ActiveProfiles("test")` on test classes to activate test-only beans/config.


## 3) `application-{profile}.yml` (profile-specific config files)

You can keep config cleanly split into **one file per profile**. Spring Boot will **auto-load** the file that matches an active profile.

**File layout**

```
src/main/resources/
  application.yml                # shared defaults
  application-dev.yml            # only when 'dev' is active
  application-test.yml           # only when 'test' is active
  application-prod.yml           # only when 'prod' is active
```

**Example contents**

`application.yml` (shared defaults)

```yaml
spring:
  application:
    name: demo-app
logging:
  level:
    root: INFO
```

`application-dev.yml`

```yaml
server:
  port: 8081
spring:
  datasource:
    url: jdbc:h2:mem:demo;DB_CLOSE_DELAY=-1
    username: sa
    password: ""
logging:
  level:
    com.example: DEBUG
```

`application-prod.yml`

```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/app
    username: ${DB_USER}
    password: ${DB_PASSWORD}
logging:
  level:
    root: WARN
```

**Expected behavior**

* With `dev` active, app runs on **8081**, uses **H2**, sets **DEBUG** for `com.example`.
* With `prod` active, app runs on **8080**, uses **PostgreSQL**, **WARN** root logging.

### Alternative: single `application.yml` with profile documents

Prefer this if you want everything in one file:

```yaml
# common
spring:
  application:
    name: demo-app
---
# dev
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8081
logging.level.com.example: DEBUG
---
# prod
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 8080
logging.level.root: WARN
```

## 4) Active Profiles (how to set and how precedence works)

### How to activate profiles

Pick **one** of these per run:

* **Command line** (most common):

  * `java -jar app.jar --spring.profiles.active=dev`
* **JVM system property**:

  * `java -Dspring.profiles.active=dev -jar app.jar`
* **Environment variable**:

  * `SPRING_PROFILES_ACTIVE=dev` then run your app normally
* **Programmatic** (rare; for bootstrapping):

  ```java
  new SpringApplicationBuilder(DemoApplication.class)
      .profiles("dev")
      .run(args);
  ```
* **Tests**:

  * `@org.springframework.test.context.ActiveProfiles("test")`

### Multiple profiles at once

* You can list several (comma-separated): `--spring.profiles.active=dev,cloud`
* **Property override rule:** If the same property appears in multiple active profiles, **the later profile wins** (e.g., `dev,cloud` → `cloud` overrides `dev` for clashes).

### Profile groups (handy for bundles)

Define a **group** that turns on multiple profiles together:

```yaml
spring:
  profiles:
    group:
      local: [dev, h2]
      prodAll: [prod, metrics, aws]
```

Now `--spring.profiles.active=local` activates `dev` + `h2`.

### How to see what’s active

* Startup logs print active profiles, e.g., `The following profiles are active: dev`
* Programmatically: `Environment#getActiveProfiles()`
* With Actuator: check `/actuator/env` or `/actuator/configprops` (if enabled)

## Quick Classroom Lab (10 minutes)

1. Add the `Notifier` example above.
2. Create `application-dev.yml` and `application-prod.yml` with different `server.port`.
3. Run:

   * `./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"`
   * `./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"`
4. Hit `/ping` and observe different responses and ports.

**Expected outcome**

* Students see both **config overrides** and **bean swapping** in action.

If you want, I can extend this into slides with speaker notes (and small exercises) or add the **External Configuration & Secrets** section next.


# Spring Boot — External Configuration 

External configuration lets you change an app’s behavior **without** changing code. In Spring Boot, “properties” can come from many places; the three you asked about are core: **Environment Variables**, **Command-Line Arguments**, and **System Properties**.

## How Spring resolves properties 

* Spring aggregates many **PropertySources** into a single `Environment`.
* When the same key appears in multiple sources, **the one with higher precedence wins**.
* For the three sources in scope here, the usual practical precedence is:

**Command-Line Arguments 〉System Properties 〉Environment Variables**

(There are other sources—`application.yml`, profile files, `@TestPropertySource`, etc.—but we’ll ignore them here per your request.)

## Relaxed binding (applies to all three)

Spring Boot’s binder is **case-insensitive** and **separator-agnostic**:

* `spring.application.name`, `spring_application_name`, `SPRING_APPLICATION_NAME`, and `springApplicationName` all bind to the same target.
* List/array/map binding works with indexed keys: `app.items[0]=A`, `APP_ITEMS_0=A`.

## 1) Environment Variables

### What they are

Key–value pairs provided by the **operating system or container** (Docker/Kubernetes). Spring reads them at startup and exposes them via the `Environment`.

### Naming rules & mapping

* Prefer **UPPER_SNAKE_CASE** with underscores.
  Example: `SPRING_APPLICATION_NAME=orders-api` → binds to `spring.application.name`.
* Dots and hyphens in property names typically become underscores in env vars:
  `server.port` → env var `SERVER_PORT`
  `management.endpoints.web.exposure.include` → `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE`
* Indexed/list entries:
  `SPRING_DATASOURCE_URLS_0=jdbc:...` ↔ `spring.datasource.urls[0]`

### Precedence 

Lower than Command-Line and System Properties.

### Typical use cases

* **12-factor apps**: pass credentials, URLs, feature flags per environment.
* **Containers & K8s**: inject via `env:` (K8s) or `-e` (Docker).
* **Secrets**: reference secrets from the platform’s secret store (K8s Secrets, ECS, etc.).

### Pros / Cons

* ✅ Easy to supply per environment, good for containers.
* ✅ Keeps secrets out of source control.
* ❗ Can be hard to discover/debug if scattered across deployment layers.
* ❗ OS-level scoping means you must manage naming collisions carefully.

### Debugging tips

* Enable Actuator and inspect `/actuator/env` (secure this endpoint in real apps).
* Log the effective value on startup (e.g., print `Environment#getProperty(...)` early).

## 2) Command-Line Arguments

### What they are

Arguments passed to your application **process** at launch. Spring maps any argument of the form `--key=value` into the `Environment`.

### Syntax

* **Preferred:** `--server.port=8081 --spring.profiles.active=prod`
* Multiple occurrences of the same key → last one wins.
* Non `--key=value` tokens are ignored by Spring’s property binding.

### Precedence (within your three)

**Highest** among the three. Anything you pass here will override system props and env vars for the same key.

### Typical use cases

* One-off overrides in CI/CD pipelines or during local testing.
* Toggling feature flags or ports quickly without touching env or files.
* Passing ephemeral values (e.g., `--logging.level.root=DEBUG` for a single run).

### Control

* You can disable command-line binding with `SpringApplication.setAddCommandLineProperties(false)` if you don’t want args to influence configuration.

### Pros / Cons

* ✅ Very explicit, great for ad-hoc overrides.
* ✅ Clear audit trail in deployment scripts.
* ❗ Easy to forget in scripts; can accidentally mask upstream configuration.

### Debugging tips

* Print `args` on startup for traceability.
* In containerized runs, surface the exact command used to launch the JVM.

## 3) System Properties (JVM `-D`)

### What they are

Key–value pairs supplied to the **JVM** via `-Dkey=value` or set programmatically (before the context starts) with `System.setProperty`.

### Syntax

* Launch time: `java -Dserver.port=8082 -Dspring.profiles.active=staging -jar app.jar`
* Programmatic (early):

  ```java
  public static void main(String[] args) {
    System.setProperty("server.port", "8082");
    SpringApplication.run(App.class, args);
  }
  ```

### Precedence (within your three)

Between the two: **lower than command-line**, **higher than env vars**.

### Typical use cases

* JVM-level tuning & proxies: `-Dhttps.proxyHost`, `-Dfile.encoding`, `-Duser.timezone`.
* Setting Boot properties from launchers/wrappers where `-D` is conventional.

### Pros / Cons

* ✅ Works uniformly across OSes and tools that already pass `-D` flags.
* ✅ Easy to keep alongside other JVM settings.
* ❗ Can be overridden by command-line args if both are present.
* ❗ Less visible in container orchestrators compared to env vars.

### Debugging tips

* Print out selected `System.getProperties()` at startup (redact sensitive values).
* Ensure `-D` flags are actually reaching the final Java process in layered scripts.

## Cross-cutting behaviors & best practices

### Property placeholders & defaults

* Anywhere you can write a property, you can reference another with a default:

  * `${SOME_ENV_VAR:defaultValue}`
  * Works in `application.yml`, system properties, or even command-line if the shell expands first.
* Useful to combine sources, e.g., keep a sane default in code or files, but allow env to override.

### Type conversion

* Spring converts strings to target types automatically (Boolean, int, Duration like `10s`, DataSize like `256MB`, enums).
* If binding fails, you’ll get a clear error at startup for `@ConfigurationProperties` beans—good for early feedback.

### Security & secrets

* Prefer **environment variables** or platform secret stores over committing secrets to repo.
* Avoid printing secrets in logs or exposing them via Actuator.
* For advanced setups, integrate a secret manager (e.g., HashiCorp Vault, AWS Secrets Manager) and map secrets into properties.

### Observability & troubleshooting

* Add an **“effective configuration”** log at startup (excluding secrets) to reduce ambiguity.
* Keep `/actuator/configprops` and `/actuator/env` locked down but available to operators.

### Containers & Kubernetes

* Use **ConfigMaps** for non-secret config and **Secrets** for sensitive values.
* Mount them as env vars for simplicity; or as files and import them with `spring.config.import` (outside the scope of this section).
* Prefer env vars for dynamic per-pod overrides (scaling patterns).

## Mini reference (examples in each category)

> **Environment Variables**
> `SERVER_PORT=8080`
> `SPRING_APPLICATION_NAME=orders-api`
> `MANAGEMENT_ENDPOINTS_WEB_EXPOSURE_INCLUDE=health,info,prometheus`

> **Command-Line**
> `java -jar app.jar --server.port=9090 --logging.level.root=DEBUG`

> **System Properties**
> `java -Dserver.port=7070 -Duser.timezone=UTC -jar app.jar`

*(All three yield the property `server.port` with different precedence.)*

## Spring Boot — Configuration Management, `@Value`, `@ConfigurationProperties`, and Type-safe Configuration



## 1) Configuration Management 

**Goal:** control an app’s behavior across environments **without changing code**.

### Core ideas

* **Externalized configuration:** Values come from outside your JAR (files, env vars, CLI args, system props, etc.).
* **Property sources:** Spring aggregates many sources into one `Environment`. Higher-precedence sources override lower ones.
* **Relaxed binding:** `spring.application.name`, `SPRING_APPLICATION_NAME`, `spring_application_name` all bind to the same property.
* **Layering & profiles:** Defaults in `application.yml`; override with `application-{profile}.yml`; pick a profile via `spring.profiles.active`.

### The three sources you’ll use constantly

* **Command-line args**: `--server.port=9090` (highest among the three).
* **System properties (JVM -D)**: `-Dserver.port=9090`.
* **Environment variables**: `SERVER_PORT=9090`.

### Good practices

* Keep **defaults** in `application.yml`.
* Use **profiles** for environment deltas (`dev`, `staging`, `prod`).
* Use **env vars** or a **secret manager** for credentials; never commit secrets.
* Prefer **type-safe binding** for groups of settings (see below).


## 2) `@Value` Annotation

**What it is:** Quick way to inject a single value from the `Environment` into a bean field/constructor parameter.

### Syntax patterns

* Property placeholder with default: `@Value("${app.title:MyApp}")`
* SpEL (be careful): `@Value("#{2 * 1024}")`
* Works on fields, constructors, and setters.

### When to use

* Simple, **one-off** values (e.g., a banner string, toggle).
* Avoid for large groups—prefer `@ConfigurationProperties`.

### Pitfalls

* Harder to manage/validate at scale (scattered strings).
* Missing property without a default → startup failure.
* Overuse of SpEL hurts readability and testability.

#### Minimal example

```java
// src/main/java/com/example/demo/BannerController.java
package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class BannerController {

  @Value("${app.banner:Welcome to Demo!}")
  private String banner;

  @Value("${server.port:8080}")
  private int port;

  @GetMapping("/banner")
  public String banner() {
    return banner + " (port=" + port + ")";
  }
}
```

**Expected output**

* Default run: `Welcome to Demo! (port=8080)`
* With CLI: `--app.banner="Hello" --server.port=9000` → `Hello (port=9000)`

## 3) `@ConfigurationProperties`

**What it is:** Bind a **hierarchical block** of properties into a **strongly-typed** bean. Best for “real” configuration.

### Why it’s better for groups

* **Type-safe** (lists, maps, enums, `Duration`, `DataSize`, nested classes).
* **Centralized** (one class describes the contract).
* Supports **validation** with Jakarta Bean Validation.
* IDE completion via **configuration metadata**.

### How to register

* Annotate the class: `@ConfigurationProperties(prefix = "app")`
* Register via either:

  * `@EnableConfigurationProperties(AppProps.class)` on your `@SpringBootApplication`, or
  * `@ConfigurationPropertiesScan` on your main class (and keep the props class as a plain class), or
  * add `@Component` on the props class (okay for small apps).

> For constructor-binding/immutability, use a **record** or a class with final fields and a constructor.

#### Example: nested, validated, type-safe config

**`application.yml`**

```yaml
app:
  name: demo-service
  region: ap-south-1
  feature-x-enabled: false
  timeout: 5s        # java.time.Duration
  upload-max: 16MB   # org.springframework.util.unit.DataSize
  datasource:
    url: jdbc:postgresql://localhost:5432/demo
    user: demo
    pool:
      min: 2
      max: 10
  tags:
    - alpha
    - beta
```

**`AppProperties.java` (immutable with record)**

```java
// src/main/java/com/example/demo/config/AppProperties.java
package com.example.demo.config;

import jakarta.validation.constraints.*;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DataSizeUnit;
import org.springframework.util.unit.DataSize;
import org.springframework.util.unit.DataUnit;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
    @NotBlank String name,
    @NotBlank String region,
    boolean featureXEnabled,
    @NotNull Duration timeout,
    @NotNull @DataSizeUnit(DataUnit.MEGABYTES) DataSize uploadMax,
    Datasource datasource,
    List<@NotBlank String> tags
) {
  public static record Datasource(
      @NotBlank String url,
      @NotBlank String user,
      Pool pool,
      Map<String,String> props // optional free-form
  ) {}

  public static record Pool(
      @Min(1) int min,
      @Min(1) @Max(200) int max
  ) {}
}
```

**`DemoApplication.java`**

```java
// src/main/java/com/example/demo/DemoApplication.java
package com.example.demo;

import com.example.demo.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
```

**Consumer (read the bound config)**

```java
// src/main/java/com/example/demo/WhoAmIController.java
package com.example.demo;

import com.example.demo.config.AppProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
class WhoAmIController {
  private final AppProperties props;

  WhoAmIController(AppProperties props) {
    this.props = props;
  }

  @GetMapping("/whoami")
  Map<String, Object> who() {
    return Map.of(
      "name", props.name(),
      "region", props.region(),
      "featureXEnabled", props.featureXEnabled(),
      "timeoutSeconds", props.timeout().toSeconds(),
      "uploadMaxMB", props.uploadMax().toMegabytes(),
      "datasourceUrl", props.datasource().url(),
      "pool", Map.of("min", props.datasource().pool().min(),
                     "max", props.datasource().pool().max()),
      "tags", props.tags()
    );
  }
}
```

**Expected output**

```json
{
  "name": "demo-service",
  "region": "ap-south-1",
  "featureXEnabled": false,
  "timeoutSeconds": 5,
  "uploadMaxMB": 16,
  "datasourceUrl": "jdbc:postgresql://localhost:5432/demo",
  "pool": {"min": 2, "max": 10},
  "tags": ["alpha", "beta"]
}
```

> **Validation behavior:** If a required field is missing or violates a constraint (e.g., `min=0`), the app **fails fast** at startup with a clear message.

### Enable IDE metadata (strongly recommended)

Add to `pom.xml`:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-configuration-processor</artifactId>
  <optional>true</optional>
</dependency>
```

This generates `META-INF/spring-configuration-metadata.json` so IDEs can autocomplete your `app.*` keys.

## 4) Type-safe Configuration (what it means & how to do it right)

**Definition:** Binding configuration values to well-typed Java fields (not just strings), with compile-time help and startup-time validation.

### Benefits

* **Early failure:** invalid values stop the app at startup.
* **Refactor-friendly:** rename fields safely; IDE finds usages.
* **Self-documenting:** one class shows all available keys.
* **Safer conversions:** `Duration`, `DataSize`, `URI`, `InetAddress`, enums, lists, maps, nested beans.

### Patterns that work in production

* Use **immutable** properties (records or final fields + constructor).
* Keep a **single prefix per domain**: `storage.*`, `auth.*`, `email.*`.
* Add **Jakarta Validation** annotations and include `spring-boot-starter-validation`.
* Set **sane defaults** in code or `application.yml`; override via profiles/env/args.
* Prefer `@ConfigurationProperties` for groups; keep `@Value` for **trivial singles**.

### Quick comparison

| Aspect          | `@Value`             | `@ConfigurationProperties`     |
| --------------- | -------------------- | ------------------------------ |
| Best for        | Single/simple values | Grouped, hierarchical config   |
| Validation      | Manual               | Built-in via Bean Validation   |
| Maintainability | Scattered strings    | Central contract class         |
| IDE metadata    | No                   | Yes (with processor)           |
| Immutability    | Awkward              | Natural (records/constructors) |

# Spring Boot — Secrets Management, `.env` Files, Vault & AWS Secrets Manager

Below is a practical, production-minded guide you can drop into your syllabus, with **folder structures**, **code/config samples**, and **Expected output** under each runnable piece.

## 1) Secrets Management — the essentials

**What counts as a secret?** Passwords, API tokens, DB credentials, signing keys, SSH keys, client secrets, OAuth tokens, JWT signing keys, etc.

**Goals**

* Keep secrets **out of source control**.
* Inject at runtime via **external configuration**.
* Support **rotation** without rebuilds.
* Provide **least privilege** and **auditing**.

**Golden rules**

* Never commit secrets to Git (use `.gitignore`).
* Prefer **env vars** / **secret stores** over plain files.
* Encrypt in transit (TLS) and at rest (KMS or Vault).
* Centralize and automate rotation (Vault dynamic creds, AWS rotation).
* Mask secrets in logs and Actuator.

## 2) Using `.env` files (local development)

> **Note:** Spring Boot does **not** natively parse a `.env` file. You typically **load `.env` into environment variables**, then Spring consumes them like any other env var. This keeps parity with Docker Compose and many CLIs.

### Common ways to use `.env`

**A) Shell load (works everywhere)**

```bash
# scripts/load-env.sh
set -a           # auto-export variables
[ -f .env ] && . ./.env
set +a
exec "$@"        # run the command that follows with env loaded
```

**Run app with .env loaded**

```bash
./scripts/load-env.sh ./mvnw spring-boot:run
```

**B) Docker Compose**

```yaml
# docker-compose.yml
services:
  demo:
    image: eclipse-temurin:21-jre
    env_file: .env
    environment:
      SERVER_PORT: 8080
    volumes:
      - ./target:/app
    command: ["java","-jar","/app/demo.jar"]
```

**C) Optional library**
If you prefer a library to parse `.env` automatically, add a dotenv loader (e.g., `me.paulschwarz:spring-dotenv`). It loads `.env` into the environment early. (Use the latest version.)

### Sample `.env` (do **not** commit)

```
# .env (local only)
APP_DB_URL=jdbc:postgresql://localhost:5432/demo
APP_DB_USER=demo_user
APP_DB_PASSWORD=demo_pwd_123
```

### Bind in Spring (type-safe recommended)

`application.yml`

```yaml
app:
  db:
    url: ${APP_DB_URL:jdbc:postgresql://localhost:5432/default}
    user: ${APP_DB_USER:demo}
    password: ${APP_DB_PASSWORD:change-me}
```

`AppDbProps.java` (type-safe)

```java
package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.db")
public record AppDbProps(String url, String user, String password) {}
```

`DemoApplication.java`

```java
package com.example.demo;

import com.example.demo.config.AppDbProps;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppDbProps.class)
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
```

Controller to view non-sensitive fields (mask passwords!):

```java
// WhoAmIController.java
package com.example.demo;

import com.example.demo.config.AppDbProps;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
class WhoAmIController {
  private final AppDbProps db;
  WhoAmIController(AppDbProps db) { this.db = db; }

  @GetMapping("/whoami")
  Map<String, Object> who() {
    return Map.of(
      "dbUrl", db.url(),
      "dbUser", db.user(),
      "dbPassword", "******" // never echo real secret
    );
  }
}
```

**Expected output**

```json
{
  "dbUrl": "jdbc:postgresql://localhost:5432/demo",
  "dbUser": "demo_user",
  "dbPassword": "******"
}
```

### Minimal folder structure (with `.env`)

```
demo/
├─ .env                    # local only (gitignored)
├─ docker-compose.yml      # optional
├─ pom.xml
├─ scripts/
│  └─ load-env.sh
└─ src/
   ├─ main/java/com/example/demo/...
   └─ main/resources/application.yml
```

## 3) HashiCorp Vault integration (production-grade)

**Why Vault?** Centralized secrets, **dynamic credentials** (DB users per app with TTL), leasing/renewal, policies, audit, transit encryption.

### Add starter (Spring Cloud Vault)

```xml
<!-- pom.xml -->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-vault-config</artifactId>
</dependency>
<!-- Optionally: validation starter if using @Validated on props -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### Two common configuration styles

**A) Modern Config Import (recommended where available)**
`application.yml`

```yaml
spring:
  config:
    import: "vault://"
  cloud:
    vault:
      uri: https://vault.example.com:8200
      scheme: https
      authentication: kubernetes   # or token, approle, etc.
      kubernetes:
        role: demo-app
      kv:
        enabled: true
        backend: secret           # KV mount path
        default-context: application
        profile-separator: ','
      # For token auth:
      # token: ${VAULT_TOKEN:}

# Boot will look up keys like:
# secret/data/application
# secret/data/application,dev   (if 'dev' profile active)
```

**B) Legacy properties style** (still common)
Same keys under `spring.cloud.vault.*` without `spring.config.import`; Vault starter populates PropertySources.

### Example: reading a DB password from Vault

* Write to Vault (one-time):

  ```
  vault kv put secret/application APP_DB_PASSWORD=super-secret
  ```
* In `application.yml`, map to your property:

  ```yaml
  app:
    db:
      password: ${APP_DB_PASSWORD}
  ```

**Expected output (hit `/whoami`)**

```json
{
  "dbUrl": "jdbc:postgresql://localhost:5432/demo",
  "dbUser": "demo_user",
  "dbPassword": "******"
}
```

> **Notes**
>
> * With **dynamic secrets** (e.g., `database/creds/role`), Spring Cloud Vault can auto-renew leases; you bind resulting values the same way.
> * Prefer **Kubernetes auth** in K8s, **AppRole** on VMs, **OIDC/JWT** where available.
> * Lock down `/actuator/env` and avoid logging `Environment`.

## 4) AWS Secrets Manager integration

**Why ASM?** Managed, regional secret store with rotation hooks and **KMS-backed encryption**. Great fit if you’re already on AWS.

### Options to integrate

1. **Spring Cloud AWS (config integration)**
   If you use Spring Cloud AWS’s Secrets Manager/Parameter Store config support, secrets become PropertySources automatically. (Exact keys depend on your Spring Cloud AWS version; common pattern: enable the Secrets Manager config starter and optionally use `spring.config.import` if provided.)

2. **Custom EnvironmentPostProcessor (library-agnostic, very reliable)**
   Fetch the secret with the AWS SDK **before** the context binds configuration, then **inject a PropertySource**.

#### Custom EnvironmentPostProcessor (sample)

**Dependency (AWS SDK v2)**

```xml
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>secretsmanager</artifactId>
</dependency>
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>regions</artifactId>
</dependency>
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
</dependency>
```

**Initializer**

```java
// src/main/java/com/example/demo/aws/AwsSecretsEnvPostProcessor.java
package com.example.demo.aws;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.*;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;

import java.util.Map;

public class AwsSecretsEnvPostProcessor implements EnvironmentPostProcessor, Ordered {

  @Override
  public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication app) {
    String secretName = env.getProperty("aws.secrets.name");   // e.g., demo/app
    if (secretName == null || secretName.isBlank()) return;

    String region = env.getProperty("aws.region", "ap-south-1");
    try (SecretsManagerClient client = SecretsManagerClient.builder()
             .region(Region.of(region)).build()) {

      var res = client.getSecretValue(
          GetSecretValueRequest.builder().secretId(secretName).build());
      String secretJson = res.secretString();

      Map<String, Object> map = new ObjectMapper()
          .readValue(secretJson, new TypeReference<Map<String, Object>>() {});
      // Highest precedence so it wins over files/env
      env.getPropertySources().addFirst(new MapPropertySource("aws-secrets:" + secretName, map));
    } catch (Exception e) {
      // Fail fast or log a clear message; choose policy per environment
      throw new IllegalStateException("Failed to load AWS secret '" + secretName + "'", e);
    }
  }

  @Override public int getOrder() { return Ordered.HIGHEST_PRECEDENCE; }
}
```

**Register the post-processor**

```
# src/main/resources/META-INF/spring.factories
org.springframework.boot.env.EnvironmentPostProcessor=\
com.example.demo.aws.AwsSecretsEnvPostProcessor
```

**Store secret in AWS (JSON recommended)**

```json
{
  "APP_DB_URL": "jdbc:postgresql://rds-prod:5432/app",
  "APP_DB_USER": "app_user",
  "APP_DB_PASSWORD": "rds-generated-secret"
}
```

**Run with these env vars (or args)**

```
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_SESSION_TOKEN=...         # if using STS/roles
AWS_SECRETS_NAME=demo/app
```

**application.yml binds like before**

```yaml
app:
  db:
    url: ${APP_DB_URL}
    user: ${APP_DB_USER}
    password: ${APP_DB_PASSWORD}
```

**Expected output (hit `/whoami`)**

```json
{
  "dbUrl": "jdbc:postgresql://rds-prod:5432/app",
  "dbUser": "app_user",
  "dbPassword": "******"
}
```

> **Tips**
>
> * Prefer **IAM roles** over static keys; on EC2/ECS/EKS, the SDK picks them up automatically.
> * Use **auto-rotation** in Secrets Manager; your app should reconnect gracefully on rotation.
> * Consider **Parameter Store** for non-secret config and ASM for secrets.

## 5) Unified folder structure (local + Vault + AWS)

```
demo-secrets/
├─ .env                         # local only (gitignored)
├─ .gitignore                   # includes .env
├─ docker-compose.yml           # optional local runs
├─ pom.xml
├─ scripts/
│  └─ load-env.sh               # loads .env and execs command
├─ src/
│  ├─ main/java/com/example/demo/
│  │  ├─ DemoApplication.java
│  │  ├─ WhoAmIController.java
│  │  ├─ config/AppDbProps.java
│  │  └─ aws/AwsSecretsEnvPostProcessor.java   # if using custom ASM loader
│  └─ main/resources/
│     ├─ application.yml
│     └─ META-INF/spring.factories             # registers EnvPostProcessor
└─ k8s/                                        # if deploying to K8s
   ├─ secret.yaml        # K8s Secret (mounted as env or files)
   └─ deployment.yaml    # uses envFrom: secretRef: ...
```



##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|