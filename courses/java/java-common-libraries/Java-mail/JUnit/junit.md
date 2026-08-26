# What is JUnit?

JUnit is a **testing framework for Java** used to write and run **unit tests**.

A **unit test** is a small test that checks whether a single piece of code (like a method) works correctly. Instead of manually running your program and checking output, JUnit lets you create **automatic tests** that verify results for you.

### Why JUnit is used

* To make sure your code gives the **correct output**
* To catch bugs early when you change code (**regression prevention**)
* To avoid manual checking again and again
* To support automatic testing in build tools and CI/CD (Jenkins, GitHub Actions, etc.)

### How JUnit works (simple idea)

You write a test method and mark it with `@Test`.
Inside the test, you use **assertions** to check the expected result.

Example idea:

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    @Test
    void add_shouldReturnSum() {
        int result = 10 + 20;
        assertEquals(30, result);
    }
}
```

If the result matches the expected value, the test **passes** ✅  
If it doesn’t match, the test **fails** ❌

## Why Testing is Needed (JUnit vs Manual Testing)

When you write Java code, you need to confirm it works correctly. There are two common ways:

* **Manual testing** (run the program, print outputs, check with eyes)
* **JUnit testing** (write automated tests that check results)

In real projects, manual testing becomes slow and unreliable. JUnit solves that by making testing **automatic and repeatable**.


## Manual Testing (System.out.println approach)

### How it works

You run your code and print values to verify:

```java
System.out.println("Total = " + total);
```

### Problems with manual testing

* **Slow**: You must run again and again after every change
* **Not repeatable**: You may forget test cases you tried earlier
* **Easy to miss bugs**: You might not check all edge cases
* **Hard to test many scenarios**: Example: null values, negative numbers, empty input, etc.
* **Not suitable for teams**: Other developers cannot easily verify your logic
* **No automation**: CI/CD cannot “check your eyes” 😄

Manual testing is okay for **learning** and **very small programs**, but not for real applications.

## JUnit Testing (Automated Testing)

### How it works

You write tests that automatically verify outputs using assertions:

```java
@Test
void add_shouldReturnSum() {
    assertEquals(30, calculator.add(10, 20));
}
```

### Benefits of JUnit testing

* **Fast and repeatable**: Run tests anytime with one click
* **Catches bugs early**: Fail immediately if logic breaks
* **Supports many test cases easily**: Add more tests without changing main code
* **Prevents regression bugs**: Old working features won’t silently break
* **Works with automation**: Tests run in Maven/Gradle and CI/CD pipelines
* **Better code quality**: Encourages clean, modular methods

## Real Example: Why JUnit helps

Suppose you wrote a method `divide(a, b)`.

### Manual testing:

You test only `divide(10, 2)` and it works.

But later in production someone calls `divide(10, 0)` → app crashes.

### With JUnit:

You would add an exception test:

```java
@Test
void divide_byZero_shouldThrowException() {
    assertThrows(ArithmeticException.class, () -> calculator.divide(10, 0));
}
```

Now the risky case is tested and controlled.

# JUnit 4 vs JUnit 5 (JUnit Jupiter)

JUnit is the most common Java testing framework. Over time it evolved:

* **JUnit 4** → older and widely used in legacy projects
* **JUnit 5** → modern and recommended for new projects

  * The main programming model in JUnit 5 is called **JUnit Jupiter**


## 1) Main Difference (Simple View)

### JUnit 4

* Uses older annotations like `@Before`, `@After`
* One main library: `junit:junit`
* Extensions and advanced features are limited
* Works fine, but not designed for modern modular Java

### JUnit 5 (Jupiter)

* Uses new annotations like `@BeforeEach`, `@AfterEach`
* Split into modules:

  * **JUnit Platform** (runs tests)
  * **JUnit Jupiter** (new test API)
  * **JUnit Vintage** (runs JUnit 3/4 tests if needed)
* Better support for:

  * parameterized tests
  * nested tests
  * dynamic tests
  * modern extension model


## 2) Annotation Differences

| Purpose                   | JUnit 4        | JUnit 5       |
| ------------------------- | -------------- | ------------- |
| Mark a test               | `@Test`        | `@Test`       |
| Run before each test      | `@Before`      | `@BeforeEach` |
| Run after each test       | `@After`       | `@AfterEach`  |
| Run once before all tests | `@BeforeClass` | `@BeforeAll`  |
| Run once after all tests  | `@AfterClass`  | `@AfterAll`   |
| Ignore/disable test       | `@Ignore`      | `@Disabled`   |


## 3) Dependency Difference

### JUnit 4 Maven dependency

```xml
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.13.2</version>
  <scope>test</scope>
