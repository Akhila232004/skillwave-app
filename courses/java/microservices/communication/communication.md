# **Synchronous Communication**

Synchronous communication is when one service sends a request to another service **and waits for the response** before continuing.
The caller is blocked until the other service finishes processing.
This creates a direct, immediate interaction — similar to making a phone call where both sides must be available.

Use synchronous communication when:

* The result is needed immediately
* The workflow cannot continue without the response
* The operation is short-lived (fetching details, checking availability, etc.)

## **REST APIs**

REST is the most common way to implement synchronous communication.
It uses standard HTTP and exchanges data usually in JSON format.

A simple REST call looks like:

### **Controller syntax example (Spring Boot)**

```java
@GetMapping("/products/{id}")
public Product getProduct(@PathVariable int id) {
    return productService.getProduct(id);
}
```

### **Calling another service using RestTemplate**

```java
RestTemplate rest = new RestTemplate();
Product p = rest.getForObject("http://inventory-service/products/5", Product.class);
```

REST is easy to understand, human-friendly, and widely used in both web and backend systems.

## **gRPC Basics**

gRPC is a high-performance communication framework used for synchronous (and streaming) interactions.
It uses **HTTP/2** and **Protocol Buffers**, which makes it faster and more efficient than REST.

With gRPC, you define the service and messages in a `.proto` file.

### **gRPC .proto syntax**

```proto
syntax = "proto3";

service ProductService {
  rpc GetProduct(ProductRequest) returns (ProductResponse);
}

message ProductRequest {
  int32 id = 1;
}

message ProductResponse {
  string name = 1;
  double price = 2;
}
```

From this file, gRPC generates client and server code automatically.

gRPC is ideal for internal service-to-service calls where performance matters.

# **Asynchronous Communication**

Asynchronous communication allows services to **send messages without waiting for an immediate response**.
The sender and receiver do **not** need to be online or available at the same time.
This makes the system more flexible, fault-tolerant, and scalable.

Instead of calling another service directly, a message is placed in a **message broker**, and another service processes it later.

Use asynchronous communication when:

* The result is not needed immediately
* Tasks are long-running (email sending, report generation, notifications)
* You want loose coupling between services
* System must handle high traffic without blocking

# **Message Brokers (Kafka, RabbitMQ, ActiveMQ)**

A message broker is a system that **stores and delivers messages** between microservices.
It acts as a middle layer that ensures messages are delivered reliably.

Common brokers:

## **Kafka**

Kafka is built for **high-throughput, real-time streaming**.
It handles millions of messages per second and is ideal for event pipelines.

Conceptual syntax (producer):
```java
kafkaTemplate.send("order-topic", orderEvent);
```

Kafka is used when you need:

* Event streaming
* High volume messaging
* Log aggregation
* Real-time analytics

## **RabbitMQ**

RabbitMQ focuses on **message queues**, routing patterns, and reliability.
It is great for background jobs, task distribution, and workflows.

Conceptual syntax (producer):

```java
rabbitTemplate.convertAndSend("orderQueue", orderMessage);
```

RabbitMQ is used when:

* You need guaranteed delivery
* You want queue-based work processing
* You need different routing strategies (topics, fanout, direct)

## **ActiveMQ**

ActiveMQ is a traditional, enterprise-grade message broker.
It supports JMS (Java Message Service) and is common in older Java enterprise systems.

Conceptual syntax (JMS):

```java
jmsTemplate.convertAndSend("order-queue", orderMsg);
```

Used when:

* Existing systems depend on JMS
* You need durable, transactional messaging

# **Event-driven Architecture**

Event-driven architecture means that services **react to events** rather than calling each other directly.

An *event* represents something that happened in the system, such as:

* OrderPlaced
* PaymentCompleted
* InventoryUpdated

Workflow:

1. A service **publishes an event** to a broker (e.g., Kafka).
2. Other services **subscribe** and react to the event.
3. No direct service-to-service calls.

Example flow:

* Order Service publishes:
  *“OrderPlaced event”*
* Payment Service listens and processes payment
* Inventory Service listens and updates stock
* Notification Service listens and sends email

Benefits:

* Services are loosely coupled
* System becomes more scalable
* Failures in one service do not break the whole flow
* Supports high-performance and distributed systems

Event-driven architecture is used in modern systems like e-commerce, banking, IoT, and streaming platforms.

Here is a **clean and simple “VS table only”** version:



# **Request/Response vs Event-Driven**

