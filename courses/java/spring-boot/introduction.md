# Introduction

Spring is a mature Java framework for building reliable, scalable business applications. It gives you a consistent programming model (POJOs + annotations) and infrastructure support so you can focus on business logic instead of plumbing. At its core are a few ideas:

   * Inversion of Control (IoC) & Dependency Injection (DI): you describe what you need; Spring creates and wires objects for you.
   * Aspect-Oriented Programming (AOP): cross-cutting concerns (logging, transactions, security) are applied declaratively so they don’t pollute business code.
   * Modular ecosystem: you pick what you need—Web (MVC), Data (JPA/NoSQL), Security, Batch, Cloud, Integration, etc.
   * Testability: components are loosely coupled and easy to unit/integration test.

Spring Boot sits on top of Spring and streamlines the developer experience with sensible defaults, auto-configuration, and an embedded server, letting you go from idea to running app very quickly.


# Spring vs Spring Boot

| Aspect                  | Spring (Framework)                                                                                       | Spring Boot                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Goal**                | Comprehensive toolkit to build any kind of Java app with maximum flexibility.                            | Convention-over-configuration layer to start and operate Spring apps fast and repeatably.                             |
| **Configuration**       | You assemble pieces and explicitly configure beans/infrastructure.                                       | Auto-configures beans based on classpath and `application.properties`/YAML.                                           |
| **Dependencies**        | You manage versions yourself.                                                                            | Starters/BOM manage compatible versions for you.                                                                      |
| **Server**              | Typically packaged as **WAR** for external servers (Tomcat/Jetty).                                       | Runs with an **embedded** server by default (`java -jar`), but can still produce WAR.                                 |
| **Production Features** | Monitoring/ops assembled manually.                                                                       | **Actuator** endpoints for health, metrics, info, readiness/liveness out of the box.                                  |
| **Use When**            | Need very custom infrastructure or must integrate with strict enterprise platforms/external app servers. | Want fast startup, opinionated defaults, microservices, or cloud-native apps with minimal ceremony (today’s default). |

# Spring Boot — Features & Advantages 

Spring Boot is an **opinionated** layer on top of Spring that standardizes the boring parts—so teams ship production services faster, with fewer decisions and less boilerplate.

## What “opinionated” means

* **Conventions first:** sensible defaults for logging, JSON, server, error handling, etc.
* **Auto-Configuration:** adds beans *only if* the right libraries are on the classpath and you haven’t defined your own.
* **Still overrideable:** every default can be changed through properties or custom beans.

## Core Features

### 1) Auto-Configuration

* Detects libraries on the classpath (e.g., Web, JPA, Security) and configures matching beans automatically.
* Uses **conditional annotations** (e.g., `@ConditionalOnClass`) so your custom beans take precedence.
* Reduces setup time dramatically; eliminates “XML + manual wiring” of classic Spring.

### 2) Starters (Curated Dependencies)

* “One-line” dependencies like `spring-boot-starter-web`, `data-jpa`, `security`, `validation`.
* Aligns versions to avoid dependency hell; you opt into a **stack** rather than chasing individual libs.

### 3) Embedded Servers

* Tomcat (default), Jetty, or Undertow bundled in the app.
* Run with `java -jar`—no external app server or WAR deployment.
* Simplifies **Docker/Kubernetes** packaging and local dev parity.

### 4) Convention-Based Project Structure

* Standard `src/main/java` + `src/main/resources` layout.
* Component scanning from the main application package keeps wiring simple and predictable.

### 5) Spring Boot DevTools

* Automatic restart on classpath changes; live reload support.
* Dev-only settings (e.g., caching disabled) to speed the inner loop.

### 6) Unified Configuration Model

* Externalize config via `application.yml/properties`, profiles, env vars, CLI args.
* **Type-safe config binding** with `@ConfigurationProperties`.
* Profile-aware blocks (`application-{profile}.yml`) for dev/test/prod differences.

### 7) Reactive & Servlet Stacks

* **Spring MVC** for traditional blocking I/O.
* **Spring WebFlux** for reactive, event-driven apps when needed.

## Production-Ready Features

### 8) Actuator (Health, Metrics, Management)

* Ready-made endpoints: `/actuator/health`, `/metrics`, `/info`, `/env`, `/mappings`.
* **Micrometer** integration exposes metrics to Prometheus, Datadog, CloudWatch, etc.
* Health indicators for DB, disk space, messaging, custom dependencies.

### 9) Security Integration

* Spring Security starter gives sane defaults (secure by default).
* Easy to add **JWT**, OAuth2/OIDC, method security (`@PreAuthorize`).

### 10) Data Access Integration

* Starters for **JPA/Hibernate**, JDBC, R2DBC, MongoDB, Redis, Kafka, RabbitMQ, etc.
* Sensible transaction management and sane defaults out of the box.

### 11) Observability & Logging

* Opinionated logging (Logback) and structured logging support.
* Tracing via Micrometer Tracing / OpenTelemetry (with minimal setup).

