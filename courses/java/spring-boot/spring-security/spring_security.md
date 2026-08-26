# Introduction to Security in Spring Boot

Spring Boot uses **Spring Security** to protect your application. It sits in front of your controllers as a **filter chain** that inspects every request, decides **who** the user is (authentication), and whether they’re **allowed** to do what they’re asking (authorization).

### What happens by default

* Adding Spring Security secures **all endpoints** unless you open them.
* Requests must be authenticated; otherwise Spring returns **401 Unauthorized**.
* Errors are standardized (e.g., 401/403) and no sensitive details are leaked.

### Where security “lives” in the request flow

1. **HTTP request → Security filter chain** (a series of filters).
2. Filters try to extract credentials (headers, form login, tokens, etc.).
3. If credentials are valid, an **Authentication** object is created and stored in the **SecurityContext**.
4. Authorization rules check roles/authorities before your controller runs.
5. Controller executes only if checks pass; otherwise 401/403 is returned.

### Core building blocks you’ll hear about

* **SecurityFilterChain**: the ordered filters that guard requests.
* **AuthenticationManager**: verifies credentials and builds the user’s identity.
* **UserDetailsService**: loads user data (from memory, DB, etc.).
* **PasswordEncoder**: hashes/validates passwords (e.g., BCrypt).
* **Authorities/Roles**: labels that drive access decisions (e.g., `ROLE_ADMIN`).
* **SecurityContext**: holds the authenticated user for the current request/thread.

### Typical authentication styles

* **Stateful (session)**: username/password login; server keeps a session.
* **Stateless (token/JWT)**: client sends a token each request; server does not keep session.
* **External providers (OAuth2/OIDC)**: Google/GitHub/Facebook sign-in flows.

### Authorization options

* **URL-level rules**: protect paths like `/admin/**`.
* **Method-level rules**: annotations such as `@PreAuthorize("hasRole('ADMIN')")` on services/controllers.

### Web/API concerns

* **CSRF**: protection for browser-based POST/PUT/DELETE; often disabled for pure stateless APIs.
* **CORS**: controls which front-ends are allowed to call your API from the browser.

### What you gain

* A consistent, extensible security layer that is testable, configurable, and battle-tested.
* Clear separation: your business code stays clean while security is handled before it.

# Authentication vs Authorization

**Authentication**

* Answers “who are you?”.
* Proves identity using credentials: username/password, OTP, API key, bearer token/JWT, OAuth2 login, client certificate.
* In Spring Security: a security filter reads the credential → verifies it → if valid, creates an **Authentication** object and stores it in the **SecurityContext**.
* If missing/invalid, the server responds **401 Unauthorized** (client must authenticate).

**Authorization**

* Answers “are you allowed to do this?”.
* Checks the authenticated user’s **roles/authorities/scopes** against access rules on URLs or methods.
* In Spring Security: rules like “/admin requires ROLE_ADMIN” or annotations like `@PreAuthorize("hasRole('ADMIN')")` decide access.
* If identity is known but lacks permission, the server responds **403 Forbidden**.

**How they fit together (simple flow)**

1. Request arrives → security filters try to **authenticate** (establish identity).
2. If authenticated, the system **authorizes** (compare user’s roles/authorities to the rule for that action).
3. Only then does the controller or method run.

**Mental model (analogy)**

* Authentication = showing your ID card at the gate.
* Authorization = checking if your ID gives you access to a specific room.

**Common ways to authenticate**

* Basic/Form login with session (stateful).
* Bearer tokens/JWT (stateless).
* OAuth2/OIDC (Google/GitHub/Facebook sign-in).

**Roles vs Authorities vs Scopes**

* **Role**: broad label (e.g., `ROLE_USER`, `ROLE_ADMIN`).
* **Authority/Scope**: finer-grained permission (e.g., `order:read`, `SCOPE_profile`).
* Systems often map roles → a set of authorities.

**Error signals to teach clearly**

* **401** = not authenticated or bad credentials/token.
* **403** = authenticated but not allowed by the rule.
# Authentication vs Authorization — Comparison

