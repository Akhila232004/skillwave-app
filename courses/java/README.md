## CONTENTS

* ### [Java Basics](./core-java/java-basics/java_basics.md)
    * ### [Install JDK & Hello World](./core-java/install-jdk-hello-world/install_jdk_hello_world.md)
        * Install JDK (Windows, Linux, macOS)
        * Set JAVA_HOME and PATH
        * Writing the first program
        * Compiling and Running (`javac`, `java`)
        * Understanding `main()` method
    * ### [Variables](./core-java/variables/variables.md)
        * Variable Declaration and Initialization
            * Syntax
            * Multiple Declarations
            * Default Values
        * Variable Types
            * Local Variables
            * Instance Variables
            * Static Variables
        * Reassigning & Scope
            * Variable Reassignment
            * Variable Shadowing
            * Scope (block, method, class, global)
        * Naming Rules
          
    * ### [Data Types](./core-java/data-types/data_types.md)
        * Primitive Data Types
            * byte
            * short
            * int
            * long
            * float
            * double
            * char
            * boolean
        * Non-Primitive (Reference) Data Types
            * Strings
            * Arrays
            * Classes
            * Interfaces
        * Null and Default Values
    * ### [Type Casting](./core-java/type-casting/type-casting.md)
        * Implicit (widening)
        * Explicit (narrowing)

    * ### [Operators & Expressions](./core-java/operators-expressions/operators_expressions.md)
        * Arithmetic Operators
        * Relational (Comparison) Operators
        * Logical Operators
        * Assignment Operators
        * Unary Operators
        * Ternary Operator
        * Precedence and Associativity
    * ### [Control Flow](./core-java/control-flow/control_flow.md)
        * Conditional Statements
            * if, if-else, nested if
            * switch-case
        * Looping Constructs
            * for loop
            * while loop
            * do-while loop
        * Jump Statements
            * break
            * continue
            * return
    * ### [Arrays](./core-java/arrays/arrays.md)
        * Introduction to Arrays
        * Declaring & Initializing Arrays
            * Arrays of Various Data Types
            * One-dimensional Arrays
            * Multidimensional Arrays (2D, 3D)
        * Array Operations
            * Traversing (for, for-each, while loop)
            * Updating & Accessing Elements
        * Arrays Utility Class
            * Arrays.toString
            * Arrays.equals
            * Arrays.copyOf
        * Limitations of Arrays
    * ### [Strings](./core-java/strings/strings.md)
        * Introduction to Strings
        * Declaring & Initializing Strings
        * String Immutability
        * String Operations
            * length(), charAt(), substring(), indexOf(), lastIndexOf()
            * toUpperCase(), toLowerCase(), trim(), replace(), contains()
            * equals(), equalsIgnoreCase(), compareTo(), startsWith(), endsWith()
        * String Concatenation
            * Using `+` operator
            * Using `concat()` method
            * Using `String.join()` and `String.format()`
        * String Comparison
            * `==` vs `equals()`
            * Lexicographical comparison using `compareTo()`
        * StringBuilder and StringBuffer
            * Mutable alternatives to String
            * Key methods: append(), insert(), delete(), reverse(), toString()
            * Performance and thread-safety differences
        * String Conversion
            * String ↔ Primitive (Integer.parseInt, String.valueOf)
            * String ↔ Char Array
        * String Splitting & Joining
            * split(), String.join()
        * Common String Problems
            * Reverse a String
            * Check Palindrome
            * Count Vowels/Consonants
            * Remove White Spaces
            * Find Character Frequency
        * String Utility Methods
            * format(), valueOf(), replaceAll(), isEmpty(), isBlank()
        * Limitations of Strings
            * Immutability overhead
            * Prefer StringBuilder for modifications
    * ### [Wrapper Classes](./core-java/wrapper-classes/wrapper_classes.md)
        * Autoboxing
        * Unboxing
    * ### [Classes & Objects](./core-java/classes-objects/classes_objects.md)
        * Defining a Class
        * Creating Objects
        * Methods
            * Declaration & Calling
            * Parameters & Return Types
        * Constructors
            * Default Constructor
            * Parameterized Constructor
        * Access Modifiers (public, private, protected, default)
        * `this` keyword
        * Pass-by-Value (Java Parameter Passing)

