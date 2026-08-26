# Middleware & Edge Runtime

## middleware.ts
```ts
// middleware.ts
import { NextResponse } from "next/server";
export function middleware(req: Request) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/admin")) {
    // if (!isAuthed) return NextResponse.redirect(new URL("/login", url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
```
**Expected result:** Requests to `/admin/*` pass through the middleware for checks.

## Edge runtime
- Lower latency; limited Node APIs.
