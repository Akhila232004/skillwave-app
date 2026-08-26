# Introduction to REST Architecture

**What is REST?**
A simple way to build web APIs. You expose **things** (called *resources*) using web addresses (URLs), and clients use standard HTTP methods to work with them.

**Key ideas**

* **Resources = nouns**: e.g., orders, customers, products.
* **URLs identify resources**:

  * Collection: `/api/v1/orders`
  * Single item: `/api/v1/orders/{id}`
* **Standard HTTP methods**:

  * `GET` → read
  * `POST` → add a new item
  * `PUT` → replace an existing item with a new version
  * `PATCH` → update part of an item
  * `DELETE` → remove an item
* **No server memory of the user between calls**: every request carries what the server needs (this is called *stateless*).
* **Clients can cache** responses if allowed, to make things faster.
* **Format of data**: usually **JSON**. The client says what it wants with `Accept`, and the server labels what it sends with `Content-Type`.

## Creating REST Controllers

**What a controller does**

1. Listens for a request at a URL (like `/api/v1/orders`).
2. Reads inputs from the path (`/orders/10`), query (`?q=abc`), headers, or body (JSON).
3. Calls your business logic (usually a **Service**).
4. Sends back a response (usually JSON).

**Minimal controller**

```java
package com.example.demo.api;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/orders",
                produces = MediaType.APPLICATION_JSON_VALUE)
public class OrderController {

  // GET /api/v1/orders
  @GetMapping
  public List<OrderDto> list() {
    return List.of(); // replace with service.findAll()
  }

  // POST /api/v1/orders
  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<OrderDto> create(@RequestBody CreateOrderDto req) {
    // replace with service.create(req)
    OrderDto saved = new OrderDto(1L, req.sku(), req.qty());
    return ResponseEntity.created(URI.create("/api/v1/orders/" + saved.id()))
                         .body(saved);
  }
}

// Simple request/response shapes
record CreateOrderDto(String sku, int qty) {}
record OrderDto(Long id, String sku, int qty) {}
```

## `@RestController`

**What it means**
Tells Spring: “This class handles web requests, and whatever the methods return should be written **directly** into the HTTP response (usually as JSON).”
It’s effectively `@Controller + @ResponseBody`.

**Typical shape**

```java
@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

  @GetMapping("/{id}")              // GET /api/v1/customers/7
  public CustomerDto get(@PathVariable Long id) {
    return new CustomerDto(id, "Acme"); // Spring turns this into JSON
  }
}

record CustomerDto(Long id, String name) {}
```

---
<!-- ## `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`

**Purpose:** Method-level request mappings specialized for a single HTTP method (syntactic sugar over `@RequestMapping(method=...)`).

* **Common attributes**

  * `value` / `path`: URI template(s), e.g., `"/orders/{id}"`.
  * `produces`: Media type(s) produced, e.g., `application/json`.
  * `consumes`: Media type(s) expected from the request body, e.g., `application/json`.
  * `params`, `headers`: Additional request constraints.

* **Parameter binding**

  * **Path variables:** `@PathVariable("id")` binds `{id}` from the URI.
  * **Query parameters:** `@RequestParam("q")` binds `?q=...`.
  * **Headers:** `@RequestHeader("X-Id")`.
  * **Body:** `@RequestBody` binds and deserializes JSON/XML to a Java type.

* **Return values**

  * POJOs → serialized (e.g., JSON) via converters.
  * `ResponseEntity<T>` for explicit control of **status**, **headers**, **body**.
  * `void` or `ResponseEntity<Void>` for `204 No Content` responses.

* **HTTP method semantics in REST**

  * **`@GetMapping`**

    * Read-only retrieval; **safe** and **idempotent**.
    * No request body; uses query/path parameters; cache-friendly when appropriate.
  * **`@PostMapping`**

    * Creation or non-idempotent operations on a collection or RPC-like commands.
    * Typical response for creation: `201 Created` with `Location: /resource/{id}`.
  * **`@PutMapping`**

    * **Full replacement** of the resource at the target URI; **idempotent**.
    * Client sends the complete representation to be stored.
  * **`@DeleteMapping`**

    * Remove the resource at the target URI; **idempotent**.
    * Often returns `204 No Content` when deletion succeeds and no body is needed.

* **Content negotiation**

  * Client advertises acceptable formats via `Accept`; controller can set `produces`.
  * For request bodies, client sends `Content-Type`; controller can require `consumes`.

* **Idempotency & safety (behavioral guarantees)**

  * **GET**: safe & idempotent.
  * **PUT/DELETE**: idempotent (repeated calls lead to same outcome).
  * **POST**: not idempotent (replay may create multiple resources or duplicate effects unless server guards against it).

* **Status code alignment (typical)**

  * `GET` (found) → `200 OK`
  * `POST` (created) → `201 Created` (+ `Location`)
  * `PUT` (updated/replaced) → `200 OK` or `204 No Content`
  * `DELETE` (removed) → `204 No Content` (or `200 OK` with body) -->


