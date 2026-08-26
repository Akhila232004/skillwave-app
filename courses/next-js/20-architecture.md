# Architecture & Patterns

- Domain/feature folders under `app/` + `components/` + `lib/`.
- Provider pattern for theme/auth/toast in `app/providers.tsx`.
- Error boundaries per route segment.

```tsx
// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";
export function Providers({ children }:{children:React.ReactNode}){
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
```
**Expected result:** Global providers available to client components.
