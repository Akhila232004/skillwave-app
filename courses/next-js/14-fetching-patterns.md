# External APIs & Fetching Patterns

- Prefer server `fetch()` with caching or `revalidate`.
- For client-side reactivity: SWR or React Query.

```tsx
"use client";
import useSWR from "swr";
const fetcher = (url:string)=>fetch(url).then(r=>r.json());
export default function ClientList(){
  const { data } = useSWR("/api/items", fetcher);
  return <pre>{JSON.stringify(data,null,2)}</pre>;
}
```
**Expected output:** Client updates as data changes; cache & revalidation handled.