</dependency>
```

### JUnit 5 Maven dependency (recommended)

```xml
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.10.2</version>
  <scope>test</scope>
</dependency>
```
## 4) Example: Same Test in Both Versions

### JUnit 4 Example

```java
import org.junit.Test;
import static org.junit.Assert.*;

public class CalculatorTest {

    @Test
    public void add_shouldReturnSum() {
        assertEquals(30, 10 + 20);
    }
}
```

### JUnit 5 Example (Jupiter)

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    @Test
    void add_shouldReturnSum() {
        assertEquals(30, 10 + 20);
    }
}
```

Notice:

* JUnit 4 uses `org.junit.Assert.*`
* JUnit 5 uses `org.junit.jupiter.api.Assertions.*`

## 5) Why JUnit 5 is Preferred Today

JUnit 5 is better because:

* ✅ Cleaner and more descriptive lifecycle annotations (`BeforeEach`, etc.)
* ✅ Strong extension model (replaces JUnit 4 rules)
* ✅ Built-in support for modern testing styles (parameterized, nested, dynamic)
* ✅ Better support for Java 8+ features and modern tooling

## 6) When You Still See JUnit 4

You might use JUnit 4 if:

* The project is old and already built on JUnit 4
* Some older frameworks/tools depend on it
* You are maintaining legacy systems

In that case, JUnit 5 can still run JUnit 4 tests using **JUnit Vintage**.  

# Adding JUnit to a Project (Maven / Gradle)

To use JUnit in a Java project, you must add it as a **test dependency**.
A test dependency means: the library is used only for testing and is not required when your application runs in production.

The modern, recommended version is **JUnit 5 (JUnit Jupiter)**.



## 1) Adding JUnit in a Maven Project

In Maven, dependencies are added inside `pom.xml`.

### Where to add

Add JUnit inside the `<dependencies>` section and mark it as **test scope**:

* `scope = test` means JUnit is available only when running tests (`mvn test`)
* It won’t be included in your main production build

### Typical JUnit 5 Dependency (Maven)

```xml
<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>5.10.2</version>
  <scope>test</scope>
</dependency>
```

### Maven Test Execution

When JUnit is added correctly:

* Maven runs tests using `mvn test`
* Tests are usually placed under:
  `src/test/java`

## 2) Adding JUnit in a Gradle Project

Gradle dependencies are declared inside the `dependencies { }` block.

### Gradle (Groovy DSL) – `build.gradle`

```groovy
dependencies {
  testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
}
```

To make Gradle use JUnit 5, you typically enable the JUnit platform:

```groovy
test {
  useJUnitPlatform()
}
```

### Gradle (Kotlin DSL) – `build.gradle.kts`

```kotlin
dependencies {
  testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
}

tasks.test {
  useJUnitPlatform()
}
```
## 3) Where to Write JUnit Tests

JUnit test classes should be created in the test source folder:

* **Maven/Gradle standard folder**

  * `src/test/java`

Your actual application code goes in:

* `src/main/java`

This separation keeps your production code clean and ensures tests run independently.

## 4) What Happens After Adding JUnit?

Once JUnit is added:

* You can create a test class (example: `CalculatorTest`)
* Mark methods with `@Test`
* Use assertions like `assertEquals()` to verify output
* Run tests from:

  * IDE (IntelliJ / Eclipse / VS Code)
  * Maven (`mvn test`)
  * Gradle (`gradle test`)  

# Understanding a Test Class and Test Method

When you use JUnit, you write tests in a separate class called a **test class**.
Inside that test class, you write one or more **test methods** that verify your actual code.

## 1) What is a Test Class?

A **test class** is a normal Java class created to test another class.

* It usually sits in: `src/test/java`
* The name typically ends with `Test`

Example naming:

* `Calculator` → `CalculatorTest`
* `UserService` → `UserServiceTest`

**Purpose:** Group related test methods for the same feature/class.

