# Layouts & UI Composition

## Root & Nested Layouts
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>;
}
```
**Expected result:** HTML shell wraps all routes.

## Templates vs Layouts
- **Layout** persists between navigations.
- **Template** re-renders on navigation.

## Modals with intercepted routes
Intercept a detail page and render it as a modal over a list without losing the list state.
