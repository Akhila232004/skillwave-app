# Common Snippets

## JSON-LD SEO
```tsx
export function JsonLd({data}:{data:any}){
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />;
}
```
**Expected result:** Structured data embedded safely.
