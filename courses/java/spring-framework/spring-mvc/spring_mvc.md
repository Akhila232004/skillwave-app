# **Introduction to Spring MVC**

Spring MVC is a framework within the Spring ecosystem used to build **web applications and REST APIs**.
It follows the MVC (Model–View–Controller) design pattern, which helps organize application code cleanly.
Spring MVC handles user requests, processes the logic, and returns the appropriate response (HTML page, JSON, etc.).

Spring MVC provides:

* A clear separation of concerns
* Powerful request handling
* Easy integration with templates (Thymeleaf, JSP)
* Full support for REST API development

## **MVC Design Pattern (Model–View–Controller)**

The MVC pattern divides an application into three main components:

### **Model**

Represents the **data** and **business logic**.
Contains Java objects, entities, and services responsible for processing data.

### **View**

Represents the **user interface**.
It shows data to the user using JSP, Thymeleaf, or JSON responses.

### **Controller**

Handles **incoming requests**, processes them through the model, and selects the appropriate view to return.

### Simple Flow:

1. User sends a request
2. **Controller** handles it
3. **Model** processes data
4. **View** displays the output

This separation makes the application cleaner, easier to maintain, and modular.  

## **Advantages of Spring MVC**

### **Clear Separation of Concerns**
MVC divides responsibilities among Model, View, and Controller, making the application structure clean and understandable.
### **Flexible and Extensible**
Spring MVC supports different view technologies (Thymeleaf, JSP, FreeMarker) and easily integrates with databases, security, and REST APIs.
### **Powerful Request Handling**
Annotations like `@Controller`, `@GetMapping`, and `@PostMapping` make it easy to handle HTTP requests.
### **Built-in Validation & Form Handling**
Spring MVC supports form data binding, validation, and error handling out-of-the-box.

### **Perfect for Web + REST Development**
You can build both traditional web applications and modern REST APIs with the same framework.

### **Part of the Spring Ecosystem**
Works seamlessly with Spring Boot, Spring Security, Spring Data, and more.


# **DispatcherServlet**

The **DispatcherServlet** is the core component of Spring MVC.
It acts as the **front controller** that receives every incoming request, delegates it to the correct controller, and returns the appropriate response.

Think of it as the “traffic controller” of your Spring MVC application.

## **Front Controller Concept**

The Front Controller pattern means that **a single central servlet** handles **all** incoming web requests.

In Spring MVC:

* `DispatcherServlet` is the front controller
* It receives every request first
* It decides which controller should handle the request
* It manages the entire workflow of request → processing → response

Benefits:

* Centralized request handling
* Easy to manage application flow
* Clear separation of responsibilities


## **Request Handling Flow**

Spring MVC follows a step-by-step request processing flow using the DispatcherServlet.

### **1. Request Comes In**

The user sends a request (e.g., `/home`).
DispatcherServlet receives it.

### **2. Mapping the Request**

DispatcherServlet checks which controller method matches the request using handler mappings.

### **3. Call the Controller**

The appropriate controller method executes and processes the request.

### **4. Return Model & View (or JSON)**

The controller returns:

* A view name + model data (for web pages), or
* A JSON response (for REST APIs)

### **5. View Resolution (if using HTML pages)**

DispatcherServlet selects the correct view (JSP, Thymeleaf, etc.).

### **6. Final Response**

The view is rendered and returned to the user.

### **Simple Flow Summary**

```
Client Request
        ↓
DispatcherServlet (Front Controller)
        ↓
Find Controller
        ↓
Execute Business Logic
        ↓
Prepare Model + View (or JSON)
        ↓
Send Response to Client
```


# **Controllers**

In Spring MVC, a **Controller** is responsible for handling incoming HTTP requests and returning responses.
Controllers connect the **client request** to the **business logic** and then send back the result, either as a web page or as JSON.

Controllers are central to building both **web applications** and **REST APIs**.


## **@Controller**

`@Controller` is used to define a controller that returns **HTML views** (e.g., Thymeleaf, JSP).

Key points:

* Used in traditional web applications
* Methods return view names or `ModelAndView` objects
* Often paired with a template engine

Concept example:

```java
@Controller
public class HomeController {
    @GetMapping("/home")
    public String homePage() {
        return "home"; // returns home.html
    }
}
```

## **@RestController**