Got it — here’s **your exact content** with a **mini syntax/example right under every single bullet** (so learners see the rule and the matching code together).
*Assume base path `/api/v1/orders` inside a `@RestController @RequestMapping("/api/v1/orders")` and DTOs `record OrderDto(Long id,String sku,int qty){}` / `record CreateOrderDto(String sku,int qty){}`.*

---

## `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`

**Purpose:** Method-level request mappings specialized for a single HTTP method (syntactic sugar over `@RequestMapping(method=...)`).

### **Common attributes**

  * `value` / `path`: URI template(s), e.g., `"/orders/{id}"`.
    **Syntax:**

    ```java
    @GetMapping("/{id}")                 // GET /api/v1/orders/10
    public OrderDto get(@PathVariable Long id) { return new OrderDto(id,"SKU",1); }
    ```

  * `produces`: Media type(s) produced, e.g., `application/json`.
    **Syntax:**

    ```java
    @GetMapping(path="/{id}", produces="application/json")
    public OrderDto getJson(@PathVariable Long id){ return new OrderDto(id,"SKU",1); }
    ```

  * `consumes`: Media type(s) expected from the request body, e.g., `application/json`.
    **Syntax:**

    ```java
    @PostMapping(consumes="application/json")
    public OrderDto create(@RequestBody CreateOrderDto body){
      return new OrderDto(1L, body.sku(), body.qty());
    }
    ```

  * `params`, `headers`: Additional request constraints.
    **Syntax:**

    ```java
    @GetMapping(path="/search", params="q")      // /search?q=TV
    public java.util.List<OrderDto> search(@RequestParam String q){ return java.util.List.of(); }

    @GetMapping(path="/report", headers="X-Client=web")
    public java.util.Map<String,String> reportForWeb(){ return java.util.Map.of("ok","web"); }
    ```

### **Parameter binding**

  * **Path variables:** `@PathVariable("id")` binds `{id}` from the URI.
    **Syntax:**

    ```java
    @GetMapping("/{id}")                         // /api/v1/orders/25
    public OrderDto byId(@PathVariable("id") Long id){ return new OrderDto(id,"SKU",1); }
    ```

  * **Query parameters:** `@RequestParam("q")` binds `?q=...`.
    **Syntax:**

    ```java
    @GetMapping("/filter")                       // /filter?status=NEW&limit=10
    public java.util.List<OrderDto> filter(@RequestParam String status,
                                           @RequestParam(defaultValue="10") int limit){ return java.util.List.of(); }
    ```

  * **Headers:** `@RequestHeader("X-Id")`.
    **Syntax:**

    ```java
    @GetMapping("/trace")
    public String trace(@RequestHeader("X-Id") String traceId){ return traceId; }
    ```

  * **Body:** `@RequestBody` binds and deserializes JSON/XML to a Java type.
    **Syntax:**

    ```java
    @PutMapping(path="/{id}", consumes="application/json")
    public OrderDto replace(@PathVariable Long id, @RequestBody OrderDto body){
      return new OrderDto(id, body.sku(), body.qty());
    }
    ```

### **Return values**

  * POJOs → serialized (e.g., JSON) via converters.
    **Syntax:**

    ```java
    @GetMapping("/sample")
    public OrderDto sample(){ return new OrderDto(7L,"SKU-7",3); }
    ```

  * `ResponseEntity<T>` for explicit control of **status**, **headers**, **body**.
    **Syntax:**

    ```java
    @PostMapping
    public org.springframework.http.ResponseEntity<OrderDto> created(@RequestBody CreateOrderDto in){
      OrderDto saved = new OrderDto(99L, in.sku(), in.qty());
      return org.springframework.http.ResponseEntity
             .created(java.net.URI.create("/api/v1/orders/" + saved.id()))
             .eTag("\"v1\"")
             .body(saved);
    }
    ```

  * `void` or `ResponseEntity<Void>` for `204 No Content` responses.
    **Syntax:**

    ```java
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id){
      return org.springframework.http.ResponseEntity.noContent().build(); // 204
    }
    ```