* ### [Object Oriented Programming Concepts](./core-java/java-object-oriented-programming/java-object-oriented-programming.md)
    * ### [Encapsulation](./core-java/java-object-oriented-programming/encapsulation/encapsulation.md)
        * Definition & Importance
        * Data Hiding
        * Getters & Setters
        * Access Modifiers and Encapsulation
        * Real-world Example (Bank Account, Student Class)
        * Best Practices
    * ### [Inheritance](./core-java/java-object-oriented-programming/inheritance/inheritance.md)
        * Definition & Use Cases
        * Types of Inheritance
            * Single Inheritance
            * Multilevel Inheritance
            * Hierarchical Inheritance
        * `super` Keyword
            * Access Parent Constructors
            * Access Parent Methods & Variables
        * Method Overriding
        * Constructor Chaining
        * Limitations of Inheritance
    * ### [Polymorphism](./core-java/java-object-oriented-programming/polymorphism/polymorphism.md)
        * Definition & Types
            * Compile-time Polymorphism (Method Overloading)
            * Runtime Polymorphism (Method Overriding)
        * Rules for Overloading & Overriding
        * Dynamic Method Dispatch
        * `instanceof` Operator
    * ### [Abstraction](./core-java/java-object-oriented-programming/abstraction/abstraction.md)
        * Definition & Importance
        * Abstract Classes
            * Abstract Methods
            * Concrete vs Abstract Methods
        * Interfaces
            * Multiple Inheritance via Interfaces
            * Default & Static Methods (Java 8+)
            * Functional Interfaces
        * Difference Between Abstract Classes & Interfaces

    * ### [Exception Handling](./core-java/exception-handling/exception-handling.md)
        * Introduction to Exceptions
            * What is an Exception?
            * Exception Hierarchy (Throwable → Exception / Error)
        * Types of Exceptions
            * Checked Exceptions
            * Unchecked Exceptions (Runtime)
            * Errors
        * Handling Exceptions
            * try-catch block
            * finally block
            * try-with-resources (Java 7+)
        * Throwing Exceptions
            * `throw` keyword
            * `throws` keyword
        * Custom Exceptions
        <!-- * Best Practices for Exception Handling -->

    * ### [Collections Framework](./core-java/collections-framework/collections_framework.md)
        * Introduction to Collections
            * Arrays vs Collections
            * Collection Hierarchy
        * Interfaces
            * List (ArrayList, LinkedList, Vector, Stack)
            * Set (HashSet, TreeSet, LinkedHashSet)
            * Queue (PriorityQueue, Deque)
            * Map (HashMap, TreeMap, LinkedHashMap, Hashtable)
        * Iteration Techniques
            * for-each loop
            * Iterator
            * ListIterator
            * forEach with Lambda
        * Utility Classes
            * Collections
            * Arrays


    * ### [Generics](./core-java/generics/generics.md)
        * Introduction to Generics
        * Generic Classes
        * Generic Methods
        * Bounded Type Parameters
            * Upper Bound (`extends`)
            * Lower Bound (`super`)
        * Wildcards
            * Unbounded `?`
            * Upper-Bounded `? extends`
            * Lower-Bounded `? super`
        * Generics with Collections
        * Advantages & Limitations of Generics

    * ### [Multithreading & Concurrency](./core-java/multithreading-concurrency/multithreading_concurrency.md)
        * Introduction to Multithreading
            * Process vs Thread
            * Thread Lifecycle
        * Creating Threads
            * Extending Thread class
            * Implementing Runnable interface
            * Using Executor Framework
        * Thread Methods
            * sleep, join, yield, interrupt
        * Synchronization
            * Synchronized Methods
            * Synchronized Blocks
            * Locks
        * Concurrency Utilities (java.util.concurrent)
            * ExecutorService
            * Callable & Future
            * CountDownLatch
            * Semaphore
            * Concurrent Collections
    

    * ### [Java I/O & Streams](./core-java/java-io-streams/java_io_streams.md)
        * Java I/O Basics
            * Byte Streams vs Character Streams
            * InputStream & OutputStream
            * Reader & Writer classes
        * File Handling
            * FileReader & FileWriter
            * BufferedReader & BufferedWriter
            * FileInputStream & FileOutputStream
        * Object Serialization
            * Serializable Interface
            * transient keyword
        * Java NIO (New I/O)
            * Channels & Buffers
            * Paths & Files class
        <!-- * Best Practices -->

    * ### [Java 8+ Features](./core-java/java8-features/java8_features.md)
        * Lambda Expressions
            * Syntax & Usage
            * Functional Programming basics
        * Functional Interfaces
            * @FunctionalInterface annotation
            * Built-in interfaces: Predicate, Function, Supplier, Consumer
        * Streams API
            * Creating Streams
            * Intermediate Operations (map, filter, sorted)
            * Terminal Operations (collect, forEach, reduce)
        * Method References
        * Optional Class
            * Avoiding NullPointerException
            * Methods: of(), empty(), get(), orElse()
        * New Date & Time API (java.time)
            * LocalDate, LocalTime, LocalDateTime
            * ZonedDateTime, Instant
            * DateTimeFormatter
