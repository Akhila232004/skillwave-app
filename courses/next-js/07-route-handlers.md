# Route Handlers (API)

Create API endpoints with `app/api/*/route.ts`.

```ts
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello API" });
}
```
**Expected output:** `GET /api/hello` returns `{"message":"Hello API"}`.

### Edge vs Node
Export `runtime = "edge"` for Edge; default Node.js for server actions/db-heavy.