### **HTTP method semantics in REST**

  * **`@GetMapping`**

    * Read-only retrieval; **safe** and **idempotent**.
      **Syntax:**

      ```java
      @GetMapping
      public java.util.Collection<OrderDto> list(){ return java.util.List.of(); }
      ```

    * No request body; uses query/path parameters; cache-friendly when appropriate.
      **Syntax:**

      ```java
      @GetMapping(path="/{id}", produces="application/json")
      public OrderDto getCached(@PathVariable Long id){ return new OrderDto(id,"SKU",1); }
      ```

  * **`@PostMapping`**

    * Creation or non-idempotent operations on a collection or RPC-like commands.
      **Syntax:**

      ```java
      @PostMapping(consumes="application/json")
      public OrderDto createOnce(@RequestBody CreateOrderDto body){
        return new OrderDto(java.util.concurrent.ThreadLocalRandom.current().nextLong(1000), body.sku(), body.qty());
      }
      ```

    * Typical response for creation: `201 Created` with `Location: /resource/{id}`.
      **Syntax:**

      ```java
      @PostMapping(consumes="application/json")
      public org.springframework.http.ResponseEntity<OrderDto> create201(@RequestBody CreateOrderDto body){
        OrderDto saved = new OrderDto(101L, body.sku(), body.qty());
        return org.springframework.http.ResponseEntity
               .created(java.net.URI.create("/api/v1/orders/" + saved.id()))
               .body(saved);
      }
      ```

  * **`@PutMapping`**

    * **Full replacement** of the resource at the target URI; **idempotent**.
      **Syntax:**

      ```java
      @PutMapping(path="/{id}", consumes="application/json")
      public OrderDto replaceFull(@PathVariable Long id, @RequestBody OrderDto incoming){
        return new OrderDto(id, incoming.sku(), incoming.qty());
      }
      ```

    * Client sends the complete representation to be stored.
      **Syntax:**

      ```java
      // Body must include all fields of the resource representation
      @PutMapping(path="/{id}", consumes="application/json")
      public org.springframework.http.ResponseEntity<Void> store(@PathVariable Long id, @RequestBody OrderDto body){
        // save full body...
        return org.springframework.http.ResponseEntity.noContent().build(); // 204
      }
      ```

  * **`@DeleteMapping`**

    * Remove the resource at the target URI; **idempotent**.
      **Syntax:**

      ```java
      @DeleteMapping("/{id}")
      public org.springframework.http.ResponseEntity<Void> remove(@PathVariable Long id){
        // delete...
        return org.springframework.http.ResponseEntity.noContent().build();
      }
      ```

    * Often returns `204 No Content` when deletion succeeds and no body is needed.
      **Syntax:**

      ```java
      @DeleteMapping("/{id}/hard")
      public org.springframework.http.ResponseEntity<Void> hardDelete(@PathVariable Long id){
        return org.springframework.http.ResponseEntity.noContent().build(); // 204
      }
      ```

* **Content negotiation**

  * Client advertises acceptable formats via `Accept`; controller can set `produces`.
    **Syntax:**

    ```java
    @GetMapping(path="/{id}", produces="application/json")
    public OrderDto jsonOnly(@PathVariable Long id){ return new OrderDto(id,"ONLY-JSON",1); }
    ```

  * For request bodies, client sends `Content-Type`; controller can require `consumes`.
    **Syntax:**

    ```java
    @PostMapping(path="/json", consumes="application/json", produces="application/json")
    public OrderDto jsonInOut(@RequestBody CreateOrderDto body){
      return new OrderDto(555L, body.sku(), body.qty());
    }
    ```

* **Idempotency & safety (behavioral guarantees)**

  * **GET**: safe & idempotent.
    **Syntax:**

    ```java
    @GetMapping("/health")
    public java.util.Map<String,String> health(){ return java.util.Map.of("status","ok"); }
    ```

  * **PUT/DELETE**: idempotent (repeated calls lead to same outcome).
    **Syntax:**

    ```java
    @PutMapping(path="/{id}", consumes="application/json")
    public OrderDto idempotentPut(@PathVariable Long id, @RequestBody OrderDto body){
      return new OrderDto(id, body.sku(), body.qty());
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> idempotentDelete(@PathVariable Long id){
      return org.springframework.http.ResponseEntity.noContent().build();
    }
    ```

  * **POST**: not idempotent (replay may create multiple resources or duplicate effects unless server guards against it).
    **Syntax:**

    ```java
    @PostMapping(consumes="application/json")
    public org.springframework.http.ResponseEntity<OrderDto> nonIdempotentPost(@RequestBody CreateOrderDto body){
      long newId = java.util.concurrent.ThreadLocalRandom.current().nextLong(10_000);
      OrderDto saved = new OrderDto(newId, body.sku(), body.qty());
      return org.springframework.http.ResponseEntity
             .created(java.net.URI.create("/api/v1/orders/" + saved.id()))
             .body(saved);
    }
    ```

* **Status code alignment (typical)**

  * `GET` (found) → `200 OK`
    **Syntax:**

    ```java
    @GetMapping("/{id}/ok")
    public org.springframework.http.ResponseEntity<OrderDto> ok(@PathVariable Long id){
      return org.springframework.http.ResponseEntity.ok(new OrderDto(id,"OK",1));
    }
    ```

  * `POST` (created) → `201 Created` (+ `Location`)
    **Syntax:**

    ```java
    @PostMapping("/created")
    public org.springframework.http.ResponseEntity<OrderDto> createdExample(@RequestBody CreateOrderDto body){
      OrderDto saved = new OrderDto(777L, body.sku(), body.qty());
      return org.springframework.http.ResponseEntity
             .created(java.net.URI.create("/api/v1/orders/" + saved.id()))
             .body(saved);
    }
    ```

  * `PUT` (updated/replaced) → `200 OK` or `204 No Content`
    **Syntax:**

    ```java
    @PutMapping(path="/{id}", consumes="application/json")
    public org.springframework.http.ResponseEntity<OrderDto> updatedOk(@PathVariable Long id, @RequestBody OrderDto body){
      return org.springframework.http.ResponseEntity.ok(new OrderDto(id, body.sku(), body.qty()));
    }
    // or
    @PutMapping(path="/{id}/no-body", consumes="application/json")
    public org.springframework.http.ResponseEntity<Void> updatedNoContent(@PathVariable Long id, @RequestBody OrderDto body){
      return org.springframework.http.ResponseEntity.noContent().build();
    }
    ```

  * `DELETE` (removed) → `204 No Content` (or `200 OK` with body)
    **Syntax:**

    ```java
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> removed204(@PathVariable Long id){
      return org.springframework.http.ResponseEntity.noContent().build();
    }
    // or
    @DeleteMapping("/{id}/with-body")
    public org.springframework.http.ResponseEntity<java.util.Map<String,Object>> removed200(@PathVariable Long id){
      return org.springframework.http.ResponseEntity.ok(java.util.Map.of("removed", id));
    }
    ```