* ### [Java Common Libraries](./java-common-libraries/java_common_libraries.md)
    * JavaMail (Email API)
        * What is JavaMail?
        * SMTP basics (host, port, username, password)
        * Adding JavaMail dependency (Maven/Gradle)
        * Sending a simple text email
        * Overview: HTML emails & attachments
    * Log4j (Logging Framework)
        * Need for logging vs System.out.println
        * Log levels: ERROR, WARN, INFO, DEBUG, TRACE
        * Adding Log4j dependency
        * Creating and using a Logger
        * Basic configuration (console/file logging)
    * JUnit (Unit Testing)
        * What is unit testing?
        * Adding JUnit dependency
        * Writing test classes and test methods
        * Common assertions (assertEquals, assertThrows, etc.)
        * Running tests from IDE / Maven

* ### [Spring Framework](./spring-framework/spring_framework.md)

    * ### [Spring Core](./spring-framework/spring-core/spring_core.md)
        * Introduction to Spring
            * What is Spring Framework?
            * Features of Spring
            * Advantages of Spring
        * Inversion of Control (IoC)
            * Concept of IoC
            * IoC Container
            * BeanFactory vs ApplicationContext
        * Dependency Injection (DI)
            * Constructor Injection
            * Setter Injection
            * Field Injection (not recommended)
        * Bean Configuration
            * XML-based Configuration
            * Annotation-based Configuration
            * Java-based Configuration (@Configuration, @Bean)
        * Bean Scopes
            * Singleton
            * Prototype
            * Request, Session, Application
        * Spring Annotations
            * @Component, @Service, @Repository
            * @Autowired
            * @Qualifier, @Primary
        * Lifecycle of a Bean
            * init() and destroy() methods
            * @PostConstruct and @PreDestroy

    * ### [Spring MVC](./spring-framework/spring-mvc/spring_mvc.md)
        * Introduction to Spring MVC
            * MVC Design Pattern (Model-View-Controller)
            * Advantages of Spring MVC
        * DispatcherServlet
            * Front Controller Concept
            * Request Handling Flow
        * Controllers
            * @Controller
            * @RestController
            * @RequestMapping, @GetMapping, @PostMapping
        * Request Parameters & Path Variables
            * @RequestParam
            * @PathVariable
        * Model & View
            * Returning ModelAndView
            * Returning JSON/XML responses
        * Form Handling
            * Data Binding
            * @ModelAttribute
            * Validation with JSR-303 (@Valid)
        * Exception Handling
            * @ExceptionHandler
            * @ControllerAdvice
        * View Technologies
            * JSP
            * Thymeleaf
            * FreeMarker

