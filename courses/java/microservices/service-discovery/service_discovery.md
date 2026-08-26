# **What is Service Discovery?**

In a microservices architecture, services run on multiple servers or containers, and their locations (IP addresses, ports) keep changing due to scaling, restarts, or failures.
Because of this, a service cannot reliably “know” where another service is running.

**Service Discovery** is the system that helps microservices *find each other* automatically.

Instead of hardcoding IP addresses, services register themselves with a **Service Registry**, and other services look up this registry to discover where to send requests.

### Why service discovery is needed:

* Microservices move, scale, and restart frequently
* IPs and ports change dynamically
* Manual configuration is impossible in large systems
* Helps achieve reliable inter-service communication

A **Service Registry** (Eureka, Consul, Kubernetes DNS) acts like a phonebook containing:

* Service name
* Service address
* Health status

When one service wants to call another, it uses the registry to find the current location.

# **Client-Side Discovery vs Server-Side Discovery**

Service discovery can be implemented in two main ways: **client-side** and **server-side**.
The difference is **who decides** which service instance to call.


## 1. **Client-Side Discovery**

In client-side discovery, the **client itself** is responsible for:

1. Querying the Service Registry
2. Getting the list of available service instances
3. Choosing (load-balancing) which instance to call

This means the client contains the logic for discovery and load balancing.

### Flow:

```
Client → Service Registry → Choose instance → Call service
```

### Example:

* Netflix Eureka + Ribbon
* Spring Cloud Netflix stack

### Characteristics:

* Client performs load balancing
* Faster because no extra hop
* Each client must implement the discovery logic

## 2. **Server-Side Discovery**

In server-side discovery, the **client does not choose** the instance.
Instead, it sends a request to a **load balancer** or **gateway**, and the gateway handles:

1. Discovering the service instances
2. Choosing which instance to call
3. Forwarding the request

### Flow:

```
Client → Load Balancer / API Gateway → Service Registry → Service instance
```

### Example:

* Kubernetes Service + kube-proxy
* AWS Elastic Load Balancer (ELB)
* NGINX or API Gateway

### Characteristics:

* Client stays simple
* Load balancer handles all discovery logic
* More centralized control

---
# **Netflix Eureka**

Netflix Eureka is a **Service Discovery** tool used in microservices to help services find each other automatically.
It acts as a **Service Registry**, where each microservice registers itself and queries others.

Eureka is part of the **Spring Cloud Netflix** stack and is commonly used with Spring Boot applications.

Eureka has two parts:

* **Eureka Server** → The registry (like a phonebook)
* **Eureka Client** → Microservices that register themselves and discover others

---

## **Registering Services**

In a microservices environment, services don’t have fixed locations.
When a service starts, it **registers itself** with the Eureka Server.
This registration contains:

* Service name
* IP address and port
* Health status

Once registered, other services can find it by using the service name.

If a service goes down, Eureka removes it from the registry—ensuring only healthy instances are used.

### Simple registration example (concept):

```java
@SpringBootApplication
@EnableEurekaClient
public class OrderServiceApplication { }
```

This tells the service to register with Eureka automatically.

## **Eureka Server Setup**

A Eureka Server acts as the **central registry** where all services register.

### Basic setup involves:

1. Creating a Spring Boot application
2. Adding Eureka Server dependencies
3. Enabling Eureka Server with the annotation

   ```java
   @EnableEurekaServer
   ```
4. Configuring application properties to run as a registry

### Concept:

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication { }
```

Once running, the Eureka dashboard is available in the browser and shows all registered services.

## **Eureka Client**

A Eureka Client is any microservice that:

* Registers itself with the Eureka Server
* Discovers other services through Eureka

With Eureka Client:

* You do **not** hardcode service URLs
* You call services using the **service name**, not IP
* Client-side load balancing becomes easy

### Calling another service via Eureka:

```java
@RestController
public class OrderController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/order")
    public String placeOrder() {
        return restTemplate.getForObject("http://PRODUCT-SERVICE/products", String.class);
    }
}
```

Here, `PRODUCT-SERVICE` is the **service name** found in the Eureka registry.

This allows microservices to find each other dynamically, even if IPs change.

---
# **Consul**

Consul is a **service discovery and configuration** tool developed by HashiCorp.
Like Eureka, it helps microservices **find each other**, but it also provides additional features like:

* Service registry
* Health checks
* Key-value configuration store
* Multi-datacenter support

Consul works through an **agent** running on each machine or container.
Services register themselves with the local agent, and the agent shares this info with the Consul server cluster.

---

# **Service Registration**

Service registration is the process where a service tells Consul:

* Its service name
* IP address
* Port
* Tags (optional)
* Health check details

In Consul, services can register:

1. **Via configuration file** (JSON)
2. **Via Consul API**
3. **Automatically through service mesh tools**

### Example of a registration file (`order-service.json`)

```json
{
  "service": {
    "name": "order-service",
    "port": 8080,
    "tags": ["orders"],
    "address": "127.0.0.1"
  }
}
```

When the service starts, Consul adds it to the registry.
Other services can then discover it using its name (`order-service`), not an IP.

Registration allows dynamic discovery even when services restart, scale, or move.

---

# **Health Checks**

Health checks ensure that **only healthy services** stay in the registry.
If a service stops responding, Consul automatically removes it so other services do not call a broken instance.

Consul supports multiple types of health checks:

### 1. **HTTP Health Check**

Consul hits a specific URL (like `/actuator/health`) to check if the service is alive.

Example:

```json
{
  "check": {
    "http": "http://localhost:8080/health",
    "interval": "10s"
  }
}
```

### 2. **TCP Health Check**

Checks whether a port is open.

### 3. **Command Health Check**

Runs a shell command and checks the output.

### 4. **Docker / Container Health Checks**

Works with container orchestrators.

---

### Why health checks matter:

* Prevent calling unhealthy instances
* Improve reliability
* Auto-remove or auto-recover failed services
* Makes load balancing more accurate

Consul continuously checks services in the background, ensuring the system remains stable even as services go up and down.

##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|