# Request Handling in Spring Boot

## 1) `@RequestParam`

**What it is:** Binds **query string** (and `application/x-www-form-urlencoded` form fields) to method parameters.
**When to use:** Filters, pagination, sorting, search terms, optional flags.

### Syntax patterns

```java
// Basic (required by default)
@GetMapping("/search")
public List<Item> search(@RequestParam String q) { ... }

// Optional with default
@GetMapping("/search")
public List<Item> search(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "10") int size) { ... }

// Explicitly optional (no default)
@GetMapping("/search")
public List<Item> search(@RequestParam(required = false) String q) { ... }

// Multi-valued (?tag=a&tag=b)
@GetMapping("/search")
public List<Item> search(@RequestParam List<String> tag) { ... }

// Capture all query params
@GetMapping("/echo")
public Map<String,String> echo(@RequestParam Map<String,String> params) { ... }

// Type conversion & dates
@GetMapping("/events")
public List<Event> events(
  @RequestParam @org.springframework.format.annotation.DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  LocalDate on) { ... }
```

### Common notes

* Missing required param → **400 Bad Request** (`MissingServletRequestParameterException`).
* Spring converts strings to target types (e.g., `int`, `boolean`, `LocalDate`) or throws **400** on mismatch.
* Prefer `Optional<T>` for optional params when no default makes sense.

### Mini example

```java
@RestController
class SearchController {
  @GetMapping("/search")
  public Map<String, Object> search(
      @RequestParam String q,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(required = false) List<String> tag) {

    return Map.of("q", q, "page", page, "tags", tag);
  }
}
```

**Example request**

```
GET /search?q=laptop&page=2&tag=gaming&tag=lightweight
```

**Expected output**

```json
{"q":"laptop","page":2,"tags":["gaming","lightweight"]}
```

## 2) `@PathVariable`

**What it is:** Binds **URL path segments** (declared in the route template) to method parameters.
**When to use:** Resource identifiers in RESTful routes.

### Syntax patterns

```java
// Basic
@GetMapping("/orders/{orderId}")
public Order getOrder(@PathVariable long orderId) { ... }

// Variable name differs from template placeholder
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable("id") long orderId) { ... }

// Multiple variables and simple constraints
@GetMapping("/orders/{orderId}/items/{itemId}")
public Item getItem(@PathVariable long orderId, @PathVariable int itemId) { ... }

// Regex constraint in template
@GetMapping("/users/{username:[a-zA-Z0-9_]+}")
public User get(@PathVariable String username) { ... }
```

### Common notes

* If the method parameter name matches the `{template}` name, `@PathVariable` value attribute is optional.
* Type conversion works the same way as with `@RequestParam` (mismatch → **400**).
* Avoid “optional” path variables; prefer separate routes if a segment is not always present.

### Mini example

```java
@RestController
class OrderController {
  @GetMapping("/orders/{orderId}/items/{itemId}")
  public Map<String, Object> getItem(
      @PathVariable long orderId,
      @PathVariable int itemId) {
    return Map.of("orderId", orderId, "itemId", itemId);
  }
}
```

**Example request**

```
GET /orders/101/items/3
```

**Expected output**

```json
{"orderId":101,"itemId":3}
```

## 3) `@RequestBody`

**What it is:** Deserializes the **HTTP request body** (e.g., JSON) into a Java object using `HttpMessageConverters` (Jackson by default).
**When to use:** Create/update operations and any structured payloads.

### Syntax patterns

```java
// Basic JSON body to DTO
@PostMapping(value = "/users", consumes = "application/json")
public UserResponse create(@Valid @RequestBody CreateUserRequest body) { ... }

// Raw body if you need to parse manually
@PostMapping("/ingest")
public String ingest(@RequestBody String rawJson) { ... }

// Collections / arrays
@PostMapping("/bulk/users")
public List<UserResponse> bulk(@RequestBody List<CreateUserRequest> users) { ... }

// Partial updates
@PatchMapping(value = "/users/{id}", consumes = "application/json")
public UserResponse patch(@PathVariable long id, @RequestBody Map<String,Object> patch) { ... }
```