* ### [Spring Boot](./spring-boot/spring_boot.md)

    * ### [Introduction](/spring-boot/introduction.md)
  
        * Introduction to Spring Boot
        * Difference between Spring & Spring Boot
        * Features & Advantages
    * Getting Started
        * Spring Boot CLI & Initializr
        * Using Spring Initializr
        * Command Line Setup
    * Configuration Files
        * Application Properties vs YAML
        * application.properties
        * application.yml
    * Dependencies
        * Spring Boot Starters
    
    * ### [Auto Configuration](./spring-boot/auto-configuration/auto_configuration.md)
      * Auto Configuration Explained
        * @SpringBootApplication
        * @EnableAutoConfiguration
    


    * ### [Profiles & Configuration Management](./spring-boot/profiles_configuration/profiles_configuration.md)
    * Profiles in Spring Boot
        * @Profile Annotation
        * application-{profile}.yml
        * Active Profiles
    * External Configuration
        * Environment Variables
        * Command-Line Arguments
        * System Properties
    * Configuration Management
        * @Value Annotation
        * @ConfigurationProperties
        * Type-safe Configuration
    * Secrets Management
        * Using .env files
        * Integration with Vault, AWS Secrets Manager

    * ### [REST API Development](./spring-boot/rest-api/rest_api.md)
        * Introduction to REST Architecture
        * Creating REST Controllers
            * @RestController
            * @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
        * Request Handling
            * @RequestParam
            * @PathVariable
            * @RequestBody
        * Response Handling
            * ResponseEntity
            * Returning JSON/XML
        * Exception Handling
            * @ExceptionHandler
            * @ControllerAdvice
        * Data Validation
            * @Valid Annotation
            * Custom Validators
        * Pagination & Sorting
        * File Upload & Download APIs

    * ### [Spring Security](./spring-boot/spring-security/spring_security.md)
        * Introduction to Security in Spring Boot
        * Authentication vs Authorization
        * Spring Security Basics
            * Security Filters & DelegatingFilterProxy
            * In-Memory Authentication
            * JDBC Authentication
        * Password Encoding (BCrypt)
        * Role-Based Access Control
        * JWT (JSON Web Token) Authentication
            * Token Generation
            * Token Validation
            * Securing REST APIs with JWT
        * OAuth2 & Social Login
            * Google/GitHub/Facebook Login
            * Authorization Server vs Resource Server
        * Method-Level Security
            * @PreAuthorize, @PostAuthorize

    * ### [API Documentation](./spring-boot/api-documentation/api_documentation.md)
        * Introduction to API Documentation
        * Swagger (Springfox)
            * Adding Swagger to Spring Boot
            * Swagger UI
        * OpenAPI (springdoc-openapi)
            * Configuring OpenAPI
            * Annotations for Documentation
        * Best Practices for API Documentation
        * Generating API Docs Automatically

    * ### [Testing](./spring-boot/testing/testing.md)
        * Unit Testing
            * JUnit 5 Basics
            * Assertions
        * Mocking
            * Mockito Framework
            * Mocking Dependencies (@Mock, @InjectMocks)
        * Integration Testing
            * @SpringBootTest
            * TestRestTemplate
            * WebTestClient
        * Testing Data Layer
            * @DataJpaTest
            * H2 In-Memory Database
        * TestContainers
            * Running DBs in Docker for Testing

* ### [Microservices](./microservices/microservices.md)

    * ### [Introduction to Microservices](./microservices/introduction/introduction_microservices.md)
        * What are Microservices?
        * Monolith vs Microservices
        * Advantages of Microservices
        * Challenges of Microservices
        * Microservices Design Principles
            * Single Responsibility Principle
            * Loose Coupling
            * High Cohesion
        * Real-world Examples of Microservices

    * ### [Service Boundaries](./microservices/service-boundaries/service_boundaries.md)
        * Identifying Service Boundaries
        * Business Capability-driven Design
        * Bounded Context (Domain-Driven Design)
        * Avoiding Over-Granularity
        * Example: E-commerce (Order Service, Payment Service, Inventory Service)

    * ### [Communication (REST, Messaging)](./microservices/communication/communication.md)
        * Synchronous Communication
            * REST APIs
            * gRPC Basics
        * Asynchronous Communication
            * Message Brokers (Kafka, RabbitMQ, ActiveMQ)
            * Event-driven Architecture
        * Request/Response vs Event-Driven
        * When to Choose REST vs Messaging
        * Handling Communication Failures

    * ### [Service Discovery](./microservices/service-discovery/service_discovery.md)
        * What is Service Discovery?
        * Client-Side Discovery vs Server-Side Discovery
        * Netflix Eureka
            * Registering Services
            * Eureka Server Setup
            * Eureka Client
        * Consul
            * Service Registration
            * Health Checks
        * DNS-based Service Discovery (Kubernetes)
        * Best Practices

    * ### [API Gateway](./microservices/api-gateway/api_gateway.md)
        * What is an API Gateway?
        * Role in Microservices Architecture
        * Spring Cloud Gateway
            * Routing
            * Filters
            * Predicates
        * Alternatives (Zuul, Kong, NGINX)
        * Cross-cutting Concerns via API Gateway
            * Authentication
            * Rate Limiting
            * Logging & Monitoring

    * ### [Centralized Config](./microservices/centralized-config/centralized_config.md)
        * The Need for Centralized Config
        * Spring Cloud Config
            * Config Server
            * Config Client
            * Git-backed Configuration
        * Dynamic Refresh (@RefreshScope)
        * Security of Configurations
        * Alternatives (Consul KV, Vault, AWS Parameter Store)

    * ### [Resilience](./microservices/resilience/resilience.md)
        * Introduction to Resilience
        * Failures in Distributed Systems
        * Resilience Patterns
            * Circuit Breaker
            * Retry
            * Bulkhead
            * Rate Limiting
        * Resilience4j
            * Setting up Circuit Breaker
            * Retry Mechanism
            * Timeouts
            * Fallbacks
        * Hystrix (legacy comparison)
        <!-- * Chaos Engineering Basics -->


