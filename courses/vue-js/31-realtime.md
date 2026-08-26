# Real-Time Apps

Use WebSockets or SSE; keep stores in sync and apply optimistic UI.

```ts
const ws = new WebSocket('wss://example.com')
ws.onmessage = (e)=> console.log('msg', e.data)
```
**Expected output:** Server-sent messages update UI instantly; retries/backoff handle disconnects.