**DTO example**

```java
public record CreateUserRequest(
  @jakarta.validation.constraints.NotBlank String email,
  @jakarta.validation.constraints.Size(min = 8) String password,
  String fullName
) {}
```

### Common notes

* Malformed JSON or wrong types → **400 Bad Request** (`HttpMessageNotReadableException`).
* Validation failures with `@Valid` → **400** (`MethodArgumentNotValidException`); handle nicely with `@ControllerAdvice`.
* Set `consumes`/`produces` (optional but explicit) for content negotiation.
* Prefer **DTOs** over entities for request bodies (security & evolution).

### Mini example

```java
@RestController
class UserController {
  @PostMapping(value = "/users", consumes = "application/json", produces = "application/json")
  public Map<String, Object> create(@Valid @RequestBody CreateUserRequest body) {
    return Map.of("id", 501, "email", body.email(), "fullName", body.fullName());
  }
}
```

**Example request**

```http
POST /users
Content-Type: application/json

{ "email": "a@b.com", "password": "secretpass", "fullName": "Alex" }
```

**Expected output**

```json
{"id":501,"email":"a@b.com","fullName":"Alex"}
```

## Combining all three

```java
@RestController
@RequestMapping("/stores")
class StoreOrderController {

  @PostMapping(value = "/{storeId}/orders", consumes = "application/json")
  public Map<String,Object> placeOrder(
      @PathVariable long storeId,                      // from URL
      @RequestParam(defaultValue = "INR") String currency, // from query
      @Valid @RequestBody OrderRequest body) {         // from JSON body

    return Map.of(
      "storeId", storeId,
      "currency", currency,
      "items", body.items(),
      "total", 1234.50
    );
  }
}

record OrderRequest(List<String> items) {}
```

**Example request**

```json
POST /stores/9/orders?currency=USD
Content-Type: application/json

{ "items": ["pen","notebook"] }
```

**Expected output**

```json
{"storeId":9,"currency":"USD","items":["pen","notebook"],"total":1234.5}
```


#  Response Handling 

When a controller method finishes, Spring creates an **HTTP response**.
That response has three parts:

* **Status code** — a number like `200 OK` (success), `201 Created`, `404 Not Found`.
* **Headers** — small labels like `Content-Type: application/json` (what format the body is in) or `Location: /api/users/10` (where a newly created resource lives).
* **Body** — the actual data (text, JSON, XML, or nothing).

If you return a simple value (like `String`) or a Java object (a **DTO**), Spring picks sensible defaults:

* Status becomes **200 OK**.
* The body is your return value.
* If you returned an object, Spring uses **Jackson** to turn it into **JSON** automatically.

### Simple example: return text

```java
@GetMapping("/hi")
public String sayHi() {
    return "Hello from Spring"; // Spring writes this as the HTTP body; status=200
}
```

**Expected output:**

```
Status: 200 OK
Headers: Content-Type: text/plain;charset=UTF-8
Body:    Hello from Spring
```


##  `ResponseEntity` 

Sometimes you don’t want the defaults. You might need:

* a different **status** (e.g., `201 Created`, `404 Not Found`, `204 No Content`);
* some **custom headers**;
* to return **no body** at all.

`ResponseEntity<T>` is a small wrapper that lets you set **status + headers + body** yourself.

### Example: create → 201 Created + Location header

```java
@PostMapping("/users")
public ResponseEntity<UserDto> create(@RequestBody UserDto incoming) {
    // pretend we saved it and new id=10
    UserDto saved = new UserDto(10L, incoming.name());

    // tell the client where the new resource is
    URI location = URI.create("/api/users/10");

    // 201 status + Location header + body with the saved user
    return ResponseEntity.created(location).body(saved);
}
```

**Expected output:**

```
Status: 201 Created
Headers: Location: /api/users/10
Body:    {"id":10,"name":"..."}
```

### Example: not found → 404 with empty body

```java
@GetMapping("/users/{id}")
public ResponseEntity<UserDto> find(@PathVariable Long id) {
    // pretend it's missing
    return ResponseEntity.notFound().build(); // status=404, no body
}
```

**Expected output:**

```
Status: 404 Not Found
Body:    (empty)
```

### Example: delete success → 204 No Content

```java
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    // pretend deletion worked
    return ResponseEntity.noContent().build(); // status=204, no body
}
```

**Expected output:**

```
Status: 204 No Content
Body:    (empty)
```

## Returning JSON and XML — how Spring decides

* The client tells the server what format it prefers using the **`Accept`** header, for example:

  * `Accept: application/json`
  * `Accept: application/xml`
* Spring looks at the available “**message converters**”:

  * JSON support is included out-of-the-box (via Jackson).
  * XML support is **added** when you include an extra dependency.
* If the requested format is available, Spring sets the **`Content-Type`** header and converts your object to that format.
* You can also **force** a format on a specific method by using `produces = ...`.

**Add this once to enable XML as well as JSON (Maven):**

