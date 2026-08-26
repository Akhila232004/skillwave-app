# **Introduction to Spring**

Spring is a lightweight, modular, and flexible framework used to build Java applications.
It provides tools and features that make application development easier, faster, and more maintainable.
Spring’s focus is on simplifying enterprise Java development using concepts like **IoC (Inversion of Control)** and **DI (Dependency Injection)**.

## **What is Spring Framework?**

Spring Framework is a powerful and widely-used Java framework designed to simplify building enterprise-level applications.
It provides a structured way to develop applications by managing objects, dependencies, configuration, and application flow.

Key points:

* Open-source and lightweight
* Supports modular development
* Provides easy integration with databases, web frameworks, messaging, security, and cloud services
* Uses IoC and DI to reduce tight coupling in the code

Spring helps developers build flexible, testable, and maintainable applications.

## **Features of Spring**

Spring offers many features that make it suitable for modern Java application development.

### Lightweight and Modular
You can use only the parts you need, such as Core, JDBC, MVC, Security, etc.

### Inversion of Control (IoC)
Spring manages object creation and wiring, reducing manual code.

### Dependency Injection (DI)
Dependencies are provided automatically, improving flexibility and maintainability.

### Aspect-Oriented Programming (AOP)
Used for cross-cutting concerns like logging, transactions, and security.

### Spring MVC
A powerful framework for building web applications and REST APIs.

### Integration Support
Easy integration with Hibernate, JPA, JMS, Security, Cloud, and more.

### Testability
Spring's design makes unit testing and mock testing much simpler.

## **Advantages of Spring**
Spring offers several benefits over traditional Java development.
### Reduces Boilerplate Code
Spring handles common repetitive tasks like object creation and dependency wiring.
### Improves Maintainability
Loose coupling makes the code easier to update and manage.
### Easy Integration
Works smoothly with third-party technologies such as JPA/Hibernate, JDBC, JMS, etc.
### High Testability
Easier to write tests due to DI and clear application structure.
### Flexible Architecture
Supports a wide range of application types — standalone, web, microservices, cloud-native.
### Community and Ecosystem
Large community, extensive documentation, and many extensions (Spring Boot, Spring Security, Spring Cloud, etc.)

# **Inversion of Control (IoC)**

Inversion of Control (IoC) is a core principle of the Spring Framework.
It means **the control of creating and managing objects is transferred from your code to the Spring container**.
Instead of your classes creating their own dependencies, Spring provides them automatically.

IoC helps make applications loosely coupled, easier to test, and easier to maintain.

## **Concept of IoC**

In traditional programming, you create and manage objects manually:

```java
Car car = new Car(new Engine());
```

This creates tight coupling.

With IoC:

* Objects do not create their own dependencies
* Spring creates the objects and wires the dependencies
* Your class simply receives what it needs

This allows:

* Better separation of concerns
* Flexible configuration
* Easier unit testing with mocks
* Reduced boilerplate code

Spring applies IoC mainly through **Dependency Injection (DI)**.

## **IoC Container**

The IoC Container is the Spring Framework component responsible for:

* Creating objects (beans)
* Injecting dependencies
* Managing bean lifecycle
* Handling configuration (XML, annotations, or Java config)

The container reads metadata (like `@Component`, `@Bean`, or XML tags) and then creates and manages all required application objects.

Common IoC Containers in Spring:

* **BeanFactory** – basic container providing simple IoC support
* **ApplicationContext** – advanced container with additional features (AOP, event handling, internationalization)

The IoC container is the “brain” of a Spring application, ensuring all objects are created, connected, and ready to use.

# **Dependency Injection (DI)**

Dependency Injection (DI) is a technique where the Spring container provides the required dependencies to a class instead of the class creating them itself.
This makes applications loosely coupled, easier to test, and easier to maintain.

Spring supports DI in several ways: Constructor Injection, Setter Injection, and Field Injection.

## **Constructor Injection**

In Constructor Injection, dependencies are passed through the class constructor.
This method is recommended because it ensures that the object cannot be created without its required dependencies.

Advantages:

* Ensures all required dependencies are provided
* Promotes immutability
* Easier to test

Example (concept only):

```java
public class OrderService {
    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
## **Setter Injection**

Setter Injection provides dependencies using setter methods.
This is useful when the dependency is optional or when you need flexibility to change it later.

Advantages:

* Good for optional dependencies
* Allows modifying dependencies after object creation

Example (concept only):

```java
public class OrderService {
    private PaymentService paymentService;

    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```
## **Field Injection**

Field Injection injects dependencies directly into class fields using `@Autowired`.
Although simple, it is **not recommended** because it makes testing difficult and hides dependency requirements.

Disadvantages:

* Harder to test
* Makes dependencies less visible
* Violates good design principles

Example (concept only):

```java
public class OrderService {
    @Autowired
    private PaymentService paymentService;
}
```

# **Bean Configuration**

Bean Configuration is the process of telling Spring **how to create and manage objects (beans)** in your application.
Spring supports multiple ways to define beans: XML, annotations, and Java-based configuration.

## **XML-based Configuration**

In early versions of Spring, XML was the main way to configure beans.
You define beans inside an XML file, specifying their class and dependencies.

Characteristics:

* Uses XML files like `applicationContext.xml`
* Beans are defined using `<bean>` tags
* Requires more typing and configuration
* Rarely used in modern Spring Boot apps but still supported

Concept example:

```xml
<bean id="orderService" class="com.example.OrderService" />
```
## **Annotation-based Configuration**

Annotations allow Spring to automatically detect and register beans without XML.
Spring scans the classpath for classes annotated with specific stereotypes.

Common annotations:

* `@Component`
* `@Service`
* `@Repository`
* `@Controller`

Characteristics:

* Reduces boilerplate
* No XML needed
* Uses component scanning to find beans automatically

Example concept:

```java
@Service
public class OrderService { }
```

## **Java-based Configuration (@Configuration, @Bean)**

Java-based configuration uses **Java classes** to define beans manually.
It is modern, type-safe, and preferred in Spring Boot.

### @Configuration

Marks a class as a configuration class where Spring can create beans.

### @Bean
Defines a bean method inside a configuration class.

Characteristics:

* Full control over bean creation
* No XML required
* Cleaner and easier to maintain

Example concept:

```java
@Configuration
public class AppConfig {