`@RestController` is used for building **REST APIs**.
It automatically converts returned objects into JSON or XML.

Key points:

* Combines `@Controller` + `@ResponseBody`
* Every method returns JSON by default
* Used in APIs, mobile backends, and microservices

Concept example:

```java
@RestController
public class ApiController {
    @GetMapping("/api/message")
    public String getMessage() {
        return "Hello from API";
    }
}
```

## **@RequestMapping, @GetMapping, @PostMapping**

Spring MVC provides mapping annotations to connect URLs to controller methods.

### **@RequestMapping**

A general-purpose annotation for mapping URLs to controllers.
Can be used for any HTTP method (GET, POST, PUT, DELETE).

Example:

```java
@RequestMapping("/products")
public String handleProducts() { ... }
```

### **@GetMapping**

Short-hand for handling **GET** requests.
Used when fetching or displaying data.

Example:

```java
@GetMapping("/users")
public List<User> getUsers() { ... }
```

### **@PostMapping**

Short-hand for handling **POST** requests.
Used when submitting or creating new data.

Example:

```java
@PostMapping("/users")
public String createUser(@RequestBody User user) { ... }
```
# **Request Parameters & Path Variables**

In Spring MVC, you can receive data from the client through:

1. **Request Parameters** (part of the URL query string)
2. **Path Variables** (part of the URL path)

Both methods are used to pass values to controller methods, but they serve different purposes.

## **@RequestParam**

`@RequestParam` is used to extract **query parameters** from the URL.
These are key–value pairs that come after a `?` in the URL.

Example URL:

```
/search?keyword=java&page=2
```

Usage:

* Good for optional values
* Good for filters, pagination, search terms

Concept example:

```java
@GetMapping("/search")
public String search(@RequestParam String keyword,
                     @RequestParam int page) {
    return "Searching for " + keyword + " on page " + page;
}
```

Features:

* Parameters can be marked as required or optional
* You can provide default values

Example with defaults:

```java
@RequestParam(defaultValue = "1") int page
```

## **@PathVariable**

`@PathVariable` extracts values **directly from the URL path**.
These are typically used to identify specific resources (like user IDs, product IDs).

Example URL:

```
/users/10
```

Concept example:

```java
@GetMapping("/users/{id}")
public String getUser(@PathVariable int id) {
    return "User ID: " + id;
}
```

Usage:

* Used for fixed URL patterns
* Good for fetching, updating, or deleting specific items

Example:

```
/products/50/details
/products/{productId}/details
```
# **Model & View**

In Spring MVC, the Model and View together define what data is sent to the user and how it is displayed.

* **Model** holds the data you want to show
* **View** decides how that data is rendered (HTML page, template, etc.)

For REST APIs, instead of returning views, you return **JSON/XML** responses.

## **Returning ModelAndView**

`ModelAndView` is used when building traditional web applications (JSP, Thymeleaf).
It combines both:

* The **view name** (HTML page)
* The **model data** to display on that page

Example concept:

```java
@Controller
public class HomeController {

    @GetMapping("/home")
    public ModelAndView homePage() {
        ModelAndView mv = new ModelAndView("home"); // home.html
        mv.addObject("message", "Welcome to Spring MVC");
        return mv;
    }
}
```

This:

* Loads the `home` view
* Passes `"Welcome to Spring MVC"` as model data

Use `ModelAndView` when rendering **server-side HTML pages**.

## **Returning JSON/XML responses**

When building REST APIs, you don’t return views.
Instead, Spring automatically converts Java objects into **JSON or XML** and sends them as the response.

This is done by using:

* `@RestController`
* or `@ResponseBody`

Example returning JSON:

```java
@RestController
public class ApiController {

    @GetMapping("/product")
    public Product getProduct() {
        return new Product("Laptop", 60000);
    }
}
```

Spring converts the `Product` object into JSON automatically:

```json
{
  "name": "Laptop",
  "price": 60000
}
```

To return XML, ensure the required XML converter is enabled, and Spring will handle it in a similar way.

Use JSON/XML responses when building **RESTful services**, mobile backends, or APIs for front-end frameworks like React or Angular.

# **Form Handling**

Form handling in Spring MVC allows you to collect user input (like login forms, registration forms, or product forms) and bind that data directly to Java objects.
Spring automatically maps form fields to object fields, validates them, and passes them to your controller.