| Aspect                 | Authentication                                                                                      | Authorization                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Core question          | **Who are you?**                                                                                    | **Are you allowed to do this?**                                                                                |
| Purpose                | Prove identity                                                                                      | Enforce permissions on actions/resources                                                                       |
| When it runs           | **First** on every protected request                                                                | **After** authentication succeeds                                                                              |
| Input checked          | Credentials (username/password, OTP, API key, JWT, OAuth2 token, cert)                              | Roles/authorities/scopes of the authenticated user + access rules                                              |
| Output                 | An authenticated **identity** (`Authentication` in `SecurityContext`)                               | **Allow or deny** access to the target URL/method/resource                                                     |
| Spring Security pieces | Filters, `AuthenticationManager`, `AuthenticationProvider`, `UserDetailsService`, `PasswordEncoder` | URL rules (`authorizeHttpRequests`), method rules (`@PreAuthorize`, `@PostAuthorize`), voters/decision manager |
| Data source            | In-memory, DB (JDBC), LDAP, OAuth2/OIDC, SSO                                                        | Configured rules, annotations, expressions, policies (RBAC/ABAC)                                               |
| Typical failure        | **401 Unauthorized** (not logged in / bad token)                                                    | **403 Forbidden** (logged in but lacks permission)                                                             |
| Scope of effect        | Establishes **who** the caller is                                                                   | Limits **what** the caller can do                                                                              |
| Examples               | Basic/Form login, JWT bearer token, Google/GitHub login                                             | `hasRole('ADMIN')`, `hasAuthority('orders:read')`, “/admin/**” only for admins                                 |
| Storage/context        | Sets `SecurityContextHolder` with `Authentication`                                                  | Reads roles/authorities from the same context to decide                                                        |
| Analogy                | Showing your ID at the gate                                                                         | Checking if your ID grants access to a specific room                                                           |

# Spring Security Basics
## **Security Filters & DelegatingFilterProxy**

Spring Security works through a **chain of filters**. Each filter performs one security step such as reading credentials, checking tokens, or loading the logged-in user.

### Security Filter Chain

A structured list of filters that:

* Run **before** the controller
* Validate login credentials
* Process tokens (JWT, Basic Auth, etc.)
* Apply CSRF, CORS, and session rules

### DelegatingFilterProxy

A special bridge used by Spring Security.

#### What it does

* Connects the servlet container (Tomcat) with Spring Security’s internal filter chain
* Delegates all incoming requests to the **SecurityFilterChain** bean
* Ensures Spring Security processes the request **before your controller**

## **In-Memory Authentication**

In-memory authentication stores user details **directly in the application code** instead of a database.

### When to Use

* Beginner learning
* Demos
* Small examples
* No database required

### How It Works

* You define one or more users in Java configuration
* Each user has:

  * username
  * encoded password
  * roles (like ROLE_USER, ROLE_ADMIN)
* Spring Security authenticates users by checking credentials against these in-memory values

# **JDBC Authentication**

JDBC authentication uses a **database** to store users and roles.
This is the most common approach for production-ready applications.

### How It Works

* Usernames, encrypted passwords, and roles are stored in database tables
* Spring Security executes SQL queries to:

  * Retrieve the user
  * Validate password
  * Load assigned roles
* If password matches → user is authenticated
* Loaded roles decide authorization (what the user can access)

### Why Use JDBC Authentication

* Suitable for real apps
* Can manage many users
* Works with MySQL, PostgreSQL, SQL Server, Oracle, etc.
* Integrates easily with Spring Data/JPA queries

# **Password Encoding (BCrypt)**

Storing passwords in plain text is unsafe.
Spring Security uses **PasswordEncoder** to protect passwords through **hashing**, not encryption.

### Why BCrypt?

* BCrypt is a **strong one-way hashing algorithm**
* Passwords cannot be reversed or decrypted
* Adds a **random salt** each time → even same passwords look different
* Resistant to brute force and rainbow-table attacks
* Spring Security supports it natively

### How BCrypt Works

1. User enters a password (e.g., “12345”)
2. BCrypt hashes it into an unreadable format
3. Only the hashed value is stored in the database
4. During login, Spring:

   * Hashes the entered password
   * Compares hash with stored hash

If hashes match → authentication succeeds.

### Why It Matters

* Even if the database is leaked, passwords remain protected
* Essential for real-world applications
* Required for both in-memory and JDBC authentication setups

# **Role-Based Access Control (RBAC)**

Role-Based Access Control defines **what actions a user is allowed to perform** based on their assigned role.

### What Is a Role?

A role is a **permission group** such as:

* `ROLE_USER`
* `ROLE_ADMIN`
* `ROLE_MANAGER`

Roles decide **what parts of the application** a user can access.

### How RBAC Works in Spring Security

Spring checks the user’s roles during authorization:

1. User logs in
2. User's roles are loaded (from memory or database)
3. Authorization rules verify if the user can access the requested resource
4. Access is allowed only if the role matches the rule

### RBAC at URL Level

You can restrict access to specific routes like:

* `/admin/**` → Only `ROLE_ADMIN`
* `/user/**` → `ROLE_USER` or `ROLE_ADMIN`

### RBAC at Method Level

You can secure individual functions or services using annotations like:

* `@PreAuthorize("hasRole('ADMIN')")`
* `@PreAuthorize("hasAuthority('orders:read')")`

### Why RBAC Is Important

* Provides structured, organized access management
* Easy to maintain
* Ensures users only access what they are allowed to
* Widely used in enterprise applications (Admin dashboards, multi-user apps, etc.)

# **JWT (JSON Web Token) Authentication**

JWT (JSON Web Token) is a **stateless authentication mechanism** used to secure REST APIs.
Instead of using sessions on the server, JWT stores user identity and authorization data in a **digitally signed token**.

### Why JWT?

* No server-side session or cookie needed
* Works perfectly for distributed systems (mobile apps, microservices)
* Fast and lightweight
* Client sends token on every request

### Structure of a JWT
A JWT has **three parts** separated by dots:

```
header.payload.signature
```
### 1. Header
Contains metadata (e.g., hashing algorithm):

```
{ "alg": "HS256", "typ": "JWT" }
```
### 2. Payload
Contains user information (claims):

```
{ "sub": "john", "role": "ADMIN", "exp": 1735689600 }
```
### 3. Signature
Ensures the token has not been tampered with.

Token example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
# **Token Generation**

Token generation happens right after **successful authentication** (username/password valid).

### Steps in Token Generation

1. User logs in with username & password
2. Server verifies the user
3. Server creates a payload with:

   * username
   * roles
   * expiration time
4. Server signs the payload with a secret key
5. A JWT token is returned to the client

### What the client does with the token
* Saves it in local storage / session storage / mobile storage
* Sends it as a **Bearer Token** on every request:

```
Authorization: Bearer <jwt-token>
```
### Why expiry matters?

Tokens contain an **exp (expiration time)**.
Once expired → token becomes invalid for use.   

# **Token Validation**

Every protected API call must validate the token.

### Steps in Token Validation

1. Client sends the token in Authorization header
2. Server checks:

   * Is the token present?
   * Is the signature valid?
   * Has it expired?
   * Is the user still valid?
3. If all checks pass → user identity is extracted
4. User details (username, roles) are placed into **SecurityContext**
5. Request reaches controller

### Invalid token scenarios

* Expired → reject
* Modified → signature mismatch → reject
* Wrong secret key → reject
* Missing → 401 Unauthorized

This makes JWT highly secure for stateless APIs.

# **Securing REST APIs with JWT**
JWT is used to secure REST APIs in a **stateless** way.
### How It Works (Full Flow)

#### **1. Authenticate**
User logs in → server returns JWT token.

#### **2. Use Token**
Client sends token with every request:
```
Authorization: Bearer <token>
```

#### **3. Filter Validates Token**
A JWT authentication filter:

* Extracts token
* Validates it
* Loads username & roles
* Sets authentication in SecurityContext

#### **4. Authorization**
Spring Security checks:

* Does the user have required roles/permissions?

#### **5. Controller Runs**

Only if token is valid **and** authorized.

## What JWT Secures

* Endpoints like:

```
/api/users
/api/admin
/api/orders
/api/transactions
```

### Example Rules

* `/admin/**` → ROLE_ADMIN only
* `/user/**` → authenticated users
* `/public/**` → no token required
---

## Why JWT is preferred in REST APIs

* No need for server sessions
* Works across multiple services
* Easy to validate
* Scalable
* Ideal for SPA (React, Angular), Flutter, Mobile Apps

# **OAuth2 & Social Login**

Imagine you are building a website or mobile app. Instead of forcing users to create a new username/password, OAuth2 allows them to log in using accounts they already have—like Google, GitHub, or Facebook.

This makes your app:

* easier to use,
* more secure, and
* faster to onboard new users.

**How it works in simple words:**
Your app *does not* check the user’s password.
Instead, it sends the user to a trusted company (Google, GitHub, Facebook).
That company verifies the user’s identity and then sends your app the user’s basic profile information (like email and name) so you can log them in.

## **Google / GitHub / Facebook Login**

These platforms act as **identity providers**—meaning they confirm the user’s identity for your application.

### **Simple Login Flow (Think of it like visiting a security desk):**

1. **User clicks “Login with Google/GitHub/Facebook.”**
   This is like saying, “I want this company to vouch for who I am.”

2. **User is redirected to the provider’s login page.**
   They enter their password *on Google/GitHub/Facebook’s website*, not your app.

3. **Provider verifies the user.**
   The provider checks their credentials safely.

4. **Provider sends user info back to your application.**
   This usually includes:

   * name
   * email
   * profile picture
   * unique user ID

5. **Your application logs the user in automatically.**

### **When each provider is used:**

* **Google →** Best for general users; almost everyone has a Google account.
* **GitHub →** Common in developer platforms and coding tools.
* **Facebook →** Used in social apps, communities, and consumer platforms.

## **Authorization Server vs Resource Server**

In OAuth2, two major components handle security.
Think of it like a school:

* One office checks your identity (Authorization Server)
* Another office gives access to certain classrooms (Resource Server)

### **Authorization Server — “Who are you?”**

The Authorization Server is responsible for:

* Logging the user in
* Verifying their identity
* Issuing tokens (like a digital ID card)

Examples of Authorization Servers:
Google, GitHub, Facebook, Auth0, Keycloak

### **Resource Server — “What are you allowed to access?”**

The Resource Server is usually **your backend API**.
It does not handle login. Instead, it:

* Receives the token from the user
* Checks if it is valid
* Allows or blocks access to protected endpoints

### **Simple Understanding:**

| Server                   | Meaning                                 |
| ------------------------ | --------------------------------------- |
| **Authorization Server** | Login + Authentication + Token issuing  |
| **Resource Server**      | Validates the token + Protects the APIs |


# **Method-Level Security**

Method-level security allows you to protect individual methods in your services or controllers.
Instead of securing whole URLs, you secure **specific functions** inside your application.

This means you can define **who is allowed to run a method** based on roles or permissions.

### Why it is used

* More precise control than URL-level security
* Protects business logic directly
* Keeps sensitive operations safe (delete, update, admin actions)

Think of it like putting a lock on specific rooms inside a house—not just the main gate.

## **@PreAuthorize**

`@PreAuthorize` checks permissions **before the method executes**.
If the user does not have the required role or authority, the method will never run.

### Simple explanation:

This annotation asks:
“Does the user have permission to run this method?”
If **no**, access is denied immediately.

### Examples of common usage:

* Allow only admins:

  ```java
  @PreAuthorize("hasRole('ADMIN')")
  ```
* Allow users with specific authority:

  ```java
  @PreAuthorize("hasAuthority('product:write')")
  ```

## **@PostAuthorize**

`@PostAuthorize` checks security **after the method executes**.

### Why check *after*?

Because sometimes the decision depends on the method’s return value.

For example:  
A user may only access a record **if the record they are returning belongs to them**.

### Example usage:

```java
@PostAuthorize("returnObject.owner == authentication.name")
```



##### [Back To Contents](../../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|