* ### [Database & Persistence](./database/database_persistence.md)

    * ### [SQL & Databases](./database/sql-databases/sql_databases.md)
        * Introduction to Databases
            * What is a Database?
            * RDBMS vs NoSQL
            * Popular Databases (MySQL, PostgreSQL, Oracle, SQL Server)
        * SQL Basics
            * DDL (CREATE, ALTER, DROP)
            * DML (INSERT, UPDATE, DELETE)
            * DQL (SELECT, WHERE, ORDER BY, LIMIT)
            * DCL & TCL (GRANT, COMMIT, ROLLBACK)
        * Joins & Subqueries
            * INNER JOIN
            * LEFT JOIN / RIGHT JOIN
            * FULL OUTER JOIN
            * CROSS JOIN
            * Nested Subqueries
            * Correlated Subqueries
        * Functions & Views
            * Aggregate Functions (COUNT, SUM, AVG, MAX, MIN)
            * String Functions (CONCAT, SUBSTR, LENGTH, UPPER, LOWER)
            * Date/Time Functions (NOW, DATEADD, DATEDIFF)
            * Views (Simple & Complex Views)
            * Materialized Views (concept)
        * Transactions
            * ACID Properties
            * BEGIN / COMMIT / ROLLBACK
            * SAVEPOINT
            * Isolation Levels (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE)
            * Deadlocks & Concurrency Issues
        * Database Design & Indexing
            * Normalization (1NF, 2NF, 3NF, BCNF)
            * Primary & Foreign Keys
            * Indexing (Clustered, Non-Clustered, Composite Index)
            * Query Optimization Basics
            * ER Diagrams

    * ### [ORM with Hibernate/JPA](./database/hibernate-jpa/hibernate_jpa.md)
        * Introduction to ORM
            * What is ORM?
            * Advantages & Disadvantages
            * JPA vs Hibernate
        * Entity Mapping
            * @Entity, @Table
            * @Id & @GeneratedValue
            * Column Mapping (@Column)
        * Relationships
            * One-to-One (@OneToOne)
            * One-to-Many / Many-to-One (@OneToMany, @ManyToOne)
            * Many-to-Many (@ManyToMany, Join Tables)
            * Cascade Types & Orphan Removal
        * JPQL & Criteria API
            * JPQL Queries
            * Named Queries
            * Criteria API
        * Pagination & Sorting
            * Pageable & Sort in Spring Data JPA
            * Query Methods
            * Custom Pagination
        * Caching
            * First-Level Cache (Session)
            * Second-Level Cache (Ehcache, Infinispan, Redis)
            * Query Cache
        * Best Practices
            * Lazy vs Eager Fetching
            * N+1 Problem & Solutions


