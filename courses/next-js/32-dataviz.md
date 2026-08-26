# Charts, Tables & Maps

- Recharts/Chart.js on the client only.
- TanStack Table for large lists (virtualization as needed).
- Leaflet/Mapbox with SSR safeguards.

```tsx
"use client";
import { LineChart, Line } from "recharts";
export default function Chart(){ 
  const data=[{x:1,y:2},{x:2,y:3}];
  return <LineChart width={300} height={200} data={data}><Line dataKey="y" /></LineChart>;
}
```
**Expected result:** Client-only chart renders without SSR issues.
