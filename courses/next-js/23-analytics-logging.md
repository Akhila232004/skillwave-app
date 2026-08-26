# Analytics, Telemetry & Logs

- Web Vitals, RUM via Next.js or Vercel Analytics.
- Sentry for errors and traces.

```ts
// app/layout.tsx
export function reportWebVitals(metric:any){ console.log(metric); }
```
**Expected output:** Metrics logged to console or sent to your collector.
