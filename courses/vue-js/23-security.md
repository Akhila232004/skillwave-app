# Security & Hardening

Vue auto-escapes interpolations; be careful with `v-html`. Handle JWT/CSRF and keep secrets out of the client.

```html
<div v-html="sanitizedHtml"></div>
```
**Expected output:** Only sanitized HTML is injected; avoid user-supplied raw HTML.
