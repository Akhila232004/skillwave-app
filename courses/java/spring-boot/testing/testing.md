# **Unit Testing**

Unit testing focuses on testing **individual methods or components** in isolation.
The goal is to ensure each piece of your code works correctly **without involving databases, servers, or external systems**.

### Why Unit Testing is important:

* Catches bugs early
* Ensures each method behaves correctly
* Makes your code more reliable
* Helps you change code safely (regression prevention)

Think of it like testing a small machine part before assembling the whole machine.

## **JUnit 5 Basics**

JUnit 5 is the most commonly used testing framework in Spring Boot.

### Key Concepts:

#### **1. @Test**

Marks a method as a test case.

#### **2. Test Lifecycle**

Annotations that run at different times:

* `@BeforeEach` – runs before every test
* `@AfterEach` – runs after every test
* `@BeforeAll` – runs once before all tests
* `@AfterAll` – runs once after all tests

#### **3. Test Naming**

A good test name describes:

* What is being tested
* Expected behavior

Example:
`shouldCalculateTotalPriceCorrectly()`

JUnit tests run without starting the full Spring application, so they are fast and simple.

## **Assertions**

Assertions are used to **check expected results**.
If an assertion fails → the test fails.

### Common Assertions:

| Assertion         | Purpose                               |
| ----------------- | ------------------------------------- |
| `assertEquals`    | Check if two values are equal         |
| `assertNotEquals` | Check if values differ                |
| `assertTrue`      | Check if a condition is true          |
| `assertFalse`     | Check if a condition is false         |
| `assertThrows`    | Check if a method throws an exception |
| `assertNotNull`   | Check that a value is not null        |
| `assertNull`      | Check that a value is null            |

### Why Assertions Matter

Assertions compare:

* actual output (method result)
* expected output (what you want)

If they match → test passes.

Understood — here is the **clean version** without extra commentary at the end.
Explanations stay directly under each heading.


# **Mocking**

Mocking is a method used in unit testing to replace real objects with *fake* versions.
These fake objects simulate the behavior of real dependencies, allowing you to test your class without interacting with databases, APIs, or external systems.
Mocking keeps tests focused, fast, and isolated.

## **Mockito Framework**

Mockito is a popular Java framework used to create and manage mock objects.
It allows you to define how a mock should behave, what values it should return, and verify whether certain methods were called.
Mockito helps you test the logic of your class without depending on real external components. 

## **Mocking Dependencies (@Mock, @InjectMocks)**

### **@Mock**

`@Mock` creates a fake version of a dependency.
Instead of calling the real implementation, your test will interact with this mock, and you can program it to return whatever values your test needs.

Example usage:

```java
@Mock
private ProductRepository productRepository;
```

### **@InjectMocks**

`@InjectMocks` creates the actual class you want to test and automatically injects all the mocks into it.
This allows you to test the class in isolation while its dependencies behave as controlled mock objects.

Example usage:

```java
@InjectMocks
private ProductService productService;
```

# **Integration Testing**

Integration testing checks how multiple parts of the application work together.
Unlike unit tests (which test only one method or class), integration tests verify real interactions such as:

* Calling REST APIs
* Loading the full Spring context
* Using controllers, services, and repositories together

It helps ensure that the application behaves correctly as a whole.

## **@SpringBootTest**

`@SpringBootTest` is used to load the **entire Spring Boot application context** for testing.
It allows you to test real components such as controllers, services, repositories, filters, and configuration.

Key points:

* Starts the full application context
* Useful for testing end-to-end functionality
* Often combined with real or in-memory databases

Example concept:

```java
@SpringBootTest
class MyApplicationTests { }
```
## **TestRestTemplate**

`TestRestTemplate` is used for testing **REST APIs** in Spring Boot.
It allows you to send HTTP requests (GET, POST, PUT, DELETE) to your application in tests.

Key points:

* Works well with `@SpringBootTest(webEnvironment = RANDOM_PORT)`
* Simulates real client behavior
* Used for integration tests involving controllers

Example concept:

```java
TestRestTemplate restTemplate;
restTemplate.getForObject("/api/products", String.class);
```
## **WebTestClient**

`WebTestClient` is a reactive, lightweight HTTP client for testing web endpoints.
It works with both **WebFlux** and **Spring MVC** applications.

Key points:

* Faster and more modern than `TestRestTemplate`
* Fluent API (chained method calls)
* Excellent for testing APIs with request/response validation

Example concept:

```java
webTestClient.get().uri("/api/products")
             .exchange()
             .expectStatus().isOk();
```
# **Testing Data Layer**

Testing the data layer focuses on verifying the behavior of repositories, database queries, and entity mappings.
The goal is to make sure your JPA entities and repository methods work correctly with a real or in-memory database, without loading the entire application.

## **@DataJpaTest**

`@DataJpaTest` is a specialized test annotation used to test **JPA repositories**.
It loads only the components related to JPA:

* Entities
* Repositories
* Hibernate
* In-memory database (by default)

Key points:

* Fast because it loads only JPA-related beans
* Automatically rolls back transactions after each test
* Perfect for testing CRUD operations and custom queries

Example concept:

```java
@DataJpaTest
class ProductRepositoryTest { }
```


## **H2 In-Memory Database**

H2 is a lightweight, in-memory SQL database commonly used for testing.
It runs entirely in memory, so tests execute quickly, and no setup is required.

Key points:

* No installation needed
* Database resets automatically for every test run
* Great for testing JPA repositories
* Works seamlessly with `@DataJpaTest`

H2 gives you a clean and realistic environment for testing database interactions without affecting your real database.   

#  **TestContainers**

TestContainers is a testing library that allows you to run real services—like databases—inside lightweight Docker containers during tests.
Instead of using an in-memory database or mocks, you use the **actual database engine** your application uses (PostgreSQL, MySQL, MongoDB, etc.).

This makes tests more reliable because they use the same environment as production.

Key points:

* Spins up real Docker containers during tests
* Automatically starts and stops containers
* Works with JUnit and Spring Boot
* Ensures accurate, production-like testing

## **Running DBs in Docker for Testing**

With TestContainers, you can run real databases inside Docker automatically.
When the test starts, Docker launches a database container; when the test ends, the container shuts down.

Advantages:

* No need to install the database locally
* Consistent test environment for all developers
* Ideal for testing repository logic with real SQL engines
* Prevents “works on my machine” issues

This approach gives you realistic and repeatable database tests without manual setup.



##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|