## 2) What is a Test Method?

A **test method** is a method inside the test class that checks one behavior of your code.

In JUnit 5, a test method:

* is marked with `@Test`
* returns `void`
* should have no parameters (for basic tests)
* contains **assertions** to validate results

Example: “add() should return sum”.

## 3) Structure of a Simple Test (AAA Pattern)

Most test methods follow the **AAA pattern**:

1. **Arrange** – prepare inputs and objects
2. **Act** – call the method you are testing
3. **Assert** – verify the output

Example idea:

```java
// Arrange: create object + input
// Act: call method
// Assert: check expected result
```

This makes tests clear and easy to read.

## 4) Example: Class + Test Class

### Production code (src/main/java)

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

### Test code (src/test/java)

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    @Test
    void add_shouldReturnSum() {
        // Arrange
        Calculator calculator = new Calculator();

        // Act
        int result = calculator.add(10, 20);

        // Assert
        assertEquals(30, result);
    }
}
```

### Expected Output

* The test passes if `result` is `30`
* The test fails if the method returns a wrong value

## 5) How Many Test Methods Should a Test Class Have?

A test class can have many test methods, each testing a different scenario:

For `add()`:

* `add_twoPositiveNumbers_shouldReturnSum`
* `add_negativeNumbers_shouldWork`
* `add_withZero_shouldWork`

Each test method should ideally test **one behavior**.

# JUnit Annotations (JUnit 5)

JUnit annotations are special tags you place above methods to tell JUnit **when and how to run them**.
They help you write clean tests with setup/cleanup logic and control which tests run.

## 1) `@Test`

`@Test` marks a method as a **test case**.

* JUnit will execute this method when you run tests
* If assertions pass → ✅ test passes
* If an assertion fails or an exception occurs → ❌ test fails

Example:

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DemoTest {

    @Test
    void simpleTest() {
        assertEquals(10, 5 + 5);
    }
}
```

## 2) `@BeforeEach` and `@AfterEach`

These run **before and after every test method**.

### `@BeforeEach`

Used to set up objects needed for each test:

* creating service objects
* initializing test data
* resetting variables

### `@AfterEach`

Used for cleanup after each test:

* closing resources
* clearing temp data
* resetting shared states

Example:

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator(); // runs before each @Test
    }

    @AfterEach
    void tearDown() {
        calculator = null; // runs after each @Test
    }

    @Test
    void add_shouldReturnSum() {
        assertEquals(30, calculator.add(10, 20));
    }

    @Test
    void add_withZero_shouldWork() {
        assertEquals(10, calculator.add(10, 0));
    }
}
```

### Key point

If you have 2 test methods, `@BeforeEach` and `@AfterEach` will run **2 times each** (once per test).

## 3) `@BeforeAll` and `@AfterAll`

These run **only once for the whole test class**.

### `@BeforeAll`

Runs once before any tests start.
Used for:

* opening a shared expensive resource
* one-time setup (example: start test server)

### `@AfterAll`

Runs once after all tests finish.
Used for:

* closing shared resources
* cleanup at the end

⚠️ In JUnit 5, methods with `@BeforeAll` and `@AfterAll` should be `static` by default.

Example:

```java
import org.junit.jupiter.api.*;

class LifecycleTest {

    @BeforeAll
    static void beforeAll() {
        System.out.println("Runs once before all tests");
    }

    @AfterAll
    static void afterAll() {
        System.out.println("Runs once after all tests");
    }

    @BeforeEach
    void beforeEach() {
        System.out.println("Runs before each test");
    }

    @AfterEach
    void afterEach() {
        System.out.println("Runs after each test");
    }

    @Test
    void testOne() {
        System.out.println("Test One");
    }

    @Test
    void testTwo() {
        System.out.println("Test Two");
    }
}
```

### Expected Output (order concept)

* beforeAll (once)
* beforeEach → testOne → afterEach
* beforeEach → testTwo → afterEach
* afterAll (once)

## 4) `@Disabled`

`@Disabled` is used to **skip a test** temporarily.

Use cases:

* test is under development
* test fails due to a known bug
* feature not ready yet

Example:

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class DisabledTestDemo {

    @Test
    @Disabled("Feature not implemented yet")
    void testFeatureX() {
        assertTrue(false);
    }

    @Test
    void testWorkingFeature() {
        assertTrue(10 > 5);
    }
}
```