## **Data Binding**

Data Binding is the process where Spring MVC automatically maps **form input fields** to **Java object properties**.

Example:
If your form has fields like:

```
name=John
age=25
```

And your Java object is:

```java
public class User {
    private String name;
    private int age;
}
```

Spring automatically fills the `User` object with submitted values.

Benefits:

* No manual parsing of request parameters
* Cleaner controller code
* Automatic population of model objects

## **@ModelAttribute**

`@ModelAttribute` is used to bind form data to a Java object and pass it to the controller method.

Example concept:

```java
@PostMapping("/register")
public String registerUser(@ModelAttribute User user) {
    // user object now contains form data
    return "success";
}
```

Uses:

* Automatically binds form fields to object properties
* Also exposes the object to the view template
* Useful for pre-populating forms

You typically use `@ModelAttribute` when dealing with **HTML form submissions**.

## **Validation with JSR-303 (@Valid)**

JSR-303 is the standard validation framework in Spring for validating form inputs.

`@Valid` triggers validation on the object annotated with validation rules.

Example concept:

```java
public class User {
    @NotBlank
    private String name;

    @Min(18)
    private int age;
}
```

Controller:

```java
@PostMapping("/register")
public String register(@Valid @ModelAttribute User user, BindingResult result) {
    if (result.hasErrors()) {
        return "form"; // show errors on form
    }
    return "success";
}
```

Spring checks the validation rules:

* If errors → return the form with messages
* If valid → proceed with the action

Benefits:

* Ensures clean and validated input
* Reduces errors and invalid data
* Works seamlessly with form binding

# **Exception Handling**

Exception handling in Spring MVC ensures that when something goes wrong in your application, it is handled in a clean, consistent, and user-friendly way.
Instead of showing raw error messages, Spring lets you define how to respond when exceptions occur.

You can handle exceptions:

* Inside a specific controller
* Globally across the whole application

## **@ExceptionHandler**

`@ExceptionHandler` is used inside a controller to handle specific exceptions thrown by that controller’s methods.

It allows you to:

* Catch an exception
* Return a proper error response
* Show a custom error page or message

Example concept:

```java
@Controller
public class UserController {

    @ExceptionHandler(UserNotFoundException.class)
    public String handleUserNotFound() {
        return "error-user-not-found";
    }
}
```

Usage:

* Handles exceptions **only for that controller**
* Good for controller-specific errors


## **@ControllerAdvice**

`@ControllerAdvice` is used to handle exceptions **globally** across all controllers in the application.

It centralizes error handling so you don’t repeat the same code in multiple controllers.

Example concept:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public String handleAllExceptions() {
        return "error-general";
    }
}
```

Benefits:

* One place for all common exception logic
* Cleaner controllers
* Reusable across the entire application

Use `@ControllerAdvice` when you want consistent and application-wide error handling.

# **View Technologies**

View technologies are used in Spring MVC to render the user interface.
They take model data from the controller and display it as HTML pages.
Spring MVC supports several view engines, with JSP, Thymeleaf, and FreeMarker being the most commonly used.


## **JSP**

JSP (JavaServer Pages) is one of the earliest Java-based view technologies.

Key points:

* Allows embedding Java code inside HTML (though not recommended today)
* Uses `.jsp` files located inside `WEB-INF/views`
* Works well for simple server-side rendered pages
* Often used in older Spring MVC applications

JSP is straightforward but less modern compared to newer view technologies.

## **Thymeleaf**

Thymeleaf is a modern server-side template engine commonly used in Spring Boot applications.

Key points:

* Uses natural HTML templates (valid HTML files)
* Easy to integrate with Spring MVC
* Supports powerful template features (loops, conditions, fragments)
* More readable and modern compared to JSP

Thymeleaf is the preferred choice for many Spring Boot applications because of its clean syntax and strong Spring integration.

## **FreeMarker**

FreeMarker is a flexible and template-based view technology used for dynamic HTML generation.

Key points:

* Uses `.ftl` template files
* Good for generating not just HTML, but also emails, configuration files, etc.
* Supports expressions, loops, conditionals, and template inheritance
* Often used in applications that need high customization in templates

FreeMarker is a good choice when you need a powerful and customizable template system.




##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|