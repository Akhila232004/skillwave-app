# Performance & Caching

- Prefer server components to cut JS.
- Tune `revalidate` per route.
- Optimize images/fonts; avoid large client libs.

```ts
export const revalidate = 60; // segment-level
```
**Expected result:** Stable performance with periodic freshness.