JUnit will skip the disabled test and run the rest.
# Testing Exceptions in JUnit (`assertThrows`)

In real applications, not every situation should return a normal value.
Sometimes your code must **throw an exception** to indicate an error or invalid input.

Examples:

* dividing by zero
* passing `null` to a method that requires a value
* withdrawing more money than the balance
* invalid age (negative) for registration

When testing such code, you should not just “run and see it crash”.
Instead, you should **verify that the correct exception is thrown**.

That is what `assertThrows()` is used for.

## Why we test exceptions

Testing exceptions is important because:

* it confirms your code handles invalid input correctly
* it ensures the exception type is correct (not random or wrong)
* it prevents silent failures when code changes later (regression)
* it documents expected behavior for other developers


## What is `assertThrows()`?

`assertThrows()` is a JUnit assertion that checks:

1. **Which exception type** should be thrown
2. **What code** should throw it

If the exception is thrown correctly → ✅ test passes
If no exception is thrown (or wrong type is thrown) → ❌ test fails

### Basic Syntax

```java
assertThrows(ExceptionType.class, () -> {
    // code that should throw the exception
});
```

* First parameter: expected exception class
* Second parameter: a lambda expression containing the code


## Example Scenario (Concept)

If a method should not accept zero as denominator, it may throw:

* `ArithmeticException`
* or your own custom exception

Then the test should verify that exception.



## What `assertThrows()` Validates

### 1) Correct Exception Type

It ensures the thrown exception matches the expected class.

### 2) The code actually throws

If the code does not throw anything, the test fails.

### 3) Optional: Verify exception message

You can capture the exception and check its message (useful when you want clear error messages).


## Common Beginner Mistakes

### ❌ Wrong: using try-catch in tests

Beginners often write:

```java
try {
   methodThatShouldFail();
} catch(Exception e) {
   // pass
}
```

Problem:

* If no exception occurs, the test might still pass accidentally.
* Hard to ensure correct exception type/message.

### Correct: use `assertThrows()`

JUnit handles it properly and fails if behavior is wrong.

## Where Exception Testing is Used

* Input validations (`null`, empty string, negative number)
* Business rules (age < 18, insufficient balance)
* API/service validations
* File/network/database failures (when simulated in unit tests)
## Test Lifecycle (Setup and Cleanup) – `@BeforeEach`, `@AfterEach`

In JUnit, tests should be **independent**.
That means each test should start with a **fresh setup** and should not be affected by what happened in previous tests.

To support this, JUnit provides lifecycle annotations:

* `@BeforeEach` → runs **before every test method**
* `@AfterEach` → runs **after every test method**

These help you write clean tests without repeating the same setup code in every test.

---

## Why Setup and Cleanup are Needed

### 1) Avoid repeating code

Without lifecycle methods, you might create objects in every test again and again.

### 2) Keep tests independent

If a test modifies an object, the next test should not reuse that modified object.

### 3) Prevent resource issues

Some tests open resources like:

* files
* database connections (in integration tests)
* streams
* temporary data

Cleanup ensures those resources are closed properly.

---

## `@BeforeEach` (Setup)

`@BeforeEach` is used to prepare things needed for each test, such as:

* creating objects (service, calculator, repository)
* initializing sample test data
* resetting counters/variables

**Runs once per test**.

Example idea:

* create a new `Calculator` object before each test runs.

---

## `@AfterEach` (Cleanup)

`@AfterEach` is used to clean things after each test, such as:

* setting objects to null (optional)
* deleting temporary files
* clearing shared data
* closing resources (streams, connections)

**Runs once per test** after the test completes.

---

## Execution Order (How it Works)

If you have 3 test methods:

* `@BeforeEach` runs 3 times
* `@AfterEach` runs 3 times

Order:

1. `@BeforeEach`
2. `@Test` method runs
3. `@AfterEach`
   (repeats for every test)

---

## Simple Example (concept)

```java
@BeforeEach
void setUp() {
   // create fresh objects here
}

@AfterEach
void tearDown() {
   // cleanup after each test here
}
```

# Test Lifecycle (Setup and Cleanup) – `@BeforeEach`, `@AfterEach`