    @Bean
    public OrderService orderService() {
        return new OrderService();
    }
}
```

This method tells Spring to register `OrderService` as a bean in the application context.

# **Bean Scopes**

Bean scopes define **how many instances** of a bean Spring should create and how long those instances should live.
Spring provides different scopes depending on the application type (core, web, etc.).


## **Singleton**

Singleton is the **default scope** in Spring.
Only **one instance** of the bean is created for the entire application, and the same instance is reused everywhere.

Characteristics:

* One bean instance shared across the app
* Best for stateless services
* Most commonly used in Spring

Example concept:
A single `UserService` instance used everywhere.

## **Prototype**

In Prototype scope, a **new bean instance** is created **every time** it is requested from the container.

Characteristics:

* Multiple instances created
* Useful for stateful or temporary objects
* Spring does not manage the complete lifecycle

Example concept:
A new object created each time you ask for it.

## **Request, Session, Application**

These scopes are used in **web applications**.

### **Request Scope**

A new bean is created **per HTTP request**.

Characteristics:

* Lives only during a single web request
* Useful for request-specific data (like request-scoped DTOs)

### **Session Scope**

A new bean is created **per HTTP session**.

Characteristics:

* Lives as long as the user's session
* Useful for user-specific data that must persist while they are logged in

### **Application Scope**

A single bean is shared across the **entire web application**, similar to a singleton but specifically for servlet context.

Characteristics:

* One instance for the entire application
* Useful for global data in a web environment

# **Spring Annotations**

Spring provides several annotations that help identify components, inject dependencies, and control how beans are selected.
These annotations make configuration easier and reduce the need for XML.

## **@Component, @Service, @Repository**

These are **stereotype annotations** that tell Spring to automatically detect and register classes as beans.

### **@Component**

A general-purpose annotation for any Spring-managed class.
Used when the class does not fall into a specific category.

### **@Service**

Used specifically for service-layer classes.
Indicates that the class contains business logic.

### **@Repository**

Used for data-access-layer classes (DAO or repositories).
It also provides exception translation for database errors.

All three are discovered through **component scanning** and automatically added to the Spring container.

## **@Autowired**

`@Autowired` is used to inject dependencies automatically.
Spring finds the appropriate bean and injects it into the class where it is required.

It can be used with:

* Constructor injection
* Setter injection
* Field injection (not recommended)

Example concept:

```java
@Autowired
private OrderService orderService;
```

## **@Qualifier, @Primary**

These annotations help Spring choose the correct bean when multiple beans of the same type exist.

### **@Primary**

Marks one bean as the default choice when multiple beans match.
Spring will use this bean unless another is specifically requested.

### **@Qualifier**

Used when you want to specify **exactly which bean** Spring should inject.
It overrides the default behavior.

Example concept:

```java
@Autowired
@Qualifier("emailService")
private NotificationService notificationService;
```

# **Lifecycle of a Bean**

The lifecycle of a bean refers to the series of steps a Spring bean goes through—from creation to destruction.
Spring manages this lifecycle automatically, but it also allows you to run custom logic during initialization and cleanup.

A bean typically goes through:

1. Creation
2. Dependency injection
3. Initialization
4. Usage
5. Destruction

## **init() and destroy() methods**

Spring allows you to define custom initialization and destruction methods when configuring beans.

### **init() method**

Runs **after** the bean is created and dependencies are injected.
Used for:

* Opening connections
* Loading initial data
* Setting up resources

### **destroy() method**

Runs **before** the bean is removed from the container.
Used for:

* Closing connections
* Releasing resources
* Cleaning up temporary data

These methods can be declared in XML or Java-based configuration using attributes like:

```java
@Bean(initMethod = "init", destroyMethod = "destroy")
```

## **@PostConstruct and @PreDestroy**

Spring also supports annotations to handle initialization and destruction.

### **@PostConstruct**

Placed on a method that should run **after dependency injection** is complete.
It is commonly used to perform startup logic.

Example concept:

```java
@PostConstruct
public void init() {
    // initialization code
}
```

### **@PreDestroy**

Placed on a method that should run **before the bean is destroyed**.
Used for cleanup tasks.

Example concept:

```java
@PreDestroy
public void cleanup() {
    // cleanup code
}
```

These annotations provide a convenient and annotation-based way to manage bean lifecycle behavior.


##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|