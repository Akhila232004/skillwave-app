# Rendering & Data Fetching

## Server vs Client Components
- Server default; add `"use client"` at top to opt-in to client.

## fetch() on server with caching
```tsx
export default async function Products() {
  const res = await fetch("https://api.example.com/products", { next: { revalidate: 60 } });
  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```
**Expected result:** ISR every 60s; fast static between revalidations.

## Streaming & Suspense
```tsx
// app/page.tsx
import { Suspense } from "react";
import Slow from "./slow";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {/* @ts-expect-error Async Server Component */}
      <Slow />
    </Suspense>
  );
}
```
**Expected result:** Fallback shows immediately, chunks stream in.

## Loading & Error UIs
- `loading.tsx`, `error.tsx`, `not-found.tsx` in a route segment provide built-in states.