In JUnit, tests should be **independent**.
That means each test should start with a **fresh setup** and should not be affected by what happened in previous tests.

To support this, JUnit provides lifecycle annotations:

* `@BeforeEach` → runs **before every test method**
* `@AfterEach` → runs **after every test method**

These help you write clean tests without repeating the same setup code in every test.

## Why Setup and Cleanup are Needed

### 1) Avoid repeating code

Without lifecycle methods, you might create objects in every test again and again.

### 2) Keep tests independent

If a test modifies an object, the next test should not reuse that modified object.

### 3) Prevent resource issues

Some tests open resources like:

* files
* database connections (in integration tests)
* streams
* temporary data

Cleanup ensures those resources are closed properly.

## `@BeforeEach` (Setup)

`@BeforeEach` is used to prepare things needed for each test, such as:

* creating objects (service, calculator, repository)
* initializing sample test data
* resetting counters/variables

**Runs once per test**.

Example idea:

* create a new `Calculator` object before each test runs.


## `@AfterEach` (Cleanup)

`@AfterEach` is used to clean things after each test, such as:

* setting objects to null (optional)
* deleting temporary files
* clearing shared data
* closing resources (streams, connections)

**Runs once per test** after the test completes.

## Execution Order (How it Works)

If you have 3 test methods:

* `@BeforeEach` runs 3 times
* `@AfterEach` runs 3 times

Order:

1. `@BeforeEach`
2. `@Test` method runs
3. `@AfterEach`
   (repeats for every test)


## Simple Example (concept)

```java
@BeforeEach
void setUp() {
   // create fresh objects here
}

@AfterEach
void tearDown() {
   // cleanup after each test here
}
```
## Key Points

* Use `@BeforeEach` to **prepare common objects** used by multiple tests.
* Use `@AfterEach` to **reset or cleanup** after each test.
* This makes tests:

  * cleaner
  * easier to maintain
  * less error-prone
  * independent and reliable

# Running Tests in JUnit

After writing JUnit tests, you must know how to run them.
JUnit tests can be executed in two common ways:

1. **From an IDE** (fastest for beginners)
2. **From Maven/Gradle** (standard for real projects and CI/CD)

## 1) Running Tests From an IDE

Most IDEs support JUnit directly and provide buttons to run tests.

### In IntelliJ IDEA

* Open your test class (example: `CalculatorTest`)
* Click the **green play ▶️ icon** near:

  * the test method, or
  * the test class name
* You can run:

  * a single test method
  * the full test class
  * all tests in the project

Results appear in a **Test Runner panel** showing:

* ✅ passed tests
* ❌ failed tests (with error + stack trace)

### In Eclipse / Spring Tool Suite (STS)

* Right click the test class
* Select: **Run As → JUnit Test**
* Output will appear in the **JUnit View** panel

### In VS Code

* Install the **Java Extension Pack**
* Enable testing features
* You will see:

  * “Run Test” links above methods/classes
  * Testing sidebar showing results

### Why IDE running is useful

* Quick feedback while learning
* Easy debugging (breakpoints inside tests)
* You can run only one failing test repeatedly

## 2) Running Tests From Maven

Maven runs tests using the **test phase**.

### Standard command

```bash
mvn test
```

What it does:

* Compiles test code in `src/test/java`
* Runs all tests in the project
* Shows a summary:

  * tests run
  * failures
  * errors
  * skipped

### Running a specific test class

```bash
mvn -Dtest=CalculatorTest test
```

### Running a single test method (optional)

```bash
mvn -Dtest=CalculatorTest#add_shouldReturnSum test
```

### Why Maven running is important

* Works the same on any machine
* Used in CI/CD pipelines
* Standard in professional projects

## 3) Running Tests From Gradle

Gradle runs tests using the `test` task.

### Standard command

```bash
gradle test
```

(or)

```bash
./gradlew test
```

Gradle will:

* compile tests
* run tests
* generate reports under `build/reports/tests/test/index.html`

### Running a specific test class (common approach)

```bash
./gradlew test --tests CalculatorTest
```

### Why Gradle running is important

* Used in many Android/Spring/enterprise projects
* Easy integration with pipelines
* Produces readable HTML reports

## Where JUnit Looks for Tests

JUnit tests should be placed in:

* `src/test/java`

Main application code stays in:

* `src/main/java`
