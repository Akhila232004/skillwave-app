# Introduction

Welcome! This tutorial is focused on **Next.js App Router** and **React Server Components (RSC)** for building production apps.

## What is Next.js?
Next.js is a React framework providing routing, rendering (SSG/SSR/ISR), data fetching, and first-class developer experience.

- **SPA**: All client-side; great interactivity, limited SEO without SSR.
- **SSR**: Render on the server per request for dynamic data + SEO.
- **SSG**: Pre-render at build-time for speed and stability.
- **ISR**: Rebuild pages in the background after a TTL (`revalidate`), combining SSG speed with fresh data.

## App Router vs Pages Router
- **App Router (`app/`)**: RSC by default, nested layouts, streaming, server actions.
- **Pages Router (`pages/`)**: Classic Next.js; stable but lacks newest capabilities.
- Use **App Router** for new builds; use **Pages** only for legacy projects or stepwise migrations.

## React Server Components (RSC)
- Render on the server, ship **less JS** to the client.
- Access secrets and databases directly in components (server-only).
- Combine with Client Components (`'use client'`) where interactivity is needed.

### Example: Server Component fetching data
```tsx
// app/page.tsx
export default async function Home() {
  const res = await fetch("https://api.example.com/posts", { cache: "no-store" });
  const posts = await res.json();
  return (
    <main>
      <h1>Recent Posts</h1>
      <ul>{posts.map((p:any) => <li key={p.id}>{p.title}</li>)}</ul>
    </main>
  );
}
```
**Expected result:** Page renders latest posts on each request; no client bundle for this component.

## Typical Project Types
- Marketing & docs (MDX + ISR)
- Dashboards (Auth + DB + RSC)
- E‑commerce (SSG + ISR + Edge)
- SaaS apps (server actions + DB + queues)
