# Real-Time & Streaming

- SSE or WebSockets (`ws`, Socket.IO) on Node runtime routes.
- Combine with RSC streaming for partial UI updates.

```ts
// app/api/stream/route.ts (SSE)
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode("data: hello\n\n"));
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
}
```
**Expected output:** Client receives `"hello"` over an SSE connection.
