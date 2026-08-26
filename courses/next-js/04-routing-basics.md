# Routing: App Router Fundamentals

## File-based routing
- `app/page.tsx` → `/`
- `app/blog/page.tsx` → `/blog`
- `app/blog/[id]/page.tsx` → dynamic `/blog/123`

## Nested layouts
```tsx
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <section><h1>Blog</h1>{children}</section>;
}
```
**Expected result:** Blog pages share the blog layout automatically.

## Route Groups & Private Folders
- Group UI without affecting URL: `app/(shop)/products/page.tsx`
- Private (no routing): prefix folder with `_` in your editor only; in Next.js, "private folders" are by naming convention and tooling—avoid exporting routes.

## Dynamic & Catch-all
- `[id]`, `[...slug]`, `[[...slug]]`

## Parallel & Intercepted Routes
- Slots: `@modal`, `@sidebar`
- Intercept: `(.)`, `(..)`, `(..)(..)` to render from another segment
```tsx
// app/@modal/(..)photos/[id]/page.tsx
```
**Expected result:** Advanced dashboards and modals without losing URL context.