### 12) Packaging & Deployment

* **Fat JAR** with all dependencies, or build container images using buildpacks (no Dockerfile required).
* Cloud-friendly defaults (graceful shutdown, health endpoints, readiness probes).

## Testing & Quality

### 13) Test Slices & Utilities

* `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest` to load only what you need.
* Embedded H2, **Testcontainers** for integration tests against real DBs.
* Clean test ergonomics with Mockito/JUnit 5.

## Ecosystem & Documentation

### 14) Rich Ecosystem

* Spring Cloud (Config, Gateway, Discovery, Circuit Breakers), Spring Data, Spring Security, Spring Batch.
* Massive community, examples, and guides; excellent IDE support.

## Advantages in Practice

* **Velocity:** from idea to running service in hours, not days.
* **Consistency:** every team uses the same structure, endpoints, metrics, and security patterns.
* **Maintainability:** upgrades and dependency alignment are handled centrally via starters/BOM.
* **Dev–Prod Parity:** embedded server + externalized config makes local envs mirror production.
* **Cloud-native:** actuator, metrics, health checks, and buildpacks fit modern ops out of the box.

## Common Misconceptions 

* “Boot is a different framework.” → No, it’s Spring **with** conventions and automation.
* “Auto-config hides everything.” → Defaults are visible in docs; you can override any bean/property.
* “Only for microservices.” → Works for monoliths, CLIs, batch jobs, gateways—anything Spring can do.

## Trade-offs & Considerations

* **Learning the conventions:** Know what Boot does for you (Actuator, error handling, logging) to avoid surprises.
* **Startup & memory:** Defaults are general-purpose; for tight footprints consider trimming starters or AOT/native image.
* **Version coupling:** Stick with the managed dependency versions unless you have a reason to diverge.



# Configuration Files


## `application.properties` vs `application.yml`

## 1) Purpose & Location

Spring Boot externalizes runtime settings (HTTP port, app name, datasource URL, logging, feature flags) into configuration files loaded from the classpath:

* `src/main/resources/application.properties`
* `src/main/resources/application.yml`

Profile-specific variants override the base file when their profile is active (e.g., `application-dev.properties` / `application-dev.yml`, or YAML multi-document sections with `---`). Both formats express the same keys; only the syntax differs.

## 2) Application Properties vs YAML — Key Differences

| Aspect                       | `application.properties`          | `application.yml`                           |
| ---------------------------- | --------------------------------- | ------------------------------------------- |
| Syntax                       | Flat `key=value` pairs            | Indentation-based hierarchy (YAML)          |
| Nesting (objects)            | Dots, e.g. `group.sub=value`      | Nested blocks under parents                 |
| Lists (arrays)               | Indexed: `list[0]=a`, `list[1]=b` | Natural lists: `- a`, `- b` or `[a, b]`     |
| Multiple documents           | Not supported                     | Supported via `---` (commonly for profiles) |
| Readability (complex config) | Adequate for small/flat data      | Clear for grouped/larger configs            |
| Comments                     | `# ...`                           | `# ...` (tabs invalid; use spaces)          |

**Equivalence (same configuration in both formats):**

```properties
# application.properties
server.port=8081
spring.application.name=demo-app
app.supported-locales[0]=en
app.supported-locales[1]=hi
app.thresholds.low=3
app.thresholds.high=10
```

```yaml
# application.yml
server:
  port: 8081
spring:
  application:
    name: demo-app
app:
  supported-locales: [en, hi]
  thresholds:
    low: 3
    high: 10
```

**Effect:** Port = `8081`, App name = `demo-app`, Locales = `en, hi`, Thresholds = `{low:3, high:10}`.

## 3) `application.properties`

**Definition**: Java-style key–value configuration file read at startup.

**Structure & Rules**

