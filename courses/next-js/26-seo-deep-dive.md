# SEO Deep Dive

- Canonicals, `hreflang`, structured data (JSON-LD).
- Content chunking for indexability.

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata(){ return { alternates:{ canonical:"/blog/x" } }; }
```
**Expected result:** Search bots see correct canonicals and rich results.
