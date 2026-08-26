# Images, Fonts & Metadata

## `<Image>`
```tsx
import Image from "next/image";
export default function Hero(){ 
  return <Image src="/hero.jpg" alt="Hero" width={1200} height={630} priority />;
}
```
**Expected result:** Optimized responsive image with lazy loading (except priority).

## Fonts
```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export default function Layout({children}:{children:React.ReactNode}){
  return <html><body className={inter.className}>{children}</body></html>;
}
```
**Expected result:** No CLS; font loaded with best practices.

## Metadata API
```ts
export const metadata = {
  title: "Home",
  openGraph: { title: "Home OG", images: ["/og.png"] }
};
```
**Expected result:** Proper tags in head; OG when shared.
