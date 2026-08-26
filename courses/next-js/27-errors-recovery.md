# Error Handling & Recovery

- Segment `error.tsx` and `not-found.tsx` for graceful failures.
- Retry and toast UX for client actions.

```tsx
// app/error.tsx
"use client";
export default function Error({ error, reset }:{ error:Error; reset:()=>void }){
  return <div><p>Something went wrong.</p><button onClick={reset}>Retry</button></div>;
}
```
**Expected result:** Users can recover without full refresh.