```xml
<dependency>
  <groupId>com.fasterxml.jackson.dataformat</groupId>
  <artifactId>jackson-dataformat-xml</artifactId>
</dependency>
```

*(What this does: it adds an XML message converter so Spring can serialize your DTOs to XML in addition to JSON.)*

### One method, two formats (client chooses)

```java
public record UserDto(Long id, String name) {}

@GetMapping("/format/user")
public UserDto show() {
    return new UserDto(2L, "Ravi"); // same Java object for both JSON and XML
}
```

**Expected output when the client asks for JSON:**

```
Request header: Accept: application/json
Status: 200 OK
Headers: Content-Type: application/json
Body:    {"id":2,"name":"Ravi"}
```

**Expected output when the client asks for XML (after adding the XML dependency):**

```
Request header: Accept: application/xml
Status: 200 OK
Headers: Content-Type: application/xml
Body:    <UserDto><id>2</id><name>Ravi</name></UserDto>
```

### Forcing a specific format from the server side

```java
// Always JSON (even if client asks for XML)
@GetMapping(value="/format/user-json", produces="application/json")
public UserDto jsonOnly() { return new UserDto(3L, "Meera"); }

// Always XML (works only if XML dependency is present)
@GetMapping(value="/format/user-xml", produces="application/xml")
public UserDto xmlOnly() { return new UserDto(4L, "Meera"); }
```

**Expected output (JSON-only endpoint):**

```
Status: 200 OK
Headers: Content-Type: application/json
Body:    {"id":3,"name":"Meera"}
```

**Expected output (XML-only endpoint):**
```
Status: 200 OK
Headers: Content-Type: application/xml
Body:    <UserDto><id>4</id><name>Meera</name></UserDto>
```

## Exception Handling → `@ExceptionHandler` → `@ControllerAdvice`


## Exception Handling (what & how)

When something goes wrong in your code (for example, a user ID doesn’t exist), Java throws an **exception**. In a web API, we don’t want raw exceptions to leak to the client. We want to **turn them into proper HTTP responses**: right status code (404, 400, 500…), a small, safe message, and optionally a JSON body.
Think of the flow like this:

1. A request hits a controller method.
2. The method detects a problem and **throws** an exception.
3. Spring looks for a matching **exception handler**.
4. The handler **builds the HTTP response** (status + body) and sends it back.

## `@ExceptionHandler` (handle inside one controller)

Use this when only **this** controller needs a custom rule. The handler method sits in the same class; it catches a specific exception type and returns a response.

> File: `src/main/java/com/tinitiate/controllers_routing/UserController.java`

```java
package com.tinitiate.controllers_routing;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// FLOW: A request comes in -> get() runs -> it throws ResourceNotFoundException
//       Spring sees the @ExceptionHandler below -> builds a 404 JSON response.
@RestController
@RequestMapping("/api/users")
public class UserController {

  public record UserDto(Long id, String name) {}

  @GetMapping("/{id}")
  public UserDto get(@PathVariable Long id) {
    // 1) Controller receives request for a user
    // 2) We check DB (pretend) and find nothing
    // 3) Throw a domain exception to indicate "not found"
    throw new ResourceNotFoundException("user " + id + " not found");
  }

  // 4) This method catches ResourceNotFoundException for THIS controller only
  //    and converts it to an HTTP response with status 404 and a tiny JSON body.
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity
        .status(404)
        .body(java.util.Map.of("message", ex.getMessage()));
  }
}

// Simple custom exception used to signal "missing data" in our domain.
// (No public modifier so it can live in the same file for this example.)
class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String msg) { super(msg); }
}
```

### Expected output

```
GET /api/users/99
Status: 404 Not Found
Body:   {"message":"user 99 not found"}
```

## `@RestControllerAdvice` (global for all controllers)

**Explanation:** Use this when you want **one place** to handle exceptions for the entire app (or a group of controllers). Put your `@ExceptionHandler` methods here; Spring will apply them everywhere.

> File: `src/main/java/com/tinitiate/common/GlobalErrorAdvice.java`

```java
package com.tinitiate.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// FLOW: Any controller throws an exception ->
//       Spring consults this advice class ->
//       Matching method builds the HTTP response.
@RestControllerAdvice // global for REST controllers
public class GlobalErrorAdvice {

  // Handles "not found" from anywhere in the app (if you throw ResourceNotFoundException)
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<?> notFound(ResourceNotFoundException ex) {
    // 1) We got the domain exception
    // 2) We choose status 404
    // 3) We return a small, safe JSON message
    return ResponseEntity
        .status(404)
        .body(java.util.Map.of("message", ex.getMessage()));
  }

  // Fallback: if nothing else matches, return a generic 500
  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> fallback(Exception ex) {
    // Tip: log ex on the server with a trace ID (not shown here)
    return ResponseEntity
        .status(500)
        .body(java.util.Map.of("message", "internal error"));
  }
}
```
### Expected output
```json
Any controller throws ResourceNotFoundException
→ Status: 404 Not Found
→ Body:   {"message":"..."}
```
# Data Validation → `@Valid` → Custom Validators