* ### Front-End Development
 * ### [HTML & CSS](./frontend/html-css/html_css.md)

    * ### [HTML5 Basics](./frontend/html-css/html5-basics/html5_basics.md)
        * Introduction to HTML
            * What is HTML?
            * Structure of an HTML Document
            * Elements & Attributes
        * Headings, Paragraphs & Text Formatting
        * Lists
            * Ordered Lists
            * Unordered Lists
            * Definition Lists
        * Links & Anchors
        * Images & Multimedia
        * Semantic Elements
            * header, nav, section, article, aside, footer
        * Forms
            * Input Types (text, password, email, number, date, etc.)
            * Labels & Fieldsets
            * Form Validation (required, pattern)

    * ### [Forms & Semantic Tags](./frontend/html-css/forms-semantic/forms_semantic.md)
        * HTML Forms Deep Dive
            * action, method, enctype
            * GET vs POST
        * Advanced Form Controls
            * radio, checkbox, select, textarea
            * datalist, range, color
        * Semantic HTML
            * Importance of Semantics
            * Accessibility & SEO Benefits
            * Common Semantic Tags (main, figure, figcaption, mark, time)
        * Best Practices for Semantic HTML

    * ### [CSS3 Basics](./frontend/html-css/css3-basics/css3_basics.md)
        * Introduction to CSS
            * Inline, Internal, External CSS
            * Selectors (element, class, id, attribute, pseudo-classes)
        * Colors, Backgrounds & Borders
        * Fonts & Text Styling
        * Box Model
            * Margin, Border, Padding, Content
        * Display & Visibility
            * block, inline, inline-block, none
        * Positioning
            * static, relative, absolute, fixed, sticky
        * Units
            * px, %, em, rem, vw, vh

    * ### [Responsive Design (Flexbox & Grid)](./frontend/html-css/responsive-design/responsive_design.md)
        * Introduction to Responsive Design
            * Media Queries
            * Mobile-first vs Desktop-first
        * Flexbox
            * Container Properties (flex-direction, justify-content, align-items)
            * Item Properties (flex, order, align-self)
            * Common Layout Patterns with Flexbox
        * CSS Grid
            * Grid Container & Grid Items
            * Rows & Columns
            * Grid Areas
            * Nested Grids
        * Responsive Images & Viewport
        * Best Practices for Responsive Web Design

* ### [JavaScript & ES6+](./frontend/javascript-es6/javascript_es6.md)

    * ### [Variables, Functions & Scope](./frontend/javascript-es6/variables-functions-scope/variables_functions_scope.md)
        * Introduction to JavaScript
            * Dynamic Typing
            * Interpreted Language
        * Variables
            * var, let, const
            * Hoisting
            * Block vs Function Scope
        * Data Types
            * Primitive (string, number, boolean, null, undefined, symbol, bigint)
            * Reference (objects, arrays, functions)
        * Functions
            * Function Declaration
            * Function Expression
            * Arrow Functions
            * Default Parameters
            * Rest & Spread Operators
        * Scope
            * Global Scope
            * Function Scope
            * Block Scope
            * Lexical Scope & Closures

    * ### [DOM Manipulation](./frontend/javascript-es6/dom-manipulation/dom_manipulation.md)
        * The Document Object Model (DOM)
        * Selecting Elements
            * getElementById, getElementsByClassName, getElementsByTagName
            * querySelector, querySelectorAll
        * Changing Content & Attributes
            * innerHTML, textContent
            * setAttribute, getAttribute
        * Styling Elements
            * style property
            * classList methods
        * Creating & Removing Elements
            * createElement, appendChild, insertBefore
            * removeChild, replaceChild
        * Traversing the DOM
            * parentNode, childNodes, nextSibling, previousSibling

    * ### [Events & Fetch API](./frontend/javascript-es6/events-fetch-api/events_fetch_api.md)
        * JavaScript Events
            * Inline Events vs addEventListener
            * Mouse Events (click, dblclick, mouseover, mouseout)
            * Keyboard Events (keydown, keyup)
            * Form Events (submit, change, focus, blur)
        * Event Object
            * Event Propagation (bubbling & capturing)
            * preventDefault() and stopPropagation()
        * The Fetch API
            * Fetch Basics (GET & POST requests)
            * Handling JSON responses
            * Headers and Request Options
            * Error Handling with fetch()
        * Comparing Fetch with XMLHttpRequest (XHR)

    * ### [Promises & Async/Await](./frontend/javascript-es6/promises-async-await/promises_async_await.md)
        * Introduction to Asynchronous JavaScript
            * The Event Loop & Callbacks
        * Promises
            * Creating Promises
            * then(), catch(), finally()
            * Chaining Promises
            * Common Pitfalls
        * Async & Await
            * Writing Async Functions
            * await keyword
            * Error Handling with try/catch
        * Combining Promises & Async/Await
        * Real-world Examples
            * API Calls
            * Sequential vs Parallel Execution

