# Security & Hardening

- Avoid `dangerouslySetInnerHTML` unless sanitized.
- Use secure cookies, HttpOnly, SameSite.
- CSRF tokens on mutating endpoints if not using same-site cookies.

```ts
export const config = { runtime: "nodejs" }; // for libraries requiring Node APIs
```
**Expected result:** Reduced attack surface and safe defaults.