| Feature / Aspect      | Request/Response                        | Event-Driven                                    |
| --------------------- | --------------------------------------- | ----------------------------------------------- |
| Communication Type    | Synchronous                             | Asynchronous                                    |
| Does the caller wait? | Yes                                     | No                                              |
| Dependency            | Caller depends on callee’s availability | Caller and callee are independent               |
| Speed Impact          | Slower if the other service is busy     | Fast for caller; background processing          |
| Coupling              | More tightly coupled                    | Loosely coupled                                 |
| Reliability           | Failure in callee affects caller        | System can continue even if one service is down |
| Workflow Style        | Direct interaction                      | Publish → Subscribe                             |
| Ideal For             | Real-time results                       | Background tasks, workflows                     |
| Common Technologies   | REST, gRPC                              | Kafka, RabbitMQ, ActiveMQ                       |
| Example Scenario      | Check product stock now                 | Send confirmation email later                   |

# **When to Choose REST vs Messaging**

Choosing between REST and Messaging depends on whether the service needs an immediate response and how tightly the services should interact.

**REST** is used when the caller needs a **direct, instant answer**, such as fetching data or validating input. It works synchronously, meaning the caller waits until the other service finishes its work.
It's simple, easy to debug, and ideal when the response is required right away.

**Messaging** is used when the caller **does not need an immediate reply**. Instead of waiting, the service sends a message and continues. Other services process the message in the background.
Messaging is better for high-volume, asynchronous tasks like sending emails, updating logs, or processing long-running workflows.

This choice affects speed, scalability, reliability, and how services depend on each other.

# **REST vs Messaging — When to Choose What**

| Situation / Need                            | Choose **REST (Synchronous)**                  | Choose **Messaging (Asynchronous)**                    |
| ------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| Does the caller need an immediate response? | Yes                                            | No                                                     |
| Operation type                              | Real-time request (fetch, calculate, validate) | Background processing or workflows                     |
| Dependency between services                 | Caller depends on callee                       | Loose, event-driven interactions                       |
| Traffic Pattern                             | Low to moderate traffic                        | High-volume events or spikes                           |
| Failure Handling                            | Caller fails if callee is down                 | System continues; retries possible                     |
| Data exchange                               | Simple request–response data                   | Events, streams, multi-step processes                  |
| Performance Requirement                     | Human-friendly, readable, flexible             | High throughput, low latency                           |
| Monitoring & Debugging                      | Easier                                         | More complex (trace events)                            |
| Common Use Cases                            | Login, get product details, verify payment     | Email sending, notifications, analytics, stock updates |
| Technologies                                | REST, HTTP, gRPC                               | Kafka, RabbitMQ, ActiveMQ                              |

# **Handling Communication Failures**

In microservices, communication happens over a network, which means failures are unavoidable.
A service you depend on may be **slow, overloaded, temporarily down, or unreachable**.
Proper failure-handling ensures your system stays stable even when one service is not responding.

Communication failures can occur due to:

* Network timeouts
* Service crashes
* Slow responses
* Message loss (in async systems)
* High traffic spikes

To build a reliable system, microservices must be designed to **detect**, **handle**, and **recover from** these failures gracefully.

## **Common Techniques to Handle Communication Failures**

### **1. Timeouts**

Never wait forever.
Set a maximum time to wait for a response.
If the response takes too long, the request is stopped.

Example (concept):

```java
restTemplate.setReadTimeout(2000);
```
### **2. Retries**

If a request fails due to a temporary issue, try again after a short interval.
Important: retries must be limited to avoid overwhelming the system.

### **3. Circuit Breaker**

A circuit breaker stops requests from going to a failing service.
When a service repeatedly fails:

* The breaker “opens”
* Calls fail immediately instead of waiting
* It “closes” again when the service recovers

Tools: Resilience4j, Hystrix


### **4. Fallback Responses**

Provide an alternative response when the real service is unavailable.

Example:
If the Recommendation Service is down, return a default list instead of failing the entire request.

### **5. Bulkheads**

Separate resources (threads, connections) so one failing service doesn't break others.
Similar to bulkheads in a ship preventing flooding.

### **6. Message Queues (for Async Communication)**

For asynchronous systems, message brokers (Kafka/RabbitMQ) buffer messages even if the consumer is down.
This prevents message loss and allows retries later.

### **7. Idempotency**

Ensure repeated requests produce the same result.
This prevents multiple charges, multiple bookings, etc. when retries happen.

### **8. Monitoring & Alerts**

Use logs, tracing, and dashboards (Grafana, Prometheus, Zipkin) to quickly detect failures and bottlenecks.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|