* ### [React.js](./frontend/react/react.md)

    * ### [Components & JSX](./frontend/react/components-jsx/components_jsx.md)
        * Introduction to React
            * What is React?
            * SPA (Single Page Applications) Concept
        * JSX Syntax
            * Embedding Expressions
            * JSX vs HTML
            * Fragments (`<>...</>`)
        * Components
            * Functional Components
            * Class Components
            * Props (Passing Data)
            * Component Reusability
        * Rendering Lists
            * Using `map()`
            * Keys in React
        * Conditional Rendering
            * if/else
            * Ternary Operator
            * Short-circuit `&&`

    * ### [State & Props](./frontend/react/state-props/state_props.md)
        * Props
            * Passing Data Between Components
            * Default Props
            * PropTypes (Type Checking)
        * State
            * What is State?
            * Initializing State
            * Updating State
            * State vs Props
        * Lifting State Up
        * Controlled vs Uncontrolled Components
        * Passing Functions as Props

    * ### [Hooks](./frontend/react/hooks/hooks.md)
        * Introduction to Hooks
            * Why Hooks? (Functional Components vs Class Components)
        * useState
            * Declaring State Variables
            * Updating State
        * useEffect
            * Side Effects
            * Cleanup Function
            * Dependency Array
        * useRef
            * Accessing DOM Elements
            * Persisting Values Between Renders
        * useContext
            * Using Context API
        * Custom Hooks
            * Creating & Using Custom Hooks
        * Rules of Hooks

    * ### [Routing](./frontend/react/routing/routing.md)
        * Introduction to React Router
        * Setting Up Routes
        * Nested Routes
        * Route Parameters
        * Redirects & Navigation
        * Protected Routes
        * Lazy Loading Routes

    * ### [State Management](./frontend/react/state-management/state_management.md)
        * Context API
            * Creating Context
            * Provider & Consumer
            * useContext Hook
        * Redux
            * Core Concepts (Store, Reducer, Action)
            * Setting Up Redux
            * Connecting Redux with React
            * Redux Toolkit (RTK)
        * Comparison: Context API vs Redux
        * Best Practices

    * ### [UI Libraries](./frontend/react/ui-libraries/ui_libraries.md)
        * Introduction to UI Libraries
        * Material UI
            * Components (Buttons, Cards, Dialogs, Forms)
            * Theming & Customization
        * Tailwind CSS
            * Utility-First CSS
            * Applying Styles in JSX
            * Responsive Design
        * Other Libraries
            * Ant Design
            * Chakra UI


* ### DevOps & Deployment
    * ### [Build Tools](./devops/build-tools/build_tools.md)
        * Maven
        * Gradle
    * ### [Version Control](./devops/version-control/version_control.md)
        * Git Basics
        * Branching & Merging
        * Pull Requests & Code Reviews
    * ### [CI/CD & Deployment](./devops/cicd-deployment/cicd_deployment.md)
        * Docker
        * Kubernetes (basics)
        * Cloud Platforms (AWS, Azure)
        * CI/CD Pipelines (Jenkins, GitHub Actions)

* ### Testing & Quality
    * ### [Unit Testing](./testing/unit-testing/unit_testing.md)
        * JUnit 5
        * Assertions & Test Suites
    * ### [Mocking & Integration Testing](./testing/integration-testing/integration_testing.md)
        * Mockito
        * SpringBootTest
        * TestContainers for Database Tests
    * ### [Best Practices](./testing/best-practices/testing_best_practices.md)
        * TDD Basics
        * Coverage & CI Integration

* ### Capstone Project
    * End-to-End Full-Stack Project
        * React Frontend
        * Spring Boot REST APIs
        * Hibernate + SQL Database
        * Authentication with JWT
        * Deployment using Docker & AWS

* ### [Spring Boot Projects](./projects-mindmap/projectsMindMaps.md)
    * HR Management System Mindmap
    * Shopping Cart System Mindmap