## Data Validation

Attach simple rules to request fields (like “name not blank”, “age ≥ 18”). Spring checks them **before** your method runs; if any rule fails, it returns **400 Bad Request** automatically.

**Tiny example**

```java
// DTO
import jakarta.validation.constraints.*;

class UserReq {
  @NotBlank String name;   // must not be empty
  @Min(18)    int age;     // must be 18 or more
}

// Controller
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
class UserController {
  @PostMapping("/users")
  String create(@Valid @RequestBody UserReq req) {  // triggers validation
    return "ok";
  }
}
```

**What happens**

* Valid body → `200 OK` with `"ok"`.
* Invalid (e.g., `{"name":"","age":15}`) → `400 Bad Request` with error messages.



## `@Valid` Annotation

Put `@Valid` on:

* the `@RequestBody` object (to validate its fields),
* any **nested** object to validate inside it too.

**Tiny example (nested)**

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

class Address { @NotBlank String city; }

class OrderReq {
  @Valid Address shipTo;   // validate nested object too
}

@RestController
class OrderController {
  @PostMapping("/orders")
  String create(@Valid @RequestBody OrderReq req) { return "ok"; }
}
```

**What happens**

* Missing/blank `city` → `400 Bad Request`.


## Custom Validators

When built-in rules aren’t enough, make your own annotation + validator class.

**Tiny example: `@Adult` (age ≥ 18)**

```java
// 1) Annotation
import jakarta.validation.*;
import java.lang.annotation.*;
@Documented
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AdultValidator.class)
public @interface Adult {
  String message() default "must be at least 18";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}
```

```java
// 2) Validator
import jakarta.validation.*;
public class AdultValidator implements ConstraintValidator<Adult, Integer> {
  public boolean isValid(Integer v, ConstraintValidatorContext c) {
    return v == null || v >= 18; // let @NotNull handle null if needed
  }
}
```

```java
// 3) Use it
class RegisterReq { @Adult Integer age; }

@RestController
class RegisterController {
  @PostMapping("/register")
  String register(@Valid @RequestBody RegisterReq req) { return "ok"; }
}
```

**What happens**

* `{"age":19}` → `200 OK`.
* `{"age":16}` → `400 Bad Request` with `"must be at least 18"`.

# Data Validation → `@Valid` → Custom Validators
## What is validation?

**Idea:** Check incoming request data against simple rules **before** your controller runs.
Examples of rules: “name can’t be empty”, “age ≥ 18”, “email must be valid”.
In Spring Boot, you put annotations on fields (e.g., `@NotBlank`, `@Min`, `@Email`) and add `@Valid` on the request object. If any rule fails, Spring automatically returns **400 Bad Request**.

> Make sure you have `spring-boot-starter-validation` in your project (Spring Boot 3+ uses `jakarta.validation.*`).

**Tiny example**

```java
// DTO with rules
import jakarta.validation.constraints.*;

class UserReq {
  @NotBlank String name;   // not empty
  @Min(18)    int age;     // at least 18
}

// Controller: @Valid triggers checks before code runs
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
class UserController {
  @PostMapping
  String create(@Valid @RequestBody UserReq req) { return "ok"; }
}
```

### Expected output

```
POST /api/users   Body: {"name":"Asha","age":22}
→ 200 OK
→ "ok"
```

```
POST /api/users   Body: {"name":"","age":15}
→ 400 Bad Request
→ Body shows errors for name and age
```



## `@Valid` Annotation (where and why)

**What it does:** Tells Spring to **run validation** on that object/parameter.
**Where to use:**

* On `@RequestBody` objects (most common).
* On **nested objects** inside your request (so their fields are validated too).
* On method parameters (with `@Validated` on the class).

**Tiny nested example**

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

class Address { @NotBlank String city; }

class OrderReq { @Valid Address shipTo; } // also validates city

@RestController
@RequestMapping("/api/orders")
class OrderController {
  @PostMapping
  String create(@Valid @RequestBody OrderReq req) { return "ok"; }
}
```

### Expected output

```
POST /api/orders   Body: {"shipTo":{"city":"Warangal"}}
→ 200 OK
→ "ok"
```

```
POST /api/orders   Body: {"shipTo":{"city":""}}
→ 400 Bad Request
→ Body shows "city must not be blank"
```

## Custom Validators (your own rule)

**When needed:** Built-in annotations aren’t enough (e.g., “age must be ≥ 18” as a named rule `@Adult`).
**How:** Create a small **annotation** + **validator** class, then use it on a field.

**Tiny example: `@Adult`**

```java
// 1) Annotation
import jakarta.validation.*;
import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AdultValidator.class)
public @interface Adult {
  String message() default "must be at least 18";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}
```

```java
// 2) Validator logic
import jakarta.validation.*;

public class AdultValidator implements ConstraintValidator<Adult, Integer> {
  public boolean isValid(Integer v, ConstraintValidatorContext c) {
    return v == null || v >= 18; // use @NotNull separately if you require non-null
  }
}
```