* Key–value per line: `key=value`
* Hierarchy via dots: `group.subkey=value`
* Lists via indexes: `list[0]=...`, `list[1]=...`
* Comments: `# ...`
* Placeholders: `${OTHER_KEY}` or `${ENV_NAME:default}` (resolve from other properties or environment)
* Multi-line values: escape or use line continuation (`\`)

**Mini Example**

```properties
server.port=8081
spring.application.name=demo-app
app.supported-locales[0]=en
app.supported-locales[1]=hi
app.thresholds.low=3
app.thresholds.high=10
spring.datasource.password=${DB_PASSWORD:change_me}
```

**Effect:** Server on `8081`; app name `demo-app`; lists and maps bound as shown; password from env var or default `change_me`.

## 4) `application.yml` (YAML)

YAML configuration file using indentation to express hierarchy; same settings as properties.

**Structure & Rules**

* Maps (objects) by indentation (spaces only; tabs invalid)
* Lists with dashes `- item` or inline `[a, b]`
* Comments: `# ...`
* Placeholders: `${OTHER_KEY}` or `${ENV_NAME:default}`
* Multiple documents separated by `---` (commonly for profiles)

**Mini Example**

```yaml
server:
  port: 8081
spring:
  application:
    name: demo-app
  datasource:
    password: ${DB_PASSWORD:change_me}
app:
  supported-locales:
    - en
    - hi
  thresholds:
    low: 3
    high: 10
```

**Effect:** Server on `8081`; app name `demo-app`; env placeholder supported; lists/maps bound natively.

## 5) Relationship & Usage in Spring Boot (applies to both)

* **Purpose**: Both formats define the same configuration; pick one per project for consistency.
* **Loading**: Spring Boot auto-loads the file from the classpath; avoid defining the same key in multiple places.
* **Profiles**: Properties use separate files (e.g., `application-dev.properties`); YAML can embed profiles via `---` and `spring.config.activate.on-profile`.
* **Environment Variables**: Map by uppercasing and replacing dots with underscores, e.g., `spring.datasource.username` → `SPRING_DATASOURCE_USERNAME`.

# Spring Boot Starters (Dependencies)

**Definition**
A **starter** is a convenience dependency (Maven/Gradle) that pulls a **curated, version-aligned** set of libraries managed by Spring Boot’s BOM. You add **one line**, Boot brings a **compatible stack** and enables **auto-configuration** for it.

## Why starters matter

* **Minimal build files** – one dependency instead of many
* **Known-good versions** – managed by Boot’s **BOM**
* **Auto-configuration triggers** – presence on classpath turns features on
* **Consistent upgrades** – move Boot version, get the whole stack aligned

## Popular starters (at a glance)

* `spring-boot-starter-web` → Spring MVC + Jackson + **embedded Tomcat**
* `spring-boot-starter-webflux` → Reactive Web (Spring WebFlux) + **Reactor Netty**
* `spring-boot-starter-data-jpa` → JPA/Hibernate (*add your DB driver*)
* `spring-boot-starter-security` → Spring Security defaults
* `spring-boot-starter-validation` → Jakarta Bean Validation
* `spring-boot-starter-actuator` → Health, metrics, info, mappings
* `spring-boot-starter-test` → JUnit 5, AssertJ, Mockito, test slices
* UI/infra extras: `spring-boot-starter-thymeleaf`, `…-mail`, `…-cache`
* Alternate servers: `spring-boot-starter-undertow`, `spring-boot-starter-jetty`

## Version management (pick one)

**Option A — Parent POM (most common)**

```xml
<!-- pom.xml -->
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.3.x</version>
  <relativePath/>
</parent>
```

**Expected output:** You **don’t** specify versions for Boot-managed deps; Maven pins them via the parent.

**Option B — Import BOM (if you already have your own parent)**

```xml
<!-- pom.xml -->
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.3.x</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

**Expected output:** Same alignment benefit without changing your project’s parent.
## Add a few core starters

**Maven**

```xml
<!-- pom.xml -->
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

**Expected output:**

* `starter-web` brings **spring-webmvc, Jackson, Tomcat** transitively.
* App starts on **[http://localhost:8080](http://localhost:8080)**.
* Tests use **JUnit 5** by default.

**Gradle (Groovy DSL)**

```groovy
dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.springframework.boot:spring-boot-starter-actuator'
  testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

**Expected output:** `bootRun`/`./gradlew run` starts embedded server on **8080** with the same curated set.


## Switching servlet containers (Tomcat → Undertow/Jetty)

**Maven (swap Tomcat for Undertow)**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <exclusions>
    <exclusion>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-tomcat</artifactId>
    </exclusion>
  </exclusions>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

**Expected output:** App now runs on **Undertow** (still port 8080 unless changed).

> Note: JSP support differs by server (e.g., Undertow doesn’t support JSP).

## Logging choice (Logback → Log4j2)

Boot brings `spring-boot-starter-logging` (Logback) by default. To use **Log4j2**:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

**Expected output:** Boot switches to Log4j2 automatically for you. If you still see duplicates, exclude `spring-boot-starter-logging` explicitly from other starters.

## “Also useful” starters & friends

* Data: `spring-boot-starter-jdbc`, `spring-boot-starter-data-redis`, `spring-boot-starter-data-mongodb`
* Messaging: `spring-boot-starter-amqp` (RabbitMQ), `spring-kafka` *(common but not a “starter”)*
* Views: `spring-boot-starter-thymeleaf`, `spring-boot-starter-mustache`
* DX: `spring-boot-devtools` *(hot reload in dev; not a starter but essential)*

> DB note: **add a vendor driver** (e.g., `postgresql`, `mysql`) alongside JPA/JDBC starters.

## Inspect what a starter brings

**Maven**

```bash
./mvnw dependency:tree -Dincludes=org.springframework.boot:spring-boot-starter-web
```

**Gradle**

```bash
./gradlew dependencies --configuration runtimeClasspath
```

**Expected output:** A tree showing the starter and all transitives (Tomcat, Jackson, Spring MVC, etc.).


##### [Back To Contents](../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|