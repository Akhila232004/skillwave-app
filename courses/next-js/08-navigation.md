# Navigation & Links

## Client navigation
```tsx
import Link from "next/link";

export default function Nav() {
  return <Link href="/about" prefetch>About</Link>;
}
```
**Expected result:** Prefetch improves page-to-page speed.

## Router hooks
```tsx
"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") || "";
  return <button onClick={()=>router.push(`/search?q=${q}`)}>Go</button>;
}
```
**Expected result:** URL updates without full reload.