```java
// 3) Use it
class RegisterReq { @Adult Integer age; }

@RestController
@RequestMapping("/api/register")
class RegisterController {
  @PostMapping
  String register(@Valid @RequestBody RegisterReq req) { return "ok"; }
}
```

### Expected output

```
POST /api/register   Body: {"age":19}
→ 200 OK
→ "ok"
```

```
POST /api/register   Body: {"age":16}
→ 400 Bad Request
→ Body shows "must be at least 18"
```

# Pagination & Sorting

**Explanation:**
Imagine you have thousands of rows. Instead of sending everything, you send one **page** at a time. The client tells which page and how many items using `?page` (starts at 0) and `?size`. For **ordering**, the client adds `?sort=field,dir` (like `sort=price,desc`). Spring Data reads these query params into a `Pageable` object and returns a `Page<T>` that includes the items plus metadata (total elements, total pages, etc.).

**Small syntax (with comments):**

```java
// Entity (tiny shape so code compiles)
import jakarta.persistence.*;

@Entity
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
  String name;
  double price;
}
```

```java
// Repository: paging + sorting comes from JpaRepository
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.*;

public interface ProductRepository extends JpaRepository<Product, Long> {
  // filter + paging + sorting together
  Page<Product> findByNameContainingIgnoreCase(String q, Pageable pageable);
}
```

```java
// Controller: Spring builds Pageable from ?page, ?size, ?sort
// Example: GET /api/products?page=0&size=5&sort=price,desc
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/products")
public class ProductController {
  private final ProductRepository repo;
  public ProductController(ProductRepository repo){ this.repo = repo; }

  @GetMapping
  public ResponseEntity<Page<Product>> list(Pageable pageable) {
    // pageable carries page/size/sort from URL; repo returns Page<Product>
    return ResponseEntity.ok(repo.findAll(pageable));
  }

  // Example: GET /api/products/search?q=lap&page=0&size=2&sort=name,asc
  @GetMapping("/search")
  public ResponseEntity<Page<Product>> search(@RequestParam String q, Pageable pageable){
    // returns a page of matches, ordered as requested
    return ResponseEntity.ok(repo.findByNameContainingIgnoreCase(q, pageable));
  }
}
```

### Expected output

```
GET /api/products?page=0&size=2&sort=price,desc
→ 200 OK
→ Page JSON with: content (2 items), number=0, size=2, totalElements, totalPages
```

```
GET /api/products/search?q=lap&page=1&size=2&sort=name,asc
→ 200 OK
→ Page JSON: second page of matches, 2 per page, sorted by name ascending
```

**Optional: sorting-only (no pagination)**

```java
// Example: GET /api/products/sorted-only?sort=name,asc&sort=price,desc
import org.springframework.data.domain.Sort;

@GetMapping("/sorted-only")
public ResponseEntity<?> listSorted(Sort sort) {
  // returns full list ordered as requested (no pages)
  return ResponseEntity.ok(repo.findAll(sort));
}
```
# File Upload & Download APIs

## Explanation

Upload means the client sends a file as `multipart/form-data`; Spring reads it as a `MultipartFile` and you save it (e.g., to a local folder).
Download means you read the file from storage and return it as a `Resource` with proper headers so the browser saves it.
Typical URLs:

* `POST /api/files/upload` with a form field `file`
* `GET  /api/files/{filename}` to download it

## Syntax

```java
// File: src/main/java/com/tinitiate/files/FileController.java
package com.tinitiate.files;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class FileController {

  private final Path storage = Paths.get("uploads");

  public FileController() throws Exception {
    Files.createDirectories(storage); // ensure folder exists
  }

  @PostMapping("/upload")
  public ResponseEntity<Map<String,Object>> upload(@RequestParam("file") MultipartFile file) throws Exception {
    String filename = Path.of(file.getOriginalFilename()).getFileName().toString(); // simple sanitize
    Path target = storage.resolve(filename).normalize();
    if (!target.startsWith(storage)) throw new RuntimeException("invalid path");
    Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
    return ResponseEntity.ok(Map.of(
        "fileName", filename,
        "size", file.getSize()
    ));
  }

  @GetMapping("/{filename}")
  public ResponseEntity<Resource> download(@PathVariable String filename) throws Exception {
    Path target = storage.resolve(filename).normalize();
    if (!target.startsWith(storage) || !Files.exists(target)) {
      return ResponseEntity.notFound().build();
    }
    Resource resource = toResource(target);
    String contentType = Files.probeContentType(target);
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
        .body(resource);
  }

  private Resource toResource(Path path) throws MalformedURLException {
    return new UrlResource(path.toUri());
  }
}
```

### Expected output

```
POST /api/files/upload   (multipart form: file=@/path/to/pic.jpg)
→ 200 OK
→ {"fileName":"pic.jpg","size":123456}
```

```
GET /api/files/pic.jpg
→ 200 OK
→ Headers: Content-Disposition: attachment; filename="pic.jpg"
→ Body: file bytes (browser prompts download)
